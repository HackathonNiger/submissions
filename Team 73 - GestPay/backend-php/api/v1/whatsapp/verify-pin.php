<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../../config/config.php';
// Set timezone
date_default_timezone_set('Africa/Lagos');

// Validate request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

try {
    // Get JSON input
    $input = json_decode(file_get_contents("php://input"), true);
    $token = $input['token'] ?? null;
    $pin = $input['pin'] ?? null;

    // Validate input
    if (!$token || !$pin) {
        http_response_code(400);
        echo json_encode([
            "success" => false, 
            "message" => "Token and PIN are required"
        ]);
        exit;
    }

    // Validate token and get transaction details
    $token_stmt = $conn->prepare("
        SELECT wt.*, t.amount, t.reference, u.pin as user_pin, u.first_name, u.balance
        FROM webapp_tokens wt
        JOIN transactions t ON wt.tx_id = t.id
        JOIN users u ON wt.user_id = u.id
        WHERE wt.token = ? AND wt.used = 0 AND wt.expires_at > NOW()
    ");
    $token_stmt->bind_param("s", $token);
    $token_stmt->execute();
    $token_result = $token_stmt->get_result();
    $token_data = $token_result->fetch_assoc();

    if (!$token_data) {
        http_response_code(400);
        echo json_encode([
            "success" => false, 
            "message" => "Invalid or expired token"
        ]);
        exit;
    }

    // Verify PIN
    if (!password_verify($pin, $token_data['user_pin'])) {
        http_response_code(400);
        echo json_encode([
            "success" => false, 
            "message" => "Invalid PIN"
        ]);
        exit;
    }

    // Check balance again
    if ($token_data['balance'] < $token_data['amount']) {
        http_response_code(400);
        echo json_encode([
            "success" => false, 
            "message" => "Insufficient balance"
        ]);
        exit;
    }

    // Start transaction
    $conn->begin_transaction();

    try {
        // Mark token as used
        $update_token_stmt = $conn->prepare("UPDATE webapp_tokens SET used = 1 WHERE id = ?");
        $update_token_stmt->bind_param("i", $token_data['id']);
        $update_token_stmt->execute();

        // Get recipient details for transfer
        if ($token_data['action_type'] === 'transfer') {
            // Find recipient from transfer record
            $transfer_stmt = $conn->prepare("
                SELECT receiver_id, u.first_name, u.last_name 
                FROM transfers tr
                JOIN users u ON tr.receiver_id = u.id
                WHERE tr.id = (
                    SELECT id FROM transfers 
                    WHERE sender_id = ? 
                    ORDER BY created_at DESC 
                    LIMIT 1
                )
            ");
            $transfer_stmt->bind_param("i", $token_data['user_id']);
            $transfer_stmt->execute();
            $recipient = $transfer_stmt->get_result()->fetch_assoc();

            if (!$recipient) {
                throw new Exception("Recipient not found");
            }

            // Update sender balance
            $update_sender_stmt = $conn->prepare("
                UPDATE users 
                SET balance = balance - ?, total_debit = total_debit + ? 
                WHERE id = ?
            ");
            $update_sender_stmt->bind_param("ddi", $token_data['amount'], $token_data['amount'], $token_data['user_id']);
            $update_sender_stmt->execute();

            // Update recipient balance
            $update_recipient_stmt = $conn->prepare("
                UPDATE users 
                SET balance = balance + ?, total_credit = total_credit + ? 
                WHERE id = ?
            ");
            $update_recipient_stmt->bind_param("ddi", $token_data['amount'], $token_data['amount'], $recipient['receiver_id']);
            $update_recipient_stmt->execute();

            // Update transaction status
            $update_txn_stmt = $conn->prepare("UPDATE transactions SET status = 'successful' WHERE id = ?");
            $update_txn_stmt->bind_param("i", $token_data['tx_id']);
            $update_txn_stmt->execute();

            // Create recipient transaction record
            $recipient_ref = 'TXN' . strtoupper(uniqid());
            $recipient_desc = "Received from {$token_data['first_name']} via WhatsApp";
            
            $recipient_txn_stmt = $conn->prepare("
                INSERT INTO transactions (user_id, reference, amount, feature, type, status, description) 
                VALUES (?, ?, ?, 'whatsapp-pay', 'credit', 'successful', ?)
            ");
            $recipient_txn_stmt->bind_param("isds", $recipient['receiver_id'], $recipient_ref, $token_data['amount'], $recipient_desc);
            $recipient_txn_stmt->execute();

            // Update transfer record
            $update_transfer_stmt = $conn->prepare("UPDATE transfers SET status = 'successful' WHERE sender_id = ? ORDER BY created_at DESC LIMIT 1");
            $update_transfer_stmt->bind_param("i", $token_data['user_id']);
            $update_transfer_stmt->execute();

            // Create notifications
            $sender_notif = "You sent ₦" . number_format($token_data['amount'], 2) . " to {$recipient['first_name']} {$recipient['last_name']} via WhatsApp";
            $recipient_notif = "You received ₦" . number_format($token_data['amount'], 2) . " from {$token_data['first_name']} via WhatsApp";

            $notif_stmt = $conn->prepare("INSERT INTO notifications (user_id, content, type, transaction_id) VALUES (?, ?, 'wallet', ?)");
            $notif_stmt->bind_param("isi", $token_data['user_id'], $sender_notif, $token_data['tx_id']);
            $notif_stmt->execute();

            $recipient_txn_id = $conn->insert_id - 1; // Get the recipient transaction ID
            $notif_stmt->bind_param("isi", $recipient['receiver_id'], $recipient_notif, $recipient_txn_id);
            $notif_stmt->execute();

            // Send WhatsApp confirmation to sender
            sendWhatsAppConfirmation($token_data['chat_id'], $token_data['amount'], $recipient['first_name'] . ' ' . $recipient['last_name'], $token_data['reference']);
        }

        // Commit transaction
        $conn->commit();

        echo json_encode([
            "success" => true,
            "message" => "Payment completed successfully",
            "data" => [
                "reference" => $token_data['reference'],
                "amount" => $token_data['amount'],
                "status" => "successful"
            ]
        ]);

    } catch (Exception $e) {
        $conn->rollback();
        throw $e;
    }

} catch (Exception $e) {
    error_log("WhatsApp PIN verification error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "message" => "Server error occurred while processing payment"
    ]);
}

function sendWhatsAppConfirmation($phone_number, $amount, $recipient_name, $reference) {
    global $conn;
    
    // Get bot config
    $config_stmt = $conn->prepare("SELECT * FROM whatsapp_bot_config WHERE is_active = 1 LIMIT 1");
    $config_stmt->execute();
    $bot_config = $config_stmt->get_result()->fetch_assoc();
    
    if (!$bot_config) return;
    
    $amount_formatted = number_format($amount, 2);
    $message = "✅ *Payment Successful!*\n\n" .
              "💸 *Amount:* ₦{$amount_formatted}\n" .
              "👤 *Recipient:* {$recipient_name}\n" .
              "🔗 *Reference:* {$reference}\n\n" .
              "Your payment has been completed successfully. Thank you for using GestPay! 🎉";
    
    $url = "https://graph.facebook.com/v18.0/{$bot_config['phone_number_id']}/messages";
    
    $data = [
        'messaging_product' => 'whatsapp',
        'to' => $phone_number,
        'type' => 'text',
        'text' => [
            'body' => $message
        ]
    ];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $bot_config['access_token']
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    curl_exec($ch);
    curl_close($ch);
}
?>
