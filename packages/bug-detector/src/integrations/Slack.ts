/**
 * Integração com Slack
 */

import type { BugReport, SlackConfig } from '../types';

export class SlackIntegration {
  private config: SlackConfig;

  constructor(config: SlackConfig) {
    this.config = config;
  }

  /** Envia notificação de bug */
  async notify(report: BugReport, channel?: string): Promise<void> {
    const payload = this.generatePayload(report, channel);

    const response = await fetch(this.config.webhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Erro ao enviar notificação: ${response.statusText}`);
    }
  }

  /** Envia notificação simples */
  async sendMessage(text: string, channel?: string): Promise<void> {
    const payload: any = { text };
    
    if (channel || this.config.channel) {
      payload.channel = channel || this.config.channel;
    }

    const response = await fetch(this.config.webhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Erro ao enviar mensagem: ${response.statusText}`);
    }
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  private generatePayload(report: BugReport, channel?: string): any {
    const color = this.getSeverityColor(report.severity);
    const emoji = this.getTypeEmoji(report.type);

    const payload: any = {
      text: `${emoji} Novo bug reportado`,
      attachments: [
        {
          color,
          fields: [
            {
              title: 'Descrição',
              value: report.description.slice(0, 300),
              short: false,
            },
            {
              title: 'Severidade',
              value: report.severity.toUpperCase(),
              short: true,
            },
            {
              title: 'Elemento',
              value: `\`${report.element.selector}\``,
              short: true,
            },
            {
              title: 'URL',
              value: report.url,
              short: false,
            },
          ],
          footer: 'BugDetector Pro',
          ts: Math.floor(report.timestamp / 1000),
        },
      ],
    };

    if (channel || this.config.channel) {
      payload.channel = channel || this.config.channel;
    }

    // Adiciona análise IA se disponível
    if (report.aiAnalysis) {
      payload.attachments[0].fields.push({
        title: 'Causa Raiz (IA)',
        value: report.aiAnalysis.rootCause.slice(0, 300),
        short: false,
      });
    }

    // Adiciona screenshot se disponível
    if (report.screenshot) {
      // Slack não suporta base64 diretamente no webhook
      // Seria necessário fazer upload para um servidor primeiro
      payload.attachments[0].fields.push({
        title: 'Screenshot',
        value: 'Disponível no relatório completo',
        short: false,
      });
    }

    // Adiciona ações
    payload.attachments[0].actions = [
      {
        type: 'button',
        text: 'Ver Detalhes',
        url: report.url,
        style: 'primary',
      },
    ];

    return payload;
  }

  private getSeverityColor(severity: BugReport['severity']): string {
    const colors: Record<string, string> = {
      critical: '#dc2626',
      high: '#ea580c',
      medium: '#ca8a04',
      low: '#16a34a',
    };
    return colors[severity] || '#6b7280';
  }

  private getTypeEmoji(type: BugReport['type']): string {
    const emojis: Record<string, string> = {
      bug: '🐛',
      improvement: '💡',
      question: '❓',
    };
    return emojis[type] || '📝';
  }
}

export default SlackIntegration;
