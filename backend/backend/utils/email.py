from flask_mail import Mail, Message
from flask import current_app
import os
from itsdangerous import URLSafeTimedSerializer
from threading import Thread

mail = Mail()

def send_async_email(app, msg):
    with app.app_context():
        mail.send(msg)

def send_email(subject, recipients, html_body, text_body=None):
    """
    Send email asynchronously
    """
    app = current_app._get_current_object()
    msg = Message(
        subject=subject,
        recipients=recipients,
        html=html_body,
        body=text_body
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
        <style>
            body {{
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }}
            .container {{
                max-width: 600px;
                margin: 40px auto;
                background: white;
                border-radius: 12px;
                padding: 40px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }}
            .header {{
                text-align: center;
                border-bottom: 2px solid #e5e7eb;
                padding-bottom: 20px;
            }}
            .logo {{
                font-size: 28px;
                font-weight: bold;
                color: #1E3A8A;
            }}
            .logo span {{
                color: #2563EB;
            }}
            .content {{
                padding: 30px 0;
            }}
            .button {{
                display: inline-block;
                padding: 14px 40px;
                background: #1E3A8A;
                color: white;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                margin: 20px 0;
            }}
            .button:hover {{
                background: #1E40AF;
            }}
            .footer {{
                text-align: center;
                color: #6B7280;
                font-size: 14px;
                border-top: 1px solid #e5e7eb;
                padding-top: 20px;
            }}
            .highlight {{
                background: #EFF6FF;
                padding: 15px;
                border-radius: 8px;
                margin: 20px 0;
                border-left: 4px solid #2563EB;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">Intern<span>Link</span></div>
                <p style="color: #6B7280; margin-top: 5px;">Verify Your Email Address</p>
            </div>
            
            <div class="content">
                <h2 style="color: #1E3A8A;">Welcome to InternLink, {user_name}! 🎉</h2>
                
                <p style="color: #4B5563; line-height: 1.6;">
                    Thank you for registering with InternLink. Please verify your email address to get started.
                </p>
                
                <div class="highlight">
                    <p style="margin: 0; color: #1E40AF;">
                        <strong>🔒 Why verify?</strong> Verifying your email helps us keep your account secure and ensures you receive important updates about your applications.
                    </p>
                </div>
                
                <div style="text-align: center;">
                    <a href="{verification_url}" class="button">Verify Email Address</a>
                </div>
                
                <p style="color: #6B7280; font-size: 14px; text-align: center;">
                    Or copy and paste this link in your browser:<br>
                    <span style="color: #2563EB; word-break: break-all;">{verification_url}</span>
                </p>
                
                <p style="color: #9CA3AF; font-size: 14px; text-align: center;">
                    This link expires in 1 hour.
                </p>
            </div>
            
            <div class="footer">
                <p style="margin: 0;">© 2026 InternLink by FutureSpace. All rights reserved.</p>
                <p style="margin: 5px 0 0; font-size: 12px;">
                    If you didn't create an account, you can ignore this email.
                </p>
            </div>
        </div>
    </body>
    </html>
    """
    
    send_email(
        subject="Verify Your InternLink Account",
        recipients=[user_email],
        html_body=html_body
    )
