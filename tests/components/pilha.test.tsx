import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CLASSE_PILHA, Pilha } from '@/components/Pilha';

type Ouvinte = (evento: { matches: boolean }) => void;

let reduzido: boolean;
let ouvintesMidia: Ouvinte[];
type Observador = { cb: ResizeObserverCallback; alvos: Set<Element> };
let observadores: Observador[];

/** Dispara, como o navegador, só os observadores que observam algo. */
function dispararObservadores() {
  for (const o of observadores) {
    if (o.alvos.size > 0) {
      o.cb([], {} as ResizeObserver);
    }
  }
}

const observado = (el: Element) => observadores.some((o) => o.alvos.has(el));

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
  observadores = [];
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
      private o: Observador;
      constructor(callback: ResizeObserverCallback) {
        this.o = { cb: callback, alvos: new Set() };
        observadores.push(this.o);
      }
      observe(el: Element) {
        this.o.alvos.add(el);
      }
      unobserve(el: Element) {
        this.o.alvos.delete(el);
      }
      disconnect() {
        this.o.alvos.clear();
      }
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
    dispararObservadores();

    expect(document.getElementById('p1')!.style.getPropertyValue('--altura-parte')).toBe('900px');
    expect(document.getElementById('p2')!.style.getPropertyValue('--altura-parte')).toBe('1400px');
    expect(html().style.getPropertyValue('--altura-cabecalho-medida')).toBe('113px');
  });

  // Revisão final: medir não é movimento. Quem pediu menos movimento também
  // precisa que o conteúdo comece abaixo do cabeçalho real.
  it('mede o cabeçalho mesmo com movimento reduzido', () => {
    reduzido = true;
    render(<Pilha />);
    expect(html()).not.toHaveClass(CLASSE_PILHA);
    expect(observado(document.getElementById('cabecalho')!)).toBe(true);
    dispararObservadores();
    expect(html().style.getPropertyValue('--altura-cabecalho-medida')).toBe('113px');
  });

  it('continua medindo o cabeçalho depois de desligar a pilha', () => {
    render(<Pilha />);
    mudarPreferencia(true);
    expect(observado(document.getElementById('cabecalho')!)).toBe(true);
    expect(observado(document.getElementById('p1')!)).toBe(false);
    definirAltura(document.getElementById('cabecalho')!, 140);
    dispararObservadores();
    expect(html().style.getPropertyValue('--altura-cabecalho-medida')).toBe('140px');
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
