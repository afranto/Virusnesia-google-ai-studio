import React from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Scan,
  Tag,
  Ruler,
  Info,
} from 'lucide-react';

interface PhETToolbarProps {
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  isProbeActive: boolean;
  onToggleProbe: () => void;
  showLabels: boolean;
  onToggleLabels: () => void;
  showScale: boolean;
  onToggleScale: () => void;
  onOpenHelp?: () => void;
}

export const PhETToolbar: React.FC<PhETToolbarProps> = ({
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  isProbeActive,
  onToggleProbe,
  showLabels,
  onToggleLabels,
  showScale,
  onToggleScale,
  onOpenHelp,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-2 sm:p-2.5 bg-slate-900 text-white rounded-xl shadow-md border border-slate-800 select-none">
      {/* Left: PhET Lab Tools (Probe, Labels, Scale) */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-1 hidden sm:inline">
          Sensor Lab:
        </span>

        {/* Bio-Inspector Probe Tool */}
        <button
          type="button"
          onClick={onToggleProbe}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            isProbeActive
              ? 'bg-amber-400 text-slate-950 shadow-sm ring-2 ring-amber-300'
              : 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white'
          }`}
          title="Aktifkan Probe Sensor Bio-Inspector untuk membaca molekul dan komponen"
        >
          <Scan className={`w-3.5 h-3.5 ${isProbeActive ? 'animate-pulse text-slate-950' : 'text-amber-400'}`} />
          <span>Probe Sensor</span>
          {isProbeActive && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
          )}
        </button>

        {/* Anatomical Labels Toggle */}
        <button
          type="button"
          onClick={onToggleLabels}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            showLabels
              ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400'
              : 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white'
          }`}
          title="Tampilkan / Sembunyikan Label Nama Objek pada Kanvas"
        >
          <Tag className="w-3.5 h-3.5 text-blue-300" />
          <span>Label Objek</span>
        </button>

        {/* Nanometer Scale Toggle */}
        <button
          type="button"
          onClick={onToggleScale}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            showScale
              ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400'
              : 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white'
          }`}
          title="Tampilkan Skala Ukuran Nanometer (~100 nm vs 2 µm)"
        >
          <Ruler className="w-3.5 h-3.5 text-emerald-300" />
          <span>Skala (nm)</span>
        </button>
      </div>

      {/* Right: Zoom Controls */}
      <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-lg border border-slate-700">
        <button
          type="button"
          onClick={onZoomOut}
          disabled={zoomLevel <= 0.75}
          className="p-1.5 rounded-md hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Perkecil Kanvas (Zoom Out)"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <span className="font-mono text-[11px] font-semibold text-slate-200 min-w-[42px] text-center px-1">
          {Math.round(zoomLevel * 100)}%
        </span>

        <button
          type="button"
          onClick={onZoomIn}
          disabled={zoomLevel >= 1.6}
          className="p-1.5 rounded-md hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Perbesar Kanvas (Zoom In)"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-3.5 bg-slate-700 mx-0.5" />

        <button
          type="button"
          onClick={onResetZoom}
          className="p-1.5 rounded-md hover:bg-slate-700 text-slate-300 transition-colors"
          title="Reset Zoom ke 100%"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>

        {onOpenHelp && (
          <button
            type="button"
            onClick={onOpenHelp}
            className="p-1.5 rounded-md hover:bg-slate-700 text-amber-300 transition-colors ml-0.5"
            title="Panduan Eksperimen Virtual Lab"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
