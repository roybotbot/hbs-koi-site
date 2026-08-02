import { expect, test } from '@playwright/test';

test('collection shows one factual specimen field at a time', async ({ page }) => {
  await page.goto('/fish');
  await expect(page.getByRole('heading', { level: 1, name: 'Observed fish' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Specimen 01' })).toBeVisible();
  await expect(page.getByText('01 / 04')).toBeVisible();
  await expect(page.locator('[data-specimen-field]')).toHaveCount(4);
  await expect(page.locator('[data-representative-notice]')).toHaveCount(4);
});

test('specimen field opens its record from the image', async ({ page }) => {
  await page.goto('/fish');
  const firstField = page.locator('[data-specimen-field]').first();
  await firstField.scrollIntoViewIfNeeded();
  const fieldBounds = await firstField.boundingBox();
  expect(fieldBounds).not.toBeNull();
  await page.mouse.click(fieldBounds!.x + fieldBounds!.width / 2, fieldBounds!.y + 100);
  await expect(page).toHaveURL(/\/fish\/specimen-01\/?$/);
});

test('record keeps unknown facts explicit', async ({ page }) => {
  await page.goto('/fish/specimen-01');
  await expect(page.getByRole('heading', { level: 1, name: 'Specimen 01' })).toBeVisible();
  await expect(page.getByText('Unconfirmed')).toBeVisible();
  await expect(page.getByText('Unknown')).toBeVisible();
  await expect(page.getByText(/Behavior, location, and health information appear only/)).toBeVisible();
});
