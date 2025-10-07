<?php
header("Content-Type: application/json");
require_once '../../../config/config.php';
require_once '../../../config/auth.php';

// Authenticate user
$user_id = authenticate($conn);

// Validate request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

// Required fields
$current_password = $data['current_password'] ?? null;
$new_password = $data['new_password'] ?? null;
$confirm_password = $data['confirm_password'] ?? null;

// Validate required fields
if (!$current_password || !$new_password || !$confirm_password) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Current password, new password, and confirm password are required"]);
    exit;
}

// Validate new password strength
if (strlen($new_password) < 6) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "New password must be at least 6 characters long"]);
    exit;
}

// Validate password confirmation
if ($new_password !== $confirm_password) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "New password and confirm password do not match"]);
    exit;
}

// Check if new password is same as current
if ($current_password === $new_password) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "New password must be different from current password"]);
    exit;
}

try {
    // Get current user password
    $check_stmt = $conn->prepare("SELECT password FROM users WHERE id = ?");
    $check_stmt->bind_param("i", $user_id);
    $check_stmt->execute();
    $result = $check_stmt->get_result();
    $user = $result->fetch_assoc();

    if (!$user) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "User not found"]);
        exit;
    }

    // Verify current password
    if (!password_verify($current_password, $user['password'])) {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Current password is incorrect"]);
        exit;
    }

    // Hash the new password
    $hashed_password = password_hash($new_password, PASSWORD_BCRYPT);

    // Start transaction to update password and invalidate all JWT tokens
    $conn->begin_transaction();

    // Update user password
    $stmt = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
    $stmt->bind_param("si", $hashed_password, $user_id);

    if (!$stmt->execute()) {
        throw new Exception("Failed to update password");
    }

    // Invalidate all existing JWT tokens for security
    $delete_tokens_stmt = $conn->prepare("DELETE FROM jwt WHERE user_id = ?");
    $delete_tokens_stmt->bind_param("i", $user_id);
    $delete_tokens_stmt->execute();

    // Create notification
    $notification_stmt = $conn->prepare("INSERT INTO notifications (user_id, content, type) VALUES (?, ?, 'security')");
    $notification_content = "Password has been updated successfully. Please login again.";
    $notification_stmt->bind_param("is", $user_id, $notification_content);
    $notification_stmt->execute();

    $conn->commit();

    echo json_encode([
        "success" => true,
        "message" => "Password updated successfully. Please login again with your new password."
    ]);

} catch (Exception $e) {
    $conn->rollback();
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
}
