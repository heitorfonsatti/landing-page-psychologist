import { expect, test, type Page } from '@playwright/test';
import { siteContent } from '@/content/site';
import { buildWhatsAppLink } from '@/lib/whatsapp';

/** Espera duas medições consecutivas iguais do topo do elemento. */
async function esperarRolagemParar(page: Page, seletor: string): Promise<void> {
  await page.waitForFunction(
    (sel) => {
      const alvo = document.querySelector(sel);
      if (!alvo) return false;
      const janela = window as unknown as { __ultimoTopo?: number };
      const topo = alvo.getBoundingClientRect().top;
      const anterior = janela.__ultimoTopo;
      janela.__ultimoTopo = topo;
      return anterior !== undefined && Math.abs(anterior - topo) < 0.5;
    },
    seletor,
    { polling: 100, timeout: 5_000 },
  );
}

const LINK_ESPERADO = buildWhatsAppLink(
  siteContent.whatsappNumber,
  siteContent.whatsappMessage,
);

const ANCORAS = [
  { nome: 'Sobre mim', hash: '#sobre', titulo: siteContent.about.title },
  { nome: 'Serviços', hash: '#servicos', titulo: siteContent.services.title },
  { nome: 'Dúvidas', hash: '#duvidas', titulo: siteContent.faq.title },
] as const;

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('a página carrega em pt-BR com um único h1', async ({ page }) => {
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  const h1 = page.locator('h1');
  await expect(h1).toHaveCount(1);
  await expect(h1).toBeVisible();
  await expect(h1).toHaveText(siteContent.hero.headline);
});

for (const { nome, hash, titulo } of ANCORAS) {
  test(`a âncora ${hash} rola até o título sem ficar sob o cabeçalho`, async ({ page }) => {
    await page.getByRole('link', { name: nome, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${hash}$`));

    // A rolagem é suave: esperar ela assentar antes de medir. Sem isso a
    // medição pega a seção ainda longe do topo e a asserção não vale nada.
    await esperarRolagemParar(page, hash);

    const caixaCabecalho = await page.locator('header').boundingBox();
    const caixaSecao = await page.locator(hash).boundingBox();
    const caixaTitulo = await page
      .getByRole('heading', { level: 2, name: titulo, exact: true })
      .boundingBox();

    expect(caixaCabecalho).not.toBeNull();
    expect(caixaSecao).not.toBeNull();
    expect(caixaTitulo).not.toBeNull();

    // O topo da seção é o que o `scroll-margin-top` controla — medir só o
    // título deixa passar seções cujo h2 já nasce longe do topo.
    expect(caixaSecao!.y).toBeGreaterThanOrEqual(caixaCabecalho!.height - 2);
    expect(caixaTitulo!.y).toBeGreaterThanOrEqual(caixaCabecalho!.height - 2);
  });
}

test('todos os botões apontam para o WhatsApp com número e mensagem corretos', async ({
  page,
}) => {
  const links = page.locator('a[href^="https://wa.me/"]');
  const total = await links.count();
  expect(total).toBeGreaterThanOrEqual(3);

  for (let i = 0; i < total; i++) {
    await expect(links.nth(i)).toHaveAttribute('href', LINK_ESPERADO);
  }
});

test('não há rolagem horizontal', async ({ page }) => {
  const estourou = await page.evaluate(() => {
    const raiz = document.documentElement;
    return raiz.scrollWidth - raiz.clientWidth;
  });
  expect(estourou).toBeLessThanOrEqual(0);
});

test('o aviso de emergência com CVV e SAMU está visível', async ({ page }) => {
  const aviso = page.getByText(siteContent.footer.emergencyNotice);
  await expect(aviso).toBeVisible();
  await expect(aviso).toContainText('188');
  await expect(aviso).toContainText('192');
});

test('o CRP aparece na abertura e no rodapé', async ({ page }) => {
  await expect(page.getByText(`CRP ${siteContent.crp}`)).toHaveCount(2);
});

test('o aviso de privacidade está visível', async ({ page }) => {
  await expect(page.getByText(siteContent.footer.privacyNotice)).toBeVisible();
});

test('a página 404 volta para o início e não traz conteúdo clínico', async ({ page }) => {
  await page.goto('/404.html');
  await expect(page.getByRole('link', { name: /início|principal/i })).toHaveAttribute('href', '/');
  await expect(page.locator('a[href^="https://wa.me/"]')).toHaveCount(0);
  await expect(page.getByText(/CRP/)).toHaveCount(0);
});
