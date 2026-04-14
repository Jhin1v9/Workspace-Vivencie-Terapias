/**
 * 🌐 Browser Types
 * Tipagens para o navegador embutido do Auris OS
 */

/** Representa uma aba do navegador */
export interface BrowserTab {
  id: string;
  url: string;
  title: string;
  favicon?: string;
  isLoading: boolean;
  isActive: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
}

/** Entrada do histórico de navegação */
export interface HistoryEntry {
  url: string;
  title: string;
  timestamp: number;
  favicon?: string;
}

/** Favorito do usuário */
export interface Bookmark {
  id: string;
  url: string;
  title: string;
  favicon?: string;
  category?: string;
  createdAt: number;
}

/** Estado completo do navegador */
export interface BrowserState {
  tabs: BrowserTab[];
  activeTabId: string | null;
  history: HistoryEntry[];
  bookmarks: Bookmark[];
}

/** Ações disponíveis no navegador */
export interface BrowserActions {
  // Abas
  addTab: (url?: string) => string;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  updateTab: (tabId: string, updates: Partial<BrowserTab>) => void;
  
  // Navegação
  navigate: (tabId: string, url: string) => void;
  goBack: (tabId: string) => void;
  goForward: (tabId: string) => void;
  reload: (tabId: string) => void;
  
  // Favoritos
  addBookmark: (url: string, title: string) => void;
  removeBookmark: (id: string) => void;
  
  // Histórico
  addToHistory: (entry: Omit<HistoryEntry, 'timestamp'>) => void;
  clearHistory: () => void;
}

/** Configurações de segurança */
export interface SecurityConfig {
  /** URLs bloqueadas (padrões regex) */
  blockedUrls: string[];
  /** URLs permitidas (whitelist) - se vazio, permite tudo exceto blocked */
  allowedUrls: string[];
  /** Permitir apenas HTTPS */
  httpsOnly: boolean;
  /** Bloquear popups */
  blockPopups: boolean;
}

/** Props do componente BrowserFrame */
export interface BrowserFrameProps {
  /** URL inicial (opcional) */
  initialUrl?: string;
  /** Configuração de segurança */
  security?: Partial<SecurityConfig>;
  /** Callback quando URL muda */
  onUrlChange?: (url: string) => void;
  /** Callback quando título muda */
  onTitleChange?: (title: string) => void;
  /** Classe CSS adicional */
  className?: string;
}

/** Props do Toolbar */
export interface BrowserToolbarProps {
  url: string;
  canGoBack: boolean;
  canGoForward: boolean;
  isLoading: boolean;
  onUrlSubmit: (url: string) => void;
  onBack: () => void;
  onForward: () => void;
  onReload: () => void;
  onHome?: () => void;
}

/** Props das Abas */
export interface BrowserTabsProps {
  tabs: BrowserTab[];
  activeTabId: string | null;
  onTabClick: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onAddTab: () => void;
}

/** Props do Viewport */
export interface BrowserViewportProps {
  tab: BrowserTab;
  onLoad: (tabId: string, title: string, favicon?: string) => void;
  onError: (tabId: string, error: Error) => void;
}

/** Estratégias de renderização do navegador */
export type RenderStrategy =
  | { type: 'iframe'; url: string }
  | { type: 'proxy'; proxyUrl: string; originalUrl: string }
  | { type: 'external'; url: string; reason: string };
