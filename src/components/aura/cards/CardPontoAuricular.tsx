// CardPontoAuricular - Card para exibir pontos auriculares

import React from 'react';
import { MapPin, Target, Activity, Info } from 'lucide-react';
import { CardBase } from './CardBase';
import type { CardAction } from './CardBase';

export interface PontoAuricularData {
  id: string;
  nome: string;
  codigo: string;
  regiao: string;
  prioridade: 'master' | 'estrela' | 'importante' | 'comum';
  funcao: string;
  indicacoes: string[];
  sistema: string;
  coordenadas?: { x: number; y: number };
}

interface CardPontoAuricularProps {
  ponto: PontoAuricularData;
  onSelecionar?: () => void;
  onVerNoMapa?: () => void;
  selecionado?: boolean;
  compact?: boolean;
}

const prioridadeConfig = {
  master: { cor: 'rose' as const, label: 'Master', icone: Target },
  estrela: { cor: 'amber' as const, label: 'Estrela', icone: Activity },
  importante: { cor: 'blue' as const, label: 'Importante', icone: Info },
  comum: { cor: 'slate' as const, label: 'Comum', icone: MapPin },
};

export const CardPontoAuricular: React.FC<CardPontoAuricularProps> = ({
  ponto,
  onSelecionar,
  onVerNoMapa,
  selecionado = false,
  compact = false,
}) => {
  const config = prioridadeConfig[ponto.prioridade];
  const Icon = config.icone;

  const actions: CardAction[] = [];
  
  if (onSelecionar) {
    actions.push({
      label: selecionado ? 'Remover' : 'Selecionar',
      onClick: onSelecionar,
      icon: selecionado ? undefined : Target,
      variant: selecionado ? 'secondary' : 'primary',
    });
  }
  
  if (onVerNoMapa) {
    actions.push({
      label: 'Mapa',
      onClick: onVerNoMapa,
      icon: MapPin,
      variant: 'secondary',
    });
  }

  return (
    <CardBase
      title={ponto.nome}
      subtitle={`${ponto.codigo} • ${ponto.regiao}`}
      icon={Icon}
      color={config.cor}
      actions={actions}
      compact={compact}
      className={selecionado ? 'ring-2 ring-emerald-500/50' : ''}
    >
      <div className="space-y-3">
        {/* Badge de Prioridade e Sistema */}
        <div className="flex flex-wrap gap-2">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-${config.cor}-500/20 text-${config.cor}-300`}>
            <Icon className="w-3 h-3" />
            {config.label}
          </span>
          
          <span className="px-2 py-0.5 rounded-full bg-white/5 text-xs text-white/50">
            {ponto.sistema}
          </span>
        </div>

        {/* Função */}
        <p className="text-sm text-white/70 leading-relaxed">
          {ponto.funcao}
        </p>

        {/* Indicações */}
        {ponto.indicacoes.length > 0 && (
          <div className="pt-2 border-t border-white/10">
            <p className="text-xs font-medium text-white/50 uppercase tracking-wider mb-1">
              Indicações
            </p>
            <div className="flex flex-wrap gap-1">
              {ponto.indicacoes.slice(0, compact ? 3 : 5).map((indicacao, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 rounded-full bg-white/5 text-xs text-white/60"
                >
                  {indicacao}
                </span>
              ))}
              {ponto.indicacoes.length > (compact ? 3 : 5) && (
                <span className="px-2 py-0.5 rounded-full bg-white/5 text-xs text-white/40">
                  +{ponto.indicacoes.length - (compact ? 3 : 5)}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Coordenadas (se disponível) */}
        {ponto.coordenadas && !compact && (
          <div className="flex items-center gap-2 text-xs text-white/40">
            <MapPin className="w-3 h-3" />
            Posição: {ponto.coordenadas.x}%, {ponto.coordenadas.y}%
          </div>
        )}
      </div>
    </CardBase>
  );
};

export default CardPontoAuricular;
