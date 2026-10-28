import React, { useState, useEffect, useRef } from 'react';
import { LYSOGENIC_SIMULATION_STEPS, INTERACTIVE_SIMULATION_OBJECTS } from '../../data/learningContent';
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
  ShieldCheck,
  Sun,
  X,
  ArrowLeftRight,
  Sparkles,
  ToggleLeft,
  ToggleRight,
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
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isAutoPlayMode, setIsAutoPlayMode] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [localNote, setLocalNote] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<string>('');

  const currentStep = LYSOGENIC_SIMULATION_STEPS[currentStepIndex];
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setLocalNote(observationNotes[currentStep.step] || '');
    setSaveStatus('');
  }, [currentStepIndex, observationNotes, currentStep.step]);

  useEffect(() => {
    if (isPlaying) {
      if (isAutoPlayMode) {
        const durationMs = (currentStep.durationSec * 1000) / speedMultiplier;
        timerRef.current = setTimeout(() => {
          if (currentStepIndex < LYSOGENIC_SIMULATION_STEPS.length - 1) {
            setCurrentStepIndex((prev) => prev + 1);
          } else {
            setIsPlaying(false);
            onSimulationCompleted();
          }
        }, durationMs);
      }
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

  const handlePlayToggle = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleRestart = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleNext = () => {
    setIsPlaying(false);
    if (currentStepIndex < LYSOGENIC_SIMULATION_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setIsPlaying(false);
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleStepClick = (index: number) => {
    setIsPlaying(false);
    setCurrentStepIndex(index);
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

  // Animation play-state style helper
  const animPlayStyle = {
    animationPlayState: isPlaying ? 'running' : 'paused',
  } as React.CSSProperties;

  return (
    <div className="flex flex-col gap-6">
      {/* Simulation Stage Header & Stepper */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              Siklus Lisogenik (Temperate)
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-medium text-emerald-700 flex items-center gap-1">
              Inang Bertahan Hidup (Integrasi Profag)
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Tahap {currentStep.step}: {currentStep.name} — {currentStep.scientificStage}
          </h2>
        </div>

        {/* 4-Step Stepper & Compare shortcut */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {LYSOGENIC_SIMULATION_STEPS.map((s, idx) => {
              const active = idx === currentStepIndex;
              const past = idx < currentStepIndex;
              return (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => handleStepClick(idx)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-purple-600 text-white font-bold shadow-sm ring-2 ring-purple-200'
                      : past
                      ? 'bg-purple-50 text-purple-800 hover:bg-purple-100'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  aria-label={`Pilih tahap ${s.step}: ${s.name}`}
                >
                  <span className="font-mono">{s.step}</span>
                  <span>{s.name}</span>
                </button>
              );
            })}
          </div>

          {onOpenComparison && (
            <button
              type="button"
              onClick={onOpenComparison}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              title="Bandingkan dengan Siklus Litik"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Bandingkan</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Simulation Viewport & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Zone: Interactive SVG Canvas (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-md flex flex-col items-center relative overflow-hidden">
          {/* Status Header */}
          <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-2 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className={`font-mono font-bold ${isPlaying ? 'text-emerald-400' : 'text-amber-400'}`}>
                STATUS: {isPlaying ? 'BERPUTAR (RUNNING)' : 'DIJEDA (PAUSED)'}
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">
                Mode: {isAutoPlayMode ? 'Otomatis' : 'Manual'}
              </span>
            </div>
            <div className="text-[11px] text-purple-300">
              💡 Klik bagian objek untuk melihat fungsi molekuler
            </div>
          </div>

          {/* Dynamic SVG Animation for Lysogenic Stages */}
          <div className="w-full h-[370px] flex items-center justify-center relative select-none">
            <svg
              viewBox="0 0 500 380"
              className="w-full h-full"
              aria-label={`Visualisasi animasi siklus lisogenik tahap ${currentStep.name}`}
            >
              <defs>
                <linearGradient id="lysoBacCytoplasm" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#064e3b" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#022c22" stopOpacity="0.95" />
                </linearGradient>
                <linearGradient id="lysoBacWall" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>

                <filter id="lysoObjectGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#c084fc" floodOpacity="0.9" />
                </filter>
              </defs>

              <pattern id="lysoGridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
              </pattern>
              <rect width="500" height="380" fill="url(#lysoGridPattern)" />

              {/* ----------------- TAHAP 1: ADSORPSI & PENETRASI ----------------- */}
              {currentStepIndex === 0 && (
                <g id="lyso-stage1" style={animPlayStyle}>
                  {/* Single Bacterium */}
                  <rect
                    x="75"
                    y="130"
                    width="350"
                    height="170"
                    rx="85"
                    fill="none"
                    stroke="#059669"
                    strokeWidth="8"
                    strokeOpacity="0.4"
                    className="cursor-pointer"
                    onClick={() => handleObjectClick('dinding_sel')}
                  />
                  <rect
                    x="80"
                    y="135"
                    width="340"
                    height="160"
                    rx="80"
                    fill="url(#lysoBacCytoplasm)"
                    stroke="url(#lysoBacWall)"
                    strokeWidth="4"
                    className="cursor-pointer"
                    onClick={() => handleObjectClick('dinding_sel')}
                  />

                  {/* Healthy Circular Bacterial Chromosome (Green) */}
                  <g
                    className="cursor-pointer"
                    onClick={() => handleObjectClick('kromosom_bakteri')}
                    filter={selectedObjectId === 'kromosom_bakteri' ? 'url(#lysoObjectGlow)' : undefined}
                  >
                    <ellipse cx="250" cy="225" rx="85" ry="38" fill="none" stroke="#34d399" strokeWidth="3.5" strokeDasharray="8 3" />
                    <text x="250" y="230" fill="#a7f3d0" fontSize="10" textAnchor="middle">
                      Kromosom Bakteri (Utuh & Sehat)
                    </text>
                  </g>

                  {/* Temperate Lambda Phage perched on top */}
                  <g
                    transform="translate(250, 75)"
                    className="cursor-pointer"
                    onClick={() => handleObjectClick('kapsid')}
                  >
                    <polygon points="0,-45 20,-25 20,0 0,15 -20,0 -20,-25" fill="#581c87" stroke="#c084fc" strokeWidth="1.5" />
                    <text x="0" y="-12" fill="#e9d5ff" fontSize="9" textAnchor="middle">
                      Ghost
                    </text>
                    <rect x="-5" y="15" width="10" height="18" fill="#1e40af" rx="2" />
                    <rect x="-8" y="33" width="16" height="4" fill="#0284c7" />
                    <path d="M -8,35 Q -20,44 -24,55" fill="none" stroke="#60a5fa" strokeWidth="2" />
                    <path d="M 8,35 Q 20,44 24,55" fill="none" stroke="#60a5fa" strokeWidth="2" />
                  </g>

                  {/* DNA Jet Stream with traveling stream */}
                  <g
                    className="cursor-pointer"
                    onClick={() => handleObjectClick('dna_virus')}
                    filter={selectedObjectId === 'dna_virus' ? 'url(#lysoObjectGlow)' : undefined}
                  >
                    <path
                      d="M 250,115 L 250,145 Q 250,170 235,178"
                      fill="none"
                      stroke="#ec4899"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      className="anim-dna-stream"
                      style={animPlayStyle}
                    />
                    {/* Circled viral DNA formed in cytoplasm with animated flow */}
                    <ellipse
                      cx="230"
                      cy="180"
                      rx="22"
                      ry="12"
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="3"
                      className="anim-dna-flow"
                      style={animPlayStyle}
                    />
                  </g>

                  <text x="310" y="150" fill="#f43f5e" fontSize="11" fontWeight="bold">
                    Injeksi & Sirkularisasi DNA
                  </text>
                </g>
              )}

              {/* ----------------- TAHAP 2: PENGGABUNGAN (DYNAMIC INTEGRATION MOTION) ----------------- */}
              {currentStepIndex === 1 && (
                <g id="lyso-stage2" style={animPlayStyle}>
                  {/* Single Bacterium */}
                  <rect x="75" y="130" width="350" height="170" rx="85" fill="none" stroke="#059669" strokeWidth="8" strokeOpacity="0.4" />
                  <rect x="80" y="135" width="340" height="160" rx="80" fill="url(#lysoBacCytoplasm)" stroke="url(#lysoBacWall)" strokeWidth="4" />

                  {/* Base Bacterial Chromosome */}
                  <ellipse
                    cx="250"
                    cy="215"
                    rx="85"
                    ry="42"
                    fill="none"
                    stroke="#34d399"
                    strokeWidth="3.5"
                    strokeDasharray="8 3"
                    className="cursor-pointer"
                    onClick={() => handleObjectClick('kromosom_bakteri')}
                  />

                  {/* Incoming Viral DNA moving towards chromosome and splicing */}
                  <g className="anim-prophage-integrate" style={animPlayStyle}>
                    {/* Moving plasmid segment joining chromosome */}
                    <ellipse cx="250" cy="170" rx="20" ry="10" fill="none" stroke="#f43f5e" strokeWidth="3" strokeDasharray="4 2" />
                  </g>

                  {/* Integrated Prophage on the chromosome (Glowing Violet/Pink Segment with clear label) */}
                  <g
                    className="cursor-pointer"
                    onClick={() => handleObjectClick('profag')}
                    filter="url(#lysoObjectGlow)"
                  >
                    <path
                      d="M 290,180 A 85 42 0 0 1 330,225"
                      fill="none"
                      stroke="#d946ef"
                      strokeWidth="8"
                      strokeLinecap="round"
                      className="anim-pulse-subtle"
                      style={animPlayStyle}
                    />
                    {/* Repressor CI badge */}
                    <circle cx="310" cy="200" r="7" fill="#ec4899" />
                    <text x="310" y="204" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                      CI
                    </text>
                  </g>

                  {/* Integrase Enzyme Action Indicators */}
                  <circle cx="290" cy="180" r="4.5" fill="#38bdf8" className="anim-pulse-subtle" style={animPlayStyle} />
                  <circle cx="330" cy="225" r="4.5" fill="#38bdf8" className="anim-pulse-subtle" style={animPlayStyle} />

                  {/* Explanatory Annotations & Labels */}
                  <line x1="330" y1="210" x2="385" y2="190" stroke="#f472b6" strokeWidth="1.5" strokeDasharray="3 3" />
                  <g
                    className="cursor-pointer"
                    onClick={() => handleObjectClick('profag')}
                  >
                    <rect x="380" y="165" width="90" height="42" rx="8" fill="#581c87" stroke="#d946ef" strokeWidth="1.5" />
                    <text x="425" y="182" fill="#fbcfe8" fontSize="11" fontWeight="bold" textAnchor="middle">
                      PROFAG
                    </text>
                    <text x="425" y="196" fill="#cbd5e1" fontSize="9" textAnchor="middle">
                      (DNA Terintegrasi)
                    </text>
                  </g>

                  <text x="210" y="220" fill="#a7f3d0" fontSize="11" textAnchor="middle">
                    DNA Kromosom Bakteri
                  </text>
                  <text x="250" y="150" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">
                    Gerakan Integrasi Genetik: Enzim Integrase Menyisipkan Profag
                  </text>
                </g>
              )}

              {/* ----------------- TAHAP 3: PEMBELAHAN BAKTERI (DYNAMIC BINARY FISSION) ----------------- */}
              {currentStepIndex === 2 && (
                <g id="lyso-stage3" style={animPlayStyle}>
                  {/* Left Daughter Cell moving left during cytokinesis */}
                  <g
                    className="cursor-pointer anim-fission-left"
                    onClick={() => handleObjectClick('sel_anak')}
                    style={animPlayStyle}
                  >
                    <rect x="40" y="140" width="190" height="150" rx="65" fill="none" stroke="#059669" strokeWidth="6" strokeOpacity="0.4" />
                    <rect x="45" y="145" width="180" height="140" rx="60" fill="url(#lysoBacCytoplasm)" stroke="url(#lysoBacWall)" strokeWidth="3" />
                    {/* Chromosome with Prophage */}
                    <ellipse cx="135" cy="215" rx="52" ry="28" fill="none" stroke="#34d399" strokeWidth="2.5" strokeDasharray="6 3" />
                    <path
                      d="M 165,195 A 52 28 0 0 1 187,225"
                      fill="none"
                      stroke="#d946ef"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    <text x="135" y="220" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                      Sel Anak 1 + Profag
                    </text>
                  </g>

                  {/* Right Daughter Cell moving right during cytokinesis */}
                  <g
                    className="cursor-pointer anim-fission-right"
                    onClick={() => handleObjectClick('sel_anak')}
                    style={animPlayStyle}
                  >
                    <rect x="250" y="140" width="190" height="150" rx="65" fill="none" stroke="#059669" strokeWidth="6" strokeOpacity="0.4" />
                    <rect x="255" y="145" width="180" height="140" rx="60" fill="url(#lysoBacCytoplasm)" stroke="url(#lysoBacWall)" strokeWidth="3" />
                    {/* Replicated Chromosome with Prophage */}
                    <ellipse cx="345" cy="215" rx="52" ry="28" fill="none" stroke="#34d399" strokeWidth="2.5" strokeDasharray="6 3" />
                    <path
                      d="M 375,195 A 52 28 0 0 1 397,225"
                      fill="none"
                      stroke="#d946ef"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    <text x="345" y="220" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                      Sel Anak 2 + Profag
                    </text>
                  </g>

                  {/* Cleavage furrow pinching in the center */}
                  <g className="anim-furrow-pinch" style={animPlayStyle}>
                    <line x1="240" y1="135" x2="240" y2="295" stroke="#38bdf8" strokeWidth="3" strokeDasharray="6 3" />
                    <polygon points="235,135 245,135 240,150" fill="#38bdf8" />
                    <polygon points="235,295 245,295 240,280" fill="#38bdf8" />
                  </g>

                  <text x="250" y="90" fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle">
                    Gerakan Pembelahan Biner: Kedua Sel Anak Sehat Mewarisi Profag
                  </text>
                  <text x="250" y="108" fill="#cbd5e1" fontSize="10" textAnchor="middle">
                    Pewarisan Gen Virus Dorman Tanpa Menghancurkan Sel Bakteri
                  </text>
                </g>
              )}

              {/* ----------------- TAHAP 4: INDUKSI (EXCISION MOTION) ----------------- */}
              {currentStepIndex === 3 && (
                <g id="lyso-stage4" style={animPlayStyle}>
                  {/* Single Bacterium under stress */}
                  <rect x="75" y="130" width="350" height="170" rx="85" fill="none" stroke="#eab308" strokeWidth="6" strokeOpacity="0.4" />
                  <rect x="80" y="135" width="340" height="160" rx="80" fill="url(#lysoBacCytoplasm)" stroke="#eab308" strokeWidth="3" />

                  {/* UV Radiation Rays actively beaming */}
                  <g
                    transform="translate(250, 40)"
                    className="cursor-pointer anim-uv-beam"
                    onClick={() => handleObjectClick('radiasi_uv')}
                    style={animPlayStyle}
                  >
                    <circle cx="0" cy="0" r="16" fill="#facc15" />
                    <line x1="0" y1="20" x2="-80" y2="135" stroke="#fef08a" strokeWidth="2.5" strokeDasharray="4 2" />
                    <line x1="0" y1="20" x2="0" y2="135" stroke="#fef08a" strokeWidth="3" strokeDasharray="4 2" />
                    <line x1="0" y1="20" x2="80" y2="135" stroke="#fef08a" strokeWidth="2.5" strokeDasharray="4 2" />
                    <text x="0" y="4" fill="#713f12" fontSize="10" fontWeight="bold" textAnchor="middle">
                      UV
                    </text>
                  </g>

                  {/* Chromosome with excision gap */}
                  <ellipse cx="250" cy="225" rx="85" ry="38" fill="none" stroke="#34d399" strokeWidth="3" strokeDasharray="8 3" />

                  {/* Prophage Actively Spliced Out (Excision Motion) into Free Circular Viral DNA */}
                  <g
                    className="cursor-pointer anim-excision"
                    onClick={() => handleObjectClick('dna_virus')}
                    filter="url(#lysoObjectGlow)"
                    style={animPlayStyle}
                  >
                    <ellipse
                      cx="250"
                      cy="175"
                      rx="32"
                      ry="18"
                      fill="none"
                      stroke="#ec4899"
                      strokeWidth="4"
                      className="anim-dna-flow"
                      style={animPlayStyle}
                    />
                    <circle cx="250" cy="175" r="5" fill="#f43f5e" />
                  </g>

                  <line x1="285" y1="175" x2="350" y2="165" stroke="#ec4899" strokeWidth="1" strokeDasharray="3 3" />
                  <text x="355" y="163" fill="#ec4899" fontSize="11" fontWeight="bold">
                    DNA Virus Bebas
                  </text>
                  <text x="355" y="176" fill="#fca5a5" fontSize="9">
                    Beralih Memasuki Siklus Litik!
                  </text>

                  <text x="250" y="275" fill="#fde047" fontSize="12" fontWeight="bold" textAnchor="middle">
                    Gerakan Induksi: Enzim Eksisiase Memotong Profag Keluar (Transisi ke Litik)
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* Interactive Clickable Info Box */}
          {activeObjectInfo && (
            <div className="w-full mt-2 p-3.5 bg-slate-800/95 border border-purple-500/50 rounded-xl text-xs text-slate-200 flex items-start justify-between gap-3 shadow-lg animate-in fade-in">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-purple-300 text-sm">
                    {activeObjectInfo.name}
                  </span>
                  <span className="text-[10px] font-mono uppercase bg-purple-950 text-purple-300 px-2 py-0.5 rounded">
                    {activeObjectInfo.category}
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {activeObjectInfo.scientificRole}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedObjectId(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                aria-label="Tutup info objek"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Bottom Player Controls Deck */}
          <div className="w-full mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentStepIndex === 0}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 transition-colors cursor-pointer"
                title="Tahap Sebelumnya"
                aria-label="Tahap Sebelumnya"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handlePlayToggle}
                className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-sm cursor-pointer ${
                  isPlaying
                    ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                    : 'bg-purple-600 hover:bg-purple-500 text-white'
                }`}
                aria-label={isPlaying ? 'Jeda Simulasi' : 'Putar / Lanjutkan Simulasi'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                <span>{isPlaying ? 'Jeda' : currentStepIndex > 0 ? 'Lanjutkan' : 'Putar'}</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={currentStepIndex === LYSOGENIC_SIMULATION_STEPS.length - 1}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 transition-colors cursor-pointer"
                title="Tahap Berikutnya"
                aria-label="Tahap Berikutnya"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleRestart}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                title="Ulangi dari Awal"
                aria-label="Ulangi Simulasi"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Mode & Speed Selector */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsAutoPlayMode((prev) => !prev)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border ${
                  isAutoPlayMode
                    ? 'bg-slate-800 border-slate-700 text-slate-300'
                    : 'bg-purple-950/80 border-purple-500 text-purple-300'
                }`}
                title="Ganti Mode Putar Otomatis atau Manual"
              >
                {isAutoPlayMode ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4 text-slate-400" />}
                <span>{isAutoPlayMode ? 'Mode Otomatis' : 'Mode Manual'}</span>
              </button>

              <div className="flex items-center gap-1 text-xs text-slate-400 bg-slate-800/80 p-1 rounded-lg">
                <Gauge className="w-3.5 h-3.5 text-slate-400 ml-1" />
                <button
                  type="button"
                  onClick={() => setSpeedMultiplier(0.7)}
                  className={`px-2 py-0.5 rounded text-[11px] cursor-pointer ${
                    speedMultiplier === 0.7 ? 'bg-purple-600 text-white font-bold' : 'hover:text-white'
                  }`}
                  title="Kecepatan Lambat"
                >
                  0.7x
                </button>
                <button
                  type="button"
                  onClick={() => setSpeedMultiplier(1)}
                  className={`px-2 py-0.5 rounded text-[11px] cursor-pointer ${
                    speedMultiplier === 1 ? 'bg-purple-600 text-white font-bold' : 'hover:text-white'
                  }`}
                  title="Kecepatan Normal"
                >
                  1.0x
                </button>
                <button
                  type="button"
                  onClick={() => setSpeedMultiplier(1.5)}
                  className={`px-2 py-0.5 rounded text-[11px] cursor-pointer ${
                    speedMultiplier === 1.5 ? 'bg-purple-600 text-white font-bold' : 'hover:text-white'
                  }`}
                  title="Kecepatan Cepat"
                >
                  1.5x
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Zone: Pedagogical Information Panel & Observation Deck (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <span className="text-xs font-bold text-purple-800 bg-purple-50 px-2.5 py-1 rounded-lg">
                Tahap {currentStep.step}: {currentStep.name}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {currentStep.scientificStage}
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900">{currentStep.title}</h3>
            <p className="text-xs text-slate-700 leading-relaxed">{currentStep.description}</p>

            {/* 3 Dedicated Analytical Pedagogical Points */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-800 block mb-0.5">
                  1. Apa yang berubah pada tahap ini?
                </span>
                <p className="text-slate-600 leading-relaxed">{currentStep.whatChanges}</p>
              </div>

              <div className="p-2.5 bg-purple-50/60 rounded-xl border border-purple-100 text-purple-950">
                <span className="font-bold text-purple-900 block mb-0.5">
                  2. Apa peran DNA virus?
                </span>
                <p className="text-purple-900/90 leading-relaxed">{currentStep.viralDnaRole}</p>
              </div>

              <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100 text-emerald-950">
                <span className="font-bold text-emerald-900 block mb-0.5">
                  3. Apa yang terjadi pada sel inang?
                </span>
                <p className="text-emerald-900/90 leading-relaxed">{currentStep.hostCellEffect}</p>
              </div>
            </div>
          </div>

          {/* Interactive Observation Notebook Card */}
          <div className="bg-white rounded-2xl border border-purple-200/80 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-purple-600" />
                Catatan Pengamatan Siswa
              </h4>
              {saveStatus && (
                <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md">
                  <Check className="w-3 h-3" />
                  {saveStatus}
                </span>
              )}
            </div>

            <p className="text-xs text-purple-900 bg-purple-50/80 p-2.5 rounded-xl border border-purple-100 mb-3 font-medium">
              {currentStep.observationPrompt}
            </p>

            <textarea
              value={localNote}
              onChange={handleNoteChange}
              placeholder={`Tulis hasil pengamatan Anda pada tahap ${currentStep.name} di sini...`}
              rows={3}
              className="w-full text-xs text-slate-800 p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-y"
            />

            <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500">
              <span className="flex items-center gap-1 text-slate-500">
                <AlertCircle className="w-3 h-3 text-slate-400" />
                Tersimpan di browser lokal
              </span>
              <button
                type="button"
                onClick={() => {
                  setLocalNote(currentStep.defaultObservationHint);
                  onSaveObservation(currentStep.step, currentStep.defaultObservationHint);
                  setSaveStatus('Panduan disalin');
                }}
                className="text-purple-600 hover:text-purple-800 font-medium underline cursor-pointer"
              >
                Gunakan Petunjuk
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
