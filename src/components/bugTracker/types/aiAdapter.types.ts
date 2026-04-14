/**
 * AIAdapter
 * Interface genérica para integração do Bug Tracker com IA do sistema hospedeiro.
 * Permite que o bug tracker seja 100% standalone.
 */

export interface AIAdapter {
  /** Enriquece a descrição de um bug com análise técnica e retorna em formato Markdown */
  enhanceReport(context: {
    description: string;
    elementTag: string;
    elementSelector: string;
    elementClasses: string;
    pageUrl: string;
    screenshotBase64?: string;
    markdownContext?: string;
  }): Promise<{
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    markdown: string;
  }>;
  /** Chat opcional com contexto do bug */
  chat?(context: {
    description: string;
    elementTag: string;
    elementSelector: string;
    pageUrl: string;
  }, message: string): Promise<string>;
}
