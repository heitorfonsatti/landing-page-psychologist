import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Services } from '@/components/Services';
import { siteContent } from '@/content/site';

describe('Services', () => {
  it('expõe a âncora #servicos', () => {
    const { container } = render(<Services />);
    expect(container.querySelector('section#servicos')).not.toBeNull();
  });

  it('lista todas as demandas do conteúdo', () => {
    render(<Services />);
    expect(screen.getAllByRole('listitem')).toHaveLength(siteContent.services.items.length);
    for (const item of siteContent.services.items) {
      expect(screen.getByText(item.title)).toBeInTheDocument();
    }
  });

  it('tem um h2 com o título da seção', () => {
    render(<Services />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      siteContent.services.title,
    );
  });
});
