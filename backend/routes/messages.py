# routes/messages.py

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Message, User
from datetime import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import logging

messages_bp = Blueprint('messages', __name__)

# Set up logging
logging.basicConfig(level=logging.DEBUG)

# ===== EMAIL CONFIGURATION =====
def get_email_config():
    """Get email configuration from environment variables"""
    return {
        'host': os.getenv('MAIL_SERVER', 'smtp.gmail.com'),
        'port': int(os.getenv('MAIL_PORT', 587)),
        'username': os.getenv('MAIL_USERNAME'),
        'password': os.getenv('MAIL_PASSWORD'),
        'from_email': os.getenv('MAIL_DEFAULT_SENDER', os.getenv('MAIL_USERNAME')),
        'use_tls': os.getenv('MAIL_USE_TLS', 'True') == 'True'
    }

def send_email(to_email, subject, body, is_important=False):
    """Send email notification to student"""
    try:
        config = get_email_config()
        
        # Check if email is configured
        if not config['username'] or not config['password']:
            print("⚠️ Email credentials not configured. Skipping email.")
            return False
        
        print(f"📧 Sending email to: {to_email}")
        print(f"📧 Subject: {subject}")
        print(f"📧 From: {config['from_email']}")
        
        # Create message
        msg = MIMEMultipart()
        msg['From'] = config['from_email']
        msg['To'] = to_email
        msg['Subject'] = f"[InternLink] {subject}"
        
        # Create HTML email body
        importance_badge = "🔴 IMPORTANT" if is_important else "📩 New Message"
        importance_class = "important" if is_important else ""
        
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>InternLink Message</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #8B6B4A 0%, #6D4F33 100%); color: white; padding: 30px 25px; text-align: center;">
                    <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
                        <div style="width: 40px; height: 40px; background: white; border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                            <span style="color: #8B6B4A; font-weight: bold; font-size: 20px;">in</span>
                        </div>
                        <h1 style="margin: 0; font-size: 24px; font-weight: 700;">InternLink</h1>
                    </div>
                    <p style="margin: 5px 0 0; opacity: 0.8; font-size: 14px;">Linking Talent, Building Futures</p>
                </div>
                
                <!-- Content -->
                <div style="padding: 30px 25px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 10px;">
                        <h2 style="margin: 0; color: #1a1a1a; font-size: 22px;">{subject}</h2>
                        <span style="display: inline-block; padding: 5px 14px; border-radius: 20px; font-size: 12px; font-weight: bold; background: {'#e74c3c' if is_important else '#8B6B4A'}; color: white;">
                            {importance_badge}
                        </span>
                    </div>
                    
                    <p style="color: #555; margin-bottom: 10px; font-size: 15px;">Hello,</p>
                    <p style="color: #555; margin-bottom: 15px; font-size: 15px;">You have received a new message from the InternLink Admin:</p>
                    
                    <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; border-left: 4px solid {'#e74c3c' if is_important else '#8B6B4A'}; margin: 15px 0; {'background: #fff5f5' if is_important else ''}">
                        <p style="margin: 0; white-space: pre-wrap; color: #333; font-size: 15px; line-height: 1.6;">{body}</p>
                    </div>
                    
                    <p style="color: #555; margin-top: 20px; font-size: 15px;">
                        Please log in to your <strong>InternLink Dashboard</strong> to read and reply to this message.
                    </p>
                    
                    <div style="text-align: center; margin: 25px 0;">
                        <a href="http://localhost:5173/student/dashboard" style="display: inline-block; background: #8B6B4A; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; transition: background 0.3s;">
                            Go to Dashboard →
                        </a>
                    </div>
                </div>
                
                <!-- Footer -->
                <div style="background: #f8f8f8; text-align: center; padding: 20px; border-top: 1px solid #eee;">
                    <p style="margin: 0; color: #888; font-size: 12px;">© 2026 InternLink by FutureSpace. All rights reserved.</p>
                    <p style="margin: 5px 0 0; color: #aaa; font-size: 11px;">Linking Talent, Building Futures.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        msg.attach(MIMEText(html_body, 'html'))
        
        # Send email
        server = smtplib.SMTP(config['host'], config['port'])
        server.ehlo()
        if config['use_tls']:
            server.starttls()
            server.ehlo()
        
        server.login(config['username'], config['password'])
        server.send_message(msg)
        server.quit()
        
        print(f"✅ Email sent successfully to {to_email}")
        return True
        
    except Exception as e:
        print(f"❌ Error sending email: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def time_ago(dt):
    """Convert datetime to 'time ago' string"""
    if not dt:
        return 'Just now'
    
    now = datetime.utcnow()
    diff = now - dt
    
    if diff.days > 0:
        if diff.days == 1:
            return 'Yesterday'
        return f'{diff.days} days ago'
    
    seconds = diff.seconds
    if seconds < 60:
        return 'Just now'
    if seconds < 3600:
        minutes = seconds // 60
        return f'{minutes}m ago'
    
    hours = seconds // 3600
    return f'{hours}h ago'


# ===== STUDENT: GET ALL MESSAGES =====
@messages_bp.route('/messages', methods=['GET'])
@jwt_required()
def get_messages():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if user and user.role == 'admin':
            messages = Message.query.filter_by(
                sender_id=user_id
            ).order_by(Message.created_at.desc()).all()
            
            result = []
            for msg in messages:
                student = User.query.get(msg.student_id)
                result.append({
                    'id': msg.id,
                    'student_name': student.full_name if student else 'Unknown',
                    'student_email': student.email if student else '',
                    'subject': msg.subject or '',
                    'message': msg.message,
                    'is_read': msg.is_read,
                    'is_important': msg.is_important,
                    'created_at': msg.created_at.isoformat() if msg.created_at else None,
                    'time_ago': time_ago(msg.created_at)
                })
            
            return jsonify({
                'messages': result,
                'total': len(result)
            }), 200
        
        messages = Message.query.filter_by(
            student_id=user_id
        ).order_by(
            Message.is_read.asc(),
            Message.is_important.desc(),
            Message.created_at.desc()
        ).all()
        
        result = []
        for msg in messages:
            sender = User.query.get(msg.sender_id)
            result.append({
                'id': msg.id,
                'sender_name': msg.sender_name or (sender.full_name if sender else 'Admin'),
                'sender_role': msg.sender_role or 'admin',
                'subject': msg.subject or '',
                'message': msg.message,
                'is_read': msg.is_read,
                'is_important': msg.is_important,
                'created_at': msg.created_at.isoformat() if msg.created_at else None,
                'time_ago': time_ago(msg.created_at)
            })
        
        unread_count = sum(1 for m in messages if not m.is_read)
        
        return jsonify({
            'messages': result,
            'unread_count': unread_count,
            'total': len(result)
        }), 200
        
    except Exception as e:
        print(f"Error fetching messages: {str(e)}")
        return jsonify({'error': str(e)}), 500


# ===== STUDENT: GET SINGLE MESSAGE =====
@messages_bp.route('/messages/<int:message_id>', methods=['GET'])
@jwt_required()
def get_message(message_id):
    try:
        user_id = get_jwt_identity()
        
        message = Message.query.filter_by(
            id=message_id,
            student_id=user_id
        ).first()
        
        if not message:
            return jsonify({'error': 'Message not found'}), 404
        
        if not message.is_read:
            message.is_read = True
            db.session.commit()
        
        sender = User.query.get(message.sender_id)
        
        return jsonify({
            'id': message.id,
            'sender_name': message.sender_name or (sender.full_name if sender else 'Admin'),
            'sender_role': message.sender_role or 'admin',
            'subject': message.subject or '',
            'message': message.message,
            'is_read': message.is_read,
            'is_important': message.is_important,
            'created_at': message.created_at.isoformat() if message.created_at else None,
            'time_ago': time_ago(message.created_at)
        }), 200
        
    except Exception as e:
        print(f"Error fetching message: {str(e)}")
        return jsonify({'error': str(e)}), 500


# ===== STUDENT: MARK MESSAGE AS READ =====
@messages_bp.route('/messages/<int:message_id>/read', methods=['PUT'])
@jwt_required()
def mark_message_read(message_id):
    try:
        user_id = get_jwt_identity()
        
        message = Message.query.filter_by(
            id=message_id,
            student_id=user_id
        ).first()
        
        if not message:
            return jsonify({'error': 'Message not found'}), 404
        
        message.is_read = True
        db.session.commit()
        
        return jsonify({'success': True}), 200
        
    except Exception as e:
        print(f"Error marking message read: {str(e)}")
        return jsonify({'error': str(e)}), 500


# ===== STUDENT: DELETE MESSAGE =====
@messages_bp.route('/messages/<int:message_id>', methods=['DELETE'])
@jwt_required()
def delete_message(message_id):
    try:
        user_id = get_jwt_identity()
        
        message = Message.query.filter_by(
            id=message_id,
            student_id=user_id
        ).first()
        
        if not message:
            return jsonify({'error': 'Message not found'}), 404
        
        db.session.delete(message)
        db.session.commit()
        
        return jsonify({'success': True}), 200
        
    except Exception as e:
        print(f"Error deleting message: {str(e)}")
        return jsonify({'error': str(e)}), 500


# ===== ADMIN: SEND MESSAGE (WITH EMAIL) =====
@messages_bp.route('/messages/send', methods=['POST'])
@jwt_required()
def send_message():
    try:
        sender_id = get_jwt_identity()
        data = request.get_json()
        
        sender = User.query.get(sender_id)
        if not sender or sender.role != 'admin':
            return jsonify({'error': 'Only admins can send messages'}), 403
        
        student_id = data.get('student_id')
        subject = data.get('subject', '')
        message_text = data.get('message')
        sender_name = data.get('sender_name', 'Admin')
        sender_role = data.get('sender_role', 'admin')
        is_important = data.get('is_important', False)
        send_email_notification = data.get('send_email', True)
        
        if not student_id or not message_text:
            return jsonify({'error': 'Student ID and message are required'}), 400
        
        student = User.query.get(student_id)
        if not student or student.role != 'student':
            return jsonify({'error': 'Student not found'}), 404
        
        # Save message to database
        message = Message(
            student_id=student_id,
            sender_id=sender_id,
            sender_name=sender_name,
            sender_role=sender_role,
            subject=subject,
            message=message_text,
            is_read=False,
            is_important=is_important
        )
        
        db.session.add(message)
        db.session.commit()
        
        # ===== SEND EMAIL NOTIFICATION =====
        email_sent = False
        if send_email_notification and student.email:
            try:
                email_sent = send_email(
                    to_email=student.email,
                    subject=subject or 'New Message from Admin',
                    body=message_text,
                    is_important=is_important
                )
                print(f"📧 Email notification: {'✅ Sent' if email_sent else '❌ Failed'}")
            except Exception as e:
                print(f"❌ Email error: {str(e)}")
                email_sent = False
        
        return jsonify({
            'success': True,
            'message': 'Message sent successfully',
            'email_sent': email_sent,
            'data': {
                'id': message.id,
                'student_id': message.student_id,
                'subject': message.subject,
                'message': message.message,
                'created_at': message.created_at.isoformat() if message.created_at else None
            }
        }), 201
        
    except Exception as e:
        print(f"Error sending message: {str(e)}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ===== ADMIN: GET ALL STUDENTS =====
@messages_bp.route('/admin/students', methods=['GET'])
@jwt_required()
def get_all_students():
    try:
        sender_id = get_jwt_identity()
        sender = User.query.get(sender_id)
        
        if sender.role != 'admin':
            return jsonify({'error': 'Unauthorized'}), 403
        
        students = User.query.filter_by(role='student').all()
        
        result = []
        for student in students:
            unread_count = Message.query.filter_by(
                student_id=student.id,
                is_read=False
            ).count()
            
            result.append({
                'id': student.id,
                'full_name': student.full_name,
                'email': student.email,
                'unread_count': unread_count,
                'registered_at': student.created_at.isoformat() if student.created_at else None
            })
        
        return jsonify({
            'students': result,
            'total': len(result)
        }), 200
        
    except Exception as e:
        print(f"Error fetching students: {str(e)}")
        return jsonify({'error': str(e)}), 500