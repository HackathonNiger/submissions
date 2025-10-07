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
$current_pin = $data['current_pin'] ?? null;
$new_pin = $data['new_pin'] ?? null;
$confirm_pin = $data['confirm_pin'] ?? null;

// Validate required fields
if (!$current_pin || !$new_pin || !$confirm_pin) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Current PIN, new PIN, and confirm PIN are required"]);
    exit;
}

// Validate new PIN format (4-6 digits)
if (!preg_match('/^\d{4,6}$/', $new_pin)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "New PIN must be 4-6 digits"]);
    exit;
}

// Validate PIN confirmation
if ($new_pin !== $confirm_pin) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "New PIN and confirm PIN do not match"]);
    exit;
}

// Check if new PIN is same as current
if ($current_pin === $new_pin) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "New PIN must be different from current PIN"]);
    exit;
}

try {
    // Get current user PIN
    $check_stmt = $conn->prepare("SELECT pin FROM users WHERE id = ?");
    $check_stmt->bind_param("i", $user_id);
    $check_stmt->execute();
    $result = $check_stmt->get_result();
    $user = $result->fetch_assoc();

    if (!$user['pin']) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "No PIN set. Use set-pin to create one"]);
        exit;
    }

    // Verify current PIN
    if (!password_verify($current_pin, $user['pin'])) {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Current PIN is incorrect"]);
        exit;
    }

    // Hash the new PIN
    $hashed_pin = password_hash($new_pin, PASSWORD_BCRYPT);

    // Update user PIN
    $stmt = $conn->prepare("UPDATE users SET pin = ? WHERE id = ?");
    $stmt->bind_param("si", $hashed_pin, $user_id);

    if ($stmt->execute()) {
        // Create notification
        $notification_stmt = $conn->prepare("INSERT INTO notifications (user_id, content, type) VALUES (?, ?, 'security')");
        $notification_content = "Transaction PIN has been updated successfully";
        $notification_stmt->bind_param("is", $user_id, $notification_content);
        $notification_stmt->execute();

        echo json_encode([
            "success" => true,
            "message" => "PIN updated successfully"
        ]);
    } else {
        throw new Exception("Failed to update PIN");
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
}
