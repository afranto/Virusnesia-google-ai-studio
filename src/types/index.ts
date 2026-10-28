export type LearningPhase = 'home' | 'engage' | 'explore' | 'explain' | 'elaborate' | 'evaluate' | 'reflect';

export interface BacteriophagePart {
  id: string;
  name: string;
  scientificTerm: string;
  category: 'head' | 'genome' | 'sheath' | 'baseplate' | 'fibers';
  functionSummary: string;
  detailedDescription: string;
  molecularInsight: string;
  examHighlight: string;
}

export interface InteractiveSvgObject {
  id: string;
  name: string;
  category: 'virus' | 'host' | 'dna' | 'enzyme';
  summary: string;
  scientificRole: string;
}

export interface SimulationStep {
  step: number;
  name: string;
  scientificStage: string;
  title: string;
  durationSec: number;
  description: string;
  keyEvents: string[];
  keyMolecules: string[];
  hostCellFate: string;
  observationPrompt: string;
  guidingQuestion: string;
  defaultObservationHint: string;
  whatChanges: string;
  viralDnaRole: string;
  hostCellEffect: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  context?: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  conceptTested: string;
  difficulty: 'Sedang' | 'Tinggi (HOTS)';
}

export interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  contextText: string;
  dataPoints: { label: string; value: string }[];
  problemQuestion: string;
  scientificGuidance: string;
  modelAnswer: string;
}

export interface GlossaryItem {
  id: string;
  term: string;
  pronunciation?: string;
  definition: string;
  roleInReplication: string;
  relatedCycle: 'Litik' | 'Lisogenik' | 'Keduanya' | 'Struktur';
}

export interface DiagnosticQuestion {
  id: number;
  statement: string;
  isTrue: boolean;
  scientificContext: string;
  piqueCuriosity: string;
}

export interface UserProgress {
  version: number;
  lastUpdated: string;
  currentPhase: LearningPhase;
  activeExploreTab: 'structure' | 'lytic' | 'lysogenic' | 'notes' | 'compare';
  
  // Phase 1: Engage
  engage: {
    answers: Record<number, boolean>;
    initialHypothesis: string;
    submitted: boolean;
  };

  // Phase 2: Explore
  explore: {
    exploredParts: string[];
    lyticNotes: Record<number, string>;
    lysogenicNotes: Record<number, string>;
    hasCompletedLytic: boolean;
    hasCompletedLysogenic: boolean;
  };

  // Phase 3: Explain
  explain: {
    studentNotes: Record<string, string>;
    submitted: boolean;
    viewedGlossary: string[];
  };

  // Phase 4: Elaborate
  elaborate: {
    caseAnswers: Record<string, string>;
    submittedCases: Record<string, boolean>;
  };

  // Phase 5: Evaluate
  evaluate: {
    answers: Record<number, number>;
    submitted: boolean;
    lastScore: number;
    highestScore: number;
    attemptCount: number;
    history: { timestamp: string; score: number }[];
  };

  // Reflection & Mastery
  reflection: {
    answers: Record<string, string>;
    completed: boolean;
  };
}
