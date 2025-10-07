<?php

function handleGetBalance($phone_number, $user_id, $conn, $bot_config) {
    try {
        $stmt = $conn->prepare("SELECT balance, first_name FROM users WHERE id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        
        if ($user) {
            $balance = number_format($user['balance'], 2);
            $message = "💰 *Account Balance*\n\n" .
                      "Hello {$user['first_name']}!\n" .
                      "Your current balance is: *₦{$balance}*\n\n" .
                      "Need to add funds? You can fund your account through the GestPay app or visit any of our partner locations.";
            
            sendMessage($phone_number, $message, $bot_config);
        } else {
            sendMessage($phone_number, "❌ Unable to retrieve balance. Please try again.", $bot_config);
        }
    } catch (Exception $e) {
        error_log("WhatsApp Balance Error: " . $e->getMessage());
        sendMessage($phone_number, "❌ An error occurred while fetching your balance.", $bot_config);
    }
}
?>
