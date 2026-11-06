import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Footer } from '@/components/Footer';
import { siteContent } from '@/content/site';

describe('Footer', () => {
  it('shows the full name, "Psicóloga" and the CRP', () => {
    render(<Footer />);
    expect(screen.getByText(siteContent.fullName)).toBeInTheDocument();
    expect(screen.getByText(/Psicóloga/)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(siteContent.crp.replace('/', '\/')))).toBeInTheDocument();
  });

  it('shows the emergency notice with CVV and SAMU', () => {
    render(<Footer />);
    expect(screen.getByText(siteContent.footer.emergencyNotice)).toBeInTheDocument();
  });

  it('shows the privacy notice', () => {
    render(<Footer />);
    expect(screen.getByText(siteContent.footer.privacyNotice)).toBeInTheDocument();
  });

  it('lists the social links from the content', () => {
    render(<Footer />);
    for (const link of siteContent.socialLinks) {
      expect(screen.getByRole('link', { name: link.label })).toHaveAttribute('href', link.url);
    }
  });

  // Review Focus 3
  it('renders neither the list nor its label when there are no social links', () => {
    const { container } = render(<Footer socialLinks={[]} />);
    expect(container.querySelectorAll('ul')).toHaveLength(0);
    expect(screen.queryByText(/redes/i)).not.toBeInTheDocument();
  });
});
