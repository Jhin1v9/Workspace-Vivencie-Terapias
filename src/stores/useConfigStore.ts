import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ConfiguracaoSistema } from '@/types';
import { configuracaoInicial } from '@/mocks/dados';

const CURRENT_GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const LEGACY_GEMINI_KEY = 'AIzaSyB0-XZ4JGIFkCNhpw8Y8Yv7kQ7h2z6F1dM';
const CURRENT_GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash-lite';
const LEGACY_GEMINI_MODELS = ['gemini-1.5-flash-latest', 'gemini-1.5-flash', 'gemini-1.5-flash-001'];

interface ConfigState extends ConfiguracaoSistema {
  // Actions
  setModoReiki: (ativo: boolean) => void;
  toggleModoReiki: () => void;
  setWallpaper: (wallpaper: ConfiguracaoSistema['wallpaper_atual']) => void;
  setTerapeutaInfo: (nome: string, email: string, registro?: string) => void;
  setNomeTerapeuta: (nome: string) => void;
  setFonte: (fonte: ConfiguracaoSistema['fonte_principal']) => void;
  setFonteSistema: (fonte: ConfiguracaoSistema['fonte_sistema']) => void;
  setTamanhoFonte: (tamanho: ConfiguracaoSistema['tamanho_fonte']) => void;
  setAIProvider: (provider: ConfiguracaoSistema['ai_provider']) => void;
  setOpenAIKey: (key: string) => void;
  setDeepSeekKey: (key: string) => void;
  setGeminiKey: (key: string) => void;
  setGeminiModel: (model: string) => void;
  normalizeGeminiConfig: () => void;
  resetGeminiConfig: () => void;
  markAITestResult: (
    provider: Exclude<ConfiguracaoSistema['ai_provider'], 'none'>,
    success: boolean,
    error?: string
  ) => void;
  testAIConnection: (provider: Exclude<ConfiguracaoSistema['ai_provider'], 'none'>) => Promise<boolean>;
  exportarDados: () => string;
  importarDados: (json: string) => boolean;
  resetarDados: () => void;
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set, get) => ({
      ...configuracaoInicial,

      setModoReiki: (ativo) => set({ modo_reiki_ativo: ativo }),
      
      toggleModoReiki: () => set((state) => ({ modo_reiki_ativo: !state.modo_reiki_ativo })),

      setWallpaper: (wallpaper) => set({ wallpaper_atual: wallpaper }),

      setTerapeutaInfo: (nome, email, registro) => set({
        terapeuta_nome: nome,
        terapeuta_email: email,
        terapeuta_registro: registro,
      }),
      
      setNomeTerapeuta: (nome) => set({
        terapeuta_nome: nome,
      }),

      setFonte: (fonte) => set({ fonte_principal: fonte }),
      
      setFonteSistema: (fonte) => set({ fonte_sistema: fonte }),

      setTamanhoFonte: (tamanho) => set({ tamanho_fonte: tamanho }),

      setAIProvider: (provider) => set({ ai_provider: provider }),

      setOpenAIKey: (key) => set({ openai_api_key: key, openai_tested: false, openai_last_error: '' }),

      setDeepSeekKey: (key) => set({ deepseek_api_key: key, deepseek_tested: false, deepseek_last_error: '' }),

      setGeminiKey: (key) => set({ gemini_api_key: key, gemini_tested: false, gemini_last_error: '' }),

      setGeminiModel: (model) => set({ gemini_model: model, gemini_tested: false, gemini_last_error: '' }),

      normalizeGeminiConfig: () => {
        const state = get();
        const shouldResetModel = !state.gemini_model || LEGACY_GEMINI_MODELS.includes(state.gemini_model);
        const shouldResetKey = !state.gemini_api_key || state.gemini_api_key === LEGACY_GEMINI_KEY;

        if (!shouldResetModel && !shouldResetKey) {
          return;
        }

        set({
          gemini_api_key: shouldResetKey ? CURRENT_GEMINI_KEY : state.gemini_api_key,
          gemini_model: shouldResetModel ? CURRENT_GEMINI_MODEL : state.gemini_model,
          gemini_tested: false,
          gemini_last_error: '',
          ai_provider: state.ai_provider === 'gemini' && (shouldResetModel || shouldResetKey) ? 'none' : state.ai_provider,
        });
      },

      resetGeminiConfig: () =>
        set((state) => ({
          gemini_api_key: CURRENT_GEMINI_KEY,
          gemini_model: CURRENT_GEMINI_MODEL,
          gemini_tested: false,
          gemini_last_error: '',
          ai_provider: state.ai_provider === 'gemini' ? 'none' : state.ai_provider,
        })),

      markAITestResult: (provider, success, error) => {
        if (provider === 'openai') {
          set({ openai_tested: success, openai_last_error: error || '' });
          return;
        }

        if (provider === 'deepseek') {
          set({ deepseek_tested: success, deepseek_last_error: error || '' });
          return;
        }

        set({ gemini_tested: success, gemini_last_error: error || '' });
      },

      testAIConnection: async (provider) => {
        const state = get();

        try {
          if (provider === 'openai') {
            const response = await fetch('https://api.openai.com/v1/models', {
              headers: {
                Authorization: `Bearer ${state.openai_api_key}`,
              },
            });

            const rawText = await response.text();
            const success = response.ok;
            get().markAITestResult(provider, success, success ? '' : `HTTP ${response.status}: ${rawText}`);
            return success;
          }

          if (provider === 'deepseek') {
            const response = await fetch(`${state.deepseek_base_url}/models`, {
              headers: {
                Authorization: `Bearer ${state.deepseek_api_key}`,
              },
            });

            const rawText = await response.text();
            const success = response.ok;
            get().markAITestResult(provider, success, success ? '' : `HTTP ${response.status}: ${rawText}`);
            return success;
          }

          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${state.gemini_model}:generateContent?key=${state.gemini_api_key}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                contents: [
                  {
                    role: 'user',
                    parts: [{ text: 'Teste de conexão. Responda apenas OK.' }],
                  },
                ],
              }),
            }
          );

          const data = await response.json();
          const success = response.ok && !!data.candidates?.length && !data.error;
          const errorMessage = success
            ? ''
            : data.error?.message?.includes('reported as leaked')
              ? 'Chave Gemini bloqueada por vazamento. Gere uma nova chave no Google AI Studio e depois clique em Resetar Gemini.'
            : data.error?.message?.includes('API key not valid')
              ? 'Chave Gemini inválida. Revise a API key no card do Gemini.'
              : data.error?.message?.includes('is not found')
                ? 'Modelo Gemini inválido ou descontinuado. Use gemini-2.5-flash ou gemini-2.5-flash-lite.'
                : `HTTP ${response.status}: ${data.error?.message || 'Resposta inválida'}`;
          get().markAITestResult(provider, success, errorMessage);
          return success;
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Erro de rede';
          get().markAITestResult(provider, false, message);
          return false;
        }
      },

      exportarDados: () => {
        const dados = {
          config: {
            modo_reiki_ativo: get().modo_reiki_ativo,
            wallpaper_atual: get().wallpaper_atual,
            terapeuta_nome: get().terapeuta_nome,
            terapeuta_email: get().terapeuta_email,
            terapeuta_registro: get().terapeuta_registro,
            fonte_principal: get().fonte_principal,
            fonte_sistema: get().fonte_sistema,
            tamanho_fonte: get().tamanho_fonte,
            ai_provider: get().ai_provider,
            openai_api_key: get().openai_api_key,
            openai_model: get().openai_model,
            openai_tested: get().openai_tested,
            openai_last_error: get().openai_last_error,
            deepseek_api_key: get().deepseek_api_key,
            deepseek_base_url: get().deepseek_base_url,
            deepseek_model: get().deepseek_model,
            deepseek_tested: get().deepseek_tested,
            deepseek_last_error: get().deepseek_last_error,
            gemini_api_key: get().gemini_api_key,
            gemini_model: get().gemini_model,
            gemini_tested: get().gemini_tested,
            gemini_last_error: get().gemini_last_error,
          },
          timestamp: new Date().toISOString(),
        };
        return JSON.stringify(dados, null, 2);
      },

      importarDados: (json) => {
        try {
          const dados = JSON.parse(json);
          if (dados.config) {
            set({
              modo_reiki_ativo: dados.config.modo_reiki_ativo ?? false,
              wallpaper_atual: dados.config.wallpaper_atual ?? 'akasha',
              terapeuta_nome: dados.config.terapeuta_nome ?? 'Terapeuta',
              terapeuta_email: dados.config.terapeuta_email ?? '',
              terapeuta_registro: dados.config.terapeuta_registro,
              fonte_principal: dados.config.fonte_principal ?? 'inter',
              fonte_sistema: dados.config.fonte_sistema ?? 'sans',
              tamanho_fonte: dados.config.tamanho_fonte ?? 'medio',
              ai_provider: dados.config.ai_provider ?? 'none',
              openai_api_key: dados.config.openai_api_key ?? '',
              openai_model: dados.config.openai_model ?? 'gpt-4o-mini',
              openai_tested: dados.config.openai_tested ?? false,
              openai_last_error: dados.config.openai_last_error ?? '',
              deepseek_api_key: dados.config.deepseek_api_key ?? '',
              deepseek_base_url: dados.config.deepseek_base_url ?? 'https://api.deepseek.com/v1',
              deepseek_model: dados.config.deepseek_model ?? 'deepseek-chat',
              deepseek_tested: dados.config.deepseek_tested ?? false,
              deepseek_last_error: dados.config.deepseek_last_error ?? '',
              gemini_api_key: dados.config.gemini_api_key ?? '',
              gemini_model: dados.config.gemini_model ?? 'gemini-2.5-flash-lite',
              gemini_tested: dados.config.gemini_tested ?? false,
              gemini_last_error: dados.config.gemini_last_error ?? '',
            });
            return true;
          }
          return false;
        } catch (e) {
          console.error('Erro ao importar configurações:', e);
          return false;
        }
      },

      resetarDados: () => set({ ...configuracaoInicial }),
    }),
    {
      name: 'auris-config-storage',
      version: 3,
      migrate: (persistedState) => {
        const state = persistedState as Partial<ConfiguracaoSistema> | undefined;

        if (!state) {
          return persistedState;
        }

        if (!state.gemini_api_key || state.gemini_api_key === LEGACY_GEMINI_KEY) {
          state.gemini_api_key = CURRENT_GEMINI_KEY;
          state.gemini_tested = false;
          state.gemini_last_error = '';
          if (state.ai_provider === 'gemini') {
            state.ai_provider = 'none';
          }
        }

        if (!state.gemini_model || LEGACY_GEMINI_MODELS.includes(state.gemini_model)) {
          state.gemini_model = CURRENT_GEMINI_MODEL;
          state.gemini_tested = false;
          state.gemini_last_error = '';
        }

        return state;
      },
    }
  )
);

