import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: "./src/test/",
  testMatch: "**/*.spec.js", // folder where your test file is located
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
  webServer: [
    {
      command: 'npm run dev',
      cwd: '../backend',               // Point to backend folder
      url: 'http://localhost:5000', // Replace with a valid backend URL or port check
      timeout: 120 * 1000,             // Wait up to 2 min for startup
      reuseExistingServer: !process.env.CI, // Reuse locally, boot fresh on CI
    },
    {
      command: 'npm run dev',
      cwd: './',                       // Current directory (frontend)
      url: 'http://localhost:5173',     // Frontend dev server URL
      timeout: 120 * 1000,
      reuseExistingServer: !process.env.CI,
    },
  ],
});