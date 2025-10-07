<?php
header("Content-Type: application/json");
require_once '../../../config/config.php';
require_once '../../../config/face_config.php';

// Validate request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

// Required fields
$amount = $data['amount'] ?? null;
$description = $data['description'] ?? 'Face-pay transaction';
$media = $data['media'] ?? null;
$location = $data['location'] ?? null;
$merchant_id = $data['merchant_id'] ?? null;

// Validate required fields
if (!$amount || !$media) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Amount and face image are required"]);
    exit;
}

// Validate amount
if (!is_numeric($amount) || $amount <= 0) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid amount"]);
    exit;
}

try {
    // Extract face image from media
    $face_image_data = null;
    if (is_array($media)) {
        $face_image_data = $media['1'] ?? $media['face_image'] ?? $media[0] ?? null;
    } else {
        $face_image_data = $media;
    }
    
    if (!$face_image_data) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Face image required in media field"]);
        exit;
    }

    // Get all stored face embeddings for verification
    $stored_embeddings = getAllFaceEmbeddings($conn);
    
    if (empty($stored_embeddings)) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "No users with face recognition enabled found"
        ]);
        exit;
    }
    
    // Call Python FastAPI to verify face
    $face_api_request = [
        'image_base64' => $face_image_data,
        'stored_embeddings' => $stored_embeddings,
        'confidence_threshold' => $FACE_API_CONFIG['confidence_threshold']
    ];
    
    $face_api_response = callFaceAPI('/verify-face', $face_api_request);
    
    if (!$face_api_response['match']) {
        // Log failed verification attempt
        logFaceActivity(null, 'payment', 'failed', 
            "Face payment verification failed. Confidence: " . ($face_api_response['confidence'] ?? 0), $conn);
        
        http_response_code(401);
        echo json_encode([
            "success" => false,
            "message" => "Face verification failed. " . $face_api_response['message'],
            "confidence" => $face_api_response['confidence'] ?? 0
        ]);
        exit;
    }
    
    $verified_user_id = $face_api_response['user_id'];
    $confidence = $face_api_response['confidence'];
    
    // Get user details
    $user_stmt = $conn->prepare("
        SELECT id, first_name, last_name, balance, allow_face_payments, 
               has_setup_biometric, confirm_payment
        FROM users 
        WHERE id = ? AND allow_face_payments = 1 AND has_setup_biometric = 1
    ");
    $user_stmt->bind_param("i", $verified_user_id);
    $user_stmt->execute();
    $user_result = $user_stmt->get_result();
    $user = $user_result->fetch_assoc();
    
    if (!$user) {
        logFaceActivity($verified_user_id, 'payment', 'failed', 'User not found or face payments disabled', $conn);
        
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "User not found or face payments not enabled"
        ]);
        exit;
    }

    // Check if user has sufficient balance
    if ($user['balance'] < $amount) {
        logFaceActivity($verified_user_id, 'payment', 'failed', 
            "Insufficient balance. Required: $amount, Available: " . $user['balance'], $conn);
        
        http_response_code(400);
        echo json_encode([
            "success" => false, 
            "message" => "Insufficient balance",
            "data" => [
                "required_amount" => $amount,
                "available_balance" => $user['balance']
            ]
        ]);
        exit;
    }

    // Generate transaction reference
    $reference = 'FP' . strtoupper(uniqid());
    $transaction_id = 'TXN' . strtoupper(uniqid());

    // Check if user requires confirmation for payments
    if ($user['confirm_payment'] == 1) {
        // Store pending transaction for confirmation
        $stmt = $conn->prepare("INSERT INTO transactions (user_id, reference, amount, feature, type, status, description, merchant_id, location_data) VALUES (?, ?, ?, 'face-pay', 'debit', 'pending', ?, ?, ?)");
        $location_json = $location ? json_encode($location) : null;
        $stmt->bind_param("isdsss", $verified_user_id, $transaction_id, $amount, $description, $merchant_id, $location_json);
        $stmt->execute();

        logFaceActivity($verified_user_id, 'payment', 'pending', 
            "Face payment pending confirmation: ₦$amount (confidence: $confidence)", $conn);

        echo json_encode([
            "success" => true,
            "message" => "Face verified! Please approve the payment on your device",
            "verification_required" => true,
            "reference" => $reference,
            "data" => [
                "user_id" => $verified_user_id,
                "name" => $user['first_name'] . ' ' . $user['last_name'],
                "amount" => $amount,
                "confidence" => $confidence,
                "transaction_id" => $transaction_id
            ]
        ]);
    } else {
        // Process payment immediately
        $conn->begin_transaction();

        try {
            // Debit user account
            $debit_stmt = $conn->prepare("UPDATE users SET balance = balance - ? WHERE id = ?");
            $debit_stmt->bind_param("di", $amount, $verified_user_id);
            $debit_stmt->execute();

            // Credit merchant if provided
            if ($merchant_id) {
                $credit_stmt = $conn->prepare("UPDATE merchants SET balance = balance + ? WHERE id = ?");
                $credit_stmt->bind_param("di", $amount, $merchant_id);
                $credit_stmt->execute();
            }

            // Record transaction
            $txn_stmt = $conn->prepare("INSERT INTO transactions (user_id, reference, amount, feature, type, status, description, merchant_id, location_data) VALUES (?, ?, ?, 'face-pay', 'debit', 'successful', ?, ?, ?)");
            $location_json = $location ? json_encode($location) : null;
            $txn_stmt->bind_param("isdsss", $verified_user_id, $transaction_id, $amount, $description, $merchant_id, $location_json);
            $txn_stmt->execute();

            // Update last face verification
            $update_stmt = $conn->prepare("UPDATE users SET last_face_verification = NOW() WHERE id = ?");
            $update_stmt->bind_param("i", $verified_user_id);
            $update_stmt->execute();

            $conn->commit();

            logFaceActivity($verified_user_id, 'payment', 'success', 
                "Face payment completed: ₦$amount (confidence: $confidence)", $conn);

            // Get updated balance
            $balance_stmt = $conn->prepare("SELECT balance FROM users WHERE id = ?");
            $balance_stmt->bind_param("i", $verified_user_id);
            $balance_stmt->execute();
            $new_balance = $balance_stmt->get_result()->fetch_assoc()['balance'];

            echo json_encode([
                "success" => true,
                "message" => "Face payment successful",
                "reference" => $reference,
                "data" => [
                    "user_id" => $verified_user_id,
                    "name" => $user['first_name'] . ' ' . $user['last_name'],
                    "amount" => number_format($amount, 2),
                    "description" => $description,
                    "transaction_id" => $transaction_id,
                    "confidence" => $confidence,
                    "new_balance" => $new_balance,
                    "timestamp" => date('c'),
                    "status" => "successful"
                ]
            ]);

        } catch (Exception $e) {
            $conn->rollback();
            throw $e;
        }
    }

} catch (Exception $e) {
    if (isset($conn)) {
        $conn->rollback();
    }
    
    error_log("Face payment error: " . $e->getMessage());
    if (isset($verified_user_id)) {
        logFaceActivity($verified_user_id, 'payment', 'error', $e->getMessage(), $conn);
    }
    
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Payment failed: " . $e->getMessage()]);
}
