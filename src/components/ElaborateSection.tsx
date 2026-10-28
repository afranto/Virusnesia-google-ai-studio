import React, { useState } from 'react';
import { CASE_STUDIES } from '../data/learningContent';
import {
  FileSpreadsheet,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Send,
  Eye,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface ElaborateSectionProps {
  caseAnswers: Record<string, string>;
  submittedCases: Record<string, boolean>;
  onSaveCaseAnswer: (caseId: string, answer: string, submitted: boolean) => void;
  onNavigateToEvaluate: () => void;
}

export const ElaborateSection: React.FC<ElaborateSectionProps> = ({
  caseAnswers,
  submittedCases,
  onSaveCaseAnswer,
  onNavigateToEvaluate,
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>(caseAnswers);
  const [submitted, setSubmitted] = useState<Record<string, boolean>>(submittedCases);
  const [activeTabCaseId, setActiveTabCaseId] = useState<string>(CASE_STUDIES[0].id);

  const activeCase = CASE_STUDIES.find((c) => c.id === activeTabCaseId) || CASE_STUDIES[0];

  const handleTextChange = (caseId: string, text: string) => {
    const updated = { ...answers, [caseId]: text };
    setAnswers(updated);
    onSaveCaseAnswer(caseId, text, submitted[caseId] || false);
  };

  const handleSubmitCase = (caseId: string) => {
    const updatedSubmitted = { ...submitted, [caseId]: true };
    setSubmitted(updatedSubmitted);
    onSaveCaseAnswer(caseId, answers[caseId] || '', true);
  };

  const completedCount = Object.values(submitted).filter(Boolean).length;

  return (
    <div className="max-w-[1050px] mx-auto px-4 py-8 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md">
            Fase 4: Elaborate
          </span>
          <span className="text-xs text-slate-400">·</span>
          <span className="text-xs text-slate-500">Ayo Menerapkan</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Pemecahan Masalah Ilmiah (Scientific Problem Solving)
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
          Terapkan konsep siklus litik dan lisogenik ke dalam kasus nyata: terapi bakteriofag melawan bakteri resisten obat, masa laten HIV, dan teknologi vaksinasi.
        </p>
      </div>

      {/* Case Tabs Selector (Segmented buttons) */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-200/70 rounded-xl overflow-x-auto select-none">
        {CASE_STUDIES.map((c, idx) => {
          const isSelected = c.id === activeTabCaseId;
          const isDone = submitted[c.id];
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveTabCaseId(c.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                isSelected
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Kasus {idx + 1}</span>
              {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
            </button>
          );
        })}
      </div>

      {/* Active Case Card Container */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col gap-6">
        {/* Case Badge & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
                {activeCase.badge}
              </span>
              {submitted[activeCase.id] && (
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Telah Dianalisis
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-900">{activeCase.title}</h2>
            <p className="text-xs text-slate-500">{activeCase.subtitle}</p>
          </div>
        </div>

        {/* Situation / Context Box */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1">
            Situasi & Skenario Kasus:
          </span>
          <p className="text-sm text-slate-700 leading-relaxed">
            {activeCase.contextText}
          </p>
        </div>

        {/* Scientific Data Points */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {activeCase.dataPoints.map((dp, i) => (
            <div key={i} className="p-3 bg-purple-50/50 rounded-xl border border-purple-100">
              <span className="text-[11px] font-medium text-slate-500 block">{dp.label}</span>
              <strong className="text-xs text-purple-950 font-bold block mt-0.5">{dp.value}</strong>
            </div>
          ))}
        </div>

        {/* Problem Question & Guidance */}
        <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200/70">
          <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            Tantangan Analisis Ilmiah:
          </span>
          <p className="text-sm font-semibold text-slate-900 leading-snug">
            {activeCase.problemQuestion}
          </p>
          <p className="text-xs text-blue-800/80 mt-2 italic">
            Petunjuk Berpikir: {activeCase.scientificGuidance}
          </p>
        </div>

        {/* Student Answer Textarea */}
        <div className="flex flex-col gap-2">
          <label htmlFor={`answer-${activeCase.id}`} className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Argumen Pemecahan Masalah Anda:
          </label>
          <textarea
            id={`answer-${activeCase.id}`}
            value={answers[activeCase.id] || ''}
            onChange={(e) => handleTextChange(activeCase.id, e.target.value)}
            placeholder="Ketik argumen analisis Anda berdasarkan siklus litik / lisogenik..."
            rows={4}
            className="w-full text-xs text-slate-800 p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-y"
          />
        </div>

        {/* Submission & Feedback Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={() => handleSubmitCase(activeCase.id)}
            className="h-11 px-5 rounded-xl bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-bold text-xs transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Kirim & Buka Kunci Analisis Ahli</span>
          </button>

          <span className="text-xs text-slate-500">
            Kasus Selesai: {completedCount} / {CASE_STUDIES.length}
          </span>
        </div>

        {/* Revealed Expert Model Answer */}
        {submitted[activeCase.id] && (
          <div className="mt-2 p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs flex flex-col gap-2">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Umpan Balik & Solusi Ilmiah:</span>
            </div>
            <p className="text-emerald-950 leading-relaxed">
              {activeCase.modelAnswer}
            </p>
          </div>
        )}
      </div>

      {/* Footer Navigation to Evaluate */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">Siap Menguji Penguasaan Konsep Anda?</h3>
          <p className="text-xs text-slate-500">
            Lanjutkan ke fase Evaluate untuk mengerjakan kuis formatif 5 soal berstandar penalaran ilmiah (HOTS).
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateToEvaluate}
          className="h-11 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <span>Lanjut ke Fase Evaluate (Kuis)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
