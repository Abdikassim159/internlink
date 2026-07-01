from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, StudentProfile, Application, Opportunity
from datetime import datetime
import json
from services.notification_service import NotificationService  # 👈 ADD THIS IMPORT

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
        
        # Store old values to check what changed
        old_skills = []
        old_phone = None
        old_location = None
        old_university = None
        old_course = None
        
        # Get student profile
        student_profile = StudentProfile.query.filter_by(user_id=current_user_id).first()
        if student_profile:
            old_skills = student_profile.get_skills() if student_profile else []
            old_phone = student_profile.phone
            old_location = student_profile.location
            old_university = student_profile.university
            old_course = student_profile.course
        
        if 'fullName' in data and data['fullName']:
            user.full_name = data['fullName']
            print(f"Updated full_name to: {data['fullName']}")
        
        # Update or create student profile
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
        
        # 🔔 CHECK PROFILE COMPLETION AND SEND NOTIFICATIONS
        try:
            # Check if profile is now complete
            required_fields = [
                student_profile.phone,
                student_profile.location,
                student_profile.university,
                student_profile.course,
                student_profile.bio
            ]
            filled = sum(1 for f in required_fields if f and f != 'Not set' and f != '')
            skills_count = len(student_profile.get_skills() if student_profile.get_skills() else [])
            
            # Profile completion percentage
            total_fields = len(required_fields) + 1  # +1 for skills
            completion = ((filled + (1 if skills_count > 0 else 0)) / total_fields) * 100
            
            # Check if skills were added
            new_skills = student_profile.get_skills() if student_profile.get_skills() else []
            if len(new_skills) > len(old_skills):
                NotificationService.create_notification(
                    user_id=current_user_id,
                    type='system',
                    title='Skills Updated ✅',
                    message=f'Great! You have added {len(new_skills)} skills to your profile. This will help employers find you!',
                    link='/profile'
                )
                print(f"✅ Skills update notification sent")
            
            # Profile is 80% or more complete
            if completion >= 80:
                # Check if user already has a profile completion notification
                from models import Notification
                existing = Notification.query.filter_by(
                    user_id=current_user_id,
                    type='system',
                    title='Profile Complete! 🎉'
                ).first()
                
                if not existing:
                    NotificationService.create_notification(
                        user_id=current_user_id,
                        type='system',
                        title='Profile Complete! 🎉',
                        message='Your profile is now complete! Employers can now find you more easily. Keep up the great work!',
                        link='/profile'
                    )
                    print(f"✅ Profile completion notification sent")
            
            # Profile is 50% or more complete but less than 80%
            elif completion >= 50 and completion < 80:
                # Check if user already has a profile reminder notification
                from models import Notification
                existing = Notification.query.filter_by(
                    user_id=current_user_id,
                    type='reminder',
                    title='Complete Your Profile'
                ).first()
                
                if not existing:
                    NotificationService.create_profile_reminder(current_user_id)
                    print(f"✅ Profile reminder notification sent")
                    
        except Exception as notif_error:
            print(f"⚠️ Failed to send profile notifications: {str(notif_error)}")
            # Don't fail the profile update if notification fails
        
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
        new_skills = data.get('skills', [])
        
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
        
        # Get old skills for comparison
        old_skills = student_profile.get_skills() if student_profile.get_skills() else []
        
        # Update skills
        student_profile.set_skills(new_skills)
        db.session.commit()
        
        # 🔔 NOTIFY ABOUT SKILLS UPDATE
        try:
            if len(new_skills) > len(old_skills):
                NotificationService.create_notification(
                    user_id=current_user_id,
                    type='system',
                    title='Skills Updated ✅',
                    message=f'You have added {len(new_skills)} skills. This will help employers find you!',
                    link='/profile'
                )
                print(f"✅ Skills update notification sent")
        except Exception as notif_error:
            print(f"⚠️ Failed to send skills notification: {str(notif_error)}")
        
        return jsonify({
            'message': 'Skills updated successfully',
            'skills': student_profile.get_skills()
        }), 200
        
    except Exception as e:
        print(f"Update skills error: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Failed to update skills'}), 500


# ===== GET PROFILE COMPLETION PERCENTAGE =====
@profile_bp.route('/profile/completion', methods=['GET'])
@jwt_required()
def get_profile_completion():
    """Get profile completion percentage"""
    try:
        current_user_id = get_jwt_identity()
        
        student_profile = StudentProfile.query.filter_by(user_id=current_user_id).first()
        
        if not student_profile:
            return jsonify({
                'completion': 0,
                'completed_fields': 0,
                'total_fields': 6,
                'fields': {
                    'full_name': False,
                    'phone': False,
                    'location': False,
                    'university': False,
                    'course': False,
                    'skills': False
                }
            }), 200
        
        # Check each field
        fields = {
            'full_name': bool(student_profile.full_name),
            'phone': bool(student_profile.phone),
            'location': bool(student_profile.location),
            'university': bool(student_profile.university),
            'course': bool(student_profile.course),
            'skills': len(student_profile.get_skills() if student_profile.get_skills() else []) > 0
        }
        
        completed = sum(1 for v in fields.values() if v)
        total = len(fields)
        percentage = (completed / total) * 100
        
        return jsonify({
            'completion': round(percentage, 0),
            'completed_fields': completed,
            'total_fields': total,
            'fields': fields
        }), 200
        
    except Exception as e:
        print(f"Error getting profile completion: {str(e)}")
        return jsonify({'error': 'Failed to get profile completion'}), 500


# ===== ADMIN: GET ALL STUDENT PROFILES =====
@profile_bp.route('/admin/profiles', methods=['GET'])
@jwt_required()
def get_all_student_profiles():
    """Get all student profiles (Admin only)"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if user.role != 'admin':
            return jsonify({'error': 'Permission denied. Admin only.'}), 403
        
        students = User.query.filter_by(role='student').all()
        
        result = []
        for student in students:
            profile = StudentProfile.query.filter_by(user_id=student.id).first()
            
            result.append({
                'id': student.id,
                'full_name': student.full_name,
                'email': student.email,
                'phone': profile.phone if profile else '',
                'location': profile.location if profile else '',
                'university': profile.university if profile else '',
                'course': profile.course if profile else '',
                'skills': profile.get_skills() if profile else [],
                'joined': student.created_at.isoformat() if student.created_at else None
            })
        
        return jsonify({
            'students': result,
            'total': len(result)
        }), 200
        
    except Exception as e:
        print(f"Error fetching student profiles: {str(e)}")
        return jsonify({'error': 'Failed to fetch student profiles'}), 500