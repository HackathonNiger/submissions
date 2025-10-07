<?php
header("Content-Type: application/json");
require_once '../../../config/config.php';
require_once '../../../config/auth.php';

// Authenticate user (user must be logged in to approve their own payments)
$user_id = authenticate($conn);

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
    // Find the pending transaction for this user
    $stmt = $conn->prepare("
        SELECT t.*, u.balance 
        FROM transactions t 
        JOIN users u ON t.user_id = u.id 
        WHERE t.user_id = ? 
        AND t.status = 'pending' 
        AND t.feature IN ('face-pay', 'voice-pay') 
        ORDER BY t.created_at DESC 
        LIMIT 1
    ");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "No pending payment found for this user"]);
        exit;
    }

    $transaction = $result->fetch_assoc();
    $amount = $transaction['amount'];
    $description = $transaction['description'];
    $transaction_id = $transaction['reference'];

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

    // Process the payment approval
    $conn->begin_transaction();

    // Debit user account
    $debit_stmt = $conn->prepare("UPDATE users SET balance = balance - ? WHERE id = ?");
    $debit_stmt->bind_param("di", $amount, $user_id);
    $debit_stmt->execute();

    // Update transaction status to successful
    $update_stmt = $conn->prepare("UPDATE transactions SET status = 'successful', updated_at = NOW() WHERE id = ?");
    $update_stmt->bind_param("i", $transaction['id']);
    $update_stmt->execute();

    // Create a notification for the user
    $notification_stmt = $conn->prepare("INSERT INTO notifications (user_id, content, type, transaction_id) VALUES (?, ?, 'wallet', ?)");
    $notification_content = "Payment of ₦" . number_format($amount, 2) . " approved successfully";
    $notification_stmt->bind_param("isi", $user_id, $notification_content, $transaction['id']);
    $notification_stmt->execute();

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
    echo json_encode(["success" => false, "message" => "Approval failed: " . $e->getMessage()]);
}
