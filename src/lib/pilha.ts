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

/** Dados para calcular onde rolar para mostrar um ponto de uma parte. */
export type AlvoNaPilha = {
  /** Topo da parte no documento, na posição em que estaria sem grudar, em px. */
  topoNatural: number;
  /** Altura da parte, em px. */
  alturaParte: number;
  /** Distância do alvo até o topo da parte, em px (0 para a própria parte). */
  deslocamento: number;
  /** Altura da tela, em px. */
  alturaTela: number;
  /** Altura do cabeçalho fixo — onde as partes grudam —, em px. */
  topo: number;
  /** Folga acima do alvo, em px. */
  margem?: number;
};

/**
 * Posição de rolagem que mostra um alvo dentro de uma parte da pilha, com a
 * parte descoberta.
 *
 * O navegador, sozinho, rola até a posição *atual* de uma parte grudada —
 * que já está dentro da tela, só que coberta — e por isso não rola. Aqui a
 * conta parte da posição natural: a parte começa logo abaixo do cabeçalho e,
 * se for mais alta que a tela, rola por dentro até o ponto em que gruda pelo
 * pé, nunca além, para a seguinte não a cobrir.
 */
export function rolagemParaMostrar({
  topoNatural,
  alturaParte,
  deslocamento,
  alturaTela,
  topo,
  margem = 16,
}: AlvoNaPilha): number {
  const inicio = topoNatural - topo;
  const folgaInterna = Math.max(0, alturaParte - (alturaTela - topo));
  const dentro = Math.min(folgaInterna, Math.max(0, deslocamento - margem));
  return inicio + dentro;
}
