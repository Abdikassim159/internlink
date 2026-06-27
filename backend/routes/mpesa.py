
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Application, User, Opportunity
from utils.mpesa import mpesa
import json
import os

mpesa_bp = Blueprint('mpesa', __name__)

@mpesa_bp.route('/mpesa/pay', methods=['POST'])
@jwt_required()
def initiate_payment():
    """Initiate M-Pesa payment for an application"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        print(f"📥 Payment request received: {data}")
        print(f"👤 User ID: {current_user_id}")
        
        application_id = data.get('application_id')
        phone_number = data.get('phone_number')
        
        if not application_id or not phone_number:
            return jsonify({'error': 'Application ID and phone number required'}), 400
        
        # Get application
        application = Application.query.get(application_id)
        if not application:
            return jsonify({'error': 'Application not found'}), 404
        
        # Check if user owns this application
        if application.student_id != current_user_id:
            return jsonify({'error': 'Permission denied'}), 403
        
        # Check if application is pending
        if application.status != 'pending':
            return jsonify({'error': 'Application is not pending payment'}), 400
        
        # Get amount from environment
        amount = int(os.getenv('MPESA_AMOUNT', 350))
        
        # Get opportunity title for reference
        opportunity = Opportunity.query.get(application.opportunity_id)
        account_reference = f"APP{application.id}"
        transaction_desc = f"Payment for {opportunity.title if opportunity else 'Application'}"
        
        print(f"💰 Amount: {amount}")
        print(f"📱 Phone: {phone_number}")
        print(f"📝 Reference: {account_reference}")
        
        # Initiate STK Push
        result = mpesa.stk_push(
            phone_number=phone_number,
            amount=amount,
            account_reference=account_reference,
            transaction_desc=transaction_desc
        )
        
        print(f"📤 STK Push result: {result}")
        
        if result.get('error'):
            return jsonify({'error': result['error']}), 500
        
        # Store checkout request ID in application
        checkout_request_id = result.get('checkout_request_id')
        if checkout_request_id:
            application.admin_notes = json.dumps({
                'checkout_request_id': checkout_request_id,
                'phone_number': phone_number,
                'amount': amount,
                'status': 'initiated'
            })
            db.session.commit()
        
        return jsonify({
            'message': 'Payment initiated successfully',
            'checkout_request_id': checkout_request_id,
            'amount': amount,
            'phone_number': phone_number
        }), 200
        
    except Exception as e:
        print(f"❌ Payment initiation error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@mpesa_bp.route('/mpesa/callback', methods=['POST'])
def mpesa_callback():
    """M-Pesa callback URL - receives payment confirmation"""
    try:
        data = request.get_json()
        print(f"📥 M-Pesa callback received: {data}")
        
        # Extract payment details
        body = data.get('Body', {})
        stk_callback = body.get('stkCallback', {})
        
        result_code = stk_callback.get('ResultCode')
        result_desc = stk_callback.get('ResultDesc')
        checkout_request_id = stk_callback.get('CheckoutRequestID')
        
        # Find application with this checkout request
        applications = Application.query.all()
        target_app = None
        
        for app in applications:
            if app.admin_notes:
                try:
                    notes = json.loads(app.admin_notes)
                    if notes.get('checkout_request_id') == checkout_request_id:
                        target_app = app
                        break
                except:
                    pass
        
        if target_app:
            if result_code == 0:  # Success
                target_app.status = 'paid'
                target_app.admin_notes = json.dumps({
                    'payment_status': 'success',
                    'result_desc': result_desc,
                    'checkout_request_id': checkout_request_id
                })
                db.session.commit()
                print(f"✅ Payment successful for application {target_app.id}")
            else:
                target_app.admin_notes = json.dumps({
                    'payment_status': 'failed',
                    'result_desc': result_desc,
                    'checkout_request_id': checkout_request_id
                })
                db.session.commit()
                print(f"❌ Payment failed for application {target_app.id}: {result_desc}")
        
        return jsonify({'ResultCode': 0, 'ResultDesc': 'Success'}), 200
        
    except Exception as e:
        print(f"Callback error: {str(e)}")
        return jsonify({'ResultCode': 1, 'ResultDesc': 'Failed'}), 500


@mpesa_bp.route('/mpesa/status/<int:application_id>', methods=['GET'])
@jwt_required()
def get_payment_status(application_id):
    """Get payment status for an application"""
    try:
        current_user_id = get_jwt_identity()
        application = Application.query.get(application_id)
        
        if not application:
            return jsonify({'error': 'Application not found'}), 404
        
        if application.student_id != current_user_id:
            return jsonify({'error': 'Permission denied'}), 403
        
        # Check if there's a checkout request ID
        if application.admin_notes:
            try:
                notes = json.loads(application.admin_notes)
                checkout_request_id = notes.get('checkout_request_id')
                
                if checkout_request_id:
                    # Query status from M-Pesa
                    result = mpesa.query_status(checkout_request_id)
                    return jsonify({
                        'application_id': application.id,
                        'status': application.status,
                        'payment_status': notes.get('payment_status', 'unknown'),
                        'checkout_request_id': checkout_request_id,
                        'mpesa_response': result.get('data', {})
                    }), 200
            except:
                pass
        
        return jsonify({
            'application_id': application.id,
            'status': application.status,
            'payment_status': 'not_initiated'
        }), 200
        
    except Exception as e:
        print(f"Status check error: {str(e)}")
        return jsonify({'error': 'Failed to get payment status'}), 500
