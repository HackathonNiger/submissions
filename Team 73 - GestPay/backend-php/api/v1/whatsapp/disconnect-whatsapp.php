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
    // Check if user has WhatsApp connected
    $check_stmt = $conn->prepare("
        SELECT has_setup_whatsapp, phone_number
        FROM users 
        WHERE id = ?
    ");
    $check_stmt->bind_param("i", $user_id);
    $check_stmt->execute();
    $user_result = $check_stmt->get_result();
    $user_data = $user_result->fetch_assoc();

    if (!$user_data || !$user_data['has_setup_whatsapp']) {
        http_response_code(400);
        echo json_encode([
            "success" => false, 
            "message" => "No WhatsApp account connected to disconnect"
        ]);
        exit;
    }

    // Start transaction
    $conn->begin_transaction();

    try {
        // Remove from linked_accounts
        $unlink_stmt = $conn->prepare("DELETE FROM linked_accounts WHERE user_id = ? AND platform = 'whatsapp'");
        $unlink_stmt->bind_param("i", $user_id);
        $unlink_stmt->execute();

        // Update user settings
        $update_stmt = $conn->prepare("
            UPDATE users 
            SET has_setup_whatsapp = 0, allow_whatsapp_payments = 0
            WHERE id = ?
        ");
        $update_stmt->bind_param("i", $user_id);
        $update_stmt->execute();

        // Remove WhatsApp session
        $session_stmt = $conn->prepare("DELETE FROM whatsapp_sessions WHERE user_id = ?");
        $session_stmt->bind_param("i", $user_id);
        $session_stmt->execute();

        // Commit transaction
        $conn->commit();

        echo json_encode([
            "success" => true,
            "message" => "WhatsApp account disconnected successfully",
            "data" => [
                "has_setup_whatsapp" => false,
                "allow_whatsapp_payments" => false
            ]
        ]);

    } catch (Exception $e) {
        $conn->rollback();
        throw $e;
    }

} catch (Exception $e) {
    error_log("Disconnect WhatsApp error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "message" => "Server error occurred while disconnecting WhatsApp account"
    ]);
}
?>
