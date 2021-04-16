import { Browser, chromium, firefox, Page, webkit } from 'playwright';
import { launchBrowser, closeBrowser } from './utils';
import { PNG, PNGWithMetadata } from 'pngjs';
import pixelmatch = require('pixelmatch');
import fs = require('fs');

const devBrowser = chromium;
const compareBrowsers = [firefox, webkit];
const url = 'https://www.bouvet.no/kurs';

async function setViewport(page: Page) {
  await page.setViewportSize({
    width: 1200,
    height: 2000,
  });
  // await page.waitForTimeout(3000);
}

const screenshotRootPath = `${__dirname}/screenshots`;
let benchMarkScreenshot: PNGWithMetadata;
beforeAll(async () => {
  try {
    fs.rmdirSync(screenshotRootPath, { recursive: true });
  } catch (err) {}
  const { launchedBrowser, page } = await launchBrowser(url, devBrowser);
  await setViewport(page);
  benchMarkScreenshot = PNG.sync.read(
    await page.screenshot({ path: `${screenshotRootPath}/${devBrowser.name()}.png` })
  );
  await closeBrowser(launchedBrowser);
});

compareBrowsers.forEach((compareBrowser) => {
  let launchedBrowser: Browser;
  let page: Page;
  beforeAll(async () => {
    ({ launchedBrowser, page } = await launchBrowser(url, devBrowser));
    await setViewport(page);
  });

  afterAll(async () => {
    await closeBrowser(launchedBrowser);
  });

  describe(`${compareBrowser.name()}`, () => {
    it(`should match ${devBrowser.name()}`, async () => {
      const screenshot = PNG.sync.read(
        await page.screenshot({ path: `${screenshotRootPath}/${compareBrowser.name()}.png` })
      );
      const { width, height } = screenshot;
      const diff = new PNG({ width, height });
      const matches = pixelmatch(benchMarkScreenshot.data, screenshot.data, diff.data, width, height) === 0;
      if (!matches) {
        fs.writeFileSync(`${screenshotRootPath}/diff-${compareBrowser.name()}.png`, PNG.sync.write(diff));
      }
      expect(matches).toBe(true);
    });
  });
});
