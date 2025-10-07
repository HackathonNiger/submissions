<?php
error_reporting(0);
date_default_timezone_set('Africa/Lagos');
include_once("bc-mailer.php");
include_once("bc-email-templates.php");
include_once("email-design.php");

mysqli_report(MYSQLI_REPORT_OFF);

//Connection Class
class DatabaseConnection
{
	private $conn;
	private $create_db;

	private $db_conn;

	public function __construct()
	{
		$config = $this->loadConfigFile($_SERVER["DOCUMENT_ROOT"] . "/config/db-config.json");

		$this->conn = new mysqli($config["server"], $config["user"], $config["pass"]);
		if (!$this->conn->connect_error) {
			$this->create_db = $this->conn->query("CREATE DATABASE IF NOT EXISTS " . $config["dbname"]);
			$this->db_conn = new mysqli($config["server"], $config["user"], $config["pass"], $config["dbname"]);
		}
	}

	private function loadConfigFile($filePath)
	{
		if (!file_exists($filePath)) {
			die("Configuration file not found!");
		}

		$config_json = file_get_contents($filePath);
		$config_decode = json_decode($config_json, true);

		if (json_last_error() !== JSON_ERROR_NONE) {
			die("Error decoding JSON: " . json_last_error_msg());
		}

		return $config_decode;
	}

	public function getConnection()
	{
		return $this->conn;
	}

	public function createDb()
	{
		return $this->create_db;
	}

	public function getDbConnection()
	{
		return $this->db_conn;
	}

	public function closeConnection()
	{
		return $this->conn->close();
	}
}

$db_connection = new DatabaseConnection();
$server_connection = $db_connection->getConnection();
$create_connection = $db_connection->createDb();
$get_connection = $db_connection->getDbConnection();

if ($server_connection) {
	if ($create_connection) {

	}
} else {
	die(mysqli_connect_error());
}

$db_connection_check = $get_connection;
if ($db_connection_check) {
	$connection_server = $db_connection_check;
	include_once("bc-tables.php");
} else {
	die("Database Connection Issue");
}


//Db date and time
mysqli_query($connection_server, "SET time_zone = '+01:00'");
?>