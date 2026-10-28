import React, { useState, useEffect, useRef } from 'react';
import {
  LYTIC_SIMULATION_STEPS,
  LYTIC_PREDICTIONS,
  INTERACTIVE_SIMULATION_OBJECTS,
} from '../../data/learningContent';
import { PhETToolbar } from './PhETToolbar';
import { BioInspectorCard } from './BioInspectorCard';
import { PredictionWorkbench } from './PredictionWorkbench';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Gauge,
  Check,
  AlertCircle,
  HelpCircle,
  Clock,
  ArrowLeftRight,
  Flame,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Zap,
  Target,
  Wrench,
  Activity,
  Layers,
} from 'lucide-react';

interface LyticSimulationProps {
  observationNotes: Record<number, string>;
  onSaveObservation: (stepNumber: number, note: string) => void;
  onSimulationCompleted: () => void;
  onOpenComparison?: () => void;
}

export const LyticSimulation: React.FC<LyticSimulationProps> = ({
  observationNotes,
  onSaveObservation,
  onSimulationCompleted,
  onOpenComparison,
}) => {
  // Navigation & Core States
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isAutoPlayMode, setIsAutoPlayMode] = useState<boolean>(false); // default manual for hands-on lab
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);

  // PhET Virtual Lab Tool States
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isProbeActive, setIsProbeActive] = useState<boolean>(false);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [showScale, setShowScale] = useState<boolean>(true);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);

  // Hands-on Interactive Lab Experiment States per Step
  // Step 1: Adsorption Docking State
  const [adsorptionDocked, setAdsorptionDocked] = useState<boolean>(false);
  // Step 2: Penetration Injection State
  const [penetrationInjected, setPenetrationInjected] = useState<boolean>(false);
  // Step 3: Synthesis degradation & viral replication State
  const [synthesisDegraded, setSynthesisDegraded] = useState<boolean>(false);
  const [synthesisReplicating, setSynthesisReplicating] = useState<boolean>(false);
  // Step 4: Assembly progress (0 to 3)
  const [assemblyStage, setAssemblyStage] = useState<number>(0); // 0=parts separated, 1=capsid+DNA, 2=tail added, 3=fibers added (fully assembled)
  // Step 5: Lysis release state
  const [lysisPunctured, setLysisPunctured] = useState<boolean>(false);

  // POEC Prediction & Observation
  const [savedPredictions, setSavedPredictions] = useState<Record<string, { optionId: string; reasoning: string }>>({});
  const [localNote, setLocalNote] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<string>('');
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);

  const currentStep = LYTIC_SIMULATION_STEPS[currentStepIndex];
  const currentPrediction = LYTIC_PREDICTIONS[currentStep.step];
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync local observation note when step changes
  useEffect(() => {
    setLocalNote(observationNotes[currentStep.step] || '');
    setSaveStatus('');
  }, [currentStepIndex, observationNotes, currentStep.step]);

  // Load saved predictions from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('virusnesia_lytic_predictions');
      if (stored) {
        setSavedPredictions(JSON.parse(stored));
      }
    } catch {
      // fallback
    }
  }, []);

  // Save predictions to localStorage
  const handleSavePrediction = (predictionId: string, optionId: string, reasoning: string) => {
    setSavedPredictions((prev) => {
      const updated = { ...prev, [predictionId]: { optionId, reasoning } };
      try {
        localStorage.setItem('virusnesia_lytic_predictions', JSON.stringify(updated));
      } catch {
        // fallback
      }
      return updated;
    });
  };

  // Safe timer logic for AutoPlay
  useEffect(() => {
    if (isPlaying && isAutoPlayMode) {
      const durationMs = (currentStep.durationSec * 1000) / speedMultiplier;
      timerRef.current = setTimeout(() => {
        if (currentStepIndex < LYTIC_SIMULATION_STEPS.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        } else {
          setIsPlaying(false);
          onSimulationCompleted();
        }
      }, durationMs);
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPlaying, isAutoPlayMode, currentStepIndex, speedMultiplier, currentStep.durationSec, onSimulationCompleted]);

  // Reset experimental states when changing steps or restarting
  const resetExperimentalStates = () => {
    setAdsorptionDocked(false);
    setPenetrationInjected(false);
    setSynthesisDegraded(false);
    setSynthesisReplicating(false);
    setAssemblyStage(0);
    setLysisPunctured(false);
  };

  const handlePlayToggle = () => {
    setIsPlaying((prev) => !prev);
    // When playing, trigger default step actions
    if (!isPlaying) {
      if (currentStep.step === 1) setAdsorptionDocked(true);
      if (currentStep.step === 2) setPenetrationInjected(true);
      if (currentStep.step === 3) {
        setSynthesisDegraded(true);
        setSynthesisReplicating(true);
      }
      if (currentStep.step === 4) setAssemblyStage(3);
      if (currentStep.step === 5) setLysisPunctured(true);
    }
  };

  const handleRestart = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    resetExperimentalStates();
  };

  const handleNext = () => {
    setIsPlaying(false);
    if (currentStepIndex < LYTIC_SIMULATION_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      resetExperimentalStates();
    }
  };

  const handlePrev = () => {
    setIsPlaying(false);
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      resetExperimentalStates();
    }
  };

  const handleStepClick = (index: number) => {
    setIsPlaying(false);
    setCurrentStepIndex(index);
    resetExperimentalStates();
  };

  const handleObjectClick = (objectId: string) => {
    setSelectedObjectId(objectId === selectedObjectId ? null : objectId);
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setLocalNote(val);
    onSaveObservation(currentStep.step, val);
    setSaveStatus('Tersimpan di browser');
  };

  const activeObjectInfo = selectedObjectId ? INTERACTIVE_SIMULATION_OBJECTS[selectedObjectId] : null;

  // Zoom helpers
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(1.6, +(prev + 0.15).toFixed(2)));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(0.75, +(prev - 0.15).toFixed(2)));
  const handleResetZoom = () => setZoomLevel(1);

  // Play animation CSS helper
  const animPlayStyle = {
    animationPlayState: isPlaying ? 'running' : 'paused',
  } as React.CSSProperties;

  return (
    <div className="flex flex-col gap-6">
      {/* Simulation Stage Header & Top Stepper */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-red-600" />
              Laboratorium Virtual Siklus Litik
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-medium text-slate-600 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Durasi Replikasi ~25 Menit
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md font-semibold">
              Mode PhET Eksplorasi
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
            Tahap {currentStep.step}: {currentStep.name} — {currentStep.scientificStage}
          </h2>
        </div>

        {/* 5-Step Stepper & Compare shortcut */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {LYTIC_SIMULATION_STEPS.map((s, idx) => {
              const isCurrent = idx === currentStepIndex;
              const isPast = idx < currentStepIndex;
              return (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => handleStepClick(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                    isCurrent
                      ? 'bg-red-600 text-white shadow-md ring-2 ring-red-300'
                      : isPast
                      ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  title={`${s.step}. ${s.name}`}
                >
                  {isPast ? <Check className="w-3 h-3 text-red-600" /> : <span>{s.step}</span>}
                  <span className="hidden sm:inline">{s.name}</span>
                </button>
              );
            })}
          </div>

          {onOpenComparison && (
            <button
              type="button"
              onClick={onOpenComparison}
              className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 transition-colors flex items-center gap-1.5 cursor-pointer ml-auto sm:ml-0"
              title="Bandingkan dengan Siklus Lisogenik"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Bandingkan Siklus</span>
            </button>
          )}
        </div>
      </div>

      {/* PhET Toolbar (Zoom, Sensor Probe, Labels, Scale) */}
      <PhETToolbar
        zoomLevel={zoomLevel}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
        isProbeActive={isProbeActive}
        onToggleProbe={() => setIsProbeActive((prev) => !prev)}
        showLabels={showLabels}
        onToggleLabels={() => setShowLabels((prev) => !prev)}
        showScale={showScale}
        onToggleScale={() => setShowScale((prev) => !prev)}
        onOpenHelp={() => setShowGuideModal(true)}
      />

      {/* Main Simulation Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Top: Interactive SVG Canvas (8 cols on desktop) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden relative select-none">
            {/* Top Canvas Status & Direct Sensor Badge */}
            <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between gap-2 pointer-events-none flex-wrap">
              <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 px-3 py-1.5 rounded-xl flex items-center gap-2 pointer-events-auto shadow-md">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span className="text-xs font-mono font-bold text-slate-200">
                  Tahap {currentStep.step}/5: {currentStep.name}
                </span>
                {isPlaying && (
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-700">
                    Bergerak Aktif
                  </span>
                )}
              </div>

              {/* Status Hint */}
              <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 px-3 py-1.5 rounded-xl text-xs text-amber-300 font-medium pointer-events-auto hidden sm:flex items-center gap-1.5 shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {isProbeActive
                    ? 'Klik objek apa pun di kanvas untuk memindai biosensor!'
                    : 'Uji eksperimen dengan tombol aksi di bawah kanvas!'}
                </span>
              </div>
            </div>

            {/* Scale Bar Indicator overlay (if toggled) */}
            {showScale && (
              <div className="absolute bottom-3 left-3 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-700 px-2.5 py-1.5 rounded-xl text-slate-300 text-[11px] font-mono pointer-events-none flex items-center gap-2">
                <span>Skala:</span>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-1.5 bg-emerald-400 border border-emerald-300 rounded-sm" />
                  <span className="text-[9px] text-emerald-300">~100 nm (Fag)</span>
                </div>
                <div className="w-px h-4 bg-slate-700" />
                <div className="flex flex-col items-center">
                  <div className="w-20 h-1.5 bg-sky-400 border border-sky-300 rounded-sm" />
                  <span className="text-[9px] text-sky-300">~2.000 nm (Bakteri)</span>
                </div>
              </div>
            )}

            {/* SVG Interactive Canvas */}
            <div
              className={`w-full overflow-hidden flex items-center justify-center p-2 sm:p-4 min-h-[380px] sm:min-h-[460px] ${
                isProbeActive ? 'cursor-crosshair' : 'cursor-default'
              }`}
            >
              <div
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: 'center center',
                  transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className="w-full max-w-[680px]"
              >
                <svg
                  viewBox="0 0 680 480"
                  className="w-full h-auto drop-shadow-2xl"
                  aria-label="Kanvas Simulasi Siklus Litik Bakteriofag"
                >
                  <defs>
                    {/* Glowing Filters */}
                    <filter id="lyticGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3.5" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <filter id="viralBurst" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="5" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    {/* Gradients */}
                    <linearGradient id="bacterialWallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#059669" />
                      <stop offset="100%" stopColor="#047857" />
                    </linearGradient>
                    <linearGradient id="bacterialCytoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#064e3b" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#022c22" stopOpacity="0.7" />
                    </linearGradient>
                    <linearGradient id="phageHeadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#7e22ce" />
                    </linearGradient>
                    <linearGradient id="dnaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ec4899" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>

                  {/* Canvas Grid Background pattern */}
                  <g opacity="0.15">
                    <line x1="0" y1="120" x2="680" y2="120" stroke="#38bdf8" strokeDasharray="4 4" />
                    <line x1="0" y1="240" x2="680" y2="240" stroke="#38bdf8" strokeDasharray="4 4" />
                    <line x1="0" y1="360" x2="680" y2="360" stroke="#38bdf8" strokeDasharray="4 4" />
                    <line x1="170" y1="0" x2="170" y2="480" stroke="#38bdf8" strokeDasharray="4 4" />
                    <line x1="340" y1="0" x2="340" y2="480" stroke="#38bdf8" strokeDasharray="4 4" />
                    <line x1="510" y1="0" x2="510" y2="480" stroke="#38bdf8" strokeDasharray="4 4" />
                  </g>

                  {/* 1. BACTERIAL CELL BODY (HOST) */}
                  {currentStep.step < 5 ? (
                    <g
                      id="host-cell"
                      onClick={() => handleObjectClick('dinding_sel')}
                      className="cursor-pointer"
                    >
                      {/* Outer Peptidoglycan Wall */}
                      <rect
                        x="90"
                        y="180"
                        width="500"
                        height="260"
                        rx="120"
                        fill="url(#bacterialCytoGrad)"
                        stroke="url(#bacterialWallGrad)"
                        strokeWidth={selectedObjectId === 'dinding_sel' ? '7' : '5'}
                        className={selectedObjectId === 'dinding_sel' ? 'anim-highlight' : ''}
                      />
                      {/* Inner Plasma Membrane */}
                      <rect
                        x="100"
                        y="190"
                        width="480"
                        height="240"
                        rx="110"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                        strokeDasharray="6 3"
                        opacity="0.8"
                      />
                      {/* Receptor Points on outer membrane (LPS / OmpC) */}
                      <g id="receptors">
                        <circle cx="340" cy="180" r="5" fill="#f59e0b" filter="url(#lyticGlow)" />
                        <circle cx="310" cy="182" r="4.5" fill="#f59e0b" />
                        <circle cx="370" cy="182" r="4.5" fill="#f59e0b" />
                        <circle cx="250" cy="195" r="4" fill="#f59e0b" />
                        <circle cx="430" cy="195" r="4" fill="#f59e0b" />
                      </g>

                      {showLabels && (
                        <text
                          x="340"
                          y="420"
                          textAnchor="middle"
                          fill="#34d399"
                          fontSize="11"
                          fontFamily="sans-serif"
                          fontWeight="bold"
                          opacity="0.85"
                        >
                          Dinding Sel & Sitoplasma E. coli
                        </text>
                      )}
                    </g>
                  ) : (
                    /* STAGE 5: Lysis (Broken / Osmotically Ruptured Wall) */
                    <g
                      id="host-cell-lysed"
                      onClick={() => handleObjectClick('dinding_sel')}
                      className="cursor-pointer"
                    >
                      {/* Left Wall Shard */}
                      <path
                        d="M 90 310 C 90 220 180 180 270 180 L 260 215 L 290 230 L 240 260 L 270 290 L 230 330 L 260 370 L 210 400 C 130 400 90 370 90 310 Z"
                        fill="url(#bacterialCytoGrad)"
                        stroke="#ef4444"
                        strokeWidth="5"
                        strokeDasharray="8 4"
                      />
                      {/* Right Wall Shard */}
                      <path
                        d="M 590 310 C 590 220 500 180 410 180 L 420 215 L 390 230 L 440 260 L 410 290 L 450 330 L 420 370 L 470 400 C 550 400 590 370 590 310 Z"
                        fill="url(#bacterialCytoGrad)"
                        stroke="#ef4444"
                        strokeWidth="5"
                        strokeDasharray="8 4"
                      />
                      {/* Rupture Opening in Center */}
                      <ellipse
                        cx="340"
                        cy="300"
                        rx="75"
                        ry="110"
                        fill="#022c22"
                        opacity="0.5"
                        stroke="#ef4444"
                        strokeWidth="2.5"
                        strokeDasharray="6 4"
                      />
                      {showLabels && (
                        <text
                          x="340"
                          y="430"
                          textAnchor="middle"
                          fill="#f87171"
                          fontSize="12"
                          fontFamily="sans-serif"
                          fontWeight="bold"
                        >
                          Lisis Osmotik: Peptidoglikan Rusak Total
                        </text>
                      )}
                    </g>
                  )}

                  {/* 2. BACTERIAL CHROMOSOME (HOST DNA) */}
                  {currentStep.step <= 2 ? (
                    /* Intact Circular Chromosome */
                    <g
                      id="host-chromosome-intact"
                      onClick={() => handleObjectClick('kromosom_bakteri')}
                      className="cursor-pointer"
                    >
                      <path
                        d="M 230 300 C 230 240 300 240 340 270 C 380 240 450 240 450 300 C 450 360 380 370 340 330 C 300 370 230 360 230 300 Z"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth={selectedObjectId === 'kromosom_bakteri' ? '5.5' : '3.5'}
                        strokeDasharray="9 4"
                        className={selectedObjectId === 'kromosom_bakteri' ? 'anim-highlight' : 'anim-dna-flow'}
                        style={animPlayStyle}
                        filter="url(#lyticGlow)"
                      />
                      {showLabels && (
                        <text
                          x="340"
                          y="305"
                          textAnchor="middle"
                          fill="#34d399"
                          fontSize="10"
                          fontFamily="sans-serif"
                          fontWeight="bold"
                        >
                          Kromosom Bakteri (dsDNA Inang)
                        </text>
                      )}
                    </g>
                  ) : currentStep.step === 3 ? (
                    /* Degraded DNA Fragments */
                    <g
                      id="host-chromosome-degraded"
                      onClick={() => handleObjectClick('kromosom_bakteri')}
                      className="cursor-pointer"
                    >
                      <line x1="200" y1="280" x2="230" y2="295" stroke="#10b981" strokeWidth="2.5" strokeDasharray="3 3" opacity="0.6" />
                      <line x1="245" y1="330" x2="275" y2="340" stroke="#10b981" strokeWidth="2.5" strokeDasharray="3 3" opacity="0.5" />
                      <line x1="410" y1="270" x2="440" y2="285" stroke="#10b981" strokeWidth="2.5" strokeDasharray="3 3" opacity="0.6" />
                      <line x1="430" y1="335" x2="465" y2="340" stroke="#10b981" strokeWidth="2.5" strokeDasharray="3 3" opacity="0.5" />
                      {showLabels && (
                        <text
                          x="340"
                          y="345"
                          textAnchor="middle"
                          fill="#6ee7b7"
                          fontSize="10"
                          fontFamily="sans-serif"
                          fontStyle="italic"
                          opacity="0.8"
                        >
                          Fragmen DNA Inang Terdegradasi oleh Endonuklease
                        </text>
                      )}
                    </g>
                  ) : null}

                  {/* 3. STEP SPECIFIC PHAGE VISUALIZATIONS */}

                  {/* STAGE 1: ADSORPTION */}
                  {currentStep.step === 1 && (
                    <g
                      id="phage-adsorption"
                      onClick={() => handleObjectClick('kapsid')}
                      className={`cursor-pointer ${adsorptionDocked || isPlaying ? '' : 'anim-descent'}`}
                      style={animPlayStyle}
                      transform={adsorptionDocked ? 'translate(0, 0)' : 'translate(0, -25)'}
                    >
                      {/* Phage Head */}
                      <polygon
                        points="340,30 380,55 380,95 340,115 300,95 300,55"
                        fill="url(#phageHeadGrad)"
                        stroke="#e879f9"
                        strokeWidth={selectedObjectId === 'kapsid' ? '4' : '2'}
                        filter="url(#lyticGlow)"
                        className={selectedObjectId === 'kapsid' ? 'anim-highlight' : ''}
                      />
                      {/* DNA inside head */}
                      <path
                        d="M 320 60 Q 340 75 360 60 Q 340 90 325 85 Q 355 95 340 100"
                        fill="none"
                        stroke="#ec4899"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        filter="url(#lyticGlow)"
                      />
                      {/* Collar & Sheath */}
                      <rect x="334" y="115" width="12" height="40" fill="#c084fc" rx="2" stroke="#e879f9" />
                      <line x1="334" y1="125" x2="346" y2="125" stroke="#581c87" strokeWidth="1.5" />
                      <line x1="334" y1="135" x2="346" y2="135" stroke="#581c87" strokeWidth="1.5" />
                      <line x1="334" y1="145" x2="346" y2="145" stroke="#581c87" strokeWidth="1.5" />
                      {/* Baseplate */}
                      <polygon points="325,155 355,155 350,162 330,162" fill="#9333ea" stroke="#d8b4fe" />
                      {/* Long Tail Fibers bending onto bacterial receptor */}
                      <path
                        d="M 328 160 L 305 172 L 290 182"
                        fill="none"
                        stroke="#e879f9"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 352 160 L 375 172 L 390 182"
                        fill="none"
                        stroke="#e879f9"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 335 160 L 320 174 L 315 180"
                        fill="none"
                        stroke="#d8b4fe"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 345 160 L 360 174 L 365 180"
                        fill="none"
                        stroke="#d8b4fe"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />

                      {/* Docking Highlight Ring */}
                      {adsorptionDocked && (
                        <circle cx="340" cy="180" r="14" fill="none" stroke="#22c55e" strokeWidth="3" className="anim-pulse-subtle" />
                      )}

                      {showLabels && (
                        <g>
                          <text x="400" y="70" fill="#f0abfc" fontSize="10" fontWeight="bold">
                            Kapsid Berisi dsDNA
                          </text>
                          <text x="400" y="140" fill="#d8b4fe" fontSize="10">
                            Selubung Ekor
                          </text>
                          <text x="405" y="178" fill="#fde047" fontSize="10" fontWeight="bold">
                            Kontak Reseptor LPS/OmpC
                          </text>
                        </g>
                      )}
                    </g>
                  )}

                  {/* STAGE 2: PENETRATION */}
                  {currentStep.step === 2 && (
                    <g id="phage-penetration">
                      {/* Ghost Capsid (Empty, semi-transparent) */}
                      <g
                        onClick={() => handleObjectClick('kapsid')}
                        className="cursor-pointer"
                        opacity={penetrationInjected ? '0.45' : '0.8'}
                      >
                        <polygon
                          points="340,45 380,70 380,105 340,125 300,105 300,70"
                          fill="none"
                          stroke="#c084fc"
                          strokeWidth="2"
                          strokeDasharray="4 2"
                        />
                        <text
                          x="340"
                          y="90"
                          textAnchor="middle"
                          fill="#d8b4fe"
                          fontSize="9"
                          fontStyle="italic"
                        >
                          Ghost Capsid (Kosong)
                        </text>
                      </g>

                      {/* Contracted Sheath (shorter than Stage 1) */}
                      <rect x="334" y="125" width="12" height="28" fill="#a855f7" rx="2" stroke="#d8b4fe" />
                      <line x1="334" y1="133" x2="346" y2="133" stroke="#3b0764" strokeWidth="2" />
                      <line x1="334" y1="141" x2="346" y2="141" stroke="#3b0764" strokeWidth="2" />

                      {/* Baseplate at wall */}
                      <polygon points="325,153 355,153 350,160 330,160" fill="#9333ea" />
                      {/* Punctured wall opening */}
                      <ellipse cx="340" cy="180" rx="8" ry="4" fill="#ec4899" opacity="0.8" filter="url(#lyticGlow)" />

                      {/* Tail Fibers firmly docked */}
                      <path d="M 328 156 L 305 170 L 290 180" fill="none" stroke="#c084fc" strokeWidth="2.5" />
                      <path d="M 352 156 L 375 170 L 390 180" fill="none" stroke="#c084fc" strokeWidth="2.5" />

                      {/* Injected DNA - Continuous Streaming Loop into Cytoplasm */}
                      <g
                        id="injected-dna"
                        onClick={() => handleObjectClick('dna_virus')}
                        className="cursor-pointer"
                      >
                        {/* Upper tube DNA stream */}
                        <path
                          d="M 340 75 L 340 180"
                          fill="none"
                          stroke="#ec4899"
                          strokeWidth="4"
                          strokeLinecap="round"
                          className="anim-dna-stream"
                          style={animPlayStyle}
                          filter="url(#lyticGlow)"
                        />
                        {/* Pulsing DNA pulse particle traveling down */}
                        <circle
                          cx="340"
                          cy="130"
                          r="5"
                          fill="#f472b6"
                          className="anim-particle-down"
                          style={animPlayStyle}
                        />
                        {/* Cytoplasmic wave of injected viral dsDNA */}
                        <path
                          d="M 340 180 C 340 230 310 250 330 290 C 350 320 370 290 350 250"
                          fill="none"
                          stroke="#ec4899"
                          strokeWidth={selectedObjectId === 'dna_virus' ? '6' : '4.5'}
                          strokeLinecap="round"
                          className="anim-dna-inject"
                          filter="url(#lyticGlow)"
                        />
                        {showLabels && (
                          <text
                            x="410"
                            y="235"
                            fill="#f472b6"
                            fontSize="11"
                            fontWeight="bold"
                            filter="url(#lyticGlow)"
                          >
                            dsDNA Virus Disuntikkan!
                          </text>
                        )}
                      </g>
                    </g>
                  )}

                  {/* STAGE 3: SYNTHESIS */}
                  {currentStep.step === 3 && (
                    <g id="phage-synthesis">
                      {/* Ghost capsid remains outside */}
                      <polygon
                        points="340,45 380,70 380,105 340,125 300,105 300,70"
                        fill="none"
                        stroke="#64748b"
                        strokeWidth="1.5"
                        strokeDasharray="4 2"
                        opacity="0.3"
                      />

                      {/* Multiple Replicating Viral DNA Strands */}
                      <g
                        id="viral-dna-copies"
                        onClick={() => handleObjectClick('dna_virus')}
                        className="cursor-pointer"
                      >
                        <path
                          d="M 280 230 Q 320 220 340 245 Q 360 270 320 280 Q 280 270 280 230"
                          fill="none"
                          stroke="#ec4899"
                          strokeWidth="3.5"
                          className="anim-dna-flow"
                          style={animPlayStyle}
                          filter="url(#lyticGlow)"
                        />
                        <path
                          d="M 370 270 Q 410 260 420 290 Q 400 320 370 300 Q 350 280 370 270"
                          fill="none"
                          stroke="#ec4899"
                          strokeWidth="3.5"
                          className="anim-dna-flow"
                          style={animPlayStyle}
                          filter="url(#lyticGlow)"
                        />
                        <path
                          d="M 230 330 Q 260 310 280 340 Q 250 370 230 330"
                          fill="none"
                          stroke="#d946ef"
                          strokeWidth="3"
                          className="anim-dna-flow"
                          style={animPlayStyle}
                        />
                      </g>

                      {/* Newly Synthesized Viral Protein Subunits */}
                      <g id="viral-protein-components">
                        {/* Empty Capsid Heads being translated */}
                        <polygon
                          points="250,220 265,230 265,245 250,255 235,245 235,230"
                          fill="#a855f7"
                          opacity="0.9"
                          stroke="#c084fc"
                        />
                        <polygon
                          points="430,225 445,235 445,250 430,260 415,250 415,235"
                          fill="#a855f7"
                          opacity="0.9"
                          stroke="#c084fc"
                        />
                        <polygon
                          points="335,310 350,320 350,335 335,345 320,335 320,320"
                          fill="#a855f7"
                          opacity="0.85"
                          stroke="#c084fc"
                        />

                        {/* Separate Sheaths & Tubes */}
                        <rect x="270" y="270" width="8" height="20" fill="#c084fc" rx="2" />
                        <rect x="440" y="310" width="8" height="20" fill="#c084fc" rx="2" />

                        {/* Loose Tail Fibers */}
                        <path d="M 290 350 L 305 365" stroke="#e879f9" strokeWidth="2" strokeLinecap="round" />
                        <path d="M 390 230 L 405 240" stroke="#e879f9" strokeWidth="2" strokeLinecap="round" />
                        <path d="M 380 350 L 395 365" stroke="#e879f9" strokeWidth="2" strokeLinecap="round" />
                      </g>

                      {showLabels && (
                        <g>
                          <text x="340" y="220" textAnchor="middle" fill="#f472b6" fontSize="11" fontWeight="bold">
                            Replikasi Masif dsDNA Virus & Translasi Protein
                          </text>
                          <text x="475" y="240" fill="#c084fc" fontSize="9">
                            Kepala Prokapsid
                          </text>
                          <text x="460" y="325" fill="#e879f9" fontSize="9">
                            Subunit Selubung Ekor
                          </text>
                        </g>
                      )}
                    </g>
                  )}

                  {/* STAGE 4: ASSEMBLY */}
                  {currentStep.step === 4 && (
                    <g id="phage-assembly">
                      {/* Ghost capsid remains outside */}
                      <polygon
                        points="340,45 380,70 380,105 340,125 300,105 300,70"
                        fill="none"
                        stroke="#64748b"
                        strokeWidth="1.5"
                        strokeDasharray="4 2"
                        opacity="0.2"
                      />

                      {/* Assembled Virion 1 (Center-Left) */}
                      <g
                        transform="translate(230, 240) scale(0.65)"
                        onClick={() => handleObjectClick('kapsid')}
                        className={`cursor-pointer ${assemblyStage >= 1 ? '' : 'anim-assemble-head'}`}
                        style={animPlayStyle}
                      >
                        <polygon points="340,30 380,55 380,95 340,115 300,95 300,55" fill="url(#phageHeadGrad)" stroke="#e879f9" strokeWidth="2" />
                        <path d="M 320 60 Q 340 75 360 60 Q 340 90 325 85 Q 355 95 340 100" fill="none" stroke="#ec4899" strokeWidth="3" />
                        <rect x="334" y="115" width="12" height="40" fill="#c084fc" rx="2" />
                        <polygon points="325,155 355,155 350,162 330,162" fill="#9333ea" />
                        <path d="M 328 160 L 305 180 L 295 190" fill="none" stroke="#e879f9" strokeWidth="2" />
                        <path d="M 352 160 L 375 180 L 385 190" fill="none" stroke="#e879f9" strokeWidth="2" />
                      </g>

                      {/* Assembled Virion 2 (Center-Right) */}
                      <g
                        transform="translate(110, 270) scale(0.65)"
                        onClick={() => handleObjectClick('kapsid')}
                        className={`cursor-pointer ${assemblyStage >= 2 ? '' : 'anim-assemble-tail'}`}
                        style={animPlayStyle}
                      >
                        <polygon points="340,30 380,55 380,95 340,115 300,95 300,55" fill="url(#phageHeadGrad)" stroke="#e879f9" strokeWidth="2" />
                        <path d="M 320 60 Q 340 75 360 60 Q 340 90 325 85 Q 355 95 340 100" fill="none" stroke="#ec4899" strokeWidth="3" />
                        <rect x="334" y="115" width="12" height="40" fill="#c084fc" rx="2" />
                        <polygon points="325,155 355,155 350,162 330,162" fill="#9333ea" />
                        <path d="M 328 160 L 305 180 L 295 190" fill="none" stroke="#e879f9" strokeWidth="2" />
                        <path d="M 352 160 L 375 180 L 385 190" fill="none" stroke="#e879f9" strokeWidth="2" />
                      </g>

                      {/* Assembled Virion 3 (Center Lower) */}
                      <g
                        transform="translate(190, 310) scale(0.65)"
                        onClick={() => handleObjectClick('kapsid')}
                        className={`cursor-pointer ${assemblyStage >= 3 ? '' : 'anim-assemble-fibers'}`}
                        style={animPlayStyle}
                      >
                        <polygon points="340,30 380,55 380,95 340,115 300,95 300,55" fill="url(#phageHeadGrad)" stroke="#e879f9" strokeWidth="2" />
                        <path d="M 320 60 Q 340 75 360 60 Q 340 90 325 85 Q 355 95 340 100" fill="none" stroke="#ec4899" strokeWidth="3" />
                        <rect x="334" y="115" width="12" height="40" fill="#c084fc" rx="2" />
                        <polygon points="325,155 355,155 350,162 330,162" fill="#9333ea" />
                        <path d="M 328 160 L 305 180 L 295 190" fill="none" stroke="#e879f9" strokeWidth="2" />
                        <path d="M 352 160 L 375 180 L 385 190" fill="none" stroke="#e879f9" strokeWidth="2" />
                      </g>

                      {/* Components in progress of joining */}
                      <g className="anim-pulse-subtle" style={animPlayStyle}>
                        <polygon points="450,230 470,245 470,265 450,280 430,265 430,245" fill="#a855f7" stroke="#e879f9" />
                        <path d="M 440,245 Q 450,260 460,250" fill="none" stroke="#ec4899" strokeWidth="2.5" />
                        <rect x="446" y="280" width="8" height="25" fill="#c084fc" rx="1.5" />
                      </g>

                      {showLabels && (
                        <text
                          x="340"
                          y="225"
                          textAnchor="middle"
                          fill="#f0abfc"
                          fontSize="11"
                          fontWeight="bold"
                          filter="url(#lyticGlow)"
                        >
                          Morfogenesis: Perakitan 100–200 Virion Matang
                        </text>
                      )}
                    </g>
                  )}

                  {/* STAGE 5: LYSIS */}
                  {currentStep.step === 5 && (
                    <g id="phage-lysis">
                      {/* Virion 1 escaping left */}
                      <g
                        transform="translate(70, 160) scale(0.65)"
                        className="anim-escape-1 cursor-pointer"
                        style={animPlayStyle}
                        onClick={() => handleObjectClick('kapsid')}
                      >
                        <polygon points="340,30 380,55 380,95 340,115 300,95 300,55" fill="url(#phageHeadGrad)" stroke="#e879f9" strokeWidth="2" filter="url(#viralBurst)" />
                        <path d="M 320 60 Q 340 75 360 60 Q 340 90 325 85 Q 355 95 340 100" fill="none" stroke="#ec4899" strokeWidth="3" />
                        <rect x="334" y="115" width="12" height="40" fill="#c084fc" rx="2" />
                        <path d="M 328 160 L 305 180 L 295 190" fill="none" stroke="#e879f9" strokeWidth="2" />
                        <path d="M 352 160 L 375 180 L 385 190" fill="none" stroke="#e879f9" strokeWidth="2" />
                      </g>

                      {/* Virion 2 escaping right */}
                      <g
                        transform="translate(260, 165) scale(0.65)"
                        className="anim-escape-2 cursor-pointer"
                        style={animPlayStyle}
                        onClick={() => handleObjectClick('kapsid')}
                      >
                        <polygon points="340,30 380,55 380,95 340,115 300,95 300,55" fill="url(#phageHeadGrad)" stroke="#e879f9" strokeWidth="2" filter="url(#viralBurst)" />
                        <path d="M 320 60 Q 340 75 360 60 Q 340 90 325 85 Q 355 95 340 100" fill="none" stroke="#ec4899" strokeWidth="3" />
                        <rect x="334" y="115" width="12" height="40" fill="#c084fc" rx="2" />
                        <path d="M 328 160 L 305 180 L 295 190" fill="none" stroke="#e879f9" strokeWidth="2" />
                        <path d="M 352 160 L 375 180 L 385 190" fill="none" stroke="#e879f9" strokeWidth="2" />
                      </g>

                      {/* Virion 3 escaping lower-left */}
                      <g
                        transform="translate(100, 310) scale(0.6)"
                        className="anim-escape-3 cursor-pointer"
                        style={animPlayStyle}
                      >
                        <polygon points="340,30 380,55 380,95 340,115 300,95 300,55" fill="url(#phageHeadGrad)" stroke="#e879f9" strokeWidth="2" />
                        <rect x="334" y="115" width="12" height="40" fill="#c084fc" rx="2" />
                      </g>

                      {/* Virion 4 escaping lower-right */}
                      <g
                        transform="translate(230, 310) scale(0.6)"
                        className="anim-escape-4 cursor-pointer"
                        style={animPlayStyle}
                      >
                        <polygon points="340,30 380,55 380,95 340,115 300,95 300,55" fill="url(#phageHeadGrad)" stroke="#e879f9" strokeWidth="2" />
                        <rect x="334" y="115" width="12" height="40" fill="#c084fc" rx="2" />
                      </g>

                      {/* Free Virion in center rupture */}
                      <g transform="translate(170, 230) scale(0.7)">
                        <polygon points="340,30 380,55 380,95 340,115 300,95 300,55" fill="url(#phageHeadGrad)" stroke="#e879f9" strokeWidth="2" />
                        <rect x="334" y="115" width="12" height="40" fill="#c084fc" rx="2" />
                      </g>

                      {/* Endolysin / Lysozyme Enzyme Particles */}
                      <g onClick={() => handleObjectClick('lisozim')} className="cursor-pointer">
                        <circle cx="270" cy="200" r="4" fill="#fbbf24" filter="url(#lyticGlow)" />
                        <circle cx="410" cy="200" r="4" fill="#fbbf24" filter="url(#lyticGlow)" />
                        <circle cx="280" cy="380" r="4" fill="#fbbf24" filter="url(#lyticGlow)" />
                        <circle cx="400" cy="380" r="4" fill="#fbbf24" filter="url(#lyticGlow)" />
                      </g>

                      {showLabels && (
                        <text
                          x="340"
                          y="155"
                          textAnchor="middle"
                          fill="#fb7185"
                          fontSize="12"
                          fontWeight="bold"
                        >
                          Pelepasan Virion Bebas ke Medium Ekstraseluler
                        </text>
                      )}
                    </g>
                  )}
                </svg>
              </div>
            </div>
          </div>

          {/* Hands-On Virtual Lab Action Toolbar (PhET-style experiment triggers) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-red-100 text-red-700">
                  <Wrench className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Panel Aksi Eksperimen Tahap {currentStep.step}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                Interaksi Laboratorium Langsung
              </span>
            </div>

            {/* Step-Specific Hands-on Action Triggers */}
            {currentStep.step === 1 && (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-slate-600 max-w-md">
                  Pilih bakteriofag dan jalankan penempelan komplementer ke reseptor membran (LPS/OmpC) sel bakteri.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAdsorptionDocked((prev) => !prev)}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer ${
                      adsorptionDocked
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-300'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                  >
                    <Target className="w-4 h-4" />
                    <span>{adsorptionDocked ? 'Reseptor Terkunci (Klik Lepas)' : 'Kunci ke Reseptor LPS/OmpC'}</span>
                  </button>
                </div>
              </div>
            )}

            {currentStep.step === 2 && (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-slate-600 max-w-md">
                  Picukan kontraksi selubung ekor bakteriofag untuk menyuntikkan genom dsDNA menembus membran inang.
                </p>
                <button
                  type="button"
                  onClick={() => setPenetrationInjected((prev) => !prev)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer ${
                    penetrationInjected
                      ? 'bg-purple-700 hover:bg-purple-800 text-white ring-2 ring-purple-300'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>{penetrationInjected ? 'Genom Telah Diinjeksikan (Reset)' : 'Suntikkan dsDNA ke Sitoplasma'}</span>
                </button>
              </div>
            )}

            {currentStep.step === 3 && (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-slate-600 max-w-md">
                  Degradasi kromosom inang dengan enzim nuklease dan jalankan sintesis salinan asam nukleat serta protein kapsomer.
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setSynthesisDegraded((prev) => !prev)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      synthesisDegraded
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    1. {synthesisDegraded ? 'Kromosom Dihidrolisis' : 'Hidrolisis DNA Inang'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSynthesisReplicating((prev) => !prev)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      synthesisReplicating
                        ? 'bg-purple-50 text-purple-700 border-purple-300'
                        : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    2. {synthesisReplicating ? 'Sintesis Berlangsung' : 'Sintesis dsDNA & Kapsomer'}
                  </button>
                </div>
              </div>
            )}

            {currentStep.step === 4 && (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-slate-600 max-w-md">
                  Rakit komponen virus: gabungkan kapsid berisi DNA, leher dan selubung ekor, serta serabut ekor secara terkoordinasi.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAssemblyStage((prev) => (prev < 3 ? prev + 1 : 0))}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Layers className="w-4 h-4" />
                    <span>
                      {assemblyStage === 0
                        ? 'Rakit Tahap 1 (Kapsid + DNA)'
                        : assemblyStage === 1
                        ? 'Rakit Tahap 2 (Pasang Selubung Ekor)'
                        : assemblyStage === 2
                        ? 'Rakit Tahap 3 (Pasang Serabut Ekor)'
                        : 'Semua Virion Terakit (Ulangi)'}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {currentStep.step === 5 && (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-slate-600 max-w-md">
                  Lepaskan enzim endolisin dan holin untuk mencerna peptidoglikan dinding sel dan membebaskan ratusan virion baru.
                </p>
                <button
                  type="button"
                  onClick={() => setLysisPunctured((prev) => !prev)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer ${
                    lysisPunctured
                      ? 'bg-rose-700 hover:bg-rose-800 text-white ring-2 ring-rose-300'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  <span>{lysisPunctured ? 'Lisis Telah Terjadi (Reset)' : 'Picukan Lisis Peptidoglikan'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Primary Controls Bar: Play / Pause / Prev / Next / Speed / Mode */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Playback Button Group */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentStepIndex === 0}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 transition-colors cursor-pointer"
                title="Langkah Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handlePlayToggle}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer ${
                  isPlaying
                    ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 ring-2 ring-amber-300'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
                title={isPlaying ? 'Jeda Simulasi' : 'Mulai / Lanjutkan Simulasi'}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Jeda Simulasi</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Putar Animasi</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={currentStepIndex === LYTIC_SIMULATION_STEPS.length - 1}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 transition-colors cursor-pointer"
                title="Langkah Berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleRestart}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                title="Reset ke Tahap 1 (Kondisi Awal)"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Speed Multiplier & Mode Toggle */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end flex-wrap">
              {/* Speed Buttons */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <Gauge className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-0.5" />
                {[0.5, 1, 1.5, 2].map((sp) => (
                  <button
                    key={sp}
                    type="button"
                    onClick={() => setSpeedMultiplier(sp)}
                    className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      speedMultiplier === sp
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {sp}x
                  </button>
                ))}
              </div>

              {/* Mode Otomatis vs Manual Toggle */}
              <button
                type="button"
                onClick={() => setIsAutoPlayMode((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isAutoPlayMode
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
                title="Ganti Mode Putar Otomatis atau Eksplorasi Manual Mandiri"
              >
                {isAutoPlayMode ? (
                  <>
                    <ToggleRight className="w-4 h-4 text-blue-600" />
                    <span>Mode Otomatis</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-4 h-4 text-slate-400" />
                    <span>Mode Manual (Lab)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right / Bottom: Pedagogical Cards, POEC Prediction, & Notes (4 cols on desktop) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Bio-Inspector Card (if object selected or probe active) */}
          {activeObjectInfo && (
            <BioInspectorCard
              objectInfo={activeObjectInfo}
              onClose={() => setSelectedObjectId(null)}
              isProbeActive={isProbeActive}
            />
          )}

          {/* PhET POEC Prediction Workbench */}
          <PredictionWorkbench
            prediction={currentPrediction}
            hasExecutedSimulation={isPlaying || currentStepIndex > 0}
            onRunSimulationToTest={handlePlayToggle}
            savedAnswerId={savedPredictions[currentPrediction?.id || '']?.optionId}
            onSaveAnswer={handleSavePrediction}
          />

          {/* 3-Point Pedagogical Information Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col gap-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
              Observasi Fenomena Biologis
            </h3>

            {/* Point 1: Apa yang berubah */}
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                1
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Apa yang sedang berubah?
                </span>
                <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                  {currentStep.whatChanges}
                </p>
              </div>
            </div>

            {/* Point 2: Peran DNA Virus */}
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                2
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Peran materi genetik (DNA virus):
                </span>
                <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                  {currentStep.viralDnaRole}
                </p>
              </div>
            </div>

            {/* Point 3: Dampak pada Sel Inang */}
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                3
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Dampak pada sel inang:
                </span>
                <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                  {currentStep.hostCellEffect}
                </p>
              </div>
            </div>
          </div>

          {/* Student Lab Observation Notes */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="lytic-observation-input"
                className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                <span>Buku Catatan Laboratorium</span>
              </label>
              {saveStatus && (
                <span className="text-[10px] font-mono text-emerald-600 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  {saveStatus}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              {currentStep.observationPrompt}
            </p>

            <textarea
              id="lytic-observation-input"
              value={localNote}
              onChange={handleNoteChange}
              placeholder={`Contoh pengamatan: Pada tahap ${currentStep.name}, saya melihat bahwa...`}
              rows={3}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 bg-slate-50/60 text-slate-900 leading-relaxed resize-none"
            />
          </div>
        </div>
      </div>

      {/* Guide Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-burst">
            <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Panduan Eksperimen Virtual Lab PhET
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Laboratorium virtual VIRUSNESIA dirancang agar Anda dapat menguji hipotesis secara mandiri:
            </p>
            <ul className="text-xs text-slate-700 space-y-2 mb-6 list-disc list-inside">
              <li><strong>Pilih Hipotesis:</strong> Tentukan prediksi Anda di panel kanan sebelum menjalankan tahap.</li>
              <li><strong>Aksi Eksperimen:</strong> Gunakan tombol di panel aksi bawah kanvas untuk menguji setiap proses biologis.</li>
              <li><strong>Probe Sensor:</strong> Aktifkan tombol Probe Sensor di toolbar untuk memindai detail molekuler objek di kanvas.</li>
              <li><strong>Zoom & Skala:</strong> Gunakan tombol zoom untuk melihat detail molekuler atau skala nanometer.</li>
            </ul>
            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
            >
              Mengerti & Lanjutkan Eksperimen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
