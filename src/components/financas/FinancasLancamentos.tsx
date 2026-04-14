// ============================================================================
// FINANÇAS LANÇAMENTOS - Lista e filtros de transações
// ============================================================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, TrendingDown, Calendar, Trash2, Check } from 'lucide-react';
import { useFinancasStore } from '@/stores/useFinancasStore';
import { NovaTransacaoModal } from './NovaTransacaoModal';


export const FinancasLancamentos: React.FC = () => {
  const { transacoes, servicos, atualizarTransacao, removerTransacao } = useFinancasStore();
  const [modalAberto, setModalAberto] = useState(false);
  const [tipoModal, setTipoModal] = useState<'receita' | 'despesa'>('receita');
  const [filtro, setFiltro] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState<'todos' | 'receita' | 'despesa'>('todos');
  
  const transacoesFiltradas = transacoes
    .filter(t => tipoFiltro === 'todos' || t.tipo === tipoFiltro)
    .filter(t => {
      const termo = filtro.toLowerCase();
      return (
        t.descricao.toLowerCase().includes(termo) ||
        getServicoNome(t.servicoId).toLowerCase().includes(termo)
      );
    })
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  
  function getServicoNome(servicoId?: string) {
    if (!servicoId) return '';
    return servicos.find(s => s.id === servicoId)?.nome || '';
  }
  
  function getServicoCor(servicoId?: string) {
    if (!servicoId) return '#6b7280';
    return servicos.find(s => s.id === servicoId)?.cor || '#6b7280';
  }
  
  const abrirModal = (tipo: 'receita' | 'despesa') => {
    setTipoModal(tipo);
    setModalAberto(true);
  };
  
  return (
    <div className="space-y-6">
      {/* Ações */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => abrirModal('receita')}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium"
          >
            <TrendingUp className="w-5 h-5" />
            Nova Receita
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => abrirModal('despesa')}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium"
          >
            <TrendingDown className="w-5 h-5" />
            Nova Despesa
          </motion.button>
        </div>
        
        {/* Filtros */}
        <div className="flex gap-2 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              placeholder="Buscar..."
              className="w-48 pl-9 pr-3 py-2 bg-slate-900/50 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500/50"
            />
          </div>
          
          <select
            value={tipoFiltro}
            onChange={(e) => setTipoFiltro(e.target.value as any)}
            className="px-3 py-2 bg-slate-900/50 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500/50"
          >
            <option value="todos">Todos</option>
            <option value="receita">Receitas</option>
            <option value="despesa">Despesas</option>
          </select>
        </div>
      </div>
      
      {/* Lista */}
      <div className="bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Data</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Descrição</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Categoria</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Pagamento</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-slate-400">Valor</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-slate-400">Status</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-slate-400">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transacoesFiltradas.map((t) => (
                <motion.tr
                  key={t.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-white/5"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      {new Date(t.data).toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                  
                  <td className="px-4 py-3">
                    <p className="text-white font-medium">{t.descricao}</p>
                    {t.sessaoId && (
                      <span className="text-xs text-emerald-400">Vinculado a sessão</span>
                    )}
                  </td>
                  
                  <td className="px-4 py-3">
                    {t.servicoId ? (
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{ 
                          backgroundColor: `${getServicoCor(t.servicoId)}20`,
                          color: getServicoCor(t.servicoId)
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getServicoCor(t.servicoId) }} />
                        {getServicoNome(t.servicoId)}
                      </span>
                    ) : (
                      <span className="text-slate-500">-</span>
                    )}
                  </td>
                  
                  <td className="px-4 py-3">
                    <span className="text-slate-400 capitalize">
                      {t.metodoPagamento.replace('_', ' ')}
                    </span>
                  </td>
                  
                  <td className="px-4 py-3 text-right">
                    <span className={`font-semibold ${
                      t.tipo === 'receita' ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {t.tipo === 'receita' ? '+' : '-'} R$ {t.valor.toFixed(2)}
                    </span>
                  </td>
                  
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => atualizarTransacao(t.id, { 
                        status: t.status === 'recebido' ? 'pendente' : 'recebido' 
                      })}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                        t.status === 'recebido'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {t.status === 'recebido' ? (
                        <><Check className="w-3 h-3" /> Recebido</>
                      ) : (
                        'Pendente'
                      )}
                    </button>
                  </td>
                  
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => removerTransacao(t.id)}
                      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {transacoesFiltradas.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-slate-500">Nenhuma transação encontrada</p>
          </div>
        )}
      </div>
      
      {/* Modal */}
      <NovaTransacaoModal
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        tipoInicial={tipoModal}
      />
    </div>
  );
};

export default FinancasLancamentos;
