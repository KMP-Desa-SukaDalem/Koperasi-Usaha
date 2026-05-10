-- MySQL dump 10.13  Distrib 9.6.0, for macos26.3 (arm64)
--
-- Host: localhost    Database: koperasi_desa_db
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

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ 'd75f11f6-ac9f-11f0-b59c-4e59d41d1100:1-42';

--
-- Table structure for table `anggota`
--

DROP TABLE IF EXISTS `anggota`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `anggota` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nik` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama_lengkap` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nomor_telepon` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('active','nonactive') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  PRIMARY KEY (`id`),
  UNIQUE KEY `nik` (`nik`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `anggota`
--

LOCK TABLES `anggota` WRITE;
/*!40000 ALTER TABLE `anggota` DISABLE KEYS */;
INSERT INTO `anggota` VALUES (2,'3501030130321312','test','tester@ss.co.id','08515815151','2026-04-21 15:08:55','active'),(3,'22201030130321312','test','testerrr@gmail.com','08515815151','2026-04-24 01:47:11','active'),(9,'9999999999','Test Robot','robot@test.com','089999999','2026-04-26 13:09:04','nonactive'),(10,'111111111112221','test','testdev@mailinator.com','08515815151','2026-04-26 13:11:10','active');
/*!40000 ALTER TABLE `anggota` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `barang`
--

DROP TABLE IF EXISTS `barang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `barang` (
  `id` int NOT NULL AUTO_INCREMENT,
  `unit_usaha_id` int NOT NULL,
  `nama_barang` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `harga_beli` decimal(12,2) NOT NULL DEFAULT '0.00',
  `harga_jual` decimal(12,2) NOT NULL DEFAULT '0.00',
  `stok` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `unit_usaha_id` (`unit_usaha_id`),
  CONSTRAINT `barang_ibfk_1` FOREIGN KEY (`unit_usaha_id`) REFERENCES `unit_usaha` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `barang`
--

LOCK TABLES `barang` WRITE;
/*!40000 ALTER TABLE `barang` DISABLE KEYS */;
INSERT INTO `barang` VALUES (17,6,'BERAS',1000.00,1000.00,110,'2026-05-01 15:15:28','2026-05-02 01:06:43'),(18,6,'test',111.00,1111.00,33,'2026-05-02 01:52:34','2026-05-02 01:52:34');
/*!40000 ALTER TABLE `barang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detail_transaksi`
--

DROP TABLE IF EXISTS `detail_transaksi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detail_transaksi` (
  `id` int NOT NULL AUTO_INCREMENT,
  `transaksi_id` int NOT NULL,
  `barang_id` int NOT NULL,
  `qty` int NOT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `transaksi_id` (`transaksi_id`),
  KEY `detail_transaksi_ibfk_2` (`barang_id`),
  CONSTRAINT `detail_transaksi_ibfk_1` FOREIGN KEY (`transaksi_id`) REFERENCES `transaksi` (`id`) ON DELETE CASCADE,
  CONSTRAINT `detail_transaksi_ibfk_2` FOREIGN KEY (`barang_id`) REFERENCES `barang` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detail_transaksi`
--

LOCK TABLES `detail_transaksi` WRITE;
/*!40000 ALTER TABLE `detail_transaksi` DISABLE KEYS */;
INSERT INTO `detail_transaksi` VALUES (43,39,17,1,1000.00);
/*!40000 ALTER TABLE `detail_transaksi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `logs`
--

DROP TABLE IF EXISTS `logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `action` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `target_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `target_id` int DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logs`
--

LOCK TABLES `logs` WRITE;
/*!40000 ALTER TABLE `logs` DISABLE KEYS */;
INSERT INTO `logs` VALUES (1,1,'UPDATE','ANGGOTA',3,'Memperbarui data anggota: test (NIK: 22201030130321312).','2026-04-29 02:36:14'),(2,1,'CREATE','USER',21,'Menambah pengguna baru: test (Role: pengurus).','2026-05-01 03:27:12'),(3,1,'RESTORE','ANGGOTA',10,'Mengaktifkan kembali anggota: test.','2026-05-01 06:02:32'),(4,1,'DELETE','USER',21,'Menghapus pengguna: test.','2026-05-01 13:27:04'),(5,1,'DELETE','USER',19,'Menghapus pengguna: test.','2026-05-01 13:27:08'),(6,1,'DELETE','USER',20,'Menghapus pengguna: Pengurus Koperasi.','2026-05-02 01:50:23');
/*!40000 ALTER TABLE `logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplier`
--

DROP TABLE IF EXISTS `supplier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama_penanggung_jawab` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama_toko` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alamat` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `nomor_telepon` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier`
--

LOCK TABLES `supplier` WRITE;
/*!40000 ALTER TABLE `supplier` DISABLE KEYS */;
INSERT INTO `supplier` VALUES (2,'test','test','testerrr@gmail.com','test','08515815151','2026-04-23 02:54:38');
/*!40000 ALTER TABLE `supplier` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaksi`
--

DROP TABLE IF EXISTS `transaksi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaksi` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `tanggal_transaksi` datetime DEFAULT CURRENT_TIMESTAMP,
  `total_harga` decimal(12,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `metode_pembayaran` enum('Cash','Transfer') COLLATE utf8mb4_unicode_ci DEFAULT 'Cash',
  `nominal_bayar` decimal(12,2) DEFAULT '0.00',
  `kembalian` decimal(12,2) DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `transaksi_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaksi`
--

LOCK TABLES `transaksi` WRITE;
/*!40000 ALTER TABLE `transaksi` DISABLE KEYS */;
INSERT INTO `transaksi` VALUES (1,1,'2026-04-20 22:31:47',75000.00,'2026-04-20 15:31:47','Cash',0.00,0.00),(2,1,'2026-04-20 22:31:51',75000.00,'2026-04-20 15:31:51','Cash',0.00,0.00),(3,1,'2026-04-20 22:31:55',75000.00,'2026-04-20 15:31:55','Cash',0.00,0.00),(4,1,'2026-04-20 22:32:10',130000.00,'2026-04-20 15:32:10','Cash',0.00,0.00),(5,1,'2026-04-20 22:32:30',97000.00,'2026-04-20 15:32:30','Cash',0.00,0.00),(6,1,'2026-04-20 22:38:02',1000.00,'2026-04-20 15:38:02','Cash',0.00,0.00),(7,1,'2026-04-20 22:49:30',1000.00,'2026-04-20 15:49:30','Cash',0.00,0.00),(8,1,'2026-04-20 22:50:04',10000.00,'2026-04-20 15:50:04','Cash',0.00,0.00),(9,1,'2026-04-21 07:35:55',666.00,'2026-04-21 00:35:55','Cash',0.00,0.00),(10,1,'2026-04-21 07:36:00',666.00,'2026-04-21 00:36:00','Cash',0.00,0.00),(11,1,'2026-04-21 07:36:05',999.00,'2026-04-21 00:36:05','Cash',0.00,0.00),(12,1,'2026-04-21 07:39:34',2442.00,'2026-04-21 00:39:34','Cash',0.00,0.00),(13,1,'2026-04-21 07:40:56',1443.00,'2026-04-21 00:40:56','Cash',0.00,0.00),(14,3,'2026-04-21 07:43:13',444.00,'2026-04-21 00:43:13','Cash',0.00,0.00),(15,1,'2026-04-21 08:52:20',4218.00,'2026-04-21 01:52:20','Cash',0.00,0.00),(16,1,'2026-04-21 17:20:26',999.00,'2026-04-21 10:20:26','Cash',0.00,0.00),(17,1,'2026-04-21 17:22:44',444.00,'2026-04-21 10:22:44','Cash',0.00,0.00),(18,1,'2026-04-21 17:23:03',3441.00,'2026-04-21 10:23:03','Cash',0.00,0.00),(19,1,'2026-04-21 20:38:15',1776.00,'2026-04-21 13:38:15','Cash',0.00,0.00),(20,1,'2026-04-21 20:38:19',555.00,'2026-04-21 13:38:19','Cash',0.00,0.00),(21,1,'2026-04-21 20:38:28',777.00,'2026-04-21 13:38:28','Cash',0.00,0.00),(22,1,'2026-04-21 20:38:33',333.00,'2026-04-21 13:38:33','Cash',0.00,0.00),(23,1,'2026-04-21 20:38:40',1110.00,'2026-04-21 13:38:40','Cash',0.00,0.00),(24,1,'2026-04-21 21:37:42',444.00,'2026-04-21 14:37:42','Cash',0.00,0.00),(25,1,'2026-04-21 21:59:47',3330.00,'2026-04-21 14:59:47','Cash',0.00,0.00),(26,1,'2026-04-21 21:59:51',666.00,'2026-04-21 14:59:51','Cash',0.00,0.00),(27,1,'2026-04-21 22:06:05',777.00,'2026-04-21 15:06:05','Cash',0.00,0.00),(28,1,'2026-04-21 22:06:08',444.00,'2026-04-21 15:06:08','Cash',0.00,0.00),(29,1,'2026-04-22 08:29:09',1332.00,'2026-04-22 01:29:09','Cash',0.00,0.00),(30,1,'2026-04-22 08:30:52',1665.00,'2026-04-22 01:30:52','Cash',0.00,0.00),(31,1,'2026-04-22 08:30:55',333.00,'2026-04-22 01:30:55','Cash',0.00,0.00),(32,1,'2026-04-22 08:45:31',666.00,'2026-04-22 01:45:31','Transfer',666.00,0.00),(33,1,'2026-04-23 08:24:46',999.00,'2026-04-23 01:24:46','Cash',100000.00,99001.00),(34,1,'2026-04-23 08:28:39',333.00,'2026-04-23 01:28:39','Transfer',333.00,0.00),(35,1,'2026-04-23 08:33:43',333.00,'2026-04-23 01:33:43','Cash',1111.00,778.00),(36,1,'2026-04-23 09:19:07',1998.00,'2026-04-23 02:19:07','Cash',11111.00,9113.00),(37,1,'2026-04-24 07:42:50',666.00,'2026-04-24 00:42:50','Cash',11111.00,10445.00),(38,1,'2026-04-29 08:23:09',1332.00,'2026-04-29 01:23:09','Cash',1332.00,0.00),(39,1,'2026-05-02 08:06:43',1000.00,'2026-05-02 01:06:43','Cash',1000.00,0.00);
/*!40000 ALTER TABLE `transaksi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `unit_usaha`
--

DROP TABLE IF EXISTS `unit_usaha`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `unit_usaha` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama_unit` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deskripsi` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unit_usaha`
--

LOCK TABLES `unit_usaha` WRITE;
/*!40000 ALTER TABLE `unit_usaha` DISABLE KEYS */;
INSERT INTO `unit_usaha` VALUES (6,'TOKO TANI','TEST','2026-04-21 00:35:15','2026-04-21 00:35:15');
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
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama_lengkap` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('admin','pengurus','operator','auditor') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'operator',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` enum('active','nonactive') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','$2b$10$GLGHNKV8G6sDvLt5aomS4uYV5mZhNtFMHCG39fzDSVLx.gmQ.zYwy','Administrator Koperasi',NULL,'admin','2026-04-20 15:28:50','2026-04-20 15:28:50','active'),(3,'operator','$2b$10$2EGxVJYAGMLtdEqU.gcgtumIaHevs4mRj2jk4CwmUbs.rOlE2/WNi','Operator Kasir','operator@testdev.com','operator','2026-04-20 15:28:50','2026-04-29 02:01:06','active'),(4,'auditor','$2b$10$KXlZ3C6StUd8bNEx/SB1nuVo0PooJCjESqKaV6H7.c0QkDJTaSP9C','Auditor Koperasi',NULL,'auditor','2026-04-20 15:28:50','2026-04-21 00:37:02','active'),(18,'robot99','$2b$10$vlHls9ZkguNenH1KmUgBF.16pEu4DMv7SASawgxuEptFGmrkqRl16','Test Robot',NULL,'pengurus','2026-04-26 13:09:04','2026-04-29 00:48:21','nonactive');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-02  8:54:17
