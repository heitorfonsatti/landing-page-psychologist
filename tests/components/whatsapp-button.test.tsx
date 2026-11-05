import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { siteContent } from '@/content/site';
import { buildWhatsAppLink } from '@/lib/whatsapp';

describe('WhatsAppButton', () => {
  it('aponta para o wa.me com número e mensagem do conteúdo', () => {
    render(<WhatsAppButton />);
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      buildWhatsAppLink(siteContent.whatsappNumber, siteContent.whatsappMessage),
    );
  });

  it('usa o rótulo padrão do conteúdo', () => {
    render(<WhatsAppButton />);
    expect(screen.getByRole('link', { name: siteContent.whatsappCta })).toBeInTheDocument();
  });

  it('aceita rótulo próprio', () => {
    render(<WhatsAppButton label="Falar agora" />);
    expect(screen.getByRole('link', { name: 'Falar agora' })).toBeInTheDocument();
  });

  it('abre em nova aba de forma segura', () => {
    render(<WhatsAppButton />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });
});
