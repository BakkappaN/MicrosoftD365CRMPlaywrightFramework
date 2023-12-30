import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

// https://learn.microsoft.com/en-us/dynamics365/guidance/resources/test-automation-setup

export default defineConfig({
  testDir: './tests', //use tests for unit tests and tests-e2e for e2e
  /* Maximum time one test can run for. */
  timeout: 5 * 60 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 2 * 60 * 1000
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.DYN365_ORGURL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    storageState: '/storage-state/storageState.json',
    headless: false
  },
  globalSetup: require.resolve('./globals/global-setup'),
  globalTeardown: require.resolve('./globals/global-teardown'),
  
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: 
      { 
        ...devices['Desktop Chrome'], 
        storageState: '/storage-state/storageState.json' 
      },
    },

    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'], 
        storageState: '/storage-state/storageState.json' 
      },
    },

    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'] ,
        storageState: '/storage-state/storageState.json'
      },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { channel: 'chrome',
    //   storageState: '/storage-state/storageState.json'  },
    // },
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  // outputDir: 'test-results/',

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   port: 3000,
  // },
});
