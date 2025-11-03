<?php

function handleInternalTransfer($chat_id, $user_id, $parameters, $conn, $bot_config) {
    $amount = $parameters['amount'] ?? null;
    $recipient = $parameters['recipient'] ?? null;
    
    if (!$amount || !$recipient) {
        sendMessage($chat_id, "❌ Please specify both amount and recipient. Example: 'Send ₦500 to John'", $bot_config['bot_token']);
        return;
    }
    
    try {
        // Check sender's balance
        $balance_stmt = $conn->prepare("SELECT balance, first_name, allow_telegram_payments FROM users WHERE id = ?");
        $balance_stmt->bind_param("i", $user_id);
        $balance_stmt->execute();
        $sender = $balance_stmt->get_result()->fetch_assoc();
        
        if (!$sender['allow_telegram_payments']) {
            sendMessage($chat_id, "❌ Telegram payments are disabled for your account. Please enable them in the GestPay app first.", $bot_config['bot_token']);
            return;
        }
        
        if ($sender['balance'] < $amount) {
            $balance = number_format($sender['balance'], 2);
            sendMessage($chat_id, "❌ Insufficient balance. Your current balance is ₦{$balance}", $bot_config['bot_token']);
            return;
        }
        
        // Find recipient by name or phone
        $recipient_stmt = $conn->prepare("
            SELECT id, first_name, last_name, phone_number 
            FROM users 
            WHERE (CONCAT(first_name, ' ', last_name) LIKE ? OR first_name LIKE ? OR phone_number = ?) 
            AND id != ?
            LIMIT 5
        ");
        $search_term = "%{$recipient}%";
        $recipient_stmt->bind_param("sssi", $search_term, $search_term, $recipient, $user_id);
        $recipient_stmt->execute();
        $recipients = $recipient_stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        
        if (empty($recipients)) {
            sendMessage($chat_id, "❌ No user found with name or phone '{$recipient}'. Please check and try again.", $bot_config['bot_token']);
            return;
        }
        
        if (count($recipients) > 1) {
            // Multiple recipients found, show options
            $message = "👥 Multiple users found for '{$recipient}':\n\n";
            $keyboard = ["inline_keyboard" => []];
            
            foreach ($recipients as $index => $rec) {
                $message .= ($index + 1) . ". {$rec['first_name']} {$rec['last_name']} ({$rec['phone_number']})\n";
                $keyboard["inline_keyboard"][] = [[
                    "text" => "{$rec['first_name']} {$rec['last_name']}",
                    "callback_data" => "transfer:{$rec['id']}:{$amount}"
                ]];
            }
            
            $message .= "\nPlease select the correct recipient:";
            
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, "https://api.telegram.org/bot{$bot_config['bot_token']}/sendMessage");
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
                'chat_id' => $chat_id,
                'text' => $message,
                'reply_markup' => $keyboard
            ]));
            curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_exec($ch);
            curl_close($ch);
            
            return;
        }
        
        // Single recipient found, proceed with transfer
        $recipient_user = $recipients[0];
        initiateTransfer($chat_id, $user_id, $recipient_user['id'], $amount, $conn, $bot_config);
        
    } catch (Exception $e) {
        error_log("Internal Transfer Error: " . $e->getMessage());
        sendMessage($chat_id, "❌ An error occurred while processing the transfer.", $bot_config['bot_token']);
    }
}

function handleExternalTransfer($chat_id, $user_id, $parameters, $conn, $bot_config) {
    sendMessage($chat_id, "🏦 External bank transfers are coming soon! For now, you can only send money to other GestPay users.", $bot_config['bot_token']);
}

function initiateTransfer($chat_id, $sender_id, $recipient_id, $amount, $conn, $bot_config) {
    try {
        // Get recipient details
        $recipient_stmt = $conn->prepare("SELECT first_name, last_name FROM users WHERE id = ?");
        $recipient_stmt->bind_param("i", $recipient_id);
        $recipient_stmt->execute();
        $recipient = $recipient_stmt->get_result()->fetch_assoc();
        
        // Create pending transaction
        $reference = 'TXN' . strtoupper(uniqid());
        $description = "Transfer to {$recipient['first_name']} {$recipient['last_name']} via Telegram";
        
        $txn_stmt = $conn->prepare("INSERT INTO transactions (user_id, reference, amount, feature, type, status, description) VALUES (?, ?, ?, 'telegram-pay', 'debit', 'pending', ?)");
        $txn_stmt->bind_param("isds", $sender_id, $reference, $amount, $description);
        $txn_stmt->execute();
        $transaction_id = $conn->insert_id;
        
        // Create webapp token for PIN verification
        $webapp_token = bin2hex(random_bytes(32));
        $expires_at = date('Y-m-d H:i:s', strtotime('+15 minutes'));
        
        $token_stmt = $conn->prepare("INSERT INTO webapp_tokens (user_id, chat_id, tx_id, action_type, token, expires_at) VALUES (?, ?, ?, 'transfer', ?, ?)");
        $token_stmt->bind_param("isiss", $sender_id, $chat_id, $transaction_id, $webapp_token, $expires_at);
        $token_stmt->execute();
        
        // Create webview URL
        $webview_url = $SITE_URL . "/webview/verify-payment.php?token=" . $webapp_token;
        
        $amount_formatted = number_format($amount, 2);
        $message = "💸 <b>Confirm Transfer</b>\n\n" .
                  "📤 <b>To:</b> {$recipient['first_name']} {$recipient['last_name']}\n" .
                  "💰 <b>Amount:</b> ₦{$amount_formatted}\n" .
                  "🔗 <b>Reference:</b> {$reference}\n\n" .
                  "🔐 Please enter your PIN to complete this transfer.\n" .
                  "⏰ This link expires in 15 minutes.";
        
        $keyboard = [
            "inline_keyboard" => [[
                [
                    "text" => "🔐 Enter PIN to Complete",
                    "web_app" => ["url" => $webview_url]
                ]
            ]]
        ];
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "https://api.telegram.org/bot{$bot_config['bot_token']}/sendMessage");
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
            'chat_id' => $chat_id,
            'text' => $message,
            'parse_mode' => 'HTML',
            'reply_markup' => $keyboard
        ]));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_exec($ch);
        curl_close($ch);
        
    } catch (Exception $e) {
        error_log("Initiate Transfer Error: " . $e->getMessage());
        sendMessage($chat_id, "❌ An error occurred while initiating the transfer.", $bot_config['bot_token']);
    }
}

function handleCallbackQuery($callback_query, $conn, $bot_config) {
    $chat_id = $callback_query['message']['chat']['id'];
    $data = $callback_query['data'];
    
    if (strpos($data, 'transfer:') === 0) {
        $parts = explode(':', $data);
        $recipient_id = $parts[1];
        $amount = $parts[2];
        
        // Get session to find sender
        $session = getOrCreateSession($chat_id, $conn);
        if ($session['user_id']) {
            initiateTransfer($chat_id, $session['user_id'], $recipient_id, $amount, $conn, $bot_config);
        }
    }
    
    // Answer the callback query
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://api.telegram.org/bot{$bot_config['bot_token']}/answerCallbackQuery");
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        'callback_query_id' => $callback_query['id']
    ]));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_exec($ch);
    curl_close($ch);
}
