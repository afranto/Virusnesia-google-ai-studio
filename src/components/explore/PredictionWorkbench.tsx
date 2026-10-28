import React, { useState, useEffect } from 'react';
import { LabPrediction } from '../../types';
import {
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface PredictionWorkbenchProps {
  prediction: LabPrediction | undefined;
  hasExecutedSimulation: boolean;
  onRunSimulationToTest?: () => void;
  savedAnswerId?: string;
  onSaveAnswer?: (predictionId: string, optionId: string, reasoning: string) => void;
}

export const PredictionWorkbench: React.FC<PredictionWorkbenchProps> = ({
  prediction,
  hasExecutedSimulation,
  onRunSimulationToTest,
  savedAnswerId,
  onSaveAnswer,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(
    savedAnswerId || null
  );
  const [reasoning, setReasoning] = useState<string>('');
  const [isTested, setIsTested] = useState<boolean>(hasExecutedSimulation);

  useEffect(() => {
    setSelectedOptionId(savedAnswerId || null);
    setIsTested(hasExecutedSimulation);
  }, [prediction?.id, savedAnswerId, hasExecutedSimulation]);

  if (!prediction) return null;

  const handleSelectOption = (optionId: string) => {
    setSelectedOptionId(optionId);
    if (onSaveAnswer) {
      onSaveAnswer(prediction.id, optionId, reasoning);
    }
  };

  const handleReasoningChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setReasoning(val);
    if (selectedOptionId && onSaveAnswer) {
      onSaveAnswer(prediction.id, selectedOptionId, val);
    }
  };

  const handleTestClick = () => {
    setIsTested(true);
    if (onRunSimulationToTest) {
      onRunSimulationToTest();
    }
  };

  const selectedOption = prediction.options.find(
    (opt) => opt.id === selectedOptionId
  );

  return (
    <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-5 border border-indigo-900/60 shadow-lg flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-indigo-800/50 pb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-600/60 text-indigo-200">
            <Lightbulb className="w-4 h-4 text-amber-300" />
          </span>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
              Eksperimen Ilmiah (POEC: Predict & Observe)
            </span>
            <h3 className="text-sm font-bold text-white">
              Prediksi Hipotesis Sebelum Eksperimen
            </h3>
          </div>
        </div>

        {selectedOption && (
          <span className="text-xs font-mono text-emerald-300 bg-emerald-950/80 border border-emerald-700/60 px-2.5 py-1 rounded-full flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Hipotesis Terpilih
          </span>
        )}
      </div>

      {/* Question Prompt */}
      <div>
        <p className="text-xs text-indigo-200 font-medium mb-1">
          {prediction.hypothesisPrompt}
        </p>
        <p className="text-sm font-semibold text-slate-100 leading-snug">
          "{prediction.question}"
        </p>
      </div>

      {/* Selectable Hypothesis Options */}
      <div className="flex flex-col gap-2">
        {prediction.options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleSelectOption(opt.id)}
              className={`text-left p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer flex items-start gap-2.5 ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-md ring-2 ring-indigo-400/30'
                  : 'bg-slate-800/70 text-slate-300 border-slate-700/70 hover:bg-slate-800 hover:text-white hover:border-slate-600'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full border mt-0.5 shrink-0 flex items-center justify-center transition-colors ${
                  isSelected
                    ? 'border-white bg-white text-indigo-600'
                    : 'border-slate-500'
                }`}
              >
                {isSelected && <div className="w-2 h-2 rounded-full bg-indigo-600" />}
              </div>
              <span className="leading-relaxed">{opt.text}</span>
            </button>
          );
        })}
      </div>

      {/* Optional Reasoning input */}
      {selectedOptionId && !isTested && (
        <div className="flex flex-col gap-1.5 mt-1 animate-fadeIn">
          <label className="text-[11px] font-semibold text-indigo-200 flex items-center justify-between">
            <span>Alasan Ilmiah / Dasar Hipotesis Anda (Opsional):</span>
            <span className="text-[10px] text-indigo-400 font-mono">Tersimpan</span>
          </label>
          <textarea
            value={reasoning}
            onChange={handleReasoningChange}
            placeholder="Tuliskan mengapa Anda memilih prediksi tersebut berdasarkan konsep struktur atau biologi molekuler..."
            rows={2}
            className="w-full bg-slate-800/90 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      )}

      {/* Test / Action Button */}
      {selectedOptionId && !isTested && (
        <button
          type="button"
          onClick={handleTestClick}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Uji Hipotesis Melalui Simulasi Laboratorium</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}

      {/* Evaluated Result Card after Testing */}
      {isTested && selectedOption && (
        <div
          className={`p-3.5 rounded-xl border text-xs leading-relaxed animate-burst ${
            selectedOption.isCorrect
              ? 'bg-emerald-950/80 border-emerald-600 text-emerald-100'
              : 'bg-amber-950/80 border-amber-600 text-amber-100'
          }`}
        >
          <div className="flex items-center gap-2 mb-1.5 font-bold">
            {selectedOption.isCorrect ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">
                  Hasil Observasi: Prediksi Tepat & Akurat!
                </span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="text-amber-300">
                  Hasil Observasi: Hipotesis Perlu Ditinjau
                </span>
              </>
            )}
          </div>

          <p className="text-[11px] mb-2">{selectedOption.feedback}</p>

          <div className="pt-2 border-t border-slate-700/60 text-[11px]">
            <span className="font-bold block text-slate-200 mb-0.5">
              Penjelasan Konseptual Ilmiah:
            </span>
            <p className="text-slate-300">{prediction.scientificExplanation}</p>
          </div>

          <div className="mt-2 text-[10px] text-slate-400 font-mono flex items-center justify-between">
            <span>Fenomena: {prediction.observedPhenomenon}</span>
            <button
              type="button"
              onClick={() => setIsTested(false)}
              className="text-indigo-300 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Ganti Prediksi</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
