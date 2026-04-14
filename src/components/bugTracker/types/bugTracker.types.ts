/**
 * 🐛 BugTracker Types
 * Tipagens para o sistema de detecção de bugs visual
 */

/** Tipo de report */
export type ReportType = 'bug' | 'improvement' | 'question';

/** Nível de severidade */
export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low';

/** Status do report */
export type ReportStatus = 'pending' | 'analyzing' | 'fixed' | 'wontfix';

/** Snapshot de estilos computados */
export interface ComputedStylesSnapshot {
  margin: string;
  padding: string;
  display: string;
  position: string;
  fontSize: string;
  color: string;
  backgroundColor: string;
  width: string;
  height: string;
  zIndex: string;
  borderRadius: string;
}

/** Elemento inspecionado */
export interface InspectedElement {
  /** Tag HTML (div, button, etc) */
  tag: string;
  /** ID do elemento */
  id: string | null;
  /** Classes CSS */
  className: string;
  /** Dimensões e posição */
  rect: {
    x: number;
    y: number;
    width: number;
    height: number;
    top: number;
    left: number;
    right: number;
    bottom: number;
  };
  /** Seletor CSS único */
  selector: string;
  /** XPath absoluto */
  xpath: string;
  /** Nome do componente React (se disponível) */
  componentName?: string;
  /** Cadeia de elementos pais até o root */
  parentChain: ParentInfo[];
  /** Atributos data-* do elemento */
  dataAttributes: Record<string, string>;
  /** Texto contido no elemento (truncado) */
  textContent: string;
  /** Estilos computados */
  computedStyles: ComputedStylesSnapshot;
}

/** Informação do elemento pai */
export interface ParentInfo {
  tag: string;
  id: string | null;
  className: string;
  selector: string;
}

/** Dados do report de bug */
export interface BugReport {
  /** ID único (timestamp) */
  id: string;
  /** Data de criação ISO */
  createdAt: string;
  /** Data de resolução ISO (se houver) */
  resolvedAt?: string;
  /** Tipo de report */
  type: ReportType;
  /** Severidade */
  severity: SeverityLevel;
  /** Status atual */
  status: ReportStatus;
  /** Quem reportou */
  reportedBy: string;
  /** Elemento afetado */
  element: InspectedElement;
  /** Descrição do problema */
  description: string;
  /** Comportamento esperado */
  expectedBehavior?: string;
  /** Screenshot anexado */
  screenshotPath?: string;
  /** URL da página */
  pageUrl: string;
  /** Análise do AI (preenchido após correção) */
  analysis?: {
    rootCause: string;
    solution: string;
    filesModified: string[];
    aiNotes: string;
  };
}

/** Dados para criar novo report */
export interface CreateBugReportData {
  type: ReportType;
  severity: SeverityLevel;
  description: string;
  expectedBehavior?: string;
  includeScreenshot: boolean;
  element: InspectedElement;
  /** Relatório completo em Markdown para uso em IAs externas */
  markdownReport?: string;
}

/** Configurações do bug tracker */
export interface BugTrackerConfig {
  /** Ativar logs no console */
  debugMode: boolean;
  /** Incluir screenshot por padrão */
  defaultScreenshot: boolean;
  /** Formato de data */
  dateFormat: 'iso' | 'locale';
}

/** Estatísticas de bugs */
export interface BugStats {
  total: number;
  pending: number;
  analyzing: number;
  fixed: number;
  wontfix: number;
  bySeverity: Record<SeverityLevel, number>;
  byType: Record<ReportType, number>;
}

/** Props do tooltip de inspeção */
export interface InspectorTooltipProps {
  element: InspectedElement;
  mouseX: number;
  mouseY: number;
}

/** Props do modal de report */
export interface BugReportModalProps {
  isOpen: boolean;
  element: InspectedElement | null;
  screenshotDataUrl: string | null;
  onClose: () => void;
  onSubmit: (data: CreateBugReportData) => void;
}

/** Props do overlay de inspeção */
export interface BugTrackerOverlayProps {
  isActive: boolean;
  onDeactivate: () => void;
}

/** Resumo de report para lista */
export interface BugReportSummary {
  id: string;
  createdAt: string;
  type: ReportType;
  severity: SeverityLevel;
  status: ReportStatus;
  elementTag: string;
  elementSelector: string;
  description: string;
  hasScreenshot: boolean;
}
