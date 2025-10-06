<?php
require_once '../config/database.php';
require_once '../includes/cors.php';

setCORSHeaders();

class CarrerasAPI {
    private $db;
    private $connection;
    
    public function __construct() {
        $this->db = new Database();
        $this->connection = $this->db->getConnection();
    }
    
    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        
        if ($method !== 'GET') {
            sendErrorResponse("Method not allowed", 405);
        }
        
        try {
            $this->getCarreras();
        } catch(Exception $e) {
            error_log("Carreras API Error: " . $e->getMessage());
            sendErrorResponse("Internal server error", 500);
        }
    }
    
    private function getCarreras() {
        $query = "SELECT * FROM carreras WHERE activa = 1 ORDER BY nombre";
        $stmt = $this->connection->prepare($query);
        $stmt->execute();
        $carreras = $stmt->fetchAll();
        
        sendJSONResponse([
            'success' => true,
            'data' => $carreras
        ]);
    }
}

$api = new CarrerasAPI();
$api->handleRequest();
?>