<?php
header("Access-Control-Allow-Origin: *"); // allow all domains
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");
include_once($_SERVER["DOCUMENT_ROOT"] . "/config/bc-config.php");

$json_request = file_get_contents("php://input");
// $json_request = '{"email": "example@gmail.com", "password": "12345678"}';
$decode_json_request = json_decode($json_request, true);

if (json_last_error() === JSON_ERROR_NONE) {
  $email = mysqli_real_escape_string($connection_server, trim(strip_tags($decode_json_request["email"])));
  $password = mysqli_real_escape_string($connection_server, trim(strip_tags($decode_json_request["password"])));

  $role_array = [1 => "buyer", 2 => "artisan"];

  if (
    !empty($email) &&
    filter_var($email, FILTER_VALIDATE_EMAIL) &&
    !empty($password)
  ) {
    $hashed_password = md5($password);
    $verify_user_stmt = "SELECT * FROM user WHERE email = ? AND `password` = ?";
    $verify_user_prepare = mysqli_prepare($connection_server, $verify_user_stmt);
    $verify_user_bind_params = mysqli_stmt_bind_param($verify_user_prepare, "ss", $email, $hashed_password);
    mysqli_stmt_execute($verify_user_prepare);
    $verify_user_result = mysqli_stmt_get_result($verify_user_prepare);
    if (mysqli_num_rows($verify_user_result) == 1) {
      $verify_user_detail = mysqli_fetch_array($verify_user_result);
      $role = $role_array[$verify_user_detail["role_id"]];

      $json_response = ["success" => true, "msg" => "User logged in successfully", "user" => ["id" => $verify_user_detail["id"], "name" => $verify_user_detail["fullname"], "email" => $verify_user_detail["email"], "role" => $role], "token" => $verify_user_detail["token"]];
    } else {
      $json_response = ["success" => false, "msg" => "Invalid Email or Password"];
    }
    mysqli_stmt_close($verify_user_prepare);
  } else {
    if (empty($email)) {
      $json_response = ["success" => false, "msg" => "Email is required"];
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
      $json_response = ["success" => false, "msg" => "Email is invalid"];
    } elseif (empty($password)) {
      $json_response = ["success" => false, "msg" => "Password is required"];
    }
  }
} else {
  $json_response = ["success" => false, "msg" => "Invalid JSON Request"];
}

echo json_encode($json_response, true);
mysqli_close($connection_server);
?>