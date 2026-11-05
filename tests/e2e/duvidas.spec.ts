import { expect, test } from '@playwright/test';

test('abrir uma pergunta fecha a anterior', async ({ page }) => {
  await page.goto('/');
  const resumos = page.locator('#duvidas summary');
  await resumos.nth(0).click();
  await resumos.nth(1).click();

  await expect(page.locator('#duvidas details[open]')).toHaveCount(1);
  await expect(page.locator('#duvidas details').nth(1)).toHaveAttribute('open', '');
});
