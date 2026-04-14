// ============================================================================
// GRADE MENSAL - Visualização tipo calendário de parede
// ============================================================================

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import CalendarEventCard from './CalendarEventCard';
import type { CalendarEvent } from '@/types/calendar';

// ============================================================================
// TIPOS
// ============================================================================

interface CalendarMonthGridProps {
  year: number;
  month: number;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onDateClick: (date: Date) => void;
  onEventDrop?: (eventId: string, newDate: Date) => void;
}

interface DayCellProps {
  date: Date;
  events: CalendarEvent[];
  isToday: boolean;
  isCurrentMonth: boolean;
  onEventClick: (event: CalendarEvent) => void;
  onDateClick: (date: Date) => void;
  onEventDrop?: (eventId: string, newDate: Date) => void;
}

// ============================================================================
// HELPERS
// ============================================================================

const DAYS_OF_WEEK = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

const isSameDay = (d1: Date, d2: Date): boolean => {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};

const getCalendarGrid = (year: number, month: number): (Date | null)[][] => {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const weeks: (Date | null)[][] = [];
  let currentWeek: (Date | null)[] = [];
  
  // Preencher dias vazios no início
  for (let i = 0; i < firstDay; i++) {
    currentWeek.push(null);
  }
  
  // Preencher dias do mês
  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(new Date(year, month, day));
    
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  
  // Completar última semana
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }
  
  return weeks;
};

// ============================================================================
// COMPONENTE: Célula do Dia
// ============================================================================

function DayCell({ 
  date, 
  events, 
  isToday, 
  isCurrentMonth,
  onEventClick,
  onDateClick,
  onEventDrop 
}: DayCellProps) {
  const [isDragOver, setIsDragOver] = React.useState(false);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  
  const handleDragLeave = () => {
    setIsDragOver(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const eventId = e.dataTransfer.getData('eventId');
    if (eventId && onEventDrop) {
      onEventDrop(eventId, date);
    }
  };
  
  const handleDragStart = (e: React.DragEvent, eventId: string) => {
    e.dataTransfer.setData('eventId', eventId);
  };
  
  return (
    <motion.div
      onClick={() => onDateClick(date)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
      className={cn(
        'min-h-[100px] p-1.5 border border-white/5',
        'flex flex-col gap-1 cursor-pointer',
        'transition-all duration-200',
        !isCurrentMonth && 'bg-slate-950/30',
        isToday && 'bg-auris-sage/5',
        isDragOver && 'bg-auris-sage/10 border-auris-sage/30'
      )}
    >
      {/* Número do dia */}
      <div className="flex justify-between items-center">
        <span className={cn(
          'text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full',
          isToday 
            ? 'bg-auris-sage text-slate-900' 
            : isCurrentMonth 
              ? 'text-slate-300' 
              : 'text-slate-600'
        )}>
          {date.getDate()}
        </span>
        
        {/* Indicador de mais eventos */}
        {events.length > 3 && (
          <span className="text-[10px] text-slate-500">
            +{events.length - 3}
          </span>
        )}
      </div>
      
      {/* Eventos do dia */}
      <div className="flex flex-col gap-0.5 mt-1">
        {events.slice(0, 3).map((event) => (
          <div key={event.id} onClick={(e) => { e.stopPropagation(); onEventClick(event); }}>
            <CalendarEventCard
              event={event}
              compact
              draggable={!!onEventDrop}
              onNativeDragStart={(e, id) => handleDragStart(e, id)}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export function CalendarMonthGrid({
  year,
  month,
  events,
  onEventClick,
  onDateClick,
  onEventDrop,
}: CalendarMonthGridProps) {
  const weeks = getCalendarGrid(year, month);
  const today = new Date();
  
  // Agrupar eventos por dia
  const eventsByDay = React.useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    events.forEach((event) => {
      const dateKey = new Date(event.start).toDateString();
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(event);
    });
    return map;
  }, [events]);
  
  return (
    <div className="flex flex-col h-full bg-slate-900/30">
      {/* Cabeçalho dos dias da semana */}
      <div className="grid grid-cols-7 border-b border-white/10">
        {DAYS_OF_WEEK.map((day) => (
          <div 
            key={day}
            className="py-2 text-center text-xs font-medium text-slate-500 uppercase tracking-wider"
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Grade de dias */}
      <div className="flex-1 grid grid-rows-6">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7">
            {week.map((date, dayIndex) => (
              <div key={dayIndex} className="relative">
                {date ? (
                  <DayCell
                    date={date}
                    events={eventsByDay.get(date.toDateString()) || []}
                    isToday={isSameDay(date, today)}
                    isCurrentMonth={date.getMonth() === month}
                    onEventClick={onEventClick}
                    onDateClick={onDateClick}
                    onEventDrop={onEventDrop}
                  />
                ) : (
                  <div className="h-full border border-white/5 bg-slate-950/50" />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CalendarMonthGrid;
