<?php
header("Content-Type: application/json");
require_once '../../../config/config.php';
require_once '../../../config/auth.php';
require_once '../../../config/face_config.php';

// Validate request method
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

// Authenticate user (admin only for this endpoint)
$user_id = authenticateUser($conn);
if (!$user_id) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit;
}

// Check if user is admin
$admin_stmt = $conn->prepare("SELECT role FROM users WHERE id = ?");
$admin_stmt->bind_param("i", $user_id);
$admin_stmt->execute();
$user_role = $admin_stmt->get_result()->fetch_assoc()['role'] ?? 'user';

if ($user_role !== 'admin') {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Admin access required"]);
    exit;
}

try {
    // Get query parameters
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
    $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
    $search = $_GET['search'] ?? '';
    
    // Validate limit
    if ($limit > 100) $limit = 100;
    if ($limit < 1) $limit = 50;
    
    // Build query
    $where_clause = "WHERE u.encoded_face IS NOT NULL AND u.has_setup_biometric = 1";
    $params = [];
    $types = "";
    
    if ($search) {
        $where_clause .= " AND (u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ? OR u.phone_number LIKE ?)";
        $search_param = "%$search%";
        $params = [$search_param, $search_param, $search_param, $search_param];
        $types = "ssss";
    }
    
    // Get total count
    $count_sql = "SELECT COUNT(*) as total FROM users u $where_clause";
    if ($search) {
        $count_stmt = $conn->prepare($count_sql);
        $count_stmt->bind_param($types, ...$params);
        $count_stmt->execute();
    } else {
        $count_stmt = $conn->prepare($count_sql);
        $count_stmt->execute();
    }
    $total_count = $count_stmt->get_result()->fetch_assoc()['total'];
    
    // Get users with face recognition
    $sql = "
        SELECT 
            u.id,
            u.first_name,
            u.last_name,
            u.email,
            u.phone_number,
            u.allow_face_payments,
            u.face_registered_at,
            u.last_face_verification,
            u.encoded_face,
            u.created_at
        FROM users u 
        $where_clause
        ORDER BY u.face_registered_at DESC
        LIMIT ? OFFSET ?
    ";
    
    $stmt = $conn->prepare($sql);
    if ($search) {
        $params[] = $limit;
        $params[] = $offset;
        $types .= "ii";
        $stmt->bind_param($types, ...$params);
    } else {
        $stmt->bind_param("ii", $limit, $offset);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    
    $users = [];
    while ($user = $result->fetch_assoc()) {
        // Parse encoded face data
        $face_data = json_decode($user['encoded_face'], true);
        $embedding_count = 0;
        $registered_at = null;
        
        if ($face_data) {
            $embedding_count = isset($face_data['embeddings']) ? count($face_data['embeddings']) : 0;
            $registered_at = $face_data['registered_at'] ?? null;
        }
        
        $users[] = [
            "id" => (int)$user['id'],
            "name" => $user['first_name'] . ' ' . $user['last_name'],
            "email" => $user['email'],
            "phone_number" => $user['phone_number'],
            "allow_face_payments" => (bool)$user['allow_face_payments'],
            "embedding_count" => $embedding_count,
            "face_registered_at" => $user['face_registered_at'],
            "last_face_verification" => $user['last_face_verification'],
            "account_created_at" => $user['created_at']
        ];
    }
    
    // Calculate pagination info
    $total_pages = ceil($total_count / $limit);
    $current_page = floor($offset / $limit) + 1;
    
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "message" => "Users with face recognition retrieved successfully",
        "data" => [
            "users" => $users,
            "pagination" => [
                "total_count" => (int)$total_count,
                "current_page" => $current_page,
                "total_pages" => $total_pages,
                "limit" => $limit,
                "offset" => $offset,
                "has_next" => $current_page < $total_pages,
                "has_previous" => $current_page > 1
            ]
        ]
    ]);
    
} catch (Exception $e) {
    error_log("Get user faces error: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Failed to retrieve users: " . $e->getMessage()
    ]);
}
?>
