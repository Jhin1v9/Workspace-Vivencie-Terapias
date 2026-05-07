/**
 * 📝 NotaEditor — Editor completo de notas com preview split-view (redesign v2)
 */

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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
  Eye,
  PenLine,
  Clock,
} from 'lucide-react';
import type { Nota, NotaCor } from './types/notas.types';
import { coresList, getCorConfig } from './utils/cores';
import { validarNota, gerarTituloPadrao } from './utils/formatters';
import { useNotasStore } from '@/stores/useNotasStore';

interface NotaEditorProps {
  nota: Nota | null;
  onClose: () => void;
}

/** Renderização simples de markdown para preview */
function renderMarkdown(text: string): string {
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Code blocks
  html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-black/30 rounded-lg p-3 my-2 overflow-x-auto text-sm font-mono text-white/90"><code>$1</code></pre>');
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono text-auris-sage">$1</code>');
  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-white mt-4 mb-2">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-white mt-5 mb-2">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-white mt-6 mb-3">$1</h1>');
  // Bold / Italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em class="text-white/90">$1</em>');
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer" class="text-auris-sage hover:underline">$1</a>');
  // Lists
  html = html.replace(/^- \[ \] (.*$)/gim, '<li class="flex items-start gap-2"><span class="mt-1 w-3.5 h-3.5 rounded border border-white/30 inline-block"></span><span>$1</span></li>');
  html = html.replace(/^- \[x\] (.*$)/gim, '<li class="flex items-start gap-2"><span class="mt-1 w-3.5 h-3.5 rounded border border-auris-sage bg-auris-sage inline-flex items-center justify-center text-[8px] text-slate-900 font-bold">✓</span><span>$1</span></li>');
  html = html.replace(/^- (.*$)/gim, '<li class="flex items-start gap-2"><span class="mt-2.5 w-1 h-1 rounded-full bg-white/50"></span><span>$1</span></li>');
  // Blockquote
  html = html.replace(/^&gt; (.*$)/gim, '<blockquote class="border-l-2 border-auris-sage/50 pl-3 my-2 text-white/70 italic">$1</blockquote>');
  // Horizontal rule
  html = html.replace(/^---$/gim, '<hr class="border-white/10 my-4" />');
  // Paragraphs
  html = html.replace(/\n\n/g, '</p><p class="text-white/80 leading-relaxed mb-2">');

  return '<p class="text-white/80 leading-relaxed mb-2">' + html + '</p>';
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
  const [draftId, setDraftId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isNew = !nota;

  // Carregar dados da nota
  useEffect(() => {
    if (nota) {
      setTitulo(nota.titulo);
      setConteudo(nota.conteudo);
      setCor(nota.cor);
      setTags(nota.tags);
      setDraftId(nota.id);
    } else {
      setTitulo(gerarTituloPadrao());
      setConteudo('');
      setCor('default');
      setTags([]);
      setDraftId(null);
    }
    setLastSaved(null);
  }, [nota]);

  // Auto-save
  useEffect(() => {
    const timer = setTimeout(() => {
      if (titulo.trim() || conteudo.trim()) {
        handleSave(true);
      }
    }, 2500);

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
      } else if (draftId) {
        atualizarNota(draftId, dados);
      } else {
        const id = criarNota(dados);
        setDraftId(id);
      }

      setLastSaved(new Date());

      if (!silent) {
        onClose();
      }
    } finally {
      setSaving(false);
    }
  }, [titulo, conteudo, cor, tags, nota, draftId, criarNota, atualizarNota, onClose]);

  const handleDelete = useCallback(() => {
    const targetId = nota?.id || draftId;
    if (targetId && confirm('Tem certeza que deseja excluir esta nota?')) {
      excluirNota(targetId);
      onClose();
    }
  }, [nota, draftId, excluirNota, onClose]);

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

  const previewHtml = useMemo(() => renderMarkdown(conteudo), [conteudo]);
  const targetNota = nota || (draftId ? { id: draftId, favorito: false, fixada: false, arquivada: false } as Nota : null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-6xl max-h-[92vh] bg-auris-bg/95 rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full ${getCorConfig(cor).indicator}`} />
            <span className="text-sm text-white/60">
              {isNew ? 'Nova nota' : 'Editando nota'}
            </span>
            {lastSaved && (
              <span className="text-xs text-white/40 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Salvo {lastSaved.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {targetNota && (
              <>
                <button
                  onClick={() => toggleFavorito(targetNota.id)}
                  className={`p-2 rounded-xl transition-colors ${
                    targetNota.favorito
                      ? 'text-amber-400 bg-amber-400/15'
                      : 'text-white/40 hover:text-amber-400 hover:bg-white/5'
                  }`}
                  title="Favorito"
                >
                  <Star className={`w-5 h-5 ${targetNota.favorito ? 'fill-current' : ''}`} />
                </button>

                <button
                  onClick={() => toggleFixar(targetNota.id)}
                  className={`p-2 rounded-xl transition-colors ${
                    targetNota.fixada
                      ? 'text-indigo-400 bg-indigo-400/15'
                      : 'text-white/40 hover:text-indigo-400 hover:bg-white/5'
                  }`}
                  title="Fixar"
                >
                  <Pin className={`w-5 h-5 ${targetNota.fixada ? 'fill-current' : ''}`} />
                </button>

                <button
                  onClick={() => toggleArquivar(targetNota.id)}
                  className={`p-2 rounded-xl transition-colors ${
                    targetNota.arquivada
                      ? 'text-white/80 bg-white/15'
                      : 'text-white/40 hover:text-white hover:bg-white/5'
                  }`}
                  title="Arquivar"
                >
                  <Archive className="w-5 h-5" />
                </button>

                <div className="w-px h-6 bg-white/10 mx-1" />

                <button
                  onClick={handleDelete}
                  className="p-2 rounded-xl text-white/40 hover:text-auris-rose hover:bg-auris-rose/10 transition-colors"
                  title="Excluir"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1 px-5 py-2 border-b border-white/10 bg-white/[0.02] overflow-x-auto">
          <button
            onClick={() => insertMarkdown('**', '**')}
            className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
            title="Negrito"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertMarkdown('*', '*')}
            className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
            title="Itálico"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertMarkdown('# ', '')}
            className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
            title="Título"
          >
            <Heading className="w-4 h-4" />
          </button>
          <div className="w-px h-5 bg-white/10 mx-1" />
          <button
            onClick={() => insertMarkdown('- ', '')}
            className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
            title="Lista"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertMarkdown('- [ ] ', '')}
            className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
            title="Checkbox"
          >
            <CheckSquare className="w-4 h-4" />
          </button>
          <div className="w-px h-5 bg-white/10 mx-1" />
          <button
            onClick={() => insertMarkdown('> ', '')}
            className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
            title="Citação"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertMarkdown('`', '`')}
            className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
            title="Código"
          >
            <Code className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertMarkdown('[', '](url)')}
            className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
            title="Link"
          >
            <Link className="w-4 h-4" />
          </button>

          <div className="flex-1" />

          {/* Toggle Preview */}
          <button
            onClick={() => setShowPreview(v => !v)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              showPreview ? 'text-auris-sage bg-auris-sage/10' : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            {showPreview ? <Eye className="w-4 h-4" /> : <PenLine className="w-4 h-4" />}
            {showPreview ? 'Preview ativo' : 'Só editor'}
          </button>

          {/* Color picker */}
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Palette className="w-4 h-4" />
              <div className={`w-4 h-4 rounded-full ${getCorConfig(cor).indicator}`} />
            </button>

            <AnimatePresence>
              {showColorPicker && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 top-full mt-2 p-3 bg-auris-bg border border-white/10 rounded-xl shadow-2xl z-20"
                >
                  <div className="grid grid-cols-3 gap-2">
                    {coresList.map((c) => (
                      <button
                        key={c}
                        onClick={() => { setCor(c); setShowColorPicker(false); }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                          cor === c ? 'bg-white/10' : 'hover:bg-white/5'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full ${getCorConfig(c).indicator}`} />
                        <span className="text-xs text-white/70">{getCorConfig(c).nome}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Content split view */}
        <div className="flex-1 overflow-hidden flex">
          {/* Editor */}
          <div className={`flex flex-col min-w-0 ${showPreview ? 'flex-1 border-r border-white/10' : 'flex-1'}`}>
            <div className="p-5 space-y-4 overflow-y-auto scrollbar-thin flex-1">
              {/* Título */}
              <input
                data-testid="nota-editor-titulo"
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Título da nota..."
                className="w-full text-2xl font-bold bg-transparent border-none outline-none placeholder:text-white/20 text-white"
              />

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2">
                <Tag className="w-4 h-4 text-white/30" />
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-sm rounded-full bg-white/10 text-white/80 border border-white/5"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-white"
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
                  className="px-2 py-1 text-sm bg-transparent border-none outline-none placeholder:text-white/30 text-white/70"
                />
              </div>

              {/* Textarea */}
              <textarea
                data-testid="nota-editor-conteudo"
                ref={textareaRef}
                value={conteudo}
                onChange={(e) => setConteudo(e.target.value)}
                placeholder="Comece a escrever em markdown..."
                className="w-full h-full min-h-[280px] resize-none bg-transparent border-none outline-none placeholder:text-white/20 text-white/90 leading-relaxed"
              />
            </div>
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="flex-1 min-w-0 bg-white/[0.02]">
              <div className="px-5 py-3 border-b border-white/10 bg-white/[0.02] flex items-center gap-2">
                <Eye className="w-4 h-4 text-white/40" />
                <span className="text-sm text-white/50">Preview</span>
              </div>
              <div
                className="p-5 overflow-y-auto scrollbar-thin h-[calc(100%-44px)] prose prose-invert prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-white/10 bg-white/[0.02]">
          <div className="text-sm text-white/40">
            {conteudo.length} caracteres
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-white/50 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <motion.button
              data-testid="nota-editor-salvar"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation();
                handleSave(false);
              }}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 bg-auris-sage hover:bg-auris-sage-dark text-slate-900 text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Salvar
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
