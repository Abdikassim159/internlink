
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, StudentProfile, Application, Opportunity
from datetime import datetime
import json

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get current user's profile with all details"""
    try:
        current_user_id = get_jwt_identity()
        print(f"Fetching profile for user: {current_user_id}")
        
        # Get user
        user = User.query.get(current_user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get student profile
        student_profile = StudentProfile.query.filter_by(user_id=current_user_id).first()
        
        # Get applications
        applications = Application.query.filter_by(
            student_id=current_user_id
        ).order_by(Application.applied_at.desc()).limit(5).all()
        
        # Calculate stats
        all_apps = Application.query.filter_by(student_id=current_user_id).all()
        stats = {
            'applied': len(all_apps),
            'shortlisted': len([a for a in all_apps if a.status == 'shortlisted']),
            'interview': len([a for a in all_apps if a.status == 'interview']),
            'accepted': len([a for a in all_apps if a.status == 'accepted']),
            'matchScore': 95
        }
        
        # Build profile data
        profile_data = {
            'id': user.id,
            'fullName': user.full_name,
            'email': user.email,
            'role': user.role,
            'phone': student_profile.phone if student_profile else '',
            'location': student_profile.location if student_profile else '',
            'university': student_profile.university if student_profile else '',
            'course': student_profile.course if student_profile else '',
            'yearOfStudy': f"{student_profile.year_of_study} Year" if student_profile else '',
            'bio': student_profile.bio if student_profile else '',
            'skills': student_profile.get_skills() if student_profile else [],
            'cvUrl': student_profile.cv_url if student_profile else '',
            'stats': stats,
            'applications': [
                {
                    'id': app.id,
                    'title': app.opportunity.title if app.opportunity else 'N/A',
                    'company': app.opportunity.company_name if app.opportunity else 'N/A',
                    'status': app.status,
                    'date': app.applied_at.isoformat() if app.applied_at else ''
                }
                for app in applications
            ]
        }
        
        return jsonify(profile_data), 200
        
    except Exception as e:
        print(f"Profile error: {str(e)}")
        return jsonify({'error': 'Failed to fetch profile'}), 500


@profile_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update user profile"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        print(f"Updating profile for user: {current_user_id}")
        print(f"Data received: {data}")
        
        # Update user
        user = User.query.get(current_user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        if 'fullName' in data and data['fullName']:
            user.full_name = data['fullName']
            print(f"Updated full_name to: {data['fullName']}")
        
        # Update or create student profile
        student_profile = StudentProfile.query.filter_by(user_id=current_user_id).first()
        if not student_profile:
            student_profile = StudentProfile(
                user_id=current_user_id,
                full_name=user.full_name,
                course='',
                university='',
                year_of_study=1
            )
            db.session.add(student_profile)
            print("Created new student profile")
        
        # Update fields
        if 'phone' in data:
            student_profile.phone = data['phone']
            print(f"Updated phone to: {data['phone']}")
        if 'location' in data:
            student_profile.location = data['location']
            print(f"Updated location to: {data['location']}")
        if 'university' in data:
            student_profile.university = data['university']
            print(f"Updated university to: {data['university']}")
        if 'course' in data:
            student_profile.course = data['course']
            print(f"Updated course to: {data['course']}")
        if 'bio' in data:
            student_profile.bio = data['bio']
            print(f"Updated bio")
        if 'skills' in data:
            student_profile.set_skills(data['skills'])
            print(f"Updated skills to: {data['skills']}")
        if 'yearOfStudy' in data:
            year_map = {
                '1st Year': 1,
                '2nd Year': 2,
                '3rd Year': 3,
                '4th Year': 4,
                'Graduate': 5
            }
            student_profile.year_of_study = year_map.get(data['yearOfStudy'], 1)
            print(f"Updated year_of_study to: {student_profile.year_of_study}")
        
        # Update full_name in student_profile too
        student_profile.full_name = user.full_name
        
        db.session.commit()
        print("✅ Profile updated successfully!")
        
        return jsonify({
            'message': 'Profile updated successfully',
            'profile': {
                'fullName': user.full_name,
                'email': user.email,
                'phone': student_profile.phone,
                'location': student_profile.location,
                'university': student_profile.university,
                'course': student_profile.course,
                'yearOfStudy': f"{student_profile.year_of_study} Year",
                'bio': student_profile.bio,
                'skills': student_profile.get_skills()
            }
        }), 200
        
    except Exception as e:
        print(f"❌ Update profile error: {str(e)}")
        db.session.rollback()
        return jsonify({'error': f'Failed to update profile: {str(e)}'}), 500


@profile_bp.route('/profile/skills', methods=['PUT'])
@jwt_required()
def update_skills():
    """Update only skills"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        student_profile = StudentProfile.query.filter_by(user_id=current_user_id).first()
        if not student_profile:
            student_profile = StudentProfile(
                user_id=current_user_id,
                full_name=User.query.get(current_user_id).full_name,
                course='',
                university='',
                year_of_study=1
            )
            db.session.add(student_profile)
        
        student_profile.set_skills(data.get('skills', []))
        db.session.commit()
        
        return jsonify({
            'message': 'Skills updated successfully',
            'skills': student_profile.get_skills()
        }), 200
        
    except Exception as e:
        print(f"Update skills error: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Failed to update skills'}), 500
