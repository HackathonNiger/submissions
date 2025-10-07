-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 07, 2025 at 07:12 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gestpay`
--

-- --------------------------------------------------------

--
-- Table structure for table `jwt`
--

CREATE TABLE `jwt` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token` text DEFAULT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `linked_accounts`
--

CREATE TABLE `linked_accounts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `platform` enum('whatsapp','telegram') NOT NULL,
  `platform_id` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `luxand_logs`
--

CREATE TABLE `luxand_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `luxand_uuid` varchar(255) DEFAULT NULL,
  `action` enum('enroll','verify','delete','update') NOT NULL,
  `result` enum('success','failed','error') NOT NULL,
  `confidence` decimal(5,4) DEFAULT NULL,
  `details` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `api_response` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`api_response`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `luxand_persons`
--

CREATE TABLE `luxand_persons` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `luxand_uuid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `collection` varchar(100) DEFAULT 'gestpay_users',
  `photos_count` int(11) DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `merchants`
--

CREATE TABLE `merchants` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(100) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `monthly_revenue` decimal(15,2) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `kyc_level` tinyint(1) NOT NULL DEFAULT 1,
  `verified` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `type` enum('general','wallet','security') NOT NULL,
  `transaction_id` int(11) DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `otp_codes`
--

CREATE TABLE `otp_codes` (
  `id` int(11) NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `chat_id` varchar(50) NOT NULL,
  `code` varchar(6) NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `used` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `telegram_messages`
--

CREATE TABLE `telegram_messages` (
  `id` int(11) NOT NULL,
  `chat_id` varchar(50) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `message_type` enum('text','contact','callback','command') NOT NULL,
  `message_content` text DEFAULT NULL,
  `bot_response` text DEFAULT NULL,
  `action_taken` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `telegram_sessions`
--

CREATE TABLE `telegram_sessions` (
  `id` int(11) NOT NULL,
  `chat_id` varchar(50) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `state` enum('start','awaiting_phone','linked','awaiting_otp') NOT NULL DEFAULT 'start',
  `temp_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`temp_data`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `reference` varchar(255) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `feature` enum('wallet','voice-pay','face-pay','chat-pay','transfer','telegram-pay','whatsapp-pay') NOT NULL,
  `type` enum('debit','credit') NOT NULL,
  `status` enum('pending','successful','failed','reversed') NOT NULL DEFAULT 'pending',
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transfers`
--

CREATE TABLE `transfers` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) DEFAULT NULL,
  `merchant` varchar(255) DEFAULT NULL,
  `amount` decimal(15,2) NOT NULL,
  `status` enum('pending','successful','failed','reversed') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `merchant_id` int(11) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `username` varchar(25) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `balance` decimal(15,2) NOT NULL DEFAULT 0.00,
  `total_credit` decimal(15,2) NOT NULL DEFAULT 0.00,
  `total_debit` decimal(15,2) NOT NULL DEFAULT 0.00,
  `has_setup_biometric` tinyint(1) NOT NULL DEFAULT 0,
  `has_setup_telegram` tinyint(1) NOT NULL DEFAULT 0,
  `has_setup_whatsapp` tinyint(1) NOT NULL DEFAULT 0,
  `allow_face_payments` tinyint(1) NOT NULL DEFAULT 0,
  `confirm_payment` tinyint(1) NOT NULL DEFAULT 0,
  `pin` varchar(255) DEFAULT NULL,
  `virtual_account_number` varchar(25) DEFAULT NULL,
  `virtual_account_bank` varchar(50) DEFAULT NULL,
  `virtual_account_name` varchar(50) DEFAULT NULL,
  `virtual_account_reference` varchar(255) DEFAULT NULL,
  `allow_voice_payments` tinyint(1) NOT NULL DEFAULT 0,
  `allow_whatsapp_payments` tinyint(1) NOT NULL DEFAULT 0,
  `allow_telegram_payments` tinyint(1) NOT NULL DEFAULT 1,
  `latitude` varchar(255) NOT NULL,
  `longitude` varchar(255) NOT NULL,
  `role` enum('user','merchant') NOT NULL DEFAULT 'user',
  `encoded_face` text DEFAULT NULL,
  `encoded_voice` text DEFAULT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `telegram_chat_id` varchar(50) DEFAULT NULL,
  `last_login` int(11) NOT NULL,
  `last_ip` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `webapp_tokens`
--

CREATE TABLE `webapp_tokens` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `chat_id` varchar(50) DEFAULT NULL,
  `tx_id` int(11) NOT NULL,
  `action_type` enum('transfer','payment','verification') NOT NULL DEFAULT 'transfer',
  `token` text NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `used` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `whatsapp_messages`
--

CREATE TABLE `whatsapp_messages` (
  `id` int(11) NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `message_type` enum('text','interactive','button','template') NOT NULL,
  `message_content` text DEFAULT NULL,
  `bot_response` text DEFAULT NULL,
  `action_taken` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `whatsapp_sessions`
--

CREATE TABLE `whatsapp_sessions` (
  `id` int(11) NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `state` enum('start','awaiting_otp','linked','awaiting_pin') NOT NULL DEFAULT 'start',
  `temp_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`temp_data`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `jwt`
--
ALTER TABLE `jwt`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token_unique` (`token`(255)),
  ADD KEY `user_id_index` (`user_id`),
  ADD KEY `expires_at_index` (`expires_at`);

--
-- Indexes for table `linked_accounts`
--
ALTER TABLE `linked_accounts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `platform_id_unique` (`platform_id`(255)),
  ADD KEY `user_id_index` (`user_id`);

--
-- Indexes for table `luxand_logs`
--
ALTER TABLE `luxand_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id_index` (`user_id`),
  ADD KEY `luxand_uuid_index` (`luxand_uuid`),
  ADD KEY `action_index` (`action`),
  ADD KEY `result_index` (`result`),
  ADD KEY `created_at_index` (`created_at`);

--
-- Indexes for table `luxand_persons`
--
ALTER TABLE `luxand_persons`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id_unique` (`user_id`),
  ADD UNIQUE KEY `luxand_uuid_unique` (`luxand_uuid`),
  ADD KEY `user_id_index` (`user_id`),
  ADD KEY `luxand_uuid_index` (`luxand_uuid`),
  ADD KEY `collection_index` (`collection`),
  ADD KEY `is_active_index` (`is_active`),
  ADD KEY `created_at_index` (`created_at`),
  ADD KEY `updated_at_index` (`updated_at`);

--
-- Indexes for table `merchants`
--
ALTER TABLE `merchants`
  ADD PRIMARY KEY (`id`),
  ADD KEY `name_index` (`name`),
  ADD KEY `kyc_level_index` (`kyc_level`),
  ADD KEY `verified_index` (`verified`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id_index` (`user_id`),
  ADD KEY `transaction_id_index` (`transaction_id`),
  ADD KEY `is_read_index` (`is_read`),
  ADD KEY `created_at_index` (`created_at`);

--
-- Indexes for table `otp_codes`
--
ALTER TABLE `otp_codes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `phone_number_index` (`phone_number`),
  ADD KEY `chat_id_index` (`chat_id`),
  ADD KEY `expires_at_index` (`expires_at`);

--
-- Indexes for table `telegram_messages`
--
ALTER TABLE `telegram_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chat_id_index` (`chat_id`),
  ADD KEY `user_id_index` (`user_id`),
  ADD KEY `created_at_index` (`created_at`);

--
-- Indexes for table `telegram_sessions`
--
ALTER TABLE `telegram_sessions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `chat_id_unique` (`chat_id`),
  ADD KEY `user_id_index` (`user_id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `reference_unique` (`reference`),
  ADD KEY `user_id_index` (`user_id`),
  ADD KEY `status_index` (`status`),
  ADD KEY `type_index` (`type`),
  ADD KEY `created_at_index` (`created_at`);

--
-- Indexes for table `transfers`
--
ALTER TABLE `transfers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sender_id_index` (`sender_id`),
  ADD KEY `receiver_id_index` (`receiver_id`),
  ADD KEY `status_index` (`status`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username_unique` (`username`),
  ADD UNIQUE KEY `email_unique` (`email`),
  ADD KEY `phone_index` (`phone_number`),
  ADD KEY `merchant_id_index` (`merchant_id`),
  ADD KEY `telegram_chat_id_index` (`telegram_chat_id`);

--
-- Indexes for table `webapp_tokens`
--
ALTER TABLE `webapp_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token_unique` (`token`(255)),
  ADD KEY `user_id_index` (`user_id`),
  ADD KEY `tx_id_index` (`tx_id`),
  ADD KEY `chat_id_index` (`chat_id`);

--
-- Indexes for table `whatsapp_messages`
--
ALTER TABLE `whatsapp_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `phone_number_index` (`phone_number`),
  ADD KEY `user_id_index` (`user_id`),
  ADD KEY `created_at_index` (`created_at`);

--
-- Indexes for table `whatsapp_sessions`
--
ALTER TABLE `whatsapp_sessions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `phone_number_unique` (`phone_number`),
  ADD KEY `user_id_index` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `jwt`
--
ALTER TABLE `jwt`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `linked_accounts`
--
ALTER TABLE `linked_accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `luxand_logs`
--
ALTER TABLE `luxand_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `luxand_persons`
--
ALTER TABLE `luxand_persons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `merchants`
--
ALTER TABLE `merchants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `otp_codes`
--
ALTER TABLE `otp_codes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `telegram_messages`
--
ALTER TABLE `telegram_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `telegram_sessions`
--
ALTER TABLE `telegram_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transfers`
--
ALTER TABLE `transfers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `webapp_tokens`
--
ALTER TABLE `webapp_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `whatsapp_messages`
--
ALTER TABLE `whatsapp_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `whatsapp_sessions`
--
ALTER TABLE `whatsapp_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `jwt`
--
ALTER TABLE `jwt`
  ADD CONSTRAINT `jwt_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `linked_accounts`
--
ALTER TABLE `linked_accounts`
  ADD CONSTRAINT `linked_accounts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `luxand_logs`
--
ALTER TABLE `luxand_logs`
  ADD CONSTRAINT `luxand_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `luxand_persons`
--
ALTER TABLE `luxand_persons`
  ADD CONSTRAINT `luxand_persons_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `telegram_messages`
--
ALTER TABLE `telegram_messages`
  ADD CONSTRAINT `telegram_messages_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `telegram_sessions`
--
ALTER TABLE `telegram_sessions`
  ADD CONSTRAINT `telegram_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `transfers`
--
ALTER TABLE `transfers`
  ADD CONSTRAINT `transfers_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `transfers_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`merchant_id`) REFERENCES `merchants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `webapp_tokens`
--
ALTER TABLE `webapp_tokens`
  ADD CONSTRAINT `webapp_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `webapp_tokens_ibfk_2` FOREIGN KEY (`tx_id`) REFERENCES `transactions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `whatsapp_messages`
--
ALTER TABLE `whatsapp_messages`
  ADD CONSTRAINT `whatsapp_messages_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `whatsapp_sessions`
--
ALTER TABLE `whatsapp_sessions`
  ADD CONSTRAINT `whatsapp_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
