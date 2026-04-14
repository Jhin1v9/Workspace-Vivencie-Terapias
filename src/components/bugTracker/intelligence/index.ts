/**
 * 🧠 Bug Intelligence System
 * Sistema de raciocínio multi-personalidade para análise de bugs
 */

// Core Engine
export { BugIntelligenceEngine, getBugIntelligenceEngine } from './BugIntelligenceEngine';
export { NLPProcessor, processNLP } from './NLPProcessor';
export { BugReportOrchestrator } from './orchestrator/BugReportOrchestrator';
export { ReportGenerator } from './output/ReportGenerator';

// Personalities
export { BasePersonalityAnalyzer } from './personalities/BasePersonalityAnalyzer';
export { ArquitetoAnalyzer } from './personalities/ArquitetoAnalyzer';
export { UIUXAnalyzer } from './personalities/UIUXAnalyzer';
export { ReactAnalyzer } from './personalities/ReactAnalyzer';

// Types
export type {
  BugIntelligenceInput,
  NLPResult,
  PersonalityAnalysis,
  ConsolidatedDiagnosis,
  BugIntelligenceReport,
  ChatMessage,
  ChatSession,
  IntelligenceStatus,
  PersonalityType,
  BugCategory,
  BugSeverity,
} from '../types/bugIntelligence.types';
