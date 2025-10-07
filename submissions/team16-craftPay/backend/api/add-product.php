<?php
header("Access-Control-Allow-Origin: *"); // allow all domains
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");
include_once($_SERVER["DOCUMENT_ROOT"] . "/config/bc-config.php");

$get_headers = getallheaders();
if (isset($get_headers["Authorization"])) {
  $json_request = file_get_contents("php://input");
  // $json_request = '{"title": "Handmade Basket", "description": "Woven basket from straw", "price": 1500, "category": "Baskets", "image_url": "http://example.com/image.jpg"}';
  $decode_json_request = json_decode($json_request, true);

  if (json_last_error() === JSON_ERROR_NONE) {
    $title = mysqli_real_escape_string($connection_server, trim(strip_tags($decode_json_request["title"])));
    $description = mysqli_real_escape_string($connection_server, trim(strip_tags($decode_json_request["description"])));
    $price = mysqli_real_escape_string($connection_server, trim(strip_tags($decode_json_request["price"])));
    $category = mysqli_real_escape_string($connection_server, strtolower(trim(strip_tags($decode_json_request["category"]))));
    $image_url = mysqli_real_escape_string($connection_server, trim(strip_tags($decode_json_request["image_url"])));
    $authorization_exp = explode(" ", trim($get_headers["Authorization"]));
    $authorization_type = strtolower($authorization_exp[0]);
    $authorization_token = $authorization_exp[1];

    $role_array = [2 => "artisan"];

    if (
      !empty($authorization_type) &&
      $authorization_type == "bearer" &&
      !empty($authorization_token) &&
      !empty($title) &&
      !empty($description) &&
      !empty($price) &&
      is_numeric($price) &&
      $price >= 1 &&
      !empty($category) &&
      !empty($image_url)
    ) {
      $verify_user_stmt = "SELECT * FROM user WHERE token = ?";
      $verify_user_prepare = mysqli_prepare($connection_server, $verify_user_stmt);
      $verify_user_bind_params = mysqli_stmt_bind_param($verify_user_prepare, "s", $authorization_token);
      mysqli_stmt_execute($verify_user_prepare);
      $verify_user_result = mysqli_stmt_get_result($verify_user_prepare);
      if (mysqli_num_rows($verify_user_result) == 1) {
        $verify_user_detail = mysqli_fetch_array($verify_user_result);
        $role = $role_array[$verify_user_detail["role_id"]];
        $user_status = 1;

        if (in_array($verify_user_detail["role_id"], array_keys($role_array))) {
          $insert_product_stmt = "INSERT INTO products (user_id, title, `description`, price, category, image_url, `status`) VALUES (?, ?, ?, ?, ?, ?, ?)";
          $insert_product_prepare = mysqli_prepare($connection_server, $insert_product_stmt);
          $insert_product_bind_params = mysqli_stmt_bind_param($insert_product_prepare, "ississi", $verify_user_detail["id"], $title, $description, $price, $category, $image_url, $user_status);
          if (mysqli_stmt_execute($insert_product_prepare)) {
            $product_id = mysqli_insert_id($connection_server);
            $json_response = ["success" => true, "msg" => "Product Created Successfully", "product" => ["id" => $product_id, "artisan_id" => $verify_user_detail["id"], "title" => $title, "description" => $description, "price" => $price, "category" => $category, "image_url" => $image_url]];
          } else {
            $json_response = ["success" => false, "msg" => "Error encountered, try again"];
          }
          mysqli_stmt_close($insert_product_prepare);
        } else {
          $json_response = ["success" => false, "msg" => "Unable to add products, User not artisan, its a buyers account"];
        }
      } else {
        $json_response = ["success" => false, "msg" => "Incorrect Authentication, login and try again"];
      }
      mysqli_stmt_close($verify_user_prepare);
    } else {
      if (empty($authorization_type)) {
        $json_response = ["success" => false, "msg" => "Authorization type is required"];
      } elseif ($authorization_type !== "bearer") {
        $json_response = ["success" => false, "msg" => "Invalid authorization type"];
      } elseif (empty($authorization_token)) {
        $json_response = ["success" => false, "msg" => "Authorization token is required"];
      } elseif (empty($email)) {
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
} else {
  $json_response = ["success" => false, "msg" => "Authorization header not found"];
}
echo json_encode($json_response, true);
mysqli_close($connection_server);
?>