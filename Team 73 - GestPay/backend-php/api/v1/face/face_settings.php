<?php
header("Content-Type: application/json");
require_once '../../../config/config.php';
require_once '../../../config/auth.php';
require_once '../../../config/face_config.php';

// Validate request method
if (!in_array($_SERVER['REQUEST_METHOD'], ['GET', 'POST'])) {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

// Authenticate user
$user_id = authenticateUser($conn);
if (!$user_id) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get user's face payment settings
    try {
        $stmt = $conn->prepare("
            SELECT 
                id, first_name, last_name, 
                has_setup_biometric, allow_face_payments, confirm_payment,
                face_registered_at, last_face_verification, encoded_face
            FROM users 
            WHERE id = ?
        ");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $user = $stmt->get_result()->fetch_assoc();
        
        if (!$user) {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "User not found"]);
            exit;
        }
        
        // Count face embeddings
        $embedding_count = 0;
        if ($user['encoded_face']) {
            $face_data = json_decode($user['encoded_face'], true);
            $embedding_count = isset($face_data['embeddings']) ? count($face_data['embeddings']) : 0;
        }
        
        // Get recent face activity
        $activity_stmt = $conn->prepare("
            SELECT action, result, created_at 
            FROM face_recognition_logs 
            WHERE user_id = ? 
            ORDER BY created_at DESC 
            LIMIT 5
        ");
        $activity_stmt->bind_param("i", $user_id);
        $activity_stmt->execute();
        $activities = $activity_stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Face settings retrieved successfully",
            "data" => [
                "user_id" => $user_id,
                "name" => $user['first_name'] . ' ' . $user['last_name'],
                "has_setup_biometric" => (bool)$user['has_setup_biometric'],
                "allow_face_payments" => (bool)$user['allow_face_payments'],
                "confirm_payment" => (bool)$user['confirm_payment'],
                "face_registered_at" => $user['face_registered_at'],
                "last_face_verification" => $user['last_face_verification'],
                "embedding_count" => $embedding_count,
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
    // Update user's face payment settings
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
        
        // Check if user has biometric setup when enabling face payments
        if ($allow_face_payments === true) {
            $check_stmt = $conn->prepare("SELECT has_setup_biometric, encoded_face FROM users WHERE id = ?");
            $check_stmt->bind_param("i", $user_id);
            $check_stmt->execute();
            $user_check = $check_stmt->get_result()->fetch_assoc();
            
            if (!$user_check['has_setup_biometric'] || !$user_check['encoded_face']) {
                http_response_code(400);
                echo json_encode([
                    "success" => false,
                    "message" => "Cannot enable face payments. Please register your face first."
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
        
        logFaceActivity($user_id, 'settings', 'success', 
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
            "message" => "Face payment settings updated successfully",
            "data" => [
                "user_id" => $user_id,
                "has_setup_biometric" => (bool)$updated_user['has_setup_biometric'],
                "allow_face_payments" => (bool)$updated_user['allow_face_payments'],
                "confirm_payment" => (bool)$updated_user['confirm_payment']
            ]
        ]);
        
    } catch (Exception $e) {
        error_log("Face settings update error for user $user_id: " . $e->getMessage());
        logFaceActivity($user_id, 'settings', 'error', $e->getMessage(), $conn);
        
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Failed to update settings: " . $e->getMessage()
        ]);
    }
}
?>
