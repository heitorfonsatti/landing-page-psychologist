import type { SiteContent } from '@/types/content';

/**
 * Terms that must not appear in any text on the site, because of the CFP
 * (Brazilian Federal Council of Psychology) advertising rules. Editable list.
 */
export const FORBIDDEN_TERMS: readonly string[] = [
  'cura',
  'curar',
  'garantido',
  'garantia',
  'R$',
  'depoimento',
];

const CRP_FORMAT = /^\d{2}\/\d{5}$/;
const CRP_PLACEHOLDER = '00/00000';

const WHATSAPP_FORMAT = /^55\d{10,11}$/;
const WHATSAPP_PLACEHOLDERS = ['5511999999999', '5500000000000'];

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Builds the matcher for a term.
 *
 * Plain-letter terms match as whole words, so `cura` does not reject
 * `curativo`. Terms with symbols, such as `R$`, match as substrings: `\b`
 * produces no boundary before `$`, so a whole-word search would let
 * `R$ 200` through.
 */
function matcherFor(term: string): RegExp {
  return /^[a-z]+$/i.test(term)
    ? new RegExp(`\\b${escapeRegex(term)}\\b`, 'i')
    : new RegExp(escapeRegex(term), 'i');
}

type FoundText = { path: string; text: string };

function collectTexts(value: unknown, path: string, out: FoundText[]): void {
  if (typeof value === 'string') {
    out.push({ path, text: value });
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, i) => collectTexts(item, `${path}[${i}]`, out));
    return;
  }
  if (typeof value === 'object' && value !== null) {
    for (const [key, item] of Object.entries(value)) {
      collectTexts(item, path ? `${path}.${key}` : key, out);
    }
  }
}

function isBlank(value: string): boolean {
  return value.trim().length === 0;
}

/**
 * Checks the site content before publishing.
 *
 * @returns list of problems; empty when the content is ready to publish.
 */
export function checkContent(content: SiteContent): string[] {
  const errors: string[] = [];

  if (!CRP_FORMAT.test(content.crp) || content.crp === CRP_PLACEHOLDER) {
    errors.push(`crp: ${JSON.stringify(content.crp)} is not a real CRP in the 00/00000 format.`);
  }

  if (
    !WHATSAPP_FORMAT.test(content.whatsappNumber) ||
    WHATSAPP_PLACEHOLDERS.includes(content.whatsappNumber)
  ) {
    errors.push(
      `whatsappNumber: ${JSON.stringify(content.whatsappNumber)} is not a real number in the 55 + area code + phone format.`,
    );
  }

  const required: ReadonlyArray<[string, string]> = [
    ['fullName', content.fullName],
    ['seo.title', content.seo.title],
    ['seo.description', content.seo.description],
    ['hero.portrait.src', content.hero.portrait.src],
    ['hero.portrait.alt', content.hero.portrait.alt],
    ['about.photo.src', content.about.photo.src],
    ['about.photo.alt', content.about.photo.alt],
  ];

  for (const [field, value] of required) {
    if (isBlank(value)) {
      errors.push(`${field}: is empty and is required.`);
    }
  }

  const texts: FoundText[] = [];
  collectTexts(content, '', texts);

  for (const term of FORBIDDEN_TERMS) {
    const matcher = matcherFor(term);
    const found = texts.find(({ text }) => matcher.test(text));
    if (found) {
      errors.push(
        `forbidden term ${JSON.stringify(term)} in ${found.path}: ${JSON.stringify(found.text)}`,
      );
    }
  }

  return errors;
}
