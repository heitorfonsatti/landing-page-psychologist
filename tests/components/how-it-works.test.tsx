import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HowItWorks } from '@/components/HowItWorks';
import { siteContent } from '@/content/site';

describe('HowItWorks', () => {
  it('lista os três passos em ordem', () => {
    render(<HowItWorks />);
    const itens = screen.getAllByRole('listitem');
    expect(itens).toHaveLength(3);
    siteContent.howItWorks.steps.forEach((passo, i) => {
      expect(itens[i]).toHaveTextContent(passo.title);
    });
  });

  it('tem um h2 com o título da seção', () => {
    render(<HowItWorks />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      siteContent.howItWorks.title,
    );
  });
});
