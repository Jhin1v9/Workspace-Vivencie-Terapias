// ============================================================================
// TIPAGEM TYPESCRIPT STRICT - AURIS OS
// Sistema Neurofisiológico e Holístico
// ============================================================================

// ============================================================================
// AVALIAÇÃO HOLÍSTICA NEUROFISIOLÓGICA
// ============================================================================

export interface AvaliacaoNeurofisiologica {
  frequencia_cardiaca_repouso: number;
  variabilidade_fc: 'alta' | 'normal' | 'baixa';
  tonus_muscular: 'hipertonico' | 'normal' | 'hipotonico';
  sensibilidade_dor: 'aumentada' | 'normal' | 'diminuida';
  equilibrio_autonomico: 'simpatico_dominante' | 'parassimpatico_dominante' | 'equilibrado';
  estado_geral: 'otimo' | 'bom' | 'regular' | 'debilitado';
}

export interface InspecaoHolistica {
  estado_geral: 'vivaz' | 'apagado' | 'agitado' | 'depressivo' | null;
  coloracao_pele: 'normal' | 'palida' | 'ruborizada' | 'cianotica' | 'icterica' | null;
  olhos: {
    brilho: 'vivaz' | 'apagado';
    olheiras: boolean;
    conjuntiva: 'normal' | 'hiperemiada' | 'icterica';
  };
  lingua?: {
    cor: string;
    saburra: string;
    formato: string;
    foto_url?: string;
  };
}

export interface AuscultacaoHolistica {
  voz: 'forte' | 'fraca' | 'rouca' | 'suspirada' | null;
  respiracao: 'superficial' | 'profunda' | 'ofegante' | 'ritmica' | null;
  intestinos?: 'normal' | 'hiperativo' | 'hipoativo' | null;
}

export interface InterrogatorioHolistico {
  // Termorregulação
  sensacao_termica: 'calor' | 'frio' | 'indiferente' | null;
  sudorese: 'diurna' | 'noturna' | 'ausente' | 'excessiva' | null;
  
  // Sistema nervoso
  cefaleia_localizacao: 'frontal' | 'temporal' | 'occipital' | 'hemitranium' | null;
  cefaleia_intensidade: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  cefaleia_frequencia: 'nunca' | 'raramente' | 'mensal' | 'semanal' | 'diaria';
  
  // Sistema digestivo
  apetite: 'excessivo' | 'normal' | 'diminuido' | 'compulsivo' | null;
  sede: 'aumentada' | 'normal' | 'diminuida' | null;
  digestao: 'normal' | 'lenta' | 'rapida' | 'dolorosa' | null;
  evacuacao: 'normal' | 'constipacao' | 'diarreia' | 'alternante' | null;
  
  // Sono
  sono: {
    qualidade: 'bom' | 'regular' | 'ruim';
    dificuldade_iniciar: boolean;
    dificuldade_manter: boolean;
    sonhos: 'ausentes' | 'normais' | 'intensos' | 'pesadelos';
    horas_sono: number;
  };
  
  // Emocional
  estado_emocional: {
    ansiedade: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    irritabilidade: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    tristeza: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    stress: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  };
  
  // Ginecológico (opcional)
  ciclo_menstrual?: {
    regularidade: 'regular' | 'irregular' | 'amenorreia';
    fluxo: 'normal' | 'escasso' | 'abundante';
    dismenorreia: boolean;
    tpm: boolean;
  } | null;
  
  libido: 'aumentada' | 'normal' | 'diminuida' | null;
  
  // Dor
  caracteristica_dor: 'aguda' | 'cronica' | 'pulsatil' | 'queimacao' | 'pontada' | 'peso' | null;
}

export interface AnamneseHolistica {
  queixa_principal: string;
  historia_doenca_atual: string;
  historia_medica_pregressa: string;
  medicacoes_em_uso: string[];
  alergias: string[];
  cirurgias_previas: string[];
  
  // Avaliações
  avaliacao_neurofisiologica: AvaliacaoNeurofisiologica;
  inspecao: InspecaoHolistica;
  auscultacao: AuscultacaoHolistica;
  interrogatorio: InterrogatorioHolistico;
  
  // Estilo de vida
  estilo_vida: {
    atividade_fisica: 'sedentario' | 'leve' | 'moderado' | 'intenso';
    alimentacao: 'adequada' | 'regular' | 'inadequada';
    hidratacao: 'adequada' | 'regular' | 'inadequada';
    tabagismo: boolean;
    etilismo: 'nunca' | 'ocasional' | 'frequente';
  };
}

export interface DiagnosticoHolistico {
  sintese_clinica: string;
  prioridades_tratamento: string[];
  sistema_afetado_principal: 'nervoso' | 'endocrino' | 'imunologico' | 'digestivo' | 'circulatorio' | 'musculoesqueletico' | 'emocional';
  natureza: 'agudo' | 'cronico' | 'recorrente';
}

// ============================================================================
// DADOS DO PACIENTE
// ============================================================================

export interface DadosPessoais {
  nome: string;
  data_nascimento: string; // ISO date
  sexo: 'M' | 'F' | 'O';
  telefone: string;
  email?: string;
  profissao: string;
  endereco?: string;
  foto_url?: string; // base64 ou blob local
}

export interface Paciente {
  id: string; // uuid
  codigo_auris: string; // formato: AUR-2024-0001
  dados_pessoais: DadosPessoais;
  anamnese: AnamneseHolistica;
  diagnostico_holistico?: DiagnosticoHolistico;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// PONTOS AURICULARES - NEUROFISIOLÓGICOS
// ============================================================================

export interface PontoAuricular {
  id: string;
  codigo: string; // MA-XX-01 (Microssistema Auricular)
  nome_pt: string; // Nome em português
  nome_latim?: string; // Nome técnico/científico
  regiao:
    | 'helix_superior'
    | 'helix_inferior'
    | 'escafa'
    | 'antihelix_cervical'
    | 'antihelix_toracica'
    | 'antihelix_lombar'
    | 'fossa_triangular'
    | 'concha_cimba'
    | 'concha_cava'
    | 'tragus'
    | 'antitrago'
    | 'lobulo_superior'
    | 'lobulo_inferior'
    | 'retroauricular'
    // Legacy aliases (mantidos para compatibilidade)
    | 'lobulo'
    | 'helice'
    | 'antihelice';
  coordenadas: { x: number; y: number };
  funcao: string;
  indicacoes: string[];
  contraindicacoes: string[];
  prioridade: 'master' | 'estrela' | 'importante' | 'comum';
  sistema: 'neurofisiologico' | 'nada' | 'battlefield' | 'multiplo';
  neuro_evidencia?: string;
}

export interface PontoAplicado extends PontoAuricular {
  ordem: number;
  tecnica_utilizada: 'agulha_filiforme' | 'agulha_intradermica' | 'sementes' | 'esferas_mag' | 'laser' | 'moxa';
  tempo_aplicacao_min: number;
  observacoes?: string;
}

// ============================================================================
// SESSÃO DE REIKI
// ============================================================================

export interface ReikiSessao {
  aplicado: boolean;
  simbolos: ('CKR' | 'SHK' | 'HSZSN' | 'DKM')[];
  intencao: string;
  posicao: 'cabeca' | 'orelhas' | 'chacras' | 'distancia' | 'corpo_completo';
  duracao_min: number;
  sensacoes_terapeuta?: string;
  sensacoes_paciente?: string;
  observacoes: string;
}

// ============================================================================
// PROTOCOLO E SESSÃO
// ============================================================================

export interface ProtocoloSessao {
  pontos: PontoAplicado[];
  tecnica_principal: 'auriculoterapia' | 'reiki' | 'combinado';
  duracao_total_min: number;
  observacoes_gerais: string;
}

export interface AvaliacaoSessao {
  dor_eva_inicio: number; // 0-10
  dor_eva_fim: number; // 0-10
  ansiedade_inicio: number; // 0-10
  ansiedade_fim: number; // 0-10
  bem_estar_inicio: number; // 0-10
  bem_estar_fim: number; // 0-10
  observacoes_inicio: string;
  observacoes_fim: string;
}

export interface EvolucaoSessao {
  melhora: boolean;
  percentual_melhora: number; // 0-100
  observacoes_finais: string;
  recomendacoes: string;
  fotos_orelha?: string[];
}

export interface Sessao {
  id: string;
  paciente_id: string;
  numero: number;
  data: string; // ISO
  avaliacao: AvaliacaoSessao;
  protocolo: ProtocoloSessao;
  reiki?: ReikiSessao | null;
  evolucao: EvolucaoSessao;
  pdf_gerado?: string;
  assinatura_paciente?: string;
  assinatura_terapeuta?: string;
}

// ============================================================================
// CONFIGURAÇÃO DO SISTEMA
// ============================================================================

export interface ConfiguracaoSistema {
  modo_reiki_ativo: boolean;
  wallpaper_atual: 'akasha' | 'floresta' | 'agua' | 'terra' | 'cosmos' | 'clinico' | 'custom';
  terapeuta_nome: string;
  terapeuta_email: string;
  terapeuta_registro?: string;
  terapeuta_telefone?: string;
  terapeuta_endereco?: string;
  fonte_principal: 'inter' | 'serif' | 'mono';
  fonte_sistema: 'sans' | 'serif' | 'mono';
  tamanho_fonte: 'pequeno' | 'medio' | 'grande';
  ai_provider: 'none' | 'openai' | 'deepseek' | 'gemini';
  openai_api_key: string;
  openai_model: string;
  openai_tested: boolean;
  openai_last_error?: string;
  deepseek_api_key: string;
  deepseek_base_url: string;
  deepseek_model: string;
  deepseek_tested: boolean;
  deepseek_last_error?: string;
  gemini_api_key: string;
  gemini_model: string;
  gemini_tested: boolean;
  gemini_last_error?: string;
}

// ============================================================================
// INTERFACE DO SISTEMA OPERACIONAL
// ============================================================================

export interface JanelaOS {
  id: string;
  app: 'clinica' | 'mapa' | 'studio' | 'config' | 'aura' | 'protocolos' | 'knowledge' | 'sessao' | 'calendario' | 'financas' | 'browser' | 'notas';
  titulo: string;
  posicao: { x: number; y: number };
  tamanho: { width: number; height: number };
  minimizada: boolean;
  maximizada: boolean;
  focada: boolean;
}

// ============================================================================
// ÁUDIO E PLAYLIST
// ============================================================================

export interface PlaylistAudio {
  id: string;
  nome: string;
  descricao: string;
  frequencias: number[];
  tipo: 'solfeggio' | 'natureza' | 'binaural' | 'reiki' | 'terapeutica';
  duracao_total_min: number;
}

export interface Musica {
  id: string;
  nome: string;
  artista: string;
  url: string;
  duracao_seg: number;
}

// ============================================================================
// SUGESTÕES DE PROTOCOLO
// ============================================================================

export interface SugestaoProtocolo {
  tipo: 'nada' | 'battlefield' | 'triangulo_cibernetico' | 'neurofisiologico' | 'personalizado';
  pontos: PontoAuricular[];
  justificativa_tecnica: string;
  fonte_cientifica?: string;
  indicacao_principal: string;
}

// ============================================================================
// DOCUMENTOS OFICIAIS
// ============================================================================

export interface DocumentoOficial {
  id: string;
  titulo: string;
  instituicao: string;
  pais: string;
  ano: number;
  tipo: 'lei' | 'decreto' | 'informe' | 'protocolo' | 'resolucao' | 'guia';
  url: string;
  statusLink: 'verificado' | 'pendente' | 'indisponivel';
  resumo: string;
  terapiasMencionadas: string[];
  relevancia: 'alta' | 'media' | 'baixa';
}

export interface EstudoCientifico {
  id: string;
  titulo: string;
  autores: string[];
  ano: number;
  revista: string;
  doi?: string;
  url: string;
  tipoEstudo: 'ensayo_clinico' | 'revision_sistematica' | 'metaanalisis' | 'estudio_observacional' | 'revision_bibliografica';
  conclusao: string;
  nivelEvidencia: 'I' | 'II' | 'III' | 'IV' | 'V';
  amostra?: number;
}
