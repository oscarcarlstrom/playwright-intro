import { playAudit } from 'playwright-lighthouse';
import { chromium, Browser, Page } from 'playwright';
import { lighthousePort } from '../../constants';

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
      performance: 80,
      accessibility: 80,
      'best-practices': 80,
      seo: 80,
      pwa: 80,
    },
    reports: {
      html: true,
    },
    name: 'lighthouse-report',
    directory: 'tests/jest-pure',
  });
});
