import { describe, expect, it } from 'vitest';
import { siteContent } from '@/content/site';
import { buildStructuredData, serializeStructuredData } from '@/lib/structured-data';

describe('buildStructuredData', () => {
  const data = buildStructuredData(siteContent);

  it('describes the psychologist as a schema.org Person', () => {
    expect(data).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: siteContent.fullName,
      jobTitle: siteContent.profession,
      url: siteContent.seo.siteUrl,
    });
  });

  it('points the image at an absolute URL', () => {
    expect(data.image).toBe(new URL(siteContent.hero.portrait.src, siteContent.seo.siteUrl).toString());
  });

  it('lists every service topic as knowsAbout', () => {
    const { adults, children } = siteContent.services;
    expect(data.knowsAbout).toHaveLength(adults.items.length + children.items.length);
  });

  it('carries no address, since the office location is not published', () => {
    expect(data).not.toHaveProperty('address');
  });
});

describe('serializeStructuredData', () => {
  it('escapes "<" so the JSON cannot close the script tag', () => {
    const out = serializeStructuredData({ text: '</script><script>alert(1)</script>' });
    expect(out).not.toContain('<');
    expect(JSON.parse(out)).toEqual({ text: '</script><script>alert(1)</script>' });
  });
});
