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
        print(f"🔵 Getting saved opportunities for user: {current_user_id}")
        
        # Get all saved records for this student
        saved_records = SavedOpportunity.query.filter_by(
            student_id=current_user_id
        ).order_by(SavedOpportunity.saved_at.desc()).all()
        
        print(f"🔵 Found {len(saved_records)} saved records")
        
        result = []
        for saved in saved_records:
            # Get the opportunity directly from the database using opportunity_id
            opp = Opportunity.query.get(saved.opportunity_id)
            
            if opp:
                result.append({
                    'id': opp.id,
                    'title': opp.title,
                    'company_name': opp.company_name,
                    'type': opp.type,
                    'location': opp.location,
                    'stipend': opp.stipend,
                    'deadline': opp.deadline.isoformat() if opp.deadline else None,
                    'saved_at': saved.saved_at.isoformat() if saved.saved_at else None
                })
            else:
                print(f"⚠️ Opportunity {saved.opportunity_id} not found")
        
        return jsonify({
            'saved': result,
            'total': len(result)
        }), 200
        
    except Exception as e:
        print(f"🔴 Error fetching saved: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@saved_bp.route('/saved/<int:opportunity_id>', methods=['POST'])
@jwt_required()
def save_opportunity(opportunity_id):
    """Save an opportunity"""
    try:
        current_user_id = get_jwt_identity()
        print(f"🔵 Saving opportunity {opportunity_id} for user {current_user_id}")
        
        # Check if opportunity exists
        opportunity = Opportunity.query.get(opportunity_id)
        if not opportunity:
            print(f"🔴 Opportunity {opportunity_id} not found")
            return jsonify({'error': 'Opportunity not found'}), 404
        
        # Check if already saved
        existing = SavedOpportunity.query.filter_by(
            student_id=current_user_id,
            opportunity_id=opportunity_id
        ).first()
        
        if existing:
            print(f"🔵 Already saved")
            return jsonify({'message': 'Already saved', 'saved': True}), 200
        
        # Create saved record
        saved = SavedOpportunity(
            student_id=current_user_id,
            opportunity_id=opportunity_id,
            saved_at=datetime.utcnow()
        )
        db.session.add(saved)
        db.session.commit()
        
        print(f"✅ Saved opportunity {opportunity_id}")
        return jsonify({
            'message': 'Opportunity saved successfully',
            'saved': True
        }), 201
        
    except Exception as e:
        print(f"🔴 Error saving: {str(e)}")
        import traceback
        traceback.print_exc()
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@saved_bp.route('/saved/<int:opportunity_id>', methods=['DELETE'])
@jwt_required()
def unsave_opportunity(opportunity_id):
    """Remove a saved opportunity"""
    try:
        current_user_id = get_jwt_identity()
        print(f"🔵 Unsaving opportunity {opportunity_id} for user {current_user_id}")
        
        saved = SavedOpportunity.query.filter_by(
            student_id=current_user_id,
            opportunity_id=opportunity_id
        ).first()
        
        if not saved:
            print(f"🔴 Opportunity {opportunity_id} not saved")
            return jsonify({'error': 'Opportunity not saved'}), 404
        
        db.session.delete(saved)
        db.session.commit()
        
        print(f"✅ Unsaved opportunity {opportunity_id}")
        return jsonify({
            'message': 'Opportunity removed from saved',
            'saved': False
        }), 200
        
    except Exception as e:
        print(f"🔴 Error unsaving: {str(e)}")
        import traceback
        traceback.print_exc()
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@saved_bp.route('/saved/check/<int:opportunity_id>', methods=['GET'])
@jwt_required()
def check_saved(opportunity_id):
    """Check if an opportunity is saved by current user"""
    try:
        current_user_id = get_jwt_identity()
        print(f"🔵 Checking if opportunity {opportunity_id} is saved by user {current_user_id}")
        
        saved = SavedOpportunity.query.filter_by(
            student_id=current_user_id,
            opportunity_id=opportunity_id
        ).first()
        
        is_saved = saved is not None
        print(f"🔵 Is saved: {is_saved}")
        return jsonify({'saved': is_saved}), 200
        
    except Exception as e:
        print(f"🔴 Error checking saved: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500