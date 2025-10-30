<?php
// welcome.php - Enhanced with PHP for XAMPP
require_once 'config.php';

// Function to track page visits
function trackPageVisit($page) {
    try {
        $database = new Database();
        $db = $database->getConnection();
        
        // Check if connection is successful
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
        // Log error but don't break the page
        error_log("Error tracking page visit: " . $e->getMessage());
    }
    return false;
}

// Function to get visit statistics
function getVisitStats() {
    try {
        $database = new Database();
        $db = $database->getConnection();
        
        if ($db) {
            $query = "SELECT 
                        COUNT(*) as total_visits,
                        COUNT(DISTINCT ip_address) as unique_visitors,
                        COUNT(DISTINCT session_id) as unique_sessions
                      FROM page_visits 
                      WHERE visit_time >= DATE_SUB(NOW(), INTERVAL 24 HOUR)";
            
            $stmt = $db->prepare($query);
            $stmt->execute();
            
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result ?: ['total_visits' => 0, 'unique_visitors' => 0, 'unique_sessions' => 0];
        }
    } catch (Exception $e) {
        error_log("Error getting visit stats: " . $e->getMessage());
    }
    return ['total_visits' => 0, 'unique_visitors' => 0, 'unique_sessions' => 0];
}

// Track this page visit
trackPageVisit('welcome');

// Get visit statistics
$stats = getVisitStats();

// Check if user is already logged in
$isLoggedIn = isset($_SESSION['user_id']);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vault - Save Today, Build Tomorrow</title>
    <meta name="description" content="Vault - Your smart savings companion for building financial freedom">
    <meta name="theme-color" content="#2ecc71">
    <link rel="manifest" href="manifest.json">
    <link rel="icon" type="image/png" href="icons/icon-192x192.png">
    <link rel="apple-touch-icon" href="icons/icon-192x192.png">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        /* Your existing CSS styles */
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
            overflow-x: hidden;
            display: flex;
            flex-direction: column;
        }

        /* PWA Install Prompt */
        .install-prompt {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--card-bg);
            border-radius: 12px;
            padding: 15px 20px;
            box-shadow: 0 5px 25px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            display: none;
            align-items: center;
            gap: 15px;
            max-width: 90%;
            animation: slideUp 0.5s ease-out;
        }

        .install-prompt.show {
            display: flex;
        }

        .install-prompt p {
            flex: 1;
            font-size: 14px;
            color: var(--text-dark);
        }

        .install-btn {
            background: var(--primary);
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .install-btn:hover {
            background: var(--primary-dark);
        }

        .close-prompt {
            background: none;
            border: none;
            color: var(--text-light);
            cursor: pointer;
            font-size: 18px;
        }

        /* Offline Indicator */
        .offline-indicator {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: var(--warning);
            color: white;
            text-align: center;
            padding: 10px;
            z-index: 1001;
            display: none;
        }

        .offline-indicator.show {
            display: block;
            animation: slideDown 0.5s ease-out;
        }

        @keyframes slideDown {
            from { transform: translateY(-100%); }
            to { transform: translateY(0); }
        }

        @keyframes slideUp {
            from { transform: translateX(-50%) translateY(100%); opacity: 0; }
            to { transform: translateX(-50%) translateY(0); opacity: 1; }
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
        
        /* Main Content */
        .main-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 30px;
            text-align: center;
        }
        
        /* Logo Animation */
        .logo-container {
            margin-bottom: 40px;
            animation: fadeInDown 1.2s ease-out;
        }
        
        .logo-icon {
            width: 120px;
            height: 120px;
            border-radius: 30px;
            background: var(--green-gradient);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 50px;
            margin: 0 auto 25px;
            box-shadow: 0 10px 30px rgba(46, 204, 113, 0.3);
            animation: spin 20s infinite linear, pulse 3s infinite alternate;
            position: relative;
            overflow: hidden;
        }
        
        .logo-icon::after {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
            opacity: 0;
            transition: opacity 0.3s;
        }
        
        .logo-icon:hover::after {
            opacity: 1;
            animation: shine 3s infinite linear;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        @keyframes shine {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .logo-text {
            font-size: 72px;
            font-weight: 800;
            color: var(--text-dark);
            margin-bottom: 15px;
            letter-spacing: -1px;
            animation: fadeInUp 1s ease-out 0.3s both;
            position: relative;
        }
        
        .logo-text::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
            height: 4px;
            background: var(--green-gradient);
            border-radius: 2px;
        }
        
        .tagline {
            font-size: 28px;
            color: var(--text-light);
            margin-bottom: 50px;
            font-weight: 400;
            animation: fadeInUp 1s ease-out 0.6s both;
        }
        
        /* CTA Button */
        .cta-button {
            background: var(--green-gradient);
            color: white;
            border: none;
            padding: 18px 45px;
            border-radius: 50px;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            box-shadow: 0 5px 20px rgba(46, 204, 113, 0.3);
            position: relative;
            overflow: hidden;
            animation: fadeInUp 1s ease-out 0.9s both;
        }
        
        .cta-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            transition: left 0.5s;
        }
        
        .cta-button:hover::before {
            left: 100%;
        }
        
        .cta-button:hover {
            transform: translateY(-5px) scale(1.05);
            box-shadow: 0 10px 30px rgba(46, 204, 113, 0.4);
        }
        
        .cta-button:active {
            transform: translateY(0) scale(1);
        }
        
        .cta-button i {
            margin-left: 10px;
            transition: transform 0.3s ease;
        }
        
        .cta-button:hover i {
            transform: translateX(5px);
        }
        
        /* Features Section */
        .features {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin-top: 80px;
            animation: fadeInUp 1s ease-out 1.2s both;
        }
        
        .feature {
            background: var(--card-bg);
            border-radius: 20px;
            padding: 25px;
            width: 200px;
            box-shadow: var(--shadow);
            transition: all 0.4s ease;
        }
        
        .feature:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }
        
        .feature-icon {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: var(--green-gradient);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            margin: 0 auto 15px;
        }
        
        .feature-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 10px;
            color: var(--text-dark);
        }
        
        .feature-description {
            font-size: 14px;
            color: var(--text-light);
            line-height: 1.5;
        }
        
        /* Footer */
        .footer {
            padding: 20px;
            text-align: center;
            color: var(--text-light);
            font-size: 14px;
            margin-top: 50px;
        }
        
        /* Animations */
        @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-50px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(50px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .logo-text {
                font-size: 48px;
            }
            
            .tagline {
                font-size: 20px;
            }
            
            .features {
                flex-direction: column;
                align-items: center;
            }
            
            .feature {
                width: 100%;
                max-width: 300px;
            }

            .install-prompt {
                flex-direction: column;
                text-align: center;
                gap: 10px;
            }
        }

        @media (max-width: 480px) {
            .logo-text {
                font-size: 36px;
            }
            
            .tagline {
                font-size: 18px;
            }
            
            .cta-button {
                padding: 15px 30px;
                font-size: 16px;
            }
        }

        /* User Status Indicator */
        .user-status {
            position: absolute;
            top: 20px;
            right: 20px;
            background: var(--card-bg);
            padding: 10px 15px;
            border-radius: 25px;
            box-shadow: var(--shadow);
            font-size: 14px;
            display: <?php echo $isLoggedIn ? 'block' : 'none'; ?>;
        }
    </style>
</head>
<body>
    <!-- PWA Elements -->
    <div class="offline-indicator" id="offlineIndicator">
        You are currently offline. Some features may be limited.
    </div>

    <div class="install-prompt" id="installPrompt">
        <p>Install Vault for a better experience</p>
        <button class="install-btn" id="installButton">Install</button>
        <button class="close-prompt" id="closePrompt">&times;</button>
    </div>

    <!-- User Status -->
    <?php if ($isLoggedIn): ?>
    <div class="user-status">
        Welcome, <?php echo htmlspecialchars($_SESSION['username']); ?>! 
        <a href="dashboard.php" style="color: var(--primary); margin-left: 10px;">Dashboard</a> | 
        <a href="logout.php" style="color: var(--warning); margin-left: 5px;">Logout</a>
    </div>
    <?php endif; ?>

    <!-- Background Effects -->
    <div class="vault-background"></div>
    <div class="floating-background"></div>
    <div class="particles" id="particles"></div>
    
    <!-- Main Content -->
    <div class="main-content">
        <div class="logo-container">
            <div class="logo-icon">
                <i class="fas fa-vault"></i>
            </div>
            <h1 class="logo-text">Vault</h1>
            <p class="tagline">Save Today. Build Tomorrow.</p>
            
            <!-- Dynamic stats display -->
            <?php if ($stats['total_visits'] > 0): ?>
            <div style="margin-top: 20px; font-size: 14px; color: var(--text-light);">
                <p>Join <?php echo $stats['unique_visitors']; ?> savers today!</p>
            </div>
            <?php endif; ?>
        </div>
        
        <button class="cta-button" id="getStartedBtn">
            <?php echo $isLoggedIn ? 'Go to Dashboard' : 'Get Started'; ?> <i class="fas fa-arrow-right"></i>
        </button>
        
        <div class="features">
            <div class="feature">
                <div class="feature-icon">
                    <i class="fas fa-piggy-bank"></i>
                </div>
                <h3 class="feature-title">Smart Savings</h3>
                <p class="feature-description">Set goals and watch your savings grow with our intelligent tracking system</p>
            </div>
            
            <div class="feature">
                <div class="feature-icon">
                    <i class="fas fa-chart-line"></i>
                </div>
                <h3 class="feature-title">Track Progress</h3>
                <p class="feature-description">Visualize your financial journey with beautiful charts and insights</p>
            </div>
            
            <div class="feature">
                <div class="feature-icon">
                    <i class="fas fa-users"></i>
                </div>
                <h3 class="feature-title">Community</h3>
                <p class="feature-description">Join a community of savers and achieve your goals together</p>
            </div>
        </div>
    </div>
    
    <div class="footer">
        <p>© <?php echo date('Y'); ?> Vault. All rights reserved. Start your savings journey today.</p>
    </div>

    <script>
        // PWA Service Worker Registration
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
                navigator.serviceWorker.register('sw.js')
                    .then(function(registration) {
                        console.log('ServiceWorker registration successful with scope: ', registration.scope);
                    })
                    .catch(function(error) {
                        console.log('ServiceWorker registration failed: ', error);
                    });
            });
        }

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
        
        // Get Started button functionality
        document.getElementById('getStartedBtn').addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            
            // Redirect based on login status
            setTimeout(() => {
                <?php if ($isLoggedIn): ?>
                    window.location.href = 'dashboard.php';
                <?php else: ?>
                    window.location.href = 'sign.php';
                <?php endif; ?>
            }, 300);
            
            // Reset button animation
            setTimeout(() => {
                this.style.transform = '';
            }, 300);
        });

        // PWA Install Prompt
        let deferredPrompt;
        const installPrompt = document.getElementById('installPrompt');
        const installButton = document.getElementById('installButton');
        const closePrompt = document.getElementById('closePrompt');

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            setTimeout(() => {
                installPrompt.classList.add('show');
            }, 3000);
        });

        installButton.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                } else {
                    console.log('User dismissed the install prompt');
                }
                deferredPrompt = null;
                installPrompt.classList.remove('show');
            }
        });

        closePrompt.addEventListener('click', () => {
            installPrompt.classList.remove('show');
        });

        // Offline/Online detection
        const offlineIndicator = document.getElementById('offlineIndicator');

        window.addEventListener('online', () => {
            offlineIndicator.classList.remove('show');
        });

        window.addEventListener('offline', () => {
            offlineIndicator.classList.add('show');
        });

        if (!navigator.onLine) {
            offlineIndicator.classList.add('show');
        }

        // Initialize on page load
        document.addEventListener('DOMContentLoaded', function() {
            createParticles();
            
            document.querySelectorAll('.feature').forEach(feature => {
                feature.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-10px) scale(1.02)';
                });
                
                feature.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0) scale(1)';
                });
            });

            if (window.matchMedia('(display-mode: standalone)').matches) {
                console.log('Running in standalone mode');
            }
        });
    </script>
</body>
</html>