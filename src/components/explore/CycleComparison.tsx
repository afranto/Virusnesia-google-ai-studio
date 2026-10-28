import React, { useState } from 'react';
import { LYTIC_SIMULATION_STEPS, LYSOGENIC_SIMULATION_STEPS } from '../../data/learningContent';
import {
  ArrowLeftRight,
  Activity,
  GitFork,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  ShieldCheck,
  Flame,
} from 'lucide-react';

interface CycleComparisonProps {
  onSelectLyticStep?: (step: number) => void;
  onSelectLysogenicStep?: (step: number) => void;
  onBackToSimulation: (target: 'lytic' | 'lysogenic') => void;
}

export const CycleComparison: React.FC<CycleComparisonProps> = ({
  onSelectLyticStep,
  onSelectLysogenicStep,
  onBackToSimulation,
}) => {
  const [selectedLyticIndex, setSelectedLyticIndex] = useState<number>(0);
  const [selectedLysoIndex, setSelectedLysoIndex] = useState<number>(0);

  const lyticStep = LYTIC_SIMULATION_STEPS[selectedLyticIndex];
  const lysoStep = LYSOGENIC_SIMULATION_STEPS[selectedLysoIndex];

  const comparisonAspects = [
    {
      title: '1. Cara DNA Virus Masuk ke Sel Inang',
      lytic: 'Bakteriofag menempel pada reseptor spesifik LPS/OmpC, selubung ekor berkontraksi menyuntikkan dsDNA menembus dinding sel inang; kapsid kosong ditinggal di luar ("ghost").',
      lysogenic: 'Bakteriofag temperate (Fag Lamda) menempel pada reseptor LamB dan menyuntikkan dsDNA dengan cara yang sama, namun genom virus kemudian membentuk sirkular tanpa menghancurkan inang.',
    },
    {
      title: '2. Nasib Materi Genetik (DNA Virus)',
      lytic: 'DNA virus langsung mereplikasi diri secara masif dan enzim nuklease virus menghancurkan kromosom bakteri menjadi fragmen non-fungsional.',
      lysogenic: 'DNA virus disisipkan secara kovalen ke dalam kromosom bakteri oleh enzim integrase membentuk PROFAG. Gen virulensi ditekan oleh protein repressor CI.',
    },
    {
      title: '3. Kondisi & Nasib Sel Inang (Bakteri)',
      lytic: 'Sel inang kehilangan kendali genetik, dipaksa menjadi pabrik komponen virus, dan akhirnya mengalami kematian total (lisis) akibat enzim endolisin & holin.',
      lysogenic: 'Sel inang tetap hidup normal, bertumbuh, dan membelah biner secara sehat. Sel inang bahkan mendapat imunitas dari infeksi virus sejenis.',
    },
    {
      title: '4. Proses Pembentukan Virus Baru',
      lytic: 'Protein kapsid, ekor, dan serabut ekor disintesis secara berurutan, lalu dirakit (assembly) menjadi 100–200 partikel virus baru yang matang.',
      lysogenic: 'Tidak ada partikel virus baru yang dirakit selama fase profag. Virus baru hanya akan terbentuk jika terjadi INDUKSI (misal radiasi UV) yang mengalihkan siklus ke litik.',
    },
    {
      title: '5. Hasil Akhir & Dampak Ekologis',
      lytic: 'Pecahnya dinding sel (lisis) melepaskan ratusan virion baru infeksius dalam waktu cepat (~20–30 menit); bakteri inang musnah.',
      lysogenic: 'Populasi bakteri pembawa profag bertambah banyak setiap generasi pembelahan biner tanpa membunuh inang.',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <ArrowLeftRight className="w-3.5 h-3.5" />
              Mode Komparasi Dua Kolom
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-medium text-slate-600">
              Analisis Komparatif Litik vs Lisogenik
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">Perbandingan Langsung Siklus Litik & Lisogenik</h2>
          <p className="text-xs text-slate-600 mt-1">
            Pilih dan sejajarkan tahapan dari kedua siklus untuk membandingkan proses biologis, nasib DNA inang, dan kondisi sel secara langsung.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onBackToSimulation('lytic')}
            className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs border border-red-200 transition-colors flex items-center gap-1.5"
          >
            <Activity className="w-3.5 h-3.5 text-red-600" />
            <span>Kanvas Litik</span>
          </button>
          <button
            type="button"
            onClick={() => onBackToSimulation('lysogenic')}
            className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs border border-purple-200 transition-colors flex items-center gap-1.5"
          >
            <GitFork className="w-3.5 h-3.5 text-purple-600" />
            <span>Kanvas Lisogenik</span>
          </button>
        </div>
      </div>

      {/* 2-Column Side-by-Side Interactive Stage Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Lytic Cycle Stage Card */}
        <div className="bg-white rounded-2xl border border-red-200 p-5 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-red-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center font-bold text-xs">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Siklus Litik (Virulen)</h3>
                <span className="text-[11px] text-red-600 font-medium">Bakteri Lisis & Musnah</span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">
              Tahap {lyticStep.step} / 5
            </span>
          </div>

          {/* Stepper Buttons for Lytic */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {LYTIC_SIMULATION_STEPS.map((step, idx) => (
              <button
                key={step.step}
                type="button"
                onClick={() => setSelectedLyticIndex(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                  selectedLyticIndex === idx
                    ? 'bg-red-600 text-white font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {step.step}. {step.name}
              </button>
            ))}
          </div>

          {/* Active Lytic Stage Snapshot */}
          <div className="p-4 bg-red-50/50 rounded-xl border border-red-100 text-xs flex flex-col gap-2">
            <h4 className="font-bold text-red-950 text-sm">
              Tahap {lyticStep.step}: {lyticStep.title}
            </h4>
            <p className="text-slate-700 leading-relaxed">{lyticStep.description}</p>

            <div className="mt-2 space-y-1.5 pt-2 border-t border-red-100/80">
              <div>
                <strong className="text-red-900">Apa yang berubah:</strong>{' '}
                <span className="text-slate-700">{lyticStep.whatChanges}</span>
              </div>
              <div>
                <strong className="text-red-900">Peran DNA virus:</strong>{' '}
                <span className="text-slate-700">{lyticStep.viralDnaRole}</span>
              </div>
              <div>
                <strong className="text-red-900">Kondisi sel inang:</strong>{' '}
                <span className="text-slate-700">{lyticStep.hostCellEffect}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Lysogenic Cycle Stage Card */}
        <div className="bg-white rounded-2xl border border-purple-200 p-5 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-purple-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Siklus Lisogenik (Temperate)</h3>
                <span className="text-[11px] text-purple-600 font-medium">Inang Bertahan Hidup (Profag)</span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">
              Tahap {lysoStep.step} / 4
            </span>
          </div>

          {/* Stepper Buttons for Lysogenic */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {LYSOGENIC_SIMULATION_STEPS.map((step, idx) => (
              <button
                key={step.step}
                type="button"
                onClick={() => setSelectedLysoIndex(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                  selectedLysoIndex === idx
                    ? 'bg-purple-600 text-white font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {step.step}. {step.name}
              </button>
            ))}
          </div>

          {/* Active Lysogenic Stage Snapshot */}
          <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100 text-xs flex flex-col gap-2">
            <h4 className="font-bold text-purple-950 text-sm">
              Tahap {lysoStep.step}: {lysoStep.title}
            </h4>
            <p className="text-slate-700 leading-relaxed">{lysoStep.description}</p>

            <div className="mt-2 space-y-1.5 pt-2 border-t border-purple-100/80">
              <div>
                <strong className="text-purple-900">Apa yang berubah:</strong>{' '}
                <span className="text-slate-700">{lysoStep.whatChanges}</span>
              </div>
              <div>
                <strong className="text-purple-900">Peran DNA virus:</strong>{' '}
                <span className="text-slate-700">{lysoStep.viralDnaRole}</span>
              </div>
              <div>
                <strong className="text-purple-900">Kondisi sel inang:</strong>{' '}
                <span className="text-slate-700">{lysoStep.hostCellEffect}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Structural Comparison Aspects Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col gap-4">
        <div>
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-600" />
            Lima Aspek Perbedaan Fundamental
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Rangkuman esensial untuk memahami perbedaan mekanisme molekuler antara siklus litik dan lisogenik.
          </p>
        </div>

        <div className="space-y-4">
          {comparisonAspects.map((aspect, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/40 flex flex-col gap-2.5">
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">{aspect.title}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-red-50/60 rounded-lg border border-red-200/60 text-slate-800">
                  <span className="font-bold text-red-900 block mb-1">Pada Siklus Litik:</span>
                  <p className="leading-relaxed">{aspect.lytic}</p>
                </div>
                <div className="p-3 bg-purple-50/60 rounded-lg border border-purple-200/60 text-slate-800">
                  <span className="font-bold text-purple-900 block mb-1">Pada Siklus Lisogenik:</span>
                  <p className="leading-relaxed">{aspect.lysogenic}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
