import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Ear, 
  Activity, 
  Settings, 
  Sparkles, 
  BookOpen,
  Music,
  CalendarDays,
  DollarSign,
  Globe,
  StickyNote
} from 'lucide-react';
import { useConfigStore, useOSStore } from '@/stores';
import type { JanelaOS } from '@/types';

const wallpapers: Record<string, string> = {
  akasha: 'bg-wallpaper-akasha',
  floresta: 'bg-wallpaper-floresta',
  agua: 'bg-wallpaper-agua',
  terra: 'bg-wallpaper-terra',
  cosmos: 'bg-wallpaper-cosmos',
  clinico: 'bg-wallpaper-clinico',
};

type WallpaperMode = 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
type IconBgStyle = 'glass' | 'solid' | 'gradient' | 'adaptive';

interface IconeDesktop {
  id: string;
  label: string;
  icone: React.ElementType;
  app: JanelaOS['app'];
  cor: string;
}

const icones: IconeDesktop[] = [
  { id: 'clinica', label: 'Prontuários', icone: Heart, app: 'clinica', cor: 'text-auris-rose' },
  { id: 'mapa', label: 'Mapa Auricular', icone: Ear, app: 'mapa', cor: 'text-auris-sage' },
  { id: 'sessao', label: 'Sessão', icone: Activity, app: 'sessao', cor: 'text-auris-indigo' },
  { id: 'calendario', label: 'Agenda', icone: CalendarDays, app: 'calendario', cor: 'text-auris-purple' },
  { id: 'financas', label: 'Finanças', icone: DollarSign, app: 'financas', cor: 'text-emerald-400' },
  { id: 'browser', label: 'Navegador', icone: Globe, app: 'browser', cor: 'text-blue-400' },
  { id: 'notas', label: 'Notas', icone: StickyNote, app: 'notas', cor: 'text-amber-400' },
  { id: 'studio', label: 'Studio Sonoro', icone: Music, app: 'studio', cor: 'text-auris-amber' },
  { id: 'protocolos', label: 'Protocolos', icone: BookOpen, app: 'protocolos', cor: 'text-auris-teal' },
  { id: 'knowledge', label: 'Biblioteca', icone: BookOpen, app: 'knowledge', cor: 'text-auris-lavender' },
  { id: 'aura', label: 'Aura AI', icone: Sparkles, app: 'aura', cor: 'text-auris-gold' },
  { id: 'config', label: 'Configurações', icone: Settings, app: 'config', cor: 'text-white' },
];

// Detecta se o wallpaper é claro ou escuro baseado na escolha
const isLightWallpaper = (wallpaper: string): boolean => {
  const lightWallpapers = ['clinico', 'cosmos'];
  return lightWallpapers.includes(wallpaper);
};

export const Desktop: React.FC = () => {
  const { wallpaper_atual } = useConfigStore();
  const { janelas, abrirJanela, getJanelaByApp } = useOSStore();
  
  // Ícones dinâmicos adicionados pelo usuário
  const [dynamicIcons, setDynamicIcons] = useState<Array<{
    id: string;
    label: string;
    url: string;
    icon: string;
  }>>([]);
  
  // Carregar ícones dinâmicos do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('auris-desktop-custom-icons');
    if (saved) {
      try {
        setDynamicIcons(JSON.parse(saved));
      } catch {
        console.error('Erro ao carregar ícones personalizados');
      }
    }
  }, []);
  
  // Salvar ícones quando mudam
  useEffect(() => {
    if (dynamicIcons.length > 0) {
      localStorage.setItem('auris-desktop-custom-icons', JSON.stringify(dynamicIcons));
    }
  }, [dynamicIcons]);
  
  // Listen for add-to-desktop events
  useEffect(() => {
    const handleAddToDesktop = (e: CustomEvent<{
      id: string;
      label: string;
      url: string;
      icon: string;
    }>) => {
      const { id, label, url, icon } = e.detail;
      
      setDynamicIcons(prev => {
        // Evitar duplicados
        if (prev.some(item => item.url === url)) {
          alert('Este site já está na área de trabalho!');
          return prev;
        }
        return [...prev, { id, label, url, icon }];
      });
    };
    
    window.addEventListener('add-to-desktop', handleAddToDesktop as EventListener);
    return () => window.removeEventListener('add-to-desktop', handleAddToDesktop as EventListener);
  }, []);
  
  // Abrir webapp em nova janela do browser
  const handleOpenWebApp = (url: string, label: string) => {
    // Abrir browser com URL específica
    const janelaExistente = getJanelaByApp('browser');
    if (!janelaExistente) {
      abrirJanela('browser', label);
      // Setar URL após abrir
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('browser-set-url', { detail: { url } }));
      }, 500);
    }
  };
  
  // Wallpaper personalizado
  const [wallpaperPersonalizado, setWallpaperPersonalizado] = useState<string | null>(null);
  const [wallpaperMode, setWallpaperMode] = useState<WallpaperMode>('cover');
  
  // Estilo de fundo dos ícones
  const [iconBgStyle, setIconBgStyle] = useState<IconBgStyle>('adaptive');
  const [iconBgColor, setIconBgColor] = useState<string>('slate-900');
  const [iconBgOpacity, setIconBgOpacity] = useState<number>(70);
  
  useEffect(() => {
    const saved = localStorage.getItem('auris-wallpaper-custom');
    const mode = localStorage.getItem('auris-wallpaper-mode') as WallpaperMode;
    const savedIconStyle = localStorage.getItem('auris-icon-bg-style') as IconBgStyle;
    const savedIconColor = localStorage.getItem('auris-icon-bg-color');
    const savedIconOpacity = localStorage.getItem('auris-icon-bg-opacity');
    
    if (saved) setWallpaperPersonalizado(saved);
    if (mode) setWallpaperMode(mode);
    if (savedIconStyle) setIconBgStyle(savedIconStyle);
    if (savedIconColor) setIconBgColor(savedIconColor);
    if (savedIconOpacity) setIconBgOpacity(parseInt(savedIconOpacity));
  }, []);

  // Atualizar quando o wallpaper mudar
  useEffect(() => {
    const saved = localStorage.getItem('auris-wallpaper-custom');
    const mode = localStorage.getItem('auris-wallpaper-mode') as WallpaperMode;
    if (saved) setWallpaperPersonalizado(saved);
    if (mode) setWallpaperMode(mode);
  }, [wallpaper_atual]);

  const handleIconDoubleClick = (appId: string, label: string) => {
    const janelaExistente = getJanelaByApp(appId as JanelaOS['app']);
    if (!janelaExistente) {
      abrirJanela(appId as JanelaOS['app'], label);
    }
  };

  const wallpaperClass = wallpapers[wallpaper_atual] || wallpapers.akasha;
  const isLight = isLightWallpaper(wallpaper_atual) || wallpaperPersonalizado !== null;

  const getCustomWallpaperStyle = (): React.CSSProperties => {
    if (!wallpaperPersonalizado) return {};
    
    const base: React.CSSProperties = {
      backgroundImage: `url(${wallpaperPersonalizado})`,
      backgroundPosition: 'center',
    };
    
    switch (wallpaperMode) {
      case 'cover':
        return { ...base, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' };
      case 'contain':
        return { ...base, backgroundSize: 'contain', backgroundRepeat: 'no-repeat' };
      case 'stretch':
        return { ...base, backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat' };
      case 'repeat':
        return { ...base, backgroundSize: 'auto', backgroundRepeat: 'repeat' };
      case 'center':
        return { ...base, backgroundSize: 'auto', backgroundRepeat: 'no-repeat' };
      default:
        return base;
    }
  };

  // Estilos de fundo dos ícones baseados na configuração
  const getIconContainerStyles = (isOpen: boolean): string => {
    const baseClasses = 'w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ';
    
    switch (iconBgStyle) {
      case 'glass':
        return baseClasses + `backdrop-blur-xl ${isOpen 
          ? 'bg-white/30 border-2 border-auris-sage shadow-lg' 
          : 'bg-white/20 border border-white/30 hover:bg-white/30'}`;
      
      case 'solid':
        return baseClasses + `${isOpen 
          ? `bg-${iconBgColor} border-2 border-auris-sage shadow-lg` 
          : `bg-${iconBgColor}/${iconBgOpacity} border border-white/20 hover:bg-${iconBgColor}`}`;
      
      case 'gradient':
        return baseClasses + `${isOpen 
          ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-auris-sage shadow-lg' 
          : 'bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-white/20 hover:from-slate-800 hover:to-slate-900'}`;
      
      case 'adaptive':
      default:
        // Adaptativo: fundo escuro semi-transparente com borda sutil
        return baseClasses + `${isOpen 
          ? 'bg-slate-900/80 backdrop-blur-md border-2 border-auris-sage shadow-lg shadow-auris-sage/20' 
          : 'bg-slate-900/60 backdrop-blur-sm border border-white/20 hover:bg-slate-900/80 hover:border-white/40'}`;
    }
  };

  // Estilo do texto do label
  const getLabelStyles = (isOpen: boolean): string => {
    const baseClasses = 'text-xs text-center px-2 py-1 rounded-md backdrop-blur-sm transition-all font-medium ';
    
    if (isOpen) {
      return baseClasses + 'bg-auris-sage/90 text-white shadow-md';
    }
    
    // Texto sempre legível - fundo escuro semi-transparente
    return baseClasses + 'bg-slate-900/80 text-white/95 shadow-sm';
  };

  return (
    <div 
      className={`relative w-full h-screen overflow-hidden transition-all duration-1000 ${
        wallpaperPersonalizado ? '' : wallpaperClass
      }`}
      style={wallpaperPersonalizado ? getCustomWallpaperStyle() : {}}
    >
      {/* Overlay sutil para melhorar contraste geral */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${isLight ? 'bg-black/10' : 'bg-black/20'}`} />

      {/* Área de trabalho com ícones */}
      <div className="absolute inset-0 pt-24 pb-8 px-4">
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6 w-full max-w-none">
          {icones.map((icone, index) => {
            const Icone = icone.icone;
            const isOpen = getJanelaByApp(icone.app);
            
            return (
              <motion.div
                key={icone.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col items-center gap-2 group cursor-pointer"
                onDoubleClick={() => handleIconDoubleClick(icone.app, icone.label)}
              >
                <motion.div 
                  className={getIconContainerStyles(!!isOpen)}
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    boxShadow: isOpen 
                      ? '0 8px 32px rgba(16, 185, 129, 0.3), 0 0 0 1px rgba(16, 185, 129, 0.5)' 
                      : '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <Icone className={`w-8 h-8 ${icone.cor} drop-shadow-md`} />
                </motion.div>
                <span className={getLabelStyles(!!isOpen)}>
                  {icone.label}
                </span>
                {isOpen && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 rounded-full bg-auris-sage mt-1 shadow-lg shadow-auris-sage/50"
                  />
                )}
              </motion.div>
            );
          })}
          
          {/* Ícones dinâmicos (webapps adicionados) */}
          {dynamicIcons.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: (icones.length + index) * 0.05 }}
              className="flex flex-col items-center gap-2 group cursor-pointer"
              onDoubleClick={() => handleOpenWebApp(item.url, item.label)}
            >
              <motion.div 
                className={getIconContainerStyles(false)}
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                }}
              >
                <img 
                  src={item.icon} 
                  alt={item.label}
                  className="w-8 h-8 object-contain drop-shadow-md"
                  onError={(e) => {
                    // Fallback para ícone genérico se favicon falhar
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>';
                  }}
                />
              </motion.div>
              <span className={getLabelStyles(false)}>
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Janelas abertas */}
      {janelas.filter(j => !j.minimizada).map((janela) => (
        <Window key={janela.id} janela={janela} />
      ))}
    </div>
  );
};

// Componente Window importado inline para evitar dependência circular
import { Window } from './Window';

