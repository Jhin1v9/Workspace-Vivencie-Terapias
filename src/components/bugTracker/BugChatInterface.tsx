/**
 * 💬 BugChatInterface
 * Interface de chat integrada ao Modo Edição para comunicação com Aura AI
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Loader2, 
  FileText, 
  Download,
  CheckCircle,
  AlertCircle,
  Brain,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import {
  BugIntelligenceEngine,
  getBugIntelligenceEngine,
} from './intelligence/BugIntelligenceEngine';

import type {
  ChatMessage,
  ChatSession,
  IntelligenceStatus,
  BugIntelligenceReport,
  BugElementInfo,
} from './types/bugIntelligence.types';

// ============================================================================
// TYPES
// ============================================================================

interface BugChatInterfaceProps {
  /** ID do bug */
  bugId: string;
  /** Informações do elemento capturado */
  elementInfo: BugElementInfo;
  /** Screenshot em base64 (opcional) */
  screenshot?: string;
  /** Callback quando análise é completada */
  onAnalysisComplete?: (report: BugIntelligenceReport) => void;
  /** Callback para fechar */
  onClose?: () => void;
  /** Classe adicional */
  className?: string;
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export const BugChatInterface: React.FC<BugChatInterfaceProps> = ({
  bugId,
  elementInfo,
  screenshot,
  onAnalysisComplete,
  onClose,
  className,
}) => {
  // ---------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------
  const [session, setSession] = useState<ChatSession | null>(null);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<IntelligenceStatus>('idle');
  const [showReport, setShowReport] = useState(false);
  const [report, setReport] = useState<BugIntelligenceReport | null>(null);
  
  const engineRef = useRef<BugIntelligenceEngine | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ---------------------------------------------------------------------
  // EFFECTS
  // ---------------------------------------------------------------------

  // Inicializa engine e sessão
  useEffect(() => {
    engineRef.current = getBugIntelligenceEngine({
      onChatMessage: (msg) => {
        setSession(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            messages: [...prev.messages, msg],
          };
        });
      },
      onStatusChange: setStatus,
      onReportComplete: (r) => {
        setReport(r);
        onAnalysisComplete?.(r);
        setIsProcessing(false);
      },
    });

    // Inicia sessão
    const initSession = async () => {
      const newSession = await engineRef.current!.startAnalysis({
        bugId,
        elementInfo,
        screenshot,
        timestamp: Date.now(),
      });
      setSession(newSession);
    };

    initSession();

    // Focus no input
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [bugId, elementInfo, screenshot, onAnalysisComplete]);

  // Scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.messages]);

  // ---------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------

  const handleSend = useCallback(async () => {
    if (!input.trim() || !session || isProcessing) return;

    const text = input.trim();
    setInput('');
    setIsProcessing(true);

    try {
      await engineRef.current?.processUserMessage(session.id, text);
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [input, session, isProcessing]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleExport = () => {
    if (report) {
      BugIntelligenceEngine.exportReportAsFile(
        report.metadata.id,
        `bug-report-${bugId}.md`
      );
    }
  };

  // ---------------------------------------------------------------------
  // RENDER HELPERS
  // ---------------------------------------------------------------------

  const getSenderIcon = (sender: ChatMessage['sender']) => {
    switch (sender) {
      case 'user':
        return <User className="w-4 h-4" />;
      case 'aura':
        return <Bot className="w-4 h-4" />;
      case 'system':
        return <Sparkles className="w-4 h-4" />;
      default:
        return <Brain className="w-4 h-4" />;
    }
  };

  const getSenderColor = (sender: ChatMessage['sender']) => {
    switch (sender) {
      case 'user':
        return 'bg-blue-500';
      case 'aura':
        return 'bg-auris-purple';
      case 'system':
        return 'bg-amber-500';
      default:
        return 'bg-slate-500';
    }
  };

  const getSenderName = (sender: ChatMessage['sender']) => {
    switch (sender) {
      case 'user':
        return 'Você';
      case 'aura':
        return 'Aura';
      case 'system':
        return 'Sistema';
      default:
        return sender;
    }
  };

  // ---------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------

  return (
    <div className={cn(
      "flex flex-col bg-slate-900/95 backdrop-blur-xl rounded-xl",
      "border border-auris-purple/20 shadow-2xl",
      "w-full max-w-lg h-[600px]",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-auris-purple/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-auris-purple to-auris-violet 
                          flex items-center justify-center shadow-lg shadow-auris-purple/20">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-100">Aura Intelligence</h3>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              8 personalidades ativas
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {report && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReport(!showReport)}
              className="text-slate-400 hover:text-slate-100"
            >
              <FileText className="w-4 h-4 mr-1" />
              Relatório
            </Button>
          )}
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-100"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Status Bar */}
      {status !== 'idle' && status !== 'completed' && (
        <div className="px-4 py-2 bg-auris-purple/10 border-b border-auris-purple/10">
          <div className="flex items-center gap-2 text-xs text-auris-lavender">
            <Loader2 className="w-3 h-3 animate-spin" />
            {getStatusLabel(status)}
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {showReport && report ? (
          // Relatório
          <ReportView report={report} onExport={handleExport} onBack={() => setShowReport(false)} />
        ) : (
          // Chat
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              {session?.messages.map((message, index) => (
                <ChatMessageBubble
                  key={message.id}
                  message={message}
                  isLast={index === session.messages.length - 1}
                  getSenderIcon={getSenderIcon}
                  getSenderColor={getSenderColor}
                  getSenderName={getSenderName}
                />
              ))}
              
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-slate-500 text-sm"
                >
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Aura está processando...
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Input Area */}
      {!showReport && (
        <div className="p-4 border-t border-auris-purple/20">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Descreva o problema..."
              disabled={isProcessing}
              className="flex-1 bg-slate-800/50 border-auris-purple/20 
                       text-slate-100 placeholder:text-slate-500
                       focus:border-auris-purple/50 focus:ring-auris-purple/20"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isProcessing}
              className="bg-auris-purple hover:bg-auris-purple/90 text-white"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          
          <p className="mt-2 text-xs text-slate-500 text-center">
            Descreva livremente - NLP corrige erros e aprimora para linguagem técnica
          </p>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// SUB-COMPONENTES
// ============================================================================

interface ChatMessageBubbleProps {
  message: ChatMessage;
  isLast: boolean;
  getSenderIcon: (sender: ChatMessage['sender']) => React.ReactNode;
  getSenderColor: (sender: ChatMessage['sender']) => string;
  getSenderName: (sender: ChatMessage['sender']) => string;
}

const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({
  message,
  getSenderIcon,
  getSenderColor,
  getSenderName,
}) => {
  const isUser = message.sender === 'user';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-3",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar className={cn("w-8 h-8 border-2", getSenderColor(message.sender))}>
        <AvatarFallback className={cn("text-white text-xs", getSenderColor(message.sender))}>
          {getSenderIcon(message.sender)}
        </AvatarFallback>
      </Avatar>
      
      <div className={cn(
        "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
        isUser 
          ? "bg-blue-500/20 text-blue-100 rounded-tr-sm"
          : "bg-slate-800 text-slate-200 rounded-tl-sm"
      )}>
        <p className="text-xs opacity-70 mb-1">{getSenderName(message.sender)}</p>
        <div className="whitespace-pre-wrap">{message.content}</div>
        
        {/* Metadados de NLP para mensagens do sistema */}
        {message.type === 'text' && message.metadata?.nlpResult && (
          <div className="mt-2 pt-2 border-t border-slate-700/50">
            <p className="text-xs text-auris-lavender/70">
              <Sparkles className="w-3 h-3 inline mr-1" />
              Processado: "{(message.metadata.nlpResult as { correctedText: string }).correctedText}"
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ============================================================================
// REPORT VIEW
// ============================================================================

interface ReportViewProps {
  report: BugIntelligenceReport;
  onExport: () => void;
  onBack: () => void;
}

const ReportView: React.FC<ReportViewProps> = ({ report, onExport, onBack }) => {
  const { diagnosis, metadata } = report;
  
  const severityColors = {
    LOW: 'text-green-400',
    MEDIUM: 'text-yellow-400',
    HIGH: 'text-orange-400',
    CRITICAL: 'text-red-400',
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        {/* Header do relatório */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-slate-400">
            ← Voltar ao chat
          </Button>
          <Button variant="outline" size="sm" onClick={onExport} className="gap-1">
            <Download className="w-4 h-4" />
            Exportar MD
          </Button>
        </div>

        {/* Título e severidade */}
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
          <h4 className="font-semibold text-slate-100 mb-2">{diagnosis.title}</h4>
          <div className="flex items-center gap-4 text-sm">
            <span className={cn("font-medium", severityColors[diagnosis.severity])}>
              {diagnosis.severity}
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">{diagnosis.category}</span>
          </div>
        </div>

        {/* Causa raiz */}
        <div className="p-4 rounded-xl bg-auris-purple/10 border border-auris-purple/20">
          <h5 className="text-sm font-medium text-auris-lavender mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Causa Raiz
          </h5>
          <p className="text-sm text-slate-300">{diagnosis.rootCause}</p>
        </div>

        {/* Personalidades */}
        <div>
          <h5 className="text-sm font-medium text-slate-400 mb-3">Análises Especialistas</h5>
          <div className="grid grid-cols-4 gap-2">
            {report.personalityAnalyses.map((analysis) => (
              <div
                key={analysis.personality}
                className="p-2 rounded-lg bg-slate-800/50 border border-slate-700 text-center"
              >
                <span className="text-lg">{analysis.icon}</span>
                <p className="text-xs text-slate-400 mt-1">{analysis.confidence}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* Checklist */}
        <div>
          <h5 className="text-sm font-medium text-slate-400 mb-3">Checklist</h5>
          <div className="space-y-2">
            {diagnosis.implementationChecklist.slice(0, 4).map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-slate-600" />
                {item.replace('[ ]', '').trim()}
              </div>
            ))}
          </div>
        </div>

        {/* Métricas */}
        <div className="p-3 rounded-lg bg-slate-800/30 text-xs text-slate-500 text-center">
          Análise completada em {metadata.totalProcessingTime}ms • 
          Qualidade: {metadata.qualityScore}% • 
          {metadata.personalitiesUsed.length} especialistas
        </div>
      </div>
    </ScrollArea>
  );
};

// ============================================================================
// HELPERS
// ============================================================================

function getStatusLabel(status: IntelligenceStatus): string {
  const labels: Record<IntelligenceStatus, string> = {
    idle: 'Aguardando...',
    collecting: 'Coletando informações...',
    processing_nlp: 'Processando linguagem natural...',
    analyzing: 'Analisando com 8 especialistas...',
    orchestrating: 'Consolidando diagnóstico...',
    generating: 'Gerando relatório...',
    completed: 'Análise completa!',
    error: 'Erro na análise',
  };
  return labels[status];
}

export default BugChatInterface;
