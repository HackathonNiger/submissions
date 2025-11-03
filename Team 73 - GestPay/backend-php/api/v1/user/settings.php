<?php
header("Content-Type: application/json");
require_once '../../../config/config.php';
require_once '../../../config/auth.php';

// Authenticate user
$user_id = authenticate($conn);

// Validate request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

// Available settings that can be updated
$allowed_settings = [
    'allow_face_payments',
    'allow_voice_payments', 
    'allow_whatsapp_paymentsments', // Note: keeping the typo from your schema
    'confirm_payment'
];

$updates = [];
$update_values = [];
$update_types = "";

// Process each setting
foreach ($allowed_settings as $setting) {
    if (isset($data[$setting])) {
        $value = $data[$setting];
        
        // Validate boolean values
        if (!is_bool($value) && !in_array($value, [0, 1, '0', '1', 'true', 'false'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Invalid value for $setting. Must be true/false or 1/0"]);
            exit;
        }
        
        // Convert to integer (0 or 1)
        $bool_value = ($value === true || $value === 1 || $value === '1' || $value === 'true') ? 1 : 0;
        
        $updates[] = "$setting = ?";
        $update_values[] = $bool_value;
        $update_types .= "i";
    }
}

// Check if any settings were provided
if (empty($updates)) {
    http_response_code(400);
    echo json_encode([
        "success" => false, 
        "message" => "No valid settings provided. Available settings: " . implode(', ', $allowed_settings)
    ]);
    exit;
}

try {
    // Build and execute update query
    $sql = "UPDATE users SET " . implode(', ', $updates) . " WHERE id = ?";
    $update_values[] = $user_id;
    $update_types .= "i";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param($update_types, ...$update_values);

    if ($stmt->execute()) {
        // Get updated user settings
        $get_stmt = $conn->prepare("SELECT allow_face_payments, allow_voice_payments, allow_whatsapp_paymentsments, confirm_payment FROM users WHERE id = ?");
        $get_stmt->bind_param("i", $user_id);
        $get_stmt->execute();
        $result = $get_stmt->get_result();
        $settings = $result->fetch_assoc();

        // Convert to boolean for response
        foreach ($settings as $key => $value) {
            $settings[$key] = (bool)$value;
        }

        // Create notification for security-related changes
        $security_settings = ['allow_face_payments', 'allow_voice_payments', 'confirm_payment'];
        $changed_security_settings = array_intersect(array_keys($data), $security_settings);
        
        if (!empty($changed_security_settings)) {
            $notification_stmt = $conn->prepare("INSERT INTO notifications (user_id, content, type) VALUES (?, ?, 'security')");
            $notification_content = "Payment security settings have been updated";
            $notification_stmt->bind_param("is", $user_id, $notification_content);
            $notification_stmt->execute();
        }

        echo json_encode([
            "success" => true,
            "message" => "Settings updated successfully",
            "data" => $settings
        ]);
    } else {
        throw new Exception("Failed to update settings");
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
}
