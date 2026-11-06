#!/usr/bin/env tsx
/**
 * Checks the real content before publishing. Runs via `npm run check:content`.
 *
 * Development can start with placeholder data: this check only sits on the
 * publishing path, and it is what keeps placeholder data and text that breaks
 * the CFP rules from going live.
 */
import { siteContent } from '@/content/site';
import { checkContent } from '@/lib/content-check';

const errors = checkContent(siteContent);

if (errors.length > 0) {
  console.error(`Content rejected: ${errors.length} problem(s):`);
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  console.error('\nFix src/content/site.ts before publishing.');
  process.exit(1);
}

console.log('Content approved.');
