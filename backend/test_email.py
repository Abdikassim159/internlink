# test_email.py

import os
from dotenv import load_dotenv
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

load_dotenv()

def test_email():
    # Get credentials
    username = os.getenv('MAIL_USERNAME')
    password = os.getenv('MAIL_PASSWORD')
    
    print(f"📧 Testing email with: {username}")
    print(f"📧 Password length: {len(password) if password else 0}")
    
    try:
        # Create message
        msg = MIMEMultipart()
        msg['From'] = username
        msg['To'] = username  # Send to yourself for testing
        msg['Subject'] = "Test Email from InternLink"
        
        body = """
        <html>
        <body>
            <h2>Test Email</h2>
            <p>This is a test email from InternLink.</p>
            <p>If you received this, your email configuration is working!</p>
        </body>
        </html>
        """
        
        msg.attach(MIMEText(body, 'html'))
        
        # Send email
        print("🔄 Connecting to SMTP server...")
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.ehlo()
        server.starttls()
        server.ehlo()
        
        print("🔄 Logging in...")
        server.login(username, password)
        
        print("🔄 Sending email...")
        server.send_message(msg)
        server.quit()
        
        print("✅ Test email sent successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    test_email()