-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone TEXT UNIQUE NOT NULL,
    name TEXT,
    level_title TEXT DEFAULT 'Novato',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Assets Table (Postes, Praças, etc.)
CREATE TABLE IF NOT EXISTS assets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hash_code TEXT UNIQUE NOT NULL, -- The code in the QR (e.g., 'POSTE-01')
    type TEXT NOT NULL, -- 'Poste', 'Praça'
    geo_lat REAL,
    geo_lng REAL,
    description TEXT,
    historical_photo_url TEXT
);

-- Gamification Rules (How to earn points)
CREATE TABLE IF NOT EXISTS gamification_rules (
    slug TEXT PRIMARY KEY, -- e.g., 'report_fix', 'time_tunnel'
    points INTEGER NOT NULL,
    requires_approval INTEGER DEFAULT 1, -- 1 = true, 0 = false
    icon TEXT -- css class or emoji
);

-- User Actions (The Queue)
CREATE TABLE IF NOT EXISTS user_actions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    asset_id INTEGER NOT NULL,
    rule_slug TEXT NOT NULL,
    evidence_url TEXT, -- Photo URL
    status TEXT DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (asset_id) REFERENCES assets(id),
    FOREIGN KEY (rule_slug) REFERENCES gamification_rules(slug)
);

-- Points Ledger (The Source of Truth)
CREATE TABLE IF NOT EXISTS points_ledger (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    action_id INTEGER, -- Can be NULL if it's a manual adjustment or bonus
    amount INTEGER NOT NULL, -- Positive or Negative
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (action_id) REFERENCES user_actions(id)
);
