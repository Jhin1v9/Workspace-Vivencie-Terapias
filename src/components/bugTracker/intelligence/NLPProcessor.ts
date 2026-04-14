/**
 * 🧠 NLP Processor
 * Processa linguagem natural do usuário:
 * - Corrige erros de escrita/ortografia
 * - Aprimora para linguagem técnica
 * - Extrai keywords e intenções
 */

import type {
  NLPResult,
  BugCategory,
  BugSeverity,
  UserIntent,
} from '../types/bugIntelligence.types';

// ============================================================================
// DICIONÁRIOS DE CORREÇÃO
// ============================================================================

/** Correções comuns de digitação/ortografia */
const SPELLING_CORRECTIONS: Record<string, string> = {
  // Abreviações comuns
  'num': 'não',
  'naum': 'não',
  'ñ': 'não',
  'q': 'que',
  'pq': 'porque',
  'vc': 'você',
  'vcs': 'vocês',
  'tb': 'também',
  'tbm': 'também',
  'qd': 'quando',
  'qdo': 'quando',
  'cmg': 'comigo',
  'ctg': 'contigo',
  'p': 'para',
  'pra': 'para',
  'pro': 'para o',
  'pros': 'para os',
  'td': 'tudo',
  'tds': 'todos',
  'msm': 'mesmo',
  'smp': 'sempre',
  'aq': 'aqui',
  'aki': 'aqui',
  'la': 'lá',
  'dnv': 'de novo',
  'dps': 'depois',
  'hj': 'hoje',
  'agr': 'agora',
  'mins': 'minutos',
  'hrs': 'horas',
  
  // Erros ortográficos comuns
  'funca': 'funciona',
  'funfa': 'funciona',
  'fnciona': 'funciona',
  'travando': 'travando',
  'trava': 'trava',
  'capota': 'capota',
  'capotando': 'capotando',
  'quebra': 'quebra',
  'quebrando': 'quebrando',
  'buga': 'buga',
  'bugando': 'bugando',
  'sumiu': 'sumiu',
  'sumindo': 'sumindo',
  'click': 'clique',
  'clik': 'clique',
  'butao': 'botão',
  'botao': 'botão',
  'botaum': 'botão',
  'input': 'input',
  'pagina': 'página',
  'pag': 'página',
  'lentao': 'lento',
  'rapido': 'rápido',
  
  // Gírias técnicas
  'crasha': 'crash',
  'crachando': 'crashando',
  'freeza': 'trava',
  'freezando': 'travando',
  'laggando': 'com lag',
  'zoado': 'problemático',
  'mermo': 'mesmo',
  'dimai': 'demais',
  'pakas': 'demais',
};

/** Mapeamento de palavras para categorias */
const CATEGORY_KEYWORDS: Record<BugCategory, string[]> = {
  UI_VISUAL: [
    'tela', 'cor', 'fonte', 'tamanho', 'alinhamento', 'centralizar',
    'desalinhado', 'cortado', 'escondido', 'não aparece', 'invisível',
    'layout', 'quebrado', 'tremendo', 'piscando', 'flickering',
    'css', 'estilo', 'classe', 'tailwind', 'background',
  ],
  FUNCTIONAL: [
    'não funciona', 'não abre', 'não fecha', 'não salva', 'não carrega',
    'clique', 'botão', 'click', 'submit', 'form', 'navegação',
    'redireciona', 'abre errado', 'ação', 'evento',
  ],
  PERFORMANCE: [
    'lento', 'demora', 'trava', 'lag', 'loading',
    'carregando', 'espera', 'timeout', 'congelou', 'freeze',
    'memória', 'cpu', 'consumo', 'performance',
  ],
  ACCESSIBILITY: [
    'leitor', 'screen reader', 'aria', 'teclado', 'tab',
    'contraste', 'foco', 'focus', 'acessibilidade', 'a11y',
  ],
  TYPE_ERROR: [
    'typescript', 'type', 'tipagem', 'interface', 'any',
    'null', 'undefined', 'erro de tipo', 'type error',
  ],
  LOGIC_ERROR: [
    'lógica', 'errado', 'valor errado', 'cálculo',
    'condição', 'if', 'loop', 'repetição', 'infinito',
  ],
  STATE_MANAGEMENT: [
    'estado', 'state', 'store', 'zustand', 'redux',
    'context', 'useState', 'useReducer', 'não atualiza',
    'desatualizado', 'sincronização',
  ],
  API_INTEGRATION: [
    'api', 'requisição', 'request', 'response', 'fetch',
    'axios', 'http', 'status', 'erro 500', '404',
    'network', 'offline', 'conexão',
  ],
  UNKNOWN: [],
};

/** Palavras indicativas de severidade */
const SEVERITY_INDICATORS: Record<BugSeverity, string[]> = {
  CRITICAL: [
    'crash', 'capota', 'quebra tudo', 'não abre', 'sistema down',
    'crítico', 'urgente', 'emergência', 'para tudo', 'impossível usar',
    'bug grave', 'erro grave', 'muito sério',
  ],
  HIGH: [
    'muito lento', 'trava sempre', 'não consigo usar',
    'importante', 'bloqueia', 'impede', 'principal',
    'funcionalidade principal',
  ],
  MEDIUM: [
    'às vezes', 'intermitente', 'eventualmente',
    'algumas vezes', 'quando', 'em certos casos',
    'não ideal', 'poderia melhorar',
  ],
  LOW: [
    'pequeno', 'detalhe', 'estético', 'visual',
    'sugestão', 'melhoria', 'seria bom', 'poderia',
    'não urgente', 'quando der',
  ],
};

/** Intenções do usuário */
const INTENT_PATTERNS: Record<UserIntent, RegExp[]> = {
  REPORT_BUG: [
    /não (funciona|abre|fecha|carrega|salva)/i,
    /(bug|bugado|quebrado|erro|problema)/i,
    /(trava|lento|demora|crash)/i,
    /(errado|incorreto|falha)/i,
  ],
  ASK_HELP: [
    /como (faço|faz|fazer)/i,
    /ajuda|help|socorro/i,
    /não sei|não entendo/i,
    /dúvida/i,
  ],
  SUGGEST_FEATURE: [
    /seria bom|seria legal|gostaria/i,
    /sugestão|sugiro|proponho/i,
    /faltaria|precisaria|deveria ter/i,
    /melhoria|implementar/i,
  ],
  CODE_REVIEW: [
    /revisar|review|código/i,
    /pode melhorar|otimizar|refatorar/i,
    /clean code|padrão/i,
  ],
  UNCLEAR: [],
};

/** Componentes conhecidos do sistema */
const KNOWN_COMPONENTS = [
  'button', 'botão', 'input', 'campo', 'form', 'formulário',
  'modal', 'dialog', 'card', 'lista', 'list', 'table', 'tabela',
  'header', 'footer', 'sidebar', 'menu', 'navbar', 'tab',
  'accordion', 'dropdown', 'select', 'checkbox', 'radio',
  'calendar', 'calendario', 'chart', 'gráfico', 'map', 'mapa',
  'browser', 'navegador', 'notas', 'editor', 'aura', 'chat',
];

/** Tecnologias do projeto */
const KNOWN_TECH = [
  'react', 'typescript', 'ts', 'javascript', 'js',
  'tailwind', 'css', 'html', 'vite', 'zustand',
  'framer', 'motion', 'lucide', 'radix',
];

// ============================================================================
// CLASSE PRINCIPAL
// ============================================================================

export class NLPProcessor {
  /** Corrige erros de ortografia e abreviações */
  static correctSpelling(text: string): string {
    let corrected = text.toLowerCase();
    
    // Aplica correções do dicionário
    for (const [wrong, right] of Object.entries(SPELLING_CORRECTIONS)) {
      const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
      corrected = corrected.replace(regex, right);
    }
    
    // Capitaliza primeira letra
    corrected = corrected.charAt(0).toUpperCase() + corrected.slice(1);
    
    return corrected;
  }

  /** Aprimora texto para linguagem técnica */
  static enhanceToTechnicalLanguage(text: string): string {
    let enhanced = text;
    
    const technicalReplacements: Record<string, string> = {
      'tremendo': 'apresentando instabilidade visual/flickering',
      'treme': 'apresenta comportamento instável',
      'trava': 'apresenta travamento/congelamento',
      'lento': 'apresenta baixa performance/latência',
      'demora': 'apresenta latência elevada',
      'não funciona': 'não executa a funcionalidade esperada',
      'não abre': 'não renderiza/não é exibido',
      'não fecha': 'não dispensa o estado/não desmonta',
      'não salva': 'não persiste os dados',
      'sumiu': 'não está renderizado/não visível',
      'aparece errado': 'renderiza com comportamento inesperado',
      'capota': 'crash/quebra execução',
      'zoado': 'comportamento problemático',
      'quebrado': 'em estado de erro/non-functional',
      'clique': 'evento de interação onClick',
      'clica': 'interação do usuário',
      'botão': 'componente Button',
      'campo': 'componente Input/Field',
      'tela': 'interface/componente',
      'página': 'view/página',
    };
    
    for (const [informal, technical] of Object.entries(technicalReplacements)) {
      const regex = new RegExp(`\\b${informal}\\b`, 'gi');
      enhanced = enhanced.replace(regex, technical);
    }
    
    return enhanced;
  }

  /** Detecta categoria do bug */
  static detectCategory(text: string): BugCategory {
    const lowerText = text.toLowerCase();
    const scores: Record<BugCategory, number> = {
      UI_VISUAL: 0,
      FUNCTIONAL: 0,
      PERFORMANCE: 0,
      ACCESSIBILITY: 0,
      TYPE_ERROR: 0,
      LOGIC_ERROR: 0,
      STATE_MANAGEMENT: 0,
      API_INTEGRATION: 0,
      UNKNOWN: 0,
    };
    
    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      for (const keyword of keywords) {
        if (lowerText.includes(keyword.toLowerCase())) {
          scores[category as BugCategory]++;
        }
      }
    }
    
    let maxCategory: BugCategory = 'UNKNOWN';
    let maxScore = 0;
    
    for (const [category, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        maxCategory = category as BugCategory;
      }
    }
    
    return maxCategory;
  }

  /** Detecta severidade */
  static detectSeverity(text: string): BugSeverity {
    const lowerText = text.toLowerCase();
    
    for (const [severity, indicators] of Object.entries(SEVERITY_INDICATORS)) {
      for (const indicator of indicators) {
        if (lowerText.includes(indicator.toLowerCase())) {
          return severity as BugSeverity;
        }
      }
    }
    
    return 'MEDIUM';
  }

  /** Detecta intenção do usuário */
  static detectIntent(text: string): UserIntent {
    for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
      for (const pattern of patterns) {
        if (pattern.test(text)) {
          return intent as UserIntent;
        }
      }
    }
    
    return 'UNCLEAR';
  }

  /** Extrai componentes mencionados */
  static extractComponents(text: string): string[] {
    const lowerText = text.toLowerCase();
    const found: string[] = [];
    
    for (const component of KNOWN_COMPONENTS) {
      if (lowerText.includes(component.toLowerCase())) {
        found.push(component);
      }
    }
    
    return [...new Set(found)];
  }

  /** Extrai tecnologias mencionadas */
  static extractTech(text: string): string[] {
    const lowerText = text.toLowerCase();
    const found: string[] = [];
    
    for (const tech of KNOWN_TECH) {
      if (lowerText.includes(tech.toLowerCase())) {
        found.push(tech);
      }
    }
    
    return [...new Set(found)];
  }

  /** Gera perguntas de follow-up */
  static generateFollowUpQuestions(
    category: BugCategory,
  ): string[] {
    const questionMap: Record<BugCategory, string[]> = {
      UI_VISUAL: [
        'Em qual navegador/dispositivo isso acontece?',
        'O problema ocorre sempre ou é intermitente?',
        'Você consegue anexar um screenshot?',
      ],
      FUNCTIONAL: [
        'Quais passos levam a esse comportamento?',
        'Existe algum erro no console do navegador?',
        'Isso acontece para todos os usuários ou só em casos específicos?',
      ],
      PERFORMANCE: [
        'Qual navegador e versão você está usando?',
        'Isso acontece com dados grandes ou pequenos?',
        'Você notou quando começou (depois de alguma mudança)?',
      ],
      ACCESSIBILITY: [
        'Qual leitor de tela está sendo usado?',
        'Isso afeta navegação por teclado?',
        'Você testou com outras tecnologias assistivas?',
      ],
      TYPE_ERROR: [
        'Qual a mensagem de erro exata?',
        'Em qual arquivo/linha ocorre?',
        'Você pode compartilhar o código relevante?',
      ],
      LOGIC_ERROR: [
        'Qual é o comportamento esperado vs atual?',
        'Quais dados de entrada causam isso?',
        'Você consegue reproduzir consistentemente?',
      ],
      STATE_MANAGEMENT: [
        'Qual estado deveria mudar?',
        'O componente pai ou filho deveria atualizar?',
        'Você está usando algum state manager (Zustand, Context)?',
      ],
      API_INTEGRATION: [
        'Qual o status code da resposta?',
        'Isso acontece sempre ou é intermitente?',
        'Você consegue compartilhar a resposta da API?',
      ],
      UNKNOWN: [
        'Você pode descrever melhor o comportamento esperado?',
        'Quando isso começou a acontecer?',
        'Existe algum erro no console?',
      ],
    };
    
    return questionMap[category] || questionMap.UNKNOWN;
  }

  /** Extrai keywords relevantes */
  private static extractKeywords(text: string): string[] {
    const stopwords = [
      'o', 'a', 'os', 'as', 'um', 'uma', 'uns', 'umas', 'de', 'do', 'da',
      'dos', 'das', 'em', 'no', 'na', 'nos', 'nas', 'por', 'para', 'com',
      'sem', 'sob', 'sobre', 'entre', 'durante', 'ante', 'após', 'até',
      'e', 'ou', 'mas', 'porém', 'todavia', 'contudo', 'entretanto',
      'que', 'quem', 'qual', 'cujo', 'onde', 'quando', 'como',
      'eu', 'tu', 'ele', 'ela', 'nós', 'vós', 'eles', 'elas',
      'este', 'esse', 'aquele', 'esta', 'essa', 'aquela',
      'muito', 'pouco', 'mais', 'menos', 'bem', 'mal',
    ];
    
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2)
      .filter(w => !stopwords.includes(w));
    
    const freq: Record<string, number> = {};
    for (const word of words) {
      freq[word] = (freq[word] || 0) + 1;
    }
    
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);
  }

  /** Processa texto completo */
  static process(text: string): NLPResult {
    const correctedText = this.correctSpelling(text);
    const enhancedText = this.enhanceToTechnicalLanguage(correctedText);
    const category = this.detectCategory(text);
    const severity = this.detectSeverity(text);
    const intent = this.detectIntent(text);
    const mentionedComponents = this.extractComponents(text);
    const mentionedTech = this.extractTech(text);
    const suggestedQuestions = this.generateFollowUpQuestions(category);
    const keywords = this.extractKeywords(enhancedText);
    
    return {
      originalText: text,
      correctedText,
      enhancedText,
      keywords,
      category,
      severity,
      mentionedComponents,
      mentionedTech,
      intent,
      suggestedQuestions,
    };
  }
}

export const processNLP = (text: string): NLPResult => NLPProcessor.process(text);
export default NLPProcessor;
