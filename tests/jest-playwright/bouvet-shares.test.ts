jest.setTimeout(30 * 1000);

beforeAll(async () => {
  await page.goto('https://bouvet.no/bouvet-deler');
});

test('Should have correct heading', async () => {
  await expect(page).toHaveSelector('//h1[text()="Bouvet deler"]');
});

test('Should be possible to filter', async () => {
  //Her burde vi egentlig kunne bruke page.waitForNavigation()
  //Men det er to requester som fyres av mot https://bouvet.no/bouvet-deler?design=true her
  //Den første resolver ikke, og det gjør at firefox ikke greier å fullføre det som en navigation
  //Vi bruker også Promise.all for å unngå race conditions
  await Promise.all([page.click('label[for="filter-design"]'), page.waitForLoadState()]);
  expect(page.url().includes('?design=true')).toBe(true);
  await expect(page).toHaveSelector('"Bærekraftig programmering"');
});
