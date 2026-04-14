/**
 * 🐛 Bug Tracker Store
 * Gerenciamento de estado do sistema de detecção de bugs
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useEffect } from 'react';
import type { 
  InspectedElement, 
  BugReport, 
  CreateBugReportData,
  BugStats,
  ReportStatus 
} from '@/components/bugTracker/types/bugTracker.types';
import { 
  reportToMarkdown, 
  generateSummaryMarkdown,
  generateReportFileName 
} from '@/components/bugTracker/utils/bugFormatter';

interface BugTrackerState {
  // Modo de edição
  isEditMode: boolean;
  activateEditMode: () => void;
  deactivateEditMode: () => void;
  toggleEditMode: () => void;
  
  // Elemento inspecionado
  hoveredElement: InspectedElement | null;
  setHoveredElement: (element: InspectedElement | null) => void;
  
  // Modal de report
  isModalOpen: boolean;
  selectedElement: InspectedElement | null;
  screenshotDataUrl: string | null;
  openReportModal: (element: InspectedElement, screenshot?: string | null) => void;
  closeReportModal: () => void;
  setScreenshot: (dataUrl: string | null) => void;
  
  // Reports em memória
  reports: BugReport[];
  createReport: (data: CreateBugReportData) => Promise<string>;
  resolveReport: (id: string, analysis: BugReport['analysis']) => Promise<void>;
  updateReportStatus: (id: string, status: ReportStatus) => Promise<void>;
  loadReports: () => Promise<void>;
  
  // Estatísticas
  stats: BugStats;
  updateStats: () => void;
  
  // Configurações
  includeScreenshotByDefault: boolean;
  setIncludeScreenshotByDefault: (value: boolean) => void;
}

/** Gera ID único baseado em timestamp */
function generateId(): string {
  return generateReportFileName();
}

export const useBugTrackerStore = create<BugTrackerState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      isEditMode: false,
      hoveredElement: null,
      isModalOpen: false,
      selectedElement: null,
      screenshotDataUrl: null,
      reports: [],
      includeScreenshotByDefault: true,
      stats: {
        total: 0,
        pending: 0,
        analyzing: 0,
        fixed: 0,
        wontfix: 0,
        bySeverity: { critical: 0, high: 0, medium: 0, low: 0 },
        byType: { bug: 0, improvement: 0, question: 0 },
      },

      // Modo de edição
      activateEditMode: () => {
        set({ isEditMode: true });
      },
      
      deactivateEditMode: () => {
        set({ 
          isEditMode: false,
          hoveredElement: null,
        });
      },
      
      toggleEditMode: () => {
        const { isEditMode } = get();
        if (isEditMode) {
          get().deactivateEditMode();
        } else {
          get().activateEditMode();
        }
      },

      // Elemento inspecionado
      setHoveredElement: (element) => {
        set({ hoveredElement: element });
      },

      // Modal
      openReportModal: (element, screenshot = null) => {
        set({
          isModalOpen: true,
          selectedElement: element,
          screenshotDataUrl: screenshot,
        });
      },
      
      closeReportModal: () => {
        set({
          isModalOpen: false,
          selectedElement: null,
          screenshotDataUrl: null,
        });
      },
      
      setScreenshot: (dataUrl) => {
        set({ screenshotDataUrl: dataUrl });
      },

      // Criar report
      createReport: async (data) => {
        const id = generateId();
        const timestamp = new Date().toISOString();
        
        // Criar objeto do report
        const report: BugReport = {
          id,
          createdAt: timestamp,
          type: data.type,
          severity: data.severity,
          status: 'pending',
          reportedBy: 'Usuário',
          element: data.element,
          description: data.description,
          expectedBehavior: data.expectedBehavior,
          pageUrl: window.location.href,
        };

        // Adicionar screenshot se houver
        if (data.includeScreenshot) {
          report.screenshotPath = `./screenshots/${id}.png`;
        }

        // Salvar em memória
        set(state => ({
          reports: [report, ...state.reports],
        }));

        // Atualizar estatísticas
        get().updateStats();

        // Persistir em arquivo (via API local)
        try {
          const markdown = reportToMarkdown(report);
          await saveReportToFile(id, markdown);
          
          // Atualizar summary
          const { reports } = get();
          const summary = generateSummaryMarkdown(reports);
          await saveSummaryToFile(summary);
        } catch {
          // Persistência em arquivo é best-effort
        }

        return id;
      },

      // Resolver report
      resolveReport: async (id, analysis) => {
        const { reports } = get();
        const report = reports.find(r => r.id === id);
        
        if (!report) return;

        const updatedReport: BugReport = {
          ...report,
          status: 'fixed',
          resolvedAt: new Date().toISOString(),
          analysis,
        };

        // Atualizar em memória
        set(state => ({
          reports: state.reports.map(r => r.id === id ? updatedReport : r),
        }));

        // Atualizar estatísticas
        get().updateStats();

        // Mover arquivo para resolved/
        try {
          const markdown = reportToMarkdown(updatedReport);
          await moveReportToResolved(id, markdown);
        } catch {
          // Persistência em arquivo é best-effort
        }
      },

      // Atualizar status
      updateReportStatus: async (id, status) => {
        const { reports } = get();
        const report = reports.find(r => r.id === id);
        
        if (!report) return;

        const updatedReport: BugReport = {
          ...report,
          status,
          resolvedAt: status === 'fixed' ? new Date().toISOString() : undefined,
        };

        set(state => ({
          reports: state.reports.map(r => r.id === id ? updatedReport : r),
        }));

        get().updateStats();

        // Atualizar arquivo
        try {
          const markdown = reportToMarkdown(updatedReport);
          await saveReportToFile(id, markdown);
        } catch {
          // Persistência em arquivo é best-effort
        }
      },

      // Carregar reports existentes
      loadReports: async () => {
        // Em um app real, isso carregaria do backend
        // Por enquanto, usamos apenas os reports em memória
      },

      // Atualizar estatísticas
      updateStats: () => {
        const { reports } = get();
        
        const stats: BugStats = {
          total: reports.length,
          pending: reports.filter(r => r.status === 'pending').length,
          analyzing: reports.filter(r => r.status === 'analyzing').length,
          fixed: reports.filter(r => r.status === 'fixed').length,
          wontfix: reports.filter(r => r.status === 'wontfix').length,
          bySeverity: {
            critical: reports.filter(r => r.severity === 'critical').length,
            high: reports.filter(r => r.severity === 'high').length,
            medium: reports.filter(r => r.severity === 'medium').length,
            low: reports.filter(r => r.severity === 'low').length,
          },
          byType: {
            bug: reports.filter(r => r.type === 'bug').length,
            improvement: reports.filter(r => r.type === 'improvement').length,
            question: reports.filter(r => r.type === 'question').length,
          },
        };

        set({ stats });
      },

      // Configurações
      setIncludeScreenshotByDefault: (value) => {
        set({ includeScreenshotByDefault: value });
      },
    }),
    {
      name: 'auris-bug-tracker-storage',
      partialize: (state) => ({
        reports: state.reports,
        includeScreenshotByDefault: state.includeScreenshotByDefault,
      }),
    }
  )
);

// Hook para inicializar listeners de eventos
export function useBugTrackerEvents() {
  const { activateEditMode, deactivateEditMode } = useBugTrackerStore();
  
  useEffect(() => {
    const handleAtivar = () => activateEditMode();
    const handleDesativar = () => deactivateEditMode();
    
    window.addEventListener('aura-ativar-modo-edicao', handleAtivar);
    window.addEventListener('aura-desativar-modo-edicao', handleDesativar);
    
    return () => {
      window.removeEventListener('aura-ativar-modo-edicao', handleAtivar);
      window.removeEventListener('aura-desativar-modo-edicao', handleDesativar);
    };
  }, [activateEditMode, deactivateEditMode]);
}

// Funções auxiliares para persistência em arquivo
// Nota: Em um ambiente real, isso seria feito via backend
// Aqui usamos localStorage como simulação

async function saveReportToFile(id: string, content: string): Promise<void> {
  // Salvar no localStorage como simulação
  localStorage.setItem(`bug-report-${id}`, content);
  
  // Disparar evento para que o sistema de arquivos (se houver) possa capturar
  window.dispatchEvent(new CustomEvent('bug-report-saved', { 
    detail: { id, content } 
  }));
}

async function moveReportToResolved(id: string, content: string): Promise<void> {
  // Mover no localStorage
  localStorage.removeItem(`bug-report-${id}`);
  localStorage.setItem(`bug-report-resolved-${id}`, content);
  
  window.dispatchEvent(new CustomEvent('bug-report-resolved', { 
    detail: { id, content } 
  }));
}

async function saveSummaryToFile(content: string): Promise<void> {
  localStorage.setItem('bug-reports-summary', content);
  
  window.dispatchEvent(new CustomEvent('bug-summary-updated', { 
    detail: { content } 
  }));
}

export default useBugTrackerStore;
