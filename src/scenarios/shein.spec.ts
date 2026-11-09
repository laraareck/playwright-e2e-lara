import { test, expect, Page } from '@playwright/test';

async function aceitarCookies(page: Page) {
  const botao = page.getByText('Aceitar todos os cookies');
  if (await botao.isVisible({ timeout: 5000 }).catch(() => false)) {
    await botao.click();
  }
}

function campoBusca(page: Page) {
  return page.locator('input:visible').first();
}

test.describe('Shein Brasil - cookies', () => {
  test('CT01 - banner de cookies aparece e some ao aceitar', async ({
    page
  }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const botao = page.getByText('Aceitar todos os cookies');
    await expect(botao).toBeVisible();
    await botao.click();
    await expect(botao).toBeHidden();
  });
});

test.describe('Shein Brasil - página inicial', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await aceitarCookies(page);
  });

  test('CT02 - página inicial carrega com o título da Shein', async ({
    page
  }) => {
    await expect(page).toHaveTitle(/SHEIN/i);
    await expect(page).toHaveURL(/shein\.com/);
  });

  test('CT03 - menu de navegação mostra Promoção e Moda praia', async ({
    page
  }) => {
    await expect(page.getByText('Promoção').first()).toBeVisible();
    await expect(page.getByText('Moda praia').first()).toBeVisible();
  });

  test('CT04 - barra superior mostra Frete grátis', async ({ page }) => {
    await expect(page.getByText('Frete grátis').first()).toBeVisible();
  });
});
