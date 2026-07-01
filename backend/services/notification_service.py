# services/notification_service.py

from app import db
from models import Notification, User
from datetime import datetime

class NotificationService:
    """Service to create and manage notifications"""
    
    @staticmethod
    def create_notification(user_id, type, title, message, link=None):
        """Create a single notification for a user"""
        try:
            notification = Notification(
                user_id=user_id,
                type=type,
                title=title,
                message=message,
                link=link,
                is_read=False,
                created_at=datetime.utcnow()
            )
            db.session.add(notification)
            db.session.commit()
            return notification
        except Exception as e:
            print(f"Error creating notification: {e}")
            db.session.rollback()
            return None
    
    @staticmethod
    def create_notification_for_all_students(type, title, message, link=None):
        """Create a notification for all students"""
        try:
            students = User.query.filter_by(role='student').all()
            notifications = []
            
            for student in students:
                notification = Notification(
                    user_id=student.id,
                    type=type,
                    title=title,
                    message=message,
                    link=link,
                    is_read=False,
                    created_at=datetime.utcnow()
                )
                db.session.add(notification)
                notifications.append(notification)
            
            db.session.commit()
            return notifications
        except Exception as e:
            print(f"Error creating notifications: {e}")
            db.session.rollback()
            return []
    
    @staticmethod
    def create_application_notification(user_id, opportunity_title, status):
        """Create notification for application status change"""
        status_messages = {
            'pending': f'Your application for "{opportunity_title}" has been received and is being reviewed.',
            'shortlisted': f'🎉 Congratulations! Your application for "{opportunity_title}" has been shortlisted!',
            'interview': f'📅 Great news! You have been invited for an interview for "{opportunity_title}".',
            'accepted': f'🎊 Congratulations! You have been accepted for "{opportunity_title}"!',
            'rejected': f'Thank you for your interest. Unfortunately, your application for "{opportunity_title}" was not selected.'
        }
        
        title_map = {
            'pending': 'Application Received',
            'shortlisted': 'Application Shortlisted 🎯',
            'interview': 'Interview Invitation 📅',
            'accepted': 'Application Accepted 🎊',
            'rejected': 'Application Update'
        }
        
        message = status_messages.get(status, f'Your application for "{opportunity_title}" has been updated to {status}.')
        title = title_map.get(status, 'Application Update')
        
        link = '/applications'
        
        return NotificationService.create_notification(
            user_id=user_id,
            type='application',
            title=title,
            message=message,
            link=link
        )
    
    @staticmethod
    def create_message_notification(user_id, sender_name, message_preview, message_id):
        """Create notification for new message"""
        title = f'New Message from {sender_name}'
        message = f'You have a new message from {sender_name}: "{message_preview[:50]}..."'
        link = f'/messages/{message_id}'
        
        return NotificationService.create_notification(
            user_id=user_id,
            type='message',
            title=title,
            message=message,
            link=link
        )
    
    @staticmethod
    def create_opportunity_notification(opportunity_title, opportunity_id, company_name):
        """Create notification for new opportunity"""
        title = f'New Opportunity: {opportunity_title}'
        message = f'{company_name} is hiring for {opportunity_title}. Apply now!'
        link = f'/opportunities/{opportunity_id}'
        
        return NotificationService.create_notification_for_all_students(
            type='opportunity',
            title=title,
            message=message,
            link=link
        )
    
    @staticmethod
    def create_welcome_notification(user_id, user_name):
        """Create welcome notification for new user"""
        title = 'Welcome to Intern Link! 🎉'
        message = f'Welcome {user_name}! Start exploring opportunities and building your career today.'
        link = '/dashboard'
        
        return NotificationService.create_notification(
            user_id=user_id,
            type='welcome',
            title=title,
            message=message,
            link=link
        )
    
    @staticmethod
    def create_profile_reminder(user_id):
        """Create profile completion reminder"""
        title = 'Complete Your Profile'
        message = 'Your profile is 60% complete. Add your skills and experience to stand out to employers!'
        link = '/profile'
        
        return NotificationService.create_notification(
            user_id=user_id,
            type='reminder',
            title=title,
            message=message,
            link=link
        )