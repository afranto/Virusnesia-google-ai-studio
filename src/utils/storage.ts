import { UserProgress } from '../types';

const STORAGE_KEY = 'virusnesia_user_progress_v1';

export const INITIAL_PROGRESS: UserProgress = {
  version: 1,
  lastUpdated: new Date().toISOString(),
  currentPhase: 'home',
  activeExploreTab: 'structure',
  engage: {
    answers: {},
    initialHypothesis: '',
    submitted: false,
  },
  explore: {
    exploredParts: [],
    lyticNotes: {},
    lysogenicNotes: {},
    hasCompletedLytic: false,
    hasCompletedLysogenic: false,
  },
  explain: {
    studentNotes: {},
    submitted: false,
    viewedGlossary: [],
  },
  elaborate: {
    caseAnswers: {},
    submittedCases: {},
  },
  evaluate: {
    answers: {},
    submitted: false,
    lastScore: 0,
    highestScore: 0,
    attemptCount: 0,
    history: [],
  },
  reflection: {
    answers: {},
    completed: false,
  },
};

export function loadUserProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_PROGRESS;
    const parsed = JSON.parse(raw);
    
    // Deep merge with initial progress to ensure backward compatibility
    return {
      ...INITIAL_PROGRESS,
      ...parsed,
      engage: { ...INITIAL_PROGRESS.engage, ...(parsed.engage || {}) },
      explore: { ...INITIAL_PROGRESS.explore, ...(parsed.explore || {}) },
      explain: { ...INITIAL_PROGRESS.explain, ...(parsed.explain || {}) },
      elaborate: { ...INITIAL_PROGRESS.elaborate, ...(parsed.elaborate || {}) },
      evaluate: { ...INITIAL_PROGRESS.evaluate, ...(parsed.evaluate || {}) },
      reflection: { ...INITIAL_PROGRESS.reflection, ...(parsed.reflection || {}) },
    };
  } catch (error) {
    console.error('Failed to parse saved user progress from localStorage:', error);
    return INITIAL_PROGRESS;
  }
}

export function saveUserProgress(progress: UserProgress): void {
  try {
    const updated = {
      ...progress,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save user progress to localStorage:', error);
  }
}

export function resetUserProgress(): UserProgress {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Error clearing localStorage:', e);
  }
  return { ...INITIAL_PROGRESS, lastUpdated: new Date().toISOString() };
}

export function calculateOverallProgress(progress: UserProgress): {
  percentage: number;
  completedPhases: number;
  totalPhases: number;
  phaseStatus: Record<string, boolean>;
} {
  const phaseStatus: Record<string, boolean> = {
    engage: Boolean(progress.engage.submitted),
    explore:
      progress.explore.exploredParts.length >= 3 &&
      (progress.explore.hasCompletedLytic || Object.keys(progress.explore.lyticNotes).length > 0) &&
      (progress.explore.hasCompletedLysogenic || Object.keys(progress.explore.lysogenicNotes).length > 0),
    explain: Boolean(progress.explain.submitted || Object.keys(progress.explain.studentNotes).length >= 2),
    elaborate: Object.keys(progress.elaborate.submittedCases).length >= 2,
    evaluate: Boolean(progress.evaluate.submitted),
    reflect: Boolean(progress.reflection.completed || Object.keys(progress.reflection.answers).length >= 2),
  };

  const totalPhases = 6;
  const completedPhases = Object.values(phaseStatus).filter(Boolean).length;
  const percentage = Math.round((completedPhases / totalPhases) * 100);

  return {
    percentage,
    completedPhases,
    totalPhases,
    phaseStatus,
  };
}
