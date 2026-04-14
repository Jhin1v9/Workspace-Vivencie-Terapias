// ============================================================================
// CARD DE EVENTO - Componente visual para eventos do calendário
// ============================================================================

import { motion } from 'framer-motion';
import { 
  Clock, 
  User, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CalendarEvent } from '@/types/calendar';

// ============================================================================
// TIPOS
// ============================================================================

export interface CalendarEventCardProps {
  event: CalendarEvent;
  onClick?: () => void;
  draggable?: boolean;
  compact?: boolean;
  onNativeDragStart?: (e: React.DragEvent, eventId: string) => void;
}

// ============================================================================
// HELPERS
// ============================================================================

const formatTime = (isoDate: string): string => {
  const date = new Date(isoDate);
  return date.toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
};

const getStatusIcon = (status: CalendarEvent['status']) => {
  switch (status) {
    case 'concluido':
      return <CheckCircle2 className="w-3 h-3 text-green-400" />;
    case 'cancelado':
      return <AlertCircle className="w-3 h-3 text-red-400" />;
    case 'em_andamento':
      return <div className="w-2 h-2 rounded-full bg-auris-amber animate-pulse" />;
    case 'confirmado':
      return <div className="w-2 h-2 rounded-full bg-green-400" />;
    default:
      return <div className="w-2 h-2 rounded-full bg-white/40" />;
  }
};

const getTypeLabel = (type: CalendarEvent['type']): string => {
  const labels: Record<CalendarEvent['type'], string> = {
    consulta: 'Consulta',
    retorno: 'Retorno',
    bloqueio: 'Bloqueio',
    revisao: 'Revisão',
    aura_sugestao: 'Aura Sugeriu',
  };
  return labels[type];
};

const getStatusClass = (status: CalendarEvent['status']): string => {
  const classes: Record<CalendarEvent['status'], string> = {
    agendado: 'border-l-white/30',
    confirmado: 'border-l-green-400',
    em_andamento: 'border-l-auris-amber animate-pulse',
    concluido: 'border-l-slate-500 opacity-75',
    cancelado: 'border-l-red-400 opacity-50 line-through',
  };
  return classes[status];
};

// ============================================================================
// COMPONENTE
// ============================================================================

export function CalendarEventCard({ 
  event, 
  onClick, 
  draggable = false,
  compact = false,
  onNativeDragStart
}: CalendarEventCardProps) {
  const isAuraSugestao = event.type === 'aura_sugestao';
  
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('eventId', event.id);
    if (onNativeDragStart) {
      onNativeDragStart(e, event.id);
    }
  };
  
  if (compact) {
    // Versão compacta para visualização em grade mensal
    const content = (
      <div className={cn(
        'px-1.5 py-0.5 rounded text-xs font-medium cursor-pointer',
        'border-l-2 transition-all duration-200',
        'truncate select-none',
        event.color,
        getStatusClass(event.status)
      )}>
        <div className="flex items-center gap-1">
          {isAuraSugestao && <Sparkles className="w-2.5 h-2.5" />}
          <span className="truncate">{formatTime(event.start)} {event.pacienteNome || event.title}</span>
        </div>
      </div>
    );
    
    if (draggable) {
      return (
        <div
          draggable
          onDragStart={handleDragStart}
          onClick={onClick}
        >
          {content}
        </div>
      );
    }
    
    return (
      <motion.div
        layoutId={`event-${event.id}`}
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {content}
      </motion.div>
    );
  }

  // Versão completa para visualização diária/semanal
  const content = (
    <div className={cn(
      'p-2 rounded-lg cursor-pointer',
      'shadow-sm backdrop-blur-sm',
      'transition-all duration-200',
      'group relative overflow-hidden',
      event.color,
      getStatusClass(event.status)
    )}
    style={{ borderLeftWidth: '3px', borderLeftStyle: 'solid' }}
    >
      {/* Badge de tipo */}
      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <MoreHorizontal className="w-3 h-3 text-white/60" />
      </div>
      
      {/* Header com hora e status */}
      <div className="flex items-center gap-1.5 mb-1">
        <Clock className="w-3 h-3 opacity-70" />
        <span className="text-xs font-medium opacity-90">
          {formatTime(event.start)} - {formatTime(event.end)}
        </span>
        <div className="ml-auto">{getStatusIcon(event.status)}</div>
      </div>
      
      {/* Título */}
      <div className="flex items-start gap-1.5 mb-0.5">
        {isAuraSugestao && <Sparkles className="w-3 h-3 mt-0.5 flex-shrink-0" />}
        <h4 className="font-semibold text-xs leading-tight line-clamp-2">
          {event.title}
        </h4>
      </div>
      
      {/* Paciente (se houver) */}
      {event.pacienteNome && (
        <div className="flex items-center gap-1 text-xs opacity-80">
          <User className="w-2.5 h-2.5" />
          <span className="truncate">{event.pacienteNome}</span>
        </div>
      )}
      
      {/* Badge tipo */}
      <div className="mt-1.5 flex items-center gap-1">
        <span className={cn(
          'text-xs px-1 py-0.5 rounded-full',
          'bg-black/20 font-medium uppercase tracking-wider'
        )}>
          {getTypeLabel(event.type)}
        </span>
        
        {/* Lembrete Aura */}
        {event.lembreteAura && (
          <Sparkles className="w-2.5 h-2.5 text-auris-amber" />
        )}
      </div>
    </div>
  );
  
  if (draggable) {
    return (
      <div
        draggable
        onDragStart={handleDragStart}
        onClick={onClick}
      >
        {content}
      </div>
    );
  }
  
  return (
    <motion.div
      layoutId={`event-${event.id}`}
      onClick={onClick}
      whileHover={{ scale: 1.01, y: -1 }}
      whileTap={{ scale: 0.99 }}
    >
      {content}
    </motion.div>
  );
}

export default CalendarEventCard;
