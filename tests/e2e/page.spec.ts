import { expect, test, type Page } from '@playwright/test';
import { siteContent } from '@/content/site';
import { buildWhatsAppLink } from '@/lib/whatsapp';

/** Waits for two consecutive equal readings of the element's top. */
async function waitForScrollToSettle(page: Page, selector: string): Promise<void> {
  await page.waitForFunction(
    (sel) => {
      const target = document.querySelector(sel);
      if (!target) return false;
      const win = window as unknown as { __lastTop?: number };
      const top = target.getBoundingClientRect().top;
      const previous = win.__lastTop;
      win.__lastTop = top;
      return previous !== undefined && Math.abs(previous - top) < 0.5;
    },
    selector,
    { polling: 100, timeout: 5_000 },
  );
}

const EXPECTED_LINK = buildWhatsAppLink(
  siteContent.whatsappNumber,
  siteContent.whatsappMessage,
);

const ANCHORS = [
  { name: 'Sobre mim', hash: '#sobre', heading: siteContent.about.title },
  { name: 'Serviços', hash: '#servicos', heading: siteContent.services.adults.title },
  { name: 'Dúvidas', hash: '#duvidas', heading: siteContent.faq.title },
] as const;

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('the page loads in pt-BR with a single h1', async ({ page }) => {
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  const h1 = page.locator('h1');
  await expect(h1).toHaveCount(1);
  await expect(h1).toBeVisible();
  await expect(h1).toHaveText(siteContent.hero.headline);
});

for (const { name, hash, heading } of ANCHORS) {
  test(`the ${hash} anchor scrolls to the heading without hiding it under the header`, async ({
    page,
  }) => {
    await page.getByRole('link', { name, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${hash}$`));

    // Scrolling is smooth: wait for it to settle before measuring. Otherwise
    // the reading catches the section still far from the top and the
    // assertion proves nothing.
    await waitForScrollToSettle(page, hash);

    const headerBox = await page.locator('header').boundingBox();
    const sectionBox = await page.locator(hash).boundingBox();
    const headingBox = await page
      .getByRole('heading', { level: 2, name: heading, exact: true })
      .boundingBox();

    expect(headerBox).not.toBeNull();
    expect(sectionBox).not.toBeNull();
    expect(headingBox).not.toBeNull();

    // The section top is what `scroll-margin-top` controls. Measuring only the
    // heading lets through sections whose h2 already starts far from the top.
    expect(sectionBox!.y).toBeGreaterThanOrEqual(headerBox!.height - 2);
    expect(headingBox!.y).toBeGreaterThanOrEqual(headerBox!.height - 2);
  });
}

test('every button points to WhatsApp with the right number and message', async ({ page }) => {
  const links = page.locator('a[href^="https://wa.me/"]');
  const total = await links.count();
  expect(total).toBeGreaterThanOrEqual(3);

  for (let i = 0; i < total; i++) {
    await expect(links.nth(i)).toHaveAttribute('href', EXPECTED_LINK);
  }
});

test('there is no horizontal scrolling', async ({ page }) => {
  const overflow = await page.evaluate(() => {
    const root = document.documentElement;
    return root.scrollWidth - root.clientWidth;
  });
  expect(overflow).toBeLessThanOrEqual(0);
});

test('the emergency notice with CVV and SAMU is visible', async ({ page }) => {
  const notice = page.getByText(siteContent.footer.emergencyNotice);
  await expect(notice).toBeVisible();
  await expect(notice).toContainText('188');
  await expect(notice).toContainText('192');
});

test('the CRP appears in the hero and in the footer', async ({ page }) => {
  await expect(page.getByText(`CRP ${siteContent.crp}`)).toHaveCount(2);
});

test('the privacy notice is visible', async ({ page }) => {
  await expect(page.getByText(siteContent.footer.privacyNotice)).toBeVisible();
});

test('the 404 page links home and has no clinical content', async ({ page }) => {
  await page.goto('/404.html');
  await expect(page.getByRole('link', { name: /início|principal/i })).toHaveAttribute('href', '/');
  await expect(page.locator('a[href^="https://wa.me/"]')).toHaveCount(0);
  await expect(page.getByText(/CRP/)).toHaveCount(0);
});

const BEIGE = 'rgb(242, 239, 226)';
const BROWN = 'rgb(120, 81, 53)';

test('panels alternate beige and brown, text always the opposite', async ({ page }) => {
  const colors = await page.$$eval('main > [data-panel]', (panels) =>
    panels.map((p) => {
      const style = getComputedStyle(p);
      return [style.backgroundColor, style.color];
    }),
  );
  expect(colors).toEqual([
    [BEIGE, BROWN],
    [BROWN, BEIGE],
    [BEIGE, BROWN],
    [BROWN, BEIGE],
    [BEIGE, BROWN],
    [BROWN, BEIGE],
    [BEIGE, BROWN],
  ]);

  const footer = await page.$eval('footer', (f) => {
    const style = getComputedStyle(f);
    return [style.backgroundColor, style.color];
  });
  expect(footer).toEqual([BROWN, BEIGE]);
});

// Review Focus 1: the focus ring must stay visible on a brown panel.
test('focus ring is beige on a brown panel', async ({ page }) => {
  const button = page.locator('main > [data-panel][data-color="brown"]').first().getByRole('button').first();
  await page.keyboard.press('Tab');
  await button.focus();
  await expect(button).toBeFocused();
  expect(await button.evaluate((el) => getComputedStyle(el).outlineColor)).toBe(BEIGE);
});
