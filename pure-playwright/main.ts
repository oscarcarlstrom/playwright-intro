const { chromium, Browser, BrowserContext } = require('playwright');

(async () => {
  let browser: typeof Browser;
  let context: typeof BrowserContext;

  async function setup() {
    browser = await chromium.launch();
    context = await browser.newContext();
  }

  async function teardown() {
    await browser.close();
  }

  async function getBouveth1() {
    const page = await context.newPage();

    await page.goto('https://bouvet.no');

    const headline = await page.waitForSelector('h1');

    const text = headline.evaluate((el) => el.innerText);
    console.log(text);

    return text;
  }

  async function selectorExample(text) {
    const page = await context.newPage();

    await page.goto('https://bouvet.no');

    const cssSelectWait = await page.waitForSelector('.frontPage-headingText');
    // CSS selector
    const cssSelectedHeading = await page.$('.frontPage-headingText');
    // xpath
    const xpathSelector = await page.$('xpath=//html/body/h1');
    // text selector
    const textSelector = await page.waitForSelector(`text="${text}"`);
    const textSelectorShort = await page.waitForSelector(`"${text}"`);
    // select many
    const many = await page.$$('h2');
  }

  async function clickAndSearch() {
    const page = await context.newPage();

    await page.goto('https://bouvet.no');
    await page.click('#js-MainheaderGlobalSearch');
    await page.waitForSelector('#js-globalglobalSearchFlip');
    await page.type('#js-globalglobalSearchFlip', 'EXAMPLE');
    await Promise.all([page.click('#js-searchGlobalIconWrapper'), page.waitForNavigation()]);
    console.log(page.url());
  }

  await setup();
  const text = await getBouveth1();
  await selectorExample(text);
  await clickAndSearch();
  await teardown();
})();
