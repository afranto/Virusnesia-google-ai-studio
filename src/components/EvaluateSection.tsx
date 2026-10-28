import React, { useState } from 'react';
import { EVALUATION_QUIZ } from '../data/learningContent';
import {
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  ChevronRight,
  HelpCircle,
  Sparkles,
  BarChart3,
  Clock,
} from 'lucide-react';

interface EvaluateSectionProps {
  initialAnswers: Record<number, number>;
  initialScore: number;
  hasSubmitted: boolean;
  scoreHistory: { timestamp: string; score: number }[];
  onSaveEvaluate: (answers: Record<number, number>, score: number, submitted: boolean) => void;
  onNavigateToReflect: () => void;
}

export const EvaluateSection: React.FC<EvaluateSectionProps> = ({
  initialAnswers,
  initialScore,
  hasSubmitted,
  scoreHistory,
  onSaveEvaluate,
  onNavigateToReflect,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>(initialAnswers);
  const [isCompleted, setIsCompleted] = useState<boolean>(hasSubmitted);
  const [currentScore, setCurrentScore] = useState<number>(initialScore);

  const currentQ = EVALUATION_QUIZ[currentQuestionIndex];
  const selectedOptionIndex = answers[currentQ.id];

  const handleSelectOption = (optionIdx: number) => {
    if (isCompleted) return; // Prevent edits after final submission until retry
    const updatedAnswers = { ...answers, [currentQ.id]: optionIdx };
    setAnswers(updatedAnswers);
  };

  const handleNextQuestion = () => {
    if (selectedOptionIndex === undefined) return;
    if (currentQuestionIndex < EVALUATION_QUIZ.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Calculate final score
      let correctCount = 0;
      EVALUATION_QUIZ.forEach((q) => {
        if (answers[q.id] === q.correctAnswerIndex) {
          correctCount++;
        }
      });
      const calculatedScore = Math.round((correctCount / EVALUATION_QUIZ.length) * 100);
      setCurrentScore(calculatedScore);
      setIsCompleted(true);
      onSaveEvaluate(answers, calculatedScore, true);
    }
  };

  const handleRetryQuiz = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setIsCompleted(false);
    setCurrentScore(0);
    onSaveEvaluate({}, 0, false);
  };

  // Option letters A, B, C, D, E
  const letters = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="max-w-[950px] mx-auto px-4 py-8 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
            Fase 5: Evaluate
          </span>
          <span className="text-xs text-slate-400">·</span>
          <span className="text-xs text-slate-500">Ayo Menguji Pemahaman</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Kuis Formatif Replikasi Virus
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
          Uji pemahaman konsep dan penalaran ilmiah Anda melalui 5 soal pilihan ganda berstandar Higher-Order Thinking Skills (HOTS).
        </p>
      </div>

      {!isCompleted ? (
        /* Active Quiz Question Interface */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col gap-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Soal {currentQuestionIndex + 1} dari {EVALUATION_QUIZ.length}
              </span>
              <span className="text-xs text-blue-600 font-medium">
                Topik: {currentQ.conceptTested}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                Tingkat: {currentQ.difficulty}
              </span>
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              {currentQ.question}
            </h2>
          </div>

          {/* Options List (Radio options with min 44px height) */}
          <div className="flex flex-col gap-3">
            {currentQ.options.map((optText, optIdx) => {
              const isSelected = selectedOptionIndex === optIdx;
              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectOption(optIdx)}
                  className={`min-h-[48px] p-4 rounded-xl text-left text-xs sm:text-sm font-medium transition-all flex items-start gap-3 border ${
                    isSelected
                      ? 'bg-blue-50/90 text-blue-900 border-blue-500 shadow-xs'
                      : 'bg-slate-50/70 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-lg font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-slate-300 text-slate-600'
                    }`}
                  >
                    {letters[optIdx]}
                  </span>
                  <span className="leading-snug">{optText}</span>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-500">
              {selectedOptionIndex === undefined ? 'Pilih salah satu jawaban untuk melanjutkan' : 'Jawaban dipilih'}
            </span>

            <button
              type="button"
              onClick={handleNextQuestion}
              disabled={selectedOptionIndex === undefined}
              className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs transition-all shadow-sm flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>{currentQuestionIndex === EVALUATION_QUIZ.length - 1 ? 'Selesaikan Kuis & Lihat Skor' : 'Soal Berikutnya'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Quiz Results and Comprehensive Discussion */
        <div className="flex flex-col gap-6">
          {/* Score Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div
                className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center text-white font-extrabold shadow-md shrink-0 ${
                  currentScore >= 80 ? 'bg-emerald-600' : currentScore >= 60 ? 'bg-blue-600' : 'bg-amber-600'
                }`}
              >
                <span className="text-2xl font-mono">{currentScore}</span>
                <span className="text-[10px] uppercase tracking-wider opacity-80">/ 100</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                  Hasil Kuis Formatif
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  {currentScore === 100
                    ? 'Sempurna! Pemahaman Sangat Mendalam'
                    : currentScore >= 80
                    ? 'Luar Biasa! Pemahaman Konsep Sangat Baik'
                    : currentScore >= 60
                    ? 'Cukup Baik! Pelajari Kembali Pembahasan'
                    : 'Perlu Penguatan Konsep'}
                </h3>
                <p className="text-xs text-slate-600">
                  Anda menjawab benar {Math.round((currentScore / 100) * EVALUATION_QUIZ.length)} dari {EVALUATION_QUIZ.length} pertanyaan penalaran biologi virus.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleRetryQuiz}
                className="h-11 px-5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Coba Lagi</span>
              </button>

              <button
                type="button"
                onClick={onNavigateToReflect}
                className="h-11 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                <span>Lanjut ke Refleksi</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Detailed Question Review & Biological Explanations */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col gap-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              Pembahasan Ilmiah Setiap Soal
            </h3>

            <div className="space-y-6">
              {EVALUATION_QUIZ.map((q, idx) => {
                const userAns = answers[q.id];
                const isCorrect = userAns === q.correctAnswerIndex;
                return (
                  <div
                    key={q.id}
                    className={`p-5 rounded-xl border flex flex-col gap-3 ${
                      isCorrect ? 'bg-emerald-50/40 border-emerald-200' : 'bg-red-50/40 border-red-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <span className="font-mono text-xs font-bold w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 leading-snug">{q.question}</h4>
                      </div>
                      {isCorrect ? (
                        <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 shrink-0 bg-emerald-100/80 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Benar
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-red-700 flex items-center gap-1 shrink-0 bg-red-100/80 px-2 py-0.5 rounded">
                          <XCircle className="w-3.5 h-3.5" />
                          Salah
                        </span>
                      )}
                    </div>

                    {/* User Answer vs Key Answer */}
                    <div className="text-xs space-y-1 pl-8">
                      <div className="text-slate-700">
                        Jawaban Anda:{' '}
                        <strong className={isCorrect ? 'text-emerald-800' : 'text-red-700'}>
                          ({letters[userAns]}) {q.options[userAns]}
                        </strong>
                      </div>
                      {!isCorrect && (
                        <div className="text-slate-600">
                          Kunci Jawaban Benar:{' '}
                          <strong className="text-emerald-800">
                            ({letters[q.correctAnswerIndex]}) {q.options[q.correctAnswerIndex]}
                          </strong>
                        </div>
                      )}
                    </div>

                    {/* Biological Explanation */}
                    <div className="mt-2 p-3 bg-white rounded-lg border border-slate-200/80 text-xs text-slate-700 space-y-1">
                      <span className="font-bold text-slate-900 block">Penjelasan Biologis:</span>
                      <p className="leading-relaxed">{q.explanation}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Historical Attempts */}
          {scoreHistory.length > 0 && (
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-slate-500" />
                Riwayat Pengerjaan Kuis:
              </span>
              <div className="flex items-center gap-3">
                {scoreHistory.slice(-3).map((item, i) => (
                  <span key={i} className="font-mono bg-white px-2.5 py-1 rounded-md border border-slate-200">
                    Nilai: <strong>{item.score}</strong>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
