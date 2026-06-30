from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Application, Opportunity, User
from datetime import datetime

applications_bp = Blueprint('applications', __name__)


def time_ago(dt):
    """Convert datetime to 'time ago' string"""
    if not dt:
        return 'Just now'
    
    now = datetime.utcnow()
    diff = now - dt
    
    if diff.days > 0:
        if diff.days == 1:
            return 'Yesterday'
        return f'{diff.days} days ago'
    
    seconds = diff.seconds
    if seconds < 60:
        return 'Just now'
    if seconds < 3600:
        minutes = seconds // 60
        return f'{minutes}m ago'
    
    hours = seconds // 3600
    return f'{hours}h ago'


@applications_bp.route('/applications', methods=['POST'])
@jwt_required()
def submit_application():
    """Submit a new application"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        print(f"🔵 Received application data: {data}")
        print(f"🔵 User ID: {current_user_id}")
        
        # Validate required fields
        required_fields = ['opportunity_id', 'full_name', 'email', 'phone']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Check if opportunity exists
        opportunity = Opportunity.query.get(data.get('opportunity_id'))
        if not opportunity:
            return jsonify({'error': 'Opportunity not found'}), 404
        
        # Check if already applied
        existing = Application.query.filter_by(
            student_id=current_user_id,
            opportunity_id=data.get('opportunity_id')
        ).first()
        
        if existing:
            return jsonify({'error': 'You have already applied for this opportunity'}), 400
        
        # Create application
        application = Application(
            student_id=current_user_id,
            opportunity_id=data.get('opportunity_id'),
            full_name=data.get('full_name'),
            email=data.get('email'),
            phone=data.get('phone'),
            course=data.get('course', ''),
            university=data.get('university', ''),
            year_of_study=data.get('year_of_study', ''),
            domain=data.get('domain', ''),
            cover_letter=data.get('cover_letter', ''),
            status='pending',
            match_score=data.get('match_score', 0)
        )
        
        db.session.add(application)
        db.session.commit()
        
        print(f"✅ Application created with ID: {application.id}")
        
        return jsonify({
            'message': 'Application submitted successfully',
            'application_id': application.id,
            'status': application.status
        }), 201
        
    except Exception as e:
        print(f"🔴 Error submitting application: {str(e)}")
        import traceback
        traceback.print_exc()
        db.session.rollback()
        return jsonify({'error': 'Failed to submit application'}), 500


@applications_bp.route('/applications', methods=['GET'])
@jwt_required()
def get_all_applications():
    """Get all applications (Admin only)"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if user.role != 'admin':
            return jsonify({'error': 'Permission denied. Admin only.'}), 403
        
        applications = Application.query.order_by(Application.applied_at.desc()).all()
        
        result = []
        for app in applications:
            app_dict = {
                'id': app.id,
                'student_id': app.student_id,
                'opportunity_id': app.opportunity_id,
                'full_name': app.full_name,
                'email': app.email,
                'phone': app.phone,
                'course': app.course,
                'university': app.university,
                'year_of_study': app.year_of_study,
                'domain': app.domain,
                'cover_letter': app.cover_letter,
                'resume_url': app.resume_url,
                'status': app.status,
                'match_score': app.match_score,
                'admin_notes': app.admin_notes,
                'applied_at': app.applied_at.isoformat() if app.applied_at else None,
                'reviewed_at': app.reviewed_at.isoformat() if app.reviewed_at else None,
                'time_ago': time_ago(app.applied_at)
            }
            
            # Include opportunity data
            if app.opportunity:
                app_dict['opportunity'] = {
                    'id': app.opportunity.id,
                    'title': app.opportunity.title,
                    'company_name': app.opportunity.company_name,
                    'type': app.opportunity.type,
                    'location': app.opportunity.location
                }
            else:
                app_dict['opportunity'] = None
            
            result.append(app_dict)
        
        return jsonify({
            'applications': result,
            'total': len(result)
        }), 200
        
    except Exception as e:
        print(f"🔴 Error fetching applications: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Failed to fetch applications'}), 500


@applications_bp.route('/applications/my', methods=['GET'])
@jwt_required()
def get_my_applications():
    """Get current user's applications with full opportunity data"""
    try:
        current_user_id = get_jwt_identity()
        
        print(f"🔵 Fetching applications for user: {current_user_id}")
        
        applications = Application.query.filter_by(
            student_id=current_user_id
        ).order_by(Application.applied_at.desc()).all()
        
        result = []
        for app in applications:
            app_dict = {
                'id': app.id,
                'student_id': app.student_id,
                'opportunity_id': app.opportunity_id,
                'full_name': app.full_name,
                'email': app.email,
                'phone': app.phone,
                'course': app.course,
                'university': app.university,
                'year_of_study': app.year_of_study,
                'domain': app.domain,
                'cover_letter': app.cover_letter,
                'resume_url': app.resume_url,
                'status': app.status,
                'match_score': app.match_score,
                'admin_notes': app.admin_notes,
                'applied_at': app.applied_at.isoformat() if app.applied_at else None,
                'reviewed_at': app.reviewed_at.isoformat() if app.reviewed_at else None,
                'time_ago': time_ago(app.applied_at)
            }
            
            # Include full opportunity data
            if app.opportunity:
                app_dict['opportunity'] = {
                    'id': app.opportunity.id,
                    'title': app.opportunity.title,
                    'company_name': app.opportunity.company_name,
                    'type': app.opportunity.type,
                    'location': app.opportunity.location,
                    'stipend': app.opportunity.stipend,
                    'deadline': app.opportunity.deadline.isoformat() if app.opportunity.deadline else None
                }
            else:
                app_dict['opportunity'] = None
            
            result.append(app_dict)
        
        print(f"🔵 Found {len(result)} applications")
        
        return jsonify({
            'applications': result,
            'total': len(result)
        }), 200
        
    except Exception as e:
        print(f"🔴 Error fetching applications: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Failed to fetch applications'}), 500


@applications_bp.route('/applications/<int:id>', methods=['PUT'])
@jwt_required()
def update_application_status(id):
    """Update application status (Admin only)"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if user.role != 'admin':
            return jsonify({'error': 'Permission denied. Admin only.'}), 403
        
        application = Application.query.get_or_404(id)
        data = request.get_json()
        new_status = data.get('status')
        
        valid_statuses = ['pending', 'shortlisted', 'interview', 'accepted', 'rejected']
        if new_status not in valid_statuses:
            return jsonify({'error': 'Invalid status'}), 400
        
        application.status = new_status
        application.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Application status updated',
            'status': application.status
        }), 200
        
    except Exception as e:
        print(f"🔴 Error updating application: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Failed to update application'}), 500


@applications_bp.route('/applications/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_application(id):
    """Delete an application (Student can delete their own)"""
    try:
        current_user_id = get_jwt_identity()
        application = Application.query.get_or_404(id)
        
        # Check if user owns this application
        if application.student_id != current_user_id:
            user = User.query.get(current_user_id)
            if user.role != 'admin':
                return jsonify({'error': 'Permission denied'}), 403
        
        db.session.delete(application)
        db.session.commit()
        
        return jsonify({'message': 'Application deleted successfully'}), 200
        
    except Exception as e:
        print(f"🔴 Error deleting application: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Failed to delete application'}), 500