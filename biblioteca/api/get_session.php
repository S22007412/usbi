<?php
session_start();

header('Content-Type: application/json');

// Check if user is logged in
if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true) {
    echo json_encode([
        'success' => true,
        'loggedIn' => true,
        'user' => [
            'id' => $_SESSION['user_id'],
            'usuario' => $_SESSION['usuario'],
            'nombre_completo' => $_SESSION['nombre_completo']
        ]
    ]);
} else {
    echo json_encode([
        'success' => false,
        'loggedIn' => false,
        'message' => 'No hay sesión activa'
    ]);
}
?>