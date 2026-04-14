/**
 * 🐛 BugTracker Module
 * Sistema de detecção de bugs visual
 */

export { BugTrackerOverlay } from './BugTrackerOverlay';
export { BugReportModal } from './BugReportModal';
export { BugChatInterface } from './BugChatInterface';
export { InspectorTooltip } from './InspectorTooltip';
export { ElementHighlighter } from './ElementHighlighter';

// 🧠 Intelligence System
export {
  BugIntelligenceEngine,
  getBugIntelligenceEngine,
  NLPProcessor,
  processNLP,
  BugReportOrchestrator,
  ReportGenerator,
} from './intelligence';

export { useElementInspector } from './hooks/useElementInspector';
export { useScreenshot } from './hooks/useScreenshot';

export type {
  InspectedElement,
  BugReport,
  CreateBugReportData,
  ReportType,
  SeverityLevel,
  ReportStatus,
  BugStats,
} from './types/bugTracker.types';

export {
  reportToMarkdown,
  generateSummaryMarkdown,
  generateReportFileName,
  getSeverityEmoji,
  getTypeEmoji,
  getStatusEmoji,
} from './utils/bugFormatter';

export {
  inspectElement,
  findElementAtPosition,
  generateUniqueSelector,
  generateXPath,
} from './utils/elementInspector';
