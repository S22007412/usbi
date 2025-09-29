-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 29, 2025 at 07:41 AM
-- Server version: 8.0.43-0ubuntu0.24.04.2
-- PHP Version: 8.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `usbi`
--

-- --------------------------------------------------------

--
-- Table structure for table `carreras`
--

CREATE TABLE `carreras` (
  `id` int NOT NULL,
  `codigo` varchar(10) DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `facultad` varchar(100) DEFAULT NULL,
  `activa` tinyint(1) DEFAULT '1',
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `carreras`
--

INSERT INTO `carreras` (`id`, `codigo`, `nombre`, `facultad`, `activa`, `fecha_creacion`) VALUES
(1, 'ASS', 'Administración de Sistemas de Salud', 'Ciencias de la Salud', 1, '2025-09-29 07:32:15'),
(2, 'CONT', 'Contaduría', 'Ciencias Económicas', 1, '2025-09-29 07:32:15'),
(3, 'DE', 'Dirección Empresarial', 'Ciencias Económicas', 1, '2025-09-29 07:32:15'),
(4, 'DERH', 'Dirección Estratégica de Recursos Humanos', 'Ciencias Económicas', 1, '2025-09-29 07:32:15'),
(5, 'GDN', 'Gestión y Dirección de Negocios', 'Ciencias Económicas', 1, '2025-09-29 07:32:15'),
(6, 'ITC', 'Ingeniería en Tecnologías Computacionales', 'Ingeniería', 1, '2025-09-29 07:32:15'),
(7, 'IC', 'Ingeniería Civil', 'Ingeniería', 1, '2025-09-29 07:32:15'),
(8, 'IE', 'Ingeniería Eléctrica', 'Ingeniería', 1, '2025-09-29 07:32:15'),
(9, 'IEC', 'Ingeniería en Electrónica y Comunicaciones', 'Ingeniería', 1, '2025-09-29 07:32:15'),
(10, 'II', 'Ingeniería Industrial', 'Ingeniería', 1, '2025-09-29 07:32:15'),
(11, 'IM', 'Ingeniería Mecánica', 'Ingeniería', 1, '2025-09-29 07:32:15'),
(12, 'IME', 'Ingeniería Mecánica Eléctrica', 'Ingeniería', 1, '2025-09-29 07:32:15'),
(13, 'IP', 'Ingeniería Petrolera', 'Ingeniería', 1, '2025-09-29 07:32:15'),
(14, 'IQ', 'Ingeniería Química', 'Ingeniería', 1, '2025-09-29 07:32:15'),
(15, 'IA', 'Ingeniería Ambiental', 'Ingeniería', 1, '2025-09-29 07:32:15'),
(16, 'IAGR', 'Ingeniero Agrónomo', 'Ciencias Agropecuarias', 1, '2025-09-29 07:32:15'),
(17, 'CI', 'Ciencias de la Ingeniería', 'Ingeniería', 1, '2025-09-29 07:32:15'),
(18, 'MED', 'Médico Cirujano', 'Ciencias de la Salud', 1, '2025-09-29 07:32:15'),
(19, 'ENF', 'Enfermería', 'Ciencias de la Salud', 1, '2025-09-29 07:32:15'),
(20, 'ANES', 'Anestesiología', 'Ciencias de la Salud', 1, '2025-09-29 07:32:15'),
(21, 'CG', 'Cirugía General', 'Ciencias de la Salud', 1, '2025-09-29 07:32:15'),
(22, 'CD', 'Cirujano Dentista', 'Ciencias de la Salud', 1, '2025-09-29 07:32:15'),
(23, 'EPID', 'Epidemiología', 'Ciencias de la Salud', 1, '2025-09-29 07:32:15'),
(24, 'GO', 'Ginecología y Obstetricia', 'Ciencias de la Salud', 1, '2025-09-29 07:32:15'),
(25, 'MU', 'Medicina de Urgencias', 'Ciencias de la Salud', 1, '2025-09-29 07:32:15'),
(26, 'MEEC', 'Medicina del Enfermo en Estado Crítico', 'Ciencias de la Salud', 1, '2025-09-29 07:32:15'),
(27, 'MF', 'Medicina Familiar', 'Ciencias de la Salud', 1, '2025-09-29 07:32:15'),
(28, 'MI', 'Medicina Interna', 'Ciencias de la Salud', 1, '2025-09-29 07:32:15'),
(29, 'ORT', 'Ortopedia', 'Ciencias de la Salud', 1, '2025-09-29 07:32:15'),
(30, 'PED', 'Pediatría', 'Ciencias de la Salud', 1, '2025-09-29 07:32:15'),
(31, 'PSI', 'Psicología', 'Ciencias de la Salud', 1, '2025-09-29 07:32:15'),
(32, 'MVZ', 'Médico Veterinario Zootecnista', 'Ciencias Veterinarias', 1, '2025-09-29 07:32:15'),
(33, 'DER', 'Derecho', 'Ciencias Jurídicas', 1, '2025-09-29 07:32:15'),
(34, 'DERP', 'Derecho con Enfoque de Pluralismo Jurídico', 'Ciencias Jurídicas', 1, '2025-09-29 07:32:15'),
(35, 'PEDA', 'Pedagogía', 'Ciencias de la Educación', 1, '2025-09-29 07:32:15'),
(36, 'EA', 'Enseñanza de las Artes', 'Ciencias de la Educación', 1, '2025-09-29 07:32:15'),
(37, 'GA', 'Gestión del Aprendizaje', 'Ciencias de la Educación', 1, '2025-09-29 07:32:15'),
(38, 'TS', 'Trabajo Social', 'Ciencias Sociales', 1, '2025-09-29 07:32:15'),
(39, 'GI', 'Gestión Intercultural', 'Ciencias Sociales', 1, '2025-09-29 07:32:15'),
(40, 'GID', 'Gestión Intercultural para el Desarrollo', 'Ciencias Sociales', 1, '2025-09-29 07:32:15'),
(41, 'ARQ', 'Arquitectura', 'Arquitectura', 1, '2025-09-29 07:32:15'),
(42, 'BIO', 'Biología', 'Ciencias Naturales', 1, '2025-09-29 07:32:15'),
(43, 'BM', 'Biología Marina', 'Ciencias Marinas', 1, '2025-09-29 07:32:15'),
(44, 'CA', 'Ciencias del Ambiente', 'Ciencias Naturales', 1, '2025-09-29 07:32:15'),
(45, 'CMC', 'Ciencias Marinas y Costeras', 'Ciencias Marinas', 1, '2025-09-29 07:32:15'),
(46, 'MEMC', 'Manejo de Ecosistemas Marinos y Costeros', 'Ciencias Marinas', 1, '2025-09-29 07:32:15'),
(47, 'ASA', 'Agroecología y Soberanía Alimentaria', 'Ciencias Agropecuarias', 1, '2025-09-29 07:32:15'),
(48, 'AI', 'Agronegocios Internacionales', 'Ciencias Agropecuarias', 1, '2025-09-29 07:32:15'),
(49, 'CAG', 'Ciencias Agropecuarias', 'Ciencias Agropecuarias', 1, '2025-09-29 07:32:15'),
(50, 'GAS', 'Gestión Ambiental para la Sustentabilidad', 'Ciencias Ambientales', 1, '2025-09-29 07:32:15'),
(51, 'GIA', 'Gestión e Impacto Ambiental', 'Ciencias Ambientales', 1, '2025-09-29 07:32:15'),
(52, 'SCA', 'Sistemas Computacionales Administrativos', 'Ingeniería', 1, '2025-09-29 07:32:15');

-- --------------------------------------------------------

--
-- Table structure for table `configuracion`
--

CREATE TABLE `configuracion` (
  `clave` varchar(50) NOT NULL,
  `valor` text,
  `descripcion` text,
  `tipo` varchar(20) DEFAULT 'string',
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `configuracion`
--

INSERT INTO `configuracion` (`clave`, `valor`, `descripcion`, `tipo`, `fecha_creacion`, `fecha_actualizacion`) VALUES
('backup_automatico', 'true', 'Habilitar backup automático', 'TINYINT(1)', '2025-09-29 07:32:15', '2025-09-29 07:32:15'),
('digitos_folio', '4', 'Cantidad de dígitos para el número del folio', 'number', '2025-09-29 07:32:15', '2025-09-29 07:32:15'),
('formato_folio', 'No.{numero}', 'Formato para generar folios', 'string', '2025-09-29 07:32:15', '2025-09-29 07:32:15'),
('max_registros_por_pagina', '50', 'Registros máximos por página', 'number', '2025-09-29 07:32:15', '2025-09-29 07:32:15'),
('moneda_simbolo', '$', 'Símbolo de la moneda local', 'string', '2025-09-29 07:32:15', '2025-09-29 07:32:15'),
('nombre_biblioteca', 'Biblioteca Universitaria', 'Nombre de la institución', 'string', '2025-09-29 07:32:15', '2025-09-29 07:32:15'),
('ultimo_folio', '0', 'Último número de folio generado', 'number', '2025-09-29 07:32:15', '2025-09-29 07:32:15'),
('version_sistema', '1.0', 'Versión actual del sistema', 'string', '2025-09-29 07:32:15', '2025-09-29 07:32:15');

-- --------------------------------------------------------

--
-- Table structure for table `estudiantes`
--

CREATE TABLE `estudiantes` (
  `id` int NOT NULL,
  `folio` varchar(10) NOT NULL,
  `matricula` varchar(20) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `carrera` varchar(100) NOT NULL,
  `adeudo` decimal(10,2) DEFAULT '0.00',
  `estado` varchar(20) DEFAULT 'sin_adeudo',
  `fecha_registro` datetime DEFAULT CURRENT_TIMESTAMP,
  `hora_registro` time DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `activo` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Triggers `estudiantes`
--
DELIMITER $$
CREATE TRIGGER `trigger_estudiantes_delete` AFTER DELETE ON `estudiantes` FOR EACH ROW BEGIN
    INSERT INTO historial_cambios (
        estudiante_id,
        accion,
        datos_anteriores,
        fecha_cambio
    ) VALUES (
        OLD.id,
        'DELETE',
        JSON_OBJECT(
            'folio', OLD.folio,
            'matricula', OLD.matricula,
            'nombre', OLD.nombre,
            'carrera', OLD.carrera,
            'adeudo', OLD.adeudo,
            'estado', OLD.estado
        ),
        NOW()
    )$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trigger_estudiantes_insert` AFTER INSERT ON `estudiantes` FOR EACH ROW BEGIN
    INSERT INTO historial_cambios (
        estudiante_id, 
        accion, 
        datos_nuevos, 
        fecha_cambio
    ) VALUES (
        NEW.id,
        'INSERT',
        JSON_OBJECT(
            'folio', NEW.folio,
            'matricula', NEW.matricula,
            'nombre', NEW.nombre,
            'carrera', NEW.carrera,
            'adeudo', NEW.adeudo,
            'estado', NEW.estado
        ),
        NOW()
    )$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trigger_estudiantes_update` AFTER UPDATE ON `estudiantes` FOR EACH ROW BEGIN
    INSERT INTO historial_cambios (
        estudiante_id,
        accion,
        datos_anteriores,
        datos_nuevos,
        fecha_cambio
    ) VALUES (
        NEW.id,
        'UPDATE',
        JSON_OBJECT(
            'folio', OLD.folio,
            'matricula', OLD.matricula,
            'nombre', OLD.nombre,
            'carrera', OLD.carrera,
            'adeudo', OLD.adeudo,
            'estado', OLD.estado
        ),
        JSON_OBJECT(
            'folio', NEW.folio,
            'matricula', NEW.matricula,
            'nombre', NEW.nombre,
            'carrera', NEW.carrera,
            'adeudo', NEW.adeudo,
            'estado', NEW.estado
        ),
        NOW()
    )$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `historial_cambios`
--

CREATE TABLE `historial_cambios` (
  `id` int NOT NULL,
  `estudiante_id` int DEFAULT NULL,
  `accion` varchar(20) NOT NULL,
  `datos_anteriores` text,
  `datos_nuevos` text,
  `usuario` varchar(50) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `fecha_cambio` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Stand-in structure for view `vista_adeudos_por_mes`
-- (See below for the actual view)
--
CREATE TABLE `vista_adeudos_por_mes` (
`año` int
,`mes` varchar(2)
,`año_mes` varchar(7)
,`total_registros` bigint
,`con_adeudo` bigint
,`total_adeudo_mes` decimal(32,2)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `vista_carreras_adeudos`
-- (See below for the actual view)
--
CREATE TABLE `vista_carreras_adeudos` (
`carrera` varchar(100)
,`total_estudiantes` bigint
,`con_adeudo` bigint
,`total_adeudo_carrera` decimal(32,2)
,`promedio_adeudo_carrera` decimal(14,6)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `vista_estadisticas`
-- (See below for the actual view)
--
CREATE TABLE `vista_estadisticas` (
`total_devoluciones` bigint
,`sin_adeudo` bigint
,`con_adeudo` bigint
,`total_adeudos` decimal(32,2)
,`promedio_adeudo` decimal(14,6)
);

-- --------------------------------------------------------

--
-- Structure for view `vista_adeudos_por_mes`
--
DROP TABLE IF EXISTS `vista_adeudos_por_mes`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_adeudos_por_mes`  AS SELECT year(`estudiantes`.`fecha_registro`) AS `año`, lpad(month(`estudiantes`.`fecha_registro`),2,'0') AS `mes`, date_format(`estudiantes`.`fecha_registro`,'%Y-%m') AS `año_mes`, count(0) AS `total_registros`, count((case when (`estudiantes`.`estado` = 'con_adeudo') then 1 end)) AS `con_adeudo`, coalesce(sum(`estudiantes`.`adeudo`),0) AS `total_adeudo_mes` FROM `estudiantes` WHERE (`estudiantes`.`activo` = 1) GROUP BY date_format(`estudiantes`.`fecha_registro`,'%Y-%m') ORDER BY `año_mes` ASC ;

-- --------------------------------------------------------

--
-- Structure for view `vista_carreras_adeudos`
--
DROP TABLE IF EXISTS `vista_carreras_adeudos`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_carreras_adeudos`  AS SELECT `estudiantes`.`carrera` AS `carrera`, count(0) AS `total_estudiantes`, count((case when (`estudiantes`.`estado` = 'con_adeudo') then 1 end)) AS `con_adeudo`, coalesce(sum(`estudiantes`.`adeudo`),0) AS `total_adeudo_carrera`, coalesce(avg(`estudiantes`.`adeudo`),0) AS `promedio_adeudo_carrera` FROM `estudiantes` WHERE (`estudiantes`.`activo` = 1) GROUP BY `estudiantes`.`carrera` ORDER BY `total_adeudo_carrera` DESC ;

-- --------------------------------------------------------

--
-- Structure for view `vista_estadisticas`
--
DROP TABLE IF EXISTS `vista_estadisticas`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_estadisticas`  AS SELECT count(0) AS `total_devoluciones`, count((case when (`estudiantes`.`estado` = 'sin_adeudo') then 1 end)) AS `sin_adeudo`, count((case when (`estudiantes`.`estado` = 'con_adeudo') then 1 end)) AS `con_adeudo`, coalesce(sum(`estudiantes`.`adeudo`),0) AS `total_adeudos`, coalesce(avg(`estudiantes`.`adeudo`),0) AS `promedio_adeudo` FROM `estudiantes` WHERE (`estudiantes`.`activo` = 1) ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `carreras`
--
ALTER TABLE `carreras`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`),
  ADD UNIQUE KEY `codigo` (`codigo`),
  ADD KEY `idx_carreras_nombre` (`nombre`),
  ADD KEY `idx_carreras_codigo` (`codigo`),
  ADD KEY `idx_carreras_facultad` (`facultad`);

--
-- Indexes for table `configuracion`
--
ALTER TABLE `configuracion`
  ADD PRIMARY KEY (`clave`);

--
-- Indexes for table `estudiantes`
--
ALTER TABLE `estudiantes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `folio` (`folio`),
  ADD KEY `idx_estudiantes_folio` (`folio`),
  ADD KEY `idx_estudiantes_matricula` (`matricula`),
  ADD KEY `idx_estudiantes_nombre` (`nombre`),
  ADD KEY `idx_estudiantes_estado` (`estado`),
  ADD KEY `idx_estudiantes_fecha_registro` (`fecha_registro`);

--
-- Indexes for table `historial_cambios`
--
ALTER TABLE `historial_cambios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_historial_estudiante_id` (`estudiante_id`),
  ADD KEY `idx_historial_fecha` (`fecha_cambio`),
  ADD KEY `idx_historial_accion` (`accion`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `carreras`
--
ALTER TABLE `carreras`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `estudiantes`
--
ALTER TABLE `estudiantes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `historial_cambios`
--
ALTER TABLE `historial_cambios`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `historial_cambios`
--
ALTER TABLE `historial_cambios`
  ADD CONSTRAINT `historial_cambios_ibfk_1` FOREIGN KEY (`estudiante_id`) REFERENCES `estudiantes` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
