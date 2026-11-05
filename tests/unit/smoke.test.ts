import { describe, expect, it } from 'vitest';

describe('ambiente de teste', () => {
  it('resolve o alias @/', async () => {
    const mod = await import('@/app/page');
    expect(typeof mod.default).toBe('function');
  });
});
