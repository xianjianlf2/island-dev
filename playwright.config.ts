import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './e2e',
  timeout: 50000,
  webServer: {
    url: 'http://localhost:5173',
    command: ''
  },
  use: {
    headless: true
  }
};

export default config;
