/**
 * 📝 Notas Module
 * Sistema de notas do Auris OS
 */

export { NotasApp } from './NotasApp';
export { NotaCard } from './NotaCard';
export { NotaEditor } from './NotaEditor';
export { NotaSidebar } from './NotaSidebar';

export type {
  Nota,
  NotaCor,
  NotaFiltro,
  NotaOrdenacao,
  NotasStats,
  NotasConfig,
  NotaCardProps,
  NotaEditorProps,
} from './types/notas.types';

export { coresConfig, coresList, getCorConfig, getNotaCardClasses } from './utils/cores';
export {
  gerarPreview,
  formatarDataRelativa,
  formatarDataCompleta,
  extrairTagsUnicas,
  contarTags,
  gerarTituloPadrao,
  calcularEstatisticas,
  validarNota,
} from './utils/formatters';
