import { defineConfig, devices } from '@playwright/test';
import { nxE2EPreset } from '@nx/playwright/preset';

import { workspaceRoot } from '@nx/devkit';
import path = require('path');

// For CI, you may want to set BASE_URL to the deployed application.
const baseURL = process.env['BASE_URL'] || 'http://localhost:4200';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  ...nxE2EPreset(__filename, { testDir: './src' }),
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  // Run all tests in parallel.
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,

  // Retry on CI only.
  retries: process.env.CI === 'true' ? 2 : 0,

  // Opt out of parallel tests on CI.
  workers: process.env.CI === 'true' ? 1 : undefined,
  reporter: [
    ['list'],
    [
      '@bgotink/playwright-coverage',
      /** @type {import('@bgotink/playwright-coverage').CoverageReporterOptions} */ {
        // Path to the root files should be resolved from, most likely your repository root
        sourceRoot: __dirname,
        // Files to ignore in coverage, useful
        // - if you're testing the demo app of a component library and want to exclude the demo sources
        // - or part of the code is generated
        // - or if you're running into any of the other many reasons people have for excluding files
        exclude: [
          'apps/front-e2e/.eslintrc.json, apps/front-e2e/playwright.config.ts',
          'apps/front-e2e/project.json',
        ],
        // Directory in which to write coverage reports
        resultDir: path.join(workspaceRoot, 'coverage/react-app-e2e'),
        // Configure the reports to generate.
        // The value is an array of istanbul reports, with optional configuration attached.
        reports: [['json'], ['lcovonly']],
      },
    ],
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'pnpm exec nx run react-app:serve',
    url: 'http://localhost:4200',
    reuseExistingServer: process.env.CI !== 'true',
    cwd: workspaceRoot,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Uncomment for mobile browsers support
    /* {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    }, */

    // Uncomment for branded browsers
    /* {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    } */
  ],
});
