<?php
header("Content-Type: application/json");
require_once '../../../../config/config.php';
require_once '../../../../config/auth.php';
require_once '../../../../config/luxand_config.php';

// Validate request method
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

// Authenticate user (admin only)
$user_id = authenticate($conn);
if (!$user_id) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit;
}

// Check if user is admin
$admin_stmt = $conn->prepare("SELECT role FROM users WHERE id = ?");
$admin_stmt->bind_param("i", $user_id);
$admin_stmt->execute();
$admin_result = $admin_stmt->get_result()->fetch_assoc();

if (!$admin_result || $admin_result['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Admin access required"]);
    exit;
}

try {
    // Get pagination parameters
    $page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
    $limit = isset($_GET['limit']) ? min(100, max(10, (int)$_GET['limit'])) : 20;
    $offset = ($page - 1) * $limit;
    
    // Get search parameters
    $search = isset($_GET['search']) ? trim($_GET['search']) : '';
    $collection = isset($_GET['collection']) ? trim($_GET['collection']) : '';
    $enrolled_only = isset($_GET['enrolled_only']) ? (bool)$_GET['enrolled_only'] : false;
    
    // Build WHERE clause
    $where_conditions = [];
    $params = [];
    $types = "";
    
    if (!empty($search)) {
        $where_conditions[] = "(u.first_name LIKE ? OR u.last_name LIKE ? OR u.username LIKE ? OR u.email LIKE ?)";
        $search_param = "%$search%";
        $params = array_merge($params, [$search_param, $search_param, $search_param, $search_param]);
        $types .= "ssss";
    }
    
    if (!empty($collection)) {
        $where_conditions[] = "lp.collection = ?";
        $params[] = $collection;
        $types .= "s";
    }
    
    if ($enrolled_only) {
        $where_conditions[] = "lp.luxand_uuid IS NOT NULL";
    }
    
    $where_clause = !empty($where_conditions) ? "WHERE " . implode(" AND ", $where_conditions) : "";
    
    // Get total count
    $count_sql = "
        SELECT COUNT(DISTINCT u.id) as total
        FROM users u
        LEFT JOIN luxand_persons lp ON u.id = lp.user_id AND lp.is_active = 1
        $where_clause
    ";
    
    $count_stmt = $conn->prepare($count_sql);
    if (!empty($params)) {
        $count_stmt->bind_param($types, ...$params);
    }
    $count_stmt->execute();
    $total_users = $count_stmt->get_result()->fetch_assoc()['total'];
    
    // Get users with Luxand data
    $sql = "
        SELECT 
            u.id, u.first_name, u.last_name, u.username, u.email,
            u.has_setup_biometric, u.allow_face_payments, u.confirm_payment,
            u.face_registered_at, u.last_face_verification, u.created_at,
            lp.luxand_uuid, lp.name as luxand_name, lp.collection, 
            lp.photos_count, lp.created_at as luxand_enrolled_at,
            (SELECT COUNT(*) FROM luxand_logs ll WHERE ll.user_id = u.id) as total_verifications,
            (SELECT COUNT(*) FROM luxand_logs ll WHERE ll.user_id = u.id AND ll.result = 'success' AND ll.action = 'verify') as successful_verifications
        FROM users u
        LEFT JOIN luxand_persons lp ON u.id = lp.user_id AND lp.is_active = 1
        $where_clause
        ORDER BY u.created_at DESC
        LIMIT ? OFFSET ?
    ";
    
    $stmt = $conn->prepare($sql);
    $params[] = $limit;
    $params[] = $offset;
    $types .= "ii";
    $stmt->bind_param($types, ...$params);
    $stmt->execute();
    $users = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    
    // Format user data
    $formatted_users = [];
    foreach ($users as $user) {
        $formatted_users[] = [
            "user_id" => (int)$user['id'],
            "name" => trim($user['first_name'] . ' ' . $user['last_name']),
            "username" => $user['username'],
            "email" => $user['email'],
            "biometric_setup" => (bool)$user['has_setup_biometric'],
            "face_payments_enabled" => (bool)$user['allow_face_payments'],
            "requires_confirmation" => (bool)$user['confirm_payment'],
            "face_registered_at" => $user['face_registered_at'],
            "last_verification" => $user['last_face_verification'],
            "user_created_at" => $user['created_at'],
            "luxand" => [
                "is_enrolled" => !empty($user['luxand_uuid']),
                "uuid" => $user['luxand_uuid'],
                "name" => $user['luxand_name'],
                "collection" => $user['collection'],
                "photos_count" => (int)$user['photos_count'],
                "enrolled_at" => $user['luxand_enrolled_at']
            ],
            "statistics" => [
                "total_verifications" => (int)$user['total_verifications'],
                "successful_verifications" => (int)$user['successful_verifications'],
                "success_rate" => $user['total_verifications'] > 0 ? 
                    round(($user['successful_verifications'] / $user['total_verifications']) * 100, 2) : 0
            ]
        ];
    }
    
    // Get collection statistics
    $collections_stmt = $conn->prepare("
        SELECT collection, COUNT(*) as user_count 
        FROM luxand_persons 
        WHERE is_active = 1 
        GROUP BY collection
    ");
    $collections_stmt->execute();
    $collections = $collections_stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    
    // Get overall statistics
    $stats_stmt = $conn->prepare("
        SELECT 
            COUNT(DISTINCT u.id) as total_users,
            COUNT(DISTINCT lp.user_id) as enrolled_users,
            COUNT(DISTINCT CASE WHEN u.allow_face_payments = 1 THEN u.id END) as face_payments_enabled,
            AVG(lp.photos_count) as avg_photos_per_user
        FROM users u
        LEFT JOIN luxand_persons lp ON u.id = lp.user_id AND lp.is_active = 1
    ");
    $stats_stmt->execute();
    $overall_stats = $stats_stmt->get_result()->fetch_assoc();
    
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "message" => "Luxand users retrieved successfully",
        "data" => [
            "users" => $formatted_users,
            "pagination" => [
                "current_page" => $page,
                "total_pages" => ceil($total_users / $limit),
                "total_users" => (int)$total_users,
                "per_page" => $limit,
                "has_next" => ($page * $limit) < $total_users,
                "has_previous" => $page > 1
            ],
            "statistics" => [
                "total_users" => (int)$overall_stats['total_users'],
                "enrolled_users" => (int)$overall_stats['enrolled_users'],
                "face_payments_enabled" => (int)$overall_stats['face_payments_enabled'],
                "enrollment_rate" => $overall_stats['total_users'] > 0 ? 
                    round(($overall_stats['enrolled_users'] / $overall_stats['total_users']) * 100, 2) : 0,
                "avg_photos_per_user" => round((float)$overall_stats['avg_photos_per_user'], 1)
            ],
            "collections" => $collections,
            "filters" => [
                "search" => $search,
                "collection" => $collection,
                "enrolled_only" => $enrolled_only
            ]
        ]
    ]);
    
} catch (Exception $e) {
    error_log("Luxand admin users error: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Failed to retrieve users: " . $e->getMessage()
    ]);
}
?>
