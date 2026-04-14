/**
 * 🛡️ URL Validator
 * Validação e sanitização de URLs para o navegador embutido
 */

import type { SecurityConfig } from '../types/browser.types';

/** Configuração padrão de segurança */
export const defaultSecurityConfig: SecurityConfig = {
  blockedUrls: [
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
    'file://',
    'ftp://',
    'chrome://',
    'about:',
    'javascript:',
  ],
  allowedUrls: [],
  httpsOnly: false,
  blockPopups: true,
};

/** Verifica se URL é válida e segura */
export function validateUrl(url: string, config: SecurityConfig = defaultSecurityConfig): {
  valid: boolean;
  error?: string;
  sanitizedUrl?: string;
} {
  // Verificar se é vazio
  if (!url || url.trim() === '') {
    return { valid: false, error: 'URL vazia' };
  }

  let sanitizedUrl = url.trim();

  // Adicionar https:// se não tiver protocolo
  if (!/^https?:\/\//i.test(sanitizedUrl)) {
    if (sanitizedUrl.includes('.')) {
      sanitizedUrl = 'https://' + sanitizedUrl;
    } else {
      // É uma busca, não uma URL
      return { valid: false, error: 'SEARCH_QUERY', sanitizedUrl: `https://www.google.com/search?q=${encodeURIComponent(sanitizedUrl)}` };
    }
  }

  // Parsear URL
  let parsed: URL;
  try {
    parsed = new URL(sanitizedUrl);
  } catch {
    return { valid: false, error: 'URL inválida' };
  }

  // Verificar HTTPS only
  if (config.httpsOnly && parsed.protocol !== 'https:') {
    return { valid: false, error: 'Apenas HTTPS permitido' };
  }

  // Verificar URLs bloqueadas
  const isBlocked = config.blockedUrls.some(blocked => 
    parsed.hostname.includes(blocked) || 
    sanitizedUrl.toLowerCase().includes(blocked.toLowerCase())
  );
  
  if (isBlocked) {
    return { valid: false, error: 'URL bloqueada por segurança' };
  }

  // Verificar whitelist (se definida)
  if (config.allowedUrls.length > 0) {
    const isAllowed = config.allowedUrls.some(allowed => 
      parsed.hostname.includes(allowed)
    );
    if (!isAllowed) {
      return { valid: false, error: 'URL não está na lista permitida' };
    }
  }

  return { valid: true, sanitizedUrl };
}

/** Extrai domínio da URL */
export function extractDomain(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

/** Extrai favicon de uma URL */
export function getFaviconUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${parsed.hostname}&sz=32`;
  } catch {
    return '';
  }
}

/** Formata URL para exibição */
export function formatUrlForDisplay(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

/** Verifica se é uma URL de busca */
export function isSearchQuery(input: string): boolean {
  // Se não tem protocolo e não parece um domínio
  return !/^https?:\/\//i.test(input) && 
         !/^www\./i.test(input) && 
         !input.includes('.') ||
         input.includes(' ');
}

/** Gera URL de busca */
export function generateSearchUrl(query: string, engine: 'google' | 'duckduckgo' = 'google'): string {
  const encoded = encodeURIComponent(query);
  if (engine === 'duckduckgo') {
    return `https://duckduckgo.com/?q=${encoded}`;
  }
  return `https://www.google.com/search?q=${encoded}`;
}

/** Sugestões de URLs comuns para terapeutas */
export const suggestedUrls = {
  // Cursos e Educação
  cursos: [
    { url: 'https://www.youtube.com', title: 'YouTube', icon: '📺' },
    { url: 'https://www.udemy.com', title: 'Udemy', icon: '🎓' },
    { url: 'https://www.coursera.org', title: 'Coursera', icon: '📚' },
  ],
  // Pesquisa Médica
  medical: [
    { url: 'https://pubmed.ncbi.nlm.nih.gov', title: 'PubMed', icon: '🔬' },
    { url: 'https://www.ncbi.nlm.nih.gov', title: 'NCBI', icon: '🧬' },
    { url: 'https://www.who.int', title: 'OMS', icon: '🏥' },
  ],
  // Auriculoterapia
  auriculoterapia: [
    { url: 'https://www.auriculoterapia.com.br', title: 'Auriculoterapia BR', icon: '👂' },
  ],
  // Gerais
  geral: [
    { url: 'https://www.google.com', title: 'Google', icon: '🔍' },
    { url: 'https://translate.google.com', title: 'Tradutor', icon: '🌐' },
  ],
};

/** Lista de bookmarks padrão para novos usuários */
export const defaultBookmarks = [
  {
    id: 'bm-1',
    url: 'https://www.youtube.com',
    title: 'YouTube',
    category: 'Educação',
    createdAt: Date.now(),
  },
  {
    id: 'bm-2',
    url: 'https://www.google.com',
    title: 'Google',
    category: 'Ferramentas',
    createdAt: Date.now(),
  },
  {
    id: 'bm-3',
    url: 'https://translate.google.com',
    title: 'Google Tradutor',
    category: 'Ferramentas',
    createdAt: Date.now(),
  },
  {
    id: 'bm-4',
    url: 'https://pubmed.ncbi.nlm.nih.gov',
    title: 'PubMed',
    category: 'Pesquisa',
    createdAt: Date.now(),
  },
];
