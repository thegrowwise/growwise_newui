import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for GrowWise NewUI
 *
 * Base URL:
 * - Uses E2E_BASE_URL if set (e.g. staging)
 * - Otherwise defaults to http://localhost:3000
 *
 * Stripe:
 * - Checkout flow is expected to redirect to Stripe test checkout page.
 * - Tests should assert redirect to a Stripe URL and not real card charges.
 */

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3000';

export default defineConfig({
  testDir: './e2e/specs',
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // `next dev` + parallel Playwright workers reliably triggers RSC/JSON.parse races and flaky tests.
  // Override with PLAYWRIGHT_WORKERS (e.g. 4) when using `next start` or E2E_BASE_URL against staging.
  workers: process.env.PLAYWRIGHT_WORKERS
    ? parseInt(process.env.PLAYWRIGHT_WORKERS, 10)
    : 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
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
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: 'npm run dev',
        url: BASE_URL,
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
      },
});

