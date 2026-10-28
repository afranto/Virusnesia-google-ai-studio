import React, { useState } from 'react';
import { LearningPhase, UserProgress } from '../types';
import { calculateOverallProgress, getStudentInitials, canStartLearning } from '../utils/storage';
import { GlossaryModal } from './modals/GlossaryModal';
import { HelpModal } from './modals/HelpModal';
import {
  Menu,
  X,
  BookOpen,
  HelpCircle,
  Lock,
  CheckCircle2,
  ChevronDown,
  User,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  currentPhase: LearningPhase;
  progress: UserProgress;
  onNavigate: (phase: LearningPhase) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPhase,
  progress,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const { percentage, phaseStatus } = calculateOverallProgress(progress);
  const hasValidStart = canStartLearning(progress.student, progress.orientationBlocks);

  const initials = getStudentInitials(progress.student.namaLengkap || 'Andi Pratama');

  // Definition of 6 Learning Phases matching reference and storyboard
  const phaseConfig = [
    {
      phase: 'engage' as LearningPhase,
      number: 1,
      title: "Let's Wonder",
      subtitle: 'Engage',
      color: '#E74C3C',
      isUnlocked: hasValidStart || phaseStatus.engage || currentPhase !== 'home',
      isCompleted: phaseStatus.engage,
    },
    {
      phase: 'explore' as LearningPhase,
      number: 2,
      title: "Let's Discover",
      subtitle: 'Explore',
      color: '#E67E22',
      isUnlocked: phaseStatus.engage || progress.explore.hasCompletedLytic,
      isCompleted: phaseStatus.explore,
    },
    {
      phase: 'explain' as LearningPhase,
      number: 3,
      title: "Let's Connect",
      subtitle: 'Explain',
      color: '#F39C12',
      isUnlocked: phaseStatus.explore,
      isCompleted: phaseStatus.explain,
    },
    {
      phase: 'elaborate' as LearningPhase,
      number: 4,
      title: "Let's Create",
      subtitle: 'Elaborate',
      color: '#27AE60',
      isUnlocked: phaseStatus.explain,
      isCompleted: phaseStatus.elaborate,
    },
    {
      phase: 'evaluate' as LearningPhase,
      number: 5,
      title: "Let's Check",
      subtitle: 'Evaluate',
      color: '#2980B9',
      isUnlocked: phaseStatus.elaborate,
      isCompleted: phaseStatus.evaluate,
    },
    {
      phase: 'reflect' as LearningPhase,
      number: 6,
      title: "Let's Reflect",
      subtitle: 'Reflect',
      color: '#8E44AD',
      isUnlocked: phaseStatus.evaluate,
      isCompleted: phaseStatus.reflect,
    },
  ];

  const handlePhaseClick = (phase: LearningPhase, isUnlocked: boolean) => {
    if (phase === 'home') {
      onNavigate('home');
      setMobileMenuOpen(false);
      return;
    }

    if (!isUnlocked) {
      return;
    }

    onNavigate(phase);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/98 backdrop-blur-md border-b border-slate-200/90 shadow-2xs select-none">
        <div className="max-w-[1280px] mx-auto px-3 sm:px-5 h-16 flex items-center justify-between gap-4">
          {/* Left: VIRUSNESIA Brand Logo */}
          <button
            type="button"
            onClick={() => handlePhaseClick('home', true)}
            className="flex items-center gap-2.5 text-slate-900 hover:text-blue-600 transition-colors shrink-0 cursor-pointer"
            title="Kembali ke Beranda"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading font-extrabold text-base sm:text-lg tracking-tight text-slate-900">
              VIRUSNESIA
            </span>
          </button>

          {/* Desktop Center: Beranda, Materi Awal, & 6 Learning Phases Pills */}
          <nav
            className="hidden lg:flex items-center gap-1.5 overflow-x-auto py-1"
            aria-label="Tahapan Pembelajaran"
          >
            <button
              type="button"
              onClick={() => handlePhaseClick('home', true)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                currentPhase === 'home'
                  ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Beranda
            </button>

            <button
              type="button"
              onClick={() => onNavigate('materi-awal')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                currentPhase === 'materi-awal'
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Materi Awal
            </button>

            <div className="h-4 w-px bg-slate-200 mx-1 shrink-0" />

            {phaseConfig.map((item) => {
              const isCurrent = currentPhase === item.phase;
              return (
                <button
                  key={item.phase}
                  type="button"
                  onClick={() => handlePhaseClick(item.phase, item.isUnlocked)}
                  disabled={!item.isUnlocked}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    isCurrent
                      ? 'bg-slate-900 text-white shadow-xs'
                      : item.isCompleted
                      ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/70'
                      : item.isUnlocked
                      ? 'bg-slate-100/90 text-slate-700 hover:bg-slate-200/90'
                      : 'bg-slate-50 text-slate-400 opacity-60 cursor-not-allowed border border-slate-100'
                  }`}
                  title={
                    item.isUnlocked
                      ? `${item.title} (${item.subtitle})`
                      : `${item.title} masih terkunci. Selesaikan fase sebelumnya.`
                  }
                >
                  {/* Number Badge */}
                  <span
                    className="w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white shrink-0"
                    style={{ backgroundColor: item.isUnlocked ? item.color : '#94A3B8' }}
                  >
                    {item.number}
                  </span>

                  {/* Title & Subtitle */}
                  <span className="font-medium whitespace-nowrap">
                    {item.title}
                  </span>
                  <span className="text-[10px] opacity-75 hidden xl:inline">
                    ({item.subtitle})
                  </span>

                  {/* Lock / Completed icon */}
                  {item.isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : !item.isUnlocked ? (
                    <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                  ) : null}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Student Profile Badge */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Glosarium Button */}
            <button
              type="button"
              onClick={() => setGlossaryOpen(true)}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200/80 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Buka Glosarium Istilah"
            >
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline">Glosarium</span>
            </button>

            {/* Bantuan Button */}
            <button
              type="button"
              onClick={() => setHelpOpen(true)}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200/80 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Bantuan & Petunjuk"
            >
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">Bantuan</span>
            </button>

            {/* Student Profile Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-full border border-slate-200 hover:border-blue-400 bg-slate-50 transition-colors cursor-pointer"
                title="Profil Peserta Didik"
              >
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center font-mono">
                  {initials}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-burst"
                  onMouseLeave={() => setProfileDropdownOpen(false)}
                >
                  <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center font-mono">
                      {initials}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-xs text-slate-900 truncate">
                        {progress.student.namaLengkap || 'Peserta Didik'}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">
                        {progress.student.kelas ? `Kelas ${progress.student.kelas}` : 'Kelas belum dipilih'}
                      </p>
                    </div>
                  </div>

                  <div className="py-2.5 space-y-1 text-xs text-slate-600">
                    <div className="flex items-center justify-between py-1">
                      <span>Progres Keseluruhan:</span>
                      <strong className="text-blue-600 font-mono">{percentage}%</strong>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        onNavigate('home');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 text-left transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <span>Ubah Identitas di Beranda</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label={mobileMenuOpen ? 'Tutup Menu' : 'Buka Menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-slate-700" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex flex-col gap-2 shadow-lg">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 pt-1">
              Fase Pembelajaran (5E Cycle)
            </div>

            {/* Beranda Link */}
            <button
              type="button"
              onClick={() => handlePhaseClick('home', true)}
              className={`text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between ${
                currentPhase === 'home'
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>Beranda Utama</span>
              {currentPhase === 'home' && <span className="w-2 h-2 rounded-full bg-blue-600" />}
            </button>

            {/* Materi Awal Link */}
            <button
              type="button"
              onClick={() => {
                onNavigate('materi-awal');
                setMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between ${
                currentPhase === 'materi-awal'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>Materi Awal (Opsional)</span>
              {currentPhase === 'materi-awal' && <span className="w-2 h-2 rounded-full bg-white" />}
            </button>

            {phaseConfig.map((item) => {
              const isCurrent = currentPhase === item.phase;
              return (
                <button
                  key={item.phase}
                  type="button"
                  onClick={() => handlePhaseClick(item.phase, item.isUnlocked)}
                  disabled={!item.isUnlocked}
                  className={`text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                    isCurrent
                      ? 'bg-slate-900 text-white font-bold'
                      : item.isUnlocked
                      ? 'text-slate-800 hover:bg-slate-50'
                      : 'text-slate-400 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white shrink-0"
                      style={{ backgroundColor: item.isUnlocked ? item.color : '#94A3B8' }}
                    >
                      {item.number}
                    </span>
                    <span>{item.title}</span>
                    <span className="text-[10px] opacity-75">({item.subtitle})</span>
                  </div>

                  {item.isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : !item.isUnlocked ? (
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                  ) : null}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Global Modals */}
      <GlossaryModal isOpen={glossaryOpen} onClose={() => setGlossaryOpen(false)} />
      <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  );
};
