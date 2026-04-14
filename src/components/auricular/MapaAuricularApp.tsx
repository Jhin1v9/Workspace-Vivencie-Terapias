// Mapa Auricular APP - Atlas Interativo Profissional

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  BookOpen,
  Layers,
  MapPin,
  Info,
  CheckCircle2,
  Brain,
  RotateCw,
  Activity,
  Zap,
  Target,
  Grid3X3,
  ChevronRight,
  X
} from 'lucide-react';
import { EarMapPro, type PontoAuricular, PONTOS_BASE } from './EarMapPro';
import { usePontosStore } from '@/stores/usePontosStore';
import { useAuraIntelligence } from '@/hooks/useAuraIntelligence';
import { theme } from '@/lib/theme';

// Regiões Anatômicas

const REGIOES = [
  { id: 'fossa_triangular', nome: 'Fossa Triangular', descricao: 'Shen Men, pontos master', icone: Target, cor: theme.regiao.fossaTriangular },
  { id: 'concha_cimba', nome: 'Concha Cimba', descricao: 'Rim, Fígado - órgãos abdominais', icone: Activity, cor: theme.regiao.conchaCimba },
  { id: 'concha_cava', nome: 'Concha Cava', descricao: 'Pulmão, Coração - órgãos torácicos', icone: Activity, cor: theme.regiao.conchaCava },
  { id: 'antitrago', nome: 'Antitrago', descricao: 'Subcórtex, Tálamo - sistema nervoso', icone: Brain, cor: theme.regiao.antitrago },
  { id: 'tragus', nome: 'Tragus', descricao: 'Fome, Vícios - controle comportamental', icone: Zap, cor: theme.regiao.tragus },
  { id: 'helix_superior', nome: 'Hélice Superior', descricao: 'Ombro, membros superiores', icone: Grid3X3, cor: theme.regiao.helixSuperior },
  { id: 'antihelix_cervical', nome: 'Anti-hélice Cervical', descricao: 'Coluna cervical', icone: Grid3X3, cor: theme.regiao.antihelixCervical },
  { id: 'antihelix_lombar', nome: 'Anti-hélice Lombar', descricao: 'Coluna lombar, Simpático', icone: Grid3X3, cor: theme.regiao.antihelixLombar },
  { id: 'escafa', nome: 'Escafa', descricao: 'Ponto Zero, Joelho', icone: Grid3X3, cor: theme.regiao.escafa },
  { id: 'lobulo_superior', nome: 'Lóbulo Superior', descricao: 'Cabeça, Face', icone: Grid3X3, cor: theme.regiao.lobuloSuperior },
  { id: 'lobulo_inferior', nome: 'Lóbulo Inferior', descricao: 'Mandíbula, Pescoço', icone: Grid3X3, cor: theme.regiao.lobuloInferior },
  { id: 'retroauricular', nome: 'Retroauricular', descricao: 'Face posterior da orelha', icone: Layers, cor: theme.regiao.retroauricular },
];



export const MapaAuricularApp: React.FC = () => {
  // Estados
  const [busca, setBusca] = useState('');
  const [pontoSelecionado, setPontoSelecionado] = useState<PontoAuricular | null>(null);
  const [pontosSelecionados, setPontosSelecionados] = useState<string[]>([]);
  const [abaLateral, setAbaLateral] = useState<'pontos' | 'protocolos' | 'info'>('pontos');
  const [filtroRegiao, setFiltroRegiao] = useState<string | null>(null);
  const [modoEdicao, setModoEdicao] = useState(false);
  
  const pontosStore = usePontosStore();
  const { atualizarPontosProtocolo } = useAuraIntelligence();
  
  // Atualizar sistema de inteligencia quando pontos mudarem
  React.useEffect(() => {
    atualizarPontosProtocolo(pontosSelecionados.length);
  }, [pontosSelecionados.length, atualizarPontosProtocolo]);
  
  // Buscar pontos por região
  const pontosPorRegiao = useMemo(() => {
    return REGIOES.map(regiao => ({
      ...regiao,
      pontos: PONTOS_BASE.filter(p => p.regiao === regiao.id)
    })).filter(r => r.pontos.length > 0);
  }, []);
  
  // Handler quando um ponto é clicado no mapa
  const handlePontoSelecionado = (ponto: PontoAuricular) => {
    setPontoSelecionado(ponto);
    setAbaLateral('info');
    
    // Toggle seleção
    if (pontosSelecionados.includes(ponto.id)) {
      setPontosSelecionados(prev => prev.filter(id => id !== ponto.id));
    } else {
      setPontosSelecionados(prev => [...prev, ponto.id]);
      // Adicionar ao store global também
      pontosStore.adicionarPontoAProtocolo(ponto as any);
    }
  };
  
  // Selecionar ponto da lista lateral
  const handleSelecionarDaLista = (ponto: PontoAuricular) => {
    setPontoSelecionado(ponto);
    setAbaLateral('info');
    if (!pontosSelecionados.includes(ponto.id)) {
      setPontosSelecionados(prev => [...prev, ponto.id]);
      pontosStore.adicionarPontoAProtocolo(ponto as any);
    }
  };

  return (
    <div className="flex h-full bg-slate-950">
      {/* Painel Lateral Esquerdo */}
      <div className="w-80 flex-shrink-0 border-r border-white/10 bg-slate-900/50 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-auris-sage to-auris-teal flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-white">Atlas Auricular</h1>
              <p className="text-xs text-slate-400">Neurofisiológico Avançado</p>
            </div>
          </div>
          
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar pontos, códigos, indicações..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full bg-slate-800/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-auris-sage/50"
            />
          </div>
        </div>
        
        {/* Abas */}
        <div className="flex border-b border-white/10">
          {[
            { id: 'pontos', label: 'Pontos', icone: Grid3X3 },
            { id: 'protocolos', label: 'Protocolos', icone: BookOpen },
            { id: 'info', label: 'Detalhes', icone: Info },
          ].map(aba => (
            <button
              key={aba.id}
              onClick={() => setAbaLateral(aba.id as any)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-all ${
                abaLateral === aba.id 
                  ? 'text-auris-sage border-b-2 border-auris-sage bg-auris-sage/10' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <aba.icone className="w-3.5 h-3.5" />
              {aba.label}
            </button>
          ))}
        </div>
        
        {/* Conteúdo da Aba */}
        <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
          <AnimatePresence mode="wait">
            {abaLateral === 'pontos' && (
              <motion.div
                key="pontos"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2"
              >
                {/* Sistemas */}
                <div className="flex gap-1 mb-4">
                  {['Todos', 'NADA', 'Battlefield', 'Neuro'].map(sistema => (
                    <button
                      key={sistema}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                    >
                      {sistema}
                    </button>
                  ))}
                </div>
                
                {/* Lista de Regiões */}
                {pontosPorRegiao.map(regiao => (
                  <div key={regiao.id} className="group">
                    <button
                      onClick={() => setFiltroRegiao(filtroRegiao === regiao.id ? null : regiao.id)}
                      className="w-full flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-all"
                    >
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${regiao.cor}20` }}
                      >
                        <regiao.icone className="w-4 h-4" style={{ color: regiao.cor }} />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="text-sm font-medium text-white">{regiao.nome}</h3>
                        <p className="text-xs text-slate-400 truncate">{regiao.descricao}</p>
                      </div>
                      <span className="text-xs text-slate-500">{regiao.pontos.length}</span>
                      <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform ${filtroRegiao === regiao.id ? 'rotate-90' : ''}`} />
                    </button>
                    
                    {/* Pontos da região expandida */}
                    {filtroRegiao === regiao.id && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        className="ml-4 mt-1 space-y-1 border-l-2 border-white/10 pl-3"
                      >
                        {regiao.pontos.map(ponto => (
                          <button
                            key={ponto.id}
                            onClick={() => handleSelecionarDaLista(ponto)}
                            className={`w-full flex items-center gap-2 p-2 rounded-lg text-left transition-all ${
                              pontosSelecionados.includes(ponto.id)
                                ? 'bg-auris-sage/20 text-auris-sage'
                                : 'hover:bg-white/5 text-slate-300'
                            }`}
                          >
                            <div 
                              className="w-2 h-2 rounded-full"
                              style={{ 
                                backgroundColor: 
                                  ponto.prioridade === 'master' ? '#ef4444' :
                                  ponto.prioridade === 'estrela' ? '#f59e0b' : '#8b5cf6'
                              }}
                            />
                            <span className="text-xs flex-1">{ponto.nome}</span>
                            <span className="text-xs text-slate-500">{ponto.codigo}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                ))}
              </motion.div>
            )}
            
            {abaLateral === 'protocolos' && (
              <motion.div
                key="protocolos"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2"
              >
                {[
                  { id: 'NADA', nome: 'Protocolo NADA', desc: '5 pontos para dependências', cor: '#ef4444', pontos: ['Shen Men', 'Simpático', 'Rim', 'Fígado', 'Pulmão'] },
                  { id: 'BATTLEFIELD', nome: 'Battlefield', desc: 'Controle rápido da dor', cor: '#f59e0b', pontos: ['Tálamo', 'Giro Cingulado', 'Ômega 2', 'Ponto Zero', 'Shen Men'] },
                  { id: 'TRIANGULO', nome: 'Triângulo Cibernético', desc: 'Harmonização geral', cor: '#10b981', pontos: ['Shen Men', 'Rim', 'Simpático'] },
                ].map(protocolo => (
                  <div key={protocolo.id} className="p-3 rounded-xl bg-slate-800/50 border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: protocolo.cor }} />
                      <h3 className="text-sm font-medium text-white">{protocolo.nome}</h3>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">{protocolo.desc}</p>
                    <div className="flex flex-wrap gap-1">
                      {protocolo.pontos.map(p => (
                        <span key={p} className="px-1.5 py-0.5 rounded bg-white/5 text-xs text-slate-300">{p}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
            
            {abaLateral === 'info' && pontoSelecionado && (
              <motion.div
                key="info"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center pb-4 border-b border-white/10">
                  <div 
                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-3"
                    style={{ 
                      backgroundColor: 
                        pontoSelecionado.prioridade === 'master' ? '#ef444420' :
                        pontoSelecionado.prioridade === 'estrela' ? '#f59e0b20' : '#8b5cf620'
                    }}
                  >
                    <MapPin 
                      className="w-8 h-8"
                      style={{ 
                        color: 
                          pontoSelecionado.prioridade === 'master' ? '#ef4444' :
                          pontoSelecionado.prioridade === 'estrela' ? '#f59e0b' : '#8b5cf6'
                      }}
                    />
                  </div>
                  <h2 className="text-xl font-semibold text-white">{pontoSelecionado.nome}</h2>
                  <p className="text-sm text-slate-400">{pontoSelecionado.codigo}</p>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-white/10 text-xs text-slate-300 capitalize">
                    {pontoSelecionado.regiao.replace('_', ' ')}
                  </span>
                </div>
                
                <div>
                  <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Função</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{pontoSelecionado.funcao}</p>
                </div>
                
                <div>
                  <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Indicações Principais</h3>
                  <ul className="space-y-1">
                    {pontoSelecionado.indicacoes.map((ind, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-auris-sage flex-shrink-0 mt-0.5" />
                        {ind}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <button
                    onClick={() => handleSelecionarDaLista(pontoSelecionado)}
                    className={`w-full py-2.5 rounded-xl font-medium text-sm transition-all ${
                      pontosSelecionados.includes(pontoSelecionado.id)
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        : 'bg-auris-sage text-slate-900 hover:bg-auris-sage/90'
                    }`}
                  >
                    {pontosSelecionados.includes(pontoSelecionado.id) ? 'Remover do Protocolo' : 'Adicionar ao Protocolo'}
                  </button>
                </div>
              </motion.div>
            )}
            
            {abaLateral === 'info' && !pontoSelecionado && (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Info className="w-12 h-12 text-slate-600 mb-3" />
                <p className="text-sm text-slate-400">Selecione um ponto no mapa para ver detalhes</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Área do Mapa */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header do Mapa */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-slate-900/30">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 text-sm text-slate-300">
              <RotateCw className="w-4 h-4" />
              <span>Vista Frontal</span>
            </button>
            
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="px-2 py-1 rounded bg-slate-800">Neurofisiologia</span>
              <span className="px-2 py-1 rounded bg-slate-800">NADA</span>
              <span className="px-2 py-1 rounded bg-slate-800">Battlefield</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-auris-sage/20 text-auris-sage text-sm font-medium">
              <MapPin className="w-4 h-4" />
              <span>Pontos</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white text-sm">
              <BookOpen className="w-4 h-4" />
              <span>Protocolos</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white text-sm">
              <Info className="w-4 h-4" />
              <span>Detalhes</span>
            </button>
          </div>
        </div>
        
        {/* Mapa Pro */}
        <div className="flex-1 relative">
          <EarMapPro
            onPontoSelecionado={handlePontoSelecionado}
            pontosSelecionados={pontosSelecionados}
            modoEdicao={modoEdicao}
            onToggleEdicao={() => setModoEdicao(!modoEdicao)}
          />
        </div>
      </div>
      
      {/* Painel Lateral Direito - Protocolo Atual */}
      <div className="w-72 flex-shrink-0 border-l border-white/10 bg-slate-900/50 flex flex-col">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-auris-sage" />
              <h3 className="font-medium text-white">Protocolo Atual</h3>
            </div>
            <span className="text-xs text-slate-400">{pontosSelecionados.length} pontos</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3">
          {pontosSelecionados.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <MapPin className="w-8 h-8 text-slate-700 mb-2" />
              <p className="text-xs text-slate-500">Nenhum ponto selecionado.<br/>Clique nos pontos no mapa.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {pontosSelecionados.map((pontoId) => {
                const ponto = PONTOS_BASE.find(p => p.id === pontoId);
                if (!ponto) return null;
                
                return (
                  <motion.div
                    key={ponto.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="group p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 cursor-pointer transition-all"
                    onClick={() => handleSelecionarDaLista(ponto)}
                  >
                    <div className="flex items-start gap-2">
                      <div 
                        className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0"
                        style={{ 
                          backgroundColor: 
                            ponto.prioridade === 'master' ? '#ef4444' :
                            ponto.prioridade === 'estrela' ? '#f59e0b' : '#8b5cf6'
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{ponto.nome}</p>
                        <p className="text-xs text-slate-400">{ponto.codigo}</p>
                        <p className="text-xs text-slate-500 capitalize mt-0.5">{ponto.regiao.replace('_', ' ')}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPontosSelecionados(prev => prev.filter(id => id !== ponto.id));
                          pontosStore.removerPontoDoProtocolo(ponto.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 rounded-lg transition-all"
                      >
                        <X className="w-3.5 h-3.5 text-red-400" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
              
              {pontosSelecionados.length > 0 && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full mt-4 py-2.5 rounded-xl bg-auris-sage text-slate-900 text-sm font-medium hover:bg-auris-sage/90 transition-colors"
                  onClick={() => {
                    // Aplicar protocolo - pode abrir app de sessão ou exportar
                    alert(`Protocolo com ${pontosSelecionados.length} pontos pronto!`);
                  }}
                >
                  Aplicar na Sessão
                </motion.button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapaAuricularApp;
