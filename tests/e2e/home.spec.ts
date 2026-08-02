import { expect, test } from '@playwright/test';

test('homepage presents factual collection and stewardship', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Class of 1959 Chapel', { exact: true })).toBeVisible();
  await expect(page.getByText('Built 1992')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Oleg Mashtaler' })).toBeVisible();
  await expect(page.getByText("He also cares for the chapel's 17 koi.")).toBeVisible();
  await expect(page.getByRole('link', { name: /Read Oleg's HBS profile/i })).toHaveAttribute('href', 'https://www.hbs.edu/news/stories/oleg-mashtaler');
  await expect(page.locator('[data-oleg-portrait]')).toHaveCSS('aspect-ratio', '1 / 1');
  await expect(page.getByText('Specimen 01')).toBeVisible();
  await expect(page.locator('[data-representative-notice]')).toHaveCount(4);
});

test('fish preview card opens its specimen record from the image', async ({ page }) => {
  await page.goto('/');
  const firstCard = page.locator('.fish-preview__record').first();
  await expect(firstCard.getByRole('link', { name: 'View Specimen 01 record' })).toBeVisible();
  await firstCard.getByRole('img').click();
  await expect(page).toHaveURL(/\/fish\/specimen-01\/?$/);
});
