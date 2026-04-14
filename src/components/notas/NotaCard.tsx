/**
 * 📝 NotaCard
 * Card individual de nota com preview e ações
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
  Tag
} from 'lucide-react';
import type { Nota } from './types/notas.types';
import { getNotaCardClasses, getCorIndicatorClasses } from './utils/cores';
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
}) => {
  const preview = useMemo(() => gerarPreview(nota.conteudo, 120), [nota.conteudo]);
  const dataFormatada = useMemo(() => formatarDataRelativa(nota.updatedAt), [nota.updatedAt]);
  
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      className={getNotaCardClasses(nota.cor, selecionada) + (isGrid ? '' : ' flex gap-4 items-start')}
    >
      {/* Indicadores de status */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5">
        {nota.fixada && (
          <Pin className="w-4 h-4 text-indigo-400 fill-indigo-400" />
        )}
        {nota.favorito && (
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
        )}
        {nota.arquivada && (
          <Archive className="w-4 h-4 text-slate-400" />
        )}
      </div>

      {/* Indicador de cor */}
      <div className={`absolute top-3 left-3 ${getCorIndicatorClasses(nota.cor)}`} />

      {/* Conteúdo */}
      <div className={`${isGrid ? 'mt-6' : 'mt-0 flex-1'} ${isGrid ? '' : 'ml-6'}`}>
        {/* Título */}
        <h3 className="font-semibold text-base mb-2 pr-16 line-clamp-2">
          {nota.titulo || 'Sem título'}
        </h3>

        {/* Preview */}
        {isGrid && preview && (
          <p className="text-sm opacity-70 line-clamp-3 mb-3">
            {preview}
          </p>
        )}

        {/* Tags */}
        {nota.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {nota.tags.slice(0, isGrid ? 3 : 5).map((tag) => (
              <span 
                key={tag} 
                className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-white/10 text-white/80"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
            {nota.tags.length > (isGrid ? 3 : 5) && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-white/10 text-white/60">
                +{nota.tags.length - (isGrid ? 3 : 5)}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs opacity-50">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {dataFormatada}
          </div>
        </div>
      </div>

      {/* Ações (aparecem no hover) */}
      <div 
        className={`
          absolute ${isGrid ? 'bottom-3 right-3' : 'top-3 right-3'}
          flex items-center gap-1
          opacity-0 group-hover:opacity-100
          transition-opacity
          bg-slate-950/80 backdrop-blur-sm rounded-lg p-1
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleFavoritoClick}
          className={`p-1.5 rounded-md transition-colors ${
            nota.favorito 
              ? 'text-amber-400 hover:bg-amber-400/20' 
              : 'text-slate-400 hover:text-amber-400 hover:bg-slate-800'
          }`}
          title={nota.favorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Star className={`w-4 h-4 ${nota.favorito ? 'fill-current' : ''}`} />
        </button>
        
        <button
          onClick={handleArquivarClick}
          className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          title={nota.arquivada ? 'Desarquivar' : 'Arquivar'}
        >
          <Archive className="w-4 h-4" />
        </button>
        
        <button
          onClick={handleEditClick}
          className="p-1.5 rounded-md text-slate-400 hover:text-indigo-400 hover:bg-indigo-400/20 transition-colors"
          title="Editar"
        >
          <Edit3 className="w-4 h-4" />
        </button>
        
        <button
          onClick={handleDeleteClick}
          className="p-1.5 rounded-md text-slate-400 hover:text-red-400 hover:bg-red-400/20 transition-colors"
          title="Excluir"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};
