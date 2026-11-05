import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Hero } from '@/components/Hero';
import { siteContent } from '@/content/site';

describe('Hero', () => {
  it('traz o nome, "Psicóloga" e o CRP', () => {
    render(<Hero />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      siteContent.hero.headline,
    );
    expect(screen.getByText(siteContent.fullName)).toBeInTheDocument();
    expect(screen.getByText(/Psicóloga/)).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(`CRP\\s*${siteContent.crp.replace('/', '\\/')}`)),
    ).toBeInTheDocument();
  });

  it('mostra a modalidade de atendimento', () => {
    render(<Hero />);
    expect(screen.getByText(siteContent.hero.modality)).toBeInTheDocument();
  });

  it('mostra o retrato com o texto alternativo do conteúdo', () => {
    render(<Hero />);
    expect(screen.getByAltText(siteContent.hero.portrait.alt)).toBeInTheDocument();
  });

  it('traz um botão de WhatsApp', () => {
    render(<Hero />);
    expect(screen.getByRole('link', { name: siteContent.whatsappCta })).toBeInTheDocument();
  });
});
