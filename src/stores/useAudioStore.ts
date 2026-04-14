import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Musica {
  id: string;
  nome: string;
  artista: string;
  url: string;
  duracao: number;
  tipo: 'upload' | 'solfeggio';
  frequencia?: string;
}

interface AudioState {
  // Player state
  musicaAtual: Musica | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  playlist: Musica[];
  currentIndex: number;
  
  // Timer
  timerAtivo: boolean;
  tempoRestanteTimer: number;
  
  // Actions
  setMusicaAtual: (musica: Musica | null) => void;
  setIsPlaying: (playing: boolean) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  setPlaylist: (playlist: Musica[]) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  stop: () => void;
  
  // Timer
  iniciarTimer: (minutos: number) => void;
  pararTimer: () => void;
  decrementarTimer: () => void;
}

export const useAudioStore = create<AudioState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      musicaAtual: null,
      isPlaying: false,
      volume: 0.7,
      progress: 0,
      duration: 0,
      playlist: [],
      currentIndex: 0,
      timerAtivo: false,
      tempoRestanteTimer: 0,

      setMusicaAtual: (musica) => set({ 
        musicaAtual: musica,
        progress: 0,
        isPlaying: !!musica 
      }),

      setIsPlaying: (playing) => set({ isPlaying: playing }),

      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

      setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),

      setProgress: (progress) => set({ progress }),

      setDuration: (duration) => set({ duration }),

      setPlaylist: (playlist) => set({ playlist, currentIndex: 0 }),

      nextTrack: () => {
        const { playlist, currentIndex } = get();
        if (playlist.length > 0) {
          const nextIndex = (currentIndex + 1) % playlist.length;
          set({ 
            currentIndex: nextIndex,
            musicaAtual: playlist[nextIndex],
            progress: 0,
            isPlaying: true
          });
        }
      },

      prevTrack: () => {
        const { playlist, currentIndex } = get();
        if (playlist.length > 0) {
          const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
          set({ 
            currentIndex: prevIndex,
            musicaAtual: playlist[prevIndex],
            progress: 0,
            isPlaying: true
          });
        }
      },

      stop: () => set({ 
        musicaAtual: null, 
        isPlaying: false, 
        progress: 0,
        currentIndex: 0 
      }),

      iniciarTimer: (minutos) => set({
        timerAtivo: true,
        tempoRestanteTimer: minutos * 60,
      }),

      pararTimer: () => set({
        timerAtivo: false,
        tempoRestanteTimer: 0,
      }),

      decrementarTimer: () => set((state) => {
        if (state.tempoRestanteTimer > 0) {
          return { tempoRestanteTimer: state.tempoRestanteTimer - 1 };
        }
        return { timerAtivo: false, tempoRestanteTimer: 0 };
      }),
    }),
    {
      name: 'auris-audio-storage',
      partialize: (state) => ({ 
        volume: state.volume,
        playlist: state.playlist 
      }),
    }
  )
);
