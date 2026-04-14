// ============================================================================
// HOOK useDebounce - Atrasa atualização de valor
// ============================================================================

import { useState, useEffect } from 'react';

/**
 * Hook que atrasa a atualização de um valor
 * @param value - Valor a ser debounced
 * @param delay - Atraso em ms (padrão: 300ms)
 * @returns Valor debounced
 * 
 * @example
 * const [search, setSearch] = useState('');
 * const debouncedSearch = useDebounce(search, 300);
 * 
 * // debouncedSearch só atualiza 300ms após o usuário parar de digitar
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook para debounce de funções
 * @param callback - Função a ser debounced
 * @param delay - Atraso em ms (padrão: 300ms)
 * @returns Função debounced
 * 
 * @example
 * const debouncedSearch = useDebouncedCallback((query) => {
 *   fetchResults(query);
 * }, 300);
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay = 300
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}
