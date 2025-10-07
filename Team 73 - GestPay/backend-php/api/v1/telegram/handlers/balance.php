<?php

function handleGetBalance($chat_id, $user_id, $conn, $bot_config) {
    try {
        $stmt = $conn->prepare("SELECT balance, first_name FROM users WHERE id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        
        if ($user) {
            $balance = number_format($user['balance'], 2);
            $message = "💰 <b>Account Balance</b>\n\n" .
                      "Hello {$user['first_name']}!\n" .
                      "Your current balance is: <b>₦{$balance}</b>\n\n" .
                      "Need to add funds? You can fund your account through the GestPay app or visit any of our partner locations.";
            
            sendMessage($chat_id, $message, $bot_config['bot_token']);
        } else {
            sendMessage($chat_id, "❌ Unable to retrieve balance. Please try again.", $bot_config['bot_token']);
        }
    } catch (Exception $e) {
        error_log("Balance Error: " . $e->getMessage());
        sendMessage($chat_id, "❌ An error occurred while fetching your balance.", $bot_config['bot_token']);
    }
}
