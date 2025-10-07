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

// Required fields
$first_name = $data['first_name'] ?? null;
$last_name = $data['last_name'] ?? null;
$phone_number = $data['phone_number'] ?? null;
$password = $data['password'] ?? null;
$role = $data['role'] ?? 'user'; // Default to 'user'

// Merchant/Business fields (required for merchants)
$business_name = $data['business_name'] ?? null;
$business_category = $data['business_category'] ?? null;
$business_type = $data['business_type'] ?? null;
$business_address = $data['business_address'] ?? null;
$business_phone = $data['business_phone'] ?? null;
$business_website = $data['business_website'] ?? null;
$business_estimated_revenue = $data['business_estimated_revenue'] ?? null;
$business_description = $data['business_description'] ?? null;

// Validate required fields
if (!$first_name || !$last_name || !$phone_number || !$password) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing required fields: first_name, last_name, phone_number, password"]);
    exit;
}

// Validate role
if (!in_array($role, ['user', 'merchant'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid role. Must be 'user' or 'merchant'"]);
    exit;
}

// Additional validation for merchants
if ($role === 'merchant') {
    if (!$business_name || !$business_type) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Business name and type are required for merchant registration"]);
        exit;
    }
}

$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

// Generate username and email from phone number if not provided
$username = $data['username'] ?? 'user_' . $phone_number;
$email = $data['email'] ?? $phone_number . '@gestpay.local';

// Default location (Lagos, Nigeria) if not provided
$latitude = $data['latitude'] ?? '6.5244';
$longitude = $data['longitude'] ?? '3.3792';

// Check if email or username or phone exists
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ? OR username = ? OR phone_number = ?");
$stmt->bind_param("sss", $email, $username, $phone_number);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    http_response_code(409);
    echo json_encode(["success" => false, "message" => "User already exists with this email, username, or phone number"]);
    exit;
}

try {
    // Start transaction
    $conn->begin_transaction();
    
    $merchant_id = null;
    
    // If registering as merchant, create merchant record first
    if ($role === 'merchant') {
        $merchant_stmt = $conn->prepare("INSERT INTO merchants (name, type, category, address, website, phone, monthly_revenue, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $merchant_stmt->bind_param("ssssssds", $business_name, $business_type, $business_category, $business_address, $business_website, $business_phone, $business_estimated_revenue, $business_description);
        
        if (!$merchant_stmt->execute()) {
            throw new Exception("Failed to create merchant record: " . $merchant_stmt->error);
        }
        
        $merchant_id = $merchant_stmt->insert_id;
    }
    
    // Insert user with merchant_id if applicable
    $stmt = $conn->prepare("INSERT INTO users (merchant_id, first_name, last_name, username, email, password, phone_number, latitude, longitude, role, last_login) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $last_login = time();
    $stmt->bind_param("isssssssssi", $merchant_id, $first_name, $last_name, $username, $email, $hashedPassword, $phone_number, $latitude, $longitude, $role, $last_login);
    
    if (!$stmt->execute()) {
        throw new Exception("Failed to create user: " . $stmt->error);
    }
    
    $user_id = $stmt->insert_id;
    
    // Generate JWT token
    $token = generateJWT($user_id, $conn);
    
    if (!$token) {
        throw new Exception("Failed to generate JWT token");
    }
    
    // Get the created user data with merchant info if applicable
    if ($role === 'merchant') {
        $user_stmt = $conn->prepare("
            SELECT u.*, m.name as merchant_name, m.type as merchant_type, m.category as merchant_category, 
                   m.verified as merchant_verified, m.kyc_level as merchant_kyc_level
            FROM users u 
            LEFT JOIN merchants m ON u.merchant_id = m.id 
            WHERE u.id = ?
        ");
    } else {
        $user_stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
    }
    
    $user_stmt->bind_param("i", $user_id);
    $user_stmt->execute();
    $user_result = $user_stmt->get_result();
    $user = $user_result->fetch_assoc();
    
    // Remove password from response
    unset($user['password']);
    
    // Commit transaction
    $conn->commit();
    
    http_response_code(201);
    echo json_encode([
        "success" => true,
        "message" => "User created successfully",
        "token" => $token,
        "data" => $user
    ]);
    
} catch (Exception $e) {
    // Rollback transaction on error
    $conn->rollback();
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Registration failed: " . $e->getMessage()]);
}
