
from app import create_app
from models import db, User, EmployerProfile, Opportunity
from datetime import datetime, timedelta
import bcrypt

def add_sample_companies():
    app = create_app()
    
    with app.app_context():
        # Create employer users with profiles
        companies_data = [
            {
                'name': 'Safaricom',
                'email': 'hr@safaricom.com',
                'industry': 'Technology',
                'location': 'Nairobi',
                'description': 'Leading telecommunications company in Kenya',
                'verified': True,
                'password': 'password123'
            },
            {
                'name': 'KCB Bank',
                'email': 'hr@kcb.com',
                'industry': 'Finance',
                'location': 'Nairobi',
                'description': 'Kenya\'s largest commercial bank',
                'verified': True,
                'password': 'password123'
            },
            {
                'name': 'Equity Bank',
                'email': 'hr@equity.com',
                'industry': 'Banking',
                'location': 'Nairobi',
                'description': 'Leading financial services provider',
                'verified': True,
                'password': 'password123'
            },
            {
                'name': 'Microsoft',
                'email': 'hr@microsoft.com',
                'industry': 'Technology',
                'location': 'Nairobi',
                'description': 'Global technology company',
                'verified': True,
                'password': 'password123'
            },
            {
                'name': 'Google',
                'email': 'hr@google.com',
                'industry': 'Technology',
                'location': 'Nairobi',
                'description': 'Global technology company',
                'verified': True,
                'password': 'password123'
            },
            {
                'name': 'Twiga Foods',
                'email': 'hr@twiga.com',
                'industry': 'Agriculture',
                'location': 'Nairobi',
                'description': 'Agricultural technology company',
                'verified': False,
                'password': 'password123'
            },
            {
                'name': 'Cellulant',
                'email': 'hr@cellulant.com',
                'industry': 'FinTech',
                'location': 'Nairobi',
                'description': 'Digital payments company',
                'verified': False,
                'password': 'password123'
            },
            {
                'name': 'KenGen',
                'email': 'hr@kengen.com',
                'industry': 'Energy',
                'location': 'Nakuru',
                'description': 'Kenya\'s largest power producer',
                'verified': False,
                'password': 'password123'
            },
            {
                'name': 'Oracle',
                'email': 'hr@oracle.com',
                'industry': 'Technology',
                'location': 'Nairobi',
                'description': 'Global technology company',
                'verified': False,
                'password': 'password123'
            }
        ]
        
        count = 0
        for company_data in companies_data:
            # Check if user already exists
            existing = User.query.filter_by(email=company_data['email']).first()
            if existing:
                print(f"⏭️  {company_data['name']} already exists")
                continue
            
            # Hash password
            hashed = bcrypt.hashpw(company_data['password'].encode('utf-8'), bcrypt.gensalt())
            
            # Create employer user
            employer = User(
                full_name=company_data['name'],
                email=company_data['email'],
                password=hashed.decode('utf-8'),
                role='employer'
            )
            db.session.add(employer)
            db.session.flush()  # Get the ID
            
            # Create employer profile
            profile = EmployerProfile(
                user_id=employer.id,
                company_name=company_data['name'],
                industry=company_data['industry'],
                location=company_data['location'],
                company_description=company_data['description'],
                verified=company_data['verified']
            )
            db.session.add(profile)
            
            count += 1
        
        db.session.commit()
        print(f"✅ {count} companies added successfully!")
        
        # Show all companies
        all_companies = EmployerProfile.query.all()
        print(f"\n📋 Total companies in database: {len(all_companies)}")
        for comp in all_companies:
            print(f"   - {comp.company_name} ({comp.industry})")

if __name__ == '__main__':
    add_sample_companies()
