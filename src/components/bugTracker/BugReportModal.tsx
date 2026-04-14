/**
 * 📝 BugReportModal
 * Modal para criar report de bug com integração Aura Intelligence via AIAdapter
 * Sempre gera um relatório em Markdown para uso em IAs externas.
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Bug,
  Lightbulb,
  HelpCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle,
  Camera,
  Code2,
  Layers,
  Maximize2,
  Send,
  Brain,
  Sparkles,
  FileText,
  Loader2,
  Check,
  RotateCcw,
  Copy,
  Download,
  FileCode,
  Eye,
} from 'lucide-react';
import type {
  InspectedElement,
  CreateBugReportData,
  ReportType,
  SeverityLevel
} from './types/bugTracker.types';
import { aurisAIAdapter } from '@/adapters/bugTracker/AurisAIAdapter';
import { generateBugReportMarkdown, generateFixPromptMarkdown } from './utils/reportMarkdown';

interface BugReportModalProps {
  isOpen: boolean;
  element: InspectedElement | null;
  screenshotDataUrl: string | null;
  onClose: () => void;
  onSubmit: (data: CreateBugReportData) => void;
}

const reportTypes: { id: ReportType; label: string; icon: React.ElementType; color: string }[] = [
  { id: 'bug', label: 'Bug', icon: Bug, color: 'text-red-400 bg-red-400/20 border-red-400/30' },
  { id: 'improvement', label: 'Melhoria', icon: Lightbulb, color: 'text-amber-400 bg-amber-400/20 border-amber-400/30' },
  { id: 'question', label: 'Dúvida', icon: HelpCircle, color: 'text-blue-400 bg-blue-400/20 border-blue-400/30' },
];

const severityLevels: { id: SeverityLevel; label: string; icon: React.ElementType; color: string }[] = [
  { id: 'critical', label: 'Crítico', icon: AlertCircle, color: 'text-red-500' },
  { id: 'high', label: 'Alto', icon: AlertTriangle, color: 'text-orange-400' },
  { id: 'medium', label: 'Médio', icon: Info, color: 'text-yellow-400' },
  { id: 'low', label: 'Baixo', icon: CheckCircle, color: 'text-green-400' },
];

export const BugReportModal: React.FC<BugReportModalProps> = ({
  isOpen,
  element,
  screenshotDataUrl,
  onClose,
  onSubmit,
}) => {
  const [mode, setMode] = useState<'traditional' | 'ai'>('traditional');
  const [type, setType] = useState<ReportType>('bug');
  const [severity, setSeverity] = useState<SeverityLevel>('medium');
  const [description, setDescription] = useState('');
  const [expectedBehavior, setExpectedBehavior] = useState('');
  const [includeScreenshot, setIncludeScreenshot] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // AI mode states
  const [aiDraft, setAiDraft] = useState('');
  const [aiPreview, setAiPreview] = useState<{
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    markdown: string;
  } | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Markdown preview state
  const [markdownReport, setMarkdownReport] = useState('');
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const buildBaseReportData = useCallback((): {
    description: string;
    expectedBehavior?: string;
    element: InspectedElement;
    pageUrl: string;
    pageTitle: string;
    type: string;
    severity: string;
    screenshotBase64?: string | null;
  } | null => {
    if (!element) return null;
    return {
      description: description.trim(),
      expectedBehavior: expectedBehavior.trim() || undefined,
      element,
      pageUrl: window.location.href,
      pageTitle: document.title,
      type,
      severity,
      screenshotBase64: includeScreenshot ? screenshotDataUrl : null,
    };
  }, [description, expectedBehavior, element, includeScreenshot, screenshotDataUrl, type, severity]);

  const handleSubmit = useCallback(async () => {
    if (!element || !description.trim()) return;

    setIsSubmitting(true);

    const base = buildBaseReportData();
    const md = base ? generateBugReportMarkdown(base) : '';
    const fixMd = base ? generateFixPromptMarkdown(base) : '';
    const combinedMd = `${md}\n\n---\n\n${fixMd}`;

    const data: CreateBugReportData = {
      type,
      severity,
      description: description.trim(),
      expectedBehavior: expectedBehavior.trim() || undefined,
      includeScreenshot: includeScreenshot && !!screenshotDataUrl,
      element,
      markdownReport: combinedMd,
    };

    await onSubmit(data);

    // Resetar formulário
    setType('bug');
    setSeverity('medium');
    setDescription('');
    setExpectedBehavior('');
    setIncludeScreenshot(true);
    setAiDraft('');
    setAiPreview(null);
    setAiError(null);
    setMarkdownReport('');
    setShowMarkdown(false);
    setIsSubmitting(false);
  }, [type, severity, description, expectedBehavior, includeScreenshot, element, screenshotDataUrl, onSubmit, buildBaseReportData]);

  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      onClose();
    }
  }, [isSubmitting, onClose]);

  const handleEnhanceWithAI = useCallback(async () => {
    if (!element || !aiDraft.trim()) return;
    setIsEnhancing(true);
    setAiError(null);
    try {
      const base = buildBaseReportData();
      const markdownContext = base ? generateBugReportMarkdown(base) : undefined;
      const result = await aurisAIAdapter.enhanceReport({
        description: aiDraft,
        elementTag: element.tag,
        elementSelector: element.selector,
        elementClasses: element.className,
        pageUrl: window.location.href,
        screenshotBase64: screenshotDataUrl || undefined,
        markdownContext,
      });
      setAiPreview(result);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Erro ao chamar a IA');
    } finally {
      setIsEnhancing(false);
    }
  }, [aiDraft, element, screenshotDataUrl, buildBaseReportData]);

  const handleAcceptAiPreview = useCallback(() => {
    if (!aiPreview) return;
    setDescription(aiPreview.description);
    setSeverity(aiPreview.severity as SeverityLevel);
    setMarkdownReport(aiPreview.markdown);
    setMode('traditional');
    setAiPreview(null);
    setShowMarkdown(true);
  }, [aiPreview]);

  const handleViewMarkdown = useCallback(() => {
    const base = buildBaseReportData();
    if (!base) return;
    const md = generateBugReportMarkdown(base);
    const fixMd = generateFixPromptMarkdown(base);
    setMarkdownReport(`${md}\n\n---\n\n${fixMd}`);
    setShowMarkdown(true);
  }, [buildBaseReportData]);

  const handleCopyMarkdown = useCallback(async () => {
    if (!markdownReport) return;
    try {
      await navigator.clipboard.writeText(markdownReport);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }, [markdownReport]);

  const handleDownloadMarkdown = useCallback(() => {
    if (!markdownReport) return;
    const blob = new Blob([markdownReport], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bug-report-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, [markdownReport]);

  if (!isOpen || !element) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={handleClose}
          data-bug-tracker="true"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl max-h-[90vh] bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                  <Bug className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Reportar Bug</h2>
                  <p className="text-xs text-slate-400">Elemento selecionado: <code className="text-cyan-400">{element.tag}</code></p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleViewMarkdown}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                  title="Visualizar relatório em Markdown"
                >
                  <FileCode className="w-4 h-4" />
                  Ver MD
                </button>

                {/* Mode Toggle */}
                <div className="flex items-center gap-2 bg-slate-800/50 p-1 rounded-lg">
                  <button
                    onClick={() => setMode('traditional')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all ${
                      mode === 'traditional'
                        ? 'bg-slate-700 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    Tradicional
                  </button>
                  <button
                    onClick={() => setMode('ai')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all ${
                      mode === 'ai'
                        ? 'bg-auris-purple text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Brain className="w-4 h-4" />
                    Com Aura AI
                  </button>
                </div>

                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden relative">
              {mode === 'ai' ? (
                <div className="h-full overflow-y-auto p-6">
                  <div className="max-w-2xl mx-auto space-y-6">
                    <div className="p-4 bg-auris-purple/10 border border-auris-purple/20 rounded-xl">
                      <div className="flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-auris-lavender mt-0.5" />
                        <div>
                          <h3 className="font-medium text-auris-lavender mb-1">
                            Análise Inteligente com Aura
                          </h3>
                          <p className="text-sm text-slate-400">
                            Descreva o problema em poucas palavras. A Aura vai analisar o contexto técnico e sugerir uma descrição estruturada em Markdown.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Code2 className="w-4 h-4" />
                        Elemento Selecionado
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-500">Tag:</span>
                          <code className="ml-2 px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded font-mono">
                            {element.tag}
                          </code>
                        </div>
                        <div>
                          <span className="text-slate-500">ID:</span>
                          <code className="ml-2 text-slate-300 font-mono">
                            {element.id || 'N/A'}
                          </code>
                        </div>
                        <div className="col-span-2">
                          <span className="text-slate-500">Classes:</span>
                          <code className="ml-2 text-slate-300 font-mono break-all">
                            {element.className || 'Nenhuma'}
                          </code>
                        </div>
                        <div className="col-span-2">
                          <span className="text-slate-500">Rota/Seletor:</span>
                          <code className="ml-2 text-emerald-300 font-mono break-all text-xs">
                            {window.location.pathname} → {element.selector}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block">
                        Descrição inicial do problema
                      </label>
                      <textarea
                        value={aiDraft}
                        onChange={(e) => setAiDraft(e.target.value)}
                        placeholder="Ex: o botão de salvar não funciona quando clico duas vezes rápido..."
                        rows={4}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 resize-none focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                      />
                    </div>

                    <button
                      onClick={handleEnhanceWithAI}
                      disabled={!aiDraft.trim() || isEnhancing}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-auris-purple to-auris-violet text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isEnhancing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Analisando com Aura...
                        </>
                      ) : (
                        <>
                          <Brain className="w-5 h-5" />
                          Melhorar com Aura AI
                        </>
                      )}
                    </button>

                    {aiError && (
                      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
                        {aiError}
                      </div>
                    )}

                    <AnimatePresence>
                      {aiPreview && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="p-4 bg-slate-800/70 border border-cyan-500/30 rounded-xl space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold text-cyan-400 flex items-center gap-2">
                              <Sparkles className="w-4 h-4" />
                              Sugestão da Aura
                            </h4>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded ${severityLevels.find(s => s.id === aiPreview.severity)?.color || 'text-slate-400'}`}>
                              {severityLevels.find(s => s.id === aiPreview.severity)?.label || aiPreview.severity}
                            </span>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Título sugerido</p>
                            <p className="text-sm text-white font-medium">{aiPreview.title}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Descrição melhorada</p>
                            <p className="text-sm text-slate-300 whitespace-pre-wrap">{aiPreview.description}</p>
                          </div>
                          <div className="flex gap-2 pt-2">
                            <button
                              onClick={handleAcceptAiPreview}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                              <Check className="w-4 h-4" />
                              Aceitar e preencher
                            </button>
                            <button
                              onClick={() => setAiPreview(null)}
                              className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                              <RotateCcw className="w-4 h-4" />
                              Tentar novamente
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <div className="h-full overflow-y-auto p-6">
                  <div className="max-w-2xl mx-auto space-y-6">
                    <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Code2 className="w-4 h-4" />
                        Elemento Selecionado
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-500">Tag:</span>
                          <code className="ml-2 px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded font-mono">
                            {element.tag}
                          </code>
                        </div>
                        <div>
                          <span className="text-slate-500">ID:</span>
                          <code className="ml-2 text-slate-300 font-mono">
                            {element.id || 'N/A'}
                          </code>
                        </div>
                        <div className="col-span-2">
                          <span className="text-slate-500">Classes:</span>
                          <code className="ml-2 text-slate-300 font-mono break-all">
                            {element.className || 'Nenhuma'}
                          </code>
                        </div>
                        <div className="col-span-2">
                          <span className="text-slate-500">Rota/Seletor:</span>
                          <code className="ml-2 text-emerald-300 font-mono break-all text-xs">
                            {window.location.pathname} → {element.selector}
                          </code>
                        </div>
                        <div>
                          <span className="text-slate-500 flex items-center gap-1">
                            <Maximize2 className="w-3 h-3" />
                            Dimensões:
                          </span>
                          <span className="ml-2 text-slate-300">
                            {Math.round(element.rect.width)} × {Math.round(element.rect.height)}px
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 flex items-center gap-1">
                            <Layers className="w-3 h-3" />
                            Posição:
                          </span>
                          <span className="ml-2 text-slate-300 font-mono">
                            x: {Math.round(element.rect.x)}, y: {Math.round(element.rect.y)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block">
                        Tipo de Report
                      </label>
                      <div className="flex gap-3">
                        {reportTypes.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => setType(t.id)}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                              type === t.id
                                ? `${t.color} border-current`
                                : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                            }`}
                          >
                            <t.icon className="w-4 h-4" />
                            <span className="font-medium">{t.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block">
                        Severidade
                      </label>
                      <div className="flex gap-2">
                        {severityLevels.map((s) => (
                          <button
                            key={s.id}
                            onClick={() => setSeverity(s.id)}
                            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                              severity === s.id
                                ? 'bg-slate-700 border-slate-500 text-white'
                                : 'bg-slate-800/30 border-slate-700/50 text-slate-400 hover:border-slate-600'
                            }`}
                          >
                            <s.icon className={`w-4 h-4 ${severity === s.id ? s.color : ''}`} />
                            <span className="text-sm">{s.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block">
                        Descrição do Problema *
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Descreva o problema encontrado..."
                        rows={4}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 resize-none focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                      />
                      <p className="mt-1 text-xs text-slate-500">
                        Seja específico sobre o que está acontecendo
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block">
                        Comportamento Esperado (opcional)
                      </label>
                      <textarea
                        value={expectedBehavior}
                        onChange={(e) => setExpectedBehavior(e.target.value)}
                        placeholder="Como deveria funcionar?"
                        rows={2}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 resize-none focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                      />
                    </div>

                    {screenshotDataUrl && (
                      <div>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={includeScreenshot}
                            onChange={(e) => setIncludeScreenshot(e.target.checked)}
                            className="w-5 h-5 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500/30"
                          />
                          <div className="flex items-center gap-2">
                            <Camera className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-300">Incluir screenshot</span>
                          </div>
                        </label>

                        {includeScreenshot && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-3 p-2 bg-slate-800/30 rounded-lg border border-slate-700/50"
                          >
                            <img
                              src={screenshotDataUrl}
                              alt="Screenshot"
                              className="w-full h-32 object-cover rounded-lg"
                            />
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Markdown Preview Overlay */}
              <AnimatePresence>
                {showMarkdown && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="absolute inset-0 bg-slate-900/98 z-20 flex flex-col"
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700 bg-slate-800/50">
                      <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                        <Eye className="w-4 h-4 text-cyan-400" />
                        Relatório em Markdown
                      </h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleCopyMarkdown}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                        >
                          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          {copied ? 'Copiado!' : 'Copiar'}
                        </button>
                        <button
                          onClick={handleDownloadMarkdown}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          .md
                        </button>
                        <button
                          onClick={() => setShowMarkdown(false)}
                          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 overflow-auto p-4">
                      <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
                        {markdownReport}
                      </pre>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {mode === 'traditional' && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/50">
                <span className="text-xs text-slate-500">
                  * Campos obrigatórios
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!description.trim() || isSubmitting}
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-medium rounded-lg hover:from-cyan-400 hover:to-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Enviar Report
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
