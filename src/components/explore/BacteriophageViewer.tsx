import React, { useState } from 'react';
import { BACTERIOPHAGE_PARTS } from '../../data/learningContent';
import { BacteriophagePart } from '../../types';
import { CheckCircle2, ZoomIn, ZoomOut, RotateCcw, Info, Sparkles, BookOpen } from 'lucide-react';

interface BacteriophageViewerProps {
  exploredParts: string[];
  onPartExplored: (partId: string) => void;
}

export const BacteriophageViewer: React.FC<BacteriophageViewerProps> = ({
  exploredParts,
  onPartExplored,
}) => {
  const [selectedPartId, setSelectedPartId] = useState<string>('kapsid');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const selectedPart = BACTERIOPHAGE_PARTS.find((p) => p.id === selectedPartId) || BACTERIOPHAGE_PARTS[0];

  const handleSelectPart = (part: BacteriophagePart) => {
    setSelectedPartId(part.id);
    onPartExplored(part.id);
  };

  const isExplored = (id: string) => exploredParts.includes(id);

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner and Exploration Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-blue-50/70 border border-blue-200/60 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            T4
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Model Anatomi Bakteriofag T4</h3>
            <p className="text-xs text-slate-600">
              Pilih bagian virus pada diagram SVG atau tombol daftar untuk mempelajari struktur dan fungsinya.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-xl border border-blue-200 shadow-xs self-start sm:self-auto">
          <div className="text-right">
            <span className="text-xs text-slate-500 block">Progres Eksplorasi</span>
            <span className="text-sm font-bold text-blue-700">
              {exploredParts.length} dari {BACTERIOPHAGE_PARTS.length} Bagian
            </span>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-blue-200 flex items-center justify-center bg-blue-50 text-blue-700 font-bold text-xs">
            {Math.round((exploredParts.length / BACTERIOPHAGE_PARTS.length) * 100)}%
          </div>
        </div>
      </div>

      {/* Main 2-Zone Sandbox: Interactive Stage (SVG) & Anatomical Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Zone: Interactive SVG Canvas (7 cols on lg) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm relative flex flex-col items-center">
          {/* Zoom and Reset Controls Floating Bar */}
          <div className="w-full flex items-center justify-between mb-3 pb-3 border-b border-slate-100 text-xs text-slate-500">
            <span className="font-medium text-slate-700">Kanvas Vektor Bakteriofag</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setZoomLevel((prev) => Math.max(0.85, prev - 0.15))}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                title="Perkecil Diagram"
                aria-label="Perkecil"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="font-mono text-xs px-1 text-slate-600">{Math.round(zoomLevel * 100)}%</span>
              <button
                type="button"
                onClick={() => setZoomLevel((prev) => Math.min(1.4, prev + 0.15))}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                title="Perbesar Diagram"
                aria-label="Perbesar"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(1)}
                className="p-1.5 ml-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                title="Reset Ukuran"
                aria-label="Reset Ukuran"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SVG Canvas */}
          <div
            className="w-full h-[430px] flex items-center justify-center overflow-hidden relative cursor-default select-none"
            style={{ touchAction: 'pan-y' }}
          >
            <svg
              viewBox="0 0 460 520"
              className="w-full h-full max-w-[420px] transition-transform duration-300 ease-out"
              style={{ transform: `scale(${zoomLevel})` }}
              aria-label="Diagram interaktif struktur bakteriofag T4"
            >
              <defs>
                {/* Gradients */}
                <linearGradient id="headGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#9333ea" />
                  <stop offset="50%" stopColor="#7e22ce" />
                  <stop offset="100%" stopColor="#581c87" />
                </linearGradient>
                <linearGradient id="dnaGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="50%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
                <linearGradient id="sheathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
                <linearGradient id="baseplateGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0ea5e9" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>

                {/* Filter Glow for Active Parts */}
                <filter id="activeGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#38bdf8" floodOpacity="0.8" />
                </filter>
              </defs>

              {/* Background Guideline Reference Grid (subtle) */}
              <circle cx="230" cy="120" r="105" fill="none" stroke="#f1f5f9" strokeDasharray="4 4" />
              <line x1="230" y1="20" x2="230" y2="480" stroke="#f8fafc" strokeWidth="2" strokeDasharray="4 4" />

              {/* 1. KEPALA (KAPSID) & DNA */}
              <g
                id="group-kapsid"
                className="cursor-pointer transition-all duration-200"
                onClick={() => handleSelectPart(BACTERIOPHAGE_PARTS[0])}
                filter={selectedPartId === 'kapsid' ? 'url(#activeGlow)' : undefined}
                role="button"
                tabIndex={0}
                aria-label="Kepala Kapsid Bakteriofag"
              >
                {/* Icosahedral Head Polygon Facets */}
                <polygon
                  points="230,25 315,65 315,145 230,185 145,145 145,65"
                  fill="url(#headGrad)"
                  stroke={selectedPartId === 'kapsid' ? '#38bdf8' : '#c084fc'}
                  strokeWidth={selectedPartId === 'kapsid' ? '4' : '2'}
                  strokeLinejoin="round"
                />

                {/* Internal facet facets lines for 3D Icosahedral depth */}
                <line x1="230" y1="25" x2="230" y2="185" stroke="#a855f7" strokeWidth="1.5" strokeOpacity="0.6" />
                <line x1="230" y1="25" x2="315" y2="145" stroke="#a855f7" strokeWidth="1.5" strokeOpacity="0.6" />
                <line x1="230" y1="25" x2="145" y2="145" stroke="#a855f7" strokeWidth="1.5" strokeOpacity="0.6" />
                <line x1="145" y1="65" x2="315" y2="65" stroke="#c084fc" strokeWidth="1.5" strokeOpacity="0.5" />
                <line x1="145" y1="145" x2="315" y2="145" stroke="#c084fc" strokeWidth="1.5" strokeOpacity="0.5" />

                {/* Subtle shine facet */}
                <polygon points="230,25 315,65 230,105 145,65" fill="#ffffff" fillOpacity="0.12" />
              </g>

              {/* 2. MATERI GENETIK (DNA) INSIDE HEAD */}
              <g
                id="group-dna"
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectPart(BACTERIOPHAGE_PARTS[1]);
                }}
                filter={selectedPartId === 'dna' ? 'url(#activeGlow)' : undefined}
                role="button"
                tabIndex={0}
                aria-label="DNA Bakteriofag"
              >
                {/* Translucent pill backdrop for DNA highlight */}
                <rect
                  x="185"
                  y="65"
                  width="90"
                  height="75"
                  rx="16"
                  fill={selectedPartId === 'dna' ? '#f43f5e' : '#000000'}
                  fillOpacity={selectedPartId === 'dna' ? '0.25' : '0.15'}
                />
                {/* Wavy condensed DNA Helix coils */}
                <path
                  d="M195,78 Q210,68 230,80 T265,78 Q270,95 250,98 T200,98 Q190,115 225,115 T265,118 Q250,132 230,128 T195,130"
                  fill="none"
                  stroke="url(#dnaGrad)"
                  strokeWidth={selectedPartId === 'dna' ? '4.5' : '3.5'}
                  strokeLinecap="round"
                  className={selectedPartId === 'dna' ? 'anim-dna-flow' : ''}
                />
                <circle cx="210" cy="85" r="3" fill="#fbbf24" />
                <circle cx="250" cy="110" r="3" fill="#f43f5e" />
                <circle cx="225" cy="125" r="2.5" fill="#ec4899" />
              </g>

              {/* 3. LEHER & KERAH (COLLAR) */}
              <g
                id="group-leher"
                className="cursor-pointer"
                onClick={() => handleSelectPart(BACTERIOPHAGE_PARTS[2])}
                filter={selectedPartId === 'leher' ? 'url(#activeGlow)' : undefined}
                role="button"
                tabIndex={0}
                aria-label="Leher dan Kerah"
              >
                {/* Collar Hexagonal plate */}
                <rect
                  x="205"
                  y="185"
                  width="50"
                  height="14"
                  rx="4"
                  fill="#64748b"
                  stroke={selectedPartId === 'leher' ? '#38bdf8' : '#94a3b8'}
                  strokeWidth={selectedPartId === 'leher' ? '3' : '1.5'}
                />
                {/* Whisker pins on collar */}
                <line x1="205" y1="192" x2="190" y2="198" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
                <line x1="255" y1="192" x2="270" y2="198" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
              </g>

              {/* 4. SELUBUNG EKOR KONTRAKTIL */}
              <g
                id="group-selubung"
                className="cursor-pointer"
                onClick={() => handleSelectPart(BACTERIOPHAGE_PARTS[3])}
                filter={selectedPartId === 'selubung' ? 'url(#activeGlow)' : undefined}
                role="button"
                tabIndex={0}
                aria-label="Selubung Ekor Kontraktil"
              >
                {/* Inner DNA injection tube (visible through collar and sheath) */}
                <rect x="226" y="199" width="8" height="135" fill="#f43f5e" opacity="0.75" />

                {/* Outer Contractile Sheath Cylindrical Body */}
                <rect
                  x="212"
                  y="200"
                  width="36"
                  height="132"
                  rx="6"
                  fill="url(#sheathGrad)"
                  stroke={selectedPartId === 'selubung' ? '#38bdf8' : '#1e40af'}
                  strokeWidth={selectedPartId === 'selubung' ? '3' : '1.5'}
                />

                {/* 12 Helical Sheath Rings */}
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
                  <ellipse
                    key={i}
                    cx="230"
                    cy={208 + i * 11}
                    rx="17"
                    ry="3"
                    fill="none"
                    stroke="#93c5fd"
                    strokeWidth="1.8"
                    strokeOpacity="0.8"
                  />
                ))}
              </g>

              {/* 5. LEMPENG DASAR & JARUM PENUSUK */}
              <g
                id="group-lempeng"
                className="cursor-pointer"
                onClick={() => handleSelectPart(BACTERIOPHAGE_PARTS[4])}
                filter={selectedPartId === 'lempeng' ? 'url(#activeGlow)' : undefined}
                role="button"
                tabIndex={0}
                aria-label="Lempeng Dasar dan Spikes"
              >
                {/* Baseplate main polygon plate */}
                <polygon
                  points="200,334 260,334 254,348 206,348"
                  fill="url(#baseplateGrad)"
                  stroke={selectedPartId === 'lempeng' ? '#38bdf8' : '#0369a1'}
                  strokeWidth={selectedPartId === 'lempeng' ? '3' : '1.5'}
                />

                {/* Central injection spike / needle (gp5) */}
                <polygon
                  points="226,348 234,348 230,366"
                  fill="#e11d48"
                  stroke="#be123c"
                  strokeWidth="1.5"
                />

                {/* Short tail pins */}
                <line x1="212" y1="348" x2="208" y2="356" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="248" y1="348" x2="252" y2="356" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />
              </g>

              {/* 6. SERABUT EKOR (6 ARTICULATED TAIL FIBERS) */}
              <g
                id="group-serabut"
                className="cursor-pointer"
                onClick={() => handleSelectPart(BACTERIOPHAGE_PARTS[5])}
                filter={selectedPartId === 'serabut' ? 'url(#activeGlow)' : undefined}
                role="button"
                tabIndex={0}
                aria-label="Serabut Ekor"
              >
                {/* Left Fibers (3 legs) */}
                {/* Left Upper 1 */}
                <path
                  d="M206,340 Q160,365 140,410 T70,470"
                  fill="none"
                  stroke={selectedPartId === 'serabut' ? '#38bdf8' : '#2563eb'}
                  strokeWidth={selectedPartId === 'serabut' ? '4.5' : '3.5'}
                  strokeLinecap="round"
                />
                {/* Left Middle 2 */}
                <path
                  d="M208,344 Q175,390 155,435 T100,490"
                  fill="none"
                  stroke={selectedPartId === 'serabut' ? '#38bdf8' : '#1d4ed8'}
                  strokeWidth={selectedPartId === 'serabut' ? '4.5' : '3'}
                  strokeLinecap="round"
                />
                {/* Left Inner 3 */}
                <path
                  d="M214,347 Q190,400 178,445 T145,495"
                  fill="none"
                  stroke={selectedPartId === 'serabut' ? '#38bdf8' : '#3b82f6'}
                  strokeWidth={selectedPartId === 'serabut' ? '4' : '2.5'}
                  strokeLinecap="round"
                />

                {/* Right Fibers (3 legs) */}
                {/* Right Upper 1 */}
                <path
                  d="M254,340 Q300,365 320,410 T390,470"
                  fill="none"
                  stroke={selectedPartId === 'serabut' ? '#38bdf8' : '#2563eb'}
                  strokeWidth={selectedPartId === 'serabut' ? '4.5' : '3.5'}
                  strokeLinecap="round"
                />
                {/* Right Middle 2 */}
                <path
                  d="M252,344 Q285,390 305,435 T360,490"
                  fill="none"
                  stroke={selectedPartId === 'serabut' ? '#38bdf8' : '#1d4ed8'}
                  strokeWidth={selectedPartId === 'serabut' ? '4.5' : '3'}
                  strokeLinecap="round"
                />
                {/* Right Inner 3 */}
                <path
                  d="M246,347 Q270,400 282,445 T315,495"
                  fill="none"
                  stroke={selectedPartId === 'serabut' ? '#38bdf8' : '#3b82f6'}
                  strokeWidth={selectedPartId === 'serabut' ? '4' : '2.5'}
                  strokeLinecap="round"
                />

                {/* Joint hinge dots on knees of fibers */}
                <circle cx="140" cy="410" r="3.5" fill="#1e40af" />
                <circle cx="320" cy="410" r="3.5" fill="#1e40af" />
                <circle cx="155" cy="435" r="3" fill="#1e40af" />
                <circle cx="305" cy="435" r="3" fill="#1e40af" />

                {/* Terminal receptor binding pads */}
                <circle cx="70" cy="470" r="4" fill="#0284c7" />
                <circle cx="390" cy="470" r="4" fill="#0284c7" />
              </g>

              {/* Callout Indicator Labels */}
              <g className="text-[11px] font-sans font-medium">
                {/* Head Pointer */}
                <line x1="315" y1="105" x2="370" y2="105" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
                <text x="375" y="108" fill="#64748b">Kapsid</text>

                {/* Sheath Pointer */}
                <line x1="248" y1="260" x2="340" y2="260" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
                <text x="345" y="263" fill="#64748b">Selubung Ekor</text>

                {/* Baseplate Pointer */}
                <line x1="255" y1="344" x2="350" y2="344" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
                <text x="355" y="347" fill="#64748b">Lempeng Dasar</text>

                {/* Fibers Pointer */}
                <line x1="140" y1="410" x2="60" y2="410" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
                <text x="5" y="413" fill="#64748b">Serabut Ekor</text>
              </g>
            </svg>
          </div>

          {/* Quick Select Part Pills Underneath Diagram */}
          <div className="w-full mt-4 pt-3 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Pintasan Bagian Anatomi:
            </span>
            <div className="flex flex-wrap gap-2">
              {BACTERIOPHAGE_PARTS.map((part) => {
                const active = part.id === selectedPartId;
                const done = isExplored(part.id);
                return (
                  <button
                    key={part.id}
                    type="button"
                    onClick={() => handleSelectPart(part)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 border ${
                      active
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : done
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {done && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                    <span>{part.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Zone: Scientific Inspector Panel (5 cols on lg) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            {/* Header info */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-semibold">
                    {selectedPart.scientificTerm}
                  </span>
                  {isExplored(selectedPart.id) && (
                    <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Telah Diperiksa
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-slate-900">{selectedPart.name}</h3>
              </div>
            </div>

            {/* Function summary */}
            <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Fungsi Utama
              </span>
              <p className="text-sm text-slate-800 leading-relaxed font-medium">
                {selectedPart.functionSummary}
              </p>
            </div>

            {/* Detailed description */}
            <div className="mt-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-blue-600" />
                Deskripsi Anatomi Biologis
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed">
                {selectedPart.detailedDescription}
              </p>
            </div>

            {/* Molecular Insight */}
            <div className="mt-4 p-3.5 bg-purple-50/80 rounded-xl border border-purple-200/70">
              <h4 className="text-xs font-bold text-purple-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                Mekanisme Molekuler
              </h4>
              <p className="text-xs text-purple-950 leading-relaxed">
                {selectedPart.molecularInsight}
              </p>
            </div>

            {/* High School Exam Point */}
            <div className="mt-4 p-3.5 bg-amber-50/70 rounded-xl border border-amber-200/70">
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                Catatan Ujian Biologi SMA
              </h4>
              <p className="text-xs text-amber-950 leading-relaxed font-medium">
                {selectedPart.examHighlight}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
