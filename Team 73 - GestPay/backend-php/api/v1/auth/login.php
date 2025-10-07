<?php
header("Content-Type: application/json");
require_once '../../../config/config.php';
require_once '../../../config/auth.php';

// Allow only POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'] ?? null;
$password = $data['password'] ?? null;

if (!$email || !$password) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing email or password"]);
    exit;
}

// Find user
$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Invalid credentials, please try again"]);
    exit;
}

$user = $result->fetch_assoc();

if (!password_verify($password, $user['password'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Invalid credentials, please try again"]);
    exit;
}

// Update last login
$update_stmt = $conn->prepare("UPDATE users SET last_login = ?, last_ip = ? WHERE id = ?");
$last_login = time();
$last_ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$update_stmt->bind_param("isi", $last_login, $last_ip, $user['id']);
$update_stmt->execute();

// Generate JWT token
$token = generateJWT($user['id'], $conn);

if ($token) {
    http_response_code(200);
    
    // Remove password from user data
    unset($user['password']);
    
    echo json_encode([
        "success" => true,
        "message" => "Credentials validated successfully",
        "token" => $token,
        "data" => $user
    ]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Failed to create session"]);
}
