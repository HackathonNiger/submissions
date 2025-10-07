<?php
// ussd.php
// Full USSD banking demo with airtime, data, bills, exam pins, merchant payments.
// Requirements: PHP + PDO + MySQL

header('Content-Type: text/plain; charset=utf-8');

/* ------------------------
   CONFIG - update these
   ------------------------ */
$dbHost = '127.0.0.1';
$dbName = 'ussd_bank';
$dbUser = 'root';
$dbPass = ''; // set your password
/* ------------------------ */

try {
    $pdo = new PDO("mysql:host=$dbHost;dbname=$dbName;charset=utf8mb4", $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (Exception $e) {
    // For demo only — show minimal message
    echo "END Service unavailable (DB error)";
    exit;
}









// ---------------------------
// FinX Bank USSD Script
// ---------------------------

header('Content-Type: text/plain; charset=utf-8');

// ---------------------------
// Simulated user data
// ---------------------------
$users = [
    'user' => [
        'balance' => 5000,
        'transactions' => []
    ]
];

// ---------------------------
// Read POST data from Africa's Talking
// ---------------------------
$sessionId   = $_POST["sessionId"];
$serviceCode = $_POST["serviceCode"];
$phoneNumber = $_POST["phoneNumber"];
$text        = $_POST["text"]; // User input text

// Split input by '*' to handle multi-step
$input = explode("*", $text);
$user = 'user'; // Single demo user

// ---------------------------
// USSD Menu Logic
// ---------------------------
if ($text == "") {
    // Main menu
    $response  = "CON Welcome to FinX Bank\n";
    $response .= "1. Check Balance\n";
    $response .= "2. Deposit\n";
    $response .= "3. Withdraw\n";
    $response .= "4. Transfer\n";
    $response .= "5. Airtime Top-up\n";
    $response .= "6. Data Purchase\n";
    $response .= "7. Pay Bills\n";
    $response .= "8. Buy Exam PIN\n";
    $response .= "9. Merchant / Other Payment\n";
    $response .= "10. Transaction History\n";
    $response .= "0. Exit";

} elseif ($input[0] == "1") {
    // Check Balance
    $response = "END Your balance is NGN " . $users[$user]['balance'];

} elseif ($input[0] == "2") {
    // Deposit
    if (!isset($input[1])) {
        $response = "CON Enter deposit amount:";
    } else {
        $amount = (float)$input[1];
        $users[$user]['balance'] += $amount;
        $users[$user]['transactions'][] = "Deposited NGN $amount";
        $response = "END Deposit successful! New balance: NGN " . $users[$user]['balance'];
    }

} elseif ($input[0] == "3") {
    // Withdraw
    if (!isset($input[1])) {
        $response = "CON Enter withdrawal amount:";
    } else {
        $amount = (float)$input[1];
        if ($amount > $users[$user]['balance']) {
            $response = "END Insufficient balance!";
        } else {
            $users[$user]['balance'] -= $amount;
            $users[$user]['transactions'][] = "Withdrew NGN $amount";
            $response = "END Withdrawal successful! New balance: NGN " . $users[$user]['balance'];
        }
    }

} elseif ($input[0] == "4") {
    // Transfer
    if (!isset($input[1])) {
        $response = "CON Enter recipient account number:";
    } elseif (!isset($input[2])) {
        $response = "CON Enter recipient name:";
    } elseif (!isset($input[3])) {
        $response = "CON Enter recipient bank name:";
    } elseif (!isset($input[4])) {
        $response = "CON Enter amount to transfer:";
    } else {
        $account = $input[1];
        $recipientName = $input[2];
        $recipientBank = $input[3];
        $amount = (float)$input[4];
        if ($amount > $users[$user]['balance']) {
            $response = "END Insufficient balance!";
        } else {
            $users[$user]['balance'] -= $amount;
            $users[$user]['transactions'][] = "Transferred NGN $amount to $recipientName (Acc: $account, Bank: $recipientBank)";
            $response = "END Transfer successful! NGN $amount sent to $recipientName (Acc: $account, Bank: $recipientBank).\nNew balance: NGN " . $users[$user]['balance'];
        }
    }

} elseif ($input[0] == "5") {
    // Airtime Top-up
    if (!isset($input[1])) {
        $response = "CON Enter recipient phone number:";
    } elseif (!isset($input[2])) {
        $response = "CON Enter provider (e.g., MTN, Glo, Airtel, 9mobile):";
    } elseif (!isset($input[3])) {
        $response = "CON Enter airtime amount:";
    } else {
        $recipient = $input[1];
        $provider = $input[2];
        $amount = (float)$input[3];
        if ($amount > $users[$user]['balance']) {
            $response = "END Insufficient balance!";
        } else {
            $users[$user]['balance'] -= $amount;
            $users[$user]['transactions'][] = "Airtime NGN $amount to $recipient ($provider)";
            $response = "END Airtime purchase successful! NGN $amount sent to $recipient ($provider)\nNew balance: NGN " . $users[$user]['balance'];
        }
    }

} elseif ($input[0] == "6") {
    // Data Purchase
    if (!isset($input[1])) {
        $response = "CON Enter recipient phone number:";
    } elseif (!isset($input[2])) {
        $response = "CON Enter provider (e.g., MTN, Glo, Airtel, 9mobile):";
    } elseif (!isset($input[3])) {
        $response = "CON Enter data amount (NGN):";
    } else {
        $recipient = $input[1];
        $provider = $input[2];
        $amount = (float)$input[3];
        if ($amount > $users[$user]['balance']) {
            $response = "END Insufficient balance!";
        } else {
            $users[$user]['balance'] -= $amount;
            $users[$user]['transactions'][] = "Data NGN $amount to $recipient ($provider)";
            $response = "END Data purchase successful! NGN $amount sent to $recipient ($provider)\nNew balance: NGN " . $users[$user]['balance'];
        }
    }

} elseif ($input[0] == "7") {
    // Pay Bills
    if (!isset($input[1])) {
        $response = "CON Enter biller name:";
    } elseif (!isset($input[2])) {
        $response = "CON Enter bill amount:";
    } else {
        $biller = $input[1];
        $amount = (float)$input[2];
        if ($amount > $users[$user]['balance']) {
            $response = "END Insufficient balance!";
        } else {
            $users[$user]['balance'] -= $amount;
            $users[$user]['transactions'][] = "Paid NGN $amount to $biller";
            $response = "END Bill payment successful! New balance: NGN " . $users[$user]['balance'];
        }
    }

} elseif ($input[0] == "8") {
    // Buy Exam PIN
    if (!isset($input[1])) {
        $response = "CON Enter exam provider:";
    } elseif (!isset($input[2])) {
        $response = "CON Enter PIN amount:";
    } else {
        $provider = $input[1];
        $amount = (float)$input[2];
        if ($amount > $users[$user]['balance']) {
            $response = "END Insufficient balance!";
        } else {
            $users[$user]['balance'] -= $amount;
            $pin = rand(100000, 999999);
            $users[$user]['transactions'][] = "Bought exam PIN NGN $amount for $provider (PIN: $pin)";
            $response = "END Exam PIN purchase successful! Your PIN: $pin\nNew balance: NGN " . $users[$user]['balance'];
        }
    }

} elseif ($input[0] == "9") {
    // Merchant / Other Payment
    if (!isset($input[1])) {
        $response = "CON Enter merchant name:";
    } elseif (!isset($input[2])) {
        $response = "CON Enter payment amount:";
    } else {
        $merchant = $input[1];
        $amount = (float)$input[2];
        if ($amount > $users[$user]['balance']) {
            $response = "END Insufficient balance!";
        } else {
            $users[$user]['balance'] -= $amount;
            $users[$user]['transactions'][] = "Paid NGN $amount to $merchant";
            $response = "END Payment successful! New balance: NGN " . $users[$user]['balance'];
        }
    }

} elseif ($input[0] == "10") {
    // Transaction History
    $txns = $users[$user]['transactions'];
    if (empty($txns)) {
        $response = "END No transactions yet.";
    } else {
        $response = "END Transaction History:\n" . implode("\n", $txns);
    }

} elseif ($input[0] == "0") {
    $response = "END Thank you for using FinX Bank.";

} else {
    $response = "END Invalid option. Please try again.";
}

// Send response
echo $response;
?>
