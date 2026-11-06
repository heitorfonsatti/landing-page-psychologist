import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PanelStack, STACK_CLASS } from '@/components/PanelStack';

type Listener = (event: { matches: boolean }) => void;

let reduced: boolean;
let mediaListeners: Listener[];
type Observer = { cb: ResizeObserverCallback; targets: Set<Element> };
let observers: Observer[];

/** Fires, like the browser does, only the observers that observe something. */
function fireObservers() {
  for (const o of observers) {
    if (o.targets.size > 0) {
      o.cb([], {} as ResizeObserver);
    }
  }
}

const isObserved = (el: Element) => observers.some((o) => o.targets.has(el));

function setHeight(el: HTMLElement, height: number) {
  Object.defineProperty(el, 'offsetHeight', { configurable: true, value: height });
}

function mountFixture() {
  document.body.innerHTML = `
    <header id="header"></header>
    <main>
      <section data-panel id="p1"></section>
      <section data-panel id="p2"></section>
    </main>`;
  setHeight(document.getElementById('header')!, 113);
  setHeight(document.getElementById('p1')!, 900);
  setHeight(document.getElementById('p2')!, 1400);
}

function changePreference(matches: boolean) {
  reduced = matches;
  mediaListeners.forEach((listener) => listener({ matches }));
}

beforeEach(() => {
  reduced = false;
  mediaListeners = [];
  observers = [];
  mountFixture();

  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      get matches() {
        return reduced;
      },
      media: query,
      addEventListener: (_type: string, listener: Listener) => mediaListeners.push(listener),
      removeEventListener: (_type: string, listener: Listener) => {
        mediaListeners = mediaListeners.filter((l) => l !== listener);
      },
    })),
  );

  vi.stubGlobal(
    'ResizeObserver',
    class {
      private o: Observer;
      constructor(callback: ResizeObserverCallback) {
        this.o = { cb: callback, targets: new Set() };
        observers.push(this.o);
      }
      observe(el: Element) {
        this.o.targets.add(el);
      }
      unobserve(el: Element) {
        this.o.targets.delete(el);
      }
      disconnect() {
        this.o.targets.clear();
      }
    },
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  document.documentElement.classList.remove(STACK_CLASS);
  document.documentElement.style.removeProperty('--measured-header-height');
  document.body.innerHTML = '';
});

const html = () => document.documentElement;

describe('PanelStack', () => {
  it('turns the stack on in <html>', () => {
    render(<PanelStack />);
    expect(html()).toHaveClass(STACK_CLASS);
  });

  it('does not turn on with reduced motion', () => {
    reduced = true;
    render(<PanelStack />);
    expect(html()).not.toHaveClass(STACK_CLASS);
  });

  it('turns off when the visitor starts asking for reduced motion', () => {
    render(<PanelStack />);
    expect(html()).toHaveClass(STACK_CLASS);
    changePreference(true);
    expect(html()).not.toHaveClass(STACK_CLASS);
    changePreference(false);
    expect(html()).toHaveClass(STACK_CLASS);
  });

  it('writes the height of each panel and of the header', () => {
    render(<PanelStack />);
    fireObservers();

    expect(document.getElementById('p1')!.style.getPropertyValue('--panel-height')).toBe('900px');
    expect(document.getElementById('p2')!.style.getPropertyValue('--panel-height')).toBe('1400px');
    expect(html().style.getPropertyValue('--measured-header-height')).toBe('113px');
  });

  // Final review: measuring is not motion. Visitors who asked for less motion
  // also need content to start below the real header.
  it('measures the header even with reduced motion', () => {
    reduced = true;
    render(<PanelStack />);
    expect(html()).not.toHaveClass(STACK_CLASS);
    expect(isObserved(document.getElementById('header')!)).toBe(true);
    fireObservers();
    expect(html().style.getPropertyValue('--measured-header-height')).toBe('113px');
  });

  it('keeps measuring the header after the stack turns off', () => {
    render(<PanelStack />);
    changePreference(true);
    expect(isObserved(document.getElementById('header')!)).toBe(true);
    expect(isObserved(document.getElementById('p1')!)).toBe(false);
    setHeight(document.getElementById('header')!, 140);
    fireObservers();
    expect(html().style.getPropertyValue('--measured-header-height')).toBe('140px');
  });

  it('removes the class on unmount', () => {
    const { unmount } = render(<PanelStack />);
    unmount();
    expect(html()).not.toHaveClass(STACK_CLASS);
  });

  it('does not throw and does not turn on without ResizeObserver', () => {
    vi.stubGlobal('ResizeObserver', undefined);
    expect(() => render(<PanelStack />)).not.toThrow();
    expect(html()).not.toHaveClass(STACK_CLASS);
  });
});
