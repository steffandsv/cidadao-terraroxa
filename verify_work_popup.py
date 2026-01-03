
import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        await page.set_viewport_size({"width": 1280, "height": 720})

        print("Navigating to map...")
        await page.goto("http://localhost:3000/map")

        await page.wait_for_selector(".leaflet-container")
        print("Map loaded.")

        try:
            print("Waiting for Work marker (🚧)...")
            marker_xpath = "//div[contains(@class, 'custom-icon')]//div[contains(text(), '🚧')]"
            await page.wait_for_selector(marker_xpath, timeout=10000)

            elements = await page.query_selector_all(marker_xpath)
            print(f"Found {len(elements)} Work markers.")

            if len(elements) > 0:
                print("Clicking Work marker...")
                # Try clicking via JS to avoid viewport issues
                await page.evaluate("(element) => element.click()", elements[0])

                print("Waiting for popup...")
                popup = await page.wait_for_selector(".leaflet-popup-content", timeout=5000)

                # Take screenshot
                await page.screenshot(path="work_popup_verification.png")
                print("Screenshot saved to work_popup_verification.png")

                # Verify Link Text Color
                link = await popup.query_selector("a")
                if link:
                    cls = await link.get_attribute("class")
                    print(f"Link classes: {cls}")
                    if "!text-white" in cls:
                        print("VERIFICATION SUCCESS: Link has !text-white class.")
                    else:
                        print("VERIFICATION FAILED: Link missing !text-white class.")
                else:
                    print("VERIFICATION FAILED: Link not found in popup.")
            else:
                 print("No work markers found.")

        except Exception as e:
            print(f"Error: {e}")
            await page.screenshot(path="error_verification.png")

        await browser.close()

asyncio.run(run())
