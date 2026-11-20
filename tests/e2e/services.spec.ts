import { expect, test } from '@playwright/test';
import { waitForScrollToStop } from './panel-stack-helpers';

const TITLE = 'Perfeccionismo';

for (const reducedMotion of ['no-preference', 'reduce'] as const) {
  test(`"learn more" opens one topic and "back" restores all (${reducedMotion})`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion });
    await page.goto('/');
    const section = page.locator('#servicos');
    const cards = section.getByRole('listitem');
    await expect(cards).toHaveCount(6);

    await section.getByRole('button', { name: `Saber mais sobre ${TITLE}` }).click();

    const detail = section.getByRole('article', { name: TITLE });
    await expect(detail).toBeVisible();
    await expect(detail).toContainText('O que você pode estar vivendo');
    await expect(detail).toContainText('Como a terapia pode ajudar');
    await expect(cards).toHaveCount(0);
    await expect(section.getByRole('button', { name: 'Voltar' })).toBeFocused();

    await section.getByRole('button', { name: 'Voltar' }).click();

    await expect(detail).toHaveCount(0);
    await expect(cards).toHaveCount(6);
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
  await section.getByRole('button', { name: 'Saber mais sobre Relação com o corpo e a alimentação' }).press('Enter');
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

test('opening a children topic keeps the photo and the panel at their size', async ({ page }) => {
  await page.goto('/#infantojuvenil');
  // Web fonts swapping in would change heights between the two readings.
  await page.evaluate(() => document.fonts.ready);
  await waitForScrollToStop(page);
  const section = page.locator('#infantojuvenil');
  const rows = section.getByRole('listitem');
  const count = await rows.count();

  const measure = () =>
    section.evaluate((s) => {
      const img = s.querySelector('img');
      return {
        height: (s as HTMLElement).offsetHeight,
        // Layout sizes, not getBoundingClientRect: a partly covered panel is
        // scaled down a little by the depth effect.
        photo: img ? (img as HTMLElement).offsetHeight : 0,
      };
    });

  for (let i = 0; i < count; i++) {
    const before = await measure();
    const title = (await rows.nth(i).getByRole('heading').textContent())!;
    // Keyboard, like the test above: on phones the next panel may cover a
    // row until the stack scrolls it into view.
    await section.getByRole('button', { name: `Saber mais sobre ${title}` }).press('Enter');
    await expect(section.getByRole('button', { name: 'Voltar' })).toBeFocused();
    await waitForScrollToStop(page);
    const open = await measure();
    // On phones the list layout stacks and the panel may scroll to show the
    // explanation; what must hold everywhere is that the panel and the photo
    // keep their size.
    // 1px of slack for subpixel rounding.
    expect(Math.abs(open.height - before.height), `panel height with "${title}" open`).toBeLessThanOrEqual(1);
    expect(Math.abs(open.photo - before.photo), `photo height with "${title}" open`).toBeLessThanOrEqual(1);
    await section.getByRole('button', { name: 'Voltar' }).press('Enter');
    await expect(rows).toHaveCount(count);
    await waitForScrollToStop(page);
  }
});
