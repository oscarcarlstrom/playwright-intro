beforeAll(async () => {
  await page.goto('https://www.bouvet.no/');
});

test('Should have the correct title', async () => {
  const title = await page.title();
  expect(title).toBe('Bouvet Norge');
});

test('Should have a good slogan', async () => {
  await expect(page).toHaveSelector('"Vi går foran og bygger fremtidens samfunn"');
  await expect(page).toHaveSelector('text=Vi går foran og bygger fremtidens samfunn');
});
