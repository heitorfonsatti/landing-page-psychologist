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
    ['Adultos', '#servicos'],
    ['Infantojuvenil', '#infantojuvenil'],
    ['Sobre mim', '#sobre'],
    ['Dúvidas', '#duvidas'],
  ])('links %s to the %s anchor', (name, href) => {
    render(<Header />);
    expect(screen.getByRole('link', { name })).toHaveAttribute('href', href);
  });

  it('lists the section links in page order', () => {
    render(<Header />);
    const nav = screen.getByRole('navigation');
    const hrefs = [...nav.querySelectorAll('a')].map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual(['#servicos', '#infantojuvenil', '#sobre', '#duvidas']);
  });

  it('has the WhatsApp button, with the short label', () => {
    render(<Header />);
    expect(screen.getByRole('link', { name: siteContent.whatsappShortCta })).toHaveAttribute(
      'href',
      expect.stringContaining('https://wa.me/'),
    );
  });

  it('does not use a hamburger menu', () => {
    render(<Header />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
