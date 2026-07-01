from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from models import db
from datetime import timedelta
import os
from dotenv import load_dotenv


load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-12345')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///internlink.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key-12345')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)
    
    # Mail Configuration
    app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
    app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
    app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'True') == 'True'
    app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
    app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
    app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER')
    
    # Initialize extensions
    db.init_app(app)
    jwt = JWTManager(app)
    CORS(app, origins=os.getenv('CORS_ORIGINS', 'http://localhost:5173').split(','))
    
    # Initialize Mail
    from utils.email import mail
    mail.init_app(app)
    
    # Register blueprints
    from routes.auth import auth_bp
    from routes.opportunities import opportunities_bp
    from routes.applications import applications_bp
    from routes.companies import companies_bp
    from routes.profile import profile_bp
    from routes.mpesa import mpesa_bp
    from routes.saved import saved_bp
    from routes.messages import messages_bp
    from routes.notifications import notifications_bp
    from routes.admin_notifications import admin_notif_bp  # 👈 ADD THIS LINE
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(opportunities_bp, url_prefix='/api')
    app.register_blueprint(applications_bp, url_prefix='/api')
    app.register_blueprint(companies_bp, url_prefix='/api')
    app.register_blueprint(profile_bp, url_prefix='/api')
    app.register_blueprint(mpesa_bp, url_prefix='/api')
    app.register_blueprint(saved_bp, url_prefix='/api')
    app.register_blueprint(messages_bp, url_prefix='/api')
    app.register_blueprint(notifications_bp, url_prefix='/api')
    app.register_blueprint(admin_notif_bp, url_prefix='/api')  # 👈 ADD THIS LINE

    # Test route
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'message': 'InternLink API is running!'
        }), 200
    
    # Create tables
    with app.app_context():
        db.create_all()
        print("✅ Database tables created successfully!")
        print("✅ Admin notifications blueprint registered!")
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)