/**
 * 🗂️ BrowserTabs
 * Gerenciamento de abas do navegador
 */

import React, { useCallback } from 'react';
import { X, Plus } from 'lucide-react';
import type { BrowserTabsProps } from './types/browser.types';
import { extractDomain, getFaviconUrl } from './utils/urlValidator';

export const BrowserTabs: React.FC<BrowserTabsProps> = ({
  tabs,
  activeTabId,
  onTabClick,
  onTabClose,
  onAddTab,
}) => {
  const handleTabClick = useCallback((tabId: string) => {
    onTabClick(tabId);
  }, [onTabClick]);

  const handleCloseClick = useCallback((e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    onTabClose(tabId);
  }, [onTabClose]);

  const handleAddClick = useCallback(() => {
    onAddTab();
  }, [onAddTab]);

  return (
    <div className="flex items-center gap-1 px-2 py-2 bg-slate-900/95 border-b border-slate-700/50 overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        const domain = extractDomain(tab.url);
        const favicon = tab.favicon || getFaviconUrl(tab.url);

        return (
          <div
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`
              group relative flex items-center gap-2 min-w-[140px] max-w-[200px] 
              px-3 py-2 rounded-t-lg cursor-pointer transition-all
              ${isActive 
                ? 'bg-slate-800 text-slate-100' 
                : 'bg-slate-800/40 text-slate-400 hover:bg-slate-800/60 hover:text-slate-300'
              }
            `}
          >
            {/* Loading indicator ou Favicon */}
            <div className="w-4 h-4 flex-shrink-0">
              {tab.isLoading ? (
                <div className="w-4 h-4 border-2 border-slate-600 border-t-slate-300 rounded-full animate-spin" />
              ) : favicon ? (
                <img 
                  src={favicon} 
                  alt="" 
                  className="w-4 h-4 rounded-sm"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-4 h-4 bg-slate-600 rounded-sm" />
              )}
            </div>

            {/* Título da aba */}
            <span className="flex-1 truncate text-sm">
              {tab.title || domain || 'Nova Aba'}
            </span>

            {/* Botão fechar */}
            <button
              onClick={(e) => handleCloseClick(e, tab.id)}
              className={`
                p-0.5 rounded opacity-0 group-hover:opacity-100 
                hover:bg-slate-700 transition-all
                ${isActive ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500'}
              `}
              title="Fechar aba"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Indicador de aba ativa */}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-t" />
            )}
          </div>
        );
      })}

      {/* Botão Nova Aba */}
      <button
        onClick={handleAddClick}
        className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-all"
        title="Nova aba"
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
};
