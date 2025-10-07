<?php

function handleGetTransactionHistory($phone_number, $user_id, $conn, $bot_config) {
    try {
        $stmt = $conn->prepare("
            SELECT reference, amount, feature, type, status, description, created_at 
            FROM transactions 
            WHERE user_id = ? 
            ORDER BY created_at DESC 
            LIMIT 10
        ");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $message = "📊 *Recent Transactions*\n\n";
        
        if ($result->num_rows > 0) {
            while ($txn = $result->fetch_assoc()) {
                $amount = number_format($txn['amount'], 2);
                $date = date('M j, Y', strtotime($txn['created_at']));
                $time = date('g:i A', strtotime($txn['created_at']));
                
                // Status emoji
                $status_emoji = match($txn['status']) {
                    'successful' => '✅',
                    'pending' => '⏳',
                    'failed' => '❌',
                    'reversed' => '🔄',
                    default => '❓'
                };
                
                // Type emoji and sign
                if ($txn['type'] === 'credit') {
                    $type_emoji = '💚';
                    $amount_display = "+₦{$amount}";
                } else {
                    $type_emoji = '💸';
                    $amount_display = "-₦{$amount}";
                }
                
                $feature = ucwords(str_replace('-', ' ', $txn['feature']));
                
                $message .= "{$status_emoji} {$type_emoji} *{$amount_display}*\n" .
                           "📝 {$txn['description']}\n" .
                           "🏷️ {$feature} • {$date} at {$time}\n" .
                           "🔗 Ref: {$txn['reference']}\n\n";
            }
            
            $message .= "💡 _Showing last 10 transactions. For complete history, visit the GestPay app._";
        } else {
            $message .= "📭 No transactions found.\n\n" .
                       "Start using GestPay to see your transaction history here!";
        }
        
        sendMessage($phone_number, $message, $bot_config);
        
    } catch (Exception $e) {
        error_log("WhatsApp Transaction History Error: " . $e->getMessage());
        sendMessage($phone_number, "❌ An error occurred while fetching your transactions.", $bot_config);
    }
}
?>
