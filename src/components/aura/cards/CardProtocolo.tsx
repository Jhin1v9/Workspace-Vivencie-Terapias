// CardProtocolo - Card para exibir protocolos de auriculoterapia

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Play, MapPin } from 'lucide-react';
import { CardBase } from './CardBase';
import type { CardAction } from './CardBase';

export interface ProtocoloData {
  id: string;
  nome: string;
  descricao: string;
  pontos: {
    id: string;
    nome: string;
    codigo: string;
    regiao: string;
    prioridade: 'master' | 'estrela' | 'importante' | 'comum';
  }[];
  indicacoes: string[];
}

interface CardProtocoloProps {
  protocolo: ProtocoloData;
  onAplicar?: () => void;
  onVerMapa?: () => void;
  compact?: boolean;
}

const prioridadeConfig = {
  master: { cor: 'text-red-400', bg: 'bg-red-400/20', label: 'Master' },
  estrela: { cor: 'text-amber-400', bg: 'bg-amber-400/20', label: 'Estrela' },
  importante: { cor: 'text-blue-400', bg: 'bg-blue-400/20', label: 'Importante' },
  comum: { cor: 'text-slate-400', bg: 'bg-slate-400/20', label: 'Comum' },
};

export const CardProtocolo: React.FC<CardProtocoloProps> = ({
  protocolo,
  onAplicar,
  onVerMapa,
  compact = false,
}) => {
  const actions: CardAction[] = [];
  
  if (onAplicar) {
    actions.push({
      label: 'Aplicar',
      onClick: onAplicar,
      icon: Play,
      variant: 'primary',
    });
  }
  
  if (onVerMapa) {
    actions.push({
      label: 'Ver no Mapa',
      onClick: onVerMapa,
      icon: MapPin,
      variant: 'secondary',
    });
  }

  return (
    <CardBase
      title={protocolo.nome}
      subtitle={protocolo.descricao}
      icon={Sparkles}
      color="violet"
      actions={actions}
      compact={compact}
    >
      {/* Pontos do Protocolo */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-white/60 uppercase tracking-wider">
          Pontos ({protocolo.pontos.length})
        </p>
        
        <div className="flex flex-wrap gap-2">
          {protocolo.pontos.map((ponto) => {
            const config = prioridadeConfig[ponto.prioridade];
            
            return (
              <motion.div
                key={ponto.id}
                whileHover={{ scale: 1.05 }}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${config.bg}`}
              >
                <span className={`w-2 h-2 rounded-full ${config.cor.replace('text-', 'bg-')}`} />
                <span className={`text-xs font-medium ${config.cor}`}>
                  {ponto.nome}
                </span>
                <span className="text-[10px] text-white/40">
                  {ponto.codigo}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Indicações */}
      {protocolo.indicacoes.length > 0 && (
        <div className="mt-4 pt-3 border-t border-white/10">
          <p className="text-xs font-medium text-white/60 uppercase tracking-wider mb-2">
            Indicações
          </p>
          <div className="flex flex-wrap gap-1">
            {protocolo.indicacoes.slice(0, compact ? 3 : 5).map((indicacao, index) => (
              <span
                key={index}
                className="px-2 py-0.5 rounded-full bg-white/5 text-xs text-white/70"
              >
                {indicacao}
              </span>
            ))}
            {protocolo.indicacoes.length > (compact ? 3 : 5) && (
              <span className="px-2 py-0.5 rounded-full bg-white/5 text-xs text-white/40">
                +{protocolo.indicacoes.length - (compact ? 3 : 5)}
              </span>
            )}
          </div>
        </div>
      )}
    </CardBase>
  );
};

export default CardProtocolo;
