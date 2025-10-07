<?php
header("Access-Control-Allow-Origin: *"); // allow all domains
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");
include_once($_SERVER["DOCUMENT_ROOT"] . "/config/bc-config.php");

$json_request = file_get_contents("php://input");
// $json_request = '{"name": "Habeebullahi Abdulrahaman", "email": "example@gmail.com", "password": "12345678", "role": "buyer"}';
$decode_json_request = json_decode($json_request, true);

if (json_last_error() === JSON_ERROR_NONE) {
  $name = mysqli_real_escape_string($connection_server, trim(strip_tags($decode_json_request["name"])));
  $email = mysqli_real_escape_string($connection_server, trim(strip_tags($decode_json_request["email"])));
  $password = mysqli_real_escape_string($connection_server, trim(strip_tags($decode_json_request["password"])));
  $role = mysqli_real_escape_string($connection_server, strtolower(trim(strip_tags($decode_json_request["role"]))));

  $role_array = ["buyer" => 1, "artisan" => 2];

  if (
    !empty($name) &&
    !empty($email) &&
    filter_var($email, FILTER_VALIDATE_EMAIL) &&
    !empty($password) &&
    strlen($password) >= 8 &&
    !empty($role) &&
    in_array($role, array_keys($role_array))
  ) {
    $verify_user_stmt = "SELECT email FROM user WHERE email = ?";
    $verify_user_prepare = mysqli_prepare($connection_server, $verify_user_stmt);
    $verify_user_bind_params = mysqli_stmt_bind_param($verify_user_prepare, "s", $email);
    mysqli_stmt_execute($verify_user_prepare);
    $verify_user_result = mysqli_stmt_get_result($verify_user_prepare);
    if (mysqli_num_rows($verify_user_result) == 0) {
      $hashed_password = md5($password);
      $balance = 0;
      $role_id = $role_array[$role];
      $user_status = 1;
      $token = substr(str_shuffle("abcdefghijklmnopqrstuvwxyz1234567890."), 15);
      $insert_user_stmt = "INSERT INTO user (email, password, fullname, balance, role_id, token, `status`) VALUES (?, ?, ?, ?, ?, ?, ?)";
      $insert_user_prepare = mysqli_prepare($connection_server, $insert_user_stmt);
      $insert_user_bind_params = mysqli_stmt_bind_param($insert_user_prepare, "sssiisi", $email, $hashed_password, $name, $balance, $role_id, $token, $user_status);
      if (mysqli_stmt_execute($insert_user_prepare)) {
        $json_response = ["success" => true, "msg" => "Registration Succeessful"];
      } else {
        $json_response = ["success" => false, "msg" => "Error encountered, try again"];
      }
      mysqli_stmt_close($insert_user_prepare);
    } else {
      $json_response = ["success" => false, "msg" => "Account Exists with same EMAIL!"];
    }
    mysqli_stmt_close($verify_user_prepare);
  } else {
    if (empty($name)) {
      $json_response = ["success" => false, "msg" => "Name is required"];
    } elseif (empty($email)) {
      $json_response = ["success" => false, "msg" => "Email is required"];
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
      $json_response = ["success" => false, "msg" => "Email is invalid"];
    } elseif (empty($password)) {
      $json_response = ["success" => false, "msg" => "Password is required"];
    } elseif (strlen($password) < 8) {
      $json_response = ["success" => false, "msg" => "Password must be atleast 8 character long"];
    } elseif (empty($role)) {
      $json_response = ["success" => false, "msg" => "Role is required"];
    } elseif (!in_array($role, array_keys($role_array))) {
      $json_response = ["success" => false, "msg" => "Role is invalid"];
    }
  }
} else {
  $json_response = ["success" => false, "msg" => "Invalid JSON Request"];
}

echo json_encode($json_response, true);
mysqli_close($connection_server);
?>