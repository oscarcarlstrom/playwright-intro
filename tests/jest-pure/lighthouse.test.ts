import { playAudit } from 'playwright-lighthouse';
import { chromium, Browser, Page } from 'playwright';
import { lighthousePort, lighthouseReportDir } from '../../constants';

jest.setTimeout(60 * 1000);

let browser: Browser;
let page: Page;
beforeAll(async () => {
  browser = await chromium.launch({
    args: [`--remote-debugging-port=${lighthousePort}`],
  });
  page = await browser.newPage();
});

afterAll(async () => {
  await browser.close();
});

test('should pass lighthouse audit', async () => {
  await page.goto('https://www.bouvet.no/');

  await playAudit({
    page: page,
    port: lighthousePort,
    thresholds: {
      performance: 90,
      accessibility: 90,
      'best-practices': 90,
      seo: 90,
      pwa: 90,
    },
    reports: {
      formats: {
        html: true,
      },
      directory: `${lighthouseReportDir}/jest-pure`,
    },
  });
});
