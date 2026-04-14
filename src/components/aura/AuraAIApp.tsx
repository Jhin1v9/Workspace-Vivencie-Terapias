// ============================================================================
// AURA AI APP - Componente de janela do desktop
// Agora usa AuraUnified para manter consistência com o orb
// ============================================================================

import React from 'react';
import { AuraUnified } from './AuraUnified';

export const AuraAIApp: React.FC = () => {
  return <AuraUnified variant="window" />;
};

export default AuraAIApp;
