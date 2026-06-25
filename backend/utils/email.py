
from flask_mail import Mail, Message
from flask import current_app
import os
from itsdangerous import URLSafeTimedSerializer
from threading import Thread

mail = Mail()

def send_async_email(app, msg):
    with app.app_context():
        try:
            mail.send(msg)
            print(f"✅ Email sent successfully to {msg.recipients}")
        except Exception as e:
            print(f"❌ Email failed: {str(e)}")

def send_email(subject, recipients, html_body, text_body=None):
    """
    Send email asynchronously
    """
    app = current_app._get_current_object()
    
    # ✅ Get sender email from env
    sender_email = os.getenv('MAIL_DEFAULT_SENDER', 'updikazzimarale@gmail.com')
    
    # ✅ Professional sender format with bold name
    # This displays as "InternLink" in the inbox
    formatted_sender = f"InternLink <{sender_email}>"
    
    msg = Message(
        subject=subject,
        recipients=recipients,
        html=html_body,
        body=text_body,
        sender=formatted_sender
    )
    
    # Send email in background thread
    Thread(target=send_async_email, args=(app, msg)).start()

def generate_verification_token(email):
    """
    Generate a secure verification token
    """
    serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    return serializer.dumps(email, salt='email-verification')

def verify_token(token, expiration=3600):
    """
    Verify the token and return the email if valid
    """
    serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    try:
        email = serializer.loads(
            token,
            salt='email-verification',
            max_age=expiration
        )
        return email
    except:
        return None

def send_verification_email(user_email, user_name, token):
    """
    Send verification email to user
    """
    verification_url = f"{os.getenv('BASE_URL', 'http://localhost:5173')}/verify-email/{token}"
    
    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your InternLink Account</title>
    </head>
    <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; padding: 45px; box-shadow: 0 8px 30px rgba(0,0,0,0.08);">
            
            <!-- Header -->
            <div style="text-align: center; border-bottom: 2px solid #e8edf5; padding-bottom: 25px;">
                <div style="font-size: 32px; font-weight: 700; color: #1E3A8A; letter-spacing: -0.5px;">
                    Intern<span style="color: #2563EB;">Link</span>
                </div>
                <p style="color: #6B7280; font-size: 15px; margin-top: 8px; font-weight: 400;">
                    Verify Your Email Address
                </p>
            </div>
            
            <!-- Content -->
            <div style="padding: 35px 0;">
                <h2 style="color: #1E3A8A; font-size: 24px; font-weight: 600; margin: 0 0 15px 0;">
                    Welcome to InternLink, {user_name}! 🎉
                </h2>
                
                <p style="color: #4B5563; font-size: 16px; line-height: 1.7; margin: 0 0 20px 0;">
                    Thank you for registering with <strong style="color: #1E3A8A;">InternLink</strong>. 
                    Please verify your email address to get started with your journey.
                </p>
                
                <!-- Why Verify -->
                <div style="background: #EFF6FF; padding: 18px 20px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #2563EB;">
                    <p style="margin: 0; color: #1E40AF; font-size: 14px; font-weight: 500;">
                        🔒 <strong>Why verify?</strong> Verifying your email helps us keep your account secure and ensures you receive important updates about your applications.
                    </p>
                </div>
                
                <!-- Button -->
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{verification_url}" style="display: inline-block; padding: 16px 48px; background: linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%); color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);">
                        Verify Email Address
                    </a>
                </div>
                
                <!-- Link -->
                <p style="color: #6B7280; font-size: 14px; text-align: center; margin: 20px 0 0 0;">
                    Or copy and paste this link in your browser:
                </p>
                <p style="color: #2563EB; font-size: 14px; text-align: center; word-break: break-all; background: #F8FAFC; padding: 12px; border-radius: 8px; margin: 10px 0 0 0;">
                    {verification_url}
                </p>
                
                <p style="color: #9CA3AF; font-size: 14px; text-align: center; margin: 20px 0 0 0;">
                    ⏰ This link expires in <strong>1 hour</strong>.
                </p>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; color: #6B7280; font-size: 14px; border-top: 2px solid #e8edf5; padding-top: 25px;">
                <p style="margin: 0; font-weight: 500; color: #1E3A8A;">
                    © 2026 <strong>InternLink</strong> by FutureSpace
                </p>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: #9CA3AF;">
                    If you didn't create an account, you can safely ignore this email.
                </p>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: #9CA3AF;">
                    Need help? Contact us at <a href="mailto:support@internlink.com" style="color: #2563EB; text-decoration: none;">support@internlink.com</a>
                </p>
            </div>
        </div>
    </body>
    </html>
    """
    
    send_email(
        subject="🔐 Verify Your InternLink Account",
        recipients=[user_email],
        html_body=html_body,
        text_body=f"Please verify your email by clicking: {verification_url}"
    )
