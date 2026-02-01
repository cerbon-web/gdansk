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
  ('user10', 'pass10', 'contester'),
  ('super1', 'sup1', 'supervisor'),
  ('super2', 'sup2', 'supervisor')
ON DUPLICATE KEY UPDATE password = VALUES(password), roles = VALUES(roles);

-- Daily contest control: a single row (id=1) controls whether daily questions are shown
CREATE TABLE IF NOT EXISTS daily_control (
  id INT PRIMARY KEY DEFAULT 1,
  active TINYINT(1) NOT NULL DEFAULT 0,
  questions LONGTEXT,
  duration_seconds INT NOT NULL DEFAULT 60,
  started_by VARCHAR(255),
  started_at TIMESTAMP NULL DEFAULT NULL
);

-- Per-user session tokens generated when a contester fetches the active questions.
CREATE TABLE IF NOT EXISTS daily_sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  session_uuid VARCHAR(128) NOT NULL UNIQUE,
  username VARCHAR(255),
  start_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Answers submitted by contesters linked to a session
CREATE TABLE IF NOT EXISTS daily_answers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  session_id INT NOT NULL,
  answers LONGTEXT,
  submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES daily_sessions(id) ON DELETE CASCADE
);
