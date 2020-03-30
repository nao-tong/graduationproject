/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 50720
 Source Host           : localhost:3306
 Source Schema         : graduationdesign

 Target Server Type    : MySQL
 Target Server Version : 50720
 File Encoding         : 65001

 Date: 30/03/2020 16:42:51
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for file
-- ----------------------------
DROP TABLE IF EXISTS `file`;
CREATE TABLE `file`  (
  `userid` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户id',
  `file1` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `file2` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `file3` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `file4` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `file5` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`userid`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of file
-- ----------------------------
INSERT INTO `file` VALUES ('0', '6p4dxpak7a000000000', '659mp5gmx9o00000000', '9dt4brhld3400000000', '', '');
INSERT INTO `file` VALUES ('1000000000', 'wwzoy4yu14g0000000', 'xlmpngpdw8g0000000', NULL, NULL, NULL);
INSERT INTO `file` VALUES ('999999999', NULL, NULL, NULL, NULL, NULL);

-- ----------------------------
-- Table structure for filemsg
-- ----------------------------
DROP TABLE IF EXISTS `filemsg`;
CREATE TABLE `filemsg`  (
  `fileid` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '文件id',
  `filename` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '文件名',
  `filetype` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '文件类型',
  `filesize` double(255, 0) NOT NULL COMMENT '文件大小',
  `updt` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '更新日期',
  `filepath` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '文件路径',
  PRIMARY KEY (`fileid`, `filename`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of filemsg
-- ----------------------------
INSERT INTO `filemsg` VALUES ('659mp5gmx9o00000000', 'avatar-1583028914890-midouzi.png', 'image', 2617754, '1583028914890', '/upload/images/0/avatar-1583028914890-midouzi.png');
INSERT INTO `filemsg` VALUES ('6p4dxpak7a000000000', 'avatar-1584410359778-02 课程内容.mp4', 'video', 7770232, '1584410359778', '/upload/video/0/avatar-1584410359778-02 课程内容.mp4');
INSERT INTO `filemsg` VALUES ('9dt4brhld3400000000', 'avatar-1583405387475-密码.txt', 'text', 21, '1583405387475', '/upload/text/0/avatar-1583405387475-密码.txt');
INSERT INTO `filemsg` VALUES ('wwzoy4yu14g0000000', 'avatar-1583803974814-01.jpg', 'image', 544008, '1583803974814', '/upload/images/1000000000/avatar-1583803974814-01.jpg');
INSERT INTO `filemsg` VALUES ('xlmpngpdw8g0000000', 'avatar-1583804051667-20150101154057_e2XZr.thumb.700_0.jpeg', 'image', 96673, '1583804051667', '/upload/images/1000000000/avatar-1583804051667-20150101154057_e2XZr.thumb.700_0.jpeg');

-- ----------------------------
-- Table structure for mj_0
-- ----------------------------
DROP TABLE IF EXISTS `mj_0`;
CREATE TABLE `mj_0`  (
  `serial` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `mj1` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `mj2` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `mj3` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `mj4` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`serial`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of mj_0
-- ----------------------------
INSERT INTO `mj_0` VALUES (1, '1', '2', '3', '4');
INSERT INTO `mj_0` VALUES (2, '5', '6', '7', '8');
INSERT INTO `mj_0` VALUES (3, '4', '5', '6', '7');
INSERT INTO `mj_0` VALUES (4, '9', '1', '2', '3');

-- ----------------------------
-- Table structure for mk_0
-- ----------------------------
DROP TABLE IF EXISTS `mk_0`;
CREATE TABLE `mk_0`  (
  `serial` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `mk1` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `mk2` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `mk3` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`serial`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of mk_0
-- ----------------------------
INSERT INTO `mk_0` VALUES (1, '3', '2', '4');
INSERT INTO `mk_0` VALUES (3, '1', '4', '9');
INSERT INTO `mk_0` VALUES (4, '5', '6', '7');

-- ----------------------------
-- Table structure for mk_1000000000
-- ----------------------------
DROP TABLE IF EXISTS `mk_1000000000`;
CREATE TABLE `mk_1000000000`  (
  `serial` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `mk1` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`serial`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of mk_1000000000
-- ----------------------------
INSERT INTO `mk_1000000000` VALUES (1, '0');

-- ----------------------------
-- Table structure for ml1_1000000000
-- ----------------------------
DROP TABLE IF EXISTS `ml1_1000000000`;
CREATE TABLE `ml1_1000000000`  (
  `serial` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `ml1` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `ml4` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `ml5` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`serial`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ml1_1000000000
-- ----------------------------
INSERT INTO `ml1_1000000000` VALUES (1, '7', '6', '9');
INSERT INTO `ml1_1000000000` VALUES (3, '5', '6', '8');

-- ----------------------------
-- Table structure for tablelink
-- ----------------------------
DROP TABLE IF EXISTS `tablelink`;
CREATE TABLE `tablelink`  (
  `userid` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户id',
  `table1` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `table2` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `table3` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`userid`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of tablelink
-- ----------------------------
INSERT INTO `tablelink` VALUES ('0', 'mk_0', '', 'mj_0');
INSERT INTO `tablelink` VALUES ('1000000000', 'mk_1000000000', 'ml1_1000000000', NULL);

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `serial` int(255) NOT NULL AUTO_INCREMENT COMMENT '序号',
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户名',
  `userid` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户id',
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户密码',
  `headimg` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '用户头像',
  `admin` int(1) NOT NULL COMMENT '管理员认证',
  PRIMARY KEY (`serial`, `userid`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 28 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 'admin', '0', '60413999D80F15B4F7F57D8308DAD8CF', '/upload/images//avatar-1582968555648-2013010611132931.jpg', 0);
INSERT INTO `user` VALUES (3, '999999999', '999999999', '123', '/upload/images/account.jpg', 2);
INSERT INTO `user` VALUES (20, '123456', '1000000000', '0FA00516C7FA7350DED84B110C438F04', '/upload/images//avatar-1583804243643-timg (5).jpg', 2);

SET FOREIGN_KEY_CHECKS = 1;
