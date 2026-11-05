import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Header } from '@/components/Header';
import { siteContent } from '@/content/site';

describe('Header', () => {
  it('mostra o nome da psicóloga', () => {
    render(<Header />);
    expect(screen.getByText(siteContent.fullName)).toBeInTheDocument();
  });

  it.each([
    ['Sobre mim', '#sobre'],
    ['Serviços', '#servicos'],
    ['Dúvidas', '#duvidas'],
  ])('liga %s à âncora %s', (nome, href) => {
    render(<Header />);
    expect(screen.getByRole('link', { name: nome })).toHaveAttribute('href', href);
  });

  it('traz o botão de WhatsApp', () => {
    render(<Header />);
    expect(screen.getByRole('link', { name: siteContent.whatsappCta })).toHaveAttribute(
      'href',
      expect.stringContaining('https://wa.me/'),
    );
  });

  it('não usa menu hambúrguer', () => {
    render(<Header />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
