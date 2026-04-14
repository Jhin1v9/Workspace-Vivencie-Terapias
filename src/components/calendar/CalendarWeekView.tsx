// ============================================================================
// VISUALIZAÇÃO SEMANAL - Timeline horizontal com slots de hora
// ============================================================================

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import CalendarEventCard from './CalendarEventCard';
import type { CalendarEvent } from '@/types/calendar';

// ============================================================================
// TIPOS
// ============================================================================

interface CalendarWeekViewProps {
  weekStart: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onSlotClick: (date: Date, hour: number) => void;
  horaInicio?: number;
  horaFim?: number;
}

// ============================================================================
// HELPERS
// ============================================================================

const DAYS_OF_WEEK = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const isSameDay = (d1: Date, d2: Date): boolean => {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};

const getWeekDays = (weekStart: Date): Date[] => {
  const days: Date[] = [];
  const start = new Date(weekStart);
  // Ajustar para domingo
  start.setDate(start.getDate() - start.getDay());
  
  for (let i = 0; i < 7; i++) {
    days.push(new Date(start));
    start.setDate(start.getDate() + 1);
  }
  return days;
};

const formatDayNumber = (date: Date): string => {
  return date.getDate().toString();
};

const formatDayName = (date: Date): string => {
  return DAYS_OF_WEEK[date.getDay()];
};

// ============================================================================
// COMPONENTE
// ============================================================================

export function CalendarWeekView({
  weekStart,
  events,
  onEventClick,
  onSlotClick,
  horaInicio = 8,
  horaFim = 20,
}: CalendarWeekViewProps) {
  const days = getWeekDays(weekStart);
  const today = new Date();
  const hours = Array.from({ length: horaFim - horaInicio + 1 }, (_, i) => horaInicio + i);
  
  // Agrupar eventos por dia
  const eventsByDay = React.useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    days.forEach((day) => {
      map.set(day.toDateString(), []);
    });
    
    events.forEach((event) => {
      const eventDate = new Date(event.start);
      const dateKey = eventDate.toDateString();
      if (map.has(dateKey)) {
        map.get(dateKey)!.push(event);
      }
    });
    
    return map;
  }, [events, days]);
  
  // Calcular posição de um evento
  const getEventPosition = (event: CalendarEvent) => {
    const start = new Date(event.start);
    const end = new Date(event.end);
    const startHour = start.getHours() + start.getMinutes() / 60;
    const endHour = end.getHours() + end.getMinutes() / 60;
    
    const top = (startHour - horaInicio) * 60; // 60px por hora
    const height = (endHour - startHour) * 60;
    
    return { top: Math.max(0, top), height: Math.max(30, height) };
  };
  
  return (
    <div className="flex flex-col h-full bg-slate-900/30 overflow-hidden">
      {/* Cabeçalho dos dias */}
      <div className="flex border-b border-white/10 bg-slate-900/50">
        {/* Canto vazio */}
        <div className="w-14 flex-shrink-0 border-r border-white/10" />
        
        {/* Dias da semana */}
        <div className="flex-1 grid grid-cols-7">
          {days.map((day) => (
            <div
              key={day.toISOString()}
              className={cn(
                'py-2 text-center border-r border-white/5 last:border-r-0',
                isSameDay(day, today) && 'bg-auris-sage/10'
              )}
            >
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                {formatDayName(day)}
              </div>
              <div className={cn(
                'text-lg font-semibold mt-0.5',
                isSameDay(day, today) 
                  ? 'text-auris-sage' 
                  : 'text-slate-300'
              )}>
                {formatDayNumber(day)}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Timeline de horas */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex">
          {/* Coluna de horas */}
          <div className="w-14 flex-shrink-0 border-r border-white/10 bg-slate-900/30">
            {hours.map((hour) => (
              <div
                key={hour}
                className="h-[60px] flex items-start justify-center pt-1 border-b border-white/5"
              >
                <span className="text-[10px] text-slate-500 font-medium">
                  {hour.toString().padStart(2, '0')}:00
                </span>
              </div>
            ))}
          </div>
          
          {/* Grid de eventos */}
          <div className="flex-1 grid grid-cols-7 relative">
            {/* Linhas de hora */}
            {hours.map((hour) => (
              <React.Fragment key={hour}>
                {days.map((day) => (
                  <motion.div
                    key={`${day.toISOString()}-${hour}`}
                    className="h-[60px] border-r border-b border-white/5 last:border-r-0 cursor-pointer hover:bg-white/[0.02] transition-colors"
                    onClick={() => onSlotClick(day, hour)}
                  />
                ))}
              </React.Fragment>
            ))}
            
            {/* Eventos posicionados */}
            {days.map((day, dayIndex) => {
              const dayEvents = eventsByDay.get(day.toDateString()) || [];
              return (
                <div
                  key={day.toISOString()}
                  className="absolute top-0 h-full"
                  style={{ 
                    left: `${(dayIndex / 7) * 100}%`, 
                    width: `${100 / 7}%`,
                    padding: '0 2px'
                  }}
                >
                  {dayEvents.map((event) => {
                    const { top, height } = getEventPosition(event);
                    return (
                      <div
                        key={event.id}
                        className="absolute left-0 right-0 px-1"
                        style={{ 
                          top: `${top}px`, 
                          height: `${height}px`,
                          minHeight: '40px'
                        }}
                      >
                        <CalendarEventCard
                          event={event}
                          onClick={() => onEventClick(event)}
                        />
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalendarWeekView;
