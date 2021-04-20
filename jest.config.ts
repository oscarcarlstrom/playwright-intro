import { lighthousePort } from './constants';

const playwrightPreset = {
  rootDir: 'tests/jest-playwright',
  preset: 'jest-playwright-preset',
};

const config = {
  pure: {
    rootDir: 'tests/jest-pure',
  },
  playwright: {
    ...playwrightPreset,
    testEnvironmentOptions: {
      'jest-playwright': {
        browsers: ['chromium', 'firefox', 'webkit'],
      },
    },
  },
  'playwright-lighthouse': {
    ...playwrightPreset,
    testEnvironmentOptions: {
      'jest-playwright': {
        launchType: 'LAUNCH',
        launchOptions: {
          args: [`--remote-debugging-port=${lighthousePort}`],
          headless: true,
        },
      },
    },
  },
};

module.exports = async () => ({
  ...(config[process.env.CONFIG] ?? config.pure),
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
});
