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
    // Use AI to parse the user's intent
    $ai_response = parseUserIntent($text, $bot_config);
    
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

function parseUserIntent($text, $bot_config) {
    $api_key = $bot_config['ai_api_key'];
    $model = $bot_config['ai_model'];
    
    $system_prompt = "You are an AI financial assistant for a WhatsApp-based payment system called GestPay. You help users perform banking operations and provide fintech advice. Always respond in valid JSON format, never natural text. Your job is to understand user intent and return structured data. The supported actions are:\n1. get_balance\n2. get_account_details\n3. get_transaction_history\n4. transfer_internal (send money to another GestPay user)\n5. transfer_external (send money to a bank account outside GestPay)\n6. fintech_advice (general financial or investment questions)\n\nIf the message does not match any supported actions, respond with action fintech_advice.\n\nReturn responses ONLY in this JSON format:\n\n{\n  \"action\": \"<one_of_the_actions>\",\n  \"parameters\": {\n      // action-specific parameters\n  },\n  \"message\": \"<natural language summary to show user>\"\n}\n\nRules:\n- Always fill required parameters if mentioned by the user.\n- For transfers, include amount, recipient, and method (e.g. internal or bank).\n- For missing data, return null values.\n- Be concise and never include explanations outside the JSON object.";
    
    $payload = [
        "model" => $model,
        "temperature" => 0.3,
        "max_tokens" => 200,
        "stream" => false,
        "messages" => [
            ["role" => "system", "content" => $system_prompt],
            ["role" => "user", "content" => $text]
        ]
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
