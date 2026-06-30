# utils/email.py

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from flask_mail import Mail, Message

mail = Mail()

def send_otp_email(to_email, otp_code, full_name):
    """Send OTP verification email to user"""
    try:
        from utils.email_templates import get_otp_email_template
        
        # Get email config
        config = {
            'host': os.getenv('MAIL_SERVER', 'smtp.gmail.com'),
            'port': int(os.getenv('MAIL_PORT', 587)),
            'username': os.getenv('MAIL_USERNAME'),
            'password': os.getenv('MAIL_PASSWORD'),
            'from_email': os.getenv('MAIL_DEFAULT_SENDER', os.getenv('MAIL_USERNAME')),
            'use_tls': os.getenv('MAIL_USE_TLS', 'True') == 'True'
        }
        
        if not config['username'] or not config['password']:
            print("⚠️ Email credentials not configured.")
            return False
        
        print(f"📧 Sending OTP to: {to_email}")
        
        # Create message
        msg = MIMEMultipart()
        msg['From'] = config['from_email']
        msg['To'] = to_email
        msg['Subject'] = "[InternLink] Verify Your Account - OTP Code"
        
        # Get email body
        html_body = get_otp_email_template(otp_code, full_name)
        msg.attach(MIMEText(html_body, 'html'))
        
        # Send email
        server = smtplib.SMTP(config['host'], config['port'])
        server.ehlo()
        if config['use_tls']:
            server.starttls()
            server.ehlo()
        
        server.login(config['username'], config['password'])
        server.send_message(msg)
        server.quit()
        
        print(f"✅ OTP email sent to {to_email}")
        return True
        
    except Exception as e:
        print(f"❌ Error sending OTP email: {str(e)}")
        import traceback
        traceback.print_exc()
        return False