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
$pin = $data['pin'] ?? null;
$confirm_pin = $data['confirm_pin'] ?? null;

// Validate required fields
if (!$pin || !$confirm_pin) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "PIN and confirm PIN are required"]);
    exit;
}

// Validate PIN format (4-6 digits)
if (!preg_match('/^\d{4,6}$/', $pin)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "PIN must be 4-6 digits"]);
    exit;
}

// Validate PIN confirmation
if ($pin !== $confirm_pin) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "PIN and confirm PIN do not match"]);
    exit;
}

try {
    // Check if user already has a PIN
    $check_stmt = $conn->prepare("SELECT pin FROM users WHERE id = ?");
    $check_stmt->bind_param("i", $user_id);
    $check_stmt->execute();
    $result = $check_stmt->get_result();
    $user = $result->fetch_assoc();

    if ($user['pin']) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "PIN already exists. Use update-pin to change it"]);
        exit;
    }

    // Hash the PIN
    $hashed_pin = password_hash($pin, PASSWORD_BCRYPT);

    // Update user PIN
    $stmt = $conn->prepare("UPDATE users SET pin = ? WHERE id = ?");
    $stmt->bind_param("si", $hashed_pin, $user_id);

    if ($stmt->execute()) {
        // Create notification
        $notification_stmt = $conn->prepare("INSERT INTO notifications (user_id, content, type) VALUES (?, ?, 'security')");
        $notification_content = "Transaction PIN has been set successfully";
        $notification_stmt->bind_param("is", $user_id, $notification_content);
        $notification_stmt->execute();

        echo json_encode([
            "success" => true,
            "message" => "PIN set successfully"
        ]);
    } else {
        throw new Exception("Failed to set PIN");
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
}
