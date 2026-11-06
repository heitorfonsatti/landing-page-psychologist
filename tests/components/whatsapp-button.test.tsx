import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { siteContent } from '@/content/site';
import { buildWhatsAppLink } from '@/lib/whatsapp';

describe('WhatsAppButton', () => {
  it('points to wa.me with the number and message from the content', () => {
    render(<WhatsAppButton />);
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      buildWhatsAppLink(siteContent.whatsappNumber, siteContent.whatsappMessage),
    );
  });

  it('uses the default label from the content', () => {
    render(<WhatsAppButton />);
    expect(screen.getByRole('link', { name: siteContent.whatsappCta })).toBeInTheDocument();
  });

  it('accepts a custom label', () => {
    render(<WhatsAppButton label="Falar agora" />);
    expect(screen.getByRole('link', { name: 'Falar agora' })).toBeInTheDocument();
  });

  it('opens in a new tab safely', () => {
    render(<WhatsAppButton />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });
});
