import { describe, expect, it } from 'vitest';
import { buildWhatsAppLink } from '@/lib/whatsapp';

const MENSAGEM = 'Olá! Vim pelo site e gostaria de saber mais sobre o atendimento.';

describe('buildWhatsAppLink', () => {
  it('monta a URL wa.me com a mensagem codificada', () => {
    expect(buildWhatsAppLink('5511987654321', MENSAGEM)).toBe(
      'https://wa.me/5511987654321?text=Ol%C3%A1!%20Vim%20pelo%20site%20e%20gostaria%20de%20saber%20mais%20sobre%20o%20atendimento.',
    );
  });

  it('aceita telefone fixo de 10 dígitos após o DDD', () => {
    expect(buildWhatsAppLink('551132654321', 'Oi')).toBe('https://wa.me/551132654321?text=Oi');
  });

  it('codifica caracteres reservados da query', () => {
    expect(buildWhatsAppLink('5511987654321', 'a&b=c?d #e')).toBe(
      'https://wa.me/5511987654321?text=a%26b%3Dc%3Fd%20%23e',
    );
  });

  // Review Focus 2
  it.each([
    '+55 (11) 98765-4321',
    '5511 98765 4321',
    '11987654321',
    '5511987654321 ',
    '551198765432109',
    '',
  ])('rejeita o número %j', (phone) => {
    expect(() => buildWhatsAppLink(phone, MENSAGEM)).toThrow(/Número de WhatsApp inválido/);
  });
});
