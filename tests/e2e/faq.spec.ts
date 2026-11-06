import { expect, test } from '@playwright/test';

test('opening a question closes the previous one', async ({ page }) => {
  await page.goto('/');
  const summaries = page.locator('#duvidas summary');
  await summaries.nth(0).click();
  await summaries.nth(1).click();

  await expect(page.locator('#duvidas details[open]')).toHaveCount(1);
  await expect(page.locator('#duvidas details').nth(1)).toHaveAttribute('open', '');
});
