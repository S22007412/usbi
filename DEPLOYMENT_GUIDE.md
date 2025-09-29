# 📚 Sistema de Control de Biblioteca - Guía de Implementación

## 🔍 Resumen de Cambios Implementados

### ✅ Lo que se ha implementado:

**Frontend (JavaScript/HTML/CSS):**
- ✅ **Interfaz de Usuario Completa**: Dashboard, Registro, Búsqueda, Reportes
- ✅ **Gestión de Folios**: Generación automática y manual con validación
- ✅ **CRUD de Estudiantes**: Crear, leer, actualizar, eliminar registros
- ✅ **Sistema de Búsqueda**: Por folio, matrícula o nombre
- ✅ **Estadísticas y Gráficos**: Dashboard con Chart.js
- ✅ **Generación de PDF**: Comprobantes de devolución
- ✅ **Conectado a Backend**: Reemplaza datos mock con APIs reales

**Backend PHP Creado:**
- ✅ **Conexión a Base de Datos**: MySQL en ubiuv.duckdns.org:3306
- ✅ **API RESTful Completa**: 
  - `/api/students` (GET, POST, PUT, DELETE)
  - `/api/stats` (GET)
  - `/api/search` (GET)
  - `/api/config` (GET, POST)
  - `/api/carreras` (GET)
- ✅ **Validación de Datos**: Sanitización y validación de inputs
- ✅ **Manejo de Errores**: Respuestas HTTP apropiadas
- ✅ **CORS Headers**: Permite conexiones desde el frontend
- ✅ **Seguridad**: Prevención de SQL injection

**Estructura de Archivos Backend:**
```
/var/www/html/biblioteca/
├── config/
│   └── database.php          # Conexión a MySQL
├── includes/
│   ├── cors.php             # Headers CORS
│   └── validation.php       # Validación de datos
├── api/
│   ├── students.php         # CRUD estudiantes
│   ├── stats.php           # Estadísticas
│   ├── search.php          # Búsqueda
│   ├── config.php          # Configuración sistema
│   └── carreras.php        # Lista de carreras
├── test_connection.php     # Prueba de conexión
├── index.php              # Panel de control API
└── .htaccess              # Configuración Apache
```

## 🚀 Pasos para Implementación en su Servidor

### 1. **Preparar el Servidor Apache**

```bash
# 1. Conectarse al servidor
ssh usuario@ubiuv.duckdns.org

# 2. Crear directorio del proyecto
sudo mkdir -p /var/www/html/biblioteca
sudo chown -R www-data:www-data /var/www/html/biblioteca
sudo chmod -R 755 /var/www/html/biblioteca

# 3. Verificar que Apache esté corriendo
sudo systemctl status apache2
sudo systemctl restart apache2
```

### 2. **Copiar Archivos del Backend**

Transfiera todos los archivos del directorio `/app/backend/` a `/var/www/html/biblioteca/` en su servidor:

```bash
# En su máquina local (desde el directorio donde están los archivos)
scp -r backend/* usuario@ubiuv.duckdns.org:/var/www/html/biblioteca/

# O usar SFTP/WinSCP para transferir:
# backend/config/ → /var/www/html/biblioteca/config/
# backend/includes/ → /var/www/html/biblioteca/includes/
# backend/api/ → /var/www/html/biblioteca/api/
# backend/test_connection.php → /var/www/html/biblioteca/test_connection.php
# backend/index.php → /var/www/html/biblioteca/index.php
# backend/.htaccess → /var/www/html/biblioteca/.htaccess
```

### 3. **Configurar Permisos**

```bash
# En el servidor
sudo chown -R www-data:www-data /var/www/html/biblioteca
sudo chmod -R 644 /var/www/html/biblioteca
sudo chmod -R 755 /var/www/html/biblioteca/api
sudo chmod 644 /var/www/html/biblioteca/.htaccess
```

### 4. **Configurar Apache Virtual Host (Opcional pero recomendado)**

```bash
# Crear virtual host
sudo nano /etc/apache2/sites-available/biblioteca.conf

# Añadir configuración:
<VirtualHost *:80>
    ServerName ubiuv.duckdns.org
    DocumentRoot /var/www/html
    
    # Alias para la aplicación
    Alias /biblioteca /var/www/html/biblioteca
    
    <Directory /var/www/html/biblioteca>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    # Logs
    ErrorLog ${APACHE_LOG_DIR}/biblioteca_error.log
    CustomLog ${APACHE_LOG_DIR}/biblioteca_access.log combined
</VirtualHost>

# Habilitar el sitio
sudo a2ensite biblioteca.conf
sudo a2enmod rewrite
sudo systemctl restart apache2
```

### 5. **Verificar la Base de Datos**

```bash
# Conectar a MySQL y verificar
mysql -h localhost -u usbi -p usbi
# Contraseña: contraseña

# Verificar tablas
USE usbi;
SHOW TABLES;
SELECT COUNT(*) FROM estudiantes;
SELECT COUNT(*) FROM carreras;
SELECT COUNT(*) FROM configuracion;
```

### 6. **Probar el Backend**

```bash
# 1. Probar desde el navegador:
# http://ubiuv.duckdns.org/biblioteca/

# 2. Probar conexión específicamente:
# http://ubiuv.duckdns.org/biblioteca/test_connection.php

# 3. Probar endpoints API:
# http://ubiuv.duckdns.org/biblioteca/api/students
# http://ubiuv.duckdns.org/biblioteca/api/stats
# http://ubiuv.duckdns.org/biblioteca/api/carreras
```

### 7. **Configurar el Frontend**

En su archivo `script.js`, actualice la URL del API si es necesario:

```javascript
// Cambiar esta línea si es necesario
const API_BASE_URL = 'http://ubiuv.duckdns.org/biblioteca/api';
```

### 8. **Subir el Frontend**

```bash
# Copiar archivos del frontend al directorio web
scp index.html styles.css script.js usuario@ubiuv.duckdns.org:/var/www/html/
```

## 🧪 Pruebas de Funcionamiento

### 1. **Verificación de Conexión**
- Visitar: `http://ubiuv.duckdns.org/biblioteca/`
- Debe mostrar el panel de control del API
- Hacer clic en "Probar Conexión a Base de Datos"
- Debe mostrar "✅ Conexión exitosa"

### 2. **Pruebas de API**
```bash
# Probar obtener estudiantes
curl -X GET http://ubiuv.duckdns.org/biblioteca/api/students

# Probar crear estudiante
curl -X POST http://ubiuv.duckdns.org/biblioteca/api/students \
  -H "Content-Type: application/json" \
  -d '{"matricula":"S22007409","nombre":"Juan Pérez","carrera":"Ingeniería Civil","adeudo":0}'

# Probar estadísticas
curl -X GET http://ubiuv.duckdns.org/biblioteca/api/stats

# Probar búsqueda
curl -X GET "http://ubiuv.duckdns.org/biblioteca/api/search?term=juan"
```

### 3. **Verificación del Frontend**
- Visitar: `http://ubiuv.duckdns.org/index.html`
- Verificar que carga sin errores
- Probar registro de un estudiante
- Verificar que aparece en la lista
- Probar búsqueda
- Generar PDF

## 🔧 Configuraciones Adicionales (Opcionales)

### SSL/HTTPS (Recomendado para producción)

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-apache

# Obtener certificado SSL
sudo certbot --apache -d ubiuv.duckdns.org

# El certificado se renovará automáticamente
```

### Optimización de PHP

```bash
# Editar configuración PHP
sudo nano /etc/php/8.3/apache2/php.ini

# Configuraciones recomendadas:
max_execution_time = 30
memory_limit = 256M
upload_max_filesize = 10M
post_max_size = 10M

# Reiniciar Apache
sudo systemctl restart apache2
```

## 🐛 Solución de Problemas Comunes

### 1. **Error de Conexión a Base de Datos**
```bash
# Verificar que MySQL esté corriendo
sudo systemctl status mysql

# Verificar usuario y permisos
mysql -u root -p
GRANT ALL PRIVILEGES ON usbi.* TO 'usbi'@'%' IDENTIFIED BY 'contraseña';
FLUSH PRIVILEGES;
```

### 2. **Error 404 en APIs**
```bash
# Verificar que mod_rewrite está habilitado
sudo a2enmod rewrite
sudo systemctl restart apache2

# Verificar archivo .htaccess
ls -la /var/www/html/biblioteca/.htaccess
```

### 3. **Error CORS**
```bash
# Habilitar headers module
sudo a2enmod headers
sudo systemctl restart apache2
```

### 4. **Permisos de Archivo**
```bash
# Corregir permisos
sudo chown -R www-data:www-data /var/www/html/biblioteca
sudo chmod -R 755 /var/www/html/biblioteca
```

## 📊 Estructura de la Base de Datos

El sistema utiliza las siguientes tablas principales:

- **`estudiantes`**: Registros de devoluciones
- **`carreras`**: Catálogo de carreras universitarias  
- **`configuracion`**: Configuraciones del sistema
- **`historial_cambios`**: Auditoría de cambios (con triggers)

### Vistas disponibles:
- **`vista_estadisticas`**: Estadísticas generales
- **`vista_adeudos_por_mes`**: Adeudos agrupados por mes
- **`vista_carreras_adeudos`**: Estadísticas por carrera

## ✅ Estado Final del Sistema

Una vez implementado, el sistema tendrá:

1. **Frontend Funcional**: Interfaz completa para gestión de devoluciones
2. **Backend API**: Endpoints RESTful conectados a MySQL
3. **Base de Datos**: Estructura completa con datos de carreras precargados
4. **Funcionalidades**:
   - ✅ Registro de devoluciones con folios automáticos
   - ✅ Búsqueda por múltiples criterios
   - ✅ Estadísticas en tiempo real
   - ✅ Generación de reportes PDF
   - ✅ Gestión completa de estudiantes (CRUD)
   - ✅ Dashboard con gráficos interactivos

El sistema estará listo para uso en producción una vez completados estos pasos.