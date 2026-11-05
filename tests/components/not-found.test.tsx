import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import NotFound from '@/app/not-found';

describe('NotFound', () => {
  it('oferece volta para a página principal', () => {
    render(<NotFound />);
    expect(screen.getByRole('link', { name: /início|principal/i })).toHaveAttribute('href', '/');
  });

  it('não traz conteúdo clínico nem botão de WhatsApp', () => {
    const { container } = render(<NotFound />);
    expect(container.innerHTML).not.toContain('wa.me');
    expect(screen.queryByText(/CRP/)).not.toBeInTheDocument();
  });
});
