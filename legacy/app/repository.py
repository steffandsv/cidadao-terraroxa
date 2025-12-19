from app.db import get_db

def get_user_by_phone(phone):
    cursor = get_db().cursor(dictionary=True)
    cursor.execute('SELECT * FROM users WHERE phone = %s', (phone,))
    result = cursor.fetchone()
    cursor.close()
    return result

def create_user(phone):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute('INSERT INTO users (phone) VALUES (%s)', (phone,))
    db.commit()
    cursor.close()
    return get_user_by_phone(phone)

def get_user_by_id(user_id):
    cursor = get_db().cursor(dictionary=True)
    cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))
    result = cursor.fetchone()
    cursor.close()
    return result

def get_asset_by_hash(hash_code):
    cursor = get_db().cursor(dictionary=True)
    cursor.execute('SELECT * FROM assets WHERE hash_code = %s', (hash_code,))
    result = cursor.fetchone()
    cursor.close()
    return result

def get_asset_by_id(asset_id):
    cursor = get_db().cursor(dictionary=True)
    cursor.execute('SELECT * FROM assets WHERE id = %s', (asset_id,))
    result = cursor.fetchone()
    cursor.close()
    return result

def get_gamification_rules():
    cursor = get_db().cursor(dictionary=True)
    cursor.execute('SELECT * FROM gamification_rules')
    result = cursor.fetchall()
    cursor.close()
    return result

def create_user_action(user_id, asset_id, rule_slug, evidence_url):
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        'INSERT INTO user_actions (user_id, asset_id, rule_slug, evidence_url) VALUES (%s, %s, %s, %s)',
        (user_id, asset_id, rule_slug, evidence_url)
    )
    db.commit()
    last_id = cursor.lastrowid
    cursor.close()
    return last_id

def get_pending_actions():
    cursor = get_db().cursor(dictionary=True)
    cursor.execute(
        '''
        SELECT ua.*, u.name as user_name, u.phone as user_phone, a.description as asset_desc, gr.points
        FROM user_actions ua
        JOIN users u ON ua.user_id = u.id
        JOIN assets a ON ua.asset_id = a.id
        JOIN gamification_rules gr ON ua.rule_slug = gr.slug
        WHERE ua.status = 'PENDING'
        '''
    )
    result = cursor.fetchall()
    cursor.close()
    return result

def update_action_status(action_id, status):
    db = get_db()
    cursor = db.cursor()
    cursor.execute('UPDATE user_actions SET status = %s WHERE id = %s', (status, action_id))
    db.commit()
    cursor.close()

def get_action_by_id(action_id):
    cursor = get_db().cursor(dictionary=True)
    cursor.execute('SELECT * FROM user_actions WHERE id = %s', (action_id,))
    result = cursor.fetchone()
    cursor.close()
    return result

def add_ledger_entry(user_id, action_id, amount, description):
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        'INSERT INTO points_ledger (user_id, action_id, amount, description) VALUES (%s, %s, %s, %s)',
        (user_id, action_id, amount, description)
    )
    db.commit()
    cursor.close()

def get_user_balance(user_id):
    cursor = get_db().cursor(dictionary=True)
    cursor.execute(
        'SELECT SUM(amount) as balance FROM points_ledger WHERE user_id = %s',
        (user_id,)
    )
    result = cursor.fetchone()
    cursor.close()
    return result['balance'] if result and result['balance'] else 0

def update_user_level(user_id, title):
    db = get_db()
    cursor = db.cursor()
    cursor.execute('UPDATE users SET level_title = %s WHERE id = %s', (title, user_id))
    db.commit()
    cursor.close()

def get_ledger_history(user_id):
    cursor = get_db().cursor(dictionary=True)
    cursor.execute(
        'SELECT * FROM points_ledger WHERE user_id = %s ORDER BY created_at DESC',
        (user_id,)
    )
    result = cursor.fetchall()
    cursor.close()
    return result
