<?php
header("Content-Type: application/json");
require_once '../../../config/config.php';
require_once '../../../config/auth.php';
require_once '../../../config/face_config.php';

// Validate request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
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

try {
    // Handle file upload or base64 data
    $image_base64 = null;
    
    if (isset($_FILES['face_image']) && $_FILES['face_image']['error'] === UPLOAD_ERR_OK) {
        // Handle file upload
        $file = $_FILES['face_image'];
        
        // Validate image file
        validateImageFile($file);
        
        // Convert to base64
        $image_base64 = imageToBase64($file['tmp_name']);
        
    } else {
        // Handle JSON data with base64 image
        $input_data = json_decode(file_get_contents("php://input"), true);
        
        if (!$input_data || !isset($input_data['image_base64'])) {
            http_response_code(400);
            echo json_encode([
                "success" => false, 
                "message" => "Face image is required. Provide either 'face_image' file or 'image_base64' in JSON."
            ]);
            exit;
        }
        
        $image_base64 = $input_data['image_base64'];
    }
    
    if (!$image_base64) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "No valid image provided"]);
        exit;
    }
    
    // Check if user already has face recognition set up
    if (userHasFaceSetup($user_id, $conn)) {
        // Allow re-registration but warn user
        $existing_embeddings = getUserFaceEmbeddings($user_id, $conn);
        if (count($existing_embeddings) >= $FACE_SETTINGS['max_faces_per_user']) {
            echo json_encode([
                "success" => false, 
                "message" => "Maximum number of face registrations reached. Please contact support to reset."
            ]);
            exit;
        }
    }
    
    // Call Python FastAPI to extract face embedding
    $face_api_request = [
        'image_base64' => $image_base64
    ];
    
    $face_api_response = callFaceAPI('/register-face', $face_api_request);
    
    if (!$face_api_response['success']) {
        logFaceActivity($user_id, 'register', 'failed', $face_api_response['message'], $conn);
        
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => $face_api_response['message']
        ]);
        exit;
    }
    
    $embedding = $face_api_response['embedding'];
    
    if (!$embedding || !is_array($embedding)) {
        logFaceActivity($user_id, 'register', 'failed', 'Invalid embedding received from face API', $conn);
        
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Failed to process face image. Please try again."
        ]);
        exit;
    }
    
    // Save embedding to database
    $save_result = saveFaceEmbedding($user_id, $embedding, $conn);
    
    if (!$save_result) {
        logFaceActivity($user_id, 'register', 'failed', 'Database save failed', $conn);
        
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Failed to save face registration. Please try again."
        ]);
        exit;
    }
    
    // Log successful registration
    logFaceActivity($user_id, 'register', 'success', 'Face registered successfully', $conn);
    
    // Get updated user info
    $user_stmt = $conn->prepare("
        SELECT first_name, last_name, has_setup_biometric, allow_face_payments, face_registered_at
        FROM users 
        WHERE id = ?
    ");
    $user_stmt->bind_param("i", $user_id);
    $user_stmt->execute();
    $user_info = $user_stmt->get_result()->fetch_assoc();
    
    // Return success response
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "message" => "Face registered successfully! You can now use face payments.",
        "data" => [
            "user_id" => $user_id,
            "name" => $user_info['first_name'] . ' ' . $user_info['last_name'],
            "has_setup_biometric" => (bool)$user_info['has_setup_biometric'],
            "allow_face_payments" => (bool)$user_info['allow_face_payments'],
            "registered_at" => $user_info['face_registered_at'],
            "embedding_count" => count(getUserFaceEmbeddings($user_id, $conn))
        ]
    ]);
    
} catch (Exception $e) {
    // Log error
    error_log("Face registration error for user $user_id: " . $e->getMessage());
    logFaceActivity($user_id, 'register', 'error', $e->getMessage(), $conn);
    
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Face registration failed: " . $e->getMessage()
    ]);
}
?>
