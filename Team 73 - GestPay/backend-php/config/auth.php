<?php
// auth.php
header("Content-Type: application/json");

function authenticate($conn) {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';

    if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Unauthorized - No token provided"]);
        exit;
    }

    $token = $matches[1];

    // Use jwt table instead of sessions table
    $stmt = $conn->prepare("SELECT user_id, expires_at FROM jwt WHERE token = ?");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Unauthorized - Invalid token"]);
        exit;
    }

    $jwt_data = $result->fetch_assoc();
    if ($jwt_data['expires_at'] && strtotime($jwt_data['expires_at']) < time()) {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Unauthorized - Token expired"]);
        exit;
    }

    return $jwt_data['user_id'];
}

function generateJWT($user_id, $conn) {
    $token = bin2hex(random_bytes(32));
    $expires_at = date("Y-m-d H:i:s", strtotime("+30 days"));
    
    // Clean up old tokens for this user
    $cleanup_stmt = $conn->prepare("DELETE FROM jwt WHERE user_id = ? AND expires_at < NOW()");
    $cleanup_stmt->bind_param("i", $user_id);
    $cleanup_stmt->execute();
    
    // Insert new token
    $stmt = $conn->prepare("INSERT INTO jwt (user_id, token, expires_at) VALUES (?, ?, ?)");
    $stmt->bind_param("iss", $user_id, $token, $expires_at);
    
    if ($stmt->execute()) {
        return $token;
    }
    
    return false;
}
