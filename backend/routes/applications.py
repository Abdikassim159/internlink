
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Application, Opportunity, User
from datetime import datetime

applications_bp = Blueprint('applications', __name__)

@applications_bp.route('/applications', methods=['POST'])
@jwt_required()
def submit_application():
    """Submit a new application"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        print(f"Received application data: {data}")
        print(f"User ID: {current_user_id}")
        
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
        
        print(f"Application created with ID: {application.id}")
        
        return jsonify({
            'message': 'Application submitted successfully',
            'application_id': application.id,
            'status': application.status
        }), 201
        
    except Exception as e:
        print(f"Error submitting application: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Failed to submit application'}), 500


@applications_bp.route('/applications', methods=['GET'])
@jwt_required()
def get_all_applications():
    """Get all applications (Admin only)"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        # Check if user is admin
        if user.role != 'admin':
            return jsonify({'error': 'Permission denied. Admin only.'}), 403
        
        applications = Application.query.order_by(Application.applied_at.desc()).all()
        
        result = []
        for app in applications:
            app_dict = app.to_dict()
            # Add opportunity details
            if app.opportunity:
                app_dict['opportunity'] = {
                    'id': app.opportunity.id,
                    'title': app.opportunity.title,
                    'company_name': app.opportunity.company_name
                }
            result.append(app_dict)
        
        return jsonify({
            'applications': result,
            'total': len(result)
        }), 200
        
    except Exception as e:
        print(f"Error fetching applications: {str(e)}")
        return jsonify({'error': 'Failed to fetch applications'}), 500


@applications_bp.route('/applications/my', methods=['GET'])
@jwt_required()
def get_my_applications():
    """Get current user's applications"""
    try:
        current_user_id = get_jwt_identity()
        
        applications = Application.query.filter_by(
            student_id=current_user_id
        ).order_by(Application.applied_at.desc()).all()
        
        result = []
        for app in applications:
            app_dict = app.to_dict()
            # Add opportunity details
            if app.opportunity:
                app_dict['opportunity'] = {
                    'id': app.opportunity.id,
                    'title': app.opportunity.title,
                    'company_name': app.opportunity.company_name
                }
            result.append(app_dict)
        
        return jsonify({
            'applications': result,
            'total': len(result)
        }), 200
        
    except Exception as e:
        print(f"Error fetching applications: {str(e)}")
        return jsonify({'error': 'Failed to fetch applications'}), 500


@applications_bp.route('/applications/<int:id>', methods=['PUT'])
@jwt_required()
def update_application_status(id):
    """Update application status (Admin only)"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        # Check if user is admin
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
        print(f"Error updating application: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Failed to update application'}), 500
