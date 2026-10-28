import React from 'react';
import { LearningPhase, UserProgress } from '../types';
import { calculateOverallProgress } from '../utils/storage';
import {
  ArrowRight,
  Sparkles,
  Compass,
  CheckCircle2,
  BookOpen,
  Microscope,
  HelpCircle,
  FileSpreadsheet,
  Award,
  RotateCcw,
} from 'lucide-react';

interface HomeSectionProps {
  progress: UserProgress;
  onNavigate: (phase: LearningPhase) => void;
  onResetProgress: () => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  progress,
  onNavigate,
  onResetProgress,
}) => {
  const { percentage, completedPhases, totalPhases, phaseStatus } = calculateOverallProgress(progress);
  const hasStarted = percentage > 0;

  const cycleStages = [
    {
      phase: 'engage' as LearningPhase,
      number: '01',
      title: 'Engage',
      subtitle: 'Ayo Berpikir',
      description: 'Gali rasa ingin tahu & pemahaman awal melalui fenomena perbanyakan virus.',
      icon: HelpCircle,
      accentColor: 'text-amber-600 bg-amber-50 border-amber-200',
      done: phaseStatus.engage,
    },
    {
      phase: 'explore' as LearningPhase,
      number: '02',
      title: 'Explore',
      subtitle: 'Ayo Bereksplorasi',
      description: 'Model anatomi 3D bakteriofag & animasi vektor siklus litik serta lisogenik.',
      icon: Microscope,
      accentColor: 'text-blue-600 bg-blue-50 border-blue-200',
      done: phaseStatus.explore,
    },
    {
      phase: 'explain' as LearningPhase,
      number: '03',
      title: 'Explain',
      subtitle: 'Ayo Menjelaskan',
      description: 'Matriks perbandingan ilmiah, glosarium interaktif, dan pembuktian konsep.',
      icon: BookOpen,
      accentColor: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      done: phaseStatus.explain,
    },
    {
      phase: 'elaborate' as LearningPhase,
      number: '04',
      title: 'Elaborate',
      subtitle: 'Ayo Menerapkan',
      description: 'Pemecahan masalah nyata: terapi bakteriofag, latensi HIV, dan vaksin.',
      icon: FileSpreadsheet,
      accentColor: 'text-purple-600 bg-purple-50 border-purple-200',
      done: phaseStatus.elaborate,
    },
    {
      phase: 'evaluate' as LearningPhase,
      number: '05',
      title: 'Evaluate',
      subtitle: 'Ayo Menguji',
      description: 'Kuis formatif 5 soal HOTS dengan analisis komprehensif & skor.',
      icon: Award,
      accentColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      done: phaseStatus.evaluate,
    },
  ];

  return (
    <div className="max-w-[1100px] mx-auto px-4 py-8 sm:py-12 flex flex-col gap-10">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Subtle decorative background circles */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-20 w-60 h-60 rounded-full bg-purple-500/10 blur-2xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Text & Call-To-Action (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-start gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-300">
              <span className="bg-blue-900/60 border border-blue-700/60 px-3 py-1 rounded-full flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                Biologi Kelas X SMA · Kurikulum Merdeka
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-white">
              Jelajahi Dunia Virus.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-xl">
              Kenali struktur, pahami replikasi, pecahkan masalah ilmiah. Media pembelajaran multimedia interaktif berbasis <span className="text-white font-semibold">Learning Cycle 5E</span>.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate(hasStarted ? progress.currentPhase === 'home' ? 'engage' : progress.currentPhase : 'engage')}
                className="h-12 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-sm transition-all shadow-md hover:shadow-blue-500/25 flex items-center gap-2 cursor-pointer"
              >
                <span>{hasStarted ? 'Lanjutkan Belajar' : 'Mulai Belajar'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {hasStarted && (
                <button
                  type="button"
                  onClick={() => onNavigate('engage')}
                  className="h-12 px-5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-sm font-semibold border border-white/10 transition-colors"
                >
                  Mulai dari Fase 1
                </button>
              )}
            </div>

            {/* Progress Microbar */}
            <div className="w-full max-w-md mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-blue-400" />
                Progres Belajar: <strong className="text-white">{percentage}%</strong> ({completedPhases}/{totalPhases} Fase)
              </span>
              {hasStarted && (
                <button
                  type="button"
                  onClick={onResetProgress}
                  className="text-slate-400 hover:text-red-400 text-xs flex items-center gap-1 transition-colors"
                  title="Mulai Ulang Progres"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Right Hero Graphic: Dynamic Bacteriophage Hero SVG (5 cols) */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="w-full max-w-[320px] aspect-square bg-slate-800/50 rounded-2xl border border-slate-700/60 p-4 relative flex items-center justify-center overflow-hidden shadow-inner">
              <svg viewBox="0 0 300 300" className="w-full h-full anim-pulse-subtle">
                <defs>
                  <linearGradient id="heroPhageHead" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#6b21a8" />
                  </linearGradient>
                </defs>

                {/* Bacterial Wall Arc at bottom */}
                <path d="M 10,270 Q 150,220 290,270" fill="none" stroke="#10b981" strokeWidth="8" strokeOpacity="0.4" />
                <path d="M 10,270 Q 150,220 290,270" fill="none" stroke="#34d399" strokeWidth="3" />

                {/* Floating Bacteriophage T4 */}
                <g transform="translate(150, 110)">
                  {/* Icosahedral Head */}
                  <polygon points="0,-65 40,-35 40,0 0,20 -40,0 -40,-35" fill="url(#heroPhageHead)" stroke="#e9d5ff" strokeWidth="2" />
                  {/* Internal DNA coil */}
                  <circle cx="0" cy="-22" r="14" fill="#f43f5e" opacity="0.8" />
                  {/* Sheath */}
                  <rect x="-7" y="20" width="14" height="42" fill="#2563eb" stroke="#60a5fa" strokeWidth="1.5" rx="3" />
                  {/* Rings */}
                  {[0, 1, 2, 3].map((r) => (
                    <line key={r} x1="-7" y1={28 + r * 8} x2="7" y2={28 + r * 8} stroke="#bfdbfe" strokeWidth="1.5" />
                  ))}
                  {/* Baseplate */}
                  <rect x="-12" y="62" width="24" height="6" fill="#0284c7" rx="1" />
                  {/* Tail Fibers */}
                  <path d="M -12,65 Q -35,80 -50,115" fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
                  <path d="M 12,65 Q 35,80 50,115" fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
                  <path d="M -8,67 Q -20,85 -25,120" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 8,67 Q 20,85 25,120" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
                </g>

                {/* Floating ambient virions */}
                <circle cx="50" cy="50" r="10" fill="#a855f7" opacity="0.4" />
                <circle cx="250" cy="60" r="12" fill="#3b82f6" opacity="0.3" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 5E Learning Journey Roadmap */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Peta Alur Pembelajaran 5E
            </h2>
            <p className="text-sm text-slate-600">
              Ikuti tahapan siklus belajar terarah untuk membangun pemahaman konsep ilmiah yang mendalam.
            </p>
          </div>
        </div>

        {/* 5 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {cycleStages.map((stage) => {
            const Icon = stage.icon;
            return (
              <div
                key={stage.phase}
                onClick={() => onNavigate(stage.phase)}
                className={`group bg-white rounded-2xl p-5 border transition-all duration-200 cursor-pointer flex flex-col justify-between hover:shadow-md ${
                  stage.done
                    ? 'border-emerald-300 ring-1 ring-emerald-200/50'
                    : 'border-slate-200 hover:border-blue-300'
                }`}
                role="button"
                tabIndex={0}
                aria-label={`Buka fase ${stage.title}: ${stage.subtitle}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      {stage.number}
                    </span>
                    {stage.done ? (
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Selesai
                      </span>
                    ) : (
                      <div className={`p-2 rounded-xl border ${stage.accentColor}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                    {stage.title}
                  </h3>
                  <span className="text-xs font-medium text-slate-500 block mb-2">
                    {stage.subtitle}
                  </span>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {stage.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                  <span>Masuki Fase</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Curriculum Competency & Objectives Banner */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Tujuan Pembelajaran Biologi Kelas X
          </span>
          <h3 className="text-base font-bold text-slate-900">
            Capaian Pembelajaran (CP) Replikasi Virus
          </h3>
          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
            Peserta didik mampu menganalisis struktur biologis bakteriofag, membedakan mekanisme replikasi siklus litik dan lisogenik dengan menggunakan bukti ilmiah, serta memecahkan masalah kontekstual penularan dan terapi virus.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('reflect')}
          className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl shadow-xs transition-colors whitespace-nowrap shrink-0"
        >
          Lihat Refleksi & Sertifikat
        </button>
      </div>
    </div>
  );
};
