/**
 * 📝 NotaSidebar — Sidebar com filtros, tags e estatísticas (redesign v2)
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

import {
  LayoutGrid,
  List,
  Star,
  Archive,
  User,
  Tag,
  Plus,
  Pin,
} from 'lucide-react';
import { useNotasStore } from '@/stores/useNotasStore';
import { extrairTagsUnicas } from './utils/formatters';
import { getCorConfig } from './utils/cores';
import type { NotaFiltro, NotaOrdenacao } from './types/notas.types';

export const NotaSidebar: React.FC = () => {
  const {
    notas,
    estatisticas,
    config,
    setFiltro,
    setOrdenacao,
    setTagSelecionada,
    setViewMode,
    criarNota,
  } = useNotasStore();

  const tagsUnicas = useMemo(() => extrairTagsUnicas(notas), [notas]);

  const filtros: { id: NotaFiltro; label: string; icon: React.ElementType; count: number }[] = [
    { id: 'todas', label: 'Todas', icon: LayoutGrid, count: estatisticas.total - estatisticas.arquivadas },
    { id: 'favoritas', label: 'Favoritas', icon: Star, count: estatisticas.favoritas },
    { id: 'arquivadas', label: 'Arquivadas', icon: Archive, count: estatisticas.arquivadas },
    { id: 'paciente', label: 'Vinculadas', icon: User, count: notas.filter(n => n.pacienteId).length },
  ];

  return (
    <div className="w-72 h-full bg-white/[0.03] border-r border-white/10 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => criarNota()}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-auris-sage hover:bg-auris-sage-dark text-slate-900 font-semibold rounded-xl transition-all shadow-lg shadow-auris-sage/15"
        >
          <Plus className="w-5 h-5" />
          Nova Nota
        </motion.button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
        {/* View mode toggle */}
        <div className="flex items-center gap-2 p-1 bg-white/5 border border-white/10 rounded-xl">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm transition-colors ${
              config.viewMode === 'grid'
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm transition-colors ${
              config.viewMode === 'list'
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <List className="w-4 h-4" />
            Lista
          </button>
        </div>

        {/* Filtros */}
        <div>
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
            Filtros
          </h3>
          <div className="space-y-1">
            {filtros.map((filtro) => (
              <button
                key={filtro.id}
                onClick={() => setFiltro(filtro.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors ${
                  config.filtro === filtro.id
                    ? 'bg-auris-sage/15 text-auris-sage border border-auris-sage/30'
                    : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <filtro.icon className="w-4 h-4" />
                  {filtro.label}
                </div>
                <span className="text-xs text-white/30">{filtro.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Fixadas rápido */}
        {notas.some(n => n.fixada) && (
          <div>
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Pin className="w-3 h-3" />
              Fixadas
            </h3>
            <div className="space-y-1">
              {notas.filter(n => n.fixada).map((nota) => (
                <button
                  key={nota.id}
                  onClick={() => {
                    const { selecionarNota, setFiltro } = useNotasStore.getState();
                    setFiltro('todas');
                    selecionarNota(nota.id);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors truncate"
                >
                  {nota.titulo}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Ordenação */}
        <div>
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
            Ordenar por
          </h3>
          <select
            value={config.ordenacao}
            onChange={(e) => setOrdenacao(e.target.value as NotaOrdenacao)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white/80 outline-none focus:border-auris-sage/50 transition-colors"
          >
            <option value="updatedDesc">Últimas atualizadas</option>
            <option value="updatedAsc">Menos atualizadas</option>
            <option value="createdDesc">Criadas recentemente</option>
            <option value="createdAsc">Criadas antigamente</option>
            <option value="tituloAsc">Título A-Z</option>
            <option value="tituloDesc">Título Z-A</option>
          </select>
        </div>

        {/* Tags */}
        {tagsUnicas.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {tagsUnicas.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setTagSelecionada(config.tagSelecionada === tag ? null : tag)}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-full transition-colors border ${
                    config.tagSelecionada === tag
                      ? 'bg-auris-sage/20 text-auris-sage border-auris-sage/40'
                      : 'bg-white/5 text-white/60 border-white/10 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                  {estatisticas.porTag[tag] > 1 && (
                    <span className="ml-1 opacity-60">({estatisticas.porTag[tag]})</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Estatísticas */}
        <div>
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
            Estatísticas
          </h3>
          <div className="space-y-2 p-3 bg-white/5 border border-white/10 rounded-xl">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/50">Total</span>
              <span className="font-medium text-white">{estatisticas.total}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/50">Favoritas</span>
              <span className="font-medium text-amber-400">{estatisticas.favoritas}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/50">Arquivadas</span>
              <span className="font-medium text-white/70">{estatisticas.arquivadas}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/50">Tags únicas</span>
              <span className="font-medium text-indigo-400">{tagsUnicas.length}</span>
            </div>
          </div>
        </div>

        {/* Cores mais usadas */}
        {Object.keys(estatisticas.porCor).length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
              Cores mais usadas
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              {Object.entries(estatisticas.porCor)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([cor, count]) => (
                  <div
                    key={cor}
                    className="flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/10 rounded-lg"
                    title={`${getCorConfig(cor as any).nome}: ${count} notas`}
                  >
                    <div className={`w-3 h-3 rounded-full ${getCorConfig(cor as any).indicator}`} />
                    <span className="text-xs text-white/50">{count}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
