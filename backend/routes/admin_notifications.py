# routes/admin_notifications.py

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.notification_service import NotificationService
from models import User

admin_notif_bp = Blueprint('admin_notifications', __name__)

@admin_notif_bp.route('/admin/notifications', methods=['POST'])
@jwt_required()
def create_admin_notification():
    """Admin creates notification for all students or specific student"""
    user_id = get_jwt_identity()
    
    # Check if user is admin
    admin = User.query.get(user_id)
    if not admin or admin.role != 'admin':
        return jsonify({'error': 'Admin access required'}), 403
    
    data = request.get_json()
    target = data.get('target', 'all')  # 'all' or specific user_id
    title = data.get('title')
    message = data.get('message')
    notif_type = data.get('type', 'system')
    link = data.get('link')
    
    if not title or not message:
        return jsonify({'error': 'Title and message are required'}), 400
    
    if target == 'all':
        notifications = NotificationService.create_notification_for_all_students(
            type=notif_type,
            title=title,
            message=message,
            link=link
        )
        return jsonify({
            'message': f'Notification sent to {len(notifications)} students',
            'count': len(notifications)
        }), 201
    else:
        student = User.query.get(target)
        if not student or student.role != 'student':
            return jsonify({'error': 'Student not found'}), 404
        
        notification = NotificationService.create_notification(
            user_id=target,
            type=notif_type,
            title=title,
            message=message,
            link=link
        )
        return jsonify({
            'message': 'Notification sent successfully',
            'notification': {
                'id': notification.id,
                'title': notification.title,
                'message': notification.message,
                'type': notification.type,
                'link': notification.link,
                'created_at': notification.created_at.isoformat()
            }
        }), 201

@admin_notif_bp.route('/admin/notifications/templates', methods=['GET'])
@jwt_required()
def get_notification_templates():
    """Get notification templates for admin"""
    user_id = get_jwt_identity()
    admin = User.query.get(user_id)
    
    if not admin or admin.role != 'admin':
        return jsonify({'error': 'Admin access required'}), 403
    
    templates = [
        {
            'title': 'New Internship Opportunity',
            'message': 'We have a new internship opportunity available. Check it out!',
            'type': 'opportunity',
            'link': '/opportunities'
        },
        {
            'title': 'Application Deadline Reminder',
            'message': 'Reminder: Applications for the current internship cycle close soon.',
            'type': 'reminder',
            'link': '/applications'
        },
        {
            'title': 'Upcoming Webinar',
            'message': 'Join our upcoming career development webinar this Friday.',
            'type': 'event',
            'link': '/events'
        },
        {
            'title': 'Profile Completion',
            'message': 'Complete your profile to increase your chances of getting hired.',
            'type': 'reminder',
            'link': '/profile'
        },
        {
            'title': 'New Feature Alert',
            'message': 'We have added new features to help you find the perfect internship.',
            'type': 'system',
            'link': '/dashboard'
        }
    ]
    
    return jsonify({'templates': templates}), 200

@admin_notif_bp.route('/admin/notifications/users', methods=['GET'])
@jwt_required()
def get_students_list():
    """Get list of all students for admin to send individual notifications"""
    user_id = get_jwt_identity()
    admin = User.query.get(user_id)
    
    if not admin or admin.role != 'admin':
        return jsonify({'error': 'Admin access required'}), 403
    
    students = User.query.filter_by(role='student').all()
    
    return jsonify({
        'students': [{
            'id': s.id,
            'email': s.email,
            'full_name': s.full_name or s.email,
            'created_at': s.created_at.isoformat() if s.created_at else None
        } for s in students]
    }), 200