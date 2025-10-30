<?php
// dashboard.php - Complete working version
require_once 'config.php';

// Add the function directly here to fix the error
function trackPageVisit($page) {
    try {
        $database = new Database();
        $db = $database->getConnection();
        
        if ($db) {
            $query = "INSERT INTO page_visits (page_url, user_agent, ip_address, session_id) 
                      VALUES (:page_url, :user_agent, :ip_address, :session_id)";
            
            $stmt = $db->prepare($query);
            
            $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';
            $ip_address = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
            $session_id = session_id();
            
            $stmt->bindParam(":page_url", $page);
            $stmt->bindParam(":user_agent", $user_agent);
            $stmt->bindParam(":ip_address", $ip_address);
            $stmt->bindParam(":session_id", $session_id);
            
            $stmt->execute();
            return true;
        }
    } catch (Exception $e) {
        error_log("Error tracking page visit: " . $e->getMessage());
    }
    return false;
}

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: sign.php");
    exit();
}

// Get user data from database
function getUserData($user_id) {
    $database = new Database();
    $db = $database->getConnection();
    
    $query = "SELECT u.*, 
                     sg.id as goal_id, sg.goal_name, sg.target_amount, sg.current_amount, sg.target_date,
                     sg.category,
                     (SELECT COUNT(*) FROM savings_goals WHERE user_id = u.id) as total_goals,
                     (SELECT COUNT(*) FROM savings_goals WHERE user_id = u.id AND current_amount >= target_amount) as completed_goals,
                     (SELECT SUM(current_amount) FROM savings_goals WHERE user_id = u.id) as total_savings
              FROM users u 
              LEFT JOIN savings_goals sg ON u.id = sg.user_id 
              WHERE u.id = :user_id 
              ORDER BY sg.created_at DESC 
              LIMIT 1";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(":user_id", $user_id);
    $stmt->execute();
    
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

// Get user stats
function getUserStats($user_id) {
    $database = new Database();
    $db = $database->getConnection();
    
    $stats = [];
    
    // Savings streak (simplified - in real app, you'd calculate based on transaction history)
    $streakQuery = "SELECT COUNT(DISTINCT DATE(transaction_date)) as streak 
                    FROM transactions 
                    WHERE user_id = :user_id 
                    AND transaction_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
    $stmt = $db->prepare($streakQuery);
    $stmt->bindParam(":user_id", $user_id);
    $stmt->execute();
    $stats['savings_streak'] = $stmt->fetch(PDO::FETCH_ASSOC)['streak'] ?? 0;
    
    // Monthly savings
    $monthlyQuery = "SELECT COALESCE(SUM(amount), 0) as monthly_savings 
                     FROM transactions 
                     WHERE user_id = :user_id 
                     AND transaction_type = 'deposit'
                     AND MONTH(transaction_date) = MONTH(NOW()) 
                     AND YEAR(transaction_date) = YEAR(NOW())";
    $stmt = $db->prepare($monthlyQuery);
    $stmt->bindParam(":user_id", $user_id);
    $stmt->execute();
    $stats['monthly_savings'] = $stmt->fetch(PDO::FETCH_ASSOC)['monthly_savings'] ?? 0;
    
    return $stats;
}

// Get user badges
function getUserBadges($user_id) {
    $badges = [
        ['name' => 'First Save', 'icon' => 'fas fa-star', 'earned' => true],
        ['name' => 'Weekly Saver', 'icon' => 'fas fa-calendar-week', 'earned' => false],
        ['name' => 'Goal Crusher', 'icon' => 'fas fa-trophy', 'earned' => false],
        ['name' => 'Consistency', 'icon' => 'fas fa-check-circle', 'earned' => false],
        ['name' => 'Early Bird', 'icon' => 'fas fa-sun', 'earned' => false],
        ['name' => 'Savings Pro', 'icon' => 'fas fa-crown', 'earned' => false]
    ];
    
    // Check and update badges based on user achievements
    $database = new Database();
    $db = $database->getConnection();
    
    // Check for first save
    $firstSaveQuery = "SELECT COUNT(*) as count FROM transactions WHERE user_id = :user_id";
    $stmt = $db->prepare($firstSaveQuery);
    $stmt->bindParam(":user_id", $user_id);
    $stmt->execute();
    $transactionCount = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    if ($transactionCount > 0) {
        $badges[0]['earned'] = true; // First Save
    }
    
    return $badges;
}

// Handle form submissions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action'])) {
        switch ($_POST['action']) {
            case 'add_funds':
                $amount = floatval($_POST['amount']);
                $goal_id = intval($_POST['goal_id']);
                
                if ($amount > 0) {
                    $database = new Database();
                    $db = $database->getConnection();
                    
                    // Update goal current amount
                    $updateQuery = "UPDATE savings_goals SET current_amount = current_amount + :amount WHERE id = :goal_id";
                    $stmt = $db->prepare($updateQuery);
                    $stmt->bindParam(":amount", $amount);
                    $stmt->bindParam(":goal_id", $goal_id);
                    $stmt->execute();
                    
                    // Record transaction
                    $transactionQuery = "INSERT INTO transactions (user_id, goal_id, amount, transaction_type, description) 
                                        VALUES (:user_id, :goal_id, :amount, 'deposit', 'Manual deposit')";
                    $stmt = $db->prepare($transactionQuery);
                    $stmt->bindParam(":user_id", $_SESSION['user_id']);
                    $stmt->bindParam(":goal_id", $goal_id);
                    $stmt->bindParam(":amount", $amount);
                    $stmt->execute();
                    
                    $_SESSION['success_message'] = "Successfully added ₦" . number_format($amount) . " to your goal!";
                }
                break;
                
            case 'create_goal':
                $goal_name = trim($_POST['goal_name']);
                $target_amount = floatval($_POST['target_amount']);
                $target_date = $_POST['target_date'];
                $category = $_POST['category'] ?? 'personal';
                
                if (!empty($goal_name) && $target_amount > 0) {
                    $database = new Database();
                    $db = $database->getConnection();
                    
                    $query = "INSERT INTO savings_goals (user_id, goal_name, target_amount, target_date, category) 
                              VALUES (:user_id, :goal_name, :target_amount, :target_date, :category)";
                    
                    $stmt = $db->prepare($query);
                    $stmt->bindParam(":user_id", $_SESSION['user_id']);
                    $stmt->bindParam(":goal_name", $goal_name);
                    $stmt->bindParam(":target_amount", $target_amount);
                    $stmt->bindParam(":target_date", $target_date);
                    $stmt->bindParam(":category", $category);
                    
                    if ($stmt->execute()) {
                        $_SESSION['success_message'] = "New goal '$goal_name' created successfully!";
                    }
                }
                break;
                
            case 'update_profile':
                $name = trim($_POST['name']);
                $email = trim($_POST['email']);
                $phone = trim($_POST['phone']);
                
                if (!empty($name) && !empty($email)) {
                    $database = new Database();
                    $db = $database->getConnection();
                    
                    $query = "UPDATE users SET first_name = :first_name, email = :email, phone = :phone WHERE id = :user_id";
                    
                    // Split name into first and last name
                    $name_parts = explode(' ', $name, 2);
                    $first_name = $name_parts[0];
                    $last_name = $name_parts[1] ?? '';
                    
                    $stmt = $db->prepare($query);
                    $stmt->bindParam(":first_name", $first_name);
                    $stmt->bindParam(":email", $email);
                    $stmt->bindParam(":phone", $phone);
                    $stmt->bindParam(":user_id", $_SESSION['user_id']);
                    
                    if ($stmt->execute()) {
                        $_SESSION['success_message'] = "Profile updated successfully!";
                    }
                }
                break;
        }
        
        // Redirect to avoid form resubmission
        header("Location: dash.php");
        exit();
    }
}

// Get current user data
$user_id = $_SESSION['user_id'];
$user_data = getUserData($user_id);
$user_stats = getUserStats($user_id);
$user_badges = getUserBadges($user_id);

// Calculate goal progress
if ($user_data && $user_data['target_amount'] > 0) {
    $progress = ($user_data['current_amount'] / $user_data['target_amount']) * 100;
} else {
    $progress = 0;
}

// Track page visit
trackPageVisit('dashboard');
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vault - Complete Savings Platform</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        /* Enhanced CSS with improved UI */
        :root {
            --primary: #2ecc71;
            --primary-dark: #27ae60;
            --secondary: #3498db;
            --accent: #f1c40f;
            --success: #2ecc71;
            --warning: #e67e22;
            --light: #f8f9fa;
            --dark: #1e2a4a;
            --card-bg: #ffffff;
            --text-dark: #2d3436;
            --text-light: #7f8fa6;
            --border: #e6e9ef;
            --shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            --gradient: linear-gradient(135deg, var(--primary), var(--secondary));
            --green-gradient: linear-gradient(135deg, #2ecc71, #27ae60);
            --nav-bg: #1a3a2a;
            --background: #f5f7fa;
        }

        .dark-mode {
            --light: #2d3436;
            --dark: #f8f9fa;
            --card-bg: #1e2a4a;
            --text-dark: #f8f9fa;
            --text-light: #b2bec3;
            --border: #34495e;
            --background: #0d1a2e;
            --nav-bg: #0d1a0d;
            --shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Inter', sans-serif;
            transition: background-color 0.3s, color 0.3s;
        }

        body {
            background: var(--background);
            color: var(--text-dark);
            min-height: 100vh;
            display: flex;
            overflow-x: hidden;
        }

        /* Enhanced vault background effect */
        .vault-background {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            opacity: 0.03;
            background-image: 
                radial-gradient(circle at 25% 25%, var(--primary) 2px, transparent 2px),
                radial-gradient(circle at 75% 75%, var(--primary-dark) 2px, transparent 2px);
            background-size: 30px 30px;
            animation: backgroundMove 20s infinite linear;
        }

        @keyframes backgroundMove {
            from { background-position: 0 0; }
            to { background-position: 30px 30px; }
        }

        /* Enhanced Sidebar */
        .sidebar {
            width: 260px;
            background: var(--nav-bg);
            color: white;
            height: 100vh;
            position: sticky;
            top: 0;
            padding: 25px 0;
            display: flex;
            flex-direction: column;
            box-shadow: var(--shadow);
            z-index: 10;
            transition: all 0.3s ease;
        }

        .logo {
            padding: 0 25px 25px;
            display: flex;
            align-items: center;
            gap: 12px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            margin-bottom: 25px;
        }

        .logo-icon {
            width: 36px;
            height: 36px;
            border-radius: 12px;
            background: var(--green-gradient);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            animation: spin 15s infinite linear;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .logo-text {
            font-size: 22px;
            font-weight: 700;
        }

        .nav-items {
            flex: 1;
        }

        .nav-item {
            display: flex;
            align-items: center;
            padding: 15px 25px;
            color: rgba(255, 255, 255, 0.7);
            text-decoration: none;
            transition: all 0.3s ease;
            gap: 15px;
            border-radius: 12px;
            margin: 0 10px;
        }

        .nav-item:hover, .nav-item.active {
            color: white;
            background: rgba(255, 255, 255, 0.05);
            border-right: 4px solid var(--primary);
            transform: translateX(5px);
        }

        .nav-item i {
            width: 20px;
            text-align: center;
        }

        .sidebar-footer {
            padding: 20px 25px 0;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            margin-top: auto;
        }

        .user-profile {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: var(--green-gradient);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }

        .user-info {
            flex: 1;
        }

        .user-name {
            font-size: 14px;
            font-weight: 600;
        }

        .user-email {
            font-size: 12px;
            opacity: 0.7;
        }

        /* Enhanced Main Content */
        .main-content {
            flex: 1;
            padding: 30px;
            overflow-y: auto;
            transition: all 0.3s ease;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }

        .page-title {
            font-size: 24px;
            font-weight: 700;
            color: var(--text-dark);
        }

        .header-actions {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .notification-bell {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: var(--light);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--primary);
            cursor: pointer;
            position: relative;
            transition: all 0.3s ease;
        }

        .notification-bell:hover {
            transform: scale(1.1);
            box-shadow: 0 0 15px rgba(46, 204, 113, 0.4);
        }

        .notification-bell::after {
            content: '';
            position: absolute;
            top: 5px;
            right: 5px;
            width: 8px;
            height: 8px;
            background: var(--accent);
            border-radius: 50%;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.5); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
        }

        /* Enhanced Dashboard Grid */
        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 25px;
            margin-bottom: 25px;
        }

        /* Enhanced Welcome Section */
        .welcome-section {
            background: var(--green-gradient);
            border-radius: 20px;
            padding: 25px;
            color: white;
            grid-column: 1 / -1;
            box-shadow: var(--shadow);
            position: relative;
            overflow: hidden;
            animation: fadeIn 1s ease-out;
        }

        .welcome-section::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            animation: shine 6s infinite linear;
        }

        @keyframes shine {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .welcome-section h1 {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 8px;
            position: relative;
            z-index: 1;
        }

        .welcome-section p {
            font-size: 16px;
            opacity: 0.9;
            max-width: 70%;
            position: relative;
            z-index: 1;
        }

        /* Enhanced Current Goal */
        .current-goal {
            background: var(--card-bg);
            border-radius: 20px;
            padding: 25px;
            box-shadow: var(--shadow);
            position: relative;
            grid-column: 1 / -1;
            animation: fadeIn 1s ease-out 0.2s both;
        }

        .goal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .goal-title {
            font-size: 20px;
            font-weight: 600;
            color: var(--text-dark);
        }

        .goal-amount {
            font-size: 20px;
            font-weight: 700;
            color: var(--primary);
        }

        .progress-container {
            margin-bottom: 25px;
        }

        .progress-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 14px;
            color: var(--text-light);
        }

        .saved-amount {
            font-weight: 600;
            color: var(--primary);
        }

        .progress-bar {
            height: 10px;
            background: var(--light);
            border-radius: 10px;
            overflow: hidden;
        }

        .progress-fill {
            height: 100%;
            background: var(--green-gradient);
            border-radius: 10px;
            transition: width 1s ease;
            position: relative;
            overflow: hidden;
        }

        .progress-fill::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
        }

        .goal-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
        }

        .action-btn {
            padding: 14px;
            border: none;
            border-radius: 12px;
            background: var(--light);
            color: var(--primary);
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            position: relative;
            overflow: hidden;
        }

        .action-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            transition: left 0.5s;
        }

        .action-btn:hover::before {
            left: 100%;
        }

        .action-btn.primary {
            background: var(--primary);
            color: white;
        }

        .action-btn.warning {
            background: var(--warning);
            color: white;
        }

        .action-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        /* Enhanced Stats Section - Now in Flex */
        .stats-section {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            justify-content: space-between;
        }

        .stat-card {
            background: var(--card-bg);
            border-radius: 16px;
            padding: 20px;
            box-shadow: var(--shadow);
            text-align: center;
            transition: all 0.3s ease;
            animation: fadeIn 1s ease-out 0.4s both;
            flex: 1;
            min-width: 150px;
        }

        .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }

        .stat-value {
            font-size: 24px;
            font-weight: 700;
            color: var(--primary);
            margin-bottom: 5px;
        }

        .stat-label {
            font-size: 14px;
            color: var(--text-light);
        }

        /* Enhanced Savings Calculator */
        .savings-calculator {
            background: var(--card-bg);
            border-radius: 20px;
            padding: 25px;
            box-shadow: var(--shadow);
            grid-column: 1 / -1;
            margin-bottom: 25px;
            animation: fadeIn 1s ease-out 0.6s both;
        }

        .calculator-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .calculator-title {
            font-size: 18px;
            font-weight: 600;
            color: var(--text-dark);
        }

        .savings-options {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
        }

        .savings-option {
            background: var(--light);
            border-radius: 16px;
            padding: 20px;
            text-align: center;
            transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            cursor: pointer;
            position: relative;
            overflow: hidden;
            animation: fadeIn 1s ease-out 0.8s both;
        }

        .savings-option:nth-child(2) {
            animation-delay: 0.9s;
        }

        .savings-option:nth-child(3) {
            animation-delay: 1s;
        }

        .savings-option:nth-child(4) {
            animation-delay: 1.1s;
        }

        .savings-option::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            transition: left 0.5s;
        }

        .savings-option:hover::before {
            left: 100%;
        }

        .savings-option:hover {
            background: var(--green-gradient);
            color: white;
            transform: translateY(-10px) scale(1.05);
            box-shadow: 0 15px 30px rgba(46, 204, 113, 0.3);
        }

        .savings-option:hover .option-details {
            opacity: 1;
            transform: translateY(0);
        }

        .option-amount {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 10px;
            position: relative;
            z-index: 1;
        }

        .option-label {
            font-size: 14px;
            opacity: 0.8;
            position: relative;
            z-index: 1;
        }

        .option-details {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.8);
            padding: 15px;
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            border-radius: 0 0 16px 16px;
        }

        .detail-item {
            font-size: 12px;
            margin-bottom: 5px;
            display: flex;
            justify-content: space-between;
        }

        .detail-item:last-child {
            margin-bottom: 0;
        }

        /* Enhanced Badges Section */
        .badges-section {
            background: var(--card-bg);
            border-radius: 20px;
            padding: 25px;
            box-shadow: var(--shadow);
            grid-column: 1 / -1;
            animation: fadeIn 1s ease-out 1.2s both;
        }

        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .section-title {
            font-size: 18px;
            font-weight: 600;
            color: var(--text-dark);
        }

        .view-all {
            color: var(--primary);
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .view-all:hover {
            text-decoration: underline;
            transform: translateX(3px);
        }

        .badges-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
            gap: 15px;
        }

        .badge {
            background: var(--light);
            border-radius: 16px;
            padding: 15px;
            text-align: center;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .badge::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            opacity: 0;
            transition: opacity 0.3s;
        }

        .badge.earned {
            background: var(--green-gradient);
            color: white;
            transform: scale(1.05);
            box-shadow: 0 5px 15px rgba(46, 204, 113, 0.2);
        }

        .badge.earned::before {
            opacity: 1;
            animation: shine 4s infinite linear;
        }

        .badge i {
            font-size: 28px;
            margin-bottom: 10px;
            position: relative;
            z-index: 1;
        }

        .badge-name {
            font-size: 12px;
            font-weight: 500;
            position: relative;
            z-index: 1;
        }

        /* Enhanced Add Goal Button */
        .add-goal-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            width: 100%;
            padding: 16px;
            border: 2px dashed var(--border);
            border-radius: 16px;
            background: transparent;
            color: var(--text-light);
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 600;
            margin-top: 25px;
            animation: fadeIn 1s ease-out 1.4s both;
        }

        .add-goal-btn:hover {
            border-color: var(--primary);
            color: var(--primary);
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(46, 204, 113, 0.1);
        }

        /* Success Message */
        .success-message {
            background: var(--success);
            color: white;
            padding: 15px 20px;
            border-radius: 12px;
            margin-bottom: 20px;
            text-align: center;
            animation: fadeIn 0.5s ease;
        }

        /* Settings Section */
        .settings-section {
            background: var(--card-bg);
            border-radius: 20px;
            padding: 25px;
            box-shadow: var(--shadow);
            margin-bottom: 25px;
            display: none;
        }

        .settings-section.active {
            display: block;
            animation: fadeIn 0.8s ease-out;
        }

        .settings-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .settings-title {
            font-size: 20px;
            font-weight: 600;
            color: var(--text-dark);
        }

        .settings-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
        }

        .setting-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 0;
            border-bottom: 1px solid var(--border);
        }

        .setting-info {
            flex: 1;
        }

        .setting-name {
            font-weight: 500;
            color: var(--text-dark);
            margin-bottom: 5px;
        }

        .setting-desc {
            font-size: 14px;
            color: var(--text-light);
        }

        .setting-action {
            color: var(--primary);
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .setting-action:hover {
            text-decoration: underline;
        }

        /* Toggle Switch */
        .toggle-switch {
            position: relative;
            display: inline-block;
            width: 50px;
            height: 24px;
        }

        .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .toggle-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 24px;
        }

        .toggle-slider:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }

        input:checked + .toggle-slider {
            background-color: var(--primary);
        }

        input:checked + .toggle-slider:before {
            transform: translateX(26px);
        }

        /* Enhanced Modal Styles */
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            justify-content: center;
            align-items: center;
            animation: fadeIn 0.3s ease-out;
        }

        .modal-content {
            background: var(--card-bg);
            border-radius: 20px;
            padding: 30px;
            width: 90%;
            max-width: 500px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .modal-title {
            font-size: 20px;
            font-weight: 600;
            color: var(--text-dark);
        }

        .close-modal {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: var(--text-light);
            transition: all 0.3s ease;
        }

        .close-modal:hover {
            color: var(--text-dark);
            transform: rotate(90deg);
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: var(--text-dark);
        }

        .form-input {
            width: 100%;
            padding: 12px 15px;
            border: 1px solid var(--border);
            border-radius: 12px;
            font-size: 16px;
            transition: all 0.3s ease;
            background: var(--light);
            color: var(--text-dark);
        }

        .form-input:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.1);
        }

        .form-actions {
            display: flex;
            gap: 15px;
            margin-top: 25px;
        }

        .btn {
            padding: 12px 20px;
            border: none;
            border-radius: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            flex: 1;
        }

        .btn-primary {
            background: var(--primary);
            color: white;
        }

        .btn-secondary {
            background: var(--light);
            color: var(--text-dark);
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        /* Enhanced Mobile Navigation */
        .mobile-nav {
            display: none;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: var(--card-bg);
            box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
            padding: 15px;
            z-index: 100;
            justify-content: space-around;
        }

        .mobile-nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            color: var(--text-light);
            text-decoration: none;
            font-size: 12px;
            gap: 5px;
            transition: all 0.3s ease;
        }

        .mobile-nav-item.active {
            color: var(--primary);
            transform: translateY(-5px);
        }

        .mobile-nav-item i {
            font-size: 20px;
        }

        /* Naira Symbol */
        .naira::before {
            content: "₦";
            font-weight: 600;
        }

        /* Celebration Animation */
        .celebration {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 2000;
            opacity: 0;
            transition: opacity 0.5s;
        }

        .confetti {
            position: absolute;
            width: 10px;
            height: 20px;
            background: var(--primary);
            opacity: 0;
        }

        /* AI Agent Notification */
        .ai-agent-notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--card-bg);
            border-radius: 16px;
            padding: 15px;
            box-shadow: var(--shadow);
            max-width: 300px;
            z-index: 1000;
            animation: slideInRight 0.5s ease-out;
            border-left: 4px solid var(--primary);
        }

        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }

        .ai-agent-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
        }

        .ai-agent-avatar {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: var(--green-gradient);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 14px;
        }

        .ai-agent-name {
            font-weight: 600;
            color: var(--text-dark);
        }

        .ai-agent-message {
            font-size: 14px;
            color: var(--text-light);
            line-height: 1.4;
        }

        .close-notification {
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            color: var(--text-light);
            cursor: pointer;
        }

        /* Enhanced Responsive Design */
        @media (max-width: 1024px) {
            .sidebar {
                width: 220px;
            }
            
            .dashboard-grid {
                grid-template-columns: 1fr;
            }
            
            .savings-options {
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            }
        }

        @media (max-width: 768px) {
            body {
                flex-direction: column;
            }
            
            .sidebar {
                display: none;
            }
            
            .mobile-nav {
                display: flex;
            }
            
            .main-content {
                padding: 20px;
                padding-bottom: 90px;
            }
            
            .welcome-section p {
                max-width: 100%;
            }
            
            .savings-options {
                grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
            }
            
            .badges-container {
                grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
            }
            
            .stats-section {
                flex-direction: column;
            }
        }

        /* Enhanced Animations */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body>
    <!-- Vault Background Effect -->
    <div class="vault-background"></div>
    
    <!-- Sidebar Navigation -->
    <div class="sidebar">
        <div class="logo">
            <div class="logo-icon">
                <i class="fas fa-vault"></i>
            </div>
            <div class="logo-text">Vault</div>
        </div>
        
        <div class="nav-items">
            <a href="dash.php" class="nav-item active" data-page="dashboard">
                <i class="fas fa-home"></i>
                <span>Dashboard</span>
            </a>
            <a href="story.html" class="nav-item">
                <i class="fas fa-book-open"></i>
                <span>My Story</span>
            </a>
            <a href="friend.html" class="nav-item">
                <i class="fas fa-users"></i>
                <span>Friends</span>
            </a>
            <a href="progress.html" class="nav-item">
                <i class="fas fa-chart-pie"></i>
                <span>Progress</span>
            </a>
            <a href="history.html" class="nav-item">
                <i class="fas fa-piggy-bank"></i>
                <span>Savings</span>
            </a>
            <a href="#" class="nav-item" id="settingsNav">
                <i class="fas fa-cog"></i>
                <span>Settings</span>
            </a>
        </div>
        
        <div class="sidebar-footer">
            <div class="user-profile">
                <div class="user-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="user-info">
                    <div class="user-name" id="userName"><?php echo htmlspecialchars($user_data['first_name'] . ' ' . $user_data['last_name']); ?></div>
                    <div class="user-email" id="userEmail"><?php echo htmlspecialchars($user_data['email']); ?></div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Main Content -->
    <div class="main-content">
        <div class="header">
            <h1 class="page-title" id="pageTitle">Dashboard</h1>
            <div class="header-actions">
                <div class="notification-bell" id="notificationBell">
                    <i class="fas fa-bell"></i>
                </div>
            </div>
        </div>
        
        <!-- Success Message -->
        <?php if (isset($_SESSION['success_message'])): ?>
            <div class="success-message">
                <?php echo $_SESSION['success_message']; ?>
                <?php unset($_SESSION['success_message']); ?>
            </div>
        <?php endif; ?>
        
        <!-- Dashboard Content -->
        <div id="dashboardContent" class="page-content active">
            <div class="dashboard-grid">
                <!-- Welcome Section -->
                <div class="welcome-section">
                    <h1 id="welcomeMessage">Welcome, <?php echo htmlspecialchars($user_data['first_name']); ?></h1>
                    <p id="progressMessage">
                        <?php if ($progress >= 100): ?>
                            Congratulations! You've reached your goal! 🎉
                        <?php elseif ($progress >= 70): ?>
                            You're almost there! Just <?php echo number_format(100 - $progress, 0); ?>% to go!
                        <?php elseif ($progress >= 30): ?>
                            Great progress! You're <?php echo number_format($progress, 0); ?>% closer to your goal!
                        <?php else: ?>
                            You're on your savings journey! Every little bit counts!
                        <?php endif; ?>
                    </p>
                </div>
                
                <!-- Current Goal -->
                <div class="current-goal">
                    <div class="goal-header">
                        <div class="goal-title" id="currentGoalTitle">
                            <?php echo $user_data['goal_name'] ? htmlspecialchars($user_data['goal_name']) : 'No Active Goal'; ?>
                        </div>
                        <div class="goal-amount naira" id="currentGoalAmount">
                            <?php echo $user_data['target_amount'] ? number_format($user_data['target_amount']) : '0'; ?>
                        </div>
                    </div>
                    
                    <?php if ($user_data['goal_name']): ?>
                    <div class="progress-container">
                        <div class="progress-info">
                            <span class="saved-amount naira" id="savedAmount">
                                <?php echo number_format($user_data['current_amount']); ?> saved
                            </span>
                            <span class="naira" id="targetAmount">
                                <?php echo number_format($user_data['target_amount']); ?> target
                            </span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" id="goalProgress" style="width: <?php echo $progress; ?>%"></div>
                        </div>
                    </div>
                    
                    <div class="goal-actions">
                        <button class="action-btn primary" id="addFundsBtn">
                            <i class="fas fa-plus"></i>
                            Add Funds
                        </button>
                        <button class="action-btn warning" id="withdrawBtn">
                            <i class="fas fa-download"></i>
                            Withdraw
                        </button>
                    </div>
                    <?php else: ?>
                    <div style="text-align: center; padding: 20px; color: var(--text-light);">
                        <p>You don't have an active savings goal yet.</p>
                        <button class="action-btn primary" id="createFirstGoalBtn" style="margin-top: 15px;">
                            <i class="fas fa-plus"></i>
                            Create Your First Goal
                        </button>
                    </div>
                    <?php endif; ?>
                </div>
                
                <!-- Stats Section -->
                <div class="stats-section">
                    <div class="stat-card">
                        <div class="stat-value" id="savingsStreak"><?php echo $user_stats['savings_streak']; ?></div>
                        <div class="stat-label">Savings Streak</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value naira" id="monthlySavings"><?php echo number_format($user_stats['monthly_savings']); ?></div>
                        <div class="stat-label">Saved This Month</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value naira" id="totalSavings"><?php echo number_format($user_data['total_savings'] ?? 0); ?></div>
                        <div class="stat-label">Total Saved</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" id="goalsCompleted"><?php echo $user_data['completed_goals'] ?? 0; ?></div>
                        <div class="stat-label">Goals Completed</div>
                    </div>
                </div>
                
                <!-- Savings Calculator Section -->
                <div class="savings-calculator">
                    <div class="calculator-header">
                        <h2 class="calculator-title">Quick Savings Options</h2>
                    </div>
                    <div class="savings-options" id="savingsOptions">
                        <!-- Options will be populated by JavaScript -->
                    </div>
                </div>
                
                <!-- Badges Section -->
                <div class="badges-section">
                    <div class="section-header">
                        <h2 class="section-title">Your Badges</h2>
                        <a href="#" class="view-all">View all</a>
                    </div>
                    
                    <div class="badges-container" id="badgesContainer">
                        <?php foreach ($user_badges as $badge): ?>
                        <div class="badge <?php echo $badge['earned'] ? 'earned' : ''; ?>">
                            <i class="<?php echo $badge['icon']; ?>"></i>
                            <div class="badge-name"><?php echo $badge['name']; ?></div>
                        </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>
            
            <!-- Add Goal Button -->
            <button class="add-goal-btn" id="addGoalBtn">
                <i class="fas fa-plus-circle"></i>
                Create New Goal
            </button>
        </div>
        
        <!-- Settings Content -->
        <div id="settingsContent" class="page-content">
            <div class="settings-section active">
                <h2 class="settings-title">Account Settings</h2>
                <div class="settings-grid">
                    <div class="setting-item">
                        <div class="setting-info">
                            <div class="setting-name">Personal Information</div>
                            <div class="setting-desc">Update your name, email, and other details</div>
                        </div>
                        <div class="setting-action" id="editProfileBtn">Edit</div>
                    </div>
                    <div class="setting-item">
                        <div class="setting-info">
                            <div class="setting-name">Change Password</div>
                            <div class="setting-desc">Update your password for security</div>
                        </div>
                        <div class="setting-action" id="changePasswordBtn">Change</div>
                    </div>
                    <div class="setting-item">
                        <div class="setting-info">
                            <div class="setting-name">Change PIN</div>
                            <div class="setting-desc">Update your security PIN</div>
                        </div>
                        <div class="setting-action" id="changePinBtn">Change</div>
                    </div>
                    <div class="setting-item">
                        <div class="setting-info">
                            <div class="setting-name">Notification Preferences</div>
                            <div class="setting-desc">Manage how we contact you</div>
                        </div>
                        <div class="setting-action" id="notificationSettingsBtn">Manage</div>
                    </div>
                    <div class="setting-item">
                        <div class="setting-info">
                            <div class="setting-name">Privacy & Security</div>
                            <div class="setting-desc">Control your privacy settings</div>
                        </div>
                        <div class="setting-action" id="privacySettingsBtn">Manage</div>
                    </div>
                </div>
            </div>
            
            <div class="settings-section active">
                <h2 class="settings-title">App Preferences</h2>
                <div class="settings-grid">
                    <div class="setting-item">
                        <div class="setting-info">
                            <div class="setting-name">Dark Mode</div>
                            <div class="setting-desc">Toggle between light and dark themes</div>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="darkModeToggle">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    <div class="setting-item">
                        <div class="setting-info">
                            <div class="setting-name">Biometric Authentication</div>
                            <div class="setting-desc">Use fingerprint or face ID to log in</div>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="biometricToggle" checked>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    <div class="setting-item">
                        <div class="setting-info">
                            <div class="setting-name">Two-Factor Authentication</div>
                            <div class="setting-desc">Add an extra layer of security</div>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="twoFactorToggle">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    <div class="setting-item">
                        <div class="setting-info">
                            <div class="setting-name">Auto-Save</div>
                            <div class="setting-desc">Automatically save small amounts daily</div>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="autoSaveToggle" checked>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    <div class="setting-item">
                        <div class="setting-info">
                            <div class="setting-name">Goal Reminders</div>
                            <div class="setting-desc">Get reminders about your savings goals</div>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="remindersToggle" checked>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    <div class="setting-item">
                        <div class="setting-info">
                            <div class="setting-name">Push Notifications</div>
                            <div class="setting-desc">Receive app notifications</div>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="notificationsToggle" checked>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    <div class="setting-item">
                        <div class="setting-info">
                            <div class="setting-name">Email Notifications</div>
                            <div class="setting-desc">Receive email updates</div>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="emailToggle" checked>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    <div class="setting-item">
                        <div class="setting-info">
                            <div class="setting-name">Privacy Mode</div>
                            <div class="setting-desc">Hide your savings from friends</div>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="privacyToggle">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    <div class="setting-item">
                        <div class="setting-info">
                            <div class="setting-name">Data Backup</div>
                            <div class="setting-desc">Automatically backup your data</div>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="backupToggle" checked>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    <div class="setting-item">
                        <div class="setting-info">
                            <div class="setting-name">Currency</div>
                            <div class="setting-desc">Change your default currency</div>
                        </div>
                        <div class="setting-action" id="currencyBtn">NGN</div>
                    </div>
                    <div class="setting-item">
                        <div class="setting-info">
                            <div class="setting-name">Language</div>
                            <div class="setting-desc">Change app language</div>
                        </div>
                        <div class="setting-action" id="languageBtn">English</div>
                    </div>
                </div>
            </div>
            
            <div class="settings-section active">
                <h2 class="settings-title">Support</h2>
                <div class="settings-grid">
                    <div class="setting-item">
                        <div class="setting-info">
                            <div class="setting-name">Help Center</div>
                            <div class="setting-desc">Find answers to common questions</div>
                        </div>
                        <div class="setting-action" id="helpCenterBtn">Visit</div>
                    </div>
                    <div class="setting-item">
                        <div class="setting-info">
                            <div class="setting-name">Contact Support</div>
                            <div class="setting-desc">Get in touch with our support team</div>
                        </div>
                        <div class="setting-action" id="contactSupportBtn">Contact</div>
                    </div>
                    <div class="setting-item">
                        <div class="setting-info">
                            <div class="setting-name">About Vault</div>
                            <div class="setting-desc">Learn more about our mission</div>
                        </div>
                        <div class="setting-action" id="aboutVaultBtn">Learn More</div>
                    </div>
                    <div class="setting-item">
                        <div class="setting-info">
                            <div class="setting-name">Log Out</div>
                            <div class="setting-desc">Sign out of your account</div>
                        </div>
                        <div class="setting-action" id="logoutBtn" style="color: var(--warning);">Log Out</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Modals -->
    <!-- Withdrawal Modal -->
    <div class="modal" id="withdrawalModal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">Withdraw Funds</h2>
                <button class="close-modal">&times;</button>
            </div>
            <form id="withdrawalForm" method="POST" action="dashboard.php">
                <input type="hidden" name="action" value="withdraw_funds">
                <input type="hidden" name="goal_id" value="<?php echo $user_data['goal_id'] ?? ''; ?>">
                <div class="form-group">
                    <label for="withdrawalAmount" class="form-label">Amount to Withdraw</label>
                    <input type="number" class="form-input" id="withdrawalAmount" name="amount" 
                           placeholder="Enter amount" min="1" max="<?php echo $user_data['current_amount'] ?? 0; ?>" required>
                    <small style="color: var(--text-light); margin-top: 5px; display: block;">
                        Available: <span id="availableAmount" class="naira"><?php echo number_format($user_data['current_amount'] ?? 0); ?></span>
                    </small>
                </div>
                <div class="form-group">
                    <label for="bankAccount" class="form-label">Bank Account</label>
                    <select id="bankAccount" class="form-input" name="bank_account" required>
                        <option value="">Select bank account</option>
                        <option value="access">Access Bank</option>
                        <option value="zenith">Zenith Bank</option>
                        <option value="uba">UBA Bank</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="withdrawalReason" class="form-label">Reason for Withdrawal</label>
                    <textarea class="form-input" id="withdrawalReason" name="reason" placeholder="Tell us why you are withdrawing"></textarea>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary close-modal">Cancel</button>
                    <button type="submit" class="btn btn-primary">Withdraw Funds</button>
                </div>
            </form>
        </div>
    </div>
    
    <!-- Add Goal Modal -->
    <div class="modal" id="addGoalModal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">Create New Goal</h2>
                <button class="close-modal">&times;</button>
            </div>
            <form id="addGoalForm" method="POST" action="dashboard.php">
                <input type="hidden" name="action" value="create_goal">
                <div class="form-group">
                    <label class="form-label">Goal Type</label>
                    <div style="display: flex; gap: 10px;">
                        <label style="flex: 1; text-align: center; padding: 12px; border: 1px solid var(--border); border-radius: 12px; cursor: pointer;">
                            <input type="radio" name="category" value="personal" style="margin-right: 5px;" checked>
                            Personal
                        </label>
                        <label style="flex: 1; text-align: center; padding: 12px; border: 1px solid var(--border); border-radius: 12px; cursor: pointer;">
                            <input type="radio" name="category" value="group" style="margin-right: 5px;">
                            Group
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label for="goalName" class="form-label">Goal Name</label>
                    <input type="text" class="form-input" id="goalName" name="goal_name" placeholder="e.g., New Laptop" required>
                </div>
                <div class="form-group">
                    <label for="goalAmount" class="form-label">Target Amount</label>
                    <input type="number" class="form-input" id="goalAmount" name="target_amount" placeholder="Enter amount" required>
                </div>
                <div class="form-group">
                    <label for="goalDeadline" class="form-label">Target Date</label>
                    <input type="date" class="form-input" id="goalDeadline" name="target_date" required>
                </div>
                <div class="form-group">
                    <label for="goalDescription" class="form-label">Description</label>
                    <textarea class="form-input" id="goalDescription" name="description" placeholder="Describe your goal"></textarea>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary close-modal">Cancel</button>
                    <button type="submit" class="btn btn-primary">Create Goal</button>
                </div>
            </form>
        </div>
    </div>
    
    <!-- Add Funds Modal -->
    <div class="modal" id="addFundsModal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">Add Funds to Goal</h2>
                <button class="close-modal">&times;</button>
            </div>
            <form id="addFundsForm" method="POST" action="dashboard.php">
                <input type="hidden" name="action" value="add_funds">
                <input type="hidden" name="goal_id" value="<?php echo $user_data['goal_id'] ?? ''; ?>">
                <div class="form-group">
                    <label for="fundAmount" class="form-label">Amount to Add</label>
                    <input type="number" class="form-input" id="fundAmount" name="amount" placeholder="Enter amount" required>
                </div>
                <div class="form-group">
                    <label for="paymentMethod" class="form-label">Payment Method</label>
                    <select id="paymentMethod" class="form-input" name="payment_method" required>
                        <option value="">Select payment method</option>
                        <option value="card">Debit/Credit Card</option>
                        <option value="bank">Bank Transfer</option>
                        <option value="ussd">USSD</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary close-modal">Cancel</button>
                    <button type="submit" class="btn btn-primary">Proceed to Payment</button>
                </div>
            </form>
        </div>
    </div>
    
    <!-- Profile Edit Modal -->
    <div class="modal" id="profileEditModal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">Edit Profile</h2>
                <button class="close-modal">&times;</button>
            </div>
            <form id="profileEditForm" method="POST" action="dashboard.php">
                <input type="hidden" name="action" value="update_profile">
                <div class="form-group">
                    <label for="editName" class="form-label">Full Name</label>
                    <input type="text" class="form-input" id="editName" name="name" 
                           value="<?php echo htmlspecialchars($user_data['first_name'] . ' ' . $user_data['last_name']); ?>" 
                           placeholder="Enter your full name" required>
                </div>
                <div class="form-group">
                    <label for="editEmail" class="form-label">Email Address</label>
                    <input type="email" class="form-input" id="editEmail" name="email" 
                           value="<?php echo htmlspecialchars($user_data['email']); ?>" 
                           placeholder="Enter your email" required>
                </div>
                <div class="form-group">
                    <label for="editPhone" class="form-label">Phone Number</label>
                    <input type="tel" class="form-input" id="editPhone" name="phone" 
                           value="<?php echo htmlspecialchars($user_data['phone'] ?? ''); ?>" 
                           placeholder="Enter your phone number">
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary close-modal">Cancel</button>
                    <button type="submit" class="btn btn-primary">Save Changes</button>
                </div>
            </form>
        </div>
    </div>
    
    <!-- Change PIN Modal -->
    <div class="modal" id="changePinModal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">Change PIN</h2>
                <button class="close-modal">&times;</button>
            </div>
            <form id="changePinForm">
                <div class="form-group">
                    <label for="currentPin" class="form-label">Current PIN</label>
                    <input type="password" class="form-input" id="currentPin" placeholder="Enter current PIN" maxlength="4" required>
                </div>
                <div class="form-group">
                    <label for="newPin" class="form-label">New PIN</label>
                    <input type="password" class="form-input" id="newPin" placeholder="Enter new PIN" maxlength="4" required>
                </div>
                <div class="form-group">
                    <label for="confirmPin" class="form-label">Confirm New PIN</label>
                    <input type="password" class="form-input" id="confirmPin" placeholder="Confirm new PIN" maxlength="4" required>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary close-modal">Cancel</button>
                    <button type="submit" class="btn btn-primary">Change PIN</button>
                </div>
            </form>
        </div>
    </div>
    
    <!-- Mobile Navigation -->
    <div class="mobile-nav">
        <a href="dashboard.php" class="mobile-nav-item active" data-page="dashboard">
            <i class="fas fa-home"></i>
            <span>Home</span>
        </a>
        <a href="story.php" class="mobile-nav-item">
            <i class="fas fa-book-open"></i>
            <span>Story</span>
        </a>
        <a href="friend.php" class="mobile-nav-item">
            <i class="fas fa-users"></i>
            <span>Friends</span>
        </a>
        <a href="progress.php" class="mobile-nav-item">
            <i class="fas fa-chart-pie"></i>
            <span>Progress</span>
        </a>
        <a href="#" class="mobile-nav-item" id="mobileSettingsNav">
            <i class="fas fa-cog"></i>
            <span>Settings</span>
        </a>
    </div>
    
    <!-- AI Agent Notification -->
    <div class="ai-agent-notification" id="aiAgentNotification">
        <button class="close-notification">&times;</button>
        <div class="ai-agent-header">
            <div class="ai-agent-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="ai-agent-name">Vault AI</div>
        </div>
        <div class="ai-agent-message" id="aiAgentMessage">
            Welcome back, <?php echo htmlspecialchars($user_data['first_name']); ?>! Ready to continue your savings journey?
        </div>
    </div>
    
    <!-- Celebration Animation Container -->
    <div class="celebration" id="celebration"></div>
    
    <script>
        // Complete JavaScript with all functionality
        document.addEventListener('DOMContentLoaded', function() {
            // DOM Elements
            const navItems = document.querySelectorAll('.nav-item, .mobile-nav-item');
            const pageContents = document.querySelectorAll('.page-content');
            const pageTitle = document.getElementById('pageTitle');
            const welcomeMessage = document.getElementById('welcomeMessage');
            const progressMessage = document.getElementById('progressMessage');
            const currentGoalTitle = document.getElementById('currentGoalTitle');
            const currentGoalAmount = document.getElementById('currentGoalAmount');
            const savedAmount = document.getElementById('savedAmount');
            const targetAmount = document.getElementById('targetAmount');
            const goalProgress = document.getElementById('goalProgress');
            const savingsStreak = document.getElementById('savingsStreak');
            const monthlySavings = document.getElementById('monthlySavings');
            const totalSavings = document.getElementById('totalSavings');
            const goalsCompleted = document.getElementById('goalsCompleted');
            const savingsOptions = document.getElementById('savingsOptions');
            const badgesContainer = document.getElementById('badgesContainer');
            const addGoalBtn = document.getElementById('addGoalBtn');
            const addFundsBtn = document.getElementById('addFundsBtn');
            const withdrawBtn = document.getElementById('withdrawBtn');
            const notificationBell = document.getElementById('notificationBell');
            const aiAgentNotification = document.getElementById('aiAgentNotification');
            const aiAgentMessage = document.getElementById('aiAgentMessage');
            const celebration = document.getElementById('celebration');
            const settingsNav = document.getElementById('settingsNav');
            const mobileSettingsNav = document.getElementById('mobileSettingsNav');
            const dashboardContent = document.getElementById('dashboardContent');
            const settingsContent = document.getElementById('settingsContent');
            const createFirstGoalBtn = document.getElementById('createFirstGoalBtn');
            
            // Modal Elements
            const modals = document.querySelectorAll('.modal');
            const closeModalButtons = document.querySelectorAll('.close-modal');
            const withdrawalModal = document.getElementById('withdrawalModal');
            const addGoalModal = document.getElementById('addGoalModal');
            const addFundsModal = document.getElementById('addFundsModal');
            const profileEditModal = document.getElementById('profileEditModal');
            const changePinModal = document.getElementById('changePinModal');
            const withdrawalForm = document.getElementById('withdrawalForm');
            const addGoalForm = document.getElementById('addGoalForm');
            const addFundsForm = document.getElementById('addFundsForm');
            const profileEditForm = document.getElementById('profileEditForm');
            const changePinForm = document.getElementById('changePinForm');
            
            // Settings Elements
            const editProfileBtn = document.getElementById('editProfileBtn');
            const changePasswordBtn = document.getElementById('changePasswordBtn');
            const changePinBtn = document.getElementById('changePinBtn');
            const notificationSettingsBtn = document.getElementById('notificationSettingsBtn');
            const privacySettingsBtn = document.getElementById('privacySettingsBtn');
            const helpCenterBtn = document.getElementById('helpCenterBtn');
            const contactSupportBtn = document.getElementById('contactSupportBtn');
            const aboutVaultBtn = document.getElementById('aboutVaultBtn');
            const logoutBtn = document.getElementById('logoutBtn');
            const darkModeToggle = document.getElementById('darkModeToggle');
            const biometricToggle = document.getElementById('biometricToggle');
            const twoFactorToggle = document.getElementById('twoFactorToggle');
            const autoSaveToggle = document.getElementById('autoSaveToggle');
            const remindersToggle = document.getElementById('remindersToggle');
            const notificationsToggle = document.getElementById('notificationsToggle');
            const emailToggle = document.getElementById('emailToggle');
            const privacyToggle = document.getElementById('privacyToggle');
            const backupToggle = document.getElementById('backupToggle');
            const currencyBtn = document.getElementById('currencyBtn');
            const languageBtn = document.getElementById('languageBtn');
            
            // App State
            let userData = {
                name: "<?php echo addslashes($user_data['first_name'] . ' ' . $user_data['last_name']); ?>",
                email: "<?php echo addslashes($user_data['email']); ?>",
                currentGoal: {
                    title: "<?php echo addslashes($user_data['goal_name'] ?? 'No Active Goal'); ?>",
                    targetAmount: <?php echo $user_data['target_amount'] ?? 0; ?>,
                    savedAmount: <?php echo $user_data['current_amount'] ?? 0; ?>,
                    progress: <?php echo $progress; ?>
                },
                stats: {
                    savingsStreak: <?php echo $user_stats['savings_streak']; ?>,
                    monthlySavings: <?php echo $user_stats['monthly_savings']; ?>,
                    totalSavings: <?php echo $user_data['total_savings'] ?? 0; ?>,
                    goalsCompleted: <?php echo $user_data['completed_goals'] ?? 0; ?>
                },
                settings: {
                    darkMode: false,
                    biometricAuth: true,
                    twoFactorAuth: false,
                    autoSave: true,
                    reminders: true,
                    notifications: true,
                    emailNotifications: true,
                    privacyMode: false,
                    dataBackup: true,
                    currency: 'NGN',
                    language: 'English'
                }
            };
            
            // Initialize the app
            function initApp() {
                // Generate savings options
                generateSavingsOptions();
                
                // Set up event listeners
                setupEventListeners();
                
                // Show AI agent notification after a delay
                setTimeout(showAIAgentNotification, 3000);
                
                // Check for daily celebration
                checkForDailyCelebration();
            }
            
            // Generate savings options
            function generateSavingsOptions() {
                const options = [
                    { amount: 50, label: 'Daily Save', details: 'Save ₦50 every day' },
                    { amount: 100, label: 'Weekly Boost', details: 'Save ₦100 every week' },
                    { amount: 500, label: 'Monthly Goal', details: 'Save ₦500 every month' },
                    { amount: 1000, label: 'Big Save', details: 'Save ₦1000 one-time' }
                ];
                
                savingsOptions.innerHTML = '';
                
                options.forEach(option => {
                    const optionElement = document.createElement('div');
                    optionElement.className = 'savings-option';
                    optionElement.innerHTML = `
                        <div class="option-amount naira">${option.amount}</div>
                        <div class="option-label">${option.label}</div>
                        <div class="option-details">
                            <div class="detail-item">${option.details}</div>
                            <div class="detail-item">Instant transfer</div>
                        </div>
                    `;
                    
                    optionElement.addEventListener('click', () => {
                        // Show add funds modal with pre-filled amount
                        document.getElementById('fundAmount').value = option.amount;
                        showModal(addFundsModal);
                    });
                    
                    savingsOptions.appendChild(optionElement);
                });
            }
            
            // Set up event listeners
            function setupEventListeners() {
                // Settings navigation
                settingsNav.addEventListener('click', function(e) {
                    e.preventDefault();
                    showSettings();
                });
                
                mobileSettingsNav.addEventListener('click', function(e) {
                    e.preventDefault();
                    showSettings();
                });
                
                // Modal controls
                closeModalButtons.forEach(button => {
                    button.addEventListener('click', function() {
                        hideAllModals();
                    });
                });
                
                // Close modals when clicking outside
                modals.forEach(modal => {
                    modal.addEventListener('click', function(e) {
                        if (e.target === this) {
                            hideAllModals();
                        }
                    });
                });
                
                // Form submissions
                withdrawalForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    processWithdrawal();
                });
                
                addGoalForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    // Form will submit via PHP
                });
                
                addFundsForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    // Form will submit via PHP
                });
                
                profileEditForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    // Form will submit via PHP
                });
                
                changePinForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    updatePin();
                });
                
                // Button clicks
                addGoalBtn.addEventListener('click', function() {
                    showModal(addGoalModal);
                });
                
                addFundsBtn.addEventListener('click', function() {
                    showModal(addFundsModal);
                });
                
                withdrawBtn.addEventListener('click', function() {
                    showModal(withdrawalModal);
                });
                
                if (createFirstGoalBtn) {
                    createFirstGoalBtn.addEventListener('click', function() {
                        showModal(addGoalModal);
                    });
                }
                
                notificationBell.addEventListener('click', function() {
                    showAIAgentNotification();
                });
                
                // Settings actions
                editProfileBtn.addEventListener('click', function() {
                    showModal(profileEditModal);
                });
                
                changePasswordBtn.addEventListener('click', function() {
                    alert('Password change functionality would be implemented here');
                });
                
                changePinBtn.addEventListener('click', function() {
                    showModal(changePinModal);
                });
                
                notificationSettingsBtn.addEventListener('click', function() {
                    alert('Notification settings would be implemented here');
                });
                
                privacySettingsBtn.addEventListener('click', function() {
                    alert('Privacy settings would be implemented here');
                });
                
                helpCenterBtn.addEventListener('click', function() {
                    alert('Help center would be opened here');
                });
                
                contactSupportBtn.addEventListener('click', function() {
                    alert('Contact support would be opened here');
                });
                
                aboutVaultBtn.addEventListener('click', function() {
                    alert('About Vault information would be shown here');
                });
                
                logoutBtn.addEventListener('click', function() {
                    if (confirm('Are you sure you want to log out?')) {
                        window.location.href = 'logout.php';
                    }
                });
                
                // Settings toggles
                darkModeToggle.addEventListener('change', function() {
                    userData.settings.darkMode = this.checked;
                    applyDarkMode();
                });
                
                biometricToggle.addEventListener('change', function() {
                    userData.settings.biometricAuth = this.checked;
                });
                
                twoFactorToggle.addEventListener('change', function() {
                    userData.settings.twoFactorAuth = this.checked;
                });
                
                autoSaveToggle.addEventListener('change', function() {
                    userData.settings.autoSave = this.checked;
                });
                
                remindersToggle.addEventListener('change', function() {
                    userData.settings.reminders = this.checked;
                });
                
                notificationsToggle.addEventListener('change', function() {
                    userData.settings.notifications = this.checked;
                });
                
                emailToggle.addEventListener('change', function() {
                    userData.settings.emailNotifications = this.checked;
                });
                
                privacyToggle.addEventListener('change', function() {
                    userData.settings.privacyMode = this.checked;
                });
                
                backupToggle.addEventListener('change', function() {
                    userData.settings.dataBackup = this.checked;
                });
                
                currencyBtn.addEventListener('click', function() {
                    alert('Currency selection would be implemented here');
                });
                
                languageBtn.addEventListener('click', function() {
                    alert('Language selection would be implemented here');
                });
                
                // Close AI agent notification
                document.querySelector('.close-notification').addEventListener('click', function() {
                    aiAgentNotification.style.display = 'none';
                });
                
                // Mobile navigation
                document.querySelectorAll('.mobile-nav-item').forEach(item => {
                    item.addEventListener('click', function(e) {
                        if (this.id === 'mobileSettingsNav') {
                            e.preventDefault();
                            showSettings();
                        }
                    });
                });
            }
            
            // Show settings page
            function showSettings() {
                dashboardContent.classList.remove('active');
                settingsContent.classList.add('active');
                pageTitle.textContent = 'Settings';
                
                // Update active nav items
                navItems.forEach(item => {
                    item.classList.remove('active');
                });
                settingsNav.classList.add('active');
                
                document.querySelectorAll('.mobile-nav-item').forEach(item => {
                    item.classList.remove('active');
                });
                mobileSettingsNav.classList.add('active');
            }
            
            // Apply dark mode
            function applyDarkMode() {
                if (userData.settings.darkMode) {
                    document.body.classList.add('dark-mode');
                } else {
                    document.body.classList.remove('dark-mode');
                }
            }
            
            // Modal functions
            function showModal(modal) {
                hideAllModals();
                modal.style.display = 'flex';
            }
            
            function hideAllModals() {
                modals.forEach(modal => {
                    modal.style.display = 'none';
                });
            }
            
            // Process withdrawal
            function processWithdrawal() {
                const amount = document.getElementById('withdrawalAmount').value;
                const bankAccount = document.getElementById('bankAccount').value;
                const reason = document.getElementById('withdrawalReason').value;
                
                if (!amount || !bankAccount) {
                    alert('Please fill in all required fields');
                    return;
                }
                
                // Form will submit via PHP
                alert(`Withdrawal request for ₦${amount} submitted successfully!`);
                hideAllModals();
            }
            
            // Update PIN
            function updatePin() {
                const currentPin = document.getElementById('currentPin').value;
                const newPin = document.getElementById('newPin').value;
                const confirmPin = document.getElementById('confirmPin').value;
                
                if (!currentPin || !newPin || !confirmPin) {
                    alert('Please fill in all required fields');
                    return;
                }
                
                if (newPin !== confirmPin) {
                    alert('New PINs do not match');
                    return;
                }
                
                if (newPin.length !== 4) {
                    alert('PIN must be 4 digits');
                    return;
                }
                
                // Simulate PIN change
                alert('PIN changed successfully!');
                
                // Close modal
                hideAllModals();
                changePinForm.reset();
            }
            
            // Show AI agent notification
            function showAIAgentNotification() {
                const messages = [
                    "Good morning! Don't forget to save today. Every little bit adds up!",
                    "You're doing great! Your savings streak is impressive.",
                    "Remember your goal! You're getting closer every day.",
                    "Consistency is key to financial success. Keep it up!",
                    "Did you know? Saving just ₦50 daily adds up to ₦18,250 in a year!",
                    "You're on track to reach your goal ahead of schedule!"
                ];
                
                const randomMessage = messages[Math.floor(Math.random() * messages.length)];
                aiAgentMessage.textContent = randomMessage;
                aiAgentNotification.style.display = 'block';
                
                // Auto-hide after 8 seconds
                setTimeout(() => {
                    aiAgentNotification.style.display = 'none';
                }, 8000);
            }
            
            // Check for daily celebration
            function checkForDailyCelebration() {
                // Check if user has saved today
                const hasSavedToday = Math.random() > 0.5; // Simulate random check
                
                if (hasSavedToday) {
                    // Show celebration after a delay
                    setTimeout(() => {
                        showCelebration("Congratulations! You've maintained your savings streak!");
                    }, 5000);
                }
            }
            
            // Show celebration animation
            function showCelebration(message) {
                // Create confetti
                for (let i = 0; i < 100; i++) {
                    const confetti = document.createElement('div');
                    confetti.className = 'confetti';
                    confetti.style.left = `${Math.random() * 100}%`;
                    confetti.style.animationDelay = `${Math.random() * 5}s`;
                    confetti.style.backgroundColor = getRandomColor();
                    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
                    celebration.appendChild(confetti);
                }
                
                // Show celebration
                celebration.style.opacity = '1';
                
                // Show message
                aiAgentMessage.textContent = message;
                aiAgentNotification.style.display = 'block';
                
                // Hide after 5 seconds
                setTimeout(() => {
                    celebration.style.opacity = '0';
                    celebration.innerHTML = '';
                }, 5000);
            }
            
            // Helper function to get random color
            function getRandomColor() {
                const colors = ['#2ecc71', '#3498db', '#f1c40f', '#e74c3c', '#9b59b6'];
                return colors[Math.floor(Math.random() * colors.length)];
            }
            
            // Initialize the app
            initApp();
        });
    </script>
</body>
</html>