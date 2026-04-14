/**
 * 🧠 Bug Intelligence Engine
 * Motor principal que orquestra o sistema completo de análise de bugs
 */

import type {
  BugIntelligenceInput,
  NLPResult,
  BugIntelligenceReport,
  IntelligenceStatus,
  ChatMessage,
  ChatSession,
  IntelligenceEvents,
} from '../types/bugIntelligence.types';
import { DEFAULT_INTELLIGENCE_CONFIG } from '../types/bugIntelligence.types';

import { NLPProcessor } from './NLPProcessor';
import { BugReportOrchestrator } from './orchestrator/BugReportOrchestrator';

// ============================================================================
// ENGINE PRINCIPAL
// ============================================================================

export class BugIntelligenceEngine {
  private status: IntelligenceStatus = 'idle';
  private sessions: Map<string, ChatSession> = new Map();
  private events: IntelligenceEvents;
  private currentSession: ChatSession | null = null;

  constructor(events: IntelligenceEvents = {}) {
    this.events = events;
  }

  // ========================================================================
  // MÉTODOS PÚBLICOS
  // ========================================================================

  /** Inicia nova sessão de análise */
  async startAnalysis(input: BugIntelligenceInput): Promise<ChatSession> {
    this.setStatus('collecting');

    const session: ChatSession = {
      id: `session-${Date.now()}`,
      bugId: input.bugId,
      messages: [],
      status: 'collecting',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.sessions.set(session.id, session);
    this.currentSession = session;

    // Mensagem inicial da Aura
    const welcomeMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'aura',
      content: this.generateWelcomeMessage(input),
      timestamp: Date.now(),
      type: 'analysis_start',
    };

    this.addMessageToSession(session.id, welcomeMessage);

    return session;
  }

  /** Processa mensagem do usuário */
  async processUserMessage(sessionId: string, userText: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Sessão não encontrada');

    // Adiciona mensagem do usuário
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: userText,
      timestamp: Date.now(),
      type: 'text',
    };

    this.addMessageToSession(sessionId, userMessage);

    // Atualiza status
    this.setStatus('processing_nlp');

    // Processa NLP
    const nlpResult = NLPProcessor.process(userText);

    // Adiciona mensagem do sistema mostrando processamento
    const processingMessage: ChatMessage = {
      id: `msg-${Date.now()}-processing`,
      sender: 'system',
      content: `Processando: "${nlpResult.correctedText}"`,
      timestamp: Date.now(),
      type: 'text',
      metadata: { nlpResult },
    };

    this.addMessageToSession(sessionId, processingMessage);

    // Responde com perguntas de follow-up ou inicia análise
    if (this.shouldAskFollowUp(session, nlpResult)) {
      await this.askFollowUpQuestion(session, nlpResult);
    } else {
      await this.runFullAnalysis(session, nlpResult);
    }
  }

  /** Executa análise completa */
  async runFullAnalysis(session: ChatSession, nlpResult: NLPResult): Promise<BugIntelligenceReport> {
    this.setStatus('analyzing');

    // Notifica início
    const startMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'system',
      content: '🔍 Iniciando análise com 8 especialistas...',
      timestamp: Date.now(),
      type: 'analysis_start',
    };
    this.addMessageToSession(session.id, startMessage);

    // Recupera input original
    const input = await this.recoverInput(session.bugId);
    input.userDescription = nlpResult.originalText;

    // Cria orquestrador e executa
    const orchestrator = new BugReportOrchestrator(nlpResult, input);

    // Passa histórico do chat para o orquestrador
    session.messages.forEach(msg => orchestrator.addChatMessage(msg));

    this.setStatus('orchestrating');

    const report = await orchestrator.runFullAnalysis();

    // Atualiza sessão
    session.finalReport = report;
    session.status = 'completed';
    this.updateSession(session);

    this.setStatus('completed');

    // Notifica conclusão
    const completeMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'aura',
      content: this.generateCompletionMessage(report),
      timestamp: Date.now(),
      type: 'analysis_complete',
      metadata: { report },
    };
    this.addMessageToSession(session.id, completeMessage);

    // Dispara evento
    this.events.onReportComplete?.(report);

    // Salva relatório
    this.saveReport(report);

    return report;
  }

  /** Obtém sessão atual */
  getCurrentSession(): ChatSession | null {
    return this.currentSession;
  }

  /** Obtém sessão por ID */
  getSession(id: string): ChatSession | undefined {
    return this.sessions.get(id);
  }

  /** Obtém todas as sessões */
  getAllSessions(): ChatSession[] {
    return Array.from(this.sessions.values());
  }

  /** Obtém status atual */
  getStatus(): IntelligenceStatus {
    return this.status;
  }

  // ========================================================================
  // MÉTODOS PRIVADOS
  // ========================================================================

  /** Define status e dispara evento */
  private setStatus(status: IntelligenceStatus): void {
    this.status = status;
    this.events.onStatusChange?.(status);
  }

  /** Adiciona mensagem à sessão */
  private addMessageToSession(sessionId: string, message: ChatMessage): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.messages.push(message);
      session.updatedAt = Date.now();
      this.sessions.set(sessionId, session);
      this.events.onChatMessage?.(message);
    }
  }

  /** Atualiza sessão */
  private updateSession(session: ChatSession): void {
    session.updatedAt = Date.now();
    this.sessions.set(session.id, session);
  }

  /** Gera mensagem de boas-vindas */
  private generateWelcomeMessage(input: BugIntelligenceInput): string {
    const element = input.elementInfo;
    const tagName = element.tagName || element.tag || 'elemento';
    
    return `👋 **Detectei um ${tagName} marcado!**

Vejo que você selecionou um elemento na interface. Descreva o problema que encontrou e vou analisar com minhas **8 personalidades especialistas**.

💡 **Dica:** Descreva livremente, mesmo com erros de digitação. Meu sistema NLP vai processar e entender!`;
  }

  /** Decide se deve fazer pergunta de follow-up */
  private shouldAskFollowUp(session: ChatSession, nlpResult: NLPResult): boolean {
    // Só pergunta nas primeiras 2 mensagens
    const userMessages = session.messages.filter(m => m.sender === 'user');
    if (userMessages.length >= 2) return false;

    // Se já tem componente e categoria clara, não pergunta
    if (nlpResult.mentionedComponents.length > 0 && nlpResult.category !== 'UNKNOWN') {
      return false;
    }

    return DEFAULT_INTELLIGENCE_CONFIG.enableFollowUpQuestions;
  }

  /** Pergunta de follow-up */
  private async askFollowUpQuestion(session: ChatSession, nlpResult: NLPResult): Promise<void> {
    const questions = nlpResult.suggestedQuestions.slice(0, 2);
    
    if (questions.length === 0) return;

    const question = questions[0];
    
    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'aura',
      content: `🤔 **Para refinar a análise:**\n\n${question}`,
      timestamp: Date.now(),
      type: 'question',
    };

    this.addMessageToSession(session.id, message);
  }

  /** Gera mensagem de conclusão */
  private generateCompletionMessage(report: BugIntelligenceReport): string {
    const diagnosis = report.diagnosis;
    const severityEmoji = {
      LOW: '🟢',
      MEDIUM: '🟡',
      HIGH: '🟠',
      CRITICAL: '🔴',
    }[diagnosis.severity];

    return `✅ **Análise Completa!**

${severityEmoji} **${diagnosis.title}**

**Causa Raiz Identificada:**
${diagnosis.rootCause}

**Próximos Passos:**
1. 📄 Ver relatório completo em \`.bugs/reports/\`
2. 💻 Aplicar correção sugerida
3. ✅ Seguir checklist de implementação

⏱️ **Tempo de análise:** ${report.metadata.totalProcessingTime}ms  
🎯 **Qualidade:** ${report.metadata.qualityScore}%

Quer que eu gere o patch para aplicar automaticamente?`;
  }

  /** Recupera input do bug (placeholder - implementar com storage) */
  private async recoverInput(bugId: string): Promise<BugIntelligenceInput> {
    // TODO: Implementar recuperação do storage
    // Por enquanto retorna mock
    return {
      bugId,
      elementInfo: {
        tagName: 'div',
        tag: 'div',
        boundingRect: { x: 0, y: 0, width: 100, height: 50 },
        rect: { x: 0, y: 0, width: 100, height: 50, top: 0, left: 0, right: 100, bottom: 50 },
        attributes: {},
        className: '',
        selector: 'div',
        xpath: '//div',
        parentChain: [],
        dataAttributes: {},
        textContent: '',
      },
      timestamp: Date.now(),
    };
  }

  /** Salva relatório */
  private saveReport(report: BugIntelligenceReport): void {
    // Salva no localStorage
    const reports = JSON.parse(localStorage.getItem('bug_reports') || '[]');
    reports.push({
      id: report.metadata.id,
      bugId: report.originalInput.bugId,
      title: report.diagnosis.title,
      severity: report.diagnosis.severity,
      createdAt: report.metadata.generatedAt,
      preview: report.markdownContent.substring(0, 500),
    });
    localStorage.setItem('bug_reports', JSON.stringify(reports));

    // Salva MD completo
    const key = `bug_report_md_${report.metadata.id}`;
    localStorage.setItem(key, report.markdownContent);

    console.log(`[BugIntelligence] Relatório salvo: ${report.metadata.id}`);
  }

  // ========================================================================
  // MÉTODOS ESTÁTICOS (UTILS)
  // ========================================================================

  /** Recupera relatório salvo */
  static getSavedReport(reportId: string): string | null {
    return localStorage.getItem(`bug_report_md_${reportId}`);
  }

  /** Lista todos os relatórios salvos */
  static listSavedReports(): Array<{
    id: string;
    bugId: string;
    title: string;
    severity: string;
    createdAt: string;
    preview: string;
  }> {
    return JSON.parse(localStorage.getItem('bug_reports') || '[]');
  }

  /** Exporta relatório como arquivo MD */
  static exportReportAsFile(reportId: string, filename?: string): void {
    const content = this.getSavedReport(reportId);
    if (!content) return;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `bug-report-${reportId}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
  }
}

// Instância global
let globalEngine: BugIntelligenceEngine | null = null;

export function getBugIntelligenceEngine(events?: IntelligenceEvents): BugIntelligenceEngine {
  if (!globalEngine) {
    globalEngine = new BugIntelligenceEngine(events);
  }
  return globalEngine;
}

export default BugIntelligenceEngine;
