/**
 * 📜 useBrowserHistory Hook
 * Gerenciamento de histórico global do navegador
 */

import { useState, useCallback, useEffect } from 'react';
import type { HistoryEntry, Bookmark } from '../types/browser.types';
import { defaultBookmarks } from '../utils/urlValidator';

const HISTORY_KEY = 'auris-browser-history';
const BOOKMARKS_KEY = 'auris-browser-bookmarks';
const MAX_HISTORY_ITEMS = 100;

export function useBrowserHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    if (typeof window === 'undefined') return defaultBookmarks;
    try {
      const saved = localStorage.getItem(BOOKMARKS_KEY);
      return saved ? JSON.parse(saved) : defaultBookmarks;
    } catch {
      return defaultBookmarks;
    }
  });

  // Persistir histórico
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  // Persistir favoritos
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  /** Adiciona entrada ao histórico */
  const addToHistory = useCallback((entry: Omit<HistoryEntry, 'timestamp'>) => {
    setHistory(prev => {
      // Evitar duplicados consecutivos
      if (prev.length > 0 && prev[0].url === entry.url) {
        return prev;
      }
      
      const newEntry: HistoryEntry = {
        ...entry,
        timestamp: Date.now(),
      };
      
      const updated = [newEntry, ...prev].slice(0, MAX_HISTORY_ITEMS);
      return updated;
    });
  }, []);

  /** Limpa histórico */
  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  /** Busca no histórico */
  const searchHistory = useCallback((query: string): HistoryEntry[] => {
    const lowerQuery = query.toLowerCase();
    return history.filter(
      entry =>
        entry.title.toLowerCase().includes(lowerQuery) ||
        entry.url.toLowerCase().includes(lowerQuery)
    );
  }, [history]);

  /** Adiciona favorito */
  const addBookmark = useCallback((url: string, title: string, category?: string) => {
    setBookmarks(prev => {
      // Evitar duplicados
      if (prev.some(b => b.url === url)) return prev;
      
      const newBookmark: Bookmark = {
        id: `bm-${Date.now()}`,
        url,
        title,
        category,
        createdAt: Date.now(),
      };
      
      return [...prev, newBookmark];
    });
  }, []);

  /** Remove favorito */
  const removeBookmark = useCallback((id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
  }, []);

  /** Atualiza favorito */
  const updateBookmark = useCallback((id: string, updates: Partial<Bookmark>) => {
    setBookmarks(prev =>
      prev.map(b => (b.id === id ? { ...b, ...updates } : b))
    );
  }, []);

  /** Verifica se URL está favoritada */
  const isBookmarked = useCallback((url: string): boolean => {
    return bookmarks.some(b => b.url === url);
  }, [bookmarks]);

  /** Busca favorito por URL */
  const getBookmarkByUrl = useCallback((url: string): Bookmark | undefined => {
    return bookmarks.find(b => b.url === url);
  }, [bookmarks]);

  /** Organiza favoritos por categoria */
  const bookmarksByCategory = bookmarks.reduce((acc, bookmark) => {
    const category = bookmark.category || 'Outros';
    if (!acc[category]) acc[category] = [];
    acc[category].push(bookmark);
    return acc;
  }, {} as Record<string, Bookmark[]>);

  return {
    history,
    bookmarks,
    bookmarksByCategory,
    addToHistory,
    clearHistory,
    searchHistory,
    addBookmark,
    removeBookmark,
    updateBookmark,
    isBookmarked,
    getBookmarkByUrl,
  };
}
