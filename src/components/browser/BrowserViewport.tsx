/**
 * 🖼️ BrowserViewport
 * Área de renderização com strategy pattern (iframe → proxy → externo)
 */

import React, { useCallback } from 'react';
import type { BrowserViewportProps } from './types/browser.types';
import { useRenderStrategy } from './hooks/useRenderStrategy';
import { IframeStrategy } from './strategies/IframeStrategy';
import { ProxyStrategy } from './strategies/ProxyStrategy';
import { ExternalStrategy } from './strategies/ExternalStrategy';

export const BrowserViewport: React.FC<BrowserViewportProps> = ({
  tab,
  onLoad,
  onError,
}) => {
  const {
    strategy,
    markIframeLoaded,
    markIframeError,
    markProxyError,
    openExternal,
    retryIframe,
    retryProxy,
  } = useRenderStrategy(tab.url);

  const handleIframeLoad = useCallback(
    (title?: string) => {
      markIframeLoaded();
      onLoad(tab.id, title || extractDomain(tab.url));
    },
    [markIframeLoaded, onLoad, tab.id, tab.url]
  );

  const handleIframeError = useCallback(() => {
    markIframeError();
    onError(tab.id, new Error('Failed to load page via iframe'));
  }, [markIframeError, onError, tab.id]);

  const handleProxyLoad = useCallback(
    (title?: string) => {
      onLoad(tab.id, title || extractDomain(tab.url));
    },
    [onLoad, tab.id, tab.url]
  );

  const handleProxyError = useCallback(() => {
    markProxyError();
    onError(tab.id, new Error('Failed to load page via proxy'));
  }, [markProxyError, onError, tab.id]);

  const renderStrategy = () => {
    switch (strategy.type) {
      case 'iframe':
        return (
          <IframeStrategy
            url={strategy.url}
            title={tab.title}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
        );
      case 'proxy':
        return (
          <ProxyStrategy
            proxyUrl={strategy.proxyUrl}
            title={tab.title}
            onLoad={handleProxyLoad}
            onError={handleProxyError}
            onOpenExternal={openExternal}
            onRetry={retryIframe}
          />
        );
      case 'external':
        return (
          <ExternalStrategy
            url={strategy.url}
            reason={strategy.reason}
            onRetryIframe={retryIframe}
            onRetryProxy={retryProxy}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative flex-1 bg-white overflow-hidden">
      {/* Loading indicator */}
      {tab.isLoading && strategy.type !== 'external' && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800 z-10">
          <div className="h-full bg-indigo-500 animate-pulse" />
        </div>
      )}

      {renderStrategy()}
    </div>
  );
};

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}
