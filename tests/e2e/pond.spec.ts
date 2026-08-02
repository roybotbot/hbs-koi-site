import { expect, test } from '@playwright/test';

test('keeps static pond when reduced motion is requested', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();

  await page.goto('/');
  await expect(page.locator('[data-pond-wake]')).not.toHaveAttribute('data-enhanced', 'true');
  await expect(page.locator('.pond-wake__fallback')).toBeVisible();
  await context.close();
});

test('keeps fallback when a simulation framebuffer is incomplete', async ({ page }) => {
  await page.addInitScript(() => {
    WebGL2RenderingContext.prototype.checkFramebufferStatus = function checkFramebufferStatus() {
      return this.FRAMEBUFFER_UNSUPPORTED;
    };
  });

  await page.goto('/');
  await expect(page.locator('[data-pond-wake]')).not.toHaveAttribute('data-enhanced', 'true');
  await expect(page.locator('.pond-wake__fallback')).toBeVisible();
});

test('cancels a pending wake mount during client navigation', async ({ page }) => {
  await page.addInitScript(() => {
    const state = window as Window & { webglContextCount?: number };
    state.webglContextCount = 0;
    const originalContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function getContext(this: HTMLCanvasElement, type, ...options) {
      if (type === 'webgl2') state.webglContextCount = (state.webglContextCount ?? 0) + 1;
      return originalContext.call(this, type, ...options as []);
    } as typeof HTMLCanvasElement.prototype.getContext;
    HTMLImageElement.prototype.decode = () =>
      new Promise<void>((resolve) => window.setTimeout(resolve, 400));
    Object.defineProperty(HTMLImageElement.prototype, 'complete', {
      configurable: true,
      get: () => false,
    });
    Object.defineProperty(HTMLImageElement.prototype, 'naturalWidth', {
      configurable: true,
      get: () => 100,
    });
  });

  await page.goto('/');
  await page.getByRole('link', { name: 'Fish' }).click();
  await expect(page).toHaveURL(/\/fish$/);
  await page.waitForTimeout(600);
  expect(
    await page.evaluate(() => (window as Window & { webglContextCount?: number }).webglContextCount),
  ).toBe(0);
});

test('canvas never intercepts page interaction', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-pond-canvas]')).toHaveCSS('pointer-events', 'none');
  await page.getByRole('link', { name: 'Fish' }).click();
  await expect(page).toHaveURL(/\/fish$/);
});
