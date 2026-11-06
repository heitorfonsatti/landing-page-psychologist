import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';

const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as {
  dependencies: Record<string, string>;
};

it('does not gain a new runtime dependency', () => {
  expect(Object.keys(pkg.dependencies).sort()).toEqual(['next', 'react', 'react-dom']);
});
