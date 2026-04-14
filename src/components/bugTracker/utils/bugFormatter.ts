/**
 * 📝 Bug Formatter
 * Formata reports de bug para Markdown
 */

import type { BugReport } from '../types/bugTracker.types';

/** Gera nome de arquivo baseado no timestamp */
export function generateReportFileName(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

/** Formata data para exibição */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/** Gera emoji para severidade */
export function getSeverityEmoji(severity: string): string {
  const emojis: Record<string, string> = {
    critical: '🔴',
    high: '🟠',
    medium: '🟡',
    low: '🔵',
  };
  return emojis[severity] || '⚪';
}

/** Gera emoji para tipo */
export function getTypeEmoji(type: string): string {
  const emojis: Record<string, string> = {
    bug: '🐛',
    improvement: '✨',
    question: '❓',
  };
  return emojis[type] || '📝';
}

/** Gera emoji para status */
export function getStatusEmoji(status: string): string {
  const emojis: Record<string, string> = {
    pending: '⏳',
    analyzing: '🔍',
    fixed: '✅',
    wontfix: '🚫',
  };
  return emojis[status] || '⚪';
}

/** Converte report para Markdown */
export function reportToMarkdown(report: BugReport): string {
  const lines: string[] = [];
  
  // Header
  lines.push(`# ${getTypeEmoji(report.type)} Bug Report`);
  lines.push('');
  
  // Informações Gerais
  lines.push('## 📋 Informações Gerais');
  lines.push('');
  lines.push('| Campo | Valor |');
  lines.push('|-------|-------|');
  lines.push(`| **ID** | \`${report.id}\` |`);
  lines.push(`| **Data** | ${formatDate(report.createdAt)} |`);
  lines.push(`| **Tipo** | ${getTypeEmoji(report.type)} ${capitalize(report.type)} |`);
  lines.push(`| **Severidade** | ${getSeverityEmoji(report.severity)} ${capitalize(report.severity)} |`);
  lines.push(`| **Status** | ${getStatusEmoji(report.status)} ${capitalize(report.status)} |`);
  lines.push(`| **Reportado por** | ${report.reportedBy} |`);
  lines.push('');
  
  // Elemento Afetado
  lines.push('## 🎯 Elemento Afetado');
  lines.push('');
  lines.push('| Campo | Valor |');
  lines.push('|-------|-------|');
  lines.push(`| **Tag** | \`${report.element.tag}\` |`);
  lines.push(`| **ID** | \`${report.element.id || 'N/A'}\` |`);
  lines.push(`| **Classes** | \`${report.element.className || 'N/A'}\` |`);
  lines.push(`| **Seletor CSS** | \`${report.element.selector}\` |`);
  lines.push(`| **XPath** | \`${report.element.xpath}\` |`);
  
  if (report.element.componentName) {
    lines.push(`| **Componente React** | \`${report.element.componentName}\` |`);
  }
  
  lines.push(`| **Dimensões** | ${Math.round(report.element.rect.width)}x${Math.round(report.element.rect.height)}px |`);
  lines.push(`| **Posição** | (x: ${Math.round(report.element.rect.x)}, y: ${Math.round(report.element.rect.y)}) |`);
  lines.push('');
  
  // Hierarquia
  if (report.element.parentChain.length > 0) {
    lines.push('## 🌳 Hierarquia (Parent Chain)');
    lines.push('');
    lines.push('```');
    
    let indent = '';
    for (let i = report.element.parentChain.length - 1; i >= 0; i--) {
      const parent = report.element.parentChain[i];
      let line = indent + parent.tag;
      if (parent.id) line += `#${parent.id}`;
      if (parent.className) line += `.${parent.className.split(' ').slice(0, 2).join('.')}`;
      lines.push(line);
      indent += '  ';
    }
    
    // Elemento atual
    let currentLine = indent + report.element.tag;
    if (report.element.id) currentLine += `#${report.element.id}`;
    if (report.element.className) {
      currentLine += `.${report.element.className.split(' ').slice(0, 2).join('.')}`;
    }
    currentLine += '  ← ELEMENTO';
    lines.push(currentLine);
    
    lines.push('```');
    lines.push('');
  }
  
  // Descrição
  lines.push('## 📝 Descrição do Problema');
  lines.push('');
  lines.push(report.description);
  lines.push('');
  
  // Comportamento esperado
  if (report.expectedBehavior) {
    lines.push('## ✅ Comportamento Esperado');
    lines.push('');
    lines.push(report.expectedBehavior);
    lines.push('');
  }
  
  // Screenshot
  if (report.screenshotPath) {
    lines.push('## 📸 Screenshot');
    lines.push('');
    lines.push(`![Screenshot](${report.screenshotPath})`);
    lines.push('');
  }
  
  // URL
  lines.push('## 🌐 Contexto');
  lines.push('');
  lines.push(`**URL:** ${report.pageUrl}`);
  lines.push('');
  
  // Análise (preenchido pelo AI)
  lines.push('## 🔧 Análise e Correção');
  lines.push('');
  lines.push('> *Esta seção é preenchida pelo AI após análise*');
  lines.push('');
  
  if (report.analysis) {
    lines.push('### Causa Raiz');
    lines.push(report.analysis.rootCause);
    lines.push('');
    
    lines.push('### Solução Aplicada');
    lines.push(report.analysis.solution);
    lines.push('');
    
    lines.push('### Arquivos Modificados');
    report.analysis.filesModified.forEach(file => {
      lines.push(`- \`${file}\``);
    });
    lines.push('');
    
    if (report.analysis.aiNotes) {
      lines.push('### Notas do Desenvolvedor');
      lines.push(report.analysis.aiNotes);
      lines.push('');
    }
    
    if (report.resolvedAt) {
      lines.push(`**Resolvido em:** ${formatDate(report.resolvedAt)}`);
      lines.push('');
    }
  } else {
    lines.push('⏳ Aguardando análise...');
    lines.push('');
  }
  
  // Checklist
  lines.push('---');
  lines.push('');
  lines.push('## ✅ Checklist de Correção');
  lines.push('');
  const isFixed = report.status === 'fixed';
  lines.push(`- [${isFixed ? 'x' : ' '}] Identificar causa raiz`);
  lines.push(`- [${isFixed ? 'x' : ' '}] Implementar correção`);
  lines.push(`- [${isFixed ? 'x' : ' '}] Testar solução`);
  lines.push(`- [${isFixed ? 'x' : ' '}] Atualizar documentação`);
  lines.push(`- [${isFixed ? 'x' : ' '}] Marcar como resolvido`);
  lines.push('');
  
  return lines.join('\n');
}

/** Gera resumo consolidado de todos os bugs */
export function generateSummaryMarkdown(reports: BugReport[]): string {
  const lines: string[] = [];
  
  lines.push('# 📊 Resumo de Bugs');
  lines.push('');
  lines.push(`**Total:** ${reports.length} reports`);
  lines.push('');
  
  // Por status
  const byStatus = {
    pending: reports.filter(r => r.status === 'pending'),
    analyzing: reports.filter(r => r.status === 'analyzing'),
    fixed: reports.filter(r => r.status === 'fixed'),
    wontfix: reports.filter(r => r.status === 'wontfix'),
  };
  
  lines.push('## 📈 Por Status');
  lines.push('');
  lines.push(`- ${getStatusEmoji('pending')} **Pendentes:** ${byStatus.pending.length}`);
  lines.push(`- ${getStatusEmoji('analyzing')} **Em Análise:** ${byStatus.analyzing.length}`);
  lines.push(`- ${getStatusEmoji('fixed')} **Resolvidos:** ${byStatus.fixed.length}`);
  lines.push(`- ${getStatusEmoji('wontfix')} **Não Serão Corrigidos:** ${byStatus.wontfix.length}`);
  lines.push('');
  
  // Por severidade
  const bySeverity = {
    critical: reports.filter(r => r.severity === 'critical'),
    high: reports.filter(r => r.severity === 'high'),
    medium: reports.filter(r => r.severity === 'medium'),
    low: reports.filter(r => r.severity === 'low'),
  };
  
  lines.push('## 🔴 Por Severidade');
  lines.push('');
  lines.push(`- ${getSeverityEmoji('critical')} **Críticos:** ${bySeverity.critical.length}`);
  lines.push(`- ${getSeverityEmoji('high')} **Altos:** ${bySeverity.high.length}`);
  lines.push(`- ${getSeverityEmoji('medium')} **Médios:** ${bySeverity.medium.length}`);
  lines.push(`- ${getSeverityEmoji('low')} **Baixos:** ${bySeverity.low.length}`);
  lines.push('');
  
  // Lista de pendentes
  if (byStatus.pending.length > 0) {
    lines.push('## ⏳ Bugs Pendentes');
    lines.push('');
    byStatus.pending.forEach(report => {
      lines.push(`- ${getSeverityEmoji(report.severity)} **${report.id}** - ${report.element.tag} ${report.element.className.slice(0, 30)}...`);
    });
    lines.push('');
  }
  
  return lines.join('\n');
}

/** Helper para capitalizar string */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
