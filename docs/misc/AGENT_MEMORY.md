# 🤖 MEMÓRIA DE FEEDBACK - AGENTE AURIS OS

> **Arquivo de referência obrigatória antes de cada resposta**
> 
> **Data de criação:** 08/04/2026  
> **Última atualização:** 08/04/2026

---

## ✅ COISAS QUE O USUÁRIO GOSTOU

### Estilo de Resposta
- [x] Resumo estruturado no final das correções
- [x] Tabelas organizadas por categoria de prioridade
- [x] Emojis para diferenciar tipos de correção
- [x] Mostrar progresso percentual (%)
- [x] Separar claramente o que foi corrigido vs o que falta
- [x] Build status sempre no final
- [x] Links de deploy destacados

### Formato de Correções
- [x] Nome do arquivo e linha afetada
- [x] Descrição clara do problema
- [x] Descrição clara da solução
- [x] Checkmarks (✅) para indicar conclusão

### Comunicação
- [x] Linguagem direta e objetiva
- [x] Português correto
- [x] Respostas concisas mas completas

---

## ❌ COISAS QUE O USUÁRIO NÃO GOSTOU / EVITAR

### (Nenhum registrado ainda - aguardando feedback negativo)

---

## 📝 REGRAS APRENDIDAS

### Antes de Responder
1. **SEMPRE** ler este arquivo primeiro
2. **SEMPRE** revisar `AGENTS.md` para regras do projeto
3. **SEMPRE** revisar `AUDITORIA_CHECKLIST.md` para contexto atual
4. **SEMPRE** revisar `AUDITORIA_RELATORIO.md` para histórico

### Durante as Correções
1. Manter padrão de resposta que o usuário aprovou
2. Registrar novos padrões positivos/negativos neste arquivo
3. Build deve passar sempre antes de finalizar
4. Atualizar checklists de auditoria

### Formato de Commit de Memória
```markdown
### [DATA] - [Tipo: Positivo/Negativo] - [Contexto]
**Ocorrência:** [O que aconteceu]
**Feedback:** [O que o usuário disse]
**Ação:** [O que fazer daqui pra frente]
```

---

## 🧠 SISTEMA DE PERSONALIDADES (NOVO)

O projeto agora usa um **sistema de personalidades especializadas** para garantir qualidade máxima.

### Como Funciona
1. **ORQUESTRADOR** analisa a tarefa e decide qual(is) personalidade(s) ativar
2. **Personalidades** fornecem diretrizes específicas da área
3. **REVISOR** garante qualidade antes da entrega

### Personalidades Disponíveis
| # | Personalidade | Foco |
|---|---------------|------|
| 01 | **ARQUITETO** | Arquitetura, patterns, estrutura |
| 02 | **UI/UX ENGINEER** | Design system, acessibilidade, motion |
| 03 | **PERFORMANCE** | Otimização, bundle, Core Web Vitals |
| 04 | **TYPESCRIPT MASTER** | Tipos avançados, generics |
| 05 | **REACT ESPECIALISTA** | Hooks, patterns, React 18+ |
| 06 | **CSS/TAILWIND EXPERT** | Estilos, responsividade |
| 07 | **TESTING ENGINEER** | Testes, TDD, mocks |
| 08 | **DX ENGINEER** | Tooling, automações |

### Arquivos do Sistema
```
.brain/
├── README.md              # Visão geral
├── ORQUESTRADOR.md        # Decisão de personalidades
├── REVISOR.md             # Checklist de qualidade
├── INDEX.md               # Guia de navegação
└── personalidades/        # Especialistas
```

### Regra de Ouro
> **SEMPRE** consultar `.brain/ORQUESTRADOR.md` antes de começar qualquer tarefa!

---

## 🎯 PREFERÊNCIAS DO PROJETO AURIS OS

### Stack Tecnológica
- React + TypeScript (strict)
- Tailwind CSS
- Zustand (stores)
- Framer Motion (animações)
- Lucide React (ícones)

### Padrões de Código Obrigatórios
1. **NUNCA** usar `any` (TYPESCRIPT MASTER)
2. **SEMPRE** usar `React.useMemo` para cálculos caros (PERFORMANCE)
3. **SEMPRE** usar `useCallback` para funções em render (REACT)
4. **SEMPRE** converter Date → ISO string para Zustand (ARQUITETO)
5. **SEMPRE** reconstruir Date ao ler do Zustand (ARQUITETO)
6. **SEMPRE** seguir design system (UI/UX ENGINEER)

### Comunicação com Usuário
- Responder em **português**
- Usar **emojis** para categorização visual
- Mostrar **progresso** de forma numérica e visual
- Separar seções com **divisórias claras**
- **Sempre** justificar decisões arquiteturais

---

## 📋 ESTADO ATUAL DO PROJETO

### Progresso da Auditoria
```
[████████████████░░] 56% (18/32 concluídos)

🔴 Crítico:  5/5  ✅ 100%
🟠 Alto:     6/6  ✅ 100%
🟡 Médio:    7/15 ⏳ 47%
🔵 Baixo:    0/6  ⏳ 0%
```

### Último Build
- **Status:** ✅ Passando
- **Tempo:** ~21s
- **Deploy:** https://workspace-vivencie-terapias.vercel.app

### Correções Recentes (08/04/2026)
- **NOVO:** Sistema de cards refatorado do zero
  - CardBase, CardProtocolo, CardAgendamento, CardFinanceiro
  - CardPaciente, CardPontoAuricular
  - AuraBlocks.tsx refatorado usando novos cards
- **MÉDIO-002:** Consolidados campos duplicados em `AuraChatMessage`
- **MÉDIO-010:** Implementados TODOs em `useFinancasStore.ts`
- **MÉDIO-011:** Criado hook `useDebounce` e aplicado na busca de pacientes
- **MÉDIO-014:** Criado tema centralizado `src/lib/theme.ts`
- **MÉDIO-015:** Padronizados tamanhos de fonte (`text-[10px]` → `text-xs`)

---

## 💡 DICAS DE CONTEXTO

### Pontos de Atenção
1. **Mapa Auricular:** Sempre verificar integração com `usePontosStore`
2. **Aura AI:** JSON pode vir truncado - sempre validar parser
3. **Datas:** Zustand persiste como string - sempre reconstruir Date
4. **Build:** Rodar `npm run build` frequentemente durante desenvolvimento

### Funções Úteis Criadas
- `src/lib/formatters.ts` - `formatCurrency()`, `formatDate()`, etc.
- `src/lib/auraResponse.ts` - Parser robusto de JSON da Aura

---

**⚠️ NOTA:** Este arquivo deve ser consultado ANTES de cada resposta ao usuário.
