import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

// Sistema de Auriculoterapia Neurofisiológica

export type SistemaAuricular = 'neurofisiologico' | 'nada' | 'battlefield' | 'todos';
export type AuricularVista = 'frente' | 'verso';

// Categorias de prioridade para visualização
export type PrioridadePonto = 'master' | 'estrela' | 'importante' | 'comum';

// Protocolos disponíveis
export const PROTOCOLOS = {
  NADA: ['simpatico', 'shenmen', 'rim', 'figado', 'pulmao'],
  BATTLEFIELD: ['talamo', 'giro-cingulado', 'omega2', 'ponto-zero', 'shenmen'],
  TRIANGULO_CIBERNETICO: ['shenmen', 'rim', 'simpatico'],
  ANSIEDADE: ['shenmen', 'subcortex', 'ansiedade', 'coracao', 'rim'],
  DOR_AGUDA: ['simpatico', 'shenmen', 'talamo', 'zero'],
  DOR_CRONICA: ['shenmen', 'subcortex', 'talamo', 'relax-muscular'],
} as const;

// Definição completa dos pontos auriculares neurofisiológicos
export interface AuricularPoint {
  id: string;
  codigo: string;           // Código oficial (ex: MA-FT-01)
  nome: string;             // Nome em português
  nomeLatim?: string;       // Nome técnico/científico
  x: number;                // Coordenada X (viewBox 0-300)
  y: number;                // Coordenada Y (viewBox 0-400)
  xCostas?: number;         // Coordenada X para verso
  yCostas?: number;         // Coordenada Y para verso
  regiao: RegiaoAuricular;
  sistema: 'neurofisiologico' | 'nada' | 'battlefield' | 'multiplo';
  prioridade: PrioridadePonto;
  funcao: string;
  indicacoes: string[];
  contraindicacoes?: string[];
  neuroEvidencia?: string;  // Base neurofisiológica
  protocolos?: string[];    // Protocolos que incluem este ponto
}

type RegiaoAuricular = 
  | 'helix_superior'        // Borda superior - membros superiores
  | 'helix_inferior'        // Borda inferior - membros inferiores
  | 'escafa'                // Fossa entre hélice e anti-hélice
  | 'antihelix_cervical'    // Ramo superior - coluna cervical
  | 'antihelix_toracica'    // Ramo médio - coluna torácica
  | 'antihelix_lombar'      // Ramo inferior - coluna lombar/sacra
  | 'fossa_triangular'      // Entre ramos da anti-hélice
  | 'concha_cimba'          // Parte superior - órgãos abdominais
  | 'concha_cava'           // Parte inferior - órgãos torácicos
  | 'tragus'                // Projeção anterior
  | 'antitrago'             // Projeção posterior - sistema nervoso
  | 'lobulo_superior'       // Parte superior do lóbulo - face
  | 'lobulo_inferior'       // Parte inferior do lóbulo - mandíbula/pescoço
  | 'retroauricular';       // Área atrás da orelha

// Mapa completo de pontos auriculares

export const auricularPoints: AuricularPoint[] = [
  // ==========================================================================
  // PROTOCOLO NADA - 5 Pontos Principais
  // ==========================================================================
  
  {
    id: 'shenmen',
    codigo: 'MA-FT-01',
    nome: 'Shen Men',
    nomeLatim: 'Porta do Espírito',
    x: 128,
    y: 98,
    xCostas: 142,
    yCostas: 100,
    regiao: 'fossa_triangular',
    sistema: 'nada',
    prioridade: 'master',
    funcao: 'Principal ponto de analgesia e sedação do sistema nervoso central. Regula a excitação e inibição cortical, promovendo equilíbrio emocional profundo. Ação anti-inflamatória via modulação das vias descendentes de dor.',
    indicacoes: [
      'Ansiedade generalizada e ataques de pânico',
      'Insônia e distúrbios do sono',
      'Dor aguda e crônica (neuromodulação)',
      'Dependências químicas e comportamentais',
      'Estresse pós-traumático (TEPT)',
      'Hipertensão arterial',
      'Inflamação sistêmica'
    ],
    neuroEvidencia: 'Estimulação ativa áreas límbicas e córtex pré-frontal (fMRI). Liberação de β-endorfinas e encefalinas.',
    protocolos: ['NADA', 'BATTLEFIELD', 'TRIANGULO_CIBERNETICO', 'ANSIEDADE']
  },
  
  {
    id: 'simpatico',
    codigo: 'MA-AH-01',
    nome: 'Simpático',
    nomeLatim: 'Ponto do Sistema Nervoso Autônomo',
    x: 98,
    y: 125,
    xCostas: 115,
    yCostas: 128,
    regiao: 'antihelix_lombar',
    sistema: 'nada',
    prioridade: 'master',
    funcao: 'Modulação do sistema nervoso autônomo. Efeito analgésico potente via inibição das vias simpáticas. Regulação da resposta de luta ou fuga. Vasodilatação periférica e relaxamento de órgãos internos.',
    indicacoes: [
      'Dor de qualquer etiologia',
      'Náuseas e vômitos',
      'Sudorese excessiva (hiperidrose)',
      'Síndrome do intestino irritável',
      'Estresse crônico e burnout',
      'Paresia vascular periférica',
      'Ansiedade somatizada'
    ],
    neuroEvidencia: 'Bloqueio da transmissão simpática. Redução de catecolaminas circulantes. Ativação do sistema vagal.',
    protocolos: ['NADA', 'TRIANGULO_CIBERNETICO', 'DOR_AGUDA']
  },
  
  {
    id: 'rim',
    codigo: 'MA-CC-01',
    nome: 'Rim',
    nomeLatim: 'Ponto do Sistema Renal',
    x: 152,
    y: 128,
    regiao: 'concha_cimba',
    sistema: 'nada',
    prioridade: 'estrela',
    funcao: 'Fortalecimento da energia vital e capacidade de resiliência. Regulação do eixo HPA (hipotálamo-hipófise-adrenal). Ação sobre medo e instinto de autopreservação. Desintoxicação metabólica.',
    indicacoes: [
      'Fadiga crônica e esgotamento',
      'Problemas urogenitais',
      'Dores lombares e articulares',
      'Distúrbios menstruais',
      'Tontura e vertigem',
      'Dependências químicas (apoio)',
      'Imunodeficiência'
    ],
    neuroEvidencia: 'Modulação do eixo HPA. Regulação de cortisol e hormônios sexuais.',
    protocolos: ['NADA', 'TRIANGULO_CIBERNETICO', 'ANSIEDADE']
  },
  
  {
    id: 'figado',
    codigo: 'MA-CC-02',
    nome: 'Fígado',
    nomeLatim: 'Ponto do Sistema Hepático',
    x: 168,
    y: 142,
    regiao: 'concha_cimba',
    sistema: 'nada',
    prioridade: 'estrela',
    funcao: 'Desintoxicação hepática e metabólica. Regulação emocional - processamento da raiva, frustração e irritabilidade. Relaxamento da musculatura lisa. Regulação menstrual e hormonal.',
    indicacoes: [
      'Irritabilidade e agressividade',
      'Cefaleia tensional e enxaqueca',
      'Distúrbios menstruais e TPM',
      'Tensão muscular crônica',
      'Problemas de visão',
      'Intoxicações e ressacas',
      'Depressão com raiva reprimida'
    ],
    neuroEvidencia: 'Aumento da clearance de neurotoxinas. Modulação de neurotransmissores excitatórios.',
    protocolos: ['NADA']
  },
  
  {
    id: 'pulmao',
    codigo: 'MA-CV-01',
    nome: 'Pulmão',
    nomeLatim: 'Ponto do Sistema Respiratório',
    x: 145,
    y: 188,
    regiao: 'concha_cava',
    sistema: 'nada',
    prioridade: 'estrela',
    funcao: 'Regulação respiratória e imunológica. Processamento do luto e capacidade de "deixar ir". Estimulação vagal na concha cava. Melhora da troca gasosa tissular.',
    indicacoes: [
      'Problemas respiratórios (asma, tosse)',
      'Luto não resolvido',
      'Tristeza crônica',
      'Imunodeficiência',
      'Alergias respiratórias',
      'Dependência de nicotina',
      'Disfunção de troca gasosa'
    ],
    neuroEvidencia: 'Estimulação do nervo vago (t-VNS). Modulação da resposta imune inata.',
    protocolos: ['NADA']
  },

  // ==========================================================================
  // PROTOCOLO BATTLEFIELD - Pontos de Dor
  // ==========================================================================
  
  {
    id: 'talamo',
    codigo: 'MA-AT-01',
    nome: 'Tálamo',
    nomeLatim: 'Ponto do Centro de Processamento da Dor',
    x: 142,
    y: 242,
    xCostas: 155,
    yCostas: 244,
    regiao: 'antitrago',
    sistema: 'battlefield',
    prioridade: 'master',
    funcao: 'Centro de processamento e modulação da dor no sistema nervoso central. Bloqueio das vias ascendentes de dor no tálamo. Efeito analgésico potente para dores neuropáticas e crônicas.',
    indicacoes: [
      'Dor aguda e crônica de qualquer origem',
      'Cervicalgia e lombalgia',
      'Dor neuropática periférica',
      'Fibromialgia',
      'Síndrome dolorosa regional complexa',
      'Neuralgias',
      'Dor pós-operatória'
    ],
    neuroEvidencia: 'Modulação das vias espinotalâmicas. Ativação de vias descendentes inibitórias.',
    protocolos: ['BATTLEFIELD', 'DOR_AGUDA', 'DOR_CRONICA']
  },
  
  {
    id: 'giro-cingulado',
    codigo: 'MA-AT-02',
    nome: 'Giro Cingulado',
    nomeLatim: 'Ponto do Córtex Cingulado',
    x: 128,
    y: 235,
    xCostas: 142,
    yCostas: 237,
    regiao: 'antitrago',
    sistema: 'battlefield',
    prioridade: 'master',
    funcao: 'Modulação da componente afetiva-emocional da dor. Regulação do circuito límbico e processamento emocional. Redução da ansiedade associada à dor.',
    indicacoes: [
      'Dor crônica com componente emocional',
      'Ansiedade associada à dor',
      'Depressão com dor somática',
      'Somatização',
      'Distúrbios do humor',
      'Estresse pós-traumático'
    ],
    neuroEvidencia: 'Modulação do córtex cingulado anterior (área 24). Redução da resposta emocional à dor.',
    protocolos: ['BATTLEFIELD']
  },
  
  {
    id: 'omega2',
    codigo: 'MA-FT-02',
    nome: 'Omega 2',
    nomeLatim: 'Ponto de Modulação do Sistema Límbico',
    x: 115,
    y: 105,
    regiao: 'fossa_triangular',
    sistema: 'battlefield',
    prioridade: 'estrela',
    funcao: 'Modulação profunda do sistema límbico. Equilíbrio entre os hemisférios cerebrais. Regulação de emoções intensas e memória traumática.',
    indicacoes: [
      'Trauma emocional',
      'Memórias intrusivas',
      'Estresse pós-traumático',
      'Transtornos dissociativos',
      'Crises de pânico',
      'Desequilíbrio hemisférico'
    ],
    neuroEvidencia: 'Integração inter-hemisférica. Modulação da amígdala e hipocampo.',
    protocolos: ['BATTLEFIELD']
  },
  
  {
    id: 'ponto-zero',
    codigo: 'MA-HX-01',
    nome: 'Ponto Zero',
    nomeLatim: 'Ponto de Homeostase Geral',
    x: 108,
    y: 165,
    xCostas: 125,
    yCostas: 168,
    regiao: 'escafa',
    sistema: 'battlefield',
    prioridade: 'master',
    funcao: 'Centro de homeostase e equilíbrio energético do organismo. Potencializador de outros pontos. Regulação geral do sistema nervoso autônomo.',
    indicacoes: [
      'Desequilíbrio geral do organismo',
      'Síndromes de disautonomia',
      'Potencialização terapêutica',
      'Regulação de funções vitais',
      'Estresse crônico multissistêmico',
      'Síndrome da fadiga crônica'
    ],
    neuroEvidencia: 'Regulação do sistema nervoso autônomo. Equilíbrio simpático-parassimpático.',
    protocolos: ['BATTLEFIELD', 'DOR_AGUDA']
  },

  // ==========================================================================
  // PONTOS NEUROFISIOLÓGICOS ADICIONAIS
  // ==========================================================================
  
  {
    id: 'subcortex',
    codigo: 'MA-AT-03',
    nome: 'Subcórtex',
    nomeLatim: 'Ponto do Subcórtex Cerebral',
    x: 158,
    y: 248,
    xCostas: 170,
    yCostas: 250,
    regiao: 'antitrago',
    sistema: 'neurofisiologico',
    prioridade: 'estrela',
    funcao: 'Ação de excitação e inibição do córtex cerebral. Regulação de dores crônicas, ansiedade e depressão. Modulação da atividade cortical global.',
    indicacoes: [
      'Ansiedade generalizada',
      'Depressão leve a moderada',
      'Dor crônica centralizada',
      'Insônia',
      'Problemas de memória e concentração',
      'Estresse mental',
      'Neurastenia'
    ],
    neuroEvidencia: 'Modulação da atividade cortical via vias subcorticais. Regulação do ciclo sono-vigília.',
    protocolos: ['ANSIEDADE', 'DOR_CRONICA']
  },
  
  {
    id: 'ansiedade',
    codigo: 'MA-LB-01',
    nome: 'Ansiedade',
    nomeLatim: 'Ponto específico para Transtornos de Ansiedade',
    x: 158,
    y: 305,
    regiao: 'lobulo_inferior',
    sistema: 'neurofisiologico',
    prioridade: 'estrela',
    funcao: 'Ponto específico para transtornos de ansiedade. Calma a agitação mental e emocional. Redução da taquicardia e sudorese de ansiedade.',
    indicacoes: [
      'Transtorno de ansiedade generalizada',
      'Ataques de pânico',
      'Agitação psicomotora',
      'Insônia por ansiedade',
      'Irritabilidade',
      'Nervosismo excessivo'
    ],
    neuroEvidencia: 'Modulação do sistema nervoso autônomo. Redução da resposta de alerta.',
    protocolos: ['ANSIEDADE']
  },
  
  {
    id: 'relax-muscular',
    codigo: 'MA-CV-02',
    nome: 'Relaxamento Muscular',
    nomeLatim: 'Ponto de Relaxamento Muscular',
    x: 162,
    y: 195,
    regiao: 'concha_cava',
    sistema: 'neurofisiologico',
    prioridade: 'importante',
    funcao: 'Relaxamento da musculatura esquelética. Alívio de espasmos, contraturas e tensão muscular crônica.',
    indicacoes: [
      'Espasmos musculares',
      'Contraturas musculares',
      'Tensão muscular crônica',
      'Bruxismo',
      'Fibromialgia',
      'Dor miofascial',
      'Torticolo'
    ],
    neuroEvidencia: 'Inibição do tônus muscular via vias reticuloespinhais.',
    protocolos: ['DOR_CRONICA']
  },
  
  {
    id: 'coracao',
    codigo: 'MA-CV-03',
    nome: 'Coração',
    nomeLatim: 'Ponto do Sistema Cardiovascular',
    x: 152,
    y: 205,
    regiao: 'concha_cava',
    sistema: 'neurofisiologico',
    prioridade: 'importante',
    funcao: 'Regulação do sistema cardiovascular e emocional. Harmonização do Shen (espírito/consciência). Calma palpitações e agitação.',
    indicacoes: [
      'Ansiedade e agitação mental',
      'Palpitações',
      'Insônia',
      'Problemas circulatórios',
      'Estresse emocional',
      'Tristeza profunda'
    ],
    neuroEvidencia: 'Modulação do tônus vagal cardíaco. Regulação da variabilidade da frequência cardíaca.',
    protocolos: ['ANSIEDADE']
  },

  // ==========================================================================
  // SISTEMA MUSCULOESQUELÉTICO - Somatotopia
  // ==========================================================================
  
  {
    id: 'cervical',
    codigo: 'MA-AH-C1',
    nome: 'Coluna Cervical',
    nomeLatim: 'Projeção Cervical',
    x: 138,
    y: 72,
    xCostas: 152,
    yCostas: 75,
    regiao: 'antihelix_cervical',
    sistema: 'neurofisiologico',
    prioridade: 'importante',
    funcao: 'Região somatotópica da coluna cervical (C1-C7). Tratamento de dores e distúrbios cervicais.',
    indicacoes: [
      'Cervicalgia',
      'Torcicolo',
      'Dor na nuca',
      'Rigidez cervical',
      'Hérnia de disco cervical',
      'Cefaleia cervical'
    ],
    neuroEvidencia: 'Projeção somatotópica inversa da coluna cervical na anti-hélice.',
  },
  
  {
    id: 'lombar',
    codigo: 'MA-AH-L1',
    nome: 'Coluna Lombar',
    nomeLatim: 'Projeção Lombar',
    x: 132,
    y: 138,
    xCostas: 148,
    yCostas: 140,
    regiao: 'antihelix_lombar',
    sistema: 'neurofisiologico',
    prioridade: 'importante',
    funcao: 'Região somatotópica da coluna lombar (L1-L5). Tratamento de dores lombares e distúrbios.',
    indicacoes: [
      'Lombalgia',
      'Hérnia de disco lombar',
      'Ciática',
      'Dor na coluna lombar',
      'Contratura muscular lombar',
      'Espondilolistese'
    ],
    neuroEvidencia: 'Projeção somatotópica da coluna lombar na anti-hélice.',
  },
  
  {
    id: 'joelho',
    codigo: 'MA-HX-JO',
    nome: 'Joelho',
    nomeLatim: 'Projeção do Joelho',
    x: 95,
    y: 145,
    xCostas: 112,
    yCostas: 148,
    regiao: 'escafa',
    sistema: 'neurofisiologico',
    prioridade: 'importante',
    funcao: 'Articulação do joelho - projeção somatotópica. Dor e inflamação articular.',
    indicacoes: [
      'Dor no joelho',
      'Gonartrose',
      'Lesões ligamentares',
      'Bursite patelar',
      'Síndrome da banda iliotibial'
    ],
    neuroEvidencia: 'Representação somatotópica do joelho na escafa.',
  },
  
  {
    id: 'ombro',
    codigo: 'MA-HX-OM',
    nome: 'Ombro',
    nomeLatim: 'Projeção do Ombro',
    x: 88,
    y: 95,
    regiao: 'helix_superior',
    sistema: 'neurofisiologico',
    prioridade: 'importante',
    funcao: 'Articulação do ombro - projeção somatotópica. Dor e limitação de movimento.',
    indicacoes: [
      'Dor no ombro',
      'Bursite subacromial',
      'Tendinite do manguito rotador',
      'Capsulite adesiva',
      'Síndrome do impacto'
    ],
    neuroEvidencia: 'Representação somatotópica do ombro na hélice superior.',
  },

  // ==========================================================================
  // PONTOS COMPLEMENTARES
  // ==========================================================================
  
  {
    id: 'fome',
    codigo: 'MA-TR-01',
    nome: 'Fome',
    nomeLatim: 'Ponto de Controle do Apetite',
    x: 85,
    y: 195,
    xCostas: 105,
    yCostas: 198,
    regiao: 'tragus',
    sistema: 'neurofisiologico',
    prioridade: 'importante',
    funcao: 'Controle do apetite e compulsão alimentar. Regulação do centro da fome no hipotálamo.',
    indicacoes: [
      'Compulsão alimentar',
      'Obesidade',
      'Fome excessiva',
      'Bulimia nervosa',
      'Ansiedade por comida'
    ],
    neuroEvidencia: 'Modulação do centro da fome no hipotálamo ventromedial.',
  },
  
  {
    id: 'vicios',
    codigo: 'MA-TR-02',
    nome: 'Vícios',
    nomeLatim: 'Ponto para Dependências',
    x: 85,
    y: 212,
    xCostas: 105,
    yCostas: 215,
    regiao: 'tragus',
    sistema: 'neurofisiologico',
    prioridade: 'importante',
    funcao: 'Transtorno por uso de substâncias. Controle de vícios químicos e comportamentais.',
    indicacoes: [
      'Tabagismo',
      'Dependência de álcool',
      'Dependência de drogas',
      'Síndrome de abstinência',
      'Compulsões comportamentais'
    ],
    neuroEvidencia: 'Modulação do sistema de recompensa mesolímbico. Redução de cravings.',
  },
  
  {
    id: 'adrenal',
    codigo: 'MA-CC-03',
    nome: 'Glândula Adrenal',
    nomeLatim: 'Ponto da Adrenal',
    x: 118,
    y: 178,
    xCostas: 135,
    yCostas: 180,
    regiao: 'concha_cimba',
    sistema: 'neurofisiologico',
    prioridade: 'importante',
    funcao: 'Regulação da resposta ao estresse. Modulação do cortisol e catecolaminas. Anti-inflamatório.',
    indicacoes: [
      'Estresse crônico',
      'Fadiga adrenal',
      'Síndrome de burnout',
      'Alergias',
      'Inflamação',
      'Hipotensão ortostática'
    ],
    neuroEvidencia: 'Modulação da função adrenal e liberação de cortisol.',
  },
  
  {
    id: 'endocrino',
    codigo: 'MA-CV-04',
    nome: 'Endócrino',
    nomeLatim: 'Ponto do Sistema Endócrino',
    x: 105,
    y: 225,
    xCostas: 122,
    yCostas: 228,
    regiao: 'concha_cava',
    sistema: 'neurofisiologico',
    prioridade: 'importante',
    funcao: 'Regulação hormonal global. Distúrbios endócrinos e metabólicos. Equilíbrio do sistema hormonal.',
    indicacoes: [
      'Distúrbios hormonais',
      'Diabetes mellitus',
      'Disfunção tireoidiana',
      'Síndrome dos ovários policísticos',
      'Menopausa',
      'Obesidade endócrina'
    ],
    neuroEvidencia: 'Modulação do eixo hipotálamo-hipófise.',
  },
];

// ============================================================================
// FUNÇÕES UTILITÁRIAS
// ============================================================================

export const getPontoById = (id: string): AuricularPoint | undefined => {
  return auricularPoints.find(p => p.id === id);
};

export const getPontosByProtocolo = (protocoloId: string): AuricularPoint[] => {
  const ids = PROTOCOLOS[protocoloId as keyof typeof PROTOCOLOS];
  if (!ids) return [];
  return ids.map(id => getPontoById(id)).filter(Boolean) as AuricularPoint[];
};

export const isPontoVisible = (
  point: AuricularPoint, 
  vista: AuricularVista, 
  sistema: SistemaAuricular
): boolean => {
  // Verificar se ponto existe na vista selecionada
  if (vista === 'verso' && (!point.xCostas || !point.yCostas)) {
    return false;
  }
  
  // Verificar filtro de sistema
  if (sistema === 'todos') return true;
  if (sistema === 'nada' && point.sistema === 'nada') return true;
  if (sistema === 'battlefield' && point.sistema === 'battlefield') return true;
  if (sistema === 'neurofisiologico') return true;
  
  return false;
};

// ============================================================================
// COMPONENTE SVG DA ORELHA COM ZOOM/PAN
// ============================================================================

interface EarSVGProps {
  selectedPoints: string[];
  hoveredPoint: string | null;
  onPointClick: (point: AuricularPoint) => void;
  onPointHover: (pointId: string | null) => void;
  vista: AuricularVista;
  sistema: SistemaAuricular;
  filtroRegiao?: string | null;
}

export const EarSVG: React.FC<EarSVGProps> = ({
  selectedPoints,
  hoveredPoint,
  onPointClick,
  onPointHover,
  vista,
  sistema,
  filtroRegiao
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Estados para zoom e pan
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(false);
  const [useRealisticImage, setUseRealisticImage] = useState(false);

  // Zoom com scroll do mouse
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.min(Math.max(scale * delta, 0.5), 4);
    setScale(newScale);
  };

  // Pan com mouse
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 || e.button === 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Reset zoom/pan
  const resetView = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  // Filtrar pontos visíveis
  const pontosVisiveis = auricularPoints.filter(p => {
    const matchesSistema = sistema === 'todos' || 
      (sistema === 'nada' && p.sistema === 'nada') ||
      (sistema === 'battlefield' && p.sistema === 'battlefield') ||
      (sistema === 'neurofisiologico');
    
    const matchesVista = vista === 'frente' || (p.xCostas && p.yCostas);
    const matchesRegiao = !filtroRegiao || p.regiao === filtroRegiao;
    
    return matchesSistema && matchesVista && matchesRegiao;
  });

  // Cores por prioridade
  const getPointColor = (ponto: AuricularPoint, isSelected: boolean, isHovered: boolean): string => {
    if (isSelected) return '#3b82f6'; // Azul vibrante
    if (isHovered) return '#f59e0b';  // Âmbar
    
    switch (ponto.prioridade) {
      case 'master': return '#ef4444';   // Vermelho - master
      case 'estrela': return '#10b981';  // Verde - estrela
      case 'importante': return '#8b5cf6'; // Roxo - importante
      default: return '#6b7280';         // Cinza - comum
    }
  };

  // Tamanho do ponto baseado na prioridade
  const getPointRadius = (ponto: AuricularPoint, isHovered: boolean): number => {
    const base = {
      master: 7,
      estrela: 6,
      importante: 5,
      comum: 4
    }[ponto.prioridade];
    
    return isHovered ? base * 1.4 : base;
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-black cursor-grab active:cursor-grabbing"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Controles de Zoom */}
      <div className="absolute top-4 right-4 z-30 flex flex-col gap-2">
        <button
          onClick={() => setScale(s => Math.min(s * 1.2, 4))}
          className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 
                     flex items-center justify-center text-white hover:bg-white/20 transition-all"
          title="Aumentar zoom"
        >
          <span className="text-xl font-bold">+</span>
        </button>
        <button
          onClick={() => setScale(s => Math.max(s * 0.8, 0.5))}
          className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 
                     flex items-center justify-center text-white hover:bg-white/20 transition-all"
          title="Diminuir zoom"
        >
          <span className="text-xl font-bold">−</span>
        </button>
        <button
          onClick={resetView}
          className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 
                     flex items-center justify-center text-white hover:bg-white/20 transition-all"
          title="Resetar visualização"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        <button
          onClick={() => setShowGrid(!showGrid)}
          className={`w-10 h-10 rounded-xl backdrop-blur-md border border-white/20 
                     flex items-center justify-center transition-all
                     ${showGrid ? 'bg-cyan-500/30 text-cyan-300' : 'bg-white/10 text-white hover:bg-white/20'}`}
          title="Grade de referência"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </button>
        <button
          onClick={() => setUseRealisticImage(!useRealisticImage)}
          className={`w-10 h-10 rounded-xl backdrop-blur-md border border-white/20 
                     flex items-center justify-center transition-all
                     ${useRealisticImage ? 'bg-amber-500/30 text-amber-300' : 'bg-white/10 text-white hover:bg-white/20'}`}
          title={useRealisticImage ? 'Modo vetorial' : 'Modo realista'}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
      </div>

      {/* Imagem realista da orelha (quando ativada) */}
      {useRealisticImage && vista === 'frente' && (
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
          }}
        >
          <img 
            src="/orelha-realista.jpg" 
            alt="Orelha"
            className="max-w-full max-h-full object-contain opacity-95 dark:opacity-85"
            style={{ 
              width: '100%',
              height: '100%',
              maxWidth: '400px',
              maxHeight: '500px',
              filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.25))',
            }}
            draggable={false}
          />
        </div>
      )}

      {/* Info de Zoom */}
      <div className="absolute bottom-4 right-4 z-30 px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-md 
                      border border-white/10 text-white/60 text-xs font-mono">
        {Math.round(scale * 100)}%
      </div>

      {/* SVG Container com Transformações */}
      <svg
        ref={svgRef}
        viewBox="0 0 300 400"
        className="w-full h-full"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.1s ease-out'
        }}
      >
        <defs>
          {/* Gradientes */}
          <linearGradient id="skinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e8c4b8" />
            <stop offset="50%" stopColor="#d4a89c" />
            <stop offset="100%" stopColor="#c49488" />
          </linearGradient>
          
          <radialGradient id="innerShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.2)" />
          </radialGradient>

          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.3)"/>
          </filter>
        </defs>

        {/* Grade de referência (opcional) */}
        {showGrid && (
          <g opacity="0.1">
            {Array.from({ length: 31 }, (_, i) => (
              <line key={`v${i}`} x1={i * 10} y1="0" x2={i * 10} y2="400" stroke="white" strokeWidth="0.5" />
            ))}
            {Array.from({ length: 41 }, (_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 10} x2="300" y2={i * 10} stroke="white" strokeWidth="0.5" />
            ))}
          </g>
        )}

        {/* ESTRUTURA DA ORELHA */}
        <g id="ear-structure" style={{ opacity: useRealisticImage ? 0.3 : 1 }}>
          {vista === 'frente' ? (
            <>
              {/* Hélice - Borda externa */}
              <path
                d="M 75 320 
                   C 65 295, 60 260, 65 220
                   C 70 175, 82 130, 100 95
                   C 112 70, 130 52, 155 45
                   C 180 40, 205 48, 225 65
                   C 242 80, 252 105, 255 135
                   C 258 170, 255 205, 248 240
                   C 240 280, 228 315, 215 345
                   C 208 362, 195 378, 178 388
                   C 158 398, 135 402, 112 398
                   C 88 393, 70 375, 62 352
                   C 58 340, 60 330, 75 320"
                fill="url(#skinGradient)"
                stroke="#b89080"
                strokeWidth="2"
                filter="url(#shadow)"
              />

              {/* Sombra interna da hélice */}
              <path
                d="M 95 295
                   C 88 270, 85 235, 90 200
                   C 95 160, 108 120, 125 92
                   C 138 72, 158 62, 178 62
                   C 198 63, 215 75, 228 92
                   C 238 108, 242 130, 240 155
                   C 238 185, 232 215, 224 245
                   C 215 278, 203 308, 188 335
                   C 180 350, 168 362, 152 370
                   C 135 378, 115 380, 98 375
                   C 85 370, 75 358, 72 340
                   C 70 330, 72 318, 78 308"
                fill="url(#innerShadow)"
                opacity="0.5"
              />

              {/* Anti-hélice - Ramo superior (cervical) */}
              <path
                d="M 135 245
                   C 130 220, 128 190, 132 160
                   C 136 130, 145 105, 158 88
                   C 168 75, 182 70, 195 75
                   C 208 82, 215 95, 212 112
                   C 210 128, 200 142, 188 152
                   C 178 160, 168 163, 160 160
                   C 150 155, 142 145, 138 130
                   C 134 115, 133 100, 138 88"
                fill="#dcb8a8"
                stroke="#c4a090"
                strokeWidth="1.5"
              />

              {/* Anti-hélice - Ramo inferior (lombar) */}
              <path
                d="M 135 245
                   C 130 265, 132 285, 140 300
                   C 148 315, 160 322, 175 318
                   C 188 314, 198 302, 200 285
                   C 202 268, 195 250, 185 235
                   C 175 220, 162 208, 150 200
                   C 142 195, 136 192, 135 188"
                fill="#dcb8a8"
                stroke="#c4a090"
                strokeWidth="1.5"
              />

              {/* Fossa Triangular */}
              <path
                d="M 158 88
                   L 168 128
                   L 138 145
                   L 142 108
                   Z"
                fill="#c49888"
                stroke="#b08878"
                strokeWidth="1"
              />

              {/* Concha Cimba */}
              <path
                d="M 168 128
                   C 180 125, 192 132, 200 145
                   C 208 160, 210 180, 205 200
                   C 200 218, 190 230, 178 235
                   C 168 238, 158 235, 150 225
                   C 142 215, 138 200, 140 182
                   C 142 165, 148 148, 158 135
                   C 162 130, 165 128, 168 128"
                fill="#c08878"
                stroke="#a87868"
                strokeWidth="1"
              />

              {/* Concha Cava */}
              <path
                d="M 150 225
                   C 158 235, 168 238, 180 235
                   C 195 230, 208 215, 215 195
                   C 220 175, 218 152, 210 132
                   C 202 115, 190 105, 178 102
                   C 170 100, 165 105, 168 115
                   C 172 128, 180 145, 182 165
                   C 184 185, 180 205, 172 220
                   C 165 230, 158 235, 150 230"
                fill="#d09888"
                stroke="#b88878"
                strokeWidth="1"
              />

              {/* Cruz da Hélice */}
              <path
                d="M 168 115
                   C 165 125, 162 140, 160 158
                   C 158 180, 160 205, 165 230
                   C 168 245, 172 255, 178 258
                   C 182 260, 185 255, 185 245
                   C 185 235, 182 222, 178 205
                   C 174 188, 172 168, 172 148
                   C 172 132, 175 120, 178 112
                   C 180 105, 182 100, 178 98
                   C 175 96, 170 100, 168 115"
                fill="#e8c4b8"
                stroke="#c4a090"
                strokeWidth="1"
              />

              {/* Tragus */}
              <path
                d="M 88 220
                   C 84 208, 85 192, 90 178
                   C 95 165, 105 155, 118 152
                   C 128 150, 135 155, 138 168
                   C 140 180, 138 195, 132 208
                   C 125 222, 115 232, 105 235
                   C 95 237, 88 233, 85 225
                   C 83 220, 85 215, 88 220"
                fill="#dcb8a8"
                stroke="#c4a090"
                strokeWidth="1.5"
              />

              {/* Antitrago */}
              <path
                d="M 145 258
                   C 140 248, 142 238, 150 230
                   C 158 222, 170 220, 182 225
                   C 194 232, 202 245, 204 260
                   C 206 275, 202 290, 194 302
                   C 185 313, 172 318, 160 315
                   C 148 312, 140 302, 142 285
                   C 143 272, 144 264, 145 258"
                fill="#dcb8a8"
                stroke="#c4a090"
                strokeWidth="1.5"
              />

              {/* Lóbulo */}
              <path
                d="M 160 315
                   C 175 320, 192 318, 208 308
                   C 225 295, 238 275, 245 250
                   C 250 228, 248 208, 240 195
                   C 235 188, 230 192, 228 202
                   C 226 215, 222 232, 215 250
                   C 206 270, 192 288, 175 300
                   C 165 307, 155 310, 148 308
                   C 143 306, 145 312, 160 315"
                fill="#e8c4b8"
                stroke="#c4a090"
                strokeWidth="1.5"
              />

              {/* Escafa */}
              <path
                d="M 118 152
                   C 122 145, 130 138, 142 132
                   C 155 128, 170 128, 182 135
                   C 192 142, 198 155, 198 172
                   C 198 190, 190 208, 178 222
                   C 168 232, 155 235, 145 230
                   C 135 225, 128 212, 125 195
                   C 122 178, 120 162, 118 152"
                fill="#d4a090"
                stroke="#b89080"
                strokeWidth="0.5"
                opacity="0.6"
              />
            </>
          ) : (
            // VISTA DE COSTAS
            <>
              <path
                d="M 70 315
                   C 60 290, 55 255, 60 215
                   C 65 170, 78 125, 95 90
                   C 108 65, 128 48, 152 42
                   C 178 38, 202 45, 220 62
                   C 238 78, 248 105, 250 138
                   C 252 175, 248 212, 240 248
                   C 230 290, 218 325, 205 355
                   C 196 372, 182 385, 162 392
                   C 140 400, 115 402, 90 395
                   C 68 388, 50 370, 45 345
                   C 42 332, 45 320, 58 310"
                fill="url(#skinGradient)"
                stroke="#b89080"
                strokeWidth="2"
                filter="url(#shadow)"
              />

              {/* Sombra interna costas */}
              <path
                d="M 88 290
                   C 82 265, 80 230, 85 195
                   C 92 155, 108 118, 125 92
                   C 140 72, 162 62, 185 65
                   C 208 70, 225 88, 232 112
                   C 238 140, 235 175, 228 210
                   C 220 248, 208 285, 192 315
                   C 180 335, 162 348, 140 352
                   C 118 355, 95 348, 82 328
                   C 75 315, 78 300, 88 285"
                fill="url(#innerShadow)"
                opacity="0.5"
              />

              {/* Linha de dobra anti-hélice costas */}
              <path
                d="M 118 250
                   C 112 215, 115 175, 125 140
                   C 135 105, 152 82, 175 72
                   C 198 65, 218 75, 228 98
                   C 235 120, 230 150, 218 180
                   C 208 210, 192 238, 172 262
                   C 155 282, 138 290, 125 285
                   C 115 280, 112 268, 118 250"
                fill="#c49888"
                stroke="#a87868"
                strokeWidth="1"
                opacity="0.7"
              />
            </>
          )}
        </g>

        {/* PONTOS AURICULARES */}
        <g id="auricular-points">
          {pontosVisiveis.map((ponto) => {
            const isSelected = selectedPoints.includes(ponto.id);
            const isHovered = hoveredPoint === ponto.id;
            const px = vista === 'verso' && ponto.xCostas ? ponto.xCostas : ponto.x;
            const py = vista === 'verso' && ponto.yCostas ? ponto.yCostas : ponto.y;
            const color = getPointColor(ponto, isSelected, isHovered);
            const radius = getPointRadius(ponto, isHovered);

            return (
              <g key={ponto.id}>
                {/* Halo de seleção */}
                {(isSelected || isHovered) && (
                  <circle
                    cx={px}
                    cy={py}
                    r={radius + 8}
                    fill={color}
                    opacity="0.2"
                    filter="url(#glow)"
                  />
                )}

                {/* Ponto principal */}
                <motion.circle
                  cx={px}
                  cy={py}
                  r={radius}
                  fill={color}
                  stroke="white"
                  strokeWidth={isSelected ? 3 : 2}
                  filter="url(#shadow)"
                  style={{ cursor: 'pointer' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onPointClick(ponto);
                  }}
                  onMouseEnter={() => onPointHover(ponto.id)}
                  onMouseLeave={() => onPointHover(null)}
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                />

                {/* Indicador de master point */}
                {ponto.prioridade === 'master' && (
                  <circle
                    cx={px}
                    cy={py}
                    r={radius + 4}
                    fill="none"
                    stroke={color}
                    strokeWidth="1"
                    strokeDasharray="2 2"
                    opacity="0.6"
                  />
                )}

                {/* Tooltip no hover */}
                {isHovered && (
                  <g>
                    <rect
                      x={px + 18}
                      y={py - 50}
                      width={180}
                      height={65}
                      rx={10}
                      fill="rgba(15, 23, 42, 0.95)"
                      stroke={color}
                      strokeWidth="2"
                      filter="url(#shadow)"
                    />
                    <path
                      d={`M ${px + 12} ${py - 15} L ${px + 18} ${py - 20} L ${px + 18} ${py - 10} Z`}
                      fill="rgba(15, 23, 42, 0.95)"
                      stroke={color}
                      strokeWidth="0.5"
                    />
                    <text
                      x={px + 28}
                      y={py - 30}
                      fill="white"
                      fontSize="12"
                      fontWeight="bold"
                    >
                      {ponto.nome}
                    </text>
                    <text
                      x={px + 28}
                      y={py - 16}
                      fill={color}
                      fontSize="10"
                      fontFamily="monospace"
                    >
                      {ponto.codigo}
                    </text>
                    <text
                      x={px + 28}
                      y={py - 4}
                      fill="rgba(255,255,255,0.7)"
                      fontSize="9"
                    >
                      {ponto.regiao.replace(/_/g, ' ')}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Overlay de instrução (desaparece após interação) */}
      <div className="absolute bottom-4 left-4 pointer-events-none">
        <div className="px-3 py-2 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 
                        text-white/50 text-xs">
          <span className="inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            Scroll para zoom • Arraste para mover
          </span>
        </div>
      </div>
    </div>
  );
};

export default EarSVG;
