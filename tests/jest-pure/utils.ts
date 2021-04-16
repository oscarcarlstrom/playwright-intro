import { BrowserType, ChromiumBrowser, FirefoxBrowser, WebKitBrowser, Browser } from 'playwright';

export async function launchBrowser(
  url: string,
  browser: BrowserType<ChromiumBrowser | FirefoxBrowser | WebKitBrowser>
) {
  const launchedBrowser = (await browser.launch()) as Browser;
  const page = await launchedBrowser.newPage();
  await page.goto(url);
  return {
    launchedBrowser,
    page,
  };
}

export async function closeBrowser(launchedBrowser: Browser) {
  await launchedBrowser.close();
}
