import { Browser, chromium, firefox, Page, webkit } from 'playwright';

[chromium, firefox, webkit].forEach((browser) => {
  let launchedBrowser: Browser;
  let page: Page;
  beforeAll(async () => {
    launchedBrowser = await browser.launch();
    page = await launchedBrowser.newPage();
    await page.goto('https://www.bouvet.no/');
  });

  afterAll(async () => {
    await launchedBrowser.close();
  });

  describe(`${browser.name()}`, () => {
    it('Should have the correct title', async () => {
      const title = await page.title();
      expect(title).toBe('Bouvet Norge');
    });

    it('Should have a good slogan', async () => {
      const text = await page.waitForSelector('"Vi går foran og bygger fremtidens samfunn"');
      expect(text).toBeTruthy();
    });
  });
});
