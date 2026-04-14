// ============================================================================
// AURA TOOLS EXECUTOR - Executa as ferramentas no sistema real
// Conecta as ferramentas da Aura com os stores do Auris OS
// ============================================================================

import type { ToolCall, ToolResult } from './auraTools';
import { useOSStore } from '@/stores/useOSStore';
import { usePacientesStore } from '@/stores/usePacientesStore';
import { useSessoesStore } from '@/stores/useSessoesStore';
import { usePontosStore } from '@/stores/usePontosStore';
import { useConfigStore } from '@/stores/useConfigStore';
import { useCalendarStore } from '@/stores/useCalendarStore';
import { useFinancasStore } from '@/stores/useFinancasStore';
import { todosDocumentos, todosEstudos } from './biblioteca/documentosOficiais';
import type { 
  Paciente,
  Sessao,
  PontoAuricular,
  ConfiguracaoSistema,
  JanelaOS
} from '@/types';
import type { CalendarEvent } from '@/types/calendar';
import { v4 as uuidv4 } from 'uuid';

// ============================================================================
// TIPO DO EXECUTOR
// ============================================================================

export type ToolExecutorFunction = (call: ToolCall) => Promise<ToolResult>;

// ============================================================================
// EXECUTOR PRINCIPAL
// ============================================================================

export async function executeTool(call: ToolCall): Promise<ToolResult> {
  const { tool, parameters } = call;
  
  console.log(`[Aura Tools] Executando: ${tool}`, parameters);
  
  try {
    switch (tool) {
      // =====================================================
      // SISTEMA OPERACIONAL
      // =====================================================
      case 'abrir_app':
        return await executeAbrirApp(parameters);
      case 'fechar_app':
        return await executeFecharApp(parameters);
      case 'minimizar_app':
        return await executeMinimizarApp(parameters);
      case 'focar_app':
        return await executeFocarApp(parameters);
      case 'listar_apps_abertos':
        return await executeListarAppsAbertos();

      // =====================================================
      // PACIENTES
      // =====================================================
      case 'criar_paciente':
        return await executeCriarPaciente(parameters);
      case 'atualizar_paciente':
        return await executeAtualizarPaciente(parameters);
      case 'deletar_paciente':
        return await executeDeletarPaciente(parameters);
      case 'selecionar_paciente':
        return await executeSelecionarPaciente(parameters);
      case 'buscar_paciente':
        return await executeBuscarPaciente(parameters);
      case 'listar_pacientes':
        return await executeListarPacientes();
      case 'get_paciente_by_id':
        return await executeGetPacienteById(parameters);

      // =====================================================
      // SESSÕES
      // =====================================================
      case 'criar_sessao':
        return await executeCriarSessao(parameters);
      case 'atualizar_sessao':
        return await executeAtualizarSessao(parameters);
      case 'deletar_sessao':
        return await executeDeletarSessao(parameters);
      case 'get_sessoes_paciente':
        return await executeGetSessoesPaciente(parameters);
      case 'get_ultima_sessao':
        return await executeGetUltimaSessao(parameters);
      case 'get_next_numero_sessao':
        return await executeGetNextNumeroSessao(parameters);

      // =====================================================
      // PONTOS AURICULARES
      // =====================================================
      case 'selecionar_ponto':
        return await executeSelecionarPonto(parameters);
      case 'remover_ponto':
        return await executeRemoverPonto(parameters);
      case 'limpar_selecao':
        return await executeLimparSelecao();
      case 'buscar_ponto':
        return await executeBuscarPonto(parameters);
      case 'listar_pontos':
        return await executeListarPontos();
      case 'get_pontos_by_regiao':
        return await executeGetPontosByRegiao(parameters);
      case 'get_pontos_estrela':
        return await executeGetPontosEstrela();
      case 'adicionar_ponto_protocolo':
        return await executeAdicionarPontoProtocolo(parameters);
      case 'remover_ponto_protocolo':
        return await executeRemoverPontoProtocolo(parameters);

      // =====================================================
      // CALENDÁRIO
      // =====================================================
      case 'criar_evento':
        return await executeCriarEvento(parameters);
      case 'atualizar_evento':
        return await executeAtualizarEvento(parameters);
      case 'deletar_evento':
        return await executeDeletarEvento(parameters);
      case 'get_eventos':
        return await executeGetEventos(parameters);
      case 'get_eventos_hoje':
        return await executeGetEventosHoje();
      case 'get_proximos_eventos':
        return await executeGetProximosEventos(parameters);
      case 'sugerir_agendamento':
        return await executeSugerirAgendamento(parameters);
      case 'confirmar_agendamento':
        return await executeConfirmarAgendamento(parameters);
      case 'cancelar_agendamento':
        return await executeCancelarAgendamento(parameters);
      case 'completar_agendamento':
        return await executeCompletarAgendamento(parameters);
      case 'registrar_pagamento':
        return await executeRegistrarPagamento(parameters);
      case 'get_resumo_financeiro':
        return await executeGetResumoFinanceiro(parameters);
      case 'get_receita_mes':
        return await executeGetReceitaMes(parameters);

      // =====================================================
      // CONFIGURAÇÕES
      // =====================================================
      case 'set_wallpaper':
        return await executeSetWallpaper(parameters);
      case 'set_modo_reiki':
        return await executeSetModoReiki(parameters);
      case 'set_terapeuta_nome':
        return await executeSetTerapeutaNome(parameters);
      case 'set_ai_provider':
        return await executeSetAIProvider(parameters);
      case 'get_configuracoes':
        return await executeGetConfiguracoes();

      // =====================================================
      // CONHECIMENTO
      // =====================================================
      case 'explicar_ponto':
        return await executeExplicarPonto(parameters);
      case 'sugerir_protocolo':
        return await executeSugerirProtocolo(parameters);
      case 'analisar_queixa':
        return await executeAnalisarQueixa(parameters);
      case 'get_documentos_oficiais':
        return await executeGetDocumentosOficiais(parameters);

      default:
        return {
          success: false,
          error: `Ferramenta desconhecida: ${tool}`,
          message: `Não sei como executar "${tool}"`,
        };
    }
  } catch (error) {
    console.error(`[Aura Tools] Erro ao executar ${tool}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      message: `Ops, algo deu errado ao executar "${tool}"`,
    };
  }
}

// ============================================================================
// IMPLEMENTAÇÕES - SISTEMA
// ============================================================================

async function executeAbrirApp(params: Record<string, unknown>): Promise<ToolResult> {
  const { app, titulo } = params;
  const osStore = useOSStore.getState();
  
  const appName = app as JanelaOS['app'];
  const windowTitle = (titulo as string) || getAppTitle(appName);
  
  // Verificar se já está aberto
  const janelaExistente = osStore.getJanelaByApp(appName);
  if (janelaExistente) {
    osStore.focarJanela(janelaExistente.id);
    return {
      success: true,
      message: `Janela "${windowTitle}" já estava aberta. Foquei nela para você.`,
      data: { janelaId: janelaExistente.id, focada: true },
    };
  }
  
  const janelaId = osStore.abrirJanela(appName, windowTitle);
  
  return {
    success: true,
    message: `Abrindo ${windowTitle}`,
    data: { janelaId },
  };
}

async function executeFecharApp(params: Record<string, unknown>): Promise<ToolResult> {
  const { janelaId } = params;
  const osStore = useOSStore.getState();
  
  osStore.fecharJanela(janelaId as string);
  
  return {
    success: true,
    message: 'Janela fechada',
  };
}

async function executeMinimizarApp(params: Record<string, unknown>): Promise<ToolResult> {
  const { janelaId } = params;
  const osStore = useOSStore.getState();
  
  osStore.minimizarJanela(janelaId as string);
  
  return {
    success: true,
    message: 'Janela minimizada',
  };
}

async function executeFocarApp(params: Record<string, unknown>): Promise<ToolResult> {
  const { janelaId } = params;
  const osStore = useOSStore.getState();
  
  osStore.focarJanela(janelaId as string);
  
  return {
    success: true,
    message: 'Janela em foco',
  };
}

async function executeListarAppsAbertos(): Promise<ToolResult> {
  const osStore = useOSStore.getState();
  const janelas = osStore.janelas;
  
  return {
    success: true,
    message: janelas.length === 0 
      ? 'Nenhuma janela aberta no momento'
      : `${janelas.length} janela(s) aberta(s)`,
    data: janelas,
  };
}

function getAppTitle(app: JanelaOS['app']): string {
  const titles: Record<JanelaOS['app'], string> = {
    clinica: 'Prontuários',
    mapa: 'Mapa Auricular',
    studio: 'Studio Sonoro',
    config: 'Configurações',
    aura: 'Aura AI',
    protocolos: 'Protocolos',
    knowledge: 'Biblioteca de Conhecimento',
    sessao: 'Sessão de Tratamento',
    calendario: 'Agenda',
    financas: 'Finanças',
    browser: 'Navegador',
    notas: 'Notas',
  };
  return titles[app] || app;
}

// ============================================================================
// IMPLEMENTAÇÕES - PACIENTES
// ============================================================================

async function executeCriarPaciente(params: Record<string, unknown>): Promise<ToolResult> {
  const pacientesStore = usePacientesStore.getState();
  const codigo = pacientesStore.getNextCodigoAuris();
  
  const novoPaciente: Paciente = {
    id: uuidv4(),
    codigo_auris: codigo,
    dados_pessoais: {
      nome: params.nome as string,
      data_nascimento: (params.data_nascimento as string) || '',
      sexo: (params.sexo as 'M' | 'F' | 'O') || 'O',
      telefone: (params.telefone as string) || '',
      email: (params.email as string) || '',
      profissao: (params.profissao as string) || '',
      endereco: (params.endereco as string) || '',
    },
    anamnese: {
      queixa_principal: (params.queixa_principal as string) || '',
      historia_doenca_atual: '',
      historia_medica_pregressa: '',
      medicacoes_em_uso: [],
      alergias: [],
      cirurgias_previas: [],
      avaliacao_neurofisiologica: {
        frequencia_cardiaca_repouso: 70,
        variabilidade_fc: 'normal',
        tonus_muscular: 'normal',
        sensibilidade_dor: 'normal',
        equilibrio_autonomico: 'equilibrado',
        estado_geral: 'bom',
      },
      inspecao: {
        estado_geral: null,
        coloracao_pele: null,
        olhos: { brilho: 'vivaz', olheiras: false, conjuntiva: 'normal' },
      },
      auscultacao: {
        voz: null,
        respiracao: null,
        intestinos: null,
      },
      interrogatorio: {
        sensacao_termica: null,
        sudorese: null,
        cefaleia_localizacao: null,
        cefaleia_intensidade: 0,
        cefaleia_frequencia: 'nunca',
        apetite: null,
        sede: null,
        digestao: null,
        evacuacao: null,
        sono: {
          qualidade: 'bom',
          dificuldade_iniciar: false,
          dificuldade_manter: false,
          sonhos: 'normais',
          horas_sono: 7,
        },
        estado_emocional: {
          ansiedade: 0,
          irritabilidade: 0,
          tristeza: 0,
          stress: 0,
        },
        ciclo_menstrual: null,
        libido: null,
        caracteristica_dor: null,
      },
      estilo_vida: {
        atividade_fisica: 'sedentario',
        alimentacao: 'regular',
        hidratacao: 'regular',
        tabagismo: false,
        etilismo: 'nunca',
      },
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  pacientesStore.addPaciente(novoPaciente);
  
  return {
    success: true,
    message: `Paciente ${novoPaciente.dados_pessoais.nome} criado com código ${codigo}`,
    data: novoPaciente,
  };
}

async function executeAtualizarPaciente(params: Record<string, unknown>): Promise<ToolResult> {
  const { pacienteId, dados } = params;
  const pacientesStore = usePacientesStore.getState();
  
  pacientesStore.updatePaciente(pacienteId as string, dados as Partial<Paciente>);
  
  return {
    success: true,
    message: 'Paciente atualizado com sucesso',
  };
}

async function executeDeletarPaciente(params: Record<string, unknown>): Promise<ToolResult> {
  const { pacienteId } = params;
  const pacientesStore = usePacientesStore.getState();
  
  const paciente = pacientesStore.getPacienteById(pacienteId as string);
  if (!paciente) {
    return {
      success: false,
      error: 'Paciente não encontrado',
      message: 'Não encontrei esse paciente',
    };
  }
  
  pacientesStore.deletePaciente(pacienteId as string);
  
  return {
    success: true,
    message: `Paciente ${paciente.dados_pessoais.nome} removido do sistema`,
  };
}

async function executeSelecionarPaciente(params: Record<string, unknown>): Promise<ToolResult> {
  const { pacienteId } = params;
  const pacientesStore = usePacientesStore.getState();
  
  const paciente = pacientesStore.getPacienteById(pacienteId as string);
  if (!paciente) {
    return {
      success: false,
      error: 'Paciente não encontrado',
      message: 'Não encontrei esse paciente',
    };
  }
  
  pacientesStore.selecionarPaciente(paciente);
  
  return {
    success: true,
    message: `Paciente ${paciente.dados_pessoais.nome} selecionado`,
    data: paciente,
  };
}

async function executeBuscarPaciente(params: Record<string, unknown>): Promise<ToolResult> {
  const { nome } = params;
  const pacientesStore = usePacientesStore.getState();
  
  const nomeBusca = (nome as string).toLowerCase();
  const resultados = pacientesStore.pacientes.filter(p => 
    p.dados_pessoais.nome.toLowerCase().includes(nomeBusca)
  );
  
  return {
    success: true,
    message: resultados.length === 0 
      ? 'Nenhum paciente encontrado'
      : `${resultados.length} paciente(s) encontrado(s)`,
    data: resultados,
  };
}

async function executeListarPacientes(): Promise<ToolResult> {
  const pacientesStore = usePacientesStore.getState();
  const pacientes = pacientesStore.pacientes;
  
  return {
    success: true,
    message: `${pacientes.length} paciente(s) cadastrado(s)`,
    data: pacientes,
  };
}

async function executeGetPacienteById(params: Record<string, unknown>): Promise<ToolResult> {
  const { pacienteId } = params;
  const pacientesStore = usePacientesStore.getState();
  
  const paciente = pacientesStore.getPacienteById(pacienteId as string);
  
  if (!paciente) {
    return {
      success: false,
      error: 'Paciente não encontrado',
      message: 'Não encontrei esse paciente',
    };
  }
  
  return {
    success: true,
    message: `Paciente: ${paciente.dados_pessoais.nome}`,
    data: paciente,
  };
}

// ============================================================================
// IMPLEMENTAÇÕES - SESSÕES
// ============================================================================

async function executeCriarSessao(params: Record<string, unknown>): Promise<ToolResult> {
  const { pacienteId, pontos, observacoes, duracao_min } = params;
  const sessoesStore = useSessoesStore.getState();
  const pontosStore = usePontosStore.getState();
  const numero = sessoesStore.getNextNumeroSessao(pacienteId as string);
  
  // Buscar objetos completos dos pontos
  const pontosCompletos = (pontos as string[])
    .map(id => pontosStore.getPontoById(id))
    .filter((p): p is PontoAuricular => p !== undefined);
  
  const novaSessao: Sessao = {
    id: uuidv4(),
    paciente_id: pacienteId as string,
    numero,
    data: new Date().toISOString(),
    avaliacao: {
      dor_eva_inicio: 0,
      dor_eva_fim: 0,
      ansiedade_inicio: 0,
      ansiedade_fim: 0,
      bem_estar_inicio: 5,
      bem_estar_fim: 5,
      observacoes_inicio: '',
      observacoes_fim: '',
    },
    protocolo: {
      pontos: pontosCompletos.map((p, idx) => ({
        ...p,
        ordem: idx + 1,
        tecnica_utilizada: 'agulha_filiforme',
        tempo_aplicacao_min: 20,
      })),
      tecnica_principal: 'auriculoterapia',
      duracao_total_min: (duracao_min as number) || 30,
      observacoes_gerais: (observacoes as string) || '',
    },
    evolucao: {
      melhora: true,
      percentual_melhora: 0,
      observacoes_finais: '',
      recomendacoes: '',
    },
  };
  
  sessoesStore.addSessao(novaSessao);
  
  return {
    success: true,
    message: `Sessão ${numero} criada com ${pontosCompletos.length} ponto(s)`,
    data: novaSessao,
  };
}

async function executeAtualizarSessao(params: Record<string, unknown>): Promise<ToolResult> {
  const { sessaoId, dados } = params;
  const sessoesStore = useSessoesStore.getState();
  
  sessoesStore.updateSessao(sessaoId as string, dados as Partial<Sessao>);
  
  return {
    success: true,
    message: 'Sessão atualizada',
  };
}

async function executeDeletarSessao(params: Record<string, unknown>): Promise<ToolResult> {
  const { sessaoId } = params;
  const sessoesStore = useSessoesStore.getState();
  
  sessoesStore.deleteSessao(sessaoId as string);
  
  return {
    success: true,
    message: 'Sessão removida',
  };
}

async function executeGetSessoesPaciente(params: Record<string, unknown>): Promise<ToolResult> {
  const { pacienteId } = params;
  const sessoesStore = useSessoesStore.getState();
  
  const sessoes = sessoesStore.getSessoesByPaciente(pacienteId as string);
  
  return {
    success: true,
    message: `${sessoes.length} sessão(ões) encontrada(s)`,
    data: sessoes,
  };
}

async function executeGetUltimaSessao(params: Record<string, unknown>): Promise<ToolResult> {
  const { pacienteId } = params;
  const sessoesStore = useSessoesStore.getState();
  
  const sessao = sessoesStore.getUltimaSessao(pacienteId as string);
  
  if (!sessao) {
    return {
      success: false,
      error: 'Nenhuma sessão encontrada',
      message: 'Este paciente ainda não tem sessões registradas',
    };
  }
  
  return {
    success: true,
    message: `Última sessão: #${sessao.numero} em ${new Date(sessao.data).toLocaleDateString()}`,
    data: sessao,
  };
}

async function executeGetNextNumeroSessao(params: Record<string, unknown>): Promise<ToolResult> {
  const { pacienteId } = params;
  const sessoesStore = useSessoesStore.getState();
  
  const numero = sessoesStore.getNextNumeroSessao(pacienteId as string);
  
  return {
    success: true,
    message: `Próxima sessão será a número ${numero}`,
    data: { numero },
  };
}

// ============================================================================
// IMPLEMENTAÇÕES - PONTOS
// ============================================================================

async function executeSelecionarPonto(params: Record<string, unknown>): Promise<ToolResult> {
  const { pontoId } = params;
  const pontosStore = usePontosStore.getState();
  
  const ponto = pontosStore.getPontoById(pontoId as string);
  if (!ponto) {
    return {
      success: false,
      error: 'Ponto não encontrado',
      message: 'Não encontrei esse ponto',
    };
  }
  
  pontosStore.selecionarPonto(ponto);
  
  return {
    success: true,
    message: `Ponto ${ponto.nome_pt} selecionado`,
    data: ponto,
  };
}

async function executeRemoverPonto(params: Record<string, unknown>): Promise<ToolResult> {
  const { pontoId } = params;
  const pontosStore = usePontosStore.getState();
  
  pontosStore.removerPonto(pontoId as string);
  
  return {
    success: true,
    message: 'Ponto removido da seleção',
  };
}

async function executeLimparSelecao(): Promise<ToolResult> {
  const pontosStore = usePontosStore.getState();
  
  pontosStore.limparSelecao();
  
  return {
    success: true,
    message: 'Seleção de pontos limpa',
  };
}

async function executeBuscarPonto(params: Record<string, unknown>): Promise<ToolResult> {
  const { termo } = params;
  const pontosStore = usePontosStore.getState();
  
  const resultados = pontosStore.getPontosByNome(termo as string);
  
  return {
    success: true,
    message: `${resultados.length} ponto(s) encontrado(s)`,
    data: resultados,
  };
}

async function executeListarPontos(): Promise<ToolResult> {
  const pontosStore = usePontosStore.getState();
  
  return {
    success: true,
    message: `${pontosStore.pontos.length} pontos disponíveis`,
    data: pontosStore.pontos,
  };
}

async function executeGetPontosByRegiao(params: Record<string, unknown>): Promise<ToolResult> {
  const { regiao } = params;
  const pontosStore = usePontosStore.getState();
  
  const resultados = pontosStore.getPontosByRegiao(regiao as PontoAuricular['regiao']);
  
  return {
    success: true,
    message: `${resultados.length} ponto(s) na região ${regiao}`,
    data: resultados,
  };
}

async function executeGetPontosEstrela(): Promise<ToolResult> {
  const pontosStore = usePontosStore.getState();
  
  const resultados = pontosStore.getPontosEstrela();
  
  return {
    success: true,
    message: `${resultados.length} pontos-estrela`,
    data: resultados,
  };
}

async function executeAdicionarPontoProtocolo(params: Record<string, unknown>): Promise<ToolResult> {
  const { pontoId } = params;
  const pontosStore = usePontosStore.getState();
  
  const ponto = pontosStore.getPontoById(pontoId as string);
  if (!ponto) {
    return {
      success: false,
      error: 'Ponto não encontrado',
      message: 'Ponto não existe',
    };
  }
  
  pontosStore.adicionarPontoAProtocolo(ponto);
  
  return {
    success: true,
    message: `${ponto.nome_pt} adicionado ao protocolo`,
  };
}

async function executeRemoverPontoProtocolo(params: Record<string, unknown>): Promise<ToolResult> {
  const { pontoId } = params;
  const pontosStore = usePontosStore.getState();
  
  pontosStore.removerPontoDoProtocolo(pontoId as string);
  
  return {
    success: true,
    message: 'Ponto removido do protocolo',
  };
}

// ============================================================================
// IMPLEMENTAÇÕES - CONFIGURAÇÕES
// ============================================================================

async function executeSetWallpaper(params: Record<string, unknown>): Promise<ToolResult> {
  const { wallpaper } = params;
  const configStore = useConfigStore.getState();
  
  configStore.setWallpaper(wallpaper as ConfiguracaoSistema['wallpaper_atual']);
  
  return {
    success: true,
    message: `Wallpaper alterado para ${wallpaper}`,
  };
}

async function executeSetModoReiki(params: Record<string, unknown>): Promise<ToolResult> {
  const { ativo } = params;
  const configStore = useConfigStore.getState();
  
  configStore.setModoReiki(ativo as boolean);
  
  return {
    success: true,
    message: `Modo Reiki ${ativo ? 'ativado' : 'desativado'}`,
  };
}

async function executeSetTerapeutaNome(params: Record<string, unknown>): Promise<ToolResult> {
  const { nome } = params;
  const configStore = useConfigStore.getState();
  
  configStore.setNomeTerapeuta(nome as string);
  
  return {
    success: true,
    message: `Nome do terapeuta atualizado para ${nome}`,
  };
}

async function executeSetAIProvider(params: Record<string, unknown>): Promise<ToolResult> {
  const { provider } = params;
  const configStore = useConfigStore.getState();
  
  configStore.setAIProvider(provider as ConfiguracaoSistema['ai_provider']);
  
  return {
    success: true,
    message: `Provedor de IA alterado para ${provider}`,
  };
}

async function executeGetConfiguracoes(): Promise<ToolResult> {
  const configStore = useConfigStore.getState();
  
  const config = {
    modo_reiki_ativo: configStore.modo_reiki_ativo,
    wallpaper_atual: configStore.wallpaper_atual,
    terapeuta_nome: configStore.terapeuta_nome,
    terapeuta_email: configStore.terapeuta_email,
    ai_provider: configStore.ai_provider,
    fonte_principal: configStore.fonte_principal,
    tamanho_fonte: configStore.tamanho_fonte,
  };
  
  return {
    success: true,
    message: 'Configurações atuais',
    data: config,
  };
}

// ============================================================================
// IMPLEMENTAÇÕES - CONHECIMENTO
// ============================================================================

async function executeExplicarPonto(params: Record<string, unknown>): Promise<ToolResult> {
  const { pontoId } = params;
  const pontosStore = usePontosStore.getState();
  
  // Tentar buscar por ID ou código
  let ponto = pontosStore.getPontoById(pontoId as string);
  if (!ponto) {
    ponto = pontosStore.getPontoByCodigo(pontoId as string);
  }
  
  if (!ponto) {
    return {
      success: false,
      error: 'Ponto não encontrado',
      message: 'Não encontrei esse ponto no sistema',
    };
  }
  
  const explicacao = {
    ...ponto,
    explicacao_detalhada: `
${ponto.nome_pt} (${ponto.codigo}) é um ponto ${ponto.prioridade} localizado na região ${ponto.regiao}.

FUNÇÃO:
${ponto.funcao}

INDICAÇÕES:
${ponto.indicacoes.map(i => `• ${i}`).join('\n')}

${ponto.neuro_evidencia ? `BASE CIENTÍFICA:\n${ponto.neuro_evidencia}` : ''}
    `.trim(),
  };
  
  return {
    success: true,
    message: `Explicação do ponto ${ponto.nome_pt}`,
    data: explicacao,
  };
}

async function executeSugerirProtocolo(params: Record<string, unknown>): Promise<ToolResult> {
  const { queixa, tipo } = params;
  const pontosStore = usePontosStore.getState();
  
  const queixaLower = (queixa as string).toLowerCase();
  let pontosSugeridos: PontoAuricular[] = [];
  let justificativa = '';
  
  // Lógica de sugestão baseada em palavras-chave
  if (queixaLower.includes('ansiedade') || queixaLower.includes('estresse') || queixaLower.includes('nervoso')) {
    pontosSugeridos = [
      pontosStore.getPontoById('shenmen'),
      pontosStore.getPontoById('simpatico'),
      pontosStore.getPontoById('subcortex'),
    ].filter((p): p is PontoAuricular => p !== undefined);
    justificativa = 'Protocolo para ansiedade: Shen Men (calma mental), Simpático (equilíbrio autonômico) e Subcórtex (regulação emocional)';
  } else if (queixaLower.includes('dor') || queixaLower.includes('pain')) {
    pontosSugeridos = [
      pontosStore.getPontoById('shenmen'),
      pontosStore.getPontoById('simpatico'),
      pontosStore.getPontoById('talamo'),
    ].filter((p): p is PontoAuricular => p !== undefined);
    justificativa = 'Protocolo analgésico: Shen Men (analgesia), Simpático (modulação da dor) e Tálamo (vias descendentes)';
  } else if (queixaLower.includes('sono') || queixaLower.includes('insônia')) {
    pontosSugeridos = [
      pontosStore.getPontoById('shenmen'),
      pontosStore.getPontoById('rim'),
      pontosStore.getPontoById('coracao'),
    ].filter((p): p is PontoAuricular => p !== undefined);
    justificativa = 'Protocolo para sono: Shen Men (relaxamento), Rim (regulação) e Coração (calma)';
  } else {
    // Protocolo padrão NADA
    pontosSugeridos = [
      pontosStore.getPontoById('shenmen'),
      pontosStore.getPontoById('simpatico'),
      pontosStore.getPontoById('rim'),
      pontosStore.getPontoById('figado'),
      pontosStore.getPontoById('pulmao'),
    ].filter((p): p is PontoAuricular => p !== undefined);
    justificativa = 'Protocolo NADA completo: o protocolo mais estudado cientificamente para dependentes químicos, mas efetivo para diversas condições';
  }
  
  return {
    success: true,
    message: `Protocolo sugerido para "${queixa}"`,
    data: {
      pontos: pontosSugeridos,
      justificativa,
      tipo: tipo || 'neurofisiologico',
    },
  };
}

async function executeAnalisarQueixa(params: Record<string, unknown>): Promise<ToolResult> {
  const { queixa, contexto } = params;
  
  // Análise simplificada
  const analise = {
    queixa: queixa as string,
    contexto: contexto as string || '',
    abordagem_sugerida: 'Auriculoterapia neurofisiológica',
    prioridade: 'media' as const,
    pontos_chave: ['Shen Men', 'Simpático', 'Tálamo'],
    observacoes: 'Recomendo avaliação completa do paciente antes do tratamento',
  };
  
  return {
    success: true,
    message: 'Análise da queixa realizada',
    data: analise,
  };
}

async function executeGetDocumentosOficiais(params: Record<string, unknown>): Promise<ToolResult> {
  const { topico } = params;
  
  let docs = [...todosDocumentos];
  
  if (topico) {
    const topicoLower = (topico as string).toLowerCase();
    docs = docs.filter(d => 
      d.titulo.toLowerCase().includes(topicoLower) ||
      d.resumo.toLowerCase().includes(topicoLower) ||
      d.terapiasMencionadas.some((t: string) => t.toLowerCase().includes(topicoLower))
    );
  }
  
  return {
    success: true,
    message: `${docs.length} documento(s) encontrado(s)`,
    data: {
      documentos: docs,
      estudos: todosEstudos,
    },
  };
}

// ============================================================================
// IMPLEMENTAÇÕES - CALENDÁRIO
// ============================================================================

async function executeCriarEvento(params: Record<string, unknown>): Promise<ToolResult> {
  const { titulo, data_inicio, data_fim, tipo, pacienteId, pacienteNome, notas } = params;
  const calendarStore = useCalendarStore.getState();
  
  const colors: Record<string, string> = {
    consulta: 'bg-auris-sage',
    retorno: 'bg-blue-500',
    bloqueio: 'bg-slate-600',
    revisao: 'bg-purple-500',
  };
  
  const event = calendarStore.addEvent({
    title: titulo as string,
    type: (tipo as CalendarEvent['type']) || 'consulta',
    start: data_inicio as string,
    end: data_fim as string,
    pacienteId: pacienteId as string | undefined,
    pacienteNome: pacienteNome as string | undefined,
    status: 'agendado',
    color: colors[tipo as string] || 'bg-auris-sage',
    notes: notas as string | undefined,
  });
  
  return {
    success: true,
    message: `Evento "${titulo}" criado para ${new Date(data_inicio as string).toLocaleDateString('pt-BR')}`,
    data: event,
  };
}

async function executeAtualizarEvento(params: Record<string, unknown>): Promise<ToolResult> {
  const { eventoId, dados } = params;
  const calendarStore = useCalendarStore.getState();
  
  calendarStore.updateEvent(eventoId as string, dados as Partial<CalendarEvent>);
  
  return {
    success: true,
    message: 'Evento atualizado com sucesso',
  };
}

async function executeDeletarEvento(params: Record<string, unknown>): Promise<ToolResult> {
  const { eventoId } = params;
  const calendarStore = useCalendarStore.getState();
  
  calendarStore.deleteEvent(eventoId as string);
  
  return {
    success: true,
    message: 'Evento removido',
  };
}

async function executeGetEventos(params: Record<string, unknown>): Promise<ToolResult> {
  const { data_inicio, data_fim } = params;
  const calendarStore = useCalendarStore.getState();
  
  const eventos = calendarStore.getEventsByDateRange(
    new Date(data_inicio as string),
    new Date(data_fim as string)
  );
  
  return {
    success: true,
    message: `${eventos.length} evento(s) encontrado(s)`,
    data: eventos,
  };
}

async function executeGetEventosHoje(): Promise<ToolResult> {
  const calendarStore = useCalendarStore.getState();
  const eventos = calendarStore.getEventosHoje();
  
  return {
    success: true,
    message: eventos.length === 0 
      ? 'Nenhum evento para hoje'
      : `${eventos.length} evento(s) hoje`,
    data: eventos,
  };
}

async function executeGetProximosEventos(params: Record<string, unknown>): Promise<ToolResult> {
  const { limite } = params;
  const calendarStore = useCalendarStore.getState();
  
  const eventos = calendarStore.getProximosEventos((limite as number) || 5);
  
  return {
    success: true,
    message: `${eventos.length} próximo(s) evento(s)`,
    data: eventos,
  };
}

async function executeSugerirAgendamento(params: Record<string, unknown>): Promise<ToolResult> {
  const { duracao_min: _duracao, dias_futuros = 7 } = params;
  const calendarStore = useCalendarStore.getState();
  
  // Buscar próximos dias para sugerir horários
  const hoje = new Date();
  const sugestoes: Array<{ data: string; horarios: string[] }> = [];
  
  for (let i = 0; i < (dias_futuros as number); i++) {
    const data = new Date(hoje);
    data.setDate(data.getDate() + i);
    
    // Pular finais de semana
    if (data.getDay() === 0 || data.getDay() === 6) continue;
    
    const eventosDoDia = calendarStore.getEventsByDate(data);
    const horariosOcupados = eventosDoDia.map(e => ({
      inicio: new Date(e.start).getHours(),
      fim: new Date(e.end).getHours(),
    }));
    
    // Horários disponíveis: 8h às 20h
    const horariosDisponiveis: string[] = [];
    for (let h = 8; h < 20; h++) {
      const ocupado = horariosOcupados.some(o => h >= o.inicio && h < o.fim);
      if (!ocupado) {
        horariosDisponiveis.push(`${h.toString().padStart(2, '0')}:00`);
      }
    }
    
    if (horariosDisponiveis.length > 0) {
      sugestoes.push({
        data: data.toISOString().split('T')[0],
        horarios: horariosDisponiveis.slice(0, 4), // Máx 4 horários por dia
      });
    }
  }
  
  return {
    success: true,
    message: `${sugestoes.length} dia(s) com horários disponíveis`,
    data: sugestoes,
  };
}

// ============================================================================
// NOVAS FERRAMENTAS - AGENDA E FINANÇAS
// ============================================================================

async function executeConfirmarAgendamento(params: Record<string, unknown>): Promise<ToolResult> {
  const { eventoId } = params;
  const calendarStore = useCalendarStore.getState();
  
  calendarStore.confirmarEvento(eventoId as string);
  
  return {
    success: true,
    message: 'Agendamento confirmado com sucesso! O paciente foi notificado.',
  };
}

async function executeCancelarAgendamento(params: Record<string, unknown>): Promise<ToolResult> {
  const { eventoId, motivo } = params;
  const calendarStore = useCalendarStore.getState();
  
  calendarStore.cancelarEvento(eventoId as string);
  
  return {
    success: true,
    message: motivo 
      ? `Agendamento cancelado. Motivo: ${motivo}`
      : 'Agendamento cancelado com sucesso.',
  };
}

async function executeCompletarAgendamento(params: Record<string, unknown>): Promise<ToolResult> {
  const { eventoId } = params;
  const calendarStore = useCalendarStore.getState();
  
  calendarStore.completarEvento(eventoId as string);
  
  return {
    success: true,
    message: 'Sessão completada! Não esqueça de registrar o pagamento se ainda não foi feito.',
  };
}

async function executeRegistrarPagamento(params: Record<string, unknown>): Promise<ToolResult> {
  const { pacienteId, valor, descricao, eventoId, metodo = 'dinheiro' } = params;
  const finStore = useFinancasStore.getState();
  
  const transacaoId = finStore.adicionarTransacao({
    tipo: 'receita',
    descricao: descricao as string,
    valor: valor as number,
    data: new Date(),
    metodoPagamento: metodo as any,
    status: 'recebido',
    pacienteId: pacienteId as string,
    sessaoId: eventoId as string | undefined,
  });
  
  return {
    success: true,
    message: `Pagamento de R$ ${(valor as number).toFixed(2)} registrado com sucesso!`,
    data: { transacaoId },
  };
}

async function executeGetResumoFinanceiro(params: Record<string, unknown>): Promise<ToolResult> {
  const { data_inicio, data_fim } = params;
  const finStore = useFinancasStore.getState();
  
  const inicio = data_inicio ? new Date(data_inicio as string) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const fim = data_fim ? new Date(data_fim as string) : new Date();
  
  const resumo = finStore.calcularResumo(inicio, fim);
  
  return {
    success: true,
    message: `Resumo financeiro: Receitas R$ ${resumo.totalReceitas.toFixed(2)}, Despesas R$ ${resumo.totalDespesas.toFixed(2)}, Saldo R$ ${resumo.saldoLiquido.toFixed(2)}`,
    data: resumo,
  };
}

async function executeGetReceitaMes(params: Record<string, unknown>): Promise<ToolResult> {
  const { mes, ano } = params;
  const finStore = useFinancasStore.getState();
  
  const dataMes = mes && ano 
    ? new Date(ano as number, (mes as number) - 1, 1)
    : new Date();
  
  const inicio = new Date(dataMes.getFullYear(), dataMes.getMonth(), 1);
  const fim = new Date(dataMes.getFullYear(), dataMes.getMonth() + 1, 0);
  
  const resumo = finStore.calcularResumo(inicio, fim);
  
  return {
    success: true,
    message: `Receita de ${mes || dataMes.getMonth() + 1}/${ano || dataMes.getFullYear()}: R$ ${resumo.totalReceitas.toFixed(2)}`,
    data: { receita: resumo.totalReceitas, mes: dataMes.getMonth() + 1, ano: dataMes.getFullYear() },
  };
}

export default executeTool;
