import { playAudit } from 'playwright-lighthouse';
import { lighthousePort, lighthouseReportDir } from '../../constants';

jest.setTimeout(60 * 1000);

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
      directory: `${lighthouseReportDir}/jest-playwright`,
    },
  });
});
