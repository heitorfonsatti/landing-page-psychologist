import type { SiteContent } from '@/types/content';

/**
 * Termos que não podem aparecer em nenhum texto do site, por conta das
 * regras de publicidade do CFP. Lista editável.
 */
export const FORBIDDEN_TERMS: readonly string[] = [
  'cura',
  'curar',
  'garantido',
  'garantia',
  'R$',
  'depoimento',
];

const CRP_FORMATO = /^\d{2}\/\d{5}$/;
const CRP_EXEMPLO = '00/00000';

const WHATSAPP_FORMATO = /^55\d{10,11}$/;
const WHATSAPP_EXEMPLO = ['5511999999999', '5500000000000'];

function escaparRegex(texto: string): string {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Monta o casador de um termo.
 *
 * Termos de letras simples casam como palavra inteira — `cura` não deve
 * reprovar `curativo`. Termos com símbolo, como `R$`, casam como substring:
 * `\b` não produz fronteira antes de `$`, então a busca por palavra inteira
 * deixaria `R$ 200` passar.
 */
function casadorDe(termo: string): RegExp {
  return /^[a-z]+$/i.test(termo)
    ? new RegExp(`\\b${escaparRegex(termo)}\\b`, 'i')
    : new RegExp(escaparRegex(termo), 'i');
}

type TextoEncontrado = { caminho: string; texto: string };

function coletarTextos(valor: unknown, caminho: string, saida: TextoEncontrado[]): void {
  if (typeof valor === 'string') {
    saida.push({ caminho, texto: valor });
    return;
  }
  if (Array.isArray(valor)) {
    valor.forEach((item, i) => coletarTextos(item, `${caminho}[${i}]`, saida));
    return;
  }
  if (typeof valor === 'object' && valor !== null) {
    for (const [chave, item] of Object.entries(valor)) {
      coletarTextos(item, caminho ? `${caminho}.${chave}` : chave, saida);
    }
  }
}

function vazio(valor: string): boolean {
  return valor.trim().length === 0;
}

/**
 * Confere o conteúdo do site antes da publicação.
 *
 * @returns lista de problemas; vazia quando o conteúdo está apto a publicar.
 */
export function checkContent(content: SiteContent): string[] {
  const erros: string[] = [];

  if (!CRP_FORMATO.test(content.crp) || content.crp === CRP_EXEMPLO) {
    erros.push(
      `crp: ${JSON.stringify(content.crp)} não é um CRP real no formato 00/00000.`,
    );
  }

  if (
    !WHATSAPP_FORMATO.test(content.whatsappNumber) ||
    WHATSAPP_EXEMPLO.includes(content.whatsappNumber)
  ) {
    erros.push(
      `whatsappNumber: ${JSON.stringify(content.whatsappNumber)} não é um número real no formato 55 + DDD + telefone.`,
    );
  }

  const obrigatorios: ReadonlyArray<[string, string]> = [
    ['fullName', content.fullName],
    ['seo.title', content.seo.title],
    ['seo.description', content.seo.description],
    ['hero.portrait.src', content.hero.portrait.src],
    ['hero.portrait.alt', content.hero.portrait.alt],
    ['about.photo.src', content.about.photo.src],
    ['about.photo.alt', content.about.photo.alt],
  ];

  for (const [campo, valor] of obrigatorios) {
    if (vazio(valor)) {
      erros.push(`${campo}: está vazio e é obrigatório.`);
    }
  }

  const textos: TextoEncontrado[] = [];
  coletarTextos(content, '', textos);

  for (const termo of FORBIDDEN_TERMS) {
    const casador = casadorDe(termo);
    const achado = textos.find(({ texto }) => casador.test(texto));
    if (achado) {
      erros.push(
        `termo proibido ${JSON.stringify(termo)} em ${achado.caminho}: ${JSON.stringify(achado.texto)}`,
      );
    }
  }

  return erros;
}
