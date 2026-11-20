import { describe, expect, it } from 'vitest';
import { siteContent } from '@/content/site';
import { googleMapsUrl, officeQuery, wazeUrl } from '@/lib/office';
import type { Office } from '@/types/content';

const office: Office = {
  heading: 'Consultório',
  place: 'Clínica Exemplo',
  street: 'Rua Pombas, 212',
  district: 'Centro',
  city: 'Arapongas',
  state: 'PR',
  note: 'Atendimento presencial.',
};

describe('officeQuery', () => {
  it('joins street, district, city and state as a map search', () => {
    expect(officeQuery(office)).toBe('Rua Pombas, 212, Centro, Arapongas - PR');
  });
});

describe('map links', () => {
  it('opens a Google Maps search for the address', () => {
    const url = new URL(googleMapsUrl(office));
    expect(url.origin + url.pathname).toBe('https://www.google.com/maps/search/');
    expect(url.searchParams.get('api')).toBe('1');
    expect(url.searchParams.get('query')).toBe(officeQuery(office));
  });

  it('opens Waze navigating to the address', () => {
    const url = new URL(wazeUrl(office));
    expect(url.origin + url.pathname).toBe('https://waze.com/ul');
    expect(url.searchParams.get('q')).toBe(officeQuery(office));
    expect(url.searchParams.get('navigate')).toBe('yes');
  });
});

describe('siteContent modality', () => {
  it('offers in-person sessions to adults as well', () => {
    const { hero, seo } = siteContent;
    for (const text of [hero.modality, seo.description]) {
      expect(text).toMatch(/presencial/i);
      expect(text).toMatch(/adultos/i);
      expect(text).toMatch(/online/i);
    }
  });

  it('places the office in Arapongas', () => {
    expect(siteContent.office.city).toBe('Arapongas');
    expect(siteContent.hero.modality).toContain('Arapongas');
  });
});
