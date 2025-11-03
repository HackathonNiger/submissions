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
    // Get user's WhatsApp details
    $stmt = $conn->prepare("
        SELECT 
            u.has_setup_whatsapp,
            u.allow_whatsapp_payments,
            u.phone_number,
            la.platform_id as whatsapp_number,
            la.created_at as linked_at,
            ws.state as session_state,
            ws.updated_at as last_activity
        FROM users u
        LEFT JOIN linked_accounts la ON u.id = la.user_id AND la.platform = 'whatsapp'
        LEFT JOIN whatsapp_sessions ws ON u.phone_number = ws.phone_number
        WHERE u.id = ?
    ");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $details = $result->fetch_assoc();

    if (!$details) {
        http_response_code(404);
        echo json_encode([
            "success" => false, 
            "message" => "User not found"
        ]);
        exit;
    }

    // Get recent WhatsApp messages count
    $msg_stmt = $conn->prepare("
        SELECT COUNT(*) as message_count 
        FROM whatsapp_messages 
        WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    ");
    $msg_stmt->bind_param("i", $user_id);
    $msg_stmt->execute();
    $msg_result = $msg_stmt->get_result();
    $message_stats = $msg_result->fetch_assoc();

    // Get WhatsApp transaction count
    $txn_stmt = $conn->prepare("
        SELECT COUNT(*) as transaction_count, COALESCE(SUM(amount), 0) as total_amount
        FROM transactions 
        WHERE user_id = ? AND feature = 'whatsapp-pay' AND status = 'successful'
    ");
    $txn_stmt->bind_param("i", $user_id);
    $txn_stmt->execute();
    $txn_result = $txn_stmt->get_result();
    $transaction_stats = $txn_result->fetch_assoc();

    $response_data = [
        "has_setup_whatsapp" => (bool)$details['has_setup_whatsapp'],
        "allow_whatsapp_payments" => (bool)$details['allow_whatsapp_payments'],
        "phone_number" => $details['phone_number'],
        "whatsapp_number" => $details['whatsapp_number'],
        "linked_at" => $details['linked_at'],
        "session_state" => $details['session_state'],
        "last_activity" => $details['last_activity'],
        "stats" => [
            "messages_last_30_days" => (int)$message_stats['message_count'],
            "total_transactions" => (int)$transaction_stats['transaction_count'],
            "total_transaction_amount" => (float)$transaction_stats['total_amount']
        ]
    ];

    echo json_encode([
        "success" => true,
        "message" => "WhatsApp details retrieved successfully",
        "data" => $response_data
    ]);

} catch (Exception $e) {
    error_log("WhatsApp details error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "message" => "Server error occurred while retrieving WhatsApp details"
    ]);
}
?>
