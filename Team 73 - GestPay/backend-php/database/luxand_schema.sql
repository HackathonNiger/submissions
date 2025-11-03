-- Luxand Face Recognition Database Schema
-- Tables for storing Luxand API integration data

-- Table to store Luxand person UUIDs for each user
CREATE TABLE `luxand_persons` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `user_id` int(11) NOT NULL,
    `luxand_uuid` varchar(255) NOT NULL,
    `name` varchar(255) NOT NULL,
    `collection` varchar(100) DEFAULT 'gestpay_users',
    `photos_count` int(11) DEFAULT 0,
    `is_active` tinyint(1) NOT NULL DEFAULT 1,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`id`),
    UNIQUE KEY `user_id_unique` (`user_id`),
    UNIQUE KEY `luxand_uuid_unique` (`luxand_uuid`),
    KEY `user_id_index` (`user_id`),
    KEY `luxand_uuid_index` (`luxand_uuid`),
    KEY `collection_index` (`collection`),
    KEY `is_active_index` (`is_active`),
    CONSTRAINT `luxand_persons_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table to log Luxand API activities
CREATE TABLE `luxand_logs` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `user_id` int(11) DEFAULT NULL,
    `luxand_uuid` varchar(255) DEFAULT NULL,
    `action` enum('enroll','verify','delete','update') NOT NULL,
    `result` enum('success','failed','error') NOT NULL,
    `confidence` decimal(5,4) DEFAULT NULL,
    `details` text DEFAULT NULL,
    `ip_address` varchar(45) DEFAULT NULL,
    `user_agent` text DEFAULT NULL,
    `api_response` json DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    PRIMARY KEY (`id`),
    KEY `user_id_index` (`user_id`),
    KEY `luxand_uuid_index` (`luxand_uuid`),
    KEY `action_index` (`action`),
    KEY `result_index` (`result`),
    KEY `created_at_index` (`created_at`),
    CONSTRAINT `luxand_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table to store Luxand API configuration
CREATE TABLE `luxand_config` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `api_token` varchar(500) DEFAULT NULL,
    `base_url` varchar(255) DEFAULT 'https://api.luxand.cloud',
    `default_collection` varchar(100) DEFAULT 'gestpay_users',
    `store_photos` tinyint(1) DEFAULT 1,
    `check_uniqueness` tinyint(1) DEFAULT 0,
    `max_photos_per_person` int(11) DEFAULT 5,
    `timeout` int(11) DEFAULT 30,
    `is_active` tinyint(1) NOT NULL DEFAULT 1,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insert default Luxand configuration
INSERT INTO `luxand_config` (`api_token`, `base_url`, `default_collection`, `store_photos`, `check_uniqueness`, `max_photos_per_person`, `timeout`, `is_active`) 
VALUES (NULL, 'https://api.luxand.cloud', 'gestpay_users', 1, 0, 5, 30, 1);

-- Add indexes for better performance
ALTER TABLE `luxand_persons` ADD INDEX `created_at_index` (`created_at`);
ALTER TABLE `luxand_persons` ADD INDEX `updated_at_index` (`updated_at`);

-- Add foreign key constraint for luxand_logs luxand_uuid (optional, since UUID might not always exist in luxand_persons)
-- ALTER TABLE `luxand_logs` ADD CONSTRAINT `luxand_logs_ibfk_2` FOREIGN KEY (`luxand_uuid`) REFERENCES `luxand_persons` (`luxand_uuid`) ON DELETE SET NULL ON UPDATE CASCADE;
