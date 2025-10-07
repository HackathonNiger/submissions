-- WhatsApp Sessions Table (similar to telegram_sessions)
CREATE TABLE `whatsapp_sessions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `phone_number` varchar(15) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `state` enum('start','awaiting_otp','linked','awaiting_pin') NOT NULL DEFAULT 'start',
  `temp_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`temp_data`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone_number_unique` (`phone_number`),
  KEY `user_id_index` (`user_id`),
  CONSTRAINT `whatsapp_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- WhatsApp Bot Configuration Table
CREATE TABLE `whatsapp_bot_config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `phone_number_id` varchar(255) NOT NULL,
  `access_token` varchar(500) NOT NULL,
  `webhook_verify_token` varchar(255) NOT NULL,
  `business_account_id` varchar(255) DEFAULT NULL,
  `ai_api_key` varchar(255) DEFAULT NULL,
  `ai_model` varchar(100) DEFAULT 'gpt-4o-mini',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- WhatsApp Messages Table (for logging and debugging)
CREATE TABLE `whatsapp_messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `phone_number` varchar(15) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `message_type` enum('text','interactive','button','template') NOT NULL,
  `message_content` text DEFAULT NULL,
  `bot_response` text DEFAULT NULL,
  `action_taken` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `phone_number_index` (`phone_number`),
  KEY `user_id_index` (`user_id`),
  KEY `created_at_index` (`created_at`),
  CONSTRAINT `whatsapp_messages_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Update transactions table to include whatsapp-pay feature (if not already present)
ALTER TABLE `transactions` MODIFY COLUMN `feature` enum('wallet','voice-pay','face-pay','chat-pay','transfer','telegram-pay','whatsapp-pay') NOT NULL;
