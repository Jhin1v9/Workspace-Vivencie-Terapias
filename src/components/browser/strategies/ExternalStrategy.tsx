/**
 * ExternalStrategy
 * Tela de transição para abertura no navegador externo
 */

import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Globe, ExternalLink, RefreshCw } from 'lucide-react';

interface ExternalStrategyProps {
  url: string;
  reason: string;
  onRetryIframe: () => void;
  onRetryProxy: () => void;
}

// Sites que funcionam bem em iframe para navegação rápida
const RECOMMENDED_SITES = [
  { url: 'https://www.wikipedia.org', name: 'Wikipedia', desc: 'Enciclopédia livre' },
  { url: 'https://www.w3schools.com', name: 'W3Schools', desc: 'Tutoriais de programação' },
  { url: 'https://developer.mozilla.org', name: 'MDN Web Docs', desc: 'Documentação web' },
  { url: 'https://medium.com', name: 'Medium', desc: 'Artigos e blogs' },
  { url: 'https://www.bbc.com', name: 'BBC News', desc: 'Notícias mundiais' },
  { url: 'https://pubmed.ncbi.nlm.nih.gov', name: 'PubMed', desc: 'Pesquisa médica' },
  { url: 'https://www.who.int', name: 'OMS', desc: 'Organização Mundial da Saúde' },
];

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export const ExternalStrategy: React.FC<ExternalStrategyProps> = ({
  url,
  reason,
  onRetryIframe,
  onRetryProxy,
}) => {
  const handleOpenExternal = useCallback(() => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [url]);

  const handleNavigateTo = useCallback((targetUrl: string) => {
    window.dispatchEvent(new CustomEvent('browser-navigate', { detail: { url: targetUrl } }));
  }, []);

  return (
    <div className="relative flex-1 bg-slate-900 overflow-hidden">
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center mb-6"
        >
          <Globe className="w-10 h-10 text-amber-400" />
        </motion.div>

        <h3 className="text-xl font-semibold text-white mb-2 text-center">
          Site com Restrições
        </h3>

        <p className="text-slate-400 text-center max-w-md mb-2">
          {extractDomain(url)} bloqueia carregamento em iframe por segurança.
        </p>

        <p className="text-slate-500 text-sm text-center max-w-md mb-6">
          {reason}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <button
            onClick={handleOpenExternal}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl transition-colors font-medium"
          >
            <ExternalLink className="w-5 h-5" />
            Abrir no Navegador Externo
          </button>

          <button
            onClick={onRetryIframe}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Tentar iframe direto
          </button>

          <button
            onClick={onRetryProxy}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Tentar via Proxy
          </button>
        </div>

        {/* Sites recomendados */}
        <div className="w-full max-w-2xl">
          <h4 className="text-sm font-medium text-slate-400 mb-4 text-center">
            Sites recomendados que funcionam no navegador interno:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {RECOMMENDED_SITES.map((site) => (
              <button
                key={site.url}
                onClick={() => handleNavigateTo(site.url)}
                className="flex items-start gap-3 p-4 bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-colors text-left group"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-500/20">
                  <Globe className="w-5 h-5 text-slate-400 group-hover:text-indigo-400" />
                </div>
                <div>
                  <p className="font-medium text-white group-hover:text-indigo-300 transition-colors">
                    {site.name}
                  </p>
                  <p className="text-xs text-slate-500">{site.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
