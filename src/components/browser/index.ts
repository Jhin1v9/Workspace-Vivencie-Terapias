/**
 * 🌐 Browser Module
 * Navegador embutido do Auris OS
 */

export { BrowserFrame } from './BrowserFrame';
export { BrowserToolbar } from './BrowserToolbar';
export { BrowserTabs } from './BrowserTabs';
export { BrowserViewport } from './BrowserViewport';

export { useBrowserTabs, useBrowserHistory, useBrowserSecurity, useRenderStrategy } from './hooks';

export type {
  BrowserTab,
  HistoryEntry,
  Bookmark,
  BrowserState,
  BrowserActions,
  SecurityConfig,
  BrowserFrameProps,
  BrowserToolbarProps,
  BrowserTabsProps,
  BrowserViewportProps,
  RenderStrategy,
} from './types/browser.types';

export {
  validateUrl,
  extractDomain,
  getFaviconUrl,
  formatUrlForDisplay,
  isSearchQuery,
  generateSearchUrl,
  suggestedUrls,
  defaultBookmarks,
} from './utils/urlValidator';
