'use client';

import { useEffect } from 'react';
import { cobertura } from '@/lib/pilha';

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

    const medir = () => {
      raiz.style.setProperty('--altura-cabecalho-medida', `${alturaCabecalho()}px`);
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

    const observador = new window.ResizeObserver(() => {
      medir();
      agendarCobertura();
    });

    const ligar = () => {
      medir();
      raiz.classList.add(CLASSE_PILHA);
      if (cabecalho) {
        observador.observe(cabecalho);
      }
      partes.forEach((parte) => observador.observe(parte));
      window.addEventListener('scroll', agendarCobertura, { passive: true });
      window.addEventListener('resize', agendarCobertura);
      agendarCobertura();
    };

    const desligar = () => {
      raiz.classList.remove(CLASSE_PILHA);
      observador.disconnect();
      window.removeEventListener('scroll', agendarCobertura);
      window.removeEventListener('resize', agendarCobertura);
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

    if (!midia.matches) {
      ligar();
    }
    midia.addEventListener('change', aoMudarPreferencia);

    return () => {
      midia.removeEventListener('change', aoMudarPreferencia);
      desligar();
    };
  }, []);

  return null;
}
