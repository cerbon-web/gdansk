-- MySQL schema for gdansk backend
-- Database name: rnwhnxpk_cerbon (app will create it if missing)

CREATE TABLE IF NOT EXISTS CREATED (
  id INT PRIMARY KEY AUTO_INCREMENT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- Main users table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  roles TEXT,
  name VARCHAR(255),
  phone VARCHAR(50),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insert 10 test users for development. Passwords are plaintext for dev only.
INSERT INTO users (username, password, roles) VALUES
  ('user1', 'pass1', 'contester'),
  ('user2', 'pass2', 'contester'),
  ('user3', 'pass3', 'contester'),
  ('user4', 'pass4', 'contester'),
  ('user5', 'pass5', 'contester'),
  ('user6', 'pass6', 'contester'),
  ('user7', 'pass7', 'contester'),
  ('user8', 'pass8', 'contester'),
  ('user9', 'pass9', 'contester'),
  ('user10', 'pass10', 'contester')
ON DUPLICATE KEY UPDATE password = VALUES(password), roles = VALUES(roles);
