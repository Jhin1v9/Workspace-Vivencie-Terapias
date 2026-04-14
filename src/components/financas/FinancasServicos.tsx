// ============================================================================
// FINANÇAS SERVIÇOS - Gestão de serviços terapêuticos
// ============================================================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Check, X } from 'lucide-react';
import { useFinancasStore } from '@/stores/useFinancasStore';
import { theme } from '@/lib/theme';
import type { CategoriaServico } from '@/types/financas';

const categorias: { id: CategoriaServico; label: string; cor: string }[] = [
  { id: 'auriculoterapia', label: 'Auriculoterapia', cor: theme.categoria.auriculoterapia },
  { id: 'reiki', label: 'Reiki', cor: theme.categoria.reiki },
  { id: 'massagem', label: 'Massagem', cor: theme.categoria.massagem },
  { id: 'acupuntura', label: 'Acupuntura', cor: theme.categoria.acupuntura },
  { id: 'fitoterapia', label: 'Fitoterapia', cor: theme.categoria.fitoterapia },
  { id: 'outro', label: 'Outro', cor: theme.categoria.outro },
];

export const FinancasServicos: React.FC = () => {
  const { servicos, adicionarServico, atualizarServico, removerServico } = useFinancasStore();
  
  const [novoServico, setNovoServico] = useState(false);
  
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    valorPadrao: '',
    categoria: 'outro' as CategoriaServico,
  });
  
  const handleSubmit = () => {
    if (!formData.nome || !formData.valorPadrao) return;
    
    adicionarServico({
      nome: formData.nome,
      descricao: formData.descricao,
      valorPadrao: parseFloat(formData.valorPadrao),
      categoria: formData.categoria,
      ativo: true,
      cor: categorias.find(c => c.id === formData.categoria)?.cor || theme.categoria.outro,
    });
    
    setFormData({ nome: '', descricao: '', valorPadrao: '', categoria: 'outro' });
    setNovoServico(false);
  };
  
  return (
    <div className="space-y-6">
      {/* Botão Novo */}
      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setNovoServico(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium"
        >
          <Plus className="w-5 h-5" />
          Novo Serviço
        </motion.button>
      </div>
      
      {/* Form Novo */}
      {novoServico && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/50 border border-emerald-500/30 rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Novo Serviço</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-sm">Nome</label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full mt-1 px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500/50"
                placeholder="Ex: Auriculoterapia"
              />
            </div>
            
            <div>
              <label className="text-slate-400 text-sm">Valor Padrão (R$)</label>
              <input
                type="number"
                step="0.01"
                value={formData.valorPadrao}
                onChange={(e) => setFormData({ ...formData, valorPadrao: e.target.value })}
                className="w-full mt-1 px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500/50"
                placeholder="150.00"
              />
            </div>
            
            <div>
              <label className="text-slate-400 text-sm">Categoria</label>
              <select
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value as CategoriaServico })}
                className="w-full mt-1 px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500/50"
              >
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="text-slate-400 text-sm">Descrição</label>
              <input
                type="text"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                className="w-full mt-1 px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500/50"
                placeholder="Descrição do serviço"
              />
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium"
            >
              <Check className="w-4 h-4" />
              Salvar
            </button>
            <button
              onClick={() => setNovoServico(false)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
          </div>
        </motion.div>
      )}
      
      {/* Lista de Serviços */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {servicos.map((servico) => (
          <motion.div
            key={servico.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-4 rounded-2xl border ${
              servico.ativo 
                ? 'bg-slate-900/50 border-white/10' 
                : 'bg-slate-900/30 border-white/5 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${servico.cor}20` }}
                >
                  <span style={{ color: servico.cor }}>●</span>
                </div>
                <div>
                  <p className="text-white font-medium">{servico.nome}</p>
                  <p className="text-slate-400 text-sm">{servico.categoria}</p>
                </div>
              </div>
              
              <div className="flex gap-1">
                <button
                  onClick={() => atualizarServico(servico.id, { ativo: !servico.ativo })}
                  className={`p-1.5 rounded-lg transition-colors ${
                    servico.ativo 
                      ? 'text-emerald-400 hover:bg-emerald-500/10' 
                      : 'text-slate-400 hover:bg-white/10'
                  }`}
                  title={servico.ativo ? 'Desativar' : 'Ativar'}
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removerServico(servico.id)}
                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-2xl font-bold text-emerald-400">
                R$ {servico.valorPadrao.toFixed(2)}
              </p>
              <p className="text-slate-500 text-sm mt-1">{servico.descricao}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FinancasServicos;
