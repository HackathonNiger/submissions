<?php
// sign.php - Enhanced with PHP for XAMPP
require_once 'config.php';

// Track page visit
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

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $errors = [];
    
    // Validate and sanitize input
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $artisan = trim($_POST['artisan'] ?? '');
    $goal_title = trim($_POST['goalTitle'] ?? '');
    $goal_amount = floatval($_POST['goalAmount'] ?? 0);
    $timeline = intval($_POST['timeline'] ?? 0);
    $password = $_POST['password'] ?? '';
    $pin = $_POST['pin'] ?? '';

    // Validation
    if (empty($name)) $errors[] = "Full name is required";
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "Valid email is required";
    if (empty($phone)) $errors[] = "Phone number is required";
    if (empty($artisan)) $errors[] = "Please select your craft";
    if (empty($goal_title)) $errors[] = "Goal title is required";
    if ($goal_amount <= 0) $errors[] = "Valid goal amount is required";
    if ($timeline <= 0) $errors[] = "Valid timeline is required";
    if (strlen($password) < 8) $errors[] = "Password must be at least 8 characters";
    if (!preg_match('/^\d{4}$/', $pin)) $errors[] = "PIN must be exactly 4 digits";

    // Check if email already exists
    if (empty($errors)) {
        try {
            $database = new Database();
            $db = $database->getConnection();
            
            $checkEmailQuery = "SELECT id FROM users WHERE email = :email";
            $stmt = $db->prepare($checkEmailQuery);
            $stmt->bindParam(":email", $email);
            $stmt->execute();
            
            if ($stmt->rowCount() > 0) {
                $errors[] = "Email already exists. Please use a different email.";
            }
        } catch (Exception $e) {
            $errors[] = "Database error. Please try again.";
        }
    }

    // If no errors, create user
    if (empty($errors)) {
        try {
            $password_hash = password_hash($password, PASSWORD_DEFAULT);
            $pin_hash = password_hash($pin, PASSWORD_DEFAULT);
            
            $query = "INSERT INTO users (username, email, password_hash, first_name, last_name, created_at) 
                      VALUES (:username, :email, :password_hash, :first_name, :last_name, NOW())";
            
            $stmt = $db->prepare($query);
            
            // Split name into first and last name
            $name_parts = explode(' ', $name, 2);
            $first_name = $name_parts[0];
            $last_name = $name_parts[1] ?? '';
            
            $stmt->bindParam(":username", $email); // Using email as username for now
            $stmt->bindParam(":email", $email);
            $stmt->bindParam(":password_hash", $password_hash);
            $stmt->bindParam(":first_name", $first_name);
            $stmt->bindParam(":last_name", $last_name);
            
            if ($stmt->execute()) {
                $user_id = $db->lastInsertId();
                
                // Create savings goal
                $goalQuery = "INSERT INTO savings_goals (user_id, goal_name, target_amount, target_date, category, created_at) 
                             VALUES (:user_id, :goal_name, :target_amount, DATE_ADD(NOW(), INTERVAL :timeline DAY), :category, NOW())";
                
                $stmt = $db->prepare($goalQuery);
                $stmt->bindParam(":user_id", $user_id);
                $stmt->bindParam(":goal_name", $goal_title);
                $stmt->bindParam(":target_amount", $goal_amount);
                $stmt->bindParam(":timeline", $timeline);
                $stmt->bindParam(":category", $artisan);
                
                if ($stmt->execute()) {
                    // Store user info in session
                    $_SESSION['user_id'] = $user_id;
                    $_SESSION['username'] = $email;
                    $_SESSION['first_name'] = $first_name;
                    
                    // Redirect to dashboard
                    header("Location: dashboard.php");
                    exit();
                }
            }
        } catch (Exception $e) {
            $errors[] = "Error creating account: " . $e->getMessage();
        }
    }
}

// Track this page visit
trackPageVisit('signup');
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vault - Sign Up</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Inter', sans-serif;
        }
        
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
        }
        
        body {
            background: #f5f7fa;
            color: var(--text-dark);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px;
            position: relative;
            overflow-x: hidden;
        }

        /* Error Message Styles */
        .error-message {
            background: #e74c3c;
            color: white;
            padding: 12px 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            text-align: center;
            animation: fadeIn 0.3s ease;
        }

        .error-list {
            list-style: none;
            text-align: left;
        }

        .error-list li {
            margin: 5px 0;
            padding-left: 15px;
            position: relative;
        }

        .error-list li:before {
            content: '•';
            position: absolute;
            left: 0;
            color: white;
        }

        /* Success Message */
        .success-message {
            background: var(--success);
            color: white;
            padding: 12px 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            text-align: center;
            animation: fadeIn 0.3s ease;
        }

        /* Vault background effect */
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
        
        /* Floating Animation */
        .floating-background {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -2;
            opacity: 0.02;
            background: 
                radial-gradient(circle at 20% 30%, var(--primary) 0%, transparent 30%),
                radial-gradient(circle at 80% 70%, var(--primary-dark) 0%, transparent 30%),
                radial-gradient(circle at 40% 80%, var(--accent) 0%, transparent 30%);
            animation: floatBackground 40s infinite linear;
        }
        
        @keyframes floatBackground {
            0% { transform: scale(1) rotate(0deg); }
            25% { transform: scale(1.05) rotate(90deg); }
            50% { transform: scale(1.1) rotate(180deg); }
            75% { transform: scale(1.05) rotate(270deg); }
            100% { transform: scale(1) rotate(360deg); }
        }
        
        /* Particle Animation */
        .particles {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            pointer-events: none;
        }

        .particle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: var(--primary);
            border-radius: 50%;
            opacity: 0;
            animation: particleFloat 15s infinite linear;
        }

        @keyframes particleFloat {
            0% {
                transform: translateY(100vh) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100px) rotate(360deg);
                opacity: 0;
            }
        }
        
        /* Logo */
        .logo-container {
            text-align: center;
            margin-bottom: 30px;
            animation: fadeInDown 1s ease-out;
        }
        
        .logo-icon {
            width: 80px;
            height: 80px;
            border-radius: 20px;
            background: var(--green-gradient);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 32px;
            margin: 0 auto 15px;
            box-shadow: 0 5px 15px rgba(46, 204, 113, 0.3);
            animation: spin 15s infinite linear;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .logo-text {
            font-size: 36px;
            font-weight: 800;
            color: var(--text-dark);
            letter-spacing: -1px;
        }
        
        .tagline {
            font-size: 16px;
            color: var(--text-light);
            margin-top: 5px;
        }
        
        /* Main Container */
        .container {
            width: 100%;
            max-width: 500px;
            background: var(--card-bg);
            border-radius: 20px;
            padding: 40px;
            box-shadow: var(--shadow);
            position: relative;
            overflow: hidden;
            animation: fadeInUp 0.8s ease-out;
        }
        
        .container::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent, rgba(46, 204, 113, 0.05), transparent);
            transform: rotate(45deg);
            animation: shine 8s infinite linear;
            z-index: 0;
        }
        
        @keyframes shine {
            0% {
                left: -50%;
            }
            100% {
                left: 150%;
            }
        }
        
        h1 {
            text-align: center;
            margin-bottom: 30px;
            color: var(--text-dark);
            font-size: 24px;
            font-weight: 700;
            position: relative;
            z-index: 1;
        }
        
        .form-group {
            margin-bottom: 20px;
            position: relative;
            z-index: 1;
        }
        
        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: var(--text-dark);
            font-size: 14px;
        }
        
        .input-wrapper {
            position: relative;
            display: flex;
            align-items: center;
        }
        
        input, select {
            width: 100%;
            padding: 14px 45px 14px 15px;
            border: 2px solid var(--border);
            border-radius: 12px;
            background-color: var(--light);
            color: var(--text-dark);
            font-size: 16px;
            transition: all 0.3s ease;
        }
        
        input:focus, select:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.1);
            background-color: white;
        }
        
        .input-icon {
            position: absolute;
            right: 15px;
            color: var(--text-light);
            transition: all 0.3s ease;
        }
        
        input:focus + .input-icon {
            color: var(--primary);
        }
        
        .tooltip {
            position: absolute;
            right: 40px;
            color: var(--text-light);
            cursor: help;
            z-index: 2;
            transition: all 0.3s ease;
        }
        
        .tooltip:hover {
            color: var(--primary);
        }
        
        button {
            width: 100%;
            padding: 16px;
            background: var(--green-gradient);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 10px;
            position: relative;
            overflow: hidden;
            z-index: 1;
        }
        
        button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            transition: left 0.5s;
        }
        
        button:hover::before {
            left: 100%;
        }
        
        button:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(46, 204, 113, 0.3);
        }
        
        button:active {
            transform: translateY(0);
        }
        
        .login-link {
            text-align: center;
            margin-top: 25px;
            color: var(--text-light);
            font-size: 14px;
            z-index: 1;
            position: relative;
        }
        
        .login-link a {
            color: var(--primary);
            text-decoration: none;
            font-weight: 600;
            transition: color 0.3s ease;
        }
        
        .login-link a:hover {
            color: var(--primary-dark);
            text-decoration: underline;
        }
        
        .copyright {
            text-align: center;
            margin-top: 30px;
            color: var(--text-light);
            font-size: 12px;
        }
        
        /* Progress Steps */
        .progress-steps {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            position: relative;
            z-index: 1;
        }
        
        .step {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: var(--light);
            border: 2px solid var(--border);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            color: var(--text-light);
            position: relative;
            transition: all 0.3s ease;
        }
        
        .step.active {
            background: var(--primary);
            border-color: var(--primary);
            color: white;
        }
        
        .step.completed {
            background: var(--primary);
            border-color: var(--primary);
            color: white;
        }
        
        .step-line {
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            height: 2px;
            background: var(--border);
            transform: translateY(-50%);
            z-index: -1;
        }
        
        .step-line-fill {
            position: absolute;
            top: 50%;
            left: 0;
            height: 2px;
            background: var(--primary);
            transform: translateY(-50%);
            transition: width 0.5s ease;
            z-index: -1;
        }
        
        /* Form Steps */
        .form-step {
            display: none;
            animation: fadeIn 0.5s ease;
        }
        
        .form-step.active {
            display: block;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        /* Toast Notification */
        .toast {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: var(--success);
            color: white;
            padding: 15px 25px;
            border-radius: 12px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            gap: 10px;
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 1001;
        }
        
        .toast.show {
            transform: translateY(0);
            opacity: 1;
        }
        
        .toast.error {
            background: #e74c3c;
        }
        
        /* Password Strength */
        .password-strength {
            height: 4px;
            background: var(--border);
            border-radius: 2px;
            margin-top: 8px;
            overflow: hidden;
        }
        
        .strength-fill {
            height: 100%;
            width: 0%;
            border-radius: 2px;
            transition: all 0.3s ease;
        }
        
        .strength-weak {
            background: #e74c3c;
            width: 33%;
        }
        
        .strength-medium {
            background: #f39c12;
            width: 66%;
        }
        
        .strength-strong {
            background: var(--success);
            width: 100%;
        }
        
        /* Responsive design */
        @media (max-width: 600px) {
            .container {
                padding: 30px 20px;
            }
            
            h1 {
                font-size: 22px;
            }
        }
    </style>
</head>
<body>
    <!-- Background Effects -->
    <div class="vault-background"></div>
    <div class="floating-background"></div>
    <div class="particles" id="particles"></div>
    
    <!-- Logo -->
    <div class="logo-container">
        <div class="logo-icon">
            <i class="fas fa-vault"></i>
        </div>
        <div class="logo-text">Vault</div>
        <div class="tagline">Save Today. Build Tomorrow.</div>
    </div>
    
    <!-- Main Container -->
    <div class="container">
        <h1>Create Your Vault Account</h1>
        
        <!-- Display PHP Errors -->
        <?php if (!empty($errors)): ?>
            <div class="error-message">
                <ul class="error-list">
                    <?php foreach ($errors as $error): ?>
                        <li><?php echo htmlspecialchars($error); ?></li>
                    <?php endforeach; ?>
                </ul>
            </div>
        <?php endif; ?>
        
        <!-- Progress Steps -->
        <div class="progress-steps">
            <div class="step completed">1</div>
            <div class="step active">2</div>
            <div class="step">3</div>
            <div class="step-line"></div>
            <div class="step-line-fill" id="stepProgress" style="width: 33%;"></div>
        </div>
        
        <!-- Form Steps -->
        <form id="signupForm" method="POST" action="">
            <!-- Step 1: Personal Info -->
            <div class="form-step active" id="step1">
                <div class="form-group">
                    <label for="name">Full Name</label>
                    <div class="input-wrapper">
                        <input type="text" id="name" name="name" placeholder="Enter your full name" required 
                               value="<?php echo isset($_POST['name']) ? htmlspecialchars($_POST['name']) : ''; ?>">
                        <span class="tooltip">
                            <i class="fas fa-question-circle"></i>
                        </span>
                        <i class="fas fa-user input-icon"></i>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <div class="input-wrapper">
                        <input type="email" id="email" name="email" placeholder="Enter your email" required
                               value="<?php echo isset($_POST['email']) ? htmlspecialchars($_POST['email']) : ''; ?>">
                        <span class="tooltip">
                            <i class="fas fa-question-circle"></i>
                        </span>
                        <i class="fas fa-envelope input-icon"></i>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="phone">Phone Number</label>
                    <div class="input-wrapper">
                        <input type="tel" id="phone" name="phone" placeholder="Enter your phone number" required
                               value="<?php echo isset($_POST['phone']) ? htmlspecialchars($_POST['phone']) : ''; ?>">
                        <span class="tooltip">
                            <i class="fas fa-question-circle"></i>
                        </span>
                        <i class="fas fa-phone input-icon"></i>
                    </div>
                </div>
                
                <button type="button" id="nextStep1">Continue <i class="fas fa-arrow-right"></i></button>
            </div>
            
            <!-- Step 2: Artisan & Goals -->
            <div class="form-step" id="step2">
                <div class="form-group">
                    <label for="artisan">Type of Artisan</label>
                    <div class="input-wrapper">
                        <select id="artisan" name="artisan" required>
                            <option value="">Select your craft</option>
                            <option value="carpenter" <?php echo (isset($_POST['artisan']) && $_POST['artisan'] == 'carpenter') ? 'selected' : ''; ?>>Carpenter</option>
                            <option value="tailor" <?php echo (isset($_POST['artisan']) && $_POST['artisan'] == 'tailor') ? 'selected' : ''; ?>>Tailor</option>
                            <option value="blacksmith" <?php echo (isset($_POST['artisan']) && $_POST['artisan'] == 'blacksmith') ? 'selected' : ''; ?>>Blacksmith</option>
                            <option value="potter" <?php echo (isset($_POST['artisan']) && $_POST['artisan'] == 'potter') ? 'selected' : ''; ?>>Potter</option>
                            <option value="jeweler" <?php echo (isset($_POST['artisan']) && $_POST['artisan'] == 'jeweler') ? 'selected' : ''; ?>>Jeweler</option>
                            <option value="other" <?php echo (isset($_POST['artisan']) && $_POST['artisan'] == 'other') ? 'selected' : ''; ?>>Other</option>
                        </select>
                        <span class="tooltip">
                            <i class="fas fa-question-circle"></i>
                        </span>
                        <i class="fas fa-briefcase input-icon"></i>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="goalTitle">Goal Title</label>
                    <div class="input-wrapper">
                        <input type="text" id="goalTitle" name="goalTitle" placeholder="e.g., New Equipment, Workshop Expansion" required
                               value="<?php echo isset($_POST['goalTitle']) ? htmlspecialchars($_POST['goalTitle']) : ''; ?>">
                        <span class="tooltip">
                            <i class="fas fa-question-circle"></i>
                        </span>
                        <i class="fas fa-bullseye input-icon"></i>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="goalAmount">Goal Amount (₦)</label>
                    <div class="input-wrapper">
                        <input type="number" id="goalAmount" name="goalAmount" placeholder="Enter target amount" min="1" required
                               value="<?php echo isset($_POST['goalAmount']) ? htmlspecialchars($_POST['goalAmount']) : ''; ?>">
                        <span class="tooltip">
                            <i class="fas fa-question-circle"></i>
                        </span>
                        <i class="fas fa-coins input-icon"></i>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="timeline">Target Timeline (days)</label>
                    <div class="input-wrapper">
                        <input type="number" id="timeline" name="timeline" placeholder="e.g., 90 days" min="1" required
                               value="<?php echo isset($_POST['timeline']) ? htmlspecialchars($_POST['timeline']) : ''; ?>">
                        <span class="tooltip">
                            <i class="fas fa-question-circle"></i>
                        </span>
                        <i class="fas fa-calendar input-icon"></i>
                    </div>
                </div>
                
                <div style="display: flex; gap: 10px;">
                    <button type="button" id="prevStep2" style="background: var(--light); color: var(--text-dark);">
                        <i class="fas fa-arrow-left"></i> Back
                    </button>
                    <button type="button" id="nextStep2">Continue <i class="fas fa-arrow-right"></i></button>
                </div>
            </div>
            
            <!-- Step 3: Security -->
            <div class="form-step" id="step3">
                <div class="form-group">
                    <label for="password">Create Password</label>
                    <div class="input-wrapper">
                        <input type="password" id="password" name="password" placeholder="Create a strong password" required>
                        <span class="tooltip">
                            <i class="fas fa-question-circle"></i>
                        </span>
                        <i class="fas fa-lock input-icon"></i>
                    </div>
                    <div class="password-strength">
                        <div class="strength-fill" id="passwordStrength"></div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="confirmPassword">Confirm Password</label>
                    <div class="input-wrapper">
                        <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm your password" required>
                        <span class="tooltip">
                            <i class="fas fa-question-circle"></i>
                        </span>
                        <i class="fas fa-lock input-icon"></i>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="pin">Security PIN (4 digits)</label>
                    <div class="input-wrapper">
                        <input type="password" id="pin" name="pin" placeholder="Enter 4-digit PIN" maxlength="4" pattern="[0-9]{4}" required>
                        <span class="tooltip">
                            <i class="fas fa-question-circle"></i>
                        </span>
                        <i class="fas fa-key input-icon"></i>
                    </div>
                </div>
                
                <div style="display: flex; gap: 10px;">
                    <button type="button" id="prevStep3" style="background: var(--light); color: var(--text-dark);">
                        <i class="fas fa-arrow-left"></i> Back
                    </button>
                    <button type="submit" id="submitForm">Create Account <i class="fas fa-check"></i></button>
                </div>
            </div>
        </form>
        
        <div class="login-link">
            Already have an account? <a href="log.php">Log in here</a>
        </div>
    </div>
    
    <div class="copyright">
        &copy; Vault <?php echo date('Y'); ?>. All rights reserved.
    </div>
    
    <!-- Toast Notification -->
    <div class="toast" id="toast"></div>

    <script>
        // Create floating particles
        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            const particleCount = 50;
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                
                // Random properties
                const size = Math.random() * 3 + 1;
                const left = Math.random() * 100;
                const animationDuration = Math.random() * 20 + 10;
                const animationDelay = Math.random() * 10;
                const color = `hsl(${Math.random() * 360}, 70%, 60%)`;
                
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.left = `${left}%`;
                particle.style.animationDuration = `${animationDuration}s`;
                particle.style.animationDelay = `${animationDelay}s`;
                particle.style.background = color;
                
                particlesContainer.appendChild(particle);
            }
        }
        
        // Form step management
        let currentStep = 1;
        const totalSteps = 3;
        
        function showStep(step) {
            // Hide all steps
            document.querySelectorAll('.form-step').forEach(el => {
                el.classList.remove('active');
            });
            
            // Show current step
            document.getElementById(`step${step}`).classList.add('active');
            
            // Update progress steps
            document.querySelectorAll('.step').forEach((el, index) => {
                if (index + 1 < step) {
                    el.classList.remove('active');
                    el.classList.add('completed');
                } else if (index + 1 === step) {
                    el.classList.add('active');
                    el.classList.remove('completed');
                } else {
                    el.classList.remove('active', 'completed');
                }
            });
            
            // Update progress line
            const progressPercentage = ((step - 1) / (totalSteps - 1)) * 100;
            document.getElementById('stepProgress').style.width = `${progressPercentage}%`;
            
            currentStep = step;
        }
        
        // Password strength indicator
        function checkPasswordStrength(password) {
            let strength = 0;
            
            if (password.length >= 8) strength++;
            if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
            if (password.match(/\d/)) strength++;
            if (password.match(/[^a-zA-Z\d]/)) strength++;
            
            const strengthFill = document.getElementById('passwordStrength');
            strengthFill.className = 'strength-fill';
            
            if (strength <= 1) {
                strengthFill.classList.add('strength-weak');
            } else if (strength <= 3) {
                strengthFill.classList.add('strength-medium');
            } else {
                strengthFill.classList.add('strength-strong');
            }
        }
        
        // Show toast notification
        function showToast(message, isError = false) {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.className = 'toast';
            
            if (isError) {
                toast.classList.add('error');
            }
            
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
        
        // Form validation
        function validateStep(step) {
            let isValid = true;
            
            if (step === 1) {
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const phone = document.getElementById('phone').value;
                
                if (!name || !email || !phone) {
                    showToast('Please fill in all required fields', true);
                    isValid = false;
                } else if (!/^\S+@\S+\.\S+$/.test(email)) {
                    showToast('Please enter a valid email address', true);
                    isValid = false;
                }
            } else if (step === 2) {
                const artisan = document.getElementById('artisan').value;
                const goalTitle = document.getElementById('goalTitle').value;
                const goalAmount = document.getElementById('goalAmount').value;
                const timeline = document.getElementById('timeline').value;
                
                if (!artisan || !goalTitle || !goalAmount || !timeline) {
                    showToast('Please fill in all required fields', true);
                    isValid = false;
                }
            } else if (step === 3) {
                const password = document.getElementById('password').value;
                const confirmPassword = document.getElementById('confirmPassword').value;
                const pin = document.getElementById('pin').value;
                
                if (!password || !confirmPassword || !pin) {
                    showToast('Please fill in all required fields', true);
                    isValid = false;
                } else if (password !== confirmPassword) {
                    showToast('Passwords do not match', true);
                    isValid = false;
                } else if (password.length < 8) {
                    showToast('Password must be at least 8 characters', true);
                    isValid = false;
                } else if (!/^\d{4}$/.test(pin)) {
                    showToast('PIN must be exactly 4 digits', true);
                    isValid = false;
                }
            }
            
            return isValid;
        }
        
        // Initialize on page load
        document.addEventListener('DOMContentLoaded', function() {
            createParticles();
            
            // Step navigation
            document.getElementById('nextStep1').addEventListener('click', function() {
                if (validateStep(1)) {
                    showStep(2);
                }
            });
            
            document.getElementById('nextStep2').addEventListener('click', function() {
                if (validateStep(2)) {
                    showStep(3);
                }
            });
            
            document.getElementById('prevStep2').addEventListener('click', function() {
                showStep(1);
            });
            
            document.getElementById('prevStep3').addEventListener('click', function() {
                showStep(2);
            });
            
            // Password strength indicator
            document.getElementById('password').addEventListener('input', function() {
                checkPasswordStrength(this.value);
            });
            
            // Form submission
            document.getElementById('signupForm').addEventListener('submit', function(e) {
                // Client-side validation
                if (!validateStep(3)) {
                    e.preventDefault();
                }
            });
            
            // Add some interactive effects to inputs
            const inputs = document.querySelectorAll('input, select');
            inputs.forEach(input => {
                input.addEventListener('focus', function() {
                    this.parentElement.style.transform = 'scale(1.02)';
                });
                
                input.addEventListener('blur', function() {
                    this.parentElement.style.transform = 'scale(1)';
                });
            });

            // Auto-advance on Enter key
            document.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (currentStep === 1) {
                        document.getElementById('nextStep1').click();
                    } else if (currentStep === 2) {
                        document.getElementById('nextStep2').click();
                    } else if (currentStep === 3) {
                        document.getElementById('submitForm').click();
                    }
                }
            });
        });
    </script>
</body>
</html>