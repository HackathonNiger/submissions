<?php

function handleGetAccountDetails($phone_number, $user_id, $conn, $bot_config) {
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
            
            $message = "👤 *Account Details*\n\n" .
                      "📛 *Name:* {$user['first_name']} {$user['last_name']}\n" .
                      "📞 *Phone:* {$user['phone_number']}\n" .
                      "📧 *Email:* {$user['email']}\n" .
                      "💰 *Balance:* ₦{$balance}\n" .
                      "👥 *Role:* {$role}\n" .
                      "📅 *Member since:* {$joined}\n";
            
            if ($user['merchant_name']) {
                $message .= "🏢 *Business:* {$user['merchant_name']}\n";
            }
            
            $message .= "\n🔒 *Security Settings:*\n" .
                       "• Face payments: " . ($user['allow_face_payments'] ? "✅ Enabled" : "❌ Disabled") . "\n" .
                       "• Voice payments: " . ($user['allow_voice_payments'] ? "✅ Enabled" : "❌ Disabled") . "\n" .
                       "• WhatsApp payments: " . ($user['allow_whatsapp_payments'] ? "✅ Enabled" : "❌ Disabled") . "\n" .
                       "• Payment confirmation: " . ($user['confirm_payment'] ? "✅ Required" : "❌ Not required");
            
            sendMessage($phone_number, $message, $bot_config);
        } else {
            sendMessage($phone_number, "❌ Unable to retrieve account details. Please try again.", $bot_config);
        }
    } catch (Exception $e) {
        error_log("WhatsApp Account Details Error: " . $e->getMessage());
        sendMessage($phone_number, "❌ An error occurred while fetching your account details.", $bot_config);
    }
}
?>
