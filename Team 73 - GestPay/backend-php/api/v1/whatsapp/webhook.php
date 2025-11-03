<?php
header("Content-Type: application/json");
require_once '../../../config/config.php';

// Set timezone
date_default_timezone_set('Africa/Lagos');

// Get the raw POST data
$input = file_get_contents('php://input');
$update = json_decode($input, true);

// Log the incoming update for debugging
error_log("WhatsApp Webhook: " . $input);

// Handle webhook verification
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    handleWebhookVerification();
    exit;
}

if (!$update) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid JSON"]);
    exit;
}

// Get bot configuration
$bot_config = getBotConfig($conn);
if (!$bot_config) {
    http_response_code(500);
    echo json_encode(["error" => "WhatsApp bot not configured"]);
    exit;
}

try {
    // Process the update
    if (isset($update['entry'][0]['changes'][0]['value']['messages'][0])) {
        $message = $update['entry'][0]['changes'][0]['value']['messages'][0];
        handleMessage($message, $conn, $bot_config);
    }
    
    echo json_encode(["status" => "ok"]);
    
} catch (Exception $e) {
    error_log("WhatsApp Webhook Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["error" => "Internal server error"]);
}

function handleWebhookVerification() {
    $verify_token = $_GET['hub_verify_token'] ?? '';
    $challenge = $_GET['hub_challenge'] ?? '';
    $mode = $_GET['hub_mode'] ?? '';
    
    // Get expected verify token from config
    global $conn;
    $bot_config = getBotConfig($conn);
    
    if ($mode === 'subscribe' && $verify_token === $bot_config['webhook_verify_token']) {
        echo $challenge;
    } else {
        http_response_code(403);
        echo "Forbidden";
    }
}

function getBotConfig($conn) {
    $stmt = $conn->prepare("SELECT * FROM whatsapp_bot_config WHERE is_active = 1 LIMIT 1");
    $stmt->execute();
    $result = $stmt->get_result();
    return $result->fetch_assoc();
}

function handleMessage($message, $conn, $bot_config) {
    $phone_number = $message['from'];
    $text = $message['text']['body'] ?? '';
    $message_type = $message['type'] ?? 'text';
    
    // Clean phone number (remove + and standardize format)
    $clean_phone = cleanPhoneNumber($phone_number);
    
    // Get or create session
    $session = getOrCreateSession($clean_phone, $conn);
    
    // Log the message
    logMessage($clean_phone, $session['user_id'], $message_type, $text, null, null, $conn);
    
    if ($session['state'] === 'linked') {
        handleLinkedUserMessage($phone_number, $text, $session, $conn, $bot_config);
    } elseif ($session['state'] === 'awaiting_otp') {
        handleOTPVerification($phone_number, $text, $session, $conn, $bot_config);
    } elseif ($session['state'] === 'awaiting_selection') {
        require_once 'handlers/transfers.php';
        handleRecipientSelection($phone_number, $text, $session, $conn, $bot_config);
    } else {
        handleNewUser($phone_number, $clean_phone, $session, $conn, $bot_config);
    }
}

function handleNewUser($phone_number, $clean_phone, $session, $conn, $bot_config) {
    // Look for user with this phone number
    $stmt = $conn->prepare("SELECT id, first_name, last_name FROM users WHERE phone_number = ?");
    $stmt->bind_param("s", $clean_phone);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    
    if ($user) {
        // Check if already linked
        $link_stmt = $conn->prepare("SELECT * FROM linked_accounts WHERE user_id = ? AND platform = 'whatsapp'");
        $link_stmt->bind_param("i", $user['id']);
        $link_stmt->execute();
        $linked = $link_stmt->get_result()->fetch_assoc();
        
        if ($linked) {
            // Already linked, update session
            updateSessionState($clean_phone, 'linked', null, $conn, $user['id']);
            $welcome_msg = "👋 Welcome back to GestPay, {$user['first_name']}! Your WhatsApp account is already linked.\n\n" .
                          "You can now:\n" .
                          "• Check your balance: 'What's my balance?'\n" .
                          "• Send money: 'Send ₦500 to John'\n" .
                          "• View transactions: 'Show my transactions'\n" .
                          "• Get financial advice: 'Should I invest?'";
            
            sendMessage($phone_number, $welcome_msg, $bot_config);
        } else {
            // Need to link account with OTP
            initiateOTPVerification($phone_number, $clean_phone, $user['id'], $conn, $bot_config);
        }
    } else {
        $error_msg = "❌ No GestPay account found with this phone number.\n\n" .
                    "Please register on our app first at https://gestpay.souktrainproperties.com or contact support.";
        
        sendMessage($phone_number, $error_msg, $bot_config);
    }
}

function initiateOTPVerification($phone_number, $clean_phone, $user_id, $conn, $bot_config) {
    // Generate OTP
    $otp = sprintf("%06d", mt_rand(0, 999999));
    $expires_at = date('Y-m-d H:i:s', strtotime('+10 minutes'));
    
    // Save OTP
    $stmt = $conn->prepare("INSERT INTO otp_codes (phone_number, chat_id, code, expires_at) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE code = VALUES(code), expires_at = VALUES(expires_at), used = 0");
    $stmt->bind_param("ssss", $clean_phone, $phone_number, $otp, $expires_at);
    $stmt->execute();
    
    // Update session state
    updateSessionState($clean_phone, 'awaiting_otp', json_encode(['user_id' => $user_id]), $conn);
    
    $message = "🔐 *Account Verification*\n\n" .
              "To link your GestPay account with WhatsApp, please enter this verification code:\n\n" .
              "*{$otp}*\n\n" .
              "⏰ This code expires in 10 minutes.\n" .
              "Simply reply with the 6-digit code to complete verification.";
    
    sendMessage($phone_number, $message, $bot_config);
}

function handleOTPVerification($phone_number, $text, $session, $conn, $bot_config) {
    $clean_phone = cleanPhoneNumber($phone_number);
    $otp = trim($text);
    
    // Validate OTP format
    if (!preg_match('/^\d{6}$/', $otp)) {
        sendMessage($phone_number, "❌ Please enter a valid 6-digit code.", $bot_config);
        return;
    }
    
    // Check OTP
    $stmt = $conn->prepare("SELECT * FROM otp_codes WHERE phone_number = ? AND code = ? AND used = 0 ");
    $stmt->bind_param("ss", $clean_phone, $otp);
    $stmt->execute();
    $otp_record = $stmt->get_result()->fetch_assoc();
    
    if (!$otp_record) {
        sendMessage($phone_number, "❌ Invalid or expired code. Please request a new one by sending 'Hi'.", $bot_config);
        return;
    }
    
    // Get user ID from session temp_data
    $temp_data = json_decode($session['temp_data'], true);
    $user_id = $temp_data['user_id'];
    
    // Mark OTP as used
    $update_stmt = $conn->prepare("UPDATE otp_codes SET used = 1 WHERE id = ?");
    $update_stmt->bind_param("i", $otp_record['id']);
    $update_stmt->execute();
    
    // Link the account
    $link_stmt = $conn->prepare("INSERT INTO linked_accounts (user_id, platform, platform_id) VALUES (?, 'whatsapp', ?) ON DUPLICATE KEY UPDATE platform_id = VALUES(platform_id)");
    $link_stmt->bind_param("is", $user_id, $phone_number);
    $link_stmt->execute();
    
    // Update user settings
    $user_stmt = $conn->prepare("UPDATE users SET has_setup_whatsapp = 1 WHERE id = ?");
    $user_stmt->bind_param("i", $user_id);
    $user_stmt->execute();
    
    // Update session
    updateSessionState($clean_phone, 'linked', null, $conn, $user_id);
    
    // Get user details
    $user_stmt = $conn->prepare("SELECT first_name, last_name FROM users WHERE id = ?");
    $user_stmt->bind_param("i", $user_id);
    $user_stmt->execute();
    $user = $user_stmt->get_result()->fetch_assoc();
    
    $success_msg = "✅ *Account Successfully Linked!*\n\n" .
                  "Welcome to GestPay WhatsApp, {$user['first_name']}! 🎉\n\n" .
                  "You can now:\n" .
                  "• 'Check my balance'\n" .
                  "• 'Send ₦500 to John'\n" .
                  "• 'Show my transactions'\n" .
                  "• Ask for financial advice\n\n" .
                  "Try sending any of these commands to get started!";
    
    sendMessage($phone_number, $success_msg, $bot_config);
    
    // Log the linking
    logMessage($clean_phone, $user_id, 'text', $otp, $success_msg, 'account_linked', $conn);
}

function handleLinkedUserMessage($phone_number, $text, $session, $conn, $bot_config) {
    // Get user context for better AI responses
    $user_context = getUserContext($session['user_id'], $conn);
    
    // Use AI to parse the user's intent with context
    $ai_response = parseUserIntent($text, $bot_config, $user_context);
    
    if (!$ai_response) {
        sendMessage($phone_number, "Sorry, I couldn't understand that. Try asking about your balance, sending money, or viewing transactions.", $bot_config);
        return;
    }
    
    $action = $ai_response['action'];
    $parameters = $ai_response['parameters'];
    $message = $ai_response['message'];
    
    // Log the AI response
    logMessage(cleanPhoneNumber($phone_number), $session['user_id'], 'text', $text, json_encode($ai_response), $action, $conn);
    
    switch ($action) {
        case 'get_balance':
            require_once 'handlers/balance.php';
            handleGetBalance($phone_number, $session['user_id'], $conn, $bot_config);
            break;
            
        case 'get_account_details':
            require_once 'handlers/account.php';
            handleGetAccountDetails($phone_number, $session['user_id'], $conn, $bot_config);
            break;
            
        case 'get_transaction_history':
            require_once 'handlers/transactions.php';
            handleGetTransactionHistory($phone_number, $session['user_id'], $conn, $bot_config);
            break;
            
        case 'transfer_internal':
            require_once 'handlers/transfers.php';
            handleInternalTransfer($phone_number, $session['user_id'], $parameters, $conn, $bot_config);
            break;
            
        case 'transfer_external':
            require_once 'handlers/transfers.php';
            handleExternalTransfer($phone_number, $session['user_id'], $parameters, $conn, $bot_config);
            break;
            
        case 'fintech_advice':
            sendMessage($phone_number, $message, $bot_config);
            break;
            
        default:
            sendMessage($phone_number, "I'm not sure how to help with that. Try asking about your balance or sending money.", $bot_config);
    }
}

function parseUserIntent($text, $bot_config, $user_context = null) {
    $api_key = $bot_config['ai_api_key'];
    $model = $bot_config['ai_model'];
    
    $system_prompt = "You are GestPay AI, an intelligent financial assistant for a WhatsApp-based payment system serving Nigerian users. You understand and respond in multiple Nigerian languages including English, Yoruba, Igbo, Hausa, and Nigerian Pidgin English. You help users perform banking operations and provide culturally-aware fintech advice tailored to the Nigerian financial landscape.

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
function cleanPhoneNumber($phone) {
    // Remove all non-digits
    $clean = preg_replace('/[^\d]/', '', $phone);
    
    // Convert international format to local
    if (substr($clean, 0, 3) === '234') {
        $clean = '0' . substr($clean, 3);
    }
    
    return $clean;
}

function getOrCreateSession($phone_number, $conn) {
    $stmt = $conn->prepare("SELECT * FROM whatsapp_sessions WHERE phone_number = ?");
    $stmt->bind_param("s", $phone_number);
    $stmt->execute();
    $result = $stmt->get_result();
    $session = $result->fetch_assoc();
    
    if (!$session) {
        $insert_stmt = $conn->prepare("INSERT INTO whatsapp_sessions (phone_number, state) VALUES (?, 'start')");
        $insert_stmt->bind_param("s", $phone_number);
        $insert_stmt->execute();
        
        return [
            'phone_number' => $phone_number,
            'user_id' => null,
            'state' => 'start',
            'temp_data' => null
        ];
    }
    
    return $session;
}

function updateSessionState($phone_number, $state, $temp_data, $conn, $user_id = null) {
    if ($user_id) {
        $stmt = $conn->prepare("UPDATE whatsapp_sessions SET state = ?, temp_data = ?, user_id = ? WHERE phone_number = ?");
        $stmt->bind_param("ssis", $state, $temp_data, $user_id, $phone_number);
    } else {
        $stmt = $conn->prepare("UPDATE whatsapp_sessions SET state = ?, temp_data = ? WHERE phone_number = ?");
        $stmt->bind_param("sss", $state, $temp_data, $phone_number);
    }
    $stmt->execute();
}

function logMessage($phone_number, $user_id, $type, $content, $response, $action, $conn) {
    $stmt = $conn->prepare("INSERT INTO whatsapp_messages (phone_number, user_id, message_type, message_content, bot_response, action_taken) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sissss", $phone_number, $user_id, $type, $content, $response, $action);
    $stmt->execute();
}

function sendMessage($phone_number, $text, $bot_config) {
    $url = "https://graph.facebook.com/v18.0/{$bot_config['phone_number_id']}/messages";
    
    $data = [
        'messaging_product' => 'whatsapp',
        'to' => $phone_number,
        'type' => 'text',
        'text' => [
            'body' => $text
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
    
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($http_code !== 200) {
        error_log("WhatsApp Send Message Error: HTTP $http_code - $response");
    }
    
    return json_decode($response, true);
}
?>
