import type { InspectedElement } from '../types/bugTracker.types';

interface ReportMarkdownData {
  description: string;
  expectedBehavior?: string;
  element: InspectedElement;
  pageUrl: string;
  pageTitle: string;
  type: string;
  severity: string;
  screenshotBase64?: string | null;
}

export function generateBugReportMarkdown(data: ReportMarkdownData): string {
  const cs = data.element.computedStyles;

  return `# 🐛 Bug Report — ${data.type.toUpperCase()} (${data.severity.toUpperCase()})

## 📍 Localização Exata

- **Rota (URL):** \`${data.pageUrl}\`
- **Título da página:** ${data.pageTitle}
- **Componente React:** ${data.element.componentName || 'Não detectado'}
- **Tag HTML:** \`${data.element.tag}\`
- **Seletor CSS:** \`${data.element.selector}\`
- **XPath:** \`${data.element.xpath}\`

## 📝 Descrição do Problema

${data.description}

${data.expectedBehavior ? `## ✅ Comportamento Esperado\n\n${data.expectedBehavior}\n` : ''}

## 🎨 Estilos Computados do Elemento

| Propriedade | Valor |
|-------------|-------|
| display | \`${cs.display}\` |
| position | \`${cs.position}\` |
| margin | \`${cs.margin}\` |
| padding | \`${cs.padding}\` |
| font-size | \`${cs.fontSize}\` |
| color | \`${cs.color}\` |
| background-color | \`${cs.backgroundColor}\` |
| width | \`${cs.width}\` |
| height | \`${cs.height}\` |
| z-index | \`${cs.zIndex}\` |
| border-radius | \`${cs.borderRadius}\` |

## 📐 Dimensões e Posição

- **Width:** ${Math.round(data.element.rect.width)}px
- **Height:** ${Math.round(data.element.rect.height)}px
- **X:** ${Math.round(data.element.rect.x)}px
- **Y:** ${Math.round(data.element.rect.y)}px

## 🔗 Hierarquia DOM

\`\`\`
${data.element.parentChain.slice().reverse().map(p => `${p.tag}${p.id ? `#${p.id}` : ''}`).join(' > ')} > ${data.element.tag}${data.element.id ? `#${data.element.id}` : ''}
\`\`\`

## 🖼️ Screenshot

${data.screenshotBase64 ? `![Screenshot](${data.screenshotBase64})` : '_Nenhum screenshot anexado._'}

---

*Relatório gerado automaticamente pelo Bug Tracker do AURIS OS.*
`;
}

export function generateFixPromptMarkdown(data: ReportMarkdownData): string {
  return `# 🔧 Solicitação de Correção

Você é um engenheiro de software sênior. Analise o bug abaixo e forneça a correção **diretamente no ponto exato** indicado.

## 📍 Referência Direta do Bug

- **Rota/URL:** \`${data.pageUrl}\`
- **Componente React:** ${data.element.componentName || 'Não detectado'}
- **Seletor CSS exato:** \`${data.element.selector}\`
- **XPath:** \`${data.element.xpath}\`
- **Tag:** \`${data.element.tag}\`
- **Classes:** \`${data.element.className || 'Nenhuma'}\`

## 📝 Descrição

${data.description}

${data.expectedBehavior ? `## ✅ Comportamento Esperado\n\n${data.expectedBehavior}\n` : ''}

## 🎨 Contexto Visual (Estilos Computados)

- display: \`${data.element.computedStyles.display}\`
- position: \`${data.element.computedStyles.position}\`
- margin: \`${data.element.computedStyles.margin}\`
- padding: \`${data.element.computedStyles.padding}\`
- font-size: \`${data.element.computedStyles.fontSize}\`

## 🎯 Instruções

1. Identifique o arquivo/componente exato a ser modificado.
2. Mostre o **código corrigido** em um bloco \`\`\`tsx (ou \`\`\`ts).
3. Explique brevemente a causa raiz.
4. Se o problema for de estilo/CSS, forneça as classes ou regras corrigidas.

${data.screenshotBase64 ? `## 🖼️ Screenshot de Referência\n\n![Screenshot](${data.screenshotBase64})` : ''}
`;
}
