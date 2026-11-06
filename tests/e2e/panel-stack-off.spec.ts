import { expect, test, type Page } from '@playwright/test';
import { isLastTextReachable, panelSelector } from './panel-stack-helpers';

const PANEL_COUNT = 6;

async function expectNoPanelSticks(page: Page): Promise<void> {
  const positions = await page.$$eval('main > [data-panel]', (panels) =>
    panels.map((p) => getComputedStyle(p).position),
  );
  expect(positions).toHaveLength(PANEL_COUNT);
  expect(positions).not.toContain('sticky');
}

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('no panel sticks and all text is reachable', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).not.toHaveClass(/stack-active/);
    await expectNoPanelSticks(page);
    for (let i = 0; i < PANEL_COUNT; i++) {
      expect(await isLastTextReachable(page, panelSelector(i)), `panel ${i}`).toBe(true);
    }
  });
});

test('with reduced motion, nothing sticks or fades', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('html')).not.toHaveClass(/stack-active/);
  await expectNoPanelSticks(page);

  await page.evaluate(() =>
    window.scrollTo({ top: document.documentElement.scrollHeight / 2, behavior: 'instant' }),
  );
  await page.waitForTimeout(100);
  const opacities = await page.$$eval('main > [data-panel] > *', (children) =>
    children.map((c) => getComputedStyle(c).opacity),
  );
  expect(new Set(opacities)).toEqual(new Set(['1']));

  const transition = await page
    .locator('main a[href^="https://wa.me/"]')
    .first()
    .evaluate((el) => getComputedStyle(el).transitionDuration);
  expect(transition).toBe('0s');
});

// Review Focus 5
test('the effect follows a preference changed while the page is open', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const html = page.locator('html');
  await expect(html).toHaveClass(/stack-active/);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(html).not.toHaveClass(/stack-active/);
  await expectNoPanelSticks(page);

  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(html).toHaveClass(/stack-active/);
});
