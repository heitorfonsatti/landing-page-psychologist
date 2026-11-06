import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const files = (readdirSync('src', { recursive: true }) as string[])
  .filter((f) => f.endsWith('.module.css'))
  .map((f) => join('src', f));

const read = (file: string) => readFileSync(file, 'utf8');

describe('module stylesheets', () => {
  it('finds the module stylesheets', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it.each(files)('%s does not use retired palette tokens', (file) => {
    expect(read(file)).not.toMatch(/var\(--(blue|green|dark-blue)\)/);
  });

  // Colors come from the palette tokens, so each panel can recolor its accents.
  it.each(files)('%s has no hard-coded colors', (file) => {
    expect(read(file)).not.toMatch(/rgb\(|#[0-9a-f]{3,8}\b/i);
  });
});

describe('globals.css', () => {
  it('draws the focus ring in the panel ink color', () => {
    const css = read('src/app/globals.css');
    expect(css).toMatch(/:focus-visible\s*\{[^}]*outline:\s*3px solid var\(--ink\)/);
  });
});
