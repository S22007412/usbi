<?php
try {
    $pdo = new PDO("mysql:host=ubiuv.duckdns.org;port=3306;dbname=usbi", "usbi", "contraseña");
    echo "Database connection successful!";
} catch(Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
