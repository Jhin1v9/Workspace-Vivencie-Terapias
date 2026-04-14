import type { AuraContextPayload } from '@/lib/auraContext';
import { AURA_BLOCKS_INSTRUCTION } from './auraPrompt';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash-lite';

export interface GeminiMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface GeminiGroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}

interface GeminiGroundingMetadata {
  groundingChunks?: GeminiGroundingChunk[];
  webSearchQueries?: string[];
}

interface GeminiResponse {
  candidates?: {
    content?: {
      parts?: { text?: string }[];
    };
    groundingMetadata?: GeminiGroundingMetadata;
    finishReason?: string;
  }[];
  error?: {
    message?: string;
  };
}

export interface GeminiRichResult {
  text: string | null;
  finishReason?: string;
  truncatedByProvider?: boolean;
}

const SYSTEM_PROMPT_AURA_VIVA = `Você é AURA, a assistente viva do AURIS OS.

## IDENTIDADE
- Você é uma assistente clínica onipresente dentro do sistema.
- Você nunca está desligada. Mesmo minimizada, continua observando o contexto atual com discrição.
- Você é parceira do terapeuta, nunca superior.
- Seu tom é humano, caloroso, objetivo, clínico e natural. Nunca robótico.

## MISSÃO PRINCIPAL
Auxiliar o terapeuta em tempo real dentro de todo o AURIS OS, sempre com foco prioritário em:
- Auriculoterapia Neurofisiológica
- Terapia holística
- Raciocínio clínico integrativo
- Leitura de sintomas pela raiz funcional
- Apoio em prontuários, sessões, mapa auricular, protocolos e biblioteca

## PRIORIDADE METODOLÓGICA
Sua base principal e obrigatória é a Auriculoterapia Neurofisiológica.
Priorize método brasileiro empírico-neurofisiológico, modulação do sistema nervoso autônomo, raciocínio clínico pela causa-raiz e protocolos clínicos brasileiros.

## INTERNET E PESQUISA
Você pode usar busca web do Google quando isso melhorar a resposta.
Nunca invente fontes e nunca pesquise dados pessoais identificáveis do paciente.
Quando o terapeuta pedir pontos, protocolo, sequência terapêutica, evidência, efetividade ou resultado esperado, pesquise primeiro e só depois sugira a conduta.
Sempre tente confirmar eficiência, mecanismos e resultados clínicos antes de recomendar pontos.

## ESTILO DE RESPOSTA
- Português do Brasil
- Natural, acolhedora e precisa
- Use markdown bonito e legível quando não estiver em modo estruturado
- Evite parede de texto

## MODO ESTRUTURADO
${AURA_BLOCKS_INSTRUCTION}`;

const serializeContextPayload = (payload?: AuraContextPayload) => {
  if (!payload) {
    return 'CONTEXTO DO SISTEMA: nenhum payload adicional enviado.';
  }

  return ['CONTEXTO ESTRUTURADO DO AURIS OS:', JSON.stringify(payload, null, 2)].join('\n');
};

export const shouldUseGeminiGoogleSearch = (messages: GeminiMessage[], payload?: AuraContextPayload) => {
  const latestUserMessage = [...messages].reverse().find((message) => message.role === 'user')?.content.toLowerCase() ?? '';
  const explicitResearchTerms = [
    'pesquise', 'pesquisar', 'internet', 'web', 'google', 'estudo', 'estudos',
    'evidência', 'evidencia', 'evidencias', 'evidências', 'artigo', 'artigos', 'fonte', 'fontes',
    'revisão', 'revisao', 'atualizado', 'atualizada', 'último', 'ultima', 'recente', 'recentes'
  ];
  const exploratoryTerms = [
    'estudar', 'como pensar', 'me explique', 'me explica', 'quero entender',
    'aprofunda', 'aprofundar', 'melhor forma', 'causa raiz', 'causa-raiz'
  ];
  const therapeuticSuggestionTerms = [
    'sugerir pontos', 'sugira pontos', 'pontos para', 'quais pontos', 'qual ponto',
    'protocolo para', 'protocolo inicial', 'direção terapêutica', 'direcao terapeutica',
    'sequência terapêutica', 'sequencia terapeutica', 'aplicar no mapa', 'conduta',
    'o que usar', 'o que aplicar', 'resultado esperado', 'efetividade', 'eficácia', 'eficacia'
  ];
  const latestSearchQuery = payload?.bibliotecaLocal.consultaGerada.toLowerCase() ?? '';
  const patientComplaint = payload?.pacienteAtual?.queixaPrincipal.toLowerCase() ?? '';
  const therapeuticSymptoms = [
    'ansiedade', 'insônia', 'insonia', 'dor', 'cefaleia', 'enxaqueca', 'insônia',
    'lombalgia', 'cervicalgia', 'tabagismo', 'compulsão', 'compulsao'
  ];

  const isTherapeuticSuggestion =
    therapeuticSuggestionTerms.some((term) => latestUserMessage.includes(term)) ||
    (
      (latestUserMessage.includes('ponto') || latestUserMessage.includes('protocolo')) &&
      (
        therapeuticSymptoms.some((term) => latestUserMessage.includes(term)) ||
        therapeuticSymptoms.some((term) => patientComplaint.includes(term)) ||
        patientComplaint.length > 0
      )
    );

  return (
    explicitResearchTerms.some((term) => latestUserMessage.includes(term)) ||
    exploratoryTerms.some((term) => latestUserMessage.includes(term)) ||
    isTherapeuticSuggestion ||
    latestSearchQuery.includes('artigo') ||
    latestSearchQuery.includes('evidência') ||
    latestSearchQuery.includes('evidencia') ||
    latestSearchQuery.includes('evidencias')
  );
};

// Nota: Função formatGroundingSources removida temporariamente para evitar poluição do texto
// Pode ser reimplementada como metadado separado no futuro

export const isGeminiAvailable = (apiKey?: string): boolean => {
  return (apiKey ?? GEMINI_API_KEY).trim().length > 0;
};

export const callGeminiRich = async (
  messages: GeminiMessage[],
  temperature = 0.7,
  maxTokens = 1000,
  apiKey?: string,
  model?: string,
  contextPayload?: AuraContextPayload
): Promise<GeminiRichResult> => {
  const resolvedKey = (apiKey ?? GEMINI_API_KEY).trim();
  const resolvedModel = model || GEMINI_MODEL;

  if (!resolvedKey) {
    console.warn('Gemini API key não configurada');
    return { text: null };
  }

  const conversationText = messages
    .map((message) => `${message.role === 'assistant' ? 'Assistente' : 'Usuário'}: ${message.content}`)
    .join('\n\n');

  const prompt = [
    serializeContextPayload(contextPayload),
    'CONVERSA ATUAL:',
    conversationText,
    'INSTRUÇÃO FINAL: responda como AURA usando primeiro o contexto clínico do sistema, depois a biblioteca local indexada e, quando útil, a busca web do Google.'
  ].join('\n\n');

  const useGoogleSearch = shouldUseGeminiGoogleSearch(messages, contextPayload);

  try {
    const response = await fetch(`${GEMINI_API_URL}/${resolvedModel}:generateContent?key=${resolvedKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT_AURA_VIVA }] },
        tools: useGoogleSearch ? [{ google_search: {} }] : undefined,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature,
          maxOutputTokens: maxTokens,
        },
      }),
    });

    const data = (await response.json()) as GeminiResponse;

    if (!response.ok || data.error) {
      console.error('Gemini API error:', data.error?.message || response.statusText);
      return { text: null };
    }

    const candidate = data.candidates?.[0];
    const answer = candidate?.content?.parts?.[0]?.text?.trim();
    const finishReason = candidate?.finishReason;

    if (!answer) {
      return { text: null, finishReason };
    }

    // Removido sources do texto para evitar poluição - implementar depois como metadado separado
    // const groundingSources = formatGroundingSources(candidate?.groundingMetadata);

    return {
      text: answer,
      finishReason,
      truncatedByProvider: finishReason === 'MAX_TOKENS'
    };
  } catch (error) {
    console.error('Erro ao chamar Gemini:', error);
    return { text: null };
  }
};

export const callGemini = async (
  messages: GeminiMessage[],
  temperature = 0.7,
  maxTokens = 1000,
  apiKey?: string,
  model?: string,
  contextPayload?: AuraContextPayload
): Promise<string | null> => {
  const result = await callGeminiRich(messages, temperature, maxTokens, apiKey, model, contextPayload);
  return result.text;
};

