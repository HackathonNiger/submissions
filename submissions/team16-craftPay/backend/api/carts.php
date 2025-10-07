<?php
header("Access-Control-Allow-Origin: *"); // allow all domains
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");
include_once($_SERVER["DOCUMENT_ROOT"] . "/config/bc-config.php");

$get_headers = getallheaders();
if (isset($get_headers["Authorization"])) {

  $authorization_exp = explode(" ", trim($get_headers["Authorization"]));
  $authorization_type = strtolower($authorization_exp[0]);
  $authorization_token = $authorization_exp[1];

  $role_array = [1 => "buyer", 2 => "artisan"];
  $status_array = [1 => "successful", 2 => "pending", 3 => "failed"];

  if (
    !empty($authorization_type) &&
    $authorization_type == "bearer" &&
    !empty($authorization_token)
  ) {
    $verify_user_stmt = "SELECT * FROM user WHERE token = ?";
    $verify_user_prepare = mysqli_prepare($connection_server, $verify_user_stmt);
    $verify_user_bind_params = mysqli_stmt_bind_param($verify_user_prepare, "s", $authorization_token);
    mysqli_stmt_execute($verify_user_prepare);
    $verify_user_result = mysqli_stmt_get_result($verify_user_prepare);
    if (mysqli_num_rows($verify_user_result) == 1) {
      $verify_user_detail = mysqli_fetch_array($verify_user_result);
      $role = $role_array[$verify_user_detail["role_id"]];
      $order_status = 2;

      $total_quantity = 0;
      $total_items = 0;
      $total_price = 0;
      $carts_array = [];

      $search_cart_stmt = "SELECT * FROM cart WHERE user_id = ?";
      $search_cart_prepare = mysqli_prepare($connection_server, $search_cart_stmt);
      $search_cart_bind_params = mysqli_stmt_bind_param($search_cart_prepare, "i", $verify_user_detail["id"]);
      mysqli_stmt_execute($search_cart_prepare);
      $search_cart_result = mysqli_stmt_get_result($search_cart_prepare);
      if (mysqli_num_rows($search_cart_result) >= 1) {
        while ($search_cart_detail = mysqli_fetch_array($search_cart_result)) {
          $cart_id = $search_cart_detail["id"];

          $search_products_stmt = "SELECT * FROM products WHERE id = ?";
          $search_products_prepare = mysqli_prepare($connection_server, $search_products_stmt);
          $search_products_bind_params = mysqli_stmt_bind_param($search_products_prepare, "i", $search_cart_detail["product_id"]);
          mysqli_stmt_execute($search_products_prepare);
          $search_products_result = mysqli_stmt_get_result($search_products_prepare);

          if (mysqli_num_rows($search_products_result) == 1) {
            $cart_items_price = 0;
            $search_products_detail = mysqli_fetch_array($search_products_result);
            $total_quantity += $search_cart_detail["quantity"];
            $total_items += 1;
            $subtotal += $search_cart_detail["quantity"] * $search_products_detail["price"];
            $total_price += $subtotal;

            $each_cart_array = ["cart_item_id" => $cart_id, "product_id" => $search_products_detail["id"], "title" => $search_products_detail["title"], "description" => $search_products_detail["description"], "image" => $search_products_detail["image_url"], "price" => toDoubleInt($search_products_detail["price"], 2), "quantity" => $search_cart_detail["quantity"], "subtotal" => $subtotal];
            array_push($carts_array, $each_cart_array);
          }


        }

        if ($total_price >= 1 && count($carts_array) >= 1) {
          $json_response = ["success" => true, "msg" => "Cart retrieved successfully", "cart_items" => $carts_array, "cart_total" => $total_price, "total_items" => $total_items];
        } else {
          $json_response = ["success" => false, "msg" => "Cart retrieval failed", "cart_items" => [], "cart_total" => toDoubleInt(0, 2), "total_items" => 0];
        }
      } else {
        $json_response = ["success" => false, "msg" => "Error encountered, try again", "cart_items" => [], "cart_total" => toDoubleInt(0, 2), "total_items" => 0];
      }
      mysqli_stmt_close($search_cart_prepare);
    } else {
      $json_response = ["success" => false, "msg" => "Incorrect Authentication, login and try again", "cart_items" => [], "cart_total" => toDoubleInt(0, 2), "total_items" => 0];
    }
    mysqli_stmt_close($verify_user_prepare);
  } else {
    if (empty($authorization_type)) {
      $json_response = ["success" => false, "msg" => "Authorization type is required", "cart_items" => [], "cart_total" => toDoubleInt(0, 2), "total_items" => 0];
    } elseif ($authorization_type !== "bearer") {
      $json_response = ["success" => false, "msg" => "Invalid authorization type", "cart_items" => [], "cart_total" => toDoubleInt(0, 2), "total_items" => 0];
    } elseif (empty($authorization_token)) {
      $json_response = ["success" => false, "msg" => "Authorization token is required", "cart_items" => [], "cart_total" => toDoubleInt(0, 2), "total_items" => 0];
    }
  }
} else {
  $json_response = ["success" => false, "msg" => "Authorization header not found", "cart_items" => [], "cart_total" => toDoubleInt(0, 2), "total_items" => 0];
}
echo json_encode($json_response, true);
mysqli_close($connection_server);
?>