import React, { useState, useEffect, useRef } from 'react';
import {
  LYSOGENIC_SIMULATION_STEPS,
  LYSOGENIC_PREDICTIONS,
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
  GitFork,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Sun,
  Dna,
  Wrench,
  Activity,
  Layers,
} from 'lucide-react';

interface LysogenicSimulationProps {
  observationNotes: Record<number, string>;
  onSaveObservation: (stepNumber: number, note: string) => void;
  onSimulationCompleted: () => void;
  onOpenComparison?: () => void;
}

export const LysogenicSimulation: React.FC<LysogenicSimulationProps> = ({
  observationNotes,
  onSaveObservation,
  onSimulationCompleted,
  onOpenComparison,
}) => {
  // Navigation & Core States
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isAutoPlayMode, setIsAutoPlayMode] = useState<boolean>(false); // default manual for lab exploration
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);

  // PhET Virtual Lab Tool States
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isProbeActive, setIsProbeActive] = useState<boolean>(false);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [showScale, setShowScale] = useState<boolean>(true);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);

  // Step-Specific Hands-on Lab Experiment States
  // Step 1: Entry & circularization
  const [dnaCircularized, setDnaCircularized] = useState<boolean>(false);
  // Step 2: Prophage integration
  const [prophageIntegrated, setProphageIntegrated] = useState<boolean>(false);
  // Step 3: Binary fission cytokinesis
  const [fissionCompleted, setFissionCompleted] = useState<boolean>(false);
  // Step 4: UV Lamp Intensity (0 - 100) & induction excision
  const [uvIntensity, setUvIntensity] = useState<number>(0);
  const [uvLampOn, setUvLampOn] = useState<boolean>(false);
  const [isExcised, setIsExcised] = useState<boolean>(false);

  // POEC Prediction & Observation
  const [savedPredictions, setSavedPredictions] = useState<Record<string, { optionId: string; reasoning: string }>>({});
  const [localNote, setLocalNote] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<string>('');
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);

  const currentStep = LYSOGENIC_SIMULATION_STEPS[currentStepIndex];
  const currentPrediction = LYSOGENIC_PREDICTIONS[currentStep.step];
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync local observation note when step changes
  useEffect(() => {
    setLocalNote(observationNotes[currentStep.step] || '');
    setSaveStatus('');
  }, [currentStepIndex, observationNotes, currentStep.step]);

  // Load saved predictions from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('virusnesia_lysogenic_predictions');
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
        localStorage.setItem('virusnesia_lysogenic_predictions', JSON.stringify(updated));
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
        if (currentStepIndex < LYSOGENIC_SIMULATION_STEPS.length - 1) {
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

  // Reset experimental states when changing steps
  const resetExperimentalStates = () => {
    setDnaCircularized(false);
    setProphageIntegrated(false);
    setFissionCompleted(false);
    setUvIntensity(0);
    setUvLampOn(false);
    setIsExcised(false);
  };

  const handlePlayToggle = () => {
    setIsPlaying((prev) => !prev);
    if (!isPlaying) {
      if (currentStep.step === 1) setDnaCircularized(true);
      if (currentStep.step === 2) setProphageIntegrated(true);
      if (currentStep.step === 3) setFissionCompleted(true);
      if (currentStep.step === 4) {
        setUvLampOn(true);
        setUvIntensity(80);
        setIsExcised(true);
      }
    }
  };

  const handleRestart = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    resetExperimentalStates();
  };

  const handleNext = () => {
    setIsPlaying(false);
    if (currentStepIndex < LYSOGENIC_SIMULATION_STEPS.length - 1) {
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

  // UV Slider logic
  const handleUvSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setUvIntensity(val);
    if (val > 0) {
      setUvLampOn(true);
    } else {
      setUvLampOn(false);
    }
    if (val >= 45) {
      setIsExcised(true);
    } else {
      setIsExcised(false);
    }
  };

  const handleUvToggle = () => {
    if (!uvLampOn) {
      setUvLampOn(true);
      setUvIntensity(85);
      setIsExcised(true);
    } else {
      setUvLampOn(false);
      setUvIntensity(0);
      setIsExcised(false);
    }
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
      {/* Simulation Stage Header & Stepper */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <GitFork className="w-3.5 h-3.5 text-purple-600" />
              Laboratorium Virtual Siklus Lisogenik
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-medium text-slate-600 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Fase Dorman / Laten Tanpa Lisis
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md font-semibold">
              Model Bakteriofag Lamda
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
            Tahap {currentStep.step}: {currentStep.name} — {currentStep.scientificStage}
          </h2>
        </div>

        {/* 4-Step Stepper & Compare shortcut */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {LYSOGENIC_SIMULATION_STEPS.map((s, idx) => {
              const isCurrent = idx === currentStepIndex;
              const isPast = idx < currentStepIndex;
              return (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => handleStepClick(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                    isCurrent
                      ? 'bg-purple-600 text-white shadow-md ring-2 ring-purple-300'
                      : isPast
                      ? 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  title={`${s.step}. ${s.name}`}
                >
                  {isPast ? <Check className="w-3 h-3 text-purple-600" /> : <span>{s.step}</span>}
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
              title="Bandingkan dengan Siklus Litik"
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
            {/* Top Status Badge */}
            <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between gap-2 pointer-events-none flex-wrap">
              <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 px-3 py-1.5 rounded-xl flex items-center gap-2 pointer-events-auto shadow-md">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-ping" />
                <span className="text-xs font-mono font-bold text-slate-200">
                  Tahap {currentStep.step}/4: {currentStep.name}
                </span>
                {isPlaying && (
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-700">
                    Animasi Aktif
                  </span>
                )}
              </div>

              {/* Status Hint */}
              <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 px-3 py-1.5 rounded-xl text-xs text-amber-300 font-medium pointer-events-auto hidden sm:flex items-center gap-1.5 shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {isProbeActive
                    ? 'Sensor Probe Aktif: Klik objek untuk membaca komposisi'
                    : 'Gunakan tombol kontrol atau slider UV di bawah untuk bereksperimen!'}
                </span>
              </div>
            </div>

            {/* Scale Bar Indicator overlay (if toggled) */}
            {showScale && (
              <div className="absolute bottom-3 left-3 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-700 px-2.5 py-1.5 rounded-xl text-slate-300 text-[11px] font-mono pointer-events-none flex items-center gap-2">
                <span>Skala:</span>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-1.5 bg-purple-400 border border-purple-300 rounded-sm" />
                  <span className="text-[9px] text-purple-300">~60 nm (Fag Lamda)</span>
                </div>
                <div className="w-px h-4 bg-slate-700" />
                <div className="flex flex-col items-center">
                  <div className="w-20 h-1.5 bg-emerald-400 border border-emerald-300 rounded-sm" />
                  <span className="text-[9px] text-emerald-300">~2.000 nm (Bakteri)</span>
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
                  aria-label="Kanvas Simulasi Siklus Lisogenik Bakteriofag"
                >
                  <defs>
                    <filter id="prophageNeonGlow" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <filter id="uvGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="6" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <linearGradient id="lysoCytoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#064e3b" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#022c22" stopOpacity="0.75" />
                    </linearGradient>
                    <linearGradient id="uvBeamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#c084fc" stopOpacity="0.85" />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>

                  {/* Canvas Grid Background */}
                  <g opacity="0.12">
                    <line x1="0" y1="120" x2="680" y2="120" stroke="#a855f7" strokeDasharray="4 4" />
                    <line x1="0" y1="240" x2="680" y2="240" stroke="#a855f7" strokeDasharray="4 4" />
                    <line x1="0" y1="360" x2="680" y2="360" stroke="#a855f7" strokeDasharray="4 4" />
                    <line x1="170" y1="0" x2="170" y2="480" stroke="#a855f7" strokeDasharray="4 4" />
                    <line x1="340" y1="0" x2="340" y2="480" stroke="#a855f7" strokeDasharray="4 4" />
                    <line x1="510" y1="0" x2="510" y2="480" stroke="#a855f7" strokeDasharray="4 4" />
                  </g>

                  {/* STAGE 1, 2, & 4: SINGLE BACTERIAL CELL BODY */}
                  {currentStep.step !== 3 ? (
                    <g
                      id="host-cell-lysogenic"
                      onClick={() => handleObjectClick('dinding_sel')}
                      className="cursor-pointer"
                    >
                      {/* Outer Wall (Healthy Peptidoglycan) */}
                      <rect
                        x="90"
                        y="180"
                        width="500"
                        height="260"
                        rx="120"
                        fill="url(#lysoCytoGrad)"
                        stroke="#10b981"
                        strokeWidth={selectedObjectId === 'dinding_sel' ? '7' : '5'}
                        className={selectedObjectId === 'dinding_sel' ? 'anim-highlight' : ''}
                      />
                      {/* Plasma Membrane */}
                      <rect
                        x="100"
                        y="190"
                        width="480"
                        height="240"
                        rx="110"
                        fill="none"
                        stroke="#34d399"
                        strokeWidth="2"
                        strokeDasharray="6 3"
                        opacity="0.8"
                      />
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
                          Sel Bakteri Utuh & Sehat (Fase Lisogenik)
                        </text>
                      )}
                    </g>
                  ) : null}

                  {/* ============================================================== */}
                  {/* STAGE 1: ADSORPSI & PENETRASI (INFECSI TEMPERATE) */}
                  {/* ============================================================== */}
                  {currentStep.step === 1 && (
                    <g id="lyso-step-1">
                      {/* Phage Lambda docked at top receptor */}
                      <g
                        transform="translate(0, 0)"
                        onClick={() => handleObjectClick('kapsid')}
                        className="cursor-pointer"
                      >
                        {/* Lambda Hexagonal Head */}
                        <polygon
                          points="340,40 375,62 375,100 340,118 305,100 305,62"
                          fill="#7e22ce"
                          stroke="#c084fc"
                          strokeWidth="2"
                          filter="url(#prophageNeonGlow)"
                        />
                        {/* Flexible non-contractile tail of Lambda phage */}
                        <path
                          d="M 340 118 Q 343 140 340 160 Q 338 170 340 180"
                          fill="none"
                          stroke="#a855f7"
                          strokeWidth="6"
                          strokeLinecap="round"
                        />
                        {/* Terminal tail spike & short fibers */}
                        <path d="M 340 180 L 325 185" stroke="#d8b4fe" strokeWidth="2.5" />
                        <path d="M 340 180 L 355 185" stroke="#d8b4fe" strokeWidth="2.5" />
                      </g>

                      {/* Continuous Injected dsDNA streaming down into host cytoplasm */}
                      <g
                        id="incoming-lambda-dna"
                        onClick={() => handleObjectClick('dna_virus')}
                        className="cursor-pointer"
                      >
                        <path
                          d="M 340 85 L 340 180"
                          fill="none"
                          stroke="#d946ef"
                          strokeWidth="3.5"
                          className="anim-dna-stream"
                          style={animPlayStyle}
                        />
                        {/* DNA forming a circular plasmid-like ring in cytoplasm (circularization) */}
                        <ellipse
                          cx="340"
                          cy="235"
                          rx={dnaCircularized ? '30' : '22'}
                          ry={dnaCircularized ? '20' : '15'}
                          fill="none"
                          stroke="#ec4899"
                          strokeWidth="4"
                          strokeDasharray="8 4"
                          className="anim-dna-flow"
                          style={animPlayStyle}
                          filter="url(#prophageNeonGlow)"
                        />
                        {showLabels && (
                          <text
                            x="430"
                            y="235"
                            fill="#f472b6"
                            fontSize="11"
                            fontWeight="bold"
                          >
                            dsDNA Virus Sirkular (Dorman)
                          </text>
                        )}
                      </g>

                      {/* Intact Bacterial Chromosome (green, below the circular viral DNA) */}
                      <g
                        onClick={() => handleObjectClick('kromosom_bakteri')}
                        className="cursor-pointer"
                      >
                        <ellipse
                          cx="340"
                          cy="320"
                          rx="110"
                          ry="50"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="3.5"
                          strokeDasharray="9 4"
                          className="anim-dna-flow"
                          style={animPlayStyle}
                        />
                        {showLabels && (
                          <text
                            x="340"
                            y="325"
                            textAnchor="middle"
                            fill="#34d399"
                            fontSize="10"
                            fontWeight="bold"
                          >
                            Kromosom Bakteri Utuh (Tanpa Kerusakan)
                          </text>
                        )}
                      </g>
                    </g>
                  )}

                  {/* ============================================================== */}
                  {/* STAGE 2: PENGGABUNGAN DNA & PEMBENTUKAN PROFAG */}
                  {/* ============================================================== */}
                  {currentStep.step === 2 && (
                    <g id="lyso-step-2">
                      {/* Ghost capsid remains outside quietly */}
                      <polygon
                        points="340,40 375,62 375,100 340,118 305,100 305,62"
                        fill="none"
                        stroke="#64748b"
                        strokeWidth="1.5"
                        strokeDasharray="4 2"
                        opacity="0.3"
                      />
                      <path d="M 340 118 L 340 180" stroke="#64748b" strokeWidth="2" strokeDasharray="3 3" opacity="0.3" />

                      {/* Moving / Integrating Prophage Sequence */}
                      <g id="chromosome-with-prophage">
                        {/* Main Host Bacterial Chromosome Arc (Green) */}
                        <path
                          d="M 230 300 C 230 240 300 240 340 250 C 370 250 410 245 440 270 C 470 300 450 350 420 365 C 380 380 300 380 260 360 C 230 340 230 310 230 300 Z"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="4"
                          strokeDasharray="9 4"
                          className="anim-dna-flow"
                          style={animPlayStyle}
                          onClick={() => handleObjectClick('kromosom_bakteri')}
                        />

                        {/* Integrated Prophage Segment (Vibrant Glowing Magenta) */}
                        <g
                          id="prophage-segment"
                          onClick={() => handleObjectClick('profag')}
                          className="cursor-pointer"
                        >
                          <path
                            d="M 320 248 Q 340 245 365 248 Q 390 252 400 258"
                            fill="none"
                            stroke="#ec4899"
                            strokeWidth={selectedObjectId === 'profag' ? '7' : '5.5'}
                            strokeLinecap="round"
                            filter="url(#prophageNeonGlow)"
                            className={selectedObjectId === 'profag' ? 'anim-highlight' : 'anim-prophage-integrate'}
                            style={animPlayStyle}
                          />

                          {/* Pulsing Prophage Badge Pin */}
                          <g transform="translate(360, 220)">
                            <rect
                              x="-38"
                              y="-16"
                              width="76"
                              height="22"
                              rx="11"
                              fill="#701a75"
                              stroke="#f472b6"
                              strokeWidth="2"
                              filter="url(#prophageNeonGlow)"
                            />
                            <text
                              x="0"
                              y="-2"
                              textAnchor="middle"
                              fill="#fdf4ff"
                              fontSize="10"
                              fontWeight="bold"
                              fontFamily="sans-serif"
                            >
                              ★ PROFAG
                            </text>
                          </g>

                          {/* Integrase Enzyme Molecule representation */}
                          <g onClick={() => handleObjectClick('enzim_integrase')} className="cursor-pointer">
                            <circle cx="320" cy="248" r="5" fill="#f59e0b" filter="url(#prophageNeonGlow)" />
                            <circle cx="400" cy="258" r="5" fill="#f59e0b" filter="url(#prophageNeonGlow)" />
                          </g>

                          {showLabels && (
                            <g>
                              <text x="360" y="278" textAnchor="middle" fill="#f472b6" fontSize="10" fontWeight="bold">
                                DNA Virus Menyatu Kovalen (Rekombinasi attB/attP)
                              </text>
                              <text x="340" y="340" textAnchor="middle" fill="#6ee7b7" fontSize="10">
                                Kromosom Bakteri Inang
                              </text>
                            </g>
                          )}
                        </g>
                      </g>
                    </g>
                  )}

                  {/* ============================================================== */}
                  {/* STAGE 3: PEMBELAHAN BAKTERI (BINARY FISSION & PEWARISAN) */}
                  {/* ============================================================== */}
                  {currentStep.step === 3 && (
                    <g id="lyso-step-3" className="cursor-pointer" onClick={() => handleObjectClick('sel_anak')}>
                      {/* Dynamic Cytokinesis: Left Daughter Cell */}
                      <g className={fissionCompleted ? '' : 'anim-fission-left'} style={animPlayStyle}>
                        {/* Left Cell Body */}
                        <rect
                          x="90"
                          y="200"
                          width="240"
                          height="200"
                          rx="90"
                          fill="url(#lysoCytoGrad)"
                          stroke="#10b981"
                          strokeWidth="4"
                        />
                        {/* Left Chromosome with Prophage */}
                        <ellipse
                          cx="210"
                          cy="300"
                          rx="55"
                          ry="35"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="3"
                          strokeDasharray="6 3"
                          className="anim-dna-flow"
                          style={animPlayStyle}
                        />
                        {/* Left Prophage Segment */}
                        <path
                          d="M 190 268 Q 210 265 230 268"
                          fill="none"
                          stroke="#ec4899"
                          strokeWidth="5"
                          strokeLinecap="round"
                          filter="url(#prophageNeonGlow)"
                        />
                        <text
                          x="210"
                          y="260"
                          textAnchor="middle"
                          fill="#f472b6"
                          fontSize="9"
                          fontWeight="bold"
                        >
                          Profag
                        </text>
                        <text
                          x="210"
                          y="380"
                          textAnchor="middle"
                          fill="#a7f3d0"
                          fontSize="11"
                          fontWeight="bold"
                        >
                          Sel Anak 1
                        </text>
                      </g>

                      {/* Dynamic Cytokinesis: Right Daughter Cell */}
                      <g className={fissionCompleted ? '' : 'anim-fission-right'} style={animPlayStyle}>
                        {/* Right Cell Body */}
                        <rect
                          x="350"
                          y="200"
                          width="240"
                          height="200"
                          rx="90"
                          fill="url(#lysoCytoGrad)"
                          stroke="#10b981"
                          strokeWidth="4"
                        />
                        {/* Right Chromosome with Prophage */}
                        <ellipse
                          cx="470"
                          cy="300"
                          rx="55"
                          ry="35"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="3"
                          strokeDasharray="6 3"
                          className="anim-dna-flow"
                          style={animPlayStyle}
                        />
                        {/* Right Prophage Segment */}
                        <path
                          d="M 450 268 Q 470 265 490 268"
                          fill="none"
                          stroke="#ec4899"
                          strokeWidth="5"
                          strokeLinecap="round"
                          filter="url(#prophageNeonGlow)"
                        />
                        <text
                          x="470"
                          y="260"
                          textAnchor="middle"
                          fill="#f472b6"
                          fontSize="9"
                          fontWeight="bold"
                        >
                          Profag
                        </text>
                        <text
                          x="470"
                          y="380"
                          textAnchor="middle"
                          fill="#a7f3d0"
                          fontSize="11"
                          fontWeight="bold"
                        >
                          Sel Anak 2
                        </text>
                      </g>

                      {/* Cleavage Furrow (Pinch furrow in center) */}
                      <path
                        d="M 340 190 Q 335 240 340 300 Q 345 360 340 410"
                        fill="none"
                        stroke="#059669"
                        strokeWidth="3.5"
                        strokeDasharray="4 3"
                        className="anim-furrow-pinch"
                        style={animPlayStyle}
                      />

                      {showLabels && (
                        <text
                          x="340"
                          y="165"
                          textAnchor="middle"
                          fill="#34d399"
                          fontSize="12"
                          fontWeight="bold"
                        >
                          Sitokinesis: Kedua Sel Anak Mewarisi Salinan Profag
                        </text>
                      )}
                    </g>
                  )}

                  {/* ============================================================== */}
                  {/* STAGE 4: INDUKSI (PAPARAN UV & PELEPASAN PROFAG) */}
                  {/* ============================================================== */}
                  {currentStep.step === 4 && (
                    <g id="lyso-step-4">
                      {/* UV Radiation Lamp Beam (Triggered when UV Lamp is on) */}
                      {uvLampOn && uvIntensity > 0 && (
                        <g id="uv-radiation-beam">
                          <polygon
                            points="340,30 200,180 480,180"
                            fill="url(#uvBeamGrad)"
                            opacity={Math.min(0.9, 0.2 + (uvIntensity / 100) * 0.7)}
                            filter="url(#uvGlow)"
                          />
                          {/* UV Photons Wave Lines */}
                          <path
                            d="M 280 60 Q 340 90 400 60"
                            fill="none"
                            stroke="#e879f9"
                            strokeWidth="2.5"
                            strokeDasharray="5 3"
                            className="anim-dna-flow"
                            style={animPlayStyle}
                          />
                          <path
                            d="M 250 110 Q 340 140 430 110"
                            fill="none"
                            stroke="#e879f9"
                            strokeWidth="2.5"
                            strokeDasharray="5 3"
                            className="anim-dna-flow"
                            style={animPlayStyle}
                          />
                        </g>
                      )}

                      {/* Host Chromosome (with excision gap) */}
                      <path
                        d="M 230 320 C 230 260 300 260 330 270 M 370 270 C 400 260 450 260 450 320 C 450 370 380 380 340 350 C 300 380 230 370 230 320 Z"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="4"
                        strokeDasharray="9 4"
                        className="anim-dna-flow"
                        style={animPlayStyle}
                        onClick={() => handleObjectClick('kromosom_bakteri')}
                      />

                      {/* Prophage popping out / excision */}
                      <g
                        id="excised-prophage"
                        onClick={() => handleObjectClick('profag')}
                        className={`cursor-pointer ${isExcised || isPlaying ? 'anim-excision' : ''}`}
                        style={animPlayStyle}
                      >
                        {/* Circularized released viral DNA */}
                        <ellipse
                          cx="350"
                          cy={isExcised ? '225' : '265'}
                          rx="28"
                          ry="18"
                          fill="none"
                          stroke="#ec4899"
                          strokeWidth="4.5"
                          strokeDasharray="6 3"
                          filter="url(#prophageNeonGlow)"
                        />
                        <text
                          x="350"
                          y={isExcised ? '220' : '260'}
                          textAnchor="middle"
                          fill="#fdf4ff"
                          fontSize="9"
                          fontWeight="bold"
                        >
                          DNA Virus Bebas
                        </text>
                      </g>

                      {/* Excision enzyme molecule tags */}
                      <circle cx="330" cy="270" r="4.5" fill="#f59e0b" filter="url(#prophageNeonGlow)" />
                      <circle cx="370" cy="270" r="4.5" fill="#f59e0b" filter="url(#prophageNeonGlow)" />

                      {showLabels && (
                        <g>
                          <text
                            x="340"
                            y="160"
                            textAnchor="middle"
                            fill="#f472b6"
                            fontSize="12"
                            fontWeight="bold"
                            filter="url(#prophageNeonGlow)"
                          >
                            Induksi: Profag Terlepas & Transisi ke Siklus Litik
                          </text>
                          <text
                            x="340"
                            y="330"
                            textAnchor="middle"
                            fill="#6ee7b7"
                            fontSize="10"
                            fontWeight="medium"
                          >
                            Kromosom Bakteri Pulih Celahnya
                          </text>
                        </g>
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
                <span className="p-1 rounded-md bg-purple-100 text-purple-700">
                  <Wrench className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Panel Aksi Eksperimen Tahap {currentStep.step}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                Interaksi Lisogenik Langsung
              </span>
            </div>

            {/* Step-Specific Hands-on Action Triggers */}
            {currentStep.step === 1 && (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-slate-600 max-w-md">
                  Injeksi materi genetik Fag Lamda dan sirkularisasi DNA virus di sitoplasma tanpa menghancurkan sel inang.
                </p>
                <button
                  type="button"
                  onClick={() => setDnaCircularized((prev) => !prev)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer ${
                    dnaCircularized
                      ? 'bg-purple-700 hover:bg-purple-800 text-white ring-2 ring-purple-300'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  <Dna className="w-4 h-4" />
                  <span>{dnaCircularized ? 'dsDNA Bersirkular (Reset)' : 'Sirkularisasi dsDNA Virus'}</span>
                </button>
              </div>
            )}

            {currentStep.step === 2 && (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-slate-600 max-w-md">
                  Gunakan enzim integrase untuk menyisipkan DNA virus ke situs spesifik (attB/attP) kromosom inang membentuk <strong>PROFAG</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => setProphageIntegrated((prev) => !prev)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer ${
                    prophageIntegrated
                      ? 'bg-fuchsia-700 hover:bg-fuchsia-800 text-white ring-2 ring-fuchsia-300'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{prophageIntegrated ? 'Profag Terintegrasi (Reset)' : 'Picukan Rekombinasi attB-attP'}</span>
                </button>
              </div>
            )}

            {currentStep.step === 3 && (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-slate-600 max-w-md">
                  Jalankan pembelahan biner sel bakteri. Amati bagaimana kedua sel anak mewarisi salinan kromosom yang membawa profag.
                </p>
                <button
                  type="button"
                  onClick={() => setFissionCompleted((prev) => !prev)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer ${
                    fissionCompleted
                      ? 'bg-emerald-700 hover:bg-emerald-800 text-white ring-2 ring-emerald-300'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  <GitFork className="w-4 h-4" />
                  <span>{fissionCompleted ? 'Pembelahan Selesai (Ulangi)' : 'Picukan Pembelahan Biner'}</span>
                </button>
              </div>
            )}

            {currentStep.step === 4 && (
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                      <Sun className="w-4 h-4 text-amber-500" />
                      Lampu Radiasi Ultraviolet (UV 254 nm)
                    </span>
                    <p className="text-xs text-slate-600 max-w-md mt-0.5">
                      Tingkatkan intensitas radiasi UV untuk merangsang respons stres RecA dan melepaskan profag (eksisi).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleUvToggle}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer flex items-center gap-1.5 ${
                      uvLampOn
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-sm'
                        : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    <Sun className="w-4 h-4" />
                    <span>{uvLampOn ? 'Lampu UV: AKTIF (ON)' : 'Lampu UV: MATI (OFF)'}</span>
                  </button>
                </div>

                {/* PhET UV Intensity Slider */}
                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-xs font-mono font-semibold text-slate-600 shrink-0">
                    Intensitas UV:
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={uvIntensity}
                    onChange={handleUvSliderChange}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <span className="font-mono text-xs font-bold text-purple-700 min-w-[45px] text-right">
                    {uvIntensity}%
                  </span>
                </div>

                {isExcised && (
                  <div className="text-[11px] text-fuchsia-800 bg-fuchsia-50 border border-fuchsia-200 p-2 rounded-lg flex items-center justify-between animate-burst">
                    <span>
                      ✓ Sinar UV &gt; 45% memicu protein RecA merusak repressor! Enzim eksisiase berhasil memotong profag keluar.
                    </span>
                    {onOpenComparison && (
                      <button
                        type="button"
                        onClick={onOpenComparison}
                        className="underline font-bold text-indigo-700 hover:text-indigo-900 cursor-pointer ml-2 shrink-0"
                      >
                        Bandingkan dengan Litik →
                      </button>
                    )}
                  </div>
                )}
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
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
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
                disabled={currentStepIndex === LYSOGENIC_SIMULATION_STEPS.length - 1}
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
                    ? 'bg-purple-50 border-purple-200 text-purple-700'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
                title="Ganti Mode Putar Otomatis atau Eksplorasi Manual Mandiri"
              >
                {isAutoPlayMode ? (
                  <>
                    <ToggleRight className="w-4 h-4 text-purple-600" />
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
              <div className="w-5 h-5 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
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
              <div className="w-5 h-5 rounded-md bg-fuchsia-100 text-fuchsia-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
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
                htmlFor="lysogenic-observation-input"
                className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
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
              id="lysogenic-observation-input"
              value={localNote}
              onChange={handleNoteChange}
              placeholder={`Contoh pengamatan: Pada tahap ${currentStep.name}, saya melihat bahwa...`}
              rows={3}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50/60 text-slate-900 leading-relaxed resize-none"
            />
          </div>
        </div>
      </div>

      {/* Guide Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-burst">
            <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Panduan Eksperimen Siklus Lisogenik
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Siklus lisogenik menunjukkan bagaimana virus memperbanyak materi genetiknya secara damai tanpa merusak sel inang:
            </p>
            <ul className="text-xs text-slate-700 space-y-2 mb-6 list-disc list-inside">
              <li><strong>Pembentukan Profag:</strong> Enzim integrase menyisipkan dsDNA virus ke kromosom bakteri pada tahap 2.</li>
              <li><strong>Pewarisan:</strong> Pada tahap 3, pembelahan biner menghasilkan 2 sel anak yang masing-masing mewarisi profag.</li>
              <li><strong>Eksperimen Lampu UV:</strong> Pada tahap 4, gunakan slider lampu UV untuk menginduksi profag melepaskan diri dan beralih ke siklus litik!</li>
            </ul>
            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="w-full py-2.5 rounded-xl bg-purple-700 text-white font-bold text-xs hover:bg-purple-800 transition-colors"
            >
              Mengerti & Lanjutkan Eksperimen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
