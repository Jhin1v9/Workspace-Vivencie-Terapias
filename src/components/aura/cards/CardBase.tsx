// CardBase - Componente base para todos os cards da Aura

import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// TIPOS
// ============================================================================

export type CardColor = 'sage' | 'indigo' | 'amber' | 'rose' | 'blue' | 'slate' | 'violet';

export interface CardAction {
  label: string;
  onClick: () => void;
  icon?: LucideIcon;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export interface CardBaseProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  color?: CardColor;
  children: React.ReactNode;
  actions?: CardAction[];
  className?: string;
  compact?: boolean;
}

// ============================================================================
// CONFIGURAÇÕES DE COR
// ============================================================================

const colorConfig: Record<CardColor, {
  bg: string;
  border: string;
  iconBg: string;
  iconColor: string;
  titleColor: string;
  subtitleColor: string;
  actionPrimary: string;
  actionSecondary: string;
}> = {
  sage: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-400',
    titleColor: 'text-emerald-100',
    subtitleColor: 'text-emerald-300/70',
    actionPrimary: 'bg-emerald-500 hover:bg-emerald-400 text-white',
    actionSecondary: 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300',
  },
  indigo: {
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
    iconBg: 'bg-indigo-500/20',
    iconColor: 'text-indigo-400',
    titleColor: 'text-indigo-100',
    subtitleColor: 'text-indigo-300/70',
    actionPrimary: 'bg-indigo-500 hover:bg-indigo-400 text-white',
    actionSecondary: 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300',
  },
  amber: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    iconBg: 'bg-amber-500/20',
    iconColor: 'text-amber-400',
    titleColor: 'text-amber-100',
    subtitleColor: 'text-amber-300/70',
    actionPrimary: 'bg-amber-500 hover:bg-amber-400 text-white',
    actionSecondary: 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300',
  },
  rose: {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    iconBg: 'bg-rose-500/20',
    iconColor: 'text-rose-400',
    titleColor: 'text-rose-100',
    subtitleColor: 'text-rose-300/70',
    actionPrimary: 'bg-rose-500 hover:bg-rose-400 text-white',
    actionSecondary: 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300',
  },
  blue: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-400',
    titleColor: 'text-blue-100',
    subtitleColor: 'text-blue-300/70',
    actionPrimary: 'bg-blue-500 hover:bg-blue-400 text-white',
    actionSecondary: 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-300',
  },
  slate: {
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/20',
    iconBg: 'bg-slate-500/20',
    iconColor: 'text-slate-400',
    titleColor: 'text-slate-100',
    subtitleColor: 'text-slate-300/70',
    actionPrimary: 'bg-slate-500 hover:bg-slate-400 text-white',
    actionSecondary: 'bg-slate-500/10 hover:bg-slate-500/20 text-slate-300',
  },
  violet: {
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    iconBg: 'bg-violet-500/20',
    iconColor: 'text-violet-400',
    titleColor: 'text-violet-100',
    subtitleColor: 'text-violet-300/70',
    actionPrimary: 'bg-violet-500 hover:bg-violet-400 text-white',
    actionSecondary: 'bg-violet-500/10 hover:bg-violet-500/20 text-violet-300',
  },
};

// ============================================================================
// COMPONENTE
// ============================================================================

export const CardBase: React.FC<CardBaseProps> = ({
  title,
  subtitle,
  icon: Icon,
  color = 'slate',
  children,
  actions,
  className,
  compact = false,
}) => {
  const colors = colorConfig[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'rounded-xl border backdrop-blur-sm overflow-hidden',
        colors.bg,
        colors.border,
        className
      )}
    >
      {/* Header */}
      <div className={cn(
        'flex items-start gap-3 border-b border-white/10',
        compact ? 'p-3' : 'p-4'
      )}>
        {Icon && (
          <div className={cn(
            'rounded-lg flex items-center justify-center flex-shrink-0',
            colors.iconBg,
            colors.iconColor,
            compact ? 'w-8 h-8' : 'w-10 h-10'
          )}>
            <Icon className={compact ? 'w-4 h-4' : 'w-5 h-5'} />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            'font-semibold truncate',
            colors.titleColor,
            compact ? 'text-sm' : 'text-base'
          )}>
            {title}
          </h3>
          {subtitle && (
            <p className={cn(
              'truncate',
              colors.subtitleColor,
              compact ? 'text-xs' : 'text-sm'
            )}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className={compact ? 'p-3' : 'p-4'}>
        {children}
      </div>

      {/* Actions */}
      {actions && actions.length > 0 && (
        <div className="flex gap-2 px-4 pb-4">
          {actions.map((action, index) => {
            const ActionIcon = action.icon;
            const isPrimary = action.variant === 'primary' || index === 0;
            
            return (
              <motion.button
                key={action.label}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={action.onClick}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  isPrimary ? colors.actionPrimary : colors.actionSecondary
                )}
              >
                {ActionIcon && <ActionIcon className="w-3.5 h-3.5" />}
                {action.label}
              </motion.button>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default CardBase;
