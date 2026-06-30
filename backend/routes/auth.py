# routes/auth.py

from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import db, User, StudentProfile
from datetime import datetime, timedelta
import bcrypt
import random
import string
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

auth_bp = Blueprint('auth', __name__)


def send_otp_email(to_email, otp_code, full_name):
    """Send OTP verification email to student"""
    try:
        config = {
            'host': os.getenv('MAIL_SERVER', 'smtp.gmail.com'),
            'port': int(os.getenv('MAIL_PORT', 587)),
            'username': os.getenv('MAIL_USERNAME'),
            'password': os.getenv('MAIL_PASSWORD'),
            'from_email': os.getenv('MAIL_DEFAULT_SENDER', os.getenv('MAIL_USERNAME')),
            'use_tls': os.getenv('MAIL_USE_TLS', 'True') == 'True'
        }
        
        if not config['username'] or not config['password']:
            print("⚠️ Email not configured")
            return False
        
        msg = MIMEMultipart()
        msg['From'] = config['from_email']
        msg['To'] = to_email
        msg['Subject'] = "[InternLink] Your OTP Verification Code"
        
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"></head>
        <body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
            <div style="max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: #8B6B4A; margin: 0;">InternLink</h1>
                    <p style="color: #888; margin: 5px 0;">Linking Talent, Building Futures</p>
                </div>
                <div style="text-align: center; padding: 20px; background: #f8f4f0; border-radius: 8px; border: 2px dashed #8B6B4A;">
                    <p style="margin: 0 0 10px; color: #666; font-size: 14px;">Your Verification Code</p>
                    <div style="background: white; padding: 15px; border-radius: 8px; display: inline-block;">
                        <span style="font-size: 32px; font-weight: 800; color: #8B6B4A; letter-spacing: 8px; font-family: monospace;">{otp_code}</span>
                    </div>
                    <p style="margin: 10px 0 0; color: #888; font-size: 13px;">⏰ Expires in 10 minutes</p>
                </div>
                <p style="color: #888; font-size: 12px; text-align: center; margin-top: 20px;">
                    This is an automated message from InternLink.
                </p>
            </div>
        </body>
        </html>
        """
        
        msg.attach(MIMEText(html_body, 'html'))
        
        server = smtplib.SMTP(config['host'], config['port'])
        server.ehlo()
        if config['use_tls']:
            server.starttls()
            server.ehlo()
        server.login(config['username'], config['password'])
        server.send_message(msg)
        server.quit()
        
        print(f"✅ OTP email sent to {to_email}")
        return True
        
    except Exception as e:
        print(f"❌ Error sending OTP email: {str(e)}")
        return False


def generate_otp():
    """Generate 6-digit OTP"""
    return ''.join(random.choices(string.digits, k=6))


# ===== REGISTER STUDENT =====
@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        print(f"📝 Registration data: {data}")
        
        full_name = data.get('fullName', data.get('full_name', ''))
        email = data.get('email')
        password = data.get('password')
        role = data.get('role', 'student')
        
        if not full_name or not email or not password:
            return jsonify({'error': 'All fields are required'}), 400
        
        existing = User.query.filter_by(email=email).first()
        if existing:
            return jsonify({'error': 'Email already registered'}), 400
        
        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        # ===== ADMIN: Directly verified (no OTP needed) =====
        if role == 'admin':
            user = User(
                full_name=full_name,
                email=email,
                password=hashed.decode('utf-8'),
                role='admin',
                is_verified=True,  # Admin is auto-verified
                verified_at=datetime.utcnow()
            )
            db.session.add(user)
            db.session.commit()
            
            access_token = create_access_token(identity=user.id)
            
            return jsonify({
                'success': True,
                'message': 'Admin account created successfully!',
                'access_token': access_token,
                'user': user.to_dict()
            }), 201
        
        # ===== STUDENT: Needs OTP verification =====
        otp_code = generate_otp()
        otp_expires = datetime.utcnow() + timedelta(minutes=10)
        
        user = User(
            full_name=full_name,
            email=email,
            password=hashed.decode('utf-8'),
            role=role,
            is_verified=False,
            otp_code=otp_code,
            otp_created_at=datetime.utcnow(),
            otp_expires_at=otp_expires,
            otp_attempts=0
        )
        
        db.session.add(user)
        db.session.flush()
        
        # Create student profile
        student_profile = StudentProfile(
            user_id=user.id,
            full_name=full_name,
            course='Not set',
            university='Not set',
            year_of_study=1
        )
        db.session.add(student_profile)
        db.session.commit()
        
        # Send OTP email
        email_sent = send_otp_email(email, otp_code, full_name)
        
        return jsonify({
            'success': True,
            'message': 'Registration successful! Check your email for OTP.',
            'email_sent': email_sent,
            'user_id': user.id,
            'requires_verification': True
        }), 201
        
    except Exception as e:
        print(f"❌ Registration error: {str(e)}")
        import traceback
        traceback.print_exc()
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ===== VERIFY OTP (Student Only) =====
@auth_bp.route('/verify-otp', methods=['POST'])
def verify_otp():
    try:
        data = request.get_json()
        email = data.get('email')
        otp_code = data.get('otp_code')
        
        if not email or not otp_code:
            return jsonify({'error': 'Email and OTP are required'}), 400
        
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Admin doesn't need verification
        if user.role == 'admin':
            return jsonify({'error': 'Admin account is already verified'}), 400
        
        if user.is_verified:
            return jsonify({'error': 'Account already verified'}), 400
        
        # Check expiration
        if user.otp_expires_at and user.otp_expires_at < datetime.utcnow():
            return jsonify({'error': 'OTP expired. Please request a new one.'}), 400
        
        # Check attempts
        if user.otp_attempts >= 5:
            return jsonify({'error': 'Too many failed attempts. Request a new OTP.'}), 400
        
        # Verify OTP
        if user.otp_code != otp_code:
            user.otp_attempts += 1
            db.session.commit()
            remaining = 5 - user.otp_attempts
            return jsonify({'error': f'Invalid OTP. {remaining} attempts remaining.'}), 400
        
        # Success
        user.is_verified = True
        user.verified_at = datetime.utcnow()
        user.otp_code = None
        user.otp_expires_at = None
        user.otp_attempts = 0
        db.session.commit()
        
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'success': True,
            'message': 'Account verified successfully!',
            'access_token': access_token,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        print(f"❌ Verify OTP error: {str(e)}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ===== RESEND OTP (Student Only) =====
@auth_bp.route('/resend-otp', methods=['POST'])
def resend_otp():
    try:
        data = request.get_json()
        email = data.get('email')
        
        if not email:
            return jsonify({'error': 'Email is required'}), 400
        
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        if user.role == 'admin':
            return jsonify({'error': 'Admin account does not need OTP'}), 400
        
        if user.is_verified:
            return jsonify({'error': 'Account already verified'}), 400
        
        # Generate new OTP
        otp_code = generate_otp()
        user.otp_code = otp_code
        user.otp_created_at = datetime.utcnow()
        user.otp_expires_at = datetime.utcnow() + timedelta(minutes=10)
        user.otp_attempts = 0
        db.session.commit()
        
        email_sent = send_otp_email(email, otp_code, user.full_name)
        
        return jsonify({
            'success': True,
            'message': 'New OTP sent to your email.',
            'email_sent': email_sent
        }), 200
        
    except Exception as e:
        print(f"❌ Resend OTP error: {str(e)}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ===== LOGIN =====
@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Check password
        if not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # ===== ADMIN: Bypass OTP verification =====
        if user.role == 'admin':
            access_token = create_access_token(identity=user.id)
            return jsonify({
                'success': True,
                'access_token': access_token,
                'user': user.to_dict()
            }), 200
        
        # ===== STUDENT: Must be verified =====
        if not user.is_verified:
            return jsonify({
                'error': 'Account not verified. Please check your email for OTP.',
                'requires_verification': True,
                'email': user.email
            }), 401
        
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'success': True,
            'access_token': access_token,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        print(f"❌ Login error: {str(e)}")
        return jsonify({'error': str(e)}), 500


# ===== GET CURRENT USER =====
@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'success': True,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        print(f"❌ Get user error: {str(e)}")
        return jsonify({'error': str(e)}), 500