<?php
header("Content-Type: application/json");
require_once '../../../config/config.php';
require_once '../../../config/face_config.php';

// Validate request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

try {
    // Handle file upload or base64 data
    $image_base64 = null;
    $merchant_id = null;
    $amount = null;
    $description = 'Face payment verification';
    
    if (isset($_FILES['face_image']) && $_FILES['face_image']['error'] === UPLOAD_ERR_OK) {
        // Handle multipart form data
        $file = $_FILES['face_image'];
        validateImageFile($file);
        $image_base64 = imageToBase64($file['tmp_name']);
        
        // Get additional parameters from form
        $merchant_id = $_POST['merchant_id'] ?? null;
        $amount = $_POST['amount'] ?? null;
        $description = $_POST['description'] ?? $description;
        
    } else {
        // Handle JSON data
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
        $merchant_id = $input_data['merchant_id'] ?? null;
        $amount = $input_data['amount'] ?? null;
        $description = $input_data['description'] ?? $description;
    }
    
    // Validate required fields
    if (!$image_base64) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Face image is required"]);
        exit;
    }
    
    if ($amount !== null && (!is_numeric($amount) || $amount <= 0)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Invalid amount"]);
        exit;
    }
    
    // Get all stored face embeddings for verification
    $stored_embeddings = getAllFaceEmbeddings($conn);
    
    if (empty($stored_embeddings)) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "No users with face recognition enabled found"
        ]);
        exit;
    }
    
    // Call Python FastAPI to verify face
    $face_api_request = [
        'image_base64' => $image_base64,
        'stored_embeddings' => $stored_embeddings,
        'confidence_threshold' => $FACE_API_CONFIG['confidence_threshold']
    ];
    
    $face_api_response = callFaceAPI('/verify-face', $face_api_request);
    
    if (!$face_api_response['match']) {
        // Log failed verification attempt
        logFaceActivity(null, 'verify', 'failed', 
            "No match found. Confidence: " . ($face_api_response['confidence'] ?? 0), $conn);
        
        http_response_code(401);
        echo json_encode([
            "success" => false,
            "message" => $face_api_response['message'],
            "confidence" => $face_api_response['confidence'] ?? 0
        ]);
        exit;
    }
    
    $verified_user_id = $face_api_response['user_id'];
    $confidence = $face_api_response['confidence'];
    
    // Get user details
    $user_stmt = $conn->prepare("
        SELECT id, first_name, last_name, balance, allow_face_payments, 
               has_setup_biometric, confirm_payment
        FROM users 
        WHERE id = ? AND allow_face_payments = 1 AND has_setup_biometric = 1
    ");
    $user_stmt->bind_param("i", $verified_user_id);
    $user_stmt->execute();
    $user_result = $user_stmt->get_result();
    $user = $user_result->fetch_assoc();
    
    if (!$user) {
        logFaceActivity($verified_user_id, 'verify', 'failed', 'User not found or face payments disabled', $conn);
        
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "User not found or face payments not enabled"
        ]);
        exit;
    }
    
    // Check if amount is provided and user has sufficient balance
    if ($amount !== null && $user['balance'] < $amount) {
        logFaceActivity($verified_user_id, 'verify', 'failed', 
            "Insufficient balance. Required: $amount, Available: " . $user['balance'], $conn);
        
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Insufficient balance",
            "data" => [
                "required_amount" => $amount,
                "available_balance" => $user['balance']
            ]
        ]);
        exit;
    }
    
    // Update last face verification timestamp
    $update_stmt = $conn->prepare("UPDATE users SET last_face_verification = NOW() WHERE id = ?");
    $update_stmt->bind_param("i", $verified_user_id);
    $update_stmt->execute();
    
    // Log successful verification
    logFaceActivity($verified_user_id, 'verify', 'success', 
        "Face verified with confidence: $confidence", $conn);
    
    // Prepare response data
    $response_data = [
        "success" => true,
        "message" => "Face verification successful",
        "match" => true,
        "confidence" => $confidence,
        "data" => [
            "user_id" => $verified_user_id,
            "name" => $user['first_name'] . ' ' . $user['last_name'],
            "balance" => $user['balance'],
            "requires_confirmation" => (bool)$user['confirm_payment']
        ]
    ];
    
    // If merchant_id is provided, get merchant info
    if ($merchant_id) {
        $merchant_stmt = $conn->prepare("SELECT name, type, category FROM merchants WHERE id = ?");
        $merchant_stmt->bind_param("i", $merchant_id);
        $merchant_stmt->execute();
        $merchant_result = $merchant_stmt->get_result();
        $merchant = $merchant_result->fetch_assoc();
        
        if ($merchant) {
            $response_data['data']['merchant'] = $merchant;
        }
    }
    
    // If amount is provided, include payment readiness info
    if ($amount !== null) {
        $response_data['data']['payment'] = [
            "amount" => $amount,
            "description" => $description,
            "can_proceed" => $user['balance'] >= $amount,
            "requires_confirmation" => (bool)$user['confirm_payment']
        ];
    }
    
    http_response_code(200);
    echo json_encode($response_data);
    
} catch (Exception $e) {
    // Log error
    error_log("Face verification error: " . $e->getMessage());
    logFaceActivity(null, 'verify', 'error', $e->getMessage(), $conn);
    
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Face verification failed: " . $e->getMessage()
    ]);
}
?>
