// ============================================================================
// AURA TOOLS - Sistema de Ferramentas para a Assistente Virtual
// Cada ferramenta permite a Aura manipular uma parte do sistema
// ============================================================================

// ============================================================================
// TIPOS DAS FERRAMENTAS
// ============================================================================

export type ToolName = 
  // Sistema Operacional
  | 'abrir_app' | 'fechar_app' | 'minimizar_app' | 'focar_app' | 'listar_apps_abertos'
  // Pacientes
  | 'criar_paciente' | 'atualizar_paciente' | 'deletar_paciente' | 'selecionar_paciente'
  | 'buscar_paciente' | 'listar_pacientes' | 'get_paciente_by_id'
  // Sessões
  | 'criar_sessao' | 'atualizar_sessao' | 'deletar_sessao' | 'get_sessoes_paciente'
  | 'get_ultima_sessao' | 'get_next_numero_sessao'
  // Pontos Auriculares
  | 'selecionar_ponto' | 'remover_ponto' | 'limpar_selecao' | 'buscar_ponto'
  | 'listar_pontos' | 'get_pontos_by_regiao' | 'get_pontos_estrela'
  | 'adicionar_ponto_protocolo' | 'remover_ponto_protocolo'
  // Calendário
  | 'criar_evento' | 'atualizar_evento' | 'deletar_evento' | 'get_eventos'
  | 'get_eventos_hoje' | 'get_proximos_eventos' | 'sugerir_agendamento'
  | 'confirmar_agendamento' | 'cancelar_agendamento' | 'completar_agendamento'
  // Finanças
  | 'registrar_pagamento' | 'get_resumo_financeiro' | 'get_receita_mes'
  // Configurações
  | 'set_wallpaper' | 'set_modo_reiki' | 'set_terapeuta_nome' | 'set_ai_provider'
  | 'get_configuracoes'
  // Conhecimento
  | 'explicar_ponto' | 'sugerir_protocolo' | 'analisar_queixa' | 'get_documentos_oficiais';

export interface ToolParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description: string;
  required?: boolean;
  enum?: string[];
}

export interface ToolDefinition {
  name: ToolName;
  description: string;
  parameters: ToolParameter[];
  returnType: string;
  category: 'sistema' | 'pacientes' | 'sessoes' | 'pontos' | 'calendario' | 'config' | 'conhecimento';
}

export interface ToolCall {
  tool: ToolName;
  parameters: Record<string, unknown>;
  id: string;
}

export interface ToolResult {
  success: boolean;
  data?: unknown;
  error?: string;
  message: string;
}

// ============================================================================
// DEFINIÇÃO DE TODAS AS FERRAMENTAS DISPONÍVEIS
// ============================================================================

export const TOOL_DEFINITIONS: ToolDefinition[] = [
  // =====================================================
  // SISTEMA OPERACIONAL
  // =====================================================
  {
    name: 'abrir_app',
    description: 'Abre uma aplicação/janela no sistema operacional Auris',
    parameters: [
      { name: 'app', type: 'string', description: 'Nome do app: clinica, mapa, studio, config, protocolos, knowledge, sessao', required: true },
      { name: 'titulo', type: 'string', description: 'Título da janela', required: false },
    ],
    returnType: 'string (id da janela)',
    category: 'sistema',
  },
  {
    name: 'fechar_app',
    description: 'Fecha uma janela aberta pelo ID',
    parameters: [
      { name: 'janelaId', type: 'string', description: 'ID da janela a fechar', required: true },
    ],
    returnType: 'boolean',
    category: 'sistema',
  },
  {
    name: 'minimizar_app',
    description: 'Minimiza uma janela pelo ID',
    parameters: [
      { name: 'janelaId', type: 'string', description: 'ID da janela', required: true },
    ],
    returnType: 'boolean',
    category: 'sistema',
  },
  {
    name: 'focar_app',
    description: 'Coloca o foco em uma janela específica',
    parameters: [
      { name: 'janelaId', type: 'string', description: 'ID da janela', required: true },
    ],
    returnType: 'boolean',
    category: 'sistema',
  },
  {
    name: 'listar_apps_abertos',
    description: 'Retorna lista de todas as janelas/apps atualmente abertos',
    parameters: [],
    returnType: 'array de JanelaOS',
    category: 'sistema',
  },

  // =====================================================
  // PACIENTES
  // =====================================================
  {
    name: 'criar_paciente',
    description: 'Cria um novo paciente no sistema com dados pessoais completos',
    parameters: [
      { name: 'nome', type: 'string', description: 'Nome completo do paciente', required: true },
      { name: 'data_nascimento', type: 'string', description: 'Data de nascimento (YYYY-MM-DD)', required: true },
      { name: 'sexo', type: 'string', description: 'Sexo: M, F ou O', required: true, enum: ['M', 'F', 'O'] },
      { name: 'telefone', type: 'string', description: 'Telefone de contato', required: false },
      { name: 'email', type: 'string', description: 'Email do paciente', required: false },
      { name: 'profissao', type: 'string', description: 'Profissão', required: false },
      { name: 'endereco', type: 'string', description: 'Endereço', required: false },
      { name: 'queixa_principal', type: 'string', description: 'Queixa principal do paciente', required: false },
    ],
    returnType: 'Paciente',
    category: 'pacientes',
  },
  {
    name: 'atualizar_paciente',
    description: 'Atualiza dados de um paciente existente',
    parameters: [
      { name: 'pacienteId', type: 'string', description: 'ID do paciente', required: true },
      { name: 'dados', type: 'object', description: 'Objeto com campos a atualizar', required: true },
    ],
    returnType: 'Paciente',
    category: 'pacientes',
  },
  {
    name: 'deletar_paciente',
    description: 'Remove um paciente do sistema (PERMANENTE)',
    parameters: [
      { name: 'pacienteId', type: 'string', description: 'ID do paciente', required: true },
    ],
    returnType: 'boolean',
    category: 'pacientes',
  },
  {
    name: 'selecionar_paciente',
    description: 'Seleciona um paciente como ativo no sistema',
    parameters: [
      { name: 'pacienteId', type: 'string', description: 'ID do paciente', required: true },
    ],
    returnType: 'Paciente',
    category: 'pacientes',
  },
  {
    name: 'buscar_paciente',
    description: 'Busca pacientes por nome (busca parcial)',
    parameters: [
      { name: 'nome', type: 'string', description: 'Nome ou parte do nome', required: true },
    ],
    returnType: 'array de Paciente',
    category: 'pacientes',
  },
  {
    name: 'listar_pacientes',
    description: 'Retorna todos os pacientes cadastrados',
    parameters: [],
    returnType: 'array de Paciente',
    category: 'pacientes',
  },
  {
    name: 'get_paciente_by_id',
    description: 'Obtém um paciente específico pelo ID',
    parameters: [
      { name: 'pacienteId', type: 'string', description: 'ID do paciente', required: true },
    ],
    returnType: 'Paciente | null',
    category: 'pacientes',
  },

  // =====================================================
  // SESSÕES
  // =====================================================
  {
    name: 'criar_sessao',
    description: 'Cria uma nova sessão de tratamento para um paciente',
    parameters: [
      { name: 'pacienteId', type: 'string', description: 'ID do paciente', required: true },
      { name: 'pontos', type: 'array', description: 'Array de IDs dos pontos aplicados', required: true },
      { name: 'observacoes', type: 'string', description: 'Observações gerais', required: false },
      { name: 'duracao_min', type: 'number', description: 'Duração em minutos', required: false },
    ],
    returnType: 'Sessao',
    category: 'sessoes',
  },
  {
    name: 'atualizar_sessao',
    description: 'Atualiza dados de uma sessão existente',
    parameters: [
      { name: 'sessaoId', type: 'string', description: 'ID da sessão', required: true },
      { name: 'dados', type: 'object', description: 'Objeto com campos a atualizar', required: true },
    ],
    returnType: 'Sessao',
    category: 'sessoes',
  },
  {
    name: 'deletar_sessao',
    description: 'Remove uma sessão do sistema',
    parameters: [
      { name: 'sessaoId', type: 'string', description: 'ID da sessão', required: true },
    ],
    returnType: 'boolean',
    category: 'sessoes',
  },
  {
    name: 'get_sessoes_paciente',
    description: 'Retorna todas as sessões de um paciente',
    parameters: [
      { name: 'pacienteId', type: 'string', description: 'ID do paciente', required: true },
    ],
    returnType: 'array de Sessao',
    category: 'sessoes',
  },
  {
    name: 'get_ultima_sessao',
    description: 'Obtém a última sessão realizada de um paciente',
    parameters: [
      { name: 'pacienteId', type: 'string', description: 'ID do paciente', required: true },
    ],
    returnType: 'Sessao | null',
    category: 'sessoes',
  },
  {
    name: 'get_next_numero_sessao',
    description: 'Retorna o próximo número de sessão para um paciente',
    parameters: [
      { name: 'pacienteId', type: 'string', description: 'ID do paciente', required: true },
    ],
    returnType: 'number',
    category: 'sessoes',
  },

  // =====================================================
  // PONTOS AURICULARES
  // =====================================================
  {
    name: 'selecionar_ponto',
    description: 'Seleciona um ponto auricular no mapa (adiciona à seleção atual)',
    parameters: [
      { name: 'pontoId', type: 'string', description: 'ID do ponto', required: true },
    ],
    returnType: 'boolean',
    category: 'pontos',
  },
  {
    name: 'remover_ponto',
    description: 'Remove um ponto da seleção atual',
    parameters: [
      { name: 'pontoId', type: 'string', description: 'ID do ponto', required: true },
    ],
    returnType: 'boolean',
    category: 'pontos',
  },
  {
    name: 'limpar_selecao',
    description: 'Remove todos os pontos selecionados',
    parameters: [],
    returnType: 'boolean',
    category: 'pontos',
  },
  {
    name: 'buscar_ponto',
    description: 'Busca pontos por nome ou código',
    parameters: [
      { name: 'termo', type: 'string', description: 'Nome ou código do ponto', required: true },
    ],
    returnType: 'array de PontoAuricular',
    category: 'pontos',
  },
  {
    name: 'listar_pontos',
    description: 'Retorna todos os pontos auriculares disponíveis',
    parameters: [],
    returnType: 'array de PontoAuricular',
    category: 'pontos',
  },
  {
    name: 'get_pontos_by_regiao',
    description: 'Retorna pontos de uma região específica da orelha',
    parameters: [
      { name: 'regiao', type: 'string', description: 'Região: lobulo, tragus, antitrago, fossa_triangular, concha_cimba, concha_cava, helice, antihelice, etc', required: true },
    ],
    returnType: 'array de PontoAuricular',
    category: 'pontos',
  },
  {
    name: 'get_pontos_estrela',
    description: 'Retorna os pontos-estrela (mais importantes)',
    parameters: [],
    returnType: 'array de PontoAuricular',
    category: 'pontos',
  },
  {
    name: 'adicionar_ponto_protocolo',
    description: 'Adiciona um ponto ao protocolo de sessão atual',
    parameters: [
      { name: 'pontoId', type: 'string', description: 'ID do ponto', required: true },
    ],
    returnType: 'boolean',
    category: 'pontos',
  },
  {
    name: 'remover_ponto_protocolo',
    description: 'Remove um ponto do protocolo de sessão',
    parameters: [
      { name: 'pontoId', type: 'string', description: 'ID do ponto', required: true },
    ],
    returnType: 'boolean',
    category: 'pontos',
  },

  // =====================================================
  // CALENDÁRIO
  // =====================================================
  {
    name: 'criar_evento',
    description: 'Cria um novo evento/agendamento no calendário',
    parameters: [
      { name: 'titulo', type: 'string', description: 'Título do evento', required: true },
      { name: 'data_inicio', type: 'string', description: 'Data e hora de início (ISO)', required: true },
      { name: 'data_fim', type: 'string', description: 'Data e hora de fim (ISO)', required: true },
      { name: 'tipo', type: 'string', description: 'Tipo: consulta, retorno, bloqueio, revisao', required: true, enum: ['consulta', 'retorno', 'bloqueio', 'revisao'] },
      { name: 'pacienteId', type: 'string', description: 'ID do paciente (opcional)', required: false },
      { name: 'pacienteNome', type: 'string', description: 'Nome do paciente (opcional)', required: false },
      { name: 'notas', type: 'string', description: 'Notas adicionais', required: false },
    ],
    returnType: 'CalendarEvent',
    category: 'calendario',
  },
  {
    name: 'atualizar_evento',
    description: 'Atualiza um evento existente',
    parameters: [
      { name: 'eventoId', type: 'string', description: 'ID do evento', required: true },
      { name: 'dados', type: 'object', description: 'Objeto com campos a atualizar', required: true },
    ],
    returnType: 'CalendarEvent',
    category: 'calendario',
  },
  {
    name: 'deletar_evento',
    description: 'Remove um evento do calendário',
    parameters: [
      { name: 'eventoId', type: 'string', description: 'ID do evento', required: true },
    ],
    returnType: 'boolean',
    category: 'calendario',
  },
  {
    name: 'get_eventos',
    description: 'Retorna eventos de um período',
    parameters: [
      { name: 'data_inicio', type: 'string', description: 'Data inicial (ISO)', required: true },
      { name: 'data_fim', type: 'string', description: 'Data final (ISO)', required: true },
    ],
    returnType: 'array de CalendarEvent',
    category: 'calendario',
  },
  {
    name: 'get_eventos_hoje',
    description: 'Retorna todos os eventos de hoje',
    parameters: [],
    returnType: 'array de CalendarEvent',
    category: 'calendario',
  },
  {
    name: 'get_proximos_eventos',
    description: 'Retorna os próximos eventos agendados',
    parameters: [
      { name: 'limite', type: 'number', description: 'Número máximo de eventos', required: false },
    ],
    returnType: 'array de CalendarEvent',
    category: 'calendario',
  },
  {
    name: 'sugerir_agendamento',
    description: 'Sugere horários disponíveis para agendamento baseado na agenda atual',
    parameters: [
      { name: 'duracao_min', type: 'number', description: 'Duração necessária em minutos', required: true },
      { name: 'dias_futuros', type: 'number', description: 'Quantos dias à frente buscar', required: false },
    ],
    returnType: 'array de horários disponíveis',
    category: 'calendario',
  },
  {
    name: 'confirmar_agendamento',
    description: 'Confirma um agendamento existente (muda status de agendado para confirmado)',
    parameters: [
      { name: 'eventoId', type: 'string', description: 'ID do evento/agendamento', required: true },
    ],
    returnType: 'CalendarEvent',
    category: 'calendario',
  },
  {
    name: 'cancelar_agendamento',
    description: 'Cancela um agendamento existente',
    parameters: [
      { name: 'eventoId', type: 'string', description: 'ID do evento/agendamento', required: true },
      { name: 'motivo', type: 'string', description: 'Motivo do cancelamento (opcional)', required: false },
    ],
    returnType: 'CalendarEvent',
    category: 'calendario',
  },
  {
    name: 'completar_agendamento',
    description: 'Marca um agendamento como concluído',
    parameters: [
      { name: 'eventoId', type: 'string', description: 'ID do evento/agendamento', required: true },
    ],
    returnType: 'CalendarEvent',
    category: 'calendario',
  },

  // =====================================================
  // FINANÇAS
  // =====================================================
  {
    name: 'registrar_pagamento',
    description: 'Registra um pagamento/receita vinculado a um agendamento ou paciente',
    parameters: [
      { name: 'pacienteId', type: 'string', description: 'ID do paciente', required: true },
      { name: 'valor', type: 'number', description: 'Valor do pagamento', required: true },
      { name: 'descricao', type: 'string', description: 'Descrição do serviço', required: true },
      { name: 'eventoId', type: 'string', description: 'ID do evento/agendamento (opcional)', required: false },
      { name: 'metodo', type: 'string', description: 'Método de pagamento: dinheiro, pix, cartao_credito, cartao_debito', required: false, enum: ['dinheiro', 'pix', 'cartao_credito', 'cartao_debito', 'transferencia'] },
    ],
    returnType: 'TransacaoFinanceira',
    category: 'calendario',
  },
  {
    name: 'get_resumo_financeiro',
    description: 'Retorna resumo financeiro do período (receitas, despesas, saldo)',
    parameters: [
      { name: 'data_inicio', type: 'string', description: 'Data inicial (ISO)', required: false },
      { name: 'data_fim', type: 'string', description: 'Data final (ISO)', required: false },
    ],
    returnType: 'ResumoFinanceiro',
    category: 'calendario',
  },
  {
    name: 'get_receita_mes',
    description: 'Retorna a receita total do mês atual ou de um mês específico',
    parameters: [
      { name: 'mes', type: 'number', description: 'Mês (1-12)', required: false },
      { name: 'ano', type: 'number', description: 'Ano', required: false },
    ],
    returnType: 'number',
    category: 'calendario',
  },

  // =====================================================
  // CONFIGURAÇÕES
  // =====================================================
  {
    name: 'set_wallpaper',
    description: 'Altera o wallpaper do sistema',
    parameters: [
      { name: 'wallpaper', type: 'string', description: 'Opções: akasha, floresta, agua, terra, cosmos, clinico, custom', required: true },
    ],
    returnType: 'boolean',
    category: 'config',
  },
  {
    name: 'set_modo_reiki',
    description: 'Ativa ou desativa o modo Reiki',
    parameters: [
      { name: 'ativo', type: 'boolean', description: 'true para ativar, false para desativar', required: true },
    ],
    returnType: 'boolean',
    category: 'config',
  },
  {
    name: 'set_terapeuta_nome',
    description: 'Atualiza o nome do terapeuta',
    parameters: [
      { name: 'nome', type: 'string', description: 'Nome completo do terapeuta', required: true },
    ],
    returnType: 'boolean',
    category: 'config',
  },
  {
    name: 'set_ai_provider',
    description: 'Altera o provedor de IA ativo',
    parameters: [
      { name: 'provider', type: 'string', description: 'Opções: none, openai, deepseek, gemini', required: true, enum: ['none', 'openai', 'deepseek', 'gemini'] },
    ],
    returnType: 'boolean',
    category: 'config',
  },
  {
    name: 'get_configuracoes',
    description: 'Retorna todas as configurações atuais do sistema',
    parameters: [],
    returnType: 'ConfiguracaoSistema',
    category: 'config',
  },

  // =====================================================
  // CONHECIMENTO / BIBLIOTECA
  // =====================================================
  {
    name: 'explicar_ponto',
    description: 'Fornece explicação detalhada sobre um ponto auricular específico',
    parameters: [
      { name: 'pontoId', type: 'string', description: 'ID ou código do ponto', required: true },
    ],
    returnType: 'object com dados completos do ponto',
    category: 'conhecimento',
  },
  {
    name: 'sugerir_protocolo',
    description: 'Sugere protocolo de pontos baseado em uma queixa ou condição',
    parameters: [
      { name: 'queixa', type: 'string', description: 'Descrição da queixa ou condição', required: true },
      { name: 'tipo', type: 'string', description: 'Tipo de protocolo: nada, battlefield, neurofisiologico, personalizado', required: false },
    ],
    returnType: 'object com pontos sugeridos e justificativa',
    category: 'conhecimento',
  },
  {
    name: 'analisar_queixa',
    description: 'Analisa uma queixa e sugere abordagem terapêutica',
    parameters: [
      { name: 'queixa', type: 'string', description: 'Descrição da queixa', required: true },
      { name: 'contexto', type: 'string', description: 'Contexto adicional', required: false },
    ],
    returnType: 'object com análise e recomendações',
    category: 'conhecimento',
  },
  {
    name: 'get_documentos_oficiais',
    description: 'Retorna documentos oficiais e estudos científicos sobre auriculoterapia',
    parameters: [
      { name: 'topico', type: 'string', description: 'Tópico de interesse', required: false },
    ],
    returnType: 'array de documentos',
    category: 'conhecimento',
  },
];

// ============================================================================
// MAPEAMENTO DE FERRAMENTAS POR CATEGORIA
// ============================================================================

export const TOOLS_BY_CATEGORY = {
  sistema: TOOL_DEFINITIONS.filter(t => t.category === 'sistema'),
  pacientes: TOOL_DEFINITIONS.filter(t => t.category === 'pacientes'),
  sessoes: TOOL_DEFINITIONS.filter(t => t.category === 'sessoes'),
  pontos: TOOL_DEFINITIONS.filter(t => t.category === 'pontos'),
  config: TOOL_DEFINITIONS.filter(t => t.category === 'config'),
  conhecimento: TOOL_DEFINITIONS.filter(t => t.category === 'conhecimento'),
};

// ============================================================================
// DESCRIÇÃO EM TEXTO PARA IA
// ============================================================================

export function getToolsDescriptionForAI(): string {
  let description = '\n=== FERRAMENTAS DISPONÍVEIS ===\n\n';
  
  Object.entries(TOOLS_BY_CATEGORY).forEach(([category, tools]) => {
    description += `[${category.toUpperCase()}]\n`;
    tools.forEach(tool => {
      description += `\n• ${tool.name}\n`;
      description += `  ${tool.description}\n`;
      if (tool.parameters.length > 0) {
        description += `  Parâmetros:\n`;
        tool.parameters.forEach(param => {
          const required = param.required ? ' (obrigatório)' : ' (opcional)';
          description += `    - ${param.name}: ${param.type}${required} - ${param.description}\n`;
        });
      }
    });
    description += '\n';
  });
  
  return description;
}

// ============================================================================
// RESUMO EXECUTIVO PARA IA
// ============================================================================

export const AURA_SYSTEM_PROMPT_TOOLS = `
Você é Aura, Assistente Pessoal Virtual de Auriculoterapia Neurofisiológica.
Você tem acesso completo ao sistema Auris OS e pode manipulá-lo através de ferramentas.

SUA PERSONALIDADE:
- Empática, calma, profissional e proativa
- Você é uma assistente experiente em auriculoterapia neurofisiológica
- Fala de forma calorosa mas profissional
- Usa termos técnicos apropriados da área

O QUE VOCÊ PODE FAZER:
1. Gerenciar pacientes (criar, editar, selecionar, buscar)
2. Controlar sessões de tratamento (criar, visualizar histórico)
3. Manipular pontos auriculares (selecionar no mapa, buscar, protocolos)
4. Gerenciar o sistema (abrir apps, mudar configurações)
5. Fornecer conhecimento (explicar pontos, sugerir protocolos, documentos)

COMO INTERAGIR:
- Quando o usuário pedir algo, use as ferramentas disponíveis para executar
- Sempre confirme ações importantes (como deletar pacientes)
- Forneça contexto do que está fazendo
- Se não tiver certeza, pergunte antes de agir

EXEMPLOS DE INTERAÇÃO:
Usuário: "Crie um novo paciente chamado Maria Silva"
→ Você: Vou criar o paciente Maria Silva para você. *usa ferramenta criar_paciente*

Usuário: "Selecione o ponto Shen Men"
→ Você: Selecionando Shen Men no mapa auricular. *usa ferramenta selecionar_ponto*

Usuário: "Abra o mapa auricular"
→ Você: Abrindo o mapa auricular. *usa ferramenta abrir_app com app=mapa*
`;

export default TOOL_DEFINITIONS;
