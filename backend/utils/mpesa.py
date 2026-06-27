
import requests
import base64
import json
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

class MpesaPayment:
    def __init__(self):
        self.consumer_key = os.getenv('MPESA_CONSUMER_KEY')
        self.consumer_secret = os.getenv('MPESA_CONSUMER_SECRET')
        self.passkey = os.getenv('MPESA_PASSKEY')
        self.shortcode = os.getenv('MPESA_SHORTCODE', '174379')
        self.environment = os.getenv('MPESA_ENVIRONMENT', 'sandbox')
        
        # API URLs
        if self.environment == 'sandbox':
            self.base_url = 'https://sandbox.safaricom.co.ke'
        else:
            self.base_url = 'https://api.safaricom.co.ke'
        
        self.access_token = None
    
    def get_access_token(self):
        """Get OAuth access token from M-Pesa"""
        try:
            url = f"{self.base_url}/oauth/v1/generate?grant_type=client_credentials"
            
            credentials = f"{self.consumer_key}:{self.consumer_secret}"
            encoded_credentials = base64.b64encode(credentials.encode()).decode()
            
            headers = {
                'Authorization': f'Basic {encoded_credentials}'
            }
            
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            
            data = response.json()
            self.access_token = data.get('access_token')
            print(f"✅ M-Pesa access token obtained")
            return self.access_token
            
        except Exception as e:
            print(f"❌ Failed to get M-Pesa token: {str(e)}")
            return None
    
    def stk_push(self, phone_number, amount, account_reference, transaction_desc):
        """Initiate STK Push to customer's phone"""
        try:
            token = self.get_access_token()
            if not token:
                return {'error': 'Failed to get access token'}
            
            # Format phone number
            if phone_number.startswith('0'):
                phone_number = '254' + phone_number[1:]
            elif phone_number.startswith('+'):
                phone_number = phone_number[1:]
            
            timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
            
            password_str = f"{self.shortcode}{self.passkey}{timestamp}"
            password = base64.b64encode(password_str.encode()).decode()
            
            url = f"{self.base_url}/mpesa/stkpush/v1/processrequest"
            
            payload = {
                'BusinessShortCode': self.shortcode,
                'Password': password,
                'Timestamp': timestamp,
                'TransactionType': 'CustomerPayBillOnline',
                'Amount': str(amount),
                'PartyA': phone_number,
                'PartyB': self.shortcode,
                'PhoneNumber': phone_number,
                'CallBackURL': os.getenv('MPESA_CALLBACK_URL', 'https://your-domain.com/api/mpesa/callback'),
                'AccountReference': account_reference[:12],
                'TransactionDesc': transaction_desc[:13]
            }
            
            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            
            print(f"📤 Sending STK Push to {phone_number}")
            print(f"💰 Amount: KES {amount}")
            
            response = requests.post(url, json=payload, headers=headers)
            response.raise_for_status()
            
            result = response.json()
            print(f"✅ STK Push response: {result}")
            
            return {
                'success': True,
                'data': result,
                'checkout_request_id': result.get('CheckoutRequestID')
            }
            
        except Exception as e:
            print(f"❌ STK Push failed: {str(e)}")
            return {'error': str(e)}
    
    def query_status(self, checkout_request_id):
        """Query the status of an STK Push transaction"""
        try:
            token = self.get_access_token()
            if not token:
                return {'error': 'Failed to get access token'}
            
            timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
            password_str = f"{self.shortcode}{self.passkey}{timestamp}"
            password = base64.b64encode(password_str.encode()).decode()
            
            url = f"{self.base_url}/mpesa/stkpushquery/v1/query"
            
            payload = {
                'BusinessShortCode': self.shortcode,
                'Password': password,
                'Timestamp': timestamp,
                'CheckoutRequestID': checkout_request_id
            }
            
            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            
            response = requests.post(url, json=payload, headers=headers)
            response.raise_for_status()
            
            result = response.json()
            return {
                'success': True,
                'data': result
            }
            
        except Exception as e:
            print(f"❌ Query failed: {str(e)}")
            return {'error': str(e)}

# Create global instance
mpesa = MpesaPayment()
