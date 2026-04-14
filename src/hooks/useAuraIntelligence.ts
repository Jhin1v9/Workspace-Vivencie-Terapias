// ============================================================================
// AURA INTELLIGENCE - Sistema de Inteligencia Preditiva e Contextual
// ============================================================================

import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuraStore } from '@/stores/useAuraStore';
import type { AuraChatMessage } from '@/types/auraChat';

export type ContextoApp = 
  | 'dashboard' | 'prontuarios' | 'mapa' | 'sessao' 
  | 'agenda' | 'studio' | 'protocolos' | 'biblioteca' 
  | 'configuracoes' | 'desconhecido';

export type IntencaoUsuario =
  | 'criar_paciente' | 'buscar_paciente' | 'iniciar_sessao'
  | 'ver_agenda' | 'abrir_mapa' | 'sugerir_protocolo'
  | 'aplicar_protocolo' | 'gerar_relatorio' | 'explorar_conteudo'
  | 'configurar' | 'conversar';

export interface SugestaoInteligente {
  id: string;
  tipo: 'acao' | 'pergunta' | 'atalho' | 'info';
  texto: string;
  comando: string;
  confianca: number;
  icone: string;
  cor: string;
  contexto: string;
}

export interface BannerContextual {
  id: string;
  tipo: 'dica' | 'atalho' | 'lembrete' | 'alerta';
  titulo: string;
  mensagem: string;
  acao?: { texto: string; comando: string; };
  duracao: number;
  prioridade: 'baixa' | 'media' | 'alta';
}

export interface AnaliseContexto {
  contextoAtual: ContextoApp;
  intencaoProvavel: IntencaoUsuario;
  topicoRecorrente: string | null;
  tempoDesdeUltimaAcao: number;
  sessaoAtiva: boolean;
  pacienteSelecionado: boolean;
  pontosNoProtocolo: number;
}

// Utilitarios
const getContextoFromPath = (pathname: string): ContextoApp => {
  if (pathname.includes('prontuario')) return 'prontuarios';
  if (pathname.includes('mapa')) return 'mapa';
  if (pathname.includes('sessao')) return 'sessao';
  if (pathname.includes('agenda')) return 'agenda';
  if (pathname.includes('studio')) return 'studio';
  if (pathname.includes('protocolo')) return 'protocolos';
  if (pathname.includes('biblioteca')) return 'biblioteca';
  if (pathname.includes('config')) return 'configuracoes';
  if (pathname === '/') return 'dashboard';
  return 'desconhecido';
};

const analisarIntencao = (mensagens: AuraChatMessage[]): IntencaoUsuario => {
  if (mensagens.length === 0) return 'conversar';
  const ultima = mensagens[mensagens.length - 1]?.texto.toLowerCase() || '';
  
  if (ultima.includes('criar') && ultima.includes('paciente')) return 'criar_paciente';
  if (ultima.includes('buscar') || ultima.includes('procurar')) return 'buscar_paciente';
  if (ultima.includes('sessao') || ultima.includes('atendimento')) return 'iniciar_sessao';
  if (ultima.includes('agenda') || ultima.includes('calendario')) return 'ver_agenda';
  if (ultima.includes('mapa') || ultima.includes('orelha')) return 'abrir_mapa';
  if (ultima.includes('protocolo')) return 'sugerir_protocolo';
  if (ultima.includes('relatorio')) return 'gerar_relatorio';
  return 'conversar';
};

export const useAuraIntelligence = () => {
  const [pathname, setPathname] = useState(window.location.pathname);
  const { mensagens } = useAuraStore();
  
  // Atualizar pathname quando mudar
  useEffect(() => {
    const handleLocationChange = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', handleLocationChange);
    const interval = setInterval(handleLocationChange, 500); // Fallback
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      clearInterval(interval);
    };
  }, []);
  
  const [sugestoes, setSugestoes] = useState<SugestaoInteligente[]>([]);
  const [banner, setBanner] = useState<BannerContextual | null>(null);
  const [analise, setAnalise] = useState<AnaliseContexto>({
    contextoAtual: 'dashboard',
    intencaoProvavel: 'conversar',
    topicoRecorrente: null,
    tempoDesdeUltimaAcao: 0,
    sessaoAtiva: false,
    pacienteSelecionado: false,
    pontosNoProtocolo: 0
  });
  const ultimaAnalise = useRef<Date>(new Date());

  // Gerar sugestoes baseadas no contexto
  const gerarSugestoes = useCallback((): SugestaoInteligente[] => {
    const ctx = getContextoFromPath(pathname);
    const intencao = analisarIntencao(mensagens);
    const sugestoes: SugestaoInteligente[] = [];
    
    // Sugestoes baseadas no contexto atual
    switch (ctx) {
      case 'dashboard':
        sugestoes.push(
          { id: '1', tipo: 'acao', texto: 'Criar novo paciente', comando: 'criar paciente', confianca: 90, icone: 'UserPlus', cor: 'bg-emerald-500', contexto: 'dashboard' },
          { id: '2', tipo: 'atalho', texto: 'Ver agenda de hoje', comando: 'abrir agenda hoje', confianca: 85, icone: 'Calendar', cor: 'bg-blue-500', contexto: 'dashboard' },
          { id: '3', tipo: 'acao', texto: 'Iniciar sessao rapida', comando: 'iniciar sessao', confianca: 80, icone: 'Play', cor: 'bg-purple-500', contexto: 'dashboard' }
        );
        break;
        
      case 'prontuarios':
        sugestoes.push(
          { id: '4', tipo: 'acao', texto: 'Novo cadastro', comando: 'criar paciente', confianca: 95, icone: 'UserPlus', cor: 'bg-emerald-500', contexto: 'prontuarios' },
          { id: '5', tipo: 'pergunta', texto: 'Buscar por nome', comando: 'buscar paciente ', confianca: 90, icone: 'Search', cor: 'bg-blue-500', contexto: 'prontuarios' },
          { id: '6', tipo: 'atalho', texto: 'Ultimos pacientes', comando: 'mostrar ultimos pacientes', confianca: 75, icone: 'History', cor: 'bg-slate-500', contexto: 'prontuarios' }
        );
        break;
        
      case 'mapa':
        sugestoes.push(
          { id: '7', tipo: 'acao', texto: 'Sugerir protocolo', comando: 'sugerir protocolo', confianca: 95, icone: 'Sparkles', cor: 'bg-purple-500', contexto: 'mapa' },
          { id: '8', tipo: 'atalho', texto: 'Limpar selecao', comando: 'limpar pontos', confianca: 85, icone: 'Eraser', cor: 'bg-red-500', contexto: 'mapa' },
          { id: '9', tipo: 'info', texto: 'Ver pontos anatomicos', comando: 'mostrar guia anatomico', confianca: 70, icone: 'BookOpen', cor: 'bg-amber-500', contexto: 'mapa' }
        );
        break;
        
      case 'sessao':
        sugestoes.push(
          { id: '10', tipo: 'acao', texto: 'Aplicar protocolo', comando: 'aplicar protocolo', confianca: 95, icone: 'CheckCircle', cor: 'bg-emerald-500', contexto: 'sessao' },
          { id: '11', tipo: 'atalho', texto: 'Iniciar timer', comando: 'iniciar cronometro', confianca: 80, icone: 'Timer', cor: 'bg-blue-500', contexto: 'sessao' },
          { id: '12', tipo: 'acao', texto: 'Finalizar sessao', comando: 'finalizar sessao', confianca: 75, icone: 'Flag', cor: 'bg-orange-500', contexto: 'sessao' }
        );
        break;
        
      case 'agenda':
        sugestoes.push(
          { id: '13', tipo: 'acao', texto: 'Novo agendamento', comando: 'criar agendamento', confianca: 95, icone: 'Plus', cor: 'bg-emerald-500', contexto: 'agenda' },
          { id: '14', tipo: 'atalho', texto: 'Ver hoje', comando: 'mostrar agenda hoje', confianca: 90, icone: 'CalendarDays', cor: 'bg-blue-500', contexto: 'agenda' },
          { id: '15', tipo: 'pergunta', texto: 'Proximos compromissos', comando: 'proximos agendamentos', confianca: 80, icone: 'Clock', cor: 'bg-purple-500', contexto: 'agenda' }
        );
        break;
    }
    
    // Adicionar sugestoes baseadas na intencao detectada
    if (intencao === 'criar_paciente') {
      sugestoes.unshift({
        id: 'int1', tipo: 'acao', texto: 'Preencher cadastro rapido',
        comando: 'criar paciente rapido', confianca: 98, icone: 'Zap', cor: 'bg-emerald-600', contexto: 'intencao'
      });
    }
    
    return sugestoes.slice(0, 8);
  }, [pathname, mensagens]);

  // Gerar banner contextual
  const gerarBanner = useCallback((): BannerContextual | null => {
    const ctx = getContextoFromPath(pathname);
    
    // Banner para contexto especifico
    if (ctx === 'mapa' && analise.pontosNoProtocolo > 0) {
      return {
        id: 'banner1',
        tipo: 'atalho',
        titulo: 'Protocolo em andamento',
        mensagem: `Voce tem ${analise.pontosNoProtocolo} pontos selecionados. Deseja aplicar agora?`,
        acao: { texto: 'Aplicar', comando: 'aplicar protocolo atual' },
        duracao: 10000,
        prioridade: 'media'
      };
    }
    
    if (ctx === 'dashboard' && mensagens.length > 5) {
      return {
        id: 'banner2',
        tipo: 'dica',
        titulo: 'Dica Rapida',
        mensagem: 'Diga "iniciar sessao rapida" para pular o cadastro e comecar o atendimento.',
        duracao: 8000,
        prioridade: 'baixa'
      };
    }
    
    return null;
  }, [pathname, analise.pontosNoProtocolo, mensagens.length]);

  // Efeito para atualizar analise
  useEffect(() => {
    const ctx = getContextoFromPath(pathname);
    const intencao = analisarIntencao(mensagens);
    
    setAnalise(prev => ({
      ...prev,
      contextoAtual: ctx,
      intencaoProvavel: intencao,
      tempoDesdeUltimaAcao: Math.floor((Date.now() - ultimaAnalise.current.getTime()) / 60000)
    }));
  }, [pathname, mensagens]);

  // Efeito para atualizar sugestoes
  useEffect(() => {
    const novasSugestoes = gerarSugestoes();
    setSugestoes(novasSugestoes);
  }, [gerarSugestoes]);

  // Efeito para atualizar banner
  useEffect(() => {
    const novoBanner = gerarBanner();
    setBanner(novoBanner);
  }, [gerarBanner]);

  // Registrar acao do usuario
  const registrarAcao = useCallback((_acao: string) => {
    ultimaAnalise.current = new Date();
  }, []);

  return {
    sugestoes,
    banner,
    analise,
    registrarAcao,
    atualizarPontosProtocolo: (count: number) => {
      setAnalise(prev => ({ ...prev, pontosNoProtocolo: count }));
    }
  };
};

export default useAuraIntelligence;
