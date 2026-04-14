/**
 * 🔧 BrowserToolbar
 * Barra de ferramentas com navegação e URL bar
 */

import React, { useState, useCallback, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCw, 
  Home, 
  Lock,
  Search,
  Star,
  MoreVertical,
  Shield,
} from 'lucide-react';

import type { BrowserToolbarProps } from './types/browser.types';

export const BrowserToolbar: React.FC<BrowserToolbarProps> = ({
  url,
  canGoBack,
  canGoForward,
  isLoading,
  onUrlSubmit,
  onBack,
  onForward,
  onReload,
  onHome,
}) => {
  const [inputValue, setInputValue] = useState(url);
  const [isSecure, setIsSecure] = useState(false);

  // Atualizar input quando URL externa muda
  useEffect(() => {
    setInputValue(url);
    setIsSecure(url.startsWith('https://'));
  }, [url]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onUrlSubmit(inputValue.trim());
    }
  }, [inputValue, onUrlSubmit]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setInputValue(url);
    }
  }, [url]);



  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/95 border-b border-slate-700/50">
      {/* Botões de Navegação */}
      <div className="flex items-center gap-1">
        <button
          onClick={onBack}
          disabled={!canGoBack}
          className="p-2 rounded-lg transition-colors hover:bg-slate-700/50 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Voltar"
        >
          <ChevronLeft className="w-5 h-5 text-slate-300" />
        </button>
        
        <button
          onClick={onForward}
          disabled={!canGoForward}
          className="p-2 rounded-lg transition-colors hover:bg-slate-700/50 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Avançar"
        >
          <ChevronRight className="w-5 h-5 text-slate-300" />
        </button>
        
        <button
          onClick={onReload}
          disabled={isLoading}
          className="p-2 rounded-lg transition-colors hover:bg-slate-700/50 disabled:opacity-50"
          title="Recarregar"
        >
          <RotateCw className={`w-5 h-5 text-slate-300 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
        
        {onHome && (
          <button
            onClick={onHome}
            className="p-2 rounded-lg transition-colors hover:bg-slate-700/50"
            title="Página inicial"
          >
            <Home className="w-5 h-5 text-slate-300" />
          </button>
        )}
      </div>

      {/* URL Bar */}
      <form onSubmit={handleSubmit} className="flex-1 flex items-center">
        <div className="relative flex-1 flex items-center">
          {/* Ícone de segurança */}
          <div className="absolute left-3 flex items-center">
            {isSecure ? (
              <Lock className="w-4 h-4 text-emerald-400" />
            ) : (
              <Shield className="w-4 h-4 text-amber-400" />
            )}
          </div>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite uma URL ou pesquise..."
            className="w-full pl-10 pr-10 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl
                       text-slate-200 placeholder-slate-500 text-sm
                       focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50
                       transition-all"
          />

          {/* Ícone de busca */}
          <div className="absolute right-3">
            <Search className="w-4 h-4 text-slate-500" />
          </div>
        </div>
      </form>

      {/* Ações extras */}
      <div className="flex items-center gap-1">
        <button
          className="p-2 rounded-lg transition-colors hover:bg-slate-700/50"
          title="Favoritar"
        >
          <Star className="w-5 h-5 text-slate-400 hover:text-amber-400" />
        </button>
        
        <button
          className="p-2 rounded-lg transition-colors hover:bg-slate-700/50"
          title="Mais opções"
        >
          <MoreVertical className="w-5 h-5 text-slate-400" />
        </button>
      </div>
    </div>
  );
};
