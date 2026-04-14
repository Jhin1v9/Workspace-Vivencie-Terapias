// ============================================================================
// FINANÇAS DASHBOARD - Visão geral financeira
// ============================================================================

import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Activity } from 'lucide-react';
import { useFinancasStore } from '@/stores/useFinancasStore';

export const FinancasDashboard: React.FC = () => {
  const { calcularResumo, servicos } = useFinancasStore();
  
  const hoje = new Date();
  const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
  
  const resumo = calcularResumo(inicioMes, fimMes);
  
  // Cores para categorias
  const coresCategoria: Record<string, string> = {
    auriculoterapia: '#10b981',
    reiki: '#8b5cf6',
    massagem: '#f59e0b',
    acupuntura: '#ef4444',
    fitoterapia: '#22c55e',
    outro: '#6b7280',
  };
  
  return (
    <div className="space-y-6">
      {/* Gráfico de Categorias */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900/50 border border-white/10 rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            Receitas por Categoria
          </h3>
          
          {resumo.porCategoria.length === 0 ? (
            <p className="text-slate-400 text-center py-8">
              Nenhuma receita registrada este mês
            </p>
          ) : (
            <div className="space-y-3">
              {resumo.porCategoria.map((cat) => (
                <div key={cat.categoria} className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: coresCategoria[cat.categoria] }}
                  />
                  <span className="flex-1 text-white capitalize">{cat.categoria}</span>
                  <span className="text-slate-400">{cat.percentual.toFixed(1)}%</span>
                  <span className="text-emerald-400 font-medium">
                    R$ {cat.valor.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900/50 border border-white/10 rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-400" />
            Métodos de Pagamento
          </h3>
          
          {resumo.porMetodoPagamento.length === 0 ? (
            <p className="text-slate-400 text-center py-8">
              Nenhuma receita registrada este mês
            </p>
          ) : (
            <div className="space-y-3">
              {resumo.porMetodoPagamento.map((met) => (
                <div key={met.metodo} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="flex-1 text-white capitalize">
                    {met.metodo.replace('_', ' ')}
                  </span>
                  <span className="text-slate-400">{met.percentual.toFixed(1)}%</span>
                  <span className="text-emerald-400 font-medium">
                    R$ {met.valor.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
      
      {/* Resumo Geral */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-900/50 border border-white/10 rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Resumo do Mês</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-slate-800/50 rounded-xl">
            <p className="text-slate-400 text-sm">Total Receitas</p>
            <p className="text-2xl font-bold text-emerald-400">
              R$ {resumo.totalReceitas.toFixed(2)}
            </p>
          </div>
          
          <div className="text-center p-4 bg-slate-800/50 rounded-xl">
            <p className="text-slate-400 text-sm">Recebido</p>
            <p className="text-2xl font-bold text-blue-400">
              R$ {resumo.totalReceitasRecebidas.toFixed(2)}
            </p>
          </div>
          
          <div className="text-center p-4 bg-slate-800/50 rounded-xl">
            <p className="text-slate-400 text-sm">Pendente</p>
            <p className="text-2xl font-bold text-amber-400">
              R$ {resumo.totalReceitasPendentes.toFixed(2)}
            </p>
          </div>
          
          <div className="text-center p-4 bg-slate-800/50 rounded-xl">
            <p className="text-slate-400 text-sm">Saldo Líquido</p>
            <p className={`text-2xl font-bold ${resumo.saldoLiquido >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              R$ {resumo.saldoLiquido.toFixed(2)}
            </p>
          </div>
        </div>
      </motion.div>
      
      {/* Serviços Ativos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-slate-900/50 border border-white/10 rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Serviços Cadastrados</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {servicos.filter(s => s.ativo).map((servico) => (
            <div
              key={servico.id}
              className="p-4 bg-slate-800/50 rounded-xl border border-white/5"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${servico.cor}20` }}
                >
                  <span style={{ color: servico.cor }}>●</span>
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{servico.nome}</p>
                  <p className="text-emerald-400">
                    R$ {servico.valorPadrao.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default FinancasDashboard;
