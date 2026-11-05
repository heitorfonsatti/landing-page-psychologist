import { expect, test } from '@playwright/test';
import {
  esperarScrollParar,
  seletorParte,
  ultimoTextoAlcancavel,
} from './pilha-helpers';

const PARTES = ['abertura', 'servicos', 'sobre', 'como-funciona', 'duvidas', 'chamada-final'];

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/pilha-ativa/);
});

for (const [i, nome] of PARTES.entries()) {
  test(`o fim da parte ${nome} é alcançável`, async ({ page }) => {
    expect(await ultimoTextoAlcancavel(page, seletorParte(i))).toBe(true);
  });
}

test('o fim das Dúvidas é alcançável com a maior resposta aberta', async ({ page }) => {
  const indiceMaior = await page.$$eval('#duvidas details', (lista) => {
    const tamanhos = lista.map((d) => d.querySelector('p')?.textContent?.length ?? 0);
    return tamanhos.indexOf(Math.max(...tamanhos));
  });
  await page.locator('#duvidas summary').nth(indiceMaior).click();
  // espera o observador remedir a parte depois de abrir
  await page.waitForTimeout(100);

  const alvo = `details:nth-of-type(${indiceMaior + 1}) p`;
  expect(await ultimoTextoAlcancavel(page, '#duvidas', alvo)).toBe(true);
});

test('a parte seguinte cobre a anterior', async ({ page }) => {
  const sobrepos = await page.evaluate(() => {
    const servicos = document.querySelector('#servicos')!;
    const sobre = document.querySelector('#sobre')!;
    const fim = document.documentElement.scrollHeight;
    for (let y = 0; y <= fim; y += 20) {
      window.scrollTo({ top: y, behavior: 'instant' });
      const a = servicos.getBoundingClientRect();
      const b = sobre.getBoundingClientRect();
      // Partes adjacentes em fluxo normal nunca se sobrepõem; só a pilha faz isso.
      if (b.top > 0 && b.top < a.bottom - 10) {
        return true;
      }
    }
    return false;
  });
  expect(sobrepos).toBe(true);
});

test('a parte coberta esmaece', async ({ page }) => {
  // posição em que Sobre já cobre quase toda a parte visível de Serviços
  const y = await page.evaluate(() => {
    const sobre = document.querySelector('#sobre')!;
    const cabecalho = document.querySelector('header')!.getBoundingClientRect().bottom;
    const fim = document.documentElement.scrollHeight;
    for (let v = 0; v <= fim; v += 10) {
      window.scrollTo({ top: v, behavior: 'instant' });
      const topo = sobre.getBoundingClientRect().top;
      if (topo <= cabecalho + 40) {
        return v;
      }
    }
    return -1;
  });
  expect(y).toBeGreaterThan(0);
  await page.evaluate((v) => window.scrollTo({ top: v, behavior: 'instant' }), y);

  await expect
    .poll(() =>
      page.$eval('#servicos > *', (el) => Number(getComputedStyle(el).opacity)),
    )
    .toBeLessThan(0.5);
});

// Review Focus 1
test('âncora clicada de baixo para cima leva ao título', async ({ page }) => {
  await page.evaluate(() =>
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }),
  );
  await page.locator('header').getByRole('link', { name: 'Serviços', exact: true }).click();
  await esperarScrollParar(page);

  const r = await page.evaluate(() => {
    const h2 = document.querySelector('#servicos h2')!.getBoundingClientRect();
    const cabecalho = document.querySelector('header')!.getBoundingClientRect().bottom;
    const noPonto = document.elementFromPoint(h2.left + h2.width / 2, h2.top + h2.height / 2);
    return {
      dentro: Boolean(noPonto && document.querySelector('#servicos')!.contains(noPonto)),
      topo: h2.top,
      cabecalho,
    };
  });
  expect(r.dentro).toBe(true);
  expect(r.topo).toBeGreaterThanOrEqual(r.cabecalho - 2);
});

// Review Focus 2
test('nenhum elemento focado fica escondido sob outra parte', async ({ page }) => {
  await page.evaluate(() =>
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }),
  );

  const escondidos: string[] = [];
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press('Tab');
    await esperarScrollParar(page);
    const r = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body) {
        return { fim: true, escondido: false, nome: '' };
      }
      if (el.closest('header')) {
        return { fim: false, escondido: false, nome: '' };
      }
      const caixa = el.getBoundingClientRect();
      const noPonto = document.elementFromPoint(
        caixa.left + caixa.width / 2,
        caixa.top + caixa.height / 2,
      );
      const visivel = Boolean(noPonto && (noPonto === el || el.contains(noPonto)));
      return { fim: false, escondido: !visivel, nome: el.textContent?.trim().slice(0, 40) ?? '' };
    });
    if (r.fim) {
      break;
    }
    if (r.escondido) {
      escondidos.push(r.nome);
    }
  }
  expect(escondidos).toEqual([]);
});

// Review Focus 3
test('a pilha gruda abaixo do cabeçalho mesmo quando ele cresce', async ({ page }, info) => {
  // O cabeçalho só ganha linhas em tela estreita; 360px é o caso em que a
  // revisão anterior o viu passar de 112 para 123px. Basta rodar uma vez.
  test.skip(info.project.name !== 'celular', 'o cenário é de tela estreita');
  await page.setViewportSize({ width: 360, height: 740 });
  await page.waitForTimeout(150);

  const cabecalho = page.locator('header');
  const alturaAntes = await cabecalho.evaluate((el) => el.getBoundingClientRect().height);
  await page
    .locator('header a')
    .first()
    .evaluate((el) => {
      el.textContent =
        'Maria Aparecida de Albuquerque Rodrigues Figueiredo Santos Nogueira e Vasconcelos';
    });
  await page.waitForTimeout(150);

  // Sem o cabeçalho crescer de fato, este teste não exercita nada.
  const alturaDepois = await cabecalho.evaluate((el) => el.getBoundingClientRect().height);
  expect(alturaDepois).toBeGreaterThan(alturaAntes + 4);

  // Uma parte na altura mínima é uma parte cujo conteúdo cabe numa tela. Ela
  // precisa caber inteira abaixo do cabeçalho *real*: se a altura mínima for
  // calculada com a constante, sobra um pedaço, a parte passa a grudar pelo
  // pé e o topo dela fica escondido sob o cabeçalho.
  const sobras = await page.evaluate(() => {
    const base = document.querySelector('header')!.getBoundingClientRect().bottom;
    const areaUtil = window.innerHeight - base;
    return Array.from(document.querySelectorAll<HTMLElement>('main > [data-parte]'))
      .filter((p) => Math.abs(p.offsetHeight - parseFloat(getComputedStyle(p).minHeight)) < 1)
      .filter((p) => p.offsetHeight > areaUtil + 1)
      .map((p) => `${p.id || p.dataset.cor}: ${p.offsetHeight}px numa área de ${Math.round(areaUtil)}px`);
  });
  expect(sobras).toEqual([]);
});

// Review Focus 4
test('nada fica inalcançável depois de girar a tela', async ({ page }) => {
  const tamanho = page.viewportSize()!;
  await page.setViewportSize({ width: tamanho.height, height: tamanho.width });
  await page.waitForTimeout(150);
  expect(await ultimoTextoAlcancavel(page, '#sobre')).toBe(true);
  expect(await ultimoTextoAlcancavel(page, '#servicos')).toBe(true);
});
