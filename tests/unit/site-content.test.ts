import { describe, expect, it } from 'vitest';
import { siteContent } from '@/content/site';

describe('siteContent', () => {
  it('has the four FAQ topics from the spec', () => {
    const questions = siteContent.faq.items
      .map((i) => i.question)
      .join(' ')
      .toLowerCase();
    expect(siteContent.faq.items).toHaveLength(4);
    for (const topic of ['sigilo', 'duração', 'online', 'valor']) {
      expect(questions).toContain(topic);
    }
  });

  it('has three steps in "How it works"', () => {
    expect(siteContent.howItWorks.steps).toHaveLength(3);
  });

  it('uses the initial message from the spec', () => {
    expect(siteContent.whatsappMessage).toBe(
      'Olá! Vim pelo site e gostaria de saber mais sobre o atendimento.',
    );
  });

  it('states that the site does not handle emergencies, with CVV and SAMU', () => {
    expect(siteContent.footer.emergencyNotice).toMatch(/188/);
    expect(siteContent.footer.emergencyNotice).toMatch(/192/);
    expect(siteContent.footer.emergencyNotice.toLowerCase()).toContain('emergência');
  });

  it('states in the privacy notice that there are no tracking cookies or forms', () => {
    const notice = siteContent.footer.privacyNotice.toLowerCase();
    expect(notice).toContain('cookies');
    expect(notice).toContain('formulário');
    expect(notice).toContain('whatsapp');
  });
});

describe('siteContent.services', () => {
  const { adults, children } = siteContent.services;

  it.each([
    ['adults', adults],
    ['children', children],
  ])('has a full explanation, problem and support, for every %s topic', (_, group) => {
    expect(group.items.length).toBeGreaterThan(0);
    for (const item of group.items) {
      expect(item.struggle.trim()).not.toBe('');
      expect(item.support.trim()).not.toBe('');
    }
  });

  it('never repeats a topic title, since titles name the "learn more" buttons', () => {
    const titles = [...adults.items, ...children.items].map((i) => i.title);
    expect(new Set(titles).size).toBe(titles.length);
  });
});
