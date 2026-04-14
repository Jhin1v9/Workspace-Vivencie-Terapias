import type { ProviderResponseMeta } from '@/lib/auraResponse';
import type { AuraResponse } from '@/types/auraBlocks';

export interface AuraRenderedSource {
  title: string;
  uri: string;
  domain: string;
  author?: string;
  imageUrl?: string;
}

export interface AuraChatMessageData {
  structuredResponse?: AuraResponse;
  sources?: AuraRenderedSource[];
  providerMeta?: ProviderResponseMeta;
  truncated?: boolean;
  [key: string]: unknown;
}

export interface AuraChatMessage {
  id: string;
  tipo: 'usuario' | 'aura';
  texto: string;
  timestamp: Date | string; // Pode ser string após persist/rehydrate
  acao?: string;
  dados?: AuraChatMessageData;
  usouApi?: boolean;
  // Nota: providerMeta e truncated estão em dados (AuraChatMessageData)
  structured?: boolean;
  isError?: boolean;
}

export interface PreparedAuraMessageContent {
  body: string;
  sources: AuraRenderedSource[];
  structuredResponse?: AuraResponse;
  structured: boolean;
  displayText: string;
}
