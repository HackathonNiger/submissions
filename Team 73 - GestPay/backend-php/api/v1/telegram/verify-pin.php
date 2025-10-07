<?php
header("Content-Type: application/json");
require_once '../../../config/config.php';
//set timezone
date_default_timezone_set('Africa/Lagos');
// Validate request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$token = $data['token'] ?? null;
$pin = $data['pin'] ?? null;

if (!$token || !$pin) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Token and PIN are required"]);
    exit;
}

try {
    // Start transaction
    $conn->begin_transaction();
    
    // Get webapp token details with transaction and user info
    $stmt = $conn->prepare("
        SELECT wt.*, t.amount, t.reference, t.description, u.pin, u.balance, u.telegram_chat_id
        FROM webapp_tokens wt
        JOIN transactions t ON wt.tx_id = t.id
        JOIN users u ON wt.user_id = u.id
        WHERE wt.token = ? AND wt.used = 0 
    ");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();
    $token_data = $result->fetch_assoc();
    
    if (!$token_data) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Invalid or expired token"]);
        $conn->rollback();
        exit;
    }
    
    // Verify PIN
    if (!$token_data['pin'] || !password_verify($pin, $token_data['pin'])) {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Invalid PIN"]);
        $conn->rollback();
        exit;
    }
    
    // Check balance
    if ($token_data['balance'] < $token_data['amount']) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Insufficient balance"]);
        $conn->rollback();
        exit;
    }
    
    // Extract recipient ID from description or find by name
    $recipient_id = null;
    if (preg_match('/Transfer to (.+?) via/', $token_data['description'], $matches)) {
        $recipient_name = $matches[1];
        $names = explode(' ', $recipient_name, 2);
        $first_name = $names[0];
        $last_name = $names[1] ?? '';
        
        $recipient_stmt = $conn->prepare("SELECT id FROM users WHERE first_name = ? AND last_name = ?");
        $recipient_stmt->bind_param("ss", $first_name, $last_name);
        $recipient_stmt->execute();
        $recipient_result = $recipient_stmt->get_result();
        $recipient = $recipient_result->fetch_assoc();
        $recipient_id = $recipient['id'] ?? null;
    }
    
    if (!$recipient_id) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Recipient not found"]);
        $conn->rollback();
        exit;
    }
    
    // Process the transfer
    
    // 1. Debit sender
    $debit_stmt = $conn->prepare("UPDATE users SET balance = balance - ? WHERE id = ?");
    $debit_stmt->bind_param("di", $token_data['amount'], $token_data['user_id']);
    $debit_stmt->execute();
    
    // 2. Credit recipient
    $credit_stmt = $conn->prepare("UPDATE users SET balance = balance + ? WHERE id = ?");
    $credit_stmt->bind_param("di", $token_data['amount'], $recipient_id);
    $credit_stmt->execute();
    
    // 3. Update transaction status
    $update_txn_stmt = $conn->prepare("UPDATE transactions SET status = 'successful' WHERE id = ?");
    $update_txn_stmt->bind_param("i", $token_data['tx_id']);
    $update_txn_stmt->execute();
    
    // 4. Create credit transaction for recipient
    $credit_ref = 'TXN' . strtoupper(uniqid());
    $credit_desc = "Transfer received via Telegram from user";
    $credit_txn_stmt = $conn->prepare("INSERT INTO transactions (user_id, reference, amount, feature, type, status, description) VALUES (?, ?, ?, 'telegram-pay', 'credit', 'successful', ?)");
    $credit_txn_stmt->bind_param("isds", $recipient_id, $credit_ref, $token_data['amount'], $credit_desc);
    $credit_txn_stmt->execute();
    
    // Get the credit transaction ID
    $credit_txn_id = $conn->insert_id;
    
    // 5. Mark webapp token as used
    $mark_used_stmt = $conn->prepare("UPDATE webapp_tokens SET used = 1 WHERE id = ?");
    $mark_used_stmt->bind_param("i", $token_data['id']);
    $mark_used_stmt->execute();
    
    // 6. Create notifications
    $notification_stmt = $conn->prepare("INSERT INTO notifications (user_id, content, type, transaction_id) VALUES (?, ?, 'wallet', ?)");
    
    // Sender notification
    $sender_msg = "Transfer of ₦" . number_format($token_data['amount'], 2) . " completed successfully via Telegram";
    $notification_stmt->bind_param("isi", $token_data['user_id'], $sender_msg, $token_data['tx_id']);
    $notification_stmt->execute();
    
    // Recipient notification
    $recipient_msg = "You received ₦" . number_format($token_data['amount'], 2) . " via Telegram";
    $notification_stmt->bind_param("isi", $recipient_id, $recipient_msg, $credit_txn_id);
    $notification_stmt->execute();
    
    $conn->commit();
    
    // Send success message to Telegram chat
    if ($token_data['telegram_chat_id']) {
        sendTelegramMessage($token_data['telegram_chat_id'], $token_data['amount'], $token_data['reference'], $conn);
    }
    
    echo json_encode([
        "success" => true,
        "message" => "Payment completed successfully",
        "data" => [
            "reference" => $token_data['reference'],
            "amount" => number_format($token_data['amount'], 2)
        ]
    ]);
    
} catch (Exception $e) {
    $conn->rollback();
    error_log("PIN Verification Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Transaction failed. Please try again."]);
}

function sendTelegramMessage($chat_id, $amount, $reference, $conn) {
    // Get bot config
    $config_stmt = $conn->prepare("SELECT bot_token FROM telegram_bot_config WHERE is_active = 1 LIMIT 1");
    $config_stmt->execute();
    $config = $config_stmt->get_result()->fetch_assoc();
    
    if ($config) {
        $amount_formatted = number_format($amount, 2);
        $message = "✅ <b>Transfer Completed!</b>\n\n" .
                  "💰 Amount: ₦{$amount_formatted}\n" .
                  "🔗 Reference: {$reference}\n" .
                  "⏰ " . date('M j, Y \a\\t g:i A') . "\n\n" .
                  "Your transfer has been processed successfully! 🎉";
        
        $url = "https://api.telegram.org/bot{$config['bot_token']}/sendMessage";
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
            'chat_id' => $chat_id,
            'text' => $message,
            'parse_mode' => 'HTML'
        ]));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_exec($ch);
        curl_close($ch);
    }
}
