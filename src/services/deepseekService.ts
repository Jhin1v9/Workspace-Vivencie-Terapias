import { AURA_BLOCKS_INSTRUCTION } from './auraPrompt';

const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || '';

export interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface DeepSeekResponse {
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

export interface DeepSeekRichResult {
  text: string | null;
  finishReason?: string;
  truncatedByProvider?: boolean;
}

const SYSTEM_CONTEXT = `Você é Aura, uma assistente terapêutica especializada em Auriculoterapia Neurofisiológica.

Diretrizes:
- responda em português do Brasil
- seja acolhedora, técnica e clínica
- priorize a Auriculoterapia Neurofisiológica
- use markdown quando a resposta for textual

Modo estruturado:
${AURA_BLOCKS_INSTRUCTION}`;

export const isDeepSeekAvailable = (apiKey?: string): boolean => {
  return (apiKey ?? DEEPSEEK_API_KEY).trim().length > 0;
};

export const callDeepSeekRich = async (
  messages: DeepSeekMessage[],
  temperature = 0.7,
  maxTokens = 1000,
  apiKey?: string,
  baseUrl = 'https://api.deepseek.com/v1',
  model = 'deepseek-chat'
): Promise<DeepSeekRichResult> => {
  const resolvedApiKey = (apiKey ?? DEEPSEEK_API_KEY).trim();

  if (!isDeepSeekAvailable(resolvedApiKey)) {
    console.warn('DeepSeek API key não configurada');
    return { text: null };
  }

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
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
      console.error('DeepSeek API error:', error);
      return { text: null };
    }

    const data: DeepSeekResponse = await response.json();
    const choice = data.choices[0];
    const finishReason = choice?.finish_reason;

    return {
      text: choice?.message?.content || null,
      finishReason,
      truncatedByProvider: finishReason === 'length',
    };
  } catch (error) {
    console.error('Erro ao chamar DeepSeek:', error);
    return { text: null };
  }
};

export const callDeepSeek = async (
  messages: DeepSeekMessage[],
  temperature = 0.7,
  maxTokens = 1000,
  apiKey?: string,
  baseUrl = 'https://api.deepseek.com/v1',
  model = 'deepseek-chat'
): Promise<string | null> => {
  const result = await callDeepSeekRich(messages, temperature, maxTokens, apiKey, baseUrl, model);
  return result.text;
};

export const shouldUseDeepSeek = (input: string): boolean => {
  const lowerInput = input.toLowerCase();

  const complexCases = [
    /\b(como funciona|mecanismo|explica|por que|porquê)\b.*\b(neurofisiologia|neurologia|cérebro|nervo)/i,
    /\b(análise|analisar|avaliação|avaliar)\b.*\b(caso|paciente|situação|condição)/i,
    /\b(estudo|pesquisa|evidência|artigo|científico|publicação)\b/i,
    /\b(diferença|comparar|versus|vs|melhor|pior)\b.*\b(entre|dois|três)\b/i,
    /^.{150,}$/,
    /\b(explique|ensine|como se|didática|aula|tutorial)\b/i,
  ];

  return complexCases.some((pattern) => pattern.test(lowerInput));
};

export const generateHybridResponse = async (
  messages: DeepSeekMessage[],
  localFallback: () => string
): Promise<{ response: string; usedApi: boolean }> => {
  const lastUserMessage = messages.filter((message) => message.role === 'user').pop();

  if (lastUserMessage && shouldUseDeepSeek(lastUserMessage.content)) {
    const apiResponse = await callDeepSeek(messages);
    if (apiResponse) {
      return { response: apiResponse, usedApi: true };
    }
  }

  return { response: localFallback(), usedApi: false };
};

