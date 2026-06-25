
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Opportunity, EmployerProfile
from sqlalchemy import func

companies_bp = Blueprint('companies', __name__)

@companies_bp.route('/companies', methods=['GET'])
def get_companies():
    """Get all companies with their job counts"""
    try:
        # Get all employers (users with role='employer')
        employers = User.query.filter_by(role='employer').all()
        
        result = []
        for employer in employers:
            # Get employer profile
            profile = EmployerProfile.query.filter_by(user_id=employer.id).first()
            
            # Count active opportunities for this employer
            job_count = Opportunity.query.filter_by(
                employer_id=employer.id,
                is_active=True
            ).count()
            
            result.append({
                'id': employer.id,
                'name': profile.company_name if profile else employer.full_name,
                'industry': profile.industry if profile else 'Not specified',
                'location': profile.location if profile else 'Not specified',
                'description': profile.company_description if profile else '',
                'logo_url': profile.logo_url if profile else None,
                'openings': job_count,
                'is_verified': profile.verified if profile else False,
                'created_at': employer.created_at.isoformat() if employer.created_at else None
            })
        
        # Sort by job count (highest first)
        result.sort(key=lambda x: x['openings'], reverse=True)
        
        return jsonify({
            'companies': result,
            'total': len(result)
        }), 200
        
    except Exception as e:
        print(f"Error fetching companies: {str(e)}")
        return jsonify({'error': 'Failed to fetch companies'}), 500


@companies_bp.route('/companies/<int:id>', methods=['GET'])
def get_company(id):
    """Get single company details"""
    try:
        employer = User.query.filter_by(id=id, role='employer').first()
        if not employer:
            return jsonify({'error': 'Company not found'}), 404
        
        profile = EmployerProfile.query.filter_by(user_id=employer.id).first()
        
        # Get opportunities for this company
        opportunities = Opportunity.query.filter_by(
            employer_id=employer.id,
            is_active=True
        ).all()
        
        return jsonify({
            'id': employer.id,
            'name': profile.company_name if profile else employer.full_name,
            'industry': profile.industry if profile else 'Not specified',
            'location': profile.location if profile else 'Not specified',
            'description': profile.company_description if profile else '',
            'logo_url': profile.logo_url if profile else None,
            'is_verified': profile.verified if profile else False,
            'openings': len(opportunities),
            'opportunities': [opp.to_dict() for opp in opportunities]
        }), 200
        
    except Exception as e:
        print(f"Error fetching company: {str(e)}")
        return jsonify({'error': 'Failed to fetch company'}), 500
