# Auris OS - Guia Completo para Agentes de Código

> **Última atualização:** 08/04/2026  
> **Versão do Projeto:** 1.2  
> **Idioma Principal:** Português (código e documentação)

---

## 📋 Visão Geral do Projeto

**Auris OS** é um sistema operacional web desktop para clínicas de auriculoterapia e terapias holísticas. Projetado como uma interface de desktop imersiva com janelas flutuantes, o sistema integra gestão de pacientes, mapa auricular interativo, agendamento, finanças e uma assistente de IA chamada **Aura**.

### Stack Tecnológico

| Camada | Tecnologia |
|--------|------------|
| Framework | React 19.2 + TypeScript 5.9 |
| Build Tool | Vite 7.2 |
| Styling | Tailwind CSS 3.4 + shadcn/ui |
| State Management | Zustand 5.0 (com persistência) |
| Animações | Framer Motion |
| Ícones | Lucide React |
| Formulários | React Hook Form + Zod |
| PDF | jsPDF + html2canvas |
| AI | OpenAI, Gemini, DeepSeek |

---

## 🏗️ Arquitetura do Projeto

### Estrutura de Diretórios

```
src/
├── components/
│   ├── ui/                    # Componentes shadcn/ui (50+ componentes)
│   ├── os/                    # Sistema Operacional (Desktop, Window, Taskbar)
│   ├── aura/                  # Assistente AI (chat, cards, presença)
│   ├── clinica/               # Gestão de pacientes e sessões
│   ├── auricular/             # Mapa auricular interativo (SVG)
│   ├── calendar/              # Sistema de agenda (CalendarOS)
│   ├── financas/              # Controle financeiro completo
│   ├── browser/               # Navegador embutido
│   ├── notas/                 # Sistema de notas/observações
│   ├── studio/                # Player de áudio terapêutico
│   └── bugTracker/            # Sistema de debug visual com AI
├── stores/                    # Zustand stores (estado global)
├── types/                     # Tipagens TypeScript strict
├── services/                  # Integrações com APIs externas
├── lib/                       # Utilitários e helpers
├── hooks/                     # Custom hooks React
└── mocks/                     # Dados mockados para desenvolvimento
```

### Arquitetura de Janelas (OS)

O sistema utiliza um gerenciador de janelas próprio inspirado em desktop OS:

- **Desktop** (`components/os/Desktop.tsx`): Container principal
- **Window** (`components/os/Window.tsx`): Componente de janela arrastável/redimensionável
- **Taskbar** (`components/os/Taskbar.tsx`): Barra de tarefas inferior
- **useOSStore** (`stores/useOSStore.ts`): Estado global das janelas

Tipos de apps disponíveis:
```typescript
type AppType = 'clinica' | 'mapa' | 'studio' | 'config' | 'aura' | 
               'protocolos' | 'knowledge' | 'sessao' | 'calendario' | 
               'financas' | 'browser' | 'notas';
```

---

## 🛠️ Comandos de Build e Desenvolvimento

```bash
# Instalação de dependências
npm install

# Desenvolvimento (dev server na porta 5173)
npm run dev

# Build de produção (com type checking)
npm run build

# Preview do build de produção (porta 4173)
npm run preview

# Linting
npm run lint
```

### Configurações do Vite

- **Base URL:** `./` (relative paths para deploy flexível)
- **Target:** ES2020
- **Code Splitting:** Chunks manuais por funcionalidade
- **Alias:** `@/` mapeia para `./src/`

---

## 📐 Convenções de Código

### TypeScript - Zero Tolerância

```typescript
// ❌ NUNCA use 'any'
const data: any = fetchData();

// ✅ SEMPRE defina tipos explícitos
const data: Paciente = await fetchPaciente(id);

// ✅ SEMPRE use interfaces para props
interface PacienteCardProps {
  paciente: Paciente;
  onEdit: (id: string) => void;
}

// ✅ SEMPRE use enums para valores fixos
enum StatusSessao {
  AGENDADO = 'agendado',
  CONFIRMADO = 'confirmado',
  EM_ANDAMENTO = 'em_andamento',
  CONCLUIDO = 'concluido',
  CANCELADO = 'cancelado'
}
```

### Datas - Serialização Obrigatória

**REGRA CRÍTICA:** SEMPRE converta `Date` para ISO string antes de salvar no Zustand/localStorage.

```typescript
// ❌ ERRADO - Vai quebrar na recuperação
setMensagens([{ ...msg, timestamp: new Date() }]);

// ✅ CORRETO - Salvando
setMensagens([{ ...msg, timestamp: new Date().toISOString() }]);

// ✅ CORRETO - Recuperando
const date = new Date(msg.timestamp);
date.toLocaleTimeString('pt-BR');
```

### Componentes React

```typescript
import React, { memo, useCallback } from 'react';

// ✅ SEMPRE use React.FC
interface Props {
  title: string;
  onClick: () => void;
}

export const MeuComponente: React.FC<Props> = memo(({ title, onClick }) => {
  // ✅ SEMPRE use useCallback para funções passadas a filhos
  const handleClick = useCallback(() => {
    onClick();
  }, [onClick]);

  return <div onClick={handleClick}>{title}</div>;
});
```

### Stores Zustand

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useMeuStore = create<MeuState>()(
  persist(
    (set, get) => ({
      // estado inicial
    }),
    {
      name: 'nome-unico-storage',
      // ✅ SEMPRE use partialize para controlar o que persiste
      partialize: (state) => ({
        dados: state.dados,
        // ❌ NUNCA persista funções
      })
    }
  )
);
```

### Nomenclatura

| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| Componentes | PascalCase | `PacienteCard.tsx` |
| Hooks | camelCase prefixado | `usePaciente.ts` |
| Stores | camelCase | `usePacienteStore.ts` |
| Tipos/Interfaces | PascalCase | `Paciente.ts` |
| Funções utilitárias | camelCase | `formatarData.ts` |
| Constantes | UPPER_SNAKE_CASE | `EVENT_COLORS` |

### Importações

```typescript
// ✅ SEMPRE ordene: React > Libs externas > Internas
import React, { useState } from 'react';
import { format } from 'date-fns';
import { usePacienteStore } from '@/stores/usePacienteStore';
import { PacienteCard } from '@/components/clinica/PacienteCard';

// ✅ SEMPRE use path aliases
import { Button } from '@/components/ui/button';
// ❌ NUNCA use paths relativos complexos
import { Button } from '../../../components/ui/button';
```

---

## 🧪 Testes e Validação

### Pré-commit Checklist

1. **Build sem erros:**
   ```bash
   npm run build
   ```

2. **Verificar TypeScript strict:**
   - Nenhum `any` implícito
   - Todas as propriedades tipadas
   - Retornos de função declarados

3. **Verificar console.logs:**
   ```bash
   grep -r "console.log" src/ --include="*.ts" --include="*.tsx"
   ```

### Validação de Dados

Use Zod para validação de schemas:

```typescript
import { z } from 'zod';

const pacienteSchema = z.object({
  nome: z.string().min(3),
  email: z.string().email(),
  dataNascimento: z.string().datetime()
});

type PacienteInput = z.infer<typeof pacienteSchema>;
```

---

## 🔐 Considerações de Segurança

### Chaves de API

As chaves de API para OpenAI, Gemini e DeepSeek são armazenadas:
- No store de configuração (`useConfigStore`)
- Persistidas em localStorage (não seguro para produção)
- ⚠️ **Atenção:** Nunca commite chaves hardcoded

```typescript
// ✅ Chaves via input do usuário
const { openai_api_key } = useConfigStore();

// ❌ Nunca faça isso
const API_KEY = 'sk-abc123...';
```

### Validação de Inputs

```typescript
// ✅ Sempre valide dados externos
const processarDados = (dados: unknown) => {
  const resultado = meuSchema.safeParse(dados);
  if (!resultado.success) {
    console.error('Dados inválidos:', resultado.error);
    return null;
  }
  return resultado.data;
};
```

---

## 🎨 Sistema de Design

### Paleta de Cores Auris

```typescript
// Cores principais (Tailwind classes)
const colors = {
  sage: '#10b981',        // Verde principal (terapia)
  'sage-light': '#34d399',
  'sage-dark': '#059669',
  amber: '#f59e0b',       // Laranja (alertas)
  indigo: '#818cf8',      // Roxo (espiritual)
  rose: '#fb7185',        // Rosa (erros)
  bg: '#0f172a',          // Background escuro
};
```

### Glassmorphism

Use as classes utilitárias do projeto:

```tsx
// Container glass
<div className="glass">

// Glass com hover
<div className="glass-hover">

// Glass forte (mais opaco)
<div className="glass-strong">

// Janela completa
<div className="window">
```

### Fontes

- **Display:** Cinzel Decorative (títulos)
- **Body:** Inter (texto corrido)
- **Mono:** JetBrains Mono (código/dados)

---

## 🤖 Integração com AI (Aura)

### Providers Suportados

1. **Gemini** (Google) - Padrão
2. **OpenAI** (GPT)
3. **DeepSeek**

### Serviço Unificado

Use `aiProvider.ts` para chamadas de AI:

```typescript
import { sendMessageToAI, hasAnyProviderAvailable } from '@/services/aiProvider';

// Verificar disponibilidade
if (hasAnyProviderAvailable()) {
  const resposta = await sendMessageToAI(mensagem, historico, {
    useFallback: true,
    retry: { maxRetries: 2 }
  });
}
```

### Rate Limiting

O sistema possui rate limiting integrado:
- 30 requests/minuto
- 500 requests/hora

---

## 📦 Stores Principais

| Store | Arquivo | Persistido | Descrição |
|-------|---------|------------|-----------|
| OS | `useOSStore.ts` | Sim | Gerenciamento de janelas |
| Pacientes | `usePacientesStore.ts` | Sim | Cadastro de pacientes |
| Sessões | `useSessoesStore.ts` | Sim | Sessões de terapia |
| Aura | `useAuraStore.ts` | Sim | Chat com AI |
| Calendário | `useCalendarStore.ts` | Sim | Eventos e agenda |
| Finanças | `useFinancasStore.ts` | Sim | Transações financeiras |
| Config | `useConfigStore.ts` | Sim | Preferências do sistema |
| Pontos | `usePontosStore.ts` | Sim | Mapa auricular |
| Notas | `useNotasStore.ts` | Sim | Sistema de notas |
| Áudio | `useAudioStore.ts` | Sim | Player de som |

---

## 🗺️ Sistema de Tipos

### Tipos Principais

```typescript
// Paciente completo
interface Paciente {
  id: string;                    // UUID
  codigo_auris: string;          // Formato: AUR-2024-0001
  dados_pessoais: DadosPessoais;
  anamnese: AnamneseHolistica;   // Avaliação completa
  diagnostico_holistico?: DiagnosticoHolistico;
  created_at: string;            // ISO date
  updated_at: string;
}

// Sessão de terapia
interface Sessao {
  id: string;
  paciente_id: string;
  numero: number;                // Número sequencial
  data: string;                  // ISO
  avaliacao: AvaliacaoSessao;    // EVA início/fim
  protocolo: ProtocoloSessao;    // Pontos aplicados
  reiki?: ReikiSessao | null;
  evolucao: EvolucaoSessao;
}

// Evento de calendário
interface CalendarEvent {
  id: string;
  title: string;
  type: 'consulta' | 'retorno' | 'bloqueio' | 'revisao' | 'aura_sugestao';
  start: string;                 // ISO
  end: string;
  pacienteId?: string;
  status: 'agendado' | 'confirmado' | 'em_andamento' | 'concluido' | 'cancelado';
}

// Transação financeira
interface TransacaoFinanceira {
  id: string;
  tipo: 'receita' | 'despesa';
  valor: number;                 // Sempre number, nunca string
  data: Date;
  pacienteId?: string;
  metodoPagamento: MetodoPagamento;
  status: 'pendente' | 'recebido' | 'cancelado';
}
```

---

## 🐛 Sistema de Debug (BugTracker)

O Auris OS possui um sistema integrado de reporte de bugs com AI:

### Ativação

1. Digite "editar site" no chat da Aura
2. Ou chame o evento: `window.dispatchEvent(new CustomEvent('aura-ativar-modo-edicao'))`

### Funcionalidades

- Inspeção visual de elementos
- Screenshots automáticos
- Análise de código com múltiplas "personalidades" (Arquiteto, React, UI/UX)
- Geração de reports estruturados

---

## 📝 Boas Práticas

### Performance

```typescript
// ✅ Lazy loading para componentes grandes
const AudioPlayer = React.lazy(() => import('./AudioPlayer'));

// ✅ Suspense com fallback
<Suspense fallback={<Spinner />}>
  <AudioPlayer />
</Suspense>

// ✅ Debounce em inputs de busca (300ms)
const [busca, setBusca] = useDebounce('', 300);

// ✅ Memoize callbacks
const handleSubmit = useCallback((data: FormData) => {
  // processar
}, [dependencias]);
```

### Acessibilidade

```tsx
// ✅ Alt em imagens
<img src={foto} alt={`Foto de ${paciente.nome}`} />

// ✅ Aria-label em botões sem texto
<button aria-label="Fechar janela">
  <XIcon />
</button>

// ✅ Contraste mínimo 4.5:1 (garantido pelo tema)
```

### Formatação de Dados

```typescript
// ❌ NUNCA formate moedas manualmente
`R$ ${valor.toFixed(2)}`;

// ✅ Use Intl.NumberFormat
new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
}).format(valor);

// ✅ Use funções utilitárias centralizadas
import { formatDate, formatCurrency } from '@/lib/formatters';
```

---

## 🚨 Checklist Antes de Commit

- [ ] `npm run build` passa sem erros
- [ ] Nenhum `any` no código
- [ ] Nenhum `console.log` em produção
- [ ] Imports não utilizados removidos
- [ ] Variáveis não utilizadas removidas
- [ ] Datas convertidas para ISO antes de salvar
- [ ] Tratamento de erro em async/await
- [ ] Props tipadas corretamente

---

## 📚 Recursos Adicionais

- **Documentação shadcn/ui:** https://ui.shadcn.com
- **Tailwind CSS:** https://tailwindcss.com
- **Zustand:** https://docs.pmnd.rs/zustand
- **Framer Motion:** https://www.framer.com/motion

---

## 🆘 Contato e Suporte

Para dúvidas sobre arquitetura ou convenções, consulte:
- Este arquivo (AGENTS.md)
- Tipos em `src/types/`
- Exemplos em `src/components/ui/`

**Lembrete:** Sempre mantenha este arquivo atualizado quando mudar arquitetura ou adicionar novas convenções.
