import requests
import time
import threading
from app import create_app

# Run the app in a separate thread
app = create_app()
def run_app():
    app.run(port=5001)

server_thread = threading.Thread(target=run_app)
server_thread.daemon = True
server_thread.start()

# Give server a moment to start
time.sleep(2)

BASE_URL = "http://localhost:5001"
SESSION = requests.Session()

def test_flow():
    print("1. [GET] /login - Requesting login page...")
    r = SESSION.get(f"{BASE_URL}/login")
    assert r.status_code == 200
    print("   -> OK")

    print("2. [POST] /login - Submitting phone number...")
    r = SESSION.post(f"{BASE_URL}/login", data={'phone': '11999999999'})
    assert r.status_code == 200 # Redirects followed
    print("   -> OK")

    # In our mocked environment, we can't easily grab the random OTP from the server console output programmatically
    # without complex intercepting.
    # BUT, we can cheat for testing: The session stores the OTP.
    # Wait, we can't access server-side session from client.
    # We will "guess" it by mocking the random function? No, that's hard.
    # Let's Modify app/auth.py temporarily or just assume we know it?
    # Actually, for this automated test, I'll rely on a backdoor or just unit test logic?
    # Better: I will use the app context to manually create a user and log them in via session cookie manipulation?
    # No, let's use the actual flow but with a fixed OTP for "test" mode if possible.
    # Since I cannot easily change the code now without editing files, I will try to read the logs? No.

    # Alternative: I'll use the Repository to create a user and action directly to verify the Logic,
    # and use Requests to verify the Routes availability.

    print("   [INFO] Skipping OTP interactive verification in this script. Verifying routes availability instead.")

    print("3. [GET] / (Root) - Should redirect to login...")
    r = requests.get(f"{BASE_URL}/") # New session
    assert "login" in r.url
    print("   -> OK")

    # Let's Simulate a logged-in user by creating a signed cookie?
    # Hard without the secret key signing logic.

    # Let's switch to unit testing the logic directly using app.test_client() which is better practice.
    print("\n--- Switching to Flask Test Client for Logic Verification ---\n")

    with app.test_client() as client:
        # Login Flow
        print("TEST: Login Flow")
        with client.session_transaction() as sess:
            # We can't easily set the OTP here before the request, but we can inspect it after POST
            pass

        r = client.post('/login', data={'phone': '1234567890'}, follow_redirects=True)
        assert b'0000' in r.data # The placeholder text in otp.html

        # Get the OTP from the session (server side)
        with client.session_transaction() as sess:
            otp_key = 'otp_1234567890'
            secret_otp = sess[otp_key]
            print(f"   -> Intercepted OTP: {secret_otp}")

        # Verify OTP
        r = client.post(f'/otp?phone=1234567890', data={'otp': secret_otp}, follow_redirects=True)
        assert b'Bem-vindo' in r.data or b'Progresso' in r.data
        print("   -> Login Successful (User created)")

        # Asset View
        print("TEST: View Asset")
        r = client.get('/asset/1', follow_redirects=True)
        assert b'Poste #POSTE-01' in r.data
        print("   -> Asset View OK")

        # Report
        print("TEST: Report Issue")
        r = client.post('/report/1', data={'rule_slug': 'report_fix', 'evidence_url': ''}, follow_redirects=True)
        assert b'Obrigado' in r.data
        print("   -> Report Submitted")

        # Admin View
        print("TEST: Admin Dashboard")
        r = client.get('/admin', follow_redirects=True)
        assert b'report_fix' in r.data
        assert b'1234567890' in r.data
        print("   -> Report Visible in Admin")

        # Approve
        # Need to find the action ID.
        from app import repository
        with app.app_context():
            actions = repository.get_pending_actions()
            action_id = actions[0]['id']
            print(f"   -> Found Action ID: {action_id}")

        r = client.post(f'/admin/approve/{action_id}', follow_redirects=True)
        assert b'aprovada' in r.data
        print("   -> Action Approved")

        # Check Ledger/Profile
        print("TEST: Check Points/Profile")
        r = client.get('/profile', follow_redirects=True)
        assert b'50 pts' in r.data
        print("   -> Points Credited (50 pts)")

if __name__ == '__main__':
    try:
        test_flow()
        print("\nALL TESTS PASSED.")
    except Exception as e:
        print(f"\nTEST FAILED: {e}")
        exit(1)
