-- MySQL dump 10.13  Distrib 9.6.0, for macos26.3 (arm64)
--
-- Host: localhost    Database: koperasi_desa_sukadalem
-- ------------------------------------------------------
-- Server version	9.6.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ 'd75f11f6-ac9f-11f0-b59c-4e59d41d1100:1-41';

--
-- Table structure for table `barang`
--

DROP TABLE IF EXISTS `barang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `barang` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama_barang` varchar(100) NOT NULL,
  `harga` decimal(15,2) NOT NULL,
  `stok` int NOT NULL DEFAULT '0',
  `satuan` varchar(20) DEFAULT 'pcs',
  `deskripsi` text,
  `unit_usaha_id` int NOT NULL,
  `status` enum('aktif','nonaktif') DEFAULT 'aktif',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_nama_barang` (`nama_barang`),
  KEY `idx_unit_usaha_id` (`unit_usaha_id`),
  CONSTRAINT `barang_ibfk_1` FOREIGN KEY (`unit_usaha_id`) REFERENCES `unit_usaha` (`id`) ON DELETE CASCADE,
  CONSTRAINT `barang_chk_1` CHECK ((`harga` >= 0)),
  CONSTRAINT `barang_chk_2` CHECK ((`stok` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `barang`
--

LOCK TABLES `barang` WRITE;
/*!40000 ALTER TABLE `barang` DISABLE KEYS */;
INSERT INTO `barang` VALUES (1,'Beras Premium 5kg',60000.00,47,'karung','Beras kualitas premium kemasan 5kg',1,'aktif','2026-03-24 14:34:27','2026-03-24 14:34:27'),(2,'Minyak Goreng 1L',17000.00,29,'botol','Minyak goreng kemasan 1 liter',1,'aktif','2026-03-24 14:34:27','2026-03-24 14:34:27'),(3,'Gula Pasir 1kg',14000.00,24,'kg','Gula pasir putih kemasan 1kg',1,'aktif','2026-03-24 14:34:27','2026-03-24 14:34:27'),(4,'Telur Ayam',28000.00,19,'kg','Telur ayam kampung segar',1,'aktif','2026-03-24 14:34:27','2026-03-24 14:34:27'),(5,'Susu UHT 1L',20000.00,39,'kotak','Susu UHT full cream 1 liter',1,'aktif','2026-03-24 14:34:27','2026-03-24 14:34:27'),(6,'Indomie Goreng',3000.00,95,'bungkus','Mie instan rasa ayam goreng',2,'aktif','2026-03-24 14:34:27','2026-03-24 14:34:27'),(7,'Aqua 600ml',3000.00,78,'botol','Air mineral kemasan 600ml',2,'aktif','2026-03-24 14:34:27','2026-03-24 14:34:27'),(8,'Kerupuk Udang',10000.00,25,'bungkus','Kerupuk udang mentah siap goreng',2,'aktif','2026-03-24 14:34:27','2026-03-24 14:34:27'),(9,'Biskuit Marie',7000.00,39,'bungkus','Biskuit marie kemasan keluarga',2,'aktif','2026-03-24 14:34:27','2026-03-24 14:34:27'),(10,'Sampo Sachet',1500.00,200,'sachet','Sampo kemasan sachet 12ml',2,'aktif','2026-03-24 14:34:27','2026-03-24 14:34:27'),(11,'Air Galon 19L',5000.00,94,'galon','Air minum isi ulang galon 19 liter',3,'aktif','2026-03-24 14:34:27','2026-03-24 14:34:27'),(12,'Galon Kosong',35000.00,20,'unit','Galon air kosong baru',3,'aktif','2026-03-24 14:34:27','2026-03-24 14:34:27'),(13,'Air Botol 1.5L',3000.00,60,'botol','Air mineral kemasan botol 1.5L',3,'aktif','2026-03-24 14:34:27','2026-03-24 14:34:27'),(14,'Pompa Galon Manual',20000.00,10,'unit','Pompa galon manual',3,'aktif','2026-03-24 14:34:27','2026-03-24 14:34:27'),(15,'Nasi Gudeg',15000.00,50,'porsi','Nasi gudeg komplit dengan lauk',4,'aktif','2026-03-24 14:34:27','2026-03-24 14:34:27'),(16,'Soto Ayam',12000.00,30,'porsi','Soto ayam dengan nasi',4,'aktif','2026-03-24 14:34:27','2026-03-24 14:34:27'),(17,'Es Teh Manis',3000.00,100,'gelas','Es teh manis segar',4,'aktif','2026-03-24 14:34:27','2026-03-24 14:34:27'),(18,'Pecel Lele',10000.00,39,'porsi','Pecel lele dengan nasi dan lalapan',4,'aktif','2026-03-24 14:34:27','2026-03-24 14:34:27'),(19,'Pupuk NPK 50kg',200000.00,19,'karung','Pupuk NPK phonska kemasan 50kg',5,'aktif','2026-03-24 14:34:27','2026-03-24 14:34:27'),(20,'Cangkul',55000.00,10,'unit','Cangkul pertanian gagang kayu',5,'aktif','2026-03-24 14:34:27','2026-03-24 14:34:27'),(21,'Sabit',30000.00,15,'unit','Sabit pemanen padi',5,'aktif','2026-03-24 14:34:27','2026-03-24 14:34:27'),(22,'Bibit Padi IR64',50000.00,30,'kg','Benih padi varietas IR64',5,'aktif','2026-03-24 14:34:27','2026-03-24 14:34:27');
/*!40000 ALTER TABLE `barang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `laporan_bulanan`
--

DROP TABLE IF EXISTS `laporan_bulanan`;
/*!50001 DROP VIEW IF EXISTS `laporan_bulanan`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `laporan_bulanan` AS SELECT 
 1 AS `tahun`,
 1 AS `bulan`,
 1 AS `total_transaksi`,
 1 AS `total_pendapatan`,
 1 AS `nama_usaha`,
 1 AS `unit_usaha_id`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `laporan_harian`
--

DROP TABLE IF EXISTS `laporan_harian`;
/*!50001 DROP VIEW IF EXISTS `laporan_harian`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `laporan_harian` AS SELECT 
 1 AS `tanggal`,
 1 AS `total_transaksi`,
 1 AS `total_pendapatan`,
 1 AS `nama_usaha`,
 1 AS `unit_usaha_id`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `transaksi`
--

DROP TABLE IF EXISTS `transaksi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaksi` (
  `id` int NOT NULL AUTO_INCREMENT,
  `kode_transaksi` varchar(20) NOT NULL,
  `tanggal_transaksi` datetime NOT NULL,
  `nama_pembeli` varchar(100) DEFAULT NULL,
  `total_harga` decimal(15,2) NOT NULL DEFAULT '0.00',
  `user_id` int NOT NULL,
  `catatan` text,
  `status` enum('selesai','dibatalkan') DEFAULT 'selesai',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `kode_transaksi` (`kode_transaksi`),
  KEY `idx_kode_transaksi` (`kode_transaksi`),
  KEY `idx_tanggal_transaksi` (`tanggal_transaksi`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `transaksi_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaksi`
--

LOCK TABLES `transaksi` WRITE;
/*!40000 ALTER TABLE `transaksi` DISABLE KEYS */;
INSERT INTO `transaksi` VALUES (1,'TRX-20260323-001','2026-03-23 08:30:00','Bu Sari',151000.00,2,NULL,'selesai','2026-03-24 14:34:27','2026-03-24 14:34:27'),(2,'TRX-20260323-002','2026-03-23 10:15:00','Pak Budi',255000.00,2,NULL,'selesai','2026-03-24 14:34:27','2026-03-24 14:34:27'),(3,'TRX-20260323-003','2026-03-23 14:20:00','Ani',28000.00,3,NULL,'selesai','2026-03-24 14:34:27','2026-03-24 14:34:27'),(4,'TRX-20260324-001','2026-03-24 09:00:00','Bu Wati',108000.00,2,NULL,'selesai','2026-03-24 14:34:27','2026-03-24 14:34:27'),(5,'TRX-20260324-002','2026-03-24 11:30:00','Pak Heri',30000.00,3,NULL,'selesai','2026-03-24 14:34:27','2026-03-24 14:34:27');
/*!40000 ALTER TABLE `transaksi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaksi_detail`
--

DROP TABLE IF EXISTS `transaksi_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaksi_detail` (
  `id` int NOT NULL AUTO_INCREMENT,
  `transaksi_id` int NOT NULL,
  `barang_id` int NOT NULL,
  `jumlah` int NOT NULL,
  `harga_satuan` decimal(15,2) NOT NULL,
  `subtotal` decimal(15,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_transaksi_id` (`transaksi_id`),
  KEY `idx_barang_id` (`barang_id`),
  CONSTRAINT `transaksi_detail_ibfk_1` FOREIGN KEY (`transaksi_id`) REFERENCES `transaksi` (`id`) ON DELETE CASCADE,
  CONSTRAINT `transaksi_detail_ibfk_2` FOREIGN KEY (`barang_id`) REFERENCES `barang` (`id`),
  CONSTRAINT `transaksi_detail_chk_1` CHECK ((`jumlah` > 0)),
  CONSTRAINT `transaksi_detail_chk_2` CHECK ((`harga_satuan` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaksi_detail`
--

LOCK TABLES `transaksi_detail` WRITE;
/*!40000 ALTER TABLE `transaksi_detail` DISABLE KEYS */;
INSERT INTO `transaksi_detail` VALUES (1,1,1,2,60000.00,120000.00,'2026-03-24 14:34:27'),(2,1,2,1,17000.00,17000.00,'2026-03-24 14:34:27'),(3,1,3,1,14000.00,14000.00,'2026-03-24 14:34:27'),(4,2,18,1,200000.00,200000.00,'2026-03-24 14:34:27'),(5,2,19,1,55000.00,55000.00,'2026-03-24 14:34:27'),(6,3,6,5,3000.00,15000.00,'2026-03-24 14:34:27'),(7,3,7,2,3000.00,6000.00,'2026-03-24 14:34:27'),(8,3,9,1,7000.00,7000.00,'2026-03-24 14:34:27'),(9,4,1,1,60000.00,60000.00,'2026-03-24 14:34:27'),(10,4,4,1,28000.00,28000.00,'2026-03-24 14:34:27'),(11,4,5,1,20000.00,20000.00,'2026-03-24 14:34:27'),(12,5,11,6,5000.00,30000.00,'2026-03-24 14:34:27');
/*!40000 ALTER TABLE `transaksi_detail` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `tr_update_subtotal_insert` BEFORE INSERT ON `transaksi_detail` FOR EACH ROW BEGIN
    SET NEW.subtotal = NEW.jumlah * NEW.harga_satuan;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `tr_update_total_transaksi_insert` AFTER INSERT ON `transaksi_detail` FOR EACH ROW BEGIN
    UPDATE transaksi 
    SET total_harga = (
        SELECT SUM(subtotal) 
        FROM transaksi_detail 
        WHERE transaksi_id = NEW.transaksi_id
    )
    WHERE id = NEW.transaksi_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `tr_update_stok_insert` AFTER INSERT ON `transaksi_detail` FOR EACH ROW BEGIN
    UPDATE barang 
    SET stok = stok - NEW.jumlah 
    WHERE id = NEW.barang_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `tr_update_subtotal_update` BEFORE UPDATE ON `transaksi_detail` FOR EACH ROW BEGIN
    SET NEW.subtotal = NEW.jumlah * NEW.harga_satuan;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `tr_update_total_transaksi_update` AFTER UPDATE ON `transaksi_detail` FOR EACH ROW BEGIN
    UPDATE transaksi 
    SET total_harga = (
        SELECT SUM(subtotal) 
        FROM transaksi_detail 
        WHERE transaksi_id = NEW.transaksi_id
    )
    WHERE id = NEW.transaksi_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `tr_update_total_transaksi_delete` AFTER DELETE ON `transaksi_detail` FOR EACH ROW BEGIN
    UPDATE transaksi 
    SET total_harga = (
        SELECT COALESCE(SUM(subtotal), 0) 
        FROM transaksi_detail 
        WHERE transaksi_id = OLD.transaksi_id
    )
    WHERE id = OLD.transaksi_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `unit_usaha`
--

DROP TABLE IF EXISTS `unit_usaha`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `unit_usaha` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama_usaha` varchar(100) NOT NULL,
  `jenis_usaha` varchar(50) NOT NULL,
  `deskripsi` text,
  `status` enum('aktif','nonaktif') DEFAULT 'aktif',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_nama_usaha` (`nama_usaha`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unit_usaha`
--

LOCK TABLES `unit_usaha` WRITE;
/*!40000 ALTER TABLE `unit_usaha` DISABLE KEYS */;
INSERT INTO `unit_usaha` VALUES (1,'Warung Sembako','Retail','Usaha penjualan kebutuhan pokok sehari-hari seperti beras, minyak, gula, dll','aktif','2026-03-24 14:34:27','2026-03-24 14:34:27'),(2,'Toko Kelontong','Retail','Penjualan barang-barang keperluan rumah tangga dan makanan ringan','aktif','2026-03-24 14:34:27','2026-03-24 14:34:27'),(3,'Depot Air Minum','Jasa','Usaha penjualan air minum isi ulang untuk warga desa','aktif','2026-03-24 14:34:27','2026-03-24 14:34:27'),(4,'Warung Makan','Kuliner','Usaha warung makan dengan menu makanan tradisional','aktif','2026-03-24 14:34:27','2026-03-24 14:34:27'),(5,'Toko Alat Pertanian','Retail','Penjualan alat-alat pertanian dan pupuk untuk petani desa','aktif','2026-03-24 14:34:27','2026-03-24 14:34:27'),(6,'Barbershop Sukadalem','Layanan','Layanan potong rambut dan perawatan pria','nonaktif','2026-03-24 14:34:27','2026-03-24 14:34:27');
/*!40000 ALTER TABLE `unit_usaha` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nama_lengkap` varchar(100) NOT NULL,
  `role` enum('admin','pengurus') DEFAULT 'pengurus',
  `status` enum('aktif','nonaktif') DEFAULT 'aktif',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_username` (`username`),
  KEY `idx_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','admin@koperasi-sukadalem.id','password123','Administrator Koperasi','admin','aktif','2026-03-24 14:34:27','2026-03-24 14:38:22'),(2,'pengurus1','pengurus1@koperasi-sukadalem.id','password123','Budi Santoso','pengurus','aktif','2026-03-24 14:34:27','2026-03-24 14:38:22'),(3,'pengurus2','pengurus2@koperasi-sukadalem.id','password123','Sari Dewi','pengurus','aktif','2026-03-24 14:34:27','2026-03-24 14:38:22'),(4,'bendahara','bendahara@sukadalem.id','password123','Siti Aminah','pengurus','aktif','2026-03-24 14:34:27','2026-03-24 14:38:22'),(5,'sekretaris','sekretaris@sukadalem.id','password123','Ahmad Yusuf','pengurus','aktif','2026-03-24 14:34:27','2026-03-24 14:38:22');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `laporan_bulanan`
--

/*!50001 DROP VIEW IF EXISTS `laporan_bulanan`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `laporan_bulanan` AS select year(`t`.`tanggal_transaksi`) AS `tahun`,month(`t`.`tanggal_transaksi`) AS `bulan`,count(`t`.`id`) AS `total_transaksi`,sum(`t`.`total_harga`) AS `total_pendapatan`,`uu`.`nama_usaha` AS `nama_usaha`,`uu`.`id` AS `unit_usaha_id` from (((`transaksi` `t` join `transaksi_detail` `td` on((`t`.`id` = `td`.`transaksi_id`))) join `barang` `b` on((`td`.`barang_id` = `b`.`id`))) join `unit_usaha` `uu` on((`b`.`unit_usaha_id` = `uu`.`id`))) where (`t`.`status` = 'selesai') group by year(`t`.`tanggal_transaksi`),month(`t`.`tanggal_transaksi`),`uu`.`id`,`uu`.`nama_usaha` order by `tahun` desc,`bulan` desc,`uu`.`nama_usaha` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `laporan_harian`
--

/*!50001 DROP VIEW IF EXISTS `laporan_harian`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `laporan_harian` AS select cast(`t`.`tanggal_transaksi` as date) AS `tanggal`,count(`t`.`id`) AS `total_transaksi`,sum(`t`.`total_harga`) AS `total_pendapatan`,`uu`.`nama_usaha` AS `nama_usaha`,`uu`.`id` AS `unit_usaha_id` from (((`transaksi` `t` join `transaksi_detail` `td` on((`t`.`id` = `td`.`transaksi_id`))) join `barang` `b` on((`td`.`barang_id` = `b`.`id`))) join `unit_usaha` `uu` on((`b`.`unit_usaha_id` = `uu`.`id`))) where (`t`.`status` = 'selesai') group by cast(`t`.`tanggal_transaksi` as date),`uu`.`id`,`uu`.`nama_usaha` order by `tanggal` desc,`uu`.`nama_usaha` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-02  8:51:20
