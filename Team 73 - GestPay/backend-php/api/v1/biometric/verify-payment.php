<?php
header("Content-Type: application/json");
require_once '../../../config/config.php';
require_once '../../../config/auth.php';

// Validate request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

// Required fields
$reference = $data['reference'] ?? null;
$method = $data['method'] ?? null;

// Validate required fields
if (!$reference || !$method) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Reference and method are required"]);
    exit;
}

// Validate method
if (!in_array($method, ['face', 'voice'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Method must be 'face' or 'voice'"]);
    exit;
}

try {
    // Find the pending transaction by reference
    // Note: In a real implementation, you'd store the reference mapping
    // For this demo, we'll find a pending transaction and use the reference provided
    
    $stmt = $conn->prepare("
        SELECT t.*, u.balance, u.allow_face_payments, u.allow_voice_payments 
        FROM transactions t 
        JOIN users u ON t.user_id = u.id 
        WHERE t.status = 'pending' 
        AND t.feature IN ('face-pay', 'voice-pay') 
        ORDER BY t.created_at DESC 
        LIMIT 1
    ");
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "No pending payment found for this reference"]);
        exit;
    }

    $transaction = $result->fetch_assoc();
    $user_id = $transaction['user_id'];
    $amount = $transaction['amount'];
    $description = $transaction['description'];
    $transaction_id = $transaction['reference'];

    // Verify user has the required biometric method enabled
    if ($method === 'face' && !$transaction['allow_face_payments']) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Face payments not enabled for this user"]);
        exit;
    }

    if ($method === 'voice' && !$transaction['allow_voice_payments']) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Voice payments not enabled for this user"]);
        exit;
    }

    // Check if user still has sufficient balance
    if ($transaction['balance'] < $amount) {
        // Update transaction status to failed
        $fail_stmt = $conn->prepare("UPDATE transactions SET status = 'failed' WHERE id = ?");
        $fail_stmt->bind_param("i", $transaction['id']);
        $fail_stmt->execute();

        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Insufficient balance"]);
        exit;
    }

    // Process the payment
    $conn->begin_transaction();

    // Debit user account
    $debit_stmt = $conn->prepare("UPDATE users SET balance = balance - ? WHERE id = ?");
    $debit_stmt->bind_param("di", $amount, $user_id);
    $debit_stmt->execute();

    // Update transaction status to successful
    $update_stmt = $conn->prepare("UPDATE transactions SET status = 'successful', updated_at = NOW() WHERE id = ?");
    $update_stmt->bind_param("i", $transaction['id']);
    $update_stmt->execute();

    $conn->commit();

    echo json_encode([
        "success" => true,
        "message" => "successful",
        "reference" => $reference,
        "data" => [
            "amount" => number_format($amount, 0),
            "description" => $description,
            "transaction_id" => $transaction_id,
            "timestamp" => date('c'),
            "status" => "successful"
        ]
    ]);

} catch (Exception $e) {
    if (isset($conn)) {
        $conn->rollback();
    }
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Verification failed: " . $e->getMessage()]);
}
