<?php
header("Content-Type: application/json");
require_once '../../../config/config.php';
require_once '../../../config/auth.php';

// Authenticate user
$user_id = authenticate($conn);

// Validate request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

// Required fields
$amount = $data['amount'] ?? null;
$payment_type = $data['payment_type'] ?? null;
$description = $data['description'] ?? 'Money transfer';

// Validate required fields
if (!$amount || !$payment_type) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Amount and payment_type are required"]);
    exit;
}

// Validate amount
if (!is_numeric($amount) || $amount <= 0) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid amount"]);
    exit;
}

// Validate payment type
if (!in_array($payment_type, ['internal', 'external'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Payment type must be 'internal' or 'external'"]);
    exit;
}

try {
    // Start transaction
    $conn->begin_transaction();

    // Get user's current balance
    $balance_stmt = $conn->prepare("SELECT balance FROM users WHERE id = ?");
    $balance_stmt->bind_param("i", $user_id);
    $balance_stmt->execute();
    $balance_result = $balance_stmt->get_result();
    $user_data = $balance_result->fetch_assoc();

    if (!$user_data) {
        throw new Exception("User not found");
    }

    if ($user_data['balance'] < $amount) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Insufficient balance"]);
        $conn->rollback();
        exit;
    }

    // Generate transaction reference
    $reference = 'TXN' . strtoupper(uniqid());

    if ($payment_type === 'internal') {
        // Internal transfer - requires phone_number
        $phone_number = $data['phone_number'] ?? null;
        
        if (!$phone_number) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Phone number is required for internal transfers"]);
            $conn->rollback();
            exit;
        }

        // Find recipient user
        $recipient_stmt = $conn->prepare("SELECT id, balance FROM users WHERE phone_number = ?");
        $recipient_stmt->bind_param("s", $phone_number);
        $recipient_stmt->execute();
        $recipient_result = $recipient_stmt->get_result();
        $recipient = $recipient_result->fetch_assoc();

        if (!$recipient) {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "Recipient not found"]);
            $conn->rollback();
            exit;
        }

        if ($recipient['id'] == $user_id) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Cannot transfer to yourself"]);
            $conn->rollback();
            exit;
        }

        // Debit sender
        $debit_stmt = $conn->prepare("UPDATE users SET balance = balance - ? WHERE id = ?");
        $debit_stmt->bind_param("di", $amount, $user_id);
        $debit_stmt->execute();

        // Credit recipient
        $credit_stmt = $conn->prepare("UPDATE users SET balance = balance + ? WHERE id = ?");
        $credit_stmt->bind_param("di", $amount, $recipient['id']);
        $credit_stmt->execute();

        // Record debit transaction for sender
        $debit_txn_stmt = $conn->prepare("INSERT INTO transactions (user_id, reference, amount, feature, type, status, description) VALUES (?, ?, ?, 'transfer', 'debit', 'successful', ?)");
        $debit_txn_stmt->bind_param("isds", $user_id, $reference, $amount, $description);
        $debit_txn_stmt->execute();

        // Record credit transaction for recipient
        $credit_ref = 'TXN' . strtoupper(uniqid());
        $credit_txn_stmt = $conn->prepare("INSERT INTO transactions (user_id, reference, amount, feature, type, status, description) VALUES (?, ?, ?, 'transfer', 'credit', 'successful', ?)");
        $credit_description = "Transfer received from user";
        $credit_txn_stmt->bind_param("isds", $recipient['id'], $credit_ref, $amount, $credit_description);
        $credit_txn_stmt->execute();

    } else {
        // External transfer - requires bank details
        $bank_code = $data['bank_code'] ?? null;
        $bank_account_number = $data['bank_account_number'] ?? null;

        if (!$bank_code || !$bank_account_number) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Bank code and account number are required for external transfers"]);
            $conn->rollback();
            exit;
        }

        // For external transfers, we'll just debit the user and mark as pending
        // In a real implementation, you'd integrate with a payment processor
        
        // Debit sender
        $debit_stmt = $conn->prepare("UPDATE users SET balance = balance - ? WHERE id = ?");
        $debit_stmt->bind_param("di", $amount, $user_id);
        $debit_stmt->execute();

        // Record transaction as pending (would be updated by webhook in real implementation)
        $txn_stmt = $conn->prepare("INSERT INTO transactions (user_id, reference, amount, feature, type, status, description) VALUES (?, ?, ?, 'transfer', 'debit', 'pending', ?)");
        $external_description = $description . " to " . $bank_account_number;
        $txn_stmt->bind_param("isds", $user_id, $reference, $amount, $external_description);
        $txn_stmt->execute();
    }

    // Commit transaction
    $conn->commit();

    echo json_encode([
        "success" => true,
        "message" => "Transfer successful"
    ]);

} catch (Exception $e) {
    $conn->rollback();
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Transfer failed: " . $e->getMessage()]);
}
