import type { Page } from '@playwright/test';

/** Seletor CSS da parte `i` (base zero) dentro de `<main>`. */
export function seletorParte(i: number): string {
  return `main > [data-parte]:nth-of-type(${i + 1})`;
}

/** Espera a rolagem da janela assentar: duas leituras iguais de `scrollY`. */
export async function esperarScrollParar(page: Page): Promise<void> {
  // Zera a leitura anterior: uma leitura velha, de outra espera, faria a
  // primeira comparação dar "parado" antes de a nova rolagem começar.
  await page.evaluate(() => {
    delete (window as unknown as { __ultimoScrollY?: number }).__ultimoScrollY;
  });
  await page.waitForTimeout(50);
  await page.waitForFunction(
    () => {
      const janela = window as unknown as { __ultimoScrollY?: number };
      const atual = window.scrollY;
      const anterior = janela.__ultimoScrollY;
      janela.__ultimoScrollY = atual;
      return anterior !== undefined && Math.abs(anterior - atual) < 0.5;
    },
    undefined,
    { polling: 100, timeout: 5_000 },
  );
}

/**
 * Rola a página inteira, de 40 em 40px, e diz se o texto final de uma parte
 * fica, em algum momento, inteiro na tela, abaixo do cabeçalho e sem outra
 * parte por cima.
 *
 * O alvo padrão é o último elemento visível da parte que tem texto próprio.
 * `seletorAlvo` escolhe outro alvo dentro da parte, como uma resposta aberta.
 */
export async function ultimoTextoAlcancavel(
  page: Page,
  seletorDaParte: string,
  seletorAlvo?: string,
): Promise<boolean> {
  return page.evaluate(
    ({ sp, sa }) => {
      const parte = document.querySelector<HTMLElement>(sp);
      if (!parte) {
        throw new Error(`parte não encontrada: ${sp}`);
      }

      const temTextoProprio = (el: Element) =>
        Array.from(el.childNodes).some(
          (n) => n.nodeType === Node.TEXT_NODE && (n.textContent ?? '').trim() !== '',
        );

      const alvo = sa
        ? parte.querySelector<HTMLElement>(sa)
        : Array.from(parte.querySelectorAll<HTMLElement>('*'))
            .filter((el) => temTextoProprio(el) && el.getClientRects().length > 0)
            .at(-1);
      if (!alvo) {
        throw new Error(`alvo não encontrado em ${sp}`);
      }

      const cabecalho = document.querySelector('header');
      const fim = document.documentElement.scrollHeight;

      for (let y = 0; y <= fim; y += 40) {
        window.scrollTo({ top: y, behavior: 'instant' });
        const alturaCabecalho = cabecalho ? cabecalho.getBoundingClientRect().bottom : 0;
        const r = alvo.getBoundingClientRect();
        if (r.top < alturaCabecalho - 1 || r.bottom > window.innerHeight + 1) {
          continue;
        }
        const noPonto = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        if (noPonto && parte.contains(noPonto)) {
          return true;
        }
      }
      return false;
    },
    { sp: seletorDaParte, sa: seletorAlvo },
  );
}
