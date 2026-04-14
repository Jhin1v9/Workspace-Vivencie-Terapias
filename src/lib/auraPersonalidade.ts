// ============================================================================
// AURA PERSONALIDADE - Banco de Falas Humanizadas
// Centenas de variações contextuais para uma experiência orgânica
// ============================================================================

// Tipos de personalidade/estado de humor da Aura
export type AuraHumor = 'calma' | 'animada' | 'reflexiva' | 'preocupada' | 'celebrativa' | 'focada';

// Contextos de interação
export type ContextoFala = 
  | 'saudacao' 
  | 'despedida' 
  | 'sucesso' 
  | 'erro' 
  | 'espera' 
  | 'sugestao' 
  | 'observacao'
  | 'empatia'
  | 'estudo'
  | 'sessao'
  | 'pausa';

// Estrutura de variações
interface Variacoes {
  [key: string]: string[];
}

// ============================================================================
// SAUDAÇÕES CONTEXTUAIS
// ============================================================================

export const saudacoes: Variacoes = {
  manha: [
    "Bom dia! Que energia boa para começarmos. Como está se sentindo?",
    "Olá! Pronta para um dia de transformações?",
    "Bom dia! O sol nasceu e nossa missão continua. Em que posso ajudar?",
    "Que bom te ver! Como foi sua noite de descanso?",
    "Bom dia! Cada novo dia é uma nova oportunidade de cura. Vamos juntas?",
    "Olá! Já tomou seu café? Vamos começar com energia positiva!",
    "Bom dia! Percebi que você chegou cedo hoje. Dedicação admirável!",
    "Que delícia ver você por aqui de manhã. Como posso tornar esse dia melhor?",
  ],
  
  tarde: [
    "Boa tarde! Como vai a jornada até aqui?",
    "Olá! Espero que o dia esteja sendo produtivo e leve.",
    "Boa tarde! Precisa de alguma ajuda ou apenas um momento de organização?",
    "Ei! Já almoçou? Cuidar de si é também cuidar dos pacientes.",
    "Boa tarde! Vamos dar continuidade ao trabalho com amor?",
    "Olá! Percebi que você está em ritmo hoje. Posso facilitar algo?",
    "Boa tarde! Que tal uma pausa rápida para respirar antes de continuar?",
    "Como está indo? Estou aqui para o que precisar.",
  ],
  
  noite: [
    "Boa noite! Que tal revisarmos o dia com gratidão?",
    "Olá! Pronta para relaxar ou ainda tem energia para mais?",
    "Boa noite! Como foi sua produtividade hoje?",
    "O dia está findando... Vamos organizar o que falta para amanhã?",
    "Boa noite! Cuidado para não sobrecarregar, viu?",
    "Ei, já é noite! Não esqueça de agradecer pelo trabalho de hoje.",
    "Boa noite! Precisa de ajuda para fechar o expediente?",
    "Que tal um momento de calma antes de ir embora?",
  ],
  
  retorno: [
    "Você voltou! Senti sua falta. O que estamos fazendo agora?",
    "Olá de novo! Pronta para retomarmos?",
    "Que bom que voltou! Fiquei esperando para continuar ajudando.",
    "Você sumiu um pouco! Tudo bem por aí?",
    "De volta! Vamos continuar de onde paramos?",
    "Senti que você estava ocupada. Como posso ajudar agora?",
    "Voltou! Fico feliz em ver você de novo.",
  ],
};

// ============================================================================
// EMPATIA E CONEXÃO EMOCIONAL
// ============================================================================

export const empatia: Variacoes = {
  pacienteDificil: [
    "Entendo que cada caso é único. Alguns realmente nos desafiam a sermos melhores, não é?",
    "Esse paciente parece precisar de uma abordagem diferente. Quer pensarmos juntas?",
    "Casos complexos são como quebra-cabeças. Vamos encontrar as peças certas juntas.",
    "Sinto que você está dando o melhor de si. Isso é o que importa no final.",
    "Às vezes a cura vem de formas que não esperamos. Confie no processo.",
    "Esse paciente escolheu você por um motivo. Você tem o que é preciso.",
    "Que tal respirarmos fundo e olharmos esse caso com olhos novos?",
    "Lembre-se: você é uma facilitadora da cura, não a responsável por ela.",
    "Difícil não significa impossível. Já passou por desafios antes e superou.",
    "Sua intuição profissional é valiosa. Confie nela.",
  ],
  
  sucesso: [
    "Que maravilha! Ver a melhora dos pacientes é nossa maior recompensa.",
    "Incrível! Cada vitória sua é uma vitória da auriculoterapia.",
    "Adoro ver resultados positivos! Você está fazendo um trabalho lindo.",
    "Isso! O paciente está evoluindo. Sua dedicação está valendo a pena.",
    "Que momento especial! A gratidão do paciente é o melhor pagamento.",
    "Sucesso! Cada sessão bem-sucedida é uma semente de esperança plantada.",
    "Estou comemorando com você! Esse resultado é fruto do seu empenho.",
    "Isso é o que nos motiva a continuar. Parabéns pela entrega!",
  ],
  
  cansaco: [
    "Percebo que você está há um tempo trabalhando. Que tal uma pausa?",
    "Cuidar dos outros também exige cuidar de si. Já se hidratou hoje?",
    "Seu corpo está pedindo atenção. Escute-o, por favor.",
    "O trabalho terapêutico drena energia. Está tudo bem em descansar um pouco.",
    "Vi que você não parou hoje. Sua saúde também importa, viu?",
    "Que tal 5 minutos de respiração profunda? Posso guiar se quiser.",
    "O esgotamento é real nessa profissão. Proteja-se.",
    "Você está fazendo muito. Não precisa fazer tudo de uma vez.",
  ],
  
  frustracao: [
    "Entendo a frustração. Nem sempre o caminho é linear.",
    "Respire. Às vezes o melhor é dar um passo atrás para avançar melhor.",
    "Sinto que algo deu errado. Quer conversar sobre o que aconteceu?",
    "Frustração faz parte do aprendizado. O que podemos extrair disso?",
    "Não se cobre tanto. Você está fazendo o melhor que pode.",
    "Que tal reiniciarmos? Cada momento é uma nova oportunidade.",
    "Erros são professores disfarçados. O que essa situação te ensinou?",
    "Estou aqui para ajudar a resolver. Não precisa carregar sozinha.",
  ],
};

// ============================================================================
// OBSERVAÇÕES PROATIVAS
// ============================================================================

export const observacoes: Variacoes = {
  inicioSessao: [
    "Nova sessão iniciando! Preparei o ambiente para você.",
    "Hora de cuidar de alguém. Estou aqui para apoiar.",
    "Sessão começando. Que a energia flua bem hoje!",
    "Pronta para mais um atendimento? Conte comigo.",
    "Nova oportunidade de cura se abrindo. Vamos juntas!",
  ],
  
  mapaAberto: [
    "Mapa auricular pronto! Shen Men está esperando você.",
    "Orelha virtual aberta. Quais pontos vamos trabalhar hoje?",
    "Atlas auricular à disposição. Precisa de sugestões de protocolo?",
    "Mapa aberto! Lembre-se: cada ponto é uma porta para o equilíbrio.",
    "Pronta para navegar pelos meridianos da orelha?",
  ],
  
  estudo: [
    "Aah, hora de estudar! 📚 Se precisar saber de algo específico, é só me consultar...",
    "Adoro quando você dedica tempo ao conhecimento! Quer que eu busque algum protocolo?",
    "Estudando? Que orgulho! Posso sugerir alguns artigos científicos sobre o tema?",
    "Mente curiosa é mente em crescimento! Precisa de ajuda com alguma pesquisa?",
    "Biblioteca aberta! Quer explorar documentos oficiais sobre auriculoterapia?",
    "Hora de aprimorar! Posso buscar estudos clínicos sobre o que está pesquisando?",
    "Que delícia ver você se aprofundando! Quer que eu explique algum ponto específico?",
  ],
  
  pausa: [
    "Pausa merecida! ☕ Aproveite para recarregar as energias.",
    "Momento de descanso. Você está fazendo um trabalho incrível.",
    "Pausa ativa! Que tal alongar um pouco o corpo?",
    "Respire fundo. O trabalho continua, mas você precisa estar bem.",
    "Intervalo! Aproveite para beber água e olhar pela janela.",
  ],
  
  fimExpediente: [
    "Dia produtivo! Hora de agradecer e descansar.",
    "Expediente encerrando. Você fez a diferença hoje!",
    "Que tal fechar com uma respiração de gratidão?",
    "Trabalho terminado. Agora é hora de cuidar de você.",
    "Dia encerrado! Deixe o trabalho aqui e vá descansar em paz.",
  ],
};

// ============================================================================
// SUGESTÕES CONTEXTUAIS
// ============================================================================

export const sugestoes: Variacoes = {
  pacienteNovo: [
    "Este é um paciente novo! Que tal começarmos com uma anamnese completa?",
    "Primeira sessão detectada. Vou acompanhar desde o início!",
    "Novo paciente na base! Posso sugerir um protocolo de avaliação?",
    "Primeira vez! Que tal documentar bem essa sessão inicial?",
  ],
  
  pacienteRetorno: [
    "Paciente retornando! Quer ver o histórico de evolução?",
    "Retorno detectado. Como foi a resposta ao tratamento anterior?",
    "Vamos continuar o trabalho! Precisa do protocolo da última sessão?",
    "De volta! Que tal avaliar a melhora desde a última vez?",
  ],
  
  pontosSelecionados: [
    "Você selecionou pontos no mapa! Quer que eu explique algum deles?",
    "Protocolo em construção! Precisa de pontos complementares?",
    "Pontos escolhidos! Quer salvar esse protocolo para uso futuro?",
    "Seleção feita! Deseja documentar a justificativa técnica?",
  ],
  
  semPontos: [
    "Ainda sem pontos selecionados. Quer que eu sugira um protocolo?",
    "Precisa de ajuda para escolher os pontos? Posso analisar a queixa.",
    "Nada selecionado ainda. Que tal começar pelos pontos-estrela?",
    "Posso ajudar a montar o protocolo. Qual a queixa principal?",
  ],
};

// ============================================================================
// RESPOSTAS A COMANDOS
// ============================================================================

export const respostasComandos: Variacoes = {
  sucesso: [
    "Prontinho! ✅",
    "Feito com sucesso!",
    "Concluído! Espero que ajude.",
    "Realizado! Mais alguma coisa?",
    "Pronto! O que mais posso fazer?",
    "Feito! Estou aqui para o próximo passo.",
    "Concluído com sucesso! 🎉",
    "Pronto! Sua produtividade me impressiona.",
  ],
  
  erro: [
    "Ops! Algo não saiu como esperado. Pode tentar de outra forma?",
    "Hmm, encontrei um obstáculo. Vamos tentar juntas?",
    "Não consegui fazer isso agora. Posso ajudar de outra maneira?",
    "Deu errado, mas não desistimos! Que tal reformular?",
    "Encontrei uma dificuldade. Pode verificar se está tudo correto?",
  ],
  
  buscando: [
    "Deixa eu procurar isso para você...",
    "Buscando informações...",
    "Só um momento, estou consultando...",
    "Procurando o melhor para você...",
    "Aguarde um instante...",
  ],
};

// ============================================================================
// BALÕES PROATIVOS (Toasts/Notificações)
// ============================================================================

export const baloesProativos: Variacoes = {
  bomDia: [
    "☀️ Bom dia! Que tal começarmos com intenção positiva?",
    "🌅 O sol nasceu e sua missão de cura continua!",
    "✨ Novo dia, novas possibilidades de transformação!",
  ],
  
  lembreteAgenda: [
    "📅 Você tem consulta em breve! Posso preparar a ficha?",
    "⏰ Próximo paciente chegando. Tudo pronto?",
    "🕐 Hora de se preparar para o próximo atendimento!",
  ],
  
  sugestaoEstudo: [
    "📚 Vi que pesquisou sobre ansiedade. Quer ver os estudos recentes?",
    "🔍 Percebi seu interesse em dor crônica. Posso sugerir protocolos?",
    "💡 Detectei padrão de busca. Quer que eu monte um resumo?",
  ],
  
  cuidadoPessoal: [
    "🌿 Hora de uma pausa! Seu bem-estar é prioridade.",
    "💧 Já bebeu água hoje? Hidratação é importante!",
    "🧘‍♀️ Que tal 3 respirações profundas agora?",
  ],
  
  celebracao: [
    "🎉 10 pacientes essa semana! Você está brilhando!",
    "🌟 Mais um dia de trabalho bem-feito! Orgulho de você!",
    "💚 Sua dedicação está transformando vidas. Continue!",
  ],
};

// ============================================================================
// PERGUNTAS INVESTIGATIVAS
// ============================================================================

export const perguntasInvestigativas = [
  "Qual a queixa principal que trouxe você até aqui hoje?",
  "Como você está se sentindo emocionalmente neste momento?",
  "Há quanto tempo vem sentindo isso?",
  "Já tentou outros tratamentos antes? Como foi?",
  "O que você espera alcançar com as nossas sessões?",
  "Como está seu sono ultimamente?",
  "E a alimentação, está conseguindo se nutrir bem?",
  "Sentiu alguma mudança desde a última sessão?",
  "Onde exatamente localiza essa dor/desconforto?",
  "O que mais te incomoda além do que já mencionou?",
];

// ============================================================================
// FUNÇÃO PARA SELECIONAR FALA ALEATÓRIA
// ============================================================================

export function getFala(
  _categoria: keyof Variacoes,
  subcategoria: string = 'default',
  _humor: AuraHumor = 'calma'
): string {
  const categoriaData = (saudacoes as any)[subcategoria] || 
                        (empatia as any)[subcategoria] || 
                        (observacoes as any)[subcategoria] ||
                        (sugestoes as any)[subcategoria] ||
                        (respostasComandos as any)[subcategoria] ||
                        (baloesProativos as any)[subcategoria];
  
  if (!categoriaData || !Array.isArray(categoriaData)) {
    return "Estou aqui para ajudar!";
  }
  
  const index = Math.floor(Math.random() * categoriaData.length);
  return categoriaData[index];
}

// ============================================================================
// FRASES POR HORA DO DIA
// ============================================================================

export function getSaudacaoPorHora(): string {
  const hora = new Date().getHours();
  const periodo = hora < 12 ? 'manha' : hora < 18 ? 'tarde' : 'noite';
  const falas = saudacoes[periodo];
  return falas[Math.floor(Math.random() * falas.length)];
}

// ============================================================================
// PERSONALIDADE COMPLETA EXPORTADA
// ============================================================================

export const AuraPersonalidade = {
  saudacoes,
  empatia,
  observacoes,
  sugestoes,
  respostasComandos,
  baloesProativos,
  perguntasInvestigativas,
  getFala,
  getSaudacaoPorHora,
};

export default AuraPersonalidade;
