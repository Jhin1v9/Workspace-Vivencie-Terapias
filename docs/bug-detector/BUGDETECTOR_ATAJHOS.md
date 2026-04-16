# 🚀 BugDetector Sempre à Mão

Este guia mostra **3 formas práticas** de ter o snippet do BugDetector disponível instantaneamente no seu dia a dia.

---

## ✅ Opção 1: Duplo Clique (mais fácil — não precisa instalar nada)

### Arquivos
- `bugdetector-copiar.bat`
- `bugdetector-copiar.ps1`
- `bugdetector-snippet.js`

### Como usar
1. **Clique duplo** no arquivo `bugdetector-copiar.bat`.
2. Uma janela do terminal vai abrir e dizer: `✅ Snippet do BugDetector copiado para a área de transferência!`.
3. Vá no navegador, aperte `F12` → Console, cole com `Ctrl + V` e aperte `Enter`.

### Deixar ainda mais rápido
- Clique com o **botão direito** no `bugdetector-copiar.bat`.
- Vá em **Enviar para → Área de trabalho (criar atalho)**.
- Agora você tem um ícone na área de trabalho. Só clicar duas vezes nele.

> 💡 **Dica pro:** fixe o atalho na barra de tarefas. Clique com o direito no ícone da área de trabalho → **Fixar na barra de tarefas**.

---

## ⌨️ Opção 2: Atalho de Teclado (mais rápido — precisa do AutoHotkey)

Se você quer apertar um atalho e o snippet já ir direto pro clipboard, use o **AutoHotkey**.

### Passo 1: Instalar o AutoHotkey
1. Acesse: https://www.autohotkey.com/
2. Baixe e instale a versão **v2.0** (ou v1.1 se já tiver instalado).

### Passo 2: Executar o script
- **Se instalou v2.0:** clique duplo em `bugdetector.ahk`
- **Se instalou v1.1:** clique duplo em `bugdetector-v1.ahk`

Um ícone verde de "H" vai aparecer na bandeja do sistema (canto inferior direito).

### Passo 3: Usar
Agora, em **qualquer lugar do Windows**, aperte:

```
Ctrl + Alt + B
```

E pronto! O snippet inteiro foi copiado para o clipboard. Aparece uma notificação no canto da tela confirmando.

### Iniciar automaticamente com o Windows
1. Aperte `Win + R`, digite `shell:startup` e aperte `Enter`.
2. Cole um **atalho** do arquivo `bugdetector.ahk` nessa pasta.
3. Pronto! O atalho `Ctrl + Alt + B` vai funcionar sempre que ligar o PC.

---

## 🌐 Opção 3: Favorito no Navegador (não precisa de AutoHotkey)

Se você quer ativar o BugDetector com um clique no navegador (sem colar no console):

1. Edite o arquivo `bugdetector-bookmarklet.js`.
2. Substitua `https://SEU-DOMINIO-AQUI.com/bug-detector.iife.js` por uma URL real onde você hospedou o script (veja abaixo como hospedar localmente).
3. Copie a linha inteira que começa com `javascript:(function()...`.
4. No navegador, crie um favorito e cole essa linha no campo URL.

### Hospedar localmente rapidamente
```bash
python serve-bugdetector.py
```
O servidor sobe em `http://SEU_IP_LOCAL:8765/packages/bug-detector/dist/bug-detector.iife.js`.
Use esse endereço no bookmarklet.

---

## 📊 Qual usar?

| Se você quer... | Use |
|-----------------|-----|
| Funcionar **agora** sem instalar nada | `bugdetector-copiar.bat` |
| Apertar um **atalho de teclado** e já estar copiado | `bugdetector.ahk` (AutoHotkey) |
| Ativar com **um clique dentro do navegador** | Bookmarklet |

---

## 📝 Resumo dos arquivos

| Arquivo | Função |
|---------|--------|
| `bugdetector-snippet.js` | O snippet completo (~560KB) para colar no console |
| `bugdetector-copiar.bat` | Duplo clique → copia snippet pro clipboard |
| `bugdetector-copiar.ps1` | Script PowerShell usado pelo `.bat` |
| `bugdetector.ahk` | AutoHotkey v2 — atalho `Ctrl+Alt+B` |
| `bugdetector-v1.ahk` | AutoHotkey v1.1 — mesma função |
| `bugdetector-bookmarklet.js` | Instruções para criar o favorito |
| `serve-bugdetector.py` | Servidor HTTP local para hospedar o IIFE |
