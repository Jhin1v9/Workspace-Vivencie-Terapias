import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Paciente } from '@/types';
import { pacientesMock } from '@/mocks/dados';

interface PacientesState {
  pacientes: Paciente[];
  pacienteSelecionado: Paciente | null;
  
  // Actions
  setPacientes: (pacientes: Paciente[]) => void;
  addPaciente: (paciente: Paciente) => void;
  updatePaciente: (id: string, data: Partial<Paciente>) => void;
  deletePaciente: (id: string) => void;
  selecionarPaciente: (paciente: Paciente | null) => void;
  getPacienteById: (id: string) => Paciente | undefined;
  getNextCodigoAuris: () => string;
  exportarDados: () => string;
  importarDados: (json: string) => boolean;
}

export const usePacientesStore = create<PacientesState>()(
  persist(
    (set, get) => ({
      // Estado inicial com dados mockados
      pacientes: pacientesMock,
      pacienteSelecionado: null,

      setPacientes: (pacientes) => set({ pacientes }),

      addPaciente: (paciente) => set((state) => ({
        pacientes: [...state.pacientes, paciente],
      })),

      updatePaciente: (id, data) => set((state) => ({
        pacientes: state.pacientes.map((p) =>
          p.id === id ? { ...p, ...data, updated_at: new Date().toISOString() } : p
        ),
      })),

      deletePaciente: (id) => set((state) => ({
        pacientes: state.pacientes.filter((p) => p.id !== id),
      })),

      selecionarPaciente: (paciente) => set({ pacienteSelecionado: paciente }),

      getPacienteById: (id) => {
        return get().pacientes.find((p) => p.id === id);
      },

      getNextCodigoAuris: () => {
        const ano = new Date().getFullYear();
        const pacientesDoAno = get().pacientes.filter((p) =>
          p.codigo_auris.startsWith(`AUR-${ano}`)
        );
        const nextNum = pacientesDoAno.length + 1;
        return `AUR-${ano}-${String(nextNum).padStart(4, '0')}`;
      },
      
      exportarDados: () => {
        const dados = {
          pacientes: get().pacientes,
          timestamp: new Date().toISOString(),
        };
        return JSON.stringify(dados, null, 2);
      },
      
      importarDados: (json) => {
        try {
          const dados = JSON.parse(json);
          if (dados.pacientes && Array.isArray(dados.pacientes)) {
            set({ pacientes: dados.pacientes });
            return true;
          }
          return false;
        } catch (e) {
          console.error('Erro ao importar pacientes:', e);
          return false;
        }
      },
    }),
    {
      name: 'auris-pacientes-storage',
    }
  )
);
