<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../../config/config.php';
require_once '../../../config/auth.php';
// Set timezone
date_default_timezone_set('Africa/Lagos');



// Authenticate user
$user_id = authenticate($conn);


// Validate request method
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

try {
    // Get user telegram details
    $user_stmt = $conn->prepare("
        SELECT telegram_chat_id, has_setup_telegram, allow_telegram_payments, created_at
        FROM users 
        WHERE id = ?
    ");
    $user_stmt->bind_param("i", $user_id);
    $user_stmt->execute();
    $user_result = $user_stmt->get_result();
    $user_data = $user_result->fetch_assoc();

    if (!$user_data || !$user_data['has_setup_telegram'] || !$user_data['telegram_chat_id']) {
        http_response_code(404);
        echo json_encode([
            "success" => false, 
            "message" => "No Telegram account connected"
        ]);
        exit;
    }

    $chat_id = $user_data['telegram_chat_id'];

    // Get linked account details
    $linked_stmt = $conn->prepare("
        SELECT platform_id, created_at as connection_date
        FROM linked_accounts 
        WHERE user_id = ? AND platform = 'telegram'
    ");
    $linked_stmt->bind_param("i", $user_id);
    $linked_stmt->execute();
    $linked_result = $linked_stmt->get_result();
    $linked_data = $linked_result->fetch_assoc();

    // Get telegram session details
    $session_stmt = $conn->prepare("
        SELECT state, created_at as session_created, updated_at as last_activity
        FROM telegram_sessions 
        WHERE chat_id = ?
    ");
    $session_stmt->bind_param("s", $chat_id);
    $session_stmt->execute();
    $session_result = $session_stmt->get_result();
    $session_data = $session_result->fetch_assoc();

    // Get last message sent
    $message_stmt = $conn->prepare("
        SELECT created_at as last_message_date, message_type, action_taken
        FROM telegram_messages 
        WHERE chat_id = ? AND user_id = ?
        ORDER BY created_at DESC 
        LIMIT 1
    ");
    $message_stmt->bind_param("si", $chat_id, $user_id);
    $message_stmt->execute();
    $message_result = $message_stmt->get_result();
    $last_message = $message_result->fetch_assoc();

    // Get total messages count
    $count_stmt = $conn->prepare("
        SELECT COUNT(*) as total_messages
        FROM telegram_messages 
        WHERE chat_id = ? AND user_id = ?
    ");
    $count_stmt->bind_param("si", $chat_id, $user_id);
    $count_stmt->execute();
    $count_result = $count_stmt->get_result();
    $message_count = $count_result->fetch_assoc();

    // Get telegram transactions count
    $tx_count_stmt = $conn->prepare("
        SELECT COUNT(*) as telegram_transactions
        FROM transactions 
        WHERE user_id = ? AND feature = 'telegram-pay'
    ");
    $tx_count_stmt->bind_param("i", $user_id);
    $tx_count_stmt->execute();
    $tx_count_result = $tx_count_stmt->get_result();
    $tx_count = $tx_count_result->fetch_assoc();

    // Format response
    $response_data = [
        "chat_id" => $chat_id,
        "platform_id" => $linked_data['platform_id'] ?? null,
        "connection_date" => $linked_data['connection_date'] ?? $user_data['created_at'],
        "is_payments_enabled" => (bool)$user_data['allow_telegram_payments'],
        "session_status" => $session_data['state'] ?? 'inactive',
        "last_activity" => $session_data['last_activity'] ?? null,
        "last_message_date" => $last_message['last_message_date'] ?? null,
        "last_message_type" => $last_message['message_type'] ?? null,
        "last_action_taken" => $last_message['action_taken'] ?? null,
        "total_messages" => (int)($message_count['total_messages'] ?? 0),
        "telegram_transactions" => (int)($tx_count['telegram_transactions'] ?? 0),
        "connection_active" => true
    ];

    echo json_encode([
        "success" => true,
        "message" => "Telegram details retrieved successfully",
        "data" => $response_data
    ]);

} catch (Exception $e) {
    error_log("Telegram details error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "message" => "Server error occurred while retrieving Telegram details"
    ]);
}
?>
