// ============================================================================
// ANIMATIONS - Biblioteca de animações reutilizáveis
// FASE 4: Visual Perfectionism
// ============================================================================

import type { Variants, Transition } from 'framer-motion';

// ============================================================================
// CONFIGURAÇÕES BASE
// ============================================================================

export const easings = {
  smooth: [0.4, 0, 0.2, 1] as [number, number, number, number],
  bounce: [0.68, -0.55, 0.265, 1.55] as [number, number, number, number],
  snappy: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
  gentle: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

export const durations = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  slower: 0.8,
};

// ============================================================================
// TRANSIÇÕES PADRÃO
// ============================================================================

export const transitions: Record<string, Transition> = {
  fast: { duration: durations.fast, ease: easings.smooth },
  default: { duration: durations.normal, ease: easings.smooth },
  slow: { duration: durations.slow, ease: easings.gentle },
  bounce: { duration: durations.normal, ease: easings.bounce },
  spring: { type: 'spring', stiffness: 300, damping: 30 },
  springGentle: { type: 'spring', stiffness: 200, damping: 25 },
};

// ============================================================================
// VARIANTES DE ENTRADA
// ============================================================================

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: transitions.default
  },
  exit: { 
    opacity: 0,
    transition: transitions.fast
  }
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: transitions.springGentle
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: transitions.fast
  }
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: transitions.springGentle
  },
  exit: { 
    opacity: 0, 
    y: 10,
    transition: transitions.fast
  }
};

export const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: transitions.spring
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: transitions.fast
  }
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: transitions.springGentle
  },
  exit: { 
    opacity: 0, 
    x: -20,
    transition: transitions.fast
  }
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: transitions.springGentle
  },
  exit: { 
    opacity: 0, 
    x: 20,
    transition: transitions.fast
  }
};

// ============================================================================
// STAGGER (ANIMAÇÕES EM SEQUÊNCIA)
// ============================================================================

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    }
  }
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: transitions.spring
  },
  exit: { 
    opacity: 0, 
    y: -5,
    transition: transitions.fast
  }
};

export const staggerScale: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: transitions.bounce
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
    transition: transitions.fast
  }
};

// ============================================================================
// INTERAÇÕES
// ============================================================================

export const hoverScale = {
  scale: 1.02,
  transition: transitions.fast
};

export const hoverScaleSm = {
  scale: 1.05,
  transition: transitions.fast
};

export const tapScale = {
  scale: 0.98
};

export const tapScaleSm = {
  scale: 0.95
};

// ============================================================================
// ANIMAÇÕES ESPECÍFICAS
// ============================================================================

// Aura Orb pulsante
export const orbPulse: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.8, 1, 0.8],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

// Digitando (typing effect)
export const typingIndicator: Variants = {
  animate: {
    opacity: [0.4, 1, 0.4],
    transition: {
      duration: 1.4,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

// Shimmer effect para loading
export const shimmer: Variants = {
  animate: {
    backgroundPosition: ['-200% 0', '200% 0'],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'linear'
    }
  }
};

// Bounce suave para notificações
export const bounceIn: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.3,
    y: 20
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 15
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.5,
    transition: transitions.fast
  }
};

// ============================================================================
// PAGE TRANSITIONS
// ============================================================================

export const pageTransition: Variants = {
  hidden: { 
    opacity: 0, 
    y: 10,
    filter: 'blur(4px)'
  },
  visible: { 
    opacity: 1, 
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: durations.slow,
      ease: easings.gentle
    }
  },
  exit: { 
    opacity: 0, 
    y: -10,
    filter: 'blur(4px)',
    transition: {
      duration: durations.fast,
      ease: easings.smooth
    }
  }
};

// ============================================================================
// CARD/ITEM ANIMATIONS
// ============================================================================

export const cardHover = {
  rest: {
    scale: 1,
    y: 0,
    boxShadow: '0 0 0 rgba(0,0,0,0)',
  },
  hover: {
    scale: 1.01,
    y: -2,
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    transition: {
      duration: 0.3,
      ease: easings.gentle
    }
  }
};

export const glowPulse = {
  animate: {
    boxShadow: [
      '0 0 0 0 rgba(16, 185, 129, 0)',
      '0 0 20px 2px rgba(16, 185, 129, 0.3)',
      '0 0 0 0 rgba(16, 185, 129, 0)'
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

// ============================================================================
// UTILITÁRIOS
// ============================================================================

export const createStaggerDelay = (index: number, baseDelay: number = 0.05): number => {
  return index * baseDelay;
};

export const createSpringConfig = (
  stiffness: number = 300, 
  damping: number = 30
): Transition => ({
  type: 'spring',
  stiffness,
  damping
});
