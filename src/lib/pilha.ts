/**
 * Quanto de uma parte da pilha já foi coberto pela parte seguinte, de 0 a 1.
 *
 * A cobertura começa quando o topo da próxima parte aparece no fundo da tela
 * e termina quando ele alcança o topo visível da parte atual.
 *
 * @param topoProxima topo da próxima parte, relativo à tela, em px.
 * @param topoVisivelAtual topo visível da parte atual: o maior entre o topo
 *   dela e a altura do cabeçalho fixo, em px.
 * @param alturaTela altura da tela, em px.
 */
export function cobertura(
  topoProxima: number,
  topoVisivelAtual: number,
  alturaTela: number,
): number {
  const percurso = alturaTela - topoVisivelAtual;
  if (percurso <= 0) {
    return topoProxima <= topoVisivelAtual ? 1 : 0;
  }
  const fracao = (alturaTela - topoProxima) / percurso;
  return Math.min(1, Math.max(0, fracao));
}
