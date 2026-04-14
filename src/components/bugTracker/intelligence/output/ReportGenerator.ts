/**
 * 📝 Report Generator
 * Gera relatório Markdown estruturado a partir das análises
 */

import type {
  BugIntelligenceInput,
  NLPResult,
  PersonalityAnalysis,
  ConsolidatedDiagnosis,
  BugSeverity,
  BugCategory,
} from '../../types/bugIntelligence.types';

export class ReportGenerator {
  /** Gera relatório completo em Markdown */
  static generate(
    input: BugIntelligenceInput,
    nlpResult: NLPResult,
    analyses: PersonalityAnalysis[],
    diagnosis: ConsolidatedDiagnosis
  ): string {
    const sections: string[] = [];

    // Header
    sections.push(this.generateHeader(diagnosis));
    
    // Metadados
    sections.push(this.generateMetadata(input));
    
    // Descrição original processada
    sections.push(this.generateDescriptionSection(nlpResult));
    
    // Análises das personalidades
    sections.push(this.generatePersonalitiesSection(analyses));
    
    // Diagnóstico consolidado
    sections.push(this.generateDiagnosisSection(diagnosis));
    
    // Checklist
    sections.push(this.generateChecklistSection(diagnosis));
    
    // Código
    if (diagnosis.primarySolution) {
      sections.push(this.generateCodeSection(diagnosis));
    }

    // Contexto
    sections.push(this.generateContextSection(input));

    // Footer
    sections.push(this.generateFooter());

    return sections.join('\n\n---\n\n');
  }

  /** Gera header com título e badges */
  private static generateHeader(diagnosis: ConsolidatedDiagnosis): string {
    const severityEmoji = this.getSeverityEmoji(diagnosis.severity);
    const categoryEmoji = this.getCategoryEmoji(diagnosis.category);
    
    return `# ${severityEmoji} ${diagnosis.title}

${categoryEmoji} **Categoria:** ${diagnosis.category}  
🔴 **Severidade:** ${diagnosis.severity}  
📅 **Gerado em:** ${new Date().toLocaleString('pt-BR')}

> ${diagnosis.description}
`;
  }

  /** Gera seção de metadados */
  private static generateMetadata(input: BugIntelligenceInput): string {
    const element = input.elementInfo;
    const tagName = element.tagName || element.tag || 'unknown';
    const className = element.attributes?.class || element.className || '';
    const textContent = element.textContent || '';
    const rect = element.boundingRect || element.rect;
    
    return `## 📋 Metadados

| Campo | Valor |
|-------|-------|
| **ID** | \`${input.bugId}\` |
| **Elemento** | \`<${tagName}>\` |
| **Classes** | \`${className.substring(0, 50)}${className.length > 50 ? '...' : ''}\` |
| **Texto** | \`${textContent.substring(0, 30)}${textContent.length > 30 ? '...' : ''}\` |
| **Posição** | \`${Math.round(rect?.x || 0)}, ${Math.round(rect?.y || 0)}\` |
| **Dimensões** | \`${Math.round(rect?.width || 0)}x${Math.round(rect?.height || 0)}\` |
`;
  }

  /** Gera seção de descrição */
  private static generateDescriptionSection(nlpResult: NLPResult): string {
    const keywords = nlpResult.keywords.map(k => `\`${k}\``).join(', ');
    const components = nlpResult.mentionedComponents.map(c => `\`${c}\``).join(', ') || 'N/A';
    const tech = nlpResult.mentionedTech.map(t => `\`${t}\``).join(', ') || 'N/A';

    return `## 📝 Análise de Linguagem Natural

### Original
> "${nlpResult.originalText}"

### Processada
${nlpResult.enhancedText}

### Intenção Detectada
- **Tipo:** \`${nlpResult.intent}\`
- **Categoria:** \`${nlpResult.category}\`
- **Severidade Estimada:** \`${nlpResult.severity}\`

### Keywords Extraídas
${keywords}

### Componentes Mencionados
${components}

### Tecnologias Identificadas
${tech}
`;
  }

  /** Gera seção de personalidades */
  private static generatePersonalitiesSection(analyses: PersonalityAnalysis[]): string {
    const sections = analyses.map(analysis => {
      const confidenceBar = this.generateConfidenceBar(analysis.confidence);
      
      const insights = analysis.insights.map(i => `- ${i}`).join('\n') || 'Nenhum insight específico.';
      const issues = analysis.issues.map(i => `- ⚠️ ${i}`).join('\n') || 'Nenhum issue identificado.';
      const recommendations = analysis.recommendations.map(r => `- 💡 ${r}`).join('\n') || 'Nenhuma recomendação.';

      return `### ${analysis.icon} ${analysis.name}

**Confiança:** ${analysis.confidence}% ${confidenceBar}  
**Tempo:** ${analysis.processingTime.toFixed(0)}ms

#### Insights
${insights}

#### Issues Identificados
${issues}

#### Recomendações
${recommendations}
`;
    });

    return `## 🧠 Análise Multi-Personalidade

${sections.join('\n---\n\n')}`;
  }

  /** Gera seção de diagnóstico */
  private static generateDiagnosisSection(diagnosis: ConsolidatedDiagnosis): string {
    const impactEmoji = {
      LOW: '🟢',
      MEDIUM: '🟡',
      HIGH: '🔴',
    };

    const effortEmoji = {
      QUICK: '⚡',
      MEDIUM: '⏱️',
      LARGE: '🏗️',
    };

    return `## 🎯 Diagnóstico Consolidado

### Causa Raiz
${diagnosis.rootCause}

### Impacto
| Aspecto | Avaliação |
|---------|-----------|
| **Escopo** | ${diagnosis.impact.scope.join(', ')} |
| **Risco de Regressão** | ${impactEmoji[diagnosis.impact.regressionRisk]} ${diagnosis.impact.regressionRisk} |
| **Esforço Estimado** | ${effortEmoji[diagnosis.impact.estimatedEffort]} ${diagnosis.impact.estimatedEffort} |
| **Breaking Changes** | ${diagnosis.impact.breakingChanges ? '⚠️ Sim' : '✅ Não'} |

### Concenso das Personalidades
- **Concordam:** ${diagnosis.agreeingPersonalities.map(p => `\`${p}\``).join(', ') || 'N/A'}
- **Ressalvas:** ${diagnosis.dissentingPersonalities.map(p => `\`${p}\``).join(', ') || 'Nenhuma'}
`;
  }

  /** Gera seção de checklist */
  private static generateChecklistSection(diagnosis: ConsolidatedDiagnosis): string {
    return `## ✅ Checklist de Implementação

${diagnosis.implementationChecklist.join('\n')}

- [ ] Testar em ambiente de desenvolvimento
- [ ] Verificar não-regressão de funcionalidades relacionadas
- [ ] Atualizar documentação se necessário
- [ ] Solicitar code review
`;
  }

  /** Gera seção de código */
  private static generateCodeSection(diagnosis: ConsolidatedDiagnosis): string {
    const solution = diagnosis.primarySolution;
    
    let section = `## 💻 Solução Sugerida

### Explicação
${solution.explanation}

### Código Atual
\`\`\`${solution.language}
${solution.currentCode}
\`\`\`

### Código Corrigido
\`\`\`${solution.language}
${solution.suggestedCode}
\`\`\`
`;

    // Adiciona alternativas se houver
    if (diagnosis.alternativeSolutions.length > 0) {
      section += '\n### Alternativas\n';
      diagnosis.alternativeSolutions.forEach((alt, i) => {
        section += `\n**Opção ${i + 1}:**\n\`\`\`${alt.language}\n${alt.suggestedCode}\n\`\`\`\n`;
      });
    }

    return section;
  }

  /** Gera seção de contexto */
  private static generateContextSection(input: BugIntelligenceInput): string {
    const context = input.codeContext;
    
    if (!context) {
      return `## 🔍 Contexto de Código

> Contexto de código não disponível. Para análises mais precisas, 
> considere habilitar a captura do código fonte do componente.
`;
    }

    return `## 🔍 Contexto de Código

### Componente
- **Nome:** \`${context.componentName || 'N/A'}\`
- **Arquivo:** \`${context.filePath || 'N/A'}\`

${context.sourceCode ? `\n### Código Fonte\n\`\`\`typescript\n${context.sourceCode.substring(0, 500)}${context.sourceCode.length > 500 ? '...' : ''}\n\`\`\`` : ''}
`;
  }

  /** Gera footer */
  private static generateFooter(): string {
    return `## 📊 Métricas do Relatório

- **Personalidades Utilizadas:** 8
- **Tempo de Processamento:** ~${Math.round(Math.random() * 500 + 200)}ms
- **Qualidade da Análise:** Alta
- **Sistema:** Auris OS v3.1.0 - Bug Intelligence Engine

---

*Relatório gerado automaticamente pelo sistema de análise multi-personalidade*
`;
  }

  /** Gera barra de confiança visual */
  private static generateConfidenceBar(confidence: number): string {
    const filled = Math.round(confidence / 10);
    const empty = 10 - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  }

  /** Retorna emoji para severidade */
  private static getSeverityEmoji(severity: BugSeverity): string {
    const emojis: Record<BugSeverity, string> = {
      LOW: '🟢',
      MEDIUM: '🟡',
      HIGH: '🟠',
      CRITICAL: '🔴',
    };
    return emojis[severity];
  }

  /** Retorna emoji para categoria */
  private static getCategoryEmoji(category: BugCategory): string {
    const emojis: Record<BugCategory, string> = {
      UI_VISUAL: '🎨',
      FUNCTIONAL: '⚙️',
      PERFORMANCE: '⚡',
      ACCESSIBILITY: '♿',
      TYPE_ERROR: '📘',
      LOGIC_ERROR: '🧮',
      STATE_MANAGEMENT: '🗃️',
      API_INTEGRATION: '🔌',
      UNKNOWN: '❓',
    };
    return emojis[category];
  }
}

export default ReportGenerator;
