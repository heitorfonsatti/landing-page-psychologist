import { describe, expect, it } from 'vitest';
import { checkContent } from '@/lib/content-check';
import type { SiteContent } from '@/types/content';

const validContent: SiteContent = {
  fullName: 'Marta Ribeiro Lemos',
  profession: 'Psicóloga',
  crp: '06/12345',
  whatsappNumber: '5511987654321',
  whatsappMessage: 'Olá! Vim pelo site e gostaria de saber mais sobre o atendimento.',
  whatsappCta: 'Diga um oie!',
  seo: {
    title: 'Marta Ribeiro Lemos — Psicóloga',
    description: 'Atendimento online para adultos.',
    siteUrl: 'https://exemplo.com.br',
  },
  hero: {
    headline: 'Um espaço para pensar com calma',
    modality: 'Atendimento online',
    portrait: { src: '/images/portrait.png', alt: 'Marta sentada em uma poltrona', width: 800, height: 1000 },
  },
  services: {
    moreLabel: 'Saber mais',
    backLabel: 'Voltar',
    supportLabel: 'Como a terapia pode ajudar',
    adults: {
      eyebrow: 'Para adultos',
      title: 'Como posso ajudar',
      struggleLabel: 'O que você pode estar vivendo',
      items: [
        {
          title: 'Ansiedade',
          description: 'Quando a cabeça não desacelera.',
          struggle: 'A preocupação ocupa muito espaço.',
          support: 'Na terapia, treinamos novas respostas.',
        },
      ],
    },
    children: {
      eyebrow: 'Para crianças e adolescentes',
      title: 'Como posso ajudar na infância e na adolescência',
      intro: 'Os responsáveis participam do processo.',
      struggleLabel: 'O que você pode estar percebendo',
      items: [
        {
          title: 'Medos',
          description: 'Preocupações que crescem.',
          struggle: 'A criança evita situações novas.',
          support: 'Com brincadeiras, a criança enfrenta os medos aos poucos.',
        },
      ],
    },
  },
  about: {
    title: 'Sobre mim',
    paragraphs: ['Sou psicóloga clínica e atendo adultos.'],
    education: ['Graduação em Psicologia — Universidade Exemplo, 2016'],
    approach: 'Abordagem cognitivo-comportamental.',
    photo: { src: '/images/about.png', alt: 'Marta em seu consultório', width: 800, height: 800 },
  },
  howItWorks: {
    title: 'Como funciona',
    steps: [{ title: 'Chame no WhatsApp', description: 'Você manda uma mensagem.' }],
  },
  faq: {
    title: 'Dúvidas',
    items: [{ question: 'Fica em sigilo?', answer: 'Sim, é um dever profissional.' }],
  },
  finalCta: { headline: 'Talvez seja um bom momento para começar.' },
  footer: {
    privacyNotice: 'Este site não usa cookies de rastreamento e não tem formulários.',
    emergencyNotice: 'Este site não atende emergências. Ligue 188 (CVV) ou 192 (SAMU).',
  },
  socialLinks: [{ label: 'Instagram', url: 'https://www.instagram.com/exemplo' }],
};

describe('checkContent', () => {
  it('accepts complete content with no forbidden terms', () => {
    expect(checkContent(validContent)).toEqual([]);
  });

  it.each(['00/00000', '6/12345', '06/1234', '06-12345', 'CRP 06/12345', ''])(
    'rejects the CRP %j',
    (crp) => {
      expect(checkContent({ ...validContent, crp })).toHaveLength(1);
    },
  );

  it.each(['5511999999999', '5500000000000', '11987654321', '+5511987654321', ''])(
    'rejects the WhatsApp number %j',
    (whatsappNumber) => {
      expect(checkContent({ ...validContent, whatsappNumber })).toHaveLength(1);
    },
  );

  it.each([
    ['fullName', { fullName: '   ' }],
    ['seo.title', { seo: { ...validContent.seo, title: '' } }],
    ['seo.description', { seo: { ...validContent.seo, description: '' } }],
    [
      'photo',
      { hero: { ...validContent.hero, portrait: { ...validContent.hero.portrait, src: '' } } },
    ],
    [
      'alt text',
      { hero: { ...validContent.hero, portrait: { ...validContent.hero.portrait, alt: ' ' } } },
    ],
  ])('rejects an empty required field: %s', (_label, patch) => {
    expect(checkContent({ ...validContent, ...patch })).toHaveLength(1);
  });

  it.each(['cura', 'Curar', 'GARANTIDO', 'garantia', 'Depoimento', 'cura.', '(garantia)'])(
    'rejects the term %j in any text',
    (term) => {
      const about = { ...validContent.about, approach: `Trabalho com ${term} no processo` };
      expect(checkContent({ ...validContent, about })).toHaveLength(1);
    },
  );

  it.each(['curativo', 'curadoria', 'procura', 'garantidor', 'Segurança'])(
    'does not mistake %j for a forbidden term',
    (word) => {
      const about = { ...validContent.about, approach: `Falo sobre ${word} aqui` };
      expect(checkContent({ ...validContent, about })).toEqual([]);
    },
  );

  // Review Focus 1
  it.each(['R$ 200 por sessão', 'o valor é R$200', 'custa r$ 150'])(
    'rejects a price in %j',
    (text) => {
      const faq = { ...validContent.faq, items: [{ question: 'Valores?', answer: text }] };
      expect(checkContent({ ...validContent, faq })).toHaveLength(1);
    },
  );

  it('also scans questions, answers, lists and paragraphs', () => {
    const faq = { ...validContent.faq, items: [{ question: 'Tem garantia?', answer: 'Sim' }] };
    expect(checkContent({ ...validContent, faq })).toHaveLength(1);
  });

  it('collects several problems at once', () => {
    expect(checkContent({ ...validContent, crp: '00/00000', fullName: '' })).toHaveLength(2);
  });
});
