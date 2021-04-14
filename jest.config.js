module.exports = {
  rootDir: 'tests',
  preset: 'jest-playwright-preset',
  testEnvironmentOptions: {
    'jest-playwright': {
      browsers: ['chromium', 'firefox', 'webkit'],
    },
  },
  testPathPattern: 'tests/jest-playwright',
};
