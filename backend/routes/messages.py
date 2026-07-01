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
from services.notification_service import NotificationService  # 👈 ADD THIS IMPORT

messages_bp = Blueprint('messages', __name__)

# Set up logging
logging.basicConfig(level=logging.DEBUG)

# Get frontend URL from environment
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:5173')


def send_email(to_email, subject, body, is_important=False, include_preview=True):
    """Send professional email notification to student"""
    try:
        # Get email config
        config = {
            'host': os.getenv('MAIL_SERVER', 'smtp.gmail.com'),
            'port': int(os.getenv('MAIL_PORT', 587)),
            'username': os.getenv('MAIL_USERNAME'),
            'password': os.getenv('MAIL_PASSWORD'),
            'from_email': os.getenv('MAIL_DEFAULT_SENDER', os.getenv('MAIL_USERNAME')),
            'use_tls': os.getenv('MAIL_USE_TLS', 'True') == 'True'
        }
        
        # Check if email is configured
        if not config['username'] or not config['password']:
            print("⚠️ Email credentials not configured. Skipping email.")
            return False
        
        print(f"📧 Sending email to: {to_email}")
        print(f"📧 Subject: {subject}")
        
        # Create message
        msg = MIMEMultipart()
        msg['From'] = config['from_email']
        msg['To'] = to_email
        msg['Subject'] = f"[InternLink] {subject}"
        
        # Build preview section
        if include_preview:
            preview_text = body[:300] + '...' if len(body) > 300 else body
            preview_section = f"""
            <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; border-left: 4px solid {'#e74c3c' if is_important else '#8B6B4A'}; margin: 15px 0;">
                <p style="margin: 0; color: #333; font-size: 15px; white-space: pre-wrap; line-height: 1.8;">{preview_text}</p>
            </div>
            """
        else:
            preview_section = f"""
            <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; border-left: 4px solid {'#e74c3c' if is_important else '#8B6B4A'}; margin: 15px 0;">
                <p style="margin: 0; color: #666; font-size: 15px; font-style: italic;">
                    📩 You have a new message from the InternLink Admin.
                </p>
            </div>
            """
        
        importance_badge = "🔴 IMPORTANT" if is_important else "📩 New Message"
        importance_color = '#e74c3c' if is_important else '#8B6B4A'
        
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>InternLink Message</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f0f0f0; padding: 0; margin: 0; -webkit-font-smoothing: antialiased;">
            
            <!-- MAIN CONTAINER -->
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 40px rgba(0,0,0,0.08);">
                <tr>
                    <td style="padding: 0;">
                        
                        <!-- ===== HEADER ===== -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #8B6B4A 0%, #6D4F33 100%);">
                            <tr>
                                <td style="padding: 35px 30px 30px; text-align: center;">
                                    <!-- Logo -->
                                    <table align="center" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td style="background: white; border-radius: 12px; padding: 8px 12px;">
                                                <span style="font-size: 22px; font-weight: 800; color: #8B6B4A; letter-spacing: -0.5px;">InternLink</span>
                                            </td>
                                        </tr>
                                    </table>
                                    <p style="margin: 10px 0 0; color: rgba(255,255,255,0.85); font-size: 13px; letter-spacing: 1.5px; font-weight: 300;">
                                        LINKING TALENT, BUILDING FUTURES
                                    </p>
                                </td>
                            </tr>
                        </table>
                        
                        <!-- ===== CONTENT ===== -->
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="padding: 35px 30px;">
                                    
                                    <!-- Subject & Badge -->
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td style="padding-bottom: 5px;">
                                                <span style="display: inline-block; background: {importance_color}; color: white; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; padding: 4px 14px; border-radius: 20px;">
                                                    {importance_badge}
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <h2 style="margin: 10px 0 0; color: #1a1a1a; font-size: 22px; font-weight: 700; letter-spacing: -0.3px; line-height: 1.3;">
                                                    {subject}
                                                </h2>
                                            </td>
                                        </tr>
                                    </table>
                                    
                                    <!-- Divider -->
                                    <div style="height: 1px; background: #e8e8e8; margin: 20px 0;"></div>
                                    
                                    <!-- Greeting -->
                                    <p style="color: #444; font-size: 15px; line-height: 1.8; margin: 0 0 15px;">
                                        Dear Student,
                                    </p>
                                    
                                    <p style="color: #444; font-size: 15px; line-height: 1.8; margin: 0 0 15px;">
                                        You have received a new message from the InternLink Admin Team:
                                    </p>
                                    
                                    <!-- Message Box -->
                                    {preview_section}
                                    
                                    <!-- Instructions -->
                                    <p style="color: #555; font-size: 14px; line-height: 1.8; margin: 20px 0 10px;">
                                        To view the full message and reply, please log in to your InternLink dashboard.
                                    </p>
                                    
                                    <p style="color: #888; font-size: 13px; line-height: 1.8; margin: 5px 0 0; font-style: italic;">
                                        💡 Tip: You can view all your messages in the "Messages" section of your dashboard.
                                    </p>
                                    
                                    <!-- Divider -->
                                    <div style="height: 1px; background: #e8e8e8; margin: 25px 0;"></div>
                                    
                                    <!-- Footer Info -->
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td style="text-align: center;">
                                                <p style="margin: 0; color: #999; font-size: 12px; line-height: 1.6;">
                                                    This is an automated notification from <strong>InternLink</strong>.
                                                </p>
                                                <p style="margin: 5px 0 0; color: #bbb; font-size: 11px; line-height: 1.6;">
                                                    If you have any questions, please contact your institution's admin.
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                    
                                </td>
                            </tr>
                        </table>
                        
                        <!-- ===== FOOTER ===== -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8f8f8;">
                            <tr>
                                <td style="padding: 25px 30px; text-align: center;">
                                    <p style="margin: 0; color: #aaa; font-size: 12px; line-height: 1.6;">
                                        &copy; 2026 <strong style="color: #8B6B4A;">InternLink</strong> by FutureSpace.
                                        <br>
                                        Linking Talent, Building Futures.
                                    </p>
                                    <p style="margin: 8px 0 0; color: #ccc; font-size: 10px;">
                                        This email was sent to <a href="mailto:{to_email}" style="color: #8B6B4A; text-decoration: none;">{to_email}</a>
                                    </p>
                                </td>
                            </tr>
                        </table>
                        
                    </td>
                </tr>
            </table>
            
            <!-- Mobile note -->
            <div style="max-width: 600px; margin: 15px auto 0; text-align: center; font-size: 11px; color: #bbb; padding: 0 15px;">
                <p style="margin: 0;">View this email in your browser for the best experience.</p>
            </div>
            
        </body>
        </html>
        """
        
        msg.attach(MIMEText(html_body, 'html'))
        
        # Send email
        print("🔄 Connecting to SMTP server...")
        server = smtplib.SMTP(config['host'], config['port'])
        server.ehlo()
        if config['use_tls']:
            server.starttls()
            server.ehlo()
        
        print("🔄 Logging in...")
        server.login(config['username'], config['password'])
        
        print("🔄 Sending email...")
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
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # If admin, get all messages sent by admin
        if user.role == 'admin':
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
        
        # If student, get messages for student
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
        print(f"🔴 Error fetching messages: {str(e)}")
        import traceback
        traceback.print_exc()
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
        
        # Mark as read when viewed
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
        print(f"🔴 Error fetching message: {str(e)}")
        import traceback
        traceback.print_exc()
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
        print(f"🔴 Error marking message read: {str(e)}")
        import traceback
        traceback.print_exc()
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
        print(f"🔴 Error deleting message: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


# ===== ADMIN: SEND MESSAGE =====
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
        
        print(f"✅ Message saved to database with ID: {message.id}")
        
        # ===== SEND EMAIL NOTIFICATION =====
        email_sent = False
        if send_email_notification and student.email:
            try:
                email_sent = send_email(
                    to_email=student.email,
                    subject=subject or 'New Message from Admin',
                    body=message_text,
                    is_important=is_important,
                    include_preview=True
                )
                print(f"📧 Email notification: {'✅ Sent' if email_sent else '❌ Failed'}")
            except Exception as e:
                print(f"❌ Email error: {str(e)}")
                email_sent = False
        
        # 🔔 CREATE IN-APP NOTIFICATION FOR STUDENT
        try:
            NotificationService.create_message_notification(
                user_id=student_id,
                sender_name=sender_name or sender.full_name or 'Admin',
                message_preview=message_text,
                message_id=message.id
            )
            print(f"✅ In-app notification created for student {student_id}")
        except Exception as notif_error:
            print(f"⚠️ Failed to create in-app notification: {str(notif_error)}")
            # Don't fail the message send if notification fails
        
        return jsonify({
            'success': True,
            'message': 'Message sent successfully',
            'email_sent': email_sent,
            'notification_created': True,
            'data': {
                'id': message.id,
                'student_id': message.student_id,
                'subject': message.subject,
                'message': message.message,
                'created_at': message.created_at.isoformat() if message.created_at else None
            }
        }), 201
        
    except Exception as e:
        print(f"❌ Error sending message: {str(e)}")
        db.session.rollback()
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


# ===== ADMIN: GET ALL STUDENTS =====
@messages_bp.route('/admin/students', methods=['GET'])
@jwt_required()
def get_all_students():
    try:
        sender_id = get_jwt_identity()
        sender = User.query.get(sender_id)
        
        if not sender or sender.role != 'admin':
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
        print(f"🔴 Error fetching students: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


# ===== ADMIN: GET MESSAGE STATS =====
@messages_bp.route('/admin/messages/stats', methods=['GET'])
@jwt_required()
def get_message_stats():
    """Get message statistics for admin dashboard"""
    try:
        sender_id = get_jwt_identity()
        sender = User.query.get(sender_id)
        
        if not sender or sender.role != 'admin':
            return jsonify({'error': 'Unauthorized'}), 403
        
        total_messages = Message.query.count()
        unread_messages = Message.query.filter_by(is_read=False).count()
        important_messages = Message.query.filter_by(is_important=True).count()
        
        # Messages sent today
        today = datetime.utcnow().date()
        today_start = datetime(today.year, today.month, today.day)
        today_messages = Message.query.filter(Message.created_at >= today_start).count()
        
        return jsonify({
            'total_messages': total_messages,
            'unread_messages': unread_messages,
            'important_messages': important_messages,
            'today_messages': today_messages
        }), 200
        
    except Exception as e:
        print(f"🔴 Error fetching message stats: {str(e)}")
        return jsonify({'error': str(e)}), 500