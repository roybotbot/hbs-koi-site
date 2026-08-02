import { expect, test } from '@playwright/test';

test('keeps static pond when reduced motion is requested', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();

  await page.goto('/');
  await expect(page.locator('[data-pond-wake]')).not.toHaveAttribute('data-enhanced', 'true');
  await expect(page.locator('.pond-wake__fallback')).toBeVisible();
  await context.close();
});

test('canvas never intercepts page interaction', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-pond-canvas]')).toHaveCSS('pointer-events', 'none');
  await page.getByRole('link', { name: 'Fish' }).click();
  await expect(page).toHaveURL(/\/fish$/);
});
