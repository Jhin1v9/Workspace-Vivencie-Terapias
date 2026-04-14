/**
 * 🐛 BugTrackerOverlay
 * Overlay principal do modo de edição/inspeção
 */

import React, { useCallback, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bug, Eye, MousePointer } from 'lucide-react';
import { useElementInspector } from './hooks/useElementInspector';
import { useScreenshot } from './hooks/useScreenshot';
import { InspectorTooltip } from './InspectorTooltip';
import { ElementHighlighter } from './ElementHighlighter';
import { BugReportModal } from './BugReportModal';
import { useBugTrackerStore } from '@/stores/useBugTrackerStore';
import type { InspectedElement, CreateBugReportData } from './types/bugTracker.types';

interface BugTrackerOverlayProps {
  isActive: boolean;
  onDeactivate: () => void;
}

export const BugTrackerOverlay: React.FC<BugTrackerOverlayProps> = ({
  isActive,
  onDeactivate,
}) => {
  const {
    isModalOpen,
    selectedElement,
    screenshotDataUrl,
    openReportModal,
    closeReportModal,
    setScreenshot,
    createReport,
  } = useBugTrackerStore();

  const { capture, screenshotUrl } = useScreenshot({
    quality: 0.8,
    type: 'image/png',
  });

  const [showIntro, setShowIntro] = useState(true);
  const [reportCount, setReportCount] = useState(0);

  // Esconder intro após 3 segundos
  useEffect(() => {
    if (isActive && showIntro) {
      const timer = setTimeout(() => setShowIntro(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isActive, showIntro]);

  // Handler de clique no elemento
  const handleElementClick = useCallback(async (element: InspectedElement) => {
    const screenshot = await capture();
    openReportModal(element, screenshot);
  }, [capture, openReportModal]);

  const {
    hoveredElement,
    mousePosition,
    isInspecting,
  } = useElementInspector({
    isActive,
    onElementClick: handleElementClick,
  });

  // Handler de submit do report
  const handleSubmitReport = useCallback(async (data: CreateBugReportData) => {
    await createReport(data);
    setReportCount(prev => prev + 1);
  }, [createReport]);

  // Atualizar screenshot no store quando mudar
  useEffect(() => {
    if (screenshotUrl) {
      setScreenshot(screenshotUrl);
    }
  }, [screenshotUrl, setScreenshot]);

  if (!isActive) return null;

  return (
    <>
      {/* Overlay de fundo transparente para feedback visual */}
      <div
        className="fixed inset-0 z-[9990] pointer-events-none"
        style={{ cursor: isInspecting ? 'pointer' : 'crosshair' }}
        data-bug-tracker="true"
      />

      {/* Elemento destacado */}
      <AnimatePresence>
        {hoveredElement && (
          <ElementHighlighter element={hoveredElement} />
        )}
      </AnimatePresence>

      {/* Tooltip de inspeção */}
      <AnimatePresence>
        {hoveredElement && (
          <InspectorTooltip 
            element={hoveredElement} 
            mouseX={mousePosition.x} 
            mouseY={mousePosition.y} 
          />
        )}
      </AnimatePresence>

      {/* Botão de sair */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="fixed top-6 right-6 z-[10001]"
        data-bug-tracker="true"
      >
        <div className="flex flex-col items-end gap-2">
          {/* Contador de reports */}
          {reportCount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-3 py-1.5 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-xs text-cyan-300 flex items-center gap-2"
            >
              <Bug className="w-3.5 h-3.5" />
              {reportCount} report{reportCount !== 1 ? 's' : ''} criado{reportCount !== 1 ? 's' : ''}
            </motion.div>
          )}

          {/* Botão sair */}
          <button
            onClick={onDeactivate}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-500/90 hover:bg-red-500 text-white text-sm font-medium rounded-xl shadow-lg shadow-red-500/30 transition-all hover:scale-105 active:scale-95 backdrop-blur-sm"
          >
            <X className="w-4 h-4" />
            Sair do Modo Edição
          </button>
        </div>
      </motion.div>

      {/* Indicador de modo ativo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-6 left-6 z-[10001] flex items-center gap-3 px-4 py-2.5 bg-slate-900/90 border border-cyan-500/30 rounded-xl shadow-lg backdrop-blur-sm"
        data-bug-tracker="true"
      >
        <div className="relative">
          <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
          <div className="absolute inset-0 w-3 h-3 bg-cyan-400 rounded-full animate-ping opacity-30" />
        </div>
        <div>
          <p className="text-sm font-medium text-white">Modo Edição Ativo</p>
          <p className="text-xs text-slate-400">Passe o mouse e clique para reportar</p>
        </div>
      </motion.div>

      {/* Intro animada */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center pointer-events-none"
          >
            <div className="bg-slate-900/95 border border-cyan-500/30 rounded-2xl p-8 text-center shadow-2xl backdrop-blur-xl max-w-md">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center"
              >
                <Eye className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-2">Modo Edição Ativado</h3>
              <p className="text-slate-400 text-sm mb-4">
                Passe o mouse sobre qualquer elemento para inspecionar.<br />
                Clique para adicionar um report de bug.
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <MousePointer className="w-4 h-4" />
                  <span>Clique para reportar</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <X className="w-4 h-4" />
                  <span>ESC para cancelar</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de report */}
      <BugReportModal
        isOpen={isModalOpen}
        element={selectedElement}
        screenshotDataUrl={screenshotDataUrl}
        onClose={closeReportModal}
        onSubmit={handleSubmitReport}
      />
    </>
  );
};
