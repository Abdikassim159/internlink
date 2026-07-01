# reset_db.py
from app import create_app
from models import db
import os

def reset_database():
    print("=" * 60)
    print("🔄 RESETTING DATABASE COMPLETELY")
    print("=" * 60)
    
    app = create_app()
    
    with app.app_context():
        # Get the database path
        db_path = app.config['SQLALCHEMY_DATABASE_URI'].replace('sqlite:///', '')
        print(f"📁 Database path: {db_path}")
        
        # Delete existing database
        if os.path.exists(db_path):
            print(f"🗑️  Deleting existing database: {db_path}")
            os.remove(db_path)
            print("✅ Database deleted!")
        else:
            print("ℹ️  No existing database found.")
        
        # Import all models to ensure they're registered
        print("\n📦 Registering all models...")
        from models import (
            User, 
            StudentProfile, 
            EmployerProfile, 
            Opportunity, 
            Application, 
            SavedOpportunity, 
            Message, 
            Notification
        )
        print(f"✅ Models registered: {len(db.metadata.tables)} tables")
        
        # Create all tables
        print("\n🔄 Creating all tables...")
        db.create_all()
        print("✅ All tables created successfully!")
        
        # Verify all tables
        from sqlalchemy import inspect
        inspector = inspect(db.engine)
        tables = sorted(inspector.get_table_names())
        
        print("\n📊 TABLES CREATED:")
        expected_tables = [
            'users',
            'student_profiles',
            'employer_profiles',
            'opportunities',
            'applications',
            'saved_opportunities',
            'messages',
            'notifications'
        ]
        
        # Check all tables
        all_present = True
        for table in expected_tables:
            status = "✅" if table in tables else "❌"
            print(f"   {status} {table}")
            if table not in tables:
                all_present = False
        
        if all_present:
            print("\n🎉 All 8 tables created successfully!")
        else:
            print("\n⚠️  Some tables are missing. Please check your models.")
        
        # Print table details
        print("\n📋 TABLE DETAILS:")
        for table in tables:
            columns = inspector.get_columns(table)
            print(f"\n   📌 {table}:")
            for col in columns[:3]:  # Show first 3 columns
                print(f"      - {col['name']} ({col['type']})")
            if len(columns) > 3:
                print(f"      ... and {len(columns) - 3} more columns")
        
        print("\n" + "=" * 60)
        print("✅ Database reset complete!")
        print("=" * 60)

if __name__ == "__main__":
    reset_database()