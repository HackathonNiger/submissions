<?php
header("Access-Control-Allow-Origin: *"); // allow all domains
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");
include_once($_SERVER["DOCUMENT_ROOT"] . "/config/bc-config.php");

$get_headers = getallheaders();
if (isset($get_headers["Authorization"])) {
  $json_request = file_get_contents("php://input");
  // $json_request = '{"items": [{"product_id": 2, "quantity": 3}, {"product_id": 4, "quantity": 10}], "total_price": 4500}';
  $decode_json_request = json_decode($json_request, true);

  if (json_last_error() === JSON_ERROR_NONE) {
    $items = $decode_json_request["items"];
    $authorization_exp = explode(" ", trim($get_headers["Authorization"]));
    $authorization_type = strtolower($authorization_exp[0]);
    $authorization_token = $authorization_exp[1];

    $role_array = [1 => "buyer", 2 => "artisan"];

    if (
      !empty($authorization_type) &&
      $authorization_type == "bearer" &&
      !empty($authorization_token) &&
      is_array($items) &&
      count($items) >= 1
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
        $items_array = [];

        $place_order_stmt = "INSERT INTO orders (user_id, total_quantity, total_price, `status`) VALUES (?, ?, ?, ?)";
        $place_order_prepare = mysqli_prepare($connection_server, $place_order_stmt);
        $place_order_bind_params = mysqli_stmt_bind_param($place_order_prepare, "iiii", $verify_user_detail["id"], $total_quantity, $total_price, $order_status);
        if (mysqli_stmt_execute($place_order_prepare)) {
          $order_id = mysqli_insert_id($connection_server);

          foreach ($items as $each_order_item) {
            $each_product_json = $each_order_item;
            if (isset($each_product_json["product_id"]) && is_numeric($each_product_json["product_id"]) && ($each_product_json["product_id"] >= 1)) {
              if (isset($each_product_json["quantity"]) && is_numeric($each_product_json["quantity"]) && ($each_product_json["quantity"] >= 1)) {
                $product_id = $each_product_json["product_id"];
                $quantity = $each_product_json["quantity"];

                $search_product_stmt = "SELECT * FROM products WHERE id = ?";
                $search_product_prepare = mysqli_prepare($connection_server, $search_product_stmt);
                $search_product_bind_params = mysqli_stmt_bind_param($search_product_prepare, "i", $product_id);
                mysqli_stmt_execute($search_product_prepare);
                $search_product_result = mysqli_stmt_get_result($search_product_prepare);
                if (mysqli_num_rows($search_product_result) == 1) {
                  while ($search_product_detail = mysqli_fetch_assoc($search_product_result)) {
                    $order_item_array = ["product_id" => $product_id, "quantity" => $quantity, "price" => toDoubleInt($search_product_detail["price"], 2)];
                    array_push($items_array, $order_item_array);

                    $total_price += ($quantity * $search_product_detail["price"]);

                    $add_order_item_stmt = "INSERT INTO order_items (user_id, order_id, product_id, quantity, price, `status`) VALUES (?, ?, ?, ?, ?, ?)";
                    $add_order_item_prepare = mysqli_prepare($connection_server, $add_order_item_stmt);
                    $add_order_item_bind_params = mysqli_stmt_bind_param($add_order_item_prepare, "iiiiii", $verify_user_detail["id"], $order_id, $product_id, $quantity, $search_product_detail["price"], $order_status);
                    mysqli_stmt_execute($add_order_item_prepare);
                    mysqli_stmt_close($add_order_item_prepare);

                  }
                }

                mysqli_stmt_close($search_product_prepare);
              }
            }
          }

          if ($total_price >= 1 && count($items_array) >= 1) {
            $json_response = ["success" => true, "msg" => "Order placed successfully", "order" => ["id" => $order_id, "user_id" => $verify_user_detail["id"], "total_price" => $total_price, "status" => "pending", "items" => $items_array]];
          } else {
            $json_response = ["success" => false, "msg" => "Order failed to be placed"];
          }
        } else {
          $json_response = ["success" => false, "msg" => "Error encountered, try again"];
        }
        mysqli_stmt_close($place_order_prepare);
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
      } elseif (!is_array($items)) {
        $json_response = ["success" => false, "msg" => "Invalid Cart Items"];
      } elseif (count($items) <= 0) {
        $json_response = ["success" => false, "msg" => "Empty cart items"];
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