<?php
ini_set("display_errors", 1);
error_reporting(E_ALL);
require_once "config/database.php";
$db = new Database();
$connection = $db->getConnection();
echo "Database connection works!";
?>
