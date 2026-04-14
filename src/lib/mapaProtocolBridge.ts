import { auricularPoints, type AuricularPoint, type SistemaAuricular } from '@/components/auricular/EarSVG';
import type { AuraPointSuggestion } from '@/types/auraBlocks';

export const MAPA_PROTOCOL_STORAGE_KEY = 'mapa_protocolo_ativo';
export const MAPA_PROTOCOL_EVENT = 'auris:mapa-protocolo';

export interface MapaProtocolPayload {
  protocoloId: string;
  protocoloNome: string;
  pontosIds: string[];
  sistema: SistemaAuricular;
  origem?: 'aura' | 'protocolos';
  timestamp: number;
}

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const matchesSuggestion = (suggestion: AuraPointSuggestion, point: AuricularPoint) => {
  const normalizedCode = suggestion.code ? normalize(suggestion.code) : '';
  const normalizedName = normalize(suggestion.namePt || '');
  const normalizedPointCode = normalize(point.codigo);
  const normalizedPointName = normalize(point.nome);
  const normalizedPointId = normalize(point.id.replace(/-/g, ' '));

  if (normalizedCode && normalizedCode === normalizedPointCode) return true;
  if (normalizedCode && normalizedPointCode.includes(normalizedCode)) return true;
  if (normalizedName && normalizedPointName === normalizedName) return true;
  if (normalizedName && normalizedPointName.includes(normalizedName)) return true;
  if (normalizedName && normalizedName.includes(normalizedPointName)) return true;
  if (normalizedName && normalizedPointId.includes(normalizedName)) return true;

  return false;
};

const isPointCompatibleWithSistema = (
  point: AuricularPoint,
  sistema: SistemaAuricular
): boolean => {
  if (sistema === 'todos') return true;
  if (sistema === 'nada' && point.sistema === 'nada') return true;
  if (sistema === 'battlefield' && point.sistema === 'battlefield') return true;
  if (sistema === 'neurofisiologico') return true;
  return false;
};

export const resolveAuraSuggestionsToMapaPoints = (
  suggestions: AuraPointSuggestion[],
  sistema: SistemaAuricular
) => {
  const orderedSuggestions = [...suggestions].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  const resolved: AuricularPoint[] = [];
  const seen = new Set<string>();

  for (const suggestion of orderedSuggestions) {
    const exactMatches = auricularPoints.filter(
      (point) => matchesSuggestion(suggestion, point) && isPointCompatibleWithSistema(point, sistema)
    );

    for (const match of exactMatches) {
      if (!seen.has(match.id)) {
        seen.add(match.id);
        resolved.push(match);
      }
    }
  }

  return resolved;
};

export const pushMapaProtocolRequest = (payload: MapaProtocolPayload) => {
  if (typeof window === 'undefined') return;

  localStorage.setItem(MAPA_PROTOCOL_STORAGE_KEY, JSON.stringify(payload));
  window.dispatchEvent(new CustomEvent<MapaProtocolPayload>(MAPA_PROTOCOL_EVENT, { detail: payload }));
};

export const readMapaProtocolRequest = (): MapaProtocolPayload | null => {
  if (typeof window === 'undefined') return null;

  const raw = localStorage.getItem(MAPA_PROTOCOL_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as MapaProtocolPayload;
  } catch {
    return null;
  }
};

export const clearMapaProtocolRequest = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(MAPA_PROTOCOL_STORAGE_KEY);
};
