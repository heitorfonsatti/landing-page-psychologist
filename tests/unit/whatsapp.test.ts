import { describe, expect, it } from 'vitest';
import { buildWhatsAppLink } from '@/lib/whatsapp';

const MESSAGE = 'Olá! Vim pelo site e gostaria de saber mais sobre o atendimento.';

describe('buildWhatsAppLink', () => {
  it('builds the wa.me URL with the encoded message', () => {
    expect(buildWhatsAppLink('5511987654321', MESSAGE)).toBe(
      'https://wa.me/5511987654321?text=Ol%C3%A1!%20Vim%20pelo%20site%20e%20gostaria%20de%20saber%20mais%20sobre%20o%20atendimento.',
    );
  });

  it('accepts a 10-digit landline after the area code', () => {
    expect(buildWhatsAppLink('551132654321', 'Oi')).toBe('https://wa.me/551132654321?text=Oi');
  });

  it('encodes reserved query characters', () => {
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
  ])('rejects the number %j', (phone) => {
    expect(() => buildWhatsAppLink(phone, MESSAGE)).toThrow(/Invalid WhatsApp number/);
  });
});
