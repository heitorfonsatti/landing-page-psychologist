import { describe, expect, it } from 'vitest';
import { cobertura, rolagemParaMostrar } from '@/lib/pilha';

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

describe('rolagemParaMostrar', () => {
  // parte que cabe: 731px numa tela de 844 com cabeçalho de 113
  const cabe = { topoNatural: 2000, alturaParte: 731, alturaTela: 844, topo: 113 };
  // parte alta: 1400px
  const alta = { topoNatural: 2000, alturaParte: 1400, alturaTela: 844, topo: 113 };

  it('leva uma parte que cabe ao seu lugar natural, logo abaixo do cabeçalho', () => {
    expect(rolagemParaMostrar({ ...cabe, deslocamento: 0 })).toBe(1887);
    expect(rolagemParaMostrar({ ...cabe, deslocamento: 500 })).toBe(1887);
  });

  it('numa parte alta, leva o alvo para logo abaixo do cabeçalho, com margem', () => {
    expect(rolagemParaMostrar({ ...alta, deslocamento: 300 })).toBe(1887 + 300 - 16);
  });

  it('numa parte alta, nunca passa do ponto em que ela gruda pelo pé', () => {
    // 1400 − (844 − 113) = 669 de rolagem livre dentro da parte
    expect(rolagemParaMostrar({ ...alta, deslocamento: 1350 })).toBe(1887 + 669);
  });

  it('nunca rola para antes do topo natural da parte', () => {
    expect(rolagemParaMostrar({ ...alta, deslocamento: 5 })).toBe(1887);
  });
});
