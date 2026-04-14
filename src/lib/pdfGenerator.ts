// ============================================================================
// GERADOR DE PDF PROFISSIONAL - AURIS OS
// Gera PDFs a partir de HTML/CSS usando jsPDF e html2canvas
// ============================================================================

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import type { Sessao, Paciente, ConfiguracaoSistema } from '@/types';

export interface PDFOptions {
  titulo?: string;
  subtitulo?: string;
  formato?: 'a4' | 'letter';
  orientacao?: 'portrait' | 'landscape';
  margem?: number;
}

// ============================================================================
// TEMPLATE HTML PARA FICHA DE SESSÃO
// ============================================================================

export const gerarTemplateSessao = (
  sessao: Sessao,
  paciente: Paciente,
  config: ConfiguracaoSistema
): string => {
  const dataSessao = new Date(sessao.data).toLocaleDateString('pt-BR');
  const dataNascimento = new Date(paciente.dados_pessoais.data_nascimento).toLocaleDateString('pt-BR');
  const idade = calcularIdade(paciente.dados_pessoais.data_nascimento);
  
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ficha de Sessão - ${paciente.dados_pessoais.nome}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 10pt;
      line-height: 1.4;
      color: #1f2937;
      background: white;
    }
    
    .container {
      max-width: 210mm;
      margin: 0 auto;
      padding: 15mm;
    }
    
    /* Cabeçalho */
    .header {
      background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%);
      color: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    
    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 15px;
    }
    
    .logo-area h1 {
      font-size: 24pt;
      font-weight: 700;
      margin-bottom: 5px;
    }
    
    .logo-area p {
      font-size: 9pt;
      opacity: 0.9;
    }
    
    .session-info {
      text-align: right;
    }
    
    .session-info .number {
      font-size: 28pt;
      font-weight: 700;
      line-height: 1;
    }
    
    .session-info .label {
      font-size: 8pt;
      opacity: 0.9;
    }
    
    .header-bottom {
      border-top: 1px solid rgba(255,255,255,0.3);
      padding-top: 10px;
      display: flex;
      justify-content: space-between;
      font-size: 9pt;
    }
    
    /* Seções */
    .section {
      margin-bottom: 20px;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      overflow: hidden;
    }
    
    .section-header {
      background: #f3f4f6;
      padding: 10px 15px;
      font-weight: 600;
      font-size: 11pt;
      color: #374151;
      border-bottom: 2px solid #14b8a6;
    }
    
    .section-content {
      padding: 15px;
    }
    
    /* Grid de informações */
    .info-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
    }
    
    .info-item {
      margin-bottom: 10px;
    }
    
    .info-item.full-width {
      grid-column: 1 / -1;
    }
    
    .info-label {
      font-size: 8pt;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 3px;
    }
    
    .info-value {
      font-size: 10pt;
      font-weight: 500;
      color: #1f2937;
    }
    
    /* Tabela de avaliação */
    .assessment-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    
    .assessment-table th {
      background: #f9fafb;
      padding: 10px;
      text-align: left;
      font-size: 9pt;
      font-weight: 600;
      color: #374151;
      border-bottom: 2px solid #e5e7eb;
    }
    
    .assessment-table td {
      padding: 10px;
      border-bottom: 1px solid #e5e7eb;
      font-size: 10pt;
    }
    
    /* Escala EVA */
    .eva-scale {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .eva-bar {
      flex: 1;
      height: 20px;
      background: linear-gradient(90deg, #22c55e 0%, #eab308 50%, #ef4444 100%);
      border-radius: 10px;
      position: relative;
    }
    
    .eva-marker {
      position: absolute;
      top: -5px;
      width: 4px;
      height: 30px;
      background: #1f2937;
      border-radius: 2px;
    }
    
    .eva-value {
      font-weight: 700;
      font-size: 12pt;
      color: #0f766e;
    }
    
    /* Pontos auriculares */
    .points-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }
    
    .point-card {
      background: #f9fafb;
      padding: 10px;
      border-radius: 6px;
      border-left: 3px solid #14b8a6;
    }
    
    .point-number {
      display: inline-block;
      width: 22px;
      height: 22px;
      background: #0f766e;
      color: white;
      border-radius: 50%;
      text-align: center;
      line-height: 22px;
      font-size: 9pt;
      font-weight: 600;
      margin-right: 8px;
    }
    
    .point-name {
      font-weight: 600;
      color: #1f2937;
    }
    
    .point-code {
      font-size: 8pt;
      color: #6b7280;
    }
    
    /* Observações */
    .observations {
      background: #fefce8;
      border: 1px solid #fde047;
      border-radius: 6px;
      padding: 12px;
      min-height: 60px;
    }
    
    /* Assinaturas */
    .signatures {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-top: 40px;
    }
    
    .signature-box {
      text-align: center;
    }
    
    .signature-line {
      border-top: 1px solid #374151;
      margin-top: 50px;
      padding-top: 10px;
    }
    
    .signature-name {
      font-weight: 600;
      font-size: 10pt;
    }
    
    .signature-role {
      font-size: 8pt;
      color: #6b7280;
    }
    
    /* Footer */
    .footer {
      margin-top: 30px;
      padding-top: 15px;
      border-top: 1px solid #e5e7eb;
      font-size: 8pt;
      color: #6b7280;
      text-align: center;
    }
    
    /* Status badges */
    .badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 8pt;
      font-weight: 600;
    }
    
    .badge-success {
      background: #dcfce7;
      color: #166534;
    }
    
    .badge-warning {
      background: #fef3c7;
      color: #92400e;
    }
    
    .badge-info {
      background: #dbeafe;
      color: #1e40af;
    }
    
    /* Melhora percentual */
    .improvement-box {
      background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
      border: 2px solid #10b981;
      border-radius: 8px;
      padding: 15px;
      text-align: center;
    }
    
    .improvement-value {
      font-size: 32pt;
      font-weight: 700;
      color: #059669;
      line-height: 1;
    }
    
    .improvement-label {
      font-size: 9pt;
      color: #065f46;
      margin-top: 5px;
    }
    
    /* Protocolo box */
    .protocol-box {
      background: #eff6ff;
      border-left: 4px solid #3b82f6;
      padding: 12px 15px;
      border-radius: 0 6px 6px 0;
    }
    
    .protocol-title {
      font-weight: 600;
      color: #1e40af;
      font-size: 10pt;
    }
    
    .protocol-desc {
      font-size: 9pt;
      color: #3b82f6;
      margin-top: 3px;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- CABEÇALHO -->
    <div class="header">
      <div class="header-top">
        <div class="logo-area">
          <h1>AURIS</h1>
          <p>Sistema de Gestão Terapêutica Holística</p>
          ${config.terapeuta_nome ? `<p style="margin-top: 8px;">Terapeuta: ${config.terapeuta_nome}</p>` : ''}
          ${config.terapeuta_registro ? `<p>Registro: ${config.terapeuta_registro}</p>` : ''}
        </div>
        <div class="session-info">
          <div class="number">${sessao.numero}</div>
          <div class="label">SESSÃO</div>
        </div>
      </div>
      <div class="header-bottom">
        <span>Data: ${dataSessao}</span>
        <span>Código: ${paciente.codigo_auris}</span>
      </div>
    </div>

    <!-- DADOS DO PACIENTE -->
    <div class="section">
      <div class="section-header">Dados do Paciente</div>
      <div class="section-content">
        <div class="info-grid">
          <div class="info-item full-width">
            <div class="info-label">Nome Completo</div>
            <div class="info-value" style="font-size: 14pt;">${paciente.dados_pessoais.nome}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Data de Nascimento</div>
            <div class="info-value">${dataNascimento} (${idade} anos)</div>
          </div>
          <div class="info-item">
            <div class="info-label">Sexo</div>
            <div class="info-value">${paciente.dados_pessoais.sexo === 'F' ? 'Feminino' : paciente.dados_pessoais.sexo === 'M' ? 'Masculino' : 'Outro'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Profissão</div>
            <div class="info-value">${paciente.dados_pessoais.profissao || 'Não informada'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Telefone</div>
            <div class="info-value">${paciente.dados_pessoais.telefone}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Email</div>
            <div class="info-value">${paciente.dados_pessoais.email || 'Não informado'}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- AVALIAÇÃO INICIAL -->
    <div class="section">
      <div class="section-header">Avaliação Inicial</div>
      <div class="section-content">
        <table class="assessment-table">
          <thead>
            <tr>
              <th>Parâmetro</th>
              <th>Início</th>
              <th>Fim</th>
              <th>Evolução</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Dor (EVA 0-10)</strong></td>
              <td>${sessao.avaliacao.dor_eva_inicio}/10</td>
              <td>${sessao.avaliacao.dor_eva_fim}/10</td>
              <td><span class="badge ${sessao.avaliacao.dor_eva_fim < sessao.avaliacao.dor_eva_inicio ? 'badge-success' : 'badge-warning'}">${sessao.avaliacao.dor_eva_fim < sessao.avaliacao.dor_eva_inicio ? 'Melhora' : 'Sem alteração'}</span></td>
            </tr>
            <tr>
              <td><strong>Ansiedade (0-10)</strong></td>
              <td>${sessao.avaliacao.ansiedade_inicio}/10</td>
              <td>${sessao.avaliacao.ansiedade_fim}/10</td>
              <td><span class="badge ${sessao.avaliacao.ansiedade_fim < sessao.avaliacao.ansiedade_inicio ? 'badge-success' : 'badge-warning'}">${sessao.avaliacao.ansiedade_fim < sessao.avaliacao.ansiedade_inicio ? 'Melhora' : 'Sem alteração'}</span></td>
            </tr>
            <tr>
              <td><strong>Bem-estar (0-10)</strong></td>
              <td>${sessao.avaliacao.bem_estar_inicio}/10</td>
              <td>${sessao.avaliacao.bem_estar_fim}/10</td>
              <td><span class="badge ${sessao.avaliacao.bem_estar_fim > sessao.avaliacao.bem_estar_inicio ? 'badge-success' : 'badge-warning'}">${sessao.avaliacao.bem_estar_fim > sessao.avaliacao.bem_estar_inicio ? 'Melhora' : 'Sem alteração'}</span></td>
            </tr>
          </tbody>
        </table>
        
        ${sessao.evolucao.percentual_melhora > 0 ? `
        <div class="improvement-box" style="margin-top: 15px;">
          <div class="improvement-value">${sessao.evolucao.percentual_melhora}%</div>
          <div class="improvement-label">Índice de Melhora Global</div>
        </div>
        ` : ''}
      </div>
    </div>

    <!-- PROTOCOLO APLICADO -->
    <div class="section">
      <div class="section-header">Protocolo Aplicado</div>
      <div class="section-content">
        <div class="protocol-box" style="margin-bottom: 15px;">
          <div class="protocol-title">${sessao.protocolo.tecnica_principal === 'auriculoterapia' ? 'Auriculoterapia' : sessao.protocolo.tecnica_principal === 'reiki' ? 'Reiki' : 'Terapia Combinada'}</div>
          <div class="protocol-desc">Duração total: ${sessao.protocolo.duracao_total_min} minutos | Técnica: ${getTecnicaLabel(sessao.protocolo.pontos[0]?.tecnica_utilizada || 'sementes')}</div>
        </div>
        
        <div class="info-label" style="margin-bottom: 10px;">Pontos Auriculares Aplicados</div>
        <div class="points-grid">
          ${sessao.protocolo.pontos.map((ponto, idx) => `
            <div class="point-card">
              <span class="point-number">${idx + 1}</span>
              <span class="point-name">${ponto.nome_pt}</span>
              <span class="point-code">${ponto.codigo}</span>
              <div style="font-size: 8pt; color: #6b7280; margin-top: 4px; margin-left: 30px;">
                ${ponto.tempo_aplicacao_min} min • ${getTecnicaLabel(ponto.tecnica_utilizada)}
              </div>
            </div>
          `).join('')}
        </div>
        
        ${sessao.reiki?.aplicado ? `
        <div style="margin-top: 15px; padding: 10px; background: #fef3c7; border-radius: 6px;">
          <strong>Reiki:</strong> ${sessao.reiki.simbolos.join(', ')} | ${sessao.reiki.duracao_min} min
          ${sessao.reiki.intencao ? `<br><em>Intenção: ${sessao.reiki.intencao}</em>` : ''}
        </div>
        ` : ''}
      </div>
    </div>

    <!-- OBSERVAÇÕES -->
    <div class="section">
      <div class="section-header">Observações da Sessão</div>
      <div class="section-content">
        <div class="info-grid" style="grid-template-columns: 1fr 1fr;">
          <div>
            <div class="info-label">Observações Iniciais</div>
            <div class="observations" style="background: #f3f4f6; border-color: #d1d5db;">
              ${sessao.avaliacao.observacoes_inicio || 'Nenhuma observação registrada.'}
            </div>
          </div>
          <div>
            <div class="info-label">Observações Finais</div>
            <div class="observations">
              ${sessao.avaliacao.observacoes_fim || 'Nenhuma observação registrada.'}
            </div>
          </div>
        </div>
        
        ${sessao.evolucao.observacoes_finais ? `
        <div style="margin-top: 15px;">
          <div class="info-label">Evolução e Considerações</div>
          <div class="observations" style="min-height: 40px;">
            ${sessao.evolucao.observacoes_finais}
          </div>
        </div>
        ` : ''}
        
        ${sessao.evolucao.recomendacoes ? `
        <div style="margin-top: 15px;">
          <div class="info-label">Recomendações</div>
          <div style="padding: 10px; background: #eff6ff; border-left: 3px solid #3b82f6; border-radius: 0 6px 6px 0;">
            ${sessao.evolucao.recomendacoes}
          </div>
        </div>
        ` : ''}
      </div>
    </div>

    <!-- ASSINATURAS -->
    <div class="signatures">
      <div class="signature-box">
        <div class="signature-line">
          <div class="signature-name">${paciente.dados_pessoais.nome}</div>
          <div class="signature-role">Paciente</div>
        </div>
      </div>
      <div class="signature-box">
        <div class="signature-line">
          <div class="signature-name">${config.terapeuta_nome || 'Terapeuta'}</div>
          <div class="signature-role">Terapeuta Responsável${config.terapeuta_registro ? ` - Registro: ${config.terapeuta_registro}` : ''}</div>
        </div>
      </div>
    </div>

    <!-- FOOTER -->
    <div class="footer">
      <p>Documento gerado pelo AURIS OS em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
      <p style="margin-top: 5px;">Este documento é parte do prontuário do paciente e possui valor terapêutico.</p>
    </div>
  </div>
</body>
</html>
  `;
};

// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

function calcularIdade(dataNascimento: string): number {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();
  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
}

function getTecnicaLabel(tecnica: string): string {
  const labels: Record<string, string> = {
    'agulha_filiforme': 'Agulha Filiforme',
    'agulha_intradermica': 'Agulha Intradermica',
    'sementes': 'Sementes',
    'esferas_mag': 'Esferas Magnéticas',
    'laser': 'Laser',
    'moxa': 'Moxabustão',
  };
  return labels[tecnica] || tecnica;
}

// ============================================================================
// FUNÇÃO PRINCIPAL DE GERAÇÃO DE PDF
// ============================================================================

export const gerarPDF = async (
  sessao: Sessao,
  paciente: Paciente,
  config: ConfiguracaoSistema,
  options: PDFOptions = {}
): Promise<Blob> => {
  const {
    formato = 'a4',
    orientacao = 'portrait',
  } = options;

  // Gerar HTML
  const html = gerarTemplateSessao(sessao, paciente, config);
  
  // Criar elemento temporário
  const element = document.createElement('div');
  element.innerHTML = html;
  element.style.position = 'absolute';
  element.style.left = '-9999px';
  element.style.width = '210mm';
  document.body.appendChild(element);

  try {
    // Aguardar renderização
    await new Promise(resolve => setTimeout(resolve, 100));

    // Capturar como canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      windowWidth: 794, // A4 width in pixels at 96 DPI
    });

    // Criar PDF
    const pdf = new jsPDF({
      orientation: orientacao,
      unit: 'mm',
      format: formato,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    
    // Calcular quantas páginas são necessárias
    const scaledHeight = imgHeight * ratio;
    let heightLeft = scaledHeight;
    let position = 0;

    // Adicionar primeira página
    pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, scaledHeight);
    heightLeft -= pdfHeight;

    // Adicionar páginas extras se necessário
    while (heightLeft > 0) {
      position = heightLeft - scaledHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, scaledHeight);
      heightLeft -= pdfHeight;
    }

    // Retornar como Blob
    return pdf.output('blob');
  } finally {
    // Limpar elemento temporário
    document.body.removeChild(element);
  }
};

// ============================================================================
// FUNÇÃO PARA DOWNLOAD DO PDF
// ============================================================================

export const downloadPDF = async (
  sessao: Sessao,
  paciente: Paciente,
  config: ConfiguracaoSistema
): Promise<void> => {
  const blob = await gerarPDF(sessao, paciente, config);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Ficha_Sessao_${paciente.codigo_auris}_S${sessao.numero}_${new Date().toISOString().split('T')[0]}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// ============================================================================
// FUNÇÃO PARA VISUALIZAR PDF
// ============================================================================

export const visualizarPDF = async (
  sessao: Sessao,
  paciente: Paciente,
  config: ConfiguracaoSistema
): Promise<string> => {
  const blob = await gerarPDF(sessao, paciente, config);
  return URL.createObjectURL(blob);
};

export default {
  gerarPDF,
  downloadPDF,
  visualizarPDF,
  gerarTemplateSessao,
};
