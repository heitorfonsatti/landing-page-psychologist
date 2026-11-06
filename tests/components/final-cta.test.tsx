import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FinalCta } from '@/components/FinalCta';
import { siteContent } from '@/content/site';

describe('FinalCta', () => {
  it('shows the closing headline and a WhatsApp button', () => {
    render(<FinalCta />);
    expect(screen.getByText(siteContent.finalCta.headline)).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      expect.stringContaining('https://wa.me/'),
    );
  });
});
