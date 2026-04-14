/**
 * 🎯 useRenderStrategy Hook
 * Detecta automaticamente qual estratégia de renderização usar para uma URL
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { RenderStrategy } from '../types/browser.types';

const PROXY_SERVICES = [
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
];

const IFRAME_TIMEOUT_MS = 3500;

function buildProxyStrategy(url: string, proxyIndex = 0): Extract<RenderStrategy, { type: 'proxy' }> {
  return {
    type: 'proxy',
    proxyUrl: PROXY_SERVICES[proxyIndex % PROXY_SERVICES.length](url),
    originalUrl: url,
  };
}

function buildExternalStrategy(url: string, reason: string): Extract<RenderStrategy, { type: 'external' }> {
  return { type: 'external', url, reason };
}

export function useRenderStrategy(url: string) {
  const [strategy, setStrategy] = useState<RenderStrategy>({ type: 'iframe', url });
  const [proxyAttempt, setProxyAttempt] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadedRef = useRef(false);

  const markIframeLoaded = useCallback(() => {
    loadedRef.current = true;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const markIframeError = useCallback(() => {
    loadedRef.current = false;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    // Se iframe falhou e ainda não tentou proxy, tentar proxy
    setStrategy((prev) => {
      if (prev.type === 'iframe') {
        return buildProxyStrategy(url, 0);
      }
      return prev;
    });
  }, [url]);

  const markProxyError = useCallback(() => {
    setProxyAttempt((prev) => {
      const next = prev + 1;
      if (next < PROXY_SERVICES.length) {
        setStrategy(buildProxyStrategy(url, next));
      } else {
        setStrategy(buildExternalStrategy(url, 'O site bloqueia carregamento em iframe e os proxies disponíveis não conseguiram contornar.'));
      }
      return next;
    });
  }, [url]);

  const openExternal = useCallback(() => {
    setStrategy(buildExternalStrategy(url, 'Escolha do usuário: abrir no navegador externo.'));
  }, [url]);

  const retryIframe = useCallback(() => {
    loadedRef.current = false;
    setProxyAttempt(0);
    setStrategy({ type: 'iframe', url });
  }, [url]);

  const retryProxy = useCallback(() => {
    setProxyAttempt(0);
    setStrategy(buildProxyStrategy(url, 0));
  }, [url]);

  // Monitorar mudanças de URL e reiniciar estratégia
  useEffect(() => {
    loadedRef.current = false;
    setProxyAttempt(0);
    setStrategy({ type: 'iframe', url });
  }, [url]);

  // Timeout de detecção de blank/error no iframe
  useEffect(() => {
    if (strategy.type !== 'iframe') return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    loadedRef.current = false;
    timeoutRef.current = setTimeout(() => {
      if (!loadedRef.current) {
        setStrategy(buildProxyStrategy(url, 0));
      }
    }, IFRAME_TIMEOUT_MS);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [strategy.type, url]);

  return {
    strategy,
    proxyAttempt,
    markIframeLoaded,
    markIframeError,
    markProxyError,
    openExternal,
    retryIframe,
    retryProxy,
  };
}
