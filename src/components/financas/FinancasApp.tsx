// ============================================================================
// APP FINANÇAS - Centro de Controle Financeiro
// ============================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, 
  PieChart, 
  List, 
  Settings,
  Plus,
  Download,
  Calendar,
  Target,
  CreditCard,
  Wallet
} from 'lucide-react';
import { useFinancasStore } from '@/stores/useFinancasStore';
import { FinancasDashboard } from './FinancasDashboard';
import { FinancasTransacoes } from './FinancasTransacoes';
import { FinancasServicos } from './FinancasServicos';
import { FinancasRelatorios } from './FinancasRelatorios';
import { NovaTransacaoModal } from './NovaTransacaoModal';
import type { TransacaoFinanceira } from '@/types/financas';

type AbaFinancas = 'dashboard' | 'transacoes' | 'servicos' | 'relatorios';

export const FinancasApp: React.FC = () => {
  const [abaAtiva, setAbaAtiva] = useState<AbaFinancas>('dashboard');
  const [modalNovaTransacao, setModalNovaTransacao] = useState(false);
  const [transacaoEmEdicao, setTransacaoEmEdicao] = useState<TransacaoFinanceira | null>(null);
  
  const { 
    getReceitaHoje, 
    getReceitaMesAtual, 
    getMetaProgresso,
    transacoes 
  } = useFinancasStore();
  
  const receitaHoje = getReceitaHoje();
  const receitaMes = getReceitaMesAtual();
  const metaProgresso = getMetaProgresso();
  
  const abas = [
    { id: 'dashboard' as const, label: 'Dashboard', icone: PieChart },
    { id: 'transacoes' as const, label: 'Lançamentos', icone: List },
    { id: 'servicos' as const, label: 'Serviços', icone: Settings },
    { id: 'relatorios' as const, label: 'Relatórios', icone: Download },
  ];
  
  const renderConteudo = () => {
    switch (abaAtiva) {
      case 'dashboard':
        return <FinancasDashboard />;
      case 'transacoes':
        return <FinancasTransacoes 
          onEditar={setTransacaoEmEdicao} 
          onNovo={() => setModalNovaTransacao(true)}
        />;
      case 'servicos':
        return <FinancasServicos />;
      case 'relatorios':
        return <FinancasRelatorios />;
      default:
        return <FinancasDashboard />;
    }
  };
  
  return (
    <div className="h-full flex flex-col bg-slate-950">
      {/* Header com Cards Resumo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-emerald-400" />
              Finanças
            </h1>
            <p className="text-slate-400 mt-1">Controle financeiro integrado</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setModalNovaTransacao(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Novo Lançamento
          </motion.button>
        </div>
        
        {/* Cards Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Receita Hoje */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 border border-white/10 rounded-2xl p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Receita Hoje</p>
                <p className="text-2xl font-bold text-white mt-1">
                  R$ {receitaHoje.toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
          </motion.div>
          
          {/* Receita Mês */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900/50 border border-white/10 rounded-2xl p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Receita do Mês</p>
                <p className="text-2xl font-bold text-white mt-1">
                  R$ {receitaMes.toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </motion.div>
          
          {/* Progresso Meta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900/50 border border-white/10 rounded-2xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-slate-400 text-sm">Meta do Mês</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {metaProgresso.percentual.toFixed(0)}%
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(metaProgresso.percentual, 100)}%` }}
                className={`h-full rounded-full ${
                  metaProgresso.percentual >= 100 ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">
              R$ {metaProgresso.atual.toFixed(0)} / R$ {metaProgresso.meta.toFixed(0)}
            </p>
          </motion.div>
          
          {/* Total Transações */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-900/50 border border-white/10 rounded-2xl p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Lançamentos</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {transacoes.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Abas */}
      <div className="px-6 pt-4 border-b border-white/10">
        <div className="flex gap-2">
          {abas.map((aba) => {
            const Icone = aba.icone;
            return (
              <motion.button
                key={aba.id}
                onClick={() => setAbaAtiva(aba.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-t-xl font-medium transition-all ${
                  abaAtiva === aba.id
                    ? 'bg-slate-800 text-white border-t border-x border-white/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                <Icone className="w-4 h-4" />
                {aba.label}
              </motion.button>
            );
          })}
        </div>
      </div>
      
      {/* Conteúdo */}
      <div className="flex-1 overflow-auto p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={abaAtiva}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderConteudo()}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Modal Nova Transação */}
      <NovaTransacaoModal
        isOpen={modalNovaTransacao || !!transacaoEmEdicao}
        onClose={() => {
          setModalNovaTransacao(false);
          setTransacaoEmEdicao(null);
        }}
        tipoInicial={transacaoEmEdicao?.tipo || 'receita'}
        valorSugerido={transacaoEmEdicao?.valor}
      />
    </div>
  );
};

export default FinancasApp;
