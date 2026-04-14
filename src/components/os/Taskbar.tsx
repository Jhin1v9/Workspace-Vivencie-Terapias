import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Wifi, 
  Volume2, 
  Battery,
  Search,
  Moon,
  Sun,
  Wind,
  Droplets,
  Mountain,
  Sparkles,
  Stethoscope
} from 'lucide-react';
import { useConfigStore, useOSStore } from '@/stores';
import { format } from 'date-fns';

// Cálculo simplificado da fase lunar
const getFaseLunar = (date: Date): { nome: string; icon: React.ReactNode } => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // Algoritmo simplificado
  const f = Math.floor((month + 9) % 12);
  const g = Math.floor((day + 30 * f) % 30);
  
  const phase = (g + 2) % 30;
  
  if (phase < 2) return { nome: 'Lua Nova', icon: <Moon className="w-4 h-4" /> };
  if (phase < 8) return { nome: 'Lua Crescente', icon: <Moon className="w-4 h-4" /> };
  if (phase < 15) return { nome: 'Lua Cheia', icon: <Sun className="w-4 h-4" /> };
  if (phase < 22) return { nome: 'Lua Minguante', icon: <Moon className="w-4 h-4" /> };
  return { nome: 'Lua Nova', icon: <Moon className="w-4 h-4" /> };
};

const wallpaperIcons: Record<string, React.ReactNode> = {
  akasha: <Sparkles className="w-4 h-4" />,
  floresta: <Wind className="w-4 h-4" />,
  agua: <Droplets className="w-4 h-4" />,
  terra: <Mountain className="w-4 h-4" />,
  cosmos: <Sparkles className="w-4 h-4" />,
  clinico: <Stethoscope className="w-4 h-4" />,
};

export const Taskbar: React.FC = () => {
  const [horaAtual, setHoraAtual] = useState(new Date());
  const { wallpaper_atual, terapeuta_nome, modo_reiki_ativo } = useConfigStore();
  const { janelas, janelaAtiva, focarJanela } = useOSStore();

  useEffect(() => {
    const timer = setInterval(() => {
      setHoraAtual(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const faseLunar = getFaseLunar(horaAtual);
  const isClinico = wallpaper_atual === 'clinico';

  return (
    <motion.div
      className={`fixed top-4 left-4 right-4 z-50 ${
        isClinico ? 'bg-white/80 border-slate-200' : 'glass'
      } rounded-2xl px-4 py-2`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
    >
      <div className="flex items-center justify-between">
        {/* Logo e info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className={`font-display text-lg font-bold tracking-wider ${
              isClinico ? 'text-slate-800' : 'text-white'
            }`}>
              AURIS
            </span>
            {modo_reiki_ativo && (
              <span className="badge-indigo text-xs">Reiki</span>
            )}
          </div>
          
          {/* Janelas abertas (minimizadas) */}
          <div className="flex items-center gap-1 ml-4">
            {janelas.filter(j => j.minimizada).map((janela) => (
              <motion.button
                key={janela.id}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                  janelaAtiva === janela.id
                    ? 'bg-white/20 text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
                onClick={() => focarJanela(janela.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {janela.titulo}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Search bar */}
        <div className="flex-1 max-w-md mx-4">
          <div className={`relative ${isClinico ? 'bg-slate-100' : 'bg-white/5'} rounded-xl`}>
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
              isClinico ? 'text-slate-400' : 'text-white/40'
            }`} />
            <input
              type="text"
              placeholder="O que deseja fazer..."
              className={`w-full pl-10 pr-4 py-2 rounded-xl text-sm bg-transparent ${
                isClinico 
                  ? 'text-slate-700 placeholder:text-slate-400' 
                  : 'text-white placeholder:text-white/40'
              } focus:outline-none`}
            />
          </div>
        </div>

        {/* Status icons */}
        <div className="flex items-center gap-4">
          {/* Fase lunar */}
          <div className={`flex items-center gap-1 ${isClinico ? 'text-slate-600' : 'text-white/60'}`}>
            {faseLunar.icon}
            <span className="text-xs hidden lg:inline">{faseLunar.nome}</span>
          </div>

          {/* Wallpaper indicator */}
          <div className={`flex items-center gap-1 ${isClinico ? 'text-slate-600' : 'text-white/60'}`}>
            {wallpaperIcons[wallpaper_atual] || <Sparkles className="w-4 h-4" />}
          </div>

          {/* System icons */}
          <div className={`flex items-center gap-2 ${isClinico ? 'text-slate-600' : 'text-white/60'}`}>
            <Wifi className="w-4 h-4" />
            <Volume2 className="w-4 h-4" />
            <Battery className="w-4 h-4" />
          </div>

          {/* Clock */}
          <div className={`text-sm font-mono ${isClinico ? 'text-slate-700' : 'text-white'}`}>
            {format(horaAtual, 'HH:mm')}
          </div>

          {/* Avatar */}
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
            isClinico 
              ? 'bg-slate-200 text-slate-700' 
              : 'bg-auris-sage/20 text-auris-sage'
          }`}>
            {terapeuta_nome.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
