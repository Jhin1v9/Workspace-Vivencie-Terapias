import { AURA_BLOCKS_INSTRUCTION } from './auraPrompt';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';

export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIResponse {
  choices: {
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface OpenAIRichResult {
  text: string | null;
  finishReason?: string;
  truncatedByProvider?: boolean;
}

const SYSTEM_CONTEXT = `Você é Aura, uma assistente terapêutica especializada em Auriculoterapia Neurofisiológica e Auriculoterapia Neurofisiol�gica.

SUAS CAPACIDADES:
1. Explicar bases neurofisiológicas da auriculoterapia
2. Sugerir pontos auriculares baseados em queixas
3. Descrever protocolos terapêuticos
4. Auxiliar em anamneses terap�uticas
5. Integrar conhecimentos terapêuticos de forma técnica, clara e acessível

Regras de estilo:
- Responda em português do Brasil
- Seja acolhedora, clínica e útil
- Use markdown quando a resposta for textual

Modo estruturado:
${AURA_BLOCKS_INSTRUCTION}`;

export const isOpenAIAvailable = (apiKey?: string): boolean => {
  return (apiKey ?? OPENAI_API_KEY).trim().length > 0;
};

export const callOpenAIRich = async (
  messages: OpenAIMessage[],
  temperature = 0.7,
  maxTokens = 1000,
  apiKey?: string,
  model = 'gpt-4o-mini'
): Promise<OpenAIRichResult> => {
  const resolvedApiKey = (apiKey ?? OPENAI_API_KEY).trim();

  if (!isOpenAIAvailable(resolvedApiKey)) {
    console.warn('OpenAI API key não configurada');
    return { text: null };
  }

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resolvedApiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: SYSTEM_CONTEXT },
          ...messages,
        ],
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      return { text: null };
    }

    const data: OpenAIResponse = await response.json();
    const choice = data.choices[0];
    const finishReason = choice?.finish_reason;

    return {
      text: choice?.message?.content || null,
      finishReason,
      truncatedByProvider: finishReason === 'length',
    };
  } catch (error) {
    console.error('Erro ao chamar OpenAI:', error);
    return { text: null };
  }
};

export const callOpenAI = async (
  messages: OpenAIMessage[],
  temperature = 0.7,
  maxTokens = 1000,
  apiKey?: string,
  model = 'gpt-4o-mini'
): Promise<string | null> => {
  const result = await callOpenAIRich(messages, temperature, maxTokens, apiKey, model);
  return result.text;
};

export const shouldUseOpenAI = (input: string): boolean => {
  const lowerInput = input.toLowerCase();

  const complexCases = [
    /\b(como funciona|mecanismo|explica|por que|porquê)\b.*\b(neurofisiologia|neurologia|cérebro|nervo)/i,
    /\b(análise|analisar|avaliação|avaliar)\b.*\b(caso|paciente|situação|condição)/i,
    /\b(estudo|pesquisa|evidência|artigo|científico|publicação)\b/i,
    /\b(diferença|comparar|versus|vs|melhor|pior)\b.*\b(entre|dois|três)\b/i,
    /^.{150,}$/,
    /\b(explique|ensine|como se|didática|aula|tutorial)\b/i,
    /\b(atual|atualizado|novo|recente|último|2024|2025|2026)\b/i,
  ];

  return complexCases.some((pattern) => pattern.test(lowerInput));
};

export const callAI = async (
  messages: OpenAIMessage[],
  temperature = 0.7,
  maxTokens = 1000
): Promise<{ response: string | null; provider: 'openai' | 'deepseek' | 'none' }> => {
  if (isOpenAIAvailable()) {
    const response = await callOpenAI(messages, temperature, maxTokens);
    if (response) {
      return { response, provider: 'openai' };
    }
  }

  return { response: null, provider: 'none' };
};


