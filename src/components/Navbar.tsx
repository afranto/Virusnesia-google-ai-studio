import React, { useState } from 'react';
import { LearningPhase, UserProgress } from '../types';
import { calculateOverallProgress } from '../utils/storage';
import { Menu, X, Compass } from 'lucide-react';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const { percentage } = calculateOverallProgress(progress);

  const navItems: { phase: LearningPhase; label: string }[] = [
    { phase: 'home', label: 'Beranda' },
    { phase: 'engage', label: 'Engage' },
    { phase: 'explore', label: 'Explore' },
    { phase: 'explain', label: 'Explain' },
    { phase: 'elaborate', label: 'Elaborate' },
    { phase: 'evaluate', label: 'Evaluate' },
    { phase: 'reflect', label: 'Refleksi' },
  ];

  const handleNavClick = (phase: LearningPhase) => {
    onNavigate(phase);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-colors">
      <div className="max-w-[1100px] mx-auto px-4 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single Text Element) */}
        <button
          type="button"
          onClick={() => handleNavClick('home')}
          className="text-lg font-extrabold tracking-tight text-slate-900 hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer"
        >
          <span className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
            VN
          </span>
          <span>VIRUSNESIA</span>
        </button>

        {/* Zone 2: Navigation Links (Single-Line, clean text with subtle active state) */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
          {navItems.map((item) => {
            const isActive = currentPhase === item.phase;
            return (
              <button
                key={item.phase}
                type="button"
                onClick={() => handleNavClick(item.phase)}
                className={`transition-colors whitespace-nowrap shrink-0 relative py-1 cursor-pointer ${
                  isActive ? 'text-blue-600 font-bold' : 'hover:text-slate-900'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action (Progress Indicator & Jump) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleNavClick(currentPhase === 'home' ? 'engage' : currentPhase)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 transition-colors"
          >
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            <span>Progres:</span>
            <strong className="text-blue-700 font-mono font-bold">{percentage}%</strong>
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label={mobileMenuOpen ? 'Tutup Menu' : 'Buka Menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex flex-col gap-1 shadow-lg">
          {navItems.map((item) => {
            const isActive = currentPhase === item.phase;
            return (
              <button
                key={item.phase}
                type="button"
                onClick={() => handleNavClick(item.phase)}
                className={`text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-between ${
                  isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{item.label}</span>
                {isActive && <span className="w-2 h-2 rounded-full bg-blue-600" />}
              </button>
            );
          })}
          <div className="pt-2 mt-1 border-t border-slate-100 flex items-center justify-between px-3 text-xs text-slate-500">
            <span>Progres Pembelajaran:</span>
            <strong className="text-blue-600 font-mono">{percentage}% Selesai</strong>
          </div>
        </div>
      )}
    </header>
  );
};
