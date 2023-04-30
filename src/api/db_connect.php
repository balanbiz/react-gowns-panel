<?php
$settings = json_decode(file_get_contents('./settings.json'), true);

define('DB_HOST', 'localhost');
define('DB_USER', $settings['username']);
define('DB_PASS', $settings['passwordDB']);
define('DB_NAME', $settings['nameDB']);

// Create connection
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Check connection
if ($conn->connect_error) {
  die('Connection failed: ' . $conn->connect_error);
}