# 🐛 Bug Tracker - Sistema de Detecção de Bugs

> Sistema de report de bugs visual integrado ao Auris OS

---

## 🎯 Como Usar

### Ativar Modo Edição

**Via Aura:**
```
Usuário: "editar site"
Aura: "🛠️ Modo Edição Ativado"
```

**Ou:**
```
Usuário: "modo edição"
Aura: "🛠️ Modo Edição Ativado"
```

### Reportar um Bug

1. Passe o mouse sobre o elemento com problema
2. Veja as informações no tooltip
3. Clique para abrir o modal de report
4. Preencha:
   - Tipo: Bug / Melhoria / Dúvida
   - Severidade: Crítico / Alto / Médio / Baixo
   - Descrição do problema
   - Comportamento esperado (opcional)
   - Screenshot (opcional)
5. Clique em "Enviar Report"

### Sair do Modo Edição

**Botão:** Clique no botão vermelho "Sair do Modo Edição" no canto superior direito

**Ou via Aura:**
```
Usuário: "sair do modo edição"
Aura: "✅ Modo Edição Desativado"
```

---

## 📁 Estrutura de Arquivos

```
.bugs/
├── README.md              # Este arquivo
├── reports/               # Reports pendentes
│   └── YYYY-MM-DD_HH-MM-SS.md
├── screenshots/           # Screenshots anexados
│   └── YYYY-MM-DD_HH-MM-SS.png
├── resolved/              # Bugs resolvidos
│   └── YYYY-MM-DD_HH-MM-SS.md
└── summary.md             # Resumo consolidado
```

---

## 📋 Comandos da Aura

| Comando | Descrição |
|---------|-----------|
| `"editar site"` | Ativa modo edição |
| `"modo edição"` | Ativa modo edição |
| `"sair do modo edição"` | Desativa modo edição |
| `"listar bugs"` | Lista todos os bugs pendentes |
| `"ver reports"` | Mostra reports criados |
| `"corrigir bug [ID]"` | AI corrige bug específico |
| `"corrigir todos"` | AI corrige todos os bugs pendentes |

---

## 📄 Formato dos Reports

Cada report é salvo como arquivo Markdown:

```markdown
# 🐛 Bug Report

## 📋 Informações Gerais
| **ID** | 2026-04-08_14-30-25 |
| **Data** | 08/04/2026 14:30:25 |
| **Tipo** | 🐛 Bug |
| **Severidade** | 🟠 Alto |
| **Status** | ⏳ Pendente |

## 🎯 Elemento Afetado
| **Tag** | `div` |
| **ID** | `chat-message-list` |
| **Seletor CSS** | `#aura-chat > div > div:nth-child(2)` |
| **Componente** | AuraMessageList |

## 📝 Descrição do Problema
O scroll não funciona corretamente...

## ✅ Comportamento Esperado
O botão deve rolar suavemente...

## 📸 Screenshot
![Screenshot](./screenshots/2026-04-08_14-30-25.png)

## 🔧 Análise e Correção
[Preenchido pelo AI após correção]
```

---

## 🔧 Para Desenvolvedores

### Como o AI Corrige Bugs

1. Usuário solicita: `"corrigir bug 2026-04-08_14-30-25"`
2. AI lê o arquivo `.bugs/reports/2026-04-08_14-30-25.md`
3. AI identifica o elemento pelo seletor CSS
4. AI analisa o código fonte
5. AI aplica a correção
6. AI atualiza o report com a solução
7. AI move o arquivo para `.bugs/resolved/`

### Atalhos de Teclado

| Tecla | Ação |
|-------|------|
| `ESC` | Fecha modal ou limpa seleção |
| `Click` | Seleciona elemento e abre modal |
| `F5` | Recarrega página (sai do modo edição) |

---

## 📊 Estatísticas

O sistema mantém estatísticas em tempo real:
- Total de bugs reportados
- Por status: Pendente, Em Análise, Resolvido
- Por severidade: Crítico, Alto, Médio, Baixo
- Por tipo: Bug, Melhoria, Dúvida

---

**Criado em:** 08/04/2026  
**Versão:** 1.0.0  
**Status:** ✅ Ativo
