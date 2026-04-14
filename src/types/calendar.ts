// ============================================================================
// TIPOS DO SISTEMA DE CALENDÁRIO - CalendarOS
// ============================================================================

export type CalendarEventType = 'consulta' | 'retorno' | 'bloqueio' | 'revisao' | 'aura_sugestao';

export type CalendarEventStatus = 'agendado' | 'confirmado' | 'em_andamento' | 'concluido' | 'cancelado';

export type CalendarViewMode = 'dia' | 'semana' | 'mes' | 'timeline';

export interface CalendarEvent {
  id: string;
  title: string;
  type: CalendarEventType;
  start: string; // ISO date string
  end: string;   // ISO date string
  pacienteId?: string;
  pacienteNome?: string;
  status: CalendarEventStatus;
  color: string;
  notes?: string;
  lembreteAura?: boolean;
  // Campos de integração com sessão
  sessaoId?: string;
  protocolo?: string[]; // IDs dos pontos
}

export interface CalendarDay {
  date: Date;
  events: CalendarEvent[];
  isToday: boolean;
  isCurrentMonth: boolean;
}

export interface CalendarWeek {
  days: CalendarDay[];
  weekNumber: number;
}

export interface CalendarState {
  events: CalendarEvent[];
  viewMode: CalendarViewMode;
  currentDate: Date;
  selectedEventId: string | null;
  filtros: CalendarEventType[];
}

// Props para componentes
export interface CalendarGridProps {
  year: number;
  month: number;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onDateClick: (date: Date) => void;
  onEventDrop: (eventId: string, newDate: Date) => void;
}

export interface CalendarWeekProps {
  weekStart: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onSlotClick: (date: Date, hour: number) => void;
}

export interface CalendarDayProps {
  date: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onSlotClick: (hour: number) => void;
}

export interface CalendarEventCardProps {
  event: CalendarEvent;
  onClick: () => void;
  draggable?: boolean;
  compact?: boolean;
}

// Helpers de data
export interface DateHelpers {
  getStartOfWeek: (date: Date) => Date;
  getEndOfWeek: (date: Date) => Date;
  getStartOfMonth: (date: Date) => Date;
  getEndOfMonth: (date: Date) => Date;
  getWeeksInMonth: (year: number, month: number) => CalendarWeek[];
  isSameDay: (date1: Date, date2: Date) => boolean;
  addDays: (date: Date, days: number) => Date;
  addHours: (date: Date, hours: number) => Date;
}

// Configurações
export interface CalendarConfig {
  horaInicio: number; // 8 = 08:00
  horaFim: number;    // 20 = 20:00
  slotDuracao: number; // 30 = 30 minutos
  diasTrabalho: number[]; // [1, 2, 3, 4, 5] = seg-sex
}

// Cores por tipo de evento (tailwind classes)
export const EVENT_COLORS: Record<CalendarEventType, string> = {
  consulta: 'bg-auris-sage text-slate-900',
  retorno: 'bg-blue-500 text-white',
  bloqueio: 'bg-slate-600 text-white',
  revisao: 'bg-purple-500 text-white',
  aura_sugestao: 'bg-auris-amber text-slate-900',
};

// Cores de borda por status
export const STATUS_BORDER_COLORS: Record<CalendarEventStatus, string> = {
  agendado: 'border-white/30',
  confirmado: 'border-green-400',
  em_andamento: 'border-auris-amber animate-pulse',
  concluido: 'border-slate-500 opacity-70',
  cancelado: 'border-red-400 opacity-50 line-through',
};
