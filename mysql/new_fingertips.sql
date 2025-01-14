-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 20, 2024 at 12:52 PM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 8.1.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fingertips`
--

-- --------------------------------------------------------

--
-- Table structure for table `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20230919112336-create-admins.cjs'),
('20230919112656-create-users.cjs'),
('20230920134304-modify_tbl_users_add_new_fields.cjs'),
('20230921121609-modify_tbl_users_add_license_no.cjs'),
('20230925105353-modify_tbl_users_add_role.cjs'),
('20230927060921-modify_tbl_users_add_new_fields.cjs'),
('20230927103442-create-userdevice.cjs'),
('20230927105457-modify_tbl_users_add_last_login_field.cjs'),
('20230927131051-modify_tbl_users_add_email_verification_token_field.cjs'),
('20230928073748-modify_tbl_users_add_forgot_password_token_field.cjs'),
('20230928111908-modify_tbl_admins_add_new_fields.cjs'),
('20230928113620-create-admindevice.cjs'),
('20230929072324-modify_tbl_admins_add_new_field_profile_image.cjs'),
('20231002083245-modify_tbl_users_add_new_field_country_code.cjs'),
('20231003092850-create-feedback.cjs'),
('20231004065258-create-pregnancy.cjs'),
('20231004080054-create-agegroups.cjs'),
('20231004082917-create-regions.cjs'),
('20231006064859-modify_tbl_age_groups_add_new_field_role.cjs'),
('20231006083040-modify_tbl_regions_add_new_field_role.cjs'),
('20231006102913-modify_tbl_pregnancy_options_add_new_field_role.cjs'),
('20231011062228-modify_tbl_users_add_new_fields.cjs'),
('20231011132207-create-countries.cjs'),
('20231012054904-add-default-value-to-createdAt-tbl-countries.cjs'),
('20231012055916-add-default-value-to-updatedAT-tbl-countries.cjs'),
('20231016054346-modify_tbl_users_add_is_available.cjs'),
('20231016081449-create-pagecontents.cjs'),
('20231016095014-modify_tbl_page_contents_add_title_field.cjs'),
('20231027082521-modify_tbl_users_add_new_fields.cjs'),
('20231116063109-create-isabel-reports.cjs'),
('20231120083141-create-docsumo.cjs'),
('20231124071500-create-chat-gpt.cjs'),
('20231124080305-modify_tbl_chat_gpts_add_chatgpt_id_field.cjs'),
('20231205085936-modify_tbl_users_add_new_fields.cjs'),
('20231205103113-modify_tbl_docsumos_add_new_fields.cjs'),
('20231206063217-create-medical-specialities.cjs'),
('20231206074039-rename_litigations_to_litigations_text_in_tbl_users.cjs'),
('20231206074435-modify_tbl_users_add_new_fields.cjs'),
('20231206083344-modify_tbl_users_add_new_fields.cjs'),
('20231206095632-modify_tbl_users_add_new_fields.cjs'),
('20231207055750-modify_tbl_users_add_new_fields.cjs'),
('20231207061549-modify_tbl_users_change_column_litigations_and_disciplinary_issues.cjs'),
('20231207111136-create-doctor-specilities-relation.cjs'),
('20231208090412-modify_tbl_chat_gpts_change_column_prompt.cjs'),
('20231211063105-modify_tbl_chat_gpts_add_new_fields.cjs'),
('20231211085347-remove_tbl_docsumos_remove_fields.cjs'),
('20231211102148-modify_tbl_users_add_new_fields.cjs'),
('20231213065835-modify_tbl_users_add_column_permission_code.cjs');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_admins`
--

CREATE TABLE `tbl_admins` (
  `id` int(11) NOT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `login_status` enum('Online','Offline') DEFAULT 'Offline',
  `last_login` datetime DEFAULT NULL,
  `role` int(11) DEFAULT NULL COMMENT '1 => Admin, 2 => Sub Admin',
  `status` int(11) DEFAULT 1 COMMENT '1 => Active, 0 => In-active',
  `is_deleted` int(11) DEFAULT 0 COMMENT '0 => Not Deleted, 1 => Deleted',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tbl_admins`
--

INSERT INTO `tbl_admins` (`id`, `first_name`, `last_name`, `email`, `password`, `profile_image`, `login_status`, `last_login`, `role`, `status`, `is_deleted`, `createdAt`, `updatedAt`) VALUES
(1, 'admin', 'Admin', 'admin@gmail.com', '/W5Am3G+z33CESBgw+5BBA==', NULL, 'Offline', '2024-04-20 10:48:56', 1, 1, 0, '2023-09-27 13:19:18', '2024-04-20 10:45:59'),
(2, 'admin', 'Admin2', 'admin1@mail.com', '/W5Am3G+z33CESBgw+5BBA==', NULL, 'Offline', NULL, 1, 1, 0, '2023-09-27 13:19:18', '2023-09-27 13:19:18');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_admin_device_informations`
--

CREATE TABLE `tbl_admin_device_informations` (
  `id` int(11) NOT NULL,
  `admin_id` int(11) DEFAULT 0,
  `token` varchar(255) DEFAULT NULL,
  `device_type` enum('W','A','I') DEFAULT 'W' COMMENT 'W => Web(ReactJs), A => Android, I => Iphone',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tbl_admin_device_informations`
--

INSERT INTO `tbl_admin_device_informations` (`id`, `admin_id`, `token`, `device_type`, `createdAt`, `updatedAt`) VALUES
(1, 1, NULL, 'W', '2024-04-01 11:43:26', '2024-04-20 05:15:59');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_countries`
--

CREATE TABLE `tbl_countries` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `nationality` varchar(255) DEFAULT NULL,
  `sortname` varchar(255) DEFAULT NULL,
  `calling_code` varchar(255) DEFAULT NULL,
  `currency_code` varchar(255) DEFAULT NULL,
  `currency_name` varchar(255) DEFAULT NULL,
  `currency_symbol` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT 1,
  `is_deleted` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_images`
--

CREATE TABLE `tbl_images` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `image` varchar(164) NOT NULL,
  `status` int(11) NOT NULL,
  `is_deleted` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_users`
--

CREATE TABLE `tbl_users` (
  `id` int(11) NOT NULL,
  `en_full_name` varchar(255) DEFAULT NULL,
  `guj_full_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone_no` varchar(255) DEFAULT NULL,
  `country_code` varchar(255) DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `email_verification_token` varchar(255) DEFAULT NULL,
  `forgot_password_token` varchar(255) DEFAULT NULL,
  `role` tinyint(4) NOT NULL DEFAULT 0 COMMENT '0->user,1-> venodr,2->service provider',
  `login_status` enum('Online','Offline') DEFAULT 'Offline',
  `app_version` varchar(255) DEFAULT NULL,
  `whatsapp_number` varchar(164) NOT NULL,
  `dob` date NOT NULL,
  `store_name` varchar(256) NOT NULL,
  `gstno` varchar(164) NOT NULL,
  `en_work_details` text NOT NULL,
  `guj_work_details` text NOT NULL,
  `status` int(11) DEFAULT 1 COMMENT '1 => Active, 0 => In-active',
  `otp` int(11) NOT NULL,
  `is_verified` int(11) DEFAULT 0 COMMENT '0 => Not verified, 1 => verified',
  `is_available` tinyint(4) DEFAULT 1,
  `is_notification` tinyint(1) NOT NULL DEFAULT 1,
  `is_deleted` int(11) DEFAULT 0 COMMENT '0 => Not Deleted, 1 => Deleted',
  `last_login` datetime DEFAULT NULL,
  `verifiedAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tbl_users`
--

INSERT INTO `tbl_users` (`id`, `en_full_name`, `guj_full_name`, `email`, `password`, `address`, `phone_no`, `country_code`, `profile_image`, `email_verification_token`, `forgot_password_token`, `role`, `login_status`, `app_version`, `whatsapp_number`, `dob`, `store_name`, `gstno`, `en_work_details`, `guj_work_details`, `status`, `otp`, `is_verified`, `is_available`, `is_notification`, `is_deleted`, `last_login`, `verifiedAt`, `createdAt`, `updatedAt`) VALUES
(1, 'Testing', 'પરીક્ષણ', 'test@gmail.com', 'sddsdsds', 'test address', '1234567890', '91', 'defult.png', NULL, NULL, 0, 'Offline', NULL, '1234567890', '2024-04-01', '', '', '', '', 1, 0, 0, 1, 1, 0, '2024-04-20 10:47:47', '2024-04-20 10:47:47', '2024-04-20 14:26:15', '2024-04-20 15:10:14'),
(3, 'vendor testing', 'ટેસ્ટ 2', 'test2@gmail.com', 'vahgscvcs', 'test address', '1111111111', '91', 'defult.png', NULL, NULL, 1, 'Offline', NULL, '', '0000-00-00', '', '', '', '', 1, 0, 0, 1, 1, 0, '2024-04-20 11:54:12', '2024-04-20 11:54:12', '2024-04-20 15:26:36', '2024-04-20 15:41:20'),
(4, 'Service provider', 'ટેસ્ટ 3', 'test3@gmail.com', 'ggahsbhksbda', 'address', '2222222222', '91', 'defult.png', NULL, NULL, 2, 'Offline', NULL, '', '0000-00-00', '', '', '', '', 1, 0, 0, 1, 1, 0, '2024-04-20 12:25:14', '2024-04-20 12:25:14', '2024-04-20 15:57:53', '2024-04-20 16:16:59');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_user_device_informations`
--

CREATE TABLE `tbl_user_device_informations` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT 0,
  `token` varchar(255) DEFAULT NULL,
  `device_type` enum('W','A','I') DEFAULT 'W' COMMENT 'W => Web(ReactJs), A => Android, I => Iphone',
  `device_token` varchar(255) DEFAULT NULL,
  `uuid` varchar(255) DEFAULT NULL,
  `os_version` varchar(255) DEFAULT NULL,
  `device_model` varchar(255) DEFAULT NULL,
  `app_version` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `tbl_admins`
--
ALTER TABLE `tbl_admins`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_admin_device_informations`
--
ALTER TABLE `tbl_admin_device_informations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_countries`
--
ALTER TABLE `tbl_countries`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_images`
--
ALTER TABLE `tbl_images`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_users`
--
ALTER TABLE `tbl_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone_no` (`phone_no`);

--
-- Indexes for table `tbl_user_device_informations`
--
ALTER TABLE `tbl_user_device_informations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_admins`
--
ALTER TABLE `tbl_admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tbl_admin_device_informations`
--
ALTER TABLE `tbl_admin_device_informations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tbl_countries`
--
ALTER TABLE `tbl_countries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_images`
--
ALTER TABLE `tbl_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_users`
--
ALTER TABLE `tbl_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tbl_user_device_informations`
--
ALTER TABLE `tbl_user_device_informations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
