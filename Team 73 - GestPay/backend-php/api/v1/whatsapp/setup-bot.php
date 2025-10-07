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

// Authenticate user (admin only)
$user_id = authenticate($conn);

// Check if user is admin
$admin_stmt = $conn->prepare("SELECT role FROM users WHERE id = ?");
$admin_stmt->bind_param("i", $user_id);
$admin_stmt->execute();
$user_data = $admin_stmt->get_result()->fetch_assoc();

if (!$user_data || $user_data['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Admin access required"]);
    exit;
}

// Validate request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

try {
    // Get JSON input
    $input = json_decode(file_get_contents("php://input"), true);
    
    $phone_number_id = $input['phone_number_id'] ?? null;
    $access_token = $input['access_token'] ?? null;
    $webhook_verify_token = $input['webhook_verify_token'] ?? null;
    $business_account_id = $input['business_account_id'] ?? null;
    $ai_api_key = $input['ai_api_key'] ?? null;
    $ai_model = $input['ai_model'] ?? 'gpt-4o-mini';

    // Validate required fields
    if (!$phone_number_id || !$access_token || !$webhook_verify_token) {
        http_response_code(400);
        echo json_encode([
            "success" => false, 
            "message" => "Missing required fields: phone_number_id, access_token, webhook_verify_token"
        ]);
        exit;
    }

    // Check if configuration already exists
    $check_stmt = $conn->prepare("SELECT id FROM whatsapp_bot_config WHERE is_active = 1");
    $check_stmt->execute();
    $existing = $check_stmt->get_result()->fetch_assoc();

    if ($existing) {
        // Update existing configuration
        $update_stmt = $conn->prepare("
            UPDATE whatsapp_bot_config 
            SET phone_number_id = ?, access_token = ?, webhook_verify_token = ?, 
                business_account_id = ?, ai_api_key = ?, ai_model = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ");
        $update_stmt->bind_param("ssssssi", $phone_number_id, $access_token, $webhook_verify_token, 
                                $business_account_id, $ai_api_key, $ai_model, $existing['id']);
        
        if ($update_stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "WhatsApp bot configuration updated successfully",
                "data" => [
                    "phone_number_id" => $phone_number_id,
                    "business_account_id" => $business_account_id,
                    "ai_model" => $ai_model,
                    "webhook_url" => $SITE_URL . "/api/v1/whatsapp/webhook.php"
                ]
            ]);
        } else {
            throw new Exception("Failed to update configuration");
        }
    } else {
        // Create new configuration
        $insert_stmt = $conn->prepare("
            INSERT INTO whatsapp_bot_config 
            (phone_number_id, access_token, webhook_verify_token, business_account_id, ai_api_key, ai_model) 
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        $insert_stmt->bind_param("ssssss", $phone_number_id, $access_token, $webhook_verify_token, 
                                $business_account_id, $ai_api_key, $ai_model);
        
        if ($insert_stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "WhatsApp bot configured successfully",
                "data" => [
                    "phone_number_id" => $phone_number_id,
                    "business_account_id" => $business_account_id,
                    "ai_model" => $ai_model,
                    "webhook_url" => $SITE_URL . "/api/v1/whatsapp/webhook.php"
                ]
            ]);
        } else {
            throw new Exception("Failed to create configuration");
        }
    }

} catch (Exception $e) {
    error_log("WhatsApp bot setup error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "message" => "Server error occurred while setting up WhatsApp bot"
    ]);
}
?>
