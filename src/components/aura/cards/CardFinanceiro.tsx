// CardFinanceiro - Card para exibir informações financeiras

import React from 'react';
import { DollarSign, AlertCircle } from 'lucide-react';
import { CardBase } from './CardBase';
import type { CardAction } from './CardBase';
import { formatCurrency } from '@/lib/formatters';

export interface FinanceiroData {
  tipo: 'resumo' | 'transacao' | 'debito';
  titulo: string;
  valor?: number;
  valorPendente?: number;
  status?: 'recebido' | 'pendente' | 'atrasado';
  pacienteNome?: string;
  metodoPagamento?: string;
  data?: Date;
}

interface CardFinanceiroProps {
  data: FinanceiroData;
  onReceber?: () => void;
  onVerDetalhes?: () => void;
  compact?: boolean;
}

export const CardFinanceiro: React.FC<CardFinanceiroProps> = ({
  data,
  onReceber,
  onVerDetalhes,
  compact = false,
}) => {
  const isDebito = data.tipo === 'debito' || (data.valorPendente && data.valorPendente > 0);
  const color = isDebito ? 'rose' : 'sage' as const;
  
  const actions: CardAction[] = [];
  
  if (data.status === 'pendente' && onReceber) {
    actions.push({
      label: 'Receber',
      onClick: onReceber,
      icon: DollarSign,
      variant: 'primary',
    });
  }
  
  if (onVerDetalhes) {
    actions.push({
      label: 'Detalhes',
      onClick: onVerDetalhes,
      variant: 'secondary',
    });
  }

  return (
    <CardBase
      title={data.titulo}
      subtitle={data.pacienteNome}
      icon={isDebito ? AlertCircle : DollarSign}
      color={color}
      actions={actions}
      compact={compact}
    >
      <div className="space-y-3">
        {/* Valor Principal */}
        {data.valor !== undefined && (
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl font-bold ${isDebito ? 'text-rose-400' : 'text-emerald-400'}`}>
              {formatCurrency(data.valor)}
            </span>
            {data.status && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                data.status === 'recebido' ? 'bg-emerald-500/20 text-emerald-300' :
                data.status === 'pendente' ? 'bg-amber-500/20 text-amber-300' :
                'bg-rose-500/20 text-rose-300'
              }`}>
                {data.status === 'recebido' ? 'Recebido' : 
                 data.status === 'pendente' ? 'Pendente' : 'Atrasado'}
              </span>
            )}
          </div>
        )}

        {/* Valor Pendente */}
        {data.valorPendente !== undefined && data.valorPendente > 0 && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <div>
              <p className="text-xs text-rose-300/70">Débito pendente</p>
              <p className="text-lg font-semibold text-rose-400">
                {formatCurrency(data.valorPendente)}
              </p>
            </div>
          </div>
        )}

        {/* Detalhes */}
        <div className="flex flex-wrap gap-2 text-xs text-white/50">
          {data.metodoPagamento && (
            <span className="px-2 py-0.5 rounded-full bg-white/5">
              {data.metodoPagamento}
            </span>
          )}
          {data.data && (
            <span className="px-2 py-0.5 rounded-full bg-white/5">
              {new Intl.DateTimeFormat('pt-BR', { 
                day: '2-digit', 
                month: 'short' 
              }).format(data.data)}
            </span>
          )}
        </div>
      </div>
    </CardBase>
  );
};

export default CardFinanceiro;
