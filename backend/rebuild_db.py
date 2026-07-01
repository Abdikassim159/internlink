# rebuild_db.py
from app import create_app
from models import db
import os

def rebuild():
    app = create_app()
    with app.app_context():
        # Import all models
        from models import User, StudentProfile, EmployerProfile, Opportunity, Application, SavedOpportunity, Message, Notification
        
        # Create all tables
        db.create_all()
        print("✅ Database rebuilt with all tables!")
        
        # Verify
        from sqlalchemy import inspect
        inspector = inspect(db.engine)
        tables = inspector.get_table_names()
        print(f"\n📊 Tables: {tables}")
        
        for table in tables:
            columns = inspector.get_columns(table)
            print(f"\n📌 {table} ({len(columns)} columns):")
            for col in columns[:5]:
                print(f"   - {col['name']} ({col['type']})")
            if len(columns) > 5:
                print(f"   ... and {len(columns) - 5} more columns")

if __name__ == "__main__":
    rebuild()
