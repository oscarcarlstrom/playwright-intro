import { test, expect } from '@playwright/test';

test('should match snapshots', async ({ page, browserName }) => {
  await page.goto('https://bouvet.no');
  const screenshot = await page.screenshot();
  expect(screenshot).toMatchSnapshot(`${browserName}-test.png`, { threshold: 0.2 });
});
