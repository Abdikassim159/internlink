# clean_reset.py
import os
import sys
from app import create_app
from models import db

def clean_reset():
    print("=" * 70)
    print("🧹 CLEAN DATABASE RESET")
    print("=" * 70)
    
    app = create_app()
    
    with app.app_context():
        # Get database path
        db_path = app.config['SQLALCHEMY_DATABASE_URI'].replace('sqlite:///', '')
        print(f"📁 Database path: {db_path}")
        
        # Close any existing connections
        db.session.remove()
        db.engine.dispose()
        
        # Delete the database file
        if os.path.exists(db_path):
            try:
                os.remove(db_path)
                print(f"🗑️  Deleted: {db_path}")
            except Exception as e:
                print(f"❌ Could not delete: {e}")
                return
        else:
            print("ℹ️  No existing database found.")
        
        # Import ALL models to ensure they're registered
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
        
        print(f"✅ Models registered: {len(db.metadata.tables)} tables in metadata")
        
        # Show what tables will be created
        print("\n📋 Tables to be created:")
        for table_name in db.metadata.tables.keys():
            print(f"   - {table_name}")
        
        # Create all tables
        print("\n🔄 Creating tables...")
        db.create_all()
        print("✅ Tables created!")
        
        # Verify
        from sqlalchemy import inspect
        inspector = inspect(db.engine)
        tables = inspector.get_table_names()
        
        print(f"\n📊 Tables created: {len(tables)}")
        for table in sorted(tables):
            columns = inspector.get_columns(table)
            print(f"\n   📌 {table} ({len(columns)} columns):")
            for col in columns:
                print(f"      - {col['name']} ({col['type']})")
        
        # Verify User table has all columns
        print("\n🔍 Checking User table columns:")
        user_columns = inspector.get_columns('users')
        expected_user_columns = [
            'id', 'full_name', 'email', 'password', 'role',
            'is_verified', 'verification_token', 'token_created_at', 'verified_at',
            'otp_code', 'otp_created_at', 'otp_expires_at', 'otp_attempts',
            'created_at', 'updated_at'
        ]
        
        user_col_names = [col['name'] for col in user_columns]
        missing = [col for col in expected_user_columns if col not in user_col_names]
        
        if missing:
            print(f"⚠️  Missing columns: {missing}")
        else:
            print("✅ All User columns present!")
        
        print("\n" + "=" * 70)
        print("✅ Clean reset complete!")
        print("=" * 70)

if __name__ == "__main__":
    clean_reset()