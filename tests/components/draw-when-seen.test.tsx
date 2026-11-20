import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DrawWhenSeen } from '@/components/DrawWhenSeen';

type Callback = (entries: Partial<IntersectionObserverEntry>[]) => void;

let seen: Callback | undefined;

class FakeObserver {
  constructor(callback: Callback) {
    seen = callback;
  }
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

function setup({ reduced = false } = {}) {
  vi.stubGlobal('IntersectionObserver', FakeObserver);
  vi.stubGlobal('matchMedia', (query: string) => ({ matches: reduced && query.includes('reduce') }));
  return render(
    <>
      <ol data-draw="" />
      <DrawWhenSeen />
    </>,
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
  seen = undefined;
});

describe('DrawWhenSeen', () => {
  it('holds the drawing until the element is seen, then plays it', () => {
    const { container } = setup();
    const list = container.querySelector('ol')!;
    expect(list).toHaveAttribute('data-draw', 'waiting');

    seen?.([{ target: list, isIntersecting: true }]);
    expect(list).toHaveAttribute('data-draw', 'done');
  });

  it('leaves the drawing in place with reduced motion', () => {
    const { container } = setup({ reduced: true });
    expect(container.querySelector('ol')).toHaveAttribute('data-draw', '');
  });

  it('leaves the drawing in place without IntersectionObserver', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    const { container } = render(
      <>
        <ol data-draw="" />
        <DrawWhenSeen />
      </>,
    );
    expect(container.querySelector('ol')).toHaveAttribute('data-draw', '');
  });
});
