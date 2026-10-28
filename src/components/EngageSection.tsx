import React, { useState } from 'react';
import { DIAGNOSTIC_QUESTIONS } from '../data/learningContent';
import {
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  Send,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface EngageSectionProps {
  initialAnswers: Record<number, boolean>;
  initialHypothesis: string;
  hasSubmitted: boolean;
  onSaveEngage: (answers: Record<number, boolean>, hypothesis: string, submitted: boolean) => void;
  onNavigateToExplore: () => void;
}

export const EngageSection: React.FC<EngageSectionProps> = ({
  initialAnswers,
  initialHypothesis,
  hasSubmitted,
  onSaveEngage,
  onNavigateToExplore,
}) => {
  const [answers, setAnswers] = useState<Record<number, boolean>>(initialAnswers);
  const [hypothesis, setHypothesis] = useState<string>(initialHypothesis);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(hasSubmitted);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSelectAnswer = (questionId: number, value: boolean) => {
    const updated = { ...answers, [questionId]: value };
    setAnswers(updated);
    // Auto-save draft
    onSaveEngage(updated, hypothesis, isSubmitted);
    setErrorMessage('');
  };

  const handleHypothesisChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setHypothesis(text);
    onSaveEngage(answers, text, isSubmitted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(answers).length < DIAGNOSTIC_QUESTIONS.length) {
      setErrorMessage('Harap tentukan pilihan (Benar atau Salah) pada ketiga pernyataan sebelum mengirim!');
      return;
    }
    setIsSubmitted(true);
    onSaveEngage(answers, hypothesis, true);
  };

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-8 flex flex-col gap-8">
      {/* Section Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
            Fase 1: Engage
          </span>
          <span className="text-xs text-slate-400">·</span>
          <span className="text-xs text-slate-500">Ayo Berpikir</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Misteri Partikel Aseluler: Bagaimana Virus Memperbanyak Diri?
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
          Bangkitkan rasa ingin tahu ilmiah Anda sebelum memasuki laboratorium visual. Pikirkan bagaimana entitas yang tidak memiliki organel sel dapat berkembang biak.
        </p>
      </div>

      {/* Contextual Scenario Card */}
      <div className="bg-gradient-to-r from-amber-50/80 via-white to-blue-50/60 rounded-2xl border border-amber-200/80 p-6 shadow-xs flex flex-col md:flex-row items-start gap-5">
        <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
          <Lightbulb className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">
            Fenomena: Partikel Lembam yang Mampu Mengguncang Sel Hidup
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            Di luar tubuh inang, partikel virus (virion) tidak bernapas, tidak bergerak, dan tidak mencerna makanan. Mereka bahkan dapat dikristalisasi seperti garam mineral! Namun, begitu satu partikel virus menyentuh sel bakteri atau sel manusia yang cocok, dalam waktu kurang dari 30 menit, ratusan partikel virus baru telah lahir dan mematikan inangnya.
          </p>
          <div className="pt-2 text-xs font-semibold text-amber-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Pertanyaan Pemantik: Jika virus tidak memiliki "pabrik" (ribosom) pembuat protein sendiri, dari mana bahan baku dan energi untuk membuat ratusan virus baru tersebut berasal?</span>
          </div>
        </div>
      </div>

      {/* 3 Diagnostic True/False Statements */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col gap-6">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            Cek Pemahaman Awal (Pilih Benar atau Salah)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Anda dapat mengubah jawaban kapan saja sebelum mengirim. Tidak perlu takut salah; ini adalah eksplorasi gagasan awal Anda.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {DIAGNOSTIC_QUESTIONS.map((q, idx) => {
            const currentVal = answers[q.id];
            return (
              <div
                key={q.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col gap-3 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs font-bold text-blue-600 bg-blue-100/70 w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-sm font-semibold text-slate-800 leading-snug">
                    {q.statement}
                  </p>
                </div>

                {/* Benar / Salah Segmented Radio Buttons (min height 44px) */}
                <div className="flex items-center gap-3 pl-9">
                  <button
                    type="button"
                    onClick={() => handleSelectAnswer(q.id, true)}
                    className={`h-11 px-5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                      currentVal === true
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <span>Benar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectAnswer(q.id, false)}
                    className={`h-11 px-5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                      currentVal === false
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <span>Salah</span>
                  </button>

                  {currentVal !== undefined && (
                    <span className="text-xs text-slate-500 italic ml-2">
                      Pilihan Anda: <strong>{currentVal ? 'Benar' : 'Salah'}</strong>
                    </span>
                  )}
                </div>

                {/* Inquiry-provoking Feedback (shown after submission) */}
                {isSubmitted && (
                  <div className="mt-2 pl-9 pt-3 border-t border-slate-200/60 flex flex-col gap-1.5 text-xs">
                    <div className="flex items-center gap-1.5 font-semibold text-blue-900">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>Refleksi Ilmiah:</span>
                    </div>
                    <p className="text-slate-700">{q.scientificContext}</p>
                    <p className="text-amber-800 font-medium bg-amber-50 p-2 rounded-lg border border-amber-200/50">
                      💡 {q.piqueCuriosity}
                    </p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Student Hypothesis Area */}
          <div className="flex flex-col gap-2 pt-2">
            <label htmlFor="hypothesis-text" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Hipotesis Awal Saya: Bagaimana Menurut Anda Virus Menggandakan Dirinya?
            </label>
            <textarea
              id="hypothesis-text"
              value={hypothesis}
              onChange={handleHypothesisChange}
              placeholder="Tuliskan dugaan atau pemikiran awal Anda secara singkat... (Contoh: Menurut saya virus menyuntikkan sesuatu ke dalam sel inang agar sel itu terpaksa membuat virus baru...)"
              rows={3}
              className="w-full text-xs text-slate-800 p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-y"
            />
          </div>

          {/* Submission and Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100">
            {!isSubmitted ? (
              <button
                type="submit"
                className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Jawaban Awal & Buka Umpan Balik</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Jawaban awal tersimpan di browser Anda! Buktikan hipotesis Anda di laboratorium visual.</span>
              </div>
            )}

            <button
              type="button"
              onClick={onNavigateToExplore}
              className="h-11 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-sm flex items-center gap-2 ml-auto cursor-pointer"
            >
              <span>Lanjutkan Eksplorasi (Explore)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
