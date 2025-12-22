import subprocess
from playwright.sync_api import sync_playwright, expect

def get_token():
    # We need to run it from root
    result = subprocess.run(["npx", "tsx", "scripts/gen_session.ts"], capture_output=True, text=True, cwd="/app")
    lines = result.stdout.split('\n')
    token = ""
    for line in lines:
        if line.startswith("SESSION_TOKEN="):
            token = line.split("=")[1].strip()
    return token

def test_dashboard(page):
    token = get_token()
    if not token:
        print("Failed to get token")
        return

    print(f"Using token: {token[:10]}...")

    # Set cookie
    context = page.context
    context.add_cookies([{
        "name": "session",
        "value": token,
        "domain": "localhost",
        "path": "/"
    }])

    page.goto("http://localhost:3000/dashboard")

    # Check for Verification Banner
    # We might need to wait
    try:
        expect(page.get_by_text("Verifique seu perfil")).to_be_visible(timeout=5000)
    except:
        print("Verification banner not found. Dumping HTML...")
        # page.screenshot(path="/home/jules/verification/debug_dashboard.png")
        # print(page.content())
        # return

    # Click it
    page.get_by_text("Verifique seu perfil").click()

    # Should be on /verify
    expect(page).to_have_url("http://localhost:3000/verify")

    # Take screenshot of form
    page.screenshot(path="/home/jules/verification/verify_page.png")
    print("Screenshot verify_page.png saved")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_dashboard(page)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()
