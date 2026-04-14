/**
 * 📝 NotasApp
 * Aplicativo completo de notas do Auris OS
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

  // Criar nota de exemplo se não houver nenhuma
  useEffect(() => {
    if (notas.length === 0) {
      criarNota({
        titulo: '📝 Bem-vindo ao Notas!',
        conteudo: `Este é o seu novo aplicativo de notas integrado ao Auris OS.

## Funcionalidades:

- **Criar notas** rapidamente
- **Organizar** por cores e tags
- **Favoritar** notas importantes
- **Arquivar** notas antigas
- **Busca** full-text em tempo real
- **Editor markdown** com formatação

Comece criando sua primeira nota clicando no botão "Nova Nota"!

---
*Dica: Use tags para organizar suas anotações por paciente ou tema.*`,
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
    <div className="h-full w-full bg-slate-950 flex overflow-hidden">
      {/* Sidebar */}
      <NotaSidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/30">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <StickyNote className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Notas</h1>
                <p className="text-xs text-slate-400">
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
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={config.busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar notas..."
                className="w-64 pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 transition-colors"
              />
              {config.busca && (
                <button
                  onClick={() => setBusca('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  ×
                </button>
              )}
            </div>

            <button
              onClick={handleCriarNota}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-lg transition-all hover:shadow-lg hover:shadow-indigo-500/25"
            >
              <Plus className="w-4 h-4" />
              Nova Nota
            </button>
          </div>
        </div>

        {/* Lista de notas */}
        <div className="flex-1 overflow-y-auto p-6">
          {notasFiltradas.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
                <FileText className="w-12 h-12 text-slate-600" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                {config.busca ? 'Nenhuma nota encontrada' : 'Nenhuma nota ainda'}
              </h3>
              <p className="text-sm text-slate-400 max-w-sm mb-6">
                {config.busca 
                  ? 'Tente buscar com outros termos ou limpe a busca'
                  : 'Crie sua primeira nota para começar a organizar suas ideias'}
              </p>
              {!config.busca && (
                <button
                  onClick={handleCriarNota}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-500/25"
                >
                  <Plus className="w-5 h-5" />
                  Criar Primeira Nota
                </button>
              )}
            </div>
          ) : (
            <motion.div
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
