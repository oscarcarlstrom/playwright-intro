import { Browser, chromium, Page } from 'playwright';

let browser: Browser;
let page: Page;
beforeAll(async () => {
  browser = await chromium.launch();
  page = await browser.newPage();
  await page.goto('https://www.bouvet.no/');
});

afterAll(async () => {
  await browser.close();
});

test('Should have the correct title', async () => {
  const title = await page.title();
  expect(title).toBe('Bouvet Norge');
});

test('Should have a good slogan', async () => {
  const text = await page.waitForSelector('"Vi går foran og bygger fremtidens samfunn"');
  await expect(text).toBeTruthy();
});
