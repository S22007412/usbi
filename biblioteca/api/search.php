<?php
require_once '../config/database.php';
require_once '../includes/cors.php';

setCORSHeaders();

class SearchAPI {
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
            $this->searchStudents();
        } catch(Exception $e) {
            error_log("Search API Error: " . $e->getMessage());
            sendErrorResponse("Internal server error", 500);
        }
    }
    
    private function searchStudents() {
        $searchTerm = $_GET['term'] ?? '';
        
        if (empty(trim($searchTerm))) {
            sendErrorResponse("Search term is required");
        }
        
        $searchTerm = trim($searchTerm);
        $searchPattern = "%{$searchTerm}%";
        
        $query = "SELECT e.*, l.nombre_completo as registrado_por 
                  FROM estudiantes e 
                  LEFT JOIN login l ON e.id_usuario = l.id 
                  WHERE (e.folio LIKE :term1 
                       OR e.matricula LIKE :term2 
                       OR e.nombre LIKE :term3)
                  ORDER BY e.fecha_registro DESC";
        
        $stmt = $this->connection->prepare($query);
        $stmt->bindParam(':term1', $searchPattern);
        $stmt->bindParam(':term2', $searchPattern);
        $stmt->bindParam(':term3', $searchPattern);
        $stmt->execute();
        
        $results = $stmt->fetchAll();
        
        // Format results to match frontend expectations
        $formattedResults = array_map(function($student) {
            return [
                'id' => $student['id'],
                'folio' => $student['folio'],
                'matricula' => $student['matricula'],
                'nombre' => $student['nombre'],
                'carrera' => $student['carrera'],
                'adeudo' => floatval($student['adeudo']),
                'tipoPago' => $student['tipo_pago'],
                'estado' => $student['estado'],
                'fechaRegistro' => $student['fecha_registro'],
                'horaRegistro' => $student['hora_registro'],
                'registradoPor' => $student['registrado_por'] ?? 'Sistema' 
            ];
        }, $results);
        
        sendJSONResponse([
            'success' => true,
            'data' => $formattedResults,
            'count' => count($formattedResults),
            'searchTerm' => $searchTerm
        ]);
    }
}

$api = new SearchAPI();
$api->handleRequest();
?>
