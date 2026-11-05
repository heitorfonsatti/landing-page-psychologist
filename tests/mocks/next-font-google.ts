/**
 * Substituto de `next/font/google` nos testes.
 *
 * `next/font/google` é uma transformação de build: fora do bundler do Next,
 * `Fraunces(...)` não existe em tempo de execução. Este módulo entra no lugar
 * dele pelo alias em `vitest.config.mts`.
 *
 * Ao adicionar uma fonte ao site, adicione-a aqui também — o teste falha com
 * "X is not a function", que é o aviso de que isto ficou para trás.
 */
type ResultadoFonte = {
  className: string;
  variable: string;
  style: { fontFamily: string };
};

type OpcoesFonte = { variable?: string };

function fonteFalsa(nome: string) {
  return (opcoes?: OpcoesFonte): ResultadoFonte => ({
    className: `fonte-${nome}`,
    variable: opcoes?.variable ?? `--fonte-${nome}`,
    style: { fontFamily: nome },
  });
}

export const Fraunces = fonteFalsa('fraunces');
export const Source_Sans_3 = fonteFalsa('source-sans-3');
