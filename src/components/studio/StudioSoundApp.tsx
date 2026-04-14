import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Music,
  Upload,
  Trash2,
  ListMusic,
  X,
  Waves,
  Info,
  Sparkles
} from 'lucide-react';
import { useAudioStore } from '@/stores';

interface Musica {
  id: string;
  nome: string;
  artista: string;
  url: string;
  duracao: number;
  tipo: 'upload' | 'solfeggio';
  frequencia?: string;
  descricao?: string;
  beneficios?: string[];
}

// Frequências Solfeggio com descrições detalhadas
const FREQUENCIAS_SOLFeggio: Musica[] = [
  { 
    id: 'sol-174', 
    nome: '174 Hz - Fundação', 
    artista: 'Solfeggio Frequencies', 
    url: 'synth://174', 
    duracao: 600, 
    tipo: 'solfeggio', 
    frequencia: '174 Hz',
    descricao: 'Frequência fundamental para alívio da dor e relaxamento profundo.',
    beneficios: ['Alívio da dor', 'Relaxamento muscular', 'Segurança emocional']
  },
  { 
    id: 'sol-285', 
    nome: '285 Hz - Segurança', 
    artista: 'Solfeggio Frequencies', 
    url: 'synth://285', 
    duracao: 600, 
    tipo: 'solfeggio', 
    frequencia: '285 Hz',
    descricao: 'Promove cura de tecidos e regeneração celular.',
    beneficios: ['Regeneração celular', 'Cura de tecidos', 'Rejuvenescimento']
  },
  { 
    id: 'sol-396', 
    nome: '396 Hz - Libertação', 
    artista: 'Solfeggio Frequencies', 
    url: 'synth://396', 
    duracao: 600, 
    tipo: 'solfeggio', 
    frequencia: '396 Hz',
    descricao: 'Liberta de medos, culpas e padrões negativos.',
    beneficios: ['Libertação de medos', 'Eliminação de culpa', 'Transformação negativa em positiva']
  },
  { 
    id: 'sol-417', 
    nome: '417 Hz - Mudança', 
    artista: 'Solfeggio Frequencies', 
    url: 'synth://417', 
    duracao: 600, 
    tipo: 'solfeggio', 
    frequencia: '417 Hz',
    descricao: 'Facilita mudanças e quebra padrões negativos.',
    beneficios: ['Facilita mudanças', 'Remove energia negativa', 'Desbloqueio criativo']
  },
  { 
    id: 'sol-528', 
    nome: '528 Hz - Transformação', 
    artista: 'Solfeggio Frequencies', 
    url: 'synth://528', 
    duracao: 600, 
    tipo: 'solfeggio', 
    frequencia: '528 Hz',
    descricao: 'Frequência do amor e milagres. Repara DNA.',
    beneficios: ['Reparação do DNA', 'Amor incondicional', 'Clareza mental', 'Redução de estresse']
  },
  { 
    id: 'sol-639', 
    nome: '639 Hz - Conexão', 
    artista: 'Solfeggio Frequencies', 
    url: 'synth://639', 
    duracao: 600, 
    tipo: 'solfeggio', 
    frequencia: '639 Hz',
    descricao: 'Harmoniza relacionamentos e conexões interpessoais.',
    beneficios: ['Harmoniza relacionamentos', 'Melhora comunicação', 'Conexão com outros']
  },
  { 
    id: 'sol-741', 
    nome: '741 Hz - Expressão', 
    artista: 'Solfeggio Frequencies', 
    url: 'synth://741', 
    duracao: 600, 
    tipo: 'solfeggio', 
    frequencia: '741 Hz',
    descricao: 'Desperta intuição e expressão autêntica.',
    beneficios: ['Desperta intuição', 'Expressão autêntica', 'Limpeza energética', 'Clareza']
  },
  { 
    id: 'sol-852', 
    nome: '852 Hz - Intuição', 
    artista: 'Solfeggio Frequencies', 
    url: 'synth://852', 
    duracao: 600, 
    tipo: 'solfeggio', 
    frequencia: '852 Hz',
    descricao: 'Desperta intuição e retorna à ordem espiritual.',
    beneficios: ['Despertar espiritual', 'Intuição aguçada', 'Consciência superior']
  },
  { 
    id: 'sol-963', 
    nome: '963 Hz - Iluminação', 
    artista: 'Solfeggio Frequencies', 
    url: 'synth://963', 
    duracao: 600, 
    tipo: 'solfeggio', 
    frequencia: '963 Hz',
    descricao: 'Conexão com o divino e iluminação espiritual.',
    beneficios: ['Iluminação espiritual', 'Conexão divina', 'Estado de presença', 'Unidade']
  },
];

// Gerador de áudio Solfeggio usando Web Audio API
class SolfeggioGenerator {
  private audioContext: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  play(frequency: number, volume: number = 0.5) {
    if (!this.audioContext) return;
    
    // Resume context if suspended
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    // Stop any existing sound
    this.stop();

    // Create oscillator
    this.oscillator = this.audioContext.createOscillator();
    this.gainNode = this.audioContext.createGain();

    this.oscillator.type = 'sine';
    this.oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

    // Add subtle harmonics for richer sound
    const harmonicGain = this.audioContext.createGain();
    harmonicGain.gain.value = 0.1;

    // Smooth fade in
    this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    this.gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.5);

    // Connect nodes
    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);

    this.oscillator.start();
  }

  stop() {
    if (this.oscillator && this.audioContext) {
      // Smooth fade out
      this.gainNode?.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.3);
      
      setTimeout(() => {
        this.oscillator?.stop();
        this.oscillator?.disconnect();
        this.gainNode?.disconnect();
        this.oscillator = null;
        this.gainNode = null;
      }, 300);
    }
  }

  setVolume(volume: number) {
    if (this.gainNode && this.audioContext) {
      this.gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    }
  }
}

// Singleton instance
const solfeggioGenerator = new SolfeggioGenerator();

// Player flutuante global
export const AudioPlayerFloat: React.FC = () => {
  const { 
    musicaAtual, 
    isPlaying, 
    volume, 
    progress, 
    duration,
    togglePlay, 
    setVolume, 
    nextTrack, 
    prevTrack,
    stop
  } = useAudioStore();
  
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(!!musicaAtual);
  }, [musicaAtual]);

  if (!isVisible || !musicaAtual) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="glass rounded-2xl p-3 shadow-2xl border border-white/10 min-w-[400px]">
        <div className="flex items-center gap-4">
          {/* Capa/Ícone */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-auris-indigo to-auris-sage flex items-center justify-center flex-shrink-0">
            <Music className="w-6 h-6 text-white" />
          </div>
          
          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium text-sm truncate">{musicaAtual.nome}</p>
            <p className="text-white/50 text-xs truncate">{musicaAtual.artista}</p>
          </div>
          
          {/* Controles */}
          <div className="flex items-center gap-2">
            <motion.button
              onClick={prevTrack}
              className="p-2 rounded-lg hover:bg-white/10 text-white/70"
              whileTap={{ scale: 0.9 }}
            >
              <SkipBack className="w-4 h-4" />
            </motion.button>
            
            <motion.button
              onClick={togglePlay}
              className="p-3 rounded-xl bg-auris-sage text-white"
              whileTap={{ scale: 0.9 }}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </motion.button>
            
            <motion.button
              onClick={nextTrack}
              className="p-2 rounded-lg hover:bg-white/10 text-white/70"
              whileTap={{ scale: 0.9 }}
            >
              <SkipForward className="w-4 h-4" />
            </motion.button>
          </div>
          
          {/* Volume */}
          <div className="flex items-center gap-2">
            <button onClick={() => setVolume(volume === 0 ? 0.7 : 0)} className="text-white/50">
              {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-20 accent-auris-sage"
            />
          </div>
          
          {/* Fechar */}
          <button onClick={stop} className="p-2 rounded-lg hover:bg-white/10 text-white/50">
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs text-white/40">{formatTime(progress)}</span>
          <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-auris-sage rounded-full transition-all"
              style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }}
            />
          </div>
          <span className="text-xs text-white/40">{formatTime(duration)}</span>
        </div>
      </div>
    </motion.div>
  );
};

export const StudioSoundApp: React.FC = () => {
  const [musicas, setMusicas] = useState<Musica[]>([]);
  const [abaAtiva, setAbaAtiva] = useState<'minhas' | 'solfeggio'>('minhas');
  const [playlist, setPlaylist] = useState<Musica[]>([]);
  const [mostrarPlaylist, setMostrarPlaylist] = useState(false);
  const [selectedSolfeggio, setSelectedSolfeggio] = useState<Musica | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { 
    musicaAtual, 
    isPlaying, 
    setMusicaAtual,
    setIsPlaying
  } = useAudioStore();

  // Carregar músicas do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('auris-musicas');
    if (saved) {
      setMusicas(JSON.parse(saved));
    }
  }, []);

  // Salvar músicas no localStorage
  useEffect(() => {
    localStorage.setItem('auris-musicas', JSON.stringify(musicas));
  }, [musicas]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('audio/')) {
        const url = URL.createObjectURL(file);
        const novaMusica: Musica = {
          id: Date.now().toString() + Math.random(),
          nome: file.name.replace(/\.[^/.]+$/, ''),
          artista: 'Música Pessoal',
          url,
          duracao: 0,
          tipo: 'upload'
        };
        setMusicas(prev => [...prev, novaMusica]);
      }
    });
  };

  const excluirMusica = (id: string) => {
    setMusicas(prev => prev.filter(m => m.id !== id));
    setPlaylist(prev => prev.filter(m => m.id !== id));
  };

  const tocarMusica = useCallback((musica: Musica) => {
    // Handle Solfeggio frequencies
    if (musica.tipo === 'solfeggio' && musica.url.startsWith('synth://')) {
      const freq = parseInt(musica.url.replace('synth://', ''));
      if (!isNaN(freq)) {
        if (musicaAtual?.id === musica.id && isPlaying) {
          // Pause
          solfeggioGenerator.stop();
          setIsPlaying(false);
        } else {
          // Play
          solfeggioGenerator.play(freq, 0.3);
          setMusicaAtual(musica);
          setIsPlaying(true);
        }
        return;
      }
    }
    
    // Handle uploaded music
    setMusicaAtual(musica);
    setIsPlaying(true);
  }, [musicaAtual, isPlaying, setMusicaAtual, setIsPlaying]);

  // Stop Solfeggio when switching tabs or unmounting
  useEffect(() => {
    return () => {
      solfeggioGenerator.stop();
    };
  }, []);

  const adicionarAPlaylist = (musica: Musica) => {
    if (!playlist.find(m => m.id === musica.id)) {
      setPlaylist(prev => [...prev, musica]);
    }
  };

  const removerDaPlaylist = (id: string) => {
    setPlaylist(prev => prev.filter(m => m.id !== id));
  };

  const musicasExibidas = abaAtiva === 'minhas' ? musicas : FREQUENCIAS_SOLFeggio;

  return (
    <div className="flex h-full">
      {/* Sidebar - Abas */}
      <div className="w-64 border-r border-white/10 flex flex-col">
        <div className="p-4 border-b border-white/10">
          <h2 className="text-lg font-medium text-white flex items-center gap-2">
            <Music className="w-5 h-5 text-auris-sage" />
            Studio Sonoro
          </h2>
        </div>
        
        <div className="p-2">
          <button
            onClick={() => setAbaAtiva('minhas')}
            className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all ${
              abaAtiva === 'minhas' ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5'
            }`}
          >
            <Upload className="w-5 h-5" />
            <span>Minhas Músicas</span>
            <span className="ml-auto text-xs bg-white/10 px-2 py-0.5 rounded-full">
              {musicas.length}
            </span>
          </button>
          
          <button
            onClick={() => setAbaAtiva('solfeggio')}
            className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all mt-1 ${
              abaAtiva === 'solfeggio' ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5'
            }`}
          >
            <Waves className="w-5 h-5" />
            <span>Frequências Solfeggio</span>
            <span className="ml-auto text-xs bg-white/10 px-2 py-0.5 rounded-full">
              {FREQUENCIAS_SOLFeggio.length}
            </span>
          </button>
        </div>

        {abaAtiva === 'minhas' && (
          <div className="p-4 mt-auto border-t border-white/10">
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
            <motion.button
              onClick={() => fileInputRef.current?.click()}
              className="w-full btn-primary flex items-center justify-center gap-2"
              whileTap={{ scale: 0.98 }}
            >
              <Upload className="w-4 h-4" />
              Adicionar Músicas
            </motion.button>
          </div>
        )}
      </div>

      {/* Lista de músicas */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-white font-medium">
            {abaAtiva === 'minhas' ? 'Minhas Músicas' : 'Frequências Solfeggio'}
          </h3>
          <button
            onClick={() => setMostrarPlaylist(!mostrarPlaylist)}
            className="btn-glass flex items-center gap-2"
          >
            <ListMusic className="w-4 h-4" />
            Playlist ({playlist.length})
          </button>
        </div>

        <div className="flex-1 overflow-auto scrollbar-thin p-4">
          <div className="space-y-2">
            {musicasExibidas.map((musica) => (
              <motion.div
                key={musica.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl flex items-center gap-4 transition-all ${
                  musicaAtual?.id === musica.id 
                    ? 'bg-auris-sage/20 border border-auris-sage/50' 
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                {/* Play button */}
                <motion.button
                  onClick={() => tocarMusica(musica)}
                  className="w-12 h-12 rounded-full bg-auris-sage flex items-center justify-center text-white flex-shrink-0"
                  whileTap={{ scale: 0.9 }}
                >
                  {musicaAtual?.id === musica.id && isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5 ml-0.5" />
                  )}
                </motion.button>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium">{musica.nome}</p>
                    {musica.tipo === 'solfeggio' && (
                      <span className="px-2 py-0.5 rounded-full bg-auris-amber/20 text-auris-amber text-xs">
                        {musica.frequencia}
                      </span>
                    )}
                  </div>
                  <p className="text-white/50 text-sm">{musica.artista}</p>
                  {musica.tipo === 'solfeggio' && musica.descricao && (
                    <p className="text-white/40 text-xs mt-1 line-clamp-1">{musica.descricao}</p>
                  )}
                </div>

                {/* Ações */}
                <div className="flex items-center gap-1">
                  {musica.tipo === 'solfeggio' && (
                    <button
                      onClick={() => {
                        setSelectedSolfeggio(musica);
                        setShowInfoModal(true);
                      }}
                      className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-auris-indigo"
                      title="Ver informações"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => adicionarAPlaylist(musica)}
                    className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white"
                    title="Adicionar à playlist"
                  >
                    <ListMusic className="w-4 h-4" />
                  </button>
                  
                  {musica.tipo === 'upload' && (
                    <button
                      onClick={() => excluirMusica(musica.id)}
                      className="p-2 rounded-lg hover:bg-red-500/20 text-white/50 hover:text-red-400"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}

            {musicasExibidas.length === 0 && (
              <div className="text-center py-12 text-white/40">
                <Music className="w-16 h-16 mx-auto mb-4" />
                <p>Nenhuma música encontrada</p>
                {abaAtiva === 'minhas' && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-4 text-auris-sage hover:underline"
                  >
                    Adicionar músicas
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Playlist Sidebar */}
      <AnimatePresence>
        {mostrarPlaylist && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-l border-white/10 bg-white/5 overflow-hidden"
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-white font-medium flex items-center gap-2">
                <ListMusic className="w-4 h-4" /> Playlist
              </h3>
              <button onClick={() => setMostrarPlaylist(false)}>
                <X className="w-4 h-4 text-white/50" />
              </button>
            </div>
            
            <div className="p-2 overflow-auto h-[calc(100%-60px)]">
              {playlist.length === 0 ? (
                <p className="text-white/40 text-center py-8 text-sm">
                  Playlist vazia
                </p>
              ) : (
                playlist.map((musica, index) => (
                  <div
                    key={musica.id}
                    className="p-2 rounded-lg hover:bg-white/5 flex items-center gap-2 group"
                  >
                    <span className="text-white/30 text-sm w-5">{index + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{musica.nome}</p>
                      <p className="text-white/40 text-xs truncate">{musica.artista}</p>
                    </div>
                    <button
                      onClick={() => removerDaPlaylist(musica.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Informações Solfeggio */}
      <AnimatePresence>
        {showInfoModal && selectedSolfeggio && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowInfoModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass max-w-md w-full rounded-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative bg-gradient-to-br from-auris-amber/20 to-auris-sage/20 p-6">
                <button 
                  onClick={() => setShowInfoModal(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/30 text-white/70"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-auris-amber/30 flex items-center justify-center">
                    <Waves className="w-8 h-8 text-auris-amber" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-medium text-white">{selectedSolfeggio.nome}</h2>
                    <p className="text-auris-amber font-mono">{selectedSolfeggio.frequencia}</p>
                  </div>
                </div>
              </div>

              {/* Conteúdo */}
              <div className="p-6 space-y-5">
                {/* Descrição */}
                <div className="bg-white/5 rounded-xl p-4">
                  <h4 className="text-white/60 text-sm mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-auris-amber" /> Sobre esta frequência
                  </h4>
                  <p className="text-white/90 text-sm leading-relaxed">
                    {selectedSolfeggio.descricao}
                  </p>
                </div>

                {/* Benefícios */}
                {selectedSolfeggio.beneficios && (
                  <div>
                    <h4 className="text-white/60 text-sm mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-auris-sage" /> Benefícios
                    </h4>
                    <div className="space-y-2">
                      {selectedSolfeggio.beneficios.map((beneficio, i) => (
                        <div key={i} className="flex items-center gap-2 text-white/80 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-auris-sage" />
                          {beneficio}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ações */}
                <div className="flex gap-3 pt-2">
                  <motion.button
                    className="flex-1 btn-primary flex items-center justify-center gap-2"
                    onClick={() => {
                      tocarMusica(selectedSolfeggio);
                      setShowInfoModal(false);
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {musicaAtual?.id === selectedSolfeggio.id && isPlaying ? (
                      <><Pause className="w-4 h-4" /> Pausar</>
                    ) : (
                      <><Play className="w-4 h-4" /> Tocar Frequência</>
                    )}
                  </motion.button>
                </div>

                {/* Nota sobre geração */}
                <p className="text-white/40 text-xs text-center">
                  Frequência gerada sinteticamente via Web Audio API
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
