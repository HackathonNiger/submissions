<?php
/**
 * Luxand API Configuration
 * Settings for connecting to Luxand Cloud Face Recognition API
 */

// Luxand API Configuration
$LUXAND_API_CONFIG = [
    'base_url' => 'https://api.luxand.cloud',
    'api_token' => '', // Add your Luxand API token here from https://dashboard.luxand.cloud/token
    'timeout' => 30,  // Request timeout in seconds
    'max_image_size' => 5242880,  // 5MB max image size
    'allowed_formats' => ['jpg', 'jpeg', 'png', 'webp'],
];

// Luxand Face Recognition Settings
$LUXAND_SETTINGS = [
    'store_photos' => true,  // Store photos on Luxand servers
    'check_uniqueness' => false,  // Check for unique faces and names
    'default_collection' => 'gestpay_users',  // Default collection name
    'max_photos_per_person' => 5,  // Maximum photos per person enrollment
];

/**
 * Make HTTP request to Luxand API
 */
function callLuxandAPI($endpoint, $data = null, $method = 'POST', $is_multipart = false) {
    global $LUXAND_API_CONFIG;
    
    if (empty($LUXAND_API_CONFIG['api_token'])) {
        throw new Exception("Luxand API token not configured. Please add your token to luxand_config.php");
    }
    
    $url = $LUXAND_API_CONFIG['base_url'] . $endpoint;
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, $LUXAND_API_CONFIG['timeout']);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'token: ' . $LUXAND_API_CONFIG['api_token']
    ]);
    
    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        
        if ($is_multipart) {
            // For multipart form data (file uploads)
            curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        } else if ($data) {
            // For JSON data
            curl_setopt($ch, CURLOPT_HTTPHEADER, array_merge(
                curl_getinfo($ch, CURLINFO_HEADER_OUT) ? [] : ['token: ' . $LUXAND_API_CONFIG['api_token']],
                ['Content-Type: application/json']
            ));
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }
    }
    
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    // Log the API request and response for debugging
    error_log("Luxand API Request - Endpoint: $endpoint, Method: $method, HTTP Code: $http_code");
    error_log("Luxand API Response: " . $response);
    
    if ($error) {
        error_log("Luxand API cURL Error: " . $error);
        throw new Exception("Luxand API connection error: " . $error);
    }
    
    if ($http_code < 200 || $http_code >= 300) {
        error_log("Luxand API HTTP Error - Code: $http_code, Response: " . $response);
        throw new Exception("Luxand API error: HTTP $http_code - $response");
    }
    
    $decoded = json_decode($response, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        error_log("Luxand API JSON Parse Error: " . json_last_error_msg() . ", Raw Response: " . $response);
        throw new Exception("Luxand API response parsing error: " . json_last_error_msg());
    }
    
    error_log("Luxand API Success - Decoded Response: " . json_encode($decoded));
    return $decoded;
}

/**
 * Validate image file for Luxand API
 */
function validateLuxandImageFile($file) {
    global $LUXAND_API_CONFIG;
    
    // Check file size
    if ($file['size'] > $LUXAND_API_CONFIG['max_image_size']) {
        throw new Exception("Image file too large. Maximum size: " . ($LUXAND_API_CONFIG['max_image_size'] / 1024 / 1024) . "MB");
    }
    
    // Check file type
    $file_info = pathinfo($file['name']);
    $extension = strtolower($file_info['extension'] ?? '');
    
    if (!in_array($extension, $LUXAND_API_CONFIG['allowed_formats'])) {
        throw new Exception("Invalid image format. Allowed formats: " . implode(', ', $LUXAND_API_CONFIG['allowed_formats']));
    }
    
    // Check if it's actually an image
    $image_info = getimagesize($file['tmp_name']);
    if ($image_info === false) {
        throw new Exception("Invalid image file");
    }
    
    return true;
}

/**
 * Create CURLFile for multipart upload
 */
function createLuxandCURLFile($file_path, $filename = null, $mime_type = null) {
    if (!file_exists($file_path)) {
        throw new Exception("File not found: " . $file_path);
    }
    
    if ($filename === null) {
        $filename = basename($file_path);
    }
    
    if ($mime_type === null) {
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime_type = finfo_file($finfo, $file_path);
        finfo_close($finfo);
    }
    
    return new CURLFile($file_path, $mime_type, $filename);
}

/**
 * Save Luxand person UUID to database
 */
function saveLuxandPersonUUID($user_id, $luxand_uuid, $name, $conn) {
    $stmt = $conn->prepare("
        INSERT INTO luxand_persons (user_id, luxand_uuid, name, created_at) 
        VALUES (?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE 
        luxand_uuid = VALUES(luxand_uuid), 
        name = VALUES(name), 
        updated_at = NOW()
    ");
    $stmt->bind_param("iss", $user_id, $luxand_uuid, $name);
    return $stmt->execute();
}

/**
 * Get Luxand person UUID for user
 */
function getLuxandPersonUUID($user_id, $conn) {
    $stmt = $conn->prepare("SELECT luxand_uuid FROM luxand_persons WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $person = $result->fetch_assoc();
    
    return $person ? $person['luxand_uuid'] : null;
}

/**
 * Log Luxand API activity
 */
function logLuxandActivity($user_id, $action, $result, $details, $conn) {
    $stmt = $conn->prepare("
        INSERT INTO luxand_logs 
        (user_id, action, result, details, ip_address, user_agent, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, NOW())
    ");
    
    $ip_address = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
    
    $stmt->bind_param("isssss", $user_id, $action, $result, $details, $ip_address, $user_agent);
    $stmt->execute();
}

/**
 * Check if user has Luxand face setup
 */
function userHasLuxandFaceSetup($user_id, $conn) {
    $luxand_uuid = getLuxandPersonUUID($user_id, $conn);
    return !empty($luxand_uuid);
}
?>
