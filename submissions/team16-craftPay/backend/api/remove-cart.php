<?php
header("Access-Control-Allow-Origin: *"); // allow all domains
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");
include_once($_SERVER["DOCUMENT_ROOT"] . "/config/bc-config.php");

$get_headers = getallheaders();
if (isset($get_headers["Authorization"])) {
  $cart_id = trim(strip_tags($_GET["id"])) ?? "";
  $cart_id = mysqli_real_escape_string($connection_server, trim(strip_tags($cart_id)));
  $cart_id = is_numeric($cart_id) ? $cart_id : "";

  $product_id = trim(strip_tags($_GET["product_id"])) ?? "";
  $product_id = mysqli_real_escape_string($connection_server, trim(strip_tags($product_id)));
  $product_id = is_numeric($product_id) ? $product_id : "";

  if (!empty($cart_id)) {
    $authorization_exp = explode(" ", trim($get_headers["Authorization"]));
    $authorization_type = strtolower($authorization_exp[0]);
    $authorization_token = $authorization_exp[1];

    // $authorization_type = "bearer";
    // $authorization_token = "imgb7ydn3wv84.ohz092p1";

    $role_array = [1 => "buyer", 2 => "artisan"];

    if (
      !empty($authorization_type) &&
      $authorization_type == "bearer" &&
      !empty($authorization_token) &&
      !empty($cart_id) &&
      is_numeric($cart_id) &&
      $cart_id >= 1
    ) {
      $verify_user_stmt = "SELECT * FROM user WHERE token = ?";
      $verify_user_prepare = mysqli_prepare($connection_server, $verify_user_stmt);
      $verify_user_bind_params = mysqli_stmt_bind_param($verify_user_prepare, "s", $authorization_token);
      mysqli_stmt_execute($verify_user_prepare);
      $verify_user_result = mysqli_stmt_get_result($verify_user_prepare);
      if (mysqli_num_rows($verify_user_result) == 1) {
        $verify_user_detail = mysqli_fetch_array($verify_user_result);
        $role = $role_array[$verify_user_detail["role_id"]];
        $verify_user_cart_stmt = "SELECT * FROM cart WHERE user_id = ? AND id = ?";
        $verify_user_cart_prepare = mysqli_prepare($connection_server, $verify_user_cart_stmt);
        $verify_user_cart_bind_params = mysqli_stmt_bind_param($verify_user_cart_prepare, "ii", $verify_user_detail["id"], $cart_id);
        mysqli_stmt_execute($verify_user_cart_prepare);
        $verify_user_cart_result = mysqli_stmt_get_result($verify_user_cart_prepare);
        if (mysqli_num_rows($verify_user_cart_result) == 1) {
          $remove_cart_item_stmt = "DELETE FROM cart WHERE user_id = ? AND id = ?";
          $remove_cart_item_prepare = mysqli_prepare($connection_server, $remove_cart_item_stmt);
          $remove_cart_item_bind_params = mysqli_stmt_bind_param($remove_cart_item_prepare, "ii", $verify_user_detail["id"], $cart_id);
          if (mysqli_stmt_execute($remove_cart_item_prepare)) {
            $cart_id = $verify_user_cart_detail["id"];
            $json_response = ["success" => true, "msg" => "Item removed successfully"];
          } else {
            $json_response = ["success" => false, "msg" => "Error encountered, try again"];
          }
          mysqli_stmt_close($remove_cart_item_prepare);
        } else {
          $json_response = ["success" => false, "msg" => "Cart not exists"];
        }
        mysqli_stmt_close($verify_user_cart_prepare);
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
      } elseif (empty($cart_id)) {
        $json_response = ["success" => false, "msg" => "Cart ID is required"];
      } elseif (!is_numeric($cart_id)) {
        $json_response = ["success" => false, "msg" => "Cart ID must be a number"];
      } elseif ($cart_id < 1) {
        $json_response = ["success" => false, "msg" => "Cart ID must be 1 or higher"];
      }
    }
  } else {
    $authorization_exp = explode(" ", trim($get_headers["Authorization"]));
    $authorization_type = strtolower($authorization_exp[0]);
    $authorization_token = $authorization_exp[1];

    if (
      !empty($authorization_type) &&
      $authorization_type == "bearer" &&
      !empty($authorization_token) &&
      !empty($product_id) &&
      is_numeric($product_id) &&
      $product_id >= 1
    ) {
      $verify_user_stmt = "SELECT * FROM user WHERE token = ?";
      $verify_user_prepare = mysqli_prepare($connection_server, $verify_user_stmt);
      $verify_user_bind_params = mysqli_stmt_bind_param($verify_user_prepare, "s", $authorization_token);
      mysqli_stmt_execute($verify_user_prepare);
      $verify_user_result = mysqli_stmt_get_result($verify_user_prepare);
      if (mysqli_num_rows($verify_user_result) == 1) {
        $verify_user_detail = mysqli_fetch_array($verify_user_result);
        $role = $role_array[$verify_user_detail["role_id"]];
        $verify_user_cart_stmt = "SELECT * FROM cart WHERE user_id = ? AND product_id = ?";
        $verify_user_cart_prepare = mysqli_prepare($connection_server, $verify_user_cart_stmt);
        $verify_user_cart_bind_params = mysqli_stmt_bind_param($verify_user_cart_prepare, "ii", $verify_user_detail["id"], $product_id);
        mysqli_stmt_execute($verify_user_cart_prepare);
        $verify_user_cart_result = mysqli_stmt_get_result($verify_user_cart_prepare);
        if (mysqli_num_rows($verify_user_cart_result) == 1) {
          $remove_cart_item_stmt = "DELETE FROM cart WHERE user_id = ? AND product_id = ?";
          $remove_cart_item_prepare = mysqli_prepare($connection_server, $remove_cart_item_stmt);
          $remove_cart_item_bind_params = mysqli_stmt_bind_param($remove_cart_item_prepare, "ii", $verify_user_detail["id"], $product_id);
          if (mysqli_stmt_execute($remove_cart_item_prepare)) {
            $cart_id = $verify_user_cart_detail["id"];
            $json_response = ["success" => true, "msg" => "Product/Item removed from cart successfully"];
          } else {
            $json_response = ["success" => false, "msg" => "Error encountered, try again"];
          }
          mysqli_stmt_close($remove_cart_item_prepare);
        } else {
          $json_response = ["success" => false, "msg" => "Cart not exists"];
        }
        mysqli_stmt_close($verify_user_cart_prepare);
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
      } elseif (empty($product_id)) {
        $json_response = ["success" => false, "msg" => "Product ID is required"];
      } elseif (!is_numeric($product_id)) {
        $json_response = ["success" => false, "msg" => "Product ID must be a number"];
      } elseif ($product_id < 1) {
        $json_response = ["success" => false, "msg" => "Product ID must be 1 or higher"];
      }
    }
  }
} else {
  $json_response = ["success" => false, "msg" => "Authorization header not found"];
}
echo json_encode($json_response, true);
mysqli_close($connection_server);
?>