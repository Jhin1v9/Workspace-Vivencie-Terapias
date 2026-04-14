/**
 * 🧠 Base Personality Analyzer
 * Classe base para todas as personalidades de análise
 */

import type {
  PersonalityType,
  PersonalityAnalysis,
  NLPResult,
  BugElementInfo,
  CodeContext,
  CodeSuggestion,
} from '../../types/bugIntelligence.types';

/** Configuração da personalidade */
export interface PersonalityConfig {
  type: PersonalityType;
  name: string;
  icon: string;
  color: string;
  description: string;
  expertise: string[];
  priority: number;
}

/** Contexto de análise */
export interface AnalysisContext {
  nlpResult: NLPResult;
  elementInfo: BugElementInfo;
  codeContext?: CodeContext;
  previousAnalyses?: PersonalityAnalysis[];
}

/** Classe base abstrata */
export abstract class BasePersonalityAnalyzer {
  protected config: PersonalityConfig;

  constructor(config: PersonalityConfig) {
    this.config = config;
  }

  /** Retorna a configuração */
  getConfig(): PersonalityConfig {
    return this.config;
  }

  /** Método principal de análise */
  abstract analyze(context: AnalysisContext): Promise<PersonalityAnalysis>;

  /** Cria resposta padrão */
  protected createAnalysis(
    insights: string[],
    issues: string[],
    recommendations: string[],
    confidence: number,
    codeSuggestion?: CodeSuggestion
  ): PersonalityAnalysis {
    return {
      personality: this.config.type,
      name: this.config.name,
      icon: this.config.icon,
      color: this.config.color,
      insights,
      issues,
      recommendations,
      codeSuggestion,
      confidence,
      processingTime: 0, // Será atualizado pelo orchestrator
    };
  }

  /** Verifica se keywords estão presentes */
  protected hasKeywords(text: string, keywords: string[]): boolean {
    const lowerText = text.toLowerCase();
    return keywords.some(kw => lowerText.includes(kw.toLowerCase()));
  }

  /** Extrai atributos do elemento */
  protected extractElementAttributes(elementInfo: BugElementInfo): {
    tag: string;
    classes: string[];
    hasEventListeners: boolean;
    isInteractive: boolean;
  } {
    const attributes = elementInfo.attributes || {};
    const tag = elementInfo.tagName || elementInfo.tag || 'unknown';
    const classValue = attributes.class || elementInfo.className || '';
    const classes = classValue.split(' ').filter(Boolean);
    
    const interactiveTags = ['button', 'a', 'input', 'select', 'textarea'];
    const isInteractive = interactiveTags.includes(tag.toLowerCase()) || 
                         !!attributes.onclick ||
                         !!attributes.onchange;
    
    const hasEventListeners = !!(
      attributes.onclick ||
      attributes.onchange ||
      attributes.onsubmit ||
      attributes.onfocus
    );

    return {
      tag,
      classes,
      hasEventListeners,
      isInteractive,
    };
  }

  /** Analisa classes Tailwind */
  protected analyzeTailwindClasses(classes: string[]): {
    hasLayout: boolean;
    hasSpacing: boolean;
    hasColors: boolean;
    hasTypography: boolean;
    hasEffects: boolean;
    issues: string[];
  } {
    const hasLayout = classes.some(c => 
      /^(flex|grid|block|inline|hidden|relative|absolute|fixed|sticky)$/.test(c)
    );
    
    const hasSpacing = classes.some(c =>
      /^(p|m|px|py|mx|my|pt|pr|pb|pl|mt|mr|mb|ml)-/.test(c)
    );
    
    const hasColors = classes.some(c =>
      /^(bg|text|border|ring)-/.test(c)
    );
    
    const hasTypography = classes.some(c =>
      /^(text-|font-|leading-|tracking-)/.test(c)
    );
    
    const hasEffects = classes.some(c =>
      /^(shadow|rounded|border|opacity|transition|animate)/.test(c)
    );

    const issues: string[] = [];
    
    if (!hasLayout && classes.length > 0) {
      issues.push('Elemento sem classes de layout definidas');
    }
    
    // Verifica uso excessivo de important
    const importantCount = classes.filter(c => c.endsWith('!')).length;
    if (importantCount > 2) {
      issues.push('Uso excessivo de !important pode indicar especificidade problemática');
    }
    
    // Verifica conflitos comuns
    if (classes.includes('flex') && classes.includes('grid')) {
      issues.push('Conflito: flex e grid não podem ser usados juntos');
    }

    return {
      hasLayout,
      hasSpacing,
      hasColors,
      hasTypography,
      hasEffects,
      issues,
    };
  }
}

export default BasePersonalityAnalyzer;
