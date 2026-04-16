# Aura Context Payload

```ts
type AuraContextPayload = {
  runtime: {
    timestampIso: string;
    telaAtual: string;
    janelaAtiva: string | null;
    abasAbertas: string[];
    abasMinimizadas: string[];
    providerAtivo: 'openai' | 'deepseek' | 'gemini' | 'local';
  };
  pacienteAtual: null | {
    id: string;
    codigoAuris: string;
    nome: string;
    sexo: string;
    idade: number | null;
    profissao?: string;
    queixaPrincipal: string;
    historiaDoenca: string;
    emocaoPredominante: string | null;
    sono: string | null;
    apetite: string | null;
    sede: string | null;
    fezes: string | null;
    urina: string | null;
    dorNatureza: string | null;
    lingua: {
      cor: string;
      saburra: string;
      formato: string;
    };
    pulsos: {
      esquerdo: string;
      direito: string;
    };
    diagnosticoMtc?: string;
  };
  sessaoAtual: null | {
    totalSessoesPaciente: number;
    ultimaSessao: {
      numero: number;
      data: string;
      dorEva: number;
      ansiedade: number;
      melhora: boolean;
      observacoesInicio: string;
      observacoesFinais: string;
      pontosAplicados: string[];
      tecnica: string;
      duracaoMin: number;
    };
  };
  protocoloAtual: {
    totalPontosSelecionados: number;
    mostrarVerso: boolean;
    pontosSelecionados: {
      id: string;
      codigo: string;
      nome: string;
      regiao: string;
      funcao: string;
      indicacoes: string[];
    }[];
  };
  bibliotecaLocal: {
    consultaGerada: string;
    documentosRelacionados: {
      id: string;
      titulo: string;
      categoria: string;
      autor?: string;
      url: string;
      tags: string[];
      resumo: string;
      trechosIndexados: string[];
    }[];
  };
  conversaAtual: {
    acaoRecenteUsuario: string;
    ultimasMensagens: {
      role: 'user' | 'assistant';
      content: string;
    }[];
  };
};
```

## Como funciona

- O payload é montado em `src/lib/auraContext.ts`
- A biblioteca local indexada está em `src/lib/libraryPdfIndex.ts`
- O Gemini recebe esse payload em `src/services/geminiService.ts`
- A Aura envia esse contexto automaticamente a partir de `src/components/aura/AuraAIApp.tsx`

## Objetivo

Fazer a Aura responder com base em:

- tela atual
- janela ativa
- paciente selecionado
- queixa principal
- dados de anamnese
- pulsologia e língua
- sessões anteriores
- pontos selecionados no mapa
- contexto do protocolo atual
- PDFs indexados da biblioteca local
- ação recente do terapeuta
- histórico recente da conversa
