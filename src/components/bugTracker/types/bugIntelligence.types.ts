/**
 * 🧠 Bug Intelligence System Types
 * Sistema de raciocínio multi-personalidade para análise de bugs
 */

import type { ParentInfo } from './bugTracker.types';

/** Informação do elemento capturado (compatibilidade) */
export type BugElementInfo = {
  /** Nome da tag HTML */
  tagName?: string;
  /** Retângulo de bounding */
  boundingRect?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  /** Atributos do elemento */
  attributes?: Record<string, string>;
  /** Estilos computados (opcional) */
  styles?: Record<string, string>;
  /** Conteúdo de texto */
  textContent?: string;
  /** Tag do elemento pai */
  parentTagName?: string;
  /** Propriedades do InspectedElement para compatibilidade */
  tag?: string;
  id?: string | null;
  className?: string;
  rect?: {
    x: number;
    y: number;
    width: number;
    height: number;
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  };
  selector?: string;
  xpath?: string;
  componentName?: string;
  parentChain?: ParentInfo[];
  dataAttributes?: Record<string, string>;
};

// ============================================================================
// CORE TYPES
// ============================================================================

/** Status do processamento de inteligência */
export type IntelligenceStatus = 
  | 'idle'
  | 'collecting'      // Coletando descrição do usuário
  | 'processing_nlp'  // Processando linguagem natural
  | 'analyzing'       // Personalidades analisando
  | 'orchestrating'   // Orquestrador consolidando
  | 'generating'      // Gerando relatório
  | 'completed'
  | 'error';

/** Personalidades disponíveis para análise */
export type PersonalityType =
  | 'ARQUITETO'
  | 'UIUX_ENGINEER'
  | 'PERFORMANCE_ENGINEER'
  | 'TYPESCRIPT_MASTER'
  | 'REACT_SPECIALIST'
  | 'CSS_TAILWIND_EXPERT'
  | 'TESTING_ENGINEER'
  | 'DX_ENGINEER';

// ============================================================================
// INPUT / OUTPUT TYPES
// ============================================================================

/** Input do sistema de inteligência */
export interface BugIntelligenceInput {
  /** ID único do bug */
  bugId: string;
  /** Informações do elemento capturado */
  elementInfo: BugElementInfo;
  /** Screenshot em base64 (opcional) */
  screenshot?: string;
  /** Descrição original do usuário (linguagem natural) */
  userDescription?: string;
  /** Timestamp da criação */
  timestamp: number;
  /** Contexto de código (se disponível) */
  codeContext?: CodeContext;
}

/** Contexto de código para análise */
export interface CodeContext {
  /** Caminho do arquivo */
  filePath?: string;
  /** Nome do componente */
  componentName?: string;
  /** Código fonte do componente */
  sourceCode?: string;
  /** Props do componente */
  props?: Record<string, unknown>;
  /** Estado do componente */
  state?: Record<string, unknown>;
}

// ============================================================================
// NLP TYPES
// ============================================================================

/** Resultado do processamento NLP */
export interface NLPResult {
  /** Texto original */
  originalText: string;
  /** Texto corrigido (ortografia, gramática) */
  correctedText: string;
  /** Texto aprimorado (linguagem técnica) */
  enhancedText: string;
  /** Keywords extraídas */
  keywords: string[];
  /** Categoria detectada */
  category: BugCategory;
  /** Severidade estimada */
  severity: BugSeverity;
  /** Componentes mencionados */
  mentionedComponents: string[];
  /** Tecnologias mencionadas */
  mentionedTech: string[];
  /** Intenção do usuário */
  intent: UserIntent;
  /** Perguntas de follow-up sugeridas */
  suggestedQuestions: string[];
}

/** Categoria de bug detectada */
export type BugCategory =
  | 'UI_VISUAL'       // Problema visual
  | 'FUNCTIONAL'      // Funcionalidade quebrada
  | 'PERFORMANCE'     // Performance
  | 'ACCESSIBILITY'   // Acessibilidade
  | 'TYPE_ERROR'      // Erro de TypeScript
  | 'LOGIC_ERROR'     // Erro de lógica
  | 'STATE_MANAGEMENT'// Gerenciamento de estado
  | 'API_INTEGRATION' // Integração com API
  | 'UNKNOWN';

/** Severidade do bug */
export type BugSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

/** Intenção do usuário */
export type UserIntent =
  | 'REPORT_BUG'
  | 'ASK_HELP'
  | 'SUGGEST_FEATURE'
  | 'CODE_REVIEW'
  | 'UNCLEAR';

// ============================================================================
// PERSONALITY ANALYSIS TYPES
// ============================================================================

/** Análise de uma personalidade */
export interface PersonalityAnalysis {
  /** Tipo da personalidade */
  personality: PersonalityType;
  /** Nome amigável */
  name: string;
  /** Ícone/emoji */
  icon: string;
  /** Cor da personalidade */
  color: string;
  /** Insights gerados */
  insights: string[];
  /** Problemas identificados */
  issues: string[];
  /** Recomendações */
  recommendations: string[];
  /** Código sugerido (se aplicável) */
  codeSuggestion?: CodeSuggestion;
  /** Score de confiança (0-100) */
  confidence: number;
  /** Tempo de análise (ms) */
  processingTime: number;
}

/** Sugestão de código */
export interface CodeSuggestion {
  /** Linguagem/framework */
  language: string;
  /** Código atual (problemático) */
  currentCode: string;
  /** Código sugerido (correção) */
  suggestedCode: string;
  /** Explicação da mudança */
  explanation: string;
  /** Diff gerado */
  diff?: string;
}

// ============================================================================
// ORCHESTRATOR TYPES
// ============================================================================

/** Input consolidado do orquestrador */
export interface OrchestratorInput {
  /** Resultado NLP */
  nlpResult: NLPResult;
  /** Análises das personalidades */
  analyses: PersonalityAnalysis[];
  /** Informações do elemento */
  elementInfo: BugElementInfo;
  /** Contexto de código */
  codeContext?: CodeContext;
}

/** Diagnóstico consolidado */
export interface ConsolidatedDiagnosis {
  /** Título do bug */
  title: string;
  /** Descrição técnica */
  description: string;
  /** Causa raiz identificada */
  rootCause: string;
  /** Severidade final */
  severity: BugSeverity;
  /** Categoria final */
  category: BugCategory;
  /** Componentes afetados */
  affectedComponents: string[];
  /** Solução principal */
  primarySolution: CodeSuggestion;
  /** Soluções alternativas */
  alternativeSolutions: CodeSuggestion[];
  /** Impacto estimado */
  impact: ImpactAssessment;
  /** Checklist de implementação */
  implementationChecklist: string[];
  /** Personalidades que concordam */
  agreeingPersonalities: PersonalityType[];
  /** Personalidades com ressalvas */
  dissentingPersonalities: PersonalityType[];
}

/** Avaliação de impacto */
export interface ImpactAssessment {
  /** Escopo (arquivos/componentes) */
  scope: string[];
  /** Risco de regressão */
  regressionRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  /** Esforço estimado */
  estimatedEffort: 'QUICK' | 'MEDIUM' | 'LARGE';
  /** Breaking changes */
  breakingChanges: boolean;
}

// ============================================================================
// CHAT TYPES
// ============================================================================

/** Mensagem no chat de análise */
export interface ChatMessage {
  /** ID único */
  id: string;
  /** Quem enviou */
  sender: 'user' | 'aura' | 'system' | PersonalityType;
  /** Conteúdo da mensagem */
  content: string;
  /** Timestamp */
  timestamp: number;
  /** Tipo de mensagem */
  type: ChatMessageType;
  /** Metadados adicionais */
  metadata?: ChatMetadata;
}

/** Tipo de mensagem no chat */
export type ChatMessageType =
  | 'text'
  | 'analysis_start'
  | 'analysis_complete'
  | 'personality_thinking'
  | 'question'
  | 'suggestion'
  | 'code_block'
  | 'error';

/** Metadados da mensagem */
export interface ChatMetadata {
  /** Personalidade relacionada */
  personality?: PersonalityType;
  /** Análise relacionada */
  analysis?: PersonalityAnalysis;
  /** Sugestão de código */
  codeSuggestion?: CodeSuggestion;
  /** Elementos da UI relacionados */
  relatedElements?: string[];
  /** Resultado do processamento NLP */
  nlpResult?: NLPResult;
  /** Relatório completo */
  report?: BugIntelligenceReport;
}

/** Sessão de chat */
export interface ChatSession {
  /** ID da sessão */
  id: string;
  /** ID do bug relacionado */
  bugId: string;
  /** Histórico de mensagens */
  messages: ChatMessage[];
  /** Status atual */
  status: IntelligenceStatus;
  /** Resultado final (quando completo) */
  finalReport?: BugIntelligenceReport;
  /** Criado em */
  createdAt: number;
  /** Atualizado em */
  updatedAt: number;
}

// ============================================================================
// REPORT TYPES
// ============================================================================

/** Relatório final de inteligência */
export interface BugIntelligenceReport {
  /** Metadados */
  metadata: ReportMetadata;
  /** Input original */
  originalInput: BugIntelligenceInput;
  /** Resultado NLP */
  nlpResult: NLPResult;
  /** Análises das personalidades */
  personalityAnalyses: PersonalityAnalysis[];
  /** Diagnóstico consolidado */
  diagnosis: ConsolidatedDiagnosis;
  /** Histórico do chat */
  chatHistory: ChatMessage[];
  /** Conteúdo Markdown gerado */
  markdownContent: string;
}

/** Metadados do relatório */
export interface ReportMetadata {
  /** ID do relatório */
  id: string;
  /** Versão do sistema */
  systemVersion: string;
  /** Data de geração */
  generatedAt: string;
  /** Tempo total de processamento (ms) */
  totalProcessingTime: number;
  /** Personalidades utilizadas */
  personalitiesUsed: PersonalityType[];
  /** Score de qualidade (0-100) */
  qualityScore: number;
}

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

/** Configuração do sistema de inteligência */
export interface IntelligenceConfig {
  /** Habilitar processamento NLP */
  enableNLP: boolean;
  /** Personalidades ativas */
  activePersonalities: PersonalityType[];
  /** Profundidade da análise */
  analysisDepth: 'QUICK' | 'STANDARD' | 'DEEP';
  /** Gerar código automaticamente */
  autoGenerateCode: boolean;
  /** Perguntas de follow-up */
  enableFollowUpQuestions: boolean;
  /** Salvar no filesystem */
  saveToFilesystem: boolean;
  /** Notificar Aura */
  notifyAura: boolean;
}

/** Configuração padrão */
export const DEFAULT_INTELLIGENCE_CONFIG: IntelligenceConfig = {
  enableNLP: true,
  activePersonalities: [
    'ARQUITETO',
    'UIUX_ENGINEER',
    'PERFORMANCE_ENGINEER',
    'TYPESCRIPT_MASTER',
    'REACT_SPECIALIST',
    'CSS_TAILWIND_EXPERT',
    'TESTING_ENGINEER',
    'DX_ENGINEER',
  ],
  analysisDepth: 'STANDARD',
  autoGenerateCode: true,
  enableFollowUpQuestions: true,
  saveToFilesystem: true,
  notifyAura: true,
};

// ============================================================================
// EVENT TYPES
// ============================================================================

/** Eventos do sistema de inteligência */
export interface IntelligenceEvents {
  /** Nova mensagem no chat */
  onChatMessage?: (message: ChatMessage) => void;
  /** Análise de personalidade completa */
  onPersonalityComplete?: (analysis: PersonalityAnalysis) => void;
  /** Status mudou */
  onStatusChange?: (status: IntelligenceStatus) => void;
  /** Relatório completo */
  onReportComplete?: (report: BugIntelligenceReport) => void;
  /** Erro ocorreu */
  onError?: (error: Error) => void;
}
