import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

/**
 * Axe over the whole page, except elements that are entirely behind the next
 * panel: text nobody can see. Any element with some slice in view stays in
 * the analysis and must have enough contrast.
 *
 * The criterion is per element, not per panel coverage: content is centered,
 * so a panel that is 88% covered may show no text at all, and a panel with
 * tall content may show text even when heavily covered.
 */
async function axeWithoutCoveredText(page: Page) {
  await page.$$eval('main > [data-panel]', (panels) => {
    panels.forEach((panel, i) => {
      const next = panels[i + 1];
      if (!next) {
        return;
      }
      // The visible band of a panel runs from the bottom of the header to the
      // top of the next panel; whatever falls outside it is hidden.
      const nextTop = next.getBoundingClientRect().top;
      const headerBottom = document.querySelector('header')!.getBoundingClientRect().bottom;
      for (const el of Array.from(panel.querySelectorAll<HTMLElement>('*'))) {
        const r = el.getBoundingClientRect();
        const inView = Math.min(r.bottom, nextTop) - Math.max(r.top, headerBottom);
        el.toggleAttribute('data-axe-covered', r.height > 0 && inView <= 0);
      }
    });
  });
  return new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .exclude('[data-axe-covered]')
    .analyze();
}

test('no WCAG A and AA violations', async ({ page }) => {
  await page.goto('/');
  const { violations } = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  expect(violations).toEqual([]);
});

// Review Focus 4: answers must pass contrast and structure checks. With the
// exclusive accordion only one is open at a time, so each one is opened and
// checked separately.
test('no violations with each FAQ answer open, one at a time', async ({ page }) => {
  await page.goto('/');
  const summaries = page.locator('#duvidas summary');
  const total = await summaries.count();
  expect(total).toBeGreaterThan(0);

  for (let i = 0; i < total; i++) {
    await summaries.nth(i).click();
    await expect(page.locator('details[open]')).toHaveCount(1);
    await expect(page.locator('details').nth(i)).toHaveAttribute('open', '');
    await page.waitForTimeout(100);

    const { violations } = await axeWithoutCoveredText(page);
    expect(violations).toEqual([]);
  }
});

// Final review, Important 3: scrolling is free, so the visitor can stop with
// the next panel covering half the screen. The text still showing from the
// panel above must keep its contrast.
test('no violations with scrolling stopped mid-coverage', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/stack-active/);

  const y = await page.evaluate(() => {
    const about = document.querySelector('#sobre')!;
    const end = document.documentElement.scrollHeight;
    for (let v = 0; v <= end; v += 10) {
      window.scrollTo({ top: v, behavior: 'instant' });
      if (about.getBoundingClientRect().top <= window.innerHeight / 2) {
        return v;
      }
    }
    return -1;
  });
  expect(y).toBeGreaterThan(0);
  await page.evaluate((v) => window.scrollTo({ top: v, behavior: 'instant' }), y);

  // wait for the coverage of Services to be computed for this position
  await expect
    .poll(() =>
      page.$eval('#servicos', (s) => Number(s.style.getPropertyValue('--coverage') || 0)),
    )
    .toBeGreaterThan(0.3);

  const { violations } = await axeWithoutCoveredText(page);
  expect(violations).toEqual([]);
});

test('the 404 page has no WCAG A and AA violations', async ({ page }) => {
  await page.goto('/404.html');
  const { violations } = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  expect(violations).toEqual([]);
});
