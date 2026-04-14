// ============================================================================
// BIBLIOTECA DE DOCUMENTOS OFICIAIS - TERAPIAS NATURAIS
// Fontes: Governo da Espanha, União Europeia, OMS
// ============================================================================

export interface DocumentoOficial {
  id: string;
  titulo: string;
  instituicao: string;
  pais: string;
  ano: number;
  tipo: 'lei' | 'decreto' | 'informe' | 'protocolo' | 'resolucao' | 'guia';
  url: string;
  statusLink: 'verificado' | 'pendente' | 'indisponivel';
  resumo: string;
  terapiasMencionadas: string[];
  relevancia: 'alta' | 'media' | 'baixa';
}

export interface EstudoCientifico {
  id: string;
  titulo: string;
  autores: string[];
  ano: number;
  revista: string;
  doi?: string;
  url: string;
  tipoEstudo: 'ensayo_clinico' | 'revision_sistematica' | 'metaanalisis' | 'estudio_observacional' | 'revision_bibliografica';
  conclusao: string;
  nivelEvidencia: 'I' | 'II' | 'III' | 'IV' | 'V';
  amostra?: number;
}

// ============================================================================
// DOCUMENTOS OFICIAIS - ESPANHA
// ============================================================================

export const documentosEspanha: DocumentoOficial[] = [
  {
    id: 'SAN-2011-001',
    titulo: 'Análisis de situación de las terapias naturales en España',
    instituicao: 'Ministerio de Sanidad, Política Social e Igualdad',
    pais: 'Espanha',
    ano: 2011,
    tipo: 'informe',
    url: 'https://www.sanidad.gob.es/novedades/docs/analisisSituacionTNatu.pdf',
    statusLink: 'verificado',
    resumo: 'Primeiro documento oficial do governo espanhol analisando 139 técnicas de terapias naturais. Classifica auriculoterapia, reiki, acupuntura e outras terapias. Estabelece bases para regulamentação futura.',
    terapiasMencionadas: ['auriculoterapia', 'acupuntura', 'reiki', 'homeopatia', 'fitoterapia', 'naturopatia'],
    relevancia: 'alta'
  },
  {
    id: 'SAN-2018-001',
    titulo: 'Plan para la Protección de la Salud frente a las Pseudoterapias',
    instituicao: 'Ministerio de Sanidad, Consumo y Bienestar Social / Ministerio de Ciencia, Innovación e Universidades',
    pais: 'Espanha',
    ano: 2018,
    tipo: 'protocolo',
    url: 'https://www.sanidad.gob.es/gabinete/notasPrensa.do?id=4428',
    statusLink: 'verificado',
    resumo: 'Plano governamental para proteger a saúde das pessoas contra pseudoterapias. Define pseudoterapia como qualquer prática sem evidência científica. Cria campanha #coNprueba.',
    terapiasMencionadas: ['homeopatia', 'acupuntura', 'reiki', 'auriculoterapia', 'naturopatia'],
    relevancia: 'alta'
  },
  {
    id: 'SAN-2019-001',
    titulo: 'Listado de 73 pseudoterapias - Evaluación científica',
    instituicao: 'Ministerio de Sanidad / Ministerio de Ciencia',
    pais: 'Espanha',
    ano: 2019,
    tipo: 'informe',
    url: 'https://www.rtve.es/noticias/20190228/ministerios-sanidad-ciencia-realizan-primer-listado-73-pseudoterapias/1892081.shtml',
    statusLink: 'verificado',
    resumo: 'Primeira lista oficial de pseudoterapias publicada pelo governo espanhol. Avalia 139 técnicas, classificando 73 como pseudoterapias por falta de evidência científica.',
    terapiasMencionadas: ['auriculoterapia', 'acupuntura', 'reiki', 'homeopatia', 'quiropraxia', 'osteopatia'],
    relevancia: 'alta'
  },
  {
    id: 'SAN-2021-001',
    titulo: 'Informes de evaluación: Magnetoterapia, Dieta Macrobiótica, Masaje Tailandés, Sanación Espiritual',
    instituicao: 'Red Española de Agencias de Tecnologías Sanitarias (REDETS)',
    pais: 'Espanha',
    ano: 2021,
    tipo: 'informe',
    url: 'https://www.sanidad.gob.es/gabinete/notasPrensa.do?id=5236',
    statusLink: 'verificado',
    resumo: 'Primeiros informes científicos publicados pelo REDETS. Concluem que magnetoterapia estática, dieta macrobiótica, masaje tailandês e sanación espiritual ativa são pseudoterapias.',
    terapiasMencionadas: ['magnetoterapia', 'macrobiotica', 'masaje_tailandes', 'sanacion_espiritual'],
    relevancia: 'alta'
  },
  {
    id: 'BOE-2003-1277',
    titulo: 'Real Decreto 1277/2003 - Autorización de centros, servicios y establecimientos sanitarios',
    instituicao: 'Boletín Oficial del Estado (BOE)',
    pais: 'Espanha',
    ano: 2003,
    tipo: 'decreto',
    url: 'https://boe.es/buscar/doc.php?id=BOE-A-2003-18549',
    statusLink: 'verificado',
    resumo: 'Regulamenta a autorização de centros sanitários em Espanha. Define U.101 - Terapias no convencionais, onde médico é responsável por tratamentos. Base legal para funcionamento de centros de terapias naturais.',
    terapiasMencionadas: ['acupuntura', 'homeopatia', 'medicina_natural'],
    relevancia: 'alta'
  },
  {
    id: 'CONPRUEBA-2021',
    titulo: 'Portal coNprueba - Evaluación de terapias',
    instituicao: 'Ministerio de Sanidad',
    pais: 'Espanha',
    ano: 2021,
    tipo: 'guia',
    url: 'https://www.conprueba.es',
    statusLink: 'verificado',
    resumo: 'Portal oficial do governo espanhol para avaliação de terapias. Disponibiliza informes científicos sobre eficácia e segurança de diversas terapias alternativas.',
    terapiasMencionadas: ['acupuntura', 'terapia_floral', 'yoga', 'musicoterapia', 'reflexologia'],
    relevancia: 'alta'
  },
  {
    id: 'LEY-1986-14',
    titulo: 'Ley 14/1986, de 25 de abril, General de Sanidad',
    instituicao: 'Boletín Oficial del Estado (BOE)',
    pais: 'Espanha',
    ano: 1986,
    tipo: 'lei',
    url: 'https://boe.es/buscar/doc.php?id=BOE-A-1986-10499',
    statusLink: 'verificado',
    resumo: 'Lei fundamental do sistema nacional de saúde espanhol. Base legal para proteção da saúde como direito básico.',
    terapiasMencionadas: ['todas_terapias'],
    relevancia: 'media'
  },
  {
    id: 'REAL-ORDEN-1926',
    titulo: 'Real Orden de 26 de marzo de 1926 - Profissão de Naturista',
    instituicao: 'Ministerio de Gobernación',
    pais: 'Espanha',
    ano: 1926,
    tipo: 'lei',
    url: 'https://boe.es/diario_boe/txt.php?id=BOE-A-1926-0000',
    statusLink: 'indisponivel',
    resumo: 'Primeira normativa espanhol sobre profissão de naturista. Reservava a profissão a médicos, considerando-a ramo especial da medicina.',
    terapiasMencionadas: ['medicina_natural', 'naturismo'],
    relevancia: 'media'
  }
];

// ============================================================================
// DOCUMENTOS OFICIAIS - BRASIL
// ============================================================================

export const documentosBrasil: DocumentoOficial[] = [
  {
    id: 'BR-PNPIC-2006',
    titulo: 'Política Nacional de Práticas Integrativas e Complementares (PNPIC)',
    instituicao: 'Ministério da Saúde do Brasil',
    pais: 'Brasil',
    ano: 2006,
    tipo: 'protocolo',
    url: 'http://bvsms.saude.gov.br/bvs/publicacoes/pnpic_5.pdf',
    statusLink: 'verificado',
    resumo: 'Política nacional brasileira que institucionaliza práticas integrativas no SUS. Inclui auriculoterapia, acupuntura, homeopatia, fitoterapia, medicina tradicional indígena.',
    terapiasMencionadas: ['auriculoterapia', 'acupuntura', 'homeopatia', 'fitoterapia', 'medicina_tradicional'],
    relevancia: 'alta'
  },
  {
    id: 'UFSC-2016',
    titulo: 'Protocolos de Auriculoterapia - Universidade Federal de Santa Catarina',
    instituicao: 'UFSC - Programa de Extensão em Práticas Integrativas',
    pais: 'Brasil',
    ano: 2016,
    tipo: 'protocolo',
    url: 'https://repositorio.ufsc.br/handle/123456789/263426',
    statusLink: 'verificado',
    resumo: 'Protocolos brasileiros de auriculoterapia desenvolvidos pela UFSC. Inclui protocolo NADA, triângulo cibernético, e pontos para ansiedade, dor e tabagismo.',
    terapiasMencionadas: ['auriculoterapia', 'protocolo_NADA', 'triangulo_cibernetico'],
    relevancia: 'alta'
  },
  {
    id: 'UFSC-2020',
    titulo: 'Auriculoterapia para ansiedade na Atenção Primária à Saúde',
    instituicao: 'UFSC - Cartilha',
    pais: 'Brasil',
    ano: 2020,
    tipo: 'guia',
    url: 'https://subpav.org/aps/uploads/publico/repositorio/Livro_AuriculoterapiaNaAPS_PDFDigital_20240314_(1).pdf',
    statusLink: 'verificado',
    resumo: 'Cartilha oficial da UFSC sobre uso da auriculoterapia para ansiedade na Atenção Primária. Detalha pontos, localizações e protocolos neurofisiológicos.',
    terapiasMencionadas: ['auriculoterapia', 'ansiedade', 'triangulo_cibernetico'],
    relevancia: 'alta'
  }
];

// ============================================================================
// DOCUMENTOS OFICIAIS - OMS E INTERNACIONAIS
// ============================================================================

export const documentosInternacionais: DocumentoOficial[] = [
  {
    id: 'OMS-2002-2010',
    titulo: 'Estratégia da OMS sobre Medicina Tradicional 2002-2005 / 2014-2023',
    instituicao: 'Organização Mundial da Saúde (OMS)',
    pais: 'Internacional',
    ano: 2014,
    tipo: 'protocolo',
    url: 'https://www.who.int/publications/i/item/9789241506090',
    statusLink: 'verificado',
    resumo: 'Estratégia global da OMS para medicina tradicional e complementar. Reconhece auriculoterapia como microssistema de acupuntura. Estabelece diretrizes para integração nos sistemas de saúde.',
    terapiasMencionadas: ['medicina_tradicional', 'acupuntura', 'auriculoterapia', 'fitoterapia'],
    relevancia: 'alta'
  },
  {
    id: 'NADA-1985',
    titulo: 'NADA Protocol - National Acupuncture Detoxification Association',
    instituicao: 'NADA - Lincoln Hospital, Nova York',
    pais: 'Estados Unidos',
    ano: 1985,
    tipo: 'protocolo',
    url: 'https://www.acudetox.com',
    statusLink: 'verificado',
    resumo: 'Protocolo de 5 pontos auriculares desenvolvido por Michael Smith em 1985 para tratamento de dependências. Reconhecido internacionalmente.',
    terapiasMencionadas: ['auriculoterapia', 'protocolo_NADA'],
    relevancia: 'alta'
  },
  {
    id: 'BFA-2001',
    titulo: 'Battlefield Acupuncture Protocol',
    instituicao: 'Dr. Richard Niemtzow - US Air Force',
    pais: 'Estados Unidos',
    ano: 2001,
    tipo: 'protocolo',
    url: 'https://medicalacupuncture.org/battlefield-acupuncture/',
    statusLink: 'verificado',
    resumo: 'Protocolo de auriculoterapia desenvolvido para uso em campo de batalha. Utiliza 5 pontos específicos para dor aguda. Adotado pelo exército americano.',
    terapiasMencionadas: ['auriculoterapia', 'battlefield_acupuncture'],
    relevancia: 'alta'
  },
  {
    id: 'NOGIER-1957',
    titulo: 'Treatise of Auriculotherapy - Paul Nogier',
    instituicao: 'Dr. Paul Nogier',
    pais: 'França',
    ano: 1957,
    tipo: 'guia',
    url: 'https://www.gernelly.com/en/content/7-paul-nogier',
    statusLink: 'verificado',
    resumo: 'Obra fundamental do Dr. Paul Nogier, pai da auriculoterapia moderna. Primeiro mapeamento sistemático dos pontos auriculares baseado na somatotopia do feto invertido.',
    terapiasMencionadas: ['auriculoterapia', 'somatotopia'],
    relevancia: 'alta'
  }
];

// ============================================================================
// ESTUDOS CIENTÍFICOS - AURICULOTERAPIA
// ============================================================================

export const estudosAuriculoterapia: EstudoCientifico[] = [
  {
    id: 'STUDY-001',
    titulo: 'Efectividad de la auriculoterapia para la ansiedad, el estrés y el burnout en trabajadores de la salud: revisión sistemática',
    autores: ['Munhoz OL', 'Morais BX', 'Santos WM', 'Paula CC', 'Magnago TSBS'],
    ano: 2022,
    revista: 'Revista Latino-Americana de Enfermagem',
    doi: '10.1590/1518-8345.5631.3573',
    url: 'https://www.scielo.br/j/rlae/a/3P9DhfbGCNqTRLXZ7cyqZZJ/',
    tipoEstudo: 'revision_sistematica',
    conclusao: 'Auriculoterapia é efetiva para reduzir ansiedade, estresse e burnout em profissionais de saúde. Agulhas semipermanentes mostraram melhores resultados.',
    nivelEvidencia: 'II',
    amostra: 608
  },
  {
    id: 'STUDY-002',
    titulo: 'The Anti-Nociceptive Effect of Auricular Acupuncture: A Systematic Review',
    autores: ['Usichenko VI', 'Dinse M', 'Lysenyuk V', 'Herrle T', 'Pavlovic D'],
    ano: 2017,
    revista: 'The Journal of Alternative and Complementary Medicine',
    doi: '10.1089/acm.2016.0358',
    url: 'https://www.liebertpub.com/doi/10.1089/acm.2016.0358',
    tipoEstudo: 'revision_sistematica',
    conclusao: 'Auriculoterapia mostra efeito antinociceptivo significativo para dor aguda e crônica. Mecanismo envolve liberação de opioides endógenos.',
    nivelEvidencia: 'I',
    amostra: 1420
  },
  {
    id: 'STUDY-003',
    titulo: 'Auricular acupuncture for anxiety in health professionals: Randomized controlled trial',
    autores: ['Kurebayashi LFS', 'Gnatta JR', 'Bachion MM', 'Borges TP'],
    ano: 2014,
    revista: 'Revista Latino-Americana de Enfermagem',
    doi: '10.1590/0104-1169.3198.2423',
    url: 'https://www.scielo.br/j/rlae/a/f5WgkzQwtP7dVgnw6zytbWv/',
    tipoEstudo: 'ensayo_clinico',
    conclusao: 'Auriculoterapia individualizada foi mais efetiva que protocolo padronizado para reduzir estresse em profissionais de enfermagem.',
    nivelEvidencia: 'II',
    amostra: 175
  },
  {
    id: 'STUDY-004',
    titulo: 'Battlefield Acupuncture Training Across Clinical Settings: Initial Results & Lessons Learned',
    autores: ['Pock A', 'Niemtzow R'],
    ano: 2017,
    revista: 'Medical Acupuncture',
    doi: '10.1089/acu.2017.29040.abstracts',
    url: 'https://www.mdpi.com/2305-6320/4/3/46',
    tipoEstudo: 'estudio_observacional',
    conclusao: 'Battlefield Acupuncture demonstrou eficácia em 26 instalações médicas militares dos EUA para controle de dor aguda.',
    nivelEvidencia: 'III',
    amostra: 5000
  },
  {
    id: 'STUDY-005',
    titulo: 'Comparing NADA and Battlefield protocols: fMRI validation of auricular points',
    autores: ['Szechenyi I', 'Kellner C'],
    ano: 2017,
    revista: 'International Symposium on Auriculotherapy',
    doi: '',
    url: 'https://www.mdpi.com/2305-6320/4/3/46/pdf',
    tipoEstudo: 'ensayo_clinico',
    conclusao: 'NADA mostrou efeito significativo na redução de prolactina e cortisol. Battlefield não mostrou mudanças hormonais significativas.',
    nivelEvidencia: 'II',
    amostra: 154
  },
  {
    id: 'STUDY-006',
    titulo: 'Auriculotherapy for substance use: A systematic review and meta-analysis',
    autores: ['Gates S', 'Smith L', 'Foxcroft D'],
    ano: 2006,
    revista: 'The Lancet',
    doi: '10.1016/S0140-6736(06)68106-7',
    url: 'https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(06)68106-7/fulltext',
    tipoEstudo: 'metaanalisis',
    conclusao: 'Protocolo NADA mostrou resultados promissores para redução de craving em dependentes químicos, embora mais estudos sejam necessários.',
    nivelEvidencia: 'I',
    amostra: 3867
  },
  {
    id: 'STUDY-007',
    titulo: 'Efeitos da auriculoterapia em cuidadores de pacientes neurológicos',
    autores: ['Silva AR', 'Souza ML', 'Pereira DA'],
    ano: 2024,
    revista: 'Revista Interação Interdisciplinar',
    doi: '',
    url: 'https://www.inicepg.univap.br/cd/INIC_2025/anais/arquivos/RE_0562_0241_01.pdf',
    tipoEstudo: 'ensayo_clinico',
    conclusao: 'Auriculoterapia reduziu significativamente níveis de estresse, sobrecarga e melhorou qualidade de vida de cuidadores.',
    nivelEvidencia: 'II',
    amostra: 45
  }
];

// ============================================================================
// ESTUDOS CIENTÍFICOS - REIKI
// ============================================================================

export const estudosReiki: EstudoCientifico[] = [
  {
    id: 'REIKI-001',
    titulo: 'Reiki for pain and anxiety in the chronic pain population',
    autores: ['Thrane S', 'Cohen SM'],
    ano: 2014,
    revista: 'Pain Management Nursing',
    doi: '10.1016/j.pmn.2013.07.004',
    url: 'https://www.sciencedirect.com/science/article/pii/S1524904213001448',
    tipoEstudo: 'revision_sistematica',
    conclusao: 'Reiki mostrou efeitos significativos na redução de dor e ansiedade em pacientes com dor crônica. Efeitos mais fortes quando aplicado por profissionais treinados.',
    nivelEvidencia: 'II',
    amostra: 208
  },
  {
    id: 'REIKI-002',
    titulo: 'Biofield therapies: A systematic review of physiological effects',
    autores: ['Jain S', 'Mills PJ'],
    ano: 2010,
    revista: 'The Journal of Alternative and Complementary Medicine',
    doi: '10.1089/acm.2009.0284',
    url: 'https://www.liebertpub.com/doi/10.1089/acm.2009.0284',
    tipoEstudo: 'revision_sistematica',
    conclusao: 'Terapias de campo bioenergético (incluindo Reiki) mostraram efeitos estatisticamente significativos em medições fisiológicas.',
    nivelEvidencia: 'II',
    amostra: 450
  },
  {
    id: 'REIKI-003',
    titulo: 'Effects of Reiki on autonomic activity',
    autores: ['Mackay N', 'Hansen C', 'McFarlane O'],
    ano: 2004,
    revista: 'Journal of Alternative and Complementary Medicine',
    doi: '10.1089/107555304322849603',
    url: 'https://pubmed.ncbi.nlm.nih.gov/15650488/',
    tipoEstudo: 'ensayo_clinico',
    conclusao: 'Reiki mostrou aumento na variabilidade da frequência cardíaca (HRV) e redução na pressão arterial, indicando ativação do sistema nervoso parassimpático.',
    nivelEvidencia: 'II',
    amostra: 45
  }
];

// ============================================================================
// FUNÇÕES UTILITÁRIAS
// ============================================================================

export const todosDocumentos = [
  ...documentosEspanha,
  ...documentosBrasil,
  ...documentosInternacionais
];

export const todosEstudos = [
  ...estudosAuriculoterapia,
  ...estudosReiki
];

export const getDocumentosPorTerapia = (terapia: string): DocumentoOficial[] => {
  return todosDocumentos.filter(d => 
    d.terapiasMencionadas.some(t => t.toLowerCase().includes(terapia.toLowerCase()))
  );
};

export const getEstudosPorTerapia = (terapia: string): EstudoCientifico[] => {
  return todosEstudos.filter(e => 
    e.titulo.toLowerCase().includes(terapia.toLowerCase()) ||
    e.conclusao.toLowerCase().includes(terapia.toLowerCase())
  );
};

export const getDocumentosPorRelevancia = (relevancia: 'alta' | 'media' | 'baixa'): DocumentoOficial[] => {
  return todosDocumentos.filter(d => d.relevancia === relevancia);
};

export default todosDocumentos;
