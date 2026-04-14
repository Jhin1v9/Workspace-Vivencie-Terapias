/**
 * 📝 Formatters para Notas
 * Funções utilitárias de formatação
 */

import type { Nota } from '../types/notas.types';

/** Gera preview do conteúdo (primeiras linhas) */
export function gerarPreview(conteudo: string, maxLength: number = 150): string {
  // Remover markdown básico
  const limpo = conteudo
    .replace(/#{1,6}\s/g, '') // Headers
    .replace(/\*\*|__/g, '') // Bold
    .replace(/\*|_/g, '') // Italic
    .replace(/`{3}[\s\S]*?`{3}/g, '[código]') // Code blocks
    .replace(/`([^`]+)`/g, '$1') // Inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '[imagem]') // Images
    .replace(/>\s/g, '') // Blockquotes
    .replace(/[-*+]\s/g, '') // Lists
    .replace(/\d+\.\s/g, '') // Numbered lists
    .replace(/---/g, '') // Horizontal rules
    .trim();
  
  if (limpo.length <= maxLength) return limpo;
  return limpo.substring(0, maxLength).trim() + '...';
}

/** Formata data relativa */
export function formatarDataRelativa(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSecs < 60) return 'agora';
  if (diffMins < 60) return `há ${diffMins} min`;
  if (diffHours < 24) return `há ${diffHours}h`;
  if (diffDays === 1) return 'ontem';
  if (diffDays < 7) return `há ${diffDays} dias`;
  if (diffDays < 30) return `há ${Math.floor(diffDays / 7)} sem`;
  
  return date.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

/** Formata data completa */
export function formatarDataCompleta(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Extrai todas as tags únicas de um array de notas */
export function extrairTagsUnicas(notas: Nota[]): string[] {
  const todasTags = notas.flatMap(n => n.tags);
  const unicas = [...new Set(todasTags)];
  return unicas.sort((a, b) => a.localeCompare(b));
}

/** Conta ocorrências de cada tag */
export function contarTags(notas: Nota[]): Record<string, number> {
  const contagem: Record<string, number> = {};
  
  notas.forEach(nota => {
    nota.tags.forEach(tag => {
      contagem[tag] = (contagem[tag] || 0) + 1;
    });
  });
  
  return contagem;
}

/** Gera título padrão se vazio */
export function gerarTituloPadrao(): string {
  const agora = new Date();
  return `Nota ${agora.toLocaleDateString('pt-BR')} ${agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
}

/** Destaca termo de busca no texto */
export function destacarTermo(texto: string, termo: string): string {
  if (!termo.trim()) return texto;
  
  const regex = new RegExp(`(${escapeRegExp(termo)})`, 'gi');
  return texto.replace(regex, '<mark class="bg-yellow-500/30 text-yellow-200">$1</mark>');
}

/** Escape regex special characters */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Calcula estatísticas de notas */
export function calcularEstatisticas(notas: Nota[]) {
  const stats = {
    total: notas.length,
    favoritas: notas.filter(n => n.favorito).length,
    arquivadas: notas.filter(n => n.arquivada).length,
    porCor: {} as Record<string, number>,
    porTag: {} as Record<string, number>,
  };
  
  notas.forEach(nota => {
    // Por cor
    stats.porCor[nota.cor] = (stats.porCor[nota.cor] || 0) + 1;
    
    // Por tag
    nota.tags.forEach(tag => {
      stats.porTag[tag] = (stats.porTag[tag] || 0) + 1;
    });
  });
  
  return stats;
}

/** Valida nota antes de salvar */
export function validarNota(nota: Partial<Nota>): { valido: boolean; erros: string[] } {
  const erros: string[] = [];
  
  if (!nota.titulo?.trim()) {
    erros.push('Título é obrigatório');
  }
  
  if (nota.titulo && nota.titulo.length > 200) {
    erros.push('Título muito longo (máx 200 caracteres)');
  }
  
  if (nota.tags && nota.tags.some(tag => tag.length > 30)) {
    erros.push('Tags muito longas (máx 30 caracteres cada)');
  }
  
  return {
    valido: erros.length === 0,
    erros,
  };
}
