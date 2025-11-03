<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Payment - GestPay</title>
    <script src="https://telegram.org/js/telegram-web-app.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: var(--tg-theme-bg-color, #ffffff);
            color: var(--tg-theme-text-color, #000000);
            padding: 20px;
            min-height: 100vh;
        }
        
        .container {
            max-width: 400px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .logo {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        
        .title {
            font-size: 1.5em;
            font-weight: 600;
            margin-bottom: 5px;
        }
        
        .subtitle {
            color: var(--tg-theme-hint-color, #999);
            font-size: 0.9em;
        }
        
        .transaction-details {
            background: var(--tg-theme-secondary-bg-color, #f8f9fa);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 30px;
        }
        
        .detail-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        
        .detail-row:last-child {
            margin-bottom: 0;
        }
        
        .detail-label {
            color: var(--tg-theme-hint-color, #999);
            font-size: 0.9em;
        }
        
        .detail-value {
            font-weight: 600;
        }
        
        .amount {
            font-size: 1.2em;
            color: var(--tg-theme-accent-text-color, #007bff);
        }
        
        .pin-section {
            margin-bottom: 30px;
        }
        
        .pin-label {
            font-weight: 600;
            margin-bottom: 15px;
            text-align: center;
        }
        
        .pin-input-container {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-bottom: 20px;
        }
        
        .pin-digit {
            width: 50px;
            height: 50px;
            border: 2px solid var(--tg-theme-hint-color, #ddd);
            border-radius: 8px;
            text-align: center;
            font-size: 1.5em;
            font-weight: 600;
            background: var(--tg-theme-bg-color, #ffffff);
            color: var(--tg-theme-text-color, #000000);
        }
        
        .pin-digit:focus {
            outline: none;
            border-color: var(--tg-theme-accent-text-color, #007bff);
        }
        
        .verify-btn {
            width: 100%;
            padding: 15px;
            background: var(--tg-theme-button-color, #007bff);
            color: var(--tg-theme-button-text-color, #ffffff);
            border: none;
            border-radius: 12px;
            font-size: 1.1em;
            font-weight: 600;
            cursor: pointer;
            transition: opacity 0.2s;
        }
        
        .verify-btn:hover {
            opacity: 0.9;
        }
        
        .verify-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        .error-message {
            background: #fee;
            color: #c33;
            padding: 10px;
            border-radius: 8px;
            margin-bottom: 20px;
            text-align: center;
            display: none;
        }
        
        .success-message {
            background: #efe;
            color: #363;
            padding: 10px;
            border-radius: 8px;
            margin-bottom: 20px;
            text-align: center;
            display: none;
        }
        
        .loading {
            display: none;
            text-align: center;
            margin: 20px 0;
        }
        
        .spinner {
            border: 3px solid var(--tg-theme-hint-color, #ddd);
            border-top: 3px solid var(--tg-theme-accent-text-color, #007bff);
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 1s linear infinite;
            margin: 0 auto 10px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .security-note {
            text-align: center;
            font-size: 0.8em;
            color: var(--tg-theme-hint-color, #999);
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🔐</div>
            <div class="title">Verify Payment</div>
            <div class="subtitle">Enter your PIN to complete the transaction</div>
        </div>
        
        <div class="error-message" id="error-message"></div>
        <div class="success-message" id="success-message"></div>
        
        <div class="transaction-details" id="transaction-details">
            <div class="detail-row">
                <span class="detail-label">To:</span>
                <span class="detail-value" id="recipient">Loading...</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Amount:</span>
                <span class="detail-value amount" id="amount">Loading...</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Reference:</span>
                <span class="detail-value" id="reference">Loading...</span>
            </div>
        </div>
        
        <div class="pin-section">
            <div class="pin-label">Enter your 4-digit PIN</div>
            <div class="pin-input-container">
                <input type="password" class="pin-digit" maxlength="1" id="pin1">
                <input type="password" class="pin-digit" maxlength="1" id="pin2">
                <input type="password" class="pin-digit" maxlength="1" id="pin3">
                <input type="password" class="pin-digit" maxlength="1" id="pin4">
            </div>
        </div>
        
        <div class="loading" id="loading">
            <div class="spinner"></div>
            <div>Processing payment...</div>
        </div>
        
        <button class="verify-btn" id="verify-btn" onclick="verifyPayment()">
            Verify & Complete Payment
        </button>
        
        <div class="security-note">
            🔒 Your PIN is encrypted and secure. This transaction will be processed immediately upon verification.
        </div>
    </div>

    <script>
        // Initialize Telegram WebApp
        let tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();
        
        // Get token from URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        
        if (!token) {
            showError('Invalid or missing token');
        } else {
            loadTransactionDetails();
        }
        
        // PIN input handling
        const pinInputs = document.querySelectorAll('.pin-digit');
        
        pinInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                if (e.target.value.length === 1 && index < pinInputs.length - 1) {
                    pinInputs[index + 1].focus();
                }
                
                // Enable/disable verify button
                const allFilled = Array.from(pinInputs).every(input => input.value.length === 1);
                document.getElementById('verify-btn').disabled = !allFilled;
            });
            
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
                    pinInputs[index - 1].focus();
                }
            });
        });
        
        // Auto-focus first input
        pinInputs[0].focus();
        
        async function loadTransactionDetails() {
            try {
                const response = await fetch(`/api/v1/telegram/transaction-details?token=${token}`);
                const data = await response.json();
                
                if (data.success) {
                    document.getElementById('recipient').textContent = data.data.recipient;
                    document.getElementById('amount').textContent = `₦${data.data.amount}`;
                    document.getElementById('reference').textContent = data.data.reference;
                } else {
                    showError(data.message || 'Failed to load transaction details');
                }
            } catch (error) {
                showError('Failed to load transaction details');
            }
        }
        
        async function verifyPayment() {
            const pin = Array.from(pinInputs).map(input => input.value).join('');
            
            if (pin.length !== 4) {
                showError('Please enter your 4-digit PIN');
                return;
            }
            
            setLoading(true);
            
            try {
                const response = await fetch('/api/v1/telegram/verify-pin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        token: token,
                        pin: pin
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    showSuccess('Payment completed successfully! 🎉');
                    
                    // Close WebApp after 2 seconds
                    setTimeout(() => {
                        tg.close();
                    }, 2000);
                } else {
                    showError(data.message || 'Payment verification failed');
                    clearPIN();
                }
            } catch (error) {
                showError('Network error. Please try again.');
                clearPIN();
            }
            
            setLoading(false);
        }
        
        function showError(message) {
            const errorDiv = document.getElementById('error-message');
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            
            // Hide success message
            document.getElementById('success-message').style.display = 'none';
            
            // Hide after 5 seconds
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 5000);
        }
        
        function showSuccess(message) {
            const successDiv = document.getElementById('success-message');
            successDiv.textContent = message;
            successDiv.style.display = 'block';
            
            // Hide error message
            document.getElementById('error-message').style.display = 'none';
        }
        
        function setLoading(loading) {
            document.getElementById('loading').style.display = loading ? 'block' : 'none';
            document.getElementById('verify-btn').disabled = loading;
            
            if (loading) {
                document.getElementById('verify-btn').textContent = 'Processing...';
            } else {
                document.getElementById('verify-btn').textContent = 'Verify & Complete Payment';
            }
        }
        
        function clearPIN() {
            pinInputs.forEach(input => input.value = '');
            pinInputs[0].focus();
        }
        
        // Handle Telegram WebApp events
        tg.onEvent('mainButtonClicked', verifyPayment);
        
        // Set main button
        tg.MainButton.setText('Verify Payment');
        tg.MainButton.show();
    </script>
</body>
</html>
