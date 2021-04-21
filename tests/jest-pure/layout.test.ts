import { Browser, chromium, firefox, Page, ViewportSize, webkit } from 'playwright';
import { launchBrowser, closeBrowser, viewportSizes } from './utils';
import { PNG, PNGWithMetadata } from 'pngjs';
import pixelmatch = require('pixelmatch');
import fs = require('fs');

jest.setTimeout(30 * 1000);

const devBrowser = chromium;
const compareBrowsers = [firefox, webkit];
const url = 'https://www.bouvet.no/investor';

const resolutionString = (viewportSize: ViewportSize) => `${viewportSize.width}x${viewportSize.height}`;

async function takeScreenshot(page: Page, viewportSize: ViewportSize, browserName: string) {
  await page.setViewportSize(viewportSize);
  return PNG.sync.read(
    await page.screenshot({
      path: `${screenshotRootPath}/${resolutionString(viewportSize)}/${browserName}.png`,
    })
  );
}

const screenshotRootPath = `test-results/screenshots/layout`;
let benchMarkScreenshots = [] as PNGWithMetadata[];
beforeAll(async () => {
  if (fs.existsSync(screenshotRootPath)) {
    fs.rmdirSync(screenshotRootPath, { recursive: true });
  }

  const { launchedBrowser, page } = await launchBrowser(url, devBrowser);
  // A 'for of' loop is essential here (can't use forEach, since that requires an async callback)
  for (const viewportSize of viewportSizes) {
    const screenshot = await takeScreenshot(page, viewportSize, devBrowser.name());
    benchMarkScreenshots.push(screenshot);
  }
  // Alternative (using map):
  // await Promise.all(
  //   viewportSizes.map(async (viewportSize) => {
  //     const screenshot = await takeScreenshot(page, viewportSize, devBrowser.name());
  //     benchMarkScreenshots.push(screenshot);
  //   })
  // );
  await closeBrowser(launchedBrowser);
});

compareBrowsers.forEach((compareBrowser) => {
  let launchedBrowser: Browser;
  let page: Page;
  beforeAll(async () => {
    ({ launchedBrowser, page } = await launchBrowser(url, compareBrowser));
  });

  afterAll(async () => {
    await closeBrowser(launchedBrowser);
  });

  describe(`${compareBrowser.name()}`, () => {
    viewportSizes.forEach((viewportSize, viewportSizeIndex) => {
      it(`should match ${compareBrowser.name()} for resolution ${resolutionString(viewportSize)}`, async () => {
        const screenshot = await takeScreenshot(page, viewportSize, compareBrowser.name());

        const { width, height } = screenshot;
        const diff = new PNG({ width, height });

        const matches =
          pixelmatch(benchMarkScreenshots[viewportSizeIndex].data, screenshot.data, diff.data, width, height, {
            threshold: 0.8,
          }) === 0;
        if (!matches) {
          fs.writeFileSync(
            `${screenshotRootPath}/${resolutionString(viewportSize)}/diff-${compareBrowser.name()}.png`,
            PNG.sync.write(diff)
          );
        }
        expect(matches).toBe(true);
      });
    });
  });
});
