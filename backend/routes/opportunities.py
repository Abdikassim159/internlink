from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Opportunity, User
from datetime import datetime
import json
from services.notification_service import NotificationService  # 👈 ADD THIS IMPORT

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
        
        # 🔔 NOTIFY ALL STUDENTS ABOUT NEW OPPORTUNITY
        try:
            notifications = NotificationService.create_opportunity_notification(
                opportunity_title=opportunity.title,
                opportunity_id=opportunity.id,
                company_name=opportunity.company_name
            )
            print(f"✅ Sent {len(notifications)} notifications to students about new opportunity")
        except Exception as notif_error:
            print(f"⚠️ Failed to send opportunity notifications: {str(notif_error)}")
            # Don't fail the opportunity creation if notification fails
        
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
        
        # Store old values for notification
        old_title = opportunity.title
        old_company = opportunity.company_name
        old_is_active = opportunity.is_active
        
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
        
        # 🔔 NOTIFY STUDENTS IF OPPORTUNITY WAS REACTIVATED
        if old_is_active == False and opportunity.is_active == True:
            try:
                notifications = NotificationService.create_opportunity_notification(
                    opportunity_title=opportunity.title,
                    opportunity_id=opportunity.id,
                    company_name=opportunity.company_name
                )
                print(f"✅ Sent {len(notifications)} notifications about reactivated opportunity")
            except Exception as notif_error:
                print(f"⚠️ Failed to send reactivation notifications: {str(notif_error)}")
        
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
        
        # Store data for notification
        opportunity_title = opportunity.title
        opportunity_company = opportunity.company_name
        
        db.session.delete(opportunity)
        db.session.commit()
        
        # 🔔 NOTIFY STUDENTS ABOUT OPPORTUNITY CLOSING (Optional)
        # You could notify students that this opportunity is no longer available
        # Commented out to avoid spamming - you can enable if needed
        # try:
        #     NotificationService.create_notification_for_all_students(
        #         type='reminder',
        #         title=f'Opportunity Closed: {opportunity_title}',
        #         message=f'The opportunity "{opportunity_title}" at {opportunity_company} has been closed.',
        #         link='/opportunities'
        #     )
        #     print(f"✅ Sent notifications about closed opportunity")
        # except Exception as notif_error:
        #     print(f"⚠️ Failed to send closure notifications: {str(notif_error)}")
        
        return jsonify({'message': 'Opportunity deleted successfully'}), 200
        
    except Exception as e:
        print(f"Error deleting opportunity: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Failed to delete opportunity'}), 500


# ===== ADMIN/EMPLOYER: GET OPPORTUNITY STATS =====
@opportunities_bp.route('/opportunities/stats', methods=['GET'])
@jwt_required()
def get_opportunity_stats():
    """Get opportunity statistics"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if user.role not in ['admin', 'employer']:
            return jsonify({'error': 'Permission denied'}), 403
        
        # Count opportunities
        total = Opportunity.query.count()
        active = Opportunity.query.filter_by(is_active=True).count()
        inactive = Opportunity.query.filter_by(is_active=False).count()
        
        # Count by type
        types = db.session.query(
            Opportunity.type, 
            db.func.count(Opportunity.id)
        ).group_by(Opportunity.type).all()
        
        type_counts = {t: count for t, count in types}
        
        # Opportunities created this month
        now = datetime.utcnow()
        month_start = datetime(now.year, now.month, 1)
        this_month = Opportunity.query.filter(
            Opportunity.created_at >= month_start
        ).count()
        
        return jsonify({
            'total': total,
            'active': active,
            'inactive': inactive,
            'by_type': type_counts,
            'created_this_month': this_month
        }), 200
        
    except Exception as e:
        print(f"Error fetching opportunity stats: {str(e)}")
        return jsonify({'error': 'Failed to fetch stats'}), 500


# ===== GET OPPORTUNITIES BY TYPE =====
@opportunities_bp.route('/opportunities/type/<string:type>', methods=['GET'])
def get_opportunities_by_type(type):
    """Get opportunities by type (Internship, Attachment, etc.)"""
    try:
        opportunities = Opportunity.query.filter_by(
            type=type,
            is_active=True
        ).order_by(Opportunity.created_at.desc()).all()
        
        return jsonify({
            'opportunities': [opp.to_dict() for opp in opportunities],
            'total': len(opportunities),
            'type': type
        }), 200
    except Exception as e:
        print(f"Error fetching opportunities by type: {str(e)}")
        return jsonify({'error': 'Failed to fetch opportunities'}), 500


# ===== SEARCH OPPORTUNITIES =====
@opportunities_bp.route('/opportunities/search', methods=['GET'])
def search_opportunities():
    """Search opportunities by title, company, or location"""
    try:
        query = request.args.get('q', '')
        location = request.args.get('location', '')
        type_filter = request.args.get('type', '')
        
        opportunities_query = Opportunity.query.filter_by(is_active=True)
        
        if query:
            opportunities_query = opportunities_query.filter(
                db.or_(
                    Opportunity.title.ilike(f'%{query}%'),
                    Opportunity.company_name.ilike(f'%{query}%'),
                    Opportunity.description.ilike(f'%{query}%')
                )
            )
        
        if location:
            opportunities_query = opportunities_query.filter(
                Opportunity.location.ilike(f'%{location}%')
            )
        
        if type_filter:
            opportunities_query = opportunities_query.filter(
                Opportunity.type == type_filter
            )
        
        opportunities = opportunities_query.order_by(
            Opportunity.created_at.desc()
        ).all()
        
        return jsonify({
            'opportunities': [opp.to_dict() for opp in opportunities],
            'total': len(opportunities),
            'filters': {
                'query': query,
                'location': location,
                'type': type_filter
            }
        }), 200
    except Exception as e:
        print(f"Error searching opportunities: {str(e)}")
        return jsonify({'error': 'Failed to search opportunities'}), 500