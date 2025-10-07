<?php
date_default_timezone_set('Africa/Lagos');
if (isset($_SERVER["HTTPS"]) && ($_SERVER["HTTPS"] == "on")) {
	$web_http_host = "https://" . $_SERVER["HTTP_HOST"];
} else {
	$web_http_host = "http://" . $_SERVER["HTTP_HOST"];
}

include("bc-connect.php");
include("bc-func.php");
?>