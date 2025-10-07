<?php
  function toDoubleInt($number, $decimalIndex)
  {
      if (is_numeric($number) && is_numeric($decimalIndex)) {
          if ($number > 0) {
              $exp_number = array_filter(explode(".", trim($number)));
              $firstNumber = $exp_number[0];
              $decimalNumber = substr($exp_number[1], 0, $decimalIndex);
              return ($firstNumber + 0) . "." . sprintf("%0" . $decimalIndex . "d", $decimalNumber);
          } else {
              return "0." . sprintf("%0" . $decimalIndex . "d", "0");
          }
      } else {
          return "non-numeric string";
      }
  }
  
  function makeHttpRequest($req_method, $headers, $parameter_url, $req_body)
  {
      global $connection_server;
      $curl_url = $parameter_url;
      $curl_request = curl_init($curl_url);
      if ($req_method == "post") {
          curl_setopt($curl_request, CURLOPT_POST, true);
      } else {
          if ($req_method == "get") {
              curl_setopt($curl_request, CURLOPT_HTTPGET, true);
          }
      }
  
      if (is_array($req_body)) {
          $post_field_array = $req_body;
          curl_setopt($curl_request, CURLOPT_POSTFIELDS, json_encode($post_field_array, true));
      }
  
      if(is_array($headers)){
          $curl_http_headers = $headers;
          curl_setopt($curl_request, CURLOPT_HTTPHEADER, $curl_http_headers);
      }
      
      curl_setopt($curl_request, CURLOPT_RETURNTRANSFER, true);
  
      curl_setopt($curl_request, CURLOPT_TIMEOUT, 60);
  
      curl_setopt($curl_request, CURLOPT_SSL_VERIFYHOST, true);
      curl_setopt($curl_request, CURLOPT_SSL_VERIFYPEER, true);
      $curl_result = curl_exec($curl_request);
      $curl_json_result = json_decode($curl_result, true);
  
      if ($curl_json_result !== null) {
          if (($curl_json_result["status"] === true)) {
              $encoded_json_result = json_encode($curl_json_result, true);
              $http_json_response_array = array("status" => "success", "message" => "Request Successful", "json_result" => $encoded_json_result);
              return json_encode($http_json_response_array, true);
          } else {
              $http_json_response_array = array("status" => "failed", "message" => "Request Failed");
              return json_encode($http_json_response_array, true);
          }
      }
  
      if ($curl_result === false) {
          $curl_error = curl_error($curl_request);
          $http_json_response_array = array("status" => "failed", "message" => "Error: " . $curl_error);
          return json_encode($http_json_response_array, true);
      }
  
      if ($curl_json_result === null) {
          $curl_error = curl_error($curl_request);
          $http_json_response_array = array("status" => "failed", "message" => "Null Error: " . $curl_error);
          return json_encode($http_json_response_array, true);
      }
  
      curl_close($curl_request);
  
  
  }

?>