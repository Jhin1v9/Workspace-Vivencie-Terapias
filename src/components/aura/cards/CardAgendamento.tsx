// CardAgendamento - Card para exibir agendamentos/eventos

import React from 'react';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { CardBase } from './CardBase';
import type { CardAction } from './CardBase';

export interface AgendamentoData {
  id: string;
  titulo: string;
  pacienteNome: string;
  data: Date;
  duracaoMinutos: number;
  status: 'agendado' | 'confirmado' | 'em_andamento' | 'concluido' | 'cancelado';
  tipo: string;
  observacoes?: string;
}

interface CardAgendamentoProps {
  agendamento: AgendamentoData;
  onConfirmar?: () => void;
  onCancelar?: () => void;
  onIniciar?: () => void;
  compact?: boolean;
}

const statusConfig = {
  agendado: { cor: 'amber' as const, icon: AlertCircle, label: 'Agendado' },
  confirmado: { cor: 'blue' as const, icon: CheckCircle, label: 'Confirmado' },
  em_andamento: { cor: 'sage' as const, icon: Clock, label: 'Em Andamento' },
  concluido: { cor: 'slate' as const, icon: CheckCircle, label: 'Concluído' },
  cancelado: { cor: 'rose' as const, icon: XCircle, label: 'Cancelado' },
};

export const CardAgendamento: React.FC<CardAgendamentoProps> = ({
  agendamento,
  onConfirmar,
  onCancelar,
  onIniciar,
  compact = false,
}) => {
  const status = statusConfig[agendamento.status];
  const StatusIcon = status.icon;

  const formatarData = (data: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(data);
  };

  const actions: CardAction[] = [];
  
  if (agendamento.status === 'agendado' && onConfirmar) {
    actions.push({
      label: 'Confirmar',
      onClick: onConfirmar,
      icon: CheckCircle,
      variant: 'primary',
    });
  }
  
  if (agendamento.status === 'confirmado' && onIniciar) {
    actions.push({
      label: 'Iniciar',
      onClick: onIniciar,
      icon: Clock,
      variant: 'primary',
    });
  }
  
  if ((agendamento.status === 'agendado' || agendamento.status === 'confirmado') && onCancelar) {
    actions.push({
      label: 'Cancelar',
      onClick: onCancelar,
      icon: XCircle,
      variant: 'secondary',
    });
  }

  return (
    <CardBase
      title={agendamento.titulo}
      subtitle={agendamento.pacienteNome}
      icon={Calendar}
      color={status.cor}
      actions={actions}
      compact={compact}
    >
      <div className="space-y-2">
        {/* Data e Hora */}
        <div className="flex items-center gap-2 text-white/80">
          <Clock className="w-4 h-4 text-white/50" />
          <span className="text-sm">
            {formatarData(agendamento.data)}
          </span>
          <span className="text-white/40">•</span>
          <span className="text-sm text-white/60">
            {agendamento.duracaoMinutos} min
          </span>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-${status.cor}-500/20 text-${status.cor}-300`}>
            <StatusIcon className="w-3 h-3" />
            {status.label}
          </span>
          
          <span className="px-2 py-0.5 rounded-full bg-white/5 text-xs text-white/50">
            {agendamento.tipo}
          </span>
        </div>

        {/* Observações */}
        {agendamento.observacoes && !compact && (
          <p className="text-xs text-white/50 mt-2 line-clamp-2">
            {agendamento.observacoes}
          </p>
        )}
      </div>
    </CardBase>
  );
};

export default CardAgendamento;
