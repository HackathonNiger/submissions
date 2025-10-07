<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../../config/config.php';
function authenticate($conn) {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['Authorization'] ?? '';

    if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Unauthorized - No token provided"]);
        exit;
    }

    $token = $matches[1];

    // Use jwt table instead of sessions table
    $stmt = $conn->prepare("SELECT user_id, expires_at FROM jwt WHERE token = ?");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Unauthorized - Invalid token"]);
        exit;
    }

    $jwt_data = $result->fetch_assoc();
    if ($jwt_data['expires_at'] && strtotime($jwt_data['expires_at']) < time()) {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Unauthorized - Token expired"]);
        exit;
    }

    return $jwt_data['user_id'];
}

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
    // Get notification ID from URL path
    $request_uri = $_SERVER['REQUEST_URI'];
    $path_parts = explode('/', trim($request_uri, '/'));
    
    // Find the notification ID in the URL path
    // Expected format: /gestpay/api/v1/notifications/{id}/read
    $notification_id = null;
    for ($i = 0; $i < count($path_parts); $i++) {
        if ($path_parts[$i] === 'notifications' && isset($path_parts[$i + 1]) && is_numeric($path_parts[$i + 1])) {
            $notification_id = (int)$path_parts[$i + 1];
            break;
        }
    }

    if (!$notification_id) {
        http_response_code(400);
        echo json_encode([
            "success" => false, 
            "message" => "Invalid notification ID"
        ]);
        exit;
    }

    // Check if notification exists and belongs to the user
    $check_stmt = $conn->prepare("SELECT id, is_read FROM notifications WHERE id = ? AND user_id = ?");
    $check_stmt->bind_param("ii", $notification_id, $user_id);
    $check_stmt->execute();
    $check_result = $check_stmt->get_result();

    if ($check_result->num_rows === 0) {
        http_response_code(404);
        echo json_encode([
            "success" => false, 
            "message" => "Notification not found"
        ]);
        exit;
    }

    $notification = $check_result->fetch_assoc();

    // Check if already read
    if ($notification['is_read']) {
        echo json_encode([
            "success" => true,
            "message" => "Notification already marked as read"
        ]);
        exit;
    }

    // Mark notification as read
    $update_stmt = $conn->prepare("UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?");
    $update_stmt->bind_param("ii", $notification_id, $user_id);
    
    if ($update_stmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Notification marked as read"
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false, 
            "message" => "Failed to mark notification as read"
        ]);
    }

} catch (Exception $e) {
    error_log("Mark notification as read error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "message" => "Server error occurred while marking notification as read"
    ]);
}
?>
