<?php
header("Content-Type: application/json");
require_once '../../../config/config.php';

// This script helps set up the Telegram bot webhook
// Run this once to configure your bot

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <title>Telegram Bot Setup - GestPay</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
            .form-group { margin-bottom: 20px; }
            label { display: block; margin-bottom: 5px; font-weight: bold; }
            input, textarea { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
            button { background: #007bff; color: white; padding: 12px 24px; border: none; border-radius: 5px; cursor: pointer; }
            .info { background: #e7f3ff; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
            .success { background: #d4edda; color: #155724; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .error { background: #f8d7da; color: #721c24; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <h1>🤖 Telegram Bot Setup</h1>
        
        <div class="info">
            <h3>Setup Instructions:</h3>
            <ol>
                <li>Create a bot with @BotFather on Telegram</li>
                <li>Get your bot token</li>
                <li>Get your A4F API key for AI parsing (https://api.a4f.co)</li>
                <li>Fill in the form below and click "Setup Bot"</li>
                <li>Your webhook will be automatically configured</li>
            </ol>
            <p><strong>Note:</strong> The system uses A4F API which provides access to OpenAI models with the same response structure.</p>
        </div>
        
        <form method="POST">
            <div class="form-group">
                <label>Bot Token (from @BotFather):</label>
                <input type="text" name="bot_token" required placeholder="123456789:ABCDEF...">
            </div>
            
            <div class="form-group">
                <label>Webhook URL:</label>
                <input type="url" name="webhook_url" value="<?php echo $SITE_URL; ?>/api/v1/telegram/webhook.php" required>
            </div>
            
            <div class="form-group">
                <label>Webhook Secret (optional):</label>
                <input type="text" name="webhook_secret" placeholder="Leave empty for auto-generation">
            </div>
            
            <div class="form-group">
                <label>A4F API Key:</label>
                <input type="text" name="ai_api_key" required placeholder="ddc-a4f-..." value="ddc-a4f-e70ba80b63194e51b4b0709133358f49">
            </div>
            
            <div class="form-group">
                <label>AI Model:</label>
                <input type="text" name="ai_model" value="provider-3/gpt-4o-mini" required>
            </div>
            
            <button type="submit">🚀 Setup Bot</button>
        </form>
    </body>
    </html>
    <?php
    exit;
}

// Process form submission
$bot_token = $_POST['bot_token'] ?? '';
$webhook_url = $_POST['webhook_url'] ?? '';
$webhook_secret = $_POST['webhook_secret'] ?? bin2hex(random_bytes(16));
$ai_api_key = $_POST['ai_api_key'] ?? '';
$ai_model = $_POST['ai_model'] ?? 'gpt-4o-mini';

if (!$bot_token || !$webhook_url || !$ai_api_key) {
    echo '<div class="error">All fields are required!</div>';
    exit;
}

try {
    // Save bot configuration
    $stmt = $conn->prepare("INSERT INTO telegram_bot_config (bot_token, webhook_url, webhook_secret, ai_api_key, ai_model) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE bot_token = VALUES(bot_token), webhook_url = VALUES(webhook_url), webhook_secret = VALUES(webhook_secret), ai_api_key = VALUES(ai_api_key), ai_model = VALUES(ai_model)");
    $stmt->bind_param("sssss", $bot_token, $webhook_url, $webhook_secret, $ai_api_key, $ai_model);
    $stmt->execute();
    
    // Set webhook with Telegram
    $webhook_data = [
        'url' => $webhook_url,
        'secret_token' => $webhook_secret,
        'allowed_updates' => ['message', 'callback_query']
    ];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://api.telegram.org/bot{$bot_token}/setWebhook");
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($webhook_data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    $telegram_response = json_decode($response, true);
    
    if ($http_code === 200 && $telegram_response['ok']) {
        echo '<div class="success">✅ Bot setup successful! Your webhook is now active.</div>';
        echo '<div class="info"><strong>Next steps:</strong><br>1. Start a chat with your bot<br>2. Send /start to begin<br>3. Test the payment features</div>';
    } else {
        echo '<div class="error">❌ Webhook setup failed: ' . ($telegram_response['description'] ?? 'Unknown error') . '</div>';
    }
    
} catch (Exception $e) {
    echo '<div class="error">❌ Database error: ' . $e->getMessage() . '</div>';
}
