<?php
header("Content-Type: application/json");
require_once '../../../config/config.php';
require_once "../../../config/auth.php";

// Authenticate user
$user_id = authenticate($conn);

// Validate request method
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

try {
    // Fetch transactions for the user
    $stmt = $conn->prepare("
        SELECT reference, amount, feature, type, status, description, created_at 
        FROM transactions 
        WHERE user_id = ? 
        ORDER BY created_at DESC
    ");
    if (!$stmt) {
        throw new Exception("Database error: " . $conn->error);
    }

    $stmt->bind_param("i", $user_id);
    if (!$stmt->execute()) {
        throw new Exception("Query failed: " . $stmt->error);
    }

    $result = $stmt->get_result();
    $transactions = [];

    while ($row = $result->fetch_assoc()) {
        $dateTime = new DateTime($row['created_at']);
        $transactions[] = [
            "description" => $row['description'] ?? 'Transaction',
            "amount" => number_format($row['amount'], 0), // Remove decimals as per documentation
            "type" => $row['type'],
            "date" => $dateTime->format('j M Y'), // e.g. 15 Jan 2024
            "reference" => $row['reference'],
            "status" => $row['status'],
            "app_feature" => $row['feature']
        ];
    }

    echo json_encode([
        "success" => true,
        "message" => "Successful",
        "data" => $transactions
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
}
