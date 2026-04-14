# 🐛 BugDetector Pro

Ferramenta profissional de debug com IA para qualquer projeto web. Capture, analise e resolva bugs com a ajuda de 8 especialistas de IA.

[![npm version](https://badge.fury.io/js/@auris%2Fbug-detector.svg)](https://www.npmjs.com/package/@auris/bug-detector)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

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
import { useBugDetector } from '@auris/bug-detector/react';

function App() {
  const { activate, isActive } = useBugDetector({
    ai: {
      provider: 'gemini',
      apiKey: process.env.GEMINI_API_KEY,
    },
    trigger: 'floating-button',
  });

  return (
    <button onClick={activate}>
      {isActive ? 'Desativar' : 'Ativar'} Debug
    </button>
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
    provider: 'gemini', // 'gemini' | 'openai'
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

## 🧠 8 Especialistas de IA

Cada bug é analisado por 8 especialistas:

| Especialista | Foco |
|--------------|------|
| 🏗️ Arquiteto | Estrutura, Patterns |
| 🎨 UI/UX | Acessibilidade, Design |
| ⚡ Performance | Otimização |
| 📘 TypeScript | Type Safety |
| ⚛️ React | Hooks, Patterns |
| 🎨 CSS/Tailwind | Estilos |
| 🧪 Testing | QA, Edge Cases |
| 🛠️ DX | Developer Experience |

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

// Download
BugDetector.ReportGenerator.download(result);
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

## 📚 Documentação

- [Guia de Instalação](./docs/INSTALL.md)
- [API Reference](./docs/API.md)
- [Integrações](./docs/INTEGRATIONS.md)
- [Exemplos](./docs/EXAMPLES.md)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 License

Distribuído sob licença MIT. Veja [LICENSE](./LICENSE) para mais informações.

---

<p align="center">
  Feito com ❤️ pela <a href="https://github.com/auris-team">Auris Team</a>
</p>
