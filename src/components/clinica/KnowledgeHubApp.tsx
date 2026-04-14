import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Search,
  ExternalLink,
  FileText,
  Headphones,
  Play,
  X,
  Star,
  Brain,
  Ear,
  Heart,
  Activity,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  Printer,
  Maximize2,
  Minimize2,
  Share2,
  Sparkles
} from 'lucide-react';

export interface Material {
  id: string;
  titulo: string;
  descricao: string;
  tipo: 'pdf' | 'video' | 'audio' | 'artigo';
  url: string;
  categoria: string;
  autor?: string;
  tags: string[];
  favorito?: boolean;
}

const materiaisBiblioteca: Material[] = [
  // PDFs Oficiais - Links verificados
  {
    id: 'pdf-1',
    titulo: 'Auriculoterapia na Atenção Primária à Saúde',
    descricao: 'Manual completo do Ministério da Saúde sobre auriculoterapia para tratamento de ansiedade, dor osteomuscular e tabagismo na APS.',
    tipo: 'pdf',
    url: 'https://subpav.org/aps/uploads/publico/repositorio/Livro_AuriculoterapiaNaAPS_PDFDigital_20240314_(1).pdf',
    categoria: 'Manuais Oficiais',
    autor: 'Ministério da Saúde - Brasil',
    tags: ['APS', 'protocolos', 'ansiedade', 'dor', 'tabagismo']
  },
  {
    id: 'pdf-2',
    titulo: 'Acupuntura e Auriculoterapia no Tratamento da Dor',
    descricao: 'Revisão rápida de evidências sobre o uso de acupuntura e auriculoterapia no tratamento da dor aguda e crônica.',
    tipo: 'pdf',
    url: 'https://www.gov.br/saude/pt-br/composicao/saps/pics/publicacoes/acupuntura-e-auriculoterapia-no-tratamento-da-dor-aguda-ou-cronica-em-adultos-e-idosos_2019.pdf',
    categoria: 'Manuais Oficiais',
    autor: 'Ministério da Saúde - Brasil',
    tags: ['dor', 'evidências', 'protocolo', 'SUS']
  },
  {
    id: 'pdf-3',
    titulo: 'NADA Protocol - Official Brochure',
    descricao: 'Documento oficial do protocolo NADA (National Acupuncture Detoxification Association) para tratamento de dependências.',
    tipo: 'pdf',
    url: 'https://acudetox.com/wp-content/uploads/2024/05/NADA_BrochureDraft_BW.pdf',
    categoria: 'Protocolos',
    autor: 'NADA - National Acupuncture Detoxification Association',
    tags: ['NADA', 'dependências', 'drogas', 'álcool', 'trauma']
  },
  {
    id: 'pdf-4',
    titulo: 'NADA Protocol - Current Perspectives',
    descricao: 'Artigo científico revisando as perspectivas atuais do protocolo NADA em saúde comportamental.',
    tipo: 'pdf',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5153313/',
    categoria: 'Protocolos',
    autor: 'Stuyt & Voyles - NADA',
    tags: ['NADA', 'pesquisa', 'evidências', 'saúde mental']
  },
  {
    id: 'pdf-5',
    titulo: 'WHO Standardized Auricular Acupuncture Nomenclature',
    descricao: 'Nomenclatura padronizada da OMS para pontos auriculares com imagens 3D.',
    tipo: 'pdf',
    url: 'https://www.scribd.com/document/616499851/WHO-Ear-Accupunture-Nomenclature',
    categoria: 'Atlas',
    autor: 'OMS - World Health Organization',
    tags: ['WHO', 'atlas', 'pontos', 'padronização', 'nomenclatura']
  },
  {
    id: 'pdf-6',
    titulo: 'Standardized Ear Acupuncture Nomenclature',
    descricao: 'Documento sobre a padronização da terminologia em auriculoterapia com landmarks anatômicos.',
    tipo: 'pdf',
    url: 'https://www.scribd.com/document/499103914/oleson2014-auricle-accupuncture-nomenclature',
    categoria: 'Atlas',
    autor: 'Terry Oleson, PhD',
    tags: ['WHO', 'nomenclatura', 'somatotopia', 'anatomia']
  },
  {
    id: 'pdf-7',
    titulo: 'Auriculoterapia e Acupuntura - Protocolo UNESP',
    descricao: 'Protocolo de acupuntura auricular para tratamento de distúrbios osteomusculares.',
    tipo: 'pdf',
    url: 'https://repositorio.unesp.br/server/api/core/bitstreams/f5804499-b024-41ce-903e-05b25a998535/content',
    categoria: 'Artigos Científicos',
    autor: 'UNESP - Universidade Estadual Paulista',
    tags: ['DORT', 'LER', 'dor', 'trabalho', 'protocolo']
  },
  {
    id: 'pdf-8',
    titulo: 'Auriculoterapia na Redução de Ansiedade',
    descricao: 'Ensaio clínico randomizado sobre auriculoterapia para redução de ansiedade em profissionais de enfermagem.',
    tipo: 'pdf',
    url: 'https://www.revistas.usp.br/rlae/article/view/130765/127148',
    categoria: 'Artigos Científicos',
    autor: 'Kurebayashi et al.',
    tags: ['ansiedade', 'enfermagem', 'pesquisa', 'ensaio clínico']
  },
  
  // Vídeos - YouTube
  {
    id: 'video-1',
    titulo: 'Auriculoterapia - Introdução e Fundamentos',
    descricao: 'Aula introdutória sobre os fundamentos da auriculoterapia.',
    tipo: 'video',
    url: 'https://www.youtube.com/results?search_query=auriculoterapia+introdu%C3%A7%C3%A3o+fundamentos',
    categoria: 'Vídeo Aulas',
    autor: 'Vários Canais',
    tags: ['introdução', 'história', 'fundamentos']
  },
  {
    id: 'video-2',
    titulo: 'Protocolo NADA - Demonstração',
    descricao: 'Vídeos sobre o protocolo NADA no YouTube.',
    tipo: 'video',
    url: 'https://www.youtube.com/results?search_query=protocolo+NADA+acupuntura+orelha',
    categoria: 'Protocolos',
    autor: 'NADA / Vários',
    tags: ['NADA', 'protocolo', 'demonstração']
  },
  
  // Sites Oficiais
  {
    id: 'site-1',
    titulo: 'NADA - Site Oficial',
    descricao: 'Site oficial da National Acupuncture Detoxification Association com informações sobre treinamentos e protocolos.',
    tipo: 'artigo',
    url: 'https://acudetox.com/protocol/',
    categoria: 'Protocolos',
    autor: 'NADA',
    tags: ['NADA', 'oficial', 'treinamento', 'protocolo']
  },
  {
    id: 'site-2',
    titulo: 'Política Nacional de Práticas Integrativas - MS',
    descricao: 'Portal oficial do Ministério da Saúde sobre Práticas Integrativas e Complementares no SUS.',
    tipo: 'artigo',
    url: 'https://www.gov.br/saude/pt-br/composicao/saps/pics',
    categoria: 'Manuais Oficiais',
    autor: 'Ministério da Saúde',
    tags: ['SUS', 'PICS', 'política', 'oficial']
  },
  
  // Áudios
  {
    id: 'audio-1',
    titulo: 'Meditação Guiada para Sessões',
    descricao: 'Áudio de meditação para uso durante sessões de auriculoterapia.',
    tipo: 'audio',
    url: '/audio/meditacao-sessao.mp3',
    categoria: 'Áudios Terapêuticos',
    tags: ['meditação', 'relaxamento', 'sessão']
  },
  {
    id: 'audio-2',
    titulo: 'Frequência 528 Hz - Reparação DNA',
    descricao: 'Frequência solfeggio para harmonização celular.',
    tipo: 'audio',
    url: '/audio/528hz.mp3',
    categoria: 'Frequências',
    tags: ['528Hz', 'solfeggio', 'harmonização']
  },
  
  // REIKI - Seção dedicada - Links verificados e funcionais
  {
    id: 'reiki-1',
    titulo: 'Manual do Reiki Nível I - Iniciação',
    descricao: 'Manual completo de Reiki Usui Tradicional Nível I, com história, princípios e técnicas de aplicação.',
    tipo: 'pdf',
    url: 'https://www.academia.edu/31340548/Manual_Reiki_Nivel_I',
    categoria: 'Reiki',
    autor: 'Academia.edu - Pedro Ramírez',
    tags: ['Reiki I', 'iniciação', 'Usui', 'manual']
  },
  {
    id: 'reiki-2',
    titulo: 'Manual do Reiki Nível II - Símbolos',
    descricao: 'Manual avançado com os três símbolos do Reiki Usui e suas aplicações terapêuticas.',
    tipo: 'pdf',
    url: 'https://pt.scribd.com/document/406828100/Simbolos-Do-Reiki-II',
    categoria: 'Reiki',
    autor: 'Scribd - Manuais Reiki',
    tags: ['Reiki II', 'símbolos', 'Hon Sha Ze Sho Nen', 'Sei He Ki', 'Cho Ku Rei']
  },
  {
    id: 'reiki-3',
    titulo: 'Os Cinco Princípios do Reiki - Gokai',
    descricao: 'Gokai - Os princípios éticos e filosóficos do Reiki para uma vida harmoniosa. Artigo completo.',
    tipo: 'artigo',
    url: 'https://mundoreiki.com.br/2026/02/17/os-cinco-principios-do-reiki/',
    categoria: 'Reiki',
    autor: 'Mundo Reiki',
    tags: ['Gokai', 'princípios', 'filosofia', 'meditação']
  },
  {
    id: 'reiki-4',
    titulo: 'Reiki e Ciência - Evidências Científicas',
    descricao: 'Compilação de estudos científicos sobre os efeitos do Reiki na saúde física e mental.',
    tipo: 'artigo',
    url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5871314/',
    categoria: 'Reiki',
    autor: 'PubMed Central - NCBI',
    tags: ['pesquisa', 'evidências', 'ciência', 'estudos']
  },
  {
    id: 'reiki-5',
    titulo: 'Meditação Reiki - Hatsurei Ho',
    descricao: 'Áudio guiado da técnica de meditação Hatsurei Ho para limpeza energética diária.',
    tipo: 'audio',
    url: '/audio/hatsurei-ho.mp3',
    categoria: 'Reiki',
    autor: 'Prática Tradicional',
    tags: ['meditação', 'Hatsurei Ho', 'limpeza energética']
  },
  {
    id: 'reiki-6',
    titulo: 'Reiki para Ansiedade e Estresse',
    descricao: 'Artigo científico sobre a eficácia do Reiki no tratamento de ansiedade e redução de estresse.',
    tipo: 'artigo',
    url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4652586/',
    categoria: 'Reiki',
    autor: 'Journal of Evidence-Based Complementary & Alternative Medicine',
    tags: ['ansiedade', 'estresse', 'protocolo', 'aplicação']
  },
  {
    id: 'reiki-7',
    titulo: 'Posições de Tratamento Reiki',
    descricao: 'Guia completo com as 12 posições básicas de tratamento Reiki no corpo.',
    tipo: 'artigo',
    url: 'https://www.reikiefelicidade.com/post/autoaplica%C3%A7%C3%A3o-reiki-posi%C3%A7%C3%B5es-de-m%C3%A3os-guia',
    categoria: 'Reiki',
    autor: 'Reiki e Felicidade',
    tags: ['posições', 'tratamento', 'referência', 'guia']
  },
  {
    id: 'reiki-8',
    titulo: 'Reiki e Acupuntura - Integração Terapêutica',
    descricao: 'Artigo sobre a integração terapêutica entre Reiki e acupuntura para tratamentos holísticos.',
    tipo: 'artigo',
    url: 'https://apre.pt/index.php/blog-masonary/reiki-e-acupuntura-integracao-terapeutica',
    categoria: 'Reiki',
    autor: 'APRE - Associação Portuguesa de Reiki',
    tags: ['integração', 'acupuntura', 'sinergia', 'combinação']
  },
  {
    id: 'reiki-9',
    titulo: 'Karuna Reiki - Sistema Avançado',
    descricao: 'Introdução ao sistema Karuna Reiki com símbolos adicionais e técnicas avançadas de cura.',
    tipo: 'artigo',
    url: 'https://www.humaniamor.com.br/reiki/karuna-reiki/',
    categoria: 'Reiki',
    autor: 'Humaniamor',
    tags: ['Karuna', 'avançado', 'símbolos', 'compaixão']
  },
  {
    id: 'reiki-10',
    titulo: 'Autoaplicação de Reiki - Guia Prático',
    descricao: 'Guia prático para aplicação de Reiki em si mesmo, mantendo o equilíbrio energético diário.',
    tipo: 'artigo',
    url: 'https://www.humaniamor.com.br/reiki/auto-aplicacao-de-reiki/',
    categoria: 'Reiki',
    autor: 'Humaniamor',
    tags: ['autoaplicação', 'autocuidado', 'prática diária']
  },
  {
    id: 'reiki-11',
    titulo: 'História do Reiki Usui',
    descricao: 'A história completa de Mikao Usui e a origem do sistema de cura Reiki.',
    tipo: 'artigo',
    url: 'https://www.joaomagalhaes.com/o-tao-do-reiki/temas/mikao-usui/',
    categoria: 'Reiki',
    autor: 'João Magalhães - O Tao do Reiki',
    tags: ['história', 'Mikao Usui', 'origem', 'tradição']
  },
  {
    id: 'reiki-12',
    titulo: 'Chakras e Reiki - Guia Completo',
    descricao: 'Relação entre os chakras e a prática do Reiki para equilíbrio energético.',
    tipo: 'artigo',
    url: 'https://www.humaniamor.com.br/reiki/chakras-e-reiki/',
    categoria: 'Reiki',
    autor: 'Humaniamor',
    tags: ['chakras', 'energia', 'equilíbrio', 'centros de energia']
  }
];

const categorias = [
  { id: 'todos', nome: 'Todos', icone: BookOpen },
  { id: 'Manuais Oficiais', nome: 'Manuais Oficiais', icone: FileText },
  { id: 'Livros', nome: 'Livros', icone: BookOpen },
  { id: 'Protocolos', nome: 'Protocolos', icone: Activity },
  { id: 'Atlas', nome: 'Atlas e Mapas', icone: Ear },
  { id: 'Artigos Científicos', nome: 'Artigos Científicos', icone: Brain },
  { id: 'Saúde Mental', nome: 'Saúde Mental', icone: Heart },
  { id: 'Reiki', nome: 'Reiki', icone: Sparkles },
  { id: 'Vídeo Aulas', nome: 'Vídeo Aulas', icone: Play },
  { id: 'Áudios Terapêuticos', nome: 'Áudios Terapêuticos', icone: Headphones },
  { id: 'Frequências', nome: 'Frequências', icone: Activity },
];

// Componente do Visualizador de PDF
interface PDFViewerProps {
  material: Material;
  onClose: () => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ material, onClose }) => {
  const [zoom, setZoom] = useState(100);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas] = useState(100); // Placeholder para futura implementação
  const [modoTelaCheia, setModoTelaCheia] = useState(false);
  const [rotacao, setRotacao] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 300));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const handleRotate = () => setRotacao(prev => (prev + 90) % 360);
  const handleReset = () => { setZoom(100); setRotacao(0); };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = material.url;
    link.download = `${material.titulo}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.print();
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: material.titulo,
          text: material.descricao,
          url: material.url
        });
      } catch (err) {
        // Usuário cancelou
      }
    } else {
      navigator.clipboard.writeText(material.url);
      alert('Link copiado para a área de transferência!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex flex-col ${modoTelaCheia ? '' : 'p-4'}`}
      onClick={onClose}
    >
      {/* Header do PDF Viewer */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-slate-900 border-b border-white/10 flex items-center justify-between p-3"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Info do documento */}
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-red-400" />
          <div>
            <h3 className="text-white font-medium text-sm truncate max-w-[300px]">{material.titulo}</h3>
            <p className="text-white/50 text-xs">{material.autor}</p>
          </div>
        </div>

        {/* Controles de navegação */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-lg hover:bg-white/10 text-white/70"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-white/60 text-sm w-14 text-center">{zoom}%</span>
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-lg hover:bg-white/10 text-white/70"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-white/20 mx-2" />
          <button
            onClick={handleRotate}
            className="p-2 rounded-lg hover:bg-white/10 text-white/70"
            title="Rotacionar"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 rounded-lg hover:bg-white/10 text-white/70"
            title="Resetar zoom"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-white/20 mx-2" />
          <button
            onClick={handleDownload}
            className="p-2 rounded-lg hover:bg-white/10 text-white/70"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={handlePrint}
            className="p-2 rounded-lg hover:bg-white/10 text-white/70"
            title="Imprimir"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-lg hover:bg-white/10 text-white/70"
            title="Compartilhar"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setModoTelaCheia(!modoTelaCheia)}
            className="p-2 rounded-lg hover:bg-white/10 text-white/70"
            title={modoTelaCheia ? 'Sair tela cheia' : 'Tela cheia'}
          >
            {modoTelaCheia ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <div className="w-px h-6 bg-white/20 mx-2" />
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-red-500/20 text-white/70 hover:text-red-400"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </motion.div>

      {/* Área do PDF */}
      <div 
        className="flex-1 bg-slate-800 overflow-auto flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          ref={iframeRef}
          src={material.url}
          className="w-full h-full"
          style={{
            transform: `scale(${zoom / 100}) rotate(${rotacao}deg)`,
            transformOrigin: 'center center',
          }}
          title={material.titulo}
        />
      </div>

      {/* Footer com info */}
      <div 
        className="bg-slate-900 border-t border-white/10 p-2 flex items-center justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-4 text-white/50 text-xs">
          <span>Página {paginaAtual} de {totalPaginas}</span>
          <span>|</span>
          <span>Zoom: {zoom}%</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPaginaAtual(prev => Math.max(1, prev - 1))}
            className="p-1.5 rounded hover:bg-white/10 text-white/50"
            disabled={paginaAtual <= 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPaginaAtual(prev => Math.min(totalPaginas, prev + 1))}
            className="p-1.5 rounded hover:bg-white/10 text-white/50"
            disabled={paginaAtual >= totalPaginas}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export const KnowledgeHubApp: React.FC = () => {
  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('todos');
  const [materialSelecionado, setMaterialSelecionado] = useState<Material | null>(null);
  const [favoritos, setFavoritos] = useState<string[]>(() => {
    const saved = localStorage.getItem('auris-favoritos');
    return saved ? JSON.parse(saved) : [];
  });
  const [mostrarFavoritos, setMostrarFavoritos] = useState(false);

  // Salvar favoritos no localStorage
  React.useEffect(() => {
    localStorage.setItem('auris-favoritos', JSON.stringify(favoritos));
  }, [favoritos]);

  const materiaisFiltrados = materiaisBiblioteca.filter((m) => {
    const matchBusca = 
      m.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      m.descricao.toLowerCase().includes(busca.toLowerCase()) ||
      m.tags.some(tag => tag.toLowerCase().includes(busca.toLowerCase()));
    const matchCategoria = categoriaAtiva === 'todos' || m.categoria === categoriaAtiva;
    const matchFavoritos = !mostrarFavoritos || favoritos.includes(m.id);
    return matchBusca && matchCategoria && matchFavoritos;
  });

  const toggleFavorito = (id: string) => {
    setFavoritos(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const getIconeTipo = (tipo: string) => {
    switch (tipo) {
      case 'pdf': return <FileText className="w-5 h-5 text-red-400" />;
      case 'video': return <Play className="w-5 h-5 text-blue-400" />;
      case 'audio': return <Headphones className="w-5 h-5 text-green-400" />;
      default: return <BookOpen className="w-5 h-5 text-amber-400" />;
    }
  };

  const abrirMaterial = (material: Material) => {
    if (material.tipo === 'pdf') {
      setMaterialSelecionado(material);
    } else {
      window.open(material.url, '_blank');
    }
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-72 border-r border-white/10 flex flex-col bg-slate-900/50">
        <div className="p-4 border-b border-white/10">
          <h2 className="text-lg font-medium text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-auris-amber" />
            Biblioteca
          </h2>
        </div>

        {/* Busca */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Buscar materiais..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="input-glass pl-10 w-full"
            />
          </div>
        </div>

        {/* Filtro favoritos */}
        <div className="px-4 pb-2">
          <button
            onClick={() => setMostrarFavoritos(!mostrarFavoritos)}
            className={`w-full p-2 rounded-lg flex items-center gap-2 transition-all ${
              mostrarFavoritos ? 'bg-auris-amber/20 text-auris-amber' : 'text-white/60 hover:bg-white/5'
            }`}
          >
            <Star className="w-4 h-4" fill={mostrarFavoritos ? '#f59e0b' : 'none'} />
            <span className="text-sm">Meus Favoritos</span>
            <span className="ml-auto text-xs bg-white/10 px-2 py-0.5 rounded-full">
              {favoritos.length}
            </span>
          </button>
        </div>

        {/* Categorias */}
        <div className="flex-1 overflow-auto scrollbar-thin p-2">
          {categorias.map((cat) => {
            const Icone = cat.icone;
            const count = cat.id === 'todos' 
              ? materiaisBiblioteca.length 
              : materiaisBiblioteca.filter(m => m.categoria === cat.id).length;
            
            return (
              <button
                key={cat.id}
                onClick={() => setCategoriaAtiva(cat.id)}
                className={`w-full p-2 rounded-lg flex items-center gap-3 transition-all mb-1 ${
                  categoriaAtiva === cat.id 
                    ? 'bg-white/10 text-white' 
                    : 'text-white/60 hover:bg-white/5'
                }`}
              >
                <Icone className="w-4 h-4" />
                <span className="text-sm flex-1 text-left">{cat.nome}</span>
                <span className="text-xs text-white/40">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-white font-medium">
              {categoriaAtiva === 'todos' ? 'Todos os Materiais' : categoriaAtiva}
            </h3>
            <p className="text-white/50 text-sm">
              {materiaisFiltrados.length} {materiaisFiltrados.length === 1 ? 'material' : 'materiais'}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-auto scrollbar-thin p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {materiaisFiltrados.map((material) => (
              <motion.div
                key={material.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all group cursor-pointer"
                onClick={() => abrirMaterial(material)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                      {getIconeTipo(material.tipo)}
                    </div>
                    <div>
                      <span className="text-xs text-white/40 uppercase tracking-wider">
                        {material.tipo.toUpperCase()}
                      </span>
                      <p className="text-white font-medium line-clamp-1">{material.titulo}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorito(material.id);
                    }}
                    className="p-1.5 rounded-lg hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Star 
                      className="w-4 h-4" 
                      fill={favoritos.includes(material.id) ? '#f59e0b' : 'none'}
                      color={favoritos.includes(material.id) ? '#f59e0b' : 'currentColor'}
                    />
                  </button>
                </div>

                <p className="text-white/60 text-sm line-clamp-2 mb-3">
                  {material.descricao}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {material.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 bg-white/5 rounded-full text-white/50">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-auris-sage transition-colors" />
                </div>

                {material.autor && (
                  <p className="text-white/40 text-xs mt-2">{material.autor}</p>
                )}
              </motion.div>
            ))}
          </div>

          {materiaisFiltrados.length === 0 && (
            <div className="text-center py-12 text-white/40">
              <BookOpen className="w-16 h-16 mx-auto mb-4" />
              <p>Nenhum material encontrado</p>
              <p className="text-sm">Tente ajustar seus filtros</p>
            </div>
          )}
        </div>
      </div>

      {/* PDF Viewer */}
      <AnimatePresence>
        {materialSelecionado && materialSelecionado.tipo === 'pdf' && (
          <PDFViewer 
            material={materialSelecionado} 
            onClose={() => setMaterialSelecionado(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};
