# utils/email_templates.py

def get_otp_email_template(otp_code, full_name):
    """Generate professional OTP email template"""
    
    return f'''
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your InternLink Account</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f0f0f0; padding: 0; margin: 0; -webkit-font-smoothing: antialiased;">
        
        <!-- MAIN CONTAINER -->
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 40px rgba(0,0,0,0.08);">
            <tr>
                <td style="padding: 0;">
                    
                    <!-- ===== HEADER ===== -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #8B6B4A 0%, #6D4F33 100%);">
                        <tr>
                            <td style="padding: 35px 30px 25px; text-align: center;">
                                <!-- Logo -->
                                <table align="center" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="background: white; border-radius: 12px; padding: 8px 16px;">
                                            <span style="font-size: 22px; font-weight: 800; color: #8B6B4A; letter-spacing: -0.5px;">InternLink</span>
                                        </td>
                                    </tr>
                                </table>
                                <p style="margin: 10px 0 0; color: rgba(255,255,255,0.85); font-size: 12px; letter-spacing: 1.5px; font-weight: 300;">
                                    LINKING TALENT, BUILDING FUTURES
                                </p>
                            </td>
                        </tr>
                    </table>
                    
                    <!-- ===== CONTENT ===== -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="padding: 35px 30px;">
                                
                                <!-- Greeting -->
                                <h2 style="margin: 0 0 15px; color: #1a1a1a; font-size: 24px; font-weight: 700;">
                                    Welcome to InternLink! 👋
                                </h2>
                                
                                <p style="color: #444; font-size: 15px; line-height: 1.8; margin: 0 0 10px;">
                                    Hello <strong>{full_name}</strong>,
                                </p>
                                
                                <p style="color: #444; font-size: 15px; line-height: 1.8; margin: 0 0 20px;">
                                    Thank you for registering with <strong>InternLink</strong>. To complete your registration and start your journey, please verify your email address using the One-Time Password (OTP) below.
                                </p>
                                
                                <!-- Divider -->
                                <div style="height: 1px; background: #e8e8e8; margin: 20px 0;"></div>
                                
                                <!-- OTP CODE - PROFESSIONAL DESIGN -->
                                <div style="background: linear-gradient(135deg, #f8f4f0 0%, #f0ebe5 100%); border-radius: 12px; padding: 30px 20px; text-align: center; border: 2px dashed #8B6B4A;">
                                    <p style="margin: 0 0 8px; color: #666; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; font-weight: 600;">
                                        Your Verification Code
                                    </p>
                                    <div style="background: white; padding: 15px 20px; border-radius: 10px; display: inline-block; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
                                        <span style="font-size: 36px; font-weight: 800; color: #8B6B4A; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                                            {otp_code}
                                        </span>
                                    </div>
                                    <p style="margin: 12px 0 0; color: #888; font-size: 13px;">
                                        ⏰ This code will expire in <strong>10 minutes</strong>
                                    </p>
                                </div>
                                
                                <!-- Divider -->
                                <div style="height: 1px; background: #e8e8e8; margin: 20px 0;"></div>
                                
                                <!-- Instructions -->
                                <p style="color: #555; font-size: 14px; line-height: 1.8; margin: 0 0 10px;">
                                    <strong>How to verify your account:</strong>
                                </p>
                                <ol style="color: #555; font-size: 14px; line-height: 2; margin: 0 0 15px; padding-left: 20px;">
                                    <li>Return to the InternLink registration page</li>
                                    <li>Enter the 6-digit code shown above</li>
                                    <li>Click <strong>"Verify Account"</strong></li>
                                    <li>Start exploring opportunities! 🚀</li>
                                </ol>
                                
                                <div style="background: #f8f8f8; border-radius: 8px; padding: 15px; margin: 15px 0;">
                                    <p style="margin: 0; color: #888; font-size: 13px; line-height: 1.6;">
                                        ⚠️ <strong>Security Note:</strong> Never share this OTP with anyone. InternLink will never ask for your OTP outside of the verification process.
                                    </p>
                                </div>
                                
                                <p style="color: #999; font-size: 13px; line-height: 1.6; margin: 15px 0 0;">
                                    Didn't request this code? You can safely ignore this email.
                                </p>
                                
                            </td>
                        </tr>
                    </table>
                    
                    <!-- ===== FOOTER ===== -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8f8f8;">
                        <tr>
                            <td style="padding: 25px 30px; text-align: center;">
                                <p style="margin: 0; color: #aaa; font-size: 12px; line-height: 1.6;">
                                    &copy; 2026 <strong style="color: #8B6B4A;">InternLink</strong> by FutureSpace.
                                    <br>
                                    Linking Talent, Building Futures.
                                </p>
                                <p style="margin: 8px 0 0; color: #ccc; font-size: 10px;">
                                    This email was sent to <a href="mailto:{to_email}" style="color: #8B6B4A; text-decoration: none;">{to_email}</a>
                                </p>
                            </td>
                        </tr>
                    </table>
                    
                </td>
            </tr>
        </table>
        
        <!-- Mobile note -->
        <div style="max-width: 600px; margin: 15px auto 0; text-align: center; font-size: 11px; color: #bbb; padding: 0 15px;">
            <p style="margin: 0;">View this email in your browser for the best experience.</p>
        </div>
        
    </body>
    </html>
    '''