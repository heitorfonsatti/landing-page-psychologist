import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Footer } from '@/components/Footer';
import { siteContent } from '@/content/site';

describe('Footer', () => {
  it('traz nome completo, "Psicóloga" e CRP', () => {
    render(<Footer />);
    expect(screen.getByText(siteContent.fullName)).toBeInTheDocument();
    expect(screen.getByText(/Psicóloga/)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(siteContent.crp.replace('/', '\/')))).toBeInTheDocument();
  });

  it('traz o aviso de emergência com CVV e SAMU', () => {
    render(<Footer />);
    expect(screen.getByText(siteContent.footer.emergencyNotice)).toBeInTheDocument();
  });

  it('traz o aviso de privacidade', () => {
    render(<Footer />);
    expect(screen.getByText(siteContent.footer.privacyNotice)).toBeInTheDocument();
  });

  it('lista as redes sociais do conteúdo', () => {
    render(<Footer />);
    for (const rede of siteContent.socialLinks) {
      expect(screen.getByRole('link', { name: rede.label })).toHaveAttribute('href', rede.url);
    }
  });

  // Review Focus 3
  it('não renderiza lista nem rótulo de redes quando não há nenhuma', () => {
    const { container } = render(<Footer socialLinks={[]} />);
    expect(container.querySelectorAll('ul')).toHaveLength(0);
    expect(screen.queryByText(/redes/i)).not.toBeInTheDocument();
  });
});
