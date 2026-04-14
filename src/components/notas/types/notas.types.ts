/**
 * 📝 Notas Types
 * Tipagens para o sistema de notas do Auris OS
 */

/** Cor/tag de uma nota */
export type NotaCor = 
  | 'default' 
  | 'red' 
  | 'orange' 
  | 'yellow' 
  | 'green' 
  | 'teal' 
  | 'blue' 
  | 'purple' 
  | 'pink';

/** Nota individual */
export interface Nota {
  id: string;
  titulo: string;
  conteudo: string;
  cor: NotaCor;
  favorito: boolean;
  arquivada: boolean;
  fixada: boolean;
  tags: string[];
  
  // Timestamps
  createdAt: string; // ISO
  updatedAt: string; // ISO
  
  // Metadados opcionais
  pacienteId?: string; // Link para paciente
  sessaoId?: string;   // Link para sessão
}

/** Filtros de visualização */
export type NotaFiltro = 
  | 'todas' 
  | 'favoritas' 
  | 'arquivadas' 
  | 'paciente';

/** Ordenação */
export type NotaOrdenacao = 
  | 'updatedDesc'   // Últimas atualizadas primeiro
  | 'updatedAsc'    // Últimas atualizadas por último
  | 'createdDesc'   // Criadas recentemente primeiro
  | 'createdAsc'    // Criadas antigamente primeiro
  | 'tituloAsc'     // A-Z
  | 'tituloDesc';   // Z-A

/** Estado do editor */
export interface EditorState {
  notaId: string | null;
  titulo: string;
  conteudo: string;
  cor: NotaCor;
  tags: string[];
  dirty: boolean; // Tem alterações não salvas
  saving: boolean;
  lastSaved: string | null;
}

/** Estatísticas de notas */
export interface NotasStats {
  total: number;
  favoritas: number;
  arquivadas: number;
  porCor: Record<NotaCor, number>;
  porTag: Record<string, number>;
}

/** Configurações do app */
export interface NotasConfig {
  viewMode: 'grid' | 'list';
  filtro: NotaFiltro;
  ordenacao: NotaOrdenacao;
  tagSelecionada: string | null;
  busca: string;
}

/** Props para componente NotaCard */
export interface NotaCardProps {
  nota: Nota;
  selecionada: boolean;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFavorito: () => void;
  onToggleArquivar: () => void;
}

/** Props para componente NotaEditor */
export interface NotaEditorProps {
  nota: Nota | null;
  onSave: (nota: Partial<Nota>) => void;
  onClose: () => void;
}

/** Props para lista de notas */
export interface NotaListaProps {
  notas: Nota[];
  notaSelecionadaId: string | null;
  onSelecionar: (id: string) => void;
  onEditar: (id: string) => void;
  onExcluir: (id: string) => void;
  onToggleFavorito: (id: string) => void;
  onToggleArquivar: (id: string) => void;
}

/** Configuração de cor */
export interface CorConfig {
  id: NotaCor;
  nome: string;
  bg: string;
  border: string;
  text: string;
  indicator: string;
}
