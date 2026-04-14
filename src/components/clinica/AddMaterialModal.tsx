import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Globe, Upload, Tag, BookOpen, Link2 } from 'lucide-react';
import { savePdf } from '@/lib/knowledgeHub/pdfStorage';
import { useKnowledgeHubStore } from '@/stores/useKnowledgeHubStore';
import { v4 as uuidv4 } from 'uuid';

interface AddMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const categoriasPadrao = [
  'Meus PDFs',
  'Manuais Oficiais',
  'Protocolos',
  'Atlas e Mapas',
  'Artigos Científicos',
  'Saúde Mental',
  'Reiki',
  'Vídeo Aulas',
  'Áudios Terapêuticos',
  'Frequências',
  'Outros',
];

export const AddMaterialModal: React.FC<AddMaterialModalProps> = ({ isOpen, onClose }) => {
  const [aba, setAba] = useState<'pdf' | 'site'>('pdf');
  const { addMaterial } = useKnowledgeHubStore();

  // PDF states
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [tituloPdf, setTituloPdf] = useState('');
  const [descricaoPdf, setDescricaoPdf] = useState('');
  const [categoriaPdf, setCategoriaPdf] = useState('Meus PDFs');
  const [tagsPdf, setTagsPdf] = useState('');
  const [isSavingPdf, setIsSavingPdf] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Site states
  const [tituloSite, setTituloSite] = useState('');
  const [urlSite, setUrlSite] = useState('');
  const [descricaoSite, setDescricaoSite] = useState('');
  const [categoriaSite, setCategoriaSite] = useState('Artigos Científicos');
  const [tagsSite, setTagsSite] = useState('');
  const [isSavingSite, setIsSavingSite] = useState(false);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setArquivo(file);
      if (!tituloPdf) {
        setTituloPdf(file.name.replace(/\.pdf$/i, ''));
      }
    }
  }, [tituloPdf]);

  const handleSalvarPdf = useCallback(async () => {
    if (!arquivo || !tituloPdf.trim()) return;
    setIsSavingPdf(true);
    try {
      const buffer = await arquivo.arrayBuffer();
      const blobKey = `pdf-${uuidv4()}`;
      await savePdf(blobKey, buffer);

      addMaterial({
        titulo: tituloPdf.trim(),
        descricao: descricaoPdf.trim() || `PDF importado pelo usuário`,
        tipo: 'pdf',
        url: '', // será substituído por blob URL na hora de visualizar
        categoria: categoriaPdf,
        autor: 'Usuário',
        tags: tagsPdf.split(',').map((t) => t.trim()).filter(Boolean),
        pdfBlobKey: blobKey,
      });

      resetPdf();
      onClose();
    } finally {
      setIsSavingPdf(false);
    }
  }, [arquivo, tituloPdf, descricaoPdf, categoriaPdf, tagsPdf, addMaterial, onClose]);

  const handleSalvarSite = useCallback(() => {
    if (!tituloSite.trim() || !urlSite.trim()) return;
    setIsSavingSite(true);
    try {
      const isPdfUrl = urlSite.trim().toLowerCase().endsWith('.pdf');
      addMaterial({
        titulo: tituloSite.trim(),
        descricao: descricaoSite.trim() || 'Link adicionado pelo usuário',
        tipo: isPdfUrl ? 'pdf' : 'artigo',
        url: urlSite.trim(),
        categoria: categoriaSite,
        autor: 'Usuário',
        tags: tagsSite.split(',').map((t) => t.trim()).filter(Boolean),
      });
      resetSite();
      onClose();
    } finally {
      setIsSavingSite(false);
    }
  }, [tituloSite, urlSite, descricaoSite, categoriaSite, tagsSite, addMaterial, onClose]);

  const resetPdf = () => {
    setArquivo(null);
    setTituloPdf('');
    setDescricaoPdf('');
    setCategoriaPdf('Meus PDFs');
    setTagsPdf('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const resetSite = () => {
    setTituloSite('');
    setUrlSite('');
    setDescricaoSite('');
    setCategoriaSite('Artigos Científicos');
    setTagsSite('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-slate-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/50">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-auris-amber" />
                Adicionar Material
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10">
              <button
                onClick={() => setAba('pdf')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                  aba === 'pdf'
                    ? 'bg-white/10 text-white border-b-2 border-auris-amber'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <FileText className="w-4 h-4" />
                Importar PDF
              </button>
              <button
                onClick={() => setAba('site')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                  aba === 'site'
                    ? 'bg-white/10 text-white border-b-2 border-auris-amber'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Globe className="w-4 h-4" />
                Adicionar Site
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto">
              {aba === 'pdf' ? (
                <div className="space-y-4">
                  {/* Drop area */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                      arquivo
                        ? 'border-auris-amber bg-auris-amber/10'
                        : 'border-white/20 hover:border-white/40 hover:bg-white/5'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Upload className={`w-8 h-8 mx-auto mb-2 ${arquivo ? 'text-auris-amber' : 'text-slate-400'}`} />
                    <p className="text-sm text-white font-medium">
                      {arquivo ? arquivo.name : 'Clique para selecionar um PDF'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {arquivo ? `${(arquivo.size / 1024 / 1024).toFixed(2)} MB` : 'Apenas arquivos .pdf'}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5 block">
                      Título
                    </label>
                    <input
                      type="text"
                      value={tituloPdf}
                      onChange={(e) => setTituloPdf(e.target.value)}
                      placeholder="Título do documento"
                      className="w-full px-4 py-2.5 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-auris-amber/50"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5 block">
                      Categoria
                    </label>
                    <select
                      value={categoriaPdf}
                      onChange={(e) => setCategoriaPdf(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-auris-amber/50"
                    >
                      {categoriasPadrao.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5 block">
                      Descrição (opcional)
                    </label>
                    <textarea
                      value={descricaoPdf}
                      onChange={(e) => setDescricaoPdf(e.target.value)}
                      placeholder="Breve descrição do conteúdo..."
                      rows={3}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-auris-amber/50 resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5 block flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      Tags (separadas por vírgula)
                    </label>
                    <input
                      type="text"
                      value={tagsPdf}
                      onChange={(e) => setTagsPdf(e.target.value)}
                      placeholder="ex: ansiedade, protocolo, SUS"
                      className="w-full px-4 py-2.5 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-auris-amber/50"
                    />
                  </div>

                  <button
                    onClick={handleSalvarPdf}
                    disabled={!arquivo || !tituloPdf.trim() || isSavingPdf}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-auris-amber hover:bg-auris-amber/90 text-slate-900 font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSavingPdf ? (
                      <>
                        <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Importar PDF
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5 block">
                      Título *
                    </label>
                    <input
                      type="text"
                      value={tituloSite}
                      onChange={(e) => setTituloSite(e.target.value)}
                      placeholder="Título do site ou artigo"
                      className="w-full px-4 py-2.5 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-auris-amber/50"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5 block flex items-center gap-1">
                      <Link2 className="w-3 h-3" />
                      URL *
                    </label>
                    <input
                      type="url"
                      value={urlSite}
                      onChange={(e) => setUrlSite(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-4 py-2.5 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-auris-amber/50"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      URLs terminadas em .pdf serão tratadas como PDFs.
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5 block">
                      Categoria
                    </label>
                    <select
                      value={categoriaSite}
                      onChange={(e) => setCategoriaSite(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-auris-amber/50"
                    >
                      {categoriasPadrao.filter(c => c !== 'Meus PDFs').map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5 block">
                      Descrição (opcional)
                    </label>
                    <textarea
                      value={descricaoSite}
                      onChange={(e) => setDescricaoSite(e.target.value)}
                      placeholder="Breve resumo do conteúdo..."
                      rows={3}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-auris-amber/50 resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5 block flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      Tags (separadas por vírgula)
                    </label>
                    <input
                      type="text"
                      value={tagsSite}
                      onChange={(e) => setTagsSite(e.target.value)}
                      placeholder="ex: pesquisa, evidências, NADA"
                      className="w-full px-4 py-2.5 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-auris-amber/50"
                    />
                  </div>

                  <button
                    onClick={handleSalvarSite}
                    disabled={!tituloSite.trim() || !urlSite.trim() || isSavingSite}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-auris-amber hover:bg-auris-amber/90 text-slate-900 font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSavingSite ? (
                      <>
                        <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Globe className="w-4 h-4" />
                        Adicionar Site
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
