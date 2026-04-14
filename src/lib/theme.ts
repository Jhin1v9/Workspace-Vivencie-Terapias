// ============================================================================
// TEMA AURIS OS - Cores e Design Tokens
// ============================================================================

/**
 * Cores do tema Auris OS
 * Use estas cores em vez de hardcoded values
 */
export const theme = {
  // Cores primárias (Auris)
  primary: {
    sage: '#10b981',      // auris-sage - Principal
    indigo: '#6366f1',    // auris-indigo
    rose: '#f43f5e',      // auris-rose
    teal: '#14b8a6',      // auris-teal
  },
  
  // Cores semânticas
  semantic: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  
  // Cores de estado
  state: {
    master: '#ef4444',      // Vermelho - pontos master
    estrela: '#f59e0b',     // Âmbar - pontos estrela
    importante: '#3b82f6',  // Azul - pontos importantes
    comum: '#8b5cf6',       // Roxo - pontos comuns
  },
  
  // Cores de região auricular
  regiao: {
    fossaTriangular: '#ef4444',
    conchaCimba: '#10b981',
    conchaCava: '#3b82f6',
    antitrago: '#8b5cf6',
    tragus: '#f59e0b',
    helixSuperior: '#06b6d4',
    antihelixCervical: '#ec4899',
    antihelixLombar: '#ec4899',
    escafa: '#84cc16',
    lobuloSuperior: '#f97316',
    lobuloInferior: '#f97316',
    retroauricular: '#6366f1',
  },
  
  // Cores de categorias de serviço
  categoria: {
    auriculoterapia: '#10b981',
    reiki: '#8b5cf6',
    massagem: '#f59e0b',
    acupuntura: '#ef4444',
    fitoterapia: '#22c55e',
    outro: '#6b7280',
  },
  
  // Cores de status
  status: {
    agendado: '#f59e0b',
    confirmado: '#3b82f6',
    emAndamento: '#10b981',
    concluido: '#64748b',
    cancelado: '#ef4444',
  },
  
  // Cores neutras
  neutral: {
    white: '#ffffff',
    slate50: '#f8fafc',
    slate100: '#f1f5f9',
    slate200: '#e2e8f0',
    slate300: '#cbd5e1',
    slate400: '#94a3b8',
    slate500: '#64748b',
    slate600: '#475569',
    slate700: '#334155',
    slate800: '#1e293b',
    slate900: '#0f172a',
    slate950: '#020617',
  },
  
  // Opacidades para rgba
  alpha: {
    10: '0.1',
    20: '0.2',
    30: '0.3',
    40: '0.4',
    50: '0.5',
    60: '0.6',
    70: '0.7',
    80: '0.8',
    90: '0.9',
  },
} as const;

/**
 * Cores com opacidade (para rgba)
 */
export const withAlpha = (color: string, alpha: number): string => {
  // Se for hex, converter para rgba
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  // Se já for rgba ou rgb, retornar como está
  return color;
};

/**
 * Glow colors para animações Framer Motion
 */
export const glowColors = {
  dica: 'rgba(59, 130, 246, 0.3)',
  atalho: 'rgba(16, 185, 129, 0.3)',
  lembrete: 'rgba(245, 158, 11, 0.3)',
  alerta: 'rgba(239, 68, 68, 0.3)',
  primary: 'rgba(16, 185, 129, 0.4)',
  white: 'rgba(255, 255, 255, 0.15)',
} as const;

/**
 * Box shadows pré-definidos
 */
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  glow: {
    sage: '0 0 20px rgba(16, 185, 129, 0.4)',
    amber: '0 0 10px 4px rgba(245, 158, 11, 0.2)',
    emerald: '0 0 20px 4px rgba(16, 185, 129, 0.2)',
  },
} as const;

export default theme;
