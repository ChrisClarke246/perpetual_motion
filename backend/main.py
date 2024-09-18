from flask import Flask, render_template
from flask_cors import CORS
from flask_restx import Api
from backend.models import Leaderboard
from backend.exts import db
from flask_jwt_extended import JWTManager
from backend.leaderboard import leaderboard_ns, LeaderboardList
from dotenv import load_dotenv
from backend.config import DevConfig

import requests
import os

load_dotenv()

def create_app(config=DevConfig):
    app = Flask(__name__,
            static_url_path='',
            static_folder='../frontend/dist',
            template_folder='../frontend/dist'
                )
    app.config.from_object(config)
    db.init_app(app)
    JWTManager(app)
    api = Api(app, doc="/docs")
    api.add_namespace(leaderboard_ns)

    app.config['JWT_SECRET_KEY'] = 'secret_key_here'  # Change this to a secure secret key
    app.config['JWT_TOKEN_LOCATION'] = ['headers']
    app.config['JWT_ALGORITHM'] = 'HS256'

    CORS(app, resources=r'/*')

    @app.shell_context_processor
    def make_shell_context():
        return {"db": db, "Leaderboard": Leaderboard}

    @app.errorhandler(404)
    def not_found(e):
        return render_template("index.html")

    # @app.route('/api/verify-captcha/<string:captch_response>/', methods=['POST'])
    # def verify_captcha(captch_response):
    #     reCAPTCHA_secret = os.getenv('RECAPTCHA_SECRET_KEY', 'default_secret_key')

    #     dictToSend = {
    #         'secret': reCAPTCHA_secret,
    #         'response': captch_response
    #     }

    #     response = requests.post('https://www.google.com/recaptcha/api/siteverify', data=dictToSend)
    #     return response.json()

    # @app.after_request
    # def after_request(response):
    #     # Commit the database session after each request
    #     db.session.commit()
    #     return response
    
    api.add_resource(LeaderboardList, '/api/leaderboard/')
    
    return app
