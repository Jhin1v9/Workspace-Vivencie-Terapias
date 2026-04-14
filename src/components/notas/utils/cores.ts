/**
 * 🎨 Cores das Notas
 * Configurações de cores para categorização visual
 */

import type { CorConfig, NotaCor } from '../types/notas.types';

/** Configurações de todas as cores disponíveis */
export const coresConfig: Record<NotaCor, CorConfig> = {
  default: {
    id: 'default',
    nome: 'Padrão',
    bg: 'bg-slate-800/50',
    border: 'border-slate-700/50',
    text: 'text-slate-200',
    indicator: 'bg-slate-500',
  },
  red: {
    id: 'red',
    nome: 'Vermelho',
    bg: 'bg-red-950/30',
    border: 'border-red-800/50',
    text: 'text-red-200',
    indicator: 'bg-red-500',
  },
  orange: {
    id: 'orange',
    nome: 'Laranja',
    bg: 'bg-orange-950/30',
    border: 'border-orange-800/50',
    text: 'text-orange-200',
    indicator: 'bg-orange-500',
  },
  yellow: {
    id: 'yellow',
    nome: 'Amarelo',
    bg: 'bg-yellow-950/30',
    border: 'border-yellow-800/50',
    text: 'text-yellow-200',
    indicator: 'bg-yellow-500',
  },
  green: {
    id: 'green',
    nome: 'Verde',
    bg: 'bg-emerald-950/30',
    border: 'border-emerald-800/50',
    text: 'text-emerald-200',
    indicator: 'bg-emerald-500',
  },
  teal: {
    id: 'teal',
    nome: 'Turquesa',
    bg: 'bg-teal-950/30',
    border: 'border-teal-800/50',
    text: 'text-teal-200',
    indicator: 'bg-teal-500',
  },
  blue: {
    id: 'blue',
    nome: 'Azul',
    bg: 'bg-blue-950/30',
    border: 'border-blue-800/50',
    text: 'text-blue-200',
    indicator: 'bg-blue-500',
  },
  purple: {
    id: 'purple',
    nome: 'Roxo',
    bg: 'bg-purple-950/30',
    border: 'border-purple-800/50',
    text: 'text-purple-200',
    indicator: 'bg-purple-500',
  },
  pink: {
    id: 'pink',
    nome: 'Rosa',
    bg: 'bg-pink-950/30',
    border: 'border-pink-800/50',
    text: 'text-pink-200',
    indicator: 'bg-pink-500',
  },
};

/** Lista de cores para seleção */
export const coresList: NotaCor[] = [
  'default',
  'red',
  'orange',
  'yellow',
  'green',
  'teal',
  'blue',
  'purple',
  'pink',
];

/** Obtém configuração de cor por ID */
export function getCorConfig(cor: NotaCor): CorConfig {
  return coresConfig[cor] || coresConfig.default;
}

/** Gera classe CSS para card de nota */
export function getNotaCardClasses(cor: NotaCor, selecionada: boolean = false): string {
  const config = getCorConfig(cor);
  const baseClasses = [
    'relative p-4 rounded-xl border transition-all duration-200 cursor-pointer',
    'hover:shadow-lg hover:scale-[1.02]',
    config.bg,
    config.border,
    config.text,
  ];
  
  if (selecionada) {
    baseClasses.push('ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-950');
  }
  
  return baseClasses.join(' ');
}

/** Gera classe CSS para indicador de cor */
export function getCorIndicatorClasses(cor: NotaCor): string {
  const config = getCorConfig(cor);
  return `w-3 h-3 rounded-full ${config.indicator}`;
}
