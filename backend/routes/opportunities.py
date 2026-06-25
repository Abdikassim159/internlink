
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Opportunity, User
from datetime import datetime
import json

opportunities_bp = Blueprint('opportunities', __name__)

@opportunities_bp.route('/opportunities', methods=['GET'])
def get_opportunities():
    """Get all active opportunities"""
    try:
        opportunities = Opportunity.query.filter_by(is_active=True).order_by(
            Opportunity.created_at.desc()
        ).all()
        
        return jsonify({
            'opportunities': [opp.to_dict() for opp in opportunities],
            'total': len(opportunities)
        }), 200
    except Exception as e:
        print(f"Error fetching opportunities: {str(e)}")
        return jsonify({'error': 'Failed to fetch opportunities'}), 500


@opportunities_bp.route('/opportunities/<int:id>', methods=['GET'])
def get_opportunity(id):
    """Get a single opportunity by ID"""
    try:
        opportunity = Opportunity.query.get_or_404(id)
        return jsonify(opportunity.to_dict()), 200
    except Exception as e:
        print(f"Error fetching opportunity: {str(e)}")
        return jsonify({'error': 'Opportunity not found'}), 404


@opportunities_bp.route('/opportunities', methods=['POST'])
@jwt_required()
def create_opportunity():
    """Create a new opportunity (Admin/Employer only)"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        if user.role not in ['admin', 'employer']:
            return jsonify({'error': 'Permission denied. Admin or Employer only.'}), 403
        
        data = request.get_json()
        print(f"Creating opportunity with data: {data}")
        
        # Validate required fields
        required_fields = ['title', 'company_name', 'type', 'location', 'deadline', 'description']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Parse deadline
        try:
            deadline = datetime.fromisoformat(data['deadline'])
        except ValueError:
            return jsonify({'error': 'Invalid deadline format. Use YYYY-MM-DDTHH:MM:SS'}), 400
        
        # Get skills
        required_skills = data.get('required_skills', [])
        if isinstance(required_skills, str):
            required_skills = [s.strip() for s in required_skills.split(',') if s.strip()]
        
        # Create opportunity
        opportunity = Opportunity(
            employer_id=current_user_id,
            title=data['title'],
            company_name=data['company_name'],
            type=data['type'],
            location=data['location'],
            duration=data.get('duration', ''),
            stipend=data.get('stipend', ''),
            deadline=deadline,
            description=data['description'],
            requirements=data.get('requirements', ''),
            required_skills=json.dumps(required_skills),
            is_active=True
        )
        
        db.session.add(opportunity)
        db.session.commit()
        
        print(f"✅ Opportunity created: {opportunity.id} - {opportunity.title}")
        
        return jsonify({
            'message': 'Opportunity created successfully',
            'opportunity': opportunity.to_dict()
        }), 201
        
    except Exception as e:
        print(f"❌ Error creating opportunity: {str(e)}")
        db.session.rollback()
        return jsonify({'error': f'Failed to create opportunity: {str(e)}'}), 500


@opportunities_bp.route('/opportunities/<int:id>', methods=['PUT'])
@jwt_required()
def update_opportunity(id):
    """Update an opportunity"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        opportunity = Opportunity.query.get_or_404(id)
        
        # Check ownership
        if opportunity.employer_id != current_user_id and user.role != 'admin':
            return jsonify({'error': 'Permission denied'}), 403
        
        data = request.get_json()
        
        # Update fields
        if 'title' in data:
            opportunity.title = data['title']
        if 'description' in data:
            opportunity.description = data['description']
        if 'location' in data:
            opportunity.location = data['location']
        if 'type' in data:
            opportunity.type = data['type']
        if 'stipend' in data:
            opportunity.stipend = data['stipend']
        if 'duration' in data:
            opportunity.duration = data['duration']
        if 'deadline' in data:
            opportunity.deadline = datetime.fromisoformat(data['deadline'])
        if 'is_active' in data:
            opportunity.is_active = data['is_active']
        if 'required_skills' in data:
            skills = data['required_skills']
            if isinstance(skills, str):
                skills = [s.strip() for s in skills.split(',') if s.strip()]
            opportunity.required_skills = json.dumps(skills)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Opportunity updated successfully',
            'opportunity': opportunity.to_dict()
        }), 200
        
    except Exception as e:
        print(f"Error updating opportunity: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Failed to update opportunity'}), 500


@opportunities_bp.route('/opportunities/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_opportunity(id):
    """Delete an opportunity"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        opportunity = Opportunity.query.get_or_404(id)
        
        # Check ownership
        if opportunity.employer_id != current_user_id and user.role != 'admin':
            return jsonify({'error': 'Permission denied'}), 403
        
        db.session.delete(opportunity)
        db.session.commit()
        
        return jsonify({'message': 'Opportunity deleted successfully'}), 200
        
    except Exception as e:
        print(f"Error deleting opportunity: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Failed to delete opportunity'}), 500
