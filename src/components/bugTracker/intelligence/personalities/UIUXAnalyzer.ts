/**
 * 🎨 UI/UX Engineer Analyzer
 * Análise de experiência do usuário e design
 */

import { BasePersonalityAnalyzer, type AnalysisContext } from './BasePersonalityAnalyzer';
import type { PersonalityAnalysis, CodeSuggestion } from '../../types/bugIntelligence.types';

export class UIUXAnalyzer extends BasePersonalityAnalyzer {
  constructor() {
    super({
      type: 'UIUX_ENGINEER',
      name: 'UI/UX Engineer',
      icon: '🎨',
      color: '#EC4899', // pink-500
      description: 'Analisa experiência do usuário, acessibilidade e design',
      expertise: [
        'User Experience',
        'Visual Design',
        'Accessibility (a11y)',
        'Responsive Design',
        'Interaction Design',
        'Design Systems',
      ],
      priority: 2,
    });
  }

  async analyze(context: AnalysisContext): Promise<PersonalityAnalysis> {
    const { nlpResult, elementInfo } = context;
    
    const insights: string[] = [];
    const issues: string[] = [];
    const recommendations: string[] = [];
    let codeSuggestion: CodeSuggestion | undefined;

    const element = this.extractElementAttributes(elementInfo);
    const attributes = elementInfo.attributes || {};

    // Análise de acessibilidade
    this.analyzeAccessibility(element, elementInfo, attributes, issues, recommendations);

    // Análise de interação
    this.analyzeInteraction(element, nlpResult, issues, recommendations);

    // Análise de feedback visual
    this.analyzeVisualFeedback(element, attributes, issues, recommendations);

    // Análise baseada na descrição do usuário
    this.analyzeUserDescription(nlpResult, issues, recommendations);

    // Sugestão de código se houver issues críticos
    if (issues.length > 0 && element.tag) {
      codeSuggestion = this.generateAccessibilityFix(element, attributes);
    }

    const confidence = this.calculateConfidence(insights, issues);

    return this.createAnalysis(insights, issues, recommendations, confidence, codeSuggestion);
  }

  private analyzeAccessibility(
    element: ReturnType<typeof this.extractElementAttributes>,
    elementInfo: AnalysisContext['elementInfo'],
    attributes: Record<string, string>,
    issues: string[],
    recommendations: string[]
  ): void {
    // Verifica elementos interativivos sem aria
    if (element.isInteractive) {
      if (!attributes['aria-label'] && !attributes['aria-labelledby'] && !attributes.title) {
        const hasTextContent = elementInfoHasText(elementInfo);
        if (!hasTextContent) {
          issues.push('Elemento interativo sem label acessível para screen readers');
          recommendations.push('Adicionar aria-label ou texto visível descrevendo a ação');
        }
      }

      // Verifica focus
      if (attributes.tabindex === '-1') {
        // Elemento removido da ordem de tabulação
        if (element.isInteractive) {
          issues.push('Elemento interativo não focável via teclado');
          recommendations.push('Remover tabindex="-1" de elementos interativos ou adicionar manipulação de focus programático');
        }
      }
    }

    // Verifica contraste (simplificado)
    const classAttr = attributes.class || elementInfo.className || '';
    if (classAttr.includes('text-')) {
      const hasBgClass = classAttr.includes('bg-');
      if (!hasBgClass) {
        // Texto pode estar herdando background - verificar contraste
      }
    }

    // Verifica imagens
    if (element.tag === 'img' && !attributes.alt) {
      issues.push('Imagem sem atributo alt - problemático para acessibilidade');
      recommendations.push('Adicionar alt descritivo ou alt="" para imagens decorativas');
    }

    // Verifica inputs
    if (element.tag === 'input' || element.tag === 'textarea') {
      const hasLabel = attributes.id && document.querySelector(`label[for="${attributes.id}"]`);
      const hasAriaLabel = attributes['aria-label'] || attributes['aria-labelledby'];
      
      if (!hasLabel && !hasAriaLabel) {
        issues.push('Input sem label associado');
        recommendations.push('Adicionar label com htmlFor ou aria-label descritivo');
      }
    }
  }

  private analyzeInteraction(
    element: ReturnType<typeof this.extractElementAttributes>,
    nlpResult: AnalysisContext['nlpResult'],
    _issues: string[],
    recommendations: string[]
  ): void {
    // Verifica feedback de loading
    if (nlpResult.keywords.some(k => ['lento', 'demora', 'loading'].includes(k))) {
      recommendations.push('Adicionar estados de loading ou skeleton screens');
      recommendations.push('Considerar optimistic UI para ações rápidas');
    }

    // Análise de estados
    if (element.isInteractive) {
      // Elemento interativo - verificar estados: hover, focus, active, disabled
      
      // Verifica se tem classes de estado
      const hasStateClasses = element.classes.some(c => 
        c.includes('hover:') || c.includes('focus:') || c.includes('active:') || c.includes('disabled:')
      );
      
      if (!hasStateClasses) {
        recommendations.push('Adicionar estados visuais para hover, focus e active');
      }
    }

    // Análise de touch targets
    if (element.isInteractive && element.classes.length > 0) {
      const hasMinSize = element.classes.some(c => 
        c.includes('min-w-') || c.includes('min-h-') || c.includes('w-') || c.includes('h-')
      );
      
      if (!hasMinSize) {
        recommendations.push('Garantir touch target mínimo de 44x44px para mobile');
      }
    }
  }

  private analyzeVisualFeedback(
    element: ReturnType<typeof this.extractElementAttributes>,
    _attributes: Record<string, string>,
    _issues: string[],
    recommendations: string[]
  ): void {
    // Verifica transições
    const hasTransitions = element.classes.some(c => c.includes('transition'));
    
    if (element.isInteractive && !hasTransitions) {
      recommendations.push('Adicionar transições suaves para mudanças de estado');
    }

    // Verifica animações excessivas
    const animationClasses = element.classes.filter(c => 
      c.includes('animate-') || c.includes('motion-')
    );
    
    if (animationClasses.length > 2) {
      recommendations.push('Reduzir animações ou respeitar prefers-reduced-motion');
    }
  }

  private analyzeUserDescription(
    nlpResult: AnalysisContext['nlpResult'],
    _issues: string[],
    recommendations: string[],
  ): void {
    const text = nlpResult.enhancedText.toLowerCase();

    // Tremor/flickering
    if (text.includes('trem') || text.includes('flicker') || text.includes('instabilidade')) {
      // Instabilidade visual detectada - possível problema de renderização
      recommendations.push('Verificar re-renders excessivos com React DevTools');
      recommendations.push('Considerar memoização de componentes');
      recommendations.push('Usar transform ao invés de propriedades que causam reflow');
    }

    // Elemento não aparece
    if (text.includes('não aparece') || text.includes('não visível') || text.includes('sumiu')) {
      // Elemento não renderizando corretamente
      recommendations.push('Verificar condições de renderização (if/ternary)');
      recommendations.push('Verificar z-index e stacking context');
      recommendations.push('Verificar overflow hidden em containers pais');
    }

    // Click não funciona
    if (text.includes('click') || text.includes('clique') || text.includes('não funciona')) {
      recommendations.push('Verificar se elemento está sendo coberto por overlay');
      recommendations.push('Verificar pointer-events no CSS');
      recommendations.push('Testar com diferentes tamanhos de tela');
    }
  }

  private generateAccessibilityFix(
    element: ReturnType<typeof this.extractElementAttributes>,
    attributes: Record<string, string>
  ): CodeSuggestion {
    return {
      language: 'tsx',
      currentCode: `<${element.tag}\n  className="${attributes.class || ''}"\n  ${attributes.onclick ? `onClick={${attributes.onclick}}` : ''}\n>`,
      suggestedCode: `<${element.tag}\n  className="${attributes.class || ''}"\n  ${attributes.onclick ? `onClick={${attributes.onclick}}` : ''}\n  aria-label="Descreva a ação aqui"\n  role="${element.tag === 'div' ? 'button' : undefined}"\n  tabIndex={0}\n  onKeyDown={(e) => e.key === 'Enter' && handleClick()}\n>`,
      explanation: 'Torna o elemento acessível para teclado e screen readers',
    };
  }

  private calculateConfidence(insights: string[], issues: string[]): number {
    let score = 45;
    score += insights.length * 5;
    score += issues.length * 8;
    return Math.min(92, Math.max(35, score));
  }
}

// Helper
function elementInfoHasText(elementInfo: { textContent?: string }): boolean {
  return !!(elementInfo.textContent && elementInfo.textContent.trim().length > 0);
}

export default UIUXAnalyzer;
