import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, Brain, ExternalLink, LoaderCircle, User } from 'lucide-react';
import { detectProviderTruncation } from '@/lib/auraResponse';
import { isLikelyTruncatedResponse, prepareAuraMessageContent, truncateLinkLabel } from '@/lib/auraMessage';
import type { AuraAction, AuraPointSuggestion } from '@/types/auraBlocks';
import type { AuraChatMessage, AuraRenderedSource } from '@/types/auraChat';

const AuraBlocks = lazy(() =>
  import('./AuraBlocks').then((module) => ({ default: module.AuraBlocks }))
);

interface AuraMessageListProps {
  messages: AuraChatMessage[];
  onContinue: (message: AuraChatMessage) => void;
  onAction: (action: AuraAction) => void;
  onPointClick: (point: AuraPointSuggestion) => void;
}

const auraMarkdownComponents = {
  h1: ({ children }: any) => <h1 className="mb-3 text-base font-semibold tracking-tight text-white">{children}</h1>,
  h2: ({ children }: any) => <h2 className="mb-2 mt-4 text-sm font-semibold tracking-tight text-emerald-200">{children}</h2>,
  h3: ({ children }: any) => <h3 className="mb-2 mt-3 text-sm font-medium text-sky-200">{children}</h3>,
  p: ({ children }: any) => <p className="mb-3 text-sm leading-6 text-white/95 last:mb-0">{children}</p>,
  strong: ({ children }: any) => <strong className="font-semibold text-white">{children}</strong>,
  em: ({ children }: any) => <em className="italic text-violet-100">{children}</em>,
  ul: ({ children }: any) => <ul className="mb-3 space-y-2">{children}</ul>,
  ol: ({ children }: any) => <ol className="mb-3 list-inside list-decimal space-y-2">{children}</ol>,
  li: ({ children }: any) => <li className="text-sm leading-6 text-white/90 marker:text-emerald-300">{children}</li>,
  blockquote: ({ children }: any) => (
    <blockquote className="my-3 border-l-2 border-emerald-400/40 pl-3 italic text-white/75">
      {children}
    </blockquote>
  ),
  code: ({ children }: any) => (
    <code className="rounded bg-white/10 px-1.5 py-0.5 text-[13px] text-emerald-200">
      {children}
    </code>
  ),
  hr: () => <div className="my-4 h-px bg-white/10" />,
  a: ({ href, children }: any) => (
    <a href={href} target="_blank" rel="noreferrer" className="break-all text-sky-300 underline underline-offset-2">
      {children}
    </a>
  )
};

const SourcesPanel = React.memo(function SourcesPanel({ sources }: { sources: AuraRenderedSource[] }) {
  if (!sources.length) return null;

  return (
    <div className="mt-5 space-y-2.5">
      <p className="text-[11px] uppercase tracking-[0.16em] text-white/35">Fontes</p>
      {sources.map((source, index) => (
        <a
          key={`${source.uri}-${index}`}
          href={source.uri}
          target="_blank"
          rel="noreferrer"
          className="block overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-colors hover:bg-white/10"
          title={source.uri}
        >
          <div className="flex items-start gap-3 p-3.5">
            {source.imageUrl ? (
              <img
                src={source.imageUrl}
                alt={source.title}
                className="h-12 w-12 rounded-xl border border-white/10 object-cover"
              />
            ) : (
              <img
                src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(source.domain)}&sz=64`}
                alt={source.domain}
                className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 p-2"
              />
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="break-words text-sm font-medium text-white">{source.title}</p>
                  <p className="mt-1 text-xs text-white/50">{source.domain}</p>
                  {source.author && <p className="mt-1 text-xs text-white/35">Por {source.author}</p>}
                </div>
                <ExternalLink className="mt-0.5 h-4 w-4 flex-shrink-0 text-white/40" />
              </div>
              <p className="mt-2 text-[11px] text-white/35">
                {truncateLinkLabel(source.uri)}
              </p>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
});

const ContinuePrompt = React.memo(function ContinuePrompt({
  message,
  canContinue,
  onContinue,
}: {
  message: AuraChatMessage;
  canContinue: boolean;
  onContinue: (message: AuraChatMessage) => void;
}) {
  if (!canContinue) return null;

  const isProviderTruncated = message.dados?.truncated || message.dados?.providerMeta?.truncatedByProvider;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-4 rounded-xl border border-amber-400/30 bg-gradient-to-r from-amber-500/10 to-orange-500/10"
    >
      <div className="flex items-start gap-3">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="p-2 rounded-full bg-amber-400/20"
        >
          <LoaderCircle className="w-4 h-4 text-amber-400" />
        </motion.div>
        
        <div className="flex-1">
          <p className="text-sm font-medium text-amber-200">
            {isProviderTruncated 
              ? 'Resposta interrompida pelo limite do modelo'
              : 'Resposta parece incompleta'}
          </p>
          <p className="text-xs text-amber-200/60 mt-1">
            {isProviderTruncated
              ? 'A resposta parou no meio. Você pode continuar exatamente de onde parou.'
              : 'Posso continuar respondendo se quiser.'}
          </p>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onContinue(message)}
            className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-900 text-sm font-semibold transition-colors shadow-lg shadow-amber-500/20"
          >
            <LoaderCircle className="h-4 w-4" />
            Continuar de onde parou
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
});

const AuraMessageItem = React.memo(function AuraMessageItem({
  message,
  onContinue,
  onAction,
  onPointClick,
}: {
  message: AuraChatMessage;
  onContinue: (message: AuraChatMessage) => void;
  onAction: (action: AuraAction) => void;
  onPointClick: (point: AuraPointSuggestion) => void;
}) {
  const fallbackPrepared = React.useMemo(() =>
    message.tipo === 'aura'
      ? prepareAuraMessageContent(message.texto)
      : { body: message.texto, sources: [], structuredResponse: undefined, structured: false, displayText: message.texto, isTruncated: false },
    [message.tipo, message.texto]
  );
  
  const rendered = React.useMemo(() =>
    message.tipo === 'aura'
      ? {
          body: message.texto,
          sources: message.dados?.sources ?? fallbackPrepared.sources,
          structuredResponse: message.dados?.structuredResponse ?? fallbackPrepared.structuredResponse,
        }
      : { body: message.texto, sources: [] as AuraRenderedSource[], structuredResponse: undefined },
    [message.tipo, message.texto, message.dados?.sources, message.dados?.structuredResponse, fallbackPrepared.sources, fallbackPrepared.structuredResponse]
  );
  
  const canContinue = React.useMemo(() =>
    message.tipo === 'aura' &&
    !!message.usouApi &&
    (!!message.dados?.truncated ||
      !!fallbackPrepared.isTruncated ||
      detectProviderTruncation(rendered.body, message.dados?.providerMeta) ||
      isLikelyTruncatedResponse(rendered.body)),
    [message.tipo, message.usouApi, message.dados?.truncated, message.dados?.providerMeta, fallbackPrepared.isTruncated, rendered.body]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3.5 ${message.tipo === 'usuario' ? 'flex-row-reverse' : ''}`}
    >
      <div
        className={`mt-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-2xl ${
          message.tipo === 'aura'
            ? 'bg-gradient-to-br from-auris-indigo to-auris-sage shadow-[0_10px_24px_rgba(99,102,241,0.22)]'
            : 'bg-white/10'
        }`}
      >
        {message.tipo === 'aura' ? <Bot className="h-4 w-4 text-white" /> : <User className="h-4 w-4 text-white" />}
      </div>

      <div
        className={`max-w-[84%] rounded-[24px] border p-4 xl:max-w-[78%] 2xl:max-w-[74%] ${
          message.tipo === 'aura'
            ? 'rounded-tl-none border-white/12 bg-slate-900/70 shadow-[0_14px_30px_rgba(15,23,42,0.22)]'
            : 'rounded-tr-none border-emerald-300/25 bg-gradient-to-br from-emerald-500/18 to-teal-500/10 shadow-[0_14px_30px_rgba(16,185,129,0.12)]'
        }`}
      >
        {message.tipo === 'aura' ? (
          rendered.structuredResponse ? (
            <Suspense
              fallback={
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-white/35">Leitura clínica</p>
                  <p className="mt-2 text-sm leading-6 text-white/85">{rendered.body}</p>
                </div>
              }
            >
              <AuraBlocks response={rendered.structuredResponse} onAction={onAction} onPointClick={onPointClick} />
            </Suspense>
          ) : (
            <div className="aura-markdown">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={auraMarkdownComponents}>
                {/* Se parece JSON truncado, mostra placeholder em vez do JSON cru */}
                {(fallbackPrepared.isTruncated && rendered.body.trim().startsWith('{'))
                  ? '*Processando resposta estruturada...*'
                  : rendered.body}
              </ReactMarkdown>
            </div>
          )
        ) : (
          <p className="whitespace-pre-line break-words text-sm leading-6 text-white">{rendered.body}</p>
        )}

        {message.tipo === 'aura' && <SourcesPanel sources={rendered.sources} />}
        <ContinuePrompt message={message} canContinue={canContinue} onContinue={onContinue} />

        <div className="mt-3 flex items-center gap-2">
          <p className="text-xs text-white/40">
            {new Date(message.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </p>
          {message.usouApi && (
            <span className="flex items-center gap-1 text-xs text-auris-sage">
              <Brain className="h-3 w-3" /> IA
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}, (prev, next) =>
  prev.message === next.message &&
  prev.onContinue === next.onContinue &&
  prev.onAction === next.onAction &&
  prev.onPointClick === next.onPointClick
);

export const AuraMessageList = React.memo(function AuraMessageList({
  messages,
  onContinue,
  onAction,
  onPointClick,
}: AuraMessageListProps) {
  return (
    <>
      {messages.map((message) => (
        <AuraMessageItem
          key={message.id}
          message={message}
          onContinue={onContinue}
          onAction={onAction}
          onPointClick={onPointClick}
        />
      ))}
    </>
  );
}, (prev, next) =>
  prev.messages === next.messages &&
  prev.onContinue === next.onContinue &&
  prev.onAction === next.onAction &&
  prev.onPointClick === next.onPointClick
);
