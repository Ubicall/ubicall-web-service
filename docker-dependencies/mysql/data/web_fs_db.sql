-- MySQL dump 10.13  Distrib 5.1.73, for redhat-linux-gnu (x86_64)
--
-- Host: localhost    Database: WEB_FS_DB
-- ------------------------------------------------------
-- Server version	5.1.73

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
-- Current Database: `WEB_FS_DB`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `WEB_FS_DB` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `WEB_FS_DB`;

--
-- Table structure for table `acl_lists`
--

DROP TABLE IF EXISTS `acl_lists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `acl_lists` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `acl_name` varchar(128) NOT NULL,
  `default_policy` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `acl_lists`
--

LOCK TABLES `acl_lists` WRITE;
/*!40000 ALTER TABLE `acl_lists` DISABLE KEYS */;
INSERT INTO `acl_lists` VALUES (1,'rfc1918','deny'),(2,'lan','allow'),(3,'default','allow');
/*!40000 ALTER TABLE `acl_lists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `acl_nodes`
--

DROP TABLE IF EXISTS `acl_nodes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `acl_nodes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `cidr` varchar(45) NOT NULL,
  `type` varchar(16) NOT NULL,
  `list_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `acl_nodes`
--

LOCK TABLES `acl_nodes` WRITE;
/*!40000 ALTER TABLE `acl_nodes` DISABLE KEYS */;
INSERT INTO `acl_nodes` VALUES (1,'192.168.0.0/16','allow',1),(2,'10.0.0.0/8','allow',1),(3,'172.16.0.0/12','allow',1);
/*!40000 ALTER TABLE `acl_nodes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cdr`
--

DROP TABLE IF EXISTS `cdr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cdr` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `caller_id_name` varchar(255) NOT NULL DEFAULT '',
  `caller_id_number` varchar(255) NOT NULL DEFAULT '',
  `destination_number` varchar(255) NOT NULL DEFAULT '',
  `context` varchar(255) NOT NULL DEFAULT '',
  `start_stamp` varchar(255) NOT NULL DEFAULT '',
  `answer_stamp` varchar(255) NOT NULL DEFAULT '',
  `end_stamp` varchar(255) NOT NULL DEFAULT '',
  `duration` varchar(255) NOT NULL DEFAULT '',
  `billsec` varchar(255) NOT NULL DEFAULT '',
  `hangup_cause` varchar(255) NOT NULL DEFAULT '',
  `uuid` varchar(255) NOT NULL DEFAULT '',
  `bleg_uuid` varchar(255) NOT NULL DEFAULT '',
  `accountcode` varchar(255) NOT NULL DEFAULT '',
  `read_codec` varchar(255) NOT NULL DEFAULT '',
  `write_codec` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cdr`
--

LOCK TABLES `cdr` WRITE;
/*!40000 ALTER TABLE `cdr` DISABLE KEYS */;
/*!40000 ALTER TABLE `cdr` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conference_advertise`
--

DROP TABLE IF EXISTS `conference_advertise`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `conference_advertise` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `room` varchar(64) NOT NULL,
  `status` varchar(128) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_room` (`room`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conference_advertise`
--

LOCK TABLES `conference_advertise` WRITE;
/*!40000 ALTER TABLE `conference_advertise` DISABLE KEYS */;
INSERT INTO `conference_advertise` VALUES (1,'3000@$${domain}','Freeswitch Conference'),(2,'3001@$${domain}','FreeSWITCH Conference 2'),(3,'3002@$${domain}','FreeSWITCH Conference 3');
/*!40000 ALTER TABLE `conference_advertise` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conference_controls`
--

DROP TABLE IF EXISTS `conference_controls`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `conference_controls` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `conf_group` varchar(64) NOT NULL,
  `action` varchar(64) NOT NULL,
  `digits` varchar(16) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_group_action` (`conf_group`,`action`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conference_controls`
--

LOCK TABLES `conference_controls` WRITE;
/*!40000 ALTER TABLE `conference_controls` DISABLE KEYS */;
INSERT INTO `conference_controls` VALUES (1,'default','mute','0'),(2,'default','deaf_mute','*'),(3,'default','energy up','9'),(4,'default','energy equ','8'),(5,'default','energy dn','7'),(6,'default','vol talk up','3'),(7,'default','vol talk dn','1'),(8,'default','vol talk zero','2'),(9,'default','vol listen up','6'),(10,'default','vol listen dn','4'),(11,'default','vol listen zero','5'),(12,'default','hangup','#');
/*!40000 ALTER TABLE `conference_controls` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conference_profiles`
--

DROP TABLE IF EXISTS `conference_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `conference_profiles` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `profile_name` varchar(64) NOT NULL,
  `param_name` varchar(64) NOT NULL,
  `param_value` varchar(64) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `unique_profile_param` (`profile_name`,`param_name`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conference_profiles`
--

LOCK TABLES `conference_profiles` WRITE;
/*!40000 ALTER TABLE `conference_profiles` DISABLE KEYS */;
INSERT INTO `conference_profiles` VALUES (1,'default','domain','$${domain}'),(2,'default','rate','8000'),(3,'default','interval','20'),(4,'default','energy-level','300'),(5,'default','moh-sound','$${moh_uri}'),(6,'default','caller-id-name','$${outbound_caller_name}'),(7,'default','caller-id-number','$${outbound_caller_number}');
/*!40000 ALTER TABLE `conference_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dialplan`
--

DROP TABLE IF EXISTS `dialplan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dialplan` (
  `dialplan_id` int(11) NOT NULL AUTO_INCREMENT,
  `domain` varchar(128) NOT NULL,
  `ip_address` varchar(15) NOT NULL,
  PRIMARY KEY (`dialplan_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dialplan`
--

LOCK TABLES `dialplan` WRITE;
/*!40000 ALTER TABLE `dialplan` DISABLE KEYS */;
INSERT INTO `dialplan` VALUES (1,'freeswitch','127.0.0.1');
/*!40000 ALTER TABLE `dialplan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dialplan_actions`
--

DROP TABLE IF EXISTS `dialplan_actions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dialplan_actions` (
  `action_id` int(11) NOT NULL AUTO_INCREMENT,
  `condition_id` int(11) NOT NULL,
  `application` varchar(256) NOT NULL,
  `data` varchar(256) NOT NULL,
  `type` varchar(32) NOT NULL,
  `weight` int(11) NOT NULL,
  PRIMARY KEY (`action_id`)
) ENGINE=MyISAM AUTO_INCREMENT=170 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dialplan_actions`
--

LOCK TABLES `dialplan_actions` WRITE;
/*!40000 ALTER TABLE `dialplan_actions` DISABLE KEYS */;
INSERT INTO `dialplan_actions` VALUES (1,2,'deflect','${destination_number}','action',10),(2,5,'set','domain_name=$${domain}','action',20),(3,5,'set','domain_name=${sip_auth_realm}','anti-action',30),(4,7,'set','domain_name=$${domain}','action',40),(5,9,'set','open=true','action',50),(6,10,'answer','','action',60),(7,10,'intercept','${db(select/${domain_name}-last_dial/global)}','action',70),(8,10,'sleep','2000','action',80),(9,11,'answer','','action',90),(10,11,'intercept','${db(select/${domain_name}-last_dial/${callgroup})}','action',100),(11,11,'sleep','2000','action',110),(12,12,'answer','','action',120),(13,12,'intercept','${db(select/${domain_name}-last_dial_ext/$1)}','action',130),(14,12,'sleep','2000','action',140),(15,13,'transfer','${db(select/${domain_name}-last_dial/${caller_id_number})}','action',150),(16,14,'set','use_profile=${cond(${acl($${local_ip_v4} rfc1918)} == true ? nat : default)}','action',160),(17,14,'set','use_profile=${cond(${acl(${network_addr} rfc1918)} == true ? nat : default)}','anti-action',170),(18,15,'set_user','default@${domain_name}','action',180),(19,16,'info','','action',190),(20,17,'set','sip_secure_media=true','action',200),(21,18,'db','insert/${domain_name}-spymap/${caller_id_number}/${uuid}','action',210),(22,18,'db','insert/${domain_name}-last_dial/${caller_id_number}/${destination_number}','action',220),(23,18,'db','insert/${domain_name}-last_dial/global/${uuid}','action',230),(24,19,'eval','${snom_bind_key(2 off DND ${sip_from_user} ${sip_from_host} ${sofia_profile_name} message notused)}','action',240),(25,19,'transfer','3000','action',250),(26,20,'eval','${snom_bind_key(2 on DND ${sip_from_user} ${sip_from_host} ${sofia_profile_name} message api+uuid_transfer ${uuid} 9001)}','action',260),(27,20,'playback','$${hold_music}','action',270),(28,21,'answer','','action',280),(29,21,'eavesdrop','${db(select/${domain_name}-spymap/$1)}','action',290),(30,22,'answer','','action',300),(31,22,'set','eavesdrop_indicate_failed=tone_stream://%(500, 0, 320)','action',310),(32,22,'set','eavesdrop_indicate_new=tone_stream://%(500, 0, 620)','action',320),(33,22,'set','eavesdrop_indicate_idle=tone_stream://%(250, 0, 920)','action',330),(34,22,'eavesdrop','all','action',340),(35,23,'transfer','${db(select/${domain_name}-call_return/${caller_id_number})}','action',350),(36,24,'answer','','action',360),(37,24,'group','delete:$1@${domain_name}:${sofia_contact(${sip_from_user}@${domain_name})}','action',370),(38,24,'gentones','%(1000, 0, 320)','action',380),(39,25,'answer','','action',390),(40,25,'group','insert:$1@${domain_name}:${sofia_contact(${sip_from_user}@${domain_name})}','action',400),(41,25,'gentones','%(1000, 0, 640)','action',410),(42,26,'bridge','{ignore_early_media=true}${group(call:$1@${domain_name})}','action',420),(43,27,'set','call_timeout=10','action',430),(44,27,'bridge','{ignore_early_media=true}${group(call:$1@${domain_name}:order)}','action',440),(45,28,'set','dialed_extension=$1','action',450),(46,28,'export','sip_auto_answer=true','action',460),(47,28,'bridge','user/${dialed_extension}@${domain_name}','action',470),(48,29,'set','dialed_extension=$1','action',480),(49,29,'export','dialed_extension=$1','action',490),(50,30,'set','voicemail_authorized=${sip_authorized}','action',500),(51,30,'answer','','action',510),(52,30,'sleep','1000','action',520),(53,30,'voicemail','check default ${domain_name} ${dialed_extension}','action',530),(54,30,'bind_meta_app','1 b s execute_extension::dx XML features','anti-action',540),(55,30,'bind_meta_app','2 b s record_session::$${recordings_dir}/${caller_id_number}.${strftime(%Y-%m-%d-%H-%M-%S)}.wav','anti-action',550),(56,30,'bind_meta_app','3 b s execute_extension::cf XML features','anti-action',560),(57,30,'set','ringback=${us-ring}','anti-action',570),(58,30,'set','transfer_ringback=$${hold_music}','anti-action',580),(59,30,'set','call_timeout=30','anti-action',590),(60,30,'set','hangup_after_bridge=true','anti-action',600),(61,30,'set','continue_on_fail=true','anti-action',610),(62,30,'db','insert/${domain_name}-call_return/${dialed_extension}/${caller_id_number}','anti-action',620),(63,30,'db','insert/${domain_name}-last_dial_ext/${dialed_extension}/${uuid}','anti-action',630),(64,30,'set','called_party_callgroup=${user_data(${dialed_extension}@${domain_name} var callgroup)}','anti-action',640),(65,30,'db','insert/${domain_name}-last_dial/${called_party_callgroup}/${uuid}','anti-action',650),(66,30,'bridge','user/${dialed_extension}@${domain_name}','anti-action',660),(67,30,'answer','','anti-action',670),(68,30,'sleep','1000','anti-action',680),(69,30,'voicemail','default ${domain_name} ${dialed_extension}','anti-action',690),(70,31,'bridge','${group_call(sales@${domain_name})}','action',700),(71,32,'bridge','group/support@${domain_name}','action',710),(72,33,'bridge','group/billing@${domain_name}','action',720),(73,34,'set','transfer_ringback=$${hold_music}','action',730),(74,34,'transfer','1000 XML features','action',740),(75,35,'answer','','action',750),(76,35,'sleep','1000','action',760),(77,35,'voicemail','check default ${domain_name}','action',770),(78,36,'bridge','sofia/${use_profile}/$1','action',780),(79,37,'answer','','action',790),(80,37,'conference','$1-${domain_name}@default','action',800),(81,38,'answer','','action',810),(82,38,'conference','$1-${domain_name}@wideband','action',820),(83,39,'answer','','action',830),(84,39,'conference','$1-${domain_name}@ultrawideband','action',840),(85,40,'answer','','action',850),(86,40,'conference','$1-${domain_name}@cdquality','action',860),(87,41,'bridge','sofia/${use_profile}/$1@conference.freeswitch.org','action',870),(88,42,'set','conference_auto_outcall_caller_id_name=Mad Boss1','action',880),(89,42,'set','conference_auto_outcall_caller_id_number=0911','action',890),(90,42,'set','conference_auto_outcall_timeout=60','action',900),(91,42,'set','conference_auto_outcall_flags=mute','action',910),(92,42,'set','conference_auto_outcall_prefix={sip_auto_answer=true,execute_on_answer=\'bind_meta_app 2 a s1 intercept::${uuid}\'}','action',920),(93,42,'set','sip_exclude_contact=${network_addr}','action',930),(94,42,'conference_set_auto_outcall','${group_call(sales)}','action',940),(95,42,'conference','madboss_intercom1@default+flags{endconf|deaf}','action',950),(96,43,'set','conference_auto_outcall_caller_id_name=Mad Boss2','action',960),(97,43,'set','conference_auto_outcall_caller_id_number=0912','action',970),(98,43,'set','conference_auto_outcall_timeout=60','action',980),(99,43,'set','conference_auto_outcall_flags=mute','action',990),(100,43,'set','conference_auto_outcall_prefix={sip_auto_answer=true,execute_on_answer=\'bind_meta_app 2 a s1 intercept::${uuid}\'}','action',1000),(101,43,'set','sip_exclude_contact=${network_addr}','action',1010),(102,43,'conference_set_auto_outcall','loopback/9999','action',1020),(103,43,'conference','madboss_intercom2@default+flags{endconf|deaf}','action',1030),(104,44,'set','conference_auto_outcall_caller_id_name=Mad Boss','action',1040),(105,44,'set','conference_auto_outcall_caller_id_number=0911','action',1050),(106,44,'set','conference_auto_outcall_timeout=60','action',1060),(107,44,'set','conference_auto_outcall_flags=none','action',1070),(108,44,'conference_set_auto_outcall','loopback/9999','action',1080),(109,44,'conference','madboss3@default','action',1090),(110,45,'answer','','action',1100),(111,45,'sleep','2000','action',1110),(112,45,'ivr','demo_ivr','action',1120),(113,46,'conference','bridge:mydynaconf:sofia/${use_profile}/1234@conference.freeswitch.org','action',1130),(114,47,'answer','','action',1140),(115,47,'esf_page_group','','action',1150),(116,48,'set','fifo_music=$${hold_music}','action',1160),(117,48,'fifo','5900@${domain_name} in','action',1170),(118,49,'answer','','action',1180),(119,49,'fifo','5900@${domain_name} out nowait','action',1190),(120,51,'fifo','$1@${domain_name} in undef $${hold_music}','action',1200),(121,54,'answer','','action',1210),(122,54,'fifo','$1@${domain_name} out nowait','action',1220),(123,57,'','','expression',1230),(124,57,'fifo','$1@${domain_name} in undef $${hold_music}','action',1240),(125,60,'answer','','action',1250),(126,60,'fifo','$1@${domain_name} out nowait','action',1260),(127,61,'pre_answer','','action',1270),(128,61,'sleep','20000','action',1280),(129,61,'answer','','action',1290),(130,61,'sleep','1000','action',1300),(131,61,'playback','voicemail/vm-goodbye.wav','action',1310),(132,61,'hangup','','action',1320),(133,62,'ring_ready','','action',1330),(134,62,'sleep','20000','action',1340),(135,62,'answer','','action',1350),(136,62,'sleep','1000','action',1360),(137,62,'playback','voicemail/vm-goodbye.wav','action',1370),(138,62,'hangup','','action',1380),(139,63,'set','ringback=$${uk-ring}','action',1390),(140,63,'bridge','loopback/wait','action',1400),(141,64,'set','ringback=$${hold_music}','action',1410),(142,64,'bridge','loopback/wait','action',1420),(143,65,'set','transfer_ringback=$${uk-ring}','action',1430),(144,65,'answer','','action',1440),(145,65,'bridge','loopback/wait','action',1450),(146,66,'set','transfer_ringback=$${hold_music}','action',1460),(147,66,'answer','','action',1470),(148,66,'bridge','loopback/wait','action',1480),(149,67,'answer','','action',1490),(150,67,'info','','action',1500),(151,67,'sleep','250','action',1510),(152,67,'hangup','','action',1520),(153,68,'answer','','action',1530),(154,68,'record_fsv','/tmp/testrecord.fsv','action',1540),(155,69,'answer','','action',1550),(156,69,'play_fsv','/tmp/testrecord.fsv','action',1560),(157,70,'answer','','action',1570),(158,70,'delay_echo','5000','action',1580),(159,71,'answer','','action',1590),(160,71,'echo','','action',1600),(161,72,'answer','','action',1610),(162,72,'playback','tone_stream://%(10000,0,1004);loops=-1','action',1620),(163,73,'answer','','action',1630),(164,73,'playback','tone_stream://path=${base_dir}/conf/tetris.ttml;loops=10','action',1640),(165,75,'answer','','action',1650),(166,75,'execute_extension','is_secure XML features','action',1660),(167,75,'playback','$${hold_music}','action',1670),(168,75,'answer','','anti-action',1680),(169,75,'playback','$${hold_music}','anti-action',1690);
/*!40000 ALTER TABLE `dialplan_actions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dialplan_condition`
--

DROP TABLE IF EXISTS `dialplan_condition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dialplan_condition` (
  `condition_id` int(11) NOT NULL AUTO_INCREMENT,
  `extension_id` int(11) NOT NULL,
  `field` varchar(1238) NOT NULL,
  `expression` varchar(128) NOT NULL,
  `weight` int(11) NOT NULL,
  PRIMARY KEY (`condition_id`)
) ENGINE=MyISAM AUTO_INCREMENT=76 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dialplan_condition`
--

LOCK TABLES `dialplan_condition` WRITE;
/*!40000 ALTER TABLE `dialplan_condition` DISABLE KEYS */;
INSERT INTO `dialplan_condition` VALUES (1,1,'$${unroll_loops}','^true$',10),(2,1,'${sip_looped_call}','^true$',20),(3,2,'${domain_name}','^$',30),(4,2,'source','mod_sofia',40),(5,2,'${sip_auth_realm}','^$',50),(6,3,'${domain_name}','^$',60),(7,3,'source','mod_openzap',70),(8,4,'${strftime(%w)}','^([1-5])$',80),(9,4,'${strftime(%H%M)}','^((09|1[0-7])[0-5][0-9]|1800)$',90),(10,5,'destination_number','^886$',100),(11,6,'destination_number','^\\*8$',110),(12,7,'destination_number','^\\*\\*(\\d+)$',120),(13,8,'destination_number','^870$',130),(14,9,'${network_addr}','^$',140),(15,9,'${numbering_plan}','^$',150),(16,9,'${call_debug}','^true$',160),(17,9,'${sip_has_crypto}','^(AES_CM_128_HMAC_SHA1_32|AES_CM_128_HMAC_SHA1_80)$',170),(18,9,'','',180),(19,10,'destination_number','^9001$',190),(20,11,'destination_number','^9000$',200),(21,12,'destination_number','^88(.*)$|^\\*0(.*)$',210),(22,13,'destination_number','^779$',220),(23,14,'destination_number','^\\*69$|^869$|^lcr$',230),(24,15,'destination_number','^80(\\d{2})$',240),(25,16,'destination_number','^81(\\d{2})$',250),(26,17,'destination_number','^82(\\d{2})$',260),(27,18,'destination_number','^83(\\d{2})$',270),(28,19,'destination_number','^8(10[01][0-9])$',280),(29,20,'destination_number','^(20[01][0-9])$',290),(30,20,'destination_number','^${caller_id_number}$',300),(31,21,'destination_number','^3000$',310),(32,22,'destination_number','^3001$',320),(33,23,'destination_number','^3002$',330),(34,24,'destination_number','^operator$|^0$',340),(35,25,'destination_number','^vmain|4000$',350),(36,26,'destination_number','^sip:(.*)$',360),(37,27,'destination_number','^(30\\d{2})$',370),(38,28,'destination_number','^(31\\d{2})$',380),(39,29,'destination_number','^(32\\d{2})$',390),(40,30,'destination_number','^(33\\d{2})$',400),(41,31,'destination_number','^9(888|1616|3232)$',410),(42,32,'destination_number','^0911$',420),(43,33,'destination_number','^0912$',430),(44,34,'destination_number','^0913$',440),(45,35,'destination_number','^5000$',450),(46,36,'destination_number','^5001$',460),(47,37,'destination_number','^pagegroup$|^7243',470),(48,38,'destination_number','^5900$',480),(49,39,'destination_number','^5901$',490),(50,40,'source','mod_sofia',500),(51,40,'destination_number','park\\+(\\d+)',510),(52,41,'source','mod_sofia',520),(53,41,'destination_number','^parking$',530),(54,41,'${sip_to_params}','fifo\\=(\\d+)',540),(55,42,'source','mod_sofia',550),(56,42,'destination_number','callpark',560),(57,42,'${sip_refer_to}','',570),(58,43,'source','mod_sofia',580),(59,43,'destination_number','pickup',590),(60,43,'${sip_to_params}','orbit\\=(\\d+)',600),(61,44,'destination_number','^wait$',610),(62,45,'destination_number','^9980$',620),(63,46,'destination_number','^9981$',630),(64,47,'destination_number','^9982$',640),(65,48,'destination_number','^9983$',650),(66,49,'destination_number','^9984$',660),(67,50,'destination_number','^9992$',670),(68,51,'destination_number','^9993$',680),(69,52,'destination_number','^9994$',690),(70,53,'destination_number','^9995$',700),(71,54,'destination_number','^9996$',710),(72,55,'destination_number','^9997$',720),(73,56,'destination_number','^9998$',730),(74,57,'destination_number','^9999$',740),(75,57,'${sip_has_crypto}','^(AES_CM_128_HMAC_SHA1_32|AES_CM_128_HMAC_SHA1_80)$',750);
/*!40000 ALTER TABLE `dialplan_condition` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dialplan_context`
--

DROP TABLE IF EXISTS `dialplan_context`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dialplan_context` (
  `context_id` int(11) NOT NULL AUTO_INCREMENT,
  `dialplan_id` int(11) NOT NULL,
  `context` varchar(64) NOT NULL,
  `weight` int(11) NOT NULL,
  PRIMARY KEY (`context_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dialplan_context`
--

LOCK TABLES `dialplan_context` WRITE;
/*!40000 ALTER TABLE `dialplan_context` DISABLE KEYS */;
INSERT INTO `dialplan_context` VALUES (1,1,'default',10),(2,1,'public',20);
/*!40000 ALTER TABLE `dialplan_context` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dialplan_extension`
--

DROP TABLE IF EXISTS `dialplan_extension`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dialplan_extension` (
  `extension_id` int(11) NOT NULL AUTO_INCREMENT,
  `context_id` int(11) NOT NULL,
  `name` varchar(128) NOT NULL,
  `continue` varchar(32) NOT NULL,
  `weight` int(11) NOT NULL,
  PRIMARY KEY (`extension_id`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dialplan_extension`
--

LOCK TABLES `dialplan_extension` WRITE;
/*!40000 ALTER TABLE `dialplan_extension` DISABLE KEYS */;
INSERT INTO `dialplan_extension` VALUES (1,1,'unloop','',10),(2,1,'set_domain','true',20),(3,1,'set_domain_openzap','true',30),(4,1,'tod_example','true',40),(5,1,'global-intercept','',50),(6,1,'group-intercept','',60),(7,1,'intercept-ext','',70),(8,1,'redial','',80),(9,1,'global','true',90),(10,1,'snom-demo-2','',100),(11,1,'snom-demo-1','',110),(12,1,'eavesdrop','',120),(13,1,'eavesdrop','',130),(14,1,'call_return','',140),(15,1,'del-group','',150),(16,1,'add-group','',160),(17,1,'call-group-simo','',170),(18,1,'call-group-order','',180),(19,1,'extension-intercom','',190),(20,1,'Local_Extension','',200),(21,1,'group_dial_sales','',210),(22,1,'group_dial_support','',220),(23,1,'group_dial_billing','',230),(24,1,'operator','',240),(25,1,'vmain','',250),(26,1,'sip_uri','',260),(27,1,'nb_conferences','',270),(28,1,'wb_conferences','',280),(29,1,'uwb_conferences','',290),(30,1,'cdquality_conferences','',300),(31,1,'freeswitch_public_conf_via_sip','',310),(32,1,'mad_boss_intercom','',320),(33,1,'mad_boss_intercom','',330),(34,1,'mad_boss','',340),(35,1,'ivr_demo','',350),(36,1,'dyanmic conference','',360),(37,1,'rtp_multicast_page','',370),(38,1,'park','',380),(39,1,'unpark','',390),(40,1,'park','',400),(41,1,'unpark','',410),(42,1,'park','',420),(43,1,'unpark','',430),(44,1,'wait','',440),(45,1,'ringback_180','',450),(46,1,'ringback_183_uk_ring','',460),(47,1,'ringback_183_music_ring','',470),(48,1,'ringback_post_answer_uk_ring','',480),(49,1,'ringback_post_answer_music','',490),(50,1,'show_info','',500),(51,1,'video_record','',510),(52,1,'video_playback','',520),(53,1,'delay_echo','',530),(54,1,'echo','',540),(55,1,'milliwatt','',550),(56,2,'tone_stream','',560),(57,2,'hold_music','',570);
/*!40000 ALTER TABLE `dialplan_extension` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dialplan_special`
--

DROP TABLE IF EXISTS `dialplan_special`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dialplan_special` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `context` varchar(255) NOT NULL,
  `class_file` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_context` (`context`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dialplan_special`
--

LOCK TABLES `dialplan_special` WRITE;
/*!40000 ALTER TABLE `dialplan_special` DISABLE KEYS */;
/*!40000 ALTER TABLE `dialplan_special` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dingaling_profile_params`
--

DROP TABLE IF EXISTS `dingaling_profile_params`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dingaling_profile_params` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `dingaling_id` int(10) unsigned NOT NULL,
  `param_name` varchar(64) NOT NULL,
  `param_value` varchar(64) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_type_name` (`dingaling_id`,`param_name`),
  CONSTRAINT `dingaling_profile` FOREIGN KEY (`dingaling_id`) REFERENCES `dingaling_profiles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dingaling_profile_params`
--

LOCK TABLES `dingaling_profile_params` WRITE;
/*!40000 ALTER TABLE `dingaling_profile_params` DISABLE KEYS */;
INSERT INTO `dingaling_profile_params` VALUES (1,1,'password','secret'),(2,1,'dialplan','XML,enum'),(3,1,'server','example.org'),(4,1,'name','fs.example.org');
/*!40000 ALTER TABLE `dingaling_profile_params` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dingaling_profiles`
--

DROP TABLE IF EXISTS `dingaling_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dingaling_profiles` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `profile_name` varchar(64) NOT NULL,
  `type` varchar(64) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_name` (`profile_name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dingaling_profiles`
--

LOCK TABLES `dingaling_profiles` WRITE;
/*!40000 ALTER TABLE `dingaling_profiles` DISABLE KEYS */;
INSERT INTO `dingaling_profiles` VALUES (1,'fs.intralanman.servehttp.com','component');
/*!40000 ALTER TABLE `dingaling_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dingaling_settings`
--

DROP TABLE IF EXISTS `dingaling_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dingaling_settings` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `param_name` varchar(64) NOT NULL,
  `param_value` varchar(64) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_param` (`param_name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dingaling_settings`
--

LOCK TABLES `dingaling_settings` WRITE;
/*!40000 ALTER TABLE `dingaling_settings` DISABLE KEYS */;
INSERT INTO `dingaling_settings` VALUES (1,'debug','0'),(2,'codec-prefs','$${global_codec_prefs}');
/*!40000 ALTER TABLE `dingaling_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `directory`
--

DROP TABLE IF EXISTS `directory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `directory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `domain_id` int(10) NOT NULL,
  `cache` int(10) NOT NULL,
  `creation_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=712 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `directory`
--

LOCK TABLES `directory` WRITE;
/*!40000 ALTER TABLE `directory` DISABLE KEYS */;
INSERT INTO `directory` VALUES (1,'1000',1,0,'0000-00-00 00:00:00'),(2,'1001',2,0,'0000-00-00 00:00:00'),(3,'1002',1,0,'0000-00-00 00:00:00'),(5,'1003',2,0,'0000-00-00 00:00:00'),(6,'1004',1,0,'0000-00-00 00:00:00'),(7,'1005',2,0,'0000-00-00 00:00:00'),(8,'1006',1,0,'0000-00-00 00:00:00'),(9,'1007',2,0,'0000-00-00 00:00:00'),(10,'2000',1,0,'0000-00-00 00:00:00'),(11,'1009',2,0,'0000-00-00 00:00:00'),(12,'50345',3,0,'0000-00-00 00:00:00'),(13,'8890000000000000012',5,0,'0000-00-00 00:00:00'),(14,'8890000000000000013',5,0,'0000-00-00 00:00:00'),(15,'8890000000000000014',5,0,'0000-00-00 00:00:00'),(16,'8890000000000000014',5,0,'0000-00-00 00:00:00'),(17,'8890000000000000014',5,0,'0000-00-00 00:00:00'),(18,'8890000000000000015',5,0,'0000-00-00 00:00:00'),(19,'8890000000000000016',5,0,'0000-00-00 00:00:00'),(20,'8890000000000000016',5,0,'0000-00-00 00:00:00'),(25,'8890000000000000021',5,0,'0000-00-00 00:00:00'),(22,'8890000000000000018',5,0,'0000-00-00 00:00:00'),(23,'8890000000000000019',5,0,'0000-00-00 00:00:00'),(26,'8890000000000000022',5,0,'0000-00-00 00:00:00'),(27,'8890000000000000023',5,0,'0000-00-00 00:00:00'),(28,'8890000000000000024',5,0,'0000-00-00 00:00:00'),(29,'8890000000000000025',5,0,'0000-00-00 00:00:00'),(30,'8890000000000000026',5,0,'0000-00-00 00:00:00'),(32,'8890000000000000028',5,0,'0000-00-00 00:00:00'),(33,'8890000000000000029',5,0,'0000-00-00 00:00:00'),(34,'8890000000000000030',5,0,'0000-00-00 00:00:00'),(35,'8890000000000000031',5,0,'0000-00-00 00:00:00'),(41,'8890000000000000037',5,0,'0000-00-00 00:00:00'),(37,'8890000000000000033',5,0,'0000-00-00 00:00:00'),(42,'8890000000000000038',5,0,'0000-00-00 00:00:00'),(40,'8890000000000000036',5,0,'0000-00-00 00:00:00'),(43,'8890000000000000039',5,0,'0000-00-00 00:00:00'),(44,'8890000000000000040',5,0,'0000-00-00 00:00:00'),(49,'8890000000000000045',5,0,'0000-00-00 00:00:00'),(50,'8890000000000000046',5,0,'0000-00-00 00:00:00'),(51,'88900001000300000253',5,0,'2015-07-21 16:14:20'),(101,'88900001000300000280',5,0,'2015-07-22 10:31:38'),(100,'88900001000300000279',5,0,'2015-07-22 10:31:38'),(99,'88900001000300000278',5,0,'2015-07-22 10:31:37'),(98,'88900001000300000277',5,0,'2015-07-22 10:29:06'),(97,'88900001000300000276',5,0,'2015-07-22 10:29:06'),(96,'88900001000300000275',5,0,'2015-07-22 10:29:06'),(95,'88900001000300000274',5,0,'2015-07-22 10:24:55'),(94,'88900001000300000273',5,0,'2015-07-22 10:24:50'),(93,'88900001000300000272',5,0,'2015-07-22 10:24:45'),(92,'88900001000300000271',5,0,'2015-07-22 10:24:18'),(91,'88900001000300000270',5,0,'2015-07-22 10:23:01'),(90,'88900001000300000269',5,0,'2015-07-22 10:22:51'),(89,'88900001000300000268',5,0,'2015-07-22 10:22:50'),(88,'88900001000300000267',5,0,'2015-07-22 10:22:36'),(87,'88900001000300000266',5,0,'2015-07-22 10:20:16'),(86,'88900001000300000265',5,0,'2015-07-22 09:50:10'),(85,'88900001000300000264',5,0,'2015-07-22 09:49:45'),(84,'88900001000300000263',5,0,'2015-07-22 09:49:01'),(83,'88900001000300000262',5,0,'2015-07-22 09:48:18'),(82,'88900001000300000261',5,0,'2015-07-22 09:46:56'),(81,'88900001000300000260',5,0,'2015-07-22 09:32:16'),(102,'88900001000300000281',5,0,'2015-07-22 10:34:53'),(103,'88900001000300000282',5,0,'2015-07-22 10:34:53'),(104,'88900001000300000283',5,0,'2015-07-22 10:34:53'),(105,'88900001000300000284',5,0,'2015-07-22 10:38:12'),(106,'88900001000300000285',5,0,'2015-07-22 10:38:13'),(107,'88900001000300000286',5,0,'2015-07-22 10:41:34'),(108,'88900001000300000287',5,0,'2015-07-22 10:41:39'),(109,'88900001000300000288',5,0,'2015-07-22 10:44:49'),(110,'88900001000300000289',5,0,'2015-07-22 10:55:47'),(111,'88900001000300000290',5,0,'2015-07-22 10:59:37'),(112,'88900001000300000291',5,0,'2015-07-22 10:59:39'),(113,'88900001000300000292',5,0,'2015-07-22 11:06:09'),(114,'88900001000300000293',5,0,'2015-07-22 11:06:16'),(115,'88900001000300000294',5,0,'2015-07-22 11:07:35'),(116,'88900001000300000295',5,0,'2015-07-22 11:08:49'),(117,'88900001000300000296',5,0,'2015-07-22 11:09:58'),(118,'88900001000300000297',5,0,'2015-07-22 11:15:10'),(119,'88900001000300000298',5,0,'2015-07-22 11:19:12'),(120,'88900001000300000299',5,0,'2015-07-22 11:19:13'),(121,'88900001000300000300',5,0,'2015-07-22 11:21:32'),(122,'88900001000300000301',5,0,'2015-07-22 11:21:33'),(123,'88900001000300000302',5,0,'2015-07-22 11:22:09'),(124,'88900001000300000303',5,0,'2015-07-22 11:22:09'),(125,'88900001000300000304',5,0,'2015-07-22 11:24:55'),(126,'88900001000300000305',5,0,'2015-07-22 11:24:55'),(127,'88900001000300000306',5,0,'2015-07-22 11:27:07'),(128,'88900001000300000307',5,0,'2015-07-22 11:27:08'),(129,'88900001000300000308',5,0,'2015-07-22 12:22:02'),(130,'88900001000300000309',5,0,'2015-07-22 12:27:21'),(131,'88900001000300000310',5,0,'2015-07-22 12:27:23'),(132,'88900001000300000311',5,0,'2015-07-22 12:31:39'),(133,'88900001000300000312',5,0,'2015-07-22 12:31:45'),(134,'88900001000300000313',5,0,'2015-07-22 12:32:50'),(135,'88900001000300000314',5,0,'2015-07-22 12:33:01'),(136,'88900001000300000315',5,0,'2015-07-22 12:33:47'),(137,'88900001000300000316',5,0,'2015-07-22 12:33:48'),(138,'88900001000300000317',5,0,'2015-07-22 12:37:05'),(139,'88900001000300000318',5,0,'2015-07-22 12:39:12'),(140,'88900001000300000319',5,0,'2015-07-22 12:49:12'),(141,'88900001000300000320',5,0,'2015-07-22 12:49:16'),(142,'88900001000300000321',5,0,'2015-07-22 13:24:23'),(143,'88900001000300000322',5,0,'2015-07-22 13:24:35'),(144,'88900001000300000323',5,0,'2015-07-22 13:25:22'),(145,'88900001000300000324',5,0,'2015-07-22 13:25:23'),(146,'88900001000300000325',5,0,'2015-07-22 13:28:33'),(147,'88900001000300000326',5,0,'2015-07-22 13:28:38'),(148,'88900001000300000327',5,0,'2015-07-22 13:45:01'),(149,'88900001000300000328',5,0,'2015-07-22 13:45:02'),(150,'88900001000300000329',5,0,'2015-07-22 13:45:23'),(151,'88900001000300000330',5,0,'2015-07-22 13:45:24'),(152,'88900001000300000331',5,0,'2015-07-22 13:48:37'),(153,'88900001000300000332',5,0,'2015-07-22 13:51:06'),(154,'88900001000300000333',5,0,'2015-07-22 13:51:18'),(155,'88900001000300000334',5,0,'2015-07-22 13:54:02'),(156,'88900001000300000335',5,0,'2015-07-22 13:55:26'),(157,'88900001000300000336',5,0,'2015-07-22 13:56:29'),(158,'88900001000300000337',5,0,'2015-07-22 13:59:37'),(159,'88900001000300000338',5,0,'2015-07-22 13:59:37'),(160,'88900001000300000339',5,0,'2015-07-22 14:20:04'),(161,'88900001000300000340',5,0,'2015-07-22 14:20:09'),(162,'88900001000300000341',5,0,'2015-07-22 14:21:21'),(163,'88900001000300000342',5,0,'2015-07-22 14:21:24'),(164,'88900001000300000343',5,0,'2015-07-22 14:21:26'),(165,'88900001000300000344',5,0,'2015-07-22 14:21:26'),(166,'88900001000300000345',5,0,'2015-07-22 14:21:26'),(167,'88900001000300000346',5,0,'2015-07-22 14:21:27'),(168,'88900001000300000347',5,0,'2015-07-22 14:21:29'),(169,'88900001000300000348',5,0,'2015-07-22 14:21:40'),(170,'88900001000300000349',5,0,'2015-07-22 14:21:40'),(171,'88900001000300000350',5,0,'2015-07-22 14:21:56'),(172,'88900001000300000351',5,0,'2015-07-22 14:21:57'),(173,'88900001000300000352',5,0,'2015-07-22 14:22:00'),(174,'88900001000300000353',5,0,'2015-07-22 14:22:01'),(175,'88900001000300000354',5,0,'2015-07-22 14:22:01'),(176,'88900001000300000355',5,0,'2015-07-22 14:22:03'),(177,'88900001000300000356',5,0,'2015-07-22 14:22:04'),(178,'88900001000300000357',5,0,'2015-07-22 14:24:05'),(179,'88900001000300000358',5,0,'2015-07-22 14:24:05'),(180,'88900001000300000359',5,0,'2015-07-22 14:24:05'),(181,'88900001000300000360',5,0,'2015-07-22 14:26:18'),(182,'88900001000300000361',5,0,'2015-07-22 14:26:18'),(183,'88900001000300000362',5,0,'2015-07-22 14:26:18'),(184,'88900001000300000363',5,0,'2015-07-22 14:29:57'),(185,'88900001000300000364',5,0,'2015-07-22 14:29:57'),(186,'88900001000300000365',5,0,'2015-07-22 14:29:58'),(187,'88900001000300000366',5,0,'2015-07-22 14:33:18'),(188,'88900001000300000367',5,0,'2015-07-22 14:33:18'),(189,'88900001000300000368',5,0,'2015-07-22 14:33:19'),(190,'88900001000300000369',5,0,'2015-07-22 14:33:19'),(191,'88900001000300000370',5,0,'2015-07-22 14:33:20'),(192,'88900001000300000371',5,0,'2015-07-22 14:33:21'),(193,'88900001000300000372',5,0,'2015-07-22 14:33:22'),(194,'88900001000300000373',5,0,'2015-07-22 14:33:50'),(195,'88900001000300000374',5,0,'2015-07-22 14:33:50'),(196,'88900001000300000375',5,0,'2015-07-22 14:33:50'),(197,'88900001000300000376',5,0,'2015-07-22 14:33:56'),(198,'88900001000300000377',5,0,'2015-07-22 14:34:11'),(199,'88900001000300000378',5,0,'2015-07-22 14:34:12'),(200,'88900001000300000379',5,0,'2015-07-22 14:34:12'),(201,'88900001000300000380',5,0,'2015-07-22 14:34:13'),(202,'88900001000300000381',5,0,'2015-07-22 14:34:15'),(203,'88900001000300000382',5,0,'2015-07-22 14:34:26'),(204,'88900001000300000383',5,0,'2015-07-22 14:34:36'),(205,'88900001000300000384',5,0,'2015-07-22 14:35:05'),(206,'88900001000300000385',5,0,'2015-07-22 14:35:05'),(207,'88900001000300000386',5,0,'2015-07-22 14:35:05'),(208,'88900001000300000387',5,0,'2015-07-22 14:35:07'),(209,'88900001000300000388',5,0,'2015-07-22 14:35:09'),(210,'88900001000300000389',5,0,'2015-07-22 14:35:21'),(211,'88900001000300000390',5,0,'2015-07-22 14:35:21'),(212,'88900001000300000391',5,0,'2015-07-22 14:38:36'),(213,'88900001000300000392',5,0,'2015-07-22 14:38:37'),(214,'88900001000300000393',5,0,'2015-07-22 14:38:37'),(215,'88900001000300000394',5,0,'2015-07-22 14:38:54'),(216,'88900001000300000395',5,0,'2015-07-22 14:38:54'),(217,'88900001000300000396',5,0,'2015-07-22 14:38:57'),(218,'88900001000300000397',5,0,'2015-07-22 14:39:33'),(219,'88900001000300000398',5,0,'2015-07-22 14:39:33'),(220,'88900001000300000399',5,0,'2015-07-22 14:39:33'),(221,'88900001000300000400',5,0,'2015-07-22 14:59:00'),(222,'88900001000300000401',5,0,'2015-07-22 14:59:00'),(223,'88900001000300000402',5,0,'2015-07-22 15:18:40'),(224,'88900001000300000403',5,0,'2015-07-22 15:18:41'),(225,'88900001000300000404',5,0,'2015-07-22 15:18:56'),(226,'88900001000300000405',5,0,'2015-07-22 15:29:58'),(227,'88900001000300000406',5,0,'2015-07-22 15:30:30'),(228,'88900001000300000407',5,0,'2015-07-22 16:36:24'),(229,'88900001000300000408',5,0,'2015-07-22 16:36:27'),(230,'88900001000300000409',5,0,'2015-07-22 16:57:01'),(231,'88900001000300000410',5,0,'2015-07-22 16:57:18'),(232,'88900001000300000411',5,0,'2015-07-22 17:16:22'),(233,'88900001000300000412',5,0,'2015-07-22 17:18:07'),(234,'88900001000300000413',5,0,'2015-07-22 17:24:20'),(235,'88900001000300000414',5,0,'2015-07-22 17:43:21'),(236,'88900001000300000415',5,0,'2015-07-22 17:45:14'),(237,'88900001000300000416',5,0,'2015-07-22 17:45:52'),(238,'88900001000300000417',5,0,'2015-07-27 12:15:05'),(239,'88900001000300000418',5,0,'2015-07-28 11:51:56'),(240,'88900001000300000419',5,0,'2015-07-28 11:52:22'),(241,'88900001000300000420',5,0,'2015-07-28 11:53:33'),(242,'88900001000300000421',5,0,'2015-07-28 11:53:54'),(243,'88900001000300000422',5,0,'2015-07-28 11:53:57'),(244,'88900001000300000423',5,0,'2015-07-28 11:53:57'),(245,'88900001000300000424',5,0,'2015-07-28 11:53:57'),(246,'88900001000300000425',5,0,'2015-07-28 11:54:04'),(247,'88900001000300000426',5,0,'2015-07-28 11:56:15'),(248,'88900001000300000427',5,0,'2015-07-28 11:57:26'),(249,'88900001000300000428',5,0,'2015-07-28 11:57:32'),(250,'88900001000300000429',5,0,'2015-07-28 11:58:03'),(251,'88900001000300000430',5,0,'2015-07-28 11:58:07'),(252,'88900001000300000431',5,0,'2015-07-28 11:58:13'),(253,'88900001000300000432',5,0,'2015-07-28 12:47:38'),(254,'88900001000300000433',5,0,'2015-07-28 12:48:13'),(255,'88900001000300000434',5,0,'2015-07-28 12:48:17'),(256,'88900001000300000435',5,0,'2015-07-28 12:56:03'),(257,'88900001000300000436',5,0,'2015-07-28 12:56:44'),(258,'88900001000300000437',5,0,'2015-07-28 13:00:41'),(259,'88900001000300000438',5,0,'2015-07-28 13:01:02'),(260,'88900001000300000439',5,0,'2015-07-28 13:01:32'),(261,'88900001000300000440',5,0,'2015-07-28 13:01:50'),(262,'88900001000300000441',5,0,'2015-07-28 13:01:54'),(263,'88900001000300000442',5,0,'2015-07-28 13:02:15'),(264,'88900001000300000443',5,0,'2015-07-28 13:02:19'),(265,'88900001000300000444',5,0,'2015-07-28 13:02:48'),(266,'88900001000300000445',5,0,'2015-07-28 13:02:53'),(267,'88900001000300000446',5,0,'2015-07-28 13:08:17'),(268,'88900001000300000447',5,0,'2015-07-28 13:09:07'),(269,'88900001000300000448',5,0,'2015-07-28 13:09:16'),(270,'88900001000300000449',5,0,'2015-07-28 13:09:40'),(271,'88900001000300000450',5,0,'2015-07-28 13:10:39'),(272,'88900001000300000451',5,0,'2015-07-28 13:10:42'),(273,'88900001000300000452',5,0,'2015-07-28 13:10:49'),(274,'88900001000300000453',5,0,'2015-07-28 13:10:56'),(275,'88900001000300000454',5,0,'2015-07-28 13:12:13'),(276,'88900001000300000455',5,0,'2015-07-28 13:12:20'),(277,'88900001000300000456',5,0,'2015-07-28 13:30:48'),(278,'88900001000300000457',5,0,'2015-07-28 13:30:49'),(279,'88900001000300000458',5,0,'2015-07-28 13:31:48'),(280,'88900001000300000459',5,0,'2015-07-28 13:37:36'),(281,'88900001000300000460',5,0,'2015-07-28 13:40:38'),(282,'88900001000300000461',5,0,'2015-07-28 13:41:06'),(283,'88900001000300000462',5,0,'2015-07-28 13:41:10'),(284,'88900001000300000463',5,0,'2015-07-28 13:41:42'),(285,'88900001000300000464',5,0,'2015-07-28 13:43:03'),(286,'88900001000300000465',5,0,'2015-07-28 13:43:06'),(287,'88900001000300000466',5,0,'2015-07-28 13:43:11'),(288,'88900001000300000467',5,0,'2015-07-28 13:43:43'),(289,'88900001000300000468',5,0,'2015-07-28 13:44:49'),(290,'88900001000300000469',5,0,'2015-07-28 13:45:13'),(291,'88900001000300000470',5,0,'2015-07-28 13:46:28'),(292,'88900001000300000471',5,0,'2015-07-28 13:46:35'),(293,'88900001000300000472',5,0,'2015-07-28 13:54:26'),(294,'88900001000300000473',5,0,'2015-07-28 13:55:06'),(295,'88900001000300000474',5,0,'2015-07-28 13:55:15'),(296,'88900001000300000475',5,0,'2015-07-28 13:55:37'),(297,'88900001000300000476',5,0,'2015-07-28 13:55:45'),(298,'88900001000300000477',5,0,'2015-07-28 13:57:35'),(299,'88900001000300000478',5,0,'2015-07-28 13:59:27'),(300,'88900001000300000479',5,0,'2015-07-28 14:04:08'),(301,'88900001000300000480',5,0,'2015-07-28 14:11:08'),(302,'88900001000300000481',5,0,'2015-07-28 14:11:16'),(303,'88900001000300000482',5,0,'2015-07-28 14:11:23'),(304,'88900001000300000483',5,0,'2015-07-28 14:11:51'),(305,'88900001000300000484',5,0,'2015-07-28 14:12:00'),(306,'88900001000300000485',5,0,'2015-07-28 14:13:23'),(307,'88900001000300000486',5,0,'2015-07-28 14:14:33'),(308,'88900001000300000487',5,0,'2015-07-28 14:15:59'),(309,'88900001000300000488',5,0,'2015-07-28 14:18:36'),(310,'88900001000300000489',5,0,'2015-07-28 14:23:25'),(311,'88900001000300000490',5,0,'2015-07-28 14:23:25'),(312,'88900001000300000491',5,0,'2015-07-28 14:23:51'),(313,'88900001000300000492',5,0,'2015-07-28 14:24:21'),(314,'88900001000300000493',5,0,'2015-07-28 14:24:32'),(315,'88900001000300000494',5,0,'2015-07-28 14:24:50'),(316,'88900001000300000495',5,0,'2015-07-28 14:24:58'),(317,'88900001000300000496',5,0,'2015-07-28 14:25:10'),(318,'88900001000300000497',5,0,'2015-07-28 14:25:14'),(319,'88900001000300000498',5,0,'2015-07-28 14:26:31'),(320,'88900001000300000499',5,0,'2015-07-28 14:27:00'),(321,'88900001000300000500',5,0,'2015-07-28 14:27:05'),(322,'88900001000300000501',5,0,'2015-07-28 14:27:31'),(323,'88900001000300000502',5,0,'2015-07-28 14:27:58'),(324,'88900001000300000503',5,0,'2015-07-28 14:30:45'),(325,'88900001000300000504',5,0,'2015-07-28 15:08:31'),(326,'88900001000300000505',5,0,'2015-07-29 17:39:52'),(327,'88900001000300000507',5,0,'2015-07-30 11:05:53'),(328,'88900001000300000508',5,0,'2015-07-30 14:44:04'),(329,'88900001000300000510',5,0,'2015-08-03 17:49:41'),(330,'88900001003500000001',5,0,'2015-08-03 17:50:50'),(331,'88900001003500000002',5,0,'2015-08-03 17:51:44'),(332,'88900001003500000003',5,0,'2015-08-03 17:54:18'),(333,'88900001003500000004',5,0,'2015-08-03 17:54:31'),(334,'88900001003500000005',5,0,'2015-08-03 18:05:20'),(335,'88900001003500000006',5,0,'2015-08-03 18:05:21'),(336,'88900001003500000007',5,0,'2015-08-03 18:05:21'),(337,'88900001003500000008',5,0,'2015-08-03 18:05:21'),(338,'88900001003500000009',5,0,'2015-08-03 18:05:21'),(339,'88900001003500000010',5,0,'2015-08-03 18:05:51'),(340,'88900001003500000011',5,0,'2015-08-03 18:05:55'),(341,'88900001003500000012',5,0,'2015-08-03 18:10:36'),(342,'88900001003500000013',5,0,'2015-08-03 18:10:38'),(343,'88900001003500000014',5,0,'2015-08-03 18:11:22'),(344,'88900001003500000015',5,0,'2015-08-03 18:11:23'),(345,'88900001003500000016',5,0,'2015-08-03 18:16:34'),(346,'88900001003500000017',5,0,'2015-08-03 18:16:34'),(347,'88900001003500000018',5,0,'2015-08-03 18:18:12'),(348,'88900001003500000019',5,0,'2015-08-03 18:18:13'),(349,'88900001003500000020',5,0,'2015-08-03 18:19:56'),(350,'88900001003500000021',5,0,'2015-08-03 18:19:57'),(351,'88900001003500000022',5,0,'2015-08-03 18:21:15'),(352,'88900001003500000023',5,0,'2015-08-03 18:21:16'),(353,'88900001003500000024',5,0,'2015-08-03 18:21:46'),(354,'88900001003500000025',5,0,'2015-08-03 18:21:48'),(355,'88900001003500000026',5,0,'2015-08-03 18:23:08'),(356,'88900001003500000027',5,0,'2015-08-03 18:23:10'),(357,'88900001003500000028',5,0,'2015-08-03 18:23:18'),(358,'88900001003500000029',5,0,'2015-08-03 18:23:19'),(359,'88900001003500000030',5,0,'2015-08-03 18:23:24'),(360,'88900001003500000031',5,0,'2015-08-03 18:23:25'),(361,'88900001003500000032',5,0,'2015-08-03 18:24:30'),(362,'88900001003500000033',5,0,'2015-08-03 18:24:31'),(363,'88900001003500000034',5,0,'2015-08-03 18:28:49'),(364,'88900001003500000035',5,0,'2015-08-03 18:28:50'),(365,'88900001003500000036',5,0,'2015-08-03 18:28:53'),(366,'88900001003500000037',5,0,'2015-08-03 18:28:57'),(367,'88900001003500000038',5,0,'2015-08-03 18:28:58'),(368,'88900001003500000039',5,0,'2015-08-03 18:35:21'),(369,'88900001003500000040',5,0,'2015-08-03 18:35:22'),(370,'88900001003500000041',5,0,'2015-08-03 18:35:56'),(371,'88900001003500000042',5,0,'2015-08-03 18:35:57'),(372,'88900001003500000043',5,0,'2015-08-03 18:36:02'),(373,'88900001003500000044',5,0,'2015-08-03 18:36:03'),(374,'88900001003500000045',5,0,'2015-08-03 18:36:36'),(375,'88900001003500000046',5,0,'2015-08-03 18:36:37'),(376,'88900001003500000047',5,0,'2015-08-03 18:37:21'),(377,'88900001003500000048',5,0,'2015-08-03 18:37:24'),(378,'88900001003500000049',5,0,'2015-08-03 18:37:29'),(379,'88900001003500000050',5,0,'2015-08-03 18:37:30'),(380,'88900001003500000051',5,0,'2015-08-03 18:38:28'),(381,'88900001003500000052',5,0,'2015-08-03 18:38:29'),(382,'88900001003500000053',5,0,'2015-08-03 18:39:45'),(383,'88900001003500000054',5,0,'2015-08-03 18:39:46'),(384,'88900001003500000055',5,0,'2015-08-03 18:39:52'),(385,'88900001003500000056',5,0,'2015-08-03 18:39:53'),(386,'88900001003500000057',5,0,'2015-08-03 18:56:36'),(387,'88900001003500000058',5,0,'2015-08-03 18:56:37'),(388,'88900001003500000059',5,0,'2015-08-03 18:57:15'),(389,'88900001003500000060',5,0,'2015-08-03 18:57:16'),(390,'88900001003500000061',5,0,'2015-08-03 18:57:21'),(391,'88900001003500000062',5,0,'2015-08-03 18:57:22'),(392,'88900001003500000063',5,0,'2015-08-03 18:59:01'),(393,'88900001003500000064',5,0,'2015-08-03 18:59:01'),(394,'88900001003500000065',5,0,'2015-08-03 19:06:19'),(395,'88900001003500000066',5,0,'2015-08-03 19:06:20'),(396,'88900001003500000067',5,0,'2015-08-03 19:06:25'),(397,'88900001003500000068',5,0,'2015-08-03 19:06:26'),(398,'88900001003500000069',5,0,'2015-08-03 19:43:43'),(399,'88900001003500000070',5,0,'2015-08-03 20:00:11'),(400,'88900001003500000071',5,0,'2015-08-03 20:15:12'),(401,'88900001003500000072',5,0,'2015-08-03 20:15:13'),(402,'88900001003500000073',5,0,'2015-08-03 20:15:16'),(403,'88900001003500000074',5,0,'2015-08-03 20:16:28'),(404,'88900001003500000075',5,0,'2015-08-03 20:16:29'),(405,'88900001003500000076',5,0,'2015-08-03 20:36:32'),(406,'88900001003500000077',5,0,'2015-08-03 20:36:34'),(407,'88900001003500000078',5,0,'2015-08-03 20:36:42'),(408,'88900001003500000079',5,0,'2015-08-03 20:36:43'),(409,'88900001003500000080',5,0,'2015-08-03 20:50:13'),(410,'88900001003500000081',5,0,'2015-08-03 20:50:15'),(411,'88900001003500000082',5,0,'2015-08-04 07:02:06'),(412,'88900001003500000083',5,0,'2015-08-04 07:02:06'),(413,'88900001003500000084',5,0,'2015-08-04 07:02:34'),(414,'88900001003500000085',5,0,'2015-08-04 07:02:35'),(415,'88900001003500000086',5,0,'2015-08-04 11:02:24'),(416,'88900001003500000087',5,0,'2015-08-04 11:06:32'),(417,'88900001003500000088',5,0,'2015-08-04 11:06:33'),(418,'88900001003500000089',5,0,'2015-08-04 12:23:38'),(419,'88900001003500000090',5,0,'2015-08-04 12:23:40'),(420,'88900001003500000091',5,0,'2015-08-04 12:23:50'),(421,'88900001003500000092',5,0,'2015-08-04 12:23:54'),(422,'88900001003500000093',5,0,'2015-08-04 12:23:54'),(423,'88900001003500000094',5,0,'2015-08-04 12:23:54'),(424,'88900001003500000095',5,0,'2015-08-04 12:23:55'),(425,'88900001003500000096',5,0,'2015-08-04 12:23:55'),(426,'88900001003500000097',5,0,'2015-08-04 12:23:55'),(427,'88900001003500000098',5,0,'2015-08-04 12:23:56'),(428,'88900001003500000099',5,0,'2015-08-04 12:23:56'),(429,'88900001003500000100',5,0,'2015-08-04 12:23:56'),(430,'88900001003500000101',5,0,'2015-08-04 12:23:56'),(431,'88900001003500000102',5,0,'2015-08-04 12:23:56'),(432,'88900001003500000103',5,0,'2015-08-04 12:23:57'),(433,'88900001003500000104',5,0,'2015-08-04 12:23:57'),(434,'88900001003500000105',5,0,'2015-08-04 12:23:57'),(435,'88900001003500000106',5,0,'2015-08-04 12:23:57'),(436,'88900001003500000107',5,0,'2015-08-04 12:25:50'),(437,'88900001003500000108',5,0,'2015-08-04 12:25:50'),(438,'88900001003500000109',5,0,'2015-08-04 12:25:50'),(439,'88900001003500000110',5,0,'2015-08-04 12:25:50'),(440,'88900001003500000111',5,0,'2015-08-04 12:25:50'),(441,'88900001003500000112',5,0,'2015-08-04 12:25:50'),(442,'88900001003500000113',5,0,'2015-08-04 12:25:51'),(443,'88900001003500000114',5,0,'2015-08-04 12:25:51'),(444,'88900001003500000115',5,0,'2015-08-04 12:25:51'),(445,'88900001003500000116',5,0,'2015-08-04 12:25:51'),(446,'88900001003500000117',5,0,'2015-08-04 12:25:51'),(447,'88900001003500000118',5,0,'2015-08-04 12:25:51'),(448,'88900001003500000119',5,0,'2015-08-04 12:25:52'),(449,'88900001003500000120',5,0,'2015-08-04 12:25:52'),(450,'88900001003500000121',5,0,'2015-08-04 12:25:52'),(451,'88900001000300000511',5,0,'2015-08-04 13:59:34'),(452,'88900001000300000512',5,0,'2015-08-04 14:00:20'),(453,'88900001003500000122',5,0,'2015-08-04 15:33:41'),(454,'88900001003500000123',5,0,'2015-08-04 15:33:41'),(455,'88900001003500000124',5,0,'2015-08-04 15:34:58'),(456,'88900001003500000125',5,0,'2015-08-04 15:34:59'),(457,'88900001003500000126',5,0,'2015-08-04 15:36:36'),(458,'88900001003500000127',5,0,'2015-08-04 15:36:37'),(459,'88900001003500000128',5,0,'2015-08-04 15:37:21'),(460,'88900001003500000129',5,0,'2015-08-04 15:37:21'),(461,'88900001003500000130',5,0,'2015-08-04 15:37:45'),(462,'88900001003500000131',5,0,'2015-08-04 15:37:46'),(463,'88900001003500000132',5,0,'2015-08-04 15:48:27'),(464,'88900001003500000133',5,0,'2015-08-04 15:48:27'),(465,'88900001003500000134',5,0,'2015-08-04 18:30:08'),(466,'88900001003500000135',5,0,'2015-08-04 18:30:09'),(467,'88900001003500000136',5,0,'2015-08-05 08:14:15'),(468,'88900001003500000137',5,0,'2015-08-05 08:14:15'),(469,'88900001003500000138',5,0,'2015-08-05 08:59:01'),(470,'88900001003500000139',5,0,'2015-08-05 08:59:01'),(471,'88900001003500000140',5,0,'2015-08-05 09:04:34'),(472,'88900001003500000141',5,0,'2015-08-05 09:04:34'),(473,'88900001003500000142',5,0,'2015-08-05 13:54:10'),(474,'88900001003500000143',5,0,'2015-08-05 13:54:11'),(475,'88900001003500000144',5,0,'2015-08-05 13:54:13'),(476,'88900001003500000145',5,0,'2015-08-05 13:54:14'),(477,'88900001003500000146',5,0,'2015-08-05 13:54:17'),(478,'88900001003500000147',5,0,'2015-08-05 13:54:17'),(479,'88900001003500000147',5,0,'2015-08-05 13:54:17'),(480,'88900001003500000149',5,0,'2015-08-05 13:54:19'),(481,'88900001003500000150',5,0,'2015-08-05 13:54:20'),(482,'88900001003500000151',5,0,'2015-08-05 14:23:29'),(483,'88900001003500000152',5,0,'2015-08-05 14:23:31'),(484,'88900001003500000153',5,0,'2015-08-05 14:44:51'),(485,'88900001003500000154',5,0,'2015-08-05 14:44:52'),(486,'88900001003500000155',5,0,'2015-08-05 14:54:42'),(487,'88900001003500000156',5,0,'2015-08-05 14:54:43'),(488,'88900001003500000157',5,0,'2015-08-05 15:18:55'),(489,'88900001003500000158',5,0,'2015-08-05 16:01:07'),(490,'88900001003500000159',5,0,'2015-08-05 16:05:55'),(491,'88900001003500000160',5,0,'2015-08-05 16:06:17'),(492,'88900001003500000161',5,0,'2015-08-05 16:07:47'),(493,'88900001003500000162',5,0,'2015-08-05 16:10:42'),(494,'88900001003500000163',5,0,'2015-08-05 16:11:53'),(495,'88900001003500000164',5,0,'2015-08-05 18:15:42'),(496,'88900001003500000165',5,0,'2015-08-05 18:30:31'),(497,'88900001003500000166',5,0,'2015-08-05 18:38:02'),(498,'88900001003500000167',5,0,'2015-08-05 19:44:40'),(499,'88900001003500000168',5,0,'2015-08-05 19:45:52'),(500,'88900001003500000169',5,0,'2015-08-05 19:46:24'),(501,'88900001003500000170',5,0,'2015-08-05 19:47:28'),(502,'88900001003500000171',5,0,'2015-08-05 19:49:11'),(503,'88900001003500000172',5,0,'2015-08-05 19:57:03'),(504,'88900001003500000173',5,0,'2015-08-05 20:15:30'),(505,'88900001003500000174',5,0,'2015-08-05 20:15:58'),(506,'88900001003500000175',5,0,'2015-08-05 20:16:50'),(507,'88900001003500000176',5,0,'2015-08-05 20:20:58'),(508,'88900001003500000177',5,0,'2015-08-06 08:35:07'),(509,'88900001003500000178',5,0,'2015-08-06 08:35:50'),(510,'88900001003500000179',5,0,'2015-08-06 08:42:43'),(511,'88900001003500000180',5,0,'2015-08-06 09:09:20'),(512,'88900001003500000181',5,0,'2015-08-06 09:18:53'),(513,'88900001003500000182',5,0,'2015-08-06 09:19:42'),(514,'88900001003500000183',5,0,'2015-08-06 09:19:53'),(515,'88900001003500000184',5,0,'2015-08-06 11:01:52'),(516,'88900001003500000185',5,0,'2015-08-06 11:05:58'),(517,'88900001003500000186',5,0,'2015-08-06 11:07:09'),(518,'88900001003500000187',5,0,'2015-08-06 11:08:37'),(519,'88900001003500000188',5,0,'2015-08-06 11:12:00'),(520,'88900001003500000189',5,0,'2015-08-06 12:02:17'),(521,'88900001003500000190',5,0,'2015-08-06 12:04:08'),(522,'88900001003500000191',5,0,'2015-08-06 12:06:25'),(523,'88900001003500000192',5,0,'2015-08-06 12:19:56'),(524,'88900001003500000193',5,0,'2015-08-06 13:43:35'),(525,'88900001003500000194',5,0,'2015-08-06 13:50:11'),(526,'88900001003500000195',5,0,'2015-08-06 14:05:50'),(527,'88900001003500000196',5,0,'2015-08-06 14:24:46'),(528,'88900001003500000197',5,0,'2015-08-06 14:30:15'),(529,'88900001003500000198',5,0,'2015-08-06 14:38:40'),(530,'88900001003500000199',5,0,'2015-08-06 14:43:04'),(531,'88900001003500000200',5,0,'2015-08-06 14:44:47'),(532,'88900001003500000201',5,0,'2015-08-06 14:51:06'),(533,'88900001003500000202',5,0,'2015-08-06 14:55:26'),(534,'88900001003500000203',5,0,'2015-08-06 15:04:06'),(535,'88900001003500000204',5,0,'2015-08-06 15:07:20'),(536,'88900001003500000205',5,0,'2015-08-06 15:18:30'),(537,'88900001003500000206',5,0,'2015-08-06 15:20:19'),(538,'88900001003500000207',5,0,'2015-08-06 15:21:36'),(539,'88900001003500000208',5,0,'2015-08-06 15:38:37'),(540,'88900001003500000209',5,0,'2015-08-06 15:43:34'),(541,'88900001003500000210',5,0,'2015-08-06 18:19:31'),(542,'88900001003500000211',5,0,'2015-08-06 18:19:39'),(543,'88900001003500000212',5,0,'2015-08-07 02:22:18'),(544,'88900001003500000213',5,0,'2015-08-07 02:22:19'),(545,'88900001003500000214',5,0,'2015-08-07 02:22:19'),(546,'88900001003500000215',5,0,'2015-08-07 02:22:42'),(547,'88900001003500000216',5,0,'2015-08-07 17:51:43'),(548,'88900001003500000217',5,0,'2015-08-07 17:51:48'),(549,'88900001003500000218',5,0,'2015-08-07 22:19:22'),(550,'88900001003500000219',5,0,'2015-08-09 07:57:42'),(551,'88900001003500000220',5,0,'2015-08-09 08:45:54'),(552,'88900001003500000221',5,0,'2015-08-09 13:24:46'),(553,'88900001003500000222',5,0,'2015-08-09 13:58:27'),(554,'88900001003500000223',5,0,'2015-08-09 14:03:42'),(555,'88900001003500000224',5,0,'2015-08-09 16:46:03'),(556,'88900001003500000225',5,0,'2015-08-09 16:49:06'),(557,'88900001003500000226',5,0,'2015-08-09 17:01:59'),(558,'88900001003500000227',5,0,'2015-08-09 17:06:21'),(559,'88900001003500000228',5,0,'2015-08-09 17:12:53'),(560,'88900001003500000229',5,0,'2015-08-09 17:17:10'),(561,'88900001003500000230',5,0,'2015-08-10 09:47:38'),(562,'88900001003500000231',5,0,'2015-08-10 09:56:42'),(563,'88900001003500000232',5,0,'2015-08-10 10:00:23'),(564,'88900001003500000233',5,0,'2015-08-10 10:01:43'),(565,'88900001003500000234',5,0,'2015-08-10 10:33:29'),(566,'88900001003500000235',5,0,'2015-08-10 10:37:45'),(567,'88900001003500000236',5,0,'2015-08-10 17:17:47'),(568,'88900001003500000237',5,0,'2015-08-11 07:14:51'),(569,'88900001003500000238',5,0,'2015-08-11 07:15:26'),(570,'88900001003500000239',5,0,'2015-08-11 07:16:10'),(571,'88900001003500000240',5,0,'2015-08-11 07:16:11'),(572,'88900001003500000241',5,0,'2015-08-11 07:17:23'),(573,'88900001003500000242',5,0,'2015-08-11 12:51:41'),(574,'88900001003500000243',5,0,'2015-08-11 12:51:42'),(575,'88900001003500000244',5,0,'2015-08-11 12:51:42'),(576,'88900001003500000245',5,0,'2015-08-11 12:51:43'),(577,'88900001003500000246',5,0,'2015-08-16 18:48:03'),(578,'88900001003500000247',5,0,'2015-08-16 19:22:18'),(579,'88900001003500000248',5,0,'2015-08-16 20:32:41'),(580,'88900001003500000249',5,0,'2015-08-17 20:44:44'),(581,'88900001003500000250',5,0,'2015-08-18 12:16:45'),(582,'88900001003500000251',5,0,'2015-08-21 20:40:14'),(583,'88900001003500000252',5,0,'2015-08-21 20:42:35'),(584,'88900001003500000253',5,0,'2015-08-23 10:10:12'),(585,'88900001003500000254',5,0,'2015-08-23 10:14:10'),(586,'88900001003500000255',5,0,'2015-08-24 09:06:15'),(587,'88900001003500000256',5,0,'2015-08-24 09:10:44'),(588,'88900001003500000257',5,0,'2015-08-24 12:11:03'),(589,'88900001003500000258',5,0,'2015-08-25 12:06:43'),(590,'88900001003500000259',5,0,'2015-08-25 15:06:07'),(591,'88900001003500000260',5,0,'2015-08-25 15:09:44'),(592,'88900001003500000261',5,0,'2015-08-25 15:09:55'),(593,'88900001003500000262',5,0,'2015-08-26 09:08:01'),(594,'88900001003500000263',5,0,'2015-08-26 09:16:18'),(595,'88900001003500000264',5,0,'2015-08-31 11:02:15'),(596,'88900001003500000265',5,0,'2015-08-31 13:10:07'),(597,'88900001003500000266',5,0,'2015-09-06 09:01:05'),(598,'88900001003500000267',5,0,'2015-09-08 16:49:00'),(599,'88900001003500000268',5,0,'2015-09-08 16:49:07'),(600,'88900001003500000269',5,0,'2015-09-08 16:54:47'),(601,'88900001003500000270',5,0,'2015-09-08 16:54:48'),(602,'88900001003500000271',5,0,'2015-09-08 16:56:21'),(603,'88900001003500000272',5,0,'2015-09-08 17:24:42'),(604,'88900001003500000273',5,0,'2015-09-08 17:25:51'),(605,'88900001003500000274',5,0,'2015-09-08 17:26:48'),(606,'88900001003500000275',5,0,'2015-09-08 18:54:41'),(607,'88900001003500000276',5,0,'2015-09-08 19:06:45'),(608,'88900001003500000277',5,0,'2015-09-08 19:13:00'),(609,'88900001003500000278',5,0,'2015-09-09 08:59:39'),(610,'88900001003500000279',5,0,'2015-09-09 09:04:30'),(611,'88900001003500000280',5,0,'2015-09-09 09:05:53'),(612,'88900001003500000281',5,0,'2015-09-09 09:19:29'),(613,'88900001003500000282',5,0,'2015-09-09 09:21:23'),(614,'88900001003500000283',5,0,'2015-09-09 09:26:01'),(615,'88900001003500000284',5,0,'2015-09-09 09:26:01'),(616,'88900001003500000285',5,0,'2015-09-09 09:29:17'),(617,'88900001003500000286',5,0,'2015-09-09 09:33:11'),(618,'88900001003500000287',5,0,'2015-09-09 09:35:21'),(619,'88900001003500000288',5,0,'2015-09-09 09:36:26'),(620,'88900001003500000289',5,0,'2015-09-09 09:36:56'),(621,'88900001003500000290',5,0,'2015-09-09 09:37:46'),(622,'88900001003500000291',5,0,'2015-09-09 09:40:27'),(623,'88900001003500000292',5,0,'2015-09-09 10:13:40'),(624,'88900001003500000293',5,0,'2015-09-09 10:26:45'),(625,'88900001003500000294',5,0,'2015-09-09 11:04:12'),(626,'88900001003500000295',5,0,'2015-09-09 13:47:23'),(627,'88900001003500000296',5,0,'2015-09-09 13:48:28'),(628,'88900001003500000297',5,0,'2015-09-09 13:58:10'),(629,'88900001003500000298',5,0,'2015-09-09 13:58:37'),(630,'88900001003500000299',5,0,'2015-09-09 14:02:05'),(631,'88900001003500000300',5,0,'2015-09-09 14:26:21'),(632,'88900001003500000301',5,0,'2015-09-09 14:35:53'),(633,'88900001003500000309',5,0,'2015-09-09 18:19:23'),(634,'88900001003500000310',5,0,'2015-09-10 19:02:04'),(635,'88900001003500000311',5,0,'2015-09-10 19:03:52'),(636,'88900001003500000312',5,0,'2015-09-10 19:04:40'),(637,'88900001003500000313',5,0,'2015-09-10 19:05:48'),(638,'88900001003500000314',5,0,'2015-09-10 19:20:37'),(639,'88900001003500000315',5,0,'2015-09-10 19:24:28'),(640,'88900001003500000316',5,0,'2015-09-10 19:27:48'),(641,'88900001003500000317',5,0,'2015-09-10 19:32:29'),(642,'88900001003500000318',5,0,'2015-09-10 19:34:47'),(643,'88900001003500000319',5,0,'2015-09-10 19:37:49'),(644,'88900001003500000320',5,0,'2015-09-10 19:40:46'),(645,'88900001003500000321',5,0,'2015-09-10 21:12:58'),(646,'88900001003500000322',5,0,'2015-09-10 21:16:16'),(647,'88900001003500000323',5,0,'2015-09-10 21:19:27'),(648,'88900001003500000324',5,0,'2015-09-10 21:19:29'),(649,'88900001003500000325',5,0,'2015-09-10 21:20:14'),(650,'88900001003500000326',5,0,'2015-09-10 21:47:54'),(651,'88900001003500000327',5,0,'2015-09-13 09:56:36'),(652,'88900001003500000328',5,0,'2015-09-13 10:12:47'),(653,'88900001003500000329',5,0,'2015-09-13 10:15:24'),(654,'88900001003500000330',5,0,'2015-09-13 10:18:46'),(655,'88900001003500000331',5,0,'2015-09-13 10:21:12'),(656,'88900001003500000332',5,0,'2015-09-13 10:51:52'),(657,'88900001003500000333',5,0,'2015-09-13 16:47:37'),(658,'88900001003500000334',5,0,'2015-09-13 16:47:38'),(659,'88900001003500000335',5,0,'2015-09-15 20:56:37'),(660,'88900001003500000336',5,0,'2015-09-15 21:00:30'),(661,'88900001003500000337',5,0,'2015-09-15 21:03:44'),(662,'88900001003500000338',5,0,'2015-09-16 13:31:22'),(663,'88900001003500000339',5,0,'2015-09-16 20:09:12'),(664,'88900001003500000340',5,0,'2015-09-17 17:30:48'),(665,'88900001003500000341',5,0,'2015-09-17 21:44:48'),(666,'88900001003500000342',5,0,'2015-09-18 20:36:01'),(667,'8890000100030000567',5,0,'2015-09-20 12:16:06'),(668,'8890000100030000568',5,0,'2015-09-20 12:16:06'),(669,'88900001000300000569',5,0,'2015-09-21 12:55:11'),(670,'88900001003500000343',5,0,'2015-09-21 14:11:01'),(671,'88900001003500000344',5,0,'2015-09-22 14:24:45'),(672,'88900001003500000345',5,0,'2015-09-27 17:30:37'),(673,'88900001003500000346',5,0,'2015-09-27 17:32:26'),(674,'88900001003500000347',5,0,'2015-09-27 17:37:52'),(675,'88900001003500000348',5,0,'2015-10-06 17:22:30'),(676,'88900001003500000349',5,0,'2015-10-11 18:24:23'),(677,'88900001003500000350',5,0,'2015-10-12 20:26:08'),(678,'8890000100030000574',5,0,'2015-10-13 16:47:34'),(679,'8890000100030000575',5,0,'2015-10-13 16:48:10'),(680,'8890000100030000576',5,0,'2015-10-13 16:50:00'),(681,'88900001003500000351',5,0,'2015-10-13 17:32:26'),(682,'88900001003500000352',5,0,'2015-10-13 17:37:58'),(683,'88900001003500000353',5,0,'2015-10-14 11:27:19'),(684,'88900001003500000354',5,0,'2015-10-14 18:44:55'),(685,'88900001003500000355',5,0,'2015-10-14 18:45:31'),(686,'88900001003500000356',5,0,'2015-10-14 18:54:09'),(687,'88900001003500000364',5,0,'2015-10-18 20:14:04'),(688,'8890000100350000365',5,0,'2015-10-19 10:30:35'),(689,'8890000100350000366',5,0,'2015-10-19 12:43:24'),(690,'8890000100350000367',5,0,'2015-10-19 12:44:39'),(691,'8890000100350000368',5,0,'2015-10-19 12:45:33'),(692,'8890000100350000369',5,0,'2015-10-19 12:50:02'),(693,'8890000100350000370',5,0,'2015-10-19 13:48:31'),(694,'8890000100350000371',5,0,'2015-10-19 13:53:47'),(695,'8890000100350000372',5,0,'2015-10-22 08:44:08'),(696,'8890000100350000374',5,0,'2015-10-26 19:30:56'),(697,'8890000100350000373',5,0,'2015-11-09 16:25:33'),(698,'8890000100350000374',5,0,'2015-11-09 16:25:50'),(699,'8890000100350000375',5,0,'2015-11-09 16:27:59'),(700,'8890000100350000376',5,0,'2015-11-17 11:37:13'),(701,'8890000100350000377',5,0,'2015-11-17 13:57:15'),(702,'8890000100350000378',5,0,'2015-11-17 14:29:12'),(703,'8890000100350000379',5,0,'2015-11-17 14:47:09'),(704,'8890000100350000380',5,0,'2015-11-17 15:01:07'),(705,'8890000100350000381',5,0,'2015-11-17 16:51:41'),(706,'8890000100350000382',5,0,'2015-11-17 16:56:29'),(707,'8890000100350000383',5,0,'2015-11-17 17:26:40'),(708,'8890000100350000384',5,0,'2015-11-17 17:31:12'),(709,'8890000100350000386',5,0,'2015-11-18 10:05:42'),(710,'8890000100350000387',5,0,'2015-11-18 12:34:59'),(711,'8890000100350000388',5,0,'2015-11-18 12:35:21');
/*!40000 ALTER TABLE `directory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `directory_domains`
--

DROP TABLE IF EXISTS `directory_domains`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `directory_domains` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `domain_name` varchar(128) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `directory_domains`
--

LOCK TABLES `directory_domains` WRITE;
/*!40000 ALTER TABLE `directory_domains` DISABLE KEYS */;
INSERT INTO `directory_domains` VALUES (1,'freeswitch.org'),(2,'sofaswitch.org'),(3,'104.239.164.247'),(4,'$${local_ip_v4}'),(5,'162.242.253.195');
/*!40000 ALTER TABLE `directory_domains` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `directory_gateway_params`
--

DROP TABLE IF EXISTS `directory_gateway_params`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `directory_gateway_params` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `d_gw_id` int(10) unsigned NOT NULL,
  `param_name` varchar(64) NOT NULL,
  `param_value` varchar(64) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_gw_param` (`d_gw_id`,`param_name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `directory_gateway_params`
--

LOCK TABLES `directory_gateway_params` WRITE;
/*!40000 ALTER TABLE `directory_gateway_params` DISABLE KEYS */;
/*!40000 ALTER TABLE `directory_gateway_params` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `directory_gateways`
--

DROP TABLE IF EXISTS `directory_gateways`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `directory_gateways` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `directory_id` int(10) unsigned NOT NULL,
  `gateway_name` varchar(128) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `directory_gateways`
--

LOCK TABLES `directory_gateways` WRITE;
/*!40000 ALTER TABLE `directory_gateways` DISABLE KEYS */;
/*!40000 ALTER TABLE `directory_gateways` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `directory_global_params`
--

DROP TABLE IF EXISTS `directory_global_params`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `directory_global_params` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `param_name` varchar(64) NOT NULL,
  `param_value` varchar(128) NOT NULL,
  `domain_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `directory_global_params`
--

LOCK TABLES `directory_global_params` WRITE;
/*!40000 ALTER TABLE `directory_global_params` DISABLE KEYS */;
INSERT INTO `directory_global_params` VALUES (1,'default_gateway','errors',1);
/*!40000 ALTER TABLE `directory_global_params` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `directory_global_vars`
--

DROP TABLE IF EXISTS `directory_global_vars`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `directory_global_vars` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `var_name` varchar(64) NOT NULL,
  `var_value` varchar(128) NOT NULL,
  `domain_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `directory_global_vars`
--

LOCK TABLES `directory_global_vars` WRITE;
/*!40000 ALTER TABLE `directory_global_vars` DISABLE KEYS */;
/*!40000 ALTER TABLE `directory_global_vars` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `directory_params`
--

DROP TABLE IF EXISTS `directory_params`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `directory_params` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `directory_id` int(11) DEFAULT NULL,
  `param_name` varchar(255) DEFAULT NULL,
  `param_value` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1359 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `directory_params`
--

LOCK TABLES `directory_params` WRITE;
/*!40000 ALTER TABLE `directory_params` DISABLE KEYS */;
INSERT INTO `directory_params` VALUES (1,1,'password','26021234'),(2,1,'vm-password','861000'),(3,2,'password','26021234'),(4,2,'vm-password','861001'),(7,5,'password','26021234'),(8,6,'password','26021234'),(9,7,'password','26021234'),(10,8,'password','26021234'),(11,9,'password','26021234'),(12,10,'password','26021234'),(13,11,'password','26021234'),(14,3,'vm-password','861002'),(15,3,'password','26021234'),(16,11,'vm-password','861009'),(17,10,'vm-password','26021234'),(18,9,'vm-password','861007'),(19,8,'vm-password','861006'),(20,7,'vm-password','861005'),(21,6,'vm-password','861004'),(22,5,'vm-password','861003'),(23,12,'password','S3cr3t50345'),(24,20,'password','QfG8fXoMCSAa5IOS'),(26,22,'password','LpIUoj01lRGIxIL4'),(27,23,'password','cRvNx7ZwqpLyf0bx'),(29,25,'password','xmolVGdwTRGsbDOJ'),(30,26,'password','W6pNotZpUJV1lpOt'),(31,27,'password','VMzQzSpw5rEnFkQu'),(32,15,'password','S3cr3t50345'),(33,16,'password','S3cr3t50345'),(34,17,'password','S3cr3t50345'),(35,28,'password','x7d20uZ1pIV8s1az'),(36,29,'password','I3Rw3nl0fpaVeocp'),(37,30,'password','6yMXbkk7s0IaE9cq'),(39,32,'password','u1XL0fE4g4B7a90S'),(40,33,'password','xkwYv1ReIG33saKX'),(41,34,'password','cbbS4oiEodJxcWU9'),(42,35,'password','uOAoTq9Q9BihH0Rx'),(44,37,'password','384M1jsn6vYVD1AQ'),(47,40,'password','dljCe3dSsqtDlAuU'),(48,41,'password','KbWLX100hbUB2HdT'),(49,42,'password','sOU0tyIUZ0dJf8CF'),(50,43,'password','eb2YvcOOHzRTJkXD'),(51,44,'password','18rSTgd6E385vuQz'),(56,49,'password','GSZKkGOFWqWdzd0g'),(57,50,'password','uE0ibdKtgg4CH5yg'),(97,81,'password','AkdmbkQ2I9dhd9yN'),(98,81,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(99,82,'password','ZtupKD08PisewtXF'),(100,82,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(101,83,'password','SMlliLB9Tj71Uor5'),(102,83,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(103,84,'password','uHFIztyxwsNRyhUH'),(104,84,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(105,85,'password','qHpVSwD19dKgJtF7'),(106,85,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(107,86,'password','D7o9nL28QNeIClgQ'),(108,86,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(109,87,'password','jQavSLw2qtXUvle2'),(110,87,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(111,88,'password','ztOy667Dmcohygy5'),(112,88,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(113,89,'password','stuxhYKc36ErfWYO'),(114,89,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(115,90,'password','8nPS2gTCok0v8aUz'),(116,90,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(117,91,'password','BtdQhJi49WVm3gcm'),(118,91,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(119,92,'password','E6CkZaj2in1G1upD'),(120,92,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(121,93,'password','3O3nScQMP6uMLI7e'),(122,93,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(123,94,'password','LMrvk9OJtcnTJjYT'),(124,94,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(125,95,'password','QMsabQxutfSAZpb9'),(126,95,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(127,96,'password','vjNSMFSPfZoyumQU'),(128,96,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(129,97,'password','4irn57Y4gtF373xq'),(130,97,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(131,98,'password','VjndIpaKPTFslROj'),(132,98,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(133,99,'password','BsX5jVKrePNyDih4'),(134,99,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(135,100,'password','FALh2L0cISWW9ReE'),(136,100,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(137,101,'password','FmeTY6REKVcc6iT0'),(138,101,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(139,102,'password','xWfquh0ZswzCKeIm'),(140,102,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(141,103,'password','5buONRH3auNvFSom'),(142,103,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(143,104,'password','FviCsg6EikMHqaCL'),(144,104,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(145,105,'password','mRNuGowAk0RqNG4H'),(146,105,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(147,106,'password','5u1YALqOVgaUhUk3'),(148,106,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(149,107,'password','ClLJUTETGp6zw9MX'),(150,107,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(151,108,'password','NGODHXvPanm2IBvd'),(152,108,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(153,109,'password','XMdGPUivQC7rb4wH'),(154,109,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(155,110,'password','RZI2ZmBioP2YYQHm'),(156,110,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(157,111,'password','vHmwnKRGPz7FP9EL'),(158,111,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(159,112,'password','kguWLcCR1Rgm4W7A'),(160,112,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(161,113,'password','OlVKjJEp3ai03Ghg'),(162,113,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(163,114,'password','3x6CM6csQHK1pobl'),(164,114,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(165,115,'password','szTBluSqavODEWy6'),(166,115,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(167,116,'password','27lUIcWgUI3Up7o3'),(168,116,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(169,117,'password','hAq5w7z7SC9PLSFz'),(170,117,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(171,118,'password','DNDXUtNdQcFrgeDX'),(172,118,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(173,119,'password','bZqOGXIHim3O4i0p'),(174,119,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(175,120,'password','ig2AmY5v8H3pIw1S'),(176,120,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(177,121,'password','nUAT9XkjO1zrytZc'),(178,121,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(179,122,'password','J399EqNqxNbEylys'),(180,122,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(181,123,'password','79GSTaBppyPLxrzP'),(182,123,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(183,124,'password','E3wbRSRS64KEw5Io'),(184,124,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(185,125,'password','vJ5atew9HtrIoNfv'),(186,125,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(187,126,'password','3bPTnh1CWTrLAYX3'),(188,126,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(189,127,'password','PdM2NtztTwYyvsax'),(190,127,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(191,128,'password','ClFeo8VfP1sKOpaW'),(192,128,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(193,129,'password','IuUkrXD7vdZKs1V1'),(194,129,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(195,130,'password','Rig2CYiCjX6OJvKH'),(196,130,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(197,131,'password','3U9BWWIHuBrKzGE3'),(198,131,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(199,132,'password','dwrAtQxcjxRUfmjB'),(200,132,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(201,133,'password','BqQmKuprwVIDZcqT'),(202,133,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(203,134,'password','iqbPeJmmWg0QoR63'),(204,134,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(205,135,'password','v3mIRi4QQX5ojW7M'),(206,135,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(207,136,'password','KNPkh5dhe4aKbhXW'),(208,136,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(209,137,'password','UV1pbFGyiH3HSrZr'),(210,137,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(211,138,'password','vgpegQuvf97Crwh9'),(212,138,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(213,139,'password','z15hKNZGIzb4vKio'),(214,139,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(215,140,'password','VJWz3lSMIGb4Zcr7'),(216,140,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(217,141,'password','8DQmBCshtKR80SUl'),(218,141,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(219,142,'password','Fo17daAnXw1xSB5d'),(220,142,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(221,143,'password','uiQg4oOpQ6ZgCu92'),(222,143,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(223,144,'password','fCfjYeRhwpw9vRdS'),(224,144,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(225,145,'password','e6CseuV0ecCE0pxs'),(226,145,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(227,146,'password','ssMw2ZJO5Avkisd3'),(228,146,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(229,147,'password','L7UtfO9VB5aLS8nR'),(230,147,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(231,148,'password','m59WJYthoubJ4kXo'),(232,148,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(233,149,'password','8DbP1dYoUIu7SVTX'),(234,149,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(235,150,'password','GeEgyUxUF6nv9Efd'),(236,150,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(237,151,'password','1ZsUbaxJHzDxBUvT'),(238,151,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(239,152,'password','B332wm9PXRNNAyYb'),(240,152,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(241,153,'password','HHVuR58Juq8OgakR'),(242,153,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(243,154,'password','MKC4x51S9RtrJfjt'),(244,154,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(245,155,'password','khO1Ba6B8zTuGSZV'),(246,155,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(247,156,'password','sDvnSaCy6sFzMErY'),(248,156,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(249,157,'password','nZ6c3Okq3Gppos7m'),(250,157,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(251,158,'password','BIwF2hv6jYAadYtJ'),(252,158,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(253,159,'password','d8g6XQKTg63oo7hg'),(254,159,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(255,160,'password','ArLag4huoj3juRyN'),(256,160,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(257,161,'password','W92NcQ1XpmV87FVl'),(258,161,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(259,162,'password','2XQqIdbe9pz8TFcl'),(260,162,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(261,163,'password','XA0YAox8N0vfLRZO'),(262,163,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(263,164,'password','wJuBnunPpoq8mEPN'),(264,164,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(265,165,'password','O02VV63Z04z2bnOI'),(266,165,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(267,166,'password','1aJ2FfrONlmwDbNf'),(268,166,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(269,167,'password','KXYKnbyK2WsuRv22'),(270,167,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(271,168,'password','lU03UssQKXfnsxbT'),(272,168,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(273,169,'password','uSnowyEq4UGidEvZ'),(274,169,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(275,170,'password','dyQ6Fc3P0tP3i8Da'),(276,170,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(277,171,'password','P5KDLlmShg6wdeC0'),(278,171,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(279,172,'password','yJGUWGAJoemOCbPY'),(280,172,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(281,173,'password','VA3Dw2dQjbvpcG6Q'),(282,173,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(283,174,'password','Mf99a1SaJcriiBC9'),(284,174,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(285,175,'password','DHU5IQxGfg1MZQyz'),(286,175,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(287,176,'password','OMTVH1fVa95vRt82'),(288,176,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(289,177,'password','DnDG4vukHgiEL4Q6'),(290,177,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(291,178,'password','WjrvntzmIZlsuoDy'),(292,179,'password','EsP5Hc4l3qqE7fiM'),(293,178,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(294,180,'password','KaqYuEDKTUJ5poJN'),(295,179,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(296,180,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(297,181,'password','wYBhUu7LoxDqKiZw'),(298,181,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(299,182,'password','Cc28ijNVvZhY1V4D'),(300,182,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(301,183,'password','EmaRozshmKC46vWz'),(302,183,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(303,184,'password','dYWYheER2J4k763M'),(304,184,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(305,185,'password','M4k9sPqnzWvDqRsU'),(306,185,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(307,186,'password','MjuimnXcHD6QCzRp'),(308,186,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(309,187,'password','bSfN4svbysxCxZt1'),(310,187,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(311,188,'password','JSZ5K2MT3895E6M1'),(312,188,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(313,189,'password','04D1Vm1vojEwL6wd'),(314,189,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(315,190,'password','2GvBnS7tYY5OFtd9'),(316,190,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(317,191,'password','JNxhED2FCY0kiYcl'),(318,191,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(319,192,'password','5VqZhLaORjjtd0pQ'),(320,192,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(321,193,'password','J9KWs991ZlkkzNIc'),(322,193,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(323,194,'password','gxKMYj02wFvxkj8k'),(324,194,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(325,195,'password','i8XPaR048hy5mGHo'),(326,195,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(327,196,'password','Ue8Fy6hNtK44TTqs'),(328,196,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(329,197,'password','9obhyP3TEbHvWCZN'),(330,197,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(331,198,'password','GeRUDa2QLuKHPx7I'),(332,198,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(333,199,'password','MY9T3EBVew6bt0N3'),(334,199,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(335,200,'password','UAQcg6pGSL99srTn'),(336,200,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(337,201,'password','X3k9h8cPC8v5xck7'),(338,201,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(339,202,'password','AWF5pfOaOJp3j3Sp'),(340,202,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(341,203,'password','pN1k6mlvFJX2zhUH'),(342,203,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(343,204,'password','Bfoc80W2ZVYtRAkC'),(344,204,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(345,205,'password','wsFhEwDTG7gh4Cl3'),(346,205,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(347,206,'password','3s9hb7A0WwErPIrm'),(348,206,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(349,207,'password','Daa7E3C6RthZhjbU'),(350,207,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(351,208,'password','dadlLeZsn9MrZ27J'),(352,208,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(353,209,'password','bUTuUSlK3vUt9svX'),(354,209,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(355,210,'password','qt2fDT7ZosnyClJ2'),(356,210,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(357,211,'password','fIngqeaolzjy6RMm'),(358,211,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(359,212,'password','Ej83gfHzQBtzkKSM'),(360,212,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(361,213,'password','Qnbe24Yw5wSSYIvk'),(362,213,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(363,214,'password','M97g9ZWKkwi0TgyN'),(364,214,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(365,215,'password','8bE1F5MKsILMypF2'),(366,215,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(367,216,'password','sOMzK25tE4sWmcaq'),(368,216,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(369,217,'password','mGXtFZ87Yu3lwdiy'),(370,217,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(371,218,'password','7eXnkCoZcDTlwBBN'),(372,218,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(373,219,'password','uDwrQHMlhzeGHYeM'),(374,219,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(375,220,'password','Q7OOXBGMnu64Uhxp'),(376,220,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(377,221,'password','00svnVeUSk2NMdHt'),(378,221,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(379,222,'password','yxUAvlqhHUynsQz4'),(380,222,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(381,223,'password','Y2SJK4jEp3Xpmidy'),(382,223,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(383,224,'password','UtSndQdr8qQABptz'),(384,224,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(385,225,'password','wrTMwU0Ija6fRIrc'),(386,225,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(387,226,'password','rvixBPXhggHrRp3x'),(388,226,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(389,227,'password','qIyiCmFyIogwWBHN'),(390,227,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(391,228,'password','PxaPnXqxjyn3EMG3'),(392,228,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(393,229,'password','qGZUzsRhLY7T89D6'),(394,229,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(395,230,'password','P0SkQRiEbbQyeZX3'),(396,230,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(397,231,'password','uhNFJ1vLveXSFowq'),(398,231,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(399,232,'password','sZ8GKcqtni60mEkC'),(400,232,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(401,233,'password','a7YG3Ahm9TYy8uqp'),(402,233,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(403,234,'password','RFCszLWPFJ5SS8hx'),(404,234,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(405,235,'password','0gaqzRxaGvUFunBv'),(406,235,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(407,236,'password','nHbb9HNm2KhNRE29'),(408,236,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(409,237,'password','artvDJCau1oMIOHo'),(410,237,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(411,238,'password','qXivnRAXzaNKXr4x'),(412,238,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(413,239,'password','TTAc4gATUW2rXROl'),(414,239,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(415,240,'password','cvLcdvki1UfEbiUZ'),(416,240,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(417,241,'password','vFNnNzHguT5kwZQ7'),(418,241,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(419,242,'password','2RrwLepphotni9E6'),(420,242,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(421,243,'password','jbwwDfzrtUNw28TM'),(422,243,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(423,244,'password','rRKe7GJVWVIeOUCv'),(424,244,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(425,245,'password','tFx83ivSkbbjQA2O'),(426,245,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(427,246,'password','XMeNnVMXQw7q8a0d'),(428,246,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(429,247,'password','B7X00v7bVDMIThBV'),(430,247,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(431,248,'password','dNelw1Y5DQkshHsC'),(432,248,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(433,249,'password','hZjYp7opLYd2SAOL'),(434,249,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(435,250,'password','xsXwWdpF1ZmKyyPH'),(436,250,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(437,251,'password','OFhMfYkA2RHaO5N5'),(438,251,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(439,252,'password','49amBYrR0OfMe3hx'),(440,252,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(441,253,'password','CdYGz8PqTVVU3GKu'),(442,253,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(443,254,'password','i67Ubm9iAtwJs1Fz'),(444,254,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(445,255,'password','Ac33iskBdXX5WHIj'),(446,255,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(447,256,'password','gy752IOOE9s1Kbqt'),(448,256,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(449,257,'password','DxktTivEM7dvfFhH'),(450,257,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(451,258,'password','QPo6NCmorpgaQVLY'),(452,258,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(453,259,'password','0vGMzWiqMv0aUGHk'),(454,259,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(455,260,'password','Mo9KUJvGv4L9Pdut'),(456,260,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(457,261,'password','yEvrMRaXSb7zCZdx'),(458,261,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(459,262,'password','4CpoZcbsrt8Flrz9'),(460,262,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(461,263,'password','URvPXWyHIrYv9DGg'),(462,263,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(463,264,'password','d5QRvoXP7S0uIHsL'),(464,264,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(465,265,'password','RIITVI1m1oVkfrKW'),(466,265,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(467,266,'password','ZdJq218SFdvJ7C6v'),(468,266,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(469,267,'password','1DbUcQzGQRyqSOKD'),(470,267,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(471,268,'password','kwWGoKCRrNayls1p'),(472,268,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(473,269,'password','IAdQToiWc5SYDq8t'),(474,269,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(475,270,'password','IC6OqgejYMkCHXyk'),(476,270,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(477,271,'password','7sNK9OxSQuhikkF9'),(478,271,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(479,272,'password','4EMhpo46L2mK2cNW'),(480,272,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(481,273,'password','w6ijSHRqYGLYai42'),(482,273,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(483,274,'password','oH6JVTpTCfdaNvLX'),(484,274,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(485,275,'password','7YSKr4YIk5J0QkOy'),(486,275,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(487,276,'password','MF6brfs3Ai3kPBuo'),(488,276,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(489,277,'password','ofqg6oZBslapN7LL'),(490,277,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(491,278,'password','F3bv6cNovMTH4iGY'),(492,278,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(493,279,'password','Syu69WOqAOPL7G0l'),(494,279,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(495,280,'password','TnhEV9QNnCXtUyfR'),(496,280,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(497,281,'password','cyUW8gtta4sQ7NaG'),(498,281,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(499,282,'password','Mi52x0Y9SaJLdnyI'),(500,282,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(501,283,'password','polp2I7I3eRdpncE'),(502,283,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(503,284,'password','J6e84UpNFbyyH8Tb'),(504,284,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(505,285,'password','L5NOMcktUIJCnk6J'),(506,285,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(507,286,'password','eWU0F9J8fN8S9KGS'),(508,286,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(509,287,'password','mYrESgd3bMTSWygG'),(510,287,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(511,288,'password','f6kwdoG10RuyETJH'),(512,288,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(513,289,'password','gz3cBHrXjauei12V'),(514,289,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(515,290,'password','stLoHBQ0MQfpOQ13'),(516,290,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(517,291,'password','v4vedQJPOMbTiirR'),(518,291,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(519,292,'password','gfTYMAeB7Qp7Yk0A'),(520,292,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(521,293,'password','80P8Ntpd84O5BFgF'),(522,293,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(523,294,'password','MnaynRcAj0T4oZLA'),(524,294,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(525,295,'password','1y4KMcxO8gDCwBW9'),(526,295,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(527,296,'password','httfANzBHRhFvhbA'),(528,296,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(529,297,'password','aYNxOCwxC58Giwfp'),(530,297,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(531,298,'password','5cjYKgxDlfHBtK5L'),(532,298,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(533,299,'password','fvQ9f6NL7b9FaTGv'),(534,299,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(535,300,'password','gDeSFpbpXLSbVPL1'),(536,300,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(537,301,'password','3G0B8GrKnx01eRV9'),(538,301,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(539,302,'password','O2ARI9xnMy6UHoCM'),(540,302,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(541,303,'password','UuQxVUZSAeQopGOv'),(542,303,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(543,304,'password','r1wX16W6JUPJulrt'),(544,304,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(545,305,'password','N35wa8pbK9Uxy03a'),(546,305,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(547,306,'password','6SanXshoBbyhCTvu'),(548,306,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(549,307,'password','W9snGJbQKwUTnNFn'),(550,307,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(551,308,'password','JiMPfqqdsqIsafOO'),(552,308,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(553,309,'password','aTeF8gVWREXDkyv4'),(554,309,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(555,310,'password','b6rOqGRoBwk21ryj'),(556,310,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(557,311,'password','e4zrLBSVrBPFqr64'),(558,311,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(559,312,'password','hq5Ttsyry1UVtGVp'),(560,312,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(561,313,'password','dmXhAu8rbtQGcpdk'),(562,313,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(563,314,'password','BiLgK8Dd4CJdZOtL'),(564,314,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(565,315,'password','T4YtbmXmrvOK5JmZ'),(566,315,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(567,316,'password','8ewGeTURiRBP54sF'),(568,316,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(569,317,'password','SbsEWhmmm3BBAgXA'),(570,317,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(571,318,'password','iU79QT6qDLZYXhiZ'),(572,318,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(573,319,'password','k1qlZGmAF7Y3XR41'),(574,319,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(575,320,'password','oVDceLqGMPNey8zF'),(576,320,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(577,321,'password','Jxp9aOAHwHcROeiS'),(578,321,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(579,322,'password','OLYkl01WmMFApaNR'),(580,322,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(581,323,'password','gdqeJHPX5FO9mA85'),(582,323,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(583,324,'password','d5lilCmESVXT0ByY'),(584,324,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(585,325,'password','uXpv9dIrzm1vWek3'),(586,325,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(587,326,'password','yITrAbPJjAGjgqgx'),(588,326,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(589,327,'password','SnIFuQvygZTebsCJ'),(590,327,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(591,328,'password','xziN6VtJ0SIpnWKD'),(592,328,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(593,329,'password','dqzF9LoW9zEYBXwk'),(594,329,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(595,330,'password','XgfXkyVdyEc2V89t'),(596,330,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(597,331,'password','tf1wMLcnWUCSxLk0'),(598,331,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(599,332,'password','bkrQGsDm7yExRnA7'),(600,332,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(601,333,'password','X8EGnkLRwvxFysqf'),(602,333,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(603,334,'password','8qNtrTu8RTpRjEcC'),(604,334,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(605,335,'password','nVTEBm58xrLKHiVb'),(606,335,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(607,336,'password','yW12IeVsDHyULO7q'),(608,336,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(609,337,'password','1hYkRrCXiRuor14Z'),(610,337,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(611,338,'password','nUk3W2KEsjTDb8Dt'),(612,338,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(613,339,'password','R5CdbFk4qBS2qDWm'),(614,339,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(615,340,'password','XYzeU7EnMxOBW3ZJ'),(616,340,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(617,341,'password','50y15o5X9Di5GqWO'),(618,341,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(619,342,'password','PXNdL3lvdMFMHM0s'),(620,342,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(621,343,'password','wME05G1cwTqVWjzt'),(622,343,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(623,344,'password','UFyRDOaOZcK55m4l'),(624,344,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(625,345,'password','VpwVN3gW6mYu3uIO'),(626,345,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(627,346,'password','56JJk0lQB2dBaPuk'),(628,346,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(629,347,'password','7wvzkEhESyvNnHJe'),(630,347,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(631,348,'password','TfQtJ8DtCEs6YhLL'),(632,348,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(633,349,'password','AyuvQ2YbVI2AMFti'),(634,349,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(635,350,'password','IyjehJWZHxNudBQQ'),(636,350,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(637,351,'password','DeJkSYTzLtLIRYDN'),(638,351,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(639,352,'password','AqtoHoiFGuvHgpGK'),(640,352,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(641,353,'password','PnO0JSDevbRltE4z'),(642,353,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(643,354,'password','hZDAsbZdMDb31YRr'),(644,354,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(645,355,'password','HLDyOZh4K4e9orHN'),(646,355,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(647,356,'password','dXpoERhHihmDsq6w'),(648,356,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(649,357,'password','XafrpynDPGlZNMq3'),(650,357,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(651,358,'password','CJIBrrQ9Blb4iWAH'),(652,358,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(653,359,'password','gq7eOpPoXX9ZhUeD'),(654,359,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(655,360,'password','n8jQsMlKI9SkLDZZ'),(656,360,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(657,361,'password','CowP1TusGnif80nX'),(658,361,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(659,362,'password','pYaGd8XsvmLS9CJq'),(660,362,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(661,363,'password','gfOZEpigX04rDtvr'),(662,363,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(663,364,'password','FAjN6Q8soeIVOLIO'),(664,364,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(665,365,'password','3lEHaGi6Cv1NlfgV'),(666,365,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(667,366,'password','SwNEtZtNSNlxRoE8'),(668,366,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(669,367,'password','ymy8bH3vJ7jWOepS'),(670,367,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(671,368,'password','NgvCk86l1X9Je2bt'),(672,368,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(673,369,'password','L5SOZTPSp9UFwuVl'),(674,369,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(675,370,'password','Hc5ocxzdrI0RfuKr'),(676,370,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(677,371,'password','IMCo1pc0ejLjMi19'),(678,371,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(679,372,'password','V3bbuT4KnQXT3Hhg'),(680,372,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(681,373,'password','UayKIVn2ZOJFLghe'),(682,373,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(683,374,'password','roueGPqiyqL8H5JC'),(684,374,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(685,375,'password','y0jDllkwEPq30E2a'),(686,375,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(687,376,'password','wsLQ6uuiRbxlaJUM'),(688,376,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(689,377,'password','fhC9Dc6NZLRetY0m'),(690,377,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(691,378,'password','V3MPDHUDVbayCMjD'),(692,378,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(693,379,'password','3fdxVJILnk1ggwHq'),(694,379,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(695,380,'password','wXjZ5fwm2bqZyMpJ'),(696,380,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(697,381,'password','k8bCFoLKnCXaWBhi'),(698,381,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(699,382,'password','UbW74LMDhnKosfal'),(700,382,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(701,383,'password','E67Wkbu5Q5EuMuoS'),(702,383,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(703,384,'password','swrpYMgBYmIJ0fMW'),(704,384,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(705,385,'password','fFUd0k7vcMiDbCYR'),(706,385,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(707,386,'password','rh0C8OCITvJcKqmI'),(708,386,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(709,387,'password','MwUlwDv76lWe1l4b'),(710,387,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(711,388,'password','LE7kfkv6rBtYRtsN'),(712,388,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(713,389,'password','OjTSArIhx3SPS17e'),(714,389,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(715,390,'password','MSglLGXh06EMGSRb'),(716,390,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(717,391,'password','HJVhWB5FvCNBySJ1'),(718,391,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(719,392,'password','fmZCRETLvnDwzO9W'),(720,392,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(721,393,'password','pRuyZH1hXXDN4IsU'),(722,393,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(723,394,'password','n3VtvJG3jx9VjtAs'),(724,394,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(725,395,'password','V1MSnPvviwY6ejJX'),(726,395,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(727,396,'password','d3OQTqxYJlOWbFtK'),(728,396,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(729,397,'password','PpAibBjA3WKxXuzK'),(730,397,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(731,398,'password','BxTw3eZGGopff7i9'),(732,398,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(733,399,'password','buvk6EXewX0TgBzc'),(734,399,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(735,400,'password','zWIGMFapcT6dlR5Y'),(736,400,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(737,401,'password','ZS1mGByknAQHb78y'),(738,401,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(739,402,'password','szT8vnt7HIQ5kk3v'),(740,402,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(741,403,'password','qOTSCUF31OYjVPMU'),(742,403,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(743,404,'password','iTuR1RKKxtBuyLHr'),(744,404,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(745,405,'password','dQmvhFjZYCDfHry6'),(746,405,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(747,406,'password','aN2Uipf3ABkPVpmB'),(748,406,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(749,407,'password','GfYS23KdXLS3YHvG'),(750,407,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(751,408,'password','vTeNnx8F6JrlqMJg'),(752,408,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(753,409,'password','lDUIPVizyjy2AAmW'),(754,409,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(755,410,'password','etcA3eajrJB6N8nr'),(756,410,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(757,411,'password','VlYrzexFbGENvnEI'),(758,411,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(759,412,'password','tixIACIMkosAOBCg'),(760,412,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(761,413,'password','B96be2BebY2lOYqa'),(762,413,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(763,414,'password','soQpWp5RzgKUvOBH'),(764,414,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(765,415,'password','6yGgVG24Zsn2B6ni'),(766,415,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(767,416,'password','cq8A2na9KdYwDqvA'),(768,416,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(769,417,'password','djy1L16jiugiRyxy'),(770,417,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(771,418,'password','LURpTDO4LHBRwjJp'),(772,418,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(773,419,'password','q33tBWDXFHAT5zo1'),(774,419,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(775,420,'password','DxlXWWgf8b3sjr0K'),(776,420,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(777,421,'password','isJmCi9R3yEC5h86'),(778,421,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(779,422,'password','EVvpFGTqfybnXzwm'),(780,422,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(781,423,'password','kxKRzIQXpcgan5sN'),(782,423,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(783,424,'password','AsSEuHwGllXll6oC'),(784,424,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(785,425,'password','NK0dQBYcgpKgXNpm'),(786,425,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(787,426,'password','ugCD2hfNAk6DKZIL'),(788,426,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(789,427,'password','Ncvv5k2qQ5vYtNzd'),(790,427,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(791,428,'password','GdpiNvreKosrZCIT'),(792,428,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(793,429,'password','yn4NFvr7XxIQx6jU'),(794,429,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(795,430,'password','Xt2xWGLe4FeHyZPN'),(796,430,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(797,431,'password','aPte0b9PBijnMVv5'),(798,431,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(799,432,'password','PviPuSTiemyANP05'),(800,432,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(801,433,'password','ysc0MABkSXcvUA20'),(802,433,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(803,434,'password','XMEJnN1L0FX32fyO'),(804,434,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(805,435,'password','PialNNG0ieKecEoz'),(806,435,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(807,436,'password','2kiv7O3xxZXLRVhU'),(808,436,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(809,437,'password','7G4dM3eGloXbZHAc'),(810,437,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(811,438,'password','JewUTi96KGrzsonM'),(812,438,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(813,439,'password','IxEIfy7K02RZZdZE'),(814,439,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(815,440,'password','vq5SWh3JteGHHAm2'),(816,440,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(817,441,'password','yThobugDrtLfpuDH'),(818,441,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(819,442,'password','Oj7xzcVApJ0MVhzx'),(820,442,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(821,443,'password','dBalWguEFR2j0GTR'),(822,443,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(823,444,'password','kBWXA9ei6YLyC6F5'),(824,444,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(825,445,'password','XXuSz1jgntQDduFz'),(826,445,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(827,446,'password','LzNnDHSIfhxVVsuZ'),(828,446,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(829,447,'password','3vx3aZbkcO5xKr57'),(830,447,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(831,448,'password','9Kp0mfv99ofx2Gbb'),(832,448,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(833,449,'password','eIXvGKTergbB1kzy'),(834,450,'password','6YNMM3OS32OlFN1O'),(835,449,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(836,450,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(837,451,'password','BpMcvAPLMkCQMD1y'),(838,451,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(839,452,'password','b7IHjWvkM2LPuPoi'),(840,452,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(841,453,'password','UoLmXuIPEQbCu50R'),(842,453,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(843,454,'password','ANatuZiyONVI8iB9'),(844,454,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(845,455,'password','0UTRxEYW2BWDQNQW'),(846,455,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(847,456,'password','2f4VpUr8C1yLo011'),(848,456,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(849,457,'password','vYTWBzMxY8OUQB1K'),(850,457,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(851,458,'password','UZa10BTa0hftjd1R'),(852,458,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(853,459,'password','KXY3bbGiM5V0ztJ7'),(854,459,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(855,460,'password','NtBzBlzRJWobTaV8'),(856,460,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(857,461,'password','deXQE1akPYExnwHu'),(858,461,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(859,462,'password','86rYF2YucphZQh4Y'),(860,462,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(861,463,'password','JhANRFPmUfsQ45tG'),(862,463,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(863,464,'password','GIx1tYUjai2iw4CD'),(864,464,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(865,465,'password','HY5SrLuUDTvPLBJx'),(866,465,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(867,466,'password','bd3vJsba2JSidVn1'),(868,466,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(869,467,'password','fySwuQhXTroxrISg'),(870,467,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(871,468,'password','jfrlgUKGqVxbEey9'),(872,468,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(873,469,'password','SSC2xrwVFTsZtj1w'),(874,469,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(875,470,'password','YcusJRLTFweb4C3n'),(876,470,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(877,471,'password','pS044vHValYrDxz3'),(878,471,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(879,472,'password','m6wn6oXPx1ALS2tA'),(880,472,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(881,473,'password','V3qNVE5ts0bKBwv4'),(882,473,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(883,474,'password','GXrXyMjnw6OVJcKH'),(884,474,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(885,475,'password','qOkyQ4iATisKKbKB'),(886,475,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(887,476,'password','hWukswN9uKrifk6A'),(888,476,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(889,477,'password','iWLZRHiowgEf6y9s'),(890,477,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(891,478,'password','il2LIMzIBB2TbJvV'),(892,479,'password','hr27LcY8fa4Bo0Qb'),(893,478,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(894,479,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(895,480,'password','nC3HxTphxJJWaVmR'),(896,480,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(897,481,'password','J0hOwFpjtjlvPt8L'),(898,481,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(899,482,'password','vbKcXKSJXDT2V49G'),(900,482,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(901,483,'password','QKRhkeXETCsqFRby'),(902,483,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(903,484,'password','86vS7hQJfBFM26Zv'),(904,484,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(905,485,'password','Yayx8Xet7F7CWrcN'),(906,485,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(907,486,'password','mHc2O7RSRik3Ehar'),(908,486,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(909,487,'password','sgJKJ69D7g1OzaBb'),(910,487,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(911,488,'password','iI7w5e0aboatkVMq'),(912,488,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(913,489,'password','3YV8mU2yMnv8o6ac'),(914,489,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(915,490,'password','YYJiy0rEao4nBCqt'),(916,490,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(917,491,'password','7kpgvKWPJxVxyjVw'),(918,491,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(919,492,'password','ZQ5uOyh5BVuiVpf5'),(920,492,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(921,493,'password','a5sdtI9rEq6OPMJX'),(922,493,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(923,494,'password','7lzTmk64F501NX8t'),(924,494,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(925,495,'password','l4RlwSaEr81mdSne'),(926,495,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(927,496,'password','ROYG9P4SpGJmS864'),(928,496,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(929,497,'password','XTA4bt2MvQKARF15'),(930,497,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(931,498,'password','n8qmEWSrdLfYKsJC'),(932,498,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(933,499,'password','nyh9ayunpMyI1QTW'),(934,499,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(935,500,'password','f4RVcFFtU3LtLRaS'),(936,500,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(937,501,'password','xD7HkS03w1ZO5in4'),(938,501,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(939,502,'password','OhZ6JaGxYfGm6YR7'),(940,502,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(941,503,'password','aUkXb8mOizaeeWNh'),(942,503,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(943,504,'password','IOlknYJVpbO8cntX'),(944,504,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(945,505,'password','cU1XhZNYU8CjgxK1'),(946,505,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(947,506,'password','kYRz64nfrRVxxzyi'),(948,506,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(949,507,'password','TM8ZHDbYIaVnwCph'),(950,507,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(951,508,'password','dpjRd4PFeV3PMMyp'),(952,508,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(953,509,'password','8l6F4J0h4dflpK87'),(954,509,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(955,510,'password','xxNFHRtcBVuSqbUO'),(956,510,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(957,511,'password','oXeqLMqx0N0gVkja'),(958,511,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(959,512,'password','BXlPZbL9bzNjoKTo'),(960,512,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(961,513,'password','G7JVAJi86n3O86kE'),(962,513,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(963,514,'password','Za6MdoIzhfXLcvVV'),(964,514,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(965,515,'password','AXIsOpfLNDoia6Cc'),(966,515,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(967,516,'password','dPzDiSbW4laSVW7W'),(968,516,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(969,517,'password','YAsLkTGlcyXxfyXW'),(970,517,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(971,518,'password','B7gEJs8NUVZAK0bK'),(972,518,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(973,519,'password','Kx87IWP7TJlY12Kp'),(974,519,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(975,520,'password','4fReCe4CaHGpg5wl'),(976,520,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(977,521,'password','qM7qqw3nWvV0aktj'),(978,521,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(979,522,'password','yJZIhnwXakH2V51S'),(980,522,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(981,523,'password','oeU9rAhv64uK3oPL'),(982,523,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(983,524,'password','ixp7ZpqcPdL8S1et'),(984,524,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(985,525,'password','H6FsSDeiz3WPGT6X'),(986,525,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(987,526,'password','67jC2Ss9NwfZLPXJ'),(988,526,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(989,527,'password','PVg52csdVqr0briB'),(990,527,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(991,528,'password','RwO68dFZUpLjkUqg'),(992,528,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(993,529,'password','iENsUc5QNnOyzLvJ'),(994,529,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(995,530,'password','BoCO6BL0KDPpruWS'),(996,530,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(997,531,'password','tX8ncNYwVDKvjwCe'),(998,531,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(999,532,'password','eMamL7AFMzCW3TRr'),(1000,532,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1001,533,'password','yi6oWWuH7EHrvLH1'),(1002,533,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1003,534,'password','0awhl44vhMpJ0RnX'),(1004,534,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1005,535,'password','j7lTo87frkHwXIJz'),(1006,535,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1007,536,'password','YOTst9KOVsCcWg2W'),(1008,536,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1009,537,'password','jO1eUpnB1lmTTK2Q'),(1010,537,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1011,538,'password','FiE4619vPWpvFFJl'),(1012,538,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1013,539,'password','zRJGOj3eHQWHOodX'),(1014,539,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1015,540,'password','v06Sg4IvkLbon97e'),(1016,540,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1017,541,'password','tFGIexqrkygYizhh'),(1018,541,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1019,542,'password','K7gqTvLo1lAEKheg'),(1020,542,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1021,543,'password','LZniutSoNPoBbfxT'),(1022,543,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1023,544,'password','v0ysN5ojn6Msfcm2'),(1024,544,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1025,545,'password','zNUR9vo0Ggal7e5m'),(1026,545,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1027,546,'password','FwdaavVdrCQEhf4S'),(1028,546,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1029,547,'password','grSDLGBYJfN50hGm'),(1030,547,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1031,548,'password','wISDVerWpZPaVGTp'),(1032,548,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1033,549,'password','MOHSEILQvv2syoiW'),(1034,549,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1035,550,'password','fRVRyhfHQCoqz4eC'),(1036,550,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1037,551,'password','MSaq7J2RW64bDs40'),(1038,551,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1039,552,'password','RDh5LgN6saW7alip'),(1040,552,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1041,553,'password','nfPUTuSvSXdEFBLK'),(1042,553,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1043,554,'password','rdnIDhM53cPkEryK'),(1044,554,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1045,555,'password','eYYHBHIREiKm5Gg7'),(1046,555,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1047,556,'password','Gmbd9ElKknZDIKVq'),(1048,556,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1049,557,'password','ts0OaOSEjjfUixXv'),(1050,557,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1051,558,'password','FsFXSUOXwwKeZR9B'),(1052,558,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1053,559,'password','RcbeSClY7QEKNeT0'),(1054,559,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1055,560,'password','11WFwT6WaiiM1mBQ'),(1056,560,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1057,561,'password','hNjeOvm3JWTIrbef'),(1058,561,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1059,562,'password','gyrsdFl23ueychAg'),(1060,562,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1061,563,'password','ntKSBk4wRbuSAlJn'),(1062,563,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1063,564,'password','4YA3QWLIyZv5bx9b'),(1064,564,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1065,565,'password','UHlgip50owO1TVE3'),(1066,565,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1067,566,'password','rOZ8jALnjCpZEvoV'),(1068,566,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1069,567,'password','IsG0ub3herVeE7Kq'),(1070,567,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1071,568,'password','Cwd4v4xWj6GDkREk'),(1072,568,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1073,569,'password','o2gE7CTdX1ZfIx3X'),(1074,569,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1075,570,'password','jpJlx9sn2K2SJbil'),(1076,570,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1077,571,'password','9KP45zVJGv3BSBUp'),(1078,571,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1079,572,'password','8Iiy3dau6X8hZPvS'),(1080,572,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1081,573,'password','qlmuC7z749nD2ndH'),(1082,573,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1083,574,'password','z4OzIw4RG9COwq9s'),(1084,574,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1085,575,'password','awmJQvsXzJeCUSjL'),(1086,575,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1087,576,'password','OcauX3HgEpHPk4wl'),(1088,576,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1089,577,'password','13owNcf45beUHZQO'),(1090,577,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1091,578,'password','xvFT7srJUNVCrcNF'),(1092,578,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1093,579,'password','zvV4yKm8SErxRdoW'),(1094,579,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1095,580,'password','PRCDGSvJO9JUzzYF'),(1096,580,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1097,581,'password','0MRv88wFYA5mWgnQ'),(1098,581,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1099,582,'password','AHAj39X3JIs8xX56'),(1100,582,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1101,583,'password','oi041B6K2Gwycamv'),(1102,583,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1103,584,'password','zn0uF7dzPyJJkW3U'),(1104,584,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1105,585,'password','a9tb5ikIw07lpDV8'),(1106,585,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1107,586,'password','OgE1xnMNY5XJPFxs'),(1108,586,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1109,587,'password','h1QTxg7oAClE213B'),(1110,587,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1111,588,'password','wyqtbamS4AA4G4V4'),(1112,588,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1113,589,'password','JU15379hjeVFDcYF'),(1114,589,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1115,590,'password','EguYBovJgctDiqRJ'),(1116,590,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1117,591,'password','KvRdF6xfMSNY9rSM'),(1118,591,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1119,592,'password','yfWGqv3htfwW0ujM'),(1120,592,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1121,593,'password','HrjlZGd4zi8qHede'),(1122,593,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1123,594,'password','B1S0mUrHUTMT78F7'),(1124,594,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1125,595,'password','FEiGKknJKbHr9iJM'),(1126,595,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1127,596,'password','ctqogYXOUuAbkScN'),(1128,596,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1129,597,'password','6DzlAtEuToEUtsej'),(1130,597,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1131,598,'password','ZomtRC8chA3tSlVL'),(1132,598,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1133,599,'password','vmh4E4xnfaAQNWiV'),(1134,599,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1135,600,'password','UXBL1SgLdjbEE5tT'),(1136,600,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1137,601,'password','iNYgSGwcwxHRQRWM'),(1138,601,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1139,602,'password','jDrTkSoR2OipQBIl'),(1140,602,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1141,603,'password','zvSD5W5rOlLNXAN3'),(1142,603,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1143,604,'password','M6DcGperbGyXOUC5'),(1144,604,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1145,605,'password','csuifk7c42O4cDVi'),(1146,605,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1147,606,'password','ccDJTsAQf8TeyfX1'),(1148,606,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1149,607,'password','5Ewji2231p8525z5'),(1150,607,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1151,608,'password','Lk4sOHOAzlkhWcO4'),(1152,608,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1153,609,'password','AVlaBgk4x3eghW9W'),(1154,609,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1155,610,'password','49p6wSFG5QigLAUi'),(1156,610,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1157,611,'password','IA0ZVmb2gGWEU2Ek'),(1158,611,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1159,612,'password','FUxU0lejzYh06A4U'),(1160,612,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1161,613,'password','i7R3TKWUfTjC92aA'),(1162,613,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1163,614,'password','CwWOGYVQZiMerdZD'),(1164,614,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1165,615,'password','Z9jXYSO0a99gk6ie'),(1166,615,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1167,616,'password','k16f9uP4Zce7460W'),(1168,616,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1169,617,'password','rJol7hqdpccb7rDu'),(1170,617,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1171,618,'password','11EFQLnm7pJuWqbE'),(1172,618,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1173,619,'password','4F4NiJ7nvuXhTI2T'),(1174,619,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1175,620,'password','51ecx1GhTbstjpad'),(1176,620,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1177,621,'password','L0TQJ3iJVjaE8lzZ'),(1178,621,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1179,622,'password','sHjTiaCoLFxNa2It'),(1180,622,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1181,623,'password','9FiyYOYN6ONgCBYg'),(1182,623,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1183,624,'password','jiFmMf54FL9Eve2A'),(1184,624,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1185,625,'password','nsszsFQvhFrbBByq'),(1186,625,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1187,626,'password','BCHTRGMKt5h9yrh3'),(1188,626,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1189,627,'password','5BGd5Q42W3mBYbD2'),(1190,627,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1191,628,'password','6LisGNnjWXhajBYq'),(1192,628,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1193,629,'password','r5qodue0t5ge5Mmt'),(1194,629,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1195,630,'password','1ieXXR3pjSvBICTD'),(1196,630,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1197,631,'password','K4avDXRVu0FD17SD'),(1198,631,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1199,632,'password','k2lo2WeLDOEMnpVn'),(1200,632,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1201,633,'password','OYMqcYorxJeOKIRo'),(1202,633,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1203,634,'password','gNnJA4vVV0pMX7fq'),(1204,634,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1205,635,'password','TeljwQZRXu9ZWAnc'),(1206,635,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1207,636,'password','J5x0sd2Sx0M32Q1Y'),(1208,636,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1209,637,'password','VNcaFYehrSM461Pk'),(1210,637,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1211,638,'password','zJV9qxWe84UJPKvt'),(1212,638,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1213,639,'password','EwMsjumyD5U5DmO7'),(1214,639,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1215,640,'password','MF7O3uMzVGHzUf4g'),(1216,640,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1217,641,'password','FOoos2FFFxLiLlJF'),(1218,641,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1219,642,'password','qbzOFvyAZLeWGRsD'),(1220,642,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1221,643,'password','s3AuSPMfoQUZpCes'),(1222,643,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1223,644,'password','HfQcMFIyyrCJBZpq'),(1224,644,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1225,645,'password','Y4y3CgiYpDtTTDbN'),(1226,645,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1227,646,'password','dLG3x7gAd5K9DWGI'),(1228,646,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1229,647,'password','9LKFi9qn3w5gM7Gr'),(1230,647,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1231,648,'password','Jl9hKxzd602mhzqS'),(1232,648,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1233,649,'password','vJ8BYOlN4ORmUFhi'),(1234,649,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1235,650,'password','KoHyEaRoUlpxfLTO'),(1236,650,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1237,651,'password','X6tRAZPQnauwAec4'),(1238,651,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1239,652,'password','LXPukU4fvtHG517O'),(1240,652,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1241,653,'password','ZchuVFseAHEfoI6X'),(1242,653,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1243,654,'password','1o9HVDvfQgyrAkSO'),(1244,654,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1245,655,'password','MzuG1JHVdRtdWlez'),(1246,655,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1247,656,'password','unwL1zC7rHf1Y6fX'),(1248,656,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1249,657,'password','IcJZGy1NTNjbRKJm'),(1250,657,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1251,658,'password','xI9Xhub64WTdViAY'),(1252,658,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1253,659,'password','aGEvYNat2WgdMLZp'),(1254,659,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1255,660,'password','D3qTpQNyubkngSTS'),(1256,660,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1257,661,'password','RXqdBrWKpGTSMfeO'),(1258,661,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1259,662,'password','NsWoqPLrRTkb85In'),(1260,662,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1261,663,'password','lHO5ksDnyiG4oGsw'),(1262,663,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1263,664,'password','BREhuPPYDTBTGEfP'),(1264,664,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1265,665,'password','D9Lr6zFB7SXJ2fHH'),(1266,665,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1267,666,'password','cycJW4USvH6mEHi9'),(1268,666,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1269,667,'password','6Kk3gEPjRCYGpxwl'),(1270,667,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1271,668,'password','kak0ZEkt7Y12Anvc'),(1272,668,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1273,669,'password','djlRLMh9lyawd9J7'),(1274,669,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1275,670,'password','ibTtRF9f7DjhP1Ss'),(1276,670,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1277,671,'password','as9ixXp7D1TAoafR'),(1278,671,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1279,672,'password','hFIUQ1Sg3h0of5av'),(1280,672,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1281,673,'password','zg1HLjwJ4kDlSBXQ'),(1282,673,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1283,674,'password','a6YsvvLf2zGlmOQV'),(1284,674,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1285,675,'password','uIMNnU3TsIk0SYOl'),(1286,675,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1287,676,'password','Njnxbeh0NPmfsexI'),(1288,676,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1289,677,'password','J227RweG2duRjcHI'),(1290,677,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1291,678,'password','HvKO7UBGiQfTUisZ'),(1292,678,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1293,679,'password','BOVIeQ5fAXin9GJK'),(1294,679,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1295,680,'password','apHqnkgk8cCkLVlw'),(1296,680,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1297,681,'password','TFR2W1pfaNBYJtCa'),(1298,681,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1299,682,'password','kunGQUNMEIiy8Q19'),(1300,682,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1301,683,'password','mfsbg30cyrplJCZn'),(1302,683,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1303,684,'password','xY44wSgnRLbs2U7O'),(1304,684,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1305,685,'password','y7G6kdpohfYuA3HU'),(1306,685,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1307,686,'password','ov699IDHR2GxTFUB'),(1308,686,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1309,687,'password','UEubMSDCQtB74NqJ'),(1310,687,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1311,688,'password','KZe87n1wKsPvkPVO'),(1312,688,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1313,689,'password','DXb4A5yoHKtXke3r'),(1314,689,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1315,690,'password','ICNvNEEob7Qva1aB'),(1316,690,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1317,691,'password','wm0cYypo0Yzz75H7'),(1318,691,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1319,692,'password','75LqivDiklkBDEBW'),(1320,692,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1321,693,'password','Zrz8dtF1X3BgyFDJ'),(1322,693,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1323,694,'password','qm7D6tZ3DIQqutLZ'),(1324,694,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1325,695,'password','u15n4gm734ZnxlCZ'),(1326,695,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1327,696,'password','kiQ7lbxLDzMsGu6d'),(1328,696,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1329,697,'password','PzzOeJy1646ejeSZ'),(1330,697,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1331,698,'password','RTlnvyfKBc70AOEf'),(1332,698,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1333,699,'password','XHkd60kiIjk2i3Y0'),(1334,699,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1335,700,'password','bH1EBFmf43EWT9UO'),(1336,700,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1337,701,'password','ZwFVGv3j7UWtfapU'),(1338,701,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1339,702,'password','y1y4LdYFPurwNW4e'),(1340,702,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1341,703,'password','hi2U6l13PdIw96gZ'),(1342,703,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1343,704,'password','ZFwxk140neYsHMSC'),(1344,704,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1345,705,'password','hnExW0mFBsuR6t20'),(1346,705,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1347,706,'password','FBo7uF3DzIi6nYgr'),(1348,706,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1349,707,'password','PJRzidJjtPq5Ey1C'),(1350,707,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1351,708,'password','jp1nLAl0jHKuPzP2'),(1352,708,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1353,709,'password','C9j1RhYNYQE4By3j'),(1354,709,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1355,710,'password','t1KVA87grQYp89QH'),(1356,710,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}'),(1357,711,'password','nsMbpo5fzLhYXlLp'),(1358,711,'dial-string','${rtmp_contact(default/${dialed_user}@162.242.253.195)}');
/*!40000 ALTER TABLE `directory_params` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `directory_vars`
--

DROP TABLE IF EXISTS `directory_vars`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `directory_vars` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `directory_id` int(11) DEFAULT NULL,
  `var_name` varchar(255) DEFAULT NULL,
  `var_value` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `directory_vars`
--

LOCK TABLES `directory_vars` WRITE;
/*!40000 ALTER TABLE `directory_vars` DISABLE KEYS */;
INSERT INTO `directory_vars` VALUES (1,1,'numbering_plan','US'),(2,2,'numbering_plan','US'),(3,3,'numbering_plan','AU'),(4,5,'numbering_plan','US'),(5,5,'area_code','434'),(7,12,'sip-force-contact','NDLB-connectile-dysfunction'),(8,26,'accountcode','90000000000000022'),(9,26,'user_context','default'),(10,26,'sip-force-contact','NDLB-connectile-dysfunction');
/*!40000 ALTER TABLE `directory_vars` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `iax_conf`
--

DROP TABLE IF EXISTS `iax_conf`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `iax_conf` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `profile_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `iax_conf`
--

LOCK TABLES `iax_conf` WRITE;
/*!40000 ALTER TABLE `iax_conf` DISABLE KEYS */;
INSERT INTO `iax_conf` VALUES (3,'test_profile');
/*!40000 ALTER TABLE `iax_conf` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `iax_settings`
--

DROP TABLE IF EXISTS `iax_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `iax_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `iax_id` int(11) DEFAULT NULL,
  `param_name` varchar(255) DEFAULT NULL,
  `param_value` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `iax_settings`
--

LOCK TABLES `iax_settings` WRITE;
/*!40000 ALTER TABLE `iax_settings` DISABLE KEYS */;
INSERT INTO `iax_settings` VALUES (35,3,'debug','1'),(36,3,'ip','$${local_ip_v4}'),(37,3,'port','4569'),(38,3,'context','public'),(39,3,'dialplan','enum,XML'),(40,3,'codec-prefs','$${global_codec_prefs}'),(41,3,'codec-master','us'),(42,3,'codec-rate','8');
/*!40000 ALTER TABLE `iax_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ivr_conf`
--

DROP TABLE IF EXISTS `ivr_conf`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ivr_conf` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `greet_long` varchar(255) NOT NULL,
  `greet_short` varchar(255) NOT NULL,
  `invalid_sound` varchar(255) NOT NULL,
  `exit_sound` varchar(255) NOT NULL,
  `max_failures` int(10) unsigned NOT NULL DEFAULT '3',
  `timeout` int(11) NOT NULL DEFAULT '5',
  `tts_engine` varchar(64) DEFAULT NULL,
  `tts_voice` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ivr_conf`
--

LOCK TABLES `ivr_conf` WRITE;
/*!40000 ALTER TABLE `ivr_conf` DISABLE KEYS */;
INSERT INTO `ivr_conf` VALUES (1,'demo','soundfiles/ivr/demo/greet-long.wav','soundfiles/ivr/demo/greet-short.wav','soundfiles/ivr/invalid.wav','soundfiles/ivr/exit.wav',3,5,'cepstral','allison'),(2,'demo2','soundfiles/ivr/demo2/greet-long.wav','soundfiles/ivr/demo2/greet-short.wav','soundfiles/ivr/invalid.wav','soundfiles/ivr/exit.wav',3,5,NULL,NULL),(3,'menu8','soundfiles/ivr/menu8/greet-long.wav','soundfiles/ivr/menu8/greet-short.wav','soundfiles/ivr/menu8/invalid.wav','soundfiles/ivr/menu8/exit.wav',3,5,NULL,NULL);
/*!40000 ALTER TABLE `ivr_conf` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ivr_entries`
--

DROP TABLE IF EXISTS `ivr_entries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ivr_entries` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ivr_id` int(10) unsigned NOT NULL,
  `action` varchar(64) NOT NULL,
  `digits` varchar(16) NOT NULL,
  `params` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_ivr_digits` (`ivr_id`,`digits`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ivr_entries`
--

LOCK TABLES `ivr_entries` WRITE;
/*!40000 ALTER TABLE `ivr_entries` DISABLE KEYS */;
INSERT INTO `ivr_entries` VALUES (1,1,'menu-play-sound','1','soundfiles/features.wav'),(2,1,'menu-exit','*',NULL),(3,1,'menu-sub','2','demo2'),(4,1,'menu-exec-api','3','bridge sofia/$${domain}/888@conference.freeswtich.org'),(5,1,'menu-call-transfer','4','888'),(6,2,'menu-back','#',NULL),(7,2,'menu-top','*',NULL),(8,3,'menu-back','#',NULL),(9,3,'menu-top','*',NULL),(10,3,'menu-playsound','4','soundfiles/4.wav');
/*!40000 ALTER TABLE `ivr_entries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `limit_conf`
--

DROP TABLE IF EXISTS `limit_conf`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `limit_conf` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `limit_conf`
--

LOCK TABLES `limit_conf` WRITE;
/*!40000 ALTER TABLE `limit_conf` DISABLE KEYS */;
/*!40000 ALTER TABLE `limit_conf` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `limit_data`
--

DROP TABLE IF EXISTS `limit_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `limit_data` (
  `hostname` varchar(255) DEFAULT NULL,
  `realm` varchar(255) DEFAULT NULL,
  `id` varchar(255) DEFAULT NULL,
  `uuid` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `limit_data`
--

LOCK TABLES `limit_data` WRITE;
/*!40000 ALTER TABLE `limit_data` DISABLE KEYS */;
/*!40000 ALTER TABLE `limit_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `local_stream_conf`
--

DROP TABLE IF EXISTS `local_stream_conf`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `local_stream_conf` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `directory_name` varchar(255) DEFAULT NULL,
  `directory_path` text,
  `param_name` varchar(255) DEFAULT NULL,
  `param_value` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `local_stream_conf`
--

LOCK TABLES `local_stream_conf` WRITE;
/*!40000 ALTER TABLE `local_stream_conf` DISABLE KEYS */;
/*!40000 ALTER TABLE `local_stream_conf` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `modless_conf`
--

DROP TABLE IF EXISTS `modless_conf`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `modless_conf` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `conf_name` varchar(64) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `modless_conf`
--

LOCK TABLES `modless_conf` WRITE;
/*!40000 ALTER TABLE `modless_conf` DISABLE KEYS */;
INSERT INTO `modless_conf` VALUES (1,'acl.conf'),(2,'postl_load_switch.conf'),(3,'post_load_modules.conf');
/*!40000 ALTER TABLE `modless_conf` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_load_modules_conf`
--

DROP TABLE IF EXISTS `post_load_modules_conf`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `post_load_modules_conf` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `module_name` varchar(64) NOT NULL,
  `load_module` tinyint(1) NOT NULL DEFAULT '1',
  `priority` int(10) unsigned NOT NULL DEFAULT '1000',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_mod` (`module_name`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_load_modules_conf`
--

LOCK TABLES `post_load_modules_conf` WRITE;
/*!40000 ALTER TABLE `post_load_modules_conf` DISABLE KEYS */;
INSERT INTO `post_load_modules_conf` VALUES (1,'mod_sofia',1,2000),(2,'mod_iax',1,2000),(3,'mod_xml_rpc',1,100),(4,'mod_portaudio',1,1000),(5,'mod_enum',1,2000),(6,'mod_xml_cdr',1,1000),(7,'mod_spidermonkey',1,1000),(8,'mod_alsa',0,1000),(9,'mod_log_file',1,0),(10,'mod_commands',1,1000),(11,'mod_voicemail',1,1000),(12,'mod_dialplan_xml',1,150),(13,'mod_dialplan_asterisk',1,150),(14,'mod_openzap',0,1000),(15,'mod_woomera',0,1000),(17,'mod_speex',1,500),(18,'mod_ilbc',0,1000),(20,'mod_g723_1',1,500),(21,'mod_g729',1,500),(22,'mod_g722',1,500),(23,'mod_g726',1,500),(25,'mod_amr',1,500),(26,'mod_fifo',1,1000),(27,'mod_limit',1,1000),(28,'mod_syslog',1,0),(29,'mod_dingaling',1,2000),(30,'mod_cdr_csv',1,1000),(31,'mod_event_socket',1,100),(32,'mod_multicast',0,1000),(33,'mod_zeroconf',0,1000),(34,'mod_xmpp_event',0,1000),(35,'mod_sndfile',1,1000),(36,'mod_native_file',1,1000),(37,'mod_shout',1,1000),(38,'mod_local_stream',1,1000),(39,'mod_perl',0,1000),(40,'mod_python',0,1000),(41,'mod_java',0,1000),(42,'mod_cepstral',0,1000),(43,'mod_openmrcp',0,1000),(44,'mod_lumenvox',0,1000),(45,'mod_rss',0,1000),(46,'mod_say_de',1,1000),(47,'mod_say_fr',0,1000),(48,'mod_say_en',1,1000),(49,'mod_conference',1,1000),(50,'mod_ivr',0,1000),(51,'mod_console',1,0),(52,'mod_dptools',1,1500),(53,'mod_voipcodecs',1,500);
/*!40000 ALTER TABLE `post_load_modules_conf` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rss_conf`
--

DROP TABLE IF EXISTS `rss_conf`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rss_conf` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `directory_id` int(11) NOT NULL,
  `feed` text NOT NULL,
  `local_file` text NOT NULL,
  `description` text,
  `priority` int(11) NOT NULL DEFAULT '1000',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rss_conf`
--

LOCK TABLES `rss_conf` WRITE;
/*!40000 ALTER TABLE `rss_conf` DISABLE KEYS */;
/*!40000 ALTER TABLE `rss_conf` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sip_authentication`
--

DROP TABLE IF EXISTS `sip_authentication`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sip_authentication` (
  `nonce` varchar(255) DEFAULT NULL,
  `expires` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sip_authentication`
--

LOCK TABLES `sip_authentication` WRITE;
/*!40000 ALTER TABLE `sip_authentication` DISABLE KEYS */;
/*!40000 ALTER TABLE `sip_authentication` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sip_dialogs`
--

DROP TABLE IF EXISTS `sip_dialogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sip_dialogs` (
  `call_id` varchar(255) DEFAULT NULL,
  `uuid` varchar(255) DEFAULT NULL,
  `sip_to_user` varchar(255) DEFAULT NULL,
  `sip_to_host` varchar(255) DEFAULT NULL,
  `sip_from_user` varchar(255) DEFAULT NULL,
  `sip_from_host` varchar(255) DEFAULT NULL,
  `contact_user` varchar(255) DEFAULT NULL,
  `contact_host` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `direction` varchar(255) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sip_dialogs`
--

LOCK TABLES `sip_dialogs` WRITE;
/*!40000 ALTER TABLE `sip_dialogs` DISABLE KEYS */;
/*!40000 ALTER TABLE `sip_dialogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sip_registrations`
--

DROP TABLE IF EXISTS `sip_registrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sip_registrations` (
  `call_id` varchar(255) DEFAULT NULL,
  `sip_user` varchar(255) DEFAULT NULL,
  `sip_host` varchar(255) DEFAULT NULL,
  `contact` varchar(1024) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `rpid` varchar(255) DEFAULT NULL,
  `expires` int(11) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sip_registrations`
--

LOCK TABLES `sip_registrations` WRITE;
/*!40000 ALTER TABLE `sip_registrations` DISABLE KEYS */;
/*!40000 ALTER TABLE `sip_registrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sip_subscriptions`
--

DROP TABLE IF EXISTS `sip_subscriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sip_subscriptions` (
  `proto` varchar(255) DEFAULT NULL,
  `sip_user` varchar(255) DEFAULT NULL,
  `sip_host` varchar(255) DEFAULT NULL,
  `sub_to_user` varchar(255) DEFAULT NULL,
  `sub_to_host` varchar(255) DEFAULT NULL,
  `event` varchar(255) DEFAULT NULL,
  `contact` varchar(1024) DEFAULT NULL,
  `call_id` varchar(255) DEFAULT NULL,
  `full_from` varchar(255) DEFAULT NULL,
  `full_via` varchar(255) DEFAULT NULL,
  `expires` int(11) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `accept` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sip_subscriptions`
--

LOCK TABLES `sip_subscriptions` WRITE;
/*!40000 ALTER TABLE `sip_subscriptions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sip_subscriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sofia_aliases`
--

DROP TABLE IF EXISTS `sofia_aliases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sofia_aliases` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `sofia_id` int(10) unsigned NOT NULL,
  `alias_name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sofia_aliases`
--

LOCK TABLES `sofia_aliases` WRITE;
/*!40000 ALTER TABLE `sofia_aliases` DISABLE KEYS */;
INSERT INTO `sofia_aliases` VALUES (1,1,'default'),(3,1,'sip.example.com');
/*!40000 ALTER TABLE `sofia_aliases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sofia_conf`
--

DROP TABLE IF EXISTS `sofia_conf`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sofia_conf` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `profile_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sofia_conf`
--

LOCK TABLES `sofia_conf` WRITE;
/*!40000 ALTER TABLE `sofia_conf` DISABLE KEYS */;
INSERT INTO `sofia_conf` VALUES (1,'$${domain}');
/*!40000 ALTER TABLE `sofia_conf` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sofia_domains`
--

DROP TABLE IF EXISTS `sofia_domains`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sofia_domains` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sofia_id` int(11) DEFAULT NULL,
  `domain_name` varchar(255) DEFAULT NULL,
  `parse` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sofia_domains`
--

LOCK TABLES `sofia_domains` WRITE;
/*!40000 ALTER TABLE `sofia_domains` DISABLE KEYS */;
/*!40000 ALTER TABLE `sofia_domains` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sofia_gateways`
--

DROP TABLE IF EXISTS `sofia_gateways`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sofia_gateways` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sofia_id` int(11) DEFAULT NULL,
  `gateway_name` varchar(255) DEFAULT NULL,
  `gateway_param` varchar(255) DEFAULT NULL,
  `gateway_value` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sofia_gateways`
--

LOCK TABLES `sofia_gateways` WRITE;
/*!40000 ALTER TABLE `sofia_gateways` DISABLE KEYS */;
INSERT INTO `sofia_gateways` VALUES (8,1,'default','proxy','asterlink.com'),(9,1,'default','realm','asterlink.com'),(10,1,'default','username','USERNAME_HERE'),(11,1,'default','register','false'),(12,1,'default','expire-seconds','60'),(13,1,'default','retry_seconds','2'),(14,1,'default','password','PASSWORD_HERE');
/*!40000 ALTER TABLE `sofia_gateways` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sofia_settings`
--

DROP TABLE IF EXISTS `sofia_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sofia_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sofia_id` int(11) DEFAULT NULL,
  `param_name` varchar(255) DEFAULT NULL,
  `param_value` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sofia_settings`
--

LOCK TABLES `sofia_settings` WRITE;
/*!40000 ALTER TABLE `sofia_settings` DISABLE KEYS */;
INSERT INTO `sofia_settings` VALUES (1,1,'user-agent-string','RayUA 2.0pre4'),(2,1,'auth-calls','true'),(5,1,'debug','1'),(6,1,'rfc2833-pt','101'),(7,1,'sip-port','5060'),(8,1,'dialplan','XML'),(9,1,'dtmf-duration','100'),(10,1,'codec-prefs','$${global_codec_prefs}'),(11,1,'rtp-timeout-sec','300'),(12,1,'rtp-ip','$${local_ip_v4}'),(13,1,'sip-ip','$${local_ip_v4}'),(14,1,'context','default'),(15,1,'manage-presence','true'),(16,1,'force-register-domain','intralanman.servehttp.com'),(17,1,'inbound-codec-negotiation','generous'),(18,1,'rtp-rewrite-timestampes','true'),(19,1,'nonce-ttl','60'),(20,1,'vad','out'),(36,1,'odbc-dsn','freeswitch-mysql:freeswitch:Fr33Sw1tch');
/*!40000 ALTER TABLE `sofia_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `voicemail_conf`
--

DROP TABLE IF EXISTS `voicemail_conf`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `voicemail_conf` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `vm_profile` varchar(64) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_profile` (`vm_profile`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `voicemail_conf`
--

LOCK TABLES `voicemail_conf` WRITE;
/*!40000 ALTER TABLE `voicemail_conf` DISABLE KEYS */;
INSERT INTO `voicemail_conf` VALUES (1,'default');
/*!40000 ALTER TABLE `voicemail_conf` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `voicemail_email`
--

DROP TABLE IF EXISTS `voicemail_email`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `voicemail_email` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `voicemail_id` int(10) unsigned NOT NULL,
  `param_name` varchar(64) NOT NULL,
  `param_value` varchar(64) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_profile_param` (`param_name`,`voicemail_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `voicemail_email`
--

LOCK TABLES `voicemail_email` WRITE;
/*!40000 ALTER TABLE `voicemail_email` DISABLE KEYS */;
INSERT INTO `voicemail_email` VALUES (1,1,'template-file','voicemail.tpl'),(2,1,'date-fmt','%A, %B %d %Y, %I %M %p'),(3,1,'email-from','${voicemail_account}@${voicemail_domain}');
/*!40000 ALTER TABLE `voicemail_email` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `voicemail_settings`
--

DROP TABLE IF EXISTS `voicemail_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `voicemail_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `voicemail_id` int(11) DEFAULT NULL,
  `param_name` varchar(255) DEFAULT NULL,
  `param_value` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `voicemail_settings`
--

LOCK TABLES `voicemail_settings` WRITE;
/*!40000 ALTER TABLE `voicemail_settings` DISABLE KEYS */;
INSERT INTO `voicemail_settings` VALUES (1,1,'file-extension','wav'),(2,1,'terminator-key','#'),(3,1,'max-login-attempts','3'),(4,1,'digit-timeout','10000'),(5,1,'max-record-length','300'),(6,1,'tone-spec','%(1000, 0, 640)'),(7,1,'callback-dialplan','XML'),(8,1,'callback-context','default'),(9,1,'play-new-messages-key','1'),(10,1,'play-saved-messages-key','2'),(11,1,'main-menu-key','*'),(12,1,'config-menu-key','5'),(13,1,'record-greeting-key','1'),(14,1,'choose-greeting-key','2'),(15,1,'record-file-key','3'),(16,1,'listen-file-key','1'),(17,1,'record-name-key','3'),(18,1,'save-file-key','9'),(19,1,'delete-file-key','7'),(20,1,'undelete-file-key','8'),(21,1,'email-key','4'),(22,1,'pause-key','0'),(23,1,'restart-key','1'),(24,1,'ff-key','6'),(25,1,'rew-key','4'),(26,1,'record-silence-threshold','200'),(27,1,'record-silence-hits','2'),(28,1,'web-template-file','web-vm.tpl'),(29,1,'operator-extension','operator XML default'),(30,1,'operator-key','9');
/*!40000 ALTER TABLE `voicemail_settings` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-11-22 12:56:40
