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
            $this->getStatistics();
        } catch(Exception $e) {
            error_log("Stats API Error: " . $e->getMessage());
            sendErrorResponse("Internal server error", 500);
        }
    }
    
    private function getStatistics() {
        // Get general statistics
        $statsQuery = "SELECT * FROM vista_estadisticas";
        $stmt = $this->connection->prepare($statsQuery);
        $stmt->execute();
        $generalStats = $stmt->fetch();
        
        // Get monthly data for charts
        $monthlyQuery = "SELECT * FROM vista_adeudos_por_mes ORDER BY año_mes";
        $stmt = $this->connection->prepare($monthlyQuery);
        $stmt->execute();
        $monthlyData = $stmt->fetchAll();
        
        // Get career statistics
        $careerQuery = "SELECT * FROM vista_carreras_adeudos ORDER BY total_adeudo_carrera DESC LIMIT 10";
        $stmt = $this->connection->prepare($careerQuery);
        $stmt->execute();
        $careerStats = $stmt->fetchAll();
        
        // Prepare monthly chart data (12 months)
        $monthlyChartData = array_fill(0, 12, 0);
        foreach ($monthlyData as $month) {
            $monthIndex = intval($month['mes']) - 1;
            if ($monthIndex >= 0 && $monthIndex < 12) {
                $monthlyChartData[$monthIndex] = floatval($month['total_adeudo_mes']);
            }
        }
        
        $response = [
            'success' => true,
            'data' => [
                'general' => [
                    'totalDevoluciones' => intval($generalStats['total_devoluciones'] ?? 0),
                    'sinAdeudo' => intval($generalStats['sin_adeudo'] ?? 0),
                    'conAdeudo' => intval($generalStats['con_adeudo'] ?? 0),
                    'totalAdeudos' => floatval($generalStats['total_adeudos'] ?? 0),
                    'promedioAdeudo' => floatval($generalStats['promedio_adeudo'] ?? 0)
                ],
                'monthly' => $monthlyChartData,
                'careers' => array_map(function($career) {
                    return [
                        'carrera' => $career['carrera'],
                        'totalEstudiantes' => intval($career['total_estudiantes']),
                        'conAdeudo' => intval($career['con_adeudo']),
                        'totalAdeudo' => floatval($career['total_adeudo_carrera']),
                        'promedioAdeudo' => floatval($career['promedio_adeudo_carrera'])
                    ];
                }, $careerStats),
                'rawMonthly' => $monthlyData
            ]
        ];
        
        sendJSONResponse($response);
    }
}

$api = new StatsAPI();
$api->handleRequest();
?>