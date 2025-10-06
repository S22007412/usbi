<?php
require_once '../config/database.php';
require_once '../includes/cors.php';

setCORSHeaders();

class ConfigAPI {
    private $db;
    private $connection;
    
    public function __construct() {
        $this->db = new Database();
        $this->connection = $this->db->getConnection();
    }
    
    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        
        try {
            switch($method) {
                case 'GET':
                    $this->getConfig();
                    break;
                case 'POST':
                    $this->updateConfig();
                    break;
                default:
                    sendErrorResponse("Method not allowed", 405);
            }
        } catch(Exception $e) {
            error_log("Config API Error: " . $e->getMessage());
            sendErrorResponse("Internal server error", 500);
        }
    }
    
    private function getConfig() {
        $query = "SELECT * FROM configuracion ORDER BY clave";
        $stmt = $this->connection->prepare($query);
        $stmt->execute();
        $config = $stmt->fetchAll();
        
        // Convert to key-value pairs
        $configData = [];
        foreach($config as $item) {
            $configData[$item['clave']] = $item['valor'];
        }
        
        sendJSONResponse([
            'success' => true,
            'data' => $configData
        ]);
    }
    
    private function updateConfig() {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            sendErrorResponse("Invalid JSON data");
        }
        
        try {
            $this->connection->beginTransaction();
            
            foreach($input as $key => $value) {
                $query = "UPDATE configuracion SET valor = :valor WHERE clave = :clave";
                $stmt = $this->connection->prepare($query);
                $stmt->bindParam(':valor', $value);
                $stmt->bindParam(':clave', $key);
                $stmt->execute();
            }
            
            $this->connection->commit();
            
            sendJSONResponse([
                'success' => true,
                'message' => 'Configuración actualizada exitosamente'
            ]);
            
        } catch(Exception $e) {
            $this->connection->rollBack();
            sendErrorResponse("Error al actualizar configuración", 500);
        }
    }
}

$api = new ConfigAPI();
$api->handleRequest();
?>