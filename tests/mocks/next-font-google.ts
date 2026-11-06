/**
 * Stand-in for `next/font/google` in tests.
 *
 * `next/font/google` is a build-time transform: outside the Next bundler,
 * `Fraunces(...)` does not exist at runtime. This module replaces it through
 * the alias in `vitest.config.mts`.
 *
 * When adding a font to the site, add it here too. The test fails with
 * "X is not a function", which is the signal that this file fell behind.
 */
type FontResult = {
  className: string;
  variable: string;
  style: { fontFamily: string };
};

type FontOptions = { variable?: string };

function fakeFont(name: string) {
  return (options?: FontOptions): FontResult => ({
    className: `font-${name}`,
    variable: options?.variable ?? `--font-${name}`,
    style: { fontFamily: name },
  });
}

export const Fraunces = fakeFont('fraunces');
export const Source_Sans_3 = fakeFont('source-sans-3');
