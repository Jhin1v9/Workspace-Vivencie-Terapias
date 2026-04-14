// ============================================================================
// AI PROVIDER - Serviço unificado com Retry, Fallback e Rate Limiting
// FASE 5: Integração robusta com APIs externas
// ============================================================================

import { callGeminiRich, type GeminiMessage, isGeminiAvailable } from './geminiService';
import { callOpenAIRich, type OpenAIMessage, isOpenAIAvailable } from './openaiService';
import { callDeepSeekRich, type DeepSeekMessage, isDeepSeekAvailable } from './deepseekService';
import type { AuraContextPayload } from '@/lib/auraContext';

// ============================================================================
// TIPOS
// ============================================================================

export type AIProvider = 'gemini' | 'openai' | 'deepseek' | 'local';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIResult {
  text: string | null;
  provider: AIProvider;
  finishReason?: string;
  truncated?: boolean;
  error?: string;
}

export interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  backoffMultiplier: number;
}

export interface RateLimitConfig {
  maxRequestsPerMinute: number;
  maxRequestsPerHour: number;
}

// ============================================================================
// CONFIGURAÇÕES PADRÃO
// ============================================================================

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  backoffMultiplier: 2,
};

const DEFAULT_RATE_LIMIT: RateLimitConfig = {
  maxRequestsPerMinute: 30,
  maxRequestsPerHour: 500,
};

// ============================================================================
// SISTEMA DE RATE LIMITING
// ============================================================================

class RateLimiter {
  private requests: Date[] = [];
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig = DEFAULT_RATE_LIMIT) {
    this.config = config;
  }

  canMakeRequest(): boolean {
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60000);
    const oneHourAgo = new Date(now.getTime() - 3600000);

    // Limpar requests antigos
    this.requests = this.requests.filter(
      (req) => req > oneHourAgo
    );

    const requestsLastMinute = this.requests.filter(
      (req) => req > oneMinuteAgo
    ).length;

    const requestsLastHour = this.requests.length;

    return (
      requestsLastMinute < this.config.maxRequestsPerMinute &&
      requestsLastHour < this.config.maxRequestsPerHour
    );
  }

  recordRequest(): void {
    this.requests.push(new Date());
  }

  getWaitTime(): number {
    if (this.requests.length === 0) return 0;

    const now = new Date();
    const oldestRequest = this.requests[0];
    const oneMinuteAgo = new Date(now.getTime() - 60000);

    if (oldestRequest > oneMinuteAgo) {
      return oldestRequest.getTime() - oneMinuteAgo.getTime() + 100;
    }

    return 0;
  }
}

// Instância global do rate limiter
const globalRateLimiter = new RateLimiter();

// ============================================================================
// SISTEMA DE RETRY COM BACKOFF
// ============================================================================

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableError = (error: unknown): boolean => {
  if (error instanceof Error) {
    const retryableMessages = [
      'network',
      'timeout',
      'rate limit',
      '429',
      '503',
      '502',
      '500',
    ];
    return retryableMessages.some((msg) =>
      error.message.toLowerCase().includes(msg)
    );
  }
  return false;
};

// ============================================================================
// PROVIDERS INDIVIDUAIS COM RETRY
// ============================================================================

const callGeminiWithRetry = async (
  messages: AIMessage[],
  config: RetryConfig,
  contextPayload?: AuraContextPayload
): Promise<AIResult> => {
  const geminiMessages: GeminiMessage[] = messages.map((m) => ({
    role: m.role === 'system' ? 'assistant' : m.role,
    content: m.content,
  }));

  let lastError: string | undefined;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      const result = await callGeminiRich(
        geminiMessages,
        0.7,
        1500,
        undefined,
        undefined,
        contextPayload
      );

      if (result.text) {
        return {
          text: result.text,
          provider: 'gemini',
          finishReason: result.finishReason,
          truncated: result.truncatedByProvider,
        };
      }

      // Se retornou null mas não erro, tenta novamente
      if (attempt < config.maxRetries) {
        const delay = config.retryDelay * Math.pow(config.backoffMultiplier, attempt);
        await sleep(delay);
      }
    } catch (error) {
      lastError = error instanceof Error ? error.message : 'Unknown error';
      
      if (!isRetryableError(error) || attempt === config.maxRetries) {
        break;
      }

      const delay = config.retryDelay * Math.pow(config.backoffMultiplier, attempt);
      await sleep(delay);
    }
  }

  return {
    text: null,
    provider: 'gemini',
    error: lastError || 'Failed after retries',
  };
};

const callOpenAIWithRetry = async (
  messages: AIMessage[],
  config: RetryConfig
): Promise<AIResult> => {
  const openAIMessages: OpenAIMessage[] = messages;
  let lastError: string | undefined;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      const result = await callOpenAIRich(
        openAIMessages,
        0.7,
        1500
      );

      if (result.text) {
        return {
          text: result.text,
          provider: 'openai',
          finishReason: result.finishReason,
          truncated: result.truncatedByProvider,
        };
      }

      if (attempt < config.maxRetries) {
        const delay = config.retryDelay * Math.pow(config.backoffMultiplier, attempt);
        await sleep(delay);
      }
    } catch (error) {
      lastError = error instanceof Error ? error.message : 'Unknown error';
      
      if (!isRetryableError(error) || attempt === config.maxRetries) {
        break;
      }

      const delay = config.retryDelay * Math.pow(config.backoffMultiplier, attempt);
      await sleep(delay);
    }
  }

  return {
    text: null,
    provider: 'openai',
    error: lastError || 'Failed after retries',
  };
};

const callDeepSeekWithRetry = async (
  messages: AIMessage[],
  config: RetryConfig
): Promise<AIResult> => {
  const deepSeekMessages: DeepSeekMessage[] = messages;
  let lastError: string | undefined;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      const result = await callDeepSeekRich(
        deepSeekMessages,
        0.7,
        1500
      );

      if (result.text) {
        return {
          text: result.text,
          provider: 'deepseek',
          finishReason: result.finishReason,
          truncated: result.truncatedByProvider,
        };
      }

      if (attempt < config.maxRetries) {
        const delay = config.retryDelay * Math.pow(config.backoffMultiplier, attempt);
        await sleep(delay);
      }
    } catch (error) {
      lastError = error instanceof Error ? error.message : 'Unknown error';
      
      if (!isRetryableError(error) || attempt === config.maxRetries) {
        break;
      }

      const delay = config.retryDelay * Math.pow(config.backoffMultiplier, attempt);
      await sleep(delay);
    }
  }

  return {
    text: null,
    provider: 'deepseek',
    error: lastError || 'Failed after retries',
  };
};

// ============================================================================
// FUNÇÃO PRINCIPAL COM FALLBACK
// ============================================================================

export interface CallAIOptions {
  preferredProvider?: AIProvider;
  retry?: Partial<RetryConfig>;
  contextPayload?: AuraContextPayload;
  useFallback?: boolean;
}

export const callAI = async (
  messages: AIMessage[],
  options: CallAIOptions = {}
): Promise<AIResult> => {
  const {
    preferredProvider,
    retry = {},
    contextPayload,
    useFallback = true,
  } = options;

  const retryConfig = { ...DEFAULT_RETRY_CONFIG, ...retry };

  // Verificar rate limit
  if (!globalRateLimiter.canMakeRequest()) {
    const waitTime = globalRateLimiter.getWaitTime();
    if (waitTime > 0) {
      await sleep(waitTime);
    }
  }

  globalRateLimiter.recordRequest();

  // Definir ordem de tentativa baseada na preferência
  const providerOrder: AIProvider[] = preferredProvider
    ? [preferredProvider, 'gemini', 'openai', 'deepseek'].filter(
        (p, i, arr) => arr.indexOf(p) === i
      ) as AIProvider[]
    : ['gemini', 'openai', 'deepseek'];

  // Tentar cada provider
  for (const provider of providerOrder) {
    let result: AIResult;

    switch (provider) {
      case 'gemini':
        if (!isGeminiAvailable()) continue;
        result = await callGeminiWithRetry(messages, retryConfig, contextPayload);
        break;
      case 'openai':
        if (!isOpenAIAvailable()) continue;
        result = await callOpenAIWithRetry(messages, retryConfig);
        break;
      case 'deepseek':
        if (!isDeepSeekAvailable()) continue;
        result = await callDeepSeekWithRetry(messages, retryConfig);
        break;
      default:
        continue;
    }

    if (result.text) {
      return result;
    }

    // Se não deve usar fallback, retorna erro do primeiro provider
    if (!useFallback) {
      return result;
    }
  }

  // Se chegou aqui, todos os providers falharam
  return {
    text: null,
    provider: 'local',
    error: 'Todos os provedores de AI falharam. Verifique suas configurações de API.',
  };
};

// ============================================================================
// FUNÇÃO SIMPLIFICADA
// ============================================================================

export const sendMessageToAI = async (
  message: string,
  history: AIMessage[] = [],
  options?: CallAIOptions
): Promise<string> => {
  const messages: AIMessage[] = [
    ...history,
    { role: 'user', content: message },
  ];

  const result = await callAI(messages, options);
  return (
    result.text ||
    'Desculpe, não consegui processar sua mensagem agora. Tente novamente em alguns instantes.'
  );
};

// ============================================================================
// UTILITÁRIOS
// ============================================================================

export const getAvailableProviders = (): AIProvider[] => {
  const providers: AIProvider[] = [];
  if (isGeminiAvailable()) providers.push('gemini');
  if (isOpenAIAvailable()) providers.push('openai');
  if (isDeepSeekAvailable()) providers.push('deepseek');
  return providers;
};

export const hasAnyProviderAvailable = (): boolean => {
  return (
    isGeminiAvailable() || isOpenAIAvailable() || isDeepSeekAvailable()
  );
};
