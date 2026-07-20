import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/test/objective1/e2e/', // folder where your test file is located
  use: {
    baseURL: 'http://localhost:5173', // Change to your app's local port (e.g., 3000, 5173)
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});