DROP DATABASE IF EXISTS notesvault_local;
CREATE DATABASE notesvault_local;
USE notesvault_local;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(100),
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, password_hash, email, first_name, last_name)
VALUES (
  'testuser',
  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- bcrypt hash of 'password'
  'test@example.com',
  'Test',
  'User'
);

-- Add other tables as needed (groups, notes, etc.)