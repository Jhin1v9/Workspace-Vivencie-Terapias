// Ear Map Pro - Sistema de Mapa Auricular com Referência Anatômica

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Edit3, 
  Save, 
  RotateCcw, 
  Eye, 
  EyeOff,
  MapPin,
  Layers,
  Grid3X3
} from 'lucide-react';

// Types

export interface PontoAuricular {
  id: string;
  codigo: string;
  nome: string;
  regiao: string;
  sistema: 'nada' | 'battlefield' | 'neuro' | 'multiplo';
  prioridade: 'master' | 'estrela' | 'importante' | 'comum';
  funcao: string;
  indicacoes: string[];
  // Coordenadas percentuais (0-100) baseadas na imagem de referência
  x: number; // Posição horizontal %
  y: number; // Posição vertical %
  xCostas?: number; // Posição na face posterior
  yCostas?: number;
  facePosterior: boolean; // Indica se está na face posterior
}

export interface PosicoesSalvas {
  versao: string;
  timestamp: number;
  pontos: Record<string, { x: number; y: number; xCostas?: number; yCostas?: number }>;
}

// Pontos Base

export const PONTOS_BASE: PontoAuricular[] = [
  // FOSSA TRIANGULAR - Região Master
  {
    id: 'shenmen',
    codigo: 'MA-FT-01',
    nome: 'Shen Men',
    regiao: 'fossa_triangular',
    sistema: 'nada',
    prioridade: 'master',
    funcao: 'Porta do Espírito - analgesia, sedação, equilíbrio emocional',
    indicacoes: ['Ansiedade', 'Insônia', 'Dor', 'Dependências'],
    x: 49, y: 32,
    facePosterior: false
  },
  {
    id: 'neuro-simpatico',
    codigo: 'MA-AH-01',
    nome: 'Simpático',
    regiao: 'antihelice_lombar',
    sistema: 'nada',
    prioridade: 'master',
    funcao: 'Regulação do sistema nervoso autônomo',
    indicacoes: ['Estresse', 'Ansiedade', 'Hipertensão', 'Sudorese'],
    x: 44, y: 52,
    facePosterior: false
  },
  
  // CONCHA CIMBA - Órgãos Abdominais
  {
    id: 'rim',
    codigo: 'MA-CC-01',
    nome: 'Rim',
    regiao: 'concha_cimba',
    sistema: 'nada',
    prioridade: 'master',
    funcao: 'Base energética, regulação hormonal, sistema urogenital',
    indicacoes: ['Fadiga', 'Dor lombar', 'Distúrbios hormonais', 'Medo'],
    x: 51, y: 40,
    facePosterior: false
  },
  {
    id: 'figado',
    codigo: 'MA-CC-02',
    nome: 'Fígado',
    regiao: 'concha_cimba',
    sistema: 'neuro',
    prioridade: 'estrela',
    funcao: 'Regulação emocional, metabolismo, visão',
    indicacoes: ['Ira', 'Estresse', 'Cefaleia', 'Problemas visuais'],
    x: 50, y: 44,
    facePosterior: false
  },
  {
    id: 'baco-pancreas',
    codigo: 'MA-CC-03',
    nome: 'Baço/Pâncreas',
    regiao: 'concha_cimba',
    sistema: 'neuro',
    prioridade: 'importante',
    funcao: 'Digestão, metabolismo glicídico',
    indicacoes: ['Digestão lenta', 'Diabetes', 'Preocupação excessiva'],
    x: 52, y: 46,
    facePosterior: false
  },
  
  // CONCHA CAVA - Órgãos Torácicos
  {
    id: 'coracao',
    codigo: 'MA-CV-01',
    nome: 'Coração',
    regiao: 'concha_cava',
    sistema: 'neuro',
    prioridade: 'master',
    funcao: 'Regulação cardiovascular, emocional',
    indicacoes: ['Ansiedade', 'Palpitações', 'Insônia', 'Tristeza'],
    x: 54, y: 48,
    facePosterior: false
  },
  {
    id: 'pulmao',
    codigo: 'MA-CV-02',
    nome: 'Pulmão',
    regiao: 'concha_cava',
    sistema: 'nada',
    prioridade: 'master',
    funcao: 'Sistema respiratório, imunidade, tristeza',
    indicacoes: ['Asma', 'Alergias', 'Tristeza', 'Defesa baixa'],
    x: 56, y: 44,
    facePosterior: false
  },
  {
    id: 'diafragma',
    codigo: 'MA-CV-03',
    nome: 'Diafragma',
    regiao: 'concha_cava',
    sistema: 'neuro',
    prioridade: 'importante',
    funcao: 'Respiração, separação toracoabdominal',
    indicacoes: ['Hiccups', 'Respiração curta', 'Náuseas'],
    x: 55, y: 50,
    facePosterior: false
  },
  
  // ANTITRAGO - Sistema Nervoso
  {
    id: 'subcortex',
    codigo: 'MA-AT-01',
    nome: 'Subcórtex',
    regiao: 'antitrago',
    sistema: 'neuro',
    prioridade: 'master',
    funcao: 'Regulação cerebral, funções superiores',
    indicacoes: ['Ansiedade', 'Insônia', 'Agitação mental', 'Depressão'],
    x: 38, y: 52,
    facePosterior: false
  },
  {
    id: 'talamo',
    codigo: 'MA-AT-02',
    nome: 'Tálamo',
    regiao: 'antitrago',
    sistema: 'battlefield',
    prioridade: 'estrela',
    funcao: 'Relé sensitivo, modulação da dor',
    indicacoes: ['Dor aguda', 'Dor crônica', 'Estresse'],
    x: 36, y: 54,
    facePosterior: false
  },
  {
    id: 'giro-cingulado',
    codigo: 'MA-AT-03',
    nome: 'Giro Cingulado',
    regiao: 'antitrago',
    sistema: 'battlefield',
    prioridade: 'estrela',
    funcao: 'Controle emocional, atenção',
    indicacoes: ['Dor crônica', 'TEPT', 'Compulsões'],
    x: 35, y: 50,
    facePosterior: false
  },
  
  // TRAGUS
  {
    id: 'fome',
    codigo: 'MA-TG-01',
    nome: 'Fome',
    regiao: 'tragus',
    sistema: 'neuro',
    prioridade: 'estrela',
    funcao: 'Controle do apetite, compulsão alimentar',
    indicacoes: ['Obesidade', 'Compulsão alimentar', 'Ansiedade'],
    x: 32, y: 48,
    facePosterior: false
  },
  {
    id: 'vicio',
    codigo: 'MA-TG-02',
    nome: 'Vício',
    regiao: 'tragus',
    sistema: 'nada',
    prioridade: 'estrela',
    funcao: 'Dependências químicas e comportamentais',
    indicacoes: ['Dependências', 'Tabagismo', 'Alcoolismo'],
    x: 30, y: 46,
    facePosterior: false
  },
  
  // HÉLICE SUPERIOR - Membros Superiores
  {
    id: 'ombro',
    codigo: 'MA-HS-01',
    nome: 'Ombro',
    regiao: 'helix_superior',
    sistema: 'neuro',
    prioridade: 'importante',
    funcao: 'Articulação do ombro, membros superiores',
    indicacoes: ['Dor no ombro', 'Tendinite', 'Bursite'],
    x: 35, y: 28,
    facePosterior: false
  },
  {
    id: 'cotovelo',
    codigo: 'MA-HS-02',
    nome: 'Cotovelo',
    regiao: 'helix_superior',
    sistema: 'neuro',
    prioridade: 'comum',
    funcao: 'Articulação do cotovelo',
    indicacoes: ['Epicondilite', 'Dor no cotovelo'],
    x: 33, y: 30,
    facePosterior: false
  },
  {
    id: 'mao',
    codigo: 'MA-HS-03',
    nome: 'Mão/Dedos',
    regiao: 'helix_superior',
    sistema: 'neuro',
    prioridade: 'comum',
    funcao: 'Articulações da mão',
    indicacoes: ['Túnel do carpo', 'Artrite', 'Dor na mão'],
    x: 32, y: 33,
    facePosterior: false
  },
  
  // ANTI-HÉLICE - Coluna
  {
    id: 'coluna-cervical',
    codigo: 'MA-AC-01',
    nome: 'Coluna Cervical',
    regiao: 'antihelix_cervical',
    sistema: 'neuro',
    prioridade: 'estrela',
    funcao: 'Vértebras cervicais, pescoço',
    indicacoes: ['Dor cervical', 'Torticolo', 'Cefaleia'],
    x: 42, y: 22,
    facePosterior: false
  },
  {
    id: 'coluna-toracica',
    codigo: 'MA-AT-01',
    nome: 'Coluna Torácica',
    regiao: 'antihelix_toracica',
    sistema: 'neuro',
    prioridade: 'importante',
    funcao: 'Vértebras torácicas, costas médias',
    indicacoes: ['Dor torácica', 'Escápulas', 'Postura'],
    x: 40, y: 32,
    facePosterior: false
  },
  {
    id: 'coluna-lombar',
    codigo: 'MA-AL-01',
    nome: 'Coluna Lombar',
    regiao: 'antihelix_lombar',
    sistema: 'neuro',
    prioridade: 'estrela',
    funcao: 'Vértebras lombares, região sacra',
    indicacoes: ['Dor lombar', 'Ciática', 'Hérnia de disco'],
    x: 38, y: 48,
    facePosterior: false
  },
  
  // ESCAFA
  {
    id: 'ponto-zero',
    codigo: 'MA-ES-01',
    nome: 'Ponto Zero',
    regiao: 'escafa',
    sistema: 'battlefield',
    prioridade: 'master',
    funcao: 'Regulação geral, homeostasia, analgesia universal',
    indicacoes: ['Dor generalizada', 'Estresse', 'Regulação energética'],
    x: 34, y: 36,
    facePosterior: false
  },
  {
    id: 'joelho',
    codigo: 'MA-ES-02',
    nome: 'Joelho',
    regiao: 'escafa',
    sistema: 'neuro',
    prioridade: 'importante',
    funcao: 'Articulação do joelho',
    indicacoes: ['Dor no joelho', 'Artrite', 'Lesões'],
    x: 32, y: 38,
    facePosterior: false
  },
  
  // LÓBULO
  {
    id: 'cabeça',
    codigo: 'MA-LB-01',
    nome: 'Cabeça/Cérebro',
    regiao: 'lobulo_superior',
    sistema: 'neuro',
    prioridade: 'estrela',
    funcao: 'Cefaleia, enxaqueca, funções cerebrais',
    indicacoes: ['Cefaleia', 'Enxaqueca', 'Tontura', 'Insônia'],
    x: 58, y: 72,
    facePosterior: false
  },
  {
    id: 'face',
    codigo: 'MA-LB-02',
    nome: 'Face/Mandíbula',
    regiao: 'lobulo_inferior',
    sistema: 'neuro',
    prioridade: 'importante',
    funcao: 'ATM, dor facial, trigêmeo',
    indicacoes: ['Bruxismo', 'ATM', 'Neuralgia do trigêmeo'],
    x: 56, y: 78,
    facePosterior: false
  },
  {
    id: 'olho',
    codigo: 'MA-LB-03',
    nome: 'Olho',
    regiao: 'lobulo_superior',
    sistema: 'neuro',
    prioridade: 'importante',
    funcao: 'Problemas oftalmológicos',
    indicacoes: ['Miopia', 'Astigmatismo', 'Olho seco'],
    x: 60, y: 70,
    facePosterior: false
  },
  
  // FACE POSTERIOR (Pontos específicos)
  {
    id: 'omega2',
    codigo: 'MA-FP-01',
    nome: 'Ômega 2',
    regiao: 'retroauricular',
    sistema: 'battlefield',
    prioridade: 'master',
    funcao: 'Dor aguda intensa, trauma',
    indicacoes: ['Dor aguda', 'Trauma', 'Pós-operatório'],
    x: 60, y: 30,
    xCostas: 35, yCostas: 30,
    facePosterior: true
  },
  {
    id: 'relax-muscular',
    codigo: 'MA-FP-02',
    nome: 'Relaxamento Muscular',
    regiao: 'retroauricular',
    sistema: 'neuro',
    prioridade: 'importante',
    funcao: 'Relaxamento de tensões musculares',
    indicacoes: ['Contracturas', 'Espasmos', 'Bruxismo'],
    x: 58, y: 40,
    xCostas: 38, yCostas: 40,
    facePosterior: true
  },
];



interface EarMapProProps {
  onPontoSelecionado?: (ponto: PontoAuricular) => void;
  pontosSelecionados?: string[];
  modoEdicao?: boolean;
  onToggleEdicao?: () => void;
}

const STORAGE_KEY = 'auris-ear-positions-v1';

export const EarMapPro: React.FC<EarMapProProps> = ({
  onPontoSelecionado,
  pontosSelecionados = [],
  modoEdicao: modoEdicaoProp,
  onToggleEdicao
}) => {
  // Estados
  const [modoEdicao, setModoEdicao] = useState(modoEdicaoProp || false);
  const [pontos, setPontos] = useState<PontoAuricular[]>(PONTOS_BASE);
  const [pontoArrastando, setPontoArrastando] = useState<string | null>(null);
  const [pontoHover, setPontoHover] = useState<string | null>(null);
  const [vistaPosterior, setVistaPosterior] = useState(false);
  const [mostrarGrid, setMostrarGrid] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Carregar posições salvas ao iniciar
  useEffect(() => {
    const salvo = localStorage.getItem(STORAGE_KEY);
    if (salvo) {
      try {
        const data: PosicoesSalvas = JSON.parse(salvo);
        if (data.versao === 'v1' && data.pontos) {
          setPontos(prev => prev.map(p => {
            if (data.pontos[p.id]) {
              return { ...p, ...data.pontos[p.id] };
            }
            return p;
          }));
          mostrarMensagem('Posições carregadas com sucesso!');
        }
      } catch (e) {
        console.error('Erro ao carregar posições:', e);
      }
    }
  }, []);
  
  // Mostrar mensagem temporária
  const mostrarMensagem = (msg: string) => {
    setMensagem(msg);
    setTimeout(() => setMensagem(null), 3000);
  };
  
  // Salvar posições
  const salvarPosicoes = () => {
    const data: PosicoesSalvas = {
      versao: 'v1',
      timestamp: Date.now(),
      pontos: pontos.reduce((acc, p) => {
        acc[p.id] = { x: p.x, y: p.y, xCostas: p.xCostas, yCostas: p.yCostas };
        return acc;
      }, {} as Record<string, any>)
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    mostrarMensagem('✓ Posições salvas!');
  };
  
  // Resetar posições
  const resetarPosicoes = () => {
    if (confirm('Tem certeza que deseja resetar todas as posições para o padrão?')) {
      localStorage.removeItem(STORAGE_KEY);
      setPontos(PONTOS_BASE);
      mostrarMensagem('Posições resetadas');
    }
  };
  
  // Toggle modo edição
  const toggleEdicao = () => {
    const novoModo = !modoEdicao;
    setModoEdicao(novoModo);
    if (onToggleEdicao) onToggleEdicao();
    if (!novoModo) {
      salvarPosicoes();
    }
  };
  
  // Handlers de arrasto e clique
  const [cliqueInicio, setCliqueInicio] = useState<{x: number, y: number} | null>(null);
  
  const handleMouseDown = (e: React.MouseEvent, pontoId: string) => {
    // Sempre registra o início do clique para distinguir de arrasto
    setCliqueInicio({ x: e.clientX, y: e.clientY });
    
    if (!modoEdicao) return;
    e.preventDefault();
    e.stopPropagation();
    setPontoArrastando(pontoId);
  };
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!modoEdicao || !pontoArrastando || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Limitar aos bounds (0-100)
    const clampedX = Math.max(2, Math.min(98, x));
    const clampedY = Math.max(2, Math.min(98, y));
    
    setPontos(prev => prev.map(p => {
      if (p.id === pontoArrastando) {
        if (vistaPosterior && p.xCostas !== undefined) {
          return { ...p, xCostas: clampedX, yCostas: clampedY };
        }
        return { ...p, x: clampedX, y: clampedY };
      }
      return p;
    }));
  }, [modoEdicao, pontoArrastando, vistaPosterior]);
  
  const handleMouseUp = useCallback(() => {
    setPontoArrastando(null);
    // Limpa o clique após um delay para permitir o onClick verificar
    setTimeout(() => setCliqueInicio(null), 50);
  }, []);
  
  // Event listeners globais para arrasto
  useEffect(() => {
    if (modoEdicao && pontoArrastando) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [modoEdicao, pontoArrastando, handleMouseMove, handleMouseUp]);
  
  // Cores por prioridade
  const getCorPonto = (prioridade: string, selecionado: boolean) => {
    if (selecionado) return '#10b981'; // Verde para selecionado
    switch (prioridade) {
      case 'master': return '#ef4444'; // Vermelho
      case 'estrela': return '#f59e0b'; // Âmbar
      case 'importante': return '#3b82f6'; // Azul
      default: return '#8b5cf6'; // Roxo
    }
  };
  
  // Filtrar pontos pela vista atual
  const pontosVisiveis = pontos.filter(p => {
    if (vistaPosterior) return p.facePosterior || p.xCostas !== undefined;
    return true;
  });

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Barra de ferramentas */}
      <div className="flex items-center justify-between p-3 bg-slate-900/80 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleEdicao}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              modoEdicao 
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            {modoEdicao ? 'Sair da Edição' : 'Editar Posições'}
          </button>
          
          {modoEdicao && (
            <>
              <button
                onClick={salvarPosicoes}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-500 transition-all"
              >
                <Save className="w-4 h-4" />
                Salvar
              </button>
              <button
                onClick={resetarPosicoes}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-red-600/80 text-white hover:bg-red-500 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                Resetar
              </button>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMostrarGrid(!mostrarGrid)}
            className={`p-2 rounded-lg transition-all ${mostrarGrid ? 'bg-auris-sage/20 text-auris-sage' : 'text-slate-400 hover:text-white'}`}
            title="Mostrar grade"
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setVistaPosterior(!vistaPosterior)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all ${
              vistaPosterior 
                ? 'bg-auris-indigo/20 text-auris-indigo' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {vistaPosterior ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {vistaPosterior ? 'Face Posterior' : 'Face Anterior'}
          </button>
        </div>
      </div>
      
      {/* Mensagem de feedback */}
      <AnimatePresence>
        {mensagem && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-slate-800 text-white text-sm font-medium shadow-xl border border-white/10"
          >
            {mensagem}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Container do mapa */}
      <div 
        ref={containerRef}
        className="relative flex-1 bg-slate-950 overflow-hidden"
        style={{ cursor: modoEdicao && pontoArrastando ? 'grabbing' : modoEdicao ? 'crosshair' : 'default' }}
      >
        {/* Imagem de referência da orelha */}
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <img 
            src="/ear-reference.png" 
            alt="Referência Anatômica da Orelha"
            className="max-h-full max-w-full object-contain opacity-90"
            draggable={false}
          />
        </div>
        
        {/* Grid de referência (opcional) */}
        {mostrarGrid && modoEdicao && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Grid horizontal */}
            {[10, 20, 30, 40, 50, 60, 70, 80, 90].map(y => (
              <div 
                key={`h-${y}`}
                className="absolute w-full border-t border-white/10"
                style={{ top: `${y}%` }}
              />
            ))}
            {/* Grid vertical */}
            {[10, 20, 30, 40, 50, 60, 70, 80, 90].map(x => (
              <div 
                key={`v-${x}`}
                className="absolute h-full border-l border-white/10"
                style={{ left: `${x}%` }}
              />
            ))}
            {/* Coordenadas */}
            {[10, 20, 30, 40, 50, 60, 70, 80, 90].map(pos => (
              <React.Fragment key={`coord-${pos}`}>
                <span className="absolute text-xs text-white/30" style={{ left: `${pos}%`, top: '2%' }}>{pos}</span>
                <span className="absolute text-xs text-white/30" style={{ left: '2%', top: `${pos}%` }}>{pos}</span>
              </React.Fragment>
            ))}
          </div>
        )}
        
        {/* Overlay informativo no modo edição */}
        {modoEdicao && (
          <div className="absolute top-4 left-4 right-4 bg-slate-900/90 backdrop-blur-sm rounded-xl p-4 border border-amber-500/30">
            <div className="flex items-start gap-3">
              <Edit3 className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-amber-400 font-medium text-sm">Modo de Edição Ativo</h4>
                <p className="text-slate-400 text-xs mt-1">
                  Arraste os pontos para posicioná-los exatamente sobre a imagem de referência. 
                  Os pontos em vermelho são Master, laranja são Estrela. Use a grade para precisão.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Pontos no mapa */}
        {pontosVisiveis.map(ponto => {
          const isSelecionado = pontosSelecionados.includes(ponto.id);
          const isHover = pontoHover === ponto.id;
          
          // Determinar coordenadas baseado na vista
          let px = vistaPosterior && ponto.xCostas !== undefined ? ponto.xCostas : ponto.x;
          let py = vistaPosterior && ponto.yCostas !== undefined ? ponto.yCostas : ponto.y;
          
          const cor = getCorPonto(ponto.prioridade, isSelecionado);
          
          return (
            <motion.div
              key={ponto.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
                modoEdicao || isSelecionado ? 'z-30' : 'z-20'
              }`}
              style={{ left: `${px}%`, top: `${py}%` }}
              onMouseDown={(e) => handleMouseDown(e, ponto.id)}
              onMouseEnter={() => setPontoHover(ponto.id)}
              onMouseLeave={() => setPontoHover(null)}
              onClick={(e) => {
                if (modoEdicao) return;
                // Verifica se foi um clique (não arrasto)
                if (cliqueInicio) {
                  const distancia = Math.sqrt(
                    Math.pow(e.clientX - cliqueInicio.x, 2) + 
                    Math.pow(e.clientY - cliqueInicio.y, 2)
                  );
                  // Se moveu menos de 5px, considera clique
                  if (distancia < 5) {
                    onPontoSelecionado?.(ponto);
                  }
                }
                setCliqueInicio(null);
              }}
              animate={{
                scale: isSelecionado ? 1.3 : isHover ? 1.15 : 1,
              }}
            >
              {/* Indicador visual do ponto */}
              <div
                className={`relative flex items-center justify-center transition-all ${
                  modoEdicao ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
                }`}
                style={{ width: modoEdicao ? 24 : 20, height: modoEdicao ? 24 : 20 }}
              >
                {/* Círculo externo (aura) */}
                <div 
                  className="absolute inset-0 rounded-full animate-ping opacity-30"
                  style={{ backgroundColor: cor }}
                />
                
                {/* Círculo principal */}
                <div 
                  className="relative w-full h-full rounded-full border-2 shadow-lg flex items-center justify-center"
                  style={{ 
                    backgroundColor: isSelecionado ? cor : 'rgba(15, 23, 42, 0.9)',
                    borderColor: cor,
                    boxShadow: `0 0 20px ${cor}40`
                  }}
                >
                  {/* Ícone interno por prioridade */}
                  {ponto.prioridade === 'master' && <MapPin className="w-2.5 h-2.5 text-white" />}
                </div>
                
                {/* Label flutuante no hover ou modo edição */}
                {(isHover || modoEdicao) && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap z-50"
                  >
                    <div className="bg-slate-900/95 text-white text-xs px-2 py-1 rounded-md border border-white/20 shadow-xl">
                      <span className="font-semibold">{ponto.nome}</span>
                      <span className="text-slate-400 ml-1">{ponto.codigo}</span>
                      {modoEdicao && (
                        <span className="block text-xs text-amber-400 mt-0.5">
                          {px.toFixed(1)}%, {py.toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </motion.div>
                )}
                
                {/* Indicador de face posterior */}
                {ponto.facePosterior && !vistaPosterior && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-slate-700 rounded-full border border-white/30 flex items-center justify-center">
                    <Layers className="w-1.5 h-1.5 text-white/70" />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
        
        {/* Indicador de coordenadas no modo edição */}
        {modoEdicao && pontoArrastando && (
          <div className="absolute bottom-4 left-4 bg-slate-900/90 text-white text-xs px-3 py-2 rounded-lg border border-amber-500/30">
            Arrastando: {pontos.find(p => p.id === pontoArrastando)?.nome}
          </div>
        )}
      </div>
      
      {/* Legenda */}
      <div className="flex items-center justify-center gap-4 p-2 bg-slate-900/50 border-t border-white/5 text-xs text-slate-400">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span>Master</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <span>Estrela</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span>Importante</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-purple-500" />
          <span>Comum</span>
        </div>
        <div className="flex items-center gap-1">
          <Layers className="w-2 h-2 text-slate-400" />
          <span>Face Posterior</span>
        </div>
      </div>
    </div>
  );
};

export default EarMapPro;
