import sqlite3
from app.db import get_db
from app import create_app

def seed():
    app = create_app()
    with app.app_context():
        db = get_db()

        print("Seeding Gamification Rules...")
        rules = [
            ('report_fix', 50, 1, '🔧'),
            ('time_tunnel', 100, 1, '📸'),
            ('share_app', 10, 0, '📢')
        ]
        db.executemany(
            'INSERT OR IGNORE INTO gamification_rules (slug, points, requires_approval, icon) VALUES (?, ?, ?, ?)',
            rules
        )

        print("Seeding Assets...")
        assets = [
            ('POSTE-01', 'Poste', -23.5505, -46.6333, 'Poste da Praça Central. Histórico: Foi o primeiro poste elétrico da rua.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Poste_de_ilumina%C3%A7%C3%A3o_antigo.jpg/640px-Poste_de_ilumina%C3%A7%C3%A3o_antigo.jpg'),
            ('PRACA-MATRIZ', 'Praça', -23.5500, -46.6300, 'Praça da Matriz. Ponto de encontro desde 1950.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Pra%C3%A7a_da_S%C3%A9_-_S%C3%A3o_Paulo.jpg/640px-Pra%C3%A7a_da_S%C3%A9_-_S%C3%A3o_Paulo.jpg'),
            ('CHAFARIZ-02', 'Chafariz', -23.5510, -46.6340, 'Chafariz dos Desejos. Diz a lenda que quem bebe aqui volta sempre.', None)
        ]
        # Using loop to check for existence or just simple insert or ignore
        for a in assets:
            db.execute(
                'INSERT OR IGNORE INTO assets (hash_code, type, geo_lat, geo_lng, description, historical_photo_url) VALUES (?, ?, ?, ?, ?, ?)',
                a
            )

        db.commit()
        print("Seeding Complete.")

if __name__ == '__main__':
    seed()
