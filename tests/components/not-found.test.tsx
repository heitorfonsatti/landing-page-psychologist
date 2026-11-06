import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import NotFound from '@/app/not-found';

describe('NotFound', () => {
  it('links back to the home page', () => {
    render(<NotFound />);
    expect(screen.getByRole('link', { name: /início|principal/i })).toHaveAttribute('href', '/');
  });

  it('has no clinical content and no WhatsApp button', () => {
    const { container } = render(<NotFound />);
    expect(container.innerHTML).not.toContain('wa.me');
    expect(screen.queryByText(/CRP/)).not.toBeInTheDocument();
  });
});
