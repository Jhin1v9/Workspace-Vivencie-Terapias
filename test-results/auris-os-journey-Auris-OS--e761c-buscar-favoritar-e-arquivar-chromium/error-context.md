# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auris-os-journey.spec.ts >> Auris OS — Auditoria Completa >> Notas: criar, editar, buscar, favoritar e arquivar
- Location: e2e\auris-os-journey.spec.ts:103:3

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('.window-container[data-app="notas"]').first()
Expected substring: "Paciente Ana - Sessão 1"
Received string:    "NotasNova NotaGridListaFiltrosTodas0Favoritas0Arquivadas0Vinculadas0Ordenar porÚltimas atualizadasMenos atualizadasCriadas recentementeCriadas antigamenteTítulo A-ZTítulo Z-ATagsauris-ostutorialEstatísticasTotal0Favoritas0Arquivadas0Tags únicas2Notas0 notasNova NotaNenhuma nota aindaCrie sua primeira nota para começar a organizar suas ideiasCriar Primeira Nota"
Timeout: 15000ms

Call log:
  - Expect "toContainText" with timeout 15000ms
  - waiting for locator('.window-container[data-app="notas"]').first()
    18 × locator resolved to <div data-app="notas" data-window-id="imqgv79ho" class="absolute window-container" code-path="src\components\os\Window.tsx:104:5">…</div>
       - unexpected value "NotasNova NotaGridListaFiltrosTodas0Favoritas0Arquivadas0Vinculadas0Ordenar porÚltimas atualizadasMenos atualizadasCriadas recentementeCriadas antigamenteTítulo A-ZTítulo Z-ATagsauris-ostutorialEstatísticasTotal0Favoritas0Arquivadas0Tags únicas2Notas0 notasNova NotaNenhuma nota aindaCrie sua primeira nota para começar a organizar suas ideiasCriar Primeira Nota"

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
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
      - generic [ref=e45] [cursor=pointer]:
        - img [ref=e47]
        - generic [ref=e51]: Studio Sonoro
      - generic [ref=e52] [cursor=pointer]:
        - img [ref=e54]
        - generic [ref=e56]: Protocolos
      - generic [ref=e57] [cursor=pointer]:
        - img [ref=e59]
        - generic [ref=e61]: Biblioteca
      - generic [ref=e62] [cursor=pointer]:
        - img [ref=e64]
        - generic [ref=e67]: Aura AI
      - generic [ref=e68] [cursor=pointer]:
        - img [ref=e70]
        - generic [ref=e73]: Configurações
    - generic [ref=e75]:
      - generic [ref=e76]:
        - generic [ref=e77]: Notas
        - generic [ref=e78]:
          - button [ref=e79] [cursor=pointer]
          - button [ref=e80] [cursor=pointer]
          - button [ref=e81] [cursor=pointer]
      - generic [ref=e83]:
        - generic [ref=e84]:
          - button "Nova Nota" [ref=e86] [cursor=pointer]:
            - img [ref=e87]
            - text: Nova Nota
          - generic [ref=e88]:
            - generic [ref=e89]:
              - button "Grid" [ref=e90] [cursor=pointer]:
                - img [ref=e91]
                - text: Grid
              - button "Lista" [ref=e96] [cursor=pointer]:
                - img [ref=e97]
                - text: Lista
            - generic [ref=e98]:
              - heading "Filtros" [level=3] [ref=e99]
              - generic [ref=e100]:
                - button "Todas 0" [ref=e101] [cursor=pointer]:
                  - generic [ref=e102]:
                    - img [ref=e103]
                    - text: Todas
                  - generic [ref=e108]: "0"
                - button "Favoritas 0" [ref=e109] [cursor=pointer]:
                  - generic [ref=e110]:
                    - img [ref=e111]
                    - text: Favoritas
                  - generic [ref=e113]: "0"
                - button "Arquivadas 0" [ref=e114] [cursor=pointer]:
                  - generic [ref=e115]:
                    - img [ref=e116]
                    - text: Arquivadas
                  - generic [ref=e119]: "0"
                - button "Vinculadas 0" [ref=e120] [cursor=pointer]:
                  - generic [ref=e121]:
                    - img [ref=e122]
                    - text: Vinculadas
                  - generic [ref=e125]: "0"
            - generic [ref=e126]:
              - heading "Ordenar por" [level=3] [ref=e127]
              - combobox [ref=e128]:
                - option "Últimas atualizadas" [selected]
                - option "Menos atualizadas"
                - option "Criadas recentemente"
                - option "Criadas antigamente"
                - option "Título A-Z"
                - option "Título Z-A"
            - generic [ref=e129]:
              - heading "Tags" [level=3] [ref=e130]
              - generic [ref=e131]:
                - button "auris-os" [ref=e132] [cursor=pointer]:
                  - img [ref=e133]
                  - text: auris-os
                - button "tutorial" [ref=e136] [cursor=pointer]:
                  - img [ref=e137]
                  - text: tutorial
            - generic [ref=e140]:
              - heading "Estatísticas" [level=3] [ref=e141]
              - generic [ref=e142]:
                - generic [ref=e143]:
                  - generic [ref=e144]: Total
                  - generic [ref=e145]: "0"
                - generic [ref=e146]:
                  - generic [ref=e147]: Favoritas
                  - generic [ref=e148]: "0"
                - generic [ref=e149]:
                  - generic [ref=e150]: Arquivadas
                  - generic [ref=e151]: "0"
                - generic [ref=e152]:
                  - generic [ref=e153]: Tags únicas
                  - generic [ref=e154]: "2"
        - generic [ref=e155]:
          - generic [ref=e156]:
            - generic [ref=e158]:
              - img [ref=e160]
              - generic [ref=e163]:
                - heading "Notas" [level=1] [ref=e164]
                - paragraph [ref=e165]: 0 notas
            - generic [ref=e166]:
              - generic [ref=e167]:
                - img [ref=e168]
                - textbox "Buscar notas..." [ref=e171]
              - button "Nova Nota" [ref=e172] [cursor=pointer]:
                - img [ref=e173]
                - text: Nova Nota
          - generic [ref=e175]:
            - img [ref=e177]
            - heading "Nenhuma nota ainda" [level=3] [ref=e180]
            - paragraph [ref=e181]: Crie sua primeira nota para começar a organizar suas ideias
            - button "Criar Primeira Nota" [ref=e182] [cursor=pointer]:
              - img [ref=e183]
              - text: Criar Primeira Nota
  - img [ref=e192] [cursor=pointer]
  - region "Notifications alt+T"
  - button "Ativar Debug" [ref=e198] [cursor=pointer]: 🐛
  - button "📋" [ref=e199] [cursor=pointer]
```

# Test source

```ts
  40  |     });
  41  |     await page.waitForTimeout(200);
  42  | 
  43  |     // Injetar coletor de erros de console
  44  |     await page.evaluate(() => {
  45  |       (window as any).__playwrightErrors = [];
  46  |       window.addEventListener('error', (e) => (window as any).__playwrightErrors.push(e.message));
  47  |       window.addEventListener('unhandledrejection', (e) => (window as any).__playwrightErrors.push(String(e.reason)));
  48  |       const orig = console.error;
  49  |       console.error = (...args: any[]) => {
  50  |         (window as any).__playwrightErrors.push(args.join(' '));
  51  |         orig.apply(console, args);
  52  |       };
  53  |     });
  54  |   });
  55  | 
  56  |   test('deve abrir todos os 12 apps via double-click no desktop', async ({ page }) => {
  57  |     for (const app of APPS) {
  58  |       const icon = page.locator(`[data-testid="desktop-icon-${app.id}"]`);
  59  |       await icon.dblclick();
  60  |       await page.waitForTimeout(400);
  61  | 
  62  |       const window = page.locator(`.window-container[data-app="${app.id}"]`).first();
  63  |       await expect(window).toBeVisible({ timeout: 15000 });
  64  | 
  65  |       // Fechar janela
  66  |       const closeBtn = window.locator('[data-testid="window-close"]');
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
> 140 |     await expect(notasWindow).toContainText('Paciente Ana - Sessão 1');
      |                               ^ Error: expect(locator).toContainText(expected) failed
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
  167 |     await expect(auraOverlay).toBeVisible({ timeout: 10000 });
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