export type AuraBlockType = 'clinical' | 'rootcause' | 'direction' | 'nextstep';

export interface AuraPointSuggestion {
  code: string;
  namePt: string;
  nameLatim?: string;
  technique?: 'needle' | 'seed' | 'magnet' | 'laser';
  rationale?: string;
  order?: number;
}

export interface AuraAction {
  label: string;
  action: 'open_map' | 'start_session' | 'add_protocol' | 'ask_patient';
  payload?: unknown;
}

export interface AuraBlock {
  id: string;
  type: AuraBlockType;
  title: string;
  content: string;
  metadata?: {
    confidence?: number;
    pattern?: string;
    sistema?: 'neurofisiologico' | 'nada' | 'battlefield';
    protocol?: string;
    points?: AuraPointSuggestion[];
    chain?: string[];
  };
  suggestedActions?: AuraAction[];
  timestamp: number;
}

export interface AuraResponse {
  blocks: AuraBlock[];
  fullText: string;
  suggestedActions?: AuraAction[];
}
