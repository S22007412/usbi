<?php
require_once 'config/database.php';

header('Content-Type: application/json');

try {
    $db = new Database();
    $connection = $db->getConnection();
    
    // Test basic connection
    $stmt = $connection->prepare("SELECT 1 as test");
    $stmt->execute();
    $result = $stmt->fetch();
    
    // Test if tables exist
    $stmt = $connection->prepare("SHOW TABLES LIKE 'estudiantes'");
    $stmt->execute();
    $estudiantesExists = $stmt->fetch() !== false;
    
    $stmt = $connection->prepare("SHOW TABLES LIKE 'configuracion'");
    $stmt->execute();
    $configExists = $stmt->fetch() !== false;
    
    $stmt = $connection->prepare("SHOW TABLES LIKE 'carreras'");
    $stmt->execute();
    $carrerasExists = $stmt->fetch() !== false;
    
    // Get some sample data
    $stmt = $connection->prepare("SELECT COUNT(*) as count FROM estudiantes");
    $stmt->execute();
    $estudiantesCount = $stmt->fetch()['count'];
    
    $stmt = $connection->prepare("SELECT COUNT(*) as count FROM carreras");
    $stmt->execute();
    $carrerasCount = $stmt->fetch()['count'];
    
    echo json_encode([
        'success' => true,
        'message' => 'Database connection successful',
        'database' => 'usbi',
        'server' => 'ubiuv.duckdns.org:3306',
        'tables' => [
            'estudiantes' => $estudiantesExists ? "✓ Exists ({$estudiantesCount} records)" : "✗ Missing",
            'configuracion' => $configExists ? "✓ Exists" : "✗ Missing",
            'carreras' => $carrerasExists ? "✓ Exists ({$carrerasCount} records)" : "✗ Missing"
        ],
        'timestamp' => date('Y-m-d H:i:s')
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'timestamp' => date('Y-m-d H:i:s')
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}
?>