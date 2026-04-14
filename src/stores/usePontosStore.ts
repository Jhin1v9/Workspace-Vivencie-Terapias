import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PontoAuricular } from '@/types';
import { pontosNeurofisiologicos } from '@/mocks/pontosNeurofisiologicos';

interface PontosState {
  pontos: PontoAuricular[];
  pontosSelecionados: PontoAuricular[];
  pontoHover: PontoAuricular | null;
  mostrarVerso: boolean;
  
  // Actions
  setPontos: (pontos: PontoAuricular[]) => void;
  selecionarPonto: (ponto: PontoAuricular) => void;
  removerPonto: (pontoId: string) => void;
  limparSelecao: () => void;
  setPontoHover: (ponto: PontoAuricular | null) => void;
  setMostrarVerso: (mostrar: boolean) => void;
  getPontoById: (id: string) => PontoAuricular | undefined;
  getPontoByCodigo: (codigo: string) => PontoAuricular | undefined;
  getPontosByRegiao: (regiao: PontoAuricular['regiao']) => PontoAuricular[];

  getPontosEstrela: () => PontoAuricular[];
  getPontosByNome: (nome: string) => PontoAuricular[];
  adicionarPontoAProtocolo: (ponto: PontoAuricular) => void;
  removerPontoDoProtocolo: (pontoId: string) => void;
}

export const usePontosStore = create<PontosState>()(
  persist(
    (set, get) => ({
      // Estado inicial com dados neurofisiológicos completos
      pontos: pontosNeurofisiologicos,
      pontosSelecionados: [],
      pontoHover: null,
      mostrarVerso: false,

      setPontos: (pontos) => set({ pontos }),

      selecionarPonto: (ponto) => set((state) => {
        const jaSelecionado = state.pontosSelecionados.find((p) => p.id === ponto.id);
        if (jaSelecionado) {
          return { pontosSelecionados: state.pontosSelecionados.filter((p) => p.id !== ponto.id) };
        }
        return { pontosSelecionados: [...state.pontosSelecionados, ponto] };
      }),

      removerPonto: (pontoId) => set((state) => ({
        pontosSelecionados: state.pontosSelecionados.filter((p) => p.id !== pontoId),
      })),

      limparSelecao: () => set({ pontosSelecionados: [] }),

      setPontoHover: (ponto) => set({ pontoHover: ponto }),

      setMostrarVerso: (mostrar) => set({ mostrarVerso: mostrar }),

      getPontoById: (id) => {
        return get().pontos.find((p) => p.id === id);
      },

      getPontoByCodigo: (codigo) => {
        return get().pontos.find((p) => p.codigo === codigo);
      },

      getPontosByRegiao: (regiao) => {
        return get().pontos.filter((p) => p.regiao === regiao);
      },

      getPontosEstrela: () => {
        return get().pontos.filter((p) => p.prioridade === 'estrela');
      },

      getPontosByNome: (nome) => {
        const nomeLower = nome.toLowerCase();
        return get().pontos.filter((p) => 
          p.nome_pt.toLowerCase().includes(nomeLower) ||
          p.codigo.toLowerCase().includes(nomeLower)
        );
      },

      adicionarPontoAProtocolo: (ponto) => set((state) => {
        const jaSelecionado = state.pontosSelecionados.find((p) => p.id === ponto.id);
        if (!jaSelecionado) {
          return { pontosSelecionados: [...state.pontosSelecionados, ponto] };
        }
        return state;
      }),

      removerPontoDoProtocolo: (pontoId) => set((state) => ({
        pontosSelecionados: state.pontosSelecionados.filter((p) => p.id !== pontoId),
      })),
    }),
    {
      name: 'auris-pontos-storage',
    }
  )
);
