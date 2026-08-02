import { expect, test } from '@playwright/test';

test('history uses sourced vertical chronology', async ({ page }) => {
  await page.goto('/history');
  await expect(page.getByRole('heading', { level: 1, name: 'The pond in context' })).toBeVisible();
  for (const date of ['1959', '1992', '1997', '2011', 'Present']) {
    await expect(page.getByText(date, { exact: true })).toBeVisible();
  }
  const items = page.locator('[data-timeline-item]');
  await expect(items).toHaveCount(5);
  await expect(items.locator(':scope > .timeline-rail')).toHaveCount(5);
  await expect(items.locator('.timeline-marker')).toHaveCount(5);
  await expect(items.locator(':scope > .timeline-entry')).toHaveCount(5);

  for (const body of [
    'The graduating class that later funded the chapel through its 25th- and 30th-reunion campaigns.',
    'Moshe Safdie and Associates completed the chapel and enclosed water garden.',
    'A chamber organ designed by Taylor & Boody Organbuilders was added.',
    'The building achieved LEED Gold certification after work reducing energy and water use.',
    "Oleg Mashtaler cares for the pond's 17 koi and monitors its treatment systems.",
  ]) {
    await expect(page.getByText(body, { exact: true })).toBeVisible();
  }

  await expect(page.getByRole('link', { name: /HBS history/i })).toHaveAttribute('href', /hbs\.edu/);
  await expect(page.getByRole('link', { name: /Reference article/i })).toHaveAttribute('href', /wikipedia\.org/);
  await expect(page.locator('#sources a')).toHaveCount(3);
});
