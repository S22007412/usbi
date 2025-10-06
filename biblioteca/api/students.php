<?php
require_once '../config/database.php';
require_once '../includes/cors.php';
require_once '../includes/validation.php';

setCORSHeaders();

class StudentsAPI {
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
                    $this->getStudents();
                    break;
                case 'POST':
                    $this->createStudent();
                    break;
                case 'PUT':
                    $this->updateStudent();
                    break;
                case 'DELETE':
                    $this->deleteStudent();
                    break;
                default:
                    sendErrorResponse("Method not allowed", 405);
            }
        } catch(Exception $e) {
            error_log("API Error: " . $e->getMessage());
            sendErrorResponse("Internal server error", 500);
        }
    }
    
    private function getStudents() {
        $query = "SELECT * FROM estudiantes WHERE activo = 1 ORDER BY fecha_registro DESC";
        $stmt = $this->connection->prepare($query);
        $stmt->execute();
        $students = $stmt->fetchAll();
        
        // Format data to match frontend expectations
        $formattedStudents = array_map(function($student) {
            return [
                'id' => $student['id'],
                'folio' => $student['folio'],
                'matricula' => $student['matricula'],
                'nombre' => $student['nombre'],
                'carrera' => $student['carrera'],
                'adeudo' => floatval($student['adeudo']),
                'estado' => $student['estado'],
                'fechaRegistro' => $student['fecha_registro'],
                'horaRegistro' => $student['hora_registro']
            ];
        }, $students);
        
        sendJSONResponse([
            'success' => true,
            'data' => $formattedStudents
        ]);
    }
    
    private function createStudent() {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            sendErrorResponse("Invalid JSON data");
        }
        
        // Validate input
        $errors = Validator::validateStudent($input);
        if (!empty($errors)) {
            sendErrorResponse(implode(', ', $errors));
        }
        
        // Sanitize input
        $matricula = Validator::sanitizeString($input['matricula']);
        $nombre = Validator::sanitizeString($input['nombre']);
        $carrera = Validator::sanitizeString($input['carrera']);
        $adeudo = Validator::sanitizeNumber($input['adeudo']);
        $estado = $adeudo > 0 ? 'con_adeudo' : 'sin_adeudo';
        
        // Handle folio generation
        $folio = $this->generateFolio($input['folio'] ?? null);
        
        $query = "INSERT INTO estudiantes (folio, matricula, nombre, carrera, adeudo, estado, hora_registro) 
                 VALUES (:folio, :matricula, :nombre, :carrera, :adeudo, :estado, :hora_registro)";
        
        $stmt = $this->connection->prepare($query);
        $stmt->bindParam(':folio', $folio);
        $stmt->bindParam(':matricula', $matricula);
        $stmt->bindParam(':nombre', $nombre);
        $stmt->bindParam(':carrera', $carrera);
        $stmt->bindParam(':adeudo', $adeudo);
        $stmt->bindParam(':estado', $estado);
        
        $hora_registro = date('H:i:s');
        $stmt->bindParam(':hora_registro', $hora_registro);
        
        if ($stmt->execute()) {
            $studentId = $this->connection->lastInsertId();
            
            // Return created student
            $createdStudent = [
                'id' => $studentId,
                'folio' => $folio,
                'matricula' => $matricula,
                'nombre' => $nombre,
                'carrera' => $carrera,
                'adeudo' => floatval($adeudo),
                'estado' => $estado,
                'fechaRegistro' => date('Y-m-d H:i:s'),
                'horaRegistro' => $hora_registro
            ];
            
            sendJSONResponse([
                'success' => true,
                'message' => 'Estudiante registrado exitosamente',
                'data' => $createdStudent
            ], 201);
        } else {
            sendErrorResponse("Error al registrar estudiante", 500);
        }
    }
    
    private function updateStudent() {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input || !isset($input['id'])) {
            sendErrorResponse("ID de estudiante requerido");
        }
        
        $errors = Validator::validateStudent($input);
        if (!empty($errors)) {
            sendErrorResponse(implode(', ', $errors));
        }
        
        // Check if folio is unique (excluding current record)
        if (isset($input['folio'])) {
            $folioCheck = "SELECT id FROM estudiantes WHERE folio = :folio AND id != :id AND activo = 1";
            $stmt = $this->connection->prepare($folioCheck);
            $stmt->bindParam(':folio', $input['folio']);
            $stmt->bindParam(':id', $input['id']);
            $stmt->execute();
            
            if ($stmt->fetch()) {
                sendErrorResponse("El folio ya existe");
            }
        }
        
        $matricula = Validator::sanitizeString($input['matricula']);
        $nombre = Validator::sanitizeString($input['nombre']);
        $carrera = Validator::sanitizeString($input['carrera']);
        $adeudo = Validator::sanitizeNumber($input['adeudo']);
        $estado = $adeudo > 0 ? 'con_adeudo' : 'sin_adeudo';
        $folio = $input['folio'];
        
        $query = "UPDATE estudiantes SET folio = :folio, matricula = :matricula, nombre = :nombre, 
                 carrera = :carrera, adeudo = :adeudo, estado = :estado 
                 WHERE id = :id AND activo = 1";
        
        $stmt = $this->connection->prepare($query);
        $stmt->bindParam(':id', $input['id']);
        $stmt->bindParam(':folio', $folio);
        $stmt->bindParam(':matricula', $matricula);
        $stmt->bindParam(':nombre', $nombre);
        $stmt->bindParam(':carrera', $carrera);
        $stmt->bindParam(':adeudo', $adeudo);
        $stmt->bindParam(':estado', $estado);
        
        if ($stmt->execute()) {
            sendJSONResponse([
                'success' => true,
                'message' => 'Estudiante actualizado exitosamente'
            ]);
        } else {
            sendErrorResponse("Error al actualizar estudiante", 500);
        }
    }
    
    private function deleteStudent() {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input || !isset($input['id'])) {
            sendErrorResponse("ID de estudiante requerido");
        }
        
        // Soft delete
        $query = "UPDATE estudiantes SET activo = 0 WHERE id = :id";
        $stmt = $this->connection->prepare($query);
        $stmt->bindParam(':id', $input['id']);
        
        if ($stmt->execute()) {
            sendJSONResponse([
                'success' => true,
                'message' => 'Estudiante eliminado exitosamente'
            ]);
        } else {
            sendErrorResponse("Error al eliminar estudiante", 500);
        }
    }
    
    private function generateFolio($customFolio = null) {
    if ($customFolio && !empty(trim($customFolio))) {
        // Use provided folio, ensure format
        $folioNumber = str_replace('No.', '', trim($customFolio));
        $folioNumber = str_pad($folioNumber, 4, '0', STR_PAD_LEFT);
        $folio = "No." . $folioNumber;
        
        // Check if it already exists in active records only
        $query = "SELECT id FROM estudiantes WHERE folio = :folio AND activo = 1";
        $stmt = $this->connection->prepare($query);
        $stmt->bindParam(':folio', $folio);
        $stmt->execute();
        
        if ($stmt->fetch()) {
            throw new Exception("El folio ya existe");
        }
        
        return $folio;
    } else {
        // Generate next available folio - look at ALL records to avoid conflicts
        $query = "SELECT MAX(CAST(SUBSTRING(folio, 4) AS UNSIGNED)) as max_folio FROM estudiantes";
        $stmt = $this->connection->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch();
        
        $nextNumber = ($result['max_folio'] ?? 0) + 1;
        return "No." . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
    }
}
}

$api = new StudentsAPI();
$api->handleRequest();
?>