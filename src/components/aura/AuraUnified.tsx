// AURA UNIFIED - Componente mestre da Aura
// FASE 4/6: Visual Perfectionism + Performance Optimizations

import React, { useState, useRef, useEffect, Suspense, lazy, useMemo, useCallback, memo } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { 
  Send, Sparkles, Minimize2, X, ChevronUp, ChevronDown, Loader2,
  Lightbulb, Zap, UserPlus, Calendar, Play, Search, History,
  Eraser, BookOpen, CheckCircle, Timer, Flag, Plus, CalendarDays, Clock,
  Bug, Eye, ListTodo,
  type LucideIcon
} from 'lucide-react';
import { useAuraStore } from '@/stores/useAuraStore';
import { useAuraIntelligence, type BannerContextual } from '@/hooks/useAuraIntelligence';
import { glowColors } from '@/lib/theme';
import * as animations from '@/lib/animations';

// Mapa tipado de ícones para sugestões
const iconMap: Record<string, LucideIcon> = {
  UserPlus,
  Calendar,
  Play,
  Search,
  History,
  Sparkles,
  Eraser,
  BookOpen,
  CheckCircle,
  Timer,
  Flag,
  Plus,
  CalendarDays,
  Clock,
  Zap,
  Bug,
  Eye,
  ListTodo,
};

// Lazy load do MessageList para performance
const AuraMessageList = lazy(() =>
  import('./AuraMessageList').then((module) => ({ default: module.AuraMessageList }))
);

// Types
interface AuraUnifiedProps {
  variant: 'orb' | 'window';
}

// Componente Banner Contextual

const BannerInteligente = memo<{
  banner: BannerContextual;
  onClose: () => void;
  onAction: (comando: string) => void;
}>(({ banner, onClose, onAction }) => {
  const cores = {
    dica: 'bg-blue-500/20 border-blue-500/30 text-blue-300',
    atalho: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300',
    lembrete: 'bg-amber-500/20 border-amber-500/30 text-amber-300',
    alerta: 'bg-red-500/20 border-red-500/30 text-red-300'
  };

  const glowCores = glowColors;

  useEffect(() => {
    if (banner.duracao > 0) {
      const timer = setTimeout(onClose, banner.duracao);
      return () => clearTimeout(timer);
    }
  }, [banner.duracao, onClose]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={animations.transitions.springGentle}
      whileHover={{ 
        boxShadow: `0 0 20px ${glowCores[banner.tipo]}`
      }}
      className={`mx-3 mt-2 p-3 rounded-xl border ${cores[banner.tipo]} relative overflow-hidden`}
    >
      {/* Efeito de brilho no fundo */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
          repeatDelay: 3
        }}
      />
      
      <button 
        onClick={onClose}
        className="absolute top-1.5 right-1.5 p-1 hover:bg-white/10 rounded-lg transition-all hover:rotate-90 duration-200"
      >
        <X className="w-3 h-3 opacity-60" />
      </button>
      
      <div className="flex items-start gap-2 relative z-10">
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" />
        </motion.div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium">{banner.titulo}</p>
          <p className="text-[11px] opacity-90 mt-0.5 leading-relaxed">{banner.mensagem}</p>
          
          {banner.acao && (
            <motion.button
              whileHover={{ scale: 1.02, x: 2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onAction(banner.acao!.comando)}
              className="mt-2 text-[11px] px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-1"
            >
              <Zap className="w-3 h-3" />
              {banner.acao.texto}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
});

BannerInteligente.displayName = 'BannerInteligente';

// Componente Orb Compacto

const AuraOrbCompacto = memo<{ onClick: () => void }>(({ onClick }) => {
  const controls = useAnimation();

  useEffect(() => {
    // Animação de entrada
    controls.start({
      scale: [0, 1.1, 1],
      opacity: [0, 1, 1],
      transition: { duration: 0.6, ease: 'backOut' }
    });
  }, [controls]);

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50 cursor-pointer"
      initial={{ scale: 0, opacity: 0 }}
      animate={controls}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
    >
      {/* Halo animado externo */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-auris-sage/30 via-auris-indigo/30 to-auris-amber/30 blur-xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
      
      {/* Segundo halo */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-auris-sage/20 to-auris-indigo/20 blur-lg"
        animate={{
          scale: [1.1, 1.4, 1.1],
          opacity: [0.3, 0.5, 0.3],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
      
      <div className="relative w-16 h-16">
        {/* Aura gradiente pulsante */}
        <motion.div 
          className="absolute inset-0 rounded-full bg-gradient-to-br from-auris-sage via-auris-indigo to-auris-amber"
          animate={{
            opacity: [0.7, 0.9, 0.7],
            scale: [1, 1.02, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          style={{ filter: 'blur(4px)' }}
        />
        
        {/* Círculo principal */}
        <motion.div 
          className="absolute inset-1 rounded-full bg-slate-900 flex items-center justify-center border-2 border-white/20 overflow-hidden"
          whileHover={{ borderColor: 'rgba(255, 255, 255, 0.4)' }}
        >
          {/* Brilho interno */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: 'easeInOut'
            }}
          />
          
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="w-7 h-7 text-auris-sage" />
          </motion.div>
        </motion.div>
        
        {/* Indicador de notificação pulsante */}
        <motion.div 
          className="absolute -top-1 -right-1 w-4 h-4 bg-auris-amber rounded-full border-2 border-slate-900"
          animate={{
            scale: [1, 1.2, 1],
            boxShadow: [
              glowColors.lembrete.replace('0.3', '0.4'),
              '0 0 10px 4px rgba(245, 158, 11, 0.2)',
              glowColors.lembrete.replace('0.3', '0.4')
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </div>
    </motion.div>
  );
});

AuraOrbCompacto.displayName = 'AuraOrbCompacto';

// Componente Interface Expandida

const AuraInterface = memo<{
  modo: 'overlay' | 'window';
  onMinimize: () => void;
  onClose: () => void;
}>(({ modo, onMinimize, onClose }) => {
  const { 
    mensagens, 
    isLoading, 
    sendMessage
  } = useAuraStore();
  
  const { 
    sugestoes, 
    banner, 
    analise, 
    registrarAcao 
  } = useAuraIntelligence();
  
  const [inputTexto, setInputTexto] = useState('');
  const [paginaChat, setPaginaChat] = useState(0);
  const [mostrarBanner, setMostrarBanner] = useState(true);
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const MENSAGENS_POR_PAGINA = 6;
  
  // Memoizar callbacks para evitar re-renders desnecessários
  const handleMinimize = useCallback(() => onMinimize(), [onMinimize]);
  const handleClose = useCallback(() => onClose(), [onClose]);
  
  // Paginar mensagens
  const totalPaginasChat = Math.ceil(mensagens.length / MENSAGENS_POR_PAGINA);
  const mensagensVisiveis = mensagens.slice(
    Math.max(0, (totalPaginasChat - 1 - paginaChat) * MENSAGENS_POR_PAGINA),
    Math.max(0, totalPaginasChat - paginaChat) * MENSAGENS_POR_PAGINA
  );
  
  // Memoizar handlers de paginação
  const handlePrevPage = useCallback(() => {
    setPaginaChat(p => Math.min(totalPaginasChat - 1, p + 1));
  }, [totalPaginasChat]);
  
  const handleNextPage = useCallback(() => {
    setPaginaChat(p => Math.max(0, p - 1));
  }, []);
  
  useEffect(() => {
    setPaginaChat(0);
  }, [mensagens.length]);
  
  useEffect(() => {
    setMostrarBanner(true);
  }, [banner?.id]);
  
  const handleEnviar = async () => {
    if (!inputTexto.trim() || isLoading) return;
    
    const texto = inputTexto.trim();
    setInputTexto('');
    
    registrarAcao('enviar_mensagem');
    await sendMessage(texto);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEnviar();
    }
  };
  
  // Handler para sugestões (botões e banner)
  const handleSugestaoClick = useCallback((comando: string) => {
    setInputTexto(comando);
    registrarAcao(`click_sugestao_${comando}`);
    inputRef.current?.focus();
  }, [registrarAcao]);

  // Estilo condicional
  const containerClasses = modo === 'window' 
    ? "w-full h-full bg-slate-900 flex flex-col"
    : "fixed bottom-6 right-6 w-[420px] h-[600px] bg-slate-900 rounded-2xl shadow-2xl border border-white/10 flex flex-col z-50 overflow-hidden";
  
  // Pegar as 4 melhores sugestões para mostrar como botões
  const sugestoesTop = useMemo(() => {
    return sugestoes
      .sort((a, b) => b.confianca - a.confianca)
      .slice(0, 4);
  }, [sugestoes]);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      transition={animations.transitions.spring}
      className={containerClasses}
    >
      {/* HEADER COM GRADIENTE */}
      <motion.div 
        className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-gradient-to-r from-slate-800/80 to-slate-700/50 backdrop-blur-sm"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3">
          <motion.div 
            className="w-8 h-8 rounded-full bg-gradient-to-br from-auris-sage to-auris-indigo flex items-center justify-center shadow-lg shadow-auris-sage/20"
            whileHover={{ rotate: 10, scale: 1.05 }}
            animate={{ 
              boxShadow: [
                glowColors.atalho.replace('0.3', '0.2'),
                '0 0 20px 4px rgba(16, 185, 129, 0.2)',
                glowColors.atalho.replace('0.3', '0.2')
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Sparkles className="w-4 h-4 text-white" />
          </motion.div>
          <div>
            <h3 className="font-semibold text-white text-sm">Aura</h3>
            <motion.p 
              key={analise.contextoAtual}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs text-slate-400"
            >
              {analise.contextoAtual === 'dashboard' ? 'Assistente Clínica' : `Contexto: ${analise.contextoAtual}`}
            </motion.p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          {modo === 'overlay' && (
            <motion.button 
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.15)' }}
              whileTap={{ scale: 0.9 }}
              onClick={handleMinimize}
              className="p-2 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <Minimize2 className="w-4 h-4" />
            </motion.button>
          )}
          <motion.button 
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.15)' }}
            whileTap={{ scale: 0.9 }}
            onClick={handleClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
      
      {/* BANNER CONTEXTUAL */}
      <AnimatePresence mode="wait">
        {mostrarBanner && banner && (
          <BannerInteligente 
            banner={banner}
            onClose={() => setMostrarBanner(false)}
            onAction={handleSugestaoClick}
          />
        )}
      </AnimatePresence>
      
      {/* ÁREA DE MENSAGENS */}
      <motion.div 
        className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Suspense fallback={
          <motion.div 
            className="flex items-center justify-center h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Loader2 className="w-6 h-6 text-auris-sage" />
            </motion.div>
          </motion.div>
        }>
          <motion.div
            variants={animations.staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <AuraMessageList 
              messages={mensagensVisiveis}
              onContinue={() => {}}
              onAction={() => {}}
              onPointClick={() => {}}
            />
          </motion.div>
        </Suspense>
        
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 text-auris-sage text-sm"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Loader2 className="w-4 h-4 animate-spin" />
            </motion.div>
            <motion.span 
              className="text-xs"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Aura está pensando...
            </motion.span>
          </motion.div>
        )}
      </motion.div>
      
      {/* NAVEGAÇÃO DO CHAT */}
      <AnimatePresence>
        {totalPaginasChat > 1 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center justify-center gap-3 py-2 border-t border-white/5 bg-slate-800/30"
          >
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrevPage}
              disabled={paginaChat >= totalPaginasChat - 1}
              className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
              <ChevronUp className="w-4 h-4 text-slate-400" />
            </motion.button>
            
            <motion.span 
              key={paginaChat}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-xs text-slate-500 font-medium min-w-[50px] text-center"
            >
              {Math.max(1, totalPaginasChat - paginaChat)} / {totalPaginasChat}
            </motion.span>
            
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNextPage}
              disabled={paginaChat === 0}
              className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* BOTÕES SUGESTÃO INTELIGENTES - ÚNICA SEÇÃO DE BOTÕES */}
      <motion.div 
        className="px-4 py-2 border-t border-white/10 bg-gradient-to-r from-slate-800/50 to-slate-700/30"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          <AnimatePresence mode="popLayout">
            {sugestoesTop.map((sugestao, index) => {
              const IconComponent = iconMap[sugestao.icone] || Sparkles;
              return (
                <motion.button
                  key={sugestao.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -2,
                    boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSugestaoClick(sugestao.comando)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg ${sugestao.cor} text-white text-xs font-medium shadow-lg transition-all backdrop-blur-sm whitespace-nowrap`}
                >
                  <IconComponent className="w-3 h-3" />
                  <span>{sugestao.texto}</span>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </motion.div>
      
      {/* INPUT AREA - LIMPO SEM EFEITOS DUPLICADOS */}
      <motion.div 
        className="p-4 border-t border-white/10 bg-gradient-to-r from-slate-800/80 to-slate-700/50"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputTexto}
              onChange={(e) => setInputTexto(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                analise.contextoAtual === 'mapa' 
                  ? "Diga: sugerir protocolo, selecionar pontos..." :
                analise.contextoAtual === 'prontuarios'
                  ? "Diga: criar paciente, buscar por nome..." :
                analise.contextoAtual === 'agenda'
                  ? "Diga: novo agendamento, ver hoje..." :
                "Diga: abrir mapa, criar paciente, sugerir protocolo..."
              }
              rows={1}
              className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 pr-10 text-white text-sm placeholder-slate-500 resize-none focus:outline-none focus:border-auris-sage/50 focus:ring-1 focus:ring-auris-sage/30 focus:bg-slate-900/80 transition-all duration-200"
              style={{ minHeight: '44px', maxHeight: '100px' }}
            />
            
            {/* Indicador de digitação */}
            {inputTexto.length > 0 && (
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500"
              >
                {inputTexto.length}
              </motion.span>
            )}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEnviar}
            disabled={!inputTexto.trim() || isLoading}
            className="px-4 rounded-xl bg-gradient-to-r from-auris-sage to-auris-teal text-slate-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
          >
            <motion.div
              animate={inputTexto.trim() ? { x: [0, 2, 0] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <Send className="w-5 h-5" />
            </motion.div>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
});

AuraInterface.displayName = 'AuraInterface';

// Import Bug Tracker
import { BugTrackerOverlay } from '@/components/bugTracker/BugTrackerOverlay';
import { useBugTrackerStore } from '@/stores/useBugTrackerStore';

// Componente Principal

export const AuraUnified: React.FC<AuraUnifiedProps> = ({ variant }) => {
  const { modo, setModo } = useAuraStore();
  const { isEditMode, deactivateEditMode } = useBugTrackerStore();
  const [hasError, setHasError] = React.useState(false);
  
  // Error boundary effect
  React.useEffect(() => {
    const handleError = () => setHasError(true);
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);
  
  // Reset error when modo changes
  React.useEffect(() => {
    setHasError(false);
  }, [modo]);
  
  if (hasError) {
    return (
      <div className="w-full h-full bg-slate-900 flex items-center justify-center">
        <div className="text-center p-6">
          <p className="text-white mb-4">Algo deu errado. Tente recarregar.</p>
          <button 
            onClick={() => { setHasError(false); window.location.reload(); }}
            className="px-4 py-2 bg-auris-sage text-slate-900 rounded-lg"
          >
            Recarregar
          </button>
        </div>
      </div>
    );
  }
  
  if (variant === 'orb' && modo === 'compacto') {
    return (
      <>
        <AuraOrbCompacto onClick={() => setModo('expandido')} />
        <BugTrackerOverlay 
          isActive={isEditMode} 
          onDeactivate={deactivateEditMode} 
        />
      </>
    );
  }
  
  return (
    <>
      <AuraInterface 
        modo={variant === 'orb' ? 'overlay' : 'window'}
        onMinimize={() => setModo('compacto')}
        onClose={() => setModo('compacto')}
      />
      <BugTrackerOverlay 
        isActive={isEditMode} 
        onDeactivate={deactivateEditMode} 
      />
    </>
  );
};

export default AuraUnified;
