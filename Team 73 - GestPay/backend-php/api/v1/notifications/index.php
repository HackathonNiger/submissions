<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../../config/config.php';

// Set timezone
date_default_timezone_set('Africa/Lagos');
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
// Authenticate user
$user_id = authenticate($conn);

// Validate request method
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

try {
    // Get query parameters
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
    $type = isset($_GET['type']) ? $_GET['type'] : null;
    $is_read = isset($_GET['is_read']) ? (int)$_GET['is_read'] : null;

    // Validate limit
    if ($limit <= 0 || $limit > 100) {
        $limit = 20;
    }

    // Validate type
    $valid_types = ['general', 'wallet', 'security'];
    if ($type && !in_array($type, $valid_types)) {
        http_response_code(400);
        echo json_encode([
            "success" => false, 
            "message" => "Invalid type. Must be one of: " . implode(', ', $valid_types)
        ]);
        exit;
    }

    // Validate is_read
    if ($is_read !== null && !in_array($is_read, [0, 1])) {
        http_response_code(400);
        echo json_encode([
            "success" => false, 
            "message" => "Invalid is_read value. Must be 0 or 1"
        ]);
        exit;
    }

    // Build query
    $query = "SELECT id, content, type, transaction_id, is_read, created_at 
              FROM notifications 
              WHERE user_id = ?";
    $params = [$user_id];
    $param_types = "i";

    // Add type filter
    if ($type) {
        $query .= " AND type = ?";
        $params[] = $type;
        $param_types .= "s";
    }

    // Add is_read filter
    if ($is_read !== null) {
        $query .= " AND is_read = ?";
        $params[] = $is_read;
        $param_types .= "i";
    }

    // Add ordering and limit
    $query .= " ORDER BY created_at DESC LIMIT ?";
    $params[] = $limit;
    $param_types .= "i";

    // Execute query
    $stmt = $conn->prepare($query);
    $stmt->bind_param($param_types, ...$params);
    $stmt->execute();
    $result = $stmt->get_result();

    $notifications = [];
    while ($row = $result->fetch_assoc()) {
        $notifications[] = [
            'id' => (int)$row['id'],
            'content' => $row['content'],
            'type' => $row['type'],
            'transaction_id' => $row['transaction_id'] ? (int)$row['transaction_id'] : null,
            'is_read' => (bool)$row['is_read'],
            'created_at' => $row['created_at']
        ];
    }

    // Get unread count
    $unread_stmt = $conn->prepare("SELECT COUNT(*) as unread_count FROM notifications WHERE user_id = ? AND is_read = 0");
    $unread_stmt->bind_param("i", $user_id);
    $unread_stmt->execute();
    $unread_result = $unread_stmt->get_result();
    $unread_data = $unread_result->fetch_assoc();
    $unread_count = (int)$unread_data['unread_count'];

    echo json_encode([
        "success" => true,
        "data" => [
            "notifications" => $notifications,
            "unread_count" => $unread_count
        ]
    ]);

} catch (Exception $e) {
    error_log("Notifications fetch error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "message" => "Server error occurred while fetching notifications"
    ]);
}
?>
