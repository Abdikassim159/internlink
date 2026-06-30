from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False, default='User')
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='student')
    
    is_verified = db.Column(db.Boolean, default=False)
    verification_token = db.Column(db.String(100), unique=True)
    token_created_at = db.Column(db.DateTime)
    verified_at = db.Column(db.DateTime)
    
    # OTP fields
    otp_code = db.Column(db.String(6))
    otp_created_at = db.Column(db.DateTime)
    otp_expires_at = db.Column(db.DateTime)
    otp_attempts = db.Column(db.Integer, default=0)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    student_profile = db.relationship('StudentProfile', backref='user', uselist=False, cascade='all, delete-orphan')
    employer_profile = db.relationship('EmployerProfile', backref='user', uselist=False, cascade='all, delete-orphan')
    applications = db.relationship('Application', backref='student', lazy=True, cascade='all, delete-orphan')
    posted_opportunities = db.relationship('Opportunity', backref='employer', lazy=True, cascade='all, delete-orphan')
    saved_opportunities = db.relationship('SavedOpportunity', backref='student', lazy=True, cascade='all, delete-orphan')
    received_messages = db.relationship('Message', foreign_keys='Message.student_id', backref='student', lazy=True, cascade='all, delete-orphan')
    sent_messages = db.relationship('Message', foreign_keys='Message.sender_id', backref='sender', lazy=True, cascade='all, delete-orphan')
    # ===== NOTIFICATION RELATIONSHIP - FIXED =====
    notification_records = db.relationship('Notification', foreign_keys='Notification.user_id', backref='recipient', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'full_name': self.full_name,
            'email': self.email,
            'role': self.role,
            'is_verified': self.is_verified,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class StudentProfile(db.Model):
    __tablename__ = 'student_profiles'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    
    full_name = db.Column(db.String(100), nullable=False)
    registration_number = db.Column(db.String(50), unique=True)
    course = db.Column(db.String(100), nullable=False)
    university = db.Column(db.String(100), nullable=False)
    year_of_study = db.Column(db.Integer, nullable=False, default=1)
    
    skills = db.Column(db.Text, default='[]')
    bio = db.Column(db.Text)
    location = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    cv_url = db.Column(db.String(200))
    profile_image = db.Column(db.String(200))
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def get_skills(self):
        return json.loads(self.skills) if self.skills else []
    
    def set_skills(self, skills_list):
        self.skills = json.dumps(skills_list)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'full_name': self.full_name,
            'registration_number': self.registration_number,
            'course': self.course,
            'university': self.university,
            'year_of_study': self.year_of_study,
            'skills': self.get_skills(),
            'bio': self.bio,
            'location': self.location,
            'phone': self.phone,
            'cv_url': self.cv_url,
            'profile_image': self.profile_image
        }


class EmployerProfile(db.Model):
    __tablename__ = 'employer_profiles'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    
    company_name = db.Column(db.String(100), nullable=False)
    company_description = db.Column(db.Text)
    industry = db.Column(db.String(50))
    location = db.Column(db.String(100))
    website = db.Column(db.String(200))
    logo_url = db.Column(db.String(200))
    verified = db.Column(db.Boolean, default=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Opportunity(db.Model):
    __tablename__ = 'opportunities'
    
    id = db.Column(db.Integer, primary_key=True)
    employer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    title = db.Column(db.String(100), nullable=False)
    company_name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(20), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    duration = db.Column(db.String(50))
    stipend = db.Column(db.String(50))
    deadline = db.Column(db.DateTime, nullable=False)
    
    description = db.Column(db.Text, nullable=False)
    requirements = db.Column(db.Text)
    required_courses = db.Column(db.Text, default='[]')
    required_skills = db.Column(db.Text, default='[]')
    
    is_active = db.Column(db.Boolean, default=True)
    is_featured = db.Column(db.Boolean, default=False)
    slots = db.Column(db.Integer, default=1)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    applications = db.relationship('Application', backref='opportunity', lazy=True, cascade='all, delete-orphan')
    
    def get_required_courses(self):
        return json.loads(self.required_courses) if self.required_courses else []
    
    def set_required_courses(self, courses_list):
        self.required_courses = json.dumps(courses_list)
    
    def get_required_skills(self):
        return json.loads(self.required_skills) if self.required_skills else []
    
    def set_required_skills(self, skills_list):
        self.required_skills = json.dumps(skills_list)
    
    def to_dict(self):
        return {
            'id': self.id,
            'employer_id': self.employer_id,
            'title': self.title,
            'company_name': self.company_name,
            'type': self.type,
            'location': self.location,
            'duration': self.duration,
            'stipend': self.stipend,
            'deadline': self.deadline.isoformat() if self.deadline else None,
            'description': self.description,
            'requirements': self.requirements,
            'required_courses': self.get_required_courses(),
            'required_skills': self.get_required_skills(),
            'is_active': self.is_active,
            'is_featured': self.is_featured,
            'slots': self.slots,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Application(db.Model):
    __tablename__ = 'applications'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    opportunity_id = db.Column(db.Integer, db.ForeignKey('opportunities.id'), nullable=False)
    
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    course = db.Column(db.String(100), nullable=False)
    university = db.Column(db.String(100), nullable=False)
    year_of_study = db.Column(db.String(20), nullable=False)
    domain = db.Column(db.String(50), nullable=False)
    cover_letter = db.Column(db.Text)
    resume_url = db.Column(db.String(200))
    
    status = db.Column(db.String(20), default='pending')
    match_score = db.Column(db.Float)
    admin_notes = db.Column(db.Text)
    
    applied_at = db.Column(db.DateTime, default=datetime.utcnow)
    reviewed_at = db.Column(db.DateTime)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (db.UniqueConstraint('student_id', 'opportunity_id', name='unique_application'),)
    
    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'opportunity_id': self.opportunity_id,
            'full_name': self.full_name,
            'email': self.email,
            'phone': self.phone,
            'course': self.course,
            'university': self.university,
            'year_of_study': self.year_of_study,
            'domain': self.domain,
            'cover_letter': self.cover_letter,
            'resume_url': self.resume_url,
            'status': self.status,
            'match_score': self.match_score,
            'admin_notes': self.admin_notes,
            'applied_at': self.applied_at.isoformat() if self.applied_at else None,
            'reviewed_at': self.reviewed_at.isoformat() if self.reviewed_at else None,
            'opportunity': self.opportunity.to_dict() if self.opportunity else None
        }


class SavedOpportunity(db.Model):
    __tablename__ = 'saved_opportunities'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    opportunity_id = db.Column(db.Integer, db.ForeignKey('opportunities.id'), nullable=False)
    saved_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    __table_args__ = (db.UniqueConstraint('student_id', 'opportunity_id', name='unique_saved'),)


class Message(db.Model):
    __tablename__ = 'messages'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    sender_name = db.Column(db.String(100), default='Admin')
    sender_role = db.Column(db.String(50), default='admin')
    subject = db.Column(db.String(255))
    message = db.Column(db.Text, nullable=False)
    is_read = db.Column(db.Boolean, default=False)
    is_important = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'sender_id': self.sender_id,
            'sender_name': self.sender_name,
            'sender_role': self.sender_role,
            'subject': self.subject,
            'message': self.message,
            'is_read': self.is_read,
            'is_important': self.is_important,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


# ===== NOTIFICATION MODEL - FIXED =====
class Notification(db.Model):
    __tablename__ = 'notifications'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    type = db.Column(db.String(50), nullable=False)  # application, message, opportunity, reminder, general
    title = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    link = db.Column(db.String(255))
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        from datetime import datetime
        now = datetime.utcnow()
        diff = now - self.created_at if self.created_at else None
        
        if diff:
            if diff.days > 0:
                if diff.days == 1:
                    time_ago = 'Yesterday'
                else:
                    time_ago = f'{diff.days} days ago'
            elif diff.seconds < 60:
                time_ago = 'Just now'
            elif diff.seconds < 3600:
                minutes = diff.seconds // 60
                time_ago = f'{minutes}m ago'
            else:
                hours = diff.seconds // 3600
                time_ago = f'{hours}h ago'
        else:
            time_ago = 'Just now'
        
        return {
            'id': self.id,
            'user_id': self.user_id,
            'type': self.type,
            'title': self.title,
            'message': self.message,
            'link': self.link,
            'is_read': self.is_read,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'time_ago': time_ago
        }