// ============================================================================
// NOVA TRANSAÇÃO MODAL - Form para adicionar receitas/despesas
// ============================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, ArrowUp, ArrowDown } from 'lucide-react';
import { useFinancasStore } from '@/stores/useFinancasStore';
import type { TransacaoFinanceira, MetodoPagamento } from '@/types/financas';

interface NovaTransacaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  tipoInicial?: 'receita' | 'despesa';
  sessaoId?: string;
  pacienteId?: string;
  valorSugerido?: number;
  servicoSugerido?: string;
}

const metodosPagamento: { id: MetodoPagamento; label: string }[] = [
  { id: 'dinheiro', label: 'Dinheiro' },
  { id: 'pix', label: 'PIX' },
  { id: 'cartao_credito', label: 'Cartão de Crédito' },
  { id: 'cartao_debito', label: 'Cartão de Débito' },
  { id: 'boleto', label: 'Boleto' },
  { id: 'transferencia', label: 'Transferência' },
];

export const NovaTransacaoModal: React.FC<NovaTransacaoModalProps> = ({
  isOpen,
  onClose,
  tipoInicial = 'receita',
  sessaoId,
  pacienteId,
  valorSugerido,
  servicoSugerido,
}) => {
  const { adicionarTransacao, servicos } = useFinancasStore();
  const [tipo, setTipo] = useState<'receita' | 'despesa'>(tipoInicial);
  const [formData, setFormData] = useState({
    descricao: '',
    valor: valorSugerido ? valorSugerido.toString() : '',
    data: new Date().toISOString().split('T')[0],
    metodoPagamento: 'dinheiro' as MetodoPagamento,
    servicoId: servicoSugerido || '',
    categoria: 'outro',
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.descricao || !formData.valor) return;
    
    const transacao: Omit<TransacaoFinanceira, 'id' | 'createdAt' | 'updatedAt'> = {
      tipo,
      descricao: formData.descricao,
      valor: parseFloat(formData.valor),
      data: new Date(formData.data),
      metodoPagamento: formData.metodoPagamento,
      status: 'recebido',
      ...(tipo === 'receita' && formData.servicoId && { servicoId: formData.servicoId }),
      ...(sessaoId && { sessaoId }),
      ...(pacienteId && { pacienteId }),
    };
    
    adicionarTransacao(transacao);
    
    // Reset
    setFormData({
      descricao: '',
      valor: '',
      data: new Date().toISOString().split('T')[0],
      metodoPagamento: 'dinheiro',
      servicoId: '',
      categoria: 'outro',
    });
    onClose();
  };
  
  const servicosAtivos = servicos.filter(s => s.ativo);
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-slate-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className={`p-4 flex items-center justify-between ${
              tipo === 'receita' ? 'bg-emerald-500/20' : 'bg-red-500/20'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  tipo === 'receita' ? 'bg-emerald-500' : 'bg-red-500'
                }`}>
                  {tipo === 'receita' ? <ArrowUp className="w-5 h-5 text-white" /> : <ArrowDown className="w-5 h-5 text-white" />}
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Nova {tipo === 'receita' ? 'Receita' : 'Despesa'}
                </h3>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Tipo Toggle */}
            <div className="flex p-1 m-4 bg-slate-800 rounded-lg">
              <button
                type="button"
                onClick={() => setTipo('receita')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                  tipo === 'receita' 
                    ? 'bg-emerald-500 text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Receita
              </button>
              <button
                type="button"
                onClick={() => setTipo('despesa')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                  tipo === 'despesa' 
                    ? 'bg-red-500 text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Despesa
              </button>
            </div>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {/* Valor */}
              <div>
                <label className="text-slate-400 text-sm">Valor (R$)</label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.valor}
                    onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                    className="w-full pl-10 pr-3 py-3 bg-slate-800 border border-white/10 rounded-xl text-white text-xl font-semibold focus:outline-none focus:border-emerald-500/50"
                    placeholder="0,00"
                  />
                </div>
              </div>
              
              {/* Descrição */}
              <div>
                <label className="text-slate-400 text-sm">Descrição</label>
                <input
                  type="text"
                  required
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50"
                  placeholder={tipo === 'receita' ? 'Ex: Sessão de Auriculoterapia' : 'Ex: Aluguel do consultório'}
                />
              </div>
              
              {/* Serviço (apenas para receitas) */}
              {tipo === 'receita' && servicosAtivos.length > 0 && (
                <div>
                  <label className="text-slate-400 text-sm">Serviço</label>
                  <select
                    value={formData.servicoId}
                    onChange={(e) => {
                      const servico = servicosAtivos.find(s => s.id === e.target.value);
                      setFormData({ 
                        ...formData, 
                        servicoId: e.target.value,
                        valor: servico ? servico.valorPadrao.toString() : formData.valor,
                      });
                    }}
                    className="w-full mt-1 px-3 py-2 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50"
                  >
                    <option value="">Selecione um serviço</option>
                    {servicosAtivos.map((servico) => (
                      <option key={servico.id} value={servico.id}>
                        {servico.nome} - R$ {servico.valorPadrao.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              {/* Data */}
              <div>
                <label className="text-slate-400 text-sm">Data</label>
                <input
                  type="date"
                  required
                  value={formData.data}
                  onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>
              
              {/* Método de Pagamento */}
              <div>
                <label className="text-slate-400 text-sm">Método de Pagamento</label>
                <select
                  value={formData.metodoPagamento}
                  onChange={(e) => setFormData({ ...formData, metodoPagamento: e.target.value as MetodoPagamento })}
                  className="w-full mt-1 px-3 py-2 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50"
                >
                  {metodosPagamento.map((m) => (
                    <option key={m.id} value={m.id}>{m.label}</option>
                  ))}
                </select>
              </div>
              
              {/* Botões */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors ${
                    tipo === 'receita'
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  Salvar
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NovaTransacaoModal;
