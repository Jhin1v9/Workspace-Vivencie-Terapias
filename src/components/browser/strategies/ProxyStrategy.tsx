/**
 * ProxyStrategy
 * Renderização via proxy CORS público — fallback para sites de leitura
 */

import React, { useRef, useCallback } from 'react';
import { AlertTriangle, ExternalLink, RefreshCw } from 'lucide-react';

interface ProxyStrategyProps {
  proxyUrl: string;
  title?: string;
  onLoad: (title?: string) => void;
  onError: () => void;
  onOpenExternal: () => void;
  onRetry: () => void;
}

const SANDBOX = 'allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms allow-downloads';
const ALLOW = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen';

export const ProxyStrategy: React.FC<ProxyStrategyProps> = ({
  proxyUrl,
  title,
  onLoad,
  onError,
  onOpenExternal,
  onRetry,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleLoad = useCallback(() => {
    let loadedTitle: string | undefined;
    try {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentDocument) {
        loadedTitle = iframe.contentDocument.title;
      }
    } catch {
      // cross-origin
    }
    onLoad(loadedTitle);
  }, [onLoad]);

  return (
    <div className="relative w-full h-full bg-white">
      {/* Banner informativo */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-amber-400 text-sm">
          <AlertTriangle className="w-4 h-4" />
          <span>
            Modo proxy ativo. Alguns sites podem não carregar perfeitamente.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRetry}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Tentar iframe direto
          </button>
          <button
            onClick={onOpenExternal}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Abrir externo
          </button>
        </div>
      </div>

      <iframe
        ref={iframeRef}
        src={proxyUrl}
        title={title || 'Browser Proxy'}
        sandbox={SANDBOX}
        allow={ALLOW}
        onLoad={handleLoad}
        onError={onError}
        className="w-full h-full border-0 pt-12"
        style={{ backgroundColor: 'white' }}
      />
    </div>
  );
};
