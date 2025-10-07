<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
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
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

try {
    // Start transaction
    $conn->begin_transaction();

    // Check if user has telegram connected
    $check_stmt = $conn->prepare("SELECT telegram_chat_id, has_setup_telegram FROM users WHERE id = ?");
    $check_stmt->bind_param("i", $user_id);
    $check_stmt->execute();
    $user_result = $check_stmt->get_result();
    $user_data = $user_result->fetch_assoc();

    if (!$user_data || !$user_data['has_setup_telegram'] || !$user_data['telegram_chat_id']) {
        http_response_code(400);
        echo json_encode([
            "success" => false, 
            "message" => "No Telegram account connected to disconnect"
        ]);
        $conn->rollback();
        exit;
    }

    $chat_id = $user_data['telegram_chat_id'];

    // Remove telegram connection from user
    $update_user_stmt = $conn->prepare("
        UPDATE users 
        SET telegram_chat_id = NULL, 
            has_setup_telegram = 0, 
            allow_telegram_payments = 0 
        WHERE id = ?
    ");
    $update_user_stmt->bind_param("i", $user_id);
    $update_user_stmt->execute();

    // Remove from linked_accounts
    $remove_linked_stmt = $conn->prepare("
        DELETE FROM linked_accounts 
        WHERE user_id = ? AND platform = 'telegram'
    ");
    $remove_linked_stmt->bind_param("i", $user_id);
    $remove_linked_stmt->execute();

    // Remove telegram session
    $remove_session_stmt = $conn->prepare("
        DELETE FROM telegram_sessions 
        WHERE chat_id = ?
    ");
    $remove_session_stmt->bind_param("s", $chat_id);
    $remove_session_stmt->execute();

    // Commit transaction
    $conn->commit();

    echo json_encode([
        "success" => true,
        "message" => "Telegram account disconnected successfully"
    ]);

} catch (Exception $e) {
    $conn->rollback();
    error_log("Telegram disconnect error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "message" => "Server error occurred while disconnecting Telegram account"
    ]);
}
?>
