<?php

function handleGetAccountDetails($chat_id, $user_id, $conn, $bot_config) {
    try {
        $stmt = $conn->prepare("SELECT u.*, m.name as merchant_name FROM users u LEFT JOIN merchants m ON u.merchant_id = m.id WHERE u.id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        
        if ($user) {
            $balance = number_format($user['balance'], 2);
            $role = ucfirst($user['role']);
            $joined = date('M Y', strtotime($user['created_at']));
            
            $message = "👤 <b>Account Details</b>\n\n" .
                      "📛 <b>Name:</b> {$user['first_name']} {$user['last_name']}\n" .
                      "📞 <b>Phone:</b> {$user['phone_number']}\n" .
                      "📧 <b>Email:</b> {$user['email']}\n" .
                      "💰 <b>Balance:</b> ₦{$balance}\n" .
                      "👥 <b>Role:</b> {$role}\n" .
                      "📅 <b>Member since:</b> {$joined}\n";
            
            if ($user['merchant_name']) {
                $message .= "🏢 <b>Business:</b> {$user['merchant_name']}\n";
            }
            
            $message .= "\n🔒 <b>Security Settings:</b>\n" .
                       "• Face payments: " . ($user['allow_face_payments'] ? "✅ Enabled" : "❌ Disabled") . "\n" .
                       "• Voice payments: " . ($user['allow_voice_payments'] ? "✅ Enabled" : "❌ Disabled") . "\n" .
                       "• Telegram payments: " . ($user['allow_telegram_payments'] ? "✅ Enabled" : "❌ Disabled") . "\n" .
                       "• Payment confirmation: " . ($user['confirm_payment'] ? "✅ Required" : "❌ Not required");
            
            sendMessage($chat_id, $message, $bot_config['bot_token']);
        } else {
            sendMessage($chat_id, "❌ Unable to retrieve account details. Please try again.", $bot_config['bot_token']);
        }
    } catch (Exception $e) {
        error_log("Account Details Error: " . $e->getMessage());
        sendMessage($chat_id, "❌ An error occurred while fetching your account details.", $bot_config['bot_token']);
    }
}
