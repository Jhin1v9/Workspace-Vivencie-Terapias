import type { AuraAction, AuraBlock, AuraResponse } from '@/types/auraBlocks';

export interface ProviderResponseMeta {
  provider: 'openai' | 'deepseek' | 'gemini' | 'local';
  finishReason?: string;
  truncatedByProvider?: boolean;
  maxTokens?: number;
}

export interface AuraParsedResult {
  response: AuraResponse | null;
  format: 'blocks' | 'text';
  cleanText?: string; // Texto limpo quando JSON é removido
  isTruncated?: boolean; // Indica se o JSON parece estar truncado
}

const BLOCK_ORDER = ['clinical', 'rootcause', 'direction', 'nextstep'] as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const stripJsonCodeFence = (value: string) =>
  value
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

const extractBalancedJsonObject = (value: string) => {
  const text = stripJsonCodeFence(value);
  const firstBrace = text.indexOf('{');

  if (firstBrace === -1) {
    return null;
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = firstBrace; index < text.length; index += 1) {
    const char = text[index];

    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }

      if (char === '\\') {
        escaped = true;
        continue;
      }

      if (char === '"') {
        inString = false;
      }

      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === '{') {
      depth += 1;
      continue;
    }

    if (char !== '}') {
      continue;
    }

    depth -= 1;
    if (depth === 0) {
      return text.slice(firstBrace, index + 1);
    }
  }

  // Retorna o texto do primeiro { até o final (JSON pode estar truncado)
  return text.slice(firstBrace);
};

const tryParseJson = (jsonText: string): unknown | null => {
  try {
    return JSON.parse(jsonText);
  } catch {
    // Tenta recuperar JSON truncado fechando arrays/objetos abertos
    let fixed = jsonText;
    
    // Conta chaves e colchetes abertos
    const openBraces = (fixed.match(/\{/g) || []).length;
    const closeBraces = (fixed.match(/\}/g) || []).length;
    const openBrackets = (fixed.match(/\[/g) || []).length;
    const closeBrackets = (fixed.match(/\]/g) || []).length;
    
    // Fecha o que estiver aberto
    for (let i = 0; i < openBrackets - closeBrackets; i++) {
      fixed += ']';
    }
    for (let i = 0; i < openBraces - closeBraces; i++) {
      fixed += '}';
    }
    
    // Remove trailing commas
    fixed = fixed.replace(/,\s*([}\]])/g, '$1');
    
    try {
      return JSON.parse(fixed);
    } catch {
      return null;
    }
  }
};

const normalizeActions = (value: unknown): AuraAction[] | undefined => {
  if (!Array.isArray(value)) return undefined;

  const actions = value
    .filter(isRecord)
    .map((item): AuraAction => ({
      label: typeof item.label === 'string' ? item.label : 'Ação',
      action:
        item.action === 'open_map' ||
        item.action === 'start_session' ||
        item.action === 'add_protocol' ||
        item.action === 'ask_patient'
          ? (item.action as AuraAction['action'])
          : 'ask_patient',
      payload: item.payload
    }));

  return actions.length ? actions : undefined;
};

const normalizeBlock = (value: unknown, index: number): AuraBlock | null => {
  if (!isRecord(value) || typeof value.type !== 'string') {
    return null;
  }

  // Se não tiver content, tenta criar a partir de outros campos
  let content = '';
  if (typeof value.content === 'string') {
    content = value.content;
  } else if (typeof value.description === 'string') {
    content = value.description;
  } else if (typeof value.text === 'string') {
    content = value.text;
  }

  // Valida o tipo do bloco
  const blockType = value.type as string;
  const isValidType = BLOCK_ORDER.includes(blockType as (typeof BLOCK_ORDER)[number]);
  
  if (!isValidType) {
    // Tenta mapear tipos alternativos
    const typeMap: Record<string, AuraBlock['type']> = {
      'clinica': 'clinical',
      'clinical': 'clinical',
      'root': 'rootcause',
      'causa': 'rootcause',
      'causa-raiz': 'rootcause',
      'direcao': 'direction',
      'direction': 'direction',
      'tratamento': 'direction',
      'next': 'nextstep',
      'proximo': 'nextstep',
      'próximo': 'nextstep',
    };
    
    const mappedType = typeMap[blockType.toLowerCase()];
    if (!mappedType) {
      return null;
    }
    
    return {
      id: typeof value.id === 'string' ? value.id : `${mappedType}-${index}`,
      type: mappedType,
      title: typeof value.title === 'string' ? value.title : 'Aura',
      content,
      metadata: isRecord(value.metadata) ? (value.metadata as AuraBlock['metadata']) : undefined,
      suggestedActions: normalizeActions(value.suggestedActions),
      timestamp: typeof value.timestamp === 'number' ? value.timestamp : Date.now()
    };
  }

  return {
    id: typeof value.id === 'string' ? value.id : `${blockType}-${index}`,
    type: blockType as AuraBlock['type'],
    title: typeof value.title === 'string' ? value.title : 'Aura',
    content,
    metadata: isRecord(value.metadata) ? (value.metadata as AuraBlock['metadata']) : undefined,
    suggestedActions: normalizeActions(value.suggestedActions),
    timestamp: typeof value.timestamp === 'number' ? value.timestamp : Date.now()
  };
};

export const parseAuraStructuredResponse = (rawText: string): AuraParsedResult => {
  const candidateJson = extractBalancedJsonObject(rawText);

  if (!candidateJson) {
    return { response: null, format: 'text' };
  }

  const isTruncated = !candidateJson.trim().endsWith('}');
  const parsed = tryParseJson(candidateJson);

  if (!parsed || !isRecord(parsed)) {
    // JSON existe mas não conseguiu parsear - pode estar truncado
    return { 
      response: null, 
      format: 'text', 
      cleanText: isTruncated ? undefined : rawText.replace(candidateJson, '').trim(),
      isTruncated 
    };
  }

  // Tenta extrair blocks de várias formas possíveis
  let blocksArray: unknown[] = [];
  
  if (Array.isArray(parsed.blocks)) {
    blocksArray = parsed.blocks;
  } else if (Array.isArray(parsed.data)) {
    blocksArray = parsed.data;
  } else if (Array.isArray(parsed.result)) {
    blocksArray = parsed.result;
  } else if (isRecord(parsed.blocks)) {
    // Se blocks é um objeto, converte para array
    blocksArray = Object.values(parsed.blocks);
  }

  if (!blocksArray.length) {
    // Tenta encontrar arrays aninhados que possam ser blocos
    for (const key of Object.keys(parsed)) {
      const value = parsed[key];
      if (Array.isArray(value) && value.length > 0 && isRecord(value[0])) {
        blocksArray = value;
        break;
      }
    }
  }

  const blocks = blocksArray
    .map((block, index) => normalizeBlock(block, index))
    .filter((block): block is AuraBlock => block !== null);

  if (!blocks.length) {
    // JSON existe mas blocos são inválidos
    return { 
      response: null, 
      format: 'text', 
      cleanText: isTruncated ? undefined : rawText.replace(candidateJson, '').trim(),
      isTruncated 
    };
  }

  return {
    response: {
      blocks,
      fullText: typeof parsed.fullText === 'string' ? parsed.fullText : blocks.map((block) => block.content).join('\n\n'),
      suggestedActions: normalizeActions(parsed.suggestedActions)
    },
    format: 'blocks',
    isTruncated
  };
};

export const detectProviderTruncation = (text: string, meta?: ProviderResponseMeta) => {
  if (meta?.truncatedByProvider) {
    return true;
  }

  const trimmed = text.trim();
  if (trimmed.length < 260) {
    return false;
  }

  if (/\[\[AURA_SOURCES\]\]/.test(trimmed)) {
    return false;
  }

  if (/[.!?)]$/.test(trimmed) || trimmed.endsWith('```') || trimmed.endsWith('---')) {
    return false;
  }

  // Verifica se parece JSON truncado
  const jsonStart = trimmed.indexOf('{');
  if (jsonStart !== -1) {
    const jsonPart = trimmed.slice(jsonStart);
    const openBraces = (jsonPart.match(/\{/g) || []).length;
    const closeBraces = (jsonPart.match(/\}/g) || []).length;
    if (openBraces > closeBraces) {
      return true;
    }
  }

  return false;
};
