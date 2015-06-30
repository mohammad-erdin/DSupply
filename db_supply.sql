/*
Navicat MySQL Data Transfer

Source Server         : Local Pisan
Source Server Version : 50616
Source Host           : 127.0.0.1:3306
Source Database       : db_supply

Target Server Type    : MYSQL
Target Server Version : 50616
File Encoding         : 65001

Date: 2015-01-15 15:33:12
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for d_cabang
-- ----------------------------
DROP TABLE IF EXISTS `d_cabang`;
CREATE TABLE `d_cabang` (
  `ID_Cabang` int(3) NOT NULL AUTO_INCREMENT,
  `Nama` varchar(30) NOT NULL,
  `Alamat` varchar(100) NOT NULL,
  PRIMARY KEY (`ID_Cabang`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of d_cabang
-- ----------------------------
INSERT INTO `d_cabang` VALUES ('1', 'Cabang Antapani', 'Jl Antapani No 2');
INSERT INTO `d_cabang` VALUES ('2', 'Cabang Buah Batu', 'Jl Candrawulan no 23');
INSERT INTO `d_cabang` VALUES ('3', 'Cabang Garut', 'Jl. Ahmad Yani No 6');
INSERT INTO `d_cabang` VALUES ('4', 'Cabang Pasteur', 'Jl BTC No 3');
INSERT INTO `d_cabang` VALUES ('5', 'Cabang Cijerah', 'Jl Manawi No 10');
INSERT INTO `d_cabang` VALUES ('6', 'Cabang Setiabudi', 'Jl UPI No 19');
INSERT INTO `d_cabang` VALUES ('7', 'Cabang Cibiru', 'Jl Angrek No 5');
INSERT INTO `d_cabang` VALUES ('8', 'Cabang Subang', 'Jl Otto Iskandar Dinata No 10');
INSERT INTO `d_cabang` VALUES ('9', 'Cabang Cileunyi', 'Jl Damai No 3');

-- ----------------------------
-- Table structure for d_karyawan
-- ----------------------------
DROP TABLE IF EXISTS `d_karyawan`;
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

-- ----------------------------
-- Records of d_karyawan
-- ----------------------------
INSERT INTO `d_karyawan` VALUES ('121766', 'Egy Mohammad Erdin', 'L', 'Alamat 6', '40009', '1', '827ccb0eea8a706c4c34a16891f84e7b', '1', 'K');
INSERT INTO `d_karyawan` VALUES ('125130', 'Sudarland', 'L', 'Alamat 2', '230402', '0', '', '3', 'K');
INSERT INTO `d_karyawan` VALUES ('139712', 'Aldy Ahmad Rifani', 'L', 'Alamat 5', '710751', '0', '', '6', 'K');
INSERT INTO `d_karyawan` VALUES ('150520', 'Tresna Gumelar', 'L', 'Alamat 4', '856909', '0', '', '3', 'K');
INSERT INTO `d_karyawan` VALUES ('164407', 'Bayu Rifqi', 'P', 'Alamat 8', '291904', '0', '', '2', 'K');
INSERT INTO `d_karyawan` VALUES ('175261', 'Irhas Geni', 'L', 'Alamat 9', '365538', '0', '', '9', 'P');
INSERT INTO `d_karyawan` VALUES ('187799', 'Aldy Taher', 'P', 'Alamat 1', '554465', '0', '', '5', 'K');

-- ----------------------------
-- Table structure for d_supply
-- ----------------------------
DROP TABLE IF EXISTS `d_supply`;
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

-- ----------------------------
-- Records of d_supply
-- ----------------------------
INSERT INTO `d_supply` VALUES ('11', '2014-11-30 22:24:48', 'In', '121766', '1');
INSERT INTO `d_supply` VALUES ('12', '2014-12-08 07:51:51', 'Out', '121766', '1');
INSERT INTO `d_supply` VALUES ('13', '2014-12-14 23:36:41', 'In', '121766', '1');
INSERT INTO `d_supply` VALUES ('14', '2014-12-14 23:37:42', 'Out', '121766', '1');
INSERT INTO `d_supply` VALUES ('15', '2014-12-15 05:42:30', 'In', '121766', '2');
INSERT INTO `d_supply` VALUES ('16', '2014-12-15 05:43:39', 'Out', '121766', '2');
INSERT INTO `d_supply` VALUES ('17', '2014-12-15 05:45:39', 'In', '121766', '2');
INSERT INTO `d_supply` VALUES ('18', '2014-12-15 05:48:38', 'In', '121766', '3');
INSERT INTO `d_supply` VALUES ('19', '2014-12-15 06:42:36', 'Out', '121766', '3');
INSERT INTO `d_supply` VALUES ('20', '2014-12-15 06:44:08', 'In', '121766', '3');
INSERT INTO `d_supply` VALUES ('21', '2014-12-15 06:45:16', 'In', '121766', '6');
INSERT INTO `d_supply` VALUES ('22', '2014-12-15 06:45:47', 'Out', '121766', '6');
INSERT INTO `d_supply` VALUES ('23', '2014-12-15 08:46:26', 'In', '121766', '9');

-- ----------------------------
-- Table structure for d_supply_detail
-- ----------------------------
DROP TABLE IF EXISTS `d_supply_detail`;
CREATE TABLE `d_supply_detail` (
  `ID_Supply` int(3) NOT NULL,
  `ID_Jenis` int(3) NOT NULL,
  `Jumlah` int(6) NOT NULL,
  KEY `ID_Supply` (`ID_Supply`),
  KEY `ID_Jenis` (`ID_Jenis`),
  CONSTRAINT `d_supply_detail_ibfk_1` FOREIGN KEY (`ID_Supply`) REFERENCES `d_supply` (`ID_Supply`),
  CONSTRAINT `d_supply_detail_ibfk_2` FOREIGN KEY (`ID_Jenis`) REFERENCES `r_jenis_bahan` (`ID_Jenis`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of d_supply_detail
-- ----------------------------
INSERT INTO `d_supply_detail` VALUES ('11', '2', '2');
INSERT INTO `d_supply_detail` VALUES ('12', '2', '1');
INSERT INTO `d_supply_detail` VALUES ('13', '2', '20');
INSERT INTO `d_supply_detail` VALUES ('13', '3', '20');
INSERT INTO `d_supply_detail` VALUES ('13', '6', '20');
INSERT INTO `d_supply_detail` VALUES ('14', '2', '10');
INSERT INTO `d_supply_detail` VALUES ('14', '3', '5');
INSERT INTO `d_supply_detail` VALUES ('14', '6', '15');
INSERT INTO `d_supply_detail` VALUES ('15', '2', '10');
INSERT INTO `d_supply_detail` VALUES ('15', '3', '10');
INSERT INTO `d_supply_detail` VALUES ('16', '2', '9');
INSERT INTO `d_supply_detail` VALUES ('16', '3', '5');
INSERT INTO `d_supply_detail` VALUES ('17', '2', '5');
INSERT INTO `d_supply_detail` VALUES ('18', '2', '30');
INSERT INTO `d_supply_detail` VALUES ('19', '2', '29');
INSERT INTO `d_supply_detail` VALUES ('20', '2', '10');
INSERT INTO `d_supply_detail` VALUES ('21', '2', '80');
INSERT INTO `d_supply_detail` VALUES ('22', '2', '50');
INSERT INTO `d_supply_detail` VALUES ('23', '2', '10');
INSERT INTO `d_supply_detail` VALUES ('23', '3', '20');

-- ----------------------------
-- Table structure for r_jenis_bahan
-- ----------------------------
DROP TABLE IF EXISTS `r_jenis_bahan`;
CREATE TABLE `r_jenis_bahan` (
  `ID_Jenis` int(3) NOT NULL AUTO_INCREMENT,
  `Nama_Bahan` varchar(30) NOT NULL,
  `Satuan_Bahan` varchar(10) NOT NULL,
  PRIMARY KEY (`ID_Jenis`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of r_jenis_bahan
-- ----------------------------
INSERT INTO `r_jenis_bahan` VALUES ('2', 'Tabung Gas 3KG', 'Buah');
INSERT INTO `r_jenis_bahan` VALUES ('3', 'Tabung Gas 10KG', 'Buah');
INSERT INTO `r_jenis_bahan` VALUES ('6', 'Kedelai', 'Kilo');
INSERT INTO `r_jenis_bahan` VALUES ('7', 'Tepung', 'Kilo');
INSERT INTO `r_jenis_bahan` VALUES ('9', 'Bahan Pengawet', 'Lusin');
INSERT INTO `r_jenis_bahan` VALUES ('10', 'Bumbu X', 'Lusin');
