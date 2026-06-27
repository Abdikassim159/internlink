from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, SavedOpportunity, Opportunity
from datetime import datetime

saved_bp = Blueprint('saved', __name__)

@saved_bp.route('/saved', methods=['GET'])
@jwt_required()
def get_saved_opportunities():
    """Get all saved opportunities for current user"""
    try:
        current_user_id = get_jwt_identity()
        
        saved = SavedOpportunity.query.filter_by(
            student_id=current_user_id
        ).order_by(SavedOpportunity.saved_at.desc()).all()
        
        result = []
        for item in saved:
            if item.opportunity:
                opp = item.opportunity
                result.append({
                    'id': opp.id,
                    'title': opp.title,
                    'company_name': opp.company_name,
                    'type': opp.type,
                    'location': opp.location,
                    'stipend': opp.stipend,
                    'deadline': opp.deadline.isoformat() if opp.deadline else None,
                    'saved_at': item.saved_at.isoformat() if item.saved_at else None
                })
        
        return jsonify({
            'saved': result,
            'total': len(result)
        }), 200
        
    except Exception as e:
        print(f"Error fetching saved: {str(e)}")
        return jsonify({'error': str(e)}), 500


@saved_bp.route('/saved/<int:opportunity_id>', methods=['POST'])
@jwt_required()
def save_opportunity(opportunity_id):
    """Save an opportunity"""
    try:
        current_user_id = get_jwt_identity()
        
        # Check if opportunity exists
        opportunity = Opportunity.query.get(opportunity_id)
        if not opportunity:
            return jsonify({'error': 'Opportunity not found'}), 404
        
        # Check if already saved
        existing = SavedOpportunity.query.filter_by(
            student_id=current_user_id,
            opportunity_id=opportunity_id
        ).first()
        
        if existing:
            return jsonify({'message': 'Already saved', 'saved': True}), 200
        
        # Create saved record
        saved = SavedOpportunity(
            student_id=current_user_id,
            opportunity_id=opportunity_id,
            saved_at=datetime.utcnow()
        )
        db.session.add(saved)
        db.session.commit()
        
        return jsonify({
            'message': 'Opportunity saved successfully',
            'saved': True
        }), 201
        
    except Exception as e:
        print(f"Error saving: {str(e)}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@saved_bp.route('/saved/<int:opportunity_id>', methods=['DELETE'])
@jwt_required()
def unsave_opportunity(opportunity_id):
    """Remove a saved opportunity"""
    try:
        current_user_id = get_jwt_identity()
        
        saved = SavedOpportunity.query.filter_by(
            student_id=current_user_id,
            opportunity_id=opportunity_id
        ).first()
        
        if not saved:
            return jsonify({'error': 'Opportunity not saved'}), 404
        
        db.session.delete(saved)
        db.session.commit()
        
        return jsonify({
            'message': 'Opportunity removed from saved',
            'saved': False
        }), 200
        
    except Exception as e:
        print(f"Error unsaving: {str(e)}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@saved_bp.route('/saved/check/<int:opportunity_id>', methods=['GET'])
@jwt_required()
def check_saved(opportunity_id):
    """Check if an opportunity is saved by current user"""
    try:
        current_user_id = get_jwt_identity()
        
        saved = SavedOpportunity.query.filter_by(
            student_id=current_user_id,
            opportunity_id=opportunity_id
        ).first()
        
        return jsonify({'saved': saved is not None}), 200
        
    except Exception as e:
        print(f"Error checking saved: {str(e)}")
        return jsonify({'error': str(e)}), 500