import { describe, expect, it } from 'vitest';
import { cobertura } from '@/lib/pilha';

describe('cobertura', () => {
  it('é 0 quando a próxima ainda está no fundo da tela', () => {
    expect(cobertura(844, 113, 844)).toBe(0);
  });
  it('é 1 quando a próxima chegou ao topo visível', () => {
    expect(cobertura(113, 113, 844)).toBe(1);
  });
  it('é proporcional no meio do caminho', () => {
    expect(cobertura(478.5, 113, 844)).toBeCloseTo(0.5);
  });
  it('fica em 0 com a próxima abaixo da tela e em 1 além do topo', () => {
    expect(cobertura(1200, 113, 844)).toBe(0);
    expect(cobertura(-50, 113, 844)).toBe(1);
  });
  it('não divide por zero quando o topo visível encosta no fundo', () => {
    expect(cobertura(100, 844, 844)).toBe(1);
    expect(cobertura(900, 844, 844)).toBe(0);
  });
});
