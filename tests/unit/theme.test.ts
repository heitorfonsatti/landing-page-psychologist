import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync('src/app/globals.css', 'utf8');

describe('globals.css', () => {
  it.each([
    ['--bege', '#f2efe2'],
    ['--marrom', '#785135'],
    ['--azul', '#5b7c81'],
    ['--verde', '#a1b799'],
    ['--marrom-escuro', '#3a2718'],
    ['--azul-escuro', '#466267'],
  ])('define %s como %s', (nome, valor) => {
    expect(css).toMatch(new RegExp(`${nome}:\\s*${valor}\\s*;`, 'i'));
  });

  it('aplica scroll-margin-top nas seções', () => {
    expect(css).toMatch(/scroll-margin-top:\s*var\(--altura-cabecalho\)/);
  });

  // Review Focus 5
  it('desativa transições e animações em prefers-reduced-motion', () => {
    const bloco = css.match(/@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*?\n\}/)?.[0] ?? '';
    expect(bloco).toMatch(/transition[^;]*:\s*none/);
    expect(bloco).toMatch(/animation[^;]*:\s*none/);
  });

  it('não esconde a rolagem horizontal no body ou no html', () => {
    expect(css).not.toMatch(/overflow-x:\s*hidden/);
  });
});
