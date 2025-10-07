<?php
// Database Configuration for the entire site
// This configuration is critical; handle with care to avoid site shutdown

// Set the default timezone to Africa/Lagos
date_default_timezone_set('Africa/Lagos');

// Database connection parameters
$servername = "localhost"; // Database server name
$username = "root";         // Database username
$password = "";             // Database password (leave empty if no password)
$dbname = "gestpay";   // Database name

// Create a new connection to the MySQL database
$conn = new mysqli($servername, $username, $password, $dbname);

// Check if the connection was successful
if ($conn->connect_error) {
    // If there is a connection error, terminate the script and display the error
    die("Connection failed: " . $conn->connect_error);
}

// Set the character set to UTF-8
if (!$conn->set_charset("utf8")) {
    die("Error loading character set utf8: " . $conn->error);
}

// Additional site configurations can be added below
// Example: Site URL, Admin Email, etc.
$SITE_URL = "http://localhost/gestpay";
$APP_NAME = "Reapvest";
$APP_URL = "http://localhost/gestpay";
$APP_ABS_PATH = "c:\/xampp\/htdocs\/gestpay";
$APP_EMAIL = "noreply@gestpay.com";
$APP_EMAIL_HOST = "mail.gestpay.com";
$APP_EMAIL_PASSWORD = '';
