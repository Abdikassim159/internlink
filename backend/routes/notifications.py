from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Notification, User, Application, Message, Opportunity
from datetime import datetime

notifications_bp = Blueprint('notifications', __name__)

def time_ago(dt):
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

def create_notification(user_id, notification_type, title, message, link=None):
    """Helper function to create a notification"""
    try:
        notification = Notification(
            user_id=user_id,
            type=notification_type,
            title=title,
            message=message,
            link=link,
            is_read=False
        )
        db.session.add(notification)
        db.session.commit()
        return notification
    except Exception as e:
        print(f"Error creating notification: {str(e)}")
        return None


# ===== STUDENT: GET ALL NOTIFICATIONS =====
@notifications_bp.route('/notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    try:
        user_id = get_jwt_identity()
        
        notifications = Notification.query.filter_by(
            user_id=user_id
        ).order_by(Notification.created_at.desc()).all()
        
        result = []
        for notif in notifications:
            result.append(notif.to_dict())
        
        unread_count = sum(1 for n in notifications if not n.is_read)
        
        return jsonify({
            'notifications': result,
            'unread_count': unread_count,
            'total': len(result)
        }), 200
        
    except Exception as e:
        print(f"Error fetching notifications: {str(e)}")
        return jsonify({'error': str(e)}), 500


# ===== STUDENT: MARK NOTIFICATION AS READ =====
@notifications_bp.route('/notifications/<int:notification_id>/read', methods=['PUT'])
@jwt_required()
def mark_notification_read(notification_id):
    try:
        user_id = get_jwt_identity()
        
        notification = Notification.query.filter_by(
            id=notification_id,
            user_id=user_id
        ).first()
        
        if not notification:
            return jsonify({'error': 'Notification not found'}), 404
        
        notification.is_read = True
        db.session.commit()
        
        return jsonify({'success': True}), 200
        
    except Exception as e:
        print(f"Error marking notification read: {str(e)}")
        return jsonify({'error': str(e)}), 500


# ===== STUDENT: MARK ALL AS READ =====
@notifications_bp.route('/notifications/read-all', methods=['PUT'])
@jwt_required()
def mark_all_read():
    try:
        user_id = get_jwt_identity()
        
        Notification.query.filter_by(
            user_id=user_id,
            is_read=False
        ).update({'is_read': True})
        
        db.session.commit()
        
        return jsonify({'success': True}), 200
        
    except Exception as e:
        print(f"Error marking all read: {str(e)}")
        return jsonify({'error': str(e)}), 500


# ===== ADMIN: CREATE NOTIFICATION =====
@notifications_bp.route('/notifications/create', methods=['POST'])
@jwt_required()
def create_notification_route():
    try:
        sender_id = get_jwt_identity()
        sender = User.query.get(sender_id)
        
        if sender.role != 'admin':
            return jsonify({'error': 'Unauthorized'}), 403
        
        data = request.get_json()
        user_id = data.get('user_id')
        notification_type = data.get('type', 'general')
        title = data.get('title')
        message = data.get('message')
        link = data.get('link')
        
        if not user_id or not title or not message:
            return jsonify({'error': 'User ID, title and message are required'}), 400
        
        notification = create_notification(user_id, notification_type, title, message, link)
        
        if notification:
            return jsonify({
                'success': True,
                'notification': notification.to_dict()
            }), 201
        else:
            return jsonify({'error': 'Failed to create notification'}), 500
        
    except Exception as e:
        print(f"Error creating notification: {str(e)}")
        return jsonify({'error': str(e)}), 500