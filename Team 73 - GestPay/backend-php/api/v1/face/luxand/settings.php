<?php
header("Content-Type: application/json");
require_once '../../../../config/config.php';
require_once '../../../../config/auth.php';
require_once '../../../../config/luxand_config.php';

// Validate request method
if (!in_array($_SERVER['REQUEST_METHOD'], ['GET', 'POST'])) {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

// Authenticate user
$user_id = authenticate($conn);
if (!$user_id) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get user's Luxand face settings
    try {
        $stmt = $conn->prepare("
            SELECT 
                u.id, u.first_name, u.last_name, 
                u.has_setup_biometric, u.allow_face_payments, u.confirm_payment,
                u.face_registered_at, u.last_face_verification,
                lp.luxand_uuid, lp.name as luxand_name, lp.collection, 
                lp.photos_count, lp.created_at as luxand_enrolled_at
            FROM users u
            LEFT JOIN luxand_persons lp ON u.id = lp.user_id AND lp.is_active = 1
            WHERE u.id = ?
        ");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $user = $stmt->get_result()->fetch_assoc();
        
        if (!$user) {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "User not found"]);
            exit;
        }
        
        // Get recent Luxand activity
        $activity_stmt = $conn->prepare("
            SELECT action, result, confidence, details, created_at 
            FROM luxand_logs 
            WHERE user_id = ? 
            ORDER BY created_at DESC 
            LIMIT 10
        ");
        $activity_stmt->bind_param("i", $user_id);
        $activity_stmt->execute();
        $activities = $activity_stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        
        // Check if Luxand is configured
        global $LUXAND_API_CONFIG;
        $luxand_configured = !empty($LUXAND_API_CONFIG['api_token']);
        
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Luxand face settings retrieved successfully",
            "data" => [
                "user_id" => $user_id,
                "name" => $user['first_name'] . ' ' . $user['last_name'],
                "has_setup_biometric" => (bool)$user['has_setup_biometric'],
                "allow_face_payments" => (bool)$user['allow_face_payments'],
                "confirm_payment" => (bool)$user['confirm_payment'],
                "face_registered_at" => $user['face_registered_at'],
                "last_face_verification" => $user['last_face_verification'],
                "luxand" => [
                    "is_enrolled" => !empty($user['luxand_uuid']),
                    "uuid" => $user['luxand_uuid'],
                    "name" => $user['luxand_name'],
                    "collection" => $user['collection'],
                    "photos_count" => (int)$user['photos_count'],
                    "enrolled_at" => $user['luxand_enrolled_at'],
                    "api_configured" => $luxand_configured
                ],
                "recent_activity" => $activities
            ]
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Failed to retrieve settings: " . $e->getMessage()
        ]);
    }
    
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Update user's Luxand face payment settings
    try {
        $input_data = json_decode(file_get_contents("php://input"), true);
        
        if (!$input_data) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Invalid JSON data"]);
            exit;
        }
        
        $allow_face_payments = isset($input_data['allow_face_payments']) ? 
            (bool)$input_data['allow_face_payments'] : null;
        $confirm_payment = isset($input_data['confirm_payment']) ? 
            (bool)$input_data['confirm_payment'] : null;
        
        // Build update query dynamically
        $updates = [];
        $params = [];
        $types = "";
        
        if ($allow_face_payments !== null) {
            $updates[] = "allow_face_payments = ?";
            $params[] = $allow_face_payments ? 1 : 0;
            $types .= "i";
        }
        
        if ($confirm_payment !== null) {
            $updates[] = "confirm_payment = ?";
            $params[] = $confirm_payment ? 1 : 0;
            $types .= "i";
        }
        
        if (empty($updates)) {
            http_response_code(400);
            echo json_encode([
                "success" => false, 
                "message" => "No valid settings provided to update"
            ]);
            exit;
        }
        
        // Check if user has Luxand enrollment when enabling face payments
        if ($allow_face_payments === true) {
            $luxand_uuid = getLuxandPersonUUID($user_id, $conn);
            if (!$luxand_uuid) {
                http_response_code(400);
                echo json_encode([
                    "success" => false,
                    "message" => "Cannot enable face payments. Please enroll in Luxand first using the enroll_person endpoint."
                ]);
                exit;
            }
        }
        
        // Update user settings
        $params[] = $user_id;
        $types .= "i";
        
        $sql = "UPDATE users SET " . implode(", ", $updates) . " WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param($types, ...$params);
        
        if (!$stmt->execute()) {
            throw new Exception("Failed to update settings");
        }
        
        // Log the settings change
        $changes = [];
        if ($allow_face_payments !== null) {
            $changes[] = "allow_face_payments=" . ($allow_face_payments ? 'true' : 'false');
        }
        if ($confirm_payment !== null) {
            $changes[] = "confirm_payment=" . ($confirm_payment ? 'true' : 'false');
        }
        
        logLuxandActivity($user_id, 'update', 'success', 
            'Settings updated: ' . implode(', ', $changes), $conn);
        
        // Get updated settings
        $updated_stmt = $conn->prepare("
            SELECT has_setup_biometric, allow_face_payments, confirm_payment 
            FROM users WHERE id = ?
        ");
        $updated_stmt->bind_param("i", $user_id);
        $updated_stmt->execute();
        $updated_user = $updated_stmt->get_result()->fetch_assoc();
        
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Luxand face payment settings updated successfully",
            "data" => [
                "user_id" => $user_id,
                "has_setup_biometric" => (bool)$updated_user['has_setup_biometric'],
                "allow_face_payments" => (bool)$updated_user['allow_face_payments'],
                "confirm_payment" => (bool)$updated_user['confirm_payment']
            ]
        ]);
        
    } catch (Exception $e) {
        error_log("Luxand settings update error for user $user_id: " . $e->getMessage());
        logLuxandActivity($user_id, 'update', 'error', $e->getMessage(), $conn);
        
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Failed to update settings: " . $e->getMessage()
        ]);
    }
}
?>
