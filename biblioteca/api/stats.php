<?php
header('Content-Type: application/json');
require_once '../config/database.php';
require_once '../includes/cors.php';

try {
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Query directly from estudiantes to avoid GROUP BY issues

    $total = $conn->query("SELECT COUNT(*) AS total FROM estudiantes")
                   ->fetch(PDO::FETCH_ASSOC)['total'];

    $sinAdeudo = $conn->query("SELECT COUNT(*) AS sin_adeudo FROM estudiantes WHERE estado='sin_adeudo'")
                       ->fetch(PDO::FETCH_ASSOC)['sin_adeudo'];

    $conAdeudo = $conn->query("SELECT COUNT(*) AS con_adeudo FROM estudiantes WHERE estado='con_adeudo'")
                       ->fetch(PDO::FETCH_ASSOC)['con_adeudo'];

    $totalAdeudos = $conn->query("SELECT COALESCE(SUM(adeudo), 0) AS total_adeudos FROM estudiantes")
                           ->fetch(PDO::FETCH_ASSOC)['total_adeudos'];

    $promedioAdeudo = $conn->query("SELECT COALESCE(AVG(adeudo), 0) AS promedio_adeudo FROM estudiantes")
                            ->fetch(PDO::FETCH_ASSOC)['promedio_adeudo'];

    echo json_encode([
        'success' => true,
        'data' => [
            'total_devoluciones' => (int)$total,
            'sin_adeudo' => (int)$sinAdeudo,
            'con_adeudo' => (int)$conAdeudo,
            'total_adeudos' => (float)$totalAdeudos,
            'promedio_adeudo' => (float)$promedioAdeudo,
        ]
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Error: ' . $e->getMessage()
    ]);
}
