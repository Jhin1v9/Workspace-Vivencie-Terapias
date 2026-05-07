# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auris-os-journey.spec.ts >> Auris OS — Auditoria Completa >> Therapist First Client: Aura → Prontuários → criar paciente → abrir sessão
- Location: e2e\auris-os-journey.spec.ts:159:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-testid="aura-overlay"]').first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('[data-testid="aura-overlay"]').first()

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e5]:
    - generic [ref=e6] [cursor=pointer]:
      - img [ref=e8]
      - generic [ref=e10]: Prontuários
    - generic [ref=e11] [cursor=pointer]:
      - img [ref=e13]
      - generic [ref=e16]: Mapa Auricular
    - generic [ref=e17] [cursor=pointer]:
      - img [ref=e19]
      - generic [ref=e21]: Sessão
    - generic [ref=e22] [cursor=pointer]:
      - img [ref=e24]
      - generic [ref=e26]: Agenda
    - generic [ref=e27] [cursor=pointer]:
      - img [ref=e29]
      - generic [ref=e31]: Finanças
    - generic [ref=e32] [cursor=pointer]:
      - img [ref=e34]
      - generic [ref=e37]: Navegador
    - generic [ref=e38] [cursor=pointer]:
      - img [ref=e40]
      - generic [ref=e43]: Notas
    - generic [ref=e44] [cursor=pointer]:
      - img [ref=e46]
      - generic [ref=e50]: Studio Sonoro
    - generic [ref=e51] [cursor=pointer]:
      - img [ref=e53]
      - generic [ref=e55]: Protocolos
    - generic [ref=e56] [cursor=pointer]:
      - img [ref=e58]
      - generic [ref=e60]: Biblioteca
    - generic [ref=e61] [cursor=pointer]:
      - img [ref=e63]
      - generic [ref=e66]: Aura AI
    - generic [ref=e67] [cursor=pointer]:
      - img [ref=e69]
      - generic [ref=e72]: Configurações
  - img [ref=e81] [cursor=pointer]
  - region "Notifications alt+T"
  - button "Desativar Debug" [active] [ref=e87] [cursor=pointer]: ✕
  - button "📋" [ref=e88] [cursor=pointer]
  - button "✕ Sair do Modo Edição" [ref=e90] [cursor=pointer]:
    - generic [ref=e91]: ✕
    - text: Sair do Modo Edição
  - generic [ref=e96]:
    - paragraph [ref=e97]: Modo Edição Ativo
    - paragraph [ref=e98]: Passe o mouse e clique para reportar
```

# Test source

```ts
  67  |       await closeBtn.click({ force: true });
  68  |       await expect(window).not.toBeVisible({ timeout: 8000 });
  69  |     }
  70  | 
  71  |     await assertNoCriticalErrors(page);
  72  |   });
  73  | 
  74  |   test('deve gerenciar janelas: abrir, arrastar, minimizar, restaurar e fechar', async ({ page }) => {
  75  |     // Abrir Notas
  76  |     await page.locator('[data-testid="desktop-icon-notas"]').dblclick();
  77  |     await page.waitForTimeout(300);
  78  |     const window = page.locator('.window-container[data-app="notas"]').first();
  79  |     await expect(window).toBeVisible();
  80  | 
  81  |     // Arrastar pelo header
  82  |     const header = window.locator('[data-testid="window-header"]');
  83  |     const boxBefore = await window.boundingBox();
  84  |     expect(boxBefore).not.toBeNull();
  85  | 
  86  |     await header.dragTo(window, {
  87  |       sourcePosition: { x: 80, y: 10 },
  88  |       targetPosition: { x: 220, y: 160 },
  89  |     });
  90  | 
  91  |     const boxAfter = await window.boundingBox();
  92  |     expect(boxAfter).not.toBeNull();
  93  |     const moved = Math.abs(boxAfter!.x - boxBefore!.x) + Math.abs(boxAfter!.y - boxBefore!.y);
  94  |     expect(moved).toBeGreaterThan(10);
  95  | 
  96  |     // Fechar
  97  |     await window.locator('[data-testid="window-close"]').click({ force: true });
  98  |     await expect(window).not.toBeVisible({ timeout: 5000 });
  99  | 
  100 |     await assertNoCriticalErrors(page);
  101 |   });
  102 | 
  103 |   test('Notas: criar, editar, buscar, favoritar e arquivar', async ({ page }) => {
  104 |     // Abrir Notas
  105 |     await page.locator('[data-testid="desktop-icon-notas"]').dblclick();
  106 |     await page.waitForTimeout(500);
  107 | 
  108 |     // Garantir que a janela Notas está focada
  109 |     const notasWindow = page.locator('.window-container[data-app="notas"]').first();
  110 |     await notasWindow.click();
  111 | 
  112 |     // Criar nova nota
  113 |     await page.locator('[data-testid="notas-nova-nota-btn"]').click();
  114 |     await page.locator('[data-testid="nota-editor-titulo"]').waitFor({ state: 'visible' });
  115 | 
  116 |     // Preencher
  117 |     await page.locator('[data-testid="nota-editor-titulo"]').fill('Paciente Ana - Sessão 1');
  118 |     await page.locator('[data-testid="nota-editor-conteudo"]').fill('Observações iniciais da primeira sessão de auriculoterapia.');
  119 | 
  120 |     // Salvar e fechar editor
  121 |     await page.locator('[data-testid="nota-editor-salvar"]').click();
  122 |     await expect(page.locator('[data-testid="nota-editor-titulo"]')).toHaveCount(0, { timeout: 8000 });
  123 |     await page.waitForTimeout(600);
  124 | 
  125 |     // Verificar que a nota existe no grid antes de buscar
  126 |     const notasCount = await page.evaluate(() => {
  127 |       const key = Object.keys(localStorage).find(k => k.includes('notas-storage'));
  128 |       if (!key) return 0;
  129 |       try {
  130 |         const data = JSON.parse(localStorage.getItem(key) || '{}');
  131 |         return data.state?.notas?.length || 0;
  132 |       } catch {
  133 |         return 0;
  134 |       }
  135 |     });
  136 |     if (notasCount === 0) {
  137 |       // Debug: esperar mais um pouco se o store ainda não hidratou
  138 |       await page.waitForTimeout(1500);
  139 |     }
  140 |     await expect(notasWindow).toContainText('Paciente Ana - Sessão 1');
  141 | 
  142 |     // Buscar
  143 |     await page.locator('[data-testid="notas-busca-input"]').fill('Ana');
  144 |     await page.waitForTimeout(500);
  145 |     const grid = page.locator('[data-testid="notas-grid"]');
  146 |     await expect(grid).toContainText('Paciente Ana - Sessão 1');
  147 | 
  148 |     // Limpar busca
  149 |     await page.locator('[data-testid="notas-busca-input"]').fill('');
  150 |     await page.waitForTimeout(300);
  151 | 
  152 |     // Fechar Notas
  153 |     await notasWindow.locator('[data-testid="window-close"]').click({ force: true });
  154 |     await expect(notasWindow).not.toBeVisible({ timeout: 5000 });
  155 | 
  156 |     await assertNoCriticalErrors(page);
  157 |   });
  158 | 
  159 |   test('Therapist First Client: Aura → Prontuários → criar paciente → abrir sessão', async ({ page }) => {
  160 |     // --- Aura: pedir ajuda ---
  161 |     // Usar force true porque o BugDetectorFloatingButton pode sobrepor parcialmente
  162 |     await page.locator('[data-testid="aura-orb"]').click({ force: true });
  163 |     await page.waitForTimeout(600);
  164 | 
  165 |     // Aguardar interface de chat expandir (overlay do orb, não window-container)
  166 |     const auraOverlay = page.locator('[data-testid="aura-overlay"]').first();
> 167 |     await expect(auraOverlay).toBeVisible({ timeout: 10000 });
      |                               ^ Error: expect(locator).toBeVisible() failed
  168 | 
  169 |     await page.locator('[data-testid="aura-input"]').fill('Tenho meu primeiro cliente hoje, como cadastrar um paciente?');
  170 |     await page.locator('[data-testid="aura-enviar"]').click();
  171 | 
  172 |     // Verificar resposta da Aura
  173 |     await expect(auraOverlay).toContainText(/paciente|cadastrar|criar|prontuário/i, { timeout: 15000 });
  174 | 
  175 |     // Fechar Aura (overlay tem botão X diretamente no header)
  176 |     await auraOverlay.locator('button').filter({ has: page.locator('svg') }).first().click();
  177 |     await expect(auraOverlay).not.toBeVisible({ timeout: 5000 });
  178 | 
  179 |     // --- Prontuários: criar paciente ---
  180 |     await page.locator('[data-testid="desktop-icon-clinica"]').dblclick();
  181 |     await page.waitForTimeout(400);
  182 |     const clinicaWindow = page.locator('.window-container[data-app="clinica"]').first();
  183 |     await expect(clinicaWindow).toBeVisible();
  184 | 
  185 |     await clinicaWindow.locator('[data-testid="clinica-novo-paciente-btn"]').click();
  186 | 
  187 |     // Preencher formulário
  188 |     await clinicaWindow.locator('[data-testid="clinica-modal-nome"]').fill('Maria Silva');
  189 |     await clinicaWindow.locator('[data-testid="clinica-modal-data-nascimento"]').fill('1985-06-15');
  190 |     await clinicaWindow.locator('[data-testid="clinica-modal-salvar"]').click();
  191 | 
  192 |     // Verificar que paciente aparece na lista
  193 |     await expect(clinicaWindow).toContainText('Maria Silva', { timeout: 8000 });
  194 |     await expect(clinicaWindow).toContainText(/AUR-\d{4}-\d{4}/);
  195 | 
  196 |     // Clicar no paciente para garantir seleção
  197 |     await clinicaWindow.getByText('Maria Silva').first().click();
  198 |     await page.waitForTimeout(300);
  199 | 
  200 |     // --- Abrir Sessão ---
  201 |     await page.locator('[data-testid="desktop-icon-sessao"]').dblclick();
  202 |     await page.waitForTimeout(400);
  203 |     const sessaoWindow = page.locator('.window-container[data-app="sessao"]').first();
  204 |     await expect(sessaoWindow).toBeVisible({ timeout: 10000 });
  205 | 
  206 |     // Fechar janelas
  207 |     await sessaoWindow.locator('[data-testid="window-close"]').click({ force: true });
  208 |     await expect(sessaoWindow).not.toBeVisible({ timeout: 5000 });
  209 |     await clinicaWindow.locator('[data-testid="window-close"]').click({ force: true });
  210 |     await expect(clinicaWindow).not.toBeVisible({ timeout: 5000 });
  211 | 
  212 |     await assertNoCriticalErrors(page);
  213 |   });
  214 | });
  215 | 
```