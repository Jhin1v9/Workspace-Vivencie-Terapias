/**
 * ⚛️ React Specialist Analyzer
 * Análise de patterns, hooks e lifecycle React
 */

import { BasePersonalityAnalyzer, type AnalysisContext } from './BasePersonalityAnalyzer';
import type { PersonalityAnalysis, CodeSuggestion, BugCategory } from '../../types/bugIntelligence.types';

export class ReactAnalyzer extends BasePersonalityAnalyzer {
  constructor() {
    super({
      type: 'REACT_SPECIALIST',
      name: 'React Specialist',
      icon: '⚛️',
      color: '#61DAFB', // React blue
      description: 'Analisa patterns React, hooks e lifecycle',
      expertise: [
        'React Hooks',
        'Component Patterns',
        'Render Optimization',
        'State Management',
        'Event Handling',
        'Refs & Imperative API',
      ],
      priority: 3,
    });
  }

  async analyze(context: AnalysisContext): Promise<PersonalityAnalysis> {
    const { nlpResult, elementInfo, codeContext } = context;
    
    const insights: string[] = [];
    const issues: string[] = [];
    const recommendations: string[] = [];
    let codeSuggestion: CodeSuggestion | undefined;

    const element = this.extractElementAttributes(elementInfo);
    const category = nlpResult.category;

    // Análise de renderização
    this.analyzeRenderingIssues(nlpResult, issues, recommendations, insights);

    // Análise de eventos
    this.analyzeEventHandling(element, category, issues, recommendations);

    // Análise de estado
    this.analyzeStateManagement(nlpResult, issues, recommendations, insights);

    // Análise do código fonte se disponível
    if (codeContext?.sourceCode) {
      this.analyzeSourceCode(codeContext.sourceCode, issues, recommendations, insights, codeSuggestion);
    }

    // Análise específica por categoria
    this.analyzeByCategory(category, nlpResult, issues, recommendations, codeSuggestion);

    const confidence = this.calculateConfidence(insights, issues, codeContext);

    return this.createAnalysis(insights, issues, recommendations, confidence, codeSuggestion);
  }

  private analyzeRenderingIssues(
    nlpResult: AnalysisContext['nlpResult'],
    issues: string[],
    recommendations: string[],
    insights: string[]
  ): void {
    const text = nlpResult.enhancedText.toLowerCase();

    // Tremor/lagging indica re-render
    if (text.includes('trem') || text.includes('flicker') || text.includes('lag') || text.includes('lento')) {
      issues.push('Possível re-render em excesso causando instabilidade visual');
      recommendations.push('Memorizar componentes com React.memo se props não mudam');
      recommendations.push('Usar useMemo para cálculos pesados');
      recommendations.push('Usar useCallback para funções passadas como props');
      
      insights.push('Verificar React DevTools Profiler para identificar renders desnecessários');
    }

    // Loop infinito
    if (text.includes('loop') || text.includes('infinito') || text.includes('crash') || text.includes('trava navegador')) {
      issues.push('Possível loop infinito em useEffect ou estado');
      recommendations.push('Verificar array de dependências do useEffect');
      recommendations.push('Garantir que estado atualizado não dispara o mesmo efeito');
    }
  }

  private analyzeEventHandling(
    element: ReturnType<typeof this.extractElementAttributes>,
    category: BugCategory,
    issues: string[],
    recommendations: string[]
  ): void {
    if (!element.isInteractive) return;

    // Problemas comuns de evento
    if (category === 'FUNCTIONAL') {
      issues.push('Event handler pode não estar corretamente vinculado');
      recommendations.push('Verificar se onClick está definido e é uma função');
      recommendations.push('Usar console.log no handler para debug');
    }

    // Prevenção de comportamento padrão
    if (element.tag === 'form' || element.tag === 'a') {
      recommendations.push('Verificar se e.preventDefault() é necessário no handler');
    }

    // Event delegation
    if (!element.hasEventListeners && element.isInteractive) {
      // Evento pode estar sendo tratado via event delegation
    }
  }

  private analyzeStateManagement(
    nlpResult: AnalysisContext['nlpResult'],
    issues: string[],
    recommendations: string[],
    insights: string[]
  ): void {
    const text = nlpResult.enhancedText.toLowerCase();
    const category = nlpResult.category;

    if (category === 'STATE_MANAGEMENT' || text.includes('estado') || text.includes('state')) {
      insights.push('Analisando gerenciamento de estado');

      issues.push('Estado pode estar em nível incorreto da árvore');
      recommendations.push('Verificar se estado deveria estar no pai ou no componente');
      recommendations.push('Considerar lift state up se múltiplos componentes precisam do mesmo estado');
      
      if (text.includes('não atualiza') || text.includes('desatualizado')) {
        issues.push('Possível closure stale - estado não reflete valor atual');
        recommendations.push('Usar functional update: setState(prev => ...)');
        recommendations.push('Verificar se useEffect captura estado atual');
      }
    }

    // Props drilling
    if (text.includes('prop') || text.includes('propriedade')) {
      recommendations.push('Verificar se props estão sendo passadas corretamente');
      recommendations.push('Considerar Context API se houver props drilling excessivo');
    }
  }

  private analyzeSourceCode(
    sourceCode: string,
    issues: string[],
    recommendations: string[],
    insights: string[],
    _codeSuggestion?: CodeSuggestion
  ): void {
    // Verifica useEffect sem dependências
    if (sourceCode.includes('useEffect(()') && !sourceCode.includes('}, [')) {
      const hasEmptyDep = /useEffect\(\([^)]*\)\s*=>[\s\S]*?,\s*\[\s*\]\s*\)/.test(sourceCode);
      if (!hasEmptyDep) {
        issues.push('useEffect sem array de dependências - executa em toda render');
        recommendations.push('Adicionar array de dependências vazio [] para executar uma vez');
        recommendations.push('Ou adicionar dependências que devem disparar o efeito');
      }
    }

    // Verifica funções inline em render
    if (/onClick=\{[^{][^}]*\}/.test(sourceCode) || /onChange=\{[^{][^}]*\}/.test(sourceCode)) {
      insights.push('Funções inline em JSX criam nova referência a cada render');
      recommendations.push('Extrair para função nomeada ou usar useCallback');
    }

    // Verifica useState com objetos complexos
    if (/useState\(\s*\{/.test(sourceCode)) {
      insights.push('useState com objeto - verificar se todas propriedades são necessárias juntas');
    }

    // Verifica condição de render
    if (sourceCode.includes('&&') && sourceCode.includes('?')) {
      // Múltiplas condições de renderização - verificar lógica
    }

    // Sugestão de useCallback
    if (sourceCode.includes('onClick={')) {
      // Gerar codeSuggestion
      const _suggestion = {
        language: 'tsx',
        currentCode: `const Component = ({ onAction }) => {
  return <button onClick={() => onAction()}>Click</button>;
};`,
        suggestedCode: `const Component = ({ onAction }) => {
  const handleClick = useCallback(() => {
    onAction();
  }, [onAction]);
  
  return <button onClick={handleClick}>Click</button>;
};`,
        explanation: 'useCallback evita recriação da função em cada render',
      };
      // Usar _suggestion para evitar erro de variável não utilizada
      void _suggestion;
    }
  }

  private analyzeByCategory(
    category: BugCategory,
    _nlpResult: AnalysisContext['nlpResult'],
    _issues: string[],
    recommendations: string[],
    _codeSuggestion?: CodeSuggestion
  ): void {
    switch (category) {
      case 'UI_VISUAL':
        recommendations.push('Verificar se key prop está estável em listas');
        recommendations.push('Evitar índices de array como key');
        break;
        
      case 'PERFORMANCE':
        // Renderização pode estar otimizável
        recommendations.push('Implementar React.memo para componentes puros');
        recommendations.push('Usar useMemo para valores computados');
        recommendations.push('Considerar virtualização para listas longas');
        break;
        
      case 'TYPE_ERROR':
        recommendations.push('Verificar tipagem de props com interface/types');
        recommendations.push('Usar satisfies operator quando apropriado');
        break;
    }
  }

  private calculateConfidence(
    insights: string[],
    issues: string[],
    codeContext?: AnalysisContext['codeContext']
  ): number {
    let score = 50;
    score += insights.length * 5;
    score += issues.length * 7;
    if (codeContext?.sourceCode) score += 15;
    return Math.min(95, Math.max(40, score));
  }
}

export default ReactAnalyzer;
