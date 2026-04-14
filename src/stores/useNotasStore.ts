/**
 * 📝 Notas Store
 * Gerenciamento de estado das notas com Zustand
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Nota, NotaFiltro, NotaOrdenacao, NotasStats, NotasConfig } from '@/components/notas/types/notas.types';
import { calcularEstatisticas, gerarTituloPadrao } from '@/components/notas/utils/formatters';

interface NotasState {
  // Dados
  notas: Nota[];
  notaSelecionadaId: string | null;
  editorAberto: boolean;
  
  // Configurações
  config: NotasConfig;
  
  // Computed (não persistidos)
  notasFiltradas: Nota[];
  estatisticas: NotasStats;
  
  // Ações
  criarNota: (dados?: Partial<Nota>) => string;
  atualizarNota: (id: string, dados: Partial<Nota>) => void;
  excluirNota: (id: string) => void;
  selecionarNota: (id: string | null) => void;
  
  // Toggles
  toggleFavorito: (id: string) => void;
  toggleArquivar: (id: string) => void;
  toggleFixar: (id: string) => void;
  
  // Editor
  abrirEditor: (notaId?: string) => void;
  fecharEditor: () => void;
  
  // Config
  setFiltro: (filtro: NotaFiltro) => void;
  setOrdenacao: (ordenacao: NotaOrdenacao) => void;
  setTagSelecionada: (tag: string | null) => void;
  setBusca: (busca: string) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  
  // Utils
  duplicarNota: (id: string) => string;
  exportarNota: (id: string) => string;
}

/** Gera ID único */
function generateId(): string {
  return `nota-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/** Nota vazia padrão */
function createNotaVazia(): Nota {
  const agora = new Date().toISOString();
  return {
    id: generateId(),
    titulo: gerarTituloPadrao(),
    conteudo: '',
    cor: 'default',
    favorito: false,
    arquivada: false,
    fixada: false,
    tags: [],
    createdAt: agora,
    updatedAt: agora,
  };
}

export const useNotasStore = create<NotasState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      notas: [],
      notaSelecionadaId: null,
      editorAberto: false,
      config: {
        viewMode: 'grid',
        filtro: 'todas',
        ordenacao: 'updatedDesc',
        tagSelecionada: null,
        busca: '',
      },
      
      // Computed (calculados dinamicamente)
      get notasFiltradas() {
        const { notas, config } = get();
        let resultado = [...notas];
        
        // Filtro por tipo
        switch (config.filtro) {
          case 'favoritas':
            resultado = resultado.filter(n => n.favorito);
            break;
          case 'arquivadas':
            resultado = resultado.filter(n => n.arquivada);
            break;
          case 'paciente':
            resultado = resultado.filter(n => n.pacienteId);
            break;
          default:
            // 'todas' - exclui arquivadas por padrão
            resultado = resultado.filter(n => !n.arquivada);
        }
        
        // Filtro por tag
        if (config.tagSelecionada) {
          resultado = resultado.filter(n => 
            n.tags.includes(config.tagSelecionada!)
          );
        }
        
        // Busca textual
        if (config.busca.trim()) {
          const termo = config.busca.toLowerCase();
          resultado = resultado.filter(n =>
            n.titulo.toLowerCase().includes(termo) ||
            n.conteudo.toLowerCase().includes(termo) ||
            n.tags.some(t => t.toLowerCase().includes(termo))
          );
        }
        
        // Ordenação
        resultado.sort((a, b) => {
          switch (config.ordenacao) {
            case 'updatedDesc':
              return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
            case 'updatedAsc':
              return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
            case 'createdDesc':
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case 'createdAsc':
              return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            case 'tituloAsc':
              return a.titulo.localeCompare(b.titulo);
            case 'tituloDesc':
              return b.titulo.localeCompare(a.titulo);
            default:
              return 0;
          }
        });
        
        // Fixadas sempre primeiro
        resultado.sort((a, b) => (b.fixada ? 1 : 0) - (a.fixada ? 1 : 0));
        
        return resultado;
      },
      
      get estatisticas() {
        return calcularEstatisticas(get().notas);
      },
      
      // Ações
      criarNota: (dados = {}) => {
        const novaNota: Nota = {
          ...createNotaVazia(),
          ...dados,
          id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set(state => ({
          notas: [novaNota, ...state.notas],
          notaSelecionadaId: novaNota.id,
        }));
        
        return novaNota.id;
      },
      
      atualizarNota: (id, dados) => {
        set(state => ({
          notas: state.notas.map(nota =>
            nota.id === id
              ? { ...nota, ...dados, updatedAt: new Date().toISOString() }
              : nota
          ),
        }));
      },
      
      excluirNota: (id) => {
        set(state => ({
          notas: state.notas.filter(n => n.id !== id),
          notaSelecionadaId: state.notaSelecionadaId === id ? null : state.notaSelecionadaId,
        }));
      },
      
      selecionarNota: (id) => {
        set({ notaSelecionadaId: id });
      },
      
      toggleFavorito: (id) => {
        const nota = get().notas.find(n => n.id === id);
        if (nota) {
          get().atualizarNota(id, { favorito: !nota.favorito });
        }
      },
      
      toggleArquivar: (id) => {
        const nota = get().notas.find(n => n.id === id);
        if (nota) {
          get().atualizarNota(id, { 
            arquivada: !nota.arquivada,
            fixada: nota.arquivada ? nota.fixada : false, // Desfixar ao arquivar
          });
        }
      },
      
      toggleFixar: (id) => {
        const nota = get().notas.find(n => n.id === id);
        if (nota && !nota.arquivada) { // Só fixa se não estiver arquivada
          get().atualizarNota(id, { fixada: !nota.fixada });
        }
      },
      
      abrirEditor: (notaId) => {
        set({ 
          editorAberto: true,
          notaSelecionadaId: notaId || null,
        });
      },
      
      fecharEditor: () => {
        set({ editorAberto: false });
      },
      
      setFiltro: (filtro) => {
        set(state => ({
          config: { ...state.config, filtro, tagSelecionada: null },
        }));
      },
      
      setOrdenacao: (ordenacao) => {
        set(state => ({
          config: { ...state.config, ordenacao },
        }));
      },
      
      setTagSelecionada: (tag) => {
        set(state => ({
          config: { ...state.config, tagSelecionada: tag },
        }));
      },
      
      setBusca: (busca) => {
        set(state => ({
          config: { ...state.config, busca },
        }));
      },
      
      setViewMode: (mode) => {
        set(state => ({
          config: { ...state.config, viewMode: mode },
        }));
      },
      
      duplicarNota: (id) => {
        const nota = get().notas.find(n => n.id === id);
        if (!nota) return '';
        
        const notaCopia: Partial<Nota> = {
          titulo: `${nota.titulo} (Cópia)`,
          conteudo: nota.conteudo,
          cor: nota.cor,
          tags: [...nota.tags],
          pacienteId: nota.pacienteId,
          sessaoId: nota.sessaoId,
        };
        
        return get().criarNota(notaCopia);
      },
      
      exportarNota: (id) => {
        const nota = get().notas.find(n => n.id === id);
        if (!nota) return '';
        
        const conteudo = `# ${nota.titulo}\n\n${nota.conteudo}\n\n---\nTags: ${nota.tags.join(', ')}\nCriada em: ${new Date(nota.createdAt).toLocaleString('pt-BR')}\nAtualizada em: ${new Date(nota.updatedAt).toLocaleString('pt-BR')}`;
        
        return conteudo;
      },
    }),
    {
      name: 'auris-notas-storage',
      partialize: (state) => ({
        notas: state.notas,
        config: state.config,
      }),
    }
  )
);
