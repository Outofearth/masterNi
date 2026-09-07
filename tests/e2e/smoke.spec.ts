import { test, expect } from '@playwright/test';

/**
 * 全站冒烟 e2e
 *
 * 目标：守住「页面不 500、关键内容能渲染、核心链接不 404」这条底线。
 * 刻意不模拟表单提交——BirthForm 是多个原生 <select>，按索引取值很脆，
 * 排盘正确性已由 tests/unit/ziwei-algorithm.test.ts 在单测层覆盖。
 */

const ROUTES: { path: string; expectText: string }[] = [
  { path: '/', expectText: '紫微' },
  { path: '/chart', expectText: '紫微斗数排盘' },
  { path: '/library', expectText: '古籍' },
  { path: '/knowledge', expectText: '紫微斗数知识库' },
  { path: '/knowledge/pattern', expectText: '格局' },
  { path: '/tianji', expectText: '天纪' },
  { path: '/tianji/yijing', expectText: '卦' },
  { path: '/diji', expectText: '地纪' },
  { path: '/diji/mountains', expectText: '廿四山' },
  { path: '/diji/wujue', expectText: '五诀' },
  { path: '/renji', expectText: '人纪' },
  { path: '/renji/shanghan', expectText: '伤寒' },
  { path: '/renji/jingui', expectText: '金匮' },
];

test.describe('全站路由冒烟', () => {
  for (const r of ROUTES) {
    test(`${r.path} 可访问且渲染出「${r.expectText}」`, async ({ page }) => {
      const resp = await page.goto(r.path);
      expect(resp?.status(), `${r.path} 应返回 200`).toBe(200);
      await expect(page.locator('body')).toContainText(r.expectText);
    });
  }
});

test.describe('古籍检索链路', () => {
  test('搜索「紫微」有命中结果且可跳章节', async ({ page }) => {
    await page.goto('/library/search?q=%E7%B4%AB%E5%BE%AE');
    await expect(page.locator('body')).toContainText('紫微');

    const chapterLinks = page.locator('a[href^="/library/"]');
    expect(await chapterLinks.count()).toBeGreaterThan(0);
  });

  test('关键词反查页列出该星的古籍出处', async ({ page }) => {
    await page.goto('/library/keyword/%E7%B4%AB%E5%BE%AE');
    await expect(page.locator('body')).toContainText('紫微');
  });

  test('古籍章节正文中的星名渲染为可点链接（A4-3）', async ({ page }) => {
    await page.goto('/library/quanji/0');
    const starLinks = page.locator('a[href^="/library/keyword/"]');
    expect(await starLinks.count()).toBeGreaterThan(0);
  });
});

test.describe('A4 跨模块导航', () => {
  test('卦象详情页有「延伸阅读」与起卦入口', async ({ page }) => {
    await page.goto('/tianji/yijing/1');
    await expect(page.locator('body')).toContainText('延伸阅读');
    await expect(page.locator('body')).toContainText('起卦实测');
  });

  test('地纪子页底部有延伸阅读，可跳回知识库/古籍/排盘', async ({ page }) => {
    await page.goto('/diji/mountains');
    const crossLinks = page.locator('section[aria-label="延伸阅读"] a');
    expect(await crossLinks.count()).toBeGreaterThanOrEqual(3);
  });
});
