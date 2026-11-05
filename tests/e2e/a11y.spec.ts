import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const TAGS_WCAG = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

/**
 * Axe sobre a página inteira, exceto os elementos que estão inteiros atrás
 * da parte seguinte — texto que ninguém vê. Qualquer elemento com algum
 * pedaço à vista continua na análise e precisa ter contraste.
 *
 * O critério é por elemento, não pela cobertura da parte: o conteúdo fica
 * centralizado, então uma parte 88% coberta pode não mostrar texto nenhum, e
 * uma parte de conteúdo alto pode mostrar texto mesmo bem coberta.
 */
async function axeSemTextoCoberto(page: Page) {
  await page.$$eval('main > [data-parte]', (partes) => {
    partes.forEach((parte, i) => {
      const proxima = partes[i + 1];
      if (!proxima) {
        return;
      }
      // A faixa à vista de uma parte vai do fundo do cabeçalho até o topo da
      // parte seguinte; o que fica fora dela está escondido.
      const topoProxima = proxima.getBoundingClientRect().top;
      const baseCabecalho = document.querySelector('header')!.getBoundingClientRect().bottom;
      for (const el of Array.from(parte.querySelectorAll<HTMLElement>('*'))) {
        const r = el.getBoundingClientRect();
        const aVista = Math.min(r.bottom, topoProxima) - Math.max(r.top, baseCabecalho);
        el.toggleAttribute('data-axe-coberto', r.height > 0 && aVista <= 0);
      }
    });
  });
  return new AxeBuilder({ page })
    .withTags(TAGS_WCAG)
    .exclude('[data-axe-coberto]')
    .analyze();
}

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
    await page.waitForTimeout(100);

    const { violations } = await axeSemTextoCoberto(page);
    expect(violations).toEqual([]);
  }
});

// Revisão final, Important 3: a rolagem é livre, então a visitante pode parar
// com a parte seguinte cobrindo metade da tela. O texto que ainda aparece da
// parte de cima precisa manter o contraste.
test('sem violações com a rolagem parada no meio de uma cobertura', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/pilha-ativa/);

  const y = await page.evaluate(() => {
    const sobre = document.querySelector('#sobre')!;
    const fim = document.documentElement.scrollHeight;
    for (let v = 0; v <= fim; v += 10) {
      window.scrollTo({ top: v, behavior: 'instant' });
      if (sobre.getBoundingClientRect().top <= window.innerHeight / 2) {
        return v;
      }
    }
    return -1;
  });
  expect(y).toBeGreaterThan(0);
  await page.evaluate((v) => window.scrollTo({ top: v, behavior: 'instant' }), y);

  // espera a cobertura de Serviços ser calculada para esta posição
  await expect
    .poll(() =>
      page.$eval('#servicos', (s) => Number(s.style.getPropertyValue('--cobertura') || 0)),
    )
    .toBeGreaterThan(0.3);

  const { violations } = await axeSemTextoCoberto(page);
  expect(violations).toEqual([]);
});

test('a página 404 não tem violações WCAG A e AA', async ({ page }) => {
  await page.goto('/404.html');
  const { violations } = await new AxeBuilder({ page }).withTags(TAGS_WCAG).analyze();
  expect(violations).toEqual([]);
});
