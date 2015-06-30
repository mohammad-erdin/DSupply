-- MySQL dump 10.13  Distrib 5.6.16, for Win32 (x86)
--
-- Host: localhost    Database: db_supply
-- ------------------------------------------------------
-- Server version	5.6.16

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `d_cabang`
--

DROP TABLE IF EXISTS `d_cabang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `d_cabang` (
  `ID_Cabang` int(3) NOT NULL AUTO_INCREMENT,
  `Nama` varchar(30) NOT NULL,
  `Alamat` varchar(100) NOT NULL,
  PRIMARY KEY (`ID_Cabang`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `d_cabang`
--

LOCK TABLES `d_cabang` WRITE;
/*!40000 ALTER TABLE `d_cabang` DISABLE KEYS */;
INSERT INTO `d_cabang` VALUES (1,'Cabang Antapani','Jl Antapani No 2'),(2,'Cabang Buah Batu','Jl Candrawulan no 23'),(3,'Cabang Garut','Jl. Ahmad Yani No 6'),(4,'Cabang Pasteur','Jl BTC No 3'),(5,'Cabang Cijerah','Jl Manawi No 10'),(6,'Cabang Setiabudi','Jl UPI No 19'),(7,'Cabang Cibiru','Jl Angrek No 5'),(8,'Cabang Subang','Jl Otto Iskandar Dinata No 10'),(9,'Cabang Cileunyi','Jl Damai No 3');
/*!40000 ALTER TABLE `d_cabang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `d_karyawan`
--

DROP TABLE IF EXISTS `d_karyawan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `d_karyawan` (
  `NIK` char(6) NOT NULL,
  `Nama` varchar(30) NOT NULL,
  `Jenkel` enum('L','P') NOT NULL,
  `Alamat` varchar(100) DEFAULT NULL,
  `Telp` varchar(15) DEFAULT NULL,
  `UserLogin` char(1) NOT NULL,
  `Password` char(32) NOT NULL,
  `ID_Cabang` int(3) NOT NULL,
  `Pimpinan` enum('K','P') NOT NULL DEFAULT 'K',
  PRIMARY KEY (`NIK`),
  KEY `ID_Cabang` (`ID_Cabang`),
  CONSTRAINT `d_karyawan_ibfk_1` FOREIGN KEY (`ID_Cabang`) REFERENCES `d_cabang` (`ID_Cabang`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `d_karyawan`
--

LOCK TABLES `d_karyawan` WRITE;
/*!40000 ALTER TABLE `d_karyawan` DISABLE KEYS */;
INSERT INTO `d_karyawan` VALUES ('121766','Egy Mohammad Erdin','L','Alamat 6','40009','1','827ccb0eea8a706c4c34a16891f84e7b',1,'P'),('125130','Sudarland','L','Alamat 2','230402','0','',3,'K'),('139712','Aldy Ahmad Rifani','L','Alamat 5','710751','0','',6,'K'),('150520','Tresna Gumelar','L','Alamat 4','856909','0','',3,'K'),('164407','Bayu Rifqi','P','Alamat 8','291904','0','',2,'K'),('175261','Irhas Geni','L','Alamat 9','365538','0','',9,'K'),('187799','Aldy Taher','P','Alamat 1','554465','0','',5,'K');
/*!40000 ALTER TABLE `d_karyawan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `d_supply`
--

DROP TABLE IF EXISTS `d_supply`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `d_supply` (
  `ID_Supply` int(3) NOT NULL AUTO_INCREMENT,
  `Tgl_entry` datetime NOT NULL,
  `Status` enum('In','Out') NOT NULL,
  `NIK` char(6) NOT NULL,
  `ID_Cabang` int(3) NOT NULL,
  PRIMARY KEY (`ID_Supply`),
  KEY `NIK` (`NIK`),
  KEY `d_supply_ibfk_2` (`ID_Cabang`),
  CONSTRAINT `d_supply_ibfk_1` FOREIGN KEY (`NIK`) REFERENCES `d_karyawan` (`NIK`),
  CONSTRAINT `d_supply_ibfk_2` FOREIGN KEY (`ID_Cabang`) REFERENCES `d_cabang` (`ID_Cabang`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `d_supply`
--

LOCK TABLES `d_supply` WRITE;
/*!40000 ALTER TABLE `d_supply` DISABLE KEYS */;
INSERT INTO `d_supply` VALUES (11,'2014-11-30 22:24:48','In','121766',1),(12,'2014-12-08 07:51:51','Out','121766',1),(13,'2014-12-14 23:36:41','In','121766',1),(14,'2014-12-14 23:37:42','Out','121766',1),(15,'2014-12-15 05:42:30','In','121766',2),(16,'2014-12-15 05:43:39','Out','121766',2),(17,'2014-12-15 05:45:39','In','121766',2),(18,'2014-12-15 05:48:38','In','121766',3),(19,'2014-12-15 06:42:36','Out','121766',3),(20,'2014-12-15 06:44:08','In','121766',3),(21,'2014-12-15 06:45:16','In','121766',6),(22,'2014-12-15 06:45:47','Out','121766',6),(23,'2014-12-15 08:46:26','In','121766',9);
/*!40000 ALTER TABLE `d_supply` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `d_supply_detail`
--

DROP TABLE IF EXISTS `d_supply_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `d_supply_detail` (
  `ID_Supply` int(3) NOT NULL,
  `ID_Jenis` int(3) NOT NULL,
  `Jumlah` int(6) NOT NULL,
  KEY `ID_Supply` (`ID_Supply`),
  KEY `ID_Jenis` (`ID_Jenis`),
  CONSTRAINT `d_supply_detail_ibfk_1` FOREIGN KEY (`ID_Supply`) REFERENCES `d_supply` (`ID_Supply`),
  CONSTRAINT `d_supply_detail_ibfk_2` FOREIGN KEY (`ID_Jenis`) REFERENCES `r_jenis_bahan` (`ID_Jenis`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `d_supply_detail`
--

LOCK TABLES `d_supply_detail` WRITE;
/*!40000 ALTER TABLE `d_supply_detail` DISABLE KEYS */;
INSERT INTO `d_supply_detail` VALUES (11,2,2),(12,2,1),(13,2,20),(13,3,20),(13,6,20),(14,2,10),(14,3,5),(14,6,15),(15,2,10),(15,3,10),(16,2,9),(16,3,5),(17,2,5),(18,2,30),(19,2,29),(20,2,10),(21,2,80),(22,2,50),(23,2,10),(23,3,20);
/*!40000 ALTER TABLE `d_supply_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `r_jenis_bahan`
--

DROP TABLE IF EXISTS `r_jenis_bahan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `r_jenis_bahan` (
  `ID_Jenis` int(3) NOT NULL AUTO_INCREMENT,
  `Nama_Bahan` varchar(30) NOT NULL,
  `Satuan_Bahan` varchar(10) NOT NULL,
  PRIMARY KEY (`ID_Jenis`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `r_jenis_bahan`
--

LOCK TABLES `r_jenis_bahan` WRITE;
/*!40000 ALTER TABLE `r_jenis_bahan` DISABLE KEYS */;
INSERT INTO `r_jenis_bahan` VALUES (2,'Tabung Gas 3KG','Buah'),(3,'Tabung Gas 10KG','Buah'),(6,'Kedelai','Kilo'),(7,'Tepung','Kilo'),(9,'Bahan Pengawet','Lusin'),(10,'Bumbu X','Lusin');
/*!40000 ALTER TABLE `r_jenis_bahan` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-01-05 10:42:38
