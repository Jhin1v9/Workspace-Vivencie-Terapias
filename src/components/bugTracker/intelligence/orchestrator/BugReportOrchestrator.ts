/**
 * 🎯 Bug Report Orchestrator
 * Consolida análises de múltiplas personalidades em um diagnóstico unificado
 */

import type {
  BugIntelligenceInput,
  NLPResult,
  PersonalityAnalysis,
  PersonalityType,
  ConsolidatedDiagnosis,
  ImpactAssessment,
  CodeSuggestion,
  BugIntelligenceReport,
  ReportMetadata,
  ChatMessage,
} from '../../types/bugIntelligence.types';
import { DEFAULT_INTELLIGENCE_CONFIG } from '../../types/bugIntelligence.types';

import { ArquitetoAnalyzer } from '../personalities/ArquitetoAnalyzer';
import { UIUXAnalyzer } from '../personalities/UIUXAnalyzer';
import { ReactAnalyzer } from '../personalities/ReactAnalyzer';
import { ReportGenerator } from '../output/ReportGenerator';

// Importa outras personalidades
import { BasePersonalityAnalyzer } from '../personalities/BasePersonalityAnalyzer';

// ============================================================================
// PERSONALIDADES DISPONÍVEIS
// ============================================================================

const AVAILABLE_PERSONALITIES: Record<PersonalityType, new () => BasePersonalityAnalyzer> = {
  ARQUITETO: ArquitetoAnalyzer,
  UIUX_ENGINEER: UIUXAnalyzer,
  REACT_SPECIALIST: ReactAnalyzer,
  // Placeholders para personalidades ainda não implementadas
  PERFORMANCE_ENGINEER: ArquitetoAnalyzer,
  TYPESCRIPT_MASTER: ArquitetoAnalyzer,
  CSS_TAILWIND_EXPERT: ArquitetoAnalyzer,
  TESTING_ENGINEER: ArquitetoAnalyzer,
  DX_ENGINEER: ArquitetoAnalyzer,
};

// ============================================================================
// ORQUESTRADOR
// ============================================================================

export class BugReportOrchestrator {
  private nlpResult: NLPResult;
  private input: BugIntelligenceInput;
  private analyses: PersonalityAnalysis[] = [];
  private chatHistory: ChatMessage[] = [];
  private startTime: number;

  constructor(nlpResult: NLPResult, input: BugIntelligenceInput) {
    this.nlpResult = nlpResult;
    this.input = input;
    this.startTime = performance.now();
  }

  /** Executa análise completa */
  async runFullAnalysis(): Promise<BugIntelligenceReport> {
    const config = DEFAULT_INTELLIGENCE_CONFIG;
    
    // 1. Executa análises das personalidades
    await this.runPersonalityAnalyses(config.activePersonalities);
    
    // 2. Consolida diagnóstico
    const diagnosis = this.consolidateDiagnosis();
    
    // 3. Gera relatório MD
    const markdownContent = ReportGenerator.generate(this.input, this.nlpResult, this.analyses, diagnosis);
    
    // 4. Monta relatório final
    const report: BugIntelligenceReport = {
      metadata: this.generateMetadata(),
      originalInput: this.input,
      nlpResult: this.nlpResult,
      personalityAnalyses: this.analyses,
      diagnosis,
      chatHistory: this.chatHistory,
      markdownContent,
    };

    return report;
  }

  /** Executa análises paralelas das personalidades */
  private async runPersonalityAnalyses(personalities: PersonalityType[]): Promise<void> {
    const analysisPromises = personalities.map(async (type) => {
      const AnalyzerClass = AVAILABLE_PERSONALITIES[type];
      if (!AnalyzerClass) return null;

      const analyzer = new AnalyzerClass();
      const start = performance.now();
      
      try {
        const analysis = await analyzer.analyze({
          nlpResult: this.nlpResult,
          elementInfo: this.input.elementInfo,
          codeContext: this.input.codeContext,
          previousAnalyses: this.analyses,
        });

        // Adiciona tempo de processamento
        analysis.processingTime = performance.now() - start;
        
        return analysis;
      } catch (error) {
        console.error(`Erro na análise ${type}:`, error);
        return null;
      }
    });

    const results = await Promise.all(analysisPromises);
    this.analyses = results.filter((a): a is PersonalityAnalysis => a !== null);
  }

  /** Consolida diagnóstico de todas as personalidades */
  private consolidateDiagnosis(): ConsolidatedDiagnosis {
    this.collectAllIssues();
    this.collectAllRecommendations();
    
    // Determina severidade (prioriza a mais alta)
    const severity = this.determineSeverity();
    
    // Determina categoria (moda)
    const category = this.determineCategory();
    
    // Gera título
    const title = this.generateTitle();
    
    // Gera descrição
    const description = this.generateDescription();
    
    // Identifica causa raiz
    const rootCause = this.identifyRootCause();
    
    // Componentes afetados
    const affectedComponents = this.nlpResult.mentionedComponents.length > 0
      ? this.nlpResult.mentionedComponents
      : this.inferAffectedComponents();

    // Solução primária
    const primarySolution = this.selectPrimarySolution();
    
    // Soluções alternativas
    const alternativeSolutions = this.collectAlternativeSolutions();
    
    // Impacto
    const impact = this.assessImpact();
    
    // Checklist
    const implementationChecklist = this.generateChecklist();
    
    // Personalidades que concordam
    const agreeingPersonalities = this.analyses
      .filter(a => a.confidence > 70)
      .map(a => a.personality);
    
    // Personalidades com ressalvas
    const dissentingPersonalities = this.analyses
      .filter(a => a.confidence < 50)
      .map(a => a.personality);

    return {
      title,
      description,
      rootCause,
      severity,
      category,
      affectedComponents,
      primarySolution,
      alternativeSolutions,
      impact,
      implementationChecklist,
      agreeingPersonalities,
      dissentingPersonalities,
    };
  }

  /** Coleta todos os issues */
  private collectAllIssues(): string[] {
    const allIssues = this.analyses.flatMap(a => a.issues);
    return [...new Set(allIssues)]; // Remove duplicatas
  }

  /** Coleta todas as recomendações */
  private collectAllRecommendations(): string[] {
    const allRecs = this.analyses.flatMap(a => a.recommendations);
    return [...new Set(allRecs)];
  }

  /** Determina severidade final */
  private determineSeverity() {
    const severityOrder: Record<string, number> = {
      LOW: 0,
      MEDIUM: 1,
      HIGH: 2,
      CRITICAL: 3,
    };

    // Começa com o detectado pelo NLP
    let maxSeverity = this.nlpResult.severity;

    // Verifica se alguma personalidade indica severidade maior
    for (const analysis of this.analyses) {
      // Se muitas issues, aumenta severidade
      if (analysis.issues.length > 3 && severityOrder[maxSeverity] < 2) {
        maxSeverity = 'HIGH';
      }
    }

    return maxSeverity;
  }

  /** Determina categoria final */
  private determineCategory() {
    // Por padrão, usa a do NLP
    return this.nlpResult.category;
  }

  /** Gera título do bug */
  private generateTitle(): string {
    const component = this.nlpResult.mentionedComponents[0] || 'Componente';
    const categoryNames: Record<string, string> = {
      UI_VISUAL: 'Problema Visual',
      FUNCTIONAL: 'Falha Funcional',
      PERFORMANCE: 'Problema de Performance',
      ACCESSIBILITY: 'Problema de Acessibilidade',
      TYPE_ERROR: 'Erro de TypeScript',
      LOGIC_ERROR: 'Erro de Lógica',
      STATE_MANAGEMENT: 'Problema de Estado',
      API_INTEGRATION: 'Erro de Integração',
      UNKNOWN: 'Problema Detectado',
    };

    const categoryName = categoryNames[this.nlpResult.category] || 'Problema';
    
    return `${categoryName}: ${component} - ${this.nlpResult.keywords.slice(0, 3).join(' ')}`;
  }

  /** Gera descrição consolidada */
  private generateDescription(): string {
    return this.nlpResult.enhancedText;
  }

  /** Identifica causa raiz */
  private identifyRootCause(): string {
    // Analisa issues para encontrar padrão comum
    const issues = this.collectAllIssues();
    
    // Prioriza certos tipos de causa
    if (issues.some(i => i.includes('re-render') || i.includes('loop'))) {
      return 'Re-renderização em excesso causando instabilidade visual e consumo de recursos';
    }
    
    if (issues.some(i => i.includes('event') || i.includes('handler'))) {
      return 'Event handling incorreto ou não vinculado ao elemento';
    }
    
    if (issues.some(i => i.includes('estado') || i.includes('state'))) {
      return 'Gerenciamento de estado em nível incorreto ou closure stale';
    }
    
    if (issues.some(i => i.includes('CSS') || i.includes('classe'))) {
      return 'Conflito ou ausência de classes CSS necessárias';
    }
    
    return 'Múltiplos fatores contribuindo - verificar recomendações específicas';
  }

  /** Infere componentes afetados */
  private inferAffectedComponents(): string[] {
    const tag = this.input.elementInfo.tagName || this.input.elementInfo.tag;
    return tag ? [tag] : ['Componente desconhecido'];
  }

  /** Seleciona solução primária */
  private selectPrimarySolution(): CodeSuggestion {
    // Procura por code suggestion da personalidade com maior confiança
    const sortedAnalyses = [...this.analyses].sort((a, b) => b.confidence - a.confidence);
    
    for (const analysis of sortedAnalyses) {
      if (analysis.codeSuggestion) {
        return analysis.codeSuggestion;
      }
    }

    // Fallback: gera solução genérica baseada na categoria
    return this.generateGenericSolution();
  }

  /** Coleta soluções alternativas */
  private collectAlternativeSolutions(): CodeSuggestion[] {
    const solutions: CodeSuggestion[] = [];
    
    for (const analysis of this.analyses) {
      if (analysis.codeSuggestion && analysis.codeSuggestion !== this.selectPrimarySolution()) {
        solutions.push(analysis.codeSuggestion);
      }
    }

    return solutions.slice(0, 2); // Máximo 2 alternativas
  }

  /** Avalia impacto */
  private assessImpact(): ImpactAssessment {
    const scope = this.nlpResult.mentionedComponents.length > 0
      ? this.nlpResult.mentionedComponents
      : ['Componente local'];

    // Determina risco de regressão baseado na severidade
    const regressionRisk = this.nlpResult.severity === 'HIGH' || this.nlpResult.severity === 'CRITICAL'
      ? 'HIGH'
      : this.nlpResult.severity === 'MEDIUM'
        ? 'MEDIUM'
        : 'LOW';

    // Esforço estimado
    let estimatedEffort: ImpactAssessment['estimatedEffort'] = 'QUICK';
    
    if (this.analyses.some(a => a.issues.length > 3)) {
      estimatedEffort = 'MEDIUM';
    }
    if (this.nlpResult.category === 'STATE_MANAGEMENT' || this.nlpResult.category === 'API_INTEGRATION') {
      estimatedEffort = 'LARGE';
    }

    // Breaking changes
    const breakingChanges = this.nlpResult.category === 'API_INTEGRATION' || 
                           this.collectAllIssues().some(i => i.includes('prop') || i.includes('interface'));

    return {
      scope,
      regressionRisk,
      estimatedEffort,
      breakingChanges,
    };
  }

  /** Gera checklist de implementação */
  private generateChecklist(): string[] {
    const checklist: string[] = [];
    
    // Adiciona recomendações como checklist
    const recommendations = this.collectAllRecommendations().slice(0, 5);
    checklist.push(...recommendations.map(r => `[ ] ${r}`));
    
    // Adiciona itens baseados na categoria
    if (this.nlpResult.category === 'UI_VISUAL') {
      checklist.push('[ ] Verificar em múltiplos navegadores');
      checklist.push('[ ] Testar responsividade');
    }
    
    if (this.nlpResult.category === 'FUNCTIONAL') {
      checklist.push('[ ] Adicionar teste de regressão');
      checklist.push('[ ] Verificar edge cases');
    }

    return checklist;
  }

  /** Gera solução genérica */
  private generateGenericSolution(): CodeSuggestion {
    return {
      language: 'tsx',
      currentCode: '// Código atual com problema',
      suggestedCode: '// Implementar correção baseada nas recomendações acima',
      explanation: 'Solução específica depende do contexto completo do código',
    };
  }

  /** Gera metadados do relatório */
  private generateMetadata(): ReportMetadata {
    const totalTime = performance.now() - this.startTime;
    
    // Calcula score de qualidade
    const avgConfidence = this.analyses.reduce((sum, a) => sum + a.confidence, 0) / this.analyses.length;
    const coverage = this.analyses.filter(a => a.insights.length > 0).length / this.analyses.length;
    const qualityScore = Math.round((avgConfidence * 0.6 + coverage * 40));

    return {
      id: `BUG-${Date.now()}`,
      systemVersion: '3.1.0',
      generatedAt: new Date().toISOString(),
      totalProcessingTime: Math.round(totalTime),
      personalitiesUsed: this.analyses.map(a => a.personality),
      qualityScore,
    };
  }

  /** Adiciona mensagem ao histórico */
  addChatMessage(message: ChatMessage): void {
    this.chatHistory.push(message);
  }
}

export default BugReportOrchestrator;
