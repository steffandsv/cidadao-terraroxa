-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phone VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255),
    level_title VARCHAR(50) DEFAULT 'Novato',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Assets Table (Postes, Praças, etc.)
CREATE TABLE IF NOT EXISTS assets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hash_code VARCHAR(50) UNIQUE NOT NULL, -- The code in the QR (e.g., 'POSTE-01')
    type VARCHAR(50) NOT NULL, -- 'Poste', 'Praça'
    geo_lat DECIMAL(10, 8),
    geo_lng DECIMAL(11, 8),
    description TEXT,
    historical_photo_url TEXT
);

-- Gamification Rules (How to earn points)
CREATE TABLE IF NOT EXISTS gamification_rules (
    slug VARCHAR(50) PRIMARY KEY, -- e.g., 'report_fix', 'time_tunnel'
    points INT NOT NULL,
    requires_approval TINYINT(1) DEFAULT 1, -- 1 = true, 0 = false
    icon VARCHAR(50) -- css class or emoji
);

-- User Actions (The Queue)
CREATE TABLE IF NOT EXISTS user_actions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    asset_id INT NOT NULL,
    rule_slug VARCHAR(50) NOT NULL,
    evidence_url TEXT, -- Photo URL
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (asset_id) REFERENCES assets(id),
    FOREIGN KEY (rule_slug) REFERENCES gamification_rules(slug)
);

-- Points Ledger (The Source of Truth)
CREATE TABLE IF NOT EXISTS points_ledger (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    action_id INT, -- Can be NULL if it's a manual adjustment or bonus
    amount INT NOT NULL, -- Positive or Negative
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (action_id) REFERENCES user_actions(id)
);
