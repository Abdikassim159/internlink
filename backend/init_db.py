
from app import create_app
from models import db, User, StudentProfile, Opportunity, Application
from datetime import datetime, timedelta
import bcrypt
import json

def init_database():
    app = create_app()
    
    with app.app_context():
        # Drop all tables and recreate
        db.drop_all()
        db.create_all()
        print("✅ Tables created!")
        
        hashed_password = bcrypt.hashpw('password123'.encode('utf-8'), bcrypt.gensalt())
        
        # 1. Create Admin (AUTO-VERIFIED)
        admin = User(
            full_name='System Admin',
            email='admin@internlink.com',
            password=hashed_password.decode('utf-8'),
            role='admin',
            is_verified=True,
            verified_at=datetime.utcnow()
        )
        db.session.add(admin)
        print("✅ Admin created (auto-verified)")
        
        # 2. Create Employer (VERIFIED)
        employer = User(
            full_name='Safaricom HR',
            email='employer@example.com',
            password=hashed_password.decode('utf-8'),
            role='employer',
            is_verified=True,
            verified_at=datetime.utcnow()
        )
        db.session.add(employer)
        print("✅ Employer created (verified)")
        
        # 3. Create Student (VERIFIED for testing)
        student = User(
            full_name='John Kimani',
            email='student@example.com',
            password=hashed_password.decode('utf-8'),
            role='student',
            is_verified=True,
            verified_at=datetime.utcnow()
        )
        db.session.add(student)
        db.session.flush()
        print("✅ Student created (verified for testing)")
        
        # 4. Create Student Profile
        student_profile = StudentProfile(
            user_id=student.id,
            full_name='John Kimani',
            course='BSc Computer Science',
            university='JKUAT',
            year_of_study=3,
            location='Nairobi, Kenya',
            phone='+254 712 345 678',
            bio='Passionate software developer with experience in web development and data science.',
            skills=json.dumps(['React', 'Python', 'SQL', 'JavaScript', 'Django', 'Git'])
        )
        db.session.add(student_profile)
        print("✅ Student profile created")
        
        db.session.commit()
        
        print("\n" + "="*50)
        print("📧 LOGIN CREDENTIALS")
        print("="*50)
        print("   Admin: admin@internlink.com / password123")
        print("   Employer: employer@example.com / password123")
        print("   Student: student@example.com / password123")
        print("="*50)
        print("\n📌 Note: New students will receive email verification.")
        print("   Admin accounts are auto-verified.")

if __name__ == '__main__':
    init_database()
