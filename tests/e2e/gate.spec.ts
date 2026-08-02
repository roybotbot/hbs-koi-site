import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const sitePassword = process.env.SITE_GATE_PASSWORD;

test.skip(!sitePassword, 'SITE_GATE_PASSWORD is required for the cosmetic gate test');

test('password query grants access for the current tab', async ({ page }) => {
  await page.goto('/');
  const gate = page.getByRole('region', { name: 'Chapel Koi Pond' });
  await expect(gate).toBeVisible();
  await expect(page.locator('main')).toBeHidden();
  await expect(gate.getByLabel('Password')).toBeVisible();
  await expect(gate.getByLabel(/user/i)).toHaveCount(0);
  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(
    accessibility.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? '')),
  ).toEqual([]);

  await gate.getByLabel('Password').fill('invalid-test-value');
  await gate.getByRole('button', { name: 'View site' }).click();
  await expect(page.getByRole('alert')).toHaveText('Incorrect password.');

  await page.goto(`/?pass=${encodeURIComponent(sitePassword!)}`);
  await expect(page).toHaveURL('http://127.0.0.1:4321/');
  await expect(page.locator('main')).toBeVisible();

  await page.getByRole('link', { name: 'Fish', exact: true }).click();
  await expect(page).toHaveURL(/\/fish\/?$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Observed fish' })).toBeVisible();
});
