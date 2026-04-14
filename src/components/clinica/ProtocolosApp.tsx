import React from 'react';
import { motion } from 'framer-motion';
import {
  ClipboardList, 
  Star, 
  BookOpen,
  Ear
} from 'lucide-react';
import { useOSStore, usePontosStore } from '@/stores';
import { auricularPoints } from '@/components/auricular/EarSVG';
import { pushMapaProtocolRequest } from '@/lib/mapaProtocolBridge';

const protocolos = [
  {
    id: 'nada',
    nome: 'Protocolo NADA',
    descricao: 'National Acupuncture Detoxification Association',
    indicacoes: ['Dependências químicas', 'Ansiedade', 'Estresse', 'Sintomas de abstinência'],
    pontos: ['simpatico', 'shenmen', 'rim', 'figado', 'pulmao'],
    cor: 'bg-emerald-500',
  },
  {
    id: 'triangulo',
    nome: 'Triângulo Cibernético',
    descricao: 'Protocolo clássico de harmonização geral',
    indicacoes: ['Equilíbrio geral', 'Homeostase', 'Bem-estar'],
    pontos: ['shenmen', 'rim', 'simpatico'],
    cor: 'bg-amber-500',
  },
  {
    id: 'ansiedade',
    nome: 'Protocolo Ansiedade',
    descricao: 'Para transtornos de ansiedade e insônia',
    indicacoes: ['Ansiedade generalizada', 'Insônia', 'Pânico', 'Estresse'],
    pontos: ['shenmen', 'subcortex', 'rim', 'coracao', 'simpatico'],
    cor: 'bg-indigo-500',
  },
  {
    id: 'dor',
    nome: 'Protocolo Dor',
    descricao: 'Para controle de dor aguda e crônica',
    indicacoes: ['Dor aguda', 'Dor crônica', 'Fibromialgia', 'Cefaleia'],
    pontos: ['simpatico', 'shenmen', 'subcortex', 'ponto-zero'],
    cor: 'bg-rose-500',
  },
  {
    id: 'emagrecimento',
    nome: 'Protocolo Emagrecimento',
    descricao: 'Para controle de apetite e metabolismo',
    indicacoes: ['Obesidade', 'Compulsão alimentar', 'Retenção de líquidos'],
    pontos: ['fome', 'shenmen', 'endocrino', 'adrenal'],
    cor: 'bg-teal-500',
  },
  {
    id: 'depressao',
    nome: 'Protocolo Depressão',
    descricao: 'Para sintomas depressivos leves a moderados',
    indicacoes: ['Depressão leve', 'Tristeza', 'Falta de energia', 'Luto'],
    pontos: ['shenmen', 'coracao', 'pulmao', 'rim', 'subcortex'],
    cor: 'bg-violet-500',
  },
];

export const ProtocolosApp: React.FC = () => {
  const { abrirJanela, getJanelaByApp } = useOSStore();
  const { selecionarPonto, limparSelecao } = usePontosStore();

  const handleUsarProtocolo = (protocolo: typeof protocolos[0]) => {
    // Limpar seleção atual
    limparSelecao();
    
    // Mapear IDs de pontos
    const pontosIds: string[] = [];
    protocolo.pontos.forEach(pontoId => {
      const ponto = auricularPoints.find(p => p.id === pontoId);
      if (ponto) {
        pontosIds.push(ponto.id);
        selecionarPonto({
          id: ponto.id,
          nome_pt: ponto.nome,
          codigo: ponto.codigo,
          coordenadas: { x: ponto.x, y: ponto.y },
          regiao: ponto.regiao,
          funcao: ponto.funcao,
          indicacoes: ponto.indicacoes,
          contraindicacoes: ponto.contraindicacoes || [],
          prioridade: ponto.prioridade,
          sistema: ponto.sistema || 'neurofisiologico'
        });
      }
    });
    
    pushMapaProtocolRequest({
      protocoloId: protocolo.id,
      protocoloNome: protocolo.nome,
      pontosIds,
      sistema: 'neurofisiologico',
      origem: 'protocolos',
      timestamp: Date.now()
    });
    
    // Abrir o mapa auricular
    if (!getJanelaByApp('mapa')) {
      abrirJanela('mapa', 'Mapa Auricular');
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <ClipboardList className="w-6 h-6 text-emerald-400" />
        <h2 className="text-2xl font-medium text-white">Protocolos Terapêuticos</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {protocolos.map((protocolo, index) => (
          <motion.div
            key={protocolo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${protocolo.cor} flex items-center justify-center shadow-lg`}>
                <Star className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-white/40 bg-white/5 px-2 py-1 rounded-full">
                {protocolo.pontos.length} pontos
              </span>
            </div>

            <h3 className="text-lg font-medium text-white mb-1">{protocolo.nome}</h3>
            <p className="text-sm text-white/60 mb-3">{protocolo.descricao}</p>

            <div className="mb-3">
              <p className="text-xs text-white/40 mb-1">Indicações:</p>
              <div className="flex flex-wrap gap-1">
                {protocolo.indicacoes.map((ind, i) => (
                  <span key={i} className="text-xs bg-white/5 px-2 py-1 rounded text-white/70">
                    {ind}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 pt-3">
              <button
                onClick={() => handleUsarProtocolo(protocolo)}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-emerald-500/20 
                           text-white text-sm font-medium transition-all
                           flex items-center justify-center gap-2
                           border border-white/10 hover:border-emerald-500/30"
              >
                <Ear className="w-4 h-4" />
                Usar Protocolo
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
        <div className="flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-indigo-400 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-white mb-1">Sobre os Protocolos</h4>
            <p className="text-xs text-white/60 leading-relaxed">
              Os protocolos são combinações de pontos auriculares validadas cientificamente 
              para condições específicas. O Protocolo NADA é o mais estudado internacionalmente 
              para dependências e trauma. Clique em "Usar Protocolo" para aplicar no mapa auricular.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtocolosApp;
