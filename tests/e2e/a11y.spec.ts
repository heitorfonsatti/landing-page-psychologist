import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const TAGS_WCAG = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

test('sem violações WCAG A e AA', async ({ page }) => {
  await page.goto('/');
  const { violations } = await new AxeBuilder({ page }).withTags(TAGS_WCAG).analyze();
  expect(violations).toEqual([]);
});

// Review Focus 4: as respostas precisam passar por contraste e estrutura.
// Com o acordeão exclusivo só uma fica aberta por vez, então cada uma é
// aberta e verificada separadamente.
test('sem violações com cada dúvida aberta, uma por vez', async ({ page }) => {
  await page.goto('/');
  const resumos = page.locator('#duvidas summary');
  const total = await resumos.count();
  expect(total).toBeGreaterThan(0);

  for (let i = 0; i < total; i++) {
    await resumos.nth(i).click();
    await expect(page.locator('details[open]')).toHaveCount(1);
    await expect(page.locator('details').nth(i)).toHaveAttribute('open', '');

    const { violations } = await new AxeBuilder({ page }).withTags(TAGS_WCAG).analyze();
    expect(violations).toEqual([]);
  }
});

test('a página 404 não tem violações WCAG A e AA', async ({ page }) => {
  await page.goto('/404.html');
  const { violations } = await new AxeBuilder({ page }).withTags(TAGS_WCAG).analyze();
  expect(violations).toEqual([]);
});
