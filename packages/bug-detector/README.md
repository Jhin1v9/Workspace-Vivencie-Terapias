# 🐛 BugDetector Pro

Ferramenta profissional de debug com IA para qualquer projeto web. Capture, analise e resolva bugs com a ajuda de especialistas de IA.

## ✨ Features

- 🔍 **Inspeção Visual** - Clique em qualquer elemento para inspecionar
- 🧠 **Análise com IA** - 8 especialistas analisam cada bug
- 📸 **Screenshots** - Capture automaticamente a tela
- 💬 **Chat Interativo** - Converse com a IA sobre o bug
- 📄 **Relatórios** - Exporte em Markdown, JSON ou HTML
- 🔗 **Integrações** - GitHub, Jira, Slack
- 🎯 **Multi-framework** - React, Vue, Angular, Vanilla JS

## 📦 Instalação

```bash
npm install @auris/bug-detector
# ou
yarn add @auris/bug-detector
# ou
pnpm add @auris/bug-detector
```

### CDN

```html
<script src="https://unpkg.com/@auris/bug-detector@latest/dist/bug-detector.umd.js"></script>
```

## 🚀 Uso Rápido

### React

```tsx
import { BugDetectorProvider, useBugDetector, BugDetectorFloatingButton } from '@auris/bug-detector/react';

function App() {
  return (
    <BugDetectorProvider config={{ autoActivateInDev: true }}>
      <YourApp />
      <BugDetectorFloatingButton />
    </BugDetectorProvider>
  );
}

function DebugControls() {
  const { isActive, activate, deactivate, reports, stats } = useBugDetector();

  return (
    <div>
      <button onClick={isActive ? deactivate : activate}>
        {isActive ? 'Desativar' : 'Ativar'} Debug
      </button>
      <p>Total: {stats.total} | Pendentes: {stats.pending}</p>
    </div>
  );
}
```

### Vue

```typescript
import { createBugDetector } from '@auris/bug-detector/vue';

const app = createApp(App);

app.use(createBugDetector, {
  ai: {
    provider: 'gemini',
    apiKey: 'YOUR_API_KEY',
  },
});
```

```vue
<template>
  <button @click="$bugDetector.activate()">
    🐛 Debug
  </button>
</template>
```

### Vanilla JS

```html
<script src="https://unpkg.com/@auris/bug-detector@latest"></script>
<script>
  const detector = new BugDetector.BugDetector({
    ai: {
      provider: 'gemini',
      apiKey: 'YOUR_API_KEY',
    },
  });

  // Cria botão flutuante
  BugDetector.createFloatingButton();

  // Ou ativa manualmente
  detector.activate();
</script>
```

## ⚙️ Configuração

```typescript
const detector = new BugDetector({
  // Trigger
  trigger: 'floating-button', // 'floating-button' | 'keyboard-shortcut' | 'manual'
  shortcut: 'Ctrl+Shift+D',

  // IA
  ai: {
    provider: 'gemini', // 'gemini' | 'openai' | 'none'
    apiKey: 'YOUR_API_KEY',
    model: 'gemini-pro',
    temperature: 0.3,
  },

  // Captura
  capture: {
    screenshot: true,
    console: true,
    network: true,
    performance: true,
  },

  // Persistência
  persistTo: 'localStorage', // 'localStorage' | 'indexedDB' | 'api' | 'none'

  // Integrações
  integrations: {
    github: {
      repo: 'owner/repo',
      token: 'GITHUB_TOKEN',
    },
    slack: {
      webhook: 'SLACK_WEBHOOK_URL',
    },
  },
});
```

## 🧠 API do Hook (React)

### `useBugDetector()`

```typescript
interface UseBugDetectorReturn {
  isActive: boolean;
  activate: () => void;
  deactivate: () => void;
  toggle: () => void;
  selectedElement: InspectedElement | null;
  reports: BugReport[];
  stats: BugStats;
  createReport: (data: CreateReportData) => Promise<BugReport>;
  exportReport: (reportId: string, options: ExportOptions) => Promise<ExportResult>;
  resolveReport: (id: string) => Promise<void>;
  deleteReport: (id: string) => Promise<void>;
}
```

### `useBugDetectorAdvanced()`

```typescript
const {
  detector,
  refreshReports,
  analyzeWithAI,
  createGitHubIssue,
  notifySlack,
  openPanel,
  closePanel,
  isPanelOpen,
} = useBugDetectorAdvanced();
```

## 🎨 Componentes Visuais

### `BugDetectorProvider`

Envolve sua aplicação e gerencia o estado do bug detector.

**Props:**
- `config?: BugDetectorConfig` - Configuração opcional

### `BugDetectorFloatingButton`

Botão flutuante pronto para ativar/desativar.

**Props:**
- `position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'`
- `color?: string`

### `BugDetectorOverlay`

Overlay de inspeção visual (renderizado automaticamente pelo Provider).

### `BugReportModal`

Modal de criação de reports (renderizado automaticamente pelo Provider).

### `BugTrackerPanel`

Painel lateral de listagem de reports (renderizado automaticamente pelo Provider).

## 🧪 Testando no Navegador

```javascript
// Ativar via console
window.dispatchEvent(new CustomEvent('aura-ativar-modo-edicao'));

// Ou use o hook
const { activate } = useBugDetector();
activate();
```

## 📄 Exportando Relatórios

```typescript
const report = await detector.createReport({
  description: 'Botão não funciona',
  severity: 'high',
});

// Exporta como Markdown
const result = await detector.exportReport(report.id, {
  format: 'markdown',
  includeScreenshot: true,
  includeAIAnalysis: true,
});
```

## 🔗 Integrações

### GitHub Issues

```typescript
await detector.createGitHubIssue(reportId, {
  repo: 'myorg/myrepo',
  labels: ['bug', 'ai-analyzed'],
});
```

### Jira

```typescript
await detector.createJiraTicket(reportId);
```

### Slack

```typescript
await detector.notifySlack(reportId, {
  channel: '#bugs',
});
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 License

Distribuído sob licença MIT.

---

<p align="center">
  Feito com ❤️ pela <a href="https://github.com/auris-team">Auris Team</a>
</p>
