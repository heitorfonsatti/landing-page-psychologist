import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CLASSE_PILHA, Pilha } from '@/components/Pilha';

type Ouvinte = (evento: { matches: boolean }) => void;

let reduzido: boolean;
let ouvintesMidia: Ouvinte[];
let callbackObservador: ResizeObserverCallback | undefined;

function definirAltura(el: HTMLElement, altura: number) {
  Object.defineProperty(el, 'offsetHeight', { configurable: true, value: altura });
}

function montarFixture() {
  document.body.innerHTML = `
    <header id="cabecalho"></header>
    <main>
      <section data-parte id="p1"></section>
      <section data-parte id="p2"></section>
    </main>`;
  definirAltura(document.getElementById('cabecalho')!, 113);
  definirAltura(document.getElementById('p1')!, 900);
  definirAltura(document.getElementById('p2')!, 1400);
}

function mudarPreferencia(matches: boolean) {
  reduzido = matches;
  ouvintesMidia.forEach((ouvinte) => ouvinte({ matches }));
}

beforeEach(() => {
  reduzido = false;
  ouvintesMidia = [];
  callbackObservador = undefined;
  montarFixture();

  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      get matches() {
        return reduzido;
      },
      media: query,
      addEventListener: (_tipo: string, ouvinte: Ouvinte) => ouvintesMidia.push(ouvinte),
      removeEventListener: (_tipo: string, ouvinte: Ouvinte) => {
        ouvintesMidia = ouvintesMidia.filter((o) => o !== ouvinte);
      },
    })),
  );

  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(callback: ResizeObserverCallback) {
        callbackObservador = callback;
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  document.documentElement.classList.remove(CLASSE_PILHA);
  document.documentElement.style.removeProperty('--altura-cabecalho-medida');
  document.body.innerHTML = '';
});

const html = () => document.documentElement;

describe('Pilha', () => {
  it('liga a pilha no <html>', () => {
    render(<Pilha />);
    expect(html()).toHaveClass(CLASSE_PILHA);
  });

  it('não liga com movimento reduzido', () => {
    reduzido = true;
    render(<Pilha />);
    expect(html()).not.toHaveClass(CLASSE_PILHA);
  });

  it('desliga quando a visitante passa a pedir movimento reduzido', () => {
    render(<Pilha />);
    expect(html()).toHaveClass(CLASSE_PILHA);
    mudarPreferencia(true);
    expect(html()).not.toHaveClass(CLASSE_PILHA);
    mudarPreferencia(false);
    expect(html()).toHaveClass(CLASSE_PILHA);
  });

  it('escreve a altura de cada parte e do cabeçalho', () => {
    render(<Pilha />);
    expect(callbackObservador).toBeDefined();
    callbackObservador!([], {} as ResizeObserver);

    expect(document.getElementById('p1')!.style.getPropertyValue('--altura-parte')).toBe('900px');
    expect(document.getElementById('p2')!.style.getPropertyValue('--altura-parte')).toBe('1400px');
    expect(html().style.getPropertyValue('--altura-cabecalho-medida')).toBe('113px');
  });

  it('remove a classe ao desmontar', () => {
    const { unmount } = render(<Pilha />);
    unmount();
    expect(html()).not.toHaveClass(CLASSE_PILHA);
  });

  it('não lança e não liga sem ResizeObserver', () => {
    vi.stubGlobal('ResizeObserver', undefined);
    expect(() => render(<Pilha />)).not.toThrow();
    expect(html()).not.toHaveClass(CLASSE_PILHA);
  });
});
