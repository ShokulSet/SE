import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './src/e2e',
  fullyParallel: false,
  retries: 1,
  timeout: 30000,
  reporter: [['html', { open: 'never', host: '0.0.0.0', port: 9323 }]],

  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },

  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',

    trace: 'on-first-retry',
    screenshot: 'only-on-failure',

    video: 'on', // ✅ อัดทุก test
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // (optional) ปรับขนาดวิดีโอ
        video: {
          mode: 'on',
          size: { width: 1280, height: 720 },
        },
      },
    },
  ],
})