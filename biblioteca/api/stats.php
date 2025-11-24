<?php
require_once '../config/database.php';
require_once '../includes/cors.php';

setCORSHeaders();

class StatsAPI {
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
            $this->getStats();
        } catch(Exception $e) {
            error_log("Stats API Error: " . $e->getMessage());
            sendErrorResponse("Internal server error", 500);
        }
    }
    
    private function getStats() {
        // Get total count
        $query = "SELECT COUNT(*) as total FROM estudiantes";
        $stmt = $this->connection->prepare($query);
        $stmt->execute();
        $total = $stmt->fetch()['total'];
        
        // Get count without debt
        $query = "SELECT COUNT(*) as sin_adeudo FROM estudiantes WHERE estado = 'sin_adeudo'";
        $stmt = $this->connection->prepare($query);
        $stmt->execute();
        $sinAdeudo = $stmt->fetch()['sin_adeudo'];
        
        // Get count with debt
        $query = "SELECT COUNT(*) as con_adeudo FROM estudiantes WHERE estado = 'con_adeudo'";
        $stmt = $this->connection->prepare($query);
        $stmt->execute();
        $conAdeudo = $stmt->fetch()['con_adeudo'];
        
        // Get total debt amount
        $query = "SELECT COALESCE(SUM(adeudo), 0) as total_adeudos FROM estudiantes";
        $stmt = $this->connection->prepare($query);
        $stmt->execute();
        $totalAdeudos = $stmt->fetch()['total_adeudos'];
        
        // Get average debt
        $query = "SELECT COALESCE(AVG(adeudo), 0) as promedio_adeudo FROM estudiantes";
        $stmt = $this->connection->prepare($query);
        $stmt->execute();
        $promedioAdeudo = $stmt->fetch()['promedio_adeudo'];
        
        // Get monthly stats for chart
        $query = "SELECT 
                    MONTH(fecha_registro) as mes,
                    SUM(adeudo) as total_mes
                  FROM estudiantes
                  WHERE YEAR(fecha_registro) = YEAR(CURDATE())
                  GROUP BY MONTH(fecha_registro)
                  ORDER BY mes";
        $stmt = $this->connection->prepare($query);
        $stmt->execute();
        $monthlyData = $stmt->fetchAll();
        
        // Create array with all 12 months initialized to 0
        $monthlyStats = array_fill(0, 12, 0);
        foreach ($monthlyData as $row) {
            $monthlyStats[$row['mes'] - 1] = floatval($row['total_mes']);
        }
        
        sendJSONResponse([
            'success' => true,
            'data' => [
                'general' => [
                    'totalDevoluciones' => (int)$total,
                    'sinAdeudo' => (int)$sinAdeudo,
                    'conAdeudo' => (int)$conAdeudo,
                    'totalAdeudos' => (float)$totalAdeudos,
                    'promedioAdeudo' => (float)$promedioAdeudo
                ],
                'monthly' => $monthlyStats
            ]
        ]);
    }
}

$api = new StatsAPI();
$api->handleRequest();
?>