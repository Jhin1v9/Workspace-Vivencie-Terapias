/**
 * 🛡️ useBrowserSecurity Hook
 * Validações de segurança para o navegador
 */

import { useCallback, useMemo } from 'react';
import type { SecurityConfig } from '../types/browser.types';
import { validateUrl, defaultSecurityConfig, isSearchQuery, generateSearchUrl } from '../utils/urlValidator';

export function useBrowserSecurity(config: Partial<SecurityConfig> = {}) {
  const securityConfig = useMemo<SecurityConfig>(
    () => ({
      ...defaultSecurityConfig,
      ...config,
    }),
    [config]
  );

  /** Valida URL antes de navegar */
  const validateNavigation = useCallback(
    (url: string): { allowed: boolean; url: string; error?: string } => {
      // Se for busca, gerar URL de busca
      if (isSearchQuery(url)) {
        const searchUrl = generateSearchUrl(url);
        return { allowed: true, url: searchUrl };
      }

      const result = validateUrl(url, securityConfig);

      if (result.valid && result.sanitizedUrl) {
        return { allowed: true, url: result.sanitizedUrl };
      }

      // Se for erro de busca, tratar
      if (result.error === 'SEARCH_QUERY' && result.sanitizedUrl) {
        return { allowed: true, url: result.sanitizedUrl };
      }

      return {
        allowed: false,
        url,
        error: result.error || 'URL inválida',
      };
    },
    [securityConfig]
  );

  /** Verifica se popup deve ser bloqueado */
  const shouldBlockPopup = useCallback(
    (url: string): boolean => {
      if (!securityConfig.blockPopups) return false;
      
      const blockedDomains = ['ads', 'popup', 'click', 'tracker'];
      const lowerUrl = url.toLowerCase();
      
      return blockedDomains.some(domain => lowerUrl.includes(domain));
    },
    [securityConfig.blockPopups]
  );

  /** Gera sandbox attributes para iframe */
  const getSandboxAttributes = useCallback((): string => {
    // Permitir scripts e mesma origem, mas bloquear popups e formulários perigosos
    return 'allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms allow-downloads';
  }, []);

  /** Gera allow attributes para iframe */
  const getAllowAttributes = useCallback((): string => {
    // Permissões necessárias para YouTube e outros sites
    return 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen';
  }, []);

  /** Verifica se site é confiável (para features adicionais) */
  const isTrustedSite = useCallback((url: string): boolean => {
    const trustedDomains = [
      'youtube.com',
      'youtu.be',
      'google.com',
      'pubmed.ncbi.nlm.nih.gov',
      'udemy.com',
      'coursera.org',
      'wikipedia.org',
    ];
    
    try {
      const parsed = new URL(url);
      return trustedDomains.some(domain => parsed.hostname.includes(domain));
    } catch {
      return false;
    }
  }, []);

  return {
    validateNavigation,
    shouldBlockPopup,
    getSandboxAttributes,
    getAllowAttributes,
    isTrustedSite,
    securityConfig,
  };
}
