import { expect, test } from '@playwright/test';

test('shared shell exposes approved navigation and credits', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Chapel Koi Pond' })).toBeVisible();
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Fish' })).toHaveAttribute('href', '/fish');
  await expect(page.getByRole('navigation').getByRole('link', { name: 'History' })).toHaveAttribute('href', '/history');
  await expect(page.getByText('Not affiliated with or endorsed by Harvard University.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Roy Natian' })).toHaveAttribute('href', 'https://natian.io');
  await expect(page.getByRole('link', { name: 'Accessibility' })).toHaveAttribute('href', '/history#accessibility');
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
});
