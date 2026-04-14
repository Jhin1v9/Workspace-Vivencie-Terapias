// ============================================================================
// CALENDAR STORE - Estado global do sistema de calendário
// ============================================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { 
  CalendarEvent, 
  CalendarEventType, 
  CalendarEventStatus,
  CalendarViewMode 
} from '@/types/calendar';

// ============================================================================
// ESTADO
// ============================================================================

interface CalendarStoreState {
  // Dados
  events: CalendarEvent[];
  
  // UI State
  viewMode: CalendarViewMode;
  currentDate: Date;
  selectedEventId: string | null;
  filtros: CalendarEventType[];
  
  // Configurações
  config: {
    horaInicio: number;
    horaFim: number;
    slotDuracao: number;
    diasTrabalho: number[];
  };
}

interface CalendarStoreActions {
  // CRUD Eventos
  addEvent: (event: Omit<CalendarEvent, 'id'>) => CalendarEvent;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  getEventById: (id: string) => CalendarEvent | undefined;
  
  // Queries
  getEventsByDate: (date: Date) => CalendarEvent[];
  getEventsByDateRange: (start: Date, end: Date) => CalendarEvent[];
  getEventsByPaciente: (pacienteId: string) => CalendarEvent[];
  getEventsByStatus: (status: CalendarEventStatus) => CalendarEvent[];
  getProximosEventos: (limit?: number) => CalendarEvent[];
  getEventosHoje: () => CalendarEvent[];
  getEventosAtrasados: () => CalendarEvent[];
  
  // Ações de UI
  setViewMode: (mode: CalendarViewMode) => void;
  setCurrentDate: (date: Date) => void;
  goToToday: () => void;
  goToNext: () => void;
  goToPrevious: () => void;
  selectEvent: (id: string | null) => void;
  toggleFiltro: (type: CalendarEventType) => void;
  setFiltros: (types: CalendarEventType[]) => void;
  
  // Ações especiais
  duplicarEvento: (id: string, newDate: Date) => CalendarEvent | null;
  moverEvento: (id: string, newStart: Date, newEnd: Date) => void;
  completarEvento: (id: string) => void;
  cancelarEvento: (id: string) => void;
  confirmarEvento: (id: string) => void;
  
  // Integração com sessões
  criarEventoDeSessao: (sessaoData: {
    pacienteId: string;
    pacienteNome: string;
    data: string;
    duracaoMinutos: number;
    tipo: CalendarEventType;
  }) => CalendarEvent;
}

// ============================================================================
// HELPERS
// ============================================================================

const isSameDay = (d1: Date, d2: Date): boolean => {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};

const isBeforeToday = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(date) < today;
};

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

// ============================================================================
// STORE
// ============================================================================

export const useCalendarStore = create<CalendarStoreState & CalendarStoreActions>()(
  persist(
    (set, get) => ({
      // Estado inicial
      events: [],
      viewMode: 'mes',
      currentDate: new Date(),
      selectedEventId: null,
      filtros: ['consulta', 'retorno', 'revisao', 'bloqueio', 'aura_sugestao'],
      config: {
        horaInicio: 8,
        horaFim: 20,
        slotDuracao: 30,
        diasTrabalho: [1, 2, 3, 4, 5], // Seg-Sex
      },

      // -------------------------------------------------------------------------
      // CRUD
      // -------------------------------------------------------------------------
      
      addEvent: (eventData) => {
        const newEvent: CalendarEvent = {
          ...eventData,
          id: uuidv4(),
        };
        
        set((state) => ({
          events: [...state.events, newEvent].sort(
            (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
          ),
        }));
        
        return newEvent;
      },

      updateEvent: (id, updates) => {
        set((state) => ({
          events: state.events.map((event) =>
            event.id === id ? { ...event, ...updates } : event
          ),
        }));
      },

      deleteEvent: (id) => {
        set((state) => ({
          events: state.events.filter((event) => event.id !== id),
          selectedEventId: state.selectedEventId === id ? null : state.selectedEventId,
        }));
      },

      getEventById: (id) => {
        return get().events.find((event) => event.id === id);
      },

      // -------------------------------------------------------------------------
      // QUERIES
      // -------------------------------------------------------------------------
      
      getEventsByDate: (date) => {
        return get().events.filter((event) => isSameDay(new Date(event.start), date));
      },

      getEventsByDateRange: (start, end) => {
        return get().events.filter((event) => {
          const eventStart = new Date(event.start);
          return eventStart >= start && eventStart <= end;
        });
      },

      getEventsByPaciente: (pacienteId) => {
        return get().events.filter((event) => event.pacienteId === pacienteId);
      },

      getEventsByStatus: (status) => {
        return get().events.filter((event) => event.status === status);
      },

      getProximosEventos: (limit = 5) => {
        const now = new Date();
        return get()
          .events.filter((event) => new Date(event.start) >= now)
          .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
          .slice(0, limit);
      },

      getEventosHoje: () => {
        return get().events.filter((event) => isSameDay(new Date(event.start), new Date()));
      },

      getEventosAtrasados: () => {
        return get().events.filter(
          (event) =>
            isBeforeToday(new Date(event.start)) &&
            event.status !== 'concluido' &&
            event.status !== 'cancelado'
        );
      },

      // -------------------------------------------------------------------------
      // UI ACTIONS
      // -------------------------------------------------------------------------
      
      setViewMode: (mode) => set({ viewMode: mode }),
      
      setCurrentDate: (date) => set({ currentDate: date }),
      
      goToToday: () => set({ currentDate: new Date() }),
      
      goToNext: () => {
        const { viewMode, currentDate } = get();
        if (viewMode === 'mes') {
          set({ currentDate: addMonths(currentDate, 1) });
        } else if (viewMode === 'semana' || viewMode === 'dia') {
          set({ currentDate: addDays(currentDate, viewMode === 'semana' ? 7 : 1) });
        }
      },
      
      goToPrevious: () => {
        const { viewMode, currentDate } = get();
        if (viewMode === 'mes') {
          set({ currentDate: addMonths(currentDate, -1) });
        } else if (viewMode === 'semana' || viewMode === 'dia') {
          set({ currentDate: addDays(currentDate, viewMode === 'semana' ? -7 : -1) });
        }
      },
      
      selectEvent: (id) => set({ selectedEventId: id }),
      
      toggleFiltro: (type) => {
        set((state) => ({
          filtros: state.filtros.includes(type)
            ? state.filtros.filter((t) => t !== type)
            : [...state.filtros, type],
        }));
      },
      
      setFiltros: (types) => set({ filtros: types }),

      // -------------------------------------------------------------------------
      // AÇÕES ESPECIAIS
      // -------------------------------------------------------------------------
      
      duplicarEvento: (id, newDate) => {
        const event = get().getEventById(id);
        if (!event) return null;
        
        const oldStart = new Date(event.start);
        const oldEnd = new Date(event.end);
        const duration = oldEnd.getTime() - oldStart.getTime();
        
        const newStart = new Date(newDate);
        newStart.setHours(oldStart.getHours(), oldStart.getMinutes());
        
        const newEnd = new Date(newStart.getTime() + duration);
        
        return get().addEvent({
          ...event,
          start: newStart.toISOString(),
          end: newEnd.toISOString(),
          status: 'agendado',
        });
      },

      moverEvento: (id, newStart, newEnd) => {
        get().updateEvent(id, {
          start: newStart.toISOString(),
          end: newEnd.toISOString(),
        });
      },

      completarEvento: (id) => {
        get().updateEvent(id, { status: 'concluido' });
      },

      cancelarEvento: (id) => {
        get().updateEvent(id, { status: 'cancelado' });
      },

      confirmarEvento: (id) => {
        get().updateEvent(id, { status: 'confirmado' });
      },

      // -------------------------------------------------------------------------
      // INTEGRAÇÃO
      // -------------------------------------------------------------------------
      
      criarEventoDeSessao: (sessaoData) => {
        const start = new Date(sessaoData.data);
        const end = new Date(start.getTime() + sessaoData.duracaoMinutos * 60000);
        
        return get().addEvent({
          title: `Sessão - ${sessaoData.pacienteNome}`,
          type: sessaoData.tipo,
          start: start.toISOString(),
          end: end.toISOString(),
          pacienteId: sessaoData.pacienteId,
          pacienteNome: sessaoData.pacienteNome,
          status: 'agendado',
          color: sessaoData.tipo === 'consulta' ? 'bg-auris-sage' : 'bg-blue-500',
          lembreteAura: true,
        });
      },
    }),
    {
      name: 'auris-calendar-storage',
      partialize: (state) => ({
        events: state.events,
        config: state.config,
        filtros: state.filtros,
      }),
    }
  )
);

export default useCalendarStore;
