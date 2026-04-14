/**
 * 📝 NotaEditor
 * Editor completo de notas com markdown
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Save,
  Palette,
  Tag,
  Bold,
  Italic,
  List,
  CheckSquare,
  Quote,
  Code,
  Link,
  Heading,
  Trash2,
  Archive,
  Pin,
  Star,
} from 'lucide-react';
import type { Nota, NotaCor } from './types/notas.types';
import { coresList, getCorConfig } from './utils/cores';
import { validarNota, gerarTituloPadrao } from './utils/formatters';
import { useNotasStore } from '@/stores/useNotasStore';

interface NotaEditorProps {
  nota: Nota | null;
  onClose: () => void;
}

export const NotaEditor: React.FC<NotaEditorProps> = ({ nota, onClose }) => {
  const { criarNota, atualizarNota, excluirNota, toggleFavorito, toggleArquivar, toggleFixar } = useNotasStore();
  
  // Estados locais
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [cor, setCor] = useState<NotaCor>('default');
  const [tags, setTags] = useState<string[]>([]);
  const [novaTag, setNovaTag] = useState('');
  const [saving, setSaving] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isNew = !nota;
  
  // Carregar dados da nota
  useEffect(() => {
    if (nota) {
      setTitulo(nota.titulo);
      setConteudo(nota.conteudo);
      setCor(nota.cor);
      setTags(nota.tags);
    } else {
      setTitulo(gerarTituloPadrao());
      setConteudo('');
      setCor('default');
      setTags([]);
    }
  }, [nota]);
  
  // Auto-save
  useEffect(() => {
    const timer = setTimeout(() => {
      if (titulo.trim() || conteudo.trim()) {
        handleSave(true);
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [titulo, conteudo, cor, tags]);
  
  const handleSave = useCallback(async (silent: boolean = false) => {
    if (!titulo.trim() && !conteudo.trim()) return;
    
    const dados = {
      titulo: titulo.trim() || gerarTituloPadrao(),
      conteudo: conteudo.trim(),
      cor,
      tags,
    };
    
    const validacao = validarNota(dados);
    if (!validacao.valido) return;
    
    setSaving(true);
    
    try {
      if (nota) {
        atualizarNota(nota.id, dados);
      } else {
        criarNota(dados);
      }
      
      setLastSaved(new Date());
      
      if (!silent) {
        onClose();
      }
    } finally {
      setSaving(false);
    }
  }, [titulo, conteudo, cor, tags, nota, criarNota, atualizarNota, onClose]);
  
  const handleDelete = useCallback(() => {
    if (nota && confirm('Tem certeza que deseja excluir esta nota?')) {
      excluirNota(nota.id);
      onClose();
    }
  }, [nota, excluirNota, onClose]);
  
  const handleAddTag = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && novaTag.trim()) {
      e.preventDefault();
      if (!tags.includes(novaTag.trim())) {
        setTags([...tags, novaTag.trim()]);
      }
      setNovaTag('');
    }
  }, [novaTag, tags]);
  
  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  }, [tags]);
  
  const insertMarkdown = useCallback((before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = conteudo.substring(start, end);
    const newText = conteudo.substring(0, start) + before + selectedText + after + conteudo.substring(end);
    
    setConteudo(newText);
    
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }, [conteudo]);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl max-h-[90vh] bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full ${getCorConfig(cor).indicator}`} />
            <span className="text-sm text-slate-400">
              {isNew ? 'Nova nota' : 'Editando nota'}
            </span>
            {lastSaved && (
              <span className="text-xs text-slate-500">
                Salvo {lastSaved.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {nota && (
              <>
                <button
                  onClick={() => toggleFavorito(nota.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    nota.favorito 
                      ? 'text-amber-400 bg-amber-400/20' 
                      : 'text-slate-400 hover:text-amber-400 hover:bg-slate-800'
                  }`}
                  title="Favorito"
                >
                  <Star className={`w-5 h-5 ${nota.favorito ? 'fill-current' : ''}`} />
                </button>
                
                <button
                  onClick={() => toggleFixar(nota.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    nota.fixada 
                      ? 'text-indigo-400 bg-indigo-400/20' 
                      : 'text-slate-400 hover:text-indigo-400 hover:bg-slate-800'
                  }`}
                  title="Fixar"
                >
                  <Pin className={`w-5 h-5 ${nota.fixada ? 'fill-current' : ''}`} />
                </button>
                
                <button
                  onClick={() => toggleArquivar(nota.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    nota.arquivada 
                      ? 'text-slate-300 bg-slate-700' 
                      : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800'
                  }`}
                  title="Arquivar"
                >
                  <Archive className="w-5 h-5" />
                </button>
                
                <div className="w-px h-6 bg-slate-700 mx-2" />
                
                <button
                  onClick={handleDelete}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/20 transition-colors"
                  title="Excluir"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </>
            )}
            
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar de formatação */}
        <div className="flex items-center gap-1 px-6 py-2 border-b border-slate-800 bg-slate-900/30 overflow-x-auto">
          <button
            onClick={() => insertMarkdown('**', '**')}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Negrito"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertMarkdown('*', '*')}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Itálico"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertMarkdown('# ', '')}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Título"
          >
            <Heading className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-slate-700 mx-1" />
          <button
            onClick={() => insertMarkdown('- ', '')}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Lista"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertMarkdown('- [ ] ', '')}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Checkbox"
          >
            <CheckSquare className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-slate-700 mx-1" />
          <button
            onClick={() => insertMarkdown('> ', '')}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Citação"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertMarkdown('`', '`')}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Código"
          >
            <Code className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertMarkdown('[', '](url)')}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Link"
          >
            <Link className="w-4 h-4" />
          </button>
          
          <div className="flex-1" />
          
          {/* Color picker */}
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Palette className="w-4 h-4" />
              <div className={`w-4 h-4 rounded-full ${getCorConfig(cor).indicator}`} />
            </button>
            
            <AnimatePresence>
              {showColorPicker && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-2 p-3 bg-slate-800 rounded-xl border border-slate-700 shadow-xl z-10"
                >
                  <div className="grid grid-cols-3 gap-2">
                    {coresList.map((c) => (
                      <button
                        key={c}
                        onClick={() => { setCor(c); setShowColorPicker(false); }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                          cor === c ? 'bg-slate-700' : 'hover:bg-slate-700/50'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full ${getCorConfig(c).indicator}`} />
                        <span className="text-xs text-slate-300">{getCorConfig(c).nome}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Título */}
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Título da nota..."
            className="w-full text-2xl font-bold bg-transparent border-none outline-none placeholder:text-slate-600 text-white"
          />
          
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2">
            <Tag className="w-4 h-4 text-slate-500" />
            {tags.map((tag) => (
              <span 
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 text-sm rounded-full bg-indigo-500/20 text-indigo-300"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-indigo-200"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <input
              type="text"
              value={novaTag}
              onChange={(e) => setNovaTag(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="+ Adicionar tag"
              className="px-2 py-1 text-sm bg-transparent border-none outline-none placeholder:text-slate-600 text-slate-300"
            />
          </div>
          
          {/* Editor */}
          <textarea
            ref={textareaRef}
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            placeholder="Comece a escrever..."
            className="w-full h-64 resize-none bg-transparent border-none outline-none placeholder:text-slate-600 text-slate-200 leading-relaxed"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/50">
          <div className="text-sm text-slate-500">
            {conteudo.length} caracteres
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Salvar
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
