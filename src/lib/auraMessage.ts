import { parseAuraStructuredResponse, detectProviderTruncation } from './auraResponse';
import type { AuraRenderedSource, PreparedAuraMessageContent } from '@/types/auraChat';

export const parseAuraRenderedMessage = (texto: string): { body: string; sources: AuraRenderedSource[] } => {
  const token = '[[AURA_SOURCES]]';
  const tokenIndex = texto.indexOf(token);

  if (tokenIndex === -1) {
    return { body: texto, sources: [] };
  }

  const body = texto.slice(0, tokenIndex).trim();
  const encoded = texto.slice(tokenIndex + token.length).trim();

  try {
    const sources = JSON.parse(decodeURIComponent(encoded)) as AuraRenderedSource[];
    return { body, sources: Array.isArray(sources) ? sources : [] };
  } catch {
    return { body: texto.replace(token, '').trim(), sources: [] };
  }
};

export const prepareAuraMessageContent = (texto: string): PreparedAuraMessageContent & { isTruncated?: boolean } => {
  const rendered = parseAuraRenderedMessage(texto);
  const parsed = parseAuraStructuredResponse(rendered.body);

  // Se houver cleanText (JSON removido), usar ele; senão, usar body original
  const cleanBody = parsed.cleanText || rendered.body;

  // Se parece truncado e não conseguiu parsear, marca como truncado
  const isTruncated = parsed.isTruncated || (!parsed.response && detectProviderTruncation(rendered.body));

  return {
    body: cleanBody,
    sources: rendered.sources,
    structuredResponse: parsed.response ?? undefined,
    structured: parsed.format === 'blocks',
    displayText: parsed.response?.fullText || cleanBody,
    isTruncated,
  };
};

export const truncateLinkLabel = (value: string, max = 42) => {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 3)}...`;
};

export const isLikelyTruncatedResponse = (texto: string) => {
  const trimmed = texto.trim();

  if (trimmed.length < 260) {
    return false;
  }

  if (/\[\[AURA_SOURCES\]\]/.test(trimmed)) {
    return false;
  }

  const endsCleanly =
    /[.!?)]$/.test(trimmed) ||
    trimmed.endsWith('```') ||
    trimmed.endsWith('---');

  if (endsCleanly) {
    return false;
  }

  return true;
};
