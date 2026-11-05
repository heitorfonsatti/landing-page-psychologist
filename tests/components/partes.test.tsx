import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Home from '@/app/page';

describe('partes da página', () => {
  it('marca as seis partes na ordem e com a cor de cada uma', () => {
    const { container } = render(<Home />);
    const partes = [...container.querySelectorAll('[data-parte]')];
    expect(partes.map((p) => p.getAttribute('data-cor'))).toEqual([
      'bege',
      'verde',
      'bege',
      'bege',
      'bege',
      'azul-escuro',
    ]);
    expect(container.querySelector('footer')?.hasAttribute('data-parte')).toBe(false);
  });
});
