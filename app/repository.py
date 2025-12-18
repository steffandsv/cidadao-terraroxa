from app.db import get_db

def get_user_by_phone(phone):
    return get_db().execute('SELECT * FROM users WHERE phone = ?', (phone,)).fetchone()

def create_user(phone):
    db = get_db()
    db.execute('INSERT INTO users (phone) VALUES (?)', (phone,))
    db.commit()
    return get_user_by_phone(phone)

def get_user_by_id(user_id):
    return get_db().execute('SELECT * FROM users WHERE id = ?', (user_id,)).fetchone()

def get_asset_by_hash(hash_code):
    return get_db().execute('SELECT * FROM assets WHERE hash_code = ?', (hash_code,)).fetchone()

def get_asset_by_id(asset_id):
    return get_db().execute('SELECT * FROM assets WHERE id = ?', (asset_id,)).fetchone()

def get_gamification_rules():
    return get_db().execute('SELECT * FROM gamification_rules').fetchall()

def create_user_action(user_id, asset_id, rule_slug, evidence_url):
    db = get_db()
    cursor = db.execute(
        'INSERT INTO user_actions (user_id, asset_id, rule_slug, evidence_url) VALUES (?, ?, ?, ?)',
        (user_id, asset_id, rule_slug, evidence_url)
    )
    db.commit()
    return cursor.lastrowid

def get_pending_actions():
    return get_db().execute(
        '''
        SELECT ua.*, u.name as user_name, u.phone as user_phone, a.description as asset_desc, gr.points
        FROM user_actions ua
        JOIN users u ON ua.user_id = u.id
        JOIN assets a ON ua.asset_id = a.id
        JOIN gamification_rules gr ON ua.rule_slug = gr.slug
        WHERE ua.status = 'PENDING'
        '''
    ).fetchall()

def update_action_status(action_id, status):
    db = get_db()
    db.execute('UPDATE user_actions SET status = ? WHERE id = ?', (status, action_id))
    db.commit()

def get_action_by_id(action_id):
    return get_db().execute('SELECT * FROM user_actions WHERE id = ?', (action_id,)).fetchone()

def add_ledger_entry(user_id, action_id, amount, description):
    db = get_db()
    db.execute(
        'INSERT INTO points_ledger (user_id, action_id, amount, description) VALUES (?, ?, ?, ?)',
        (user_id, action_id, amount, description)
    )
    db.commit()

def get_user_balance(user_id):
    result = get_db().execute(
        'SELECT SUM(amount) as balance FROM points_ledger WHERE user_id = ?',
        (user_id,)
    ).fetchone()
    return result['balance'] if result['balance'] else 0

def update_user_level(user_id, title):
    db = get_db()
    db.execute('UPDATE users SET level_title = ? WHERE id = ?', (title, user_id))
    db.commit()

def get_ledger_history(user_id):
    return get_db().execute(
        'SELECT * FROM points_ledger WHERE user_id = ? ORDER BY created_at DESC',
        (user_id,)
    ).fetchall()
