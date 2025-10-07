<?php
header("Content-Type: application/json");
require_once '../../../../config/config.php';
require_once '../../../../config/auth.php';
require_once '../../../../config/luxand_config.php';

// Validate request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
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

try {
    // Get user's Luxand UUID
    $luxand_uuid = getLuxandPersonUUID($user_id, $conn);
    
    if (!$luxand_uuid) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "User not enrolled in Luxand. Please enroll first using the enroll_person endpoint."
        ]);
        exit;
    }
    
    // Handle file upload
    $uploaded_file = null;
    
    if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
        // Validate image file
        validateLuxandImageFile($_FILES['photo']);
        $uploaded_file = $_FILES['photo'];
    } else {
        http_response_code(400);
        echo json_encode([
            "success" => false, 
            "message" => "Photo is required for verification"
        ]);
        exit;
    }
    
    // Check user's face payment settings
    $settings_stmt = $conn->prepare("
        SELECT allow_face_payments, confirm_payment, has_setup_biometric 
        FROM users 
        WHERE id = ?
    ");
    $settings_stmt->bind_param("i", $user_id);
    $settings_stmt->execute();
    $user_settings = $settings_stmt->get_result()->fetch_assoc();
    
    if (!$user_settings['allow_face_payments'] || !$user_settings['has_setup_biometric']) {
        logLuxandActivity($user_id, 'verify', 'failed', 'Face payments not enabled for user', $conn);
        
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Face payments are not enabled for this user. Please enable in settings."
        ]);
        exit;
    }
    
    // Prepare multipart form data for Luxand API
    $post_fields = [
        'photo' => createLuxandCURLFile($uploaded_file['tmp_name'], 'verification_photo.jpg', 'image/jpeg')
    ];
    
    // Call Luxand API to verify person
    $endpoint = '/photo/verify/' . $luxand_uuid;
    $luxand_response = callLuxandAPI($endpoint, $post_fields, 'POST', true);
    
    // Parse Luxand response
    $is_verified = false;
    $confidence = 0.0;
    $verification_details = '';
    
    if (isset($luxand_response['status'])) {
        $is_verified = ($luxand_response['status'] === 'success' || $luxand_response['status'] === 'match');
        
        if (isset($luxand_response['confidence'])) {
            $confidence = (float)$luxand_response['confidence'];
        }
        
        if (isset($luxand_response['message'])) {
            $verification_details = $luxand_response['message'];
        }
    } else if (isset($luxand_response['match'])) {
        $is_verified = (bool)$luxand_response['match'];
        if (isset($luxand_response['similarity'])) {
            $confidence = (float)$luxand_response['similarity'];
        }
    }
    
    // Update last verification timestamp
    if ($is_verified) {
        $update_stmt = $conn->prepare("UPDATE users SET last_face_verification = NOW() WHERE id = ?");
        $update_stmt->bind_param("i", $user_id);
        $update_stmt->execute();
    }
    
    // Log verification attempt
    $log_details = sprintf(
        'Verification %s. Confidence: %.2f. UUID: %s. Details: %s',
        $is_verified ? 'successful' : 'failed',
        $confidence,
        $luxand_uuid,
        $verification_details
    );
    
    logLuxandActivity($user_id, 'verify', $is_verified ? 'success' : 'failed', $log_details, $conn);
    
    // Prepare response
    $response_data = [
        "user_id" => $user_id,
        "luxand_uuid" => $luxand_uuid,
        "verified" => $is_verified,
        "confidence" => $confidence,
        "verification_time" => date('Y-m-d H:i:s'),
        "requires_confirmation" => (bool)$user_settings['confirm_payment'],
        "luxand_response" => $luxand_response
    ];
    
    if ($is_verified) {
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Face verification successful!",
            "data" => $response_data
        ]);
    } else {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Face verification failed. " . $verification_details,
            "data" => $response_data
        ]);
    }
    
} catch (Exception $e) {
    // Log error
    error_log("Luxand verification error for user $user_id: " . $e->getMessage());
    logLuxandActivity($user_id, 'verify', 'error', $e->getMessage(), $conn);
    
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Verification failed: " . $e->getMessage()
    ]);
}
?>
