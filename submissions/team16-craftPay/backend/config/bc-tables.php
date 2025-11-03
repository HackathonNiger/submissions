<?php
//Create Admin Table
$create_admin_table = mysqli_query($connection_server, "CREATE TABLE IF NOT EXISTS admin (id INT NOT NULL AUTO_INCREMENT, email VARCHAR(225) NOT NULL, contact_email VARCHAR(225) NOT NULL, password VARCHAR(225) NOT NULL, fullname VARCHAR(225) NOT NULL, phone_number VARCHAR(225) NOT NULL, address VARCHAR(225) NOT NULL, reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (id))");

//Create User Table
$create_user_table = mysqli_query($connection_server, "CREATE TABLE IF NOT EXISTS user (id INT NOT NULL AUTO_INCREMENT,  email VARCHAR(225) NOT NULL, password VARCHAR(225) NOT NULL, fullname VARCHAR(225) NOT NULL, balance DECIMAL(65,30) UNSIGNED NOT NULL, role_id INT UNSIGNED NOT NULL, token VARCHAR(225) NOT NULL, `status` INT UNSIGNED NOT NULL, reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (id))");

//Create Add Product Table
$create_product_table = mysqli_query($connection_server, "CREATE TABLE IF NOT EXISTS products (id INT NOT NULL AUTO_INCREMENT, user_id INT UNSIGNED NOT NULL, title VARCHAR(225) NOT NULL, description VARCHAR(225) NOT NULL, price DECIMAL(65,30) UNSIGNED NOT NULL, category VARCHAR(225) NOT NULL, image_url VARCHAR(225) NOT NULL, `status` INT UNSIGNED NOT NULL, reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (id))");

//Create Order Table
$create_order_table = mysqli_query($connection_server, "CREATE TABLE IF NOT EXISTS orders (id INT NOT NULL AUTO_INCREMENT, user_id INT UNSIGNED NOT NULL, total_quantity INT UNSIGNED NOT NULL, total_price DECIMAL(65,30) UNSIGNED NOT NULL, status INT UNSIGNED NOT NULL, order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (id))");

//Create Order Items Table
$create_order_items_table = mysqli_query($connection_server, "CREATE TABLE IF NOT EXISTS order_items (id INT NOT NULL AUTO_INCREMENT, order_id INT UNSIGNED NOT NULL, user_id INT UNSIGNED NOT NULL, product_id INT UNSIGNED NOT NULL, quantity INT UNSIGNED NOT NULL, price DECIMAL(65,30) UNSIGNED NOT NULL, status INT UNSIGNED NOT NULL, order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (id))");

//Create Add To Cart Table
$create_add_to_cart_table = mysqli_query($connection_server, "CREATE TABLE IF NOT EXISTS cart (id INT NOT NULL AUTO_INCREMENT, user_id INT UNSIGNED NOT NULL, product_id INT UNSIGNED NOT NULL, quantity INT UNSIGNED NOT NULL, cart_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (id))");

//Create Transation Table
$create_transaction_table = mysqli_query($connection_server, "CREATE TABLE IF NOT EXISTS transactions (id INT NOT NULL AUTO_INCREMENT, product_id INT UNSIGNED NOT NULL,  price DECIMAL(65,30) UNSIGNED NOT NULL, description LONGTEXT NOT NULL, status INT UNSIGNED NOT NULL, transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (id))");

//Create Payment Gateway Table
$create_payment_gateway_table = mysqli_query($connection_server, "CREATE TABLE IF NOT EXISTS payment_gateway (id INT NOT NULL AUTO_INCREMENT, gateway_url VARCHAR(225) NOT NULL, public_key VARCHAR(225) NOT NULL, secret_key VARCHAR(225) NOT NULL, encrypt_key VARCHAR(225) NOT NULL, status INT UNSIGNED NOT NULL, date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (id))");


?>