// ============================================================================
// FUNÇÕES UTILITÁRIAS DE FORMATAÇÃO
// ============================================================================

/**
 * Formata um valor numérico como moeda brasileira (BRL)
 * @param valor - Valor numérico a ser formatado
 * @param opcoes - Opções adicionais de formatação
 * @returns String formatada (ex: "R$ 1.234,56")
 * 
 * @example
 * formatCurrency(1234.56) // "R$ 1.234,56"
 * formatCurrency(100) // "R$ 100,00"
 * formatCurrency(0) // "R$ 0,00"
 */
export function formatCurrency(valor: number | string | undefined | null, opcoes?: {
  minFractionDigits?: number;
  maxFractionDigits?: number;
  showSymbol?: boolean;
}): string {
  const {
    minFractionDigits = 2,
    maxFractionDigits = 2,
    showSymbol = true
  } = opcoes || {};

  const numValor = typeof valor === 'string' ? parseFloat(valor) : valor;

  if (numValor === undefined || numValor === null || isNaN(numValor)) {
    return showSymbol ? 'R$ --' : '--';
  }

  return new Intl.NumberFormat('pt-BR', {
    style: showSymbol ? 'currency' : 'decimal',
    currency: 'BRL',
    minimumFractionDigits: minFractionDigits,
    maximumFractionDigits: maxFractionDigits,
  }).format(numValor);
}

/**
 * Formata uma data para exibição
 * @param data - Date, string ISO ou timestamp
 * @param formato - Estilo de formatação
 * @returns String formatada
 * 
 * @example
 * formatDate(new Date()) // "07/04/2026"
 * formatDate(new Date(), 'long') // "7 de abril de 2026"
 * formatDate(new Date(), 'time') // "14:30"
 * formatDate(new Date(), 'datetime') // "07/04/2026 14:30"
 */
export function formatDate(
  data: Date | string | number | undefined | null,
  formato: 'short' | 'long' | 'time' | 'datetime' | 'relative' = 'short'
): string {
  if (!data) return '--/--/----';

  const date = data instanceof Date ? data : new Date(data);

  if (isNaN(date.getTime())) {
    return '--/--/----';
  }

  switch (formato) {
    case 'short':
      return date.toLocaleDateString('pt-BR');

    case 'long':
      return date.toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

    case 'time':
      return date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });

    case 'datetime':
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

    case 'relative':
      return formatRelativeDate(date);

    default:
      return date.toLocaleDateString('pt-BR');
  }
}

/**
 * Formata uma data de forma relativa (hoje, ontem, etc.)
 * @param data - Data a ser formatada
 * @returns String relativa
 */
function formatRelativeDate(data: Date): string {
  const hoje = new Date();
  const ontem = new Date(hoje);
  ontem.setDate(ontem.getDate() - 1);

  const dataStr = data.toDateString();
  const hojeStr = hoje.toDateString();
  const ontemStr = ontem.toDateString();

  if (dataStr === hojeStr) {
    return `Hoje, ${data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  }

  if (dataStr === ontemStr) {
    return 'Ontem';
  }

  const diffDias = Math.floor((hoje.getTime() - data.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDias < 7) {
    return data.toLocaleDateString('pt-BR', { weekday: 'long' });
  }

  return data.toLocaleDateString('pt-BR');
}

/**
 * Formata um número de telefone brasileiro
 * @param telefone - Número de telefone (somente dígitos)
 * @returns String formatada
 * 
 * @example
 * formatPhone('11999999999') // "(11) 99999-9999"
 * formatPhone('1133334444') // "(11) 3333-4444"
 */
export function formatPhone(telefone: string | undefined | null): string {
  if (!telefone) return '';

  const nums = telefone.replace(/\D/g, '');

  if (nums.length === 11) {
    return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7)}`;
  }

  if (nums.length === 10) {
    return `(${nums.slice(0, 2)}) ${nums.slice(2, 6)}-${nums.slice(6)}`;
  }

  return telefone;
}

/**
 * Formata um CPF
 * @param cpf - CPF (somente dígitos)
 * @returns String formatada
 * 
 * @example
 * formatCPF('12345678901') // "123.456.789-01"
 */
export function formatCPF(cpf: string | undefined | null): string {
  if (!cpf) return '';

  const nums = cpf.replace(/\D/g, '');

  if (nums.length !== 11) return cpf;

  return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6, 9)}-${nums.slice(9)}`;
}

/**
 * Formata um CEP
 * @param cep - CEP (somente dígitos)
 * @returns String formatada
 * 
 * @example
 * formatCEP('12345678') // "12345-678"
 */
export function formatCEP(cep: string | undefined | null): string {
  if (!cep) return '';

  const nums = cep.replace(/\D/g, '');

  if (nums.length !== 8) return cep;

  return `${nums.slice(0, 5)}-${nums.slice(5)}`;
}

/**
 * Limita um texto a um número máximo de caracteres
 * @param texto - Texto a ser limitado
 * @param maxLength - Número máximo de caracteres
 * @param suffix - Sufixo a ser adicionado (padrão: '...')
 * @returns Texto limitado
 */
export function truncateText(texto: string | undefined | null, maxLength: number, suffix = '...'): string {
  if (!texto) return '';
  if (texto.length <= maxLength) return texto;
  return texto.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Formata um número para exibição
 * @param numero - Número a ser formatado
 * @param decimais - Número de casas decimais
 * @returns String formatada
 * 
 * @example
 * formatNumber(1234.5) // "1.234,50"
 * formatNumber(0.5, 1) // "0,5"
 */
export function formatNumber(numero: number | undefined | null, decimais = 2): string {
  if (numero === undefined || numero === null || isNaN(numero)) {
    return '--';
  }

  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimais,
    maximumFractionDigits: decimais,
  }).format(numero);
}
