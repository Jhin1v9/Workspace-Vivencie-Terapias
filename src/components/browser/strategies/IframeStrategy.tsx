/**
 * IframeStrategy
 * Renderização via iframe nativo — estratégia primária
 */

import React, { useRef, useCallback } from 'react';

interface IframeStrategyProps {
  url: string;
  title?: string;
  onLoad: (title?: string) => void;
  onError: () => void;
}

const SANDBOX = 'allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms allow-downloads allow-pointer-lock allow-orientation-lock';
const ALLOW = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen; microphone; camera';

export const IframeStrategy: React.FC<IframeStrategyProps> = ({
  url,
  title,
  onLoad,
  onError,
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
      // cross-origin silencioso
    }
    onLoad(loadedTitle);
  }, [onLoad]);

  return (
    <iframe
      ref={iframeRef}
      src={url}
      title={title || 'Browser'}
      sandbox={SANDBOX}
      allow={ALLOW}
      onLoad={handleLoad}
      onError={onError}
      className="w-full h-full border-0"
      style={{ backgroundColor: 'white' }}
    />
  );
};
