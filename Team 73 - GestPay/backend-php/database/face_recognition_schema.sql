-- ====================
-- FACE RECOGNITION SCHEMA UPDATES FOR GESTPAY
-- ====================

-- 1. Add face recognition fields to users table (if not already present)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS encoded_face JSON DEFAULT NULL COMMENT 'Stores face embeddings as JSON array',
ADD COLUMN IF NOT EXISTS has_setup_biometric TINYINT(1) DEFAULT 0 COMMENT 'Whether user has set up biometric authentication',
ADD COLUMN IF NOT EXISTS allow_face_payments TINYINT(1) DEFAULT 0 COMMENT 'Whether user allows face payments',
ADD COLUMN IF NOT EXISTS face_registered_at TIMESTAMP NULL DEFAULT NULL COMMENT 'When face was first registered',
ADD COLUMN IF NOT EXISTS last_face_verification TIMESTAMP NULL DEFAULT NULL COMMENT 'Last successful face verification',
ADD COLUMN IF NOT EXISTS confirm_payment TINYINT(1) DEFAULT 1 COMMENT 'Whether payments require confirmation';

-- 2. Create face_recognition_logs table for audit trail
CREATE TABLE IF NOT EXISTS face_recognition_logs (
  id INT(11) NOT NULL AUTO_INCREMENT,
  user_id INT(11) DEFAULT NULL,
  action ENUM('register','verify','payment','error') NOT NULL,
  result ENUM('success','failed','error') NOT NULL,
  details TEXT DEFAULT NULL,
  confidence DECIMAL(5,3) DEFAULT NULL COMMENT 'Face matching confidence score',
  ip_address VARCHAR(45) DEFAULT NULL,
  user_agent TEXT DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (id),
  KEY user_id_index (user_id),
  KEY action_index (action),
  KEY result_index (result),
  KEY created_at_index (created_at),
  CONSTRAINT face_recognition_logs_ibfk_1 FOREIGN KEY (user_id) 
    REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 3. Update transactions table to include face-pay feature (if not already present)
ALTER TABLE transactions 
MODIFY COLUMN feature ENUM('wallet','voice-pay','face-pay','chat-pay','transfer','telegram-pay','whatsapp-pay') NOT NULL;

-- 4. Add location_data field to transactions for face payment location tracking
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS location_data JSON DEFAULT NULL COMMENT 'Location data for face payments';

-- 5. Add merchant balance field if not exists (for merchant payments)
ALTER TABLE merchants 
ADD COLUMN IF NOT EXISTS balance DECIMAL(15,2) DEFAULT 0.00 COMMENT 'Merchant account balance';

-- 6. Create face_payment_settings table for system-wide face payment configuration
CREATE TABLE IF NOT EXISTS face_payment_settings (
  id INT(11) NOT NULL AUTO_INCREMENT,
  setting_name VARCHAR(100) NOT NULL,
  setting_value TEXT NOT NULL,
  description TEXT DEFAULT NULL,
  updated_by INT(11) DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT current_timestamp(),
  updated_at TIMESTAMP NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (id),
  UNIQUE KEY setting_name_unique (setting_name),
  KEY updated_by_index (updated_by),
  CONSTRAINT face_payment_settings_ibfk_1 FOREIGN KEY (updated_by) 
    REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 7. Insert default face payment settings
INSERT IGNORE INTO face_payment_settings (setting_name, setting_value, description) VALUES
('python_api_url', 'http://localhost:8000', 'URL of the Python FastAPI face recognition service'),
('confidence_threshold', '0.6', 'Minimum confidence score for face matching (0.0-1.0)'),
('max_faces_per_user', '3', 'Maximum number of face encodings per user'),
('face_payment_enabled', '1', 'Whether face payments are enabled system-wide'),
('require_location', '0', 'Whether location is required for face payments'),
('max_payment_amount', '50000', 'Maximum amount allowed for face payments without additional verification'),
('verification_timeout', '30', 'Timeout in seconds for face verification requests');

-- 8. Create indexes for better performance
CREATE INDEX IF NOT EXISTS users_face_payments_idx ON users (allow_face_payments, has_setup_biometric);
CREATE INDEX IF NOT EXISTS users_encoded_face_idx ON users (encoded_face(1));
CREATE INDEX IF NOT EXISTS transactions_feature_idx ON transactions (feature);
CREATE INDEX IF NOT EXISTS face_logs_user_action_idx ON face_recognition_logs (user_id, action, created_at);

-- 9. Add face payment verification attempts tracking
CREATE TABLE IF NOT EXISTS face_verification_attempts (
  id INT(11) NOT NULL AUTO_INCREMENT,
  user_id INT(11) DEFAULT NULL,
  ip_address VARCHAR(45) NOT NULL,
  attempts_count INT(11) DEFAULT 1,
  last_attempt TIMESTAMP NOT NULL DEFAULT current_timestamp(),
  locked_until TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (id),
  UNIQUE KEY user_ip_unique (user_id, ip_address),
  KEY ip_address_index (ip_address),
  KEY locked_until_index (locked_until),
  CONSTRAINT face_verification_attempts_ibfk_1 FOREIGN KEY (user_id) 
    REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 10. Update existing users to enable face payments by default (optional)
-- Uncomment the line below if you want existing users to have face payments enabled
-- UPDATE users SET allow_face_payments = 1 WHERE has_setup_biometric = 1;

-- 11. Create view for face payment statistics
CREATE OR REPLACE VIEW face_payment_stats AS
SELECT 
  COUNT(DISTINCT u.id) as total_users_with_face,
  COUNT(DISTINCT CASE WHEN u.allow_face_payments = 1 THEN u.id END) as users_allowing_payments,
  COUNT(DISTINCT t.user_id) as users_made_face_payments,
  SUM(CASE WHEN t.feature = 'face-pay' THEN t.amount ELSE 0 END) as total_face_payment_volume,
  COUNT(CASE WHEN t.feature = 'face-pay' THEN 1 END) as total_face_transactions,
  AVG(CASE WHEN t.feature = 'face-pay' THEN t.amount END) as avg_face_payment_amount
FROM users u
LEFT JOIN transactions t ON u.id = t.user_id AND t.feature = 'face-pay' AND t.status = 'successful'
WHERE u.encoded_face IS NOT NULL;

-- 12. Sample queries for testing (commented out)
/*
-- Get users with face recognition enabled
SELECT id, first_name, last_name, has_setup_biometric, allow_face_payments, face_registered_at 
FROM users 
WHERE encoded_face IS NOT NULL;

-- Get face payment transaction history
SELECT t.*, u.first_name, u.last_name 
FROM transactions t 
JOIN users u ON t.user_id = u.id 
WHERE t.feature = 'face-pay' 
ORDER BY t.created_at DESC;

-- Get face recognition activity logs
SELECT l.*, u.first_name, u.last_name 
FROM face_recognition_logs l 
LEFT JOIN users u ON l.user_id = u.id 
ORDER BY l.created_at DESC;
*/
