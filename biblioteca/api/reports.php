<?php
require_once '../config/database.php';
require_once '../includes/cors.php';

setCORSHeaders();

class ReportsAPI {
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
            $type = $_GET['type'] ?? '';
            
            switch($type) {
                case 'monthly':
                    $this->getMonthlyReport();
                    break;
                case 'career':
                    $this->getCareerReport();
                    break;
                default:
                    sendErrorResponse("Report type required (monthly or career)");
            }
        } catch(Exception $e) {
            error_log("Reports API Error: " . $e->getMessage());
            sendErrorResponse("Internal server error", 500);
        }
    }
    
    private function getMonthlyReport() {
        $month = $_GET['month'] ?? '';
        $year = $_GET['year'] ?? '';
        
        if (empty($month) || empty($year)) {
            sendErrorResponse("Month and year parameters are required");
        }
        
        // Validate month and year
        if (!preg_match('/^(0[1-9]|1[0-2])$/', $month) || !preg_match('/^\d{4}$/', $year)) {
            sendErrorResponse("Invalid month or year format");
        }
        
        $query = "SELECT * FROM estudiantes 
                 WHERE MONTH(fecha_registro) = :month 
                 AND YEAR(fecha_registro) = :year 
                 ORDER BY fecha_registro ASC";
        
        $stmt = $this->connection->prepare($query);
        $stmt->bindParam(':month', $month, PDO::PARAM_STR);
        $stmt->bindParam(':year', $year, PDO::PARAM_STR);
        $stmt->execute();
        
        $students = $stmt->fetchAll();
        
        // Calculate summary statistics
        $totalStudents = count($students);
        $totalDebt = array_sum(array_column($students, 'adeudo'));
        $studentsWithDebt = count(array_filter($students, function($s) { return $s['adeudo'] > 0; }));
        $studentsWithoutDebt = $totalStudents - $studentsWithDebt;
        
        $monthNames = [
            '01' => 'Enero', '02' => 'Febrero', '03' => 'Marzo', '04' => 'Abril',
            '05' => 'Mayo', '06' => 'Junio', '07' => 'Julio', '08' => 'Agosto',
            '09' => 'Septiembre', '10' => 'Octubre', '11' => 'Noviembre', '12' => 'Diciembre'
        ];
        
        $response = [
            'success' => true,
            'data' => [
                'period' => [
                    'month' => $month,
                    'year' => $year,
                    'monthName' => $monthNames[$month],
                    'displayName' => $monthNames[$month] . ' ' . $year
                ],
                'summary' => [
                    'totalStudents' => $totalStudents,
                    'totalDebt' => floatval($totalDebt),
                    'studentsWithDebt' => $studentsWithDebt,
                    'studentsWithoutDebt' => $studentsWithoutDebt,
                    'averageDebt' => $totalStudents > 0 ? floatval($totalDebt / $totalStudents) : 0
                ],
                'students' => array_map(function($student) {
                    return [
                        'folio' => $student['folio'],
                        'matricula' => $student['matricula'],
                        'nombre' => $student['nombre'],
                        'carrera' => $student['carrera'],
                        'adeudo' => floatval($student['adeudo']),
                        'tipoPago' => $student['tipo_pago'],
                        'estado' => $student['estado'],
                        'fecha_registro' => $student['fecha_registro'],
                        'hora_registro' => $student['hora_registro']
                    ];
                }, $students)
            ]
        ];
        
        sendJSONResponse($response);
    }
    
    private function getCareerReport() {
        $carrera = $_GET['carrera'] ?? '';
        
        if (empty($carrera)) {
            sendErrorResponse("Carrera parameter is required");
        }
        
        $query = "SELECT * FROM estudiantes 
                 WHERE carrera = :carrera 
                 ORDER BY fecha_registro ASC";
        
        $stmt = $this->connection->prepare($query);
        $stmt->bindParam(':carrera', $carrera, PDO::PARAM_STR);
        $stmt->execute();
        
        $students = $stmt->fetchAll();
        
        // Calculate summary statistics
        $totalStudents = count($students);
        $totalDebt = array_sum(array_column($students, 'adeudo'));
        $studentsWithDebt = count(array_filter($students, function($s) { return $s['adeudo'] > 0; }));
        $studentsWithoutDebt = $totalStudents - $studentsWithDebt;
        
        // Group by month for trend analysis
        $monthlyData = [];
        foreach ($students as $student) {
            $monthKey = date('Y-m', strtotime($student['fecha_registro']));
            if (!isset($monthlyData[$monthKey])) {
                $monthlyData[$monthKey] = [
                    'month' => $monthKey,
                    'count' => 0,
                    'totalDebt' => 0
                ];
            }
            $monthlyData[$monthKey]['count']++;
            $monthlyData[$monthKey]['totalDebt'] += floatval($student['adeudo']);
        }
        
        $response = [
            'success' => true,
            'data' => [
                'carrera' => $carrera,
                'summary' => [
                    'totalStudents' => $totalStudents,
                    'totalDebt' => floatval($totalDebt),
                    'studentsWithDebt' => $studentsWithDebt,
                    'studentsWithoutDebt' => $studentsWithoutDebt,
                    'averageDebt' => $totalStudents > 0 ? floatval($totalDebt / $totalStudents) : 0
                ],
                'monthlyTrend' => array_values($monthlyData),
                'students' => array_map(function($student) {
                    return [
                        'folio' => $student['folio'],
                        'matricula' => $student['matricula'],
                        'nombre' => $student['nombre'],
                        'carrera' => $student['carrera'],
                        'adeudo' => floatval($student['adeudo']),
                        'tipoPago' => $student['tipo_pago'],
                        'estado' => $student['estado'],
                        'fecha_registro' => $student['fecha_registro'],
                        'hora_registro' => $student['hora_registro']
                    ];
                }, $students)
            ]
        ];
        
        sendJSONResponse($response);
    }
}

$api = new ReportsAPI();
$api->handleRequest();
?>
