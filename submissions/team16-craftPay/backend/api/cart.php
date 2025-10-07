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

  $json_request = file_get_contents("php://input");
  // $json_request = '{"product_id": 2, "quantity": 3}';
  $decode_json_request = json_decode($json_request, true);

  if (empty($cart_id)) {
    if (json_last_error() === JSON_ERROR_NONE) {
      $product_id = mysqli_real_escape_string($connection_server, trim(strip_tags($decode_json_request["product_id"])));
      $quantity = mysqli_real_escape_string($connection_server, trim(strip_tags($decode_json_request["quantity"])));
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
        !empty($product_id) &&
        is_numeric($product_id) &&
        $product_id >= 1 &&
        !empty($quantity) &&
        is_numeric($quantity) &&
        $quantity >= 1
      ) {
        $verify_user_stmt = "SELECT * FROM user WHERE token = ?";
        $verify_user_prepare = mysqli_prepare($connection_server, $verify_user_stmt);
        $verify_user_bind_params = mysqli_stmt_bind_param($verify_user_prepare, "s", $authorization_token);
        mysqli_stmt_execute($verify_user_prepare);
        $verify_user_result = mysqli_stmt_get_result($verify_user_prepare);
        if (mysqli_num_rows($verify_user_result) == 1) {
          $verify_user_detail = mysqli_fetch_array($verify_user_result);
          $role = $role_array[$verify_user_detail["role_id"]];

          $total_quantity = 0;
          $subtotal_price = 0;
          $verify_product_stmt = "SELECT * FROM products WHERE id = ?";
          $verify_product_prepare = mysqli_prepare($connection_server, $verify_product_stmt);
          $verify_product_bind_params = mysqli_stmt_bind_param($verify_product_prepare, "i", $product_id);
          mysqli_stmt_execute($verify_product_prepare);
          $verify_product_result = mysqli_stmt_get_result($verify_product_prepare);
          if (mysqli_num_rows($verify_product_result) == 1) {
            $verify_product_detail = mysqli_fetch_array($verify_product_result);

            $verify_user_cart_stmt = "SELECT * FROM cart WHERE user_id = ? AND product_id = ?";
            $verify_user_cart_prepare = mysqli_prepare($connection_server, $verify_user_cart_stmt);
            $verify_user_cart_bind_params = mysqli_stmt_bind_param($verify_user_cart_prepare, "ii", $verify_user_detail["id"], $product_id);
            mysqli_stmt_execute($verify_user_cart_prepare);
            $verify_user_cart_result = mysqli_stmt_get_result($verify_user_cart_prepare);
            if (mysqli_num_rows($verify_user_cart_result) == 1) {
              $verify_user_cart_detail = mysqli_fetch_array($verify_user_cart_result);
              // $total_quantity += $verify_user_cart_detail["quantity"];
              $total_quantity += $quantity;

              $subtotal_price += $total_quantity * $verify_product_detail["price"];

              $update_to_cart_stmt = "UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?";
              $update_to_cart_prepare = mysqli_prepare($connection_server, $update_to_cart_stmt);
              $update_to_cart_bind_params = mysqli_stmt_bind_param($update_to_cart_prepare, "iii", $total_quantity, $verify_user_detail["id"], $product_id);
              if (mysqli_stmt_execute($update_to_cart_prepare)) {
                $cart_id = $verify_user_cart_detail["id"];
                $json_response = ["success" => true, "msg" => "Existing cart updated successfully", "cart_item" => ["id" => $cart_id, "user_id" => $verify_user_detail["id"], "product_id" => $product_id, "title" => $verify_product_detail["title"], "description" => $verify_product_detail["description"], "price" => toDoubleInt($verify_product_detail["price"], 2), "image_url" => $verify_product_detail["image_url"], "quantity" => $total_quantity, "subtotal" => toDoubleInt($subtotal_price, 2)]];
              } else {
                $json_response = ["success" => false, "msg" => "Error encountered, try again"];
              }
              mysqli_stmt_close($update_to_cart_prepare);
            } else {
              $total_quantity = $quantity;
              $subtotal_price = $total_quantity * $verify_product_detail["price"];

              $add_to_cart_stmt = "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)";
              $add_to_cart_prepare = mysqli_prepare($connection_server, $add_to_cart_stmt);
              $add_to_cart_bind_params = mysqli_stmt_bind_param($add_to_cart_prepare, "iii", $verify_user_detail["id"], $product_id, $total_quantity);
              if (mysqli_stmt_execute($add_to_cart_prepare)) {
                $cart_id = mysqli_insert_id($connection_server);
                $json_response = ["success" => true, "msg" => "Product added to cart successfully", "cart_item" => ["id" => $cart_id, "user_id" => $verify_user_detail["id"], "product_id" => $product_id, "title" => $verify_product_detail["title"], "description" => $verify_product_detail["description"], "price" => toDoubleInt($verify_product_detail["price"], 2), "image_url" => $verify_product_detail["image_url"], "quantity" => $total_quantity, "subtotal" => toDoubleInt($subtotal_price, 2)]];
              } else {
                $json_response = ["success" => false, "msg" => "Error encountered, try again"];
              }
              mysqli_stmt_close($add_to_cart_prepare);
            }
            mysqli_stmt_close($verify_user_cart_prepare);

          } else {
            $json_response = ["success" => false, "msg" => "Product not exists/removed"];
          }
          mysqli_stmt_close($verify_product_prepare);
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
        } elseif (empty($quantity)) {
          $json_response = ["success" => false, "msg" => "Cart quantity is required"];
        } elseif (!is_numeric($quantity)) {
          $json_response = ["success" => false, "msg" => "Cart quantity must be a number"];
        } elseif ($quantity < 1) {
          $json_response = ["success" => false, "msg" => "Cart quantity must be 1 or higher"];
        }
      }
    } else {
      $json_response = ["success" => false, "msg" => "Invalid JSON Request"];
    }
  } else {
    if (json_last_error() === JSON_ERROR_NONE) {
      $quantity = mysqli_real_escape_string($connection_server, trim(strip_tags($decode_json_request["quantity"])));
      $authorization_exp = explode(" ", trim($get_headers["Authorization"]));
      $authorization_type = strtolower($authorization_exp[0]);
      $authorization_token = $authorization_exp[1];

      if (
        !empty($authorization_type) &&
        $authorization_type == "bearer" &&
        !empty($authorization_token) &&
        !empty($cart_id) &&
        is_numeric($cart_id) &&
        $cart_id >= 1 &&
        !empty($quantity) &&
        is_numeric($quantity) &&
        $quantity >= 1
      ) {
        $verify_user_stmt = "SELECT * FROM user WHERE token = ?";
        $verify_user_prepare = mysqli_prepare($connection_server, $verify_user_stmt);
        $verify_user_bind_params = mysqli_stmt_bind_param($verify_user_prepare, "s", $authorization_token);
        mysqli_stmt_execute($verify_user_prepare);
        $verify_user_result = mysqli_stmt_get_result($verify_user_prepare);
        if (mysqli_num_rows($verify_user_result) == 1) {
          $verify_user_detail = mysqli_fetch_array($verify_user_result);
          $role = $role_array[$verify_user_detail["role_id"]];

          $total_quantity = 0;
          $subtotal_price = 0;
          $verify_user_cart_stmt = "SELECT * FROM cart WHERE user_id = ? AND id = ?";
          $verify_user_cart_prepare = mysqli_prepare($connection_server, $verify_user_cart_stmt);
          $verify_user_cart_bind_params = mysqli_stmt_bind_param($verify_user_cart_prepare, "ii", $verify_user_detail["id"], $cart_id);
          mysqli_stmt_execute($verify_user_cart_prepare);
          $verify_user_cart_result = mysqli_stmt_get_result($verify_user_cart_prepare);
          if (mysqli_num_rows($verify_user_cart_result) == 1) {
            $verify_user_cart_detail = mysqli_fetch_array($verify_user_cart_result);

            $verify_product_stmt = "SELECT * FROM products WHERE id = ?";
            $verify_product_prepare = mysqli_prepare($connection_server, $verify_product_stmt);
            $verify_product_bind_params = mysqli_stmt_bind_param($verify_product_prepare, "i", $verify_user_cart_detail["product_id"]);
            mysqli_stmt_execute($verify_product_prepare);
            $verify_product_result = mysqli_stmt_get_result($verify_product_prepare);
            if (mysqli_num_rows($verify_product_result) == 1) {
              $verify_product_detail = mysqli_fetch_array($verify_product_result);


              $total_quantity = $quantity;

              $subtotal_price = $total_quantity * $verify_product_detail["price"];

              $update_to_cart_stmt = "UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?";
              $update_to_cart_prepare = mysqli_prepare($connection_server, $update_to_cart_stmt);
              $update_to_cart_bind_params = mysqli_stmt_bind_param($update_to_cart_prepare, "iii", $total_quantity, $verify_user_detail["id"], $verify_user_cart_detail["product_id"]);
              if (mysqli_stmt_execute($update_to_cart_prepare)) {
                $cart_id = $verify_user_cart_detail["id"];
                $json_response = ["success" => true, "msg" => "Cart updated successfully", "cart_item" => ["id" => $cart_id, "user_id" => $verify_user_detail["id"], "product_id" => $verify_user_cart_detail["product_id"], "title" => $verify_product_detail["title"], "description" => $verify_product_detail["description"], "price" => toDoubleInt($verify_product_detail["price"], 2), "image_url" => $verify_product_detail["image_url"], "quantity" => $total_quantity, "subtotal" => toDoubleInt($subtotal_price, 2)]];
              } else {
                $json_response = ["success" => false, "msg" => "Error encountered, try again"];
              }
              mysqli_stmt_close($update_to_cart_prepare);
            } else {
              $json_response = ["success" => false, "msg" => "Product not exists"];
            }
            mysqli_stmt_close($verify_product_prepare);
          } else {
            $json_response = ["success" => false, "msg" => "Cart not exists"];
          }
          mysqli_stmt_close($verify_user_cart_prepare);

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
        } elseif (empty($quantity)) {
          $json_response = ["success" => false, "msg" => "Cart quantity is required"];
        } elseif (!is_numeric($quantity)) {
          $json_response = ["success" => false, "msg" => "Cart quantity must be a number"];
        } elseif ($quantity < 1) {
          $json_response = ["success" => false, "msg" => "Cart quantity must be 1 or higher"];
        }
      }
    } else {
      $json_response = ["success" => false, "msg" => "Invalid JSON Request"];
    }
  }
} else {
  $json_response = ["success" => false, "msg" => "Authorization header not found"];
}
echo json_encode($json_response, true);
mysqli_close($connection_server);
?>