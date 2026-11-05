import { describe, expect, it } from 'vitest';
import { metadata } from '@/app/layout';
import { siteContent } from '@/content/site';

describe('metadados do layout', () => {
  it('usa título e descrição do conteúdo', () => {
    expect(metadata.title).toBe(siteContent.seo.title);
    expect(metadata.description).toBe(siteContent.seo.description);
  });

  it('define metadataBase a partir da URL do site', () => {
    expect(metadata.metadataBase?.toString()).toContain(
      new URL(siteContent.seo.siteUrl).host,
    );
  });

  it('declara o locale pt_BR no OpenGraph', () => {
    expect(metadata.openGraph).toMatchObject({ locale: 'pt_BR', type: 'website' });
  });
});
