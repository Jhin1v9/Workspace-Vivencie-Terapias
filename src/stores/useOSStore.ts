import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { JanelaOS } from '@/types';

interface OSState {
  janelas: JanelaOS[];
  janelaAtiva: string | null;
  zIndexCounter: number;
  
  // Actions
  abrirJanela: (app: JanelaOS['app'], titulo: string) => string;
  fecharJanela: (id: string) => void;
  minimizarJanela: (id: string) => void;
  maximizarJanela: (id: string) => void;
  restaurarJanela: (id: string) => void;
  focarJanela: (id: string) => void;
  atualizarPosicao: (id: string, posicao: { x: number; y: number }) => void;
  atualizarTamanho: (id: string, tamanho: { width: number; height: number }) => void;
  getJanelaByApp: (app: JanelaOS['app']) => JanelaOS | undefined;
}

const gerarId = () => Math.random().toString(36).substr(2, 9);

const posicoesIniciais: Record<JanelaOS['app'], { x: number; y: number }> = {
  clinica: { x: 100, y: 80 },
  mapa: { x: 150, y: 100 },
  studio: { x: 200, y: 120 },
  config: { x: 250, y: 140 },
  aura: { x: 300, y: 160 },
  protocolos: { x: 350, y: 180 },
  knowledge: { x: 400, y: 200 },
  sessao: { x: 180, y: 90 },
  calendario: { x: 120, y: 70 },
  financas: { x: 200, y: 100 },
  browser: { x: 100, y: 60 },
  notas: { x: 130, y: 80 },
};

const getTamanhoInicial = (app: JanelaOS['app']) => {
  // Valores padrão seguros para SSR e casos onde window não está disponível
  const w = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const h = typeof window !== 'undefined' ? window.innerHeight : 1080;
  
  const tamanhos: Record<JanelaOS['app'], { width: number; height: number }> = {
    clinica: { width: Math.max(800, Math.min(1100, w * 0.85)), height: Math.max(600, Math.min(800, h * 0.8)) },
    mapa: { width: Math.max(900, Math.min(1200, w * 0.9)), height: Math.max(650, Math.min(850, h * 0.85)) },
    studio: { width: Math.max(500, Math.min(600, w * 0.5)), height: Math.max(550, Math.min(700, h * 0.75)) },
    config: { width: Math.max(500, Math.min(700, w * 0.5)), height: Math.max(500, Math.min(600, h * 0.65)) },
    aura: { width: Math.max(450, Math.min(500, w * 0.4)), height: Math.max(600, Math.min(700, h * 0.75)) },
    protocolos: { width: Math.max(750, Math.min(900, w * 0.7)), height: Math.max(600, Math.min(750, h * 0.75)) },
    knowledge: { width: Math.max(800, Math.min(1000, w * 0.8)), height: Math.max(650, Math.min(800, h * 0.8)) },
    sessao: { width: Math.max(800, Math.min(900, w * 0.75)), height: Math.max(650, Math.min(800, h * 0.8)) },
    calendario: { width: Math.max(800, Math.min(1100, w * 0.85)), height: Math.max(600, Math.min(750, h * 0.8)) },
    financas: { width: Math.max(900, Math.min(1200, w * 0.9)), height: Math.max(650, Math.min(800, h * 0.85)) },
    browser: { width: Math.max(900, Math.min(1200, w * 0.9)), height: Math.max(650, Math.min(850, h * 0.85)) },
    notas: { width: Math.max(1000, Math.min(1400, w * 0.95)), height: Math.max(700, Math.min(900, h * 0.9)) },
  };
  
  return tamanhos[app];
};

export const useOSStore = create<OSState>()(
  persist(
    (set, get) => ({
      janelas: [],
      janelaAtiva: null,
      zIndexCounter: 100,

      abrirJanela: (app, titulo) => {
        const id = gerarId();
        const novaJanela: JanelaOS = {
          id,
          app,
          titulo,
          posicao: posicoesIniciais[app],
          tamanho: getTamanhoInicial(app),
          minimizada: false,
          maximizada: false,
          focada: true,
        };

        set((state) => ({
          janelas: [...state.janelas.map((j) => ({ ...j, focada: false })), novaJanela],
          janelaAtiva: id,
          zIndexCounter: state.zIndexCounter + 1,
        }));

        return id;
      },

      fecharJanela: (id) => set((state) => ({
        janelas: state.janelas.filter((j) => j.id !== id),
        janelaAtiva: state.janelaAtiva === id ? null : state.janelaAtiva,
      })),

      minimizarJanela: (id) => set((state) => ({
        janelas: state.janelas.map((j) =>
          j.id === id ? { ...j, minimizada: true, focada: false } : j
        ),
        janelaAtiva: state.janelaAtiva === id ? null : state.janelaAtiva,
      })),

      maximizarJanela: (id) => set((state) => ({
        janelas: state.janelas.map((j) =>
          j.id === id ? { ...j, maximizada: true } : j
        ),
      })),

      restaurarJanela: (id) => set((state) => ({
        janelas: state.janelas.map((j) =>
          j.id === id ? { ...j, maximizada: false, minimizada: false } : j
        ),
      })),

      focarJanela: (id) => set((state) => ({
        janelas: state.janelas.map((j) => ({
          ...j,
          focada: j.id === id,
          minimizada: j.id === id ? false : j.minimizada,
        })),
        janelaAtiva: id,
        zIndexCounter: state.zIndexCounter + 1,
      })),

      atualizarPosicao: (id, posicao) => set((state) => ({
        janelas: state.janelas.map((j) =>
          j.id === id ? { ...j, posicao } : j
        ),
      })),

      atualizarTamanho: (id, tamanho) => set((state) => ({
        janelas: state.janelas.map((j) =>
          j.id === id ? { ...j, tamanho } : j
        ),
      })),

      getJanelaByApp: (app) => {
        return get().janelas.find((j) => j.app === app);
      },
    }),
    {
      name: 'auris-os-storage',
    }
  )
);
