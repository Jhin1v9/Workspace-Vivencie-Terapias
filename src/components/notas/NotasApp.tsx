/**
 * 📝 NotasApp — Aplicativo de notas do Auris OS (redesign v2)
 * Visual glassmorphism consistente com o tema Auris.
 */

import React, { useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  FileText,
  StickyNote,
} from 'lucide-react';
import { useNotasStore } from '@/stores/useNotasStore';
import { NotaSidebar } from './NotaSidebar';
import { NotaCard } from './NotaCard';
import { NotaEditor } from './NotaEditor';

export const NotasApp: React.FC = () => {
  const {
    notas,
    notasFiltradas,
    notaSelecionadaId,
    editorAberto,
    config,
    criarNota,
    selecionarNota,
    excluirNota,
    toggleFavorito,
    toggleArquivar,
    abrirEditor,
    fecharEditor,
    setBusca,
  } = useNotasStore();

  const notaSelecionada = useMemo(() =>
    notas.find(n => n.id === notaSelecionadaId) || null,
    [notas, notaSelecionadaId]
  );

  // Criar nota de boas-vindas se não houver nenhuma
  useEffect(() => {
    if (notas.length === 0) {
      criarNota({
        titulo: '📝 Bem-vindo ao Notas!',
        conteudo: `Este é o seu aplicativo de notas integrado ao Auris OS.

## Funcionalidades

- **Criar notas** rapidamente
- **Organizar** por cores e tags
- **Favoritar** notas importantes
- **Arquivar** notas antigas
- **Busca** full-text em tempo real
- **Editor markdown** com formatação

Comece criando sua primeira nota clicando no botão "Nova Nota"!`,
        cor: 'blue',
        tags: ['tutorial', 'auris-os'],
      });
    }
  }, [notas.length, criarNota]);

  const handleCriarNota = () => {
    abrirEditor();
  };

  const handleEditarNota = (id: string) => {
    selecionarNota(id);
    abrirEditor(id);
  };

  const handleExcluirNota = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta nota?')) {
      excluirNota(id);
    }
  };

  const isGrid = config.viewMode === 'grid';

  return (
    <div className="h-full w-full bg-auris-bg/95 flex overflow-hidden">
      {/* Sidebar */}
      <NotaSidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <StickyNote className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Notas</h1>
                <p className="text-xs text-white/60">
                  {notasFiltradas.length} nota{notasFiltradas.length !== 1 ? 's' : ''}
                  {config.busca && ` para "${config.busca}"`}
                  {config.tagSelecionada && ` com tag "${config.tagSelecionada}"`}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                data-testid="notas-busca-input"
                type="text"
                value={config.busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar notas..."
                className="w-56 pl-10 pr-8 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/40 outline-none focus:border-auris-sage/50 focus:bg-white/10 transition-colors"
              />
              {config.busca && (
                <button
                  onClick={() => setBusca('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                >
                  ×
                </button>
              )}
            </div>

            <motion.button
              data-testid="notas-nova-nota-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCriarNota}
              className="flex items-center gap-2 px-4 py-2 bg-auris-sage hover:bg-auris-sage-dark text-slate-900 text-sm font-semibold rounded-xl transition-all shadow-lg shadow-auris-sage/20"
            >
              <Plus className="w-4 h-4" />
              Nova Nota
            </motion.button>
          </div>
        </div>

        {/* Lista de notas */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          {notasFiltradas.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                <FileText className="w-12 h-12 text-white/30" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                {config.busca ? 'Nenhuma nota encontrada' : 'Nenhuma nota ainda'}
              </h3>
              <p className="text-sm text-white/50 max-w-sm mb-6">
                {config.busca
                  ? 'Tente buscar com outros termos ou limpe a busca'
                  : 'Crie sua primeira nota para começar a organizar suas ideias'}
              </p>
              {!config.busca && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCriarNota}
                  className="flex items-center gap-2 px-6 py-3 bg-auris-sage hover:bg-auris-sage-dark text-slate-900 font-semibold rounded-xl transition-all shadow-lg shadow-auris-sage/20"
                >
                  <Plus className="w-5 h-5" />
                  Criar Primeira Nota
                </motion.button>
              )}
            </div>
          ) : (
            <motion.div
              data-testid="notas-grid"
              layout
              className={isGrid
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                : 'flex flex-col gap-3'
              }
            >
              <AnimatePresence mode="popLayout">
                {notasFiltradas.map((nota) => (
                  <NotaCard
                    key={nota.id}
                    data-testid={`nota-card-${nota.id}`}
                    nota={nota}
                    selecionada={nota.id === notaSelecionadaId}
                    viewMode={config.viewMode}
                    onClick={() => selecionarNota(nota.id)}
                    onEdit={() => handleEditarNota(nota.id)}
                    onDelete={() => handleExcluirNota(nota.id)}
                    onToggleFavorito={() => toggleFavorito(nota.id)}
                    onToggleArquivar={() => toggleArquivar(nota.id)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {editorAberto && (
          <NotaEditor
            nota={notaSelecionada}
            onClose={fecharEditor}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
