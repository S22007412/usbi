<?php
header('Content-Type: text/html; charset=UTF-8');
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Backend - Sistema de Control de Biblioteca</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: #3b82f6; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .endpoint { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; margin: 10px 0; border-radius: 6px; }
        .method { display: inline-block; padding: 4px 8px; border-radius: 4px; font-weight: bold; margin-right: 10px; }
        .get { background: #10b981; color: white; }
        .post { background: #3b82f6; color: white; }
        .put { background: #f59e0b; color: white; }
        .delete { background: #ef4444; color: white; }
        .test-btn { background: #06d6a0; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
        .test-btn:hover { background: #059669; }
        .status { margin-top: 10px; padding: 10px; border-radius: 4px; }
        .success { background: #d1fae5; color: #065f46; }
        .error { background: #fee2e2; color: #991b1b; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🏛️ Sistema de Control de Biblioteca - API Backend</h1>
        <p>Backend PHP para conectar con MySQL Database</p>
    </div>

    <h2>📡 Estado de la Conexión</h2>
    <button class="test-btn" onclick="testConnection()">Probar Conexión a Base de Datos</button>
    <div id="connectionStatus"></div>

    <h2>🛠️ Endpoints Disponibles</h2>

    <div class="endpoint">
        <span class="method get">GET</span>
        <strong>/api/students</strong> - Obtener todos los estudiantes
        <button class="test-btn" onclick="testEndpoint('students', 'GET')">Probar</button>
        <div id="students-get-result"></div>
    </div>

    <div class="endpoint">
        <span class="method post">POST</span>
        <strong>/api/students</strong> - Crear nuevo estudiante
        <p>Body: {"matricula": "S22007409", "nombre": "Juan Pérez", "carrera": "Ingeniería", "adeudo": 0}</p>
    </div>

    <div class="endpoint">
        <span class="method put">PUT</span>
        <strong>/api/students</strong> - Actualizar estudiante
        <p>Body: {"id": 1, "matricula": "S22007409", "nombre": "Juan Pérez", "carrera": "Ingeniería", "adeudo": 50}</p>
    </div>

    <div class="endpoint">
        <span class="method delete">DELETE</span>
        <strong>/api/students</strong> - Eliminar estudiante
        <p>Body: {"id": 1}</p>
    </div>

    <div class="endpoint">
        <span class="method get">GET</span>
        <strong>/api/stats</strong> - Obtener estadísticas del sistema
        <button class="test-btn" onclick="testEndpoint('stats', 'GET')">Probar</button>
        <div id="stats-get-result"></div>
    </div>

    <div class="endpoint">
        <span class="method get">GET</span>
        <strong>/api/search?term={término}</strong> - Buscar estudiantes
        <button class="test-btn" onclick="testSearch()">Probar (búsqueda vacía)</button>
        <div id="search-result"></div>
    </div>

    <div class="endpoint">
        <span class="method get">GET</span>
        <strong>/api/carreras</strong> - Obtener lista de carreras
        <button class="test-btn" onclick="testEndpoint('carreras', 'GET')">Probar</button>
        <div id="carreras-get-result"></div>
    </div>

    <div class="endpoint">
        <span class="method get">GET</span>
        <strong>/api/config</strong> - Obtener configuración del sistema
        <button class="test-btn" onclick="testEndpoint('config', 'GET')">Probar</button>
        <div id="config-get-result"></div>
    </div>

    <h2>📋 Información del Sistema</h2>
    <ul>
        <li><strong>Servidor:</strong> ubiuv.duckdns.org:3306</li>
        <li><strong>Base de Datos:</strong> usbi</li>
        <li><strong>Usuario:</strong> usbi</li>
        <li><strong>Directorio:</strong> /var/www/html/biblioteca/</li>
        <li><strong>Tecnologías:</strong> PHP 8.3, MySQL 8.0, Apache2</li>
    </ul>

    <script>
        async function testConnection() {
            const statusDiv = document.getElementById('connectionStatus');
            statusDiv.innerHTML = '🔄 Probando conexión...';
            
            try {
                const response = await fetch('test_connection.php');
                const result = await response.json();
                
                if (result.success) {
                    statusDiv.innerHTML = `
                        <div class="status success">
                            <h4>✅ Conexión exitosa</h4>
                            <p><strong>Base de datos:</strong> ${result.database}</p>
                            <p><strong>Servidor:</strong> ${result.server}</p>
                            <p><strong>Timestamp:</strong> ${result.timestamp}</p>
                            <h5>Estado de las tablas:</h5>
                            <ul>
                                <li>Estudiantes: ${result.tables.estudiantes}</li>
                                <li>Configuración: ${result.tables.configuracion}</li>
                                <li>Carreras: ${result.tables.carreras}</li>
                            </ul>
                        </div>
                    `;
                } else {
                    statusDiv.innerHTML = `
                        <div class="status error">
                            <h4>❌ Error de conexión</h4>
                            <p>${result.error}</p>
                        </div>
                    `;
                }
            } catch (error) {
                statusDiv.innerHTML = `
                    <div class="status error">
                        <h4>❌ Error de red</h4>
                        <p>${error.message}</p>
                    </div>
                `;
            }
        }

        async function testEndpoint(endpoint, method) {
            const resultDiv = document.getElementById(`${endpoint}-${method.toLowerCase()}-result`);
            resultDiv.innerHTML = '🔄 Probando endpoint...';
            
            try {
                const response = await fetch(`api/${endpoint}`);
                const result = await response.json();
                
                if (result.success) {
                    resultDiv.innerHTML = `
                        <div class="status success">
                            <h5>✅ Respuesta exitosa</h5>
                            <pre>${JSON.stringify(result, null, 2)}</pre>
                        </div>
                    `;
                } else {
                    resultDiv.innerHTML = `
                        <div class="status error">
                            <h5>❌ Error en endpoint</h5>
                            <p>${result.error}</p>
                        </div>
                    `;
                }
            } catch (error) {
                resultDiv.innerHTML = `
                    <div class="status error">
                        <h5>❌ Error de red</h5>
                        <p>${error.message}</p>
                    </div>
                `;
            }
        }

        async function testSearch() {
            const resultDiv = document.getElementById('search-result');
            resultDiv.innerHTML = '🔄 Probando búsqueda...';
            
            try {
                const response = await fetch('api/search?term=test');
                const result = await response.json();
                
                resultDiv.innerHTML = `
                    <div class="status ${result.success ? 'success' : 'error'}">
                        <h5>${result.success ? '✅' : '❌'} Respuesta de búsqueda</h5>
                        <pre>${JSON.stringify(result, null, 2)}</pre>
                    </div>
                `;
            } catch (error) {
                resultDiv.innerHTML = `
                    <div class="status error">
                        <h5>❌ Error en búsqueda</h5>
                        <p>${error.message}</p>
                    </div>
                `;
            }
        }

        // Test connection on load
        window.addEventListener('load', testConnection);
    </script>
</body>
</html>