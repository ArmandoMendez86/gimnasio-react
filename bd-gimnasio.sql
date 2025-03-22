-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: gym
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `asistencias`
--

DROP TABLE IF EXISTS `asistencias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asistencias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_cliente` int DEFAULT NULL,
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id_cliente` (`id_cliente`),
  CONSTRAINT `asistencias_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asistencias`
--

LOCK TABLES `asistencias` WRITE;
/*!40000 ALTER TABLE `asistencias` DISABLE KEYS */;
INSERT INTO `asistencias` VALUES (1,1,'2025-01-21 04:28:30'),(2,2,'2025-01-21 04:28:30'),(3,3,'2025-01-21 04:28:30'),(4,4,'2025-01-21 04:28:30'),(5,5,'2025-01-21 04:28:30'),(6,6,'2025-01-21 04:28:30'),(7,7,'2025-01-21 04:28:30'),(8,8,'2025-01-21 04:28:30'),(9,9,'2025-01-21 04:28:30'),(10,10,'2025-01-21 04:28:30');
/*!40000 ALTER TABLE `asistencias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clase_asistencias`
--

DROP TABLE IF EXISTS `clase_asistencias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clase_asistencias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_clase` int DEFAULT NULL,
  `id_cliente` int DEFAULT NULL,
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id_clase` (`id_clase`),
  KEY `id_cliente` (`id_cliente`),
  CONSTRAINT `clase_asistencias_ibfk_1` FOREIGN KEY (`id_clase`) REFERENCES `clases` (`id`),
  CONSTRAINT `clase_asistencias_ibfk_2` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clase_asistencias`
--

LOCK TABLES `clase_asistencias` WRITE;
/*!40000 ALTER TABLE `clase_asistencias` DISABLE KEYS */;
INSERT INTO `clase_asistencias` VALUES (1,1,1,'2025-01-21 04:29:04'),(2,2,2,'2025-01-21 04:29:04'),(3,3,3,'2025-01-21 04:29:04'),(4,4,4,'2025-01-21 04:29:04'),(5,5,5,'2025-01-21 04:29:04'),(6,1,6,'2025-01-21 04:29:04'),(7,2,7,'2025-01-21 04:29:04'),(8,3,8,'2025-01-21 04:29:04'),(9,4,9,'2025-01-21 04:29:04'),(10,5,10,'2025-01-21 04:29:04');
/*!40000 ALTER TABLE `clase_asistencias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clases`
--

DROP TABLE IF EXISTS `clases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clases` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre_clase` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `horario` time DEFAULT NULL,
  `dias` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clases`
--

LOCK TABLES `clases` WRITE;
/*!40000 ALTER TABLE `clases` DISABLE KEYS */;
INSERT INTO `clases` VALUES (1,'Yoga','Clase de relajación y estiramientos','08:00:00','Lunes, Miércoles, Viernes'),(2,'Pilates','Clase de tonificación muscular','10:00:00','Martes, Jueves'),(3,'Zumba','Clase de baile y cardio','18:00:00','Lunes, Miércoles, Viernes'),(4,'Spinning','Clase de ciclismo indoor','07:00:00','Martes, Jueves, Sábado'),(5,'Boxeo','Entrenamiento de fuerza y resistencia','20:00:00','Lunes, Miércoles');
/*!40000 ALTER TABLE `clases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `apellido` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefono` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direccion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `fecha_nacimiento` date DEFAULT NULL,
  `genero` enum('M','F','Otro') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (1,'Juan','Pérez','juan@example.com','1234567890','Calle Ficticia 123','1985-05-15','M','2025-01-21 04:26:22'),(2,'María','López','maria@example.com','0987654321','Avenida Siempre Viva 456','1990-07-22','F','2025-01-21 04:26:22'),(3,'Carlos','Gómez','carlos@example.com','1122334455','Calle Luna 789','1982-10-05','M','2025-01-21 04:26:22'),(4,'Ana','Martínez','ana@example.com','2233445566','Calle Sol 101','1995-03-10','F','2025-01-21 04:26:22'),(5,'Pedro','Hernández','pedro@example.com','3344556677','Calle Falsa 202','1987-11-30','M','2025-01-21 04:26:22'),(6,'Lucía','Ramírez','lucia@example.com','4455667788','Calle Real 303','2000-01-25','F','2025-01-21 04:26:22'),(7,'José','García','jose@example.com','5566778899','Calle Verde 404','1992-06-13','M','2025-01-21 04:26:22'),(8,'Elena','Rodríguez','elena@example.com','6677889900','Calle Roja 505','1988-09-08','F','2025-01-21 04:26:22'),(9,'Sergio','Vázquez','sergio@example.com','7788990011','Calle Azul 606','1984-02-14','M','2025-01-21 04:26:22'),(10,'Clara','Sánchez','clara@example.com','8899001122','Calle Amarilla 707','1994-12-20','F','2025-01-21 04:26:22'),(11,'armando','mendez rios','armando.mendez.dev@gmail.com','7471228268',NULL,NULL,NULL,'2025-02-01 15:13:22'),(12,'mario','mendez rios','mario9130@gmail.com','7474592723',NULL,NULL,NULL,'2025-02-01 15:20:58');
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clientes_membresias`
--

DROP TABLE IF EXISTS `clientes_membresias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes_membresias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_cliente` int DEFAULT NULL,
  `id_membresia` int DEFAULT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_cliente` (`id_cliente`),
  KEY `id_membresia` (`id_membresia`),
  CONSTRAINT `clientes_membresias_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id`),
  CONSTRAINT `clientes_membresias_ibfk_2` FOREIGN KEY (`id_membresia`) REFERENCES `membresias` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes_membresias`
--

LOCK TABLES `clientes_membresias` WRITE;
/*!40000 ALTER TABLE `clientes_membresias` DISABLE KEYS */;
INSERT INTO `clientes_membresias` VALUES (1,1,1,'2025-01-01','2025-01-31'),(2,2,2,'2025-01-15','2025-04-15'),(3,3,3,'2025-01-10','2025-07-10'),(4,4,1,'2025-01-05','2025-02-04'),(5,5,2,'2025-01-20','2025-04-20'),(6,6,1,'2025-01-01','2025-01-31'),(7,7,2,'2025-01-10','2025-04-10'),(8,8,3,'2025-01-20','2025-07-20'),(9,9,1,'2025-01-15','2025-02-14'),(10,10,3,'2025-01-25','2025-07-25');
/*!40000 ALTER TABLE `clientes_membresias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `configuracion_modulos`
--

DROP TABLE IF EXISTS `configuracion_modulos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `configuracion_modulos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `modulo` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `activo` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `configuracion_modulos`
--

LOCK TABLES `configuracion_modulos` WRITE;
/*!40000 ALTER TABLE `configuracion_modulos` DISABLE KEYS */;
INSERT INTO `configuracion_modulos` VALUES (1,'Rutinas',1),(2,'Membresías',1),(3,'Pagos',1),(4,'Asistencias',1),(5,'Clases',1),(6,'Notificaciones',1),(7,'Configuración',1),(11,'Reportes',1),(12,'Entrenadores',1),(13,'Stock',1);
/*!40000 ALTER TABLE `configuracion_modulos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empleados`
--

DROP TABLE IF EXISTS `empleados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empleados` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `apellido` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefono` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direccion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `puesto` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `salario` decimal(10,2) DEFAULT NULL,
  `fecha_contratacion` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empleados`
--

LOCK TABLES `empleados` WRITE;
/*!40000 ALTER TABLE `empleados` DISABLE KEYS */;
INSERT INTO `empleados` VALUES (1,'Carlos','Mora','carlos.mora@empresa.com','1010101010','Oficina Central','Entrenador',15000.00,'2023-01-01'),(2,'Sara','Vega','sara.vega@empresa.com','2020202020','Oficina Norte','Recepcionista',10000.00,'2023-02-15'),(3,'Luis','Pérez','luis.perez@empresa.com','3030303030','Oficina Sur','Gerente',20000.00,'2022-11-10'),(4,'Marta','Luna','marta.luna@empresa.com','4040404040','Oficina Este','Cocinera',12000.00,'2022-08-25'),(5,'David','Jiménez','david.jimenez@empresa.com','5050505050','Oficina Oeste','Limpieza',8000.00,'2024-01-10');
/*!40000 ALTER TABLE `empleados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `membresias`
--

DROP TABLE IF EXISTS `membresias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `membresias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tipo` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `precio` decimal(10,2) DEFAULT NULL,
  `duracion_dias` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `membresias`
--

LOCK TABLES `membresias` WRITE;
/*!40000 ALTER TABLE `membresias` DISABLE KEYS */;
INSERT INTO `membresias` VALUES (1,'dia',50.00,1),(2,'semana',80.00,7),(3,'mes',350.00,30);
/*!40000 ALTER TABLE `membresias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificaciones`
--

DROP TABLE IF EXISTS `notificaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificaciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_cliente` int DEFAULT NULL,
  `mensaje` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `fecha_envio` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id_cliente` (`id_cliente`),
  CONSTRAINT `notificaciones_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificaciones`
--

LOCK TABLES `notificaciones` WRITE;
/*!40000 ALTER TABLE `notificaciones` DISABLE KEYS */;
INSERT INTO `notificaciones` VALUES (1,1,'Recordatorio de tu próxima clase de Yoga mañana a las 08:00 AM','2025-01-21 04:29:14'),(2,2,'Tu pago de membresía ha sido recibido con éxito','2025-01-21 04:29:14'),(3,3,'Tu rutina de fuerza está lista para comenzar','2025-01-21 04:29:14'),(4,4,'Tu clase de Pilates está programada para el jueves a las 10:00 AM','2025-01-21 04:29:14'),(5,5,'Tu próxima clase de Zumba es hoy a las 18:00 PM','2025-01-21 04:29:14'),(6,6,'Recuerda renovar tu membresía antes de que expire','2025-01-21 04:29:14'),(7,7,'Te esperamos para tu próxima clase de Spinning el martes','2025-01-21 04:29:14'),(8,8,'Tu pago de membresía está pendiente','2025-01-21 04:29:14'),(9,9,'No olvides tu clase de Boxeo el miércoles a las 20:00 PM','2025-01-21 04:29:14'),(10,10,'Tu asistencia a la clase de Yoga ha sido registrada','2025-01-21 04:29:14');
/*!40000 ALTER TABLE `notificaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pagos`
--

DROP TABLE IF EXISTS `pagos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pagos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_cliente_membresia` int DEFAULT NULL,
  `fecha_pago` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `metodo_pago` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pagos_ibfk_1_idx` (`id_cliente_membresia`),
  CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`id_cliente_membresia`) REFERENCES `clientes_membresias` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pagos`
--

LOCK TABLES `pagos` WRITE;
/*!40000 ALTER TABLE `pagos` DISABLE KEYS */;
INSERT INTO `pagos` VALUES (1,1,'2025-01-21 04:28:13','efectivo'),(2,2,'2025-01-21 04:28:13','efectivo'),(3,3,'2025-01-21 04:28:13','efectivo'),(4,1,'2025-01-21 04:28:13','efectivo'),(5,2,'2025-01-21 04:28:13','efectivo'),(6,1,'2025-01-21 04:28:13','efectivo'),(7,2,'2025-01-21 04:28:13','efectivo'),(8,3,'2025-01-21 04:28:13','efectivo'),(9,1,'2025-01-21 04:28:13','efectivo'),(10,3,'2025-01-21 04:28:13','efectivo');
/*!40000 ALTER TABLE `pagos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rutinas`
--

DROP TABLE IF EXISTS `rutinas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rutinas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_cliente` int DEFAULT NULL,
  `nombre_rutina` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `id_cliente` (`id_cliente`),
  CONSTRAINT `rutinas_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rutinas`
--

LOCK TABLES `rutinas` WRITE;
/*!40000 ALTER TABLE `rutinas` DISABLE KEYS */;
INSERT INTO `rutinas` VALUES (1,1,'Rutina Básica','Rutina de fuerza para principiantes'),(2,2,'Rutina Avanzada','Entrenamiento intensivo para tonificación'),(3,3,'Rutina Cardio','Entrenamiento para perder peso y mejorar resistencia'),(4,4,'Rutina Total Body','Entrenamiento para todo el cuerpo'),(5,5,'Rutina HIIT','Entrenamiento de alta intensidad para quemar grasa'),(6,6,'Rutina de Flexibilidad','Rutina de estiramientos y yoga'),(7,7,'Rutina Fuerza','Entrenamiento de fuerza para hipertrofia muscular'),(8,8,'Rutina de Endurance','Entrenamiento para mejorar resistencia'),(9,9,'Rutina Mixta','Entrenamiento combinado de fuerza y cardio'),(10,10,'Rutina de Yoga','Rutina enfocada en el equilibrio y flexibilidad');
/*!40000 ALTER TABLE `rutinas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock`
--

DROP TABLE IF EXISTS `stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre_producto` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `cantidad` int DEFAULT NULL,
  `precio_unitario` decimal(10,2) DEFAULT NULL,
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock`
--

LOCK TABLES `stock` WRITE;
/*!40000 ALTER TABLE `stock` DISABLE KEYS */;
INSERT INTO `stock` VALUES (1,'Proteína Whey','Proteína de suero de leche',50,500.00,'2025-01-21 04:27:08'),(2,'Barras de energía','Barras ricas en proteínas y carbohidratos',30,150.00,'2025-01-21 04:27:08'),(3,'Zapatillas deportivas','Zapatillas para entrenamiento',20,800.00,'2025-01-21 04:27:08'),(4,'Ropa deportiva','Ropa cómoda para entrenamientos',40,300.00,'2025-01-21 04:27:08'),(5,'Mancuernas','Mancuernas de diferentes pesos',100,200.00,'2025-01-21 04:27:08'),(6,'Bicicletas estáticas','Bicicletas para entrenamiento indoor',10,5000.00,'2025-01-21 04:27:08'),(7,'Pesas de kettlebell','Pesas para entrenamiento funcional',60,400.00,'2025-01-21 04:27:08'),(8,'Estera de yoga','Estera para ejercicios de yoga y estiramientos',50,250.00,'2025-01-21 04:27:08'),(9,'Cuerda para saltar','Cuerda para ejercicios de saltos',80,50.00,'2025-01-21 04:27:08'),(10,'Reloj de entrenamiento','Reloj para seguimiento de entrenamientos',15,1200.00,'2025-01-21 04:27:08');
/*!40000 ALTER TABLE `stock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ventas`
--

DROP TABLE IF EXISTS `ventas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ventas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_cliente` int DEFAULT NULL,
  `fecha_venta` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `total` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_cliente` (`id_cliente`),
  CONSTRAINT `ventas_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ventas`
--

LOCK TABLES `ventas` WRITE;
/*!40000 ALTER TABLE `ventas` DISABLE KEYS */;
INSERT INTO `ventas` VALUES (1,1,'2025-01-21 04:27:20',1200.00),(2,2,'2025-01-21 04:27:20',150.00),(3,3,'2025-01-21 04:27:20',2300.00),(4,4,'2025-01-21 04:27:20',700.00),(5,5,'2025-01-21 04:27:20',500.00),(6,6,'2025-01-21 04:27:20',1300.00),(7,7,'2025-01-21 04:27:20',900.00),(8,8,'2025-01-21 04:27:20',1700.00),(9,9,'2025-01-21 04:27:20',200.00),(10,10,'2025-01-21 04:27:20',3000.00);
/*!40000 ALTER TABLE `ventas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ventas_detalles`
--

DROP TABLE IF EXISTS `ventas_detalles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ventas_detalles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_venta` int DEFAULT NULL,
  `id_producto` int DEFAULT NULL,
  `cantidad` int DEFAULT NULL,
  `precio_unitario` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_venta` (`id_venta`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `ventas_detalles_ibfk_1` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id`),
  CONSTRAINT `ventas_detalles_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `stock` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ventas_detalles`
--

LOCK TABLES `ventas_detalles` WRITE;
/*!40000 ALTER TABLE `ventas_detalles` DISABLE KEYS */;
INSERT INTO `ventas_detalles` VALUES (1,1,1,2,500.00),(2,1,5,4,200.00),(3,2,3,1,800.00),(4,3,2,3,150.00),(5,4,6,1,5000.00),(6,5,7,2,400.00),(7,6,9,5,50.00),(8,7,8,1,250.00),(9,8,10,2,1200.00),(10,9,4,1,300.00);
/*!40000 ALTER TABLE `ventas_detalles` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-22 14:29:59
