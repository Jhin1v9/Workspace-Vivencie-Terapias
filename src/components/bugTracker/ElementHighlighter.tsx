/**
 * ✨ ElementHighlighter
 * Destaca o elemento sob o mouse com borda e overlay
 */

import React from 'react';
import { motion } from 'framer-motion';
import type { InspectedElement } from './types/bugTracker.types';

interface ElementHighlighterProps {
  element: InspectedElement;
}

export const ElementHighlighter: React.FC<ElementHighlighterProps> = ({
  element,
}) => {
  const { rect } = element;

  return (
    <>
      {/* Borda de destaque */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.1 }}
        className="fixed pointer-events-none z-[9998]"
        style={{
          left: rect.x - 2,
          top: rect.y - 2,
          width: rect.width + 4,
          height: rect.height + 4,
        }}
        data-bug-tracker="true"
      >
        {/* Borda externa animada */}
        <motion.div
          className="absolute inset-0 rounded"
          style={{
            border: '2px solid cyan',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.5), 0 0 20px rgba(6,182,212,0.5)',
          }}
          animate={{
            boxShadow: [
              '0 0 0 1px rgba(0,0,0,0.5), 0 0 10px rgba(6,182,212,0.3)',
              '0 0 0 1px rgba(0,0,0,0.5), 0 0 30px rgba(6,182,212,0.6)',
              '0 0 0 1px rgba(0,0,0,0.5), 0 0 10px rgba(6,182,212,0.3)',
            ],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Cantos destacados */}
        <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
        <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
        <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
        <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />

        {/* Label no canto superior esquerdo */}
        <div className="absolute -top-6 left-0 px-2 py-0.5 bg-cyan-500 text-slate-900 text-[10px] font-bold rounded-t">
          {element.tag}
        </div>
      </motion.div>

      {/* Overlay semi-transparente para escurecer o resto */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 pointer-events-none z-[9997]"
        style={{
          background: `
            linear-gradient(to right, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.3) ${rect.x}px, 
            transparent ${rect.x}px, transparent ${rect.x + rect.width}px, 
            rgba(0,0,0,0.3) ${rect.x + rect.width}px, rgba(0,0,0,0.3) 100%),
            linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.3) ${rect.y}px, 
            transparent ${rect.y}px, transparent ${rect.y + rect.height}px, 
            rgba(0,0,0,0.3) ${rect.y + rect.height}px, rgba(0,0,0,0.3) 100%)
          `,
        }}
        data-bug-tracker="true"
      />
    </>
  );
};
