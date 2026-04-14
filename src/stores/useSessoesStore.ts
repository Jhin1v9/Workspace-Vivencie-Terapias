import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Sessao } from '@/types';
import { sessoesMock } from '@/mocks/dados';

interface SessoesState {
  sessoes: Sessao[];
  sessaoAtual: Sessao | null;
  
  // Actions
  setSessoes: (sessoes: Sessao[]) => void;
  addSessao: (sessao: Sessao) => void;
  updateSessao: (id: string, data: Partial<Sessao>) => void;
  deleteSessao: (id: string) => void;
  getSessoesByPaciente: (pacienteId: string) => Sessao[];
  getUltimaSessao: (pacienteId: string) => Sessao | null;
  getNextNumeroSessao: (pacienteId: string) => number;
}

export const useSessoesStore = create<SessoesState>()(
  persist(
    (set, get) => ({
      // Estado inicial com dados mockados
      sessoes: sessoesMock,
      sessaoAtual: null,

      setSessoes: (sessoes) => set({ sessoes }),

      addSessao: (sessao) => set((state) => ({
        sessoes: [...state.sessoes, sessao],
      })),

      updateSessao: (id, data) => set((state) => ({
        sessoes: state.sessoes.map((s) =>
          s.id === id ? { ...s, ...data } : s
        ),
      })),

      deleteSessao: (id) => set((state) => ({
        sessoes: state.sessoes.filter((s) => s.id !== id),
      })),

      getSessoesByPaciente: (pacienteId) => {
        return get().sessoes
          .filter((s) => s.paciente_id === pacienteId)
          .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
      },

      getUltimaSessao: (pacienteId) => {
        const sessoesPaciente = get().getSessoesByPaciente(pacienteId);
        return sessoesPaciente.length > 0 
          ? sessoesPaciente[sessoesPaciente.length - 1] 
          : null;
      },

      getNextNumeroSessao: (pacienteId) => {
        const sessoesPaciente = get().getSessoesByPaciente(pacienteId);
        return sessoesPaciente.length + 1;
      },
    }),
    {
      name: 'auris-sessoes-storage',
    }
  )
);
