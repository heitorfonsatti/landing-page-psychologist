import { describe, expect, it } from 'vitest';
import { metadata } from '@/app/layout';
import { siteContent } from '@/content/site';

describe('layout metadata', () => {
  it('uses the title and description from the content', () => {
    expect(metadata.title).toBe(siteContent.seo.title);
    expect(metadata.description).toBe(siteContent.seo.description);
  });

  it('sets metadataBase from the site URL', () => {
    expect(metadata.metadataBase?.toString()).toContain(
      new URL(siteContent.seo.siteUrl).host,
    );
  });

  it('declares the pt_BR locale in OpenGraph', () => {
    expect(metadata.openGraph).toMatchObject({ locale: 'pt_BR', type: 'website' });
  });
});
