<?php
// api/v1/auth/verify-token.php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../../config/config.php';

// Set timezone
date_default_timezone_set('Africa/Lagos');

// Get token from Authorization header
$headers = apache_request_headers();
$auth_header = $headers['Authorization'] ?? '';

if (!preg_match('/Bearer\s(\S+)/', $auth_header, $matches)) {
    http_response_code(401);
    echo json_encode([
        'success' => false, 
        'message' => 'Authorization header missing or invalid format. Use: Bearer YOUR_TOKEN'
    ]);
    exit;
}

$token = $matches[1];

try {
    // Verify token exists and is not expired
    $stmt = $conn->prepare("
        SELECT j.id, j.user_id, j.expires_at, j.created_at,
               u.id as user_id, u.first_name, u.last_name, u.username, u.email, 
               u.balance, u.role, u.phone_number, u.created_at as user_created_at
        FROM jwt j 
        JOIN users u ON j.user_id = u.id 
        WHERE j.token = ? AND j.expires_at > NOW()
    ");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();
    $token_data = $result->fetch_assoc();
    $stmt->close();

    if (!$token_data) {
        // Check if token exists but is expired
        $expired_stmt = $conn->prepare("SELECT expires_at FROM jwt WHERE token = ?");
        $expired_stmt->bind_param("s", $token);
        $expired_stmt->execute();
        $expired_result = $expired_stmt->get_result();
        $expired_token = $expired_result->fetch_assoc();
        $expired_stmt->close();

        if ($expired_token) {
            http_response_code(401);
            echo json_encode([
                'success' => false, 
                'message' => 'Token has expired. Please login again.',
                'error_code' => 'TOKEN_EXPIRED'
            ]);
        } else {
            http_response_code(401);
            echo json_encode([
                'success' => false, 
                'message' => 'Invalid token. Please login again.',
                'error_code' => 'INVALID_TOKEN'
            ]);
        }
        exit;
    }

    // Token is valid, return success response
    echo json_encode([
        'success' => true,
        'message' => 'Token is valid',
        'data' => [
            'user_id' => (int)$token_data['user_id'],
            'expires_at' => $token_data['expires_at'],
            'user' => [
                'id' => (int)$token_data['user_id'],
                'first_name' => $token_data['first_name'],
                'last_name' => $token_data['last_name'],
                'username' => $token_data['username'],
                'email' => $token_data['email'],
                'balance' => $token_data['balance'],
                'role' => $token_data['role'],
                'phone_number' => $token_data['phone_number'],
                'created_at' => $token_data['user_created_at']
            ]
        ]
    ]);

} catch (Exception $e) {
    error_log("Token verification error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Server error occurred while verifying token',
        'error_code' => 'SERVER_ERROR'
    ]);
}
