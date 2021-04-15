const config = {
  pure: {
    rootDir: 'tests/jest-pure',
  },
  playwright: {
    rootDir: 'tests/jest-playwright',
    preset: 'jest-playwright-preset',
    testEnvironmentOptions: {
      'jest-playwright': {
        browsers: ['chromium', 'firefox', 'webkit'],
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
