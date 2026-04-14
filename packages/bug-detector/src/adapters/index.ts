/**
 * Adapters - Framework integrations
 */

// React
export { 
  useBugDetector, 
  useBugDetectorAdvanced,
  BugDetectorProvider,
  BugDetectorFloatingButton 
} from './react';

// Vue
export { 
  createBugDetector, 
  useBugDetector as useBugDetectorVue 
} from './vue';

// Vanilla JS
export { 
  BugDetectorAPI,
  initBugDetector,
  getBugDetector,
  destroyBugDetector,
  activate,
  deactivate,
  toggle,
  inspect,
  report,
  getReports,
  exportReport,
  createFloatingButton,
  autoInit,
  extendElements
} from './vanilla';

// Angular (placeholder - implementar quando necessário)
// export { BugDetectorModule, BugDetectorService } from './angular';
