import React, { useState, useEffect, useRef } from 'react';
import { LYTIC_SIMULATION_STEPS, INTERACTIVE_SIMULATION_OBJECTS } from '../../data/learningContent';
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
  X,
  ArrowLeftRight,
  Flame,
  ToggleLeft,
  ToggleRight,
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
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isAutoPlayMode, setIsAutoPlayMode] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [localNote, setLocalNote] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<string>('');

  const currentStep = LYTIC_SIMULATION_STEPS[currentStepIndex];
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync local observation note when step changes
  useEffect(() => {
    setLocalNote(observationNotes[currentStep.step] || '');
    setSaveStatus('');
  }, [currentStepIndex, observationNotes, currentStep.step]);

  // Safe timer logic for Play / Pause / Resume
  useEffect(() => {
    if (isPlaying) {
      if (isAutoPlayMode) {
        const durationMs = (currentStep.durationSec * 1000) / speedMultiplier;
        timerRef.current = setTimeout(() => {
          if (currentStepIndex < LYTIC_SIMULATION_STEPS.length - 1) {
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
    if (currentStepIndex < LYTIC_SIMULATION_STEPS.length - 1) {
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
      {/* Simulation Stage Header & Top Stepper */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-red-600" />
              Siklus Litik (Virulen)
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-medium text-slate-600 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Durasi Total ~20–30 Menit
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Tahap {currentStep.step}: {currentStep.name} — {currentStep.scientificStage}
          </h2>
        </div>

        {/* 5-Step Stepper & Compare shortcut */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {LYTIC_SIMULATION_STEPS.map((s, idx) => {
              const active = idx === currentStepIndex;
              const past = idx < currentStepIndex;
              return (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => handleStepClick(idx)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-red-600 text-white font-bold shadow-sm ring-2 ring-red-200'
                      : past
                      ? 'bg-red-50 text-red-700 hover:bg-red-100'
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
              title="Bandingkan dengan Siklus Lisogenik"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Bandingkan</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Simulation Viewport & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Zone: Interactive SVG Stage (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-md flex flex-col items-center relative overflow-hidden">
          {/* Status Header Bar */}
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
            <div className="text-[11px] text-cyan-300">
              💡 Klik bagian objek untuk melihat fungsi molekuler
            </div>
          </div>

          {/* Dynamic SVG Animation for Lytic Stages */}
          <div className="w-full h-[370px] flex items-center justify-center relative select-none">
            <svg
              viewBox="0 0 500 380"
              className="w-full h-full"
              aria-label={`Visualisasi animasi siklus litik tahap ${currentStep.name}`}
            >
              <defs>
                <linearGradient id="lyticBacCytoplasm" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#064e3b" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#022c22" stopOpacity="0.95" />
                </linearGradient>
                <linearGradient id="lyticBacWall" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="lyticViralDnaGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="50%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#d946ef" />
                </linearGradient>

                <filter id="lyticObjectGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#38bdf8" floodOpacity="0.9" />
                </filter>
              </defs>

              {/* Background ambient grid */}
              <pattern id="lyticGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
              </pattern>
              <rect width="500" height="380" fill="url(#lyticGrid)" />

              {/* ----------------- BACTERIAL CELL BODY (E. COLI) ----------------- */}
              {/* STAGE 5 (LISIS): Cell wall degrades with expanding rupture holes */}
              {currentStepIndex === 4 ? (
                <g id="ruptured-cell-stage5" style={animPlayStyle}>
                  {/* Left ruptured wall */}
                  <path
                    d="M 65,185 Q 75,145 125,138 L 195,138 L 175,165 L 205,190 L 190,225 L 125,238 Q 65,225 65,185 Z"
                    fill="url(#lyticBacCytoplasm)"
                    stroke="#10b981"
                    strokeWidth="3.5"
                    strokeDasharray="6 3"
                    className="cursor-pointer"
                    onClick={() => handleObjectClick('dinding_sel')}
                  />
                  {/* Right ruptured wall */}
                  <path
                    d="M 435,185 Q 425,145 375,138 L 305,138 L 325,160 L 295,190 L 320,225 L 375,238 Q 435,225 435,185 Z"
                    fill="url(#lyticBacCytoplasm)"
                    stroke="#10b981"
                    strokeWidth="3.5"
                    strokeDasharray="6 3"
                    className="cursor-pointer"
                    onClick={() => handleObjectClick('dinding_sel')}
                  />
                  {/* Pores & tears in cell wall */}
                  <ellipse cx="250" cy="138" rx="42" ry="14" fill="#0f172a" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="4 2" />
                  <ellipse cx="250" cy="240" rx="42" ry="14" fill="#0f172a" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="4 2" />
                </g>
              ) : (
                /* STAGES 1 TO 4: Intact Oval Bacterium */
                <g
                  id="intact-bacterium-lytic"
                  className="cursor-pointer"
                  onClick={() => handleObjectClick('dinding_sel')}
                >
                  {/* Outer Capsule / LPS layer */}
                  <rect
                    x="75"
                    y="130"
                    width="350"
                    height="170"
                    rx="85"
                    fill="none"
                    stroke={selectedObjectId === 'dinding_sel' ? '#38bdf8' : '#059669'}
                    strokeWidth={selectedObjectId === 'dinding_sel' ? '10' : '8'}
                    strokeOpacity="0.4"
                  />
                  {/* Main Peptidoglycan Cell Wall */}
                  <rect
                    x="80"
                    y="135"
                    width="340"
                    height="160"
                    rx="80"
                    fill="url(#lyticBacCytoplasm)"
                    stroke={selectedObjectId === 'dinding_sel' ? '#38bdf8' : 'url(#lyticBacWall)'}
                    strokeWidth={selectedObjectId === 'dinding_sel' ? '5' : '4'}
                  />
                  {/* Plasma Membrane */}
                  <rect
                    x="86"
                    y="141"
                    width="328"
                    height="148"
                    rx="74"
                    fill="none"
                    stroke="#047857"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                  />

                  {/* Surface Receptors */}
                  <g stroke="#34d399" strokeWidth="2">
                    <line x1="180" y1="135" x2="180" y2="128" />
                    <line x1="220" y1="135" x2="220" y2="128" />
                    <line x1="250" y1="135" x2="250" y2="125" />
                    <circle cx="250" cy="124" r="3" fill="#38bdf8" />
                    <line x1="280" y1="135" x2="280" y2="128" />
                    <line x1="320" y1="135" x2="320" y2="128" />
                  </g>
                </g>
              )}

              {/* ----------------- BACTERIAL CHROMOSOMAL DNA (GREEN) ----------------- */}
              {/* Stages 1 & 2: Intact circular green host DNA with subtle pulse */}
              {(currentStepIndex === 0 || currentStepIndex === 1) && (
                <g
                  id="intact-bac-dna-lytic"
                  className="cursor-pointer"
                  onClick={() => handleObjectClick('kromosom_bakteri')}
                  filter={selectedObjectId === 'kromosom_bakteri' ? 'url(#lyticObjectGlow)' : undefined}
                >
                  <path
                    d="M 170,215 Q 190,175 250,185 T 320,215 Q 310,250 250,245 T 170,215 Z"
                    fill="none"
                    stroke={selectedObjectId === 'kromosom_bakteri' ? '#38bdf8' : '#34d399'}
                    strokeWidth={selectedObjectId === 'kromosom_bakteri' ? '5' : '3.5'}
                    strokeDasharray="8 3"
                    className="anim-pulse-subtle"
                    style={animPlayStyle}
                  />
                  <text x="250" y="220" fill="#a7f3d0" fontSize="10" textAnchor="middle">
                    Kromosom Bakteri (DNA Inang)
                  </text>
                </g>
              )}

              {/* Stage 3 (Sintesis): Degraded host DNA fragments */}
              {currentStepIndex === 2 && (
                <g
                  id="degraded-bac-dna-lytic"
                  className="cursor-pointer"
                  onClick={() => handleObjectClick('kromosom_bakteri')}
                  opacity="0.6"
                >
                  <line x1="150" y1="200" x2="180" y2="205" stroke="#34d399" strokeWidth="2.5" strokeDasharray="3 3" />
                  <line x1="210" y1="180" x2="235" y2="190" stroke="#34d399" strokeWidth="2.5" strokeDasharray="3 3" />
                  <line x1="280" y1="230" x2="310" y2="225" stroke="#34d399" strokeWidth="2" strokeDasharray="2 3" />
                  <line x1="330" y1="195" x2="355" y2="205" stroke="#34d399" strokeWidth="2" strokeDasharray="2 3" />
                  <text x="250" y="270" fill="#fca5a5" fontSize="11" textAnchor="middle">
                    Kromosom Inang Terdegradasi (Nuklease Virus)
                  </text>
                </g>
              )}

              {/* ----------------- STAGE 1: ADSORPSI ----------------- */}
              {currentStepIndex === 0 && (
                <g id="stage1-adsorption" className="anim-float" style={animPlayStyle}>
                  <g
                    transform="translate(250, 60)"
                    className="cursor-pointer"
                    onClick={() => handleObjectClick('kapsid')}
                  >
                    {/* Head */}
                    <polygon
                      points="0,-45 20,-25 20,0 0,15 -20,0 -20,-25"
                      fill="#9333ea"
                      stroke={selectedObjectId === 'kapsid' ? '#38bdf8' : '#c084fc'}
                      strokeWidth={selectedObjectId === 'kapsid' ? '3' : '1.5'}
                    />
                    {/* Viral DNA inside head */}
                    <circle
                      cx="0"
                      cy="-15"
                      r="8"
                      fill="#f43f5e"
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleObjectClick('dna_virus');
                      }}
                    />
                    {/* Collar & Sheath */}
                    <rect x="-4" y="15" width="8" height="24" fill="#2563eb" stroke="#3b82f6" rx="2" />
                    {/* Baseplate */}
                    <rect x="-8" y="39" width="16" height="4" fill="#0284c7" />
                    {/* Tail fibers landing onto receptors */}
                    <path d="M -8,41 Q -22,50 -25,65" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M 8,41 Q 22,50 25,65" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M -6,41 Q -14,52 -12,65" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
                    <path d="M 6,41 Q 14,52 12,65" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
                  </g>

                  {/* Receptor lock icons pulsing */}
                  <circle cx="225" cy="125" r="4" fill="none" stroke="#38bdf8" strokeWidth="2" />
                  <circle cx="275" cy="125" r="4" fill="none" stroke="#38bdf8" strokeWidth="2" />
                  <text x="250" y="30" fill="#38bdf8" fontSize="12" textAnchor="middle" fontWeight="bold">
                    Penempelan Serabut Ekor pada Reseptor Dinding Sel
                  </text>
                </g>
              )}

              {/* ----------------- STAGE 2: PENETRASI (DNA ACTIVE MOTION) ----------------- */}
              {currentStepIndex === 1 && (
                <g id="stage2-penetration" style={animPlayStyle}>
                  {/* Empty Ghost Capsid perched outside */}
                  <g
                    transform="translate(250, 75)"
                    className="cursor-pointer"
                    onClick={() => handleObjectClick('kapsid')}
                  >
                    <polygon
                      points="0,-45 20,-25 20,0 0,15 -20,0 -20,-25"
                      fill="#475569"
                      stroke={selectedObjectId === 'kapsid' ? '#38bdf8' : '#94a3b8'}
                      strokeWidth={selectedObjectId === 'kapsid' ? '3' : '1.5'}
                    />
                    <text x="0" y="-12" fill="#cbd5e1" fontSize="9" textAnchor="middle">
                      Ghost (Kosong)
                    </text>
                    {/* Contracted Sheath (shorter piston) */}
                    <rect x="-6" y="15" width="12" height="15" fill="#1e40af" stroke="#60a5fa" rx="2" />
                    <rect x="-10" y="30" width="20" height="4" fill="#0284c7" />
                    <path d="M -10,32 Q -25,38 -30,50" fill="none" stroke="#60a5fa" strokeWidth="2" />
                    <path d="M 10,32 Q 25,38 30,50" fill="none" stroke="#60a5fa" strokeWidth="2" />
                  </g>

                  {/* Hole in bacterial wall created by lysozyme */}
                  <circle
                    cx="250"
                    cy="135"
                    r="6"
                    fill="#f43f5e"
                    opacity="0.8"
                    className="cursor-pointer anim-pulse-subtle"
                    onClick={() => handleObjectClick('lisozim')}
                  />

                  {/* ACTIVE CONTINUOUS STREAMING DNA INJECTION */}
                  {/* Continuous moving dashes path */}
                  <path
                    d="M 250,90 L 250,135 L 250,155 Q 250,185 235,195 T 265,220"
                    fill="none"
                    stroke="url(#lyticViralDnaGrad)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className="anim-dna-stream cursor-pointer"
                    onClick={() => handleObjectClick('dna_virus')}
                    style={animPlayStyle}
                  />

                  {/* Traveling DNA nucleotide beads moving down into cytoplasm */}
                  <circle cx="250" cy="115" r="3.5" fill="#f43f5e" className="anim-particle-down" style={{ ...animPlayStyle, animationDelay: '0s' }} />
                  <circle cx="250" cy="135" r="3.5" fill="#ec4899" className="anim-particle-down" style={{ ...animPlayStyle, animationDelay: '0.4s' }} />
                  <circle cx="248" cy="155" r="3.5" fill="#d946ef" className="anim-particle-down" style={{ ...animPlayStyle, animationDelay: '0.8s' }} />

                  {/* Spreading viral DNA pool in cytoplasm */}
                  <path
                    d="M 230,195 Q 260,180 280,205 T 240,230"
                    fill="none"
                    stroke="#ec4899"
                    strokeWidth="3.5"
                    className="anim-dna-flow"
                    style={animPlayStyle}
                  />

                  <text x="325" y="80" fill="#cbd5e1" fontSize="10">
                    Kapsid kosong tertinggal di luar
                  </text>
                  <text x="320" y="145" fill="#f43f5e" fontSize="11" fontWeight="bold">
                    Gerakan Injeksi DNA ke Sitoplasma
                  </text>
                </g>
              )}

              {/* ----------------- STAGE 3: SINTESIS ----------------- */}
              {currentStepIndex === 2 && (
                <g id="stage3-synthesis" style={animPlayStyle}>
                  <g transform="translate(250, 75)" opacity="0.35">
                    <polygon points="0,-45 20,-25 20,0 0,15 -20,0 -20,-25" fill="#334155" stroke="#64748b" strokeWidth="1" />
                    <rect x="-6" y="15" width="12" height="15" fill="#1e293b" />
                  </g>

                  {/* Actively replicating viral DNA coils (Magenta/Pink with animated flow) */}
                  <g
                    className="cursor-pointer"
                    onClick={() => handleObjectClick('dna_virus')}
                    filter={selectedObjectId === 'dna_virus' ? 'url(#lyticObjectGlow)' : undefined}
                  >
                    <path
                      d="M 190,165 Q 210,150 230,165 T 270,165"
                      fill="none"
                      stroke="#ec4899"
                      strokeWidth="3.5"
                      className="anim-dna-flow"
                      style={animPlayStyle}
                    />
                    <path
                      d="M 260,195 Q 285,180 310,195 T 350,195"
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="3.5"
                      className="anim-dna-flow"
                      style={animPlayStyle}
                    />
                    <path
                      d="M 150,225 Q 180,210 210,225 T 250,225"
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="3.5"
                      className="anim-dna-flow"
                      style={animPlayStyle}
                    />
                  </g>

                  {/* Dispersed Viral Protein Subunits being synthesized by ribosomes */}
                  <g className="anim-float" style={animPlayStyle}>
                    <polygon points="170,185 180,175 180,165 170,160 160,165 160,175" fill="#a855f7" />
                    <polygon points="310,175 320,165 320,155 310,150 300,155 300,165" fill="#a855f7" />
                    <polygon points="230,240 240,230 240,220 230,215 220,220 220,230" fill="#a855f7" />

                    <rect x="200" y="190" width="4" height="15" fill="#3b82f6" />
                    <rect x="290" y="210" width="4" height="15" fill="#3b82f6" />
                    <path d="M 330,230 L 340,240 L 350,235" fill="none" stroke="#60a5fa" strokeWidth="2" />
                    <path d="M 140,195 L 148,205 L 155,200" fill="none" stroke="#60a5fa" strokeWidth="2" />
                  </g>

                  {/* Host Ribosomes actively translating */}
                  <circle cx="215" cy="180" r="3.5" fill="#fbbf24" className="anim-pulse-subtle" style={animPlayStyle} />
                  <circle cx="275" cy="220" r="3.5" fill="#fbbf24" className="anim-pulse-subtle" style={animPlayStyle} />
                  <circle cx="330" cy="180" r="3.5" fill="#fbbf24" className="anim-pulse-subtle" style={animPlayStyle} />

                  <text x="250" y="145" fill="#ec4899" fontSize="12" fontWeight="bold" textAnchor="middle">
                    Replikasi DNA Virus & Sintesis Subunit Kapsid Terpisah
                  </text>
                </g>
              )}

              {/* ----------------- STAGE 4: PERAKITAN (DYNAMIC ASSEMBLY MOTION) ----------------- */}
              {currentStepIndex === 3 && (
                <g id="stage4-assembly" style={animPlayStyle}>
                  {/* Central In-Progress Assembly Station */}
                  <g transform="translate(250, 200)">
                    {/* Head moving into position */}
                    <g className="anim-assemble-head" style={animPlayStyle}>
                      <polygon points="0,-40 18,-24 18,-4 0,10 -18,-4 -18,-24" fill="#9333ea" stroke="#c084fc" strokeWidth="1.5" />
                      <circle cx="0" cy="-14" r="7" fill="#f43f5e" />
                    </g>
                    {/* Tail Sheath snapping into base of head */}
                    <g className="anim-assemble-tail" style={animPlayStyle}>
                      <rect x="-4" y="10" width="8" height="22" fill="#2563eb" rx="1.5" />
                      <rect x="-7" y="32" width="14" height="4" fill="#0284c7" />
                    </g>
                    {/* Fibers docking on baseplate */}
                    <g className="anim-assemble-fibers" style={animPlayStyle}>
                      <path d="M -7,34 Q -16,42 -20,55" fill="none" stroke="#60a5fa" strokeWidth="2" />
                      <path d="M 7,34 Q 16,42 20,55" fill="none" stroke="#60a5fa" strokeWidth="2" />
                    </g>
                  </g>

                  {/* Surrounding completed virions in cytoplasm */}
                  {[
                    { x: 165, y: 175, rot: 15 },
                    { x: 335, y: 175, rot: -20 },
                    { x: 185, y: 240, rot: 45 },
                    { x: 315, y: 240, rot: -40 },
                  ].map((pos, idx) => (
                    <g
                      key={idx}
                      transform={`translate(${pos.x}, ${pos.y}) rotate(${pos.rot}) scale(0.65)`}
                      className="anim-float cursor-pointer"
                      onClick={() => handleObjectClick('kapsid')}
                      style={{ ...animPlayStyle, animationDelay: `${idx * 0.4}s` }}
                    >
                      <polygon points="0,-25 12,-15 12,0 0,10 -12,0 -12,-15" fill="#9333ea" stroke="#c084fc" strokeWidth="1.2" />
                      <circle cx="0" cy="-8" r="5" fill="#f43f5e" />
                      <rect x="-3" y="10" width="6" height="16" fill="#2563eb" rx="1" />
                      <rect x="-5" y="26" width="10" height="2" fill="#0284c7" />
                      <path d="M -5,28 Q -12,35 -15,42" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
                      <path d="M 5,28 Q 12,35 15,42" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
                    </g>
                  ))}

                  <text x="250" y="145" fill="#c084fc" fontSize="12" fontWeight="bold" textAnchor="middle">
                    Gerakan Perakitan: Kepala + DNA + Ekor Menyatu Jadi Virion
                  </text>
                </g>
              )}

              {/* ----------------- STAGE 5: LISIS (CONTINUOUS ESCAPE DRIFT) ----------------- */}
              {currentStepIndex === 4 && (
                <g id="stage5-lysis" style={animPlayStyle}>
                  {/* Escaping virions actively moving outward into medium */}
                  {/* Top-Left escape stream */}
                  <g className="anim-escape-1" style={animPlayStyle}>
                    <g transform="translate(190, 150) rotate(-30) scale(0.65)">
                      <polygon points="0,-25 12,-15 12,0 0,10 -12,0 -12,-15" fill="#9333ea" stroke="#c084fc" strokeWidth="1.2" />
                      <circle cx="0" cy="-8" r="5" fill="#f43f5e" />
                      <rect x="-3" y="10" width="6" height="16" fill="#2563eb" rx="1" />
                      <path d="M -5,28 Q -12,35 -15,42" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
                      <path d="M 5,28 Q 12,35 15,42" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
                    </g>
                  </g>

                  {/* Top-Right escape stream */}
                  <g className="anim-escape-2" style={animPlayStyle}>
                    <g transform="translate(300, 145) rotate(35) scale(0.65)">
                      <polygon points="0,-25 12,-15 12,0 0,10 -12,0 -12,-15" fill="#9333ea" stroke="#c084fc" strokeWidth="1.2" />
                      <circle cx="0" cy="-8" r="5" fill="#f43f5e" />
                      <rect x="-3" y="10" width="6" height="16" fill="#2563eb" rx="1" />
                      <path d="M -5,28 Q -12,35 -15,42" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
                      <path d="M 5,28 Q 12,35 15,42" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
                    </g>
                  </g>

                  {/* Bottom-Left escape stream */}
                  <g className="anim-escape-3" style={animPlayStyle}>
                    <g transform="translate(200, 220) rotate(-110) scale(0.65)">
                      <polygon points="0,-25 12,-15 12,0 0,10 -12,0 -12,-15" fill="#9333ea" stroke="#c084fc" strokeWidth="1.2" />
                      <circle cx="0" cy="-8" r="5" fill="#f43f5e" />
                      <rect x="-3" y="10" width="6" height="16" fill="#2563eb" rx="1" />
                      <path d="M -5,28 Q -12,35 -15,42" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
                      <path d="M 5,28 Q 12,35 15,42" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
                    </g>
                  </g>

                  {/* Bottom-Right escape stream */}
                  <g className="anim-escape-4" style={animPlayStyle}>
                    <g transform="translate(300, 225) rotate(120) scale(0.65)">
                      <polygon points="0,-25 12,-15 12,0 0,10 -12,0 -12,-15" fill="#9333ea" stroke="#c084fc" strokeWidth="1.2" />
                      <circle cx="0" cy="-8" r="5" fill="#f43f5e" />
                      <rect x="-3" y="10" width="6" height="16" fill="#2563eb" rx="1" />
                      <path d="M -5,28 Q -12,35 -15,42" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
                      <path d="M 5,28 Q 12,35 15,42" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
                    </g>
                  </g>

                  {/* Stationary virions waiting inside */}
                  <g transform="translate(250, 185) scale(0.65)">
                    <polygon points="0,-25 12,-15 12,0 0,10 -12,0 -12,-15" fill="#9333ea" stroke="#c084fc" strokeWidth="1.2" />
                    <circle cx="0" cy="-8" r="5" fill="#f43f5e" />
                    <rect x="-3" y="10" width="6" height="16" fill="#2563eb" rx="1" />
                  </g>

                  {/* Endolysin action indicators */}
                  <g
                    className="cursor-pointer"
                    onClick={() => handleObjectClick('lisozim')}
                  >
                    <circle cx="210" cy="138" r="4" fill="#ef4444" className="anim-pulse-subtle" style={animPlayStyle} />
                    <circle cx="290" cy="138" r="4" fill="#ef4444" className="anim-pulse-subtle" style={animPlayStyle} />
                    <circle cx="250" cy="240" r="4" fill="#ef4444" className="anim-pulse-subtle" style={animPlayStyle} />
                  </g>

                  <text x="250" y="40" fill="#f87171" fontSize="13" fontWeight="bold" textAnchor="middle">
                    Lisis Dinding Peptidoglikan: Virion Bergerak Keluar Bertahap
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* Interactive Clickable Info Box (Floats non-destructively over canvas) */}
          {activeObjectInfo && (
            <div className="w-full mt-2 p-3.5 bg-slate-800/95 border border-cyan-500/50 rounded-xl text-xs text-slate-200 flex items-start justify-between gap-3 shadow-lg animate-in fade-in">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-cyan-300 text-sm">
                    {activeObjectInfo.name}
                  </span>
                  <span className="text-[10px] font-mono uppercase bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded">
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
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                aria-label="Tutup info objek"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Bottom Player Controls Deck */}
          <div className="w-full mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {/* Prev Button */}
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

              {/* Play / Pause / Resume Primary Button */}
              <button
                type="button"
                onClick={handlePlayToggle}
                className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-sm cursor-pointer ${
                  isPlaying
                    ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                    : 'bg-red-600 hover:bg-red-500 text-white'
                }`}
                aria-label={isPlaying ? 'Jeda Simulasi' : 'Putar / Lanjutkan Simulasi'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                <span>{isPlaying ? 'Jeda' : currentStepIndex > 0 ? 'Lanjutkan' : 'Putar'}</span>
              </button>

              {/* Next Button */}
              <button
                type="button"
                onClick={handleNext}
                disabled={currentStepIndex === LYTIC_SIMULATION_STEPS.length - 1}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 transition-colors cursor-pointer"
                title="Tahap Berikutnya"
                aria-label="Tahap Berikutnya"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Restart Button */}
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

            {/* Mode Toggle (Otomatis vs Manual) & Speed Selector */}
            <div className="flex items-center gap-3">
              {/* Auto / Manual Mode Toggle */}
              <button
                type="button"
                onClick={() => setIsAutoPlayMode((prev) => !prev)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border ${
                  isAutoPlayMode
                    ? 'bg-slate-800 border-slate-700 text-slate-300'
                    : 'bg-blue-950/80 border-blue-500 text-blue-300'
                }`}
                title="Ganti Mode Putar Otomatis atau Manual"
              >
                {isAutoPlayMode ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4 text-slate-400" />}
                <span>{isAutoPlayMode ? 'Mode Otomatis' : 'Mode Manual'}</span>
              </button>

              {/* Speed Selector: Lambat, Normal, Cepat */}
              <div className="flex items-center gap-1 text-xs text-slate-400 bg-slate-800/80 p-1 rounded-lg">
                <Gauge className="w-3.5 h-3.5 text-slate-400 ml-1" />
                <button
                  type="button"
                  onClick={() => setSpeedMultiplier(0.7)}
                  className={`px-2 py-0.5 rounded text-[11px] cursor-pointer ${
                    speedMultiplier === 0.7 ? 'bg-red-600 text-white font-bold' : 'hover:text-white'
                  }`}
                  title="Kecepatan Lambat"
                >
                  0.7x
                </button>
                <button
                  type="button"
                  onClick={() => setSpeedMultiplier(1)}
                  className={`px-2 py-0.5 rounded text-[11px] cursor-pointer ${
                    speedMultiplier === 1 ? 'bg-red-600 text-white font-bold' : 'hover:text-white'
                  }`}
                  title="Kecepatan Normal"
                >
                  1.0x
                </button>
                <button
                  type="button"
                  onClick={() => setSpeedMultiplier(1.5)}
                  className={`px-2 py-0.5 rounded text-[11px] cursor-pointer ${
                    speedMultiplier === 1.5 ? 'bg-red-600 text-white font-bold' : 'hover:text-white'
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
          {/* Detailed Scientific Information Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <span className="text-xs font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-lg">
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

              <div className="p-2.5 bg-red-50/60 rounded-xl border border-red-100 text-red-950">
                <span className="font-bold text-red-900 block mb-0.5">
                  2. Apa peran DNA virus?
                </span>
                <p className="text-red-900/90 leading-relaxed">{currentStep.viralDnaRole}</p>
              </div>

              <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100 text-emerald-950">
                <span className="font-bold text-emerald-900 block mb-0.5">
                  3. Apa yang terjadi pada sel inang?
                </span>
                <p className="text-emerald-900/90 leading-relaxed">{currentStep.hostCellEffect}</p>
              </div>
            </div>
          </div>

          {/* Interactive Student Observation Notebook Card */}
          <div className="bg-white rounded-2xl border border-red-200/80 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-red-600" />
                Catatan Pengamatan Siswa
              </h4>
              {saveStatus && (
                <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md">
                  <Check className="w-3 h-3" />
                  {saveStatus}
                </span>
              )}
            </div>

            <p className="text-xs text-red-900 bg-red-50/80 p-2.5 rounded-xl border border-red-100 mb-3 font-medium">
              {currentStep.observationPrompt}
            </p>

            <textarea
              value={localNote}
              onChange={handleNoteChange}
              placeholder={`Tulis hasil pengamatan Anda pada tahap ${currentStep.name} di sini...`}
              rows={3}
              className="w-full text-xs text-slate-800 p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-y"
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
                className="text-red-600 hover:text-red-800 font-medium underline cursor-pointer"
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
