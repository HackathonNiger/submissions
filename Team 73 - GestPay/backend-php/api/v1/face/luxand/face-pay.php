<?php
header("Content-Type: application/json");
require_once '../../../../config/config.php';
require_once '../../../../config/luxand_config.php';
require_once '../../../../config/auth.php';

// Validate request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}
$merchant_id = authenticate($conn);
try {
    // Get form data
    $amount = isset($_POST['amount']) ? floatval($_POST['amount']) : 0;
    $description = isset($_POST['description']) ? trim($_POST['description']) : '';
    $merchant_id = $merchant_id;
    
    // Validate required fields
    if ($amount <= 0) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Valid amount is required"
        ]);
        exit;
    }
    
    if (empty($description)) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Description is required"
        ]);
        exit;
    }
    
    // Handle photo upload
    if (!isset($_FILES['photo']) || $_FILES['photo']['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Photo is required for face verification"
        ]);
        exit;
    }
    
    // Validate image file
    validateLuxandImageFile($_FILES['photo']);
    
    // Step 1: Use Luxand to identify the user from the photo
    $post_fields = [
        'photo' => createLuxandCURLFile($_FILES['photo']['tmp_name'], 'payment_photo.jpg', 'image/jpeg')
    ];
    
    // Try to identify the user by checking against all enrolled persons
    $luxand_persons_stmt = $conn->prepare("
        SELECT user_id, luxand_uuid, name 
        FROM luxand_persons 
        WHERE is_active = 1
    ");
    $luxand_persons_stmt->execute();
    $enrolled_persons = $luxand_persons_stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    
    if (empty($enrolled_persons)) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "No users enrolled in face recognition system"
        ]);
        exit;
    }
    
    $verified_user = null;
    $best_confidence = 0;
    $verification_details = [];
    
    // Check against each enrolled person
    foreach ($enrolled_persons as $person) {
        try {
            $endpoint = '/photo/verify/' . $person['luxand_uuid'];
            $luxand_response = callLuxandAPI($endpoint, $post_fields, 'POST', true);
            
            // Parse verification result based on Luxand API response format
            $confidence = 0;
            $is_match = false;
            
            // Luxand returns: status, message, probability
            if (isset($luxand_response['status'])) {
                $is_match = ($luxand_response['status'] === 'success' && 
                           isset($luxand_response['message']) && 
                           $luxand_response['message'] === 'verified');
                
                // Luxand uses 'probability' field for confidence
                if (isset($luxand_response['probability'])) {
                    $confidence = (float)$luxand_response['probability'];
                }
            }
            
            // Log the verification attempt for debugging
            error_log("Face verification for user {$person['user_id']}: match=$is_match, confidence=$confidence, response=" . json_encode($luxand_response));
            
            $verification_details[] = [
                'user_id' => $person['user_id'],
                'name' => $person['name'],
                'confidence' => $confidence,
                'is_match' => $is_match
            ];
            
            // Keep track of best match
            if ($is_match && $confidence > $best_confidence) {
                $best_confidence = $confidence;
                $verified_user = $person;
            }
            
        } catch (Exception $e) {
            error_log("Face verification error for user {$person['user_id']}: " . $e->getMessage());
            continue;
        }
    }
    
    // Check if we found a verified user
    if (!$verified_user || $best_confidence < 0.6) { // Minimum confidence threshold
        // Log failed verification attempt
        logLuxandActivity(null, 'verify', 'failed', 
            'Face payment verification failed. Best confidence: ' . $best_confidence, $conn);
        
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Face verification failed. User not recognized or confidence too low.",
            "data" => [
                "best_confidence" => $best_confidence,
                "verification_details" => $verification_details
            ]
        ]);
        exit;
    }
    
    $user_id = $verified_user['user_id'];
    
    // Step 2: Get user details and check payment settings
    $user_stmt = $conn->prepare("
        SELECT id, first_name, last_name, balance, allow_face_payments, confirm_payment
        FROM users 
        WHERE id = ?
    ");
    $user_stmt->bind_param("i", $user_id);
    $user_stmt->execute();
    $user = $user_stmt->get_result()->fetch_assoc();
    
    if (!$user) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "User not found"
        ]);
        exit;
    }
    
    // Check if user allows face payments
    if (!$user['allow_face_payments']) {
        logLuxandActivity($user_id, 'verify', 'failed', 
            'Face payments not enabled for user', $conn);
        
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Face payments are not enabled for this user"
        ]);
        exit;
    }
    
    // Check if user has sufficient balance
    if ($user['balance'] < $amount) {
        logLuxandActivity($user_id, 'verify', 'failed', 
            "Insufficient balance for payment. Required: $amount, Available: {$user['balance']}", $conn);
        
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Insufficient balance",
            "data" => [
                "required_amount" => number_format($amount, 2),
                "available_balance" => number_format($user['balance'], 2)
            ]
        ]);
        exit;
    }
    
    // Step 3: Process the payment
    $conn->begin_transaction();
    
    try {
        // Generate transaction reference
        $transaction_ref = 'TXN' . strtoupper(uniqid());
        
        // Create debit transaction
        $transaction_stmt = $conn->prepare("
            INSERT INTO transactions (user_id, reference, amount, feature, type, status, description) 
            VALUES (?, ?, ?, 'face-pay', 'debit', 'successful', ?)
        ");
        $transaction_stmt->bind_param("isds", $user_id, $transaction_ref, $amount, $description);
        $transaction_stmt->execute();
        $transaction_id = $conn->insert_id;
        
        // Update user balance and totals
        $update_balance_stmt = $conn->prepare("
            UPDATE users 
            SET balance = balance - ?, 
                total_debit = total_debit + ?,
                last_face_verification = NOW()
            WHERE id = ?
        ");
        $update_balance_stmt->bind_param("ddi", $amount, $amount, $user_id);
        $update_balance_stmt->execute();
        
        // Create transfer record if merchant is specified
        if ($merchant_id) {
            $transfer_stmt = $conn->prepare("
                INSERT INTO transfers (sender_id, receiver_id, amount, status) 
                VALUES (?, ?, ?, 'successful')
            ");
            $transfer_stmt->bind_param("iid", $user_id, $merchant_id, $amount);
            $transfer_stmt->execute();
        }
        
        // Create notification
        $notification_content = "Face payment of ₦" . number_format($amount, 2) . " completed successfully. Description: " . $description;
        $notification_stmt = $conn->prepare("
            INSERT INTO notifications (user_id, content, type, transaction_id) 
            VALUES (?, ?, 'wallet', ?)
        ");
        $notification_stmt->bind_param("isi", $user_id, $notification_content, $transaction_id);
        $notification_stmt->execute();
        
        // Log successful face payment
        logLuxandActivity($user_id, 'verify', 'success', 
            "Face payment successful. Amount: ₦$amount, Confidence: $best_confidence, Transaction: $transaction_ref", $conn);
        
        $conn->commit();
        
        // Get updated user balance
        $balance_stmt = $conn->prepare("SELECT balance FROM users WHERE id = ?");
        $balance_stmt->bind_param("i", $user_id);
        $balance_stmt->execute();
        $new_balance = $balance_stmt->get_result()->fetch_assoc()['balance'];
        
        // Return success response with receipt
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Face payment completed successfully",
            "data" => [
                "receipt" => [
                    "amount" => "₦" . number_format($amount, 2),
                    "description" => $description,
                    "transaction_id" => $transaction_ref,
                    "time" => date('h:i:s A'),
                    "date" => date('Y-m-d'),
                    "customer" => [
                        "name" => trim($user['first_name'] . ' ' . $user['last_name']),
                        "user_id" => $user_id
                    ],
                    "verification" => [
                        "confidence" => $best_confidence,
                        "luxand_uuid" => $verified_user['luxand_uuid']
                    ],
                    "balance_after" => "₦" . number_format($new_balance, 2)
                ],
                "transaction_details" => [
                    "id" => $transaction_id,
                    "reference" => $transaction_ref,
                    "amount" => $amount,
                    "status" => "successful",
                    "feature" => "face-pay",
                    "created_at" => date('Y-m-d H:i:s')
                ]
            ]
        ]);
        
    } catch (Exception $e) {
        $conn->rollback();
        throw $e;
    }
    
} catch (Exception $e) {
    error_log("Face payment error: " . $e->getMessage());
    
    if (isset($user_id)) {
        logLuxandActivity($user_id, 'verify', 'error', $e->getMessage(), $conn);
    }
    
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Payment processing failed: " . $e->getMessage()
    ]);
}
?>
