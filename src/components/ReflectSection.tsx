import React, { useState } from 'react';
import { REFLECTION_PROMPTS } from '../data/learningContent';
import { UserProgress } from '../types';
import { calculateOverallProgress } from '../utils/storage';
import {
  Award,
  CheckCircle2,
  Send,
  Printer,
  Sparkles,
  BookOpen,
  Microscope,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';

interface ReflectSectionProps {
  progress: UserProgress;
  onSaveReflection: (answers: Record<string, string>, completed: boolean) => void;
  onResetAll: () => void;
}

export const ReflectSection: React.FC<ReflectSectionProps> = ({
  progress,
  onSaveReflection,
  onResetAll,
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>(progress.reflection.answers);
  const [isCompleted, setIsCompleted] = useState<boolean>(progress.reflection.completed);
  const [saveMessage, setSaveMessage] = useState<string>('');

  const { percentage, completedPhases, totalPhases, phaseStatus } = calculateOverallProgress(progress);
  const isMastered = percentage >= 80;

  const handleTextChange = (id: string, text: string) => {
    const updated = { ...answers, [id]: text };
    setAnswers(updated);
    onSaveReflection(updated, isCompleted);
    setSaveMessage('Tersimpan di browser');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCompleted(true);
    onSaveReflection(answers, true);
    setSaveMessage('Refleksi berhasil disimpan!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-8 flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md">
            Fase Penutup: Refleksi & Capaian
          </span>
          <span className="text-xs text-slate-400">·</span>
          <span className="text-xs text-slate-500">Metakognisi Belajar</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Refleksi Pembelajaran & Lencana Penguasaan
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
          Refleksikan proses belajar Anda mengenai replikasi virus dan periksa lencana capaian kompetensi biologi Anda.
        </p>
      </div>

      {/* Completion Badge & Mastery Card */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {/* Badge Icon */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 text-slate-900 flex flex-col items-center justify-center font-extrabold shadow-lg shrink-0">
            <Award className="w-10 h-10 text-amber-900" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
              Lencana Pembelajar VIRUSNESIA
            </span>
            <h2 className="text-xl font-extrabold text-white">
              {isMastered ? 'Ahli Virologi Muda - Replikasi Virus' : 'Penjelajah Dunia Virus'}
            </h2>
            <p className="text-xs text-slate-300">
              Progres Pembelajaran: <strong>{percentage}%</strong> · {completedPhases} dari {totalPhases} Fase 5E Selesai
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="h-11 px-5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center gap-2 border border-white/15 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Ekspor Rangkuman</span>
          </button>
        </div>
      </div>

      {/* 5E Phase Progress Checklist */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col gap-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          Ringkasan Capaian Siklus 5E
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800 block">1. Engage</span>
              <span className="text-slate-500 text-[11px]">Ayo Berpikir</span>
            </div>
            {phaseStatus.engage ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <span className="text-amber-600 font-semibold text-[11px]">Belum</span>
            )}
          </div>

          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800 block">2. Explore</span>
              <span className="text-slate-500 text-[11px]">Simulasi Visual</span>
            </div>
            {phaseStatus.explore ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <span className="text-amber-600 font-semibold text-[11px]">Belum</span>
            )}
          </div>

          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800 block">3. Explain</span>
              <span className="text-slate-500 text-[11px]">Penjelasan Ilmiah</span>
            </div>
            {phaseStatus.explain ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <span className="text-amber-600 font-semibold text-[11px]">Belum</span>
            )}
          </div>

          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800 block">4. Elaborate</span>
              <span className="text-slate-500 text-[11px]">Kasus Terapan</span>
            </div>
            {phaseStatus.elaborate ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <span className="text-amber-600 font-semibold text-[11px]">Belum</span>
            )}
          </div>

          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800 block">5. Evaluate</span>
              <span className="text-slate-500 text-[11px]">Skor: {progress.evaluate.lastScore}/100</span>
            </div>
            {phaseStatus.evaluate ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <span className="text-amber-600 font-semibold text-[11px]">Belum</span>
            )}
          </div>

          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800 block">6. Refleksi</span>
              <span className="text-slate-500 text-[11px]">Metakognisi</span>
            </div>
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <span className="text-amber-600 font-semibold text-[11px]">Sedang Isi</span>
            )}
          </div>
        </div>
      </div>

      {/* 4 Guided Reflection Prompts Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col gap-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-600" />
            Empat Pertanyaan Refleksi Metakognitif
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Jawab pertanyaan reflektif berikut untuk menyadari kemajuan berpikir dan pemahaman ilmiah Anda.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {REFLECTION_PROMPTS.map((prompt) => (
            <div key={prompt.id} className="flex flex-col gap-2">
              <label htmlFor={prompt.id} className="text-xs font-bold text-slate-800 leading-snug">
                {prompt.question}
              </label>
              <textarea
                id={prompt.id}
                value={answers[prompt.id] || ''}
                onChange={(e) => handleTextChange(prompt.id, e.target.value)}
                placeholder={prompt.placeholder}
                rows={3}
                className="w-full text-xs text-slate-800 p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-y"
              />
            </div>
          ))}

          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100">
            <button
              type="submit"
              className="h-11 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-xs transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Simpan Refleksi Pembelajaran</span>
            </button>

            {saveMessage && (
              <span className="text-xs text-emerald-700 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {saveMessage}
              </span>
            )}

            <button
              type="button"
              onClick={onResetAll}
              className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 ml-auto transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Seluruh Data Belajar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
