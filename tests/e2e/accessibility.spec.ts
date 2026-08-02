import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const path of ['/', '/fish', '/fish/specimen-01', '/history']) {
  test(`${path} has no serious accessibility violations`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('main')).toHaveAttribute('data-page-ready', 'true');
    const results = await new AxeBuilder({ page }).analyze();
    expect(
      results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? '')),
    ).toEqual([]);
  });
}

test('reduced-motion client navigation remains static', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/');
  await page.evaluate(() => {
    (window as Window & { navigationMarker?: string }).navigationMarker = 'preserved';
  });

  await page.getByRole('link', { name: 'Fish' }).click();

  expect(
    await page.evaluate(
      () => (window as Window & { navigationMarker?: string }).navigationMarker,
    ),
  ).toBe('preserved');
  await expect(page.locator('main')).toHaveAttribute('data-page-ready', 'true');
  await expect(page.locator('main')).toHaveCSS('opacity', '1');
  await expect(page.locator('main')).toHaveCSS('transform', 'none');
  await context.close();
});

test('mobile navigation and Oleg portrait preserve reading order', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('navigation')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Oleg Mashtaler' })).toBeVisible();
  await expect(page.locator('[data-oleg-portrait]')).toHaveCSS('aspect-ratio', '1 / 1');
});
