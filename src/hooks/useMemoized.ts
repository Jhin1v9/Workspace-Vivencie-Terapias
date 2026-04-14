// ============================================================================
// USE MEMOIZED - Hooks de memoização para performance
// FASE 6: Otimizações de Performance
// ============================================================================

import { useMemo, useCallback, useRef, useEffect, useState } from 'react';

// ============================================================================
// MEMOIZAÇÃO DE LISTAS
// ============================================================================

export function useMemoizedList<T>(
  items: T[],
  keyExtractor: (item: T) => string | number
): T[] {
  const prevItemsRef = useRef<T[]>([]);
  const prevKeysRef = useRef<string>('');

  return useMemo(() => {
    const currentKeys = items.map(keyExtractor).join(',');
    
    // Só recalcula se as chaves mudarem
    if (currentKeys !== prevKeysRef.current) {
      prevKeysRef.current = currentKeys;
      prevItemsRef.current = items;
    }
    
    return prevItemsRef.current;
  }, [items, keyExtractor]);
}

// ============================================================================
// MEMOIZAÇÃO DE FILTROS
// ============================================================================

export function useMemoizedFilter<T>(
  items: T[],
  filterFn: (item: T) => boolean,
  deps: React.DependencyList = []
): T[] {
  return useMemo(() => items.filter(filterFn), [items, filterFn, ...deps]);
}

export function useMemoizedSort<T>(
  items: T[],
  compareFn: (a: T, b: T) => number,
  deps: React.DependencyList = []
): T[] {
  return useMemo(() => [...items].sort(compareFn), [items, compareFn, ...deps]);
}

// ============================================================================
// MEMOIZAÇÃO DE PAGINAÇÃO
// ============================================================================

interface PaginationOptions {
  pageSize: number;
  currentPage: number;
}

export function useMemoizedPagination<T>(
  items: T[],
  options: PaginationOptions
): {
  paginatedItems: T[];
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
} {
  const { pageSize, currentPage } = options;

  return useMemo(() => {
    const totalPages = Math.ceil(items.length / pageSize);
    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedItems = items.slice(startIndex, endIndex);

    return {
      paginatedItems,
      totalPages,
      hasNextPage: currentPage < totalPages - 1,
      hasPrevPage: currentPage > 0,
    };
  }, [items, pageSize, currentPage]);
}

// ============================================================================
// MEMOIZAÇÃO DE CALLBACKS
// ============================================================================

export function useStableCallback<T extends (...args: any[]) => any>(
  callback: T
): T {
  const callbackRef = useRef(callback);
  
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  
  return useCallback((...args: Parameters<T>) => {
    return callbackRef.current(...args);
  }, []) as T;
}

// ============================================================================
// MEMOIZAÇÃO DE BUSCA COM DEBOUNCE
// ============================================================================

export function useMemoizedSearch<T>(
  items: T[],
  searchTerm: string,
  searchFn: (item: T, term: string) => boolean,
  debounceMs: number = 150
): { results: T[]; isSearching: boolean } {
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
      setIsSearching(false);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs]);

  const results = useMemo(() => {
    if (!debouncedTerm.trim()) return items;
    return items.filter((item) => searchFn(item, debouncedTerm.toLowerCase()));
  }, [items, debouncedTerm, searchFn]);

  return { results, isSearching };
}

// ============================================================================
// CACHE DE RESULTADOS
// ============================================================================

class SimpleCache<K, V> {
  private cache = new Map<K, { value: V; timestamp: number }>();
  private maxSize: number;
  private ttl: number;

  constructor(maxSize: number = 100, ttlMs: number = 5 * 60 * 1000) {
    this.maxSize = maxSize;
    this.ttl = ttlMs;
  }

  get(key: K): V | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;
    
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return undefined;
    }
    
    return entry.value;
  }

  set(key: K, value: V): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, { value, timestamp: Date.now() });
  }

  clear(): void {
    this.cache.clear();
  }
}

// Cache global para dados frequentemente acessados
export const globalCache = new SimpleCache<string, unknown>();

export function useCachedValue<T>(
  key: string,
  computeFn: () => T,
  deps: React.DependencyList = []
): T {
  const cachedValue = globalCache.get(key) as T | undefined;
  
  const value = useMemo(() => {
    if (cachedValue !== undefined) return cachedValue;
    const newValue = computeFn();
    globalCache.set(key, newValue);
    return newValue;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, cachedValue, computeFn, ...deps]);

  return value;
}
