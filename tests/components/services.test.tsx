import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Services } from '@/components/Services';
import { siteContent } from '@/content/site';

describe('Services', () => {
  it('exposes the #servicos anchor', () => {
    const { container } = render(<Services />);
    expect(container.querySelector('section#servicos')).not.toBeNull();
  });

  it('lists every concern from the content', () => {
    render(<Services />);
    expect(screen.getAllByRole('listitem')).toHaveLength(siteContent.services.items.length);
    for (const item of siteContent.services.items) {
      expect(screen.getByText(item.title)).toBeInTheDocument();
    }
  });

  it('has an h2 with the section title', () => {
    render(<Services />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      siteContent.services.title,
    );
  });
});
