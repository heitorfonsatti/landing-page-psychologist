import { expect, test } from '@playwright/test';
import { waitForScrollToStop } from './panel-stack-helpers';

const TITLE = 'Luto e perdas';

for (const reducedMotion of ['no-preference', 'reduce'] as const) {
  test(`"learn more" opens one topic and "back" restores all (${reducedMotion})`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion });
    await page.goto('/');
    const section = page.locator('#servicos');
    const cards = section.getByRole('listitem');
    await expect(cards).toHaveCount(5);

    await section.getByRole('button', { name: `Saber mais sobre ${TITLE}` }).click();

    const detail = section.getByRole('article', { name: TITLE });
    await expect(detail).toBeVisible();
    await expect(detail).toContainText('O que você pode estar vivendo');
    await expect(detail).toContainText('Como a terapia pode ajudar');
    await expect(cards).toHaveCount(0);
    await expect(section.getByRole('button', { name: 'Voltar' })).toBeFocused();

    await section.getByRole('button', { name: 'Voltar' }).click();

    await expect(detail).toHaveCount(0);
    await expect(cards).toHaveCount(5);
    await expect(section.getByRole('button', { name: `Saber mais sobre ${TITLE}` })).toBeFocused();
  });
}

test('the opened explanation is not left under the next panel', async ({ page }) => {
  await page.goto('/#servicos');
  await waitForScrollToStop(page);
  const section = page.locator('#servicos');
  // Last card: on small screens it sits near the end of a tall panel. Opened
  // with the keyboard, since a pointer click cannot reach a card that another
  // panel covers until the stack scrolls it into view.
  await section.getByRole('button', { name: 'Saber mais sobre Transições de vida e de trabalho' }).press('Enter');
  const detail = section.getByRole('article');
  // Focus lands on "Back" once the opening animation is over.
  await expect(section.getByRole('button', { name: 'Voltar' })).toBeFocused();
  await waitForScrollToStop(page);

  const uncovered = await detail.evaluate((el) => {
    const header = document.querySelector('header')?.getBoundingClientRect().bottom ?? 0;
    return [...el.querySelectorAll('p, button')].every((child) => {
      const r = child.getBoundingClientRect();
      const y = r.top + r.height / 2;
      if (y < header || y > window.innerHeight) {
        return r.top >= window.innerHeight; // below the fold is fine only if it can scroll into view
      }
      const hit = document.elementFromPoint(r.left + 4, y);
      return Boolean(hit && el.contains(hit));
    });
  });
  expect(uncovered).toBe(true);
});
