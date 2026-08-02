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

  const finalConnectorDisplay = await items.last().locator('.timeline-rail').evaluate(
    (rail) => getComputedStyle(rail, '::after').display,
  );
  expect(finalConnectorDisplay).toBe('none');

  const sourceLinks = page.locator('#history-sources a');
  await expect(sourceLinks).toHaveCount(3);
  await expect(sourceLinks.nth(0)).toHaveAttribute(
    'href',
    'https://www.hbs.edu/about/campus-and-culture/campus-built-on-philanthropy/class-of-1959-chapel',
  );
  await expect(sourceLinks.nth(1)).toHaveAttribute(
    'href',
    'https://en.wikipedia.org/wiki/The_Class_of_1959_Chapel',
  );
  await expect(sourceLinks.nth(2)).toHaveAttribute(
    'href',
    'https://www.hbs.edu/news/stories/oleg-mashtaler',
  );

  const imageCredits = page.locator('[data-image-credit]');
  await expect(imageCredits).toHaveCount(7);
  await expect(page.getByText('Magnus Manske', { exact: true })).toBeVisible();
  await expect(page.getByText('Paulman', { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/Dsmack/).first()).toBeVisible();
  await expect(page.getByText('Accessibility', { exact: true }).last()).toBeVisible();
});
