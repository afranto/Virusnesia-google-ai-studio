import React from 'react';
import { InteractiveSvgObject } from '../../types';
import { X, Sparkles, Tag, Dna, ShieldAlert, Cpu } from 'lucide-react';

interface BioInspectorCardProps {
  objectInfo: InteractiveSvgObject | null;
  onClose: () => void;
  isProbeActive?: boolean;
}

export const BioInspectorCard: React.FC<BioInspectorCardProps> = ({
  objectInfo,
  onClose,
  isProbeActive,
}) => {
  if (!objectInfo) return null;

  const getCategoryBadge = () => {
    switch (objectInfo.category) {
      case 'virus':
        return {
          bg: 'bg-purple-100 text-purple-800 border-purple-200',
          icon: <Sparkles className="w-3.5 h-3.5 text-purple-600" />,
          label: 'Struktur Virus',
        };
      case 'host':
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          icon: <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />,
          label: 'Komponen Inang',
        };
      case 'dna':
        return {
          bg: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: <Dna className="w-3.5 h-3.5 text-blue-600" />,
          label: 'Materi Genetik',
        };
      case 'enzyme':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-200',
          icon: <Cpu className="w-3.5 h-3.5 text-amber-600" />,
          label: 'Faktor Enzimatik / Fisik',
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-800 border-slate-200',
          icon: <Tag className="w-3.5 h-3.5 text-slate-600" />,
          label: 'Objek Biomolekuler',
        };
    }
  };

  const badge = getCategoryBadge();

  return (
    <div className="bg-slate-900/95 text-white backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 shadow-xl transition-all animate-burst">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2">
          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1.5 ${badge.bg}`}
          >
            {badge.icon}
            {badge.label}
          </span>
          {isProbeActive && (
            <span className="text-[10px] font-mono uppercase bg-amber-400 text-slate-950 font-bold px-1.5 py-0.5 rounded">
              Sensor Terkunci
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          title="Tutup Kartu Sensor"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Title & Formula */}
      <div className="mb-2">
        <h4 className="text-sm font-bold text-slate-100 tracking-tight">
          {objectInfo.name}
        </h4>
        {objectInfo.molecularFormula && (
          <p className="font-mono text-[11px] text-amber-300 mt-0.5">
            Komposisi: {objectInfo.molecularFormula}
          </p>
        )}
      </div>

      {/* Summary */}
      <p className="text-xs text-slate-300 leading-relaxed mb-3 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
        {objectInfo.summary}
      </p>

      {/* Role */}
      <div className="text-xs text-slate-300">
        <span className="font-bold text-sky-300 block mb-1">
          Peran dalam Replikasi Virus:
        </span>
        <p className="text-[11px] text-slate-200 leading-relaxed">
          {objectInfo.scientificRole}
        </p>
      </div>

      {objectInfo.scaleNm && (
        <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Skala Ukuran Estimasi:</span>
          <span className="text-emerald-400 font-bold">~{objectInfo.scaleNm} nm</span>
        </div>
      )}
    </div>
  );
};
