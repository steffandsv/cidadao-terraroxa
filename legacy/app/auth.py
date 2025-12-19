import random
from flask import session

def generate_otp():
    """Generates a 4-digit OTP code."""
    return str(random.randint(1000, 9999))

def send_otp(phone, otp):
    """
    Simulates sending OTP via SMS.
    In a real app, this would use Twilio or AWS SNS.
    For this project, we print to console.
    """
    print(f"--- [SMS SIMULATION] To: {phone} | Code: {otp} ---")
    return True

def verify_otp(phone, input_otp):
    """Verifies if the entered OTP matches the one stored in session."""
    stored_otp = session.get(f'otp_{phone}')
    if stored_otp and stored_otp == input_otp:
        # Clear OTP after successful verification
        session.pop(f'otp_{phone}', None)
        return True
    return False

def store_otp(phone, otp):
    """Stores OTP in session for verification."""
    session[f'otp_{phone}'] = otp
