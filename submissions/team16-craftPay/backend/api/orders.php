<?php
header("Access-Control-Allow-Origin: *"); // allow all domains
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");
include_once($_SERVER["DOCUMENT_ROOT"] . "/config/bc-config.php");

$get_headers = getallheaders();
if (isset($get_headers["Authorization"])) {

  $items = $decode_json_request["items"];
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
      $total_price = 0;
      $orders_array = [];

      $search_order_stmt = "SELECT * FROM orders WHERE user_id = ?";
      $search_order_prepare = mysqli_prepare($connection_server, $search_order_stmt);
      $search_order_bind_params = mysqli_stmt_bind_param($search_order_prepare, "i", $verify_user_detail["id"]);
      mysqli_stmt_execute($search_order_prepare);
      $search_order_result = mysqli_stmt_get_result($search_order_prepare);
      if (mysqli_num_rows($search_order_result) >= 1) {
        while ($search_order_detail = mysqli_fetch_array($search_order_result)) {
          $order_id = $search_order_detail["id"];

          $search_order_item_stmt = "SELECT * FROM order_items WHERE user_id = ? AND order_id = ?";
          $search_order_item_prepare = mysqli_prepare($connection_server, $search_order_item_stmt);
          $search_order_item_bind_params = mysqli_stmt_bind_param($search_order_item_prepare, "ii", $verify_user_detail["id"], $order_id);
          mysqli_stmt_execute($search_order_item_prepare);
          $search_order_item_result = mysqli_stmt_get_result($search_order_item_prepare);

          if (mysqli_num_rows($search_order_item_result) >= 1) {
            $order_items_price = 0;
            $order_items_array = [];
            while ($search_order_item_detail = mysqli_fetch_array($search_order_item_result)) {
              $total_quantity += $search_order_item_detail["quantity"];
              $total_price += $search_order_item_detail["price"];

              $order_items_price += $search_order_item_detail["price"];
              $item_ordered_array = ["product_id" => $search_order_item_detail["product_id"], "quantity" => $search_order_item_detail["quantity"], "price_per_each" => toDoubleInt($search_order_item_detail["price"], 2)];
              array_push($order_items_array, $item_ordered_array);
            }
            $each_order_array = ["id" => $order_id, "total_price" => $order_items_price, "status" => $status_array[$search_order_detail["status"]], "items" => $order_items_array];
            array_push($orders_array, $each_order_array);
          }


        }

        if ($total_price >= 1 && count($orders_array) >= 1) {
          $json_response = ["success" => true, "msg" => "Order placed successfully", "orders" => $orders_array];
        } else {
          $json_response = ["success" => false, "msg" => "Order failed to be placed"];
        }
      } else {
        $json_response = ["success" => false, "msg" => "Error encountered, try again"];
      }
      mysqli_stmt_close($search_order_prepare);
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
    }
  }
} else {
  $json_response = ["success" => false, "msg" => "Authorization header not found"];
}
echo json_encode($json_response, true);
mysqli_close($connection_server);
?>