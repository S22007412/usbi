// Sistema de Control de Biblioteca - JavaScript with Backend API
/* global Chart */

// API Configuration - Update this to your server's URL
const API_BASE_URL = 'https://ubiuv.duckdns.org/biblioteca/api';

// Array de estudiantes - now loaded from database
let estudiantes = [];

// Variables globales
let currentPage = 'dashboard';
let nextFolio = 1;
let estadoChart = null;
let ingresosChart = null;
let currentEditIndex = -1;
let currentDeleteIndex = -1;
let isLoading = false;

// API Helper Functions
async function apiRequest(endpoint, method = 'GET', data = null) {
    try {
        const config = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };
        
        if (data) {
            config.body = JSON.stringify(data);
        }
        
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, config);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || `HTTP error! status: ${response.status}`);
        }
        
        return result;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

// Loading indicator functions
function showLoading(message = 'Cargando...') {
    isLoading = true;
    // You can implement a loading spinner here
    console.log(message);
}

function hideLoading() {
    isLoading = false;
    // Hide loading spinner
}

// Load students from database
async function loadStudents() {
    try {
        showLoading('Cargando estudiantes...');
        const response = await apiRequest('students');
        estudiantes.length = 0; // Clear array
        estudiantes.push(...response.data);
        updateDashboardStats();
        updateReportsStats();
        hideLoading();
    } catch (error) {
        hideLoading();
        showErrorMessage('Error al cargar estudiantes: ' + error.message);
        console.error('Error loading students:', error);
    }
}

// Load statistics from database
async function loadStatistics() {
    try {
        const response = await apiRequest('stats');
        return response.data;
    } catch (error) {
        console.error('Error loading statistics:', error);
        return null;
    }
}

// Inicialización del sistema
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeFormHandlers();
    initializeSearchHandlers();
    initializeModalHandlers();
    
    // Load initial data
    loadStudents();
    initializeCharts();
    initializeReportsHandlers();
    loadCarrerasForReports();

    initializeCSVHandlers();
    updatePaymentTypePreview();
});

// Navegación entre páginas
function initializeNavigation() {
    const menuItems = document.querySelectorAll('.menu-item');
    const actionCards = document.querySelectorAll('.action-card');
    const actionButtons = document.querySelectorAll('[data-page]');

    // Navegación desde menú lateral
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetPage = this.getAttribute('data-page');
            navigateToPage(targetPage);
            
            // Actualizar estado activo del menú
            menuItems.forEach(mi => mi.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Navegación desde tarjetas de acción
    actionCards.forEach(card => {
        const button = card.querySelector('.btn-action');
        button.addEventListener('click', function() {
            const targetPage = card.getAttribute('data-page');
            navigateToPage(targetPage);
            updateActiveMenu(targetPage);
        });
    });

    // Navegación desde botones con data-page
    actionButtons.forEach(button => {
        if (!button.classList.contains('menu-item') && !button.classList.contains('btn-action')) {
            button.addEventListener('click', function() {
                const targetPage = this.getAttribute('data-page');
                navigateToPage(targetPage);
                updateActiveMenu(targetPage);
            });
        }
    });
}

function navigateToPage(pageName) {
    // Ocultar todas las páginas
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Mostrar página seleccionada
    const targetPage = document.getElementById(pageName);
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageName;

        // UPDATE: Always update the active menu item
        updateActiveMenu(pageName);

        // Acciones específicas por página
        if (pageName === 'registro') {
            updateCurrentFolio();
        } else if (pageName === 'busqueda') {
            clearSearchResults();
        } else if (pageName === 'reportes') {
            // Esperar un poco para que el DOM se actualice
            setTimeout(() => {
                initializeCharts();
            }, 100);
        }
    }
}

function updateActiveMenu(pageName) {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-page') === pageName) {
            item.classList.add('active');
        }
    });
}

// Manejo de formularios
function initializeFormHandlers() {
    const registrarBtn = document.getElementById('registrar-devolucion');

    // Registrar devolución
    if (registrarBtn) {
        registrarBtn.addEventListener('click', function() {
            registrarDevolucion();
        });
    }
    
    // Add event listeners for live updates (only if elements exist)
    const matriculaInput = document.getElementById('matricula');
    const nombreInput = document.getElementById('nombre');
    const carreraInput = document.getElementById('carrera');
    const montoInput = document.getElementById('monto-adeudo');
    const folioInput = document.getElementById('folio-manual');
    
    if (matriculaInput) {
        matriculaInput.addEventListener('input', updateResumen);
    }
    
    if (nombreInput) {
        nombreInput.addEventListener('input', updateResumen);
    }
    
    if (carreraInput) {
        carreraInput.addEventListener('change', updateResumen);
    }
    
    if (montoInput) {
        montoInput.addEventListener('input', function() {
            updatePaymentTypePreview();
            updateResumen();
        });
    }
    
    if (folioInput) {
        folioInput.addEventListener('input', updateResumen);
    }
}

function updateCurrentFolio() {
    const folioElement = document.getElementById('current-folio');
    const nextAvailable = getNextAvailableFolio();
    
    if (folioElement) {
        folioElement.textContent = nextAvailable;
    }
    
    updateResumen();
}

// Función para obtener el próximo folio disponible
function getNextAvailableFolio() {
    if (estudiantes.length === 0) return "0001";
    
    // Obtener todos los números de folio existentes
    const existingFolios = estudiantes.map(e => parseInt(e.folio.replace('No.', '')));
    const maxFolio = Math.max(...existingFolios);
    
    return String(maxFolio + 1).padStart(4, '0');
}

// Función para validar folio único
function validateFolioUnique(folio, excludeIndex = -1) {
    return !estudiantes.some((estudiante, index) => 
        estudiante.folio === `No.${folio}` && index !== excludeIndex
    );
}

// Función para formatear folio
function formatFolio(input) {
    // Remover caracteres no numéricos
    let numbers = input.replace(/\D/g, '');
    
    // Limitar a 4 dígitos
    numbers = numbers.substring(0, 4);
    
    // Rellenar con ceros
    return numbers.padStart(4, '0');
}

function updateResumen() {
    const matricula = document.getElementById('matricula').value;
    const nombre = document.getElementById('nombre').value;
    const carrera = document.getElementById('carrera').value;
    const montoAdeudo = document.getElementById('monto-adeudo').value;
    const folioManual = document.getElementById('folio-manual').value;

    // Actualizar elementos del resumen
    const resumenEstudiante = document.getElementById('resumen-estudiante');
    const resumenCarrera = document.getElementById('resumen-carrera');
    const resumenAdeudo = document.getElementById('resumen-adeudo');
    const resumenFolioElement = document.getElementById('resumen-folio');
    
    // Check if elements exist before updating
    if (resumenEstudiante) {
        resumenEstudiante.textContent = nombre || 'N/A';
    }
    
    if (resumenCarrera) {
        resumenCarrera.textContent = carrera || 'N/A';
    }
    
    // Formatear monto del adeudo
    const monto = parseFloat(montoAdeudo) || 0;
    if (resumenAdeudo) {
        resumenAdeudo.textContent = `$${monto.toFixed(2)}`;
    }

    // Mostrar folio (manual o automático)
    if (resumenFolioElement) {
        if (folioManual && folioManual.trim()) {
            const formattedFolio = formatFolio(folioManual.trim());
            resumenFolioElement.textContent = formattedFolio;
            
            // Validar si es único
            if (!validateFolioUnique(formattedFolio)) {
                resumenFolioElement.innerHTML = `${formattedFolio} <span style="color: #ef4444; font-size: 12px;">(⚠️ DUPLICADO)</span>`;
            }
        } else {
            resumenFolioElement.textContent = getNextAvailableFolio();
        }
    }
    
    // Update payment type preview
    updatePaymentTypePreview();
}


function updatePaymentTypePreview() {
    const montoInput = document.getElementById('monto-adeudo');
    
    // Check if monto input exists
    if (!montoInput) return;
    
    const montoAdeudo = parseFloat(montoInput.value) || 0;
    
    // Determine payment type based on amount
    const tipoPago = montoAdeudo > 0 ? 'efectivo' : 'multa_cancelada';
    const tipoPagoText = tipoPago === 'efectivo' ? 'Efectivo' : 'Multa Cancelada';
    
    // Update preview in Monto section
    const previewElement = document.getElementById('preview-tipo-pago');
    if (previewElement) {
        previewElement.textContent = tipoPagoText;
        previewElement.className = `payment-preview ${tipoPago}`;
    }
    
    // Update resumen
    const resumenElement = document.getElementById('resumen-tipo-pago');
    if (resumenElement) {
        resumenElement.textContent = tipoPagoText;
        resumenElement.className = `payment-preview ${tipoPago}`;
    }
}

async function registrarDevolucion() {
    if (isLoading) return;

    const matricula = document.getElementById('matricula').value.trim();
    const nombre = document.getElementById('nombre').value.trim();
    const carrera = document.getElementById('carrera').value;
    const montoAdeudo = parseFloat(document.getElementById('monto-adeudo').value) || 0;
    const folioManual = document.getElementById('folio-manual').value.trim();

    // Validar campos requeridos
    if (!matricula || !nombre || !carrera) {
        alert('Por favor, complete todos los campos requeridos');
        return;
    }

    // Validar monto (debe ser positivo o cero)
    if (montoAdeudo < 0) {
        alert('El monto del adeudo no puede ser negativo');
        return;
    }

    try {
        showLoading('Registrando devolución...');

        const studentData = {
            matricula: matricula,
            nombre: nombre,
            carrera: carrera,
            adeudo: montoAdeudo,
            folio: folioManual || null
        };

        const response = await apiRequest('students', 'POST', studentData);
        
        if (response.success) {
            // Add to local array
            estudiantes.push(response.data);
            
            // Limpiar formulario
            clearForm();
            
            // Actualizar estadísticas
            updateDashboardStats();
            updateReportsStats();
            
            // Mostrar mensaje de éxito
            showSuccessMessage(response.message, 'success');
            
            // Actualizar folio
            updateCurrentFolio();
        }
        
        hideLoading();
    } catch (error) {
        hideLoading();
        showErrorMessage('Error al registrar devolución: ' + error.message);
    }
}

function clearForm() {
    document.getElementById('folio-manual').value = '';
    document.getElementById('matricula').value = '';
    document.getElementById('nombre').value = '';
    document.getElementById('carrera').value = '';
    document.getElementById('monto-adeudo').value = '';
    updateResumen();
}

// Búsqueda
function initializeSearchHandlers() {
    const searchInput = document.getElementById('search-input');
    const searchResult = document.getElementById('search-result');
    const buscarBtn = document.getElementById('buscar-btn');

    // Actualizar término de búsqueda
    searchInput.addEventListener('input', function() {
        const term = this.value.trim();
        searchResult.textContent = term || 'Ej. 0001, S22007409 o Juan Pérez';
    });

    // Realizar búsqueda
    buscarBtn.addEventListener('click', function() {
        realizarBusqueda();
    });

    // Buscar con Enter
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            realizarBusqueda();
        }
    });
}

async function realizarBusqueda() {
    const searchTerm = document.getElementById('search-input').value.trim();
    
    if (!searchTerm) {
        alert('Por favor, ingrese un término de búsqueda');
        return;
    }

    try {
        showLoading('Buscando...');
        const response = await apiRequest(`search?term=${encodeURIComponent(searchTerm)}`);
        displaySearchResults(response.data, searchTerm);
        hideLoading();
    } catch (error) {
        hideLoading();
        showErrorMessage('Error en la búsqueda: ' + error.message);
        displaySearchResults([], searchTerm);
    }
}

function displaySearchResults(results, searchTerm) {
    const resultsSection = document.getElementById('results-section');
    const studentCards = document.getElementById('student-cards');

    if (results.length === 0) {
        studentCards.innerHTML = `
            <div class="student-card">
                <div class="student-info">
                    <div class="info-item">
                        <div class="info-label">Sin resultados</div>
                        <div class="info-value">No se encontraron registros para "${searchTerm}"</div>
                    </div>
                </div>
            </div>
        `;
    } else {
        studentCards.innerHTML = results.map(estudiante => `
            <div class="student-card">
                <div class="student-info">
                    <div class="info-item">
                        <div class="info-label">Folio</div>
                        <div class="info-value">${estudiante.folio}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Estudiante</div>
                        <div class="info-value">${estudiante.nombre}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Matrícula</div>
                        <div class="info-value">${estudiante.matricula}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Carrera</div>
                        <div class="info-value">${estudiante.carrera}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Tipo de Pago</div>
                        <div class="info-value">
                            <span class="payment-badge ${estudiante.tipoPago === 'efectivo' ? 'payment-efectivo' : 'payment-multa'}">
                                ${estudiante.tipoPago === 'efectivo' ? 'Efectivo' : 'Multa Cancelada'}
                            </span>
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Estado</div>
                        <div class="info-value">${estudiante.estado === 'sin_adeudo' ? 'Sin Adeudo' : `Adeudo: $${estudiante.adeudo.toFixed(2)}`}</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    resultsSection.style.display = 'block';
}

function clearSearchResults() {
    const resultsSection = document.getElementById('results-section');
    const searchInput = document.getElementById('search-input');
    const searchResult = document.getElementById('search-result');
    
    resultsSection.style.display = 'none';
    searchInput.value = '';
    searchResult.textContent = 'Ej. 0001, S22007409 o Juan Pérez';
}

// Estadísticas
function updateDashboardStats() {
    const totalDevoluciones = estudiantes.length;
    const sinAdeudo = estudiantes.filter(e => e.estado === 'sin_adeudo').length;
    const conAdeudo = estudiantes.filter(e => e.estado === 'con_adeudo').length;
    const ingresosTotales = estudiantes.reduce((sum, e) => sum + e.adeudo, 0);

    // Actualizar dashboard
    document.getElementById('total-devoluciones').textContent = totalDevoluciones;
    document.getElementById('sin-adeudo').textContent = sinAdeudo;
    document.getElementById('con-adeudo').textContent = conAdeudo;
    document.getElementById('ingresos').textContent = `$${ingresosTotales.toFixed(2)}`;

    // Actualizar tabla de estudiantes
    updateStudentsTable();
}

async function updateReportsStats() {
    try {
        const stats = await loadStatistics();
        if (stats) {
            // Actualizar reportes con datos del servidor
            document.getElementById('report-total').textContent = stats.general.totalDevoluciones;
            document.getElementById('report-adeudos').textContent = stats.general.conAdeudo;
            document.getElementById('report-tiempo').textContent = stats.general.sinAdeudo;
            document.getElementById('report-ingresos').textContent = `$${stats.general.totalAdeudos.toFixed(2)}`;
        } else {
            // Fallback to local data
            const totalDevoluciones = estudiantes.length;
            const conAdeudo = estudiantes.filter(e => e.estado === 'con_adeudo').length;
            const sinAdeudo = estudiantes.filter(e => e.estado === 'sin_adeudo').length;
            const ingresosTotales = estudiantes.reduce((sum, e) => sum + e.adeudo, 0);

            document.getElementById('report-total').textContent = totalDevoluciones;
            document.getElementById('report-adeudos').textContent = conAdeudo;
            document.getElementById('report-tiempo').textContent = sinAdeudo;
            document.getElementById('report-ingresos').textContent = `$${ingresosTotales.toFixed(2)}`;
        }
    } catch (error) {
        console.error('Error updating reports stats:', error);
    }
}

// Gráficos
async function initializeCharts() {
    try {
        await createEstadoChart();
        await createIngresosChart();
    } catch (error) {
        console.error('Error initializing charts:', error);
    }
}

async function createEstadoChart() {
    const ctx = document.getElementById('estadoChart');
    if (!ctx) return;

    if (estadoChart) {
        estadoChart.destroy();
    }

    const sinAdeudo = estudiantes.filter(e => e.estado === 'sin_adeudo').length;
    const conAdeudo = estudiantes.filter(e => e.estado === 'con_adeudo').length;

    estadoChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Sin Adeudo', 'Con Adeudo'],
            datasets: [{
                data: [sinAdeudo, conAdeudo],
                backgroundColor: ['#10b981', '#ef4444'],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

async function createIngresosChart() {
    const ctx = document.getElementById('ingresosChart');
    if (!ctx) return;

    if (ingresosChart) {
        ingresosChart.destroy();
    }

    try {
        const stats = await loadStatistics();
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                       'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        
        let adeudosPorMes = new Array(12).fill(0);
        
        if (stats && stats.monthly) {
            adeudosPorMes = stats.monthly;
        } else if (estudiantes.length === 0) {
            // Datos de ejemplo si no hay datos reales
            const datosEjemplo = [120, 85, 150, 95, 200, 175, 90, 160, 110, 140, 185, 130];
            adeudosPorMes = datosEjemplo;
        } else {
            // Calcular desde datos locales
            estudiantes.forEach(estudiante => {
                if (estudiante.adeudo > 0 && estudiante.fechaRegistro) {
                    const fecha = new Date(estudiante.fechaRegistro);
                    const mes = fecha.getMonth(); // 0-11
                    adeudosPorMes[mes] += estudiante.adeudo;
                }
            });
        }

        ingresosChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: meses,
                datasets: [{
                    label: 'Adeudos ($)',
                    data: adeudosPorMes,
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#ef4444',
                    pointBorderColor: '#dc2626',
                    pointHoverBackgroundColor: '#dc2626',
                    pointHoverBorderColor: '#b91c1c'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            title: function(context) {
                                return context[0].label;
                            },
                            label: function(context) {
                                return `Adeudos: $${context.parsed.y.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: '#f1f5f9'
                        },
                        ticks: {
                            maxRotation: 45,
                            color: '#64748b'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#f1f5f9'
                        },
                        ticks: {
                            color: '#64748b',
                            callback: function(value) {
                                return '$' + value;
                            }
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error creating income chart:', error);
    }
}

// Error handling
function showErrorMessage(message) {
    console.error(message);
    
    // Create error element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
    `;

    // Insert in the active page
    const activePage = document.querySelector('.page.active');
    if (activePage) {
        const pageHeader = activePage.querySelector('.page-header');
        if (pageHeader) {
            pageHeader.appendChild(errorDiv);

            // Remove after 8 seconds
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.parentNode.removeChild(errorDiv);
                }
            }, 8000);
        }
    }
}

// Mostrar mensajes de éxito
function showSuccessMessage(message, type = 'success') {
    // Crear elemento de mensaje
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;

    // Insertar en la página actual
    const activePage = document.querySelector('.page.active');
    if (activePage) {
        const pageHeader = activePage.querySelector('.page-header');
        if (pageHeader) {
            pageHeader.appendChild(messageDiv);

            // Remover después de 5 segundos
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 5000);
        }
    }
}

// Actualizar tabla de estudiantes
function updateStudentsTable() {
    const studentsTable = document.getElementById('students-table');
    if (!studentsTable) return;

    if (estudiantes.length === 0) {
        studentsTable.innerHTML = `
            <div class="table-row">
                <div class="table-cell" style="grid-column: 1 / -1; text-align: center; color: #6b7280;">
                    No hay registros de devoluciones
                </div>
            </div>
        `;
        return;
    }
    
    // FIXED: Sort by folio number descending (highest folio first - newest on top)
    const sortedStudents = [...estudiantes].sort((a, b) => {
        const folioA = parseInt(a.folio.replace('No.', ''));
        const folioB = parseInt(b.folio.replace('No.', ''));
        return folioB - folioA; // Descending order (newest first)
    });
    
    studentsTable.innerHTML = sortedStudents.map((estudiante) => {
        // Find the original index in the unsorted array
        const originalIndex = estudiantes.findIndex(e => e.id === estudiante.id);
        
        return `
        <div class="table-row">
            <div class="table-cell">
                <strong>${estudiante.folio}</strong>
            </div>
            <div class="table-cell">
                <div>
                    <div class="student-name">${estudiante.nombre}</div>
                    <small class="student-matricula">${estudiante.matricula}</small>
                </div>
            </div>
            <div class="table-cell">
                ${estudiante.carrera}
            </div>
            <div class="table-cell">
                <span class="payment-badge ${estudiante.tipoPago === 'efectivo' ? 'payment-efectivo' : 'payment-multa'}">
                    ${estudiante.tipoPago === 'efectivo' ? 'Efectivo' : 'Multa Cancelada'}
                </span>
            </div>
            <div class="table-cell">
                <span class="status-badge ${estudiante.estado === 'sin_adeudo' ? 'status-sin-adeudo' : 'status-con-adeudo'}">
                    ${estudiante.estado === 'sin_adeudo' ? 'Sin Adeudo' : `$${estudiante.adeudo.toFixed(2)}`}
                </span>
            </div>
            <div class="table-cell">
                <div class="action-buttons">
                    <button class="btn-edit" onclick="editStudent(${originalIndex})" title="Editar registro">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-pdf" onclick="previewPDF(${originalIndex})" title="Previsualizar comprobante PDF">
                        <i class="fas fa-file-pdf"></i>
                    </button>
                    <button class="btn-delete" onclick="deleteStudent(${originalIndex})" title="Eliminar registro">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    }).join('');
}



// Función para generar PDF del comprobante
function generatePDF(estudianteIndex) {
    const estudiante = estudiantes[estudianteIndex];
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Generar contenido del PDF
    generatePDFContent(doc, estudiante);
    
    // Guardar PDF
    const fileName = `Comprobante_${estudiante.folio}_${estudiante.nombre.replace(/\s+/g, '_')}.pdf`;
    doc.save(fileName);
    
    // Mostrar mensaje de confirmación
    showSuccessMessage(
        `Comprobante PDF generado exitosamente para ${estudiante.nombre} (${estudiante.folio})`,
        'success'
    );
}

// Funciones de utilidad
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

function generateFolio(number) {
    return `No.${String(number).padStart(4, '0')}`;
}

// Auto-completar datos de estudiantes conocidos
document.addEventListener('DOMContentLoaded', function() {
    const matriculaInput = document.getElementById('matricula');
    
    if (matriculaInput) {
        matriculaInput.addEventListener('blur', function() {
            const matricula = this.value.trim();
            const estudiante = estudiantes.find(e => e.matricula === matricula);
            
            if (estudiante) {
                document.getElementById('nombre').value = estudiante.nombre;
                document.getElementById('carrera').value = estudiante.carrera;
                updateResumen();
            }
        });
    }

    
});

// Exportar funciones para uso global
window.bibliotecaSystem = {
    navigateToPage,
    realizarBusqueda,
    registrarDevolucion,
    updateDashboardStats,
    generatePDF,
    estudiantes,
    loadStudents
};

// ===============================================
// FUNCIONES PARA EDITAR, ELIMINAR Y PREVISUALIZAR PDF
// ===============================================

// Inicializar manejadores de modales
function initializeModalHandlers() {
    // Cerrar modales al hacer clic en X o fuera del modal
    const modales = document.querySelectorAll('.modal');
    modales.forEach(modal => {
        const closeBtn = modal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Botones del modal de edición
    document.getElementById('cancelEdit').addEventListener('click', () => {
        document.getElementById('editModal').style.display = 'none';
    });

    document.getElementById('saveEdit').addEventListener('click', saveEditedStudent);

    // Botones del modal de eliminación
    document.getElementById('cancelDelete').addEventListener('click', () => {
        document.getElementById('deleteModal').style.display = 'none';
    });

    document.getElementById('confirmDelete').addEventListener('click', confirmDeleteStudent);

    // Botón de descarga en modal PDF
    document.getElementById('downloadPdf').addEventListener('click', downloadCurrentPDF);
}

// Función para editar estudiante
function editStudent(index) {
    currentEditIndex = index;
    const estudiante = estudiantes[index];
    
    // Llenar el formulario con los datos actuales
    document.getElementById('edit-folio').value = estudiante.folio.replace('No.', '');
    document.getElementById('edit-matricula').value = estudiante.matricula;
    document.getElementById('edit-nombre').value = estudiante.nombre;
    document.getElementById('edit-carrera').value = estudiante.carrera;
    document.getElementById('edit-monto-adeudo').value = estudiante.adeudo.toFixed(2);
    
    // Mostrar el modal
    document.getElementById('editModal').style.display = 'block';
}

// Función para guardar estudiante editado
async function saveEditedStudent() {
    if (currentEditIndex === -1) return;
    
    // Obtener los nuevos valores
    const folioInput = document.getElementById('edit-folio').value.trim();
    const matricula = document.getElementById('edit-matricula').value.trim();
    const nombre = document.getElementById('edit-nombre').value.trim();
    const carrera = document.getElementById('edit-carrera').value;
    const montoAdeudo = parseFloat(document.getElementById('edit-monto-adeudo').value) || 0;
    
    // Validar campos requeridos
    if (!folioInput || !matricula || !nombre || !carrera) {
        alert('Por favor, complete todos los campos');
        return;
    }
    
    // Validar monto
    if (montoAdeudo < 0) {
        alert('El monto del adeudo no puede ser negativo');
        return;
    }

    try {
        showLoading('Actualizando estudiante...');
        
        const studentData = {
            id: estudiantes[currentEditIndex].id,
            folio: `No.${formatFolio(folioInput)}`,
            matricula: matricula,
            nombre: nombre,
            carrera: carrera,
            adeudo: montoAdeudo
        };

        const response = await apiRequest('students', 'PUT', studentData);
        
        if (response.success) {
            // Update local array
            estudiantes[currentEditIndex] = {
                ...estudiantes[currentEditIndex],
                ...studentData,
                estado: montoAdeudo > 0 ? 'con_adeudo' : 'sin_adeudo'
            };
            
            // Actualizar estadísticas y cerrar modal
            updateDashboardStats();
            updateReportsStats();
            updateCurrentFolio();
            document.getElementById('editModal').style.display = 'none';
            
            // Mostrar mensaje de éxito
            showSuccessMessage(response.message, 'success');
        }
        
        hideLoading();
    } catch (error) {
        hideLoading();
        showErrorMessage('Error al actualizar estudiante: ' + error.message);
    }
}

// Función para eliminar estudiante
function deleteStudent(index) {
    currentDeleteIndex = index;
    const estudiante = estudiantes[index];
    
    // Mostrar información del estudiante a eliminar
    document.getElementById('deleteStudentInfo').innerHTML = `
        <strong>Folio:</strong> ${estudiante.folio}<br>
        <strong>Estudiante:</strong> ${estudiante.nombre}<br>
        <strong>Matrícula:</strong> ${estudiante.matricula}<br><br>
        Esta acción no se puede deshacer.
    `;
    
    // Mostrar modal de confirmación
    document.getElementById('deleteModal').style.display = 'block';
}

// Función para confirmar eliminación
async function confirmDeleteStudent() {
    if (currentDeleteIndex === -1) return;
    
    const estudianteEliminado = estudiantes[currentDeleteIndex];
    
    try {
        showLoading('Eliminando estudiante...');
        
        const response = await apiRequest('students', 'DELETE', { 
            id: estudianteEliminado.id 
        });
        
        if (response.success) {
            // Remove from local array
            estudiantes.splice(currentDeleteIndex, 1);
            
            // Actualizar estadísticas
            updateDashboardStats();
            updateReportsStats();
            
            // Cerrar modal
            document.getElementById('deleteModal').style.display = 'none';
            
            // Mostrar mensaje de confirmación
            showSuccessMessage(response.message, 'success');
        }
        
        hideLoading();
    } catch (error) {
        hideLoading();
        showErrorMessage('Error al eliminar estudiante: ' + error.message);
    }
    
    currentDeleteIndex = -1;
}

// Variable para guardar los datos del PDF actual
let currentPdfData = null;

// Función para previsualizar PDF
function previewPDF(index) {
    const estudiante = estudiantes[index];
    currentPdfData = { estudiante, index };
    
    // Generar el PDF en un blob para previsualización
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Generar contenido del PDF (mismo código que generatePDF pero sin descargar)
    generatePDFContent(doc, estudiante);
    
    // Convertir a blob y mostrar en iframe
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    // Cargar en el iframe
    document.getElementById('pdfViewer').src = pdfUrl;
    
    // Mostrar modal
    document.getElementById('pdfModal').style.display = 'block';
}

// Función para descargar el PDF actual
function downloadCurrentPDF() {
    if (!currentPdfData) return;
    
    const { estudiante } = currentPdfData;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Generar contenido del PDF
    generatePDFContent(doc, estudiante);
    
    // Descargar
    const fileName = `Comprobante_${estudiante.folio}_${estudiante.nombre.replace(/\s+/g, '_')}.pdf`;
    doc.save(fileName);
    
    // Mostrar mensaje de confirmación
    showSuccessMessage(
        `Comprobante PDF descargado: ${estudiante.nombre} (${estudiante.folio})`,
        'success'
    );
}

// Función para generar contenido del PDF (reutilizable)
function generatePDFContent(doc, estudiante) {

     // LOGO UNIVERSIDAD VERACRUZANA
    const logo = new Image();
    logo.src = "img/logo_uv.png";

    doc.addImage(logo, "PNG", 20, 10, 40, 40);

    // Configuración de fuentes y colores
    doc.setFont("helvetica");


    // hoja membretada 
    const watermark = "/assets/img/logo_uv.png";

    // Configurar transparencia
    doc.setGState(new doc.GState({ opacity: 0.08 }));

    // Agregar logo en el centro de la hoja
    doc.addImage(watermark, "PNG", 35, 80, 140, 140);

    // Restaurar opacidad normal
    doc.setGState(new doc.GState({ opacity: 1 }));
    



    // Header
    doc.setFontSize(20);
    doc.setTextColor(44, 62, 80);
    doc.text('BIBLIOTECA UNIVERSITARIA', 105, 30, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text('COMPROBANTE DE PAGO', 105, 45, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(52, 73, 94);
    doc.text(`Folio ${estudiante.folio}`, 105, 60, { align: 'center' });
    
    // Línea separadora
    doc.setDrawColor(149, 165, 166);
    doc.line(20, 70, 190, 70);
    
    // Datos del estudiante
    let yPosition = 90;
    const lineHeight = 18;  // INCREASED from 15 to 18 for more spacing
    
    doc.setFontSize(12);
    doc.setTextColor(44, 62, 80);
    
    // Función helper para añadir campo
    const addField = (label, value, y) => {
        doc.setFont("helvetica", "bold");
        doc.text(`${label}:`, 25, y);
        doc.setFont("helvetica", "normal");
        doc.text(value, 25, y + 8);
        return y + lineHeight;
    };
    
    yPosition = addField('Matrícula', estudiante.matricula, yPosition);
    yPosition = addField('Estudiante', estudiante.nombre, yPosition);
    yPosition = addField('Carrera', estudiante.carrera, yPosition);
    
    // Hora de registro
    const horaRegistro = estudiante.horaRegistro || new Date().toLocaleTimeString('es-ES', { 
        timeZone: 'America/Mexico_City',
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit'
    });

    yPosition = addField('Hora de registro', horaRegistro, yPosition);
    
    // FIXED: Add extra spacing before adeudo section
    yPosition += 15;  // Extra spacing
    
    // Adeudo (destacado)
    if (estudiante.adeudo > 0) {
        doc.setFontSize(14);
        doc.setTextColor(231, 76, 60);
        doc.setFont("helvetica", "bold");
        doc.text('MONTO DE LA CUOTA:', 25, yPosition);
        doc.text(`$${estudiante.adeudo.toFixed(2)} pesos`, 25, yPosition + 10);
    } else {
        doc.setFontSize(14);
        doc.setTextColor(39, 174, 96);
        doc.setFont("helvetica", "bold");
        doc.text('PAGO SIN ADEUDO', 25, yPosition);
        doc.text('$0.00 pesos', 25, yPosition + 10);
    }
    
    // FIXED: Add proper spacing before tipo de pago
    yPosition += 25;  // Increased spacing from 10 to 25
    
    // Tipo de pago
    doc.setFontSize(12);
    doc.setTextColor(44, 62, 80);
    doc.setFont("helvetica", "bold");
    doc.text('Tipo de Pago:', 25, yPosition);
    doc.setFont("helvetica", "normal");
    const tipoPagoText = estudiante.tipoPago === 'efectivo' ? 'Efectivo' : 'Multa Cancelada';
    doc.text(tipoPagoText, 25, yPosition + 8);
    
    // FIXED: Add spacing before información del recibo
    yPosition += 25;  // Increased spacing
    
    // Información del recibo
    doc.setFontSize(12);
    doc.setTextColor(44, 62, 80);
    doc.setFont("helvetica", "normal");
    
    yPosition = addField('Número de recibo', estudiante.folio.replace('No.', ''), yPosition);
    
    const fechaEmision = new Intl.DateTimeFormat('es-ES', {
        timeZone: 'America/Mexico_City',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(new Date());

    yPosition = addField('Fecha de emisión', fechaEmision, yPosition);
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(127, 140, 141);
    doc.text('Sistema de Control de Biblioteca', 105, 280, { align: 'center' });
    
    // Línea decorativa en el footer
    doc.setDrawColor(149, 165, 166);
    doc.line(20, 270, 190, 270);
}


// Función helper para formatear fechas en el PDF
function formatDateForPDF(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
    });
}

// ===============================================
// PDF REPORTS FUNCTIONALITY
// ===============================================

// Initialize reports handlers
function initializeReportsHandlers() {
    const monthlyReportBtn = document.getElementById('generate-monthly-report');
    const careerReportBtn = document.getElementById('generate-career-report');
    
    if (monthlyReportBtn) {
        monthlyReportBtn.addEventListener('click', generateMonthlyReport);
    }
    
    if (careerReportBtn) {
        careerReportBtn.addEventListener('click', generateCareerReport);
    }
}

// Load carreras for the dropdown
async function loadCarrerasForReports() {
    try {
        const response = await apiRequest('carreras');
        const carreraSelect = document.getElementById('carrera-select');
        
        if (carreraSelect && response.success) {
            // Clear existing options except the first one
            carreraSelect.innerHTML = '<option value="">Seleccionar carrera...</option>';
            
            // Add carreras to the select
            response.data.forEach(carrera => {
                if (carrera.activa) {
                    const option = document.createElement('option');
                    option.value = carrera.nombre;
                    option.textContent = carrera.nombre;
                    carreraSelect.appendChild(option);
                }
            });
        }
    } catch (error) {
        console.error('Error loading carreras for reports:', error);
    }
}

// Generate monthly report
async function generateMonthlyReport() {
    const month = document.getElementById('month-select').value;
    const year = document.getElementById('year-select').value;
    
    if (!month || !year) {
        alert('Por favor, seleccione mes y año');
        return;
    }
    
    try {
        showLoading('Generando reporte mensual...');
        
        const response = await apiRequest(`reports?type=monthly&month=${month}&year=${year}`);
        
        if (response.success) {
            generateMonthlyPDF(response.data);
            showSuccessMessage(`Reporte mensual generado para ${response.data.period.displayName}`);
        }
        
        hideLoading();
    } catch (error) {
        hideLoading();
        showErrorMessage('Error al generar reporte mensual: ' + error.message);
    }
}

// Generate career report
async function generateCareerReport() {
    const carrera = document.getElementById('carrera-select').value;
    
    if (!carrera) {
        alert('Por favor, seleccione una carrera');
        return;
    }
    
    try {
        showLoading('Generando reporte por carrera...');
        
        const response = await apiRequest(`reports?type=career&carrera=${encodeURIComponent(carrera)}`);
        
        if (response.success) {
            generateCareerPDF(response.data);
            showSuccessMessage(`Reporte generado para la carrera: ${carrera}`);
        }
        
        hideLoading();
    } catch (error) {
        hideLoading();
        showErrorMessage('Error al generar reporte por carrera: ' + error.message);
    }
}

// Generate monthly PDF
function generateMonthlyPDF(data) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // LOGO UNIVERSIDAD VERACRUZANA
    const logo = new Image();
    logo.src = "img/logo_uv.png";

    doc.addImage(logo, "PNG", 20, 10, 30, 30);
    
    // Header
    doc.setFontSize(18);
    doc.setTextColor(44, 62, 80);
    doc.text('BIBLIOTECA UNIVERSITARIA', 105, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text('REPORTE MENSUAL DE PAGOS', 105, 35, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(52, 73, 94);
    doc.text(`Período: ${data.period.displayName}`, 105, 50, { align: 'center' });
    
    // Línea separadora
    doc.setDrawColor(149, 165, 166);
    doc.line(20, 60, 190, 60);
    
    // Summary statistics
    let yPos = 80;
    doc.setFontSize(12);
    doc.setTextColor(44, 62, 80);
    
    const addSummaryField = (label, value, y) => {
        doc.setFont("helvetica", "bold");
        doc.text(`${label}:`, 25, y);
        doc.setFont("helvetica", "normal");
        doc.text(value, 120, y);
        return y + 10;
    };
    
    yPos = addSummaryField('Total de Estudiantes', data.summary.totalStudents.toString(), yPos);
    yPos = addSummaryField('Estudiantes con Adeudo', data.summary.studentsWithDebt.toString(), yPos);
    yPos = addSummaryField('Estudiantes sin Adeudo', data.summary.studentsWithoutDebt.toString(), yPos);
    yPos = addSummaryField('Total de Adeudos', `$${data.summary.totalDebt.toFixed(2)}`, yPos);
    yPos = addSummaryField('Promedio de Adeudo', `$${data.summary.averageDebt.toFixed(2)}`, yPos);
    
    yPos += 10;
    
    // Students table header
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.setFillColor(59, 130, 246);
    doc.rect(20, yPos, 170, 10, 'F');
    
    doc.text('Folio', 25, yPos + 7);
    doc.text('Nombre', 50, yPos + 7);
    doc.text('Carrera', 100, yPos + 7);
    doc.text('Adeudo', 150, yPos + 7);
    
    yPos += 15;
    
    // Students data
    doc.setFont("helvetica", "normal");
    doc.setTextColor(44, 62, 80);
    
    data.students.forEach((student, index) => {
        if (yPos > 270) {
            doc.addPage();
            yPos = 20;
        }
        
        const rowColor = index % 2 === 0 ? [248, 250, 252] : [255, 255, 255];
        doc.setFillColor(...rowColor);
        doc.rect(20, yPos - 5, 170, 10, 'F');
        
        doc.text(student.folio, 25, yPos + 2);
        doc.text(student.nombre.substring(0, 20), 50, yPos + 2);
        doc.text(student.carrera.substring(0, 25), 100, yPos + 2);
        doc.text(`$${student.adeudo.toFixed(2)}`, 150, yPos + 2);
        
        yPos += 10;
    });
    
    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(127, 140, 141);
        doc.text(`Página ${i} de ${pageCount}`, 105, 290, { align: 'center' });
        doc.text(`Generado el ${formatDateForPDF(new Date().toISOString())}`, 190, 290, { align: 'right' });
    }
    
    // Save PDF
    const fileName = `Reporte_Mensual_${data.period.monthName}_${data.period.year}.pdf`;
    doc.save(fileName);
}

// Generate career PDF
function generateCareerPDF(data) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // LOGO UNIVERSIDAD VERACRUZANA
    doc.addImage(logo, "PNG", 20, 10, 30, 30);
    
    // Header
    doc.setFontSize(18);
    doc.setTextColor(44, 62, 80);
    doc.text('BIBLIOTECA UNIVERSITARIA', 105, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text('REPORTE POR CARRERA', 105, 35, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(52, 73, 94);
    doc.text(`Carrera: ${data.carrera}`, 105, 50, { align: 'center' });
    
    // Línea separadora
    doc.setDrawColor(149, 165, 166);
    doc.line(20, 60, 190, 60);
    
    // Summary statistics
    let yPos = 80;
    doc.setFontSize(12);
    doc.setTextColor(44, 62, 80);
    
    const addSummaryField = (label, value, y) => {
        doc.setFont("helvetica", "bold");
        doc.text(`${label}:`, 25, y);
        doc.setFont("helvetica", "normal");
        doc.text(value, 120, y);
        return y + 10;
    };
    
    yPos = addSummaryField('Total de Estudiantes', data.summary.totalStudents.toString(), yPos);
    yPos = addSummaryField('Estudiantes con Adeudo', data.summary.studentsWithDebt.toString(), yPos);
    yPos = addSummaryField('Estudiantes sin Adeudo', data.summary.studentsWithoutDebt.toString(), yPos);
    yPos = addSummaryField('Total de Adeudos', `$${data.summary.totalDebt.toFixed(2)}`, yPos);
    yPos = addSummaryField('Promedio de Adeudo', `$${data.summary.averageDebt.toFixed(2)}`, yPos);
    
    yPos += 10;
    
    // Students table header
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text('Lista de Estudiantes:', 25, yPos);
    yPos += 15;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.setFillColor(59, 130, 246);
    doc.rect(20, yPos, 170, 10, 'F');
    
    doc.text('Folio', 25, yPos + 7);
    doc.text('Nombre', 50, yPos + 7);
    doc.text('Matrícula', 100, yPos + 7);
    doc.text('Adeudo', 150, yPos + 7);
    
    yPos += 15;
    
    // Students data
    doc.setFont("helvetica", "normal");
    doc.setTextColor(44, 62, 80);
    
    data.students.forEach((student, index) => {
        if (yPos > 270) {
            doc.addPage();
            yPos = 20;
        }
        
        const rowColor = index % 2 === 0 ? [248, 250, 252] : [255, 255, 255];
        doc.setFillColor(...rowColor);
        doc.rect(20, yPos - 5, 170, 10, 'F');
        
        doc.text(student.folio, 25, yPos + 2);
        doc.text(student.nombre.substring(0, 20), 50, yPos + 2);
        doc.text(student.matricula, 100, yPos + 2);
        doc.text(`$${student.adeudo.toFixed(2)}`, 150, yPos + 2);
        
        yPos += 10;
    });
    
    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(127, 140, 141);
        doc.text(`Página ${i} de ${pageCount}`, 105, 290, { align: 'center' });
        doc.text(`Generado el ${formatDateForPDF(new Date().toISOString())}`, 190, 290, { align: 'right' });
    }
    
    // Save PDF
    const fileName = `Reporte_Carrera_${data.carrera.replace(/\s+/g, '_')}.pdf`;
    doc.save(fileName);
}

// ===============================================
// CSV EXPORT FUNCTIONALITY
// ===============================================

// Initialize CSV handlers
function initializeCSVHandlers() {
    const monthlyCsvBtn = document.getElementById('generate-monthly-csv');
    const careerCsvBtn = document.getElementById('generate-career-csv');
    
    if (monthlyCsvBtn) {
        monthlyCsvBtn.addEventListener('click', generateMonthlyCSV);
    }
    
    if (careerCsvBtn) {
        careerCsvBtn.addEventListener('click', generateCareerCSV);
    }
}

// Generate Monthly CSV
async function generateMonthlyCSV() {
    const month = document.getElementById('month-select').value;
    const year = document.getElementById('year-select').value;
    
    if (!month || !year) {
        alert('Por favor, seleccione mes y año');
        return;
    }
    
    try {
        showLoading('Generando CSV mensual...');
        
        const response = await apiRequest(`reports?type=monthly&month=${month}&year=${year}`);
        
        if (response.success) {
            downloadCSV(response.data.students, `Reporte_Mensual_${response.data.period.displayName}`, 'monthly');
            showSuccessMessage(`CSV mensual generado para ${response.data.period.displayName}`);
        }
        
        hideLoading();
    } catch (error) {
        hideLoading();
        showErrorMessage('Error al generar CSV mensual: ' + error.message);
    }
}

// Generate Career CSV
async function generateCareerCSV() {
    const carrera = document.getElementById('carrera-select').value;
    
    if (!carrera) {
        alert('Por favor, seleccione una carrera');
        return;
    }
    
    try {
        showLoading('Generando CSV por carrera...');
        
        const response = await apiRequest(`reports?type=career&carrera=${encodeURIComponent(carrera)}`);
        
        if (response.success) {
            downloadCSV(response.data.students, `Reporte_Carrera_${carrera}`, 'career');
            showSuccessMessage(`CSV generado para la carrera: ${carrera}`);
        }
        
        hideLoading();
    } catch (error) {
        hideLoading();
        showErrorMessage('Error al generar CSV por carrera: ' + error.message);
    }
}

// Download CSV helper function
function downloadCSV(students, filename, type) {
    // CSV Headers
    const headers = ['Folio', 'Matrícula', 'Nombre', 'Carrera', 'Cuota', 'Tipo de Pago', 'Estado', 'Fecha', 'Hora'];

    // Build CSV content
    let csvContent = headers.join(',') + '\n';
    
    students.forEach(student => {
        const row = [
            student.folio,
            student.matricula,
            `"${student.nombre}"`, // Quotes for names with commas
            `"${student.carrera}"`, // Quotes for career names
            student.adeudo.toFixed(2),
            student.tipoPago === 'efectivo' ? 'Efectivo' : 'Multa Cancelada',
            student.estado === 'sin_adeudo' ? 'Sin Adeudo' : 'Con Adeudo',
            student.fecha_registro,
            student.hora_registro || ''
        ];
        csvContent += row.join(',') + '\n';
    });
    
    // Add summary at the end
    const totalStudents = students.length;
    const totalAmount = students.reduce((sum, s) => sum + s.adeudo, 0);
    const withDebt = students.filter(s => s.estado === 'con_adeudo').length;
    const withoutDebt = students.filter(s => s.estado === 'sin_adeudo').length;
    
    csvContent += '\n';
    csvContent += `RESUMEN\n`;
    csvContent += `Total de Estudiantes,${totalStudents}\n`;
    csvContent += `Con Adeudo,${withDebt}\n`;
    csvContent += `Sin Adeudo,${withoutDebt}\n`;
    csvContent += `Total Recaudado,$${totalAmount.toFixed(2)}\n`;
    csvContent += `Promedio por Estudiante,$${(totalAmount / totalStudents).toFixed(2)}\n`;
    
    // Create download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename.replace(/\s+/g, '_')}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
