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
    // Get JSON input
    $input = json_decode(file_get_contents("php://input"), true);
    $enable_payments = $input['enable_payments'] ?? null;

    // Validate input
    if ($enable_payments === null || !is_bool($enable_payments)) {
        http_response_code(400);
        echo json_encode([
            "success" => false, 
            "message" => "Invalid input. 'enable_payments' must be a boolean value"
        ]);
        exit;
    }

    // Check if user has WhatsApp connected
    $check_stmt = $conn->prepare("
        SELECT has_setup_whatsapp, allow_whatsapp_payments
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
            "message" => "No WhatsApp account connected. Please connect your WhatsApp account first"
        ]);
        exit;
    }

    // Check if already in desired state
    $current_state = (bool)$user_data['allow_whatsapp_payments'];
    if ($current_state === $enable_payments) {
        $status_text = $enable_payments ? 'enabled' : 'disabled';
        echo json_encode([
            "success" => true,
            "message" => "WhatsApp payments are already {$status_text}",
            "data" => [
                "allow_whatsapp_payments" => $enable_payments
            ]
        ]);
        exit;
    }

    // Update WhatsApp payments setting
    $update_stmt = $conn->prepare("
        UPDATE users 
        SET allow_whatsapp_payments = ? 
        WHERE id = ?
    ");
    $enable_int = $enable_payments ? 1 : 0;
    $update_stmt->bind_param("ii", $enable_int, $user_id);
    
    if ($update_stmt->execute()) {
        $status_text = $enable_payments ? 'enabled' : 'disabled';
        echo json_encode([
            "success" => true,
            "message" => "WhatsApp payments {$status_text} successfully",
            "data" => [
                "allow_whatsapp_payments" => $enable_payments
            ]
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false, 
            "message" => "Failed to update WhatsApp payment settings"
        ]);
    }

} catch (Exception $e) {
    error_log("Toggle WhatsApp payments error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "message" => "Server error occurred while updating WhatsApp payment settings"
    ]);
}
?>
