// CardPaciente - Card para exibir informações do paciente

import React from 'react';
import { User, Phone, Calendar, FileText, TrendingUp } from 'lucide-react';
import { CardBase } from './CardBase';
import type { CardAction } from './CardBase';
import { formatPhone } from '@/lib/formatters';

export interface PacienteData {
  id: string;
  nome: string;
  telefone?: string;
  email?: string;
  dataNascimento?: Date;
  ultimaSessao?: Date;
  totalSessoes: number;
  debitoPendente?: number;
  observacoes?: string;
  avatarUrl?: string;
}

interface CardPacienteProps {
  paciente: PacienteData;
  onVerFicha?: () => void;
  onAgendar?: () => void;
  onIniciarSessao?: () => void;
  compact?: boolean;
}

export const CardPaciente: React.FC<CardPacienteProps> = ({
  paciente,
  onVerFicha,
  onAgendar,
  onIniciarSessao,
  compact = false,
}) => {
  const actions: CardAction[] = [];
  
  if (onIniciarSessao) {
    actions.push({
      label: 'Iniciar Sessão',
      onClick: onIniciarSessao,
      variant: 'primary',
    });
  }
  
  if (onAgendar) {
    actions.push({
      label: 'Agendar',
      onClick: onAgendar,
      variant: 'secondary',
    });
  }
  
  if (onVerFicha && !onIniciarSessao) {
    actions.push({
      label: 'Ver Ficha',
      onClick: onVerFicha,
      variant: 'secondary',
    });
  }

  return (
    <CardBase
      title={paciente.nome}
      subtitle={paciente.email}
      icon={User}
      color="indigo"
      actions={actions}
      compact={compact}
    >
      <div className="space-y-3">
        {/* Info de Contato */}
        <div className="space-y-1">
          {paciente.telefone && (
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Phone className="w-4 h-4 text-white/40" />
              {formatPhone(paciente.telefone)}
            </div>
          )}
          
          {paciente.dataNascimento && (
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Calendar className="w-4 h-4 text-white/40" />
              {new Intl.DateTimeFormat('pt-BR', { 
                day: '2-digit', 
                month: 'long',
                year: 'numeric'
              }).format(paciente.dataNascimento)}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex gap-4 pt-2 border-t border-white/10">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-white/80">
              {paciente.totalSessoes} sessões
            </span>
          </div>
          
          {paciente.ultimaSessao && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-white/40" />
              <span className="text-sm text-white/60">
                Última: {new Intl.DateTimeFormat('pt-BR', { 
                  day: '2-digit', 
                  month: 'short'
                }).format(paciente.ultimaSessao)}
              </span>
            </div>
          )}
        </div>

        {/* Débito Pendente */}
        {paciente.debitoPendente && paciente.debitoPendente > 0 && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
            <span className="text-xs text-rose-300/70">Débito pendente:</span>
            <span className="text-sm font-semibold text-rose-400">
              R$ {paciente.debitoPendente.toFixed(2)}
            </span>
          </div>
        )}

        {/* Observações */}
        {paciente.observacoes && !compact && (
          <div className="flex items-start gap-2 pt-2">
            <FileText className="w-4 h-4 text-white/40 mt-0.5" />
            <p className="text-xs text-white/50 line-clamp-2">
              {paciente.observacoes}
            </p>
          </div>
        )}
      </div>
    </CardBase>
  );
};

export default CardPaciente;
