/**
 * 🌐 BrowserFrame
 * Componente principal do navegador embutido
 */

import React, { useCallback, useState, useEffect } from 'react';
import { Globe, Bookmark, Clock, ExternalLink, Plus, Star } from 'lucide-react';
import { BrowserToolbar } from './BrowserToolbar';
import { BrowserTabs } from './BrowserTabs';
import { BrowserViewport } from './BrowserViewport';
import { useBrowserTabs, useBrowserHistory, useBrowserSecurity } from './hooks';
import { getFaviconUrl, extractDomain } from './utils/urlValidator';
import type { BrowserFrameProps } from './types/browser.types';

export const BrowserFrame: React.FC<BrowserFrameProps> = ({
  initialUrl,
  security,
  onUrlChange,
  onTitleChange,
  className = '',
}) => {
  const {
    tabs,
    activeTabId,
    activeTab,
    addTab,
    closeTab,
    setActiveTab,
    navigate,
    goBack,
    goForward,
    reload,
    finishLoading,
  } = useBrowserTabs(initialUrl);

  const {
    history,
    bookmarksByCategory,
    addToHistory,
    addBookmark,
  } = useBrowserHistory();
  
  // Adicionar site à área de trabalho
  const handleAddToDesktop = useCallback(() => {
    const siteName = activeTab.title || extractDomain(activeTab.url);
    const iconUrl = getFaviconUrl(activeTab.url);
    
    // Dispatch evento para Desktop
    window.dispatchEvent(new CustomEvent('add-to-desktop', {
      detail: {
        id: `webapp-${Date.now()}`,
        label: siteName,
        url: activeTab.url,
        icon: iconUrl,
        type: 'webapp',
      }
    }));
    
    // Feedback visual
    alert(`"${siteName}" foi adicionado à área de trabalho!`);
  }, [activeTab]);
  
  // Adicionar aos favoritos
  const handleAddBookmark = useCallback(() => {
    const siteName = activeTab.title || extractDomain(activeTab.url);
    addBookmark(activeTab.url, siteName, 'Favoritos do Usuário');
    alert(`"${siteName}" adicionado aos favoritos!`);
  }, [activeTab, addBookmark]);

  const { validateNavigation } = useBrowserSecurity(security);
  
  // Listen for navigation events from viewport
  useEffect(() => {
    const handleNavigate = (e: CustomEvent<{ url: string }>) => {
      if (e.detail?.url) {
        navigate(activeTab.id, e.detail.url);
      }
    };
    
    const handleSetUrl = (e: CustomEvent<{ url: string }>) => {
      if (e.detail?.url) {
        navigate(activeTab.id, e.detail.url);
      }
    };
    
    window.addEventListener('browser-navigate', handleNavigate as EventListener);
    window.addEventListener('browser-set-url', handleSetUrl as EventListener);
    
    return () => {
      window.removeEventListener('browser-navigate', handleNavigate as EventListener);
      window.removeEventListener('browser-set-url', handleSetUrl as EventListener);
    };
  }, [activeTab.id, navigate]);

  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'bookmarks' | 'history'>('bookmarks');

  // Navegar para URL
  const handleUrlSubmit = useCallback((url: string) => {
    const result = validateNavigation(url);
    if (result.allowed) {
      navigate(activeTab.id, result.url);
    }
  }, [activeTab.id, navigate, validateNavigation]);

  // Quando aba carrega
  const handleLoad = useCallback((tabId: string, title: string) => {
    finishLoading(tabId, title);
    
    // Adicionar ao histórico
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      addToHistory({
        url: tab.url,
        title: title || tab.url,
        favicon: getFaviconUrl(tab.url),
      });
    }

    // Callbacks externos
    if (tabId === activeTabId) {
      onUrlChange?.(tab?.url || '');
      onTitleChange?.(title);
    }
  }, [tabs, activeTabId, finishLoading, addToHistory, onUrlChange, onTitleChange]);

  // Quando aba dá erro
  const handleError = useCallback((tabId: string, _error: Error) => {
    finishLoading(tabId, 'Erro');
  }, [finishLoading]);


  // Navegar para bookmark ou histórico
  const handleNavigateTo = useCallback((url: string) => {
    navigate(activeTab.id, url);
    setShowSidebar(false);
  }, [activeTab.id, navigate]);

  return (
    <div className={`flex flex-col h-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800 ${className}`}>
      {/* Abas */}
      <BrowserTabs
        tabs={tabs}
        activeTabId={activeTabId}
        onTabClick={setActiveTab}
        onTabClose={closeTab}
        onAddTab={addTab}
      />

      {/* Toolbar */}
      <BrowserToolbar
        url={activeTab.url}
        canGoBack={activeTab.canGoBack}
        canGoForward={activeTab.canGoForward}
        isLoading={activeTab.isLoading}
        onUrlSubmit={handleUrlSubmit}
        onBack={() => goBack(activeTab.id)}
        onForward={() => goForward(activeTab.id)}
        onReload={() => reload(activeTab.id)}
        onHome={() => navigate(activeTab.id, 'https://www.google.com')}
      />

      {/* Área principal */}
      <div className="flex flex-1 overflow-hidden">
        {/* Viewport */}
        <BrowserViewport
          tab={activeTab}
          onLoad={handleLoad}
          onError={handleError}
        />

        {/* Sidebar (Bookmarks/History) */}
        {showSidebar && (
          <div className="w-72 bg-slate-900/95 border-l border-slate-700/50 flex flex-col">
            {/* Tabs da sidebar */}
            <div className="flex border-b border-slate-700/50">
              <button
                onClick={() => setSidebarTab('bookmarks')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                  sidebarTab === 'bookmarks'
                    ? 'text-indigo-400 border-b-2 border-indigo-500'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                Favoritos
              </button>
              <button
                onClick={() => setSidebarTab('history')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                  sidebarTab === 'history'
                    ? 'text-indigo-400 border-b-2 border-indigo-500'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Clock className="w-4 h-4" />
                Histórico
              </button>
            </div>

            {/* Conteúdo da sidebar */}
            <div className="flex-1 overflow-y-auto p-3">
              {sidebarTab === 'bookmarks' ? (
                <div className="space-y-4">
                  {Object.entries(bookmarksByCategory).map(([category, items]) => (
                    <div key={category}>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        {category}
                      </h4>
                      <div className="space-y-1">
                        {items.map((bookmark) => (
                          <button
                            key={bookmark.id}
                            onClick={() => handleNavigateTo(bookmark.url)}
                            className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left text-sm text-slate-300 hover:bg-slate-800/60 transition-colors group"
                          >
                            <img
                              src={getFaviconUrl(bookmark.url)}
                              alt=""
                              className="w-4 h-4 rounded-sm"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                            <span className="flex-1 truncate">{bookmark.title}</span>
                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 text-slate-500" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  {history.slice(0, 50).map((entry, index) => (
                    <button
                      key={`${entry.url}-${index}`}
                      onClick={() => handleNavigateTo(entry.url)}
                      className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left text-sm text-slate-300 hover:bg-slate-800/60 transition-colors"
                    >
                      <img
                        src={entry.favicon || getFaviconUrl(entry.url)}
                        alt=""
                        className="w-4 h-4 rounded-sm"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="truncate">{entry.title}</div>
                        <div className="text-xs text-slate-500 truncate">{extractDomain(entry.url)}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer com ações rápidas */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900/95 border-t border-slate-700/50 text-xs">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className={`flex items-center gap-1 hover:text-slate-300 transition-colors ${
              showSidebar ? 'text-indigo-400' : 'text-slate-500'
            }`}
          >
            <Globe className="w-4 h-4" />
            {showSidebar ? 'Fechar painel' : 'Favoritos & Histórico'}
          </button>
          
          <div className="w-px h-4 bg-slate-700" />
          
          <button
            onClick={handleAddBookmark}
            className="flex items-center gap-1 text-slate-500 hover:text-amber-400 transition-colors"
            title="Adicionar aos favoritos"
          >
            <Star className="w-4 h-4" />
            Favoritar
          </button>
          
          <button
            onClick={handleAddToDesktop}
            className="flex items-center gap-1 text-slate-500 hover:text-emerald-400 transition-colors"
            title="Adicionar à área de trabalho"
          >
            <Plus className="w-4 h-4" />
            Ao Desktop
          </button>
        </div>

        <div className="flex items-center gap-3 text-slate-500">
          {activeTab.isLoading ? (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
              Carregando...
            </span>
          ) : (
            <span>{extractDomain(activeTab.url)}</span>
          )}
        </div>
      </div>
    </div>
  );
};
