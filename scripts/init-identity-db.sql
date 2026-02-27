-- Initialize Identity Service Database
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone_number ON users(phone_number);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- Insert sample admin user
INSERT INTO users (first_name, last_name, email, phone_number, user_type, password, is_active, created_at, updated_at)
VALUES ('Admin', 'User', 'admin@swiftpulse.com', '+1234567890', 'ADMIN', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', true, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;
