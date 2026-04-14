// ============================================================================
// TIPOS DO APP FINANÇAS
// ============================================================================

export type CategoriaServico = 
  | 'auriculoterapia' 
  | 'reiki' 
  | 'massagem' 
  | 'acupuntura'
  | 'fitoterapia'
  | 'outro';

export type MetodoPagamento = 
  | 'dinheiro' 
  | 'cartao_credito' 
  | 'cartao_debito' 
  | 'pix' 
  | 'boleto'
  | 'transferencia';

export type StatusTransacao = 
  | 'pendente' 
  | 'recebido' 
  | 'cancelado';

export interface ServicoTerapeutico {
  id: string;
  nome: string;
  descricao: string;
  valorPadrao: number;
  categoria: CategoriaServico;
  ativo: boolean;
  cor: string; // Para gráficos
  createdAt: Date;
  updatedAt: Date;
}

export interface TransacaoFinanceira {
  id: string;
  tipo: 'receita' | 'despesa';
  valor: number;
  data: Date;
  descricao: string;
  pacienteId?: string;
  pacienteNome?: string;
  sessaoId?: string;
  servicoId?: string;
  servicoNome?: string;
  metodoPagamento: MetodoPagamento;
  status: StatusTransacao;
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConfiguracaoFinanceira {
  metaMensal: number;
  alertaMeta: boolean;
  diaCobranca: number; // Dia do mês para alertas
}

export interface ResumoFinanceiro {
  // Período
  dataInicio: Date;
  dataFim: Date;
  
  // Receitas
  totalReceitas: number;
  totalReceitasPendentes: number;
  totalReceitasRecebidas: number;
  totalReceitasCanceladas: number;
  
  // Despesas
  totalDespesas: number;
  
  // Saldo
  saldoLiquido: number;
  saldoPrevisto: number;
  
  // Comparativo
  comparativoMesAnterior: number; // Percentual
  
  // Por categoria
  porCategoria: Array<{
    categoria: CategoriaServico;
    valor: number;
    percentual: number;
  }>;
  
  // Por método de pagamento
  porMetodoPagamento: Array<{
    metodo: MetodoPagamento;
    valor: number;
    percentual: number;
  }>;
  
  // Por dia (para gráficos)
  porDia: Array<{
    data: string;
    receitas: number;
    despesas: number;
  }>;
}

export interface FiltroTransacoes {
  dataInicio?: Date;
  dataFim?: Date;
  tipo?: 'receita' | 'despesa';
  categoria?: CategoriaServico;
  metodoPagamento?: MetodoPagamento;
  status?: StatusTransacao;
  pacienteId?: string;
  busca?: string;
}
