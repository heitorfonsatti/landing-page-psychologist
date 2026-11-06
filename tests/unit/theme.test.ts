import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync('src/app/globals.css', 'utf8');

describe('globals.css', () => {
  it.each([
    ['--beige', '#f2efe2'],
    ['--brown', '#785135'],
    ['--dark-brown', '#3a2718'],
  ])('defines %s as %s', (name, value) => {
    expect(css).toMatch(new RegExp(`${name}:\\s*${value}\\s*;`, 'i'));
  });

  it('defines --fade-max as 0.55', () => {
    expect(css).toMatch(/--fade-max:\s*0\.55\s*;/);
  });

  it('fades covered content by --fade-max times the coverage', () => {
    expect(css).toMatch(/opacity:\s*calc\(1 - var\(--fade-max\) \* var\(--coverage, 0\)\)/);
  });

  it.each(['--blue', '--green', '--dark-blue'])('no longer defines %s', (name) => {
    expect(css).not.toMatch(new RegExp(`${name}:`));
  });

  it('applies scroll-margin-top to sections', () => {
    expect(css).toMatch(/scroll-margin-top:\s*var\(--stack-top\)/);
  });

  // Review Focus 5
  it('turns off transitions and animations under prefers-reduced-motion', () => {
    const block = css.match(/@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*?\n\}/)?.[0] ?? '';
    expect(block).toMatch(/transition[^;]*:\s*none/);
    expect(block).toMatch(/animation[^;]*:\s*none/);
  });

  it('does not hide horizontal overflow on body or html', () => {
    expect(css).not.toMatch(/overflow-x:\s*hidden/);
  });
});
