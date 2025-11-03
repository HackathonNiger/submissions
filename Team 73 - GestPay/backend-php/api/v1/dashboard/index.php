<?php
header("Content-Type: application/json");
require_once '../../../config/config.php';
require_once '../../../config/auth.php';

// Authenticate user
$user_id = authenticate($conn);

// Validate request method
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

try {
    // Get user details
    $user_stmt = $conn->prepare("SELECT email, balance FROM users WHERE id = ?");
    $user_stmt->bind_param("i", $user_id);
    $user_stmt->execute();
    $user_result = $user_stmt->get_result();
    $user = $user_result->fetch_assoc();

    if (!$user) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "User not found"]);
        exit;
    }

    // Calculate this month's transactions
    $current_month_start = date('Y-m-01 00:00:00');
    $current_month_end = date('Y-m-t 23:59:59');
    
    // Get previous month for comparison
    $prev_month_start = date('Y-m-01 00:00:00', strtotime('first day of last month'));
    $prev_month_end = date('Y-m-t 23:59:59', strtotime('last day of last month'));

    // This month's credit transactions (income)
    $this_month_stmt = $conn->prepare("
        SELECT COALESCE(SUM(amount), 0) as total_credit 
        FROM transactions 
        WHERE user_id = ? AND type = 'credit' AND status = 'successful' 
        AND created_at BETWEEN ? AND ?
    ");
    $this_month_stmt->bind_param("iss", $user_id, $current_month_start, $current_month_end);
    $this_month_stmt->execute();
    $this_month_result = $this_month_stmt->get_result();
    $this_month_data = $this_month_result->fetch_assoc();
    $this_month_balance = $this_month_data['total_credit'];

    // Previous month's credit transactions for percentage calculation
    $prev_month_stmt = $conn->prepare("
        SELECT COALESCE(SUM(amount), 0) as total_credit 
        FROM transactions 
        WHERE user_id = ? AND type = 'credit' AND status = 'successful' 
        AND created_at BETWEEN ? AND ?
    ");
    $prev_month_stmt->bind_param("iss", $user_id, $prev_month_start, $prev_month_end);
    $prev_month_stmt->execute();
    $prev_month_result = $prev_month_stmt->get_result();
    $prev_month_data = $prev_month_result->fetch_assoc();
    $prev_month_balance = $prev_month_data['total_credit'];

    // Calculate percentage change
    $this_month_percentage = 0;
    if ($prev_month_balance > 0) {
        $this_month_percentage = (($this_month_balance - $prev_month_balance) / $prev_month_balance) * 100;
    } elseif ($this_month_balance > 0) {
        $this_month_percentage = 100; // 100% increase from 0
    }

    // Count this month's transactions
    $transactions_count_stmt = $conn->prepare("
        SELECT COUNT(*) as total_transactions 
        FROM transactions 
        WHERE user_id = ? AND created_at BETWEEN ? AND ?
    ");
    $transactions_count_stmt->bind_param("iss", $user_id, $current_month_start, $current_month_end);
    $transactions_count_stmt->execute();
    $transactions_count_result = $transactions_count_stmt->get_result();
    $transactions_count_data = $transactions_count_result->fetch_assoc();
    $transactions_no = $transactions_count_data['total_transactions'];

    // Count previous month's transactions for percentage calculation
    $prev_transactions_count_stmt = $conn->prepare("
        SELECT COUNT(*) as total_transactions 
        FROM transactions 
        WHERE user_id = ? AND created_at BETWEEN ? AND ?
    ");
    $prev_transactions_count_stmt->bind_param("iss", $user_id, $prev_month_start, $prev_month_end);
    $prev_transactions_count_stmt->execute();
    $prev_transactions_count_result = $prev_transactions_count_stmt->get_result();
    $prev_transactions_count_data = $prev_transactions_count_result->fetch_assoc();
    $prev_transactions_no = $prev_transactions_count_data['total_transactions'];

    // Calculate transactions percentage change
    $transactions_percentage = 0;
    if ($prev_transactions_no > 0) {
        $transactions_percentage = (($transactions_no - $prev_transactions_no) / $prev_transactions_no) * 100;
    } elseif ($transactions_no > 0) {
        $transactions_percentage = 100; // 100% increase from 0
    }

    echo json_encode([
        "success" => true,
        "message" => "Successful",
        "data" => [
            "email" => $user['email'],
            "this_month_balance" => number_format($this_month_balance, 2),
            "this_month_percentage" => number_format($this_month_percentage, 1),
            "transactions_no" => (string)$transactions_no,
            "transactions_percentage" => number_format($transactions_percentage, 1)
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
}
