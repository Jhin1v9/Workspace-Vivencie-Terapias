export interface AuraLibraryDocument {
  id: string;
  titulo: string;
  categoria: string;
  autor?: string;
  url: string;
  tags: string[];
  resumo: string;
  trechosIndexados: string[];
}

export const auraLibraryPdfIndex: AuraLibraryDocument[] = [
  {
    id: 'pdf-1',
    titulo: 'Auriculoterapia na Atenção Primária à Saúde',
    categoria: 'Manuais Oficiais',
    autor: 'Ministério da Saúde - Brasil',
    url: 'https://subpav.org/aps/uploads/publico/repositorio/Livro_AuriculoterapiaNaAPS_PDFDigital_20240314_(1).pdf',
    tags: ['APS', 'auriculoterapia', 'protocolos', 'ansiedade', 'dor', 'tabagismo', 'SUS'],
    resumo: 'Manual oficial brasileiro com aplicação prática da auriculoterapia na APS, incluindo dor, ansiedade e tabagismo.',
    trechosIndexados: [
      'O material destaca a auriculoterapia como prática integrativa viável na atenção primária e aplicável a dor, ansiedade e tabagismo.',
      'A lógica clínica enfatiza avaliação individual, definição de queixa principal e monitoramento de resposta terapêutica ao longo das sessões.',
      'O documento descreve uso de protocolos acessíveis à rotina clínica, com foco em segurança, acompanhamento e integração ao cuidado.'
    ]
  },
  {
    id: 'pdf-2',
    titulo: 'Acupuntura e Auriculoterapia no Tratamento da Dor',
    categoria: 'Manuais Oficiais',
    autor: 'Ministério da Saúde - Brasil',
    url: 'https://www.gov.br/saude/pt-br/composicao/saps/pics/publicacoes/acupuntura-e-auriculoterapia-no-tratamento-da-dor-aguda-ou-cronica-em-adultos-e-idosos_2019.pdf',
    tags: ['dor', 'evidências', 'aguda', 'crônica', 'auriculoterapia', 'SUS'],
    resumo: 'Revisão rápida de evidências sobre auriculoterapia e acupuntura para dor aguda e crônica em adultos e idosos.',
    trechosIndexados: [
      'A revisão aponta utilidade da auriculoterapia como recurso complementar para dor aguda e crônica, especialmente quando integrada ao plano terapêutico.',
      'O texto reforça que a conduta deve considerar intensidade da dor, duração, funcionalidade e fatores associados, não apenas analgesia imediata.',
      'O documento favorece raciocínio clínico que combine manejo do sintoma doloroso com investigação de tensão, sobrecarga funcional e modulação autonômica.'
    ]
  },
  {
    id: 'pdf-3',
    titulo: 'NADA Protocol - Official Brochure',
    categoria: 'Protocolos',
    autor: 'NADA - National Acupuncture Detoxification Association',
    url: 'https://acudetox.com/wp-content/uploads/2024/05/NADA_BrochureDraft_BW.pdf',
    tags: ['NADA', 'dependências', 'trauma', 'saúde mental', 'auriculoterapia'],
    resumo: 'Brochura oficial do protocolo NADA para dependências e suporte em saúde comportamental.',
    trechosIndexados: [
      'O protocolo NADA trabalha uma sequência clássica de cinco pontos auriculares voltada a regulação, acolhimento e suporte em dependências.',
      'A proposta é fortalecer estabilização emocional, reduzir hiperreatividade e apoiar reorganização comportamental em contextos de abstinência e estresse.',
      'Na prática clínica, o protocolo é frequentemente usado como base de regulação antes de ajustes individualizados.'
    ]
  },
  {
    id: 'pdf-4',
    titulo: 'NADA Protocol - Current Perspectives',
    categoria: 'Protocolos',
    autor: 'Stuyt & Voyles - NADA',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5153313/',
    tags: ['NADA', 'pesquisa', 'evidências', 'saúde mental', 'dependências'],
    resumo: 'Artigo de revisão sobre perspectivas atuais, uso clínico e contexto terapêutico do protocolo NADA.',
    trechosIndexados: [
      'A revisão contextualiza o NADA como intervenção complementar em saúde comportamental e ambientes de cuidado coletivo.',
      'O raciocínio favorece suporte regulatório, redução de agitação e melhora de adesão ao cuidado, mais do que uma promessa isolada de cura.',
      'O texto sugere olhar o protocolo como parte de uma estratégia ampla de estabilização e vínculo terapêutico.'
    ]
  },
  {
    id: 'pdf-5',
    titulo: 'WHO Standardized Auricular Acupuncture Nomenclature',
    categoria: 'Atlas',
    autor: 'OMS - World Health Organization',
    url: 'https://www.scribd.com/document/616499851/WHO-Ear-Accupunture-Nomenclature',
    tags: ['OMS', 'atlas', 'pontos', 'padronização', 'nomenclatura'],
    resumo: 'Referência de nomenclatura padronizada para pontos auriculares e landmarks anatômicos.',
    trechosIndexados: [
      'O material ajuda a alinhar nomenclatura e localização anatômica dos pontos auriculares.',
      'É útil quando o terapeuta precisa confirmar correspondência entre nomes, regiões e referências internacionais.',
      'Serve como apoio para reduzir ambiguidade entre escolas e facilitar comunicação técnica.'
    ]
  },
  {
    id: 'pdf-6',
    titulo: 'Standardized Ear Acupuncture Nomenclature',
    categoria: 'Atlas',
    autor: 'Terry Oleson, PhD',
    url: 'https://www.scribd.com/document/499103914/oleson2014-auricle-accupuncture-nomenclature',
    tags: ['nomenclatura', 'somatotopia', 'anatomia', 'atlas'],
    resumo: 'Documento de padronização anatômica e terminológica da auriculoterapia.',
    trechosIndexados: [
      'A padronização anatômica favorece precisão na localização e melhor comunicação entre terapeutas e estudos.',
      'O conteúdo reforça a importância de landmarks consistentes para evitar confusão entre pontos próximos.',
      'É especialmente útil quando a dúvida do terapeuta envolve nome técnico, região auricular ou equivalência de pontos.'
    ]
  },
  {
    id: 'pdf-7',
    titulo: 'Auriculoterapia e Acupuntura - Protocolo UNESP',
    categoria: 'Artigos Científicos',
    autor: 'UNESP - Universidade Estadual Paulista',
    url: 'https://repositorio.unesp.br/server/api/core/bitstreams/f5804499-b024-41ce-903e-05b25a998535/content',
    tags: ['DORT', 'LER', 'dor', 'trabalho', 'protocolo', 'osteomuscular'],
    resumo: 'Protocolo voltado a distúrbios osteomusculares e dor relacionada ao trabalho.',
    trechosIndexados: [
      'O material discute auriculoterapia em quadros osteomusculares, com foco funcional e repetitivo.',
      'A leitura clínica valoriza relação entre dor, atividade ocupacional, tensão persistente e sobrecarga tecidual.',
      'Ajuda a pensar em protocolo mais direcionado para coluna, cintura escapular, membros superiores e resposta ao trabalho repetitivo.'
    ]
  },
  {
    id: 'pdf-8',
    titulo: 'Auriculoterapia na Redução de Ansiedade',
    categoria: 'Artigos Científicos',
    autor: 'Kurebayashi et al.',
    url: 'https://www.revistas.usp.br/rlae/article/view/130765/127148',
    tags: ['ansiedade', 'enfermagem', 'ensaio clínico', 'estresse'],
    resumo: 'Ensaio clínico sobre redução de ansiedade com auriculoterapia.',
    trechosIndexados: [
      'O estudo observa benefício da auriculoterapia na redução de ansiedade em contexto ocupacional.',
      'A leitura prática favorece pensar regulação autonômica, carga emocional e resposta ao estresse ao montar o protocolo.',
      'Pode ser útil quando o terapeuta quer justificar abordagem clínica para ansiedade além de sedação pontual.'
    ]
  },
  {
    id: 'reiki-1',
    titulo: 'Manual do Reiki Nível I - Iniciação',
    categoria: 'Reiki',
    autor: 'Academia.edu - Pedro Ramírez',
    url: 'https://www.academia.edu/31340548/Manual_Reiki_Nivel_I',
    tags: ['reiki', 'nível I', 'iniciação', 'manual'],
    resumo: 'Manual introdutório de Reiki Usui Tradicional nível I.',
    trechosIndexados: [
      'Material introdutório sobre fundamentos, princípios e aplicação do Reiki nível I.',
      'Útil para perguntas de base sobre prática energética complementar no contexto holístico.',
      'Pode servir como apoio complementar, mas não substitui o foco prioritário em auriculoterapia neurofisiológica brasileira.'
    ]
  },
  {
    id: 'reiki-2',
    titulo: 'Manual do Reiki Nível II - Símbolos',
    categoria: 'Reiki',
    autor: 'Scribd - Manuais Reiki',
    url: 'https://pt.scribd.com/document/406828100/Simbolos-Do-Reiki-II',
    tags: ['reiki', 'nível II', 'símbolos'],
    resumo: 'Manual avançado de Reiki com símbolos e aplicações terapêuticas.',
    trechosIndexados: [
      'Documento sobre símbolos e aplicações do Reiki nível II.',
      'Pode ser citado apenas quando o terapeuta estiver navegando explicitamente nesse material da biblioteca.',
      'Mesmo nesse caso, a Aura deve preservar prioridade clínica da auriculoterapia neurofisiológica.'
    ]
  }
];

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const countOccurrences = (source: string, term: string) => {
  if (!term) return 0;
  const parts = source.split(term);
  return parts.length > 1 ? parts.length - 1 : 0;
};

export const searchAuraLibrary = (query: string, limit = 4): AuraLibraryDocument[] => {
  const normalizedQuery = normalize(query);
  const tokens = normalizedQuery
    .split(/[^a-z0-9]+/i)
    .map((token) => token.trim())
    .filter((token) => token.length >= 3);

  if (!tokens.length) {
    return auraLibraryPdfIndex.slice(0, limit);
  }

  const scored = auraLibraryPdfIndex
    .map((documento) => {
      const haystack = normalize(
        [
          documento.titulo,
          documento.categoria,
          documento.autor ?? '',
          documento.resumo,
          documento.tags.join(' '),
          documento.trechosIndexados.join(' ')
        ].join(' ')
      );

      const score = tokens.reduce((total, token) => total + countOccurrences(haystack, token), 0);
      return { documento, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.documento);

  return scored.length ? scored : auraLibraryPdfIndex.slice(0, limit);
};
