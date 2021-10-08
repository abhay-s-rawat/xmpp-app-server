-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Oct 08, 2021 at 03:26 PM
-- Server version: 10.6.0-MariaDB-1:10.6.0+maria~focal
-- PHP Version: 7.4.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `myxmpp`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`%` PROCEDURE `getNotficationTokenByJID` (IN `u_jid` VARCHAR(100))  BEGIN
SELECT
`token`,
`device_type`
FROM `users_notification_info`
WHERE
`user_id` = u_jid;
END$$

CREATE DEFINER=`root`@`%` PROCEDURE `updateNotificationToken` (IN `u_jid` VARCHAR(100), IN `u_token` TEXT, IN `u_device_type` TINYINT UNSIGNED)  BEGIN
INSERT INTO `users_notification_info`
(`user_id`, `token`, `device_type`)
VALUES
(u_jid, u_token, u_device_type)
ON DUPLICATE KEY UPDATE
`device_type` = u_device_type,
`token` =  u_token;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `users_notification_info`
--

CREATE TABLE `users_notification_info` (
  `user_id` varchar(100) NOT NULL,
  `token` text NOT NULL,
  `device_type` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users_notification_info`
--
ALTER TABLE `users_notification_info`
  ADD PRIMARY KEY (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
