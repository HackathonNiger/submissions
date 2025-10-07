<?php

function handleInternalTransfer($phone_number, $user_id, $parameters, $conn, $bot_config) {
    $amount = $parameters['amount'] ?? null;
    $recipient = $parameters['recipient'] ?? null;
    
    if (!$amount || !$recipient) {
        sendMessage($phone_number, "❌ Please specify both amount and recipient. Example: 'Send ₦500 to John'", $bot_config);
        return;
    }
    
    try {
        // Check sender's balance
        $balance_stmt = $conn->prepare("SELECT balance, first_name, allow_whatsapp_payments FROM users WHERE id = ?");
        $balance_stmt->bind_param("i", $user_id);
        $balance_stmt->execute();
        $sender = $balance_stmt->get_result()->fetch_assoc();
        
        if (!$sender['allow_whatsapp_payments']) {
            sendMessage($phone_number, "❌ WhatsApp payments are disabled for your account. Please enable them in the GestPay app first.", $bot_config);
            return;
        }
        
        if ($sender['balance'] < $amount) {
            $balance = number_format($sender['balance'], 2);
            sendMessage($phone_number, "❌ Insufficient balance. Your current balance is ₦{$balance}", $bot_config);
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
            sendMessage($phone_number, "❌ No user found with name or phone '{$recipient}'. Please check and try again.", $bot_config);
            return;
        }
        
        if (count($recipients) > 1) {
            // Multiple recipients found, show options with interactive buttons
            $message = "👥 Multiple users found for '{$recipient}':\n\n";
            
            foreach ($recipients as $index => $rec) {
                $message .= ($index + 1) . ". {$rec['first_name']} {$rec['last_name']} ({$rec['phone_number']})\n";
            }
            
            $message .= "\nPlease reply with the number (1-" . count($recipients) . ") of the correct recipient.";
            
            // Store recipients in session for selection
            $clean_phone = cleanPhoneNumber($phone_number);
            $temp_data = json_encode([
                'recipients' => $recipients,
                'amount' => $amount,
                'action' => 'select_recipient'
            ]);
            updateSessionState($clean_phone, 'awaiting_selection', $temp_data, $conn);
            
            sendMessage($phone_number, $message, $bot_config);
            return;
        }
        
        // Single recipient found, proceed with transfer
        $recipient_user = $recipients[0];
        initiateTransfer($phone_number, $user_id, $recipient_user['id'], $amount, $conn, $bot_config);
        
    } catch (Exception $e) {
        error_log("WhatsApp Internal Transfer Error: " . $e->getMessage());
        sendMessage($phone_number, "❌ An error occurred while processing the transfer.", $bot_config);
    }
}

function handleExternalTransfer($phone_number, $user_id, $parameters, $conn, $bot_config) {
    sendMessage($phone_number, "🏦 External bank transfers are coming soon! For now, you can only send money to other GestPay users.", $bot_config);
}

function initiateTransfer($phone_number, $sender_id, $recipient_id, $amount, $conn, $bot_config) {
    try {
        // Get recipient details
        $recipient_stmt = $conn->prepare("SELECT first_name, last_name FROM users WHERE id = ?");
        $recipient_stmt->bind_param("i", $recipient_id);
        $recipient_stmt->execute();
        $recipient = $recipient_stmt->get_result()->fetch_assoc();
        
        // Create pending transaction
        $reference = 'TXN' . strtoupper(uniqid());
        $description = "Transfer to {$recipient['first_name']} {$recipient['last_name']} via WhatsApp";
        
        $txn_stmt = $conn->prepare("INSERT INTO transactions (user_id, reference, amount, feature, type, status, description) VALUES (?, ?, ?, 'whatsapp-pay', 'debit', 'pending', ?)");
        $txn_stmt->bind_param("isds", $sender_id, $reference, $amount, $description);
        $txn_stmt->execute();
        $transaction_id = $conn->insert_id;
        
        // Create webapp token for PIN verification
        $webapp_token = bin2hex(random_bytes(32));
        $expires_at = date('Y-m-d H:i:s', strtotime('+15 minutes'));
        
        $token_stmt = $conn->prepare("INSERT INTO webapp_tokens (user_id, chat_id, tx_id, action_type, token, expires_at) VALUES (?, ?, ?, 'transfer', ?, ?)");
        $token_stmt->bind_param("isiss", $sender_id, $phone_number, $transaction_id, $webapp_token, $expires_at);
        $token_stmt->execute();
        
        // Create webview URL
        global $SITE_URL;
        $webview_url = $SITE_URL . "/webview/verify-payment.php?token=" . $webapp_token;
        
        $amount_formatted = number_format($amount, 2);
        $message = "💸 *Confirm Transfer*\n\n" .
                  "📤 *To:* {$recipient['first_name']} {$recipient['last_name']}\n" .
                  "💰 *Amount:* ₦{$amount_formatted}\n" .
                  "🔗 *Reference:* {$reference}\n\n" .
                  "🔐 Please click the link below to enter your PIN and complete this transfer:\n\n" .
                  "{$webview_url}\n\n" .
                  "⏰ This link expires in 15 minutes.";
        
        sendMessage($phone_number, $message, $bot_config);
        
    } catch (Exception $e) {
        error_log("WhatsApp Initiate Transfer Error: " . $e->getMessage());
        sendMessage($phone_number, "❌ An error occurred while initiating the transfer.", $bot_config);
    }
}

function handleRecipientSelection($phone_number, $text, $session, $conn, $bot_config) {
    $temp_data = json_decode($session['temp_data'], true);
    $recipients = $temp_data['recipients'];
    $amount = $temp_data['amount'];
    
    $selection = intval(trim($text));
    
    if ($selection < 1 || $selection > count($recipients)) {
        sendMessage($phone_number, "❌ Invalid selection. Please choose a number between 1 and " . count($recipients), $bot_config);
        return;
    }
    
    $selected_recipient = $recipients[$selection - 1];
    
    // Reset session state
    $clean_phone = cleanPhoneNumber($phone_number);
    updateSessionState($clean_phone, 'linked', null, $conn);
    
    // Proceed with transfer
    initiateTransfer($phone_number, $session['user_id'], $selected_recipient['id'], $amount, $conn, $bot_config);
}
?>
