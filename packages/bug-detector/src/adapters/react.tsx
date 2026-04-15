/**
 * React Adapter para BugDetector
 * Hook useBugDetector e Provider
 */

import { 
  useEffect, 
  useRef, 
  useState, 
  useCallback,
  createContext,
  useContext,
  type ReactNode,
} from 'react';

import { BugDetector } from '../core/BugDetector';
import type {
  BugDetectorConfig,
  InspectedElement,
  BugReport,
  CreateReportData,
  ExportOptions,
  ExportResult,
  UseBugDetectorProps,
  UseBugDetectorReturn,
} from '../types';

// ============================================================================
// CONTEXT
// ============================================================================

interface BugDetectorContextValue extends UseBugDetectorReturn {
  detector: BugDetector | null;
}

const BugDetectorContext = createContext<BugDetectorContextValue | null>(null);

/** Hook para acessar o BugDetector no React */
export function useBugDetector(): UseBugDetectorReturn {
  const context = useContext(BugDetectorContext);
  if (!context) {
    throw new Error('useBugDetector deve ser usado dentro de BugDetectorProvider');
  }
  return context;
}

/** Provider do BugDetector */
interface BugDetectorProviderProps {
  children: ReactNode;
  config?: BugDetectorConfig;
}

export function BugDetectorProvider({ 
  children, 
  config = {} 
}: BugDetectorProviderProps): JSX.Element {
  const detectorRef = useRef<BugDetector | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [selectedElement, setSelectedElement] = useState<InspectedElement | null>(null);
  const [reports, setReports] = useState<BugReport[]>([]);

  // Inicializa detector
  useEffect(() => {
    detectorRef.current = new BugDetector({
      ...config,
      callbacks: {
        ...config.callbacks,
        onActivate: () => {
          setIsActive(true);
          config.callbacks?.onActivate?.();
        },
        onDeactivate: () => {
          setIsActive(false);
          setSelectedElement(null);
          config.callbacks?.onDeactivate?.();
        },
        onElementSelected: (element) => {
          setSelectedElement(element);
          config.callbacks?.onElementSelected?.(element);
        },
        onReportCreated: (report) => {
          setReports(prev => [...prev, report]);
          config.callbacks?.onReportCreated?.(report);
        },
      },
    });

    // Auto-ativa em desenvolvimento
    if (config.autoActivateInDev && typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
      detectorRef.current.activate();
    }

    return () => {
      detectorRef.current?.deactivate();
    };
  }, []);

  // Ações
  const activate = useCallback(() => {
    detectorRef.current?.activate();
  }, []);

  const deactivate = useCallback(() => {
    detectorRef.current?.deactivate();
  }, []);

  const toggle = useCallback(() => {
    detectorRef.current?.toggle();
  }, []);

  const createReport = useCallback(async (data: CreateReportData): Promise<BugReport> => {
    if (!detectorRef.current) {
      throw new Error('BugDetector não inicializado');
    }
    return detectorRef.current.createReport(data);
  }, []);

  const exportReport = useCallback(async (
    reportId: string, 
    options: ExportOptions
  ): Promise<ExportResult> => {
    if (!detectorRef.current) {
      throw new Error('BugDetector não inicializado');
    }
    return detectorRef.current.exportReport(reportId, options);
  }, []);

  const value: BugDetectorContextValue = {
    isActive,
    activate,
    deactivate,
    toggle,
    selectedElement,
    reports,
    createReport,
    exportReport,
    detector: detectorRef.current,
  };

  return (
    <BugDetectorContext.Provider value={value}>
      {children}
    </BugDetectorContext.Provider>
  );
}

// ============================================================================
// HOOK AVANÇADO
// ============================================================================

/** Hook avançado com configuração completa */
export function useBugDetectorAdvanced(
  props: UseBugDetectorProps = {}
): UseBugDetectorReturn & {
  detector: BugDetector | null;
  refreshReports: () => Promise<void>;
  deleteReport: (id: string) => Promise<void>;
  analyzeWithAI: (reportId: string) => Promise<void>;
  createGitHubIssue: (reportId: string, repo?: string) => Promise<void>;
  notifySlack: (reportId: string, channel?: string) => Promise<void>;
} {
  const detectorRef = useRef<BugDetector | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [selectedElement, setSelectedElement] = useState<InspectedElement | null>(null);
  const [reports, setReports] = useState<BugReport[]>([]);

  useEffect(() => {
    detectorRef.current = new BugDetector({
      ...props,
      callbacks: {
        ...props.callbacks,
        onActivate: () => {
          setIsActive(true);
          props.callbacks?.onActivate?.();
        },
        onDeactivate: () => {
          setIsActive(false);
          setSelectedElement(null);
          props.callbacks?.onDeactivate?.();
        },
        onElementSelected: (element) => {
          setSelectedElement(element);
          props.callbacks?.onElementSelected?.(element);
        },
        onReportCreated: (report) => {
          setReports(prev => [...prev, report]);
          props.callbacks?.onReportCreated?.(report);
        },
      },
    });

    // Carrega reports iniciais
    setReports(detectorRef.current.getReports());

    // Auto-ativa em desenvolvimento
    if (props.autoActivateInDev && typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
      detectorRef.current.activate();
    }

    // Keyboard shortcut
    const handleKeyDown = (e: KeyboardEvent) => {
      if (props.shortcut) {
        const keys = props.shortcut.toLowerCase().split('+');
        const hasCtrl = keys.includes('ctrl') || keys.includes('control');
        const hasShift = keys.includes('shift');
        const hasAlt = keys.includes('alt');
        const key = keys.find(k => !['ctrl', 'control', 'shift', 'alt'].includes(k));

        if (
          e.ctrlKey === hasCtrl &&
          e.shiftKey === hasShift &&
          e.altKey === hasAlt &&
          e.key.toLowerCase() === key
        ) {
          e.preventDefault();
          detectorRef.current?.toggle();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      detectorRef.current?.deactivate();
    };
  }, []);

  const activate = useCallback(() => detectorRef.current?.activate(), []);
  const deactivate = useCallback(() => detectorRef.current?.deactivate(), []);
  const toggle = useCallback(() => detectorRef.current?.toggle(), []);

  const createReport = useCallback(async (data: CreateReportData): Promise<BugReport> => {
    if (!detectorRef.current) throw new Error('BugDetector não inicializado');
    return detectorRef.current.createReport(data);
  }, []);

  const exportReport = useCallback(async (reportId: string, options: ExportOptions): Promise<ExportResult> => {
    if (!detectorRef.current) throw new Error('BugDetector não inicializado');
    return detectorRef.current.exportReport(reportId, options);
  }, []);

  const refreshReports = useCallback(async () => {
    if (!detectorRef.current) return;
    setReports(detectorRef.current.getReports());
  }, []);

  const deleteReport = useCallback(async (id: string) => {
    if (!detectorRef.current) return;
    await detectorRef.current.deleteReport(id);
    setReports(prev => prev.filter(r => r.id !== id));
  }, []);

  const analyzeWithAI = useCallback(async (reportId: string) => {
    if (!detectorRef.current) return;
    await detectorRef.current.analyzeReport(reportId);
    await refreshReports();
  }, [refreshReports]);

  const createGitHubIssue = useCallback(async (reportId: string, repo?: string) => {
    if (!detectorRef.current) return;
    await detectorRef.current.createGitHubIssue(reportId, repo);
  }, []);

  const notifySlack = useCallback(async (reportId: string, channel?: string) => {
    if (!detectorRef.current) return;
    await detectorRef.current.notifySlack(reportId, channel);
  }, []);

  return {
    isActive,
    activate,
    deactivate,
    toggle,
    selectedElement,
    reports,
    createReport,
    exportReport,
    detector: detectorRef.current,
    refreshReports,
    deleteReport,
    analyzeWithAI,
    createGitHubIssue,
    notifySlack,
  };
}

// ============================================================================
// COMPONENTES UI
// ============================================================================

/** Botão flutuante para ativar o BugDetector */
interface FloatingButtonProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  color?: string;
}

export function BugDetectorFloatingButton({ 
  position = 'bottom-right',
  color = '#3b82f6'
}: FloatingButtonProps): JSX.Element {
  const { isActive, toggle } = useBugDetector();

  const positionStyles = {
    'top-left': { top: 20, left: 20 },
    'top-right': { top: 20, right: 20 },
    'bottom-left': { bottom: 20, left: 20 },
    'bottom-right': { bottom: 20, right: 20 },
  };

  return (
    <button
      onClick={toggle}
      style={{
        position: 'fixed',
        ...positionStyles[position],
        width: 56,
        height: 56,
        borderRadius: '50%',
        backgroundColor: isActive ? '#ef4444' : color,
        color: 'white',
        border: 'none',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        cursor: 'pointer',
        zIndex: 2147483647,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 24,
        transition: 'all 0.2s',
      }}
      title={isActive ? 'Desativar Debug' : 'Ativar Debug'}
    >
      {isActive ? '✕' : '🐛'}
    </button>
  );
}

export default useBugDetector;
