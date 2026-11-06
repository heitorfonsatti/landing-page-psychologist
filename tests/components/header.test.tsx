import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Header } from '@/components/Header';
import { siteContent } from '@/content/site';

describe('Header', () => {
  it("shows the psychologist's name", () => {
    render(<Header />);
    expect(screen.getByText(siteContent.fullName)).toBeInTheDocument();
  });

  it.each([
    ['Sobre mim', '#sobre'],
    ['Serviços', '#servicos'],
    ['Dúvidas', '#duvidas'],
  ])('links %s to the %s anchor', (name, href) => {
    render(<Header />);
    expect(screen.getByRole('link', { name })).toHaveAttribute('href', href);
  });

  it('has the WhatsApp button', () => {
    render(<Header />);
    expect(screen.getByRole('link', { name: siteContent.whatsappCta })).toHaveAttribute(
      'href',
      expect.stringContaining('https://wa.me/'),
    );
  });

  it('does not use a hamburger menu', () => {
    render(<Header />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
