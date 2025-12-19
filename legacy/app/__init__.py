import os
import sqlite3
from flask import Flask, g

def create_app(test_config=None):
    # Create and configure the app
    app = Flask(__name__, instance_relative_config=True)

    # Load configuration from Environment Variables (for Docker/MySQL)
    app.config.from_mapping(
        SECRET_KEY=os.environ.get('SECRET_KEY', 'dev'),
        DATABASE=os.path.join(app.instance_path, 'civic.sqlite'),
        DB_HOST=os.environ.get('DB_HOST'),
        DB_USER=os.environ.get('DB_USER'),
        DB_PASS=os.environ.get('DB_PASS'),
        DB_NAME=os.environ.get('DB_NAME'),
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # Initialize DB
    from . import db
    db.init_app(app)

    # Register Blueprints (will be added later)
    # from . import auth
    # app.register_blueprint(auth.bp)

    from . import routes
    app.register_blueprint(routes.bp)

    return app
