// ============================================================================
// STORE FINANÇAS - Gestão financeira integrada
// ============================================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { 
  ServicoTerapeutico, 
  TransacaoFinanceira, 
  ConfiguracaoFinanceira,
  ResumoFinanceiro,
  FiltroTransacoes,
  CategoriaServico,
  MetodoPagamento
} from '@/types/financas';

// Serviços padrão
const SERVICOS_PADRAO: ServicoTerapeutico[] = [
  {
    id: 'serv_auriculo',
    nome: 'Auriculoterapia - Sessão',
    descricao: 'Sessão completa de auriculoterapia neurofisiológica',
    valorPadrao: 150,
    categoria: 'auriculoterapia',
    ativo: true,
    cor: '#10b981',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'serv_reiki',
    nome: 'Reiki - Sessão',
    descricao: 'Sessão de Reiki para harmonização energética',
    valorPadrao: 120,
    categoria: 'reiki',
    ativo: true,
    cor: '#8b5cf6',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'serv_massagem',
    nome: 'Massagem Terapêutica',
    descricao: 'Massagem relaxante e terapêutica',
    valorPadrao: 130,
    categoria: 'massagem',
    ativo: true,
    cor: '#f59e0b',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'serv_acupuntura',
    nome: 'Acupuntura - Sessão',
    descricao: 'Sessão de acupuntura tradicional',
    valorPadrao: 140,
    categoria: 'acupuntura',
    ativo: true,
    cor: '#ef4444',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'serv_fitoterapia',
    nome: 'Consulta Fitoterapia',
    descricao: 'Consulta e prescrição de fitoterapia',
    valorPadrao: 100,
    categoria: 'fitoterapia',
    ativo: true,
    cor: '#22c55e',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

interface FinancasState {
  // Dados
  servicos: ServicoTerapeutico[];
  transacoes: TransacaoFinanceira[];
  configuracao: ConfiguracaoFinanceira;
  
  // Ações - Serviços
  adicionarServico: (servico: Omit<ServicoTerapeutico, 'id' | 'createdAt' | 'updatedAt'>) => string;
  atualizarServico: (id: string, dados: Partial<ServicoTerapeutico>) => void;
  removerServico: (id: string) => void;
  getServicoById: (id: string) => ServicoTerapeutico | undefined;
  getServicosAtivos: () => ServicoTerapeutico[];
  
  // Ações - Transações
  adicionarTransacao: (transacao: Omit<TransacaoFinanceira, 'id' | 'createdAt' | 'updatedAt'>) => string;
  atualizarTransacao: (id: string, dados: Partial<TransacaoFinanceira>) => void;
  removerTransacao: (id: string) => void;
  getTransacaoById: (id: string) => TransacaoFinanceira | undefined;
  getTransacoesByFiltro: (filtro: FiltroTransacoes) => TransacaoFinanceira[];
  
  // Ações - Configuração
  atualizarConfiguracao: (config: Partial<ConfiguracaoFinanceira>) => void;
  
  // Cálculos
  calcularResumo: (dataInicio: Date, dataFim: Date) => ResumoFinanceiro;
  getReceitaMesAtual: () => number;
  getReceitaHoje: () => number;
  getMetaProgresso: () => { atual: number; meta: number; percentual: number };
  
  // Integração com sessões
  criarTransacaoDeSessao: (
    pacienteId: string, 
    pacienteNome: string, 
    sessaoId: string, 
    servicoId: string,
    valorPersonalizado?: number
  ) => string;
}

export const useFinancasStore = create<FinancasState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      servicos: SERVICOS_PADRAO,
      transacoes: [],
      configuracao: {
        metaMensal: 5000,
        alertaMeta: true,
        diaCobranca: 5,
      },
      
      // Serviços
      adicionarServico: (servico) => {
        const id = uuidv4();
        const novoServico: ServicoTerapeutico = {
          ...servico,
          id,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          servicos: [...state.servicos, novoServico],
        }));
        return id;
      },
      
      atualizarServico: (id, dados) => {
        set((state) => ({
          servicos: state.servicos.map((s) =>
            s.id === id ? { ...s, ...dados, updatedAt: new Date() } : s
          ),
        }));
      },
      
      removerServico: (id) => {
        set((state) => ({
          servicos: state.servicos.filter((s) => s.id !== id),
        }));
      },
      
      getServicoById: (id) => {
        return get().servicos.find((s) => s.id === id);
      },
      
      getServicosAtivos: () => {
        return get().servicos.filter((s) => s.ativo);
      },
      
      // Transações
      adicionarTransacao: (transacao) => {
        const id = uuidv4();
        const novaTransacao: TransacaoFinanceira = {
          ...transacao,
          id,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          transacoes: [...state.transacoes, novaTransacao],
        }));
        return id;
      },
      
      atualizarTransacao: (id, dados) => {
        set((state) => ({
          transacoes: state.transacoes.map((t) =>
            t.id === id ? { ...t, ...dados, updatedAt: new Date() } : t
          ),
        }));
      },
      
      removerTransacao: (id) => {
        set((state) => ({
          transacoes: state.transacoes.filter((t) => t.id !== id),
        }));
      },
      
      getTransacaoById: (id) => {
        return get().transacoes.find((t) => t.id === id);
      },
      
      getTransacoesByFiltro: (filtro) => {
        let transacoes = get().transacoes;
        
        if (filtro.dataInicio) {
          transacoes = transacoes.filter((t) => t.data >= filtro.dataInicio!);
        }
        if (filtro.dataFim) {
          transacoes = transacoes.filter((t) => t.data <= filtro.dataFim!);
        }
        if (filtro.tipo) {
          transacoes = transacoes.filter((t) => t.tipo === filtro.tipo);
        }
        if (filtro.metodoPagamento) {
          transacoes = transacoes.filter((t) => t.metodoPagamento === filtro.metodoPagamento);
        }
        if (filtro.status) {
          transacoes = transacoes.filter((t) => t.status === filtro.status);
        }
        if (filtro.pacienteId) {
          transacoes = transacoes.filter((t) => t.pacienteId === filtro.pacienteId);
        }
        if (filtro.busca) {
          const busca = filtro.busca.toLowerCase();
          transacoes = transacoes.filter(
            (t) =>
              t.descricao.toLowerCase().includes(busca) ||
              t.pacienteNome?.toLowerCase().includes(busca)
          );
        }
        
        return transacoes.sort((a, b) => b.data.getTime() - a.data.getTime());
      },
      
      // Configuração
      atualizarConfiguracao: (config) => {
        set((state) => ({
          configuracao: { ...state.configuracao, ...config },
        }));
      },
      
      // Cálculos
      calcularResumo: (dataInicio, dataFim) => {
        const transacoes = get().transacoes.filter(
          (t) => t.data >= dataInicio && t.data <= dataFim
        );
        
        const receitas = transacoes.filter((t) => t.tipo === 'receita');
        const despesas = transacoes.filter((t) => t.tipo === 'despesa');
        
        const totalReceitas = receitas.reduce((sum, t) => sum + t.valor, 0);
        const totalReceitasPendentes = receitas
          .filter((t) => t.status === 'pendente')
          .reduce((sum, t) => sum + t.valor, 0);
        const totalReceitasRecebidas = receitas
          .filter((t) => t.status === 'recebido')
          .reduce((sum, t) => sum + t.valor, 0);
        const totalReceitasCanceladas = receitas
          .filter((t) => t.status === 'cancelado')
          .reduce((sum, t) => sum + t.valor, 0);
        
        const totalDespesas = despesas.reduce((sum, t) => sum + t.valor, 0);
        
        // Agrupar por categoria
        const porCategoriaMap = new Map<CategoriaServico, number>();
        receitas.forEach((t) => {
          const servico = get().servicos.find((s) => s.id === t.servicoId);
          if (servico) {
            const atual = porCategoriaMap.get(servico.categoria) || 0;
            porCategoriaMap.set(servico.categoria, atual + t.valor);
          }
        });
        const porCategoria = Array.from(porCategoriaMap.entries()).map(
          ([categoria, valor]) => ({
            categoria,
            valor,
            percentual: totalReceitas > 0 ? (valor / totalReceitas) * 100 : 0,
          })
        );
        
        // Agrupar por método de pagamento
        const porMetodoMap = new Map<MetodoPagamento, number>();
        receitas.forEach((t) => {
          const atual = porMetodoMap.get(t.metodoPagamento) || 0;
          porMetodoMap.set(t.metodoPagamento, atual + t.valor);
        });
        const porMetodoPagamento = Array.from(porMetodoMap.entries()).map(
          ([metodo, valor]) => ({
            metodo,
            valor,
            percentual: totalReceitas > 0 ? (valor / totalReceitas) * 100 : 0,
          })
        );
        
        // Calcular comparativo com mês anterior
        const umMesAntes = new Date(dataInicio);
        umMesAntes.setMonth(umMesAntes.getMonth() - 1);
        const inicioMesAnterior = new Date(umMesAntes.getFullYear(), umMesAntes.getMonth(), 1);
        const fimMesAnterior = new Date(umMesAntes.getFullYear(), umMesAntes.getMonth() + 1, 0, 23, 59, 59);
        
        const receitasMesAnterior = get().transacoes.filter(
          (t) =>
            t.tipo === 'receita' &&
            t.status === 'recebido' &&
            t.data >= inicioMesAnterior &&
            t.data <= fimMesAnterior
        );
        const totalMesAnterior = receitasMesAnterior.reduce((sum, t) => sum + t.valor, 0);
        const comparativoMesAnterior = totalMesAnterior > 0 
          ? ((totalReceitasRecebidas - totalMesAnterior) / totalMesAnterior) * 100 
          : 0;
        
        // Agrupar por dia (receitas e despesas separadas)
        const porDiaMap = new Map<string, { receitas: number; despesas: number }>();
        const diasNoPeriodo = Math.ceil((dataFim.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24));
        
        // Inicializar todos os dias com 0
        for (let i = 0; i <= diasNoPeriodo; i++) {
          const dia = new Date(dataInicio);
          dia.setDate(dia.getDate() + i);
          porDiaMap.set(dia.toISOString().split('T')[0], { receitas: 0, despesas: 0 });
        }
        
        // Preencher com receitas recebidas
        transacoes
          .filter((t: TransacaoFinanceira) => t.tipo === 'receita' && t.status === 'recebido')
          .forEach((t: TransacaoFinanceira) => {
            const diaKey = t.data.toISOString().split('T')[0];
            const atual = porDiaMap.get(diaKey);
            if (atual) {
              porDiaMap.set(diaKey, { ...atual, receitas: atual.receitas + t.valor });
            }
          });
        
        // Preencher com despesas pagas
        transacoes
          .filter((t: TransacaoFinanceira) => t.tipo === 'despesa' && t.status === 'recebido')
          .forEach((t: TransacaoFinanceira) => {
            const diaKey = t.data.toISOString().split('T')[0];
            const atual = porDiaMap.get(diaKey);
            if (atual) {
              porDiaMap.set(diaKey, { ...atual, despesas: atual.despesas + t.valor });
            }
          });
        
        const porDia = Array.from(porDiaMap.entries())
          .map(([data, valores]) => ({
            data,
            receitas: valores.receitas,
            despesas: valores.despesas,
          }))
          .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
        
        return {
          dataInicio,
          dataFim,
          totalReceitas,
          totalReceitasPendentes,
          totalReceitasRecebidas,
          totalReceitasCanceladas,
          totalDespesas,
          saldoLiquido: totalReceitas - totalDespesas,
          saldoPrevisto: totalReceitasRecebidas - totalDespesas,
          comparativoMesAnterior,
          porCategoria,
          porMetodoPagamento,
          porDia,
        };
      },
      
      getReceitaMesAtual: () => {
        const hoje = new Date();
        const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        const transacoes = get().transacoes.filter(
          (t) => t.tipo === 'receita' && t.status === 'recebido' && t.data >= inicioMes
        );
        return transacoes.reduce((sum, t) => sum + t.valor, 0);
      },
      
      getReceitaHoje: () => {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const transacoes = get().transacoes.filter(
          (t) =>
            t.tipo === 'receita' &&
            t.status === 'recebido' &&
            t.data.getTime() >= hoje.getTime()
        );
        return transacoes.reduce((sum, t) => sum + t.valor, 0);
      },
      
      getMetaProgresso: () => {
        const atual = get().getReceitaMesAtual();
        const meta = get().configuracao.metaMensal;
        return {
          atual,
          meta,
          percentual: meta > 0 ? (atual / meta) * 100 : 0,
        };
      },
      
      // Integração com sessões
      criarTransacaoDeSessao: (pacienteId, pacienteNome, sessaoId, servicoId, valorPersonalizado) => {
        const servico = get().getServicoById(servicoId);
        if (!servico) {
          throw new Error('Serviço não encontrado');
        }
        
        return get().adicionarTransacao({
          tipo: 'receita',
          valor: valorPersonalizado ?? servico.valorPadrao,
          data: new Date(),
          descricao: `Sessão de ${servico.nome}`,
          pacienteId,
          pacienteNome,
          sessaoId,
          servicoId,
          servicoNome: servico.nome,
          metodoPagamento: 'dinheiro', // Default, pode ser alterado depois
          status: 'pendente',
        });
      },
    }),
    {
      name: 'auris-financas-storage',
      partialize: (state) => ({
        servicos: state.servicos,
        transacoes: state.transacoes,
        configuracao: state.configuracao,
      }),
    }
  )
);

export default useFinancasStore;
