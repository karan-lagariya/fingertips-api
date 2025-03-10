-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 02, 2024 at 07:10 PM
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
(1, 'admin', 'Admin', 'admin@gmail.com', '/W5Am3G+z33CESBgw+5BBA==', NULL, 'Online', '2024-06-25 17:24:36', 1, 1, 0, '2023-09-27 13:19:18', '2024-06-25 17:24:03'),
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
(1, 1, 'g18ll6xafv5g67sajjat3m5okpbm0329w8imzaj88xpdj26ax75t5hpmv68skdk4', 'W', '2024-04-01 11:43:26', '2024-06-25 11:54:03');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_categorys`
--

CREATE TABLE `tbl_categorys` (
  `id` int(11) NOT NULL,
  `role` tinyint(1) NOT NULL DEFAULT 1 COMMENT ' 	0->user,1-> venodr,2->service provider 	',
  `en_name` varchar(164) NOT NULL,
  `guj_name` varchar(128) NOT NULL,
  `status` smallint(1) NOT NULL DEFAULT 1 COMMENT ' 1 => Active, 0 => In-active ',
  `is_deleted` smallint(1) NOT NULL DEFAULT 0 COMMENT ' 0 => Not Deleted, 1 => Deleted ',
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tbl_categorys`
--

INSERT INTO `tbl_categorys` (`id`, `role`, `en_name`, `guj_name`, `status`, `is_deleted`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'cloth store', 'test', 1, 0, '2024-06-08 06:50:46', '2024-06-22 11:08:06'),
(2, 0, 'test category 2', 'પરીક્ષણ શ્રેણી 2', 1, 0, '2024-06-22 10:30:04', '2024-06-22 17:49:10'),
(3, 2, 'Test 3', 'Test 3', 1, 0, '2024-06-22 17:49:10', '2024-06-24 17:23:24');

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
-- Table structure for table `tbl_otps`
--

CREATE TABLE `tbl_otps` (
  `id` int(11) NOT NULL,
  `functionality` varchar(32) NOT NULL,
  `email` varchar(256) NOT NULL,
  `otp` int(8) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_page_contents`
--

CREATE TABLE `tbl_page_contents` (
  `id` int(11) NOT NULL,
  `title` varchar(256) NOT NULL,
  `tag` varchar(256) NOT NULL,
  `data` text NOT NULL,
  `status` int(8) NOT NULL DEFAULT 1 COMMENT '1 => Active, 0 => In-active',
  `is_deleted` int(8) NOT NULL DEFAULT 0 COMMENT '0 => Not Deleted, 1 => Deleted',
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tbl_page_contents`
--

INSERT INTO `tbl_page_contents` (`id`, `title`, `tag`, `data`, `status`, `is_deleted`, `createdAt`, `updatedAt`) VALUES
(1, 'Privacy Policy', 'PRIVACY_POLICY', '<p>Privacy Policy Page</p>', 1, 0, '2023-10-16 05:21:03', '2024-05-05 12:10:27'),
(2, 'Terms and condition', 'TERMS_CONDITIONS', '<p>Terms &amp; condition page</p>', 1, 0, '2023-10-16 05:34:25', '2024-05-05 12:10:27'),
(3, 'About us', 'ABOUT_US', '<p>About Us Page</p>', 1, 0, '2023-10-16 06:02:39', '2024-05-05 12:10:27');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_products`
--

CREATE TABLE `tbl_products` (
  `id` int(11) NOT NULL,
  `name` varchar(164) NOT NULL,
  `product_code` varchar(64) NOT NULL,
  `category_id` int(11) NOT NULL,
  `subcategory_id` int(11) NOT NULL,
  `store_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `price` double(11,2) NOT NULL,
  `discount` double(11,2) NOT NULL,
  `discount_type` enum('flat','percentage') NOT NULL DEFAULT 'flat',
  `brand` varchar(164) NOT NULL,
  `gender` varchar(64) NOT NULL,
  `color` varchar(64) NOT NULL,
  `size` int(11) NOT NULL,
  `shape` varchar(164) NOT NULL,
  `material` varchar(164) NOT NULL,
  `pattern` varchar(164) NOT NULL,
  `design` varchar(164) NOT NULL,
  `type` varchar(164) NOT NULL,
  `sustainable` varchar(164) NOT NULL,
  `warranty` varchar(164) NOT NULL,
  `guarantee` varchar(164) NOT NULL,
  `quantity` varchar(164) NOT NULL,
  `quality` varchar(164) NOT NULL,
  `service` varchar(164) NOT NULL,
  `replacement` varchar(164) NOT NULL,
  `resale` varchar(164) NOT NULL,
  `details` text NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1 COMMENT ' 	1 => Active, 0 => In-active',
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT ' 0 => Not Deleted, 1 => Deleted ',
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tbl_products`
--

INSERT INTO `tbl_products` (`id`, `name`, `product_code`, `category_id`, `subcategory_id`, `store_id`, `user_id`, `price`, `discount`, `discount_type`, `brand`, `gender`, `color`, `size`, `shape`, `material`, `pattern`, `design`, `type`, `sustainable`, `warranty`, `guarantee`, `quantity`, `quality`, `service`, `replacement`, `resale`, `details`, `status`, `is_deleted`, `createdAt`, `updatedAt`) VALUES
(1, 'test name', 'test product code', 1, 2, 1, 4, 100.00, 10.00, 'flat', 'test brand', 'male', 'red', 11, 'test shape', 'test material', 'test pattern', 'test design', 'test type', 'test sustainable', 'test warranty', 'test guarantee', '12', 'best', 'test service', 'test replacement', 'yes', 'test details', 1, 0, '2024-06-22 17:00:30', '2024-06-24 23:05:12');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_product_images`
--

CREATE TABLE `tbl_product_images` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `image` varchar(164) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1 COMMENT ' 1 => Active, 0 => In-active ',
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT ' 0 => Not Deleted, 1 => Deleted ',
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_sub_categorys`
--

CREATE TABLE `tbl_sub_categorys` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `en_name` varchar(164) NOT NULL,
  `guj_name` varchar(164) NOT NULL,
  `status` smallint(1) NOT NULL DEFAULT 1 COMMENT ' 	1 => Active, 0 => In-active',
  `is_deleted` smallint(1) NOT NULL DEFAULT 0 COMMENT ' 0 => Not Deleted, 1 => Deleted ',
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tbl_sub_categorys`
--

INSERT INTO `tbl_sub_categorys` (`id`, `category_id`, `en_name`, `guj_name`, `status`, `is_deleted`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'shirt', 'test', 1, 0, '2024-06-08 07:21:40', '2024-06-22 11:10:40'),
(2, 1, 't-shirt', 'testt', 1, 0, '2024-06-08 07:41:13', '2024-06-22 11:27:21'),
(3, 2, 'hh', 'gg', 1, 0, '2024-06-22 11:23:26', '2024-06-24 17:23:24');

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
  `language` varchar(32) NOT NULL,
  `phone_no` varchar(255) DEFAULT NULL,
  `country_code` varchar(255) DEFAULT NULL,
  `dob` varchar(64) NOT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `email_verification_token` varchar(255) DEFAULT NULL,
  `forgot_password_token` varchar(255) DEFAULT NULL,
  `role` tinyint(4) NOT NULL DEFAULT 0 COMMENT '0->user,1-> venodr,2->service provider',
  `login_status` enum('Online','Offline') DEFAULT 'Online',
  `app_version` varchar(255) DEFAULT NULL,
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

INSERT INTO `tbl_users` (`id`, `en_full_name`, `guj_full_name`, `email`, `password`, `language`, `phone_no`, `country_code`, `dob`, `profile_image`, `email_verification_token`, `forgot_password_token`, `role`, `login_status`, `app_version`, `status`, `otp`, `is_verified`, `is_available`, `is_notification`, `is_deleted`, `last_login`, `verifiedAt`, `createdAt`, `updatedAt`) VALUES
(1, 'Testing', 'પરીક્ષણ', 'test@gmail.com', '7/W92JwqDduMmNmdfU3GCQ==', 'English', '1234567890', '91', '', 'default.png', NULL, NULL, 0, 'Offline', NULL, 1, 0, 0, 1, 1, 0, '2024-04-20 10:47:47', '2024-04-20 10:47:47', '2024-04-20 14:26:15', '2024-06-24 17:23:24'),
(3, 'vendor testing', 'ટેસ્ટ 2', 'test2@gmail.com', 'vahgscvcs', 'English', '11331111111', '91', '', 'default.png', NULL, NULL, 1, 'Offline', NULL, 1, 0, 0, 1, 1, 0, '2024-04-20 11:54:12', '2024-04-20 11:54:12', '2024-04-20 15:26:36', '2024-06-22 16:29:56'),
(4, 'Service provider', 'ટેસ્ટ 3', 'test3@gmail.com', 'ggahsbhksbda', 'English', '2222222222', '91', '', 'default.png', NULL, NULL, 2, 'Offline', NULL, 1, 0, 0, 1, 1, 0, '2024-04-20 12:25:14', '2024-04-20 12:25:14', '2024-04-20 15:57:53', '2024-06-24 17:23:24'),
(11, 'user testt', ' ટેસ્ટ ટેસ્ટ', 'usertestt@gmail.com', '/W5Am3G+z33CESBgw+5BBA==', 'English', '1111111111', '1', '', 'default.png', NULL, NULL, 1, 'Offline', NULL, 1, 0, 0, 1, 1, 1, '2024-07-02 17:09:40', '2024-04-28 07:52:28', '2024-04-28 07:52:28', '2024-07-02 17:09:29'),
(13, 'new user test 1', 'new ટેસ્ટ', 'newusertest@gmail.com', '1HyVc/x1yuT1kqqi27UFVA==', 'English', '1233367888', '91', '', 'default.png', NULL, NULL, 0, 'Online', NULL, 1, 0, 0, 1, 1, 0, '2024-07-02 02:22:13', '2024-07-02 02:22:13', '2024-07-02 02:22:13', '2024-07-02 02:22:13'),
(15, 'new user2 test 1', 'new 2 ટેસ્ટ', 'new2usertest@gmail.com', '/W5Am3G+z33CESBgw+5BBA==', 'Gujarati', '1114567888', '91', '12-12-2000', 'abc.jpg', NULL, NULL, 1, 'Online', NULL, 1, 0, 0, 1, 1, 0, '2024-07-02 02:50:31', '2024-07-02 02:50:31', '2024-07-02 02:50:31', '2024-07-02 02:50:31'),
(16, 'new user3 test 1', 'new 3 ટેસ્ટ', 'new3usertest@gmail.com', '/W5Am3G+z33CESBgw+5BBA==', 'Gujarati', '1114167888', '91', '12-12-2000', 'abc.jpg', NULL, NULL, 2, 'Online', NULL, 1, 0, 0, 1, 1, 0, '2024-07-02 16:49:37', '2024-07-02 16:49:37', '2024-07-02 16:49:37', '2024-07-02 16:49:37');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_user_details`
--

CREATE TABLE `tbl_user_details` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `name` varchar(164) NOT NULL,
  `gstno` varchar(164) NOT NULL,
  `en_address` text NOT NULL,
  `guj_address` text NOT NULL,
  `latitude` varchar(64) NOT NULL,
  `longitude` varchar(64) NOT NULL,
  `en_street` text NOT NULL,
  `guj_street` text NOT NULL,
  `image` varchar(16) NOT NULL,
  `en_work_details` text NOT NULL,
  `guj_work_details` text NOT NULL,
  `en_area` text NOT NULL,
  `guj_area` text NOT NULL,
  `en_pincode` varchar(164) NOT NULL,
  `guj_pincode` varchar(164) NOT NULL,
  `type` enum('store','service') NOT NULL DEFAULT 'store',
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tbl_user_details`
--

INSERT INTO `tbl_user_details` (`id`, `user_id`, `category_id`, `name`, `gstno`, `en_address`, `guj_address`, `latitude`, `longitude`, `en_street`, `guj_street`, `image`, `en_work_details`, `guj_work_details`, `en_area`, `guj_area`, `en_pincode`, `guj_pincode`, `type`, `status`, `is_deleted`, `createdAt`, `updatedAt`) VALUES
(1, 11, 2, 'store name', 'store gst no', 'store en address', 'store guj address', '123456', '456789', 'store en street', 'store guj street', 'default.png', '', '', 'store en area', 'store guj area', '121212', '343434', 'service', 1, 1, '2024-06-22 17:21:38', '2024-07-02 17:09:29'),
(2, 11, 2, 'test store name', 'test gstno', 'en_store_address', 'guj_store_address', '', '', 'en_street', 'guj_street', '', '', '', 'en_area', 'guj_area', 'en_pincode', 'guj_pincode', 'store', 1, 1, '2024-07-02 02:50:31', '2024-07-02 17:09:29'),
(3, 16, 3, '', '', 'en_store_address', 'guj_store_address', '', '', 'en_street', 'guj_street', 'a,aa,aaa', 'en_work_details', 'guj_work_details', 'en_area', 'guj_area', 'en_pincode', 'guj_pincode', 'service', 1, 0, '2024-07-02 16:49:37', '2024-07-02 16:49:37');

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
-- Dumping data for table `tbl_user_device_informations`
--

INSERT INTO `tbl_user_device_informations` (`id`, `user_id`, `token`, `device_type`, `device_token`, `uuid`, `os_version`, `device_model`, `app_version`, `createdAt`, `updatedAt`) VALUES
(5, 11, NULL, 'A', NULL, 'sss', '11', 'ABC', 'v1', '2024-04-28 07:52:40', '2024-07-02 17:09:40'),
(6, 12, 'm2iv5bi7mhiu3g6jhs9bln7up76bhuazg9nifhla31fozh5hbnoo9xitlp2pxgls', 'A', 'zdzddddd', 'sss', '11', 'ABC', 'v1', '2024-07-02 02:20:44', '2024-07-02 02:20:44'),
(7, 13, 'z9bh4muc2pbddgfde2pr4feppn8ljjcy0btzam5036l5kytrdbucxyrh9423g7ap', 'A', 'zdzddddd', 'sss', '11', 'ABC', 'v1', '2024-07-02 02:22:59', '2024-07-02 02:22:59'),
(8, 15, 'r60gdtdmlpisdav3cunbxmnr14ww6bxzpjbk1nbne6sr53io5jujk2wiydlm7o3i', 'A', 'zdzddddd', 'sss', '11', 'ABC', 'v1', '2024-07-02 02:50:49', '2024-07-02 02:50:49'),
(9, 16, '967v6kxxf6wjjdy8z53h5lkgi6y1fpbns3c57e6lq81iah8ry04z44fp7f985adg', 'A', 'zdzddddd', 'sss', '11', 'ABC', 'v1', '2024-07-02 16:49:43', '2024-07-02 16:49:43');

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
-- Indexes for table `tbl_categorys`
--
ALTER TABLE `tbl_categorys`
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
-- Indexes for table `tbl_otps`
--
ALTER TABLE `tbl_otps`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_page_contents`
--
ALTER TABLE `tbl_page_contents`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_products`
--
ALTER TABLE `tbl_products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_product_images`
--
ALTER TABLE `tbl_product_images`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_sub_categorys`
--
ALTER TABLE `tbl_sub_categorys`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_users`
--
ALTER TABLE `tbl_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone_no` (`phone_no`);

--
-- Indexes for table `tbl_user_details`
--
ALTER TABLE `tbl_user_details`
  ADD PRIMARY KEY (`id`);

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
-- AUTO_INCREMENT for table `tbl_categorys`
--
ALTER TABLE `tbl_categorys`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
-- AUTO_INCREMENT for table `tbl_otps`
--
ALTER TABLE `tbl_otps`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_page_contents`
--
ALTER TABLE `tbl_page_contents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_products`
--
ALTER TABLE `tbl_products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tbl_product_images`
--
ALTER TABLE `tbl_product_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_sub_categorys`
--
ALTER TABLE `tbl_sub_categorys`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_users`
--
ALTER TABLE `tbl_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `tbl_user_details`
--
ALTER TABLE `tbl_user_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_user_device_informations`
--
ALTER TABLE `tbl_user_device_informations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
