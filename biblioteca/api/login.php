<?php
// Start session
session_start();

// Error reporting
ini_set('display_errors', 1);
error_reporting(E_ALL);

// IMPORTANT: Set JSON header BEFORE any output
header('Content-Type: application/json');

// Database Connection
require_once '../config/database.php';
require_once '../includes/cors.php';

setCORSHeaders();

class LoginAPI {
    private $db;
    private $connection;

    public function __construct() {
        $this->db = new Database();
        $this->connection = $this->db->getConnection();
    }
    
    public function handleRequest() {
        // Check if POST data exists
        if (!isset($_POST['username']) || !isset($_POST['password'])) {
            echo json_encode([
                'success' => false,
                'message' => 'Por favor complete todos los campos'
            ]);
            exit;
        }
        
        $username = trim($_POST['username']);
        $password = $_POST['password'];
        
        // Validate not empty
        if (empty($username) || empty($password)) {
            echo json_encode([
                'success' => false,
                'message' => 'Por favor complete todos los campos'
            ]);
            exit;
        }
        
        try {
            // Simple query with plaintext password comparison
            $query = "SELECT id, usuario, nombre_completo
                     FROM login 
                     WHERE usuario = :username 
                     AND contrasena = :password 
                     LIMIT 1";
            
            $stmt = $this->connection->prepare($query);
            $stmt->bindParam(':username', $username);
            $stmt->bindParam(':password', $password);
            $stmt->execute();
            
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($user) {
                // Login successful!
                session_regenerate_id();
                
                // Set session variables
                $_SESSION['loggedin'] = true;
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $user['usuario'];
                $_SESSION['nombre_completo'] = $user['nombre_completo'];
                
                // FIXED: Only send JSON, no header() redirect
                echo json_encode([
                    'success' => true,
                    'message' => '¡Bienvenido, ' . htmlspecialchars($user['nombre_completo']) . '!',
                    'redirect' => '/index.html'
                ]);
                exit;
            } else {
                // Login failed
                echo json_encode([
                    'success' => false,
                    'message' => 'Usuario o contraseña incorrectos'
                ]);
                exit;
            }
            
        } catch(Exception $e) {
            error_log("Login Error: " . $e->getMessage());
            echo json_encode([
                'success' => false,
                'message' => 'Error en el servidor: ' . $e->getMessage()
            ]);
            exit;
        }
    }
}

$api = new LoginAPI();
$api->handleRequest();
?>