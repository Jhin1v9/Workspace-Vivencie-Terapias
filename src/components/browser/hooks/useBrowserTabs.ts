/**
 * 🗂️ useBrowserTabs Hook
 * Gerenciamento de abas do navegador
 */

import { useState, useCallback, useRef } from 'react';
import type { BrowserTab } from '../types/browser.types';

/** Gera ID único para aba */
function generateTabId(): string {
  return `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/** URL padrão para nova aba */
const DEFAULT_URL = 'https://www.google.com';

export function useBrowserTabs(initialUrl?: string) {
  const [tabs, setTabs] = useState<BrowserTab[]>(() => {
    const firstTab: BrowserTab = {
      id: generateTabId(),
      url: initialUrl || DEFAULT_URL,
      title: 'Nova Aba',
      isLoading: false,
      isActive: true,
      canGoBack: false,
      canGoForward: false,
    };
    return [firstTab];
  });

  const [activeTabId, setActiveTabId] = useState<string>(tabs[0].id);
  
  // Refs para navegação (iframe history)
  const historyRefs = useRef<Map<string, string[]>>(new Map());
  const historyIndexRefs = useRef<Map<string, number>>(new Map());

  /** Adiciona nova aba */
  const addTab = useCallback((url: string = DEFAULT_URL): string => {
    const newTab: BrowserTab = {
      id: generateTabId(),
      url,
      title: 'Nova Aba',
      isLoading: true,
      isActive: true,
      canGoBack: false,
      canGoForward: false,
    };

    setTabs(prev => {
      // Desativar aba atual
      const updated = prev.map(t => ({ ...t, isActive: false }));
      return [...updated, newTab];
    });
    
    setActiveTabId(newTab.id);
    
    // Inicializar histórico
    historyRefs.current.set(newTab.id, [url]);
    historyIndexRefs.current.set(newTab.id, 0);
    
    return newTab.id;
  }, []);

  /** Fecha aba */
  const closeTab = useCallback((tabId: string) => {
    setTabs(prev => {
      const tabIndex = prev.findIndex(t => t.id === tabId);
      if (tabIndex === -1) return prev;

      const newTabs = prev.filter(t => t.id !== tabId);
      
      // Se fechou a aba ativa, ativar outra
      if (prev[tabIndex].isActive && newTabs.length > 0) {
        const newActiveIndex = Math.min(tabIndex, newTabs.length - 1);
        newTabs[newActiveIndex].isActive = true;
        setActiveTabId(newTabs[newActiveIndex].id);
      }

      // Limpar refs
      historyRefs.current.delete(tabId);
      historyIndexRefs.current.delete(tabId);

      return newTabs;
    });
  }, []);

  /** Define aba ativa */
  const setActiveTab = useCallback((tabId: string) => {
    setTabs(prev => 
      prev.map(t => ({ ...t, isActive: t.id === tabId }))
    );
    setActiveTabId(tabId);
  }, []);

  /** Atualiza dados da aba */
  const updateTab = useCallback((tabId: string, updates: Partial<BrowserTab>) => {
    setTabs(prev =>
      prev.map(t => t.id === tabId ? { ...t, ...updates } : t)
    );
  }, []);

  /** Navega para URL em uma aba */
  const navigate = useCallback((tabId: string, url: string) => {
    // Atualizar histórico
    const history = historyRefs.current.get(tabId) || [];
    const currentIndex = historyIndexRefs.current.get(tabId) || 0;
    
    // Remover histórico "futuro" se estiver no meio
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(url);
    
    historyRefs.current.set(tabId, newHistory);
    historyIndexRefs.current.set(tabId, newHistory.length - 1);

    setTabs(prev =>
      prev.map(t => {
        if (t.id !== tabId) return t;
        return {
          ...t,
          url,
          isLoading: true,
          canGoBack: newHistory.length > 1,
          canGoForward: false,
        };
      })
    );
  }, []);

  /** Volta no histórico */
  const goBack = useCallback((tabId: string) => {
    const currentIndex = historyIndexRefs.current.get(tabId) || 0;
    if (currentIndex <= 0) return;

    const newIndex = currentIndex - 1;
    historyIndexRefs.current.set(tabId, newIndex);
    
    const history = historyRefs.current.get(tabId) || [];
    const url = history[newIndex];

    setTabs(prev =>
      prev.map(t => {
        if (t.id !== tabId) return t;
        return {
          ...t,
          url,
          isLoading: true,
          canGoBack: newIndex > 0,
          canGoForward: true,
        };
      })
    );
  }, []);

  /** Avança no histórico */
  const goForward = useCallback((tabId: string) => {
    const currentIndex = historyIndexRefs.current.get(tabId) || 0;
    const history = historyRefs.current.get(tabId) || [];
    
    if (currentIndex >= history.length - 1) return;

    const newIndex = currentIndex + 1;
    historyIndexRefs.current.set(tabId, newIndex);
    const url = history[newIndex];

    setTabs(prev =>
      prev.map(t => {
        if (t.id !== tabId) return t;
        return {
          ...t,
          url,
          isLoading: true,
          canGoBack: true,
          canGoForward: newIndex < history.length - 1,
        };
      })
    );
  }, []);

  /** Recarrega aba */
  const reload = useCallback((tabId: string) => {
    setTabs(prev =>
      prev.map(t => t.id === tabId ? { ...t, isLoading: true } : t)
    );
    
    // Trigger reload via iframe (será implementado no componente)
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      navigate(tabId, tab.url);
    }
  }, [tabs]);

  /** Finaliza loading de uma aba */
  const finishLoading = useCallback((tabId: string, title?: string, favicon?: string) => {
    setTabs(prev =>
      prev.map(t => {
        if (t.id !== tabId) return t;
        return {
          ...t,
          isLoading: false,
          title: title || t.title,
          favicon: favicon || t.favicon,
        };
      })
    );
  }, []);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  return {
    tabs,
    activeTabId,
    activeTab,
    addTab,
    closeTab,
    setActiveTab,
    updateTab,
    navigate,
    goBack,
    goForward,
    reload,
    finishLoading,
  };
}
