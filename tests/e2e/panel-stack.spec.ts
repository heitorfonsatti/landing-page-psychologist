import { expect, test } from '@playwright/test';
import { isLastTextReachable, panelSelector, waitForScrollToStop } from './panel-stack-helpers';

const PANELS = ['hero', 'services', 'about', 'how-it-works', 'faq', 'final-cta'];

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/stack-active/);
});

for (const [i, name] of PANELS.entries()) {
  test(`the end of the ${name} panel is reachable`, async ({ page }) => {
    expect(await isLastTextReachable(page, panelSelector(i))).toBe(true);
  });
}

test('the end of the FAQ is reachable with the longest answer open', async ({ page }) => {
  const longest = await page.$$eval('#duvidas details', (list) => {
    const lengths = list.map((d) => d.querySelector('p')?.textContent?.length ?? 0);
    return lengths.indexOf(Math.max(...lengths));
  });
  await page.locator('#duvidas summary').nth(longest).click();
  // wait for the observer to re-measure the panel after opening
  await page.waitForTimeout(100);

  const target = `details:nth-of-type(${longest + 1}) p`;
  expect(await isLastTextReachable(page, '#duvidas', target)).toBe(true);
});

test('the next panel covers the previous one', async ({ page }) => {
  const overlapped = await page.evaluate(() => {
    const services = document.querySelector('#servicos')!;
    const about = document.querySelector('#sobre')!;
    const end = document.documentElement.scrollHeight;
    for (let y = 0; y <= end; y += 20) {
      window.scrollTo({ top: y, behavior: 'instant' });
      const a = services.getBoundingClientRect();
      const b = about.getBoundingClientRect();
      // Adjacent panels in normal flow never overlap; only the stack does that.
      if (b.top > 0 && b.top < a.bottom - 10) {
        return true;
      }
    }
    return false;
  });
  expect(overlapped).toBe(true);
});

test('the covered panel fades', async ({ page }) => {
  // position where About already covers almost all of the visible part of Services
  const y = await page.evaluate(() => {
    const about = document.querySelector('#sobre')!;
    const headerBottom = document.querySelector('header')!.getBoundingClientRect().bottom;
    const end = document.documentElement.scrollHeight;
    for (let v = 0; v <= end; v += 10) {
      window.scrollTo({ top: v, behavior: 'instant' });
      if (about.getBoundingClientRect().top <= headerBottom + 40) {
        return v;
      }
    }
    return -1;
  });
  expect(y).toBeGreaterThan(0);
  await page.evaluate((v) => window.scrollTo({ top: v, behavior: 'instant' }), y);

  const opacity = () =>
    page.$eval('#servicos > *', (el) => Number(getComputedStyle(el).opacity));
  // A strong, visible fade (up to 55%), but the text never vanishes: the floor
  // is opacity 0.45. Contrast is not guaranteed while a panel is being covered.
  await expect.poll(opacity).toBeLessThan(0.6);
  expect(await opacity()).toBeGreaterThanOrEqual(0.449);
});

// Review Focus 1
test('an anchor clicked from the bottom up lands on the heading', async ({ page }) => {
  await page.evaluate(() =>
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }),
  );
  await page.locator('header').getByRole('link', { name: 'Serviços', exact: true }).click();
  await waitForScrollToStop(page);

  const r = await page.evaluate(() => {
    const h2 = document.querySelector('#servicos h2')!.getBoundingClientRect();
    const headerBottom = document.querySelector('header')!.getBoundingClientRect().bottom;
    const hit = document.elementFromPoint(h2.left + h2.width / 2, h2.top + h2.height / 2);
    return {
      inside: Boolean(hit && document.querySelector('#servicos')!.contains(hit)),
      top: h2.top,
      headerBottom,
    };
  });
  expect(r.inside).toBe(true);
  expect(r.top).toBeGreaterThanOrEqual(r.headerBottom - 2);
});

// Review Focus 2
test('no focused element is hidden under another panel', async ({ page }) => {
  await page.evaluate(() =>
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }),
  );

  const hidden: string[] = [];
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press('Tab');
    await waitForScrollToStop(page);
    const r = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body) {
        return { done: true, hidden: false, name: '' };
      }
      if (el.closest('header')) {
        return { done: false, hidden: false, name: '' };
      }
      const box = el.getBoundingClientRect();
      const hit = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
      const visible = Boolean(hit && (hit === el || el.contains(hit)));
      return { done: false, hidden: !visible, name: el.textContent?.trim().slice(0, 40) ?? '' };
    });
    if (r.done) {
      break;
    }
    if (r.hidden) {
      hidden.push(r.name);
    }
  }
  expect(hidden).toEqual([]);
});

// Review Focus 3
test('the stack sticks below the header even when the header grows', async ({ page }, info) => {
  // The header only gains rows on narrow screens; 360px is where the previous
  // review saw it go from 112 to 123px. Running it once is enough.
  test.skip(info.project.name !== 'mobile', 'the scenario is a narrow screen');
  await page.setViewportSize({ width: 360, height: 740 });
  await page.waitForTimeout(150);

  const header = page.locator('header');
  const heightBefore = await header.evaluate((el) => el.getBoundingClientRect().height);
  await page
    .locator('header a')
    .first()
    .evaluate((el) => {
      el.textContent =
        'Maria Aparecida de Albuquerque Rodrigues Figueiredo Santos Nogueira e Vasconcelos';
    });
  await page.waitForTimeout(150);

  // If the header does not actually grow, this test exercises nothing.
  const heightAfter = await header.evaluate((el) => el.getBoundingClientRect().height);
  expect(heightAfter).toBeGreaterThan(heightBefore + 4);

  // A panel at its minimum height is a panel whose content fits on one
  // screen. It must fit entirely below the *real* header: if the minimum
  // height is computed with the constant, a slice is left over, the panel
  // starts sticking by its bottom and its top ends up under the header.
  const overflows = await page.evaluate(() => {
    const base = document.querySelector('header')!.getBoundingClientRect().bottom;
    const usable = window.innerHeight - base;
    return Array.from(document.querySelectorAll<HTMLElement>('main > [data-panel]'))
      .filter((p) => Math.abs(p.offsetHeight - parseFloat(getComputedStyle(p).minHeight)) < 1)
      .filter((p) => p.offsetHeight > usable + 1)
      .map((p) => `${p.id || p.dataset.color}: ${p.offsetHeight}px in ${Math.round(usable)}px`);
  });
  expect(overflows).toEqual([]);
});

// Review Focus 4
test('nothing becomes unreachable after rotating the screen', async ({ page }) => {
  const size = page.viewportSize()!;
  await page.setViewportSize({ width: size.height, height: size.width });
  await page.waitForTimeout(150);
  expect(await isLastTextReachable(page, '#sobre')).toBe(true);
  expect(await isLastTextReachable(page, '#servicos')).toBe(true);
});

// Final review, Important 1
test('a mouse click on a partly visible question opens the answer', async ({ page }) => {
  const index = await page.evaluate(() => {
    const summaries = Array.from(document.querySelectorAll<HTMLElement>('#duvidas summary'));
    const end = document.documentElement.scrollHeight;
    for (let y = 0; y <= end; y += 10) {
      window.scrollTo({ top: y, behavior: 'instant' });
      for (const [i, s] of summaries.entries()) {
        const r = s.getBoundingClientRect();
        // top half on screen, bottom half off screen
        if (r.top < window.innerHeight - 6 && r.bottom > window.innerHeight + 2) {
          const hit = document.elementFromPoint(r.left + 20, r.top + 3);
          if (hit && s.contains(hit)) return i;
        }
      }
    }
    return -1;
  });
  expect(index).toBeGreaterThanOrEqual(0);
  const r = await page.locator('#duvidas summary').nth(index).boundingBox();
  await page.mouse.click(r!.x + 20, r!.y + 3);
  await expect(page.locator('#duvidas details').nth(index)).toHaveAttribute('open', '');
});

// Final review, Important 2
test('after activating an anchor, the next Tab goes into the section', async ({ page }) => {
  await page.evaluate(() =>
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }),
  );
  await page.locator('header').getByRole('link', { name: 'Serviços', exact: true }).press('Enter');
  await waitForScrollToStop(page);
  await expect(page.locator(':target')).toHaveAttribute('id', 'servicos');
  await page.keyboard.press('Tab');
  const inside = await page.evaluate(
    () =>
      document.querySelector('#servicos')!.contains(document.activeElement) ||
      document.querySelector('#servicos')!.compareDocumentPosition(document.activeElement!) &
        Node.DOCUMENT_POSITION_FOLLOWING,
  );
  expect(Boolean(inside)).toBe(true);
});

// Final review, Important 2
test('a hash change without a click also shows the section uncovered', async ({ page }) => {
  await page.evaluate(() =>
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }),
  );
  await page.evaluate(() => {
    window.location.hash = '#servicos';
  });
  await waitForScrollToStop(page);
  const r = await page.evaluate(() => {
    const h2 = document.querySelector('#servicos h2')!.getBoundingClientRect();
    const headerBottom = document.querySelector('header')!.getBoundingClientRect().bottom;
    const hit = document.elementFromPoint(h2.left + h2.width / 2, h2.top + h2.height / 2);
    return {
      inside: Boolean(hit && document.querySelector('#servicos')!.contains(hit)),
      top: h2.top,
      headerBottom,
    };
  });
  expect(r.inside).toBe(true);
  expect(r.top).toBeGreaterThanOrEqual(r.headerBottom - 2);
});
