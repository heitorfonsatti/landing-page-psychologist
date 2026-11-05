#!/usr/bin/env tsx
/**
 * Confere o conteúdo real antes de publicar. Roda via `npm run check:content`.
 *
 * O desenvolvimento pode começar com dados provisórios: esta checagem só
 * aparece no caminho da publicação, e é ela que impede dados de exemplo e
 * textos fora das regras do CFP de entrarem no ar.
 */
import { siteContent } from '@/content/site';
import { checkContent } from '@/lib/content-check';

const erros = checkContent(siteContent);

if (erros.length > 0) {
  console.error(`Conteúdo reprovado — ${erros.length} problema(s):`);
  for (const erro of erros) {
    console.error(`  - ${erro}`);
  }
  console.error('\nCorrija src/content/site.ts antes de publicar.');
  process.exit(1);
}

console.log('Conteúdo aprovado.');
