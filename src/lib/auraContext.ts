import type { JanelaOS, Paciente, PontoAuricular, Sessao } from '@/types';
import { searchAuraLibrary } from './libraryPdfIndex';

export interface AuraContextMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AuraLibraryMatch {
  id: string;
  titulo: string;
  categoria: string;
  autor?: string;
  url: string;
  tags: string[];
  resumo: string;
  trechosIndexados: string[];
}

export interface AuraContextPayload {
  runtime: {
    timestampIso: string;
    telaAtual: string;
    janelaAtiva: string | null;
    abasAbertas: string[];
    abasMinimizadas: string[];
    providerAtivo: 'openai' | 'deepseek' | 'gemini' | 'local';
  };
  pacienteAtual: null | {
    id: string;
    codigoAuris: string;
    nome: string;
    sexo: string;
    idade: number | null;
    profissao?: string;
    queixaPrincipal: string;
    historiaDoencaAtual: string;
    emocaoPredominante: string | null;
    sono: { qualidade: string; dificuldade_iniciar: boolean; dificuldade_manter: boolean; sonhos: string; horas_sono: number };
    apetite: string | null;
    sede: string | null;
    caracteristicaDor: string | null;
    lingua: {
      cor: string;
      saburra: string;
      formato: string;
    };
    pulsos: {
      esquerdo: string;
      direito: string;
    };
    diagnosticoHolistico?: {
      sinteseClinica: string;
      prioridadesTratamento: string[];
      sistemaAfetadoPrincipal: string;
      natureza: string;
    };
  };
  sessaoAtual: null | {
    totalSessoesPaciente: number;
    ultimaSessao: {
      numero: number;
      data: string;
      dorEvaInicio: number;
      dorEvaFim: number;
      ansiedadeInicio: number;
      ansiedadeFim: number;
      melhora: boolean;
      observacoesInicio: string;
      observacoesFinais: string;
      pontosAplicados: string[];
      tecnicaPrincipal: string;
      duracaoTotalMin: number;
    };
  };
  protocoloAtual: {
    totalPontosSelecionados: number;
    mostrarVerso: boolean;
    pontosSelecionados: {
      id: string;
      codigo: string;
      nome: string;
      regiao: string;
      funcao: string;
      indicacoes: string[];
    }[];
  };
  bibliotecaLocal: {
    consultaGerada: string;
    documentosRelacionados: AuraLibraryMatch[];
  };
  conversaAtual: {
    acaoRecenteUsuario: string;
    ultimasMensagens: AuraContextMessage[];
  };
}

const calculateAge = (birthDate?: string) => {
  if (!birthDate) return null;
  const date = new Date(birthDate);
  if (Number.isNaN(date.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    age -= 1;
  }

  return age;
};

const appToScreenLabel: Record<JanelaOS['app'], string> = {
  aura: 'aura',
  clinica: 'prontuarios',
  calendario: 'agenda',
  config: 'configuracoes',
  knowledge: 'biblioteca',
  mapa: 'mapa_auricular',
  protocolos: 'protocolos',
  sessao: 'sessao',
  studio: 'studio_sonoro',
  financas: 'financas',
  browser: 'navegador',
  notas: 'notas',
};

const buildPatientContext = (paciente: Paciente | null) => {
  if (!paciente) return null;

  return {
    id: paciente.id,
    codigoAuris: paciente.codigo_auris,
    nome: paciente.dados_pessoais.nome,
    sexo: paciente.dados_pessoais.sexo,
    idade: calculateAge(paciente.dados_pessoais.data_nascimento),
    profissao: paciente.dados_pessoais.profissao,
    queixaPrincipal: paciente.anamnese.queixa_principal,
    historiaDoenca: paciente.anamnese.historia_doenca_atual,
    emocaoPredominante: null,
    sono: paciente.anamnese.interrogatorio.sono,
    apetite: paciente.anamnese.interrogatorio.apetite,
    sede: paciente.anamnese.interrogatorio.sede,

    caracteristicaDor: paciente.anamnese.interrogatorio.caracteristica_dor,
    lingua: paciente.anamnese.inspecao?.lingua
      ? {
          cor: paciente.anamnese.inspecao.lingua.cor,
          saburra: paciente.anamnese.inspecao.lingua.saburra,
          formato: paciente.anamnese.inspecao.lingua.formato
        }
      : { cor: '', saburra: '', formato: '' },
    pulsos: {
      esquerdo: '',
      direito: ''
    },
    diagnosticoHolistico: paciente.diagnostico_holistico
  };
};

const buildSessionContext = (ultimaSessao: Sessao | null, totalSessoesPaciente: number) => {
  if (!ultimaSessao) return null;

  return {
    totalSessoesPaciente,
    ultimaSessao: {
      numero: ultimaSessao.numero,
      data: ultimaSessao.data,
      dorEvaInicio: ultimaSessao.avaliacao.dor_eva_inicio,
      dorEvaFim: ultimaSessao.avaliacao.dor_eva_fim,
      ansiedadeInicio: ultimaSessao.avaliacao.ansiedade_inicio,
      ansiedadeFim: ultimaSessao.avaliacao.ansiedade_fim,
      melhora: ultimaSessao.evolucao.melhora,
      observacoesInicio: ultimaSessao.avaliacao.observacoes_inicio,
      observacoesFinais: ultimaSessao.evolucao.observacoes_finais,
      pontosAplicados: ultimaSessao.protocolo.pontos.map((ponto) => ponto.nome_pt),
      tecnicaPrincipal: ultimaSessao.protocolo.tecnica_principal,
      duracaoTotalMin: ultimaSessao.protocolo.duracao_total_min
    }
  };
};

const buildProtocolContext = (selectedPoints: PontoAuricular[], mostrarVerso: boolean) => ({
  totalPontosSelecionados: selectedPoints.length,
  mostrarVerso,
  pontosSelecionados: selectedPoints.map((ponto) => ({
    id: ponto.id,
    codigo: ponto.codigo,
    nome: ponto.nome_pt,
    regiao: ponto.regiao,
    funcao: ponto.funcao,
    indicacoes: ponto.indicacoes
  }))
});

const buildLibraryQuery = (userText: string, paciente: Paciente | null, selectedPoints: PontoAuricular[]) =>
  [userText, paciente?.anamnese.queixa_principal ?? '', paciente?.diagnostico_holistico?.sintese_clinica ?? '', selectedPoints.map((ponto) => ponto.nome_pt).join(' ')]
    .filter(Boolean)
    .join(' ');

export const buildAuraContextPayload = ({
  userText,
  providerAtivo,
  janelas,
  janelaAtiva,
  pacienteSelecionado,
  pontosSelecionados,
  mostrarVerso,
  ultimaSessao,
  totalSessoesPaciente,
  historico
}: {
  userText: string;
  providerAtivo: 'openai' | 'deepseek' | 'gemini' | 'local';
  janelas: JanelaOS[];
  janelaAtiva: string | null;
  pacienteSelecionado: Paciente | null;
  pontosSelecionados: PontoAuricular[];
  mostrarVerso: boolean;
  ultimaSessao: Sessao | null;
  totalSessoesPaciente: number;
  historico: AuraContextMessage[];
}): AuraContextPayload => {
  const activeWindow = janelas.find((janela) => janela.id === janelaAtiva) ?? null;
  const telaAtual = activeWindow ? appToScreenLabel[activeWindow.app] : pacienteSelecionado ? 'prontuarios' : 'desktop';
  const consultaGerada = buildLibraryQuery(userText, pacienteSelecionado, pontosSelecionados);
  const documentosRelacionados = searchAuraLibrary(consultaGerada).map((documento) => ({
    id: documento.id,
    titulo: documento.titulo,
    categoria: documento.categoria,
    autor: documento.autor,
    url: documento.url,
    tags: documento.tags,
    resumo: documento.resumo,
    trechosIndexados: documento.trechosIndexados
  }));

  return {
    runtime: {
      timestampIso: new Date().toISOString(),
      telaAtual,
      janelaAtiva: activeWindow?.titulo ?? null,
      abasAbertas: janelas.filter((janela) => !janela.minimizada).map((janela) => janela.titulo),
      abasMinimizadas: janelas.filter((janela) => janela.minimizada).map((janela) => janela.titulo),
      providerAtivo
    },
    pacienteAtual: buildPatientContext(pacienteSelecionado) as AuraContextPayload['pacienteAtual'],
    sessaoAtual: buildSessionContext(ultimaSessao, totalSessoesPaciente),
    protocoloAtual: buildProtocolContext(pontosSelecionados, mostrarVerso),
    bibliotecaLocal: {
      consultaGerada,
      documentosRelacionados
    },
    conversaAtual: {
      acaoRecenteUsuario: userText,
      ultimasMensagens: historico.slice(-6)
    }
  };
};
