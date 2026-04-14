// ============================================================================
// AURA STORE - Estado global unificado da Aura
// FASE 5: Integração com APIs externas (Gemini, OpenAI, DeepSeek)
// ============================================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { 
  sendMessageToAI, 
  hasAnyProviderAvailable,
  type AIMessage 
} from '@/services/aiProvider';
import type { AuraChatMessage } from '@/types/auraChat';

// ============================================================================
// TIPOS
// ============================================================================

export type AuraModo = 'compacto' | 'expandido';

export interface ContextoConversa {
  ultimoTopico: string | null;
  pacienteEmEdicao: string | null;
  protocoloSugerido: string[];
  modoWizard: 'anamnese' | 'novo_paciente' | 'sessao' | 'confirmacao' | 'selecionar_sistema_mapa' | null;
  dadosColetados: any;
  etapaWizard: number;
  acaoPendente: string | null;
  dadosPendentes: any;
  historico: { role: 'user' | 'assistant'; content: string }[];
}

interface AuraState {
  // Modo de exibição
  modo: AuraModo;
  setModo: (modo: AuraModo) => void;
  
  // Mensagens
  mensagens: AuraChatMessage[];
  addMensagem: (msg: AuraChatMessage) => void;
  clearMensagens: () => void;
  
  // Estado de loading
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // Contexto da conversa
  contexto: ContextoConversa;
  updateContexto: (ctx: Partial<ContextoConversa>) => void;
  resetContexto: () => void;
  
  // Função principal de envio
  sendMessage: (texto: string) => Promise<void>;
}

// ============================================================================
// RESPOSTAS LOCAIS DE FALLBACK
// ============================================================================

const respostasLocais: Record<string, string[]> = {
  saudacao: [
    'Olá! Como posso auxiliar você hoje?',
    'Oi! Pronta para ajudar. O que precisa?',
    'Olá! Em que posso ser útil?'
  ],
  mapa: [
    'Posso ajudar com o mapa auricular. Quer que eu sugira pontos para alguma condição específica?',
    'O mapa auricular está à disposição. Precisa de ajuda para selecionar pontos?',
    'Posso guiar você no mapa. Qual região deseja explorar?'
  ],
  protocolo: [
    'Posso sugerir protocolos baseados em evidências. Qual a queixa principal?',
    'Vou analisar e sugerir o melhor protocolo para o caso. Me conte mais sobre o paciente.',
    'Tenho acesso a diversos protocolos. Qual condição quer tratar?'
  ],
  fallback: [
    'Entendi! Posso ajudar com isso. O que mais você precisa?',
    'Interessante! Vou analisar essa informação.',
    'Compreendido. Como posso auxiliar melhor?',
    'OK! Estou processando sua solicitação.'
  ]
};

const detectarIntencao = (texto: string): keyof typeof respostasLocais | 'editar_site' | 'sair_edicao' => {
  const lower = texto.toLowerCase();
  if (lower.match(/(olá|oi|bom dia|boa tarde|boa noite|hey)/)) return 'saudacao';
  if (lower.match(/(mapa|orelha|ponto|auricular)/)) return 'mapa';
  if (lower.match(/(protocolo|tratamento|terapia|condição)/)) return 'protocolo';
  if (lower.match(/(editar site|modo edição|inspecionar|dev mode)/)) return 'editar_site';
  if (lower.match(/(sair do modo edição|desativar modo|sair edição)/)) return 'sair_edicao';
  return 'fallback';
};

const getRespostaLocal = (texto: string): string => {
  const intencao = detectarIntencao(texto);
  const respostas = respostasLocais[intencao];
  return respostas[Math.floor(Math.random() * respostas.length)];
};

// ============================================================================
// STORE
// ============================================================================

export const useAuraStore = create<AuraState>()(
  persist(
    (set, get) => ({
      // Modo inicial
      modo: 'compacto',
      setModo: (modo) => set({ modo }),
      
      // Mensagens
      mensagens: [],
      addMensagem: (msg) => set((state) => ({ 
        mensagens: [...state.mensagens, msg] 
      })),
      clearMensagens: () => set({ mensagens: [] }),
      
      // Loading
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),
      
      // Contexto
      contexto: {
        ultimoTopico: null,
        pacienteEmEdicao: null,
        protocoloSugerido: [],
        modoWizard: null,
        dadosColetados: {},
        etapaWizard: 0,
        acaoPendente: null,
        dadosPendentes: null,
        historico: []
      },
      updateContexto: (ctx) => set((state) => ({
        contexto: { ...state.contexto, ...ctx }
      })),
      resetContexto: () => set({
        contexto: {
          ultimoTopico: null,
          pacienteEmEdicao: null,
          protocoloSugerido: [],
          modoWizard: null,
          dadosColetados: {},
          etapaWizard: 0,
          acaoPendente: null,
          dadosPendentes: null,
          historico: []
        }
      }),
      
      // Função principal de envio com integração AI
      sendMessage: async (texto: string) => {
        const { addMensagem, setIsLoading, contexto, updateContexto } = get();
        
        // Adicionar mensagem do usuário
        const userMsg: AuraChatMessage = {
          id: uuidv4(),
          tipo: 'usuario',
          texto: texto,
          timestamp: new Date()
        };
        addMensagem(userMsg);
        
        setIsLoading(true);
        
        try {
          // Verificar comandos especiais primeiro
          const intencao = detectarIntencao(texto);
          
          if (intencao === 'editar_site') {
            // Ativar modo edição via evento
            window.dispatchEvent(new CustomEvent('aura-ativar-modo-edicao'));
            
            const auraMsg: AuraChatMessage = {
              id: uuidv4(),
              tipo: 'aura',
              texto: `🛠️ **Modo Edição Ativado**

Agora você pode:
• Passar o mouse sobre elementos para inspecionar
• Clicar em qualquer elemento para adicionar um report
• Capturar screenshots automaticamente

Dica: O tooltip mostra tag, classes, dimensões e posição do elemento.

Clique no botão "Sair do Modo Edição" quando terminar.`,
              timestamp: new Date(),
              dados: { acao: 'ativar_modo_edicao' }
            };
            addMensagem(auraMsg);
            setIsLoading(false);
            return;
          }
          
          if (intencao === 'sair_edicao') {
            // Desativar modo edição via evento
            window.dispatchEvent(new CustomEvent('aura-desativar-modo-edicao'));
            
            const auraMsg: AuraChatMessage = {
              id: uuidv4(),
              tipo: 'aura',
              texto: `✅ **Modo Edição Desativado**

Você saiu do modo de inspeção.
Use "editar site" para ativar novamente quando precisar.`,
              timestamp: new Date(),
              dados: { acao: 'desativar_modo_edicao' }
            };
            addMensagem(auraMsg);
            setIsLoading(false);
            return;
          }
          
          // Converter histórico para formato AIMessage
          const history: AIMessage[] = contexto.historico.map(h => ({
            role: h.role,
            content: h.content
          }));
          
          let respostaTexto: string = '';
          let providerMeta: { provider: 'openai' | 'deepseek' | 'gemini' | 'local'; truncated?: boolean } | undefined;
          
          // Tentar usar APIs primeiro
          let apiSuccess = false;
          
          if (hasAnyProviderAvailable()) {
            try {
              const result = await sendMessageToAI(texto, history, {
                useFallback: false, // Não usar fallback do provider, vamos usar nosso local
                retry: {
                  maxRetries: 1,
                  retryDelay: 1000
                }
              });
              
              // Verificar se a resposta é válida (não é mensagem de erro)
              if (result && 
                  !result.includes('Desculpe, não consegui') && 
                  !result.includes('problema ao processar') &&
                  result.length > 10) {
                respostaTexto = result;
                providerMeta = { provider: 'gemini' };
                apiSuccess = true;
              }
            } catch {
              // API falhou, vai usar fallback local
            }
          }
          
          // Se API falhou ou não está disponível, usar respostas locais
          if (!apiSuccess || !respostaTexto) {
            await new Promise(resolve => setTimeout(resolve, 600));
            respostaTexto = getRespostaLocal(texto);
            providerMeta = { provider: 'local' };
          }
          
          // Adicionar resposta da Aura
          const auraMsg: AuraChatMessage = {
            id: uuidv4(),
            tipo: 'aura',
            texto: respostaTexto,
            timestamp: new Date(),
            dados: {
              providerMeta
            }
          };
          addMensagem(auraMsg);
          
          // Atualizar histórico do contexto (limitado a 20 mensagens)
          updateContexto({
            historico: [
              ...contexto.historico,
              { role: 'user' as const, content: texto },
              { role: 'assistant' as const, content: respostaTexto }
            ].slice(-20),
            ultimoTopico: detectarIntencao(texto) !== 'fallback' 
              ? detectarIntencao(texto) 
              : contexto.ultimoTopico
          });
          
        } catch (error) {
          // Erro ao enviar mensagem - já tratado pelo estado de carregamento
          
          // Adicionar mensagem de erro
          const errorMsg: AuraChatMessage = {
            id: uuidv4(),
            tipo: 'aura',
            texto: "Desculpe, tive um problema ao processar sua mensagem. Pode tentar novamente?",
            timestamp: new Date(),
            isError: true
          };
          addMensagem(errorMsg);
        } finally {
          setIsLoading(false);
        }
      }
    }),
    {
      name: 'auris-aura-storage',
      partialize: (state) => ({
        mensagens: state.mensagens,
        contexto: state.contexto
      })
    }
  )
);

export default useAuraStore;
