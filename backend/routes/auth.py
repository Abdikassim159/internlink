
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import db, User
from utils.email import generate_verification_token, verify_token, send_verification_email
import bcrypt
import re
from datetime import datetime

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        print(f"📝 Registration data: {data}")
        
        # Validate email
        email = data.get('email')
        if not email:
            return jsonify({'error': 'Email is required'}), 400
        
        # Validate email format
        if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email):
            return jsonify({'error': 'Please enter a valid email address'}), 400
        
        # Check if user exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            if existing_user.is_verified:
                return jsonify({'error': 'Email already registered'}), 400
            else:
                db.session.delete(existing_user)
                db.session.commit()
                print(f"🗑️ Deleted unverified user: {email}")
        
        # Get role
        role = data.get('role', 'student')
        
        # Get full name
        full_name = data.get('fullName', '').strip()
        if not full_name:
            full_name = 'User'
        
        # Validate password
        password = data.get('password')
        if not password or len(password) < 6:
            return jsonify({'error': 'Password must be at least 6 characters'}), 400
        
        # Hash password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        hashed_password_str = hashed_password.decode('utf-8')
        print(f"🔑 Password hashed for: {email}")
        
        # Generate verification token
        token = generate_verification_token(email)
        
        # Create user based on role
        if role == 'admin':
            user = User(
                full_name=full_name,
                email=email,
                password=hashed_password_str,
                role=role,
                is_verified=True,
                verification_token=token,
                token_created_at=datetime.utcnow(),
                verified_at=datetime.utcnow()
            )
            
            db.session.add(user)
            db.session.commit()
            print(f"✅ Admin created: {email}")
            
            return jsonify({
                'message': 'Admin account created successfully! You can login now.',
                'user': user.to_dict(),
                'requires_verification': False
            }), 201
        
        else:
            user = User(
                full_name=full_name,
                email=email,
                password=hashed_password_str,
                role=role,
                is_verified=False,
                verification_token=token,
                token_created_at=datetime.utcnow()
            )
            
            db.session.add(user)
            db.session.commit()
            print(f"✅ User created: {email} (unverified)")
            
            # Send verification email
            try:
                send_verification_email(email, full_name, token)
                print(f"📧 Verification email sent to {email}")
            except Exception as e:
                print(f"⚠️ Email send failed: {str(e)}")
            
            return jsonify({
                'message': 'Account created! Please check your email to verify your account.',
                'user': user.to_dict(),
                'requires_verification': True
            }), 201
        
    except Exception as e:
        print(f"❌ Registration error: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Registration failed. Please try again.'}), 500


@auth_bp.route('/verify-email/<token>', methods=['GET'])
def verify_email(token):
    """Verify user email with token"""
    try:
        print(f"🔐 Verifying email with token: {token[:20]}...")
        
        email = verify_token(token)
        if not email:
            print("❌ Invalid or expired token")
            return jsonify({'error': 'Invalid or expired verification link'}), 400
        
        print(f"📧 Token belongs to: {email}")
        
        user = User.query.filter_by(email=email).first()
        if not user:
            print(f"❌ User not found: {email}")
            return jsonify({'error': 'User not found'}), 404
        
        if user.is_verified:
            print(f"✅ User already verified: {email}")
            return jsonify({'message': 'Email already verified. You can now login.'}), 200
        
        user.is_verified = True
        user.verification_token = None
        user.verified_at = datetime.utcnow()
        db.session.commit()
        
        print(f"✅ User verified successfully: {email}")
        
        return jsonify({
            'message': 'Email verified successfully! You can now login.',
            'verified': True
        }), 200
        
    except Exception as e:
        print(f"❌ Verification error: {str(e)}")
        return jsonify({'error': 'Verification failed. Please try again.'}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        print(f"🔑 Login attempt: {email}")
        print(f"📝 Password length: {len(password) if password else 0}")
        
        if not email or not password:
            return jsonify({'error': 'Email and password required'}), 400
        
        # Find user
        user = User.query.filter_by(email=email).first()
        if not user:
            print(f"❌ User not found: {email}")
            return jsonify({'error': 'Invalid credentials'}), 401
        
        print(f"✅ User found: {user.email}")
        print(f"   Role: {user.role}")
        print(f"   Verified: {user.is_verified}")
        print(f"   Password hash: {user.password[:30]}...")
        
        # Check password
        try:
            password_match = bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8'))
            print(f"🔑 Password match: {password_match}")
        except Exception as e:
            print(f"❌ Password check error: {str(e)}")
            return jsonify({'error': 'Invalid credentials'}), 401
        
        if not password_match:
            print(f"❌ Password does not match for: {email}")
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Check verification for students
        if user.role != 'admin' and not user.is_verified:
            print(f"⚠️ User not verified: {email}")
            return jsonify({
                'error': 'Please verify your email before logging in.',
                'requires_verification': True,
                'email': user.email
            }), 403
        
        # Create token
        access_token = create_access_token(identity=user.id)
        print(f"✅ Login successful: {email}")
        
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        print(f"❌ Login error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Login failed. Please try again.'}), 500


@auth_bp.route('/resend-verification', methods=['POST'])
def resend_verification():
    """Resend verification email"""
    try:
        data = request.get_json()
        email = data.get('email')
        
        if not email:
            return jsonify({'error': 'Email is required'}), 400
        
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        if user.is_verified:
            return jsonify({'message': 'Email already verified. You can login.'}), 200
        
        token = generate_verification_token(email)
        user.verification_token = token
        user.token_created_at = datetime.utcnow()
        db.session.commit()
        
        send_verification_email(email, user.full_name, token)
        
        return jsonify({
            'message': 'Verification email sent! Please check your inbox.'
        }), 200
        
    except Exception as e:
        print(f"Resend verification error: {str(e)}")
        return jsonify({'error': 'Failed to send verification email'}), 500


@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get current user profile"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify(user.to_dict()), 200
        
    except Exception as e:
        print(f"Profile error: {str(e)}")
        return jsonify({'error': 'Failed to fetch profile'}), 500


@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update user profile"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        if 'full_name' in data:
            user.full_name = data['full_name']
        if 'email' in data:
            user.email = data['email']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        print(f"Update profile error: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Failed to update profile'}), 500


@auth_bp.route('/users', methods=['GET'])
@jwt_required()
def get_all_users():
    """Get all users (Admin only)"""
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        if not current_user or current_user.role != 'admin':
            return jsonify({'error': 'Permission denied'}), 403
        
        users = User.query.all()
        return jsonify({
            'users': [user.to_dict() for user in users],
            'total': len(users)
        }), 200
        
    except Exception as e:
        print(f"Users error: {str(e)}")
        return jsonify({'error': 'Failed to fetch users'}), 500
