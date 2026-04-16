# 📋 RELATÓRIO DE AUDITORIA DE CÓDIGO - AURIS OS

**Data da Auditoria:** 07/04/2026  
**Total de Arquivos Analisados:** 60+  
**Escopo:** src/components/aura, src/components/calendar, src/components/clinica, src/components/financas, src/stores, src/types

---

## 🔴 1. BUGS E ERROS CRÍTICOS

### **CRÍTICO-001: Dependência Circular em useAuraIntelligence.ts**
- **Arquivo:** `src/hooks/useAuraIntelligence.ts` (linha 165)
- **Problema:** A dependência `gerarSugestoes` usa `location.pathname` mas o hook declara dependência como `[location.pathname, mensagens]` - `location` não é definido, deveria ser `pathname`
- **Severidade:** CRÍTICO
- **Sugestão:** 
```typescript
// Correção:
const gerarSugestoes = useCallback((): SugestaoInteligente[] => {
  const ctx = getContextoFromPath(pathname); // usar pathname, não location.pathname
  // ...
}, [pathname, mensagens]); // já está correto aqui
```

### **CRÍTICO-002: React Import Faltando em CalendarMonthGrid**
- **Arquivo:** `src/components/calendar/CalendarMonthGrid.tsx` (linha 181)
- **Problema:** `import React from 'react';` está no meio do arquivo (após interfaces e funções) e é usado em `React.useMemo` na linha 195
- **Severidade:** CRÍTICO
- **Sugestão:** Mover o import para o topo do arquivo

### **CRÍTICO-003: React Import Faltando em CalendarWeekView**
- **Arquivo:** `src/components/calendar/CalendarWeekView.tsx` (linha 210)
- **Problema:** Mesmo problema - import no final do arquivo mas React é usado na linha 73
- **Severidade:** CRÍTICO
- **Sugestão:** Mover o import para o topo

---

## ✅ CORREÇÕES REALIZADAS (07/04/2026)

### **CORRIGIDO: Botões do Mapa Auricular Não Funcionavam**
- **Arquivo:** `src/components/auricular/EarMapPro.tsx`
- **Problema:** O evento `onMouseDown` capturava todos os cliques, impedindo que o `onClick` fosse disparado
- **Solução:** Implementado sistema de detecção de clique vs arrasto usando coordenadas do mouse
```typescript
const [cliqueInicio, setCliqueInicio] = useState<{x: number, y: number} | null>(null);

const handleMouseDown = (e: React.MouseEvent, pontoId: string) => {
  setCliqueInicio({ x: e.clientX, y: e.clientY });
  // ... resto da lógica
};

onClick={(e) => {
  if (cliqueInicio) {
    const distancia = Math.sqrt(
      Math.pow(e.clientX - cliqueInicio.x, 2) + 
      Math.pow(e.clientY - cliqueInicio.y, 2)
    );
    if (distancia < 5) {
      onPontoSelecionado?.(ponto);
    }
  }
}}
```

### **CORRIGIDO: JSON Aparecendo no Chat (Não Parseado)**
- **Arquivos:** `src/lib/auraResponse.ts`, `src/lib/auraMessage.ts`, `src/components/aura/AuraMessageList.tsx`
- **Problema:** Quando a API retornava JSON truncado, o texto cru era exibido no chat
- **Solução:** 
  1. Adicionado `tryParseJson()` com lógica de recuperação de JSON truncado
  2. Implementado `isTruncated` flag para detectar respostas incompletas
  3. Adicionado placeholder "Processando..." enquanto o JSON não é parseado
  4. Melhorada detecção de truncamento via `detectProviderTruncation()`

### **CORRIGIDO: Dependência `location` em useAuraIntelligence**
- **Arquivo:** `src/hooks/useAuraIntelligence.ts`
- **Problema:** Uso de `location.pathname` em vez de `pathname` nas dependências de useCallback
- **Solução:** Substituído em todas as ocorrências (linhas 165, 196, 209)

### **CORRIGIDO: React Imports em Arquivos do Calendário**
- **Arquivos:** `CalendarMonthGrid.tsx`, `CalendarWeekView.tsx`
- **Problema:** Import do React estava no meio/final dos arquivos
- **Solução:** Movido para o topo dos arquivos

### **CORRIGIDO (ALTO-001): Uso de `any` em AuraBlocks.tsx**
- **Arquivo:** `src/components/aura/AuraBlocks.tsx`
- **Problema:** Todos os componentes do markdown usavam `any` para props
- **Solução:** Criados tipos `MarkdownProps` e `LinkProps` com tipagem correta

### **CORRIGIDO (ALTO-002): Mapa tipado de ícones em AuraUnified.tsx**
- **Arquivo:** `src/components/aura/AuraUnified.tsx`
- **Problema:** `(LucideIcons as any)[sugestao.icone]` sem type safety
- **Solução:** Criado `iconMap: Record<string, LucideIcon>` com todos os ícones utilizados

### **CORRIGIDO (ALTO-003): Alert nativo em EventoModal.tsx**
- **Arquivo:** `src/components/calendar/EventoModal.tsx`
- **Problema:** Uso de `alert('Selecione um paciente')`
- **Solução:** Adicionado estado `erroValidacao` e UI de alerta integrada em vermelho

### **CORRIGIDO (ALTO-004): Fallback para nome do paciente**
- **Arquivo:** `src/components/calendar/EventoModal.tsx`
- **Problema:** `paciente.dados_pessoais.nome` sem fallback
- **Solução:** Adicionado `|| ''` no `handleSelectPaciente`

### **CORRIGIDO (ALTO-005): Memoização em AuraMessageList.tsx**
- **Arquivo:** `src/components/aura/AuraMessageList.tsx`
- **Problema:** `fallbackPrepared`, `rendered` e `canContinue` recriados a cada render
- **Solução:** Adicionado `React.useMemo()` para todos os três valores

### **CORRIGIDO (ALTO-006): useCallback em renderView**
- **Arquivo:** `src/components/calendar/CalendarOS.tsx`
- **Problema:** Função `renderView()` recriada a cada render
- **Solução:** Convertida para `useCallback` com dependências corretas

---

## ✅ CORREÇÕES MÉDIA PRIORIDADE (08/04/2026)

### **CORRIGIDO (MÉDIO-004): Casting `as any` em ProtocolosApp.tsx**
- **Arquivo:** `src/components/clinica/ProtocolosApp.tsx`
- **Problema:** `ponto.regiao as any` e `ponto.prioridade as any`
- **Solução:** Expandido tipo `PontoAuricular.regiao` em `types/index.ts` para incluir todos os valores de `RegiaoAuricular`

### **CORRIGIDO (MÉDIO-006/007): Funções utilitárias de formatação**
- **Arquivo:** `src/lib/formatters.ts` (novo)
- **Funções criadas:**
  - `formatCurrency()` - Formata valores como moeda BRL
  - `formatDate()` - Formata datas com múltiplos formatos
  - `formatPhone()` - Formata telefones brasileiros
  - `formatCPF()` - Formata CPF
  - `formatCEP()` - Formata CEP
  - `formatNumber()` - Formata números
  - `truncateText()` - Limita texto a tamanho máximo

### **CORRIGIDO (MÉDIO-008): Console.log em useAuraStore.ts**
- **Arquivo:** `src/stores/useAuraStore.ts`
- **Problema:** 3 console.log em código de produção
- **Solução:** Removidos todos os console.log

### **CORRIGIDO (MÉDIO-010): TODOs em useFinancasStore.ts**
- **Arquivo:** `src/stores/useFinancasStore.ts`
- **Problema:** Dois TODOs pendentes:
  1. `comparativoMesAnterior: 0` - não calculado
  2. `porDia: []` - não implementado
- **Solução:** 
  - Implementado cálculo de comparativo com mês anterior (percentual de crescimento/decrescimento)
  - Implementado agrupamento por dia com receitas e despesas separadas

### **CORRIGIDO (MÉDIO-011): Debounce na busca de pacientes**
- **Arquivos:** 
  - `src/hooks/useDebounce.ts` (novo)
  - `src/components/calendar/EventoModal.tsx`
- **Problema:** Busca executada a cada tecla digitada (performance)
- **Solução:** 
  - Criado hook `useDebounce` com delay configurável (padrão 300ms)
  - Aplicado na busca de pacientes do EventoModal

### **CORRIGIDO (MÉDIO-015): Padronização de fontes**
- **Arquivos:** Múltiplos componentes
- **Problema:** Uso inconsistente de `text-[10px]`, `text-[9px]`, `text-[8px]`
- **Solução:** Padronizado para `text-xs` (Tailwind) nos arquivos:
  - `AuraBlocks.tsx`, `AuraUnified.tsx`, `CalendarOS.tsx`
  - `CalendarEventCard.tsx`, `CalendarHeader.tsx`
  - `MapaAuricularApp.tsx`, `EarMapPro.tsx`

### **CORRIGIDO (MÉDIO-002): Campos duplicados em AuraChatMessage**
- **Arquivos:** 
  - `src/types/auraChat.ts`
  - `src/stores/useAuraStore.ts`
  - `src/components/aura/AuraMessageList.tsx`
- **Problema:** `providerMeta` e `truncated` declarados tanto em `AuraChatMessage` quanto em `AuraChatMessageData`
- **Solução:**
  - Removidos campos duplicados de `AuraChatMessage` (raiz)
  - Mantidos apenas em `AuraChatMessageData` (dentro de `dados`)
  - Atualizados todos os usos para `message.dados?.providerMeta` e `message.dados?.truncated`

### **CORRIGIDO (MÉDIO-014): Cores hardcoded**
- **Arquivo:** `src/lib/theme.ts` (novo)
- **Problema:** Cores hex/rgba espalhadas pelo código dificultam manutenção
- **Solução:**
  - Criado tema centralizado com todas as cores do sistema
  - Categorias: primary, semantic, state, regiao, categoria, status, neutral
  - Funções auxiliares: `withAlpha()`, `glowColors`, `shadows`
  - Arquivos atualizados: `MapaAuricularApp.tsx`, `FinancasServicos.tsx`, `AuraUnified.tsx`

---

### **ALTO-001: Uso de `any` em AuraBlocks.tsx**
- **Arquivo:** `src/components/aura/AuraBlocks.tsx` (linhas 23-41)
- **Problema:** Todos os componentes do markdown usam `any` para props
```typescript
const markdownComponents = {
  p: ({ children }: any) => <p className="...">{children}</p>,
  // ... todos os outros usam any
};
```
- **Severidade:** ALTO
- **Sugestão:** Definir tipos corretos usando React.HTMLAttributes ou tipos específicos do react-markdown

### **ALTO-002: Uso de `any` para LucideIcons**
- **Arquivo:** `src/components/aura/AuraUnified.tsx` (linha 536)
- **Problema:** `(LucideIcons as any)[sugestao.icone]` permite acesso dinâmico sem type safety
- **Severidade:** ALTO
- **Sugestão:** Criar um mapa tipado de ícones ou usar verificação de tipo

### **ALTO-003: Validação de Dados Insuficiente em EventoModal**
- **Arquivo:** `src/components/calendar/EventoModal.tsx` (linha 144)
- **Problema:** Uso de `alert()` nativo para validação em vez de UI integrada
```typescript
if (!pacienteSelecionado && tipo !== 'bloqueio') {
  alert('Selecione um paciente'); // não deve usar alert nativo
  return;
}
```
- **Severidade:** ALTO
- **Sugestão:** Usar estado para mostrar erro visual no formulário

### **ALTO-004: Possível null/undefined não tratado**
- **Arquivo:** `src/components/calendar/EventoModal.tsx` (linhas 86-87)
- **Problema:** `paciente?.dados_pessoais?.nome` pode ser undefined mas é usado diretamente em `setPacienteBusca`
- **Severidade:** ALTO
- **Sugestão:** Adicionar fallback: `paciente?.dados_pessoais?.nome || ''`

---

## 🟡 2. INCONSISTÊNCIAS DE TIPOS

### **MÉDIO-001: Tipos de Datas Inconsistentes**
- **Arquivos:** Múltiplos
- **Problema:** `AuraChatMessage.timestamp` é `Date | string` (linha 24 de auraChat.ts) mas em vários lugares é tratado como `Date` garantido
- **Localizações:**
  - `src/types/auraChat.ts:24`
  - `src/components/aura/AuraMessageList.tsx:209`
- **Severidade:** MÉDIO
- **Sugestão:** Normalizar para `Date` no momento da criação ou usar type guards

### **MÉDIO-002: Campo `dados` duplicado vs `providerMeta`**
- **Arquivo:** `src/types/auraChat.ts` (linhas 12-18, 26-30)
- **Problema:** `AuraChatMessageData` tem `providerMeta` e `truncated`, mas `AuraChatMessage` também declara esses campos no nível raiz
```typescript
export interface AuraChatMessage {
  // ...
  providerMeta?: ProviderResponseMeta;  // duplicado
  truncated?: boolean;                   // duplicado
  dados?: AuraChatMessageData;           // já contém os campos acima
}
```
- **Severidade:** MÉDIO
- **Sugestão:** Consolidar em uma estrutura única

### **MÉDIO-003: Inconsistência em tipos de eventos**
- **Arquivo:** `src/components/calendar/CalendarEventCard.tsx` (linha 27)
- **Problema:** Prop `onNativeDragStart` tipada como `(e: React.DragEvent, eventId: string) => void` mas usada de forma inconsistente
- **Severidade:** MÉDIO

### **MÉDIO-004: Casting explícito excessivo**
- **Arquivo:** `src/components/clinica/ProtocolosApp.tsx` (linha 83)
- **Problema:** Múltiplos `as any` para regiao, prioridade, sistema
```typescript
regiao: ponto.regiao as any,
prioridade: ponto.prioridade as any,
sistema: ponto.sistema || 'neurofisiologico'
```
- **Severidade:** MÉDIO
- **Sugestão:** Mapear corretamente os tipos ou expandir o tipo PontoAuricular

---

## 🔵 3. ESPAÇAMENTO E FORMATAÇÃO

### **BAIXO-001: Comentários de Seção Excessivos**
- **Arquivos:** Múltiplos (`AuraUnified.tsx`, `CalendarOS.tsx`, `EventoModal.tsx`)
- **Problema:** Blocos de comentários de seção muito grandes (5+ linhas) que poluem o código
```typescript
// ============================================================================
// COMPONENTE BANNER CONTEXTUAL COM ANIMAÇÕES
// ============================================================================
```
- **Severidade:** BAIXO
- **Sugestão:** Usar comentários menores ou organizar em arquivos separados

### **BAIXO-002: Imports Desorganizados**
- **Arquivo:** `src/components/aura/AuraUnified.tsx` (linhas 1-29)
- **Problema:** Imports não agrupados logicamente (React, libs externas, internas misturadas)
- **Severidade:** BAIXO

### **BAIXO-003: Linhas em Branco Excessivas**
- **Arquivo:** `src/components/calendar/EventoModal.tsx` (linha 190-191)
- **Problema:** Múltiplas linhas em branco consecutivas
- **Severidade:** BAIXO

### **BAIXO-004: Indentação Inconsistente**
- **Arquivo:** `src/components/clinica/ClinicaApp.tsx` (múltiplas linhas)
- **Problema:** Switch case com indentação inconsistente (case 'evolucao' alinhado incorretamente)
- **Severidade:** BAIXO

---

## 🌍 4. PROBLEMAS DE LOCALIZAÇÃO

### **MÉDIO-005: Strings Hardcoded em Português**
- **Arquivos:** Vários componentes
- **Problema:** Mensagens de erro e UI estão hardcoded em português sem sistema de i18n
- **Localizações principais:**
  - `src/components/aura/AuraBlocks.tsx:233` - "Conteúdo indisponível"
  - `src/components/aura/AuraBlocks.tsx:335` - "Não foi possível carregar..."
  - `src/components/calendar/EventoModal.tsx` - Todo o formulário
- **Severidade:** MÉDIO
- **Sugestão:** Implementar sistema de internacionalização (react-i18next)

### **BAIXO-005: Formatação de Moeda Hardcoded**
- **Arquivo:** `src/components/financas/FinancasDashboard.tsx` (linha 58, 91, etc)
- **Problema:** Formatação manual `R$ ${valor.toFixed(2)}` em vez de Intl.NumberFormat
- **Severidade:** BAIXO
- **Sugestão:** 
```typescript
const formatCurrency = (value: number) => 
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
```

### **BAIXO-006: Datas sem formatação consistente**
- **Arquivo:** `src/components/calendar/CalendarHeader.tsx` (linha 38-43)
- **Problema:** `toLocaleDateString('pt-BR', ...)` usado diretamente em múltiplos lugares
- **Severidade:** BAIXO
- **Sugestão:** Criar utility function centralizada

---

## 💀 5. CÓDIGO MORTO

### **MÉDIO-006: Console.log em Produção**
- **Arquivo:** `src/stores/useAuraStore.ts` (linhas 198, 204)
- **Problema:** Logs de debug presentes
```typescript
console.log('[Aura] API falhou, usando fallback local');
console.log('[Aura] Usando modo local');
```
- **Severidade:** MÉDIO
- **Sugestão:** Usar sistema de logging condicional ou remover

### **MÉDIO-007: Imports Não Utilizados**
- **Arquivo:** `src/components/financas/FinancasTransacoes.tsx` (linha 120)
- **Problema:** `transacao` tem `isEdicao` declarado mas não usado no componente
- **Severidade:** MÉDIO

### **BAIXO-007: Variáveis Não Utilizadas**
- **Arquivo:** `src/components/clinica/SessaoApp.tsx` (linha 88)
- **Problema:** `fotosOrelha` declarado como estado mas não usado para funcionalidade real
- **Severidade:** BAIXO

### **BAIXO-008: TODOs no Código**
- **Arquivo:** `src/stores/useFinancasStore.ts` (linha 301, 304)
- **Problema:** 
```typescript
comparativoMesAnterior: 0, // TODO: Calcular
porDia: [], // TODO: Implementar
```
- **Severidade:** BAIXO

---

## ⚡ 6. PROBLEMAS DE PERFORMANCE

### **ALTO-004: Re-render Desnecessário em AuraMessageItem**
- **Arquivo:** `src/components/aura/AuraMessageList.tsx` (linhas 139-156)
- **Problema:** `fallbackPrepared` e `rendered` são recalculados a cada render mesmo quando `message` não muda
- **Severidade:** ALTO
- **Sugestão:** Usar useMemo para esses cálculos

### **ALTO-005: Funções Inline em Render**
- **Arquivo:** `src/components/calendar/CalendarOS.tsx` (linhas 207-275)
- **Problema:** Função `renderView()` é recriada a cada render, causando re-mount dos componentes
- **Severidade:** ALTO
- **Sugestão:** Usar useCallback ou extrair para componentes estáticos

### **MÉDIO-008: useEffect sem Debounce em Busca**
- **Arquivo:** `src/components/clinica/ClinicaApp.tsx` (linha 195)
- **Problema:** Filtragem de pacientes acontece a cada keystroke sem debounce
- **Severidade:** MÉDIO
- **Sugestão:** Implementar debounce de 300ms

### **MÉDIO-009: Persistência Sem Throttle**
- **Arquivo:** `src/stores/useCalendarStore.ts` (linhas 113-325)
- **Problema:** Persist middleware do Zustand salva a cada mudança sem throttle
- **Severidade:** MÉDIO
- **Sugestão:** Adicionar throttle na configuração do persist

### **MÉDIO-010: Animações em Lista sem Virtualização**
- **Arquivo:** `src/components/clinica/ClinicaApp.tsx` (linha 909)
- **Problema:** Lista de pacientes com motion.div para cada item sem limite
- **Severidade:** MÉDIO
- **Sugestão:** Implementar virtualização para listas grandes

---

## 🎨 7. INCONSISTÊNCIAS DE UI

### **MÉDIO-011: Cores Hardcoded vs Variáveis do Tema**
- **Arquivo:** `src/components/financas/FinancasDashboard.tsx` (linhas 20-27)
- **Problema:** Cores hex hardcoded em vez de usar as variáveis do Tailwind config
```typescript
const coresCategoria: Record<string, string> = {
  auriculoterapia: '#10b981', // hardcoded
  // ...
};
```
- **Severidade:** MÉDIO
- **Sugestão:** Usar classes Tailwind ou variáveis CSS do tema

### **MÉDIO-012: Tamanhos de Fonte Inconsistentes**
- **Arquivos:** Vários
- **Problema:** Mix de `text-[10px]`, `text-[11px]`, `text-xs` com valores similares
- **Localizações:**
  - `src/components/aura/AuraBlocks.tsx:175,179,187`
  - `src/components/calendar/CalendarEventCard.tsx:111,161,185`
- **Severidade:** MÉDIO
- **Sugestão:** Padronizar em valores do design system

### **BAIXO-009: Espaçamentos Inconsistentes**
- **Arquivo:** `src/components/calendar/CalendarHeader.tsx` (linhas 83-188)
- **Problema:** Uso misto de `gap-2`, `gap-3`, `gap-4` sem padrão claro
- **Severidade:** BAIXO

### **BAIXO-010: Uso Inconsistente de Ícones**
- **Arquivo:** `src/components/financas/FinancasApp.tsx`
- **Problema:** Ícones importados do Lucide mas tamanhos variam (w-4, w-5, w-6, w-8) sem padrão
- **Severidade:** BAIXO

---

## 📊 RESUMO POR SEVERIDADE

| Severidade | Quantidade | Prioridade |
|------------|------------|------------|
| 🔴 CRÍTICO | 3 | Resolver imediatamente |
| 🟠 ALTO | 5 | Resolver na próxima sprint |
| 🟡 MÉDIO | 12 | Planejar correção |
| 🔵 BAIXO | 10 | Corrigir quando possível |

---

## 🎯 RECOMENDAÇÕES PRIORITÁRIAS

1. **Imediato:** Corrigir os 3 bugs CRÍTICOS relacionados a imports e dependências
2. **Curto prazo:** Remover todos os `any` dos componentes Aura e tipar corretamente
3. **Médio prazo:** Implementar sistema de formatação centralizado (datas, moedas)
4. **Longo prazo:** Adicionar i18n e consolidar design system

---

**Total de Problemas Encontrados:** 30  
**Arquivos com Problemas:** 18
