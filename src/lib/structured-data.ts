import type { SiteContent } from '@/types/content';

/**
 * schema.org description of the psychologist, for search engines.
 *
 * Only facts the page already shows: the office address from the footer and
 * no register number beyond what the page prints.
 */
export function buildStructuredData(content: SiteContent) {
  const { fullName, profession, seo, hero, services, office, socialLinks } = content;
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: fullName,
    jobTitle: profession,
    description: seo.description,
    url: seo.siteUrl,
    image: new URL(hero.portrait.src, seo.siteUrl).toString(),
    workLocation: {
      '@type': 'Place',
      name: office.place,
      address: {
        '@type': 'PostalAddress',
        streetAddress: office.street,
        addressLocality: office.city,
        addressRegion: office.state,
        addressCountry: 'BR',
      },
    },
    knowsAbout:[...services.adults.items, ...services.children.items].map((item) => item.title),
    sameAs: socialLinks.map((link) => link.url),
  };
}

/** JSON for a `<script type="application/ld+json">`, with `<` escaped so the text cannot close the tag. */
export function serializeStructuredData(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
