import { describe, expect, it } from 'vitest';
import { siteContent } from '@/content/site';

describe('siteContent', () => {
  it('traz as quatro dúvidas da spec', () => {
    const perguntas = siteContent.faq.items
      .map((i) => i.question)
      .join(' ')
      .toLowerCase();
    expect(siteContent.faq.items).toHaveLength(4);
    for (const tema of ['sigilo', 'duração', 'online', 'valor']) {
      expect(perguntas).toContain(tema);
    }
  });

  it('tem três passos em "Como funciona"', () => {
    expect(siteContent.howItWorks.steps).toHaveLength(3);
  });

  it('usa a mensagem inicial da spec', () => {
    expect(siteContent.whatsappMessage).toBe(
      'Olá! Vim pelo site e gostaria de saber mais sobre o atendimento.',
    );
  });

  it('avisa que o site não atende emergências, com CVV e SAMU', () => {
    expect(siteContent.footer.emergencyNotice).toMatch(/188/);
    expect(siteContent.footer.emergencyNotice).toMatch(/192/);
    expect(siteContent.footer.emergencyNotice.toLowerCase()).toContain('emergência');
  });

  it('informa na privacidade que não há cookies de rastreamento nem formulários', () => {
    const aviso = siteContent.footer.privacyNotice.toLowerCase();
    expect(aviso).toContain('cookies');
    expect(aviso).toContain('formulário');
    expect(aviso).toContain('whatsapp');
  });
});
