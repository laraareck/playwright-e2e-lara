import { test, expect, Page } from '@playwright/test';

async function fecharPopups(page: Page) {
  const candidatos = [
    page.getByRole('button', { name: /aceitar|accept/i }),
    page.locator('[class*="close"]').first()
  ];
  for (const el of candidatos) {
    if (await el.isVisible({ timeout: 2000 }).catch(() => false)) {
      await el.click({ timeout: 2000 }).catch(() => {});
    }
  }
}

test.describe('Shein Brasil', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await fecharPopups(page);
  });

  test('CT01 - página inicial carrega com o título da Shein', async ({
    page
  }) => {
    await expect(page).toHaveTitle(/SHEIN/i);
    await expect(page).toHaveURL(/shein\.com/);
  });

  test('CT02 - campo de busca está visível e aceita texto', async ({
    page
  }) => {
    const busca = page
      .getByRole('searchbox')
      .or(page.locator('input[type="search"], input[name="search_input"]'))
      .first();
    await expect(busca).toBeVisible();
    await busca.fill('vestido');
    await expect(busca).toHaveValue('vestido');
  });

  test('CT03 - busca por "vestido" leva à página de resultados', async ({
    page
  }) => {
    const busca = page
      .getByRole('searchbox')
      .or(page.locator('input[type="search"], input[name="search_input"]'))
      .first();
    await busca.fill('vestido');
    await busca.press('Enter');
    await expect(page).toHaveURL(/vestido/i);
  });
});
