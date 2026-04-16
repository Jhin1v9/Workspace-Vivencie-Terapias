# 🐛 BugDetector — Uso em Projetos Locais

Pacote pronto para instalar em **qualquer projeto web** do seu PC via arquivo `.tgz`.

---

## ✅ O que está incluso

- `auris-bug-detector-1.0.0.tgz` — pacote empacotado com build de produção (dist/)
- Adapters para **React**, **Vue** e **Vanilla JS**
- Captura de screenshot, console, network e device info
- Painel de reports com exportação JSON
- Sem dependências obrigatórias de framework (React/Vue são `peerDependencies` opcionais)

---

## 📦 Instalação

### 1. Copie o arquivo para o projeto destino

Copie o arquivo `auris-bug-detector-1.0.0.tgz` da raiz deste repositório para a pasta do projeto onde você quer usar.

### 2. Instale via npm/yarn/pnpm

```bash
# npm
npm install ./auris-bug-detector-1.0.0.tgz

# yarn
yarn add file:./auris-bug-detector-1.0.0.tgz

# pnpm
pnpm add ./auris-bug-detector-1.0.0.tgz
```

> Se o projeto for React, certifique-se de que `react` e `react-dom` já estejam instalados (qualquer versão >= 16.8).

---

## 🚀 Uso Rápido

### React (sem IA, modo padrão)

```tsx
import { BugDetectorProvider, BugDetectorFloatingButton } from '@auris/bug-detector/react';

function App() {
  return (
    <BugDetectorProvider config={{ shortcut: 'ctrl+shift+d', headless: false }}>
      <SeuApp />
      <BugDetectorFloatingButton position="bottom-right" />
    </BugDetectorProvider>
  );
}
```

### Vue

```ts
import { createBugDetector } from '@auris/bug-detector/vue';

const bugDetector = createBugDetector({ shortcut: 'ctrl+shift+d' });
app.use(bugDetector);
```

### Vanilla JS (qualquer site)

```ts
import { BugDetector } from '@auris/bug-detector';

const detector = new BugDetector({ shortcut: 'ctrl+shift+d' });
detector.start();
```

---

## 🤖 Como funciona a IA?

### O BugDetector **não precisa da Aura** nem de nenhuma IA embutida no projeto.

Ele é 100% independente. A IA funciona assim:

1. **Sem IA configurada** (`provider: 'none'` — padrão):
   - Tudo funciona normal: inspeção, screenshots, console logs, network requests, painel de reports, exportação para Markdown/JSON/HTML.
   - O report é salvo localmente sem análise automática.
   - O chat do painel responde: *"Análise de IA não configurada. Configure uma API key para usar esta funcionalidade."*

2. **Com IA configurada** (Gemini, OpenAI ou DeepSeek):
   - Ao criar um report, o `BugDetector` dispara automaticamente a análise.
   - Ele monta um **prompt técnico dinâmico** com os dados do bug (elemento HTML, console logs, network, screenshot, descrição do usuário).
   - Envia para a API que você configurou.
   - Retorna a análise estruturada (causa raiz, solução, gravidade, confiança).

### Como configurar a IA

```tsx
<BugDetectorProvider
  config={{
    shortcut: 'ctrl+shift+d',
    ai: {
      provider: 'gemini', // 'gemini' | 'openai' | 'deepseek' | 'none'
      apiKey: 'SUA_API_KEY_AQUI',
      model: 'gemini-1.5-flash', // opcional
      temperature: 0.3, // opcional
    },
  }}
>
  <SeuApp />
  <BugDetectorFloatingButton />
</BugDetectorProvider>
```

> A API key é usada diretamente no front-end (fetch do navegador). Para produção, recomenda-se proxyar pela sua própria API.

### Como os prompts são montados

O `IntelligenceEngine` (dentro do pacote) gera os prompts automaticamente. Ele usa **8 especialistas virtuais** (personalidades):

- 🏗️ **Arquiteto** — estrutura, patterns, acoplamento
- 🎨 **UI/UX** — acessibilidade, design, feedback
- ⚡ **Performance** — renderização, memory leaks, bundle
- 📘 **TypeScript** — type safety, generics, inferência
- ⚛️ **React** — hooks, re-renders, state management
- 🎨 **CSS/Tailwind** — especificidade, responsividade
- 🧪 **Testing** — cobertura, edge cases
- 🛠️ **DX** — documentação, legibilidade

Cada um recebe um prompt customizado com os dados do report. Depois, um **prompt de consolidação** junta todas as análises em um único diagnóstico final com:

- `category` — categoria do bug
- `severity` — severidade
- `rootCause` — causa raiz
- `technicalDescription` — descrição técnica
- `recommendations` — recomendações
- `codeFix` — correção sugerida em código
- `confidence` — confiança (%)

---

## ⌨️ Atalhos e Interação

| Ação | Como fazer |
|------|------------|
| Ativar inspeção | `Ctrl + Shift + D` ou clique no botão flutuante |
| Selecionar elemento | Passe o mouse e clique no elemento desejado |
| Cancelar inspeção | Pressione `ESC` |
| Abrir painel de reports | Programaticamente via `detector.openPanel()` ou botão customizado |

---

## 🧪 Testado e validado

- **Build:** `npm run build` ✅
- **TypeScript:** `tsc --noEmit` ✅ (zero erros)
- **End-to-end:** Playwright rodando fluxo completo (ativação → hover → modal → envio → painel) ✅

---

## 📁 Estrutura do pacote

```
node_modules/@auris/bug-detector/
├── dist/
│   ├── index.js          # Vanilla / UMD
│   ├── index.esm.js      # Vanilla / ESM
│   ├── adapters/
│   │   ├── react.js      # Adapter React
│   │   └── vue.js        # Adapter Vue
│   └── *.d.ts            # Tipagens TypeScript
└── README.md
```

---

## 🌐 Uso em sites externos (qualquer site na web)

Você não precisa instalar nada no projeto. Existem 3 formas de injetar o BugDetector em **qualquer site aberto no seu navegador**:

### 1. Console do DevTools (mais fácil)

1. Abra o site que você quer debugar.
2. Aperte `F12` → aba **Console**.
3. Copie TODO o conteúdo do arquivo `bugdetector-snippet.js` (da raiz deste repo) e cole no console.
4. Aperte `Enter`.

Pronto! O botão 🐛 vai aparecer no canto inferior direito da página. Funciona em **qualquer site**, inclusive Google, YouTube, sites de terceiros, etc.

> O arquivo `bugdetector-snippet.js` já contém o build IIFE completo (~560KB) + o código de inicialização automática.

### 2. Bookmarklet (favorito no navegador)

O bookmarklet carrega o script de uma URL externa (você precisa hospedar o `bug-detector.iife.js` em algum lugar acessível).

1. Edite o arquivo `bugdetector-bookmarklet.js` e substitua `https://SEU-DOMINIO-AQUI.com/bug-detector.iife.js` pela URL real do seu arquivo.
2. Copie a linha que começa com `javascript:(function()...`.
3. No navegador, crie um novo favorito e cole essa linha no campo URL.
4. Sempre que clicar no favorito em qualquer site, o BugDetector será injetado.

**Dica rápida para hospedar localmente (mesma rede WiFi):**
```bash
python serve-bugdetector.py
```
O script sobe um servidor em `http://SEU_IP:8765/`. Use essa URL no bookmarklet/userscript.

### 3. Tampermonkey / Userscript (sempre ativo)

1. Instale a extensão **Tampermonkey** no Chrome/Firefox.
2. Crie um novo script.
3. Copie o conteúdo de `bugdetector-userscript.js`.
4. Substitua a URL no topo pelo local onde você hospedou o `bug-detector.iife.js`.
5. Salve. O BugDetector será injetado automaticamente em todos os sites (`*://*/*`).

---

## ⚠️ Notas

- O pacote depende de `html2canvas` para screenshots; ele será instalado automaticamente junto com o pacote.
- Em projetos **Vite**, se houver erro de CJS/ESM no adapter React, adicione ao `vite.config.ts`:
  ```ts
  optimizeDeps: {
    include: ['@auris/bug-detector/react'],
  }
  ```
