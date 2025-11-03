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
    // Get user information for person name
    $user_stmt = $conn->prepare("SELECT first_name, last_name, username FROM users WHERE id = ?");
    $user_stmt->bind_param("i", $user_id);
    $user_stmt->execute();
    $user_info = $user_stmt->get_result()->fetch_assoc();
    
    if (!$user_info) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "User not found"]);
        exit;
    }
    
    $person_name = trim($user_info['first_name'] . ' ' . $user_info['last_name']);
    if (empty($person_name)) {
        $person_name = $user_info['username'];
    }
    
    // Handle multiple file uploads or single file
    $uploaded_files = [];
    
    if (isset($_FILES['photos'])) {
        // Handle multiple files
        if (is_array($_FILES['photos']['tmp_name'])) {
            for ($i = 0; $i < count($_FILES['photos']['tmp_name']); $i++) {
                if ($_FILES['photos']['error'][$i] === UPLOAD_ERR_OK) {
                    $file = [
                        'name' => $_FILES['photos']['name'][$i],
                        'tmp_name' => $_FILES['photos']['tmp_name'][$i],
                        'size' => $_FILES['photos']['size'][$i],
                        'error' => $_FILES['photos']['error'][$i]
                    ];
                    validateLuxandImageFile($file);
                    $uploaded_files[] = $file;
                }
            }
        } else {
            // Single file
            if ($_FILES['photos']['error'] === UPLOAD_ERR_OK) {
                validateLuxandImageFile($_FILES['photos']);
                $uploaded_files[] = $_FILES['photos'];
            }
        }
    }
    
    if (empty($uploaded_files)) {
        http_response_code(400);
        echo json_encode([
            "success" => false, 
            "message" => "At least one photo is required for enrollment"
        ]);
        exit;
    }
    
    // Check if user already has Luxand enrollment
    $existing_uuid = getLuxandPersonUUID($user_id, $conn);
    if ($existing_uuid) {
        logLuxandActivity($user_id, 'enroll', 'failed', 'User already enrolled with UUID: ' . $existing_uuid, $conn);
        
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "User already enrolled in Luxand. Use verification endpoint instead.",
            "data" => ["luxand_uuid" => $existing_uuid]
        ]);
        exit;
    }
    
    // Prepare multipart form data for Luxand API
    global $LUXAND_SETTINGS;
    
    $post_fields = [
        'name' => $person_name,
        'store' => $LUXAND_SETTINGS['store_photos'] ? '1' : '0',
        'collections' => $LUXAND_SETTINGS['default_collection'],
        'unique' => $LUXAND_SETTINGS['check_uniqueness'] ? '1' : '0'
    ];
    
    // Add photos to form data
    foreach ($uploaded_files as $index => $file) {
        $curl_file = createLuxandCURLFile($file['tmp_name'], 'photo_' . $index . '.jpg', 'image/jpeg');
        $post_fields['photos' . ($index > 0 ? '[]' : '')] = $curl_file;
    }
    
    // Call Luxand API to enroll person
    $luxand_response = callLuxandAPI('/v2/person', $post_fields, 'POST', true);
    
    if (!isset($luxand_response['uuid'])) {
        logLuxandActivity($user_id, 'enroll', 'failed', 'No UUID returned from Luxand API', $conn);
        
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Failed to enroll person. No UUID received from Luxand API."
        ]);
        exit;
    }
    
    $luxand_uuid = $luxand_response['uuid'];
    
    // Save Luxand UUID to database
    $save_result = saveLuxandPersonUUID($user_id, $luxand_uuid, $person_name, $conn);
    
    if (!$save_result) {
        logLuxandActivity($user_id, 'enroll', 'failed', 'Database save failed for UUID: ' . $luxand_uuid, $conn);
        
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Failed to save enrollment data. Please try again."
        ]);
        exit;
    }
    
    // Update user biometric settings
    $update_stmt = $conn->prepare("
        UPDATE users 
        SET has_setup_biometric = 1, 
            allow_face_payments = 1,
            face_registered_at = NOW()
        WHERE id = ?
    ");
    $update_stmt->bind_param("i", $user_id);
    $update_stmt->execute();
    
    // Log successful enrollment
    logLuxandActivity($user_id, 'enroll', 'success', 
        'Person enrolled successfully with UUID: ' . $luxand_uuid . ', Photos: ' . count($uploaded_files), $conn);
    
    // Return success response
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "message" => "Person enrolled successfully in Luxand! You can now use face payments.",
        "data" => [
            "user_id" => $user_id,
            "name" => $person_name,
            "luxand_uuid" => $luxand_uuid,
            "photos_uploaded" => count($uploaded_files),
            "collection" => $LUXAND_SETTINGS['default_collection'],
            "enrolled_at" => date('Y-m-d H:i:s'),
            "luxand_response" => $luxand_response
        ]
    ]);
    
} catch (Exception $e) {
    // Log error
    error_log("Luxand enrollment error for user $user_id: " . $e->getMessage());
    logLuxandActivity($user_id, 'enroll', 'error', $e->getMessage(), $conn);
    
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Enrollment failed: " . $e->getMessage()
    ]);
}
?>
