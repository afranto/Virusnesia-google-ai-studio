import React from 'react';
import { LYTIC_SIMULATION_STEPS, LYSOGENIC_SIMULATION_STEPS } from '../../data/learningContent';
import { ClipboardCheck, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ObservationNotesProps {
  lyticNotes: Record<number, string>;
  lysogenicNotes: Record<number, string>;
  onNavigateToExplain: () => void;
}

export const ObservationNotes: React.FC<ObservationNotesProps> = ({
  lyticNotes,
  lysogenicNotes,
  onNavigateToExplain,
}) => {
  const lyticCount = Object.keys(lyticNotes).filter((k) => (lyticNotes[Number(k)] || '').trim().length > 0).length;
  const lysoCount = Object.keys(lysogenicNotes).filter((k) => (lysogenicNotes[Number(k)] || '').trim().length > 0).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
              Sintesis Bukti Pengamatan
            </span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs font-medium text-slate-600">
              {lyticCount + lysoCount} Catatan Tersimpan
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">Buku Catatan Laboratorium Virtual</h3>
          <p className="text-xs text-slate-600 mt-1">
            Gunakan hasil pengamatan visual siklus litik dan lisogenik di bawah ini sebagai dasar ilmiah untuk fase Explain (Ayo Menjelaskan).
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateToExplain}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto shrink-0"
        >
          <span>Lanjut ke Fase Explain</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 2-Column Grid: Lytic Notes & Lysogenic Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lytic Notes Column */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-red-600" />
              Pengamatan Siklus Litik ({lyticCount}/5)
            </h4>
            <span className="text-[11px] font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded">
              Virulen
            </span>
          </div>

          <div className="space-y-3">
            {LYTIC_SIMULATION_STEPS.map((step) => {
              const note = lyticNotes[step.step];
              const hasNote = note && note.trim().length > 0;
              return (
                <div
                  key={step.step}
                  className={`p-3.5 rounded-xl border text-xs transition-colors ${
                    hasNote
                      ? 'bg-slate-50/80 border-slate-200'
                      : 'bg-amber-50/50 border-amber-200/60 border-dashed'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-slate-800">
                      Tahap {step.step}: {step.name}
                    </span>
                    {hasNote ? (
                      <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Tercatat
                      </span>
                    ) : (
                      <span className="text-[11px] text-amber-700">Belum diisi</span>
                    )}
                  </div>
                  <p className="text-slate-600 italic">
                    {hasNote ? `"${note}"` : 'Belum ada catatan pada tahap ini. Anda dapat kembali ke simulasi untuk mencatatnya.'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lysogenic Notes Column */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-600" />
              Pengamatan Siklus Lisogenik ({lysoCount}/4)
            </h4>
            <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
              Temperate
            </span>
          </div>

          <div className="space-y-3">
            {LYSOGENIC_SIMULATION_STEPS.map((step) => {
              const note = lysogenicNotes[step.step];
              const hasNote = note && note.trim().length > 0;
              return (
                <div
                  key={step.step}
                  className={`p-3.5 rounded-xl border text-xs transition-colors ${
                    hasNote
                      ? 'bg-slate-50/80 border-slate-200'
                      : 'bg-amber-50/50 border-amber-200/60 border-dashed'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-slate-800">
                      Tahap {step.step}: {step.name}
                    </span>
                    {hasNote ? (
                      <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Tercatat
                      </span>
                    ) : (
                      <span className="text-[11px] text-amber-700">Belum diisi</span>
                    )}
                  </div>
                  <p className="text-slate-600 italic">
                    {hasNote ? `"${note}"` : 'Belum ada catatan pada tahap ini. Anda dapat kembali ke simulasi untuk mencatatnya.'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
