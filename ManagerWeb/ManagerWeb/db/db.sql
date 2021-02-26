-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: localhost    Database: express
-- ------------------------------------------------------
-- Server version	5.5.27

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
-- Table structure for table `tb_express_no`
--

DROP TABLE IF EXISTS `tb_express_no`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tb_express_no` (
  `id` varchar(32) NOT NULL,
  `create_time` datetime DEFAULT NULL,
  `deleted` bit(1) NOT NULL,
  `last_update_time` datetime DEFAULT NULL,
  `buyer_id` varchar(255) DEFAULT NULL,
  `info` varchar(255) DEFAULT NULL,
  `messager_id` varchar(255) DEFAULT NULL,
  `num` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKs130qnhs1d34e45aof3clijlb` (`buyer_id`),
  KEY `FK6l6qyyu3u7p8d66xkyhn7w5uv` (`messager_id`),
  CONSTRAINT `FK6l6qyyu3u7p8d66xkyhn7w5uv` FOREIGN KEY (`messager_id`) REFERENCES `tb_user` (`id`),
  CONSTRAINT `FKs130qnhs1d34e45aof3clijlb` FOREIGN KEY (`buyer_id`) REFERENCES `tb_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_express_no`
--

LOCK TABLES `tb_express_no` WRITE;
/*!40000 ALTER TABLE `tb_express_no` DISABLE KEYS */;
INSERT INTO `tb_express_no` VALUES ('4028e381684fda5401684fdac18e0000','2019-01-15 04:52:43','\0','2019-01-15 04:52:43','1',NULL,'4028e381684fd63f01684fd6c1c70000','ddfadfd');
/*!40000 ALTER TABLE `tb_express_no` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_system_menu`
--

DROP TABLE IF EXISTS `tb_system_menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tb_system_menu` (
  `id` varchar(32) NOT NULL,
  `create_time` datetime DEFAULT NULL,
  `deleted` bit(1) NOT NULL,
  `last_update_time` datetime DEFAULT NULL,
  `checked` bit(1) NOT NULL,
  `expand` bit(1) NOT NULL,
  `icon` varchar(32) DEFAULT NULL,
  `icon_cls` varchar(32) DEFAULT NULL,
  `leaf` bit(1) NOT NULL,
  `name` varchar(256) DEFAULT NULL,
  `order_number` int(11) NOT NULL,
  `p_id` varchar(255) DEFAULT NULL,
  `tab_icon` varchar(32) DEFAULT NULL,
  `type` varchar(32) DEFAULT NULL,
  `app_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK26wlaxnq7ei31a59vpn0c2afg` (`p_id`),
  CONSTRAINT `FK26wlaxnq7ei31a59vpn0c2afg` FOREIGN KEY (`p_id`) REFERENCES `tb_system_menu` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_system_menu`
--

LOCK TABLES `tb_system_menu` WRITE;
/*!40000 ALTER TABLE `tb_system_menu` DISABLE KEYS */;
INSERT INTO `tb_system_menu` VALUES ('4028e381684f559f01684f55aa900000','2019-01-15 02:27:20','\0','2019-01-15 02:27:20','\0','',NULL,NULL,'\0','系统',0,NULL,NULL,'nt_menu',NULL),('4028e381684f559f01684f55aaa00001','2019-01-15 02:27:20','\0','2019-01-15 02:27:20','\0','',NULL,'icon-home','\0','管理',0,'4028e381684f559f01684f55aa900000',NULL,'nt_menu',NULL),('4028e381684f559f01684f55aaa00002','2019-01-15 02:27:20','\0','2019-01-15 02:27:20','\0','',NULL,'icon-user','','用户管理',1,'4028e381684f559f01684f55aaa00001','user','nt_menu','/user/showList'),('4028e381684f559f01684f55aaa00003','2019-01-15 02:27:20','\0','2019-01-15 02:27:20','\0','',NULL,'icon-umbrella','','快递单管理',2,'4028e381684f559f01684f55aaa00001','user','nt_menu','/expressNo/showList');
/*!40000 ALTER TABLE `tb_system_menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_user`
--

DROP TABLE IF EXISTS `tb_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tb_user` (
  `id` varchar(32) NOT NULL,
  `create_time` datetime DEFAULT NULL,
  `deleted` bit(1) NOT NULL,
  `last_update_time` datetime DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `role_code` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_user`
--

LOCK TABLES `tb_user` WRITE;
/*!40000 ALTER TABLE `tb_user` DISABLE KEYS */;
INSERT INTO `tb_user` VALUES ('1',NULL,'\0','2019-01-15 03:13:44','fdsddssd','Admin','1','17680152172','buyer'),('4028e381684fd63f01684fd6c1c70000','2019-01-15 04:48:20','\0','2019-01-15 04:52:35','fdadfddfdc','lily','1','ssdfdd','messager');
/*!40000 ALTER TABLE `tb_user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-01-15 14:23:33
