<?php
header("Access-Control-Allow-Origin: *"); // allow all domains
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");
include_once($_SERVER["DOCUMENT_ROOT"] . "/config/bc-config.php");

$product_id = trim(strip_tags($_GET["id"])) ?? "";
$product_id = mysqli_real_escape_string($connection_server, trim(strip_tags($product_id)));
$product_id = is_numeric($product_id) ? $product_id : "";
$role_array = [1 => "buyer", 2 => "artisan"];

if (!empty($product_id) && is_numeric($product_id)) {
  $search_product_stmt = "SELECT * FROM products WHERE id = ?";
  $search_product_prepare = mysqli_prepare($connection_server, $search_product_stmt);
  $search_product_bind_params = mysqli_stmt_bind_param($search_product_prepare, "i", $product_id);
} else {
  $search_product_stmt = "SELECT * FROM products";
  $search_product_prepare = mysqli_prepare($connection_server, $search_product_stmt);
}
mysqli_stmt_execute($search_product_prepare);
$search_product_result = mysqli_stmt_get_result($search_product_prepare);
if (mysqli_num_rows($search_product_result) > 1) {
  $products_array = [];
  while ($search_product_detail = mysqli_fetch_assoc($search_product_result)) {
    $product_array = ["id" => $search_product_detail["id"], "artisan_id" => $search_product_detail["user_id"], "title" => $search_product_detail["title"], "description" => $search_product_detail["description"], "price" => toDoubleInt($search_product_detail["price"], 2), "category" => $search_product_detail["category"], "image_url" => $search_product_detail["image_url"]];
    array_push($products_array, $product_array);
  }
  $json_response = ["success" => true, "msg" => "Product retrieved successfully", "products" => $products_array];
} elseif (mysqli_num_rows($search_product_result) == 1) {
  $search_product_detail = mysqli_fetch_assoc($search_product_result);
  $product_array = ["id" => $search_product_detail["id"], "artisan_id" => $search_product_detail["user_id"], "title" => $search_product_detail["title"], "description" => $search_product_detail["description"], "price" => toDoubleInt($search_product_detail["price"], 2), "category" => $search_product_detail["category"], "image_url" => $search_product_detail["image_url"]];
  $json_response = ["success" => true, "msg" => "Product retrieved successfully", "product" => $product_array];
} else {
  $json_response = ["success" => false, "msg" => "Products not available"];
}
mysqli_stmt_close($search_product_prepare);
echo json_encode($json_response, true);
mysqli_close($connection_server);
?>