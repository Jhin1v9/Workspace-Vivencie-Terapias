import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Plus, 
  User, 
  Activity,
  TrendingUp,
  TrendingDown,
  X,
  Calendar,
  FileText,
  Stethoscope,
  ChevronRight,
  Save,
  Trash2,
  AlertTriangle,
  Ear,
  Brain,
  Heart,
  Moon,
  Sun,
  Wind,
  Droplets,
  Sparkles,
  MessageCircle,
  DollarSign,
  CheckCircle,
  Clock
} from 'lucide-react';
import { usePacientesStore, useSessoesStore, useOSStore } from '@/stores';
import { useFinancasStore } from '@/stores/useFinancasStore';
import type { Paciente, AnamneseHolistica } from '@/types';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

// Abas disponíveis
const abas = [
  { id: 'visao', nome: 'Visão Geral', icone: User },
  { id: 'anamnese', nome: 'Anamnese MTC', icone: Stethoscope },
  { id: 'auricular', nome: 'Anamnese Auricular', icone: Ear },
  { id: 'sessoes', nome: 'Sessões', icone: Calendar },
  { id: 'financeiro', nome: 'Financeiro', icone: TrendingUp },
  { id: 'evolucao', nome: 'Evolução', icone: Activity },
];

// Estado inicial de anamnese vazia
const anamneseVazia: AnamneseHolistica = {
  queixa_principal: '',
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
    lingua: { cor: '', saburra: '', formato: '' },
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
};

export const ClinicaApp: React.FC = () => {
  const { 
    pacientes, 
    pacienteSelecionado, 
    selecionarPaciente, 
    addPaciente,
    deletePaciente,
    getNextCodigoAuris 
  } = usePacientesStore();
  const { getSessoesByPaciente, getUltimaSessao } = useSessoesStore();
  const { abrirJanela } = useOSStore();
  const { getTransacoesByFiltro } = useFinancasStore();
  
  const [busca, setBusca] = useState('');
  const [abaAtiva, setAbaAtiva] = useState('visao');
  const [showModalNovo, setShowModalNovo] = useState(false);
  const [showModalExcluir, setShowModalExcluir] = useState(false);
  
  // Form novo paciente
  const [novoPaciente, setNovoPaciente] = useState({
    nome: '',
    data_nascimento: '',
    sexo: 'F' as 'M' | 'F' | 'O',
    telefone: '',
    email: '',
    profissao: '',
    queixa_principal: '',
  });

  // Anamnese Auricular - padrão neurofisiológico brasileiro
  const [anamneseAuricular, setAnamneseAuricular] = useState({
    // História da queixa
    inicio_sintomas: '',
    duracao_queixa: '',
    fatores_melhora: '',
    fatores_piora: '',
    tratamentos_anteriores: '',
    
    // Padrão neurofisiológico
    padrao_neuro: 'simpatico' as 'simpatico' | 'parassimpatico' | 'misto' | null,
    
    // Sistema nervoso
    sono_qualidade: 5,
    ansiedade_nivel: 5,
    estresse_percebido: 5,
    
    // Sistema endócrino
    tireoide: false,
    diabetes: false,
    tpm: false,
    menopausa: false,
    
    // Sistema digestório
    apetite: 'normal' as 'aumentado' | 'normal' | 'diminuido',
    digestao: 'normal' as 'boa' | 'normal' | 'lenta' | 'difícil',
    intestino: 'normal' as 'preso' | 'normal' | 'solto',
    
    // Sistema urogenital
    urina: 'normal' as 'aumentada' | 'normal' | 'diminuida' | 'noturna',
    libido: 'normal' as 'aumentada' | 'normal' | 'diminuida',
    
    // Dor
    dor_localizacao: '',
    dor_intensidade: 0,
    dor_caracteristica: 'contínua' as 'contínua' | 'intermitente' | 'pulsátil' | 'queimadura' | null,
    
    // Emocional - perguntas sutis
    emocao_travada: null as string | null,
    situacao_vida: '',
    apoio_familiar: 'bom' as 'bom' | 'regular' | 'insuficiente' | null,
    satisfacao_vida: 5,
    
    // Inspeção auricular
    coloracao_orelha: 'normal' as 'normal' | 'vermelha' | 'pálida' | 'roxea' | 'amarelada',
    pontos_doloridos: [] as string[],
    pontos_sensiveis: [] as string[],
    reacao_cutanea: false,
    
    // Histórico
    cirurgias: '',
    medicamentos: '',
    alergias: '',
    dependencias: [] as string[],
  });

  const pacientesFiltrados = pacientes.filter((p) =>
    p.dados_pessoais.nome.toLowerCase().includes(busca.toLowerCase()) ||
    p.codigo_auris.toLowerCase().includes(busca.toLowerCase())
  );

  const getStatusPaciente = (paciente: Paciente) => {
    const sessoes = getSessoesByPaciente(paciente.id);
    if (sessoes.length === 0) return { status: 'Novo', cor: 'badge-amber' };
    const ultimaSessao = sessoes[sessoes.length - 1];
    const diasDesdeUltimaSessao = Math.floor(
      (Date.now() - new Date(ultimaSessao.data).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diasDesdeUltimaSessao > 30) return { status: 'Retorno', cor: 'badge-rose' };
    return { status: 'Em tratamento', cor: 'badge-sage' };
  };

  const getIndicadorEnergetico = (paciente: Paciente) => {
    const sessoes = getSessoesByPaciente(paciente.id);
    if (sessoes.length === 0) return { cor: 'bg-auris-stone', label: 'Não avaliado' };
    const ultimaSessao = sessoes[sessoes.length - 1];
    if (ultimaSessao.evolucao.melhora) return { cor: 'bg-auris-sage', label: 'Equilibrado' };
    return { cor: 'bg-auris-rose', label: 'Desequilíbrio' };
  };

  // Calcular débito do paciente
  const getDebitoPaciente = (pacienteId: string): number => {
    const transacoesPaciente = getTransacoesByFiltro({ pacienteId });
    const debito = transacoesPaciente
      .filter((t: { tipo: string; status: string }) => t.tipo === 'receita' && t.status === 'pendente')
      .reduce((sum: number, t: { valor: number }) => sum + t.valor, 0);
    return debito;
  };

  const handleExcluirPaciente = () => {
    if (pacienteSelecionado) {
      deletePaciente(pacienteSelecionado.id);
      setShowModalExcluir(false);
    }
  };

  const handleCriarPaciente = () => {
    const paciente: Paciente = {
      id: uuidv4(),
      codigo_auris: getNextCodigoAuris(),
      dados_pessoais: {
        nome: novoPaciente.nome,
        data_nascimento: novoPaciente.data_nascimento,
        sexo: novoPaciente.sexo,
        telefone: novoPaciente.telefone,
        email: novoPaciente.email,
        profissao: novoPaciente.profissao,
      },
      anamnese: {
        ...anamneseVazia,
        queixa_principal: novoPaciente.queixa_principal,
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    addPaciente(paciente);
    setShowModalNovo(false);
    selecionarPaciente(paciente);
    setNovoPaciente({
      nome: '',
      data_nascimento: '',
      sexo: 'F',
      telefone: '',
      email: '',
      profissao: '',
      queixa_principal: '',
    });
  };

  const renderConteudoAba = () => {
    if (!pacienteSelecionado) return null;

    switch (abaAtiva) {
      case 'visao':
        return (
          <div className="grid grid-cols-2 gap-6">
            {/* Queixa Principal */}
            <div className="card-glass">
              <h3 className="text-sm font-medium text-white/60 mb-2">Queixa Principal</h3>
              <p className="text-white">{pacienteSelecionado.anamnese.queixa_principal || 'Não registrada'}</p>
            </div>

            {/* Diagnóstico Holístico */}
            {pacienteSelecionado.diagnostico_holistico && (
              <div className="card-glass">
                <h3 className="text-sm font-medium text-white/60 mb-2">Diagnóstico Holístico</h3>
                <p className="text-white font-medium">{pacienteSelecionado.diagnostico_holistico.sintese_clinica}</p>
                <div className="flex gap-2 mt-2">
                  <span className="badge-sage capitalize">{pacienteSelecionado.diagnostico_holistico.sistema_afetado_principal}</span>
                  <span className="badge-sage capitalize">{pacienteSelecionado.diagnostico_holistico.natureza}</span>
                </div>
              </div>
            )}

            {/* Estado Emocional */}
            <div className="card-glass">
              <h3 className="text-sm font-medium text-white/60 mb-2">Estado Emocional</h3>
              <p className="text-white">Avaliado durante a consulta</p>
            </div>

            {/* Última Sessão */}
            <div className="card-glass">
              <h3 className="text-sm font-medium text-white/60 mb-2">Última Sessão</h3>
              {getUltimaSessao(pacienteSelecionado.id) ? (
                <div>
                  <p className="text-white">
                    {format(new Date(getUltimaSessao(pacienteSelecionado.id)!.data), 'dd/MM/yyyy')}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {getUltimaSessao(pacienteSelecionado.id)!.evolucao.melhora ? (
                      <span className="flex items-center gap-1 text-auris-sage text-sm">
                        <TrendingUp className="w-4 h-4" /> Melhora
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-auris-rose text-sm">
                        <TrendingDown className="w-4 h-4" /> Sem melhora
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-white/40">Nenhuma sessão registrada</p>
              )}
            </div>
          </div>
        );

      case 'anamnese':
        return (
          <div className="space-y-6">
            {/* Interrogatório Aprimorado com Perguntas Sutis */}
            <div className="card-glass">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-auris-sage" />
                Interrogatório - Perguntas Sutis
              </h3>
              <p className="text-white/60 text-sm mb-4">
                Abordagem delicada para compreender o paciente além dos sintomas físicos
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Perguntas sobre energia vital */}
                <div className="bg-white/5 rounded-lg p-4">
                  <label className="text-sm text-auris-amber flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4" />
                    Como você tem se sentido energeticamente?
                  </label>
                  <p className="text-white/80 text-sm italic">
                    "Além do cansaço físico, como está sua disposição para as coisas que gosta?"
                  </p>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4">
                  <label className="text-sm text-auris-amber flex items-center gap-2 mb-2">
                    <Heart className="w-4 h-4" />
                    O que tem ocupado seus pensamentos?
                  </label>
                  <p className="text-white/80 text-sm italic">
                    "Há algo que você tem carregado mentalmente que gostaria de compartilhar?"
                  </p>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4">
                  <label className="text-sm text-auris-amber flex items-center gap-2 mb-2">
                    <Moon className="w-4 h-4" />
                    Como tem sido suas noites?
                  </label>
                  <p className="text-white/80 text-sm italic">
                    "Não apenas o sono, mas o momento de deitar - você consegue relaxar?"
                  </p>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4">
                  <label className="text-sm text-auris-amber flex items-center gap-2 mb-2">
                    <Wind className="w-4 h-4" />
                    O que você sente no corpo quando fica ansioso?
                  </label>
                  <p className="text-white/80 text-sm italic">
                    "Onde essa sensação se manifesta fisicamente?"
                  </p>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4">
                  <label className="text-sm text-auris-amber flex items-center gap-2 mb-2">
                    <Sun className="w-4 h-4" />
                    O que te traz leveza ultimamente?
                  </label>
                  <p className="text-white/80 text-sm italic">
                    "Mesmo nos momentos difíceis, o que ainda consegue te fazer bem?"
                  </p>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4">
                  <label className="text-sm text-auris-amber flex items-center gap-2 mb-2">
                    <Droplets className="w-4 h-4" />
                    Como você tem lidado com suas emoções?
                  </label>
                  <p className="text-white/80 text-sm italic">
                    "Consegue expressar o que sente ou tende a guardar?"
                  </p>
                </div>
              </div>
            </div>

            {/* Inspeção */}
            <div className="card-glass">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-auris-sage" />
                Inspeção
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm text-white/60">Língua</label>
                  <p className="text-white">{pacienteSelecionado.anamnese.inspecao.lingua?.cor || 'Não avaliada'}</p>
                </div>
              </div>
            </div>

            {/* Auscultação */}
            <div className="card-glass">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-auris-amber" />
                Auscultação
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/60">Voz</label>
                  <p className="text-white capitalize">{pacienteSelecionado.anamnese.auscultacao.voz || 'Não avaliada'}</p>
                </div>
                <div>
                  <label className="text-sm text-white/60">Respiração</label>
                  <p className="text-white capitalize">{pacienteSelecionado.anamnese.auscultacao.respiracao || 'Não avaliada'}</p>
                </div>
              </div>
            </div>

            {/* Interrogatório Básico */}
            <div className="card-glass">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-auris-indigo" />
                Interrogatório
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-white/60">Sudorese</label>
                  <p className="text-white capitalize">{pacienteSelecionado.anamnese.interrogatorio.sudorese || 'Não avaliada'}</p>
                </div>
                <div>
                  <label className="text-sm text-white/60">Apetite</label>
                  <p className="text-white capitalize">{pacienteSelecionado.anamnese.interrogatorio.apetite || 'Não avaliado'}</p>
                </div>
                <div>
                  <label className="text-sm text-white/60">Sede</label>
                  <p className="text-white capitalize">{pacienteSelecionado.anamnese.interrogatorio.sede || 'Não avaliada'}</p>
                </div>
                <div>
                  <label className="text-sm text-white/60">Sono</label>
                  <p className="text-white capitalize">
                    {pacienteSelecionado.anamnese.interrogatorio.sono.qualidade === 'bom' 
                      ? 'Bom' 
                      : pacienteSelecionado.anamnese.interrogatorio.sono.qualidade === 'regular'
                        ? 'Regular'
                        : 'Ruim'}
                    {' '}({pacienteSelecionado.anamnese.interrogatorio.sono.horas_sono}h)
                  </p>
                </div>
                <div>
                  <label className="text-sm text-white/60">Libido</label>
                  <p className="text-white capitalize">{pacienteSelecionado.anamnese.interrogatorio.libido || 'Não avaliada'}</p>
                </div>
                <div>
                  <label className="text-sm text-white/60">Estado Emocional</label>
                  <p className="text-white">
                    Ansiedade: {pacienteSelecionado.anamnese.interrogatorio.estado_emocional.ansiedade}/10
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'auricular':
        return (
          <div className="space-y-6">
            {/* Anamnese Padrão Auriculoterapia Neurofisiológica */}
            <div className="card-glass">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <Ear className="w-5 h-5 text-auris-sage" />
                Anamnese Auricular - Padrão Neurofisiológico
              </h3>
              <p className="text-white/60 text-sm mb-4">
                Avaliação específica para auriculoterapia baseada no modelo neurofisiológico brasileiro
              </p>
              
              {/* Padrão Neurofisiológico */}
              <div className="mb-6">
                <label className="text-white font-medium block mb-3">Padrão Neurofisiológico Predominante</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'simpatico', nome: 'Simpático', desc: 'Hiperatividade, ansiedade, insônia', cor: 'bg-red-500' },
                    { id: 'parassimpatico', nome: 'Parassimpático', desc: 'Letargia, depressão, digestão lenta', cor: 'bg-blue-500' },
                    { id: 'misto', nome: 'Misto', desc: 'Oscilação entre estados', cor: 'bg-purple-500' },
                  ].map((padrao) => (
                    <motion.button
                      key={padrao.id}
                      onClick={() => setAnamneseAuricular({ ...anamneseAuricular, padrao_neuro: padrao.id as any })}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        anamneseAuricular.padrao_neuro === padrao.id
                          ? 'bg-auris-sage/20 border-auris-sage'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`w-3 h-3 rounded-full ${padrao.cor} mb-2`} />
                      <p className="text-white font-medium text-sm">{padrao.nome}</p>
                      <p className="text-white/50 text-xs">{padrao.desc}</p>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Sistema Nervoso */}
              <div className="mb-6">
                <label className="text-white font-medium block mb-3 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-auris-indigo" />
                  Sistema Nervoso
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-white/60 mb-1 block">Qualidade do Sono (0-10)</label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={anamneseAuricular.sono_qualidade}
                      onChange={(e) => setAnamneseAuricular({ ...anamneseAuricular, sono_qualidade: parseInt(e.target.value) })}
                      className="w-full accent-auris-sage"
                    />
                    <div className="flex justify-between text-xs text-white/40">
                      <span>Insônia</span>
                      <span>{anamneseAuricular.sono_qualidade}</span>
                      <span>Perfeito</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-white/60 mb-1 block">Nível de Ansiedade (0-10)</label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={anamneseAuricular.ansiedade_nivel}
                      onChange={(e) => setAnamneseAuricular({ ...anamneseAuricular, ansiedade_nivel: parseInt(e.target.value) })}
                      className="w-full accent-auris-amber"
                    />
                    <div className="flex justify-between text-xs text-white/40">
                      <span>Calmo</span>
                      <span>{anamneseAuricular.ansiedade_nivel}</span>
                      <span>Muito ansioso</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-white/60 mb-1 block">Estresse Percebido (0-10)</label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={anamneseAuricular.estresse_percebido}
                      onChange={(e) => setAnamneseAuricular({ ...anamneseAuricular, estresse_percebido: parseInt(e.target.value) })}
                      className="w-full accent-auris-rose"
                    />
                    <div className="flex justify-between text-xs text-white/40">
                      <span>Relaxado</span>
                      <span>{anamneseAuricular.estresse_percebido}</span>
                      <span>Estressado</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sistema Endócrino */}
              <div className="mb-6">
                <label className="text-white font-medium block mb-3">Sistema Endócrino</label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { id: 'tireoide', nome: 'Tireoide' },
                    { id: 'diabetes', nome: 'Diabetes' },
                    { id: 'tpm', nome: 'TPM' },
                    { id: 'menopausa', nome: 'Menopausa/Andropausa' },
                  ].map((item) => (
                    <motion.button
                      key={item.id}
                      onClick={() => setAnamneseAuricular({ 
                        ...anamneseAuricular, 
                        [item.id]: !anamneseAuricular[item.id as keyof typeof anamneseAuricular] 
                      })}
                      className={`px-4 py-2 rounded-full text-sm transition-all ${
                        anamneseAuricular[item.id as keyof typeof anamneseAuricular]
                          ? 'bg-auris-amber/20 text-auris-amber border border-auris-amber/50'
                          : 'bg-white/5 text-white/60 border border-white/10'
                      }`}
                      whileTap={{ scale: 0.95 }}
                    >
                      {item.nome}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Dor */}
              <div className="mb-6">
                <label className="text-white font-medium block mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-auris-rose" />
                  Avaliação da Dor
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-white/60 mb-1 block">Localização</label>
                    <input
                      type="text"
                      value={anamneseAuricular.dor_localizacao}
                      onChange={(e) => setAnamneseAuricular({ ...anamneseAuricular, dor_localizacao: e.target.value })}
                      placeholder="Onde dói?"
                      className="input-glass w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-white/60 mb-1 block">Intensidade (EVA 0-10)</label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={anamneseAuricular.dor_intensidade}
                      onChange={(e) => setAnamneseAuricular({ ...anamneseAuricular, dor_intensidade: parseInt(e.target.value) })}
                      className="w-full accent-auris-rose"
                    />
                    <div className="text-center text-white/60 text-sm">{anamneseAuricular.dor_intensidade}/10</div>
                  </div>
                </div>
              </div>

              {/* Inspeção Auricular */}
              <div>
                <label className="text-white font-medium block mb-3 flex items-center gap-2">
                  <Ear className="w-4 h-4 text-auris-sage" />
                  Inspeção da Orelha
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-white/60 mb-1 block">Coloração</label>
                    <select
                      value={anamneseAuricular.coloracao_orelha}
                      onChange={(e) => setAnamneseAuricular({ ...anamneseAuricular, coloracao_orelha: e.target.value as any })}
                      className="input-glass w-full"
                    >
                      <option value="normal">Normal (rosada)</option>
                      <option value="vermelha">Vermelha (calor/inflamação)</option>
                      <option value="pálida">Pálida (frio/deficiência)</option>
                      <option value="roxea">Róxea (estase)</option>
                      <option value="amarelada">Amarelada (umidade)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-white/60 mb-1 block">Reação Cutânea</label>
                    <div className="flex gap-2">
                      <motion.button
                        onClick={() => setAnamneseAuricular({ ...anamneseAuricular, reacao_cutanea: true })}
                        className={`flex-1 py-2 rounded-lg text-sm ${
                          anamneseAuricular.reacao_cutanea ? 'bg-auris-sage/20 text-auris-sage' : 'bg-white/5 text-white/60'
                        }`}
                        whileTap={{ scale: 0.98 }}
                      >
                        Presente
                      </motion.button>
                      <motion.button
                        onClick={() => setAnamneseAuricular({ ...anamneseAuricular, reacao_cutanea: false })}
                        className={`flex-1 py-2 rounded-lg text-sm ${
                          !anamneseAuricular.reacao_cutanea ? 'bg-auris-sage/20 text-auris-sage' : 'bg-white/5 text-white/60'
                        }`}
                        whileTap={{ scale: 0.98 }}
                      >
                        Ausente
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Histórico */}
            <div className="card-glass">
              <h3 className="text-lg font-medium text-white mb-4">Histórico Clínico</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Cirurgias Anteriores</label>
                  <textarea
                    value={anamneseAuricular.cirurgias}
                    onChange={(e) => setAnamneseAuricular({ ...anamneseAuricular, cirurgias: e.target.value })}
                    placeholder="Descreva cirurgias relevantes..."
                    className="input-glass w-full h-20 resize-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Medicamentos em Uso</label>
                  <textarea
                    value={anamneseAuricular.medicamentos}
                    onChange={(e) => setAnamneseAuricular({ ...anamneseAuricular, medicamentos: e.target.value })}
                    placeholder="Liste os medicamentos..."
                    className="input-glass w-full h-20 resize-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Alergias</label>
                  <textarea
                    value={anamneseAuricular.alergias}
                    onChange={(e) => setAnamneseAuricular({ ...anamneseAuricular, alergias: e.target.value })}
                    placeholder="Descreva alergias conhecidas..."
                    className="input-glass w-full h-20 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'sessoes':
        const sessoes = getSessoesByPaciente(pacienteSelecionado.id);
        return (
          <div className="space-y-4">
            {sessoes.length > 0 ? (
              sessoes.map((sessao, index) => (
                <div key={sessao.id} className="card-glass">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-auris-sage/20 text-auris-sage flex items-center justify-center font-medium">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-white font-medium">
                          Sessão {sessao.numero} - {format(new Date(sessao.data), 'dd/MM/yyyy')}
                        </p>
                        <p className="text-sm text-white/60">
                          {sessao.protocolo.pontos.length} pontos • {sessao.protocolo.duracao_total_min} min
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {sessao.evolucao.melhora ? (
                        <span className="badge-sage">Melhora</span>
                      ) : (
                        <span className="badge-rose">Sem alteração</span>
                      )}
                      <ChevronRight className="w-5 h-5 text-white/40" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-white/40">
                <Calendar className="w-12 h-12 mx-auto mb-4" />
                <p>Nenhuma sessão registrada</p>
              </div>
            )}
          </div>
        );

      case 'financeiro':
        const transacoesPaciente = pacienteSelecionado ? getTransacoesByFiltro({ pacienteId: pacienteSelecionado.id }) : [];
        const totalPendente = transacoesPaciente
          .filter((t: { tipo: string; status: string }) => t.tipo === 'receita' && t.status === 'pendente')
          .reduce((sum: number, t: { valor: number }) => sum + t.valor, 0);
        const totalRecebido = transacoesPaciente
          .filter((t: { tipo: string; status: string }) => t.tipo === 'receita' && t.status === 'recebido')
          .reduce((sum: number, t: { valor: number }) => sum + t.valor, 0);
        
        return (
          <div className="space-y-6">
            {/* Cards de Resumo */}
            <div className="grid grid-cols-3 gap-4">
              <div className="card-glass border-l-4 border-l-emerald-500">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  <span className="text-white/60 text-sm">Total Recebido</span>
                </div>
                <p className="text-2xl font-bold text-emerald-400">R$ {totalRecebido.toFixed(2)}</p>
              </div>
              <div className="card-glass border-l-4 border-l-amber-500">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                  <span className="text-white/60 text-sm">Pendente</span>
                </div>
                <p className="text-2xl font-bold text-amber-400">R$ {totalPendente.toFixed(2)}</p>
              </div>
              <div className="card-glass border-l-4 border-l-blue-500">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-blue-400" />
                  <span className="text-white/60 text-sm">Total em Sessões</span>
                </div>
                <p className="text-2xl font-bold text-blue-400">{transacoesPaciente.length}</p>
              </div>
            </div>

            {/* Lista de Transações */}
            <div className="card-glass">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-auris-sage" />
                Histórico Financeiro
              </h3>
              {transacoesPaciente.length === 0 ? (
                <p className="text-white/40 text-center py-8">Nenhuma transação registrada</p>
              ) : (
                <div className="space-y-3">
                  {transacoesPaciente.map((transacao: any) => (
                    <div 
                      key={transacao.id} 
                      className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transacao.status === 'recebido' ? 'bg-emerald-500/20' : 'bg-amber-500/20'
                        }`}>
                          {transacao.status === 'recebido' ? (
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <Clock className="w-5 h-5 text-amber-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-white font-medium">{transacao.descricao}</p>
                          <p className="text-xs text-white/50">
                            {format(new Date(transacao.data), 'dd/MM/yyyy')} • {transacao.metodoPagamento.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${
                          transacao.status === 'recebido' ? 'text-emerald-400' : 'text-amber-400'
                        }`}>
                          R$ {transacao.valor.toFixed(2)}
                        </p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          transacao.status === 'recebido' 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {transacao.status === 'recebido' ? 'Pago' : 'Pendente'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'evolucao':
        return (
          <div className="card-glass">
            <h3 className="text-lg font-medium text-white mb-4">Histórico de Evolução</h3>
            <div className="space-y-4">
              {getSessoesByPaciente(pacienteSelecionado.id).map((sessao) => (
                <div key={sessao.id} className="flex items-start gap-4 pb-4 border-b border-white/10 last:border-0">
                  <div className={`w-3 h-3 rounded-full mt-1 ${sessao.evolucao.melhora ? 'bg-auris-sage' : 'bg-auris-rose'}`} />
                  <div className="flex-1">
                    <p className="text-white font-medium">Sessão {sessao.numero}</p>
                    <p className="text-sm text-white/60">{format(new Date(sessao.data), 'dd/MM/yyyy')}</p>
                    <p className="text-sm text-white/80 mt-1">{sessao.evolucao.observacoes_finais}</p>
                  </div>
                </div>
              ))}
              {getSessoesByPaciente(pacienteSelecionado.id).length === 0 && (
                <p className="text-white/40 text-center py-8">Nenhuma evolução registrada</p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-full">
      {/* Sidebar - Lista de Pacientes */}
      <div className="w-80 border-r border-white/10 flex flex-col">
        {/* Search */}
        <div className="p-4 border-b border-white/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Buscar paciente..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="input-glass pl-10"
            />
          </div>
          <motion.button
            className="w-full btn-primary mt-3 flex items-center justify-center gap-2"
            onClick={() => setShowModalNovo(true)}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4" />
            Novo Paciente
          </motion.button>
        </div>

        {/* Lista */}
        <div className="flex-1 overflow-auto scrollbar-thin">
          {pacientesFiltrados.map((paciente, index) => {
            const status = getStatusPaciente(paciente);
            const indicador = getIndicadorEnergetico(paciente);
            const ultimaSessao = getUltimaSessao(paciente.id);
            const debito = getDebitoPaciente(paciente.id);

            return (
              <motion.div
                key={paciente.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 border-b border-white/5 cursor-pointer transition-all duration-300 ${
                  pacienteSelecionado?.id === paciente.id
                    ? 'bg-white/10'
                    : 'hover:bg-white/5'
                }`}
                onClick={() => {
                  selecionarPaciente(paciente);
                  setAbaAtiva('visao');
                }}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${indicador.cor}`}>
                    {paciente.dados_pessoais.nome.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">
                      {paciente.dados_pessoais.nome}
                    </p>
                    <p className="text-xs text-white/50">{paciente.codigo_auris}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className={`badge ${status.cor}`}>{status.status}</span>
                      {debito > 0 && (
                        <span className="badge bg-red-500/20 text-red-400 border border-red-500/30">
                          Débito: R$ {debito.toFixed(2)}
                        </span>
                      )}
                      {ultimaSessao && (
                        <span className="text-xs text-white/40">
                          {format(new Date(ultimaSessao.data), 'dd/MM/yyyy')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Content - Detalhes do Paciente */}
      <div className="flex-1 overflow-auto scrollbar-thin">
        {pacienteSelecionado ? (
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-auris-sage/20 flex items-center justify-center text-2xl font-medium text-auris-sage">
                  {pacienteSelecionado.dados_pessoais.nome.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-medium text-white">
                    {pacienteSelecionado.dados_pessoais.nome}
                  </h2>
                  <p className="text-white/60">
                    {pacienteSelecionado.codigo_auris} • {pacienteSelecionado.dados_pessoais.profissao || 'Profissão não informada'}
                  </p>
                  <p className="text-sm text-white/40">
                    {pacienteSelecionado.dados_pessoais.data_nascimento ? 
                      format(new Date(pacienteSelecionado.dados_pessoais.data_nascimento), 'dd/MM/yyyy') : 'Data não informada'} 
                    {' '}•{' '}
                    {pacienteSelecionado.dados_pessoais.sexo === 'F' ? 'Feminino' : 
                     pacienteSelecionado.dados_pessoais.sexo === 'M' ? 'Masculino' : 'Outro'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <motion.button
                  className="btn-glass flex items-center gap-2 text-auris-rose hover:bg-auris-rose/10"
                  onClick={() => setShowModalExcluir(true)}
                  whileTap={{ scale: 0.98 }}
                >
                  <Trash2 className="w-4 h-4" />
                  Excluir
                </motion.button>
                <motion.button
                  className="btn-primary flex items-center gap-2"
                  onClick={() => abrirJanela('sessao', `Sessão - ${pacienteSelecionado.dados_pessoais.nome}`)}
                  whileTap={{ scale: 0.98 }}
                >
                  <Activity className="w-4 h-4" />
                  Nova Sessão
                </motion.button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-white/10 pb-2">
              {abas.map((aba) => {
                const Icone = aba.icone;
                return (
                  <button
                    key={aba.id}
                    className={`tab-glass flex items-center gap-2 ${abaAtiva === aba.id ? 'tab-glass-active' : ''}`}
                    onClick={() => setAbaAtiva(aba.id)}
                  >
                    <Icone className="w-4 h-4" />
                    {aba.nome}
                  </button>
                );
              })}
            </div>

            {/* Content da Aba */}
            <AnimatePresence mode="wait">
              <motion.div
                key={abaAtiva}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderConteudoAba()}
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-white/40">
            <User className="w-16 h-16 mb-4" />
            <p>Selecione um paciente para ver os detalhes</p>
          </div>
        )}
      </div>

      {/* Modal Confirmar Exclusão */}
      <AnimatePresence>
        {showModalExcluir && pacienteSelecionado && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModalExcluir(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass max-w-md w-full rounded-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-auris-rose/20 flex items-center justify-center">
                    <AlertTriangle className="w-8 h-8 text-auris-rose" />
                  </div>
                </div>
                
                <h2 className="text-xl font-medium text-white text-center mb-2">
                  Confirmar Exclusão
                </h2>
                <p className="text-white/60 text-center mb-6">
                  Tem certeza que deseja excluir o paciente <strong className="text-white">{pacienteSelecionado.dados_pessoais.nome}</strong>?<br />
                  Esta ação não pode ser desfeita.
                </p>

                <div className="flex gap-3">
                  <motion.button
                    className="flex-1 btn-glass"
                    onClick={() => setShowModalExcluir(false)}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    className="flex-1 bg-auris-rose hover:bg-auris-rose-dark text-white py-2 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                    onClick={handleExcluirPaciente}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Trash2 className="w-4 h-4" />
                    Excluir
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Novo Paciente */}
      <AnimatePresence>
        {showModalNovo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModalNovo(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass max-w-lg w-full max-h-[90vh] overflow-auto rounded-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-medium text-white flex items-center gap-2">
                    <Plus className="w-5 h-5 text-auris-sage" />
                    Novo Paciente
                  </h2>
                  <button 
                    onClick={() => setShowModalNovo(false)}
                    className="text-white/40 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-white/60 mb-1">Nome Completo *</label>
                    <input
                      type="text"
                      value={novoPaciente.nome}
                      onChange={(e) => setNovoPaciente({ ...novoPaciente, nome: e.target.value })}
                      className="input-glass"
                      placeholder="Nome do paciente"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-white/60 mb-1">Data de Nascimento</label>
                      <input
                        type="date"
                        value={novoPaciente.data_nascimento}
                        onChange={(e) => setNovoPaciente({ ...novoPaciente, data_nascimento: e.target.value })}
                        className="input-glass"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-white/60 mb-1">Sexo</label>
                      <select
                        value={novoPaciente.sexo}
                        onChange={(e) => setNovoPaciente({ ...novoPaciente, sexo: e.target.value as 'M' | 'F' | 'O' })}
                        className="input-glass"
                      >
                        <option value="F">Feminino</option>
                        <option value="M">Masculino</option>
                        <option value="O">Outro</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-white/60 mb-1">Telefone</label>
                    <input
                      type="tel"
                      value={novoPaciente.telefone}
                      onChange={(e) => setNovoPaciente({ ...novoPaciente, telefone: e.target.value })}
                      className="input-glass"
                      placeholder="(00) 00000-0000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-white/60 mb-1">Email</label>
                    <input
                      type="email"
                      value={novoPaciente.email}
                      onChange={(e) => setNovoPaciente({ ...novoPaciente, email: e.target.value })}
                      className="input-glass"
                      placeholder="email@exemplo.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-white/60 mb-1">Profissão</label>
                    <input
                      type="text"
                      value={novoPaciente.profissao}
                      onChange={(e) => setNovoPaciente({ ...novoPaciente, profissao: e.target.value })}
                      className="input-glass"
                      placeholder="Profissão do paciente"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-white/60 mb-1">Queixa Principal</label>
                    <textarea
                      value={novoPaciente.queixa_principal}
                      onChange={(e) => setNovoPaciente({ ...novoPaciente, queixa_principal: e.target.value })}
                      className="input-glass h-20 resize-none"
                      placeholder="Descreva a queixa principal do paciente..."
                    />
                  </div>

                  <motion.button
                    className="w-full btn-primary flex items-center justify-center gap-2 mt-6"
                    onClick={handleCriarPaciente}
                    disabled={!novoPaciente.nome}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Save className="w-4 h-4" />
                    Criar Paciente
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
