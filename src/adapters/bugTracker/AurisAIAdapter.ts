/**
 * AurisAIAdapter
 * Adapter que conecta o Bug Tracker standalone ao sistema de IA do AURIS OS
 */

import type { AIAdapter } from '@/components/bugTracker/types/aiAdapter.types';
import { callAI } from '@/services/aiProvider';

export const aurisAIAdapter: AIAdapter = {
  async enhanceReport(context) {
    const systemPrompt = `Você é um engenheiro de QA sênior. Analise o report de bug abaixo e melhore a descrição, especificando onde, como e quando ocorre. Responda em português do Brasil.

Retorne APENAS um JSON válido no formato:
{
  "title": "título curto e técnico",
  "description": "descrição técnica detalhada",
  "severity": "low" | "medium" | "high" | "critical",
  "markdown": "relatório completo em Markdown com cabeçalhos, tabelas e contexto técnico"
}

O campo "markdown" deve ser um relatório profissional em Markdown que inclua:
- Localização exata (URL, componente, seletor CSS, XPath)
- Descrição detalhada
- Estilos computados em tabela
- Instruções claras para um desenvolvedor corrigir o bug.`;

    const userContent = `Rota/URL: ${context.pageUrl}
Elemento: ${context.elementTag}
Seletor CSS: ${context.elementSelector}
Classes: ${context.elementClasses}
Descrição original: ${context.description}
${context.markdownContext ? `\nContexto adicional:\n${context.markdownContext}` : ''}
${context.screenshotBase64 ? '\nScreenshot anexado.' : ''}`;

    const result = await callAI(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent },
      ],
      { useFallback: true }
    );

    if (!result.text) {
      throw new Error(result.error || 'Falha ao obter resposta da IA');
    }

    try {
      const jsonMatch = result.text.match(/\{[\s\S]*\}/);
      const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : result.text);
      return {
        title: String(parsed.title || 'Bug reportado'),
        description: String(parsed.description || context.description),
        severity: (['low', 'medium', 'high', 'critical'].includes(parsed.severity)
          ? parsed.severity
          : 'medium') as 'low' | 'medium' | 'high' | 'critical',
        markdown: String(parsed.markdown || parsed.description || result.text),
      };
    } catch {
      return {
        title: 'Bug reportado',
        description: result.text,
        severity: 'medium',
        markdown: result.text,
      };
    }
  },
};
