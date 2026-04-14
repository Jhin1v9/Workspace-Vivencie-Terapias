// ============================================================================
// CALENDAROS - Sistema de Calendário Integrado
// Componente principal que agrupa todas as visualizações
// ============================================================================

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CalendarDays, Clock, Plus } from 'lucide-react';
import { useCalendarStore } from '@/stores/useCalendarStore';
import { CalendarHeader } from './CalendarHeader';
import { CalendarMonthGrid } from './CalendarMonthGrid';
import { CalendarWeekView } from './CalendarWeekView';
import { CalendarEventCard } from './CalendarEventCard';
import { EventoModal } from './EventoModal';
import { Button } from '@/components/ui/button';
import type { CalendarEvent } from '@/types/calendar';

// ============================================================================
// PAINEL LATERAL: PRÓXIMOS EVENTOS
// ============================================================================

function SidebarProximosEventos({ 
  eventos, 
  onEventClick 
}: { 
  eventos: CalendarEvent[]; 
  onEventClick: (event: CalendarEvent) => void;
}) {
  const hoje = new Date();
  const eventosHoje = eventos.filter(e => {
    const d = new Date(e.start);
    return d.getDate() === hoje.getDate() && 
           d.getMonth() === hoje.getMonth() && 
           d.getFullYear() === hoje.getFullYear();
  });
  
  const eventosFuturos = eventos.filter(e => new Date(e.start) > hoje).slice(0, 5);
  const eventosAtrasados = eventos.filter(e => {
    const d = new Date(e.start);
    return d < hoje && e.status !== 'concluido' && e.status !== 'cancelado';
  });
  
  return (
    <div className="w-72 border-l border-white/10 bg-slate-900/20 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-auris-sage" />
          Próximos
        </h3>
      </div>
      
      {/* Conteúdo */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Eventos atrasados */}
        {eventosAtrasados.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              Atrasados ({eventosAtrasados.length})
            </h4>
            <div className="space-y-2">
              {eventosAtrasados.map(event => (
                <CalendarEventCard
                  key={event.id}
                  event={event}
                  onClick={() => onEventClick(event)}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Eventos de hoje */}
        {eventosHoje.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-auris-sage uppercase tracking-wider mb-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-auris-sage animate-pulse" />
              Hoje ({eventosHoje.length})
            </h4>
            <div className="space-y-2">
              {eventosHoje.map(event => (
                <CalendarEventCard
                  key={event.id}
                  event={event}
                  onClick={() => onEventClick(event)}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Eventos futuros */}
        <div>
          <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
            Próximos dias
          </h4>
          <div className="space-y-2">
            {eventosFuturos.length === 0 && eventosHoje.length === 0 && eventosAtrasados.length === 0 ? (
              <p className="text-xs text-slate-600 text-center py-4">
                Nenhum evento agendado
              </p>
            ) : (
              eventosFuturos.map(event => (
                <CalendarEventCard
                  key={event.id}
                  event={event}
                  onClick={() => onEventClick(event)}
                />
              ))
            )}
          </div>
        </div>
        
        {/* Sugestões da Aura */}
        <div className="mt-6 p-3 rounded-lg bg-gradient-to-br from-auris-indigo/10 to-auris-purple/10 border border-auris-indigo/20">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-3 h-3 text-auris-amber" />
            <span className="text-xs font-medium text-auris-indigo">Aura Sugeriu</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Baseado no histórico, sugiro agendar retornos para pacientes que completaram 7 dias desde a última sessão.
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export function CalendarOS() {
  // Store
  const {
    events,
    viewMode,
    currentDate,
    filtros,
    setViewMode,
    goToToday,
    goToNext,
    goToPrevious,
    selectEvent,
    toggleFiltro,

    getProximosEventos,
  } = useCalendarStore();
  
  // Estado local
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [dataInicial, setDataInicial] = useState<Date | undefined>();
  const [horaInicial, setHoraInicial] = useState<number | undefined>();
  
  // Filtrar eventos
  const filteredEvents = useMemo(() => {
    return events.filter(event => filtros.includes(event.type));
  }, [events, filtros]);
  
  // Próximos eventos para sidebar
  const proximosEventos = useMemo(() => getProximosEventos(10), [getProximosEventos, events]);
  
  // Handlers
  const handleEventClick = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setDataInicial(undefined);
    setHoraInicial(undefined);
    setShowModal(true);
    selectEvent(event.id);
  }, [selectEvent]);
  
  const handleDateClick = useCallback((date: Date) => {
    // Abrir modal de criação com a data pré-selecionada
    setSelectedEvent(null);
    setDataInicial(date);
    setHoraInicial(undefined);
    setShowModal(true);
  }, []);
  
  const handleSlotClick = useCallback((date: Date, hour: number) => {
    // Abrir modal de criação com data e hora pré-selecionadas
    setSelectedEvent(null);
    setDataInicial(date);
    setHoraInicial(hour);
    setShowModal(true);
  }, []);
  
  const handleAddEvent = useCallback(() => {
    // Abrir modal de criação vazio
    setSelectedEvent(null);
    setDataInicial(new Date());
    setHoraInicial(undefined);
    setShowModal(true);
  }, []);
  
  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setSelectedEvent(null);
    setDataInicial(undefined);
    setHoraInicial(undefined);
    selectEvent(null);
  }, [selectEvent]);
  
  // Renderizar visualização correta
  const renderView = useCallback(() => {
    switch (viewMode) {
      case 'mes':
        return (
          <CalendarMonthGrid
            year={currentDate.getFullYear()}
            month={currentDate.getMonth()}
            events={filteredEvents}
            onEventClick={handleEventClick}
            onDateClick={handleDateClick}
          />
        );
        
      case 'semana':
        return (
          <CalendarWeekView
            weekStart={currentDate}
            events={filteredEvents}
            onEventClick={handleEventClick}
            onSlotClick={handleSlotClick}
          />
        );
        
      case 'dia':
        // Simplificado: mostra semana com apenas 1 dia focado
        return (
          <CalendarWeekView
            weekStart={currentDate}
            events={filteredEvents}
            onEventClick={handleEventClick}
            onSlotClick={handleSlotClick}
          />
        );
        
      case 'timeline':
        // Timeline simples
        return (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {filteredEvents.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Nenhum evento encontrado</p>
                  <Button 
                    variant="outline" 
                    className="mt-4 border-auris-sage/50 text-auris-sage"
                    onClick={handleAddEvent}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Agendamento
                  </Button>
                </div>
              ) : (
                filteredEvents.map(event => (
                  <CalendarEventCard
                    key={event.id}
                    event={event}
                    onClick={() => handleEventClick(event)}
                  />
                ))
              )}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  }, [viewMode, currentDate, filteredEvents, handleEventClick, handleDateClick, handleSlotClick, handleAddEvent]);
  
  return (
    <div className="flex h-full bg-slate-950">
      {/* Área principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <CalendarHeader
          currentDate={currentDate}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onPrevious={goToPrevious}
          onNext={goToNext}
          onToday={goToToday}
          onAddEvent={handleAddEvent}
          filtros={filtros}
          onToggleFiltro={toggleFiltro}
        />
        
        {/* Conteúdo da visualização */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={viewMode + currentDate.toISOString()}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      {/* Sidebar */}
      <SidebarProximosEventos 
        eventos={proximosEventos}
        onEventClick={handleEventClick}
      />
      
      {/* Modal de evento */}
      <EventoModal
        isOpen={showModal}
        onClose={handleCloseModal}
        evento={selectedEvent}
        dataInicial={dataInicial}
        horaInicial={horaInicial}
      />
    </div>
  );
}

export default CalendarOS;
