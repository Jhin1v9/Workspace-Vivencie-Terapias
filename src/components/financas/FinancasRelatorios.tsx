// ============================================================================
// FINANÇAS RELATÓRIOS - Geração de relatórios e PDFs
// ============================================================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { useFinancasStore } from '@/stores/useFinancasStore';

export const FinancasRelatorios: React.FC = () => {
  const { calcularResumo, transacoes } = useFinancasStore();
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth());
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear());
  
  const inicioMes = new Date(anoSelecionado, mesSelecionado, 1);
  const fimMes = new Date(anoSelecionado, mesSelecionado + 1, 0);
  const resumo = calcularResumo(inicioMes, fimMes);
  
  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  
  const handleDownloadPDF = () => {
    // TODO: Implementar geração de PDF
    alert('Geração de PDF será implementada em breve!');
  };
  
  return (
    <div className="space-y-6">
      {/* Seletor de Período */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex gap-2">
          <select
            value={mesSelecionado}
            onChange={(e) => setMesSelecionado(parseInt(e.target.value))}
            className="px-4 py-2 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50"
          >
            {meses.map((mes, index) => (
              <option key={mes} value={index}>{mes}</option>
            ))}
          </select>
          
          <select
            value={anoSelecionado}
            onChange={(e) => setAnoSelecionado(parseInt(e.target.value))}
            className="px-4 py-2 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50"
          >
            {[2024, 2025, 2026].map((ano) => (
              <option key={ano} value={ano}>{ano}</option>
            ))}
          </select>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium"
        >
          <Download className="w-5 h-5" />
          Baixar PDF
        </motion.button>
      </div>
      
      {/* Preview do Relatório */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-8 text-slate-900"
      >
        {/* Cabeçalho */}
        <div className="text-center border-b border-slate-200 pb-6">
          <h2 className="text-2xl font-bold">Relatório Financeiro</h2>
          <p className="text-slate-500 mt-1">
            {meses[mesSelecionado]} de {anoSelecionado}
          </p>
        </div>
        
        {/* Resumo */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
          <div className="p-4 bg-emerald-50 rounded-xl text-center">
            <p className="text-sm text-slate-500">Total Receitas</p>
            <p className="text-2xl font-bold text-emerald-600">
              R$ {resumo.totalReceitas.toFixed(2)}
            </p>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-xl text-center">
            <p className="text-sm text-slate-500">Recebido</p>
            <p className="text-2xl font-bold text-blue-600">
              R$ {resumo.totalReceitasRecebidas.toFixed(2)}
            </p>
          </div>
          
          <div className="p-4 bg-amber-50 rounded-xl text-center">
            <p className="text-sm text-slate-500">Pendente</p>
            <p className="text-2xl font-bold text-amber-600">
              R$ {resumo.totalReceitasPendentes.toFixed(2)}
            </p>
          </div>
          
          <div className="p-4 bg-slate-50 rounded-xl text-center">
            <p className="text-sm text-slate-500">Saldo</p>
            <p className={`text-2xl font-bold ${resumo.saldoLiquido >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              R$ {resumo.saldoLiquido.toFixed(2)}
            </p>
          </div>
        </div>
        
        {/* Por Categoria */}
        {resumo.porCategoria.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Receitas por Categoria</h3>
            <div className="space-y-2">
              {resumo.porCategoria.map((cat) => (
                <div key={cat.categoria} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="capitalize">{cat.categoria}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-500">{cat.percentual.toFixed(1)}%</span>
                    <span className="font-semibold text-emerald-600">
                      R$ {cat.valor.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Lista de Transações */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Transações ({transacoes.length})</h3>
          <div className="divide-y divide-slate-200">
            {transacoes
              .filter(t => {
                const data = new Date(t.data);
                return data.getMonth() === mesSelecionado && 
                       data.getFullYear() === anoSelecionado;
              })
              .slice(0, 10)
              .map((t) => (
                <div key={t.id} className="py-3 flex justify-between">
                  <div>
                    <p className="font-medium">{t.descricao}</p>
                    <p className="text-sm text-slate-500">
                      {new Date(t.data).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <span className={`font-semibold ${
                    t.tipo === 'receita' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {t.tipo === 'receita' ? '+' : '-'} R$ {t.valor.toFixed(2)}
                  </span>
                </div>
              ))}
          </div>
        </div>
        
        {/* Rodapé */}
        <div className="mt-8 pt-6 border-t border-slate-200 text-center text-slate-500 text-sm">
          <p>Relatório gerado por Auris OS • {new Date().toLocaleDateString('pt-BR')}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default FinancasRelatorios;
