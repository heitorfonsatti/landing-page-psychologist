'use client';

import { useEffect } from 'react';
import { cobertura, rolagemParaMostrar } from '@/lib/pilha';

/** Classe no `<html>` que liga o CSS da pilha em `globals.css`. */
export const CLASSE_PILHA = 'pilha-ativa';

const SELETOR_PARTE = '[data-parte]';
const CONSULTA_MOVIMENTO_REDUZIDO = '(prefers-reduced-motion: reduce)';

/**
 * Liga a pilha de partes inteiras: cada parte gruda e é coberta pela seguinte.
 *
 * O CSS não sabe a altura de um elemento, e é dela que depende o ponto em que
 * uma parte alta gruda (pelo pé, depois de mostrar todo o conteúdo). Este
 * componente mede as partes e o cabeçalho, escreve as medidas em variáveis CSS,
 * calcula quanto de cada parte já foi coberto e liga a classe da pilha.
 *
 * Com "reduzir movimento" ligado, sem `matchMedia` ou sem `ResizeObserver`,
 * a pilha fica desligada e a página rola normalmente.
 */
export function Pilha(): null {
  useEffect(() => {
    if (typeof window.matchMedia !== 'function' || typeof window.ResizeObserver !== 'function') {
      return;
    }

    const raiz = document.documentElement;
    const midia = window.matchMedia(CONSULTA_MOVIMENTO_REDUZIDO);
    const partes = Array.from(document.querySelectorAll<HTMLElement>(SELETOR_PARTE));
    const cabecalho = document.querySelector<HTMLElement>('header');

    let quadro = 0;

    const alturaCabecalho = () => cabecalho?.offsetHeight ?? 0;

    const medirCabecalho = () => {
      raiz.style.setProperty('--altura-cabecalho-medida', `${alturaCabecalho()}px`);
    };

    const medirPartes = () => {
      for (const parte of partes) {
        parte.style.setProperty('--altura-parte', `${parte.offsetHeight}px`);
      }
    };

    const pintarCobertura = () => {
      quadro = 0;
      const alturaTela = window.innerHeight;
      const topoCabecalho = alturaCabecalho();
      partes.forEach((parte, i) => {
        const proxima = partes[i + 1];
        if (!proxima) {
          return;
        }
        const topoVisivel = Math.max(parte.getBoundingClientRect().top, topoCabecalho);
        const valor = cobertura(proxima.getBoundingClientRect().top, topoVisivel, alturaTela);
        parte.style.setProperty('--cobertura', valor.toFixed(3));
      });
    };

    const agendarCobertura = () => {
      if (quadro === 0) {
        quadro = window.requestAnimationFrame(pintarCobertura);
      }
    };

    const limparCobertura = () => {
      for (const parte of partes) {
        parte.style.removeProperty('--cobertura');
      }
    };

    /* -------- âncoras e foco --------
       O navegador rola até a posição atual de uma parte grudada, que já está
       na tela — só que coberta —, e conclui que não precisa rolar. Aqui a
       rolagem é calculada a partir da posição natural da parte. */

    const principal = partes[0]?.parentElement ?? null;

    const topoNaturalDe = (indice: number): number => {
      if (!principal) {
        return 0;
      }
      let topo =
        principal.getBoundingClientRect().top +
        window.scrollY +
        parseFloat(window.getComputedStyle(principal).paddingTop);
      for (let k = 0; k < indice; k++) {
        topo += partes[k]?.offsetHeight ?? 0;
      }
      return topo;
    };

    const rolarPara = (alvo: HTMLElement, comportamento: ScrollBehavior): boolean => {
      const parte = alvo.closest<HTMLElement>(SELETOR_PARTE);
      const indice = parte ? partes.indexOf(parte) : -1;
      if (!parte || indice < 0) {
        return false;
      }
      const deslocamento =
        alvo === parte ? 0 : alvo.getBoundingClientRect().top - parte.getBoundingClientRect().top;
      window.scrollTo({
        top: rolagemParaMostrar({
          topoNatural: topoNaturalDe(indice),
          alturaParte: parte.offsetHeight,
          deslocamento,
          alturaTela: window.innerHeight,
          topo: alturaCabecalho(),
        }),
        behavior: comportamento,
      });
      return true;
    };

    /* A navegação por âncora fica nativa — o navegador marca o alvo
       (`:target`), põe o ponto de partida do Tab dentro da seção e cuida do
       histórico. Depois dela, só a posição é corrigida. */
    const corrigirAncora = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      const alvo = id ? document.getElementById(id) : null;
      if (alvo) {
        rolarPara(alvo, 'smooth');
      }
    };

    const aoClicar = (evento: MouseEvent) => {
      const link = (evento.target as Element | null)?.closest?.('a[href^="#"]');
      if (link && !evento.defaultPrevented) {
        // Clicar de novo na mesma âncora não dispara `hashchange`.
        window.requestAnimationFrame(corrigirAncora);
      }
    };

    const visivel = (el: HTMLElement): boolean => {
      const r = el.getBoundingClientRect();
      if (r.top < alturaCabecalho() - 1 || r.bottom > window.innerHeight + 1) {
        return false;
      }
      const noPonto = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return Boolean(noPonto && (noPonto === el || el.contains(noPonto)));
    };

    /* Só foco de teclado. Com o mouse o navegador foca no mousedown; rolar
       ali tiraria o elemento de baixo do cursor e o clique se perderia.
       Espera um quadro para deixar o navegador fazer a rolagem dele primeiro
       e só corrige se, depois dela, o elemento ainda estiver escondido. */
    const aoFocar = (evento: FocusEvent) => {
      const el = evento.target;
      if (!(el instanceof HTMLElement)) {
        return;
      }
      window.requestAnimationFrame(() => {
        if (document.activeElement === el && el.matches(':focus-visible') && !visivel(el)) {
          rolarPara(el, 'instant');
        }
      });
    };

    let ativa = false;

    // Medir o cabeçalho não é movimento: vale também com a pilha desligada,
    // para o conteúdo sempre começar abaixo da altura real dele.
    const observadorCabecalho = new window.ResizeObserver(() => {
      medirCabecalho();
      if (ativa) {
        agendarCobertura();
      }
    });

    const observadorPartes = new window.ResizeObserver(() => {
      medirPartes();
      agendarCobertura();
    });

    const ligar = () => {
      ativa = true;
      medirPartes();
      raiz.classList.add(CLASSE_PILHA);
      partes.forEach((parte) => observadorPartes.observe(parte));
      window.addEventListener('scroll', agendarCobertura, { passive: true });
      window.addEventListener('resize', agendarCobertura);
      window.addEventListener('hashchange', corrigirAncora);
      document.addEventListener('click', aoClicar);
      document.addEventListener('focusin', aoFocar);
      agendarCobertura();
    };

    const desligar = () => {
      ativa = false;
      raiz.classList.remove(CLASSE_PILHA);
      observadorPartes.disconnect();
      window.removeEventListener('scroll', agendarCobertura);
      window.removeEventListener('resize', agendarCobertura);
      window.removeEventListener('hashchange', corrigirAncora);
      document.removeEventListener('click', aoClicar);
      document.removeEventListener('focusin', aoFocar);
      if (quadro !== 0) {
        window.cancelAnimationFrame(quadro);
        quadro = 0;
      }
      limparCobertura();
    };

    const aoMudarPreferencia = (evento: { matches: boolean }) => {
      if (evento.matches) {
        desligar();
      } else {
        ligar();
      }
    };

    medirCabecalho();
    if (cabecalho) {
      observadorCabecalho.observe(cabecalho);
    }
    if (!midia.matches) {
      ligar();
    }
    midia.addEventListener('change', aoMudarPreferencia);

    return () => {
      midia.removeEventListener('change', aoMudarPreferencia);
      desligar();
      observadorCabecalho.disconnect();
    };
  }, []);

  return null;
}
