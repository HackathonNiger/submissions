<?php
header("Content-Type: application/json");
require_once '../../../config/config.php';

// Get token from query parameter
$token = $_GET['token'] ?? null;
date_default_timezone_set('Africa/Lagos');
if (!$token) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Token is required"]);
    exit;
}

try {
    // Debug: Log the token being searched
    error_log("Transaction Details: Searching for token: " . $token);
    
    // First, let's check if the token exists at all
    $debug_stmt = $conn->prepare("SELECT token, used, expires_at, created_at FROM webapp_tokens WHERE token = ?");
    $debug_stmt->bind_param("s", $token);
    $debug_stmt->execute();
    $debug_result = $debug_stmt->get_result();
    $debug_token = $debug_result->fetch_assoc();
    
    if ($debug_token) {
        error_log("Token found: used=" . $debug_token['used'] . ", expires_at=" . $debug_token['expires_at'] . ", created_at=" . $debug_token['created_at']);
        
        // Check if we have the new columns
        $full_debug_stmt = $conn->prepare("SELECT * FROM webapp_tokens WHERE token = ?");
        $full_debug_stmt->bind_param("s", $token);
        $full_debug_stmt->execute();
        $full_debug_result = $full_debug_stmt->get_result();
        $full_debug_token = $full_debug_result->fetch_assoc();
        
        error_log("Full token data: " . json_encode($full_debug_token));
        
        // Check if transaction exists
        if (isset($full_debug_token['tx_id'])) {
            $tx_check_stmt = $conn->prepare("SELECT id, reference, amount FROM transactions WHERE id = ?");
            $tx_check_stmt->bind_param("i", $full_debug_token['tx_id']);
            $tx_check_stmt->execute();
            $tx_result = $tx_check_stmt->get_result();
            $tx_data = $tx_result->fetch_assoc();
            
            if ($tx_data) {
                error_log("Transaction found: " . json_encode($tx_data));
            } else {
                error_log("Transaction NOT found for tx_id: " . $full_debug_token['tx_id']);
            }
        }
        
        // Check if user exists
        if (isset($full_debug_token['user_id'])) {
            $user_check_stmt = $conn->prepare("SELECT id, first_name, last_name FROM users WHERE id = ?");
            $user_check_stmt->bind_param("i", $full_debug_token['user_id']);
            $user_check_stmt->execute();
            $user_result = $user_check_stmt->get_result();
            $user_data = $user_result->fetch_assoc();
            
            if ($user_data) {
                error_log("User found: " . json_encode($user_data));
            } else {
                error_log("User NOT found for user_id: " . $full_debug_token['user_id']);
            }
        }
        
    } else {
        error_log("Token not found in database");
    }
    
    // Get webapp token details (temporarily ignore expiration for debugging)
    $stmt = $conn->prepare("
        SELECT wt.*, t.amount, t.reference, t.description, u.first_name, u.last_name
        FROM webapp_tokens wt
        JOIN transactions t ON wt.tx_id = t.id
        JOIN users u ON wt.user_id = u.id
        WHERE wt.token = ? AND wt.used = 0
    ");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();
    $token_data = $result->fetch_assoc();
    
    if (!$token_data) {
        // More detailed error message
        if ($debug_token) {
            if ($debug_token['used'] == 1) {
                $error_msg = "Token has already been used";
            } elseif (strtotime($debug_token['expires_at']) < time()) {
                $error_msg = "Token has expired";
            } else {
                $error_msg = "Token exists but transaction/user data not found";
            }
        } else {
            $error_msg = "Token not found in database";
        }
        
        error_log("Transaction Details Error: " . $error_msg);
        http_response_code(404);
        echo json_encode(["success" => false, "message" => $error_msg]);
        exit;
    }
    
    // Extract recipient from description or get from transfer table
    $recipient_name = "Unknown Recipient";
    if (preg_match('/Transfer to (.+?) via/', $token_data['description'], $matches)) {
        $recipient_name = $matches[1];
    }
    
    echo json_encode([
        "success" => true,
        "data" => [
            "recipient" => $recipient_name,
            "amount" => number_format($token_data['amount'], 2),
            "reference" => $token_data['reference'],
            "sender" => $token_data['first_name'] . ' ' . $token_data['last_name']
        ]
    ]);
    
} catch (Exception $e) {
    error_log("Transaction Details Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error"]);
}
