/**
 * 🏗️ Arquiteto Analyzer
 * Análise estrutural e de patterns
 */

import { BasePersonalityAnalyzer, type AnalysisContext } from './BasePersonalityAnalyzer';
import type { PersonalityAnalysis, CodeSuggestion } from '../../types/bugIntelligence.types';

export class ArquitetoAnalyzer extends BasePersonalityAnalyzer {
  constructor() {
    super({
      type: 'ARQUITETO',
      name: 'Arquiteto',
      icon: '🏗️',
      color: '#3B82F6', // blue-500
      description: 'Analisa estrutura, patterns e arquitetura do código',
      expertise: [
        'Component Architecture',
        'Design Patterns',
        'Separation of Concerns',
        'Code Organization',
        'Module Boundaries',
        'Dependency Management',
      ],
      priority: 1,
    });
  }

  async analyze(context: AnalysisContext): Promise<PersonalityAnalysis> {
    const { nlpResult, elementInfo, codeContext } = context;
    
    const insights: string[] = [];
    const issues: string[] = [];
    const recommendations: string[] = [];
    let codeSuggestion: CodeSuggestion | undefined;

    const element = this.extractElementAttributes(elementInfo);
    const tailwind = this.analyzeTailwindClasses(element.classes);

    // Análise de contexto estrutural
    if (codeContext?.componentName) {
      insights.push(`Analisando componente: ${codeContext.componentName}`);
      
      // Verifica se é um componente grande
      if (codeContext.sourceCode) {
        const lineCount = codeContext.sourceCode.split('\n').length;
        if (lineCount > 200) {
          issues.push(`Componente muito grande (${lineCount} linhas) - viola Single Responsibility Principle`);
          recommendations.push('Considerar divisão em sub-componentes menores');
        }
      }
    }

    // Análise de hierarquia DOM
    const parentTagName = elementInfo.parentTagName || elementInfo.parentChain?.[0]?.tag;
    if (parentTagName) {
      insights.push(`Elemento filho de <${parentTagName}>`);
      
      // Verifica nesting problemático
      if (parentTagName === 'button' && element.tag === 'button') {
        issues.push('Nesting inválido: button dentro de button é semanticamente incorreto');
        recommendations.push('Usar div com role="button" ou reestruturar componente');
      }
      
      if (parentTagName === 'a' && element.tag === 'a') {
        issues.push('Nesting inválido: âncora dentro de âncora');
        recommendations.push('Remover aninhamento de links');
      }
    }

    // Análise de classes Tailwind - arquitetura
    if (!tailwind.hasLayout) {
      issues.push('Ausência de sistema de layout pode indicar inconsistência visual');
      recommendations.push('Adotar sistema de layout consistente (flex/grid)');
    }

    // Verifica complexidade de classes
    if (element.classes.length > 15) {
      issues.push(`Alta complexidade de estilos (${element.classes.length} classes)`);
      recommendations.push('Extrair classes para componente reutilizável ou usar @apply');
      
      codeSuggestion = {
        language: 'css',
        currentCode: `className="${element.classes.join(' ')}"`,
        suggestedCode: `// Criar componente reutilizável\nconst StyledComponent = () => (\n  <div className={cn(\n    "base-styles",\n    variantStyles[variant],\n    className\n  )} />\n);`,
        explanation: 'Extrair classes para um componente com variants reduz duplicação',
      };
    }

    // Análise de padrões baseada na categoria
    switch (nlpResult.category) {
      case 'STATE_MANAGEMENT':
        insights.push('Problema potencial na arquitetura de estado');
        recommendations.push('Verificar se estado está no nível correto da árvore');
        recommendations.push('Considerar Zustand para estado global se necessário');
        break;
        
      case 'API_INTEGRATION':
        insights.push('Possível violação de separation of concerns');
        recommendations.push('Mover lógica de API para custom hooks');
        recommendations.push('Considerar React Query para caching e estado server');
        break;
        
      case 'UI_VISUAL':
        insights.push('Inconsistência visual pode indicar falta de design system');
        recommendations.push('Verificar se existe componente equivalente no design system');
        break;
    }

    // Verifica props se disponíveis
    if (codeContext?.props) {
      const propCount = Object.keys(codeContext.props).length;
      if (propCount > 8) {
        issues.push(`Muitas props (${propCount}) - viola Interface Segregation Principle`);
        recommendations.push('Agrupar props relacionadas em objetos ou dividir componente');
      }
    }

    // Calcula confiança
    const confidence = this.calculateConfidence(insights, issues, recommendations);

    return this.createAnalysis(
      insights,
      issues,
      recommendations,
      confidence,
      codeSuggestion
    );
  }

  private calculateConfidence(
    insights: string[],
    issues: string[],
    recommendations: string[]
  ): number {
    let score = 50; // Base
    
    score += insights.length * 5;
    score += issues.length * 10;
    score += recommendations.length * 5;
    
    return Math.min(95, Math.max(30, score));
  }
}

export default ArquitetoAnalyzer;
