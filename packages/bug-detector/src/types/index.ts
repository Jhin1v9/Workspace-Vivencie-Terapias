/**
 * @auris/bug-detector - Type Definitions
 */

// ============================================================================
// CORE TYPES
// ============================================================================

/** Configuração principal do BugDetector */
export interface BugDetectorConfig {
  /** Modo de ativação */
  trigger?: 'floating-button' | 'keyboard-shortcut' | 'manual';
  /** Atalho de teclado (quando trigger = 'keyboard-shortcut') */
  shortcut?: string;
  /** Modo headless (sem UI) */
  headless?: boolean;
  /** Persistência dos reports */
  persistTo?: 'localStorage' | 'indexedDB' | 'api' | 'none';
  /** Configuração de IA */
  ai?: AIConfig;
  /** Integrações externas */
  integrations?: IntegrationsConfig;
  /** Captura de dados */
  capture?: CaptureConfig;
  /** Callbacks */
  callbacks?: BugDetectorCallbacks;
  /** Ativar automaticamente em desenvolvimento */
  autoActivateInDev?: boolean;
  /** Z-index base para elementos da UI (default: 999999) */
  zIndexBase?: number;
}

/** Configuração de IA */
export interface AIConfig {
  provider: 'gemini' | 'openai' | 'none';
  apiKey: string;
  /** Modelo a ser usado */
  model?: string;
  /** Temperatura (0-1) */
  temperature?: number;
  /** Timeout em ms */
  timeout?: number;
}

/** Configuração de integrações */
export interface IntegrationsConfig {
  github?: GitHubConfig;
  jira?: JiraConfig;
  slack?: SlackConfig;
  webhook?: WebhookConfig;
}

/** Configuração do GitHub */
export interface GitHubConfig {
  repo: string;
  token: string;
  labels?: string[];
}

/** Configuração do Jira */
export interface JiraConfig {
  host: string;
  project: string;
  email: string;
  token: string;
}

/** Configuração do Slack */
export interface SlackConfig {
  webhook: string;
  channel?: string;
}

/** Configuração de webhook genérico */
export interface WebhookConfig {
  url: string;
  method?: 'POST' | 'PUT';
  headers?: Record<string, string>;
}

/** Configuração de captura */
export interface CaptureConfig {
  /** Capturar screenshot */
  screenshot?: boolean;
  /** Capturar logs do console */
  console?: boolean;
  /** Capturar requisições de rede */
  network?: boolean;
  /** Capturar métricas de performance */
  performance?: boolean;
  /** Incluir HTML do elemento */
  includeHTML?: boolean;
  /** Incluir estilos computados */
  includeStyles?: boolean;
}

/** Callbacks do BugDetector */
export interface BugDetectorCallbacks {
  /** Chamado quando um report é criado */
  onReportCreated?: (report: BugReport) => void | Promise<void>;
  /** Chamado quando um report é exportado */
  onReportExported?: (report: BugReport, format: string) => void | Promise<void>;
  /** Chamado quando a ferramenta é ativada */
  onActivate?: () => void;
  /** Chamado quando a ferramenta é desativada */
  onDeactivate?: () => void;
  /** Chamado quando um elemento é selecionado */
  onElementSelected?: (element: InspectedElement) => void;
}

// ============================================================================
// ELEMENT INSPECTION
// ============================================================================

/** Elemento inspecionado */
export interface InspectedElement {
  /** ID único */
  id: string;
  /** Tag HTML */
  tag: string;
  /** ID do elemento */
  elementId: string | null;
  /** Classes CSS */
  className: string;
  /** Seletor CSS único */
  selector: string;
  /** XPath */
  xpath: string;
  /** Dimensões e posição */
  rect: DOMRect;
  /** Estilos computados */
  computedStyles: Record<string, string>;
  /** Atributos */
  attributes: Record<string, string>;
  /** HTML interno */
  innerHTML: string;
  /** Texto do elemento */
  textContent: string;
  /** Cadeia de pais */
  parentChain: ParentInfo[];
  /** Número de irmãos */
  siblingCount: number;
  /** Número de filhos */
  childCount: number;
  /** Referência ao elemento DOM */
  domElement: Element;
}

/** Informação do elemento pai */
export interface ParentInfo {
  tag: string;
  id: string | null;
  className: string;
  selector: string;
}

// ============================================================================
// BUG REPORT
// ============================================================================

/** Report de bug completo */
export interface BugReport {
  /** ID único */
  id: string;
  /** Timestamp de criação */
  timestamp: number;
  /** Status */
  status: 'pending' | 'analyzing' | 'resolved' | 'rejected';
  
  // Contexto
  /** URL da página */
  url: string;
  /** Título da página */
  pageTitle: string;
  /** User agent */
  userAgent: string;
  /** Viewport */
  viewport: { width: number; height: number };
  
  // Elemento
  /** Elemento afetado */
  element: InspectedElement;
  
  // Capturas
  /** Screenshot em base64 */
  screenshot?: string;
  /** Logs do console */
  consoleLogs?: ConsoleLog[];
  /** Requisições de rede */
  networkRequests?: NetworkRequest[];
  /** Métricas de performance */
  performanceMetrics?: PerformanceMetrics;
  
  // Input do usuário
  /** Descrição */
  description: string;
  /** Tipo */
  type: 'bug' | 'improvement' | 'question';
  /** Severidade */
  severity: 'low' | 'medium' | 'high' | 'critical';
  /** Comportamento esperado */
  expectedBehavior?: string;
  
  // Análise IA
  /** Análise da IA */
  aiAnalysis?: AIAnalysis;
}

/** Log do console */
export interface ConsoleLog {
  level: 'log' | 'warn' | 'error' | 'info';
  message: string;
  timestamp: number;
  stack?: string;
}

/** Requisição de rede */
export interface NetworkRequest {
  url: string;
  method: string;
  status: number;
  statusText: string;
  duration: number;
  timestamp: number;
  requestHeaders?: Record<string, string>;
  responseHeaders?: Record<string, string>;
}

/** Métricas de performance */
export interface PerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  firstPaint?: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
}

// ============================================================================
// AI ANALYSIS
// ============================================================================

/** Análise da IA */
export interface AIAnalysis {
  /** Categoria do problema */
  category: BugCategory;
  /** Severidade */
  severity: 'low' | 'medium' | 'high' | 'critical';
  /** Causa raiz */
  rootCause: string;
  /** Descrição técnica */
  technicalDescription: string;
  /** Recomendações */
  recommendations: string[];
  /** Código corrigido (opcional) */
  codeFix?: CodeFix;
  /** Análises das personalidades */
  personalityAnalyses: PersonalityAnalysis[];
  /** Score de confiança (0-100) */
  confidence: number;
  /** Tempo de processamento */
  processingTime: number;
}

/** Categoria de bug */
export type BugCategory =
  | 'ui_visual'
  | 'functional'
  | 'performance'
  | 'accessibility'
  | 'type_error'
  | 'logic_error'
  | 'state_management'
  | 'api_integration'
  | 'security'
  | 'other';

/** Análise de uma personalidade */
export interface PersonalityAnalysis {
  /** Tipo da personalidade */
  personality: PersonalityType;
  /** Nome amigável */
  name: string;
  /** Ícone */
  icon: string;
  /** Cor */
  color: string;
  /** Insights */
  insights: string[];
  /** Issues identificados */
  issues: string[];
  /** Recomendações */
  recommendations: string[];
  /** Código sugerido */
  codeSuggestion?: CodeFix;
  /** Confiança */
  confidence: number;
}

/** Tipo de personalidade */
export type PersonalityType =
  | 'architect'
  | 'uiux'
  | 'performance'
  | 'typescript'
  | 'react'
  | 'css'
  | 'testing'
  | 'dx';

/** Correção de código */
export interface CodeFix {
  linguagem: string;
  codigoAtual: string;
  codigoCorrigido: string;
  explicacao: string;
}

// ============================================================================
// CHAT
// ============================================================================

/** Mensagem do chat */
export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system' | PersonalityType;
  content: string;
  timestamp: number;
  type: 'text' | 'analysis' | 'code' | 'error';
  metadata?: {
    analysis?: PersonalityAnalysis;
    processing?: boolean;
  };
}

/** Sessão de chat */
export interface ChatSession {
  id: string;
  reportId: string;
  messages: ChatMessage[];
  status: 'idle' | 'collecting' | 'analyzing' | 'completed';
}

// ============================================================================
// STORAGE
// ============================================================================

/** Interface de storage */
export interface StorageAdapter {
  save(report: BugReport): Promise<void>;
  get(id: string): Promise<BugReport | null>;
  getAll(): Promise<BugReport[]>;
  delete(id: string): Promise<void>;
  update(id: string, data: Partial<BugReport>): Promise<void>;
}

/** Filtros para busca */
export interface ReportFilters {
  status?: BugReport['status'];
  severity?: BugReport['severity'];
  category?: BugCategory;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

// ============================================================================
// EXPORTS
// ============================================================================

/** Opções de exportação */
export interface ExportOptions {
  format: 'markdown' | 'json' | 'html' | 'pdf';
  includeScreenshot?: boolean;
  includeAIAnalysis?: boolean;
  template?: string;
}

/** Resultado da exportação */
export interface ExportResult {
  content: string;
  filename: string;
  mimeType: string;
}

// ============================================================================
// AI ADAPTER
// ============================================================================

/** Adapter genérico para integração com IA do sistema hospedeiro */
export interface AIAdapter {
  /** Enriquece a descrição de um bug com análise técnica */
  enhanceReport(context: {
    description: string;
    elementTag: string;
    elementSelector: string;
    elementClasses: string;
    pageUrl: string;
    screenshotBase64?: string;
  }): Promise<{
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }>;
  /** Chat opcional com contexto do bug */
  chat?(context: {
    description: string;
    elementTag: string;
    elementSelector: string;
    pageUrl: string;
  }, message: string): Promise<string>;
}

// ============================================================================
// REACT
// ============================================================================

/** Props do hook useBugDetector */
export interface UseBugDetectorProps extends BugDetectorConfig {
  /** Ativar automaticamente em desenvolvimento */
  autoActivateInDev?: boolean;
}

/** Retorno do hook useBugDetector */
export interface UseBugDetectorReturn {
  /** Se está ativo */
  isActive: boolean;
  /** Ativar */
  activate: () => void;
  /** Desativar */
  deactivate: () => void;
  /** Alternar */
  toggle: () => void;
  /** Elemento selecionado */
  selectedElement: InspectedElement | null;
  /** Reports */
  reports: BugReport[];
  /** Criar report */
  createReport: (data: CreateReportData) => Promise<BugReport>;
  /** Exportar report */
  exportReport: (reportId: string, options: ExportOptions) => Promise<ExportResult>;
}

/** Dados para criar report */
export interface CreateReportData {
  description: string;
  type?: BugReport['type'];
  severity?: BugReport['severity'];
  expectedBehavior?: string;
  element?: InspectedElement;
}
