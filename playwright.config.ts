import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright e2e 配置（A3 测试加固）
 *
 * 说明：浏览器体积大、且本项目的开发沙箱内 Chromium 无法稳定启动，
 * 因此本地默认不跑 e2e；CI 中由 workflow 执行 `npx playwright install --with-deps chromium` 后运行。
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'list' : 'html',

  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://127.0.0.1:3300',
    trace: 'on-first-retry',
    locale: 'zh-CN',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],

  // 复用已运行的 dev server；CI 中自动拉起
  webServer: {
    command: 'npm run dev -- -p 3300 -H 127.0.0.1',
    url: 'http://127.0.0.1:3300',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
