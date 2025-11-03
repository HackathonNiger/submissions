<?php
header("Content-Type: application/json");
require_once '../../../config/config.php';

// Get the raw POST data
$input = file_get_contents('php://input');
$update = json_decode($input, true);
date_default_timezone_set('Africa/Lagos');
// Log the incoming update for debugging
error_log("Telegram Webhook: " . $input);

if (!$update) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid JSON"]);
    exit;
}

// Get bot configuration
$bot_config = getBotConfig($conn);
if (!$bot_config) {
    http_response_code(500);
    echo json_encode(["error" => "Bot not configured"]);
    exit;
}

try {
    // Process the update
    if (isset($update['message'])) {
        handleMessage($update['message'], $conn, $bot_config);
    } elseif (isset($update['callback_query'])) {
        handleCallbackQuery($update['callback_query'], $conn, $bot_config);
    }
    
    echo json_encode(["status" => "ok"]);
    
} catch (Exception $e) {
    error_log("Telegram Webhook Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["error" => "Internal server error"]);
}

function getBotConfig($conn) {
    $stmt = $conn->prepare("SELECT * FROM telegram_bot_config WHERE is_active = 1 LIMIT 1");
    $stmt->execute();
    $result = $stmt->get_result();
    return $result->fetch_assoc();
}

function handleMessage($message, $conn, $bot_config) {
    $chat_id = $message['chat']['id'];
    $text = $message['text'] ?? '';
    $contact = $message['contact'] ?? null;
    
    // Get or create session
    $session = getOrCreateSession($chat_id, $conn);
    
    // Log the message
    logMessage($chat_id, $session['user_id'], 'text', $text, null, null, $conn);
    
    if ($contact) {
        handleContactShare($chat_id, $contact, $session, $conn, $bot_config);
    } elseif (strpos($text, '/start') === 0) {
        handleStartCommand($chat_id, $message['chat'], $session, $conn, $bot_config);
    } elseif ($session['state'] === 'linked') {
        handleLinkedUserMessage($chat_id, $text, $session, $conn, $bot_config);
    } elseif ($session['state'] === 'awaiting_otp') {
        handleOTPVerification($chat_id, $text, $session, $conn, $bot_config);
    } else {
        sendMessage($chat_id, "Please start by typing /start", $bot_config['bot_token']);
    }
}

function handleStartCommand($chat_id, $chat, $session, $conn, $bot_config) {
    $first_name = $chat['first_name'] ?? 'there';
    
    // Check if already linked
    if ($session['user_id']) {
        $welcome_msg = "👋 Welcome back, $first_name! Your account is already linked.\n\n" .
                      "You can now:\n" .
                      "• Check your balance: 'What's my balance?'\n" .
                      "• Send money: 'Send ₦500 to John'\n" .
                      "• View transactions: 'Show my transactions'\n" .
                      "• Get financial advice: 'Should I invest?'";
        
        updateSessionState($chat_id, 'linked', null, $conn);
        sendMessage($chat_id, $welcome_msg, $bot_config['bot_token']);
    } else {
        $welcome_msg = "👋 Welcome to GestPay, $first_name!\n\n" .
                      "To get started, I need to verify your phone number to connect your account.\n" .
                      "Tap the button below to share your phone number securely 📱";
        
        $keyboard = [
            "keyboard" => [
                [
                    [
                        "text" => "📱 Share my phone number",
                        "request_contact" => true
                    ]
                ]
            ],
            "one_time_keyboard" => true,
            "resize_keyboard" => true
        ];
        
        updateSessionState($chat_id, 'awaiting_phone', null, $conn);
        sendMessage($chat_id, $welcome_msg, $bot_config['bot_token'], $keyboard);
    }
}

function handleContactShare($chat_id, $contact, $session, $conn, $bot_config) {
    $phone = $contact['phone_number'];
    $first_name = $contact['first_name'] ?? '';
    
    // Clean phone number (remove + and spaces)
    $clean_phone = preg_replace('/[^\d]/', '', $phone);
    if (substr($clean_phone, 0, 3) === '234') {
        $clean_phone = '0' . substr($clean_phone, 3);
    }
    
    // Look for user with this phone number
    $stmt = $conn->prepare("SELECT id, first_name, last_name FROM users WHERE phone_number = ?");
    $stmt->bind_param("s", $clean_phone);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    
    if ($user) {
        // Link the account
        $update_stmt = $conn->prepare("UPDATE users SET telegram_chat_id = ? WHERE id = ?");
        $update_stmt->bind_param("si", $chat_id, $user['id']);
        $update_stmt->execute();
        
        // Update linked_accounts table
        $link_stmt = $conn->prepare("INSERT INTO linked_accounts (user_id, platform, platform_id) VALUES (?, 'telegram', ?) ON DUPLICATE KEY UPDATE platform_id = VALUES(platform_id)");
        $link_stmt->bind_param("is", $user['id'], $chat_id);
        $link_stmt->execute();
        
        // Update session
        updateSessionState($chat_id, 'linked', null, $conn, $user['id']);
        
        $success_msg = "✅ Your account has been successfully linked!\n\n" .
                      "Welcome, {$user['first_name']}! You can now:\n" .
                      "• 'Check my balance'\n" .
                      "• 'Send ₦500 to John'\n" .
                      "• 'Show my transactions'\n" .
                      "• Ask for financial advice";
        
        sendMessage($chat_id, $success_msg, $bot_config['bot_token']);
        
        // Log the linking
        logMessage($chat_id, $user['id'], 'contact', $phone, $success_msg, 'account_linked', $conn);
        
    } else {
        $error_msg = "❌ No account found with phone number $phone.\n\n" .
                    "Please make sure you have registered with GestPay first, or contact support if you believe this is an error.";
        
        sendMessage($chat_id, $error_msg, $bot_config['bot_token']);
        updateSessionState($chat_id, 'start', null, $conn);
    }
}

function handleLinkedUserMessage($chat_id, $text, $session, $conn, $bot_config) {
    // Get user context for better AI responses
    $user_context = getUserContext($session['user_id'], $conn);
    
    // Use AI to parse the user's intent with context
    $ai_response = parseUserIntent($text, $bot_config, $user_context);
    
    if (!$ai_response) {
        sendMessage($chat_id, "Sorry, I couldn't understand that. Try asking about your balance, sending money, or viewing transactions.", $bot_config['bot_token']);
        return;
    }
    
    $action = $ai_response['action'];
    $parameters = $ai_response['parameters'];
    $message = $ai_response['message'];
    
    // Log the AI response
    logMessage($chat_id, $session['user_id'], 'text', $text, json_encode($ai_response), $action, $conn);
    
    switch ($action) {
        case 'get_balance':
            handleGetBalance($chat_id, $session['user_id'], $conn, $bot_config);
            break;
            
        case 'get_account_details':
            handleGetAccountDetails($chat_id, $session['user_id'], $conn, $bot_config);
            break;
            
        case 'get_transaction_history':
            handleGetTransactionHistory($chat_id, $session['user_id'], $conn, $bot_config);
            break;
            
        case 'transfer_internal':
            handleInternalTransfer($chat_id, $session['user_id'], $parameters, $conn, $bot_config);
            break;
            
        case 'transfer_external':
            handleExternalTransfer($chat_id, $session['user_id'], $parameters, $conn, $bot_config);
            break;
            
        case 'fintech_advice':
            sendMessage($chat_id, $message, $bot_config['bot_token']);
            break;
            
        default:
            sendMessage($chat_id, "I'm not sure how to help with that. Try asking about your balance or sending money.", $bot_config['bot_token']);
    }
}

function parseUserIntent($text, $bot_config, $user_context = null) {
    $api_key = $bot_config['ai_api_key'];
    $model = $bot_config['ai_model'];
    
    $system_prompt = "You are GestPay AI, an intelligent financial assistant for a Telegram-based payment system serving Nigerian users. You understand and respond in multiple Nigerian languages including English, Yoruba, Igbo, Hausa, and Nigerian Pidgin English. You help users perform banking operations and provide culturally-aware fintech advice tailored to the Nigerian financial landscape.

LANGUAGE SUPPORT:
- Detect user's preferred language from their message
- Respond in the same language they use
- Support code-switching between languages naturally
- Understand Nigerian financial terms and slang

SUPPORTED ACTIONS:
1. get_balance - Check account balance
2. get_account_details - View account information  
3. get_transaction_history - Show recent transactions
4. transfer_internal - Send money to another GestPay user
5. transfer_external - Send money to Nigerian banks (GTBank, Access, First Bank, UBA, Zenith, etc.)
6. fintech_advice - Provide Nigerian-context financial advice

FINANCIAL ADVICE CONTEXT:
- Consider Nigerian economic conditions, inflation rates, and investment opportunities
- Reference local financial institutions, mobile money services (Opay, PalmPay, Kuda)
- Understand Nigerian financial goals (land acquisition, education, business capital)
- Be aware of Nigerian regulatory environment (CBN policies, forex restrictions)
- Consider local investment options (treasury bills, mutual funds, real estate)

Always respond in valid JSON format only. Never include natural text outside JSON structure.

JSON RESPONSE FORMAT:
{
  \"action\": \"<one_of_the_actions>\",
  \"parameters\": {
    \"amount\": \"<number_if_applicable>\",
    \"recipient\": \"<recipient_name_or_account>\",
    \"method\": \"<internal_or_external>\",
    \"bank_code\": \"<bank_code_if_external>\",
    \"account_number\": \"<account_number_if_external>\"
  },
  \"message\": \"<natural_language_response_in_user_preferred_language>\"
}

RULES:
- Always respond in the user's detected language
- Fill required parameters if mentioned by user
- For missing transfer data, return null values
- Provide contextual Nigerian financial advice
- Be concise and culturally sensitive
- Use appropriate Nigerian currency format (₦)
- Reference local financial concepts when relevant";
    
    // Prepare messages array
    $messages = [
        ["role" => "system", "content" => $system_prompt]
    ];
    
    // Add user context if available
    if ($user_context) {
        $context_message = "USER CONTEXT:\n" . 
                          "Name: {$user_context['name']}\n" .
                          "Balance: ₦" . number_format($user_context['balance'], 2) . "\n" .
                          "Recent Transactions: {$user_context['recent_transactions']}\n" .
                          "Account Age: {$user_context['account_age']} days\n\n" .
                          "USER MESSAGE: {$text}";
        $messages[] = ["role" => "user", "content" => $context_message];
    } else {
        $messages[] = ["role" => "user", "content" => $text];
    }
    
    $payload = [
        "model" => $model,
        "temperature" => 0.3,
        "max_tokens" => 300,
        "stream" => false,
        "messages" => $messages
    ];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://api.a4f.co/v1/chat/completions");
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Content-Type: application/json",
        "Authorization: Bearer " . $api_key
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($response && $http_code === 200) {
        $data = json_decode($response, true);
        if (isset($data['choices'][0]['message']['content'])) {
            $content = $data['choices'][0]['message']['content'];
            return json_decode($content, true);
        }
    }
    
    // Log error for debugging
    error_log("AI API Error: HTTP $http_code - $response");
    
    return null;
}

function getUserContext($user_id, $conn) {
    try {
        // Get user basic info and balance
        $user_stmt = $conn->prepare("SELECT first_name, last_name, balance, created_at FROM users WHERE id = ?");
        $user_stmt->bind_param("i", $user_id);
        $user_stmt->execute();
        $user = $user_stmt->get_result()->fetch_assoc();
        
        if (!$user) return null;
        
        // Get recent transactions (last 5)
        $trans_stmt = $conn->prepare("
            SELECT amount, type, description, created_at 
            FROM transactions 
            WHERE user_id = ? 
            ORDER BY created_at DESC 
            LIMIT 5
        ");
        $trans_stmt->bind_param("i", $user_id);
        $trans_stmt->execute();
        $transactions = $trans_stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        
        // Format transaction summary
        $trans_summary = "";
        foreach ($transactions as $trans) {
            $trans_summary .= "₦" . number_format($trans['amount'], 2) . " " . 
                             $trans['type'] . " - " . $trans['description'] . "; ";
        }
        
        // Calculate account age
        $account_age = (time() - strtotime($user['created_at'])) / (60 * 60 * 24);
        
        return [
            'name' => $user['first_name'] . ' ' . $user['last_name'],
            'balance' => $user['balance'],
            'recent_transactions' => $trans_summary ?: "No recent transactions",
            'account_age' => round($account_age)
        ];
        
    } catch (Exception $e) {
        error_log("Error getting user context: " . $e->getMessage());
        return null;
    }
}

// Helper functions
function getOrCreateSession($chat_id, $conn) {
    $stmt = $conn->prepare("SELECT * FROM telegram_sessions WHERE chat_id = ?");
    $stmt->bind_param("s", $chat_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $session = $result->fetch_assoc();
    
    if (!$session) {
        $insert_stmt = $conn->prepare("INSERT INTO telegram_sessions (chat_id, state) VALUES (?, 'start')");
        $insert_stmt->bind_param("s", $chat_id);
        $insert_stmt->execute();
        
        return [
            'chat_id' => $chat_id,
            'user_id' => null,
            'state' => 'start',
            'temp_data' => null
        ];
    }
    
    return $session;
}

function updateSessionState($chat_id, $state, $temp_data, $conn, $user_id = null) {
    if ($user_id) {
        $stmt = $conn->prepare("UPDATE telegram_sessions SET state = ?, temp_data = ?, user_id = ? WHERE chat_id = ?");
        $stmt->bind_param("ssis", $state, $temp_data, $user_id, $chat_id);
    } else {
        $stmt = $conn->prepare("UPDATE telegram_sessions SET state = ?, temp_data = ? WHERE chat_id = ?");
        $stmt->bind_param("sss", $state, $temp_data, $chat_id);
    }
    $stmt->execute();
}

function logMessage($chat_id, $user_id, $type, $content, $response, $action, $conn) {
    $stmt = $conn->prepare("INSERT INTO telegram_messages (chat_id, user_id, message_type, message_content, bot_response, action_taken) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sissss", $chat_id, $user_id, $type, $content, $response, $action);
    $stmt->execute();
}

function sendMessage($chat_id, $text, $bot_token, $reply_markup = null) {
    $url = "https://api.telegram.org/bot{$bot_token}/sendMessage";
    
    $data = [
        'chat_id' => $chat_id,
        'text' => $text,
        'parse_mode' => 'HTML'
    ];
    
    if ($reply_markup) {
        $data['reply_markup'] = json_encode($reply_markup);
    }
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    return json_decode($response, true);
}

// Action handler functions
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

function handleGetTransactionHistory($chat_id, $user_id, $conn, $bot_config) {
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
        
        $message = "📊 <b>Recent Transactions</b>\n\n";
        
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
                
                $message .= "{$status_emoji} {$type_emoji} <b>{$amount_display}</b>\n" .
                           "📝 {$txn['description']}\n" .
                           "🏷️ {$feature} • {$date} at {$time}\n" .
                           "🔗 Ref: {$txn['reference']}\n\n";
            }
            
            $message .= "💡 <i>Showing last 10 transactions. For complete history, visit the GestPay app.</i>";
        } else {
            $message .= "📭 No transactions found.\n\n" .
                       "Start using GestPay to see your transaction history here!";
        }
        
        sendMessage($chat_id, $message, $bot_config['bot_token']);
        
    } catch (Exception $e) {
        error_log("Transaction History Error: " . $e->getMessage());
        sendMessage($chat_id, "❌ An error occurred while fetching your transactions.", $bot_config['bot_token']);
    }
}

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
        $expires_at = date('Y-m-d H:i:s', time() + (15 * 60)); // Add 15 minutes to current timestamp
        
        // Debug: Log token creation
        error_log("Creating webapp token: " . $webapp_token . " for user: " . $sender_id . " chat: " . $chat_id . " tx: " . $transaction_id);
        
        $token_stmt = $conn->prepare("INSERT INTO webapp_tokens (user_id, chat_id, tx_id, action_type, token, expires_at) VALUES (?, ?, ?, 'transfer', ?, ?)");
        $token_stmt->bind_param("isiss", $sender_id, $chat_id, $transaction_id, $webapp_token, $expires_at);
        
        if (!$token_stmt->execute()) {
            error_log("Failed to create webapp token: " . $token_stmt->error);
            throw new Exception("Failed to create webapp token");
        }
        
        error_log("Webapp token created successfully with ID: " . $conn->insert_id);
        
        // Create webview URL
        $webview_url =   "https://gestpay.souktrainproperties.com/webview/verify-payment.php?token=" . $webapp_token;
        
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
