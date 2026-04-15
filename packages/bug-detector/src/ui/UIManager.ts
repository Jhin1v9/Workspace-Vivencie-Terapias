/**
 * Gerenciador de UI
 * Controla todos os elementos visuais da ferramenta
 */

import type { InspectedElement, BugReport, CreateReportData } from '../types';

/** Callbacks da UI */
interface UIManagerCallbacks {
  onActivate: () => void;
  onDeactivate: () => void;
  onElementInspect: (element: InspectedElement) => void;
  onCreateReport: (data: CreateReportData) => Promise<BugReport>;
  onSendMessage: (sessionId: string, message: string) => Promise<any>;
}

/** Classe UIManager */
export class UIManager {
  private callbacks: UIManagerCallbacks;
  private container: HTMLElement | null = null;
  private _isVisible = false;
  private _currentElement: InspectedElement | null = null;
  private zIndexBase: number;

  constructor(callbacks: UIManagerCallbacks, zIndexBase: number = 999999) {
    this.callbacks = callbacks;
    this.zIndexBase = zIndexBase;
    this.createContainer();
  }

  /** Mostra a UI */
  show(): void {
    if (!this.container) {
      this.createContainer();
    }
    this.container!.style.display = 'block';
    this._isVisible = true;
    this.renderFloatingButton();
  }

  /** Esconde a UI */
  hide(): void {
    if (this.container) {
      this.container.style.display = 'none';
    }
    this._isVisible = false;
  }

  /** Mostra modal de report */
  showReportModal(element: InspectedElement): void {
    this._currentElement = element;
    this.renderReportModal(element);
  }

  /** Atualiza tooltip do elemento */
  updateElementTooltip(element: InspectedElement | null): void {
    this.renderTooltip(element);
  }

  /** Destrói a UI */
  destroy(): void {
    if (this.container) {
      this.container.remove();
      this.container = null;
    }
  }

  // ============================================================================
  // PRIVATE METHODS - Container
  // ============================================================================

  private createContainer(): void {
    this.container = document.createElement('div');
    this.container.id = 'bug-detector-ui';
    this.container.setAttribute('data-bug-detector-ui', '');
    this.container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 2147483646;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    document.body.appendChild(this.container);
  }

  // ============================================================================
  // PRIVATE METHODS - Floating Button
  // ============================================================================

  private renderFloatingButton(): void {
    if (!this.container) return;

    // Remove botão existente
    const existing = this.container.querySelector('[data-bugdetector-floating-button]');
    if (existing) existing.remove();

    const button = document.createElement('button');
    button.setAttribute('data-bugdetector-floating-button', '');
    button.innerHTML = '🐛';
    button.title = 'BugDetector Pro';
    button.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      color: white;
      border: none;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      cursor: pointer;
      pointer-events: auto;
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      z-index: ${this.zIndexBase};
    `;

    button.addEventListener('mouseenter', () => {
      button.style.transform = 'scale(1.1)';
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = 'scale(1)';
    });

    button.addEventListener('click', () => {
      this.renderPanel();
    });

    this.container.appendChild(button);
  }

  // ============================================================================
  // PRIVATE METHODS - Tooltip
  // ============================================================================

  private renderTooltip(element: InspectedElement | null): void {
    if (!this.container) return;

    const existing = this.container.querySelector('[data-bugdetector-tooltip]');
    if (existing) existing.remove();

    if (!element) return;

    const tooltip = document.createElement('div');
    tooltip.setAttribute('data-bugdetector-tooltip', '');
    tooltip.style.cssText = `
      position: fixed;
      top: ${element.rect.top + element.rect.height + 8}px;
      left: ${element.rect.left}px;
      background: rgba(15, 23, 42, 0.95);
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 12px;
      pointer-events: none;
      z-index: ${this.zIndexBase};
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      border: 1px solid rgba(255,255,255,0.1);
      max-width: 320px;
    `;

    tooltip.innerHTML = `
      <div style="font-weight: 600; margin-bottom: 4px; color: #60a5fa;">
        &lt;${element.tag}&gt;
      </div>
      ${element.elementId ? `<div style="color: #94a3b8;">#${element.elementId}</div>` : ''}
      ${element.className ? `<div style="color: #94a3b8; margin-top: 2px;">${element.className.slice(0, 50)}${element.className.length > 50 ? '...' : ''}</div>` : ''}
      <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.1); color: #64748b;">
        ${Math.round(element.rect.width)}×${Math.round(element.rect.height)}px
      </div>
    `;

    this.container.appendChild(tooltip);
  }

  // ============================================================================
  // PRIVATE METHODS - Panel
  // ============================================================================

  private renderPanel(): void {
    if (!this.container) return;

    const existing = this.container.querySelector('[data-bugdetector-panel]');
    if (existing) {
      existing.remove();
      return;
    }

    const panel = document.createElement('div');
    panel.setAttribute('data-bugdetector-panel', '');
    panel.style.cssText = `
      position: fixed;
      top: 20px;
      right: 80px;
      width: 320px;
      background: rgba(15, 23, 42, 0.98);
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      pointer-events: auto;
      z-index: ${this.zIndexBase};
      border: 1px solid rgba(255,255,255,0.1);
      color: white;
      overflow: hidden;
    `;

    panel.innerHTML = `
      <div style="padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 20px;">🐛</span>
          <span style="font-weight: 600;">BugDetector Pro</span>
        </div>
        <button data-bugdetector-close-panel style="background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 18px; padding: 4px;">×</button>
      </div>
      <div style="padding: 16px;">
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <button data-bugdetector-btn-inspect style="padding: 12px; background: #3b82f6; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; display: flex; align-items: center; gap: 8px;">
            <span>🔍</span> Inspecionar Elemento
          </button>
          <button data-bugdetector-btn-reports style="padding: 12px; background: rgba(255,255,255,0.1); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; display: flex; align-items: center; gap: 8px;">
            <span>📋</span> Ver Reports
          </button>
          <button data-bugdetector-btn-settings style="padding: 12px; background: rgba(255,255,255,0.1); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; display: flex; align-items: center; gap: 8px;">
            <span>⚙️</span> Configurações
          </button>
        </div>
        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 12px; color: #64748b; text-align: center;">
          Pressione ESC para sair do modo inspeção
        </div>
      </div>
    `;

    // Event listeners
    panel.querySelector('[data-bugdetector-close-panel]')?.addEventListener('click', () => panel.remove());
    panel.querySelector('[data-bugdetector-btn-inspect]')?.addEventListener('click', () => {
      panel.remove();
      this.callbacks.onActivate();
    });
    panel.querySelector('[data-bugdetector-btn-reports]')?.addEventListener('click', () => {
      this.renderReportsList();
      panel.remove();
    });

    this.container.appendChild(panel);
  }

  // ============================================================================
  // PRIVATE METHODS - Report Modal
  // ============================================================================

  private renderReportModal(element: InspectedElement): void {
    if (!this.container) return;

    const modal = document.createElement('div');
    modal.setAttribute('data-bugdetector-report-modal', '');
    modal.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 480px;
      max-height: 80vh;
      background: rgba(15, 23, 42, 0.98);
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.5);
      pointer-events: auto;
      z-index: ${this.zIndexBase};
      border: 1px solid rgba(255,255,255,0.1);
      color: white;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    `;

    modal.innerHTML = `
      <div style="padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 24px;">📝</span>
          <div>
            <div style="font-weight: 600; font-size: 16px;">Novo Report</div>
            <div style="font-size: 12px; color: #64748b;">&lt;${element.tag}&gt;</div>
          </div>
        </div>
        <button data-bugdetector-close-modal style="background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 24px; padding: 4px;">×</button>
      </div>
      <div style="padding: 20px; overflow-y: auto; flex: 1;">
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-size: 12px; color: #94a3b8; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Tipo</label>
          <div style="display: flex; gap: 8px;">
            <button data-bugdetector-type-btn data-type="bug" data-active="true" style="flex: 1; padding: 10px; background: #ef4444; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 13px;">🐛 Bug</button>
            <button data-bugdetector-type-btn data-type="improvement" style="flex: 1; padding: 10px; background: rgba(255,255,255,0.1); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 13px;">💡 Melhoria</button>
          </div>
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-size: 12px; color: #94a3b8; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Severidade</label>
          <select data-bugdetector-severity style="width: 100%; padding: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: white; font-size: 14px;">
            <option value="low">🟢 Baixa</option>
            <option value="medium" selected>🟡 Média</option>
            <option value="high">🟠 Alta</option>
            <option value="critical">🔴 Crítica</option>
          </select>
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-size: 12px; color: #94a3b8; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Descrição *</label>
          <textarea data-bugdetector-description placeholder="Descreva o bug encontrado..." style="width: 100%; min-height: 100px; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: white; font-size: 14px; resize: vertical; font-family: inherit;"></textarea>
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-size: 12px; color: #94a3b8; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Comportamento Esperado</label>
          <textarea data-bugdetector-expected placeholder="Como deveria funcionar? (opcional)" style="width: 100%; min-height: 60px; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: white; font-size: 14px; resize: vertical; font-family: inherit;"></textarea>
        </div>
        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px;">
          <input type="checkbox" data-bugdetector-screenshot checked style="width: 18px; height: 18px;">
          <span>Incluir screenshot</span>
        </label>
      </div>
      <div style="padding: 20px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; gap: 12px;">
        <button data-bugdetector-btn-cancel style="flex: 1; padding: 12px; background: rgba(255,255,255,0.1); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px;">Cancelar</button>
        <button data-bugdetector-btn-submit style="flex: 1; padding: 12px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500;">Criar Report</button>
      </div>
    `;

    // Event listeners
    const closeModal = () => modal.remove();
    
    modal.querySelector('[data-bugdetector-close-modal]')?.addEventListener('click', closeModal);
    modal.querySelector('[data-bugdetector-btn-cancel]')?.addEventListener('click', closeModal);
    
    modal.querySelector('[data-bugdetector-btn-submit]')?.addEventListener('click', async () => {
      const description = (modal.querySelector('[data-bugdetector-description]') as HTMLTextAreaElement)?.value;
      if (!description?.trim()) {
        alert('Por favor, descreva o bug');
        return;
      }

      const activeTypeBtn = modal.querySelector('[data-bugdetector-type-btn][data-active="true"]') as HTMLElement;
      const type = activeTypeBtn?.dataset.type as 'bug' | 'improvement' | 'question';
      const severity = (modal.querySelector('[data-bugdetector-severity]') as HTMLSelectElement)?.value as 'low' | 'medium' | 'high' | 'critical';
      const expectedBehavior = (modal.querySelector('[data-bugdetector-expected]') as HTMLTextAreaElement)?.value;
      try {
        await this.callbacks.onCreateReport({
          description,
          type,
          severity,
          expectedBehavior,
          element,
        });

        closeModal();
        this.showSuccessToast('Report criado com sucesso!');
      } catch (error) {
        alert('Erro ao criar report: ' + (error as Error).message);
      }
    });

    // Type buttons
    modal.querySelectorAll('[data-bugdetector-type-btn]').forEach(btn => {
      btn.addEventListener('click', () => {
        modal.querySelectorAll('[data-bugdetector-type-btn]').forEach(b => {
          (b as HTMLElement).style.background = 'rgba(255,255,255,0.1)';
          b.removeAttribute('data-active');
        });
        (btn as HTMLElement).style.background = '#ef4444';
        btn.setAttribute('data-active', 'true');
      });
    });

    this.container.appendChild(modal);
  }

  // ============================================================================
  // PRIVATE METHODS - Reports List
  // ============================================================================

  private renderReportsList(): void {
    // Implementação da lista de reports
    this.showSuccessToast('Lista de reports - implementar');
  }

  // ============================================================================
  // PRIVATE METHODS - Toast
  // ============================================================================

  private showSuccessToast(message: string): void {
    if (!this.container) return;

    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: 100px;
      right: 20px;
      padding: 16px 24px;
      background: #10b981;
      color: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: ${this.zIndexBase};
      animation: slideIn 0.3s ease;
    `;
    toast.textContent = message;

    this.container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

export default UIManager;
