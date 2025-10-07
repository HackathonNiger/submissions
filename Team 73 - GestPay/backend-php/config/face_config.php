<?php
/**
 * Face Recognition Configuration
 * Settings for connecting PHP backend to Python FastAPI service
 */

// Python FastAPI Service Configuration
$FACE_API_CONFIG = [
    'base_url' => 'http://localhost:8000',  // Change to your Python service URL
    'timeout' => 30,  // Request timeout in seconds
    'confidence_threshold' => 0.6,  // Face matching confidence threshold (0.0 - 1.0)
    'max_image_size' => 5242880,  // 5MB max image size
    'allowed_formats' => ['jpg', 'jpeg', 'png', 'webp'],
    'api_key' => null,  // Add API key if you implement authentication
];

// Face Recognition Settings
$FACE_SETTINGS = [
    'require_face_for_payments' => true,
    'allow_face_registration' => true,
    'max_faces_per_user' => 3,  // Allow multiple face encodings per user
    'face_update_interval' => 30,  // Days before suggesting face update
    'verification_attempts' => 3,  // Max verification attempts before lockout
    'lockout_duration' => 300,  // Lockout duration in seconds (5 minutes)
];

// Database field mappings
$FACE_DB_FIELDS = [
    'encoded_face' => 'encoded_face',  // JSON field storing face embeddings
    'has_setup_biometric' => 'has_setup_biometric',
    'allow_face_payments' => 'allow_face_payments',
    'face_registered_at' => 'face_registered_at',
    'last_face_verification' => 'last_face_verification',
];

/**
 * Make HTTP request to Python FastAPI service
 */
function callFaceAPI($endpoint, $data = null, $method = 'POST') {
    global $FACE_API_CONFIG;
    
    $url = $FACE_API_CONFIG['base_url'] . $endpoint;
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, $FACE_API_CONFIG['timeout']);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Accept: application/json'
    ]);
    
    if ($method === 'POST' && $data) {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }
    
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        throw new Exception("Face API connection error: " . $error);
    }
    
    if ($http_code !== 200) {
        throw new Exception("Face API error: HTTP $http_code - $response");
    }
    
    $decoded = json_decode($response, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Face API response parsing error: " . json_last_error_msg());
    }
    
    return $decoded;
}

/**
 * Convert uploaded file to base64
 */
function imageToBase64($file_path) {
    if (!file_exists($file_path)) {
        throw new Exception("Image file not found");
    }
    
    $image_data = file_get_contents($file_path);
    if ($image_data === false) {
        throw new Exception("Failed to read image file");
    }
    
    return base64_encode($image_data);
}

/**
 * Validate image file
 */
function validateImageFile($file) {
    global $FACE_API_CONFIG;
    
    // Check file size
    if ($file['size'] > $FACE_API_CONFIG['max_image_size']) {
        throw new Exception("Image file too large. Maximum size: " . ($FACE_API_CONFIG['max_image_size'] / 1024 / 1024) . "MB");
    }
    
    // Check file type
    $file_info = pathinfo($file['name']);
    $extension = strtolower($file_info['extension'] ?? '');
    
    if (!in_array($extension, $FACE_API_CONFIG['allowed_formats'])) {
        throw new Exception("Invalid image format. Allowed formats: " . implode(', ', $FACE_API_CONFIG['allowed_formats']));
    }
    
    // Check if it's actually an image
    $image_info = getimagesize($file['tmp_name']);
    if ($image_info === false) {
        throw new Exception("Invalid image file");
    }
    
    return true;
}

/**
 * Get user's stored face embeddings
 */
function getUserFaceEmbeddings($user_id, $conn) {
    $stmt = $conn->prepare("SELECT encoded_face FROM users WHERE id = ? AND encoded_face IS NOT NULL");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    
    if (!$user || !$user['encoded_face']) {
        return [];
    }
    
    $encoded_faces = json_decode($user['encoded_face'], true);
    if (!$encoded_faces) {
        return [];
    }
    
    // Convert to format expected by Python API
    $embeddings = [];
    if (isset($encoded_faces['embeddings']) && is_array($encoded_faces['embeddings'])) {
        foreach ($encoded_faces['embeddings'] as $index => $embedding) {
            $embeddings[] = [
                'user_id' => $user_id,
                'embedding' => $embedding
            ];
        }
    }
    
    return $embeddings;
}

/**
 * Get all users with face recognition enabled for verification
 */
function getAllFaceEmbeddings($conn, $limit = 100) {
    $stmt = $conn->prepare("
        SELECT id, encoded_face 
        FROM users 
        WHERE encoded_face IS NOT NULL 
        AND allow_face_payments = 1 
        AND has_setup_biometric = 1
        LIMIT ?
    ");
    $stmt->bind_param("i", $limit);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $all_embeddings = [];
    
    while ($user = $result->fetch_assoc()) {
        $encoded_faces = json_decode($user['encoded_face'], true);
        if ($encoded_faces && isset($encoded_faces['embeddings'])) {
            foreach ($encoded_faces['embeddings'] as $embedding) {
                $all_embeddings[] = [
                    'user_id' => (int)$user['id'],
                    'embedding' => $embedding
                ];
            }
        }
    }
    
    return $all_embeddings;
}

/**
 * Save face embedding to user record
 */
function saveFaceEmbedding($user_id, $embedding, $conn) {
    // Get existing embeddings
    $stmt = $conn->prepare("SELECT encoded_face FROM users WHERE id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    
    $encoded_faces = [];
    if ($user && $user['encoded_face']) {
        $encoded_faces = json_decode($user['encoded_face'], true) ?: [];
    }
    
    // Initialize embeddings array if not exists
    if (!isset($encoded_faces['embeddings'])) {
        $encoded_faces['embeddings'] = [];
    }
    
    // Add new embedding
    $encoded_faces['embeddings'][] = $embedding;
    $encoded_faces['registered_at'] = date('Y-m-d H:i:s');
    $encoded_faces['updated_at'] = date('Y-m-d H:i:s');
    
    // Limit number of embeddings per user
    global $FACE_SETTINGS;
    if (count($encoded_faces['embeddings']) > $FACE_SETTINGS['max_faces_per_user']) {
        // Remove oldest embedding
        array_shift($encoded_faces['embeddings']);
    }
    
    // Update user record
    $update_stmt = $conn->prepare("
        UPDATE users 
        SET encoded_face = ?, 
            has_setup_biometric = 1, 
            allow_face_payments = 1,
            face_registered_at = NOW()
        WHERE id = ?
    ");
    $encoded_json = json_encode($encoded_faces);
    $update_stmt->bind_param("si", $encoded_json, $user_id);
    
    return $update_stmt->execute();
}

/**
 * Check if user has face recognition set up
 */
function userHasFaceSetup($user_id, $conn) {
    $stmt = $conn->prepare("
        SELECT has_setup_biometric, allow_face_payments, encoded_face 
        FROM users 
        WHERE id = ?
    ");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    
    return $user && 
           $user['has_setup_biometric'] == 1 && 
           $user['allow_face_payments'] == 1 && 
           !empty($user['encoded_face']);
}

/**
 * Log face recognition activity
 */
function logFaceActivity($user_id, $action, $result, $details, $conn) {
    $stmt = $conn->prepare("
        INSERT INTO face_recognition_logs 
        (user_id, action, result, details, ip_address, user_agent, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, NOW())
    ");
    
    $ip_address = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
    
    $stmt->bind_param("isssss", $user_id, $action, $result, $details, $ip_address, $user_agent);
    $stmt->execute();
}
?>
