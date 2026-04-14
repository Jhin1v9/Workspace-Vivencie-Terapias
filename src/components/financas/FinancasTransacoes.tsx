// ============================================================================
// FINANÇAS TRANSAÇÕES - Lista e gestão de lançamentos
// ============================================================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Edit2, 
  Trash2, 
  Plus,
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react';
import { useFinancasStore } from '@/stores/useFinancasStore';
import type { TransacaoFinanceira, StatusTransacao } from '@/types/financas';

interface FinancasTransacoesProps {
  onEditar: (transacao: TransacaoFinanceira) => void;
  onNovo: () => void;
}

const statusConfig: Record<StatusTransacao, { label: string; cor: string; icone: any }> = {
  recebido: { label: 'Recebido', cor: 'text-emerald-400', icone: CheckCircle2 },
  pendente: { label: 'Pendente', cor: 'text-amber-400', icone: Clock },
  cancelado: { label: 'Cancelado', cor: 'text-red-400', icone: XCircle },
};

export const FinancasTransacoes: React.FC<FinancasTransacoesProps> = ({
  onEditar,
  onNovo,
}) => {
  const { removerTransacao, getTransacoesByFiltro } = useFinancasStore();
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<StatusTransacao | 'todos'>('todos');
  
  const transacoesFiltradas = getTransacoesByFiltro({
    busca: busca || undefined,
    status: filtroStatus === 'todos' ? undefined : filtroStatus,
  });
  
  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar transações..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
        
        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value as StatusTransacao | 'todos')}
          className="px-4 py-2 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50"
        >
          <option value="todos">Todos os status</option>
          <option value="recebido">Recebido</option>
          <option value="pendente">Pendente</option>
          <option value="cancelado">Cancelado</option>
        </select>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNovo}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium"
        >
          <Plus className="w-5 h-5" />
          Novo
        </motion.button>
      </div>
      
      {/* Lista */}
      <div className="bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden">
        {transacoesFiltradas.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-slate-400">Nenhuma transação encontrada</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {transacoesFiltradas.map((transacao, index) => {
              const StatusIcon = statusConfig[transacao.status].icone;
              
              return (
                <motion.div
                  key={transacao.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors"
                >
                  {/* Status Icon */}
                  <div className={`p-2 rounded-lg bg-slate-800 ${statusConfig[transacao.status].cor}`}>
                    <StatusIcon className="w-5 h-5" />
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1">
                    <p className="text-white font-medium">{transacao.descricao}</p>
                    <p className="text-slate-400 text-sm">
                      {transacao.pacienteNome || 'Sem paciente'} • {' '}
                      {new Date(transacao.data).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  
                  {/* Valor */}
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      transacao.tipo === 'receita' ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {transacao.tipo === 'receita' ? '+' : '-'} R$ {transacao.valor.toFixed(2)}
                    </p>
                    <p className="text-slate-400 text-xs capitalize">
                      {transacao.metodoPagamento.replace('_', ' ')}
                    </p>
                  </div>
                  
                  {/* Ações */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEditar(transacao)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removerTransacao(transacao.id)}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancasTransacoes;
