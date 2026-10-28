import { useState, useEffect } from 'react';
import { LearningPhase, UserProgress, StudentIdentity, OrientationBlocksOpened } from './types';
import {
  loadUserProgress,
  saveUserProgress,
  resetUserProgress,
  calculateOverallProgress,
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { HomeSection } from './components/HomeSection';
import { MateriAwalSection } from './components/MateriAwalSection';
import { EngageSection } from './components/EngageSection';
import { ExploreSection } from './components/ExploreSection';
import { ExplainSection } from './components/ExplainSection';
import { ElaborateSection } from './components/ElaborateSection';
import { EvaluateSection } from './components/EvaluateSection';
import { ReflectSection } from './components/ReflectSection';
import { Phage3DScene } from './components/3d/Phage3DScene';
import { PhageGameModal } from './components/game/PhageGameModal';
import { VirologyChatbot } from './components/ai/VirologyChatbot';
import { BioscienceHub } from './components/science/BioscienceHub';
import { ChevronLeft, Sparkles, Gamepad2 } from 'lucide-react';

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(() => loadUserProgress());
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [isGameOpen, setIsGameOpen] = useState<boolean>(false);

  // Sync to localStorage whenever progress state updates
  useEffect(() => {
    saveUserProgress(progress);
  }, [progress]);

  const { percentage } = calculateOverallProgress(progress);

  const handleNavigate = (
    phase: LearningPhase,
    exploreTab?: 'structure' | 'lytic' | 'lysogenic' | 'compare' | 'notes'
  ) => {
    setProgress((prev) => ({
      ...prev,
      currentPhase: phase,
      ...(exploreTab ? { activeExploreTab: exploreTab } : {}),
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreTabChange = (tab: 'structure' | 'lytic' | 'lysogenic' | 'compare' | 'notes') => {
    setProgress((prev) => ({
      ...prev,
      activeExploreTab: tab,
    }));
  };

  // Stage 1: Student Identity & Orientation handlers
  const handleUpdateIdentity = (student: StudentIdentity) => {
    setProgress((prev) => ({
      ...prev,
      student,
    }));
  };

  const handleOpenOrientationBlock = (blockKey: keyof OrientationBlocksOpened) => {
    setProgress((prev) => ({
      ...prev,
      orientationBlocks: {
        ...prev.orientationBlocks,
        [blockKey]: true,
      },
    }));
  };

  const handleStartLearning = () => {
    handleNavigate('engage');
  };

  const handleOpenMateriAwal = () => {
    handleNavigate('materi-awal');
  };

  // Phase 1: Engage handlers
  const handleSaveEngage = (
    answers: Record<number, boolean>,
    hypothesis: string,
    submitted: boolean
  ) => {
    setProgress((prev) => ({
      ...prev,
      engage: {
        answers,
        initialHypothesis: hypothesis,
        submitted,
      },
    }));
  };

  // Phase 2: Explore handlers
  const handlePartExplored = (partId: string) => {
    setProgress((prev) => {
      const already = prev.explore.exploredParts.includes(partId);
      if (already) return prev;
      return {
        ...prev,
        explore: {
          ...prev.explore,
          exploredParts: [...prev.explore.exploredParts, partId],
        },
      };
    });
  };

  const handleSaveLyticNote = (step: number, note: string) => {
    setProgress((prev) => ({
      ...prev,
      explore: {
        ...prev.explore,
        lyticNotes: {
          ...prev.explore.lyticNotes,
          [step]: note,
        },
      },
    }));
  };

  const handleSaveLysogenicNote = (step: number, note: string) => {
    setProgress((prev) => ({
      ...prev,
      explore: {
        ...prev.explore,
        lysogenicNotes: {
          ...prev.explore.lysogenicNotes,
          [step]: note,
        },
      },
    }));
  };

  const handleCompletedLytic = () => {
    setProgress((prev) => ({
      ...prev,
      explore: {
        ...prev.explore,
        hasCompletedLytic: true,
      },
    }));
  };

  const handleCompletedLysogenic = () => {
    setProgress((prev) => ({
      ...prev,
      explore: {
        ...prev.explore,
        hasCompletedLysogenic: true,
      },
    }));
  };

  // Phase 3: Explain handlers
  const handleSaveExplain = (notes: Record<string, string>, submitted: boolean) => {
    setProgress((prev) => ({
      ...prev,
      explain: {
        ...prev.explain,
        studentNotes: notes,
        submitted,
      },
    }));
  };

  // Phase 4: Elaborate handlers
  const handleSaveCaseAnswer = (caseId: string, answer: string, submitted: boolean) => {
    setProgress((prev) => ({
      ...prev,
      elaborate: {
        caseAnswers: {
          ...prev.elaborate.caseAnswers,
          [caseId]: answer,
        },
        submittedCases: {
          ...prev.elaborate.submittedCases,
          [caseId]: submitted,
        },
      },
    }));
  };

  // Phase 5: Evaluate handlers
  const handleSaveEvaluate = (
    answers: Record<number, number>,
    score: number,
    submitted: boolean
  ) => {
    setProgress((prev) => {
      const historyItem = { timestamp: new Date().toISOString(), score };
      return {
        ...prev,
        evaluate: {
          answers,
          submitted,
          lastScore: score,
          highestScore: Math.max(prev.evaluate.highestScore, score),
          attemptCount: prev.evaluate.attemptCount + 1,
          history: [...prev.evaluate.history, historyItem],
        },
      };
    });
  };

  // Reflection handlers
  const handleSaveReflection = (answers: Record<string, string>, completed: boolean) => {
    setProgress((prev) => ({
      ...prev,
      reflection: {
        answers,
        completed,
      },
    }));
  };

  const handleResetAllData = () => {
    const cleanProgress = resetUserProgress();
    setProgress(cleanProgress);
    setShowResetConfirm(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Top Learning Progress Strip */}
      <div className="w-full h-1 bg-slate-200 sticky top-0 z-50">
        <div
          className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Main Top Navigation Bar */}
      <Navbar
        currentPhase={progress.currentPhase}
        progress={progress}
        onNavigate={handleNavigate}
        onOpenGame={() => setIsGameOpen(true)}
      />

      {/* Active Phase Content Container */}
      <main className="flex-1 pb-16">
        {progress.currentPhase === 'home' && (
          <HomeSection
            progress={progress}
            onUpdateIdentity={handleUpdateIdentity}
            onOpenOrientationBlock={handleOpenOrientationBlock}
            onStartLearning={handleStartLearning}
            onOpenMateriAwal={handleOpenMateriAwal}
            onOpenLab3D={() => handleNavigate('lab-3d')}
            onOpenGame={() => setIsGameOpen(true)}
            onOpenChatAI={() => handleNavigate('chat-ai')}
            onOpenScienceHub={() => handleNavigate('science-hub')}
          />
        )}

        {progress.currentPhase === 'materi-awal' && (
          <MateriAwalSection
            onBackToHome={() => handleNavigate('home')}
            onProceedToEngage={() => handleNavigate('engage')}
          />
        )}

        {progress.currentPhase === 'engage' && (
          <EngageSection
            initialAnswers={progress.engage.answers}
            initialHypothesis={progress.engage.initialHypothesis}
            hasSubmitted={progress.engage.submitted}
            onSaveEngage={handleSaveEngage}
            onNavigateToExplore={() => handleNavigate('explore')}
          />
        )}

        {progress.currentPhase === 'explore' && (
          <ExploreSection
            activeTab={progress.activeExploreTab}
            onTabChange={handleExploreTabChange}
            exploredParts={progress.explore.exploredParts}
            onPartExplored={handlePartExplored}
            lyticNotes={progress.explore.lyticNotes}
            lysogenicNotes={progress.explore.lysogenicNotes}
            onSaveLyticNote={handleSaveLyticNote}
            onSaveLysogenicNote={handleSaveLysogenicNote}
            onCompletedLytic={handleCompletedLytic}
            onCompletedLysogenic={handleCompletedLysogenic}
            onNavigateToExplain={() => handleNavigate('explain')}
          />
        )}

        {progress.currentPhase === 'explain' && (
          <ExplainSection
            studentNotes={progress.explain.studentNotes}
            hasSubmitted={progress.explain.submitted}
            onSaveExplain={handleSaveExplain}
            onNavigateToElaborate={() => handleNavigate('elaborate')}
          />
        )}

        {progress.currentPhase === 'elaborate' && (
          <ElaborateSection
            caseAnswers={progress.elaborate.caseAnswers}
            submittedCases={progress.elaborate.submittedCases}
            onSaveCaseAnswer={handleSaveCaseAnswer}
            onNavigateToEvaluate={() => handleNavigate('evaluate')}
          />
        )}

        {progress.currentPhase === 'evaluate' && (
          <EvaluateSection
            initialAnswers={progress.evaluate.answers}
            initialScore={progress.evaluate.lastScore}
            hasSubmitted={progress.evaluate.submitted}
            scoreHistory={progress.evaluate.history}
            onSaveEvaluate={handleSaveEvaluate}
            onNavigateToReflect={() => handleNavigate('reflect')}
          />
        )}

        {progress.currentPhase === 'reflect' && (
          <ReflectSection
            progress={progress}
            onSaveReflection={handleSaveReflection}
            onResetAll={() => setShowResetConfirm(true)}
          />
        )}

        {/* Feature 1: Laboratorium 3D Interaktif (Three.js) */}
        {progress.currentPhase === 'lab-3d' && (
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-in fade-in">
            {/* Header & Back breadcrumb */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => handleNavigate('home')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Kembali ke Beranda
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsGameOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Gamepad2 className="w-3.5 h-3.5" />
                  <span>Mainkan Game 3D</span>
                </button>
              </div>
            </div>

            <Phage3DScene />
          </div>
        )}

        {/* Feature 2 & 3: Tanya BioAI (Gemini 3.8 Flash + Google Search Grounding) */}
        {progress.currentPhase === 'chat-ai' && (
          <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleNavigate('home')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Kembali ke Beranda
              </button>
            </div>

            <VirologyChatbot />
          </div>
        )}

        {/* Feature 4: Pusat Biosains & Genomika (NCBI RefSeq & PDB) */}
        {progress.currentPhase === 'science-hub' && (
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleNavigate('home')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Kembali ke Beranda
              </button>
            </div>

            <BioscienceHub />
          </div>
        )}
      </main>

      {/* Feature 5: Full-Viewport 3D Game Shell (Phage Attack) */}
      <PhageGameModal isOpen={isGameOpen} onClose={() => setIsGameOpen(false)} />

      {/* Confirmation Modal for Resetting Progress */}
      {showResetConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in"
        >
          <div className="bg-white rounded-2xl border border-slate-200 max-w-sm w-full p-6 shadow-xl flex flex-col gap-4">
            <h3 className="text-base font-bold text-slate-900">Mulai Ulang Progres Belajar?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Seluruh catatan pengamatan, hasil kuis, dan jawaban refleksi yang tersimpan di browser ini akan dihapus. Anda dapat mulai belajar kembali dari fase pertama.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleResetAllData}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition-colors"
              >
                Ya, Mulai Ulang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clean Scientific Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-[1100px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">VIRUSNESIA</span>
            <span>·</span>
            <span>Media Pembelajaran Biologi SMA Kelas X</span>
            <span>·</span>
            <span>Model 5E Learning Cycle</span>
          </div>
          <div className="text-slate-400 text-center sm:text-right">
            Progres tersimpan secara lokal pada browser perangkat ini. Tanpa akun atau login.
          </div>
        </div>
      </footer>
    </div>
  );
}
