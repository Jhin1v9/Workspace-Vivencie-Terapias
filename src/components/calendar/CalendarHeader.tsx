// ============================================================================
// HEADER DO CALENDÁRIO - Navegação e controles
// ============================================================================

import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock,
  Filter,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { CalendarViewMode, CalendarEventType } from '@/types/calendar';

// ============================================================================
// TIPOS
// ============================================================================

interface CalendarHeaderProps {
  currentDate: Date;
  viewMode: CalendarViewMode;
  onViewModeChange: (mode: CalendarViewMode) => void;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onAddEvent: () => void;
  filtros: CalendarEventType[];
  onToggleFiltro: (type: CalendarEventType) => void;
}

// ============================================================================
// HELPERS
// ============================================================================

const formatMonthYear = (date: Date): string => {
  return date.toLocaleDateString('pt-BR', { 
    month: 'long', 
    year: 'numeric' 
  });
};

const viewModeLabels: Record<CalendarViewMode, string> = {
  dia: 'Dia',
  semana: 'Semana',
  mes: 'Mês',
  timeline: 'Linha do Tempo',
};

const filtroLabels: Record<CalendarEventType, string> = {
  consulta: 'Consultas',
  retorno: 'Retornos',
  bloqueio: 'Bloqueios',
  revisao: 'Revisões',
  aura_sugestao: 'Aura',
};

const filtroColors: Record<CalendarEventType, string> = {
  consulta: 'bg-auris-sage',
  retorno: 'bg-blue-500',
  bloqueio: 'bg-slate-600',
  revisao: 'bg-purple-500',
  aura_sugestao: 'bg-auris-amber',
};

// ============================================================================
// COMPONENTE
// ============================================================================

export function CalendarHeader({
  currentDate,
  viewMode,
  onViewModeChange,
  onPrevious,
  onNext,
  onToday,
  onAddEvent,
  filtros,
  onToggleFiltro,
}: CalendarHeaderProps) {
  return (
    <div className="flex flex-col gap-4 p-4 border-b border-white/10 bg-slate-900/50 backdrop-blur-sm">
      {/* Linha superior: Navegação e título */}
      <div className="flex items-center justify-between">
        {/* Navegação */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-800/50 rounded-lg p-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10"
              onClick={onPrevious}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10"
              onClick={onToday}
            >
              Hoje
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10"
              onClick={onNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Título do mês */}
          <motion.h2 
            key={currentDate.toISOString()}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-semibold text-white capitalize ml-2"
          >
            {formatMonthYear(currentDate)}
          </motion.h2>
        </div>
        
        {/* Ações */}
        <div className="flex items-center gap-2">
          {/* Seletor de visualização */}
          <div className="flex items-center bg-slate-800/50 rounded-lg p-1">
            {(Object.keys(viewModeLabels) as CalendarViewMode[]).map((mode) => (
              <Button
                key={mode}
                variant="ghost"
                size="sm"
                className={cn(
                  'h-7 px-3 text-xs font-medium transition-all',
                  viewMode === mode
                    ? 'bg-auris-sage/20 text-auris-sage'
                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                )}
                onClick={() => onViewModeChange(mode)}
              >
                {mode === 'dia' && <Clock className="w-3 h-3 mr-1" />}
                {mode === 'mes' && <CalendarIcon className="w-3 h-3 mr-1" />}
                {viewModeLabels[mode]}
              </Button>
            ))}
          </div>
          
          {/* Botão adicionar */}
          <Button
            size="sm"
            className="h-8 bg-auris-sage hover:bg-auris-sage/90 text-slate-900 font-medium"
            onClick={onAddEvent}
          >
            <Plus className="w-4 h-4 mr-1" />
            Novo
          </Button>
        </div>
      </div>
      
      {/* Linha inferior: Filtros */}
      <div className="flex items-center gap-2">
        <Filter className="w-3.5 h-3.5 text-slate-500" />
        <span className="text-xs text-slate-500 mr-2">Filtrar:</span>
        
        {(Object.keys(filtroLabels) as CalendarEventType[]).map((type) => (
          <button
            key={type}
            onClick={() => onToggleFiltro(type)}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
              'transition-all duration-200 border',
              filtros.includes(type)
                ? cn('border-transparent text-white', filtroColors[type])
                : 'border-white/10 text-slate-500 bg-slate-800/30 hover:bg-slate-800/50'
            )}
          >
            <div className={cn(
              'w-1.5 h-1.5 rounded-full',
              filtros.includes(type) ? 'bg-white' : filtroColors[type]
            )} />
            {filtroLabels[type]}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CalendarHeader;
