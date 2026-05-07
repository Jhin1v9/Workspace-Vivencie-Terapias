/**
 * 📝 NotaCard — Card individual de nota (redesign v2)
 */

import React, { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Star,
  Archive,
  Pin,
  Trash2,
  Edit3,
  Clock,
  Tag,
} from 'lucide-react';
import type { Nota } from './types/notas.types';
import { getCorConfig } from './utils/cores';
import { gerarPreview, formatarDataRelativa } from './utils/formatters';

interface NotaCardProps {
  nota: Nota;
  selecionada: boolean;
  viewMode: 'grid' | 'list';
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFavorito: () => void;
  onToggleArquivar: () => void;
  'data-testid'?: string;
}

export const NotaCard: React.FC<NotaCardProps> = ({
  nota,
  selecionada,
  viewMode,
  onClick,
  onEdit,
  onDelete,
  onToggleFavorito,
  onToggleArquivar,
  'data-testid': dataTestId,
}) => {
  const preview = useMemo(() => gerarPreview(nota.conteudo, 140), [nota.conteudo]);
  const dataFormatada = useMemo(() => formatarDataRelativa(nota.updatedAt), [nota.updatedAt]);
  const corConfig = useMemo(() => getCorConfig(nota.cor), [nota.cor]);

  const handleEditClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  }, [onEdit]);

  const handleDeleteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  }, [onDelete]);

  const handleFavoritoClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorito();
  }, [onToggleFavorito]);

  const handleArquivarClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleArquivar();
  }, [onToggleArquivar]);

  const isGrid = viewMode === 'grid';

  return (
    <motion.div
      layout
      data-testid={dataTestId}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={`
        group relative rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden
        ${isGrid ? 'flex flex-col' : 'flex items-start gap-4'}
        ${selecionada
          ? 'ring-2 ring-auris-sage ring-offset-2 ring-offset-auris-bg bg-white/10 border-auris-sage/40'
          : 'bg-white/5 border-white/10 hover:bg-white/[0.07] hover:border-white/20 hover:shadow-glass'
        }
      `}
    >
      {/* Barra de cor no topo (grid) ou à esquerda (list) */}
      <div
        className={`
          ${corConfig.indicator}
          ${isGrid ? 'h-1.5 w-full' : 'w-1.5 self-stretch rounded-l-2xl'}
        `}
      />

      {/* Conteúdo */}
      <div className={`flex-1 min-w-0 ${isGrid ? 'p-4' : 'py-4 pr-4'}`}>
        {/* Header do card */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className={`font-semibold text-white pr-2 ${isGrid ? 'line-clamp-2' : 'line-clamp-1'}`}>
            {nota.titulo || 'Sem título'}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            {nota.fixada && (
              <Pin className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />
            )}
            {nota.favorito && (
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            )}
            {nota.arquivada && (
              <Archive className="w-3.5 h-3.5 text-white/50" />
            )}
          </div>
        </div>

        {/* Preview */}
        {preview && (
          <p className={`text-sm text-white/60 mb-3 ${isGrid ? 'line-clamp-3' : 'line-clamp-1'}`}>
            {preview}
          </p>
        )}

        {/* Tags */}
        {nota.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {nota.tags.slice(0, isGrid ? 3 : 6).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] rounded-full bg-white/10 text-white/80 border border-white/5"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
            {nota.tags.length > (isGrid ? 3 : 6) && (
              <span className="px-2 py-0.5 text-[11px] rounded-full bg-white/10 text-white/50 border border-white/5">
                +{nota.tags.length - (isGrid ? 3 : 6)}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-white/40">
            <Clock className="w-3 h-3" />
            {dataFormatada}
          </div>
        </div>
      </div>

      {/* Ações rápidas — hover no desktop, sempre visíveis em mobile */}
      <div
        className={`
          flex items-center gap-1
          ${isGrid ? 'absolute bottom-3 right-3' : 'self-center pr-4'}
          md:opacity-0 md:group-hover:opacity-100
          transition-opacity duration-200
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleFavoritoClick}
          className={`p-1.5 rounded-lg transition-colors ${
            nota.favorito
              ? 'text-amber-400 bg-amber-400/15'
              : 'text-white/50 hover:text-amber-400 hover:bg-white/10'
          }`}
          title={nota.favorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Star className={`w-4 h-4 ${nota.favorito ? 'fill-current' : ''}`} />
        </button>

        <button
          onClick={handleArquivarClick}
          className={`p-1.5 rounded-lg transition-colors ${
            nota.arquivada
              ? 'text-white/80 bg-white/15'
              : 'text-white/50 hover:text-white hover:bg-white/10'
          }`}
          title={nota.arquivada ? 'Desarquivar' : 'Arquivar'}
        >
          <Archive className="w-4 h-4" />
        </button>

        <button
          onClick={handleEditClick}
          className="p-1.5 rounded-lg text-white/50 hover:text-auris-sage hover:bg-auris-sage/10 transition-colors"
          title="Editar"
        >
          <Edit3 className="w-4 h-4" />
        </button>

        <button
          onClick={handleDeleteClick}
          className="p-1.5 rounded-lg text-white/50 hover:text-auris-rose hover:bg-auris-rose/10 transition-colors"
          title="Excluir"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};
