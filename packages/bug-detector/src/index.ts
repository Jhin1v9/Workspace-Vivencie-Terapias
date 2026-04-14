/**
 * @auris/bug-detector
 * Ferramenta profissional de debug com IA para qualquer projeto web
 * 
 * @example
 * ```typescript
 * // React
 * import { useBugDetector } from '@auris/bug-detector/react';
 * 
 * // Vue
 * import { createBugDetector } from '@auris/bug-detector/vue';
 * 
 * // Vanilla JS
 * import { BugDetector } from '@auris/bug-detector';
 * ```
 */

// Core
export { BugDetector } from './core/BugDetector';
export { Inspector } from './core/Inspector';
export { Config, DEFAULT_CONFIG } from './core/Config';

// Types
export type {
  // Config
  BugDetectorConfig,
  AIConfig,
  IntegrationsConfig,
  GitHubConfig,
  JiraConfig,
  SlackConfig,
  WebhookConfig,
  CaptureConfig,
  BugDetectorCallbacks,
  
  // Element
  InspectedElement,
  ParentInfo,
  
  // Report
  BugReport,
  ConsoleLog,
  NetworkRequest,
  PerformanceMetrics,
  CreateReportData,
  
  // AI
  AIAdapter,
  AIAnalysis,
  BugCategory,
  PersonalityAnalysis,
  PersonalityType,
  CodeFix,
  
  // Chat
  ChatMessage,
  ChatSession,
  
  // Storage
  StorageAdapter,
  ReportFilters,
  
  // Export
  ExportOptions,
  ExportResult,
  
  // React
  UseBugDetectorProps,
  UseBugDetectorReturn,
} from './types';

// Intelligence
export { IntelligenceEngine } from './intelligence/IntelligenceEngine';
export { ReportGenerator } from './intelligence/ReportGenerator';

// Capture
export { CaptureManager } from './capture/CaptureManager';

// Storage
export { StorageManager } from './storage/StorageManager';

// Integrations
export { GitHubIntegration } from './integrations/GitHub';
export { JiraIntegration } from './integrations/Jira';
export { SlackIntegration } from './integrations/Slack';

// Utils
export { RateLimiter } from './utils/RateLimiter';

// Version
export const VERSION = '1.0.0';

// Default export
export { BugDetector as default } from './core/BugDetector';
