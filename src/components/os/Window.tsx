import React, { Suspense, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useOSStore, useConfigStore } from '@/stores';
import type { JanelaOS } from '@/types';

interface WindowProps {
  janela: JanelaOS;
}

const appComponents: Record<JanelaOS['app'], React.LazyExoticComponent<React.ComponentType>> = {
  clinica: React.lazy(() => import('../clinica/ClinicaApp').then((module) => ({ default: module.ClinicaApp }))),
  mapa: React.lazy(() => import('../auricular/MapaAuricularApp').then((module) => ({ default: module.MapaAuricularApp }))),
  studio: React.lazy(() => import('../studio/StudioSoundApp').then((module) => ({ default: module.StudioSoundApp }))),
  config: React.lazy(() => import('./ConfiguracoesApp').then((module) => ({ default: module.ConfiguracoesApp }))),
  aura: React.lazy(() => import('../aura/AuraAIApp').then((module) => ({ default: module.AuraAIApp }))),
  protocolos: React.lazy(() => import('../clinica/ProtocolosApp').then((module) => ({ default: module.ProtocolosApp }))),
  knowledge: React.lazy(() => import('../clinica/KnowledgeHubApp').then((module) => ({ default: module.KnowledgeHubApp }))),
  sessao: React.lazy(() => import('../clinica/SessaoApp').then((module) => ({ default: module.SessaoApp }))),
  calendario: React.lazy(() => import('../calendar/CalendarOS').then((module) => ({ default: module.CalendarOS }))),
  financas: React.lazy(() => import('../financas/FinancasApp').then((module) => ({ default: module.FinancasApp }))),
  browser: React.lazy(() => import('../browser/BrowserApp').then((module) => ({ default: module.BrowserApp }))),
  notas: React.lazy(() => import('../notas/NotasApp').then((module) => ({ default: module.NotasApp }))),
};

const WindowLoadingFallback: React.FC<{ isClinico: boolean }> = ({ isClinico }) => (
  <div className={`h-full w-full p-6 ${isClinico ? 'bg-slate-50 text-slate-600' : 'bg-transparent text-white/70'}`}>
    <div className="mx-auto flex h-full max-w-3xl flex-col justify-center gap-4">
      <div className={`h-4 w-40 rounded-full ${isClinico ? 'bg-slate-200' : 'bg-white/10'}`} />
      <div className={`h-24 rounded-3xl border backdrop-blur-xl ${isClinico ? 'border-slate-200 bg-white/80' : 'border-white/10 bg-white/5'}`} />
      <div className={`h-40 rounded-3xl border backdrop-blur-xl ${isClinico ? 'border-slate-200 bg-white/80' : 'border-white/10 bg-white/5'}`} />
      <p className={`text-sm ${isClinico ? 'text-slate-500' : 'text-white/45'}`}>
        Carregando módulo...
      </p>
    </div>
  </div>
);

export const Window: React.FC<WindowProps> = ({ janela }) => {
  const { 
    fecharJanela, 
    minimizarJanela, 
    maximizarJanela, 
    restaurarJanela, 
    focarJanela,
    atualizarPosicao,
    zIndexCounter 
  } = useOSStore();
  const { wallpaper_atual } = useConfigStore();

  const isClinico = wallpaper_atual === 'clinico';
  const AppComponent = appComponents[janela.app];

  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const windowStartRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (janela.maximizada) return;
    
    // Only drag from header
    const target = e.target as HTMLElement;
    if (!target.closest('.window-header')) return;
    
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    windowStartRef.current = { ...janela.posicao };
    focarJanela(janela.id);
    
    e.preventDefault();
  }, [janela.maximizada, janela.posicao, janela.id, focarJanela]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;
    
    const newX = Math.max(0, windowStartRef.current.x + deltaX);
    const newY = Math.max(48, windowStartRef.current.y + deltaY);
    
    atualizarPosicao(janela.id, { x: newX, y: newY });
  }, [isDragging, janela.id, atualizarPosicao]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add/remove global mouse listeners
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  if (janela.minimizada) return null;

  return (
    <motion.div
      className="absolute"
      style={{
        left: janela.maximizada ? 0 : janela.posicao.x,
        top: janela.maximizada ? 48 : janela.posicao.y,
        width: janela.maximizada ? '100%' : janela.tamanho.width,
        height: janela.maximizada ? 'calc(100% - 48px)' : janela.tamanho.height,
        zIndex: janela.focada ? zIndexCounter : 100,
      }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
      }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ 
        type: 'spring', 
        damping: 25, 
        stiffness: 300 
      }}
      onClick={() => focarJanela(janela.id)}
    >
      <div className={`window flex flex-col h-full min-w-[400px] min-h-[400px] ${isClinico ? 'bg-white/95 border-slate-200' : ''}`}>
        {/* Header - Draggable */}
        <div 
          className={`window-header cursor-move ${isClinico ? 'bg-slate-100 border-slate-200' : ''}`}
          onMouseDown={handleMouseDown}
        >
          <span className={`text-sm font-medium ${isClinico ? 'text-slate-700' : 'text-white/90'}`}>
            {janela.titulo}
          </span>
          <div className="window-controls">
            <motion.button
              className="window-btn window-btn-minimize"
              onClick={() => minimizarJanela(janela.id)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
            <motion.button
              className="window-btn window-btn-maximize"
              onClick={() => janela.maximizada ? restaurarJanela(janela.id) : maximizarJanela(janela.id)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
            <motion.button
              className="window-btn window-btn-close"
              onClick={() => fecharJanela(janela.id)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          </div>
        </div>

        {/* Content */}
        <div className={`flex-1 overflow-auto scrollbar-thin ${isClinico ? 'text-slate-700' : ''}`}>
          <Suspense fallback={<WindowLoadingFallback isClinico={isClinico} />}>
            <AppComponent />
          </Suspense>
        </div>
      </div>
    </motion.div>
  );
};
