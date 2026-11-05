import { expect, test, type Page } from '@playwright/test';
import { seletorParte, ultimoTextoAlcancavel } from './pilha-helpers';

const TOTAL_PARTES = 6;

async function nenhumaParteGruda(page: Page): Promise<void> {
  const posicoes = await page.$$eval('main > [data-parte]', (partes) =>
    partes.map((p) => getComputedStyle(p).position),
  );
  expect(posicoes).toHaveLength(TOTAL_PARTES);
  expect(posicoes).not.toContain('sticky');
}

test.describe('sem JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('nenhuma parte gruda e todo texto é alcançável', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).not.toHaveClass(/pilha-ativa/);
    await nenhumaParteGruda(page);
    for (let i = 0; i < TOTAL_PARTES; i++) {
      expect(await ultimoTextoAlcancavel(page, seletorParte(i)), `parte ${i}`).toBe(true);
    }
  });
});

test('com movimento reduzido, nada gruda nem esmaece', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('html')).not.toHaveClass(/pilha-ativa/);
  await nenhumaParteGruda(page);

  await page.evaluate(() =>
    window.scrollTo({ top: document.documentElement.scrollHeight / 2, behavior: 'instant' }),
  );
  await page.waitForTimeout(100);
  const opacidades = await page.$$eval('main > [data-parte] > *', (filhos) =>
    filhos.map((f) => getComputedStyle(f).opacity),
  );
  expect(new Set(opacidades)).toEqual(new Set(['1']));

  const transicao = await page
    .locator('main a[href^="https://wa.me/"]')
    .first()
    .evaluate((el) => getComputedStyle(el).transitionDuration);
  expect(transicao).toBe('0s');
});

// Review Focus 5
test('o efeito acompanha a preferência mudada com a página aberta', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const html = page.locator('html');
  await expect(html).toHaveClass(/pilha-ativa/);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(html).not.toHaveClass(/pilha-ativa/);
  await nenhumaParteGruda(page);

  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(html).toHaveClass(/pilha-ativa/);
});
