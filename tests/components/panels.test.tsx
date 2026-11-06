import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Home from '@/app/page';

describe('page panels', () => {
  it('marks the six panels in order, each with its color', () => {
    const { container } = render(<Home />);
    const panels = [...container.querySelectorAll('[data-panel]')];
    expect(panels.map((p) => p.getAttribute('data-color'))).toEqual([
      'beige',
      'green',
      'beige',
      'beige',
      'beige',
      'dark-blue',
    ]);
    expect(container.querySelector('footer')?.hasAttribute('data-panel')).toBe(false);
  });
});
