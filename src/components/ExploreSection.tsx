import React from 'react';
import { BacteriophageViewer } from './explore/BacteriophageViewer';
import { LyticSimulation } from './explore/LyticSimulation';
import { LysogenicSimulation } from './explore/LysogenicSimulation';
import { CycleComparison } from './explore/CycleComparison';
import { ObservationNotes } from './explore/ObservationNotes';
import { Microscope, Activity, GitFork, BookOpenCheck, ArrowLeftRight } from 'lucide-react';

interface ExploreSectionProps {
  activeTab: 'structure' | 'lytic' | 'lysogenic' | 'compare' | 'notes';
  onTabChange: (tab: 'structure' | 'lytic' | 'lysogenic' | 'compare' | 'notes') => void;
  exploredParts: string[];
  onPartExplored: (partId: string) => void;
  lyticNotes: Record<number, string>;
  lysogenicNotes: Record<number, string>;
  onSaveLyticNote: (step: number, note: string) => void;
  onSaveLysogenicNote: (step: number, note: string) => void;
  onCompletedLytic: () => void;
  onCompletedLysogenic: () => void;
  onNavigateToExplain: () => void;
}

export const ExploreSection: React.FC<ExploreSectionProps> = ({
  activeTab,
  onTabChange,
  exploredParts,
  onPartExplored,
  lyticNotes,
  lysogenicNotes,
  onSaveLyticNote,
  onSaveLysogenicNote,
  onCompletedLytic,
  onCompletedLysogenic,
  onNavigateToExplain,
}) => {
  return (
    <div className="max-w-[1100px] mx-auto px-4 py-8 flex flex-col gap-6">
      {/* Section Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
            Fase 2: Explore
          </span>
          <span className="text-xs text-slate-400">·</span>
          <span className="text-xs text-slate-500">Ayo Bereksplorasi</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Laboratorium Visual Replikasi Virus
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          Amati model struktur bakteriofag T4 secara interaktif, jalankan simulasi siklus litik dan lisogenik dengan animasi bertahap, bandingkan mekanismenya, serta catat fenomena biologis penting pada buku pengamatan Anda.
        </p>
      </div>

      {/* Sub-Tabs Navigation (Segmented Control conforming to Zero-Pill functional rule) */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-200/70 rounded-xl overflow-x-auto select-none">
        <button
          type="button"
          onClick={() => onTabChange('structure')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'structure'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Microscope className="w-4 h-4 text-blue-600" />
          <span>1. Struktur Bakteriofag</span>
          <span className="font-mono text-[11px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
            {exploredParts.length}/6
          </span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange('lytic')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'lytic'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Activity className="w-4 h-4 text-red-600" />
          <span>2. Siklus Litik</span>
          <span className="text-[11px] font-mono text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
            5 Tahap
          </span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange('lysogenic')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'lysogenic'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <GitFork className="w-4 h-4 text-purple-600" />
          <span>3. Siklus Lisogenik</span>
          <span className="text-[11px] font-mono text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">
            4 Tahap
          </span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange('compare')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'compare'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ArrowLeftRight className="w-4 h-4 text-indigo-600" />
          <span>Bandingkan Siklus</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange('notes')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'notes'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpenCheck className="w-4 h-4 text-emerald-600" />
          <span>4. Catatan Pengamatan</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'structure' && (
        <BacteriophageViewer
          exploredParts={exploredParts}
          onPartExplored={onPartExplored}
        />
      )}

      {activeTab === 'lytic' && (
        <LyticSimulation
          observationNotes={lyticNotes}
          onSaveObservation={onSaveLyticNote}
          onSimulationCompleted={onCompletedLytic}
          onOpenComparison={() => onTabChange('compare')}
        />
      )}

      {activeTab === 'lysogenic' && (
        <LysogenicSimulation
          observationNotes={lysogenicNotes}
          onSaveObservation={onSaveLysogenicNote}
          onSimulationCompleted={onCompletedLysogenic}
          onOpenComparison={() => onTabChange('compare')}
        />
      )}

      {activeTab === 'compare' && (
        <CycleComparison
          onBackToSimulation={(target) => onTabChange(target)}
        />
      )}

      {activeTab === 'notes' && (
        <ObservationNotes
          lyticNotes={lyticNotes}
          lysogenicNotes={lysogenicNotes}
          onNavigateToExplain={onNavigateToExplain}
        />
      )}
    </div>
  );
};
