import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft, 
  User, 
  Activity,
  Clock,
  CheckCircle2,
  Ear,
  Sparkles,
  FileText,
  Save,
  Camera,
  Thermometer,
  Heart,
  Brain,
  Zap,
  Wind,
  Droplets,
  Flame,
  Mountain,
  Download,
  BrainCircuit
} from 'lucide-react';
import { usePacientesStore, useSessoesStore, useConfigStore, usePontosStore } from '@/stores';
import { Slider } from '@/components/ui/slider';
import { v4 as uuidv4 } from 'uuid';

const etapas = [
  { id: 1, nome: 'Paciente', icone: User },
  { id: 2, nome: 'Avaliação', icone: Activity },
  { id: 3, nome: 'Protocolo', icone: Ear },
  { id: 4, nome: 'Aplicação', icone: Clock },
  { id: 5, nome: 'Observações', icone: FileText },
  { id: 6, nome: 'Finalização', icone: CheckCircle2 },
];

// Elementos MTC para seleção
const elementos = [
  { id: 'madeira', nome: 'Madeira', cor: 'bg-green-500', icone: Wind },
  { id: 'fogo', nome: 'Fogo', cor: 'bg-red-500', icone: Flame },
  { id: 'terra', nome: 'Terra', cor: 'bg-yellow-500', icone: Mountain },
  { id: 'metal', nome: 'Metal', cor: 'bg-gray-400', icone: Zap },
  { id: 'agua', nome: 'Água', cor: 'bg-blue-500', icone: Droplets },
];

// Emoções MTC
const emocoes = [
  { id: 'raiva', nome: 'Raiva', elemento: 'madeira' },
  { id: 'alegria', nome: 'Alegria', elemento: 'fogo' },
  { id: 'pensamento_excessivo', nome: 'Pensamento Excessivo', elemento: 'terra' },
  { id: 'tristeza', nome: 'Tristeza', elemento: 'metal' },
  { id: 'medo', nome: 'Medo', elemento: 'agua' },
];

export const SessaoApp: React.FC = () => {
  const [etapaAtual, setEtapaAtual] = useState(1);
  const { pacientes, pacienteSelecionado, selecionarPaciente } = usePacientesStore();
  const { modo_reiki_ativo } = useConfigStore();
  const { pontosSelecionados, limparSelecao } = usePontosStore();
  const { addSessao, getNextNumeroSessao } = useSessoesStore();
  
  // Estados da sessão
  const [dorEva, setDorEva] = useState(0);
  const [ansiedade, setAnsiedade] = useState(0);
  const [estresse, setEstresse] = useState(0);
  const [energia, setEnergia] = useState(5);
  const [sono, setSono] = useState(5);
  const [digestao, setDigestao] = useState(5);
  
  const [tempoSessao, setTempoSessao] = useState(30);
  const [tempoRestante, setTempoRestante] = useState(30 * 60);
  const [sessaoIniciada, setSessaoIniciada] = useState(false);
  const [reikiAtivo, setReikiAtivo] = useState(false);
  
  // Observações detalhadas
  const [observacoesInicio, setObservacoesInicio] = useState('');
  const [observacoesDurante, setObservacoesDurante] = useState('');
  const [observacoesFinais, setObservacoesFinais] = useState('');
  const [sensacoesTerapeuta, setSensacoesTerapeuta] = useState('');
  const [reacoesPaciente, setReacoesPaciente] = useState('');
  const [elementoPredominante, setElementoPredominante] = useState<string | null>(null);
  const [emocaoPredominante, setEmocaoPredominante] = useState<string | null>(null);
  
  const [melhora, setMelhora] = useState<boolean | null>(null);
  const [tecnicaUtilizada, setTecnicaUtilizada] = useState('sementes');
  const [fotosOrelha] = useState<string[]>([]);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showAuraModal, setShowAuraModal] = useState(false);
  const [auraOpiniao, setAuraOpiniao] = useState<string | null>(null);
  const [isGeneratingAura, setIsGeneratingAura] = useState(false);

  // Timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (sessaoIniciada && tempoRestante > 0) {
      interval = setInterval(() => {
        setTempoRestante((prev) => prev - 1);
      }, 1000);
    } else if (sessaoIniciada && tempoRestante === 0) {
      finalizarTimer();
    }
    return () => clearInterval(interval);
  }, [sessaoIniciada, tempoRestante]);

  const formatarTempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const finalizarTimer = () => {
    setSessaoIniciada(false);
  };

  const iniciarSessao = () => {
    setSessaoIniciada(true);
    setTempoRestante(tempoSessao * 60);
  };

  const finalizarSessao = () => {
    if (!pacienteSelecionado || melhora === null) return;
    
    const novaSessao = {
      id: uuidv4(),
      paciente_id: pacienteSelecionado.id,
      numero: getNextNumeroSessao(pacienteSelecionado.id),
      data: new Date().toISOString(),
      avaliacao: {
        dor_eva: dorEva,
        ansiedade: ansiedade,
        observacoes_inicio: observacoesInicio,
      },
      protocolo: {
        pontos: pontosSelecionados.map((p, i) => ({
          ...p,
          ordem: i + 1,
          tecnica_utilizada: tecnicaUtilizada,
          tempo_aplicacao_min: tempoSessao,
        })),
        tecnica: tecnicaUtilizada as any,
        duracao_min: tempoSessao,
      },
      reiki: reikiAtivo ? {
        aplicado: true,
        simbolos: ['CKR'],
        intencao: 'Harmonização energética',
        posicao: 'orelhas',
        duracao_min: 5,
        observacoes: sensacoesTerapeuta,
      } : null,
      evolucao: {
        melhora: melhora,
        observacoes_finais: observacoesFinais,
        fotos_orelha: fotosOrelha,
      },
    };
    
    addSessao(novaSessao as any);
    limparSelecao();
    alert('Sessão finalizada com sucesso!');
  };

  // Exportar sessão como PDF
  const exportarPDF = () => {
    if (!pacienteSelecionado) return;
    
    const conteudo = `
RELATÓRIO DE SESSÃO AURICULOTERAPIA
=====================================

PACIENTE
--------
Nome: ${pacienteSelecionado.dados_pessoais.nome}
Código AURIS: ${pacienteSelecionado.codigo_auris}
Data: ${new Date().toLocaleDateString('pt-BR')}
Terapeuta: ${useConfigStore.getState().terapeuta_nome || 'Não informado'}

AVALIAÇÃO INICIAL
-----------------
Nível de Dor (EVA): ${dorEva}/10
Ansiedade: ${ansiedade}/10
Estresse: ${estresse}/10
Energia: ${energia}/10
Qualidade do Sono: ${sono}/10
Digestão: ${digestao}/10

Observações Iniciais:
${observacoesInicio || 'Nenhuma observação'}

PROTOCOLO APLICADO
------------------
Técnica: ${tecnicaUtilizada === 'sementes' ? 'Sementes de Mostarda/Vaccaria' : 
          tecnicaUtilizada === 'esferas_mag' ? 'Esferas Magnéticas' : 
          tecnicaUtilizada === 'laser' ? 'Laser Terapêutico' : 
          tecnicaUtilizada === 'agulha_intradermica' ? 'Agulha Intradrêmica' : tecnicaUtilizada}
Duração: ${tempoSessao} minutos

Pontos Selecionados:
${pontosSelecionados.map((p, i) => `${i + 1}. ${p.nome_pt} (${p.codigo}) - ${p.regiao}`).join('\n') || 'Nenhum ponto selecionado'}

${reikiAtivo ? `REIKI
-----
Aplicado: Sim
Posição: Orelhas
Duração: 5 minutos
` : ''}

OBSERVAÇÕES DURANTE A SESSÃO
----------------------------
${observacoesDurante || 'Nenhuma observação'}

Sensações do Terapeuta:
${sensacoesTerapeuta || 'Nenhuma sensação registrada'}

Reações do Paciente:
${reacoesPaciente || 'Nenhuma reação relatada'}

Elemento Predominante (MTC): ${elementoPredominante || 'Não avaliado'}
Emoção Predominante: ${emocaoPredominante || 'Não avaliada'}

AVALIAÇÃO FINAL
---------------
Evolução: ${melhora === true ? 'Melhorou' : melhora === false ? 'Sem Alteração' : 'Não avaliado'}

Observações Finais:
${observacoesFinais || 'Nenhuma observação'}

${auraOpiniao ? `OPINIÃO AURA AI
---------------
${auraOpiniao}

` : ''}
-------------------------------------
AURIS OS - Sistema de Gestão em Auriculoterapia
Relatório gerado em: ${new Date().toLocaleString('pt-BR')}
    `;

    // Criar blob e download
    const blob = new Blob([conteudo], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sessao_${pacienteSelecionado.codigo_auris}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setShowPdfModal(false);
  };

  // Gerar opinião da Aura AI
  const gerarOpiniaoAura = async () => {
    setIsGeneratingAura(true);
    
    // Simular análise da Aura AI
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const opiniao = `Análise do Protocolo Aplicado:

SINERGIA DOS PONTOS:
Os pontos selecionados demonstram boa complementaridade para o perfil apresentado. ${pontosSelecionados.length > 0 ? `A combinação de ${pontosSelecionados.slice(0, 2).map(p => p.nome_pt).join(' e ')} sugere uma abordagem equilibrada entre aspectos físicos e emocionais.` : 'Recomendo selecionar pontos específicos para maior efetividade.'}

RECOMENDAÇÕES:
• Considerar a inclusão do ponto Shen Men para potencializar o efeito calmante
• O tempo de aplicação de ${tempoSessao} minutos é adequado para a técnica escolhida
• Monitorar a resposta do paciente nos primeiros 15 minutos

OBSERVAÇÕES CLÍNICAS:
${elementoPredominante ? `O elemento ${elementoPredominante} predominante indica um desequilíbrio que pode ser trabalhado nos próximos atendimentos.` : 'Sugiro avaliar o elemento predominante para personalizar o tratamento.'}

PRÓXIMA SESSÃO:
Recomendo retorno em 7 dias para avaliação da resposta e ajuste do protocolo se necessário.`;

    setAuraOpiniao(opiniao);
    setIsGeneratingAura(false);
  };

  const avancarEtapa = () => {
    if (etapaAtual < 6) setEtapaAtual(etapaAtual + 1);
  };

  const voltarEtapa = () => {
    if (etapaAtual > 1) setEtapaAtual(etapaAtual - 1);
  };

  const renderEtapa = () => {
    switch (etapaAtual) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Selecione o Paciente</h3>
            <div className="grid grid-cols-2 gap-3 max-h-64 overflow-auto scrollbar-thin">
              {pacientes.map((paciente) => (
                <motion.button
                  key={paciente.id}
                  className={`p-4 rounded-xl border text-left transition-all duration-300 ${
                    pacienteSelecionado?.id === paciente.id
                      ? 'bg-auris-sage/20 border-auris-sage'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                  onClick={() => selecionarPaciente(paciente)}
                  whileTap={{ scale: 0.98 }}
                >
                  <p className="font-medium text-white">{paciente.dados_pessoais.nome}</p>
                  <p className="text-sm text-white/50">{paciente.codigo_auris}</p>
                </motion.button>
              ))}
            </div>
            {modo_reiki_ativo && (
              <div className="flex items-center gap-3 p-4 bg-auris-indigo/10 rounded-xl border border-auris-indigo/20">
                <Sparkles className="w-5 h-5 text-auris-indigo" />
                <div className="flex-1">
                  <p className="text-white font-medium">Incluir preparação complementar</p>
                  <p className="text-sm text-white/60">Adicionar etapa antes da aplicação</p>
                </div>
                <motion.button
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                    reikiAtivo ? 'bg-auris-indigo' : 'bg-white/20'
                  }`}
                  onClick={() => setReikiAtivo(!reikiAtivo)}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute top-1 w-4 h-4 rounded-full bg-white"
                    animate={{ left: reikiAtivo ? '28px' : '4px' }}
                    transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                  />
                </motion.button>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Dor */}
              <div className="card-glass">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-white font-medium flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-auris-rose" />
                    Nível de Dor (EVA)
                  </label>
                  <span className="text-auris-rose font-bold text-xl">{dorEva}</span>
                </div>
                <Slider value={[dorEva]} onValueChange={(v) => setDorEva(v[0])} max={10} step={1} />
                <div className="flex justify-between text-xs text-white/40 mt-1">
                  <span>Sem dor</span>
                  <span>Dor máxima</span>
                </div>
              </div>

              {/* Ansiedade */}
              <div className="card-glass">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-white font-medium flex items-center gap-2">
                    <Brain className="w-4 h-4 text-auris-amber" />
                    Ansiedade
                  </label>
                  <span className="text-auris-amber font-bold text-xl">{ansiedade}</span>
                </div>
                <Slider value={[ansiedade]} onValueChange={(v) => setAnsiedade(v[0])} max={10} step={1} />
                <div className="flex justify-between text-xs text-white/40 mt-1">
                  <span>Calmo</span>
                  <span>Muito ansioso</span>
                </div>
              </div>

              {/* Estresse */}
              <div className="card-glass">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-white font-medium flex items-center gap-2">
                    <Zap className="w-4 h-4 text-auris-indigo" />
                    Estresse
                  </label>
                  <span className="text-auris-indigo font-bold text-xl">{estresse}</span>
                </div>
                <Slider value={[estresse]} onValueChange={(v) => setEstresse(v[0])} max={10} step={1} />
                <div className="flex justify-between text-xs text-white/40 mt-1">
                  <span>Relaxado</span>
                  <span>Muito estressado</span>
                </div>
              </div>

              {/* Energia */}
              <div className="card-glass">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-white font-medium flex items-center gap-2">
                    <Heart className="w-4 h-4 text-auris-sage" />
                    Nível de Energia
                  </label>
                  <span className="text-auris-sage font-bold text-xl">{energia}</span>
                </div>
                <Slider value={[energia]} onValueChange={(v) => setEnergia(v[0])} max={10} step={1} />
                <div className="flex justify-between text-xs text-white/40 mt-1">
                  <span>Exausto</span>
                  <span>Cheio de energia</span>
                </div>
              </div>

              {/* Sono */}
              <div className="card-glass">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-white font-medium">Qualidade do Sono</label>
                  <span className="text-white font-bold text-xl">{sono}</span>
                </div>
                <Slider value={[sono]} onValueChange={(v) => setSono(v[0])} max={10} step={1} />
                <div className="flex justify-between text-xs text-white/40 mt-1">
                  <span>Insônia</span>
                  <span>Sono perfeito</span>
                </div>
              </div>

              {/* Digestão */}
              <div className="card-glass">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-white font-medium">Digestão</label>
                  <span className="text-white font-bold text-xl">{digestao}</span>
                </div>
                <Slider value={[digestao]} onValueChange={(v) => setDigestao(v[0])} max={10} step={1} />
                <div className="flex justify-between text-xs text-white/40 mt-1">
                  <span>Problemas</span>
                  <span>Perfeita</span>
                </div>
              </div>
            </div>

            {/* Observações iniciais */}
            <div className="card-glass">
              <label className="text-white font-medium block mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Observações Iniciais
              </label>
              <textarea
                value={observacoesInicio}
                onChange={(e) => setObservacoesInicio(e.target.value)}
                placeholder="Como o paciente chegou hoje? Aspectos gerais observados..."
                className="input-glass h-24 resize-none"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Protocolo Selecionado</h3>
            {pontosSelecionados.length > 0 ? (
              <div className="space-y-2">
                {pontosSelecionados.map((ponto, index) => (
                  <div key={ponto.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                    <span className="w-6 h-6 rounded-full bg-auris-sage/20 text-auris-sage text-xs flex items-center justify-center">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-white font-medium">{ponto.nome_pt}</p>
                      <p className="text-xs text-white/50">{ponto.codigo}</p>
                    </div>
                    <span className="text-xs text-white/40">{ponto.regiao}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center bg-white/5 rounded-xl">
                <p className="text-white/60">Nenhum ponto selecionado</p>
                <p className="text-sm text-white/40 mt-1">
                  Abra o Atlas Auricular para selecionar pontos
                </p>
              </div>
            )}

            {/* Técnica - Removido moxabustão e agulha filiforme conforme solicitação */}
            <div className="card-glass">
              <label className="text-white font-medium block mb-3">Técnica de Aplicação</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'sementes', nome: 'Sementes de Mostarda/Vaccaria' },
                  { id: 'esferas_mag', nome: 'Esferas Magnéticas' },
                  { id: 'laser', nome: 'Laser Terapêutico' },
                  { id: 'agulha_intradermica', nome: 'Agulha Intradrêmica' },
                ].map((tec) => (
                  <motion.button
                    key={tec.id}
                    className={`p-3 rounded-xl border text-sm transition-all duration-300 ${
                      tecnicaUtilizada === tec.id
                        ? 'bg-auris-sage/20 border-auris-sage text-white'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                    }`}
                    onClick={() => setTecnicaUtilizada(tec.id)}
                    whileTap={{ scale: 0.98 }}
                  >
                    {tec.nome}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Duração */}
            <div className="card-glass">
              <label className="text-white font-medium block mb-3">Duração da Sessão</label>
              <div className="flex gap-2">
                {[15, 20, 30, 45, 60].map((min) => (
                  <motion.button
                    key={min}
                    className={`flex-1 py-2 rounded-xl border transition-all duration-300 ${
                      tempoSessao === min
                        ? 'bg-auris-sage/20 border-auris-sage'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                    onClick={() => setTempoSessao(min)}
                    whileTap={{ scale: 0.98 }}
                  >
                    {min} min
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 text-center">
            <div className="relative w-48 h-48 mx-auto">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  strokeDashoffset={`${2 * Math.PI * 88 * (1 - tempoRestante / (tempoSessao * 60))}`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-4xl font-mono text-white">
                  {formatarTempo(tempoRestante)}
                </span>
                {sessaoIniciada && (
                  <span className="text-sm text-auris-sage mt-1">Em andamento...</span>
                )}
              </div>
            </div>

            {!sessaoIniciada ? (
              <motion.button
                className="btn-primary px-8 py-3 text-lg"
                onClick={iniciarSessao}
                whileTap={{ scale: 0.98 }}
              >
                Iniciar Sessão
              </motion.button>
            ) : (
              <div className="flex gap-3 justify-center">
                <motion.button
                  className="btn-glass"
                  onClick={() => setSessaoIniciada(false)}
                  whileTap={{ scale: 0.98 }}
                >
                  Pausar
                </motion.button>
                <motion.button
                  className="btn-glass text-auris-rose"
                  onClick={finalizarTimer}
                  whileTap={{ scale: 0.98 }}
                >
                  Finalizar
                </motion.button>
              </div>
            )}

            {reikiAtivo && modo_reiki_ativo && (
              <div className="p-4 bg-auris-indigo/10 rounded-xl border border-auris-indigo/20">
                <div className="flex items-center justify-center gap-2 text-auris-indigo">
                  <Sparkles className="w-5 h-5" />
                  <span>Preparação complementar ativa</span>
                </div>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-white">Observações Durante a Sessão</h3>
            
            {/* Observações durante */}
            <div className="card-glass">
              <label className="text-white/60 text-sm block mb-2">Observações durante a aplicação</label>
              <textarea
                value={observacoesDurante}
                onChange={(e) => setObservacoesDurante(e.target.value)}
                placeholder="Como foi a aplicação? Alguma dificuldade?"
                className="input-glass h-20 resize-none"
              />
            </div>

            {/* Sensações do terapeuta */}
            <div className="card-glass">
              <label className="text-white/60 text-sm block mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-auris-indigo" />
                Sensações/Intuição do Terapeuta
              </label>
              <textarea
                value={sensacoesTerapeuta}
                onChange={(e) => setSensacoesTerapeuta(e.target.value)}
                placeholder="O que você sentiu/percebeu energeticamente?"
                className="input-glass h-20 resize-none"
              />
            </div>

            {/* Reações do paciente */}
            <div className="card-glass">
              <label className="text-white/60 text-sm block mb-2">Reações do Paciente</label>
              <textarea
                value={reacoesPaciente}
                onChange={(e) => setReacoesPaciente(e.target.value)}
                placeholder="Como o paciente reagiu? Alguma sensação relatada?"
                className="input-glass h-20 resize-none"
              />
            </div>

            {/* Elemento predominante */}
            <div className="card-glass">
              <label className="text-white font-medium block mb-3">Elemento Predominante (MTC)</label>
              <div className="grid grid-cols-5 gap-2">
                {elementos.map((elem) => {
                  const Icone = elem.icone;
                  return (
                    <motion.button
                      key={elem.id}
                      className={`p-3 rounded-xl border text-center transition-all duration-300 ${
                        elementoPredominante === elem.id
                          ? 'bg-white/20 border-white/40'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                      onClick={() => setElementoPredominante(elem.id)}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icone className={`w-6 h-6 mx-auto mb-1 ${elem.cor.replace('bg-', 'text-')}`} />
                      <span className="text-xs text-white/80">{elem.nome}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Emoção predominante */}
            <div className="card-glass">
              <label className="text-white font-medium block mb-3">Emoção Predominante</label>
              <div className="flex flex-wrap gap-2">
                {emocoes.map((emo) => (
                  <motion.button
                    key={emo.id}
                    className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                      emocaoPredominante === emo.id
                        ? 'bg-auris-sage/30 border border-auris-sage text-white'
                        : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
                    }`}
                    onClick={() => setEmocaoPredominante(emo.id)}
                    whileTap={{ scale: 0.98 }}
                  >
                    {emo.nome}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-white">Avaliação Final</h3>
            
            {/* Evolução */}
            <div>
              <label className="text-white font-medium block mb-3">Evolução do Paciente</label>
              <div className="flex gap-3">
                <motion.button
                  className={`flex-1 p-4 rounded-xl border transition-all duration-300 ${
                    melhora === true
                      ? 'bg-auris-sage/20 border-auris-sage'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                  onClick={() => setMelhora(true)}
                  whileTap={{ scale: 0.98 }}
                >
                  <CheckCircle2 className={`w-8 h-8 mx-auto mb-2 ${melhora === true ? 'text-auris-sage' : 'text-white/40'}`} />
                  <p className="text-white font-medium">Melhorou</p>
                </motion.button>
                <motion.button
                  className={`flex-1 p-4 rounded-xl border transition-all duration-300 ${
                    melhora === false
                      ? 'bg-auris-rose/20 border-auris-rose'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                  onClick={() => setMelhora(false)}
                  whileTap={{ scale: 0.98 }}
                >
                  <Activity className={`w-8 h-8 mx-auto mb-2 ${melhora === false ? 'text-auris-rose' : 'text-white/40'}`} />
                  <p className="text-white font-medium">Sem Alteração</p>
                </motion.button>
              </div>
            </div>

            {/* Observações finais */}
            <div className="card-glass">
              <label className="text-white/60 text-sm block mb-2">Observações Finais</label>
              <textarea
                value={observacoesFinais}
                onChange={(e) => setObservacoesFinais(e.target.value)}
                placeholder="Resumo geral da sessão, orientações dadas..."
                className="input-glass h-24 resize-none"
              />
            </div>

            {/* Fotos */}
            <div className="card-glass">
              <label className="text-white font-medium block mb-3 flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Fotos da Orelha
              </label>
              <div className="flex gap-2">
                <motion.button
                  className="flex-1 btn-glass flex items-center justify-center gap-2"
                  whileTap={{ scale: 0.98 }}
                >
                  <Camera className="w-4 h-4" />
                  Adicionar Foto
                </motion.button>
              </div>
            </div>

            {/* Opinião Aura AI */}
            {auraOpiniao && (
              <div className="card-glass border-auris-purple/30">
                <label className="text-white/60 text-sm block mb-2 flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-auris-purple" />
                  Opinião Aura AI
                </label>
                <div className="bg-auris-purple/10 rounded-lg p-3 text-white/80 text-sm whitespace-pre-line">
                  {auraOpiniao}
                </div>
              </div>
            )}

            {/* Botões de ação */}
            <div className="space-y-3">
              <motion.button
                className="w-full btn-primary flex items-center justify-center gap-2 py-4"
                onClick={finalizarSessao}
                disabled={melhora === null}
                whileTap={{ scale: 0.98 }}
              >
                <Save className="w-5 h-5" />
                Finalizar e Salvar Sessão
              </motion.button>
              
              <div className="flex gap-3">
                <motion.button
                  className="flex-1 btn-glass flex items-center justify-center gap-2 text-auris-purple"
                  onClick={() => setShowAuraModal(true)}
                  whileTap={{ scale: 0.98 }}
                >
                  <BrainCircuit className="w-4 h-4" />
                  {auraOpiniao ? 'Nova Opinião Aura' : 'Opinião Aura AI'}
                </motion.button>
                
                <motion.button
                  className="flex-1 btn-glass flex items-center justify-center gap-2"
                  onClick={() => setShowPdfModal(true)}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download className="w-4 h-4" />
                  Exportar PDF
                </motion.button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Progress */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          {etapas.map((etapa, index) => {
            const Icone = etapa.icone;
            const isAtiva = etapa.id === etapaAtual;
            const isCompleta = etapa.id < etapaAtual;
            
            return (
              <React.Fragment key={etapa.id}>
                <div className="flex flex-col items-center">
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isAtiva
                        ? 'bg-auris-sage text-white'
                        : isCompleta
                        ? 'bg-auris-sage/50 text-white'
                        : 'bg-white/10 text-white/40'
                    }`}
                    animate={isAtiva ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <Icone className="w-5 h-5" />
                  </motion.div>
                  <span className={`text-xs mt-1 ${isAtiva ? 'text-white' : 'text-white/40'}`}>
                    {etapa.nome}
                  </span>
                </div>
                {index < etapas.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${
                    isCompleta ? 'bg-auris-sage/50' : 'bg-white/10'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto scrollbar-thin p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={etapaAtual}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderEtapa()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 flex justify-between">
        <motion.button
          className="btn-glass flex items-center gap-2"
          onClick={voltarEtapa}
          disabled={etapaAtual === 1}
          whileTap={{ scale: 0.98 }}
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </motion.button>
        
        {etapaAtual < 6 && (
          <motion.button
            className="btn-primary flex items-center gap-2"
            onClick={avancarEtapa}
            whileTap={{ scale: 0.98 }}
          >
            Avançar
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        )}
      </div>

      {/* Modal Exportar PDF */}
      <AnimatePresence>
        {showPdfModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPdfModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass max-w-md w-full rounded-2xl p-6"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-medium text-white mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-auris-sage" />
                Exportar Relatório
              </h3>
              
              <p className="text-white/60 text-sm mb-6">
                Exporte o relatório completo da sessão em formato de texto para impressão ou arquivo.
              </p>

              <div className="bg-white/5 rounded-xl p-4 mb-6">
                <h4 className="text-white/80 text-sm font-medium mb-2">O relatório inclui:</h4>
                <ul className="text-white/60 text-sm space-y-1">
                  <li>• Dados do paciente e terapeuta</li>
                  <li>• Avaliação inicial completa</li>
                  <li>• Protocolo aplicado com pontos</li>
                  <li>• Observações durante a sessão</li>
                  <li>• Avaliação final e evolução</li>
                  <li>• Opinião Aura AI (se gerada)</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowPdfModal(false)}
                  className="flex-1 btn-glass"
                >
                  Cancelar
                </button>
                <motion.button
                  onClick={exportarPDF}
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                  whileTap={{ scale: 0.98 }}
                >
                  <Download className="w-4 h-4" />
                  Exportar
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Aura AI */}
      <AnimatePresence>
        {showAuraModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAuraModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass max-w-lg w-full rounded-2xl p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-auris-purple/20 flex items-center justify-center">
                  <BrainCircuit className="w-6 h-6 text-auris-purple" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white">Opinião Aura AI</h3>
                  <p className="text-white/60 text-sm">Análise inteligente do protocolo</p>
                </div>
              </div>
              
              <p className="text-white/60 text-sm mb-6">
                A Aura AI irá analisar os dados da sessão e fornecer insights sobre sinergia dos pontos, recomendações e sugestões para próximas sessões.
              </p>

              {isGeneratingAura ? (
                <div className="flex flex-col items-center py-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-12 h-12 rounded-full border-2 border-auris-purple border-t-transparent"
                  />
                  <p className="text-white/60 text-sm mt-4">Analisando protocolo...</p>
                </div>
              ) : auraOpiniao ? (
                <div className="bg-auris-purple/10 rounded-xl p-4 mb-6 max-h-64 overflow-auto">
                  <pre className="text-white/80 text-sm whitespace-pre-wrap font-sans">{auraOpiniao}</pre>
                </div>
              ) : null}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowAuraModal(false)}
                  className="flex-1 btn-glass"
                >
                  Fechar
                </button>
                <motion.button
                  onClick={gerarOpiniaoAura}
                  disabled={isGeneratingAura}
                  className="flex-1 btn-primary bg-auris-purple hover:bg-auris-purple/90 flex items-center justify-center gap-2"
                  whileTap={{ scale: 0.98 }}
                >
                  <Sparkles className="w-4 h-4" />
                  {auraOpiniao ? 'Gerar Nova' : 'Gerar Opinião'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
