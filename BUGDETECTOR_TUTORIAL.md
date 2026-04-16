# 📘 BugDetector Pro — Tutorial Completo

> Como usar todas as features do BugDetector Pro: do básico ao avançado.

---

## 📦 1. Instalação

### Opção A: React (recomendado para apps React/Vite)

```bash
npm install @auris/bug-detector
```

No seu `main.tsx` ou `App.tsx`:

```tsx
import { BugDetectorProvider } from '@auris/bug-detector/adapters/react';

function App() {
  return (
    <BugDetectorProvider
      config={{
        shortcut: 'Ctrl+Shift+D',
        persistTo: 'localStorage',
        integrations: {
          cloud: { baseURL: 'http://localhost:3456' },
        },
      }}
    >
      <SuaAplicacao />
    </BugDetectorProvider>
  );
}
```

Pronto! O botão flutuante aparece automaticamente no canto inferior direito.

### Opção B: Qualquer site (Vanilla / Bookmarklet)

Copie o conteúdo de `bugdetector-snippet.js` (ou do IIFE gerado) e cole no console do navegador, ou salve como bookmarklet:

```javascript
javascript:(function(){var s=document.createElement('script');s.src='https://seu-cdn.com/bugdetector.iife.js';document.body.appendChild(s);})()
```

Ou instancie diretamente:

```html
<script src="bug-detector.iife.js"></script>
<script>
  const detector = new BugDetector.BugDetector({
    integrations: { cloud: { baseURL: 'http://localhost:3456' } }
  });
</script>
```

---

## 🖱️ 2. Ativando o Modo de Inspeção

### Método 1: Atalho de teclado
Pressione **`Ctrl + Shift + D`** (ou o atalho configurado).

### Método 2: Botão flutuante
Clique no botão 🐛 no canto da tela.

Quando ativado:
- O cursor vira uma cruz
- Passar o mouse sobre elementos destaca-os com uma borda azul
- Uma tooltip mostra a tag, classe e dimensões do elemento

---

## 📝 3. Criando um Report de Bug

1. **Ative** o modo de inspeção (`Ctrl+Shift+D`)
2. **Passe o mouse** sobre o elemento com problema
3. **Clique** no elemento
4. O **modal de report** abre automaticamente com:
   - Screenshot do elemento
   - Informações técnicas (tag, seletor, dimensões)
   - Campos de descrição, tipo e severidade

5. Preencha a **descrição** (obrigatória)
6. Escolha o **tipo** (Bug / Melhoria / Dúvida) e a **severidade**
7. Clique em **Enviar Report**

O report é salvo no `localStorage` (ou na nuvem, se configurado).

---

## ✏️ 4. Anotando o Screenshot

No modal do report, passe o mouse sobre o screenshot e clique em **"Anotar Screenshot"**.

### Ferramentas disponíveis:
- **Retângulo** — circundar áreas com problema
- **Seta** — apontar elementos específicos
- **Blur** — ofuscar dados sensíveis manualmente
- **Texto** — adicionar comentários direto na imagem

### Dados sensíveis (blur automático)
O sistema detecta automaticamente:
- `input[type="password"]`
- Inputs com `name`/`id` contendo `cpf`, `ssn`, `credit`, `card`, `cvv`, `password`, `secret`, `token`
- `input[type="email"]`

Clique em **Aplicar Anotações** para voltar ao modal com o screenshot editado.

---

## 🔴 5. Gravando a Tela (Screen Recording)

No modal do report, clique em **"Gravar Tela (10s)"**.

O navegador pedirá permissão para compartilhar a tela/aba. Aceite.

- A gravação dura **até 10 segundos** (ou pode ser parada manualmente)
- Durante a gravação, um indicador vermelho pisca com o timer
- Após parar, o vídeo aparece em preview no modal
- O vídeo é anexado ao report automaticamente

> **Nota:** Em alguns navegadores em headless/automatizado, o picker de permissão pode não aparecer. Em uso normal, funciona perfeitamente.

---

## 🎬 6. Visualizando Session Replay

Cada report captura automaticamente os **últimos 30 segundos** de interação do usuário antes do clique.

### No painel de reports (React):
1. Clique no badge de reports (ícone 📋 ou contador no canto superior)
2. Clique em **"Ver detalhes"** no report desejado
3. Role até a seção **"Session Replay"**
4. Clique em **▶ Reproduzir** para ver o cursor se movendo, clicks pulsando e eventos sendo reproduzidos

### No Cloud Dashboard:
1. Acesse `http://localhost:3456` (ou sua URL de deploy)
2. Expanda o report
3. Veja o número de eventos capturados

---

## ☁️ 7. Configurando o Cloud Dashboard

### Subir o backend:

```bash
cd packages/bug-detector-cloud
npm install
npm run dev
```

O servidor sobe em `http://localhost:3456`.

### Conectar o bug-detector à nuvem:

```tsx
<BugDetectorProvider
  config={{
    integrations: {
      cloud: { baseURL: 'http://localhost:3456' },
    },
  }}
>
```

Agora todo report criado será **enviado automaticamente** para o cloud dashboard, onde sua equipe pode:
- Listar todos os reports
- Ver estatísticas (total, pendentes, resolvidos)
- Visualizar screenshots, vídeos e session replays
- Marcar reports como resolvidos
- Excluir reports antigos

---

## 🔗 8. Integração 2-way com GitHub

### Configurar credenciais:

```tsx
<BugDetectorProvider
  config={{
    integrations: {
      github: {
        repo: 'seu-usuario/seu-repo',
        token: 'ghp_xxxxxxxxxxxx',
        labels: ['bug', 'bug-detector'],
      },
    },
  }}
>
```

### Criar issue a partir de um report:

No seu código React:

```tsx
const { detector } = useBugDetector();

async function handleCreateIssue(reportId: string) {
  await detector?.createGitHubIssue(reportId);
}
```

### Sincronizar status (2-way sync):

No painel de reports, clique no botão **🔄** ao lado do report que tem uma issue vinculada.

O BugDetector vai:
1. Consultar o GitHub API
2. Se a issue estiver **open** → status vira `pending`
3. Se a issue estiver **closed** → status vira `resolved`

---

## 🎨 9. White-label e Guest Mode

### Customizar a aparência (white-label):

```tsx
<BugDetectorProvider
  config={{
    branding: {
      primaryColor: '#10b981',      // cor dos botões
      backgroundColor: '#0f172a',   // cor de fundo dos modais
      position: 'bottom-right',     // bottom-right | bottom-left | top-right | top-left
      buttonText: 'Reportar Bug',   // texto no botão flutuante
      logoURL: 'https://meu-cdn.com/logo.png', // opcional
    },
  }}
>
```

### Modo Guest (para clientes finais):

```tsx
<BugDetectorProvider
  config={{
    guestMode: true,
    branding: {
      primaryColor: '#3b82f6',
      buttonText: 'Feedback',
    },
  }}
>
```

No modo guest:
- O botão de report funciona normalmente
- O painel de "Ver Reports" é **escondido**
- O cliente final só vê o botão e o formulário de report
- Perfeito para embedar em sites de clientes

---

## 🚀 10. Fazendo Release / Build

```bash
cd packages/bug-detector
node release.mjs
```

Isso executa:
1. `tsc --noEmit` (verificação de tipos)
2. `npm run build` (gera ESM, CJS, IIFE, React, Vue)
3. Copia `bugdetector-snippet.js` para a raiz
4. Gera `auris-bug-detector-1.0.0.tgz`

---

## 💡 Dicas Rápidas

| Dica | Como fazer |
|------|------------|
| Sair do modo inspeção | Pressione `ESC` ou clique no botão vermelho ✕ |
| Cancelar uma anotação | Clique em "Cancelar" no canvas |
| Remover um vídeo gravado | Clique em "Remover vídeo" no modal |
| Ver reports salvos | Clique no ícone 📋 ou no contador "X reports" |
| Limpar todos os reports | Apague a chave `bug_report_*` do localStorage |

---

## 🆘 Troubleshooting

### "O botão flutuante não aparece"
→ Verifique se `headless: false` está na configuração.

### "O screenshot sai preto/quebrado"
→ Pode ser CORS de imagens externas. Habilite `useCORS: true` no servidor.

### "A gravação de tela não funciona"
→ Verifique se o navegador suporta `navigator.mediaDevices.getDisplayMedia`. Funciona em Chrome, Edge e Firefox modernos.

### "O cloud não recebe os reports"
→ Verifique se o `baseURL` está correto e se o servidor cloud está rodando (`netstat -ano | findstr :3456`).
