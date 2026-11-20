import type { SiteContent } from '@/types/content';

/**
 * schema.org description of the psychologist, for search engines.
 *
 * Only facts the page already shows: no address (the office location is not
 * published yet) and no register number beyond what the page prints.
 */
export function buildStructuredData(content: SiteContent) {
  const { fullName, profession, seo, hero, services, socialLinks } = content;
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: fullName,
    jobTitle: profession,
    description: seo.description,
    url: seo.siteUrl,
    image: new URL(hero.portrait.src, seo.siteUrl).toString(),
    knowsAbout: [...services.adults.items, ...services.children.items].map((item) => item.title),
    sameAs: socialLinks.map((link) => link.url),
  };
}

/** JSON for a `<script type="application/ld+json">`, with `<` escaped so the text cannot close the tag. */
export function serializeStructuredData(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
