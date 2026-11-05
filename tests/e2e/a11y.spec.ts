import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const TAGS_WCAG = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

test('sem violações WCAG A e AA', async ({ page }) => {
  await page.goto('/');
  const { violations } = await new AxeBuilder({ page }).withTags(TAGS_WCAG).analyze();
  expect(violations).toEqual([]);
});

// Review Focus 4: com as dúvidas fechadas, as respostas nunca passariam
// por contraste nem por estrutura.
test('sem violações com todas as dúvidas abertas', async ({ page }) => {
  await page.goto('/');
  await page.$$eval('details', (lista) => {
    for (const detalhe of lista) {
      detalhe.setAttribute('open', '');
    }
  });
  await expect(page.locator('details[open]')).not.toHaveCount(0);

  const { violations } = await new AxeBuilder({ page }).withTags(TAGS_WCAG).analyze();
  expect(violations).toEqual([]);
});

test('a página 404 não tem violações WCAG A e AA', async ({ page }) => {
  await page.goto('/404.html');
  const { violations } = await new AxeBuilder({ page }).withTags(TAGS_WCAG).analyze();
  expect(violations).toEqual([]);
});
