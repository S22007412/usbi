-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 22, 2025 at 07:33 AM
-- Server version: 8.0.44-0ubuntu0.24.04.1
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
  `fecha_actualizacion` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `estudiantes`
--

INSERT INTO `estudiantes` (`id`, `folio`, `matricula`, `nombre`, `carrera`, `adeudo`, `estado`, `fecha_registro`, `hora_registro`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 'No.0001', 'S22007411', 'Paola Dexiree', 'Cirujano Dentista', 20.00, 'con_adeudo', '2025-09-29 09:30:17', '09:30:17', '2025-09-29 09:30:17', '2025-10-06 05:54:45'),
(2, 'No.0002', 'S22007412', 'José Alan Sotelo Meseguer', 'Ingeniería en Tecnologías Computacionales', 0.00, 'sin_adeudo', '2025-09-29 12:30:40', '12:30:40', '2025-09-29 12:30:40', '2025-10-06 05:09:28'),
(3, 'No.0003', 'S23007432', 'Juan Pérez', 'Epidemiología', 5.00, 'con_adeudo', '2025-10-06 05:16:14', '05:16:14', '2025-10-06 05:16:14', '2025-10-06 05:17:13'),
(4, 'No.0004', 'S21001123', 'Louis Ramírez', 'Derecho', 0.00, 'sin_adeudo', '2025-10-06 05:16:50', '05:16:50', '2025-10-06 05:16:50', '2025-10-06 05:16:58'),
(10, 'No.0005', 'S220074124', 'Mario Hernandez', 'Ingeniería en Electrónica y Comunicaciones', 0.00, 'sin_adeudo', '2025-10-06 05:44:46', '05:44:46', '2025-10-06 05:44:46', '2025-11-06 23:53:54'),
(18, 'No.0006', 'S22007409', 'Eder Salas', 'Ingeniería en Tecnologías Computacionales', 0.00, 'sin_adeudo', '2025-11-22 13:27:23', '07:27:23', '2025-11-22 13:27:23', '2025-11-22 13:27:23'),
(19, 'No.0007', 'S22007401', 'rodo', 'Derecho con Enfoque de Pluralismo Jurídico', 0.00, 'sin_adeudo', '2025-11-22 13:29:36', '07:29:36', '2025-11-22 13:29:36', '2025-11-22 13:29:36');

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

CREATE ALGORITHM=UNDEFINED DEFINER=`usbi`@`%` SQL SECURITY DEFINER VIEW `vista_adeudos_por_mes`  AS SELECT year(`estudiantes`.`fecha_registro`) AS `año`, lpad(month(`estudiantes`.`fecha_registro`),2,'0') AS `mes`, date_format(`estudiantes`.`fecha_registro`,'%Y-%m') AS `año_mes`, count(0) AS `total_registros`, count((case when (`estudiantes`.`estado` = 'con_adeudo') then 1 end)) AS `con_adeudo`, coalesce(sum(`estudiantes`.`adeudo`),0) AS `total_adeudo_mes` FROM `estudiantes` GROUP BY date_format(`estudiantes`.`fecha_registro`,'%Y-%m') ORDER BY `año_mes` ASC ;

-- --------------------------------------------------------

--
-- Structure for view `vista_carreras_adeudos`
--
DROP TABLE IF EXISTS `vista_carreras_adeudos`;

CREATE ALGORITHM=UNDEFINED DEFINER=`usbi`@`%` SQL SECURITY DEFINER VIEW `vista_carreras_adeudos`  AS SELECT `estudiantes`.`carrera` AS `carrera`, count(0) AS `total_estudiantes`, count((case when (`estudiantes`.`estado` = 'con_adeudo') then 1 end)) AS `con_adeudo`, coalesce(sum(`estudiantes`.`adeudo`),0) AS `total_adeudo_carrera`, coalesce(avg(`estudiantes`.`adeudo`),0) AS `promedio_adeudo_carrera` FROM `estudiantes` GROUP BY `estudiantes`.`carrera` ORDER BY `total_adeudo_carrera` DESC ;

-- --------------------------------------------------------

--
-- Structure for view `vista_estadisticas`
--
DROP TABLE IF EXISTS `vista_estadisticas`;

CREATE ALGORITHM=UNDEFINED DEFINER=`usbi`@`%` SQL SECURITY DEFINER VIEW `vista_estadisticas`  AS SELECT count(0) AS `total_devoluciones`, count((case when (`estudiantes`.`estado` = 'sin_adeudo') then 1 end)) AS `sin_adeudo`, count((case when (`estudiantes`.`estado` = 'con_adeudo') then 1 end)) AS `con_adeudo`, coalesce(sum(`estudiantes`.`adeudo`),0) AS `total_adeudos`, coalesce(avg(`estudiantes`.`adeudo`),0) AS `promedio_adeudo` FROM `estudiantes` ;

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
