-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 02, 2022 at 07:38 AM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `child_care`
--

-- --------------------------------------------------------

--
-- Table structure for table `children`
--

CREATE TABLE `children` (
  `child_id` varchar(255) NOT NULL,
  `dateofbirth` varchar(255) NOT NULL,
  `timeofbirth` time(6) NOT NULL,
  `doctor_id` varchar(255) CHARACTER SET armscii8 NOT NULL,
  `parent_id` varchar(255) CHARACTER SET armscii8 NOT NULL,
  `blood_group` varchar(255) CHARACTER SET armscii8 NOT NULL,
  `mother_name` varchar(255) CHARACTER SET armscii8 NOT NULL,
  `father_name` varchar(255) NOT NULL,
  `phone_number` int(10) NOT NULL,
  `email` varchar(20) CHARACTER SET armscii8 NOT NULL DEFAULT 'Not Specified',
  `address` varchar(255) CHARACTER SET armscii8 NOT NULL,
  `height` varchar(255) NOT NULL,
  `weight` varchar(255) NOT NULL,
  `pulse` varchar(255) CHARACTER SET armscii8 NOT NULL,
  `temperature` varchar(255) NOT NULL,
  `incubator_temp` varchar(255) DEFAULT NULL,
  `humidity` float NOT NULL,
  `co2` varchar(255) NOT NULL,
  `o2` varchar(255) NOT NULL,
  `created_date` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `children`
--

INSERT INTO `children` (`child_id`, `dateofbirth`, `timeofbirth`, `doctor_id`, `parent_id`, `blood_group`, `mother_name`, `father_name`, `phone_number`, `email`, `address`, `height`, `weight`, `pulse`, `temperature`, `incubator_temp`, `humidity`, `co2`, `o2`, `created_date`) VALUES
('NB30052022', '10 Jan 2022', '09:09:19.000000', 'XYZ ', '', 'A+', 'XYZ', 'XYZ', 1233456789, 'Not Specified123@gma', ' mangalore 123 xyz', '78', '3.5', '140', '35.3', '37', 67.3, '', '', '2022-06-01');

-- --------------------------------------------------------

--
-- Table structure for table `diagnostic`
--

CREATE TABLE `diagnostic` (
  `diagnostic_id` varchar(255) NOT NULL,
  `diagnostic_name` varchar(255) NOT NULL,
  `date_of_diagnostic` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `doctor_id` varchar(255) NOT NULL,
  `child_id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `medical_staff`
--

CREATE TABLE `medical_staff` (
  `uid` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `designation` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) NOT NULL,
  `sec_password` varchar(255) NOT NULL,
  `created_date` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `medical_staff`
--

INSERT INTO `medical_staff` (`uid`, `name`, `designation`, `email`, `phone_number`, `sec_password`, `created_date`) VALUES
('1efb0b1f-05bd-4aff-9683-ec1b92780ec5', 'niharika', 'Doctor', 'niharika@gmail.com', '8123942452', '$2a$10$JW8/JXY3Dn0.IFBDJRR3M.yi77ai1iW1cevNplRV0VPioH617wlUa', '1653976526571'),
('936f1ed2-5f24-4b92-b543-8158caaff998', 'raveen', 'Doctor', 'raveen@gmail.com', '8123942452', '$2a$10$BHW1U4U8vGTM5/AUGO9XSu2ZnHFrdT8Wug7YKYt/pG1wpdBeKnNru', '1654047581964'),
('fb0cf4b8-17df-4755-a097-d90cb6d8b77a', '123', 'Doctor', '123@gmail.com', '8123942452', '$2a$10$qzLryuuJ2FOLeXZUElaXUu6inY8Oqas7GZsckDCagsVdKEmYBuZwu', '1654046838645');

-- --------------------------------------------------------

--
-- Table structure for table `parents`
--

CREATE TABLE `parents` (
  `uid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `sec_password` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `created_date` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `parents`
--

INSERT INTO `parents` (`uid`, `name`, `email`, `sec_password`, `phone_number`, `created_date`) VALUES
('66ceaa6a-8896-4219-901d-b682b78d2698', 'niharika', 'niharika@gmail.com', '$2a$10$DWLM2XUTTvCeLyu0lyaQvehd9HSTzbixG18FfBO6VVUKMijAkFT1u', '8123942452', '1653976049684'),
('dc149c23-dbda-4681-bbe8-ac342eb4c653', 'Himanshu', 'himanshubhatt202@gmail.com', '$2a$10$WQcJsZulGh174S4mCSei/OGlNNp7SQ3HVPWtUlK9EJhaBHatJx8fe', '8123942452', '1653975022777');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `children`
--
ALTER TABLE `children`
  ADD PRIMARY KEY (`child_id`);

--
-- Indexes for table `diagnostic`
--
ALTER TABLE `diagnostic`
  ADD PRIMARY KEY (`diagnostic_id`),
  ADD KEY `TEST` (`child_id`),
  ADD KEY `test2` (`doctor_id`);

--
-- Indexes for table `medical_staff`
--
ALTER TABLE `medical_staff`
  ADD PRIMARY KEY (`uid`),
  ADD UNIQUE KEY `email_id` (`email`);

--
-- Indexes for table `parents`
--
ALTER TABLE `parents`
  ADD PRIMARY KEY (`uid`),
  ADD UNIQUE KEY `email_id` (`email`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `diagnostic`
--
ALTER TABLE `diagnostic`
  ADD CONSTRAINT `TEST` FOREIGN KEY (`child_id`) REFERENCES `children` (`child_id`),
  ADD CONSTRAINT `test2` FOREIGN KEY (`doctor_id`) REFERENCES `medical_staff` (`uid`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
