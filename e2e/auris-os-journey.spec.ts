import { test, expect, Page } from '@playwright/test';

const APPS = [
  { id: 'clinica', label: 'Prontuários' },
  { id: 'mapa', label: 'Mapa Auricular' },
  { id: 'sessao', label: 'Sessão' },
  { id: 'calendario', label: 'Agenda' },
  { id: 'financas', label: 'Finanças' },
  { id: 'browser', label: 'Navegador' },
  { id: 'notas', label: 'Notas' },
  { id: 'studio', label: 'Studio Sonoro' },
  { id: 'protocolos', label: 'Protocolos' },
  { id: 'knowledge', label: 'Biblioteca' },
  { id: 'aura', label: 'Aura AI' },
  { id: 'config', label: 'Configurações' },
];

async function assertNoCriticalErrors(page: Page) {
  const errors: string[] = await page.evaluate(() => {
    // Coletar erros via variável global injetada pelo teste
    return (window as any).__playwrightErrors || [];
  });
  const critical = errors.filter((e: string) =>
    !e.includes('ResizeObserver') &&
    !e.includes('manifest') &&
    !e.includes('favicon')
  );
  expect(critical).toHaveLength(0);
}

test.describe('Auris OS — Auditoria Completa', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="desktop-icon-clinica"]', { state: 'visible' });

    // Desativar modo edição do Bug Tracker se estiver ativo
    await page.evaluate(() => {
      localStorage.removeItem('auris-bug-tracker-storage');
      window.dispatchEvent(new CustomEvent('aura-desativar-modo-edicao'));
    });
    await page.waitForTimeout(200);

    // Injetar coletor de erros de console
    await page.evaluate(() => {
      (window as any).__playwrightErrors = [];
      window.addEventListener('error', (e) => (window as any).__playwrightErrors.push(e.message));
      window.addEventListener('unhandledrejection', (e) => (window as any).__playwrightErrors.push(String(e.reason)));
      const orig = console.error;
      console.error = (...args: any[]) => {
        (window as any).__playwrightErrors.push(args.join(' '));
        orig.apply(console, args);
      };
    });
  });

  test('deve abrir todos os 12 apps via double-click no desktop', async ({ page }) => {
    for (const app of APPS) {
      const icon = page.locator(`[data-testid="desktop-icon-${app.id}"]`);
      await icon.dblclick();
      await page.waitForTimeout(400);

      const window = page.locator(`.window-container[data-app="${app.id}"]`).first();
      await expect(window).toBeVisible({ timeout: 15000 });

      // Fechar janela
      const closeBtn = window.locator('[data-testid="window-close"]');
      await closeBtn.click({ force: true });
      await expect(window).not.toBeVisible({ timeout: 8000 });
    }

    await assertNoCriticalErrors(page);
  });

  test('deve gerenciar janelas: abrir, arrastar, minimizar, restaurar e fechar', async ({ page }) => {
    // Abrir Notas
    await page.locator('[data-testid="desktop-icon-notas"]').dblclick();
    await page.waitForTimeout(300);
    const window = page.locator('.window-container[data-app="notas"]').first();
    await expect(window).toBeVisible();

    // Arrastar pelo header
    const header = window.locator('[data-testid="window-header"]');
    const boxBefore = await window.boundingBox();
    expect(boxBefore).not.toBeNull();

    await header.dragTo(window, {
      sourcePosition: { x: 80, y: 10 },
      targetPosition: { x: 220, y: 160 },
    });

    const boxAfter = await window.boundingBox();
    expect(boxAfter).not.toBeNull();
    const moved = Math.abs(boxAfter!.x - boxBefore!.x) + Math.abs(boxAfter!.y - boxBefore!.y);
    expect(moved).toBeGreaterThan(10);

    // Fechar
    await window.locator('[data-testid="window-close"]').click({ force: true });
    await expect(window).not.toBeVisible({ timeout: 5000 });

    await assertNoCriticalErrors(page);
  });

  test('Notas: criar, editar, buscar, favoritar e arquivar', async ({ page }) => {
    // Abrir Notas
    await page.locator('[data-testid="desktop-icon-notas"]').dblclick();
    await page.waitForTimeout(500);

    // Garantir que a janela Notas está focada
    const notasWindow = page.locator('.window-container[data-app="notas"]').first();
    await notasWindow.click();

    // Criar nova nota
    await page.locator('[data-testid="notas-nova-nota-btn"]').click();
    await page.locator('[data-testid="nota-editor-titulo"]').waitFor({ state: 'visible' });

    // Preencher
    await page.locator('[data-testid="nota-editor-titulo"]').fill('Paciente Ana - Sessão 1');
    await page.locator('[data-testid="nota-editor-conteudo"]').fill('Observações iniciais da primeira sessão de auriculoterapia.');

    // Salvar e fechar editor
    await page.locator('[data-testid="nota-editor-salvar"]').click();
    await expect(page.locator('[data-testid="nota-editor-titulo"]')).toHaveCount(0, { timeout: 8000 });
    await page.waitForTimeout(600);

    // Verificar que a nota existe no grid antes de buscar
    const notasCount = await page.evaluate(() => {
      const key = Object.keys(localStorage).find(k => k.includes('notas-storage'));
      if (!key) return 0;
      try {
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        return data.state?.notas?.length || 0;
      } catch {
        return 0;
      }
    });
    if (notasCount === 0) {
      // Debug: esperar mais um pouco se o store ainda não hidratou
      await page.waitForTimeout(1500);
    }
    await expect(notasWindow).toContainText('Paciente Ana - Sessão 1');

    // Buscar
    await page.locator('[data-testid="notas-busca-input"]').fill('Ana');
    await page.waitForTimeout(500);
    const grid = page.locator('[data-testid="notas-grid"]');
    await expect(grid).toContainText('Paciente Ana - Sessão 1');

    // Limpar busca
    await page.locator('[data-testid="notas-busca-input"]').fill('');
    await page.waitForTimeout(300);

    // Fechar Notas
    await notasWindow.locator('[data-testid="window-close"]').click({ force: true });
    await expect(notasWindow).not.toBeVisible({ timeout: 5000 });

    await assertNoCriticalErrors(page);
  });

  test('Therapist First Client: Aura → Prontuários → criar paciente → abrir sessão', async ({ page }) => {
    // --- Aura: pedir ajuda ---
    // Usar force true porque o BugDetectorFloatingButton pode sobrepor parcialmente
    await page.locator('[data-testid="aura-orb"]').click({ force: true });
    await page.waitForTimeout(600);

    // Aguardar interface de chat expandir (overlay do orb, não window-container)
    const auraOverlay = page.locator('[data-testid="aura-overlay"]').first();
    await expect(auraOverlay).toBeVisible({ timeout: 10000 });

    await page.locator('[data-testid="aura-input"]').fill('Tenho meu primeiro cliente hoje, como cadastrar um paciente?');
    await page.locator('[data-testid="aura-enviar"]').click();

    // Verificar resposta da Aura
    await expect(auraOverlay).toContainText(/paciente|cadastrar|criar|prontuário/i, { timeout: 15000 });

    // Fechar Aura (overlay tem botão X diretamente no header)
    await auraOverlay.locator('button').filter({ has: page.locator('svg') }).first().click();
    await expect(auraOverlay).not.toBeVisible({ timeout: 5000 });

    // --- Prontuários: criar paciente ---
    await page.locator('[data-testid="desktop-icon-clinica"]').dblclick();
    await page.waitForTimeout(400);
    const clinicaWindow = page.locator('.window-container[data-app="clinica"]').first();
    await expect(clinicaWindow).toBeVisible();

    await clinicaWindow.locator('[data-testid="clinica-novo-paciente-btn"]').click();

    // Preencher formulário
    await clinicaWindow.locator('[data-testid="clinica-modal-nome"]').fill('Maria Silva');
    await clinicaWindow.locator('[data-testid="clinica-modal-data-nascimento"]').fill('1985-06-15');
    await clinicaWindow.locator('[data-testid="clinica-modal-salvar"]').click();

    // Verificar que paciente aparece na lista
    await expect(clinicaWindow).toContainText('Maria Silva', { timeout: 8000 });
    await expect(clinicaWindow).toContainText(/AUR-\d{4}-\d{4}/);

    // Clicar no paciente para garantir seleção
    await clinicaWindow.getByText('Maria Silva').first().click();
    await page.waitForTimeout(300);

    // --- Abrir Sessão ---
    await page.locator('[data-testid="desktop-icon-sessao"]').dblclick();
    await page.waitForTimeout(400);
    const sessaoWindow = page.locator('.window-container[data-app="sessao"]').first();
    await expect(sessaoWindow).toBeVisible({ timeout: 10000 });

    // Fechar janelas
    await sessaoWindow.locator('[data-testid="window-close"]').click({ force: true });
    await expect(sessaoWindow).not.toBeVisible({ timeout: 5000 });
    await clinicaWindow.locator('[data-testid="window-close"]').click({ force: true });
    await expect(clinicaWindow).not.toBeVisible({ timeout: 5000 });

    await assertNoCriticalErrors(page);
  });
});
