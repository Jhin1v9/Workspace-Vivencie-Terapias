// ============================================================================
// PONTOS AURICULARES - AURICULOTERAPIA NEUROFISIOLÓGICA
// Baseado em: NADA Protocol, Battlefield Acupuncture, UFSC Protocols
// ============================================================================
// 
// SISTEMAS INCLUÍDOS:
// - NADA (National Acupuncture Detoxification Association)
// - Battlefield Acupuncture (Dr. Richard Niemtzow)
// - Auriculoterapia Neurofisiológica Brasileira (UFSC, USP)
// - Protocolos da OMS para Auriculoterapia
//
// NOMENCLATURA:
// MA = Microssistema Auricular
// Códigos seguem padronização internacional
//
// ============================================================================

import type { PontoAuricular } from '@/types';

export const pontosNeurofisiologicos: PontoAuricular[] = [
  // ==========================================================================
  // PROTOCOLO NADA - 5 Pontos Fundamentais
  // ==========================================================================
  {
    id: 'shenmen',
    codigo: 'MA-FT-01',
    nome_pt: 'Shen Men',

    regiao: 'fossa_triangular',
    coordenadas: { x: 128, y: 98 },
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
    contraindicacoes: [],
    prioridade: 'estrela',
    sistema: 'neurofisiologico',
  },
  {
    id: 'simpatico',
    codigo: 'MA-AH-01',
    nome_pt: 'Simpático',

    regiao: 'antihelice',
    coordenadas: { x: 98, y: 125 },
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
    contraindicacoes: [],
    prioridade: 'estrela',
    sistema: 'neurofisiologico',
  },
  {
    id: 'rim',
    codigo: 'MA-CC-01',
    nome_pt: 'Rim',

    regiao: 'concha_cimba',
    coordenadas: { x: 152, y: 128 },
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
    contraindicacoes: [],
    prioridade: 'estrela',
    sistema: 'neurofisiologico',
  },
  {
    id: 'figado',
    codigo: 'MA-CC-02',
    nome_pt: 'Fígado',

    regiao: 'concha_cimba',
    coordenadas: { x: 168, y: 142 },
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
    contraindicacoes: ['Gestante com histórico de aborto'],
    prioridade: 'estrela',
    sistema: 'neurofisiologico',
  },
  {
    id: 'pulmao',
    codigo: 'MA-CV-01',
    nome_pt: 'Pulmão',

    regiao: 'concha_cava',
    coordenadas: { x: 145, y: 188 },
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
    contraindicacoes: [],
    prioridade: 'estrela',
    sistema: 'neurofisiologico',
  },

  // ==========================================================================
  // PROTOCOLO BATTLEFIELD - Pontos de Dor
  // ==========================================================================
  {
    id: 'talamo',
    codigo: 'MA-AT-01',
    nome_pt: 'Tálamo',

    regiao: 'antitrago',
    coordenadas: { x: 142, y: 242 },
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
    contraindicacoes: [],
    prioridade: 'estrela',
    sistema: 'neurofisiologico',
  },
  {
    id: 'giro-cingulado',
    codigo: 'MA-AT-02',
    nome_pt: 'Giro Cingulado',

    regiao: 'antitrago',
    coordenadas: { x: 128, y: 235 },
    funcao: 'Modulação da componente afetiva-emocional da dor. Regulação do circuito límbico e processamento emocional. Redução da ansiedade associada à dor.',
    indicacoes: [
      'Dor crônica com componente emocional',
      'Ansiedade associada à dor',
      'Depressão com dor somática',
      'Somatização',
      'Distúrbios do humor',
      'Estresse pós-traumático'
    ],
    contraindicacoes: [],
    prioridade: 'estrela',
    sistema: 'neurofisiologico',
  },
  {
    id: 'omega2',
    codigo: 'MA-FT-02',
    nome_pt: 'Omega 2',

    regiao: 'fossa_triangular',
    coordenadas: { x: 115, y: 105 },
    funcao: 'Modulação profunda do sistema límbico. Equilíbrio entre os hemisférios cerebrais. Regulação de emoções intensas e memória traumática.',
    indicacoes: [
      'Trauma emocional',
      'Memórias intrusivas',
      'Estresse pós-traumático',
      'Transtornos dissociativos',
      'Crises de pânico',
      'Desequilíbrio hemisférico'
    ],
    contraindicacoes: [],
    prioridade: 'estrela',
    sistema: 'neurofisiologico',
  },
  {
    id: 'ponto-zero',
    codigo: 'MA-HX-01',
    nome_pt: 'Ponto Zero',

    regiao: 'helice',
    coordenadas: { x: 108, y: 165 },
    funcao: 'Centro de homeostase e equilíbrio energético do organismo. Potencializador de outros pontos. Regulação geral do sistema nervoso autônomo.',
    indicacoes: [
      'Desequilíbrio geral do organismo',
      'Síndromes de disautonomia',
      'Potencialização terapêutica',
      'Regulação de funções vitais',
      'Estresse crônico multissistêmico',
      'Síndrome da fadiga crônica'
    ],
    contraindicacoes: [],
    prioridade: 'estrela',
    sistema: 'neurofisiologico',
  },

  // ==========================================================================
  // PONTOS NEUROFISIOLÓGICOS ADICIONAIS
  // ==========================================================================
  {
    id: 'subcortex',
    codigo: 'MA-AT-03',
    nome_pt: 'Subcórtex',

    regiao: 'antitrago',
    coordenadas: { x: 158, y: 248 },
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
    contraindicacoes: [],
    prioridade: 'importante',
    sistema: 'neurofisiologico',
  },
  {
    id: 'ansiedade',
    codigo: 'MA-LB-01',
    nome_pt: 'Ansiedade',

    regiao: 'lobulo',
    coordenadas: { x: 158, y: 305 },
    funcao: 'Ponto específico para transtornos de ansiedade. Calma a agitação mental e emocional. Redução da taquicardia e sudorese de ansiedade.',
    indicacoes: [
      'Transtorno de ansiedade generalizada',
      'Ataques de pânico',
      'Agitação psicomotora',
      'Insônia por ansiedade',
      'Irritabilidade',
      'Nervosismo excessivo'
    ],
    contraindicacoes: [],
    prioridade: 'importante',
    sistema: 'neurofisiologico',
  },
  {
    id: 'relax-muscular',
    codigo: 'MA-CV-02',
    nome_pt: 'Relaxamento Muscular',

    regiao: 'concha_cava',
    coordenadas: { x: 162, y: 195 },
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
    contraindicacoes: [],
    prioridade: 'importante',
    sistema: 'neurofisiologico',
  },
  {
    id: 'coracao',
    codigo: 'MA-CV-03',
    nome_pt: 'Coração',

    regiao: 'concha_cava',
    coordenadas: { x: 152, y: 205 },
    funcao: 'Regulação do sistema cardiovascular e emocional. Harmonização do Shen (espírito/consciência). Calma palpitações e agitação.',
    indicacoes: [
      'Ansiedade e agitação mental',
      'Palpitações',
      'Insônia',
      'Problemas circulatórios',
      'Estresse emocional',
      'Tristeza profunda'
    ],
    contraindicacoes: [],
    prioridade: 'importante',
    sistema: 'neurofisiologico',
  },

  // ==========================================================================
  // SISTEMA MUSCULOESQUELÉTICO - Somatotopia
  // ==========================================================================
  {
    id: 'cervical',
    codigo: 'MA-AH-C1',
    nome_pt: 'Coluna Cervical',

    regiao: 'antihelice',
    coordenadas: { x: 138, y: 72 },
    funcao: 'Região somatotópica da coluna cervical (C1-C7). Tratamento de dores e distúrbios cervicais.',
    indicacoes: [
      'Cervicalgia',
      'Torcicolo',
      'Dor na nuca',
      'Rigidez cervical',
      'Hérnia de disco cervical',
      'Cefaleia cervical'
    ],
    contraindicacoes: [],
    prioridade: 'importante',
    sistema: 'neurofisiologico',
  },
  {
    id: 'lombar',
    codigo: 'MA-AH-L1',
    nome_pt: 'Coluna Lombar',

    regiao: 'antihelice',
    coordenadas: { x: 132, y: 138 },
    funcao: 'Região somatotópica da coluna lombar (L1-L5). Tratamento de dores lombares e distúrbios.',
    indicacoes: [
      'Lombalgia',
      'Hérnia de disco lombar',
      'Ciática',
      'Dor na coluna lombar',
      'Contratura muscular lombar',
      'Espondilolistese'
    ],
    contraindicacoes: [],
    prioridade: 'importante',
    sistema: 'neurofisiologico',
  },
  {
    id: 'joelho',
    codigo: 'MA-HX-JO',
    nome_pt: 'Joelho',

    regiao: 'helice',
    coordenadas: { x: 95, y: 145 },
    funcao: 'Articulação do joelho - projeção somatotópica. Dor e inflamação articular.',
    indicacoes: [
      'Dor no joelho',
      'Gonartrose',
      'Lesões ligamentares',
      'Bursite patelar',
      'Síndrome da banda iliotibial'
    ],
    contraindicacoes: [],
    prioridade: 'importante',
    sistema: 'neurofisiologico',
  },
  {
    id: 'ombro',
    codigo: 'MA-HX-OM',
    nome_pt: 'Ombro',

    regiao: 'helice',
    coordenadas: { x: 88, y: 95 },
    funcao: 'Articulação do ombro - projeção somatotópica. Dor e limitação de movimento.',
    indicacoes: [
      'Dor no ombro',
      'Bursite subacromial',
      'Tendinite do manguito rotador',
      'Capsulite adesiva',
      'Síndrome do impacto'
    ],
    contraindicacoes: [],
    prioridade: 'importante',
    sistema: 'neurofisiologico',
  },

  // ==========================================================================
  // PONTOS COMPLEMENTARES
  // ==========================================================================
  {
    id: 'fome',
    codigo: 'MA-TR-01',
    nome_pt: 'Fome',

    regiao: 'tragus',
    coordenadas: { x: 85, y: 195 },
    funcao: 'Controle do apetite e compulsão alimentar. Regulação do centro da fome no hipotálamo.',
    indicacoes: [
      'Compulsão alimentar',
      'Obesidade',
      'Fome excessiva',
      'Bulimia nervosa',
      'Ansiedade por comida'
    ],
    contraindicacoes: [],
    prioridade: 'importante',
    sistema: 'neurofisiologico',
  },
  {
    id: 'vicios',
    codigo: 'MA-TR-02',
    nome_pt: 'Vícios',

    regiao: 'tragus',
    coordenadas: { x: 85, y: 212 },
    funcao: 'Transtorno por uso de substâncias. Controle de vícios químicos e comportamentais.',
    indicacoes: [
      'Tabagismo',
      'Dependência de álcool',
      'Dependência de drogas',
      'Síndrome de abstinência',
      'Compulsões comportamentais'
    ],
    contraindicacoes: [],
    prioridade: 'importante',
    sistema: 'neurofisiologico',
  },
  {
    id: 'adrenal',
    codigo: 'MA-CC-03',
    nome_pt: 'Glândula Adrenal',

    regiao: 'concha_cimba',
    coordenadas: { x: 118, y: 178 },
    funcao: 'Regulação da resposta ao estresse. Modulação do cortisol e catecolaminas. Anti-inflamatório.',
    indicacoes: [
      'Estresse crônico',
      'Fadiga adrenal',
      'Síndrome de burnout',
      'Alergias',
      'Inflamação',
      'Hipotensão ortostática'
    ],
    contraindicacoes: [],
    prioridade: 'importante',
    sistema: 'neurofisiologico',
  },
  {
    id: 'endocrino',
    codigo: 'MA-CV-04',
    nome_pt: 'Endócrino',

    regiao: 'concha_cava',
    coordenadas: { x: 105, y: 225 },
    funcao: 'Regulação hormonal global. Distúrbios endócrinos e metabólicos. Equilíbrio do sistema hormonal.',
    indicacoes: [
      'Distúrbios hormonais',
      'Diabetes mellitus',
      'Disfunção tireoidiana',
      'Síndrome dos ovários policísticos',
      'Menopausa',
      'Obesidade endócrina'
    ],
    contraindicacoes: [],
    prioridade: 'importante',
    sistema: 'neurofisiologico',
  },
];

// ============================================================================
// PROTOCOLOS TERAPÊUTICOS
// ============================================================================

export const PROTOCOLOS_MOCKS = {
  NADA: {
    nome: 'Protocolo NADA',
    descricao: 'Protocolo de 5 pontos para dependências, trauma e estresse',
    indicacoes: ['Dependências químicas', 'TEPT', 'Ansiedade', 'Estresse agudo'],
    pontos: ['shenmen', 'simpatico', 'rim', 'figado', 'pulmao'],
    fonte: 'National Acupuncture Detoxification Association (1985)'
  },
  BATTLEFIELD: {
    nome: 'Battlefield Acupuncture',
    descricao: 'Protocolo de dor aguda desenvolvido para uso em campo de batalha',
    indicacoes: ['Dor aguda', 'Dor traumática', 'Dor pós-operatória'],
    pontos: ['talamo', 'giro-cingulado', 'omega2', 'ponto-zero', 'shenmen'],
    fonte: 'Dr. Richard Niemtzow - US Air Force'
  },
  TRIANGULO_CIBERNETICO: {
    nome: 'Triângulo Cibernético',
    descricao: 'Harmonização geral do sistema neurovegetativo',
    indicacoes: ['Harmonização geral', 'Preparação terapêutica', 'Equilíbrio energético'],
    pontos: ['shenmen', 'rim', 'simpatico'],
    fonte: 'Marcelo Pereira de Souza - Auriculoterapia Brasileira'
  },
  ANSIEDADE: {
    nome: 'Protocolo para Ansiedade',
    descricao: 'Calma e regulação emocional profunda',
    indicacoes: ['Ansiedade generalizada', 'Pânico', 'Insônia', 'Estresse'],
    pontos: ['shenmen', 'subcortex', 'ansiedade', 'coracao', 'rim'],
    fonte: 'UFSC - Protocolos de Auriculoterapia (2020)'
  },
  DOR_AGUDA: {
    nome: 'Dor Aguda',
    descricao: 'Analgesia imediata e potente',
    indicacoes: ['Dor traumática', 'Dor pós-operatória', 'Cólica'],
    pontos: ['simpatico', 'shenmen', 'talamo', 'ponto-zero'],
    fonte: 'Protocolo Neurofisiológico de Dor'
  },
  DOR_CRONICA: {
    nome: 'Dor Crônica',
    descricao: 'Manejo da dor persistente e neuropática',
    indicacoes: ['Fibromialgia', 'Dor neuropática', 'Dor lombar crônica'],
    pontos: ['shenmen', 'subcortex', 'talamo', 'relax-muscular'],
    fonte: 'Protocolo Neurofisiológico de Dor Crônica'
  },
};

// ============================================================================
// INFORMAÇÕES SOBRE NEUROFISIOLOGIA
// ============================================================================

export const infoNeurofisiologia = {
  titulo: 'Bases Neurofisiológicas da Auriculoterapia',
  conteudo: `
## Mecanismos de Ação Comprovados

### 1. Inervação da Orelha
A orelha é inervada por 4 nervos cranianos:
- **Nervo Trigêmeo (V)** - sensibilidade facial
- **Nervo Facial (VII)** - expressão facial
- **Nervo Glossofaríngeo (IX)** - faringe e língua
- **Nervo Vago (X)** - sistema parassimpático

### 2. Modulação das Vias de Dor
Estimulação auricular ativa vias descendentes no SNC que bloqueiam a transmissão da dor via substância P.

### 3. Sistema Vagal (t-VNS)
A concha cava é inervada pelo nervo vago; sua estimulação ativa resposta parassimpática, reduzindo inflamação sistêmica.

### 4. Liberação de Opioides Endógenos
Efeito bloqueado por naloxona, demonstrando participação de β-endorfinas e encefalinas.

### 5. Neuromodulação Cortical
Estudos de fMRI demonstram ativação específica de:
- Córtex cingulado anterior
- Tálamo
- Hipotálamo
- Sistema límbico
`,
  fontes: [
    'NADA Protocol - National Acupuncture Detoxification Association',
    'Battlefield Acupuncture - Dr. Richard Niemtzow',
    'UFSC - Protocolos de Auriculoterapia (2016, 2020)',
    'Usichenko, V.I. et al. (2017) - Auricular Acupuncture for Pain',
    'OMS - Estratégia de Medicina Tradicional 2014-2023'
  ]
};

// ============================================================================
// FUNÇÕES UTILITÁRIAS
// ============================================================================

export const getPontoById = (id: string): PontoAuricular | undefined => {
  return pontosNeurofisiologicos.find(p => p.id === id);
};

export const getPontosByProtocolo = (protocoloId: string): PontoAuricular[] => {
  const protocolo = PROTOCOLOS_MOCKS[protocoloId as keyof typeof PROTOCOLOS_MOCKS];
  if (!protocolo) return [];
  return protocolo.pontos
    .map(id => getPontoById(id))
    .filter((p): p is PontoAuricular => p !== undefined);
};

export default pontosNeurofisiologicos;
