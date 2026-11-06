import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HowItWorks } from '@/components/HowItWorks';
import { siteContent } from '@/content/site';

describe('HowItWorks', () => {
  it('lists the three steps in order', () => {
    render(<HowItWorks />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
    siteContent.howItWorks.steps.forEach((step, i) => {
      expect(items[i]).toHaveTextContent(step.title);
    });
  });

  it('has an h2 with the section title', () => {
    render(<HowItWorks />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      siteContent.howItWorks.title,
    );
  });
});
