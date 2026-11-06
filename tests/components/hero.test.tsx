import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Hero } from '@/components/Hero';
import { siteContent } from '@/content/site';

describe('Hero', () => {
  it('shows the name, "Psicóloga" and the CRP', () => {
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

  it('shows the session format', () => {
    render(<Hero />);
    expect(screen.getByText(siteContent.hero.modality)).toBeInTheDocument();
  });

  it('shows the portrait with the alt text from the content', () => {
    render(<Hero />);
    expect(screen.getByAltText(siteContent.hero.portrait.alt)).toBeInTheDocument();
  });

  it('has a WhatsApp button', () => {
    render(<Hero />);
    expect(screen.getByRole('link', { name: siteContent.whatsappCta })).toBeInTheDocument();
  });
});
