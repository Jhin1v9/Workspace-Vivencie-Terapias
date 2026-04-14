// AuraBlocks - Renderiza respostas estruturadas da Aura com cards

import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  ArrowRightCircle,
  Compass,
  ExternalLink,
  GitBranch,
  MapPinned,
  PlayCircle,
  Sparkles,
  Stethoscope,
} from 'lucide-react';
import type { AuraAction, AuraBlock, AuraPointSuggestion, AuraResponse } from '@/types/auraBlocks';
import { CardBase, CardPontoAuricular } from './cards';

// Types
interface AuraBlocksProps {
  response: AuraResponse;
  onAction?: (action: AuraAction) => void;
  onPointClick?: (point: AuraPointSuggestion) => void;
}

type MarkdownProps = { children?: React.ReactNode };
type LinkProps = { href?: string; children?: React.ReactNode };

// Markdown components
const markdownComponents = {
  p: ({ children }: MarkdownProps) => <p className="text-sm leading-6 text-white/90 mb-3 last:mb-0">{children}</p>,
  strong: ({ children }: MarkdownProps) => <strong className="font-semibold text-white">{children}</strong>,
  ul: ({ children }: MarkdownProps) => <ul className="space-y-2 mb-3">{children}</ul>,
  ol: ({ children }: MarkdownProps) => <ol className="space-y-2 mb-3 list-decimal list-inside">{children}</ol>,
  li: ({ children }: MarkdownProps) => <li className="text-sm leading-6 text-white/85 marker:text-white/60">{children}</li>,
  h1: ({ children }: MarkdownProps) => <h1 className="text-base font-semibold text-white mb-3">{children}</h1>,
  h2: ({ children }: MarkdownProps) => <h2 className="text-sm font-semibold text-white mb-2">{children}</h2>,
  h3: ({ children }: MarkdownProps) => <h3 className="text-sm font-medium text-white/90 mb-2">{children}</h3>,
  a: ({ href, children }: LinkProps) => (
    <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sky-300 underline underline-offset-2 break-all">
      {children}
      <ExternalLink className="w-3 h-3" />
    </a>
  ),
  code: ({ children }: MarkdownProps) => (
    <code className="rounded bg-black/20 px-1.5 py-0.5 text-xs text-emerald-200">{children}</code>
  ),
};

// Block configuration
const blockConfig = {
  clinical: { icon: Stethoscope, label: 'Visão Clínica', color: 'sage' as const },
  rootcause: { icon: GitBranch, label: 'Causa-Raiz', color: 'indigo' as const },
  direction: { icon: Compass, label: 'Direção Terapêutica', color: 'amber' as const },
  nextstep: { icon: ArrowRightCircle, label: 'Próximo Passo', color: 'violet' as const },
};

const actionIcons: Record<AuraAction['action'], React.ReactNode> = {
  open_map: <MapPinned className="w-4 h-4" />,
  start_session: <PlayCircle className="w-4 h-4" />,
  add_protocol: <Sparkles className="w-4 h-4" />,
  ask_patient: <ArrowRightCircle className="w-4 h-4" />,
};

// Action Buttons Component
const ActionButtons: React.FC<{
  actions?: AuraAction[];
  onAction?: (action: AuraAction) => void;
}> = ({ actions, onAction }) => {
  if (!actions?.length) return null;

  return (
    <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
      {actions.map((action, index) => {
        const primary = index === 0;
        return (
          <motion.button
            key={`${action.label}-${index}`}
            whileHover={{ y: -1, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAction?.(action)}
            className={
              primary
                ? 'inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:brightness-110'
                : 'inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition-all hover:border-white/20 hover:bg-white/15'
            }
          >
            {actionIcons[action.action]}
            {action.label}
          </motion.button>
        );
      })}
    </div>
  );
};

// Point Cards usando novo componente CardPontoAuricular
const PointCards: React.FC<{
  points?: AuraPointSuggestion[];
  onPointClick?: (point: AuraPointSuggestion) => void;
}> = ({ points, onPointClick }) => {
  if (!points?.length) return null;

  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
      {points.map((point) => (
        <CardPontoAuricular
          key={`${point.code}-${point.order ?? point.namePt}`}
          ponto={{
            id: point.code,
            nome: point.namePt,
            codigo: point.code,
            regiao: point.technique || 'Geral',
            prioridade: 'importante',
            funcao: point.rationale || '',
            indicacoes: point.technique ? [point.technique] : [],
            sistema: 'neurofisiologico',
          }}
          onSelecionar={() => onPointClick?.(point)}
          compact
        />
      ))}
    </div>
  );
};

// Individual Block Card
const AuraBlockCard: React.FC<{
  block: AuraBlock;
  index: number;
  onAction?: (action: AuraAction) => void;
  onPointClick?: (point: AuraPointSuggestion) => void;
}> = ({ block, index, onAction, onPointClick }) => {
  // Proteção contra blocos inválidos
  if (!block || !block.type || !blockConfig[block.type]) {
    return (
      <CardBase
        title="Informação"
        color="slate"
        compact
      >
        <p className="text-sm text-white/70">{block?.content || 'Conteúdo indisponível'}</p>
      </CardBase>
    );
  }
  
  const config = blockConfig[block.type];
  const Icon = config.icon;
  const chain = block.metadata?.chain ?? [];
  
  // Meta items
  const metaItems: string[] = [];
  if (block.metadata?.pattern) metaItems.push(block.metadata.pattern);
  if (block.metadata?.sistema) metaItems.push(`Sistema: ${block.metadata.sistema}`);
  if (block.metadata?.protocol) metaItems.push(`Protocolo: ${block.metadata.protocol}`);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.08, type: 'spring', damping: 24, stiffness: 280 }}
    >
      <CardBase
        title={block.title}
        subtitle={config.label}
        icon={Icon}
        color={config.color}
        compact
      >
        {/* Meta tags */}
        {metaItems.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {metaItems.map((item) => (
              <span 
                key={item} 
                className="inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium bg-white/10 text-white/70"
              >
                {item}
              </span>
            ))}
          </div>
        )}

        {/* Chain de raciocínio */}
        {chain.length > 0 && (
          <div className="rounded-xl border border-white/10 bg-black/20 p-3 mb-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/40">
              Encadeamento clínico
            </p>
            <ul className="space-y-1.5">
              {chain.map((step: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-white/75">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-white/40" />
                  {step}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Content */}
        <div className="prose prose-invert prose-sm max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {block.content}
          </ReactMarkdown>
        </div>

        {/* Points */}
        {block.metadata?.points && block.metadata.points.length > 0 && (
          <PointCards 
            points={block.metadata.points} 
            onPointClick={onPointClick} 
          />
        )}

        {/* Actions */}
        <ActionButtons 
          actions={block.suggestedActions} 
          onAction={onAction} 
        />
      </CardBase>
    </motion.div>
  );
};

// Main Component
export const AuraBlocks: React.FC<AuraBlocksProps> = ({ 
  response, 
  onAction, 
  onPointClick 
}) => {
  if (!response?.blocks?.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm text-white/50">Sem conteúdo estruturado para exibir.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {response.blocks.map((block, index) => (
        <AuraBlockCard
          key={`${block.type}-${index}`}
          block={block}
          index={index}
          onAction={onAction}
          onPointClick={onPointClick}
        />
      ))}
      
      {/* Global Actions */}
      {response.suggestedActions && response.suggestedActions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: response.blocks.length * 0.08 }}
          className="pt-2"
        >
          <ActionButtons actions={response.suggestedActions} onAction={onAction} />
        </motion.div>
      )}
    </div>
  );
};

export default AuraBlocks;
