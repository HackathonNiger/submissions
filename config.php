<?php
// config.php - XAMPP Configuration
class Database {
    private $host = "localhost";
    private $db_name = "vault_app";
    private $username = "root";  // XAMPP default username
    private $password = "";      // XAMPP default password (empty)
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception) {
            // For XAMPP, show detailed error for debugging
            error_log("Database connection error: " . $exception->getMessage());
            echo "Database connection failed. Please check your XAMPP MySQL server is running.";
        }
        return $this->conn;
    }
}

// Start session
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Set timezone
date_default_timezone_set('UTC');
?>