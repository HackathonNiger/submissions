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

try {
    $input_data = json_decode(file_get_contents("php://input"), true);
    
    if (!$input_data) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Invalid JSON data"]);
        exit;
    }
    
    // Required fields
    $user_id = $input_data['user_id'] ?? null;
    $amount = $input_data['amount'] ?? null;
    $merchant_id = $input_data['merchant_id'] ?? null;
    $description = $input_data['description'] ?? 'Face payment';
    $location = $input_data['location'] ?? null;
    
    // Validate required fields
    if (!$user_id || !$amount) {
        http_response_code(400);
        echo json_encode([
            "success" => false, 
            "message" => "User ID and amount are required"
        ]);
        exit;
    }
    
    if (!is_numeric($amount) || $amount <= 0) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Invalid amount"]);
        exit;
    }
    
    // Verify user exists and has face payments enabled
    $user_stmt = $conn->prepare("
        SELECT id, first_name, last_name, balance, allow_face_payments, 
               has_setup_biometric, confirm_payment
        FROM users 
        WHERE id = ? AND allow_face_payments = 1 AND has_setup_biometric = 1
    ");
    $user_stmt->bind_param("i", $user_id);
    $user_stmt->execute();
    $user_result = $user_stmt->get_result();
    $user = $user_result->fetch_assoc();
    
    if (!$user) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "User not found or face payments not enabled"
        ]);
        exit;
    }
    
    // Check sufficient balance
    if ($user['balance'] < $amount) {
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
    
    // Verify merchant if provided
    $merchant = null;
    if ($merchant_id) {
        $merchant_stmt = $conn->prepare("SELECT * FROM merchants WHERE id = ?");
        $merchant_stmt->bind_param("i", $merchant_id);
        $merchant_stmt->execute();
        $merchant_result = $merchant_stmt->get_result();
        $merchant = $merchant_result->fetch_assoc();
        
        if (!$merchant) {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "Merchant not found"]);
            exit;
        }
    }
    
    // Generate transaction reference and ID
    $reference = 'FP' . strtoupper(uniqid());
    $transaction_id = 'TXN' . strtoupper(uniqid());
    
    // Start database transaction
    $conn->begin_transaction();
    
    try {
        // Debit user account
        $debit_stmt = $conn->prepare("UPDATE users SET balance = balance - ? WHERE id = ?");
        $debit_stmt->bind_param("di", $amount, $user_id);
        
        if (!$debit_stmt->execute()) {
            throw new Exception("Failed to debit user account");
        }
        
        // Check if debit was successful (affected rows should be 1)
        if ($debit_stmt->affected_rows !== 1) {
            throw new Exception("User account debit failed - no rows affected");
        }
        
        // Credit merchant if provided
        if ($merchant_id && $merchant) {
            $credit_stmt = $conn->prepare("UPDATE merchants SET balance = balance + ? WHERE id = ?");
            $credit_stmt->bind_param("di", $amount, $merchant_id);
            $credit_stmt->execute();
        }
        
        // Record transaction
        $txn_stmt = $conn->prepare("
            INSERT INTO transactions 
            (user_id, reference, amount, feature, type, status, description, merchant_id, location_data) 
            VALUES (?, ?, ?, 'face-pay', 'debit', 'successful', ?, ?, ?)
        ");
        
        $location_json = $location ? json_encode($location) : null;
        $txn_stmt->bind_param("isdsss", $user_id, $transaction_id, $amount, $description, $merchant_id, $location_json);
        
        if (!$txn_stmt->execute()) {
            throw new Exception("Failed to record transaction");
        }
        
        $transaction_db_id = $txn_stmt->insert_id;
        
        // Log face payment activity
        logFaceActivity($user_id, 'payment', 'success', 
            "Face payment completed: ₦$amount to " . ($merchant['name'] ?? 'Unknown'), $conn);
        
        // Commit transaction
        $conn->commit();
        
        // Get updated user balance
        $balance_stmt = $conn->prepare("SELECT balance FROM users WHERE id = ?");
        $balance_stmt->bind_param("i", $user_id);
        $balance_stmt->execute();
        $new_balance = $balance_stmt->get_result()->fetch_assoc()['balance'];
        
        // Prepare success response
        $response_data = [
            "success" => true,
            "message" => "Face payment completed successfully",
            "data" => [
                "transaction_id" => $transaction_id,
                "reference" => $reference,
                "amount" => $amount,
                "description" => $description,
                "user" => [
                    "id" => $user_id,
                    "name" => $user['first_name'] . ' ' . $user['last_name'],
                    "new_balance" => $new_balance
                ],
                "timestamp" => date('c'),
                "status" => "successful"
            ]
        ];
        
        // Add merchant info if applicable
        if ($merchant) {
            $response_data['data']['merchant'] = [
                "id" => $merchant['id'],
                "name" => $merchant['name'],
                "type" => $merchant['type']
            ];
        }
        
        // Add location if provided
        if ($location) {
            $response_data['data']['location'] = $location;
        }
        
        http_response_code(200);
        echo json_encode($response_data);
        
    } catch (Exception $e) {
        // Rollback transaction
        $conn->rollback();
        throw $e;
    }
    
} catch (Exception $e) {
    // Log error
    error_log("Face payment completion error: " . $e->getMessage());
    
    if (isset($user_id)) {
        logFaceActivity($user_id, 'payment', 'error', $e->getMessage(), $conn);
    }
    
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Payment failed: " . $e->getMessage()
    ]);
}
?>
