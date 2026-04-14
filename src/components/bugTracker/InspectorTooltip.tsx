/**
 * 🔍 InspectorTooltip
 * Tooltip que aparece ao passar mouse sobre elemento
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Layers,
  Hash,
  Tag,
  Maximize2,
  MapPin,
  Code2,
  FileCode,
  ChevronDown,
  ChevronRight,
  BoxSelect,
} from 'lucide-react';
import type { InspectedElement } from './types/bugTracker.types';

interface InspectorTooltipProps {
  element: InspectedElement;
  mouseX: number;
  mouseY: number;
}

export const InspectorTooltip: React.FC<InspectorTooltipProps> = ({
  element,
  mouseX,
  mouseY,
}) => {
  const [showStyles, setShowStyles] = useState(false);

  // Calcular posição do tooltip (evitar sair da tela)
  const tooltipWidth = 340;
  const tooltipHeight = 240;

  let left = mouseX + 20;
  let top = mouseY + 20;

  if (left + tooltipWidth > window.innerWidth) {
    left = mouseX - tooltipWidth - 20;
  }

  if (top + tooltipHeight > window.innerHeight) {
    top = mouseY - tooltipHeight - 20;
  }

  const cs = element.computedStyles;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="fixed z-[9999] w-[340px] bg-slate-900/95 backdrop-blur-xl rounded-xl border border-cyan-500/50 shadow-2xl shadow-cyan-500/20 pointer-events-none"
      style={{ left, top }}
      data-bug-tracker="true"
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-700/50 bg-cyan-500/10 rounded-t-xl">
        <Code2 className="w-4 h-4 text-cyan-400" />
        <span className="font-mono text-sm font-bold text-cyan-400 uppercase">
          {element.tag}
        </span>
        {element.componentName && (
          <>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-amber-400 flex items-center gap-1">
              <FileCode className="w-3 h-3" />
              {element.componentName}
            </span>
          </>
        )}
      </div>

      {/* Conteúdo */}
      <div className="p-3 space-y-2 text-xs">
        {/* ID */}
        {element.id && (
          <div className="flex items-start gap-2">
            <Hash className="w-3.5 h-3.5 text-slate-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-slate-400">ID:</span>
              <code className="ml-1 text-cyan-300 font-mono">#{element.id}</code>
            </div>
          </div>
        )}

        {/* Classes — scroll horizontal sem truncar */}
        <div className="flex items-start gap-2">
          <Tag className="w-3.5 h-3.5 text-slate-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="text-slate-400">Classes:</span>
            <div className="mt-1 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
              <code className="text-slate-300 font-mono">
                {element.className || 'Nenhuma'}
              </code>
            </div>
          </div>
        </div>

        {/* Dimensões */}
        <div className="flex items-start gap-2">
          <Maximize2 className="w-3.5 h-3.5 text-slate-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <span className="text-slate-400">Dimensões:</span>
            <span className="ml-1 text-slate-300">
              {Math.round(element.rect.width)} × {Math.round(element.rect.height)}px
            </span>
          </div>
        </div>

        {/* Posição */}
        <div className="flex items-start gap-2">
          <MapPin className="w-3.5 h-3.5 text-slate-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <span className="text-slate-400">Posição:</span>
            <span className="ml-1 text-slate-300 font-mono">
              x: {Math.round(element.rect.x)}, y: {Math.round(element.rect.y)}
            </span>
          </div>
        </div>

        {/* Computed Styles — colapsável */}
        <div className="pt-1 border-t border-slate-700/50">
          <button
            onClick={() => setShowStyles((s) => !s)}
            className="flex items-center gap-1.5 text-[10px] text-slate-400 hover:text-cyan-300 transition-colors pointer-events-auto"
          >
            <BoxSelect className="w-3 h-3" />
            Estilos Computados
            {showStyles ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </button>

          {showStyles && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-1.5 grid grid-cols-2 gap-x-2 gap-y-1 text-[10px]"
            >
              <div className="text-slate-500">margin: <span className="text-slate-300 font-mono">{cs.margin}</span></div>
              <div className="text-slate-500">padding: <span className="text-slate-300 font-mono">{cs.padding}</span></div>
              <div className="text-slate-500">display: <span className="text-slate-300 font-mono">{cs.display}</span></div>
              <div className="text-slate-500">position: <span className="text-slate-300 font-mono">{cs.position}</span></div>
              <div className="text-slate-500">font-size: <span className="text-slate-300 font-mono">{cs.fontSize}</span></div>
              <div className="text-slate-500">color: <span className="text-slate-300 font-mono">{cs.color}</span></div>
              <div className="text-slate-500">bg: <span className="text-slate-300 font-mono">{cs.backgroundColor}</span></div>
              <div className="text-slate-500">z-index: <span className="text-slate-300 font-mono">{cs.zIndex}</span></div>
            </motion.div>
          )}
        </div>

        {/* Hierarquia resumida */}
        {element.parentChain.length > 0 && (
          <div className="pt-1 border-t border-slate-700/50">
            <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-1">
              <Layers className="w-3 h-3" />
              Hierarquia
            </div>
            <div className="flex flex-wrap gap-1">
              {element.parentChain.slice(0, 3).reverse().map((parent, i) => (
                <span
                  key={i}
                  className="px-1.5 py-0.5 bg-slate-800 rounded text-[10px] text-slate-400"
                >
                  {parent.tag}
                </span>
              ))}
              {element.parentChain.length > 3 && (
                <span className="text-[10px] text-slate-500">
                  +{element.parentChain.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-2 border-t border-slate-700/50 bg-slate-800/30 rounded-b-xl">
        <p className="text-[10px] text-slate-500 text-center">
          Clique para adicionar anotação • ESC para cancelar
        </p>
      </div>
    </motion.div>
  );
};
