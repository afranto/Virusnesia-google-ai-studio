import React, { useState } from 'react';
import { GLOSSARY_ITEMS, SCIENTIFIC_EXPLANATION_QUESTIONS } from '../data/learningContent';
import { GlossaryItem } from '../types';
import {
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  Send,
  X,
} from 'lucide-react';

interface ExplainSectionProps {
  studentNotes: Record<string, string>;
  hasSubmitted: boolean;
  onSaveExplain: (notes: Record<string, string>, submitted: boolean) => void;
  onNavigateToElaborate: () => void;
}

export const ExplainSection: React.FC<ExplainSectionProps> = ({
  studentNotes,
  hasSubmitted,
  onSaveExplain,
  onNavigateToElaborate,
}) => {
  const [notes, setNotes] = useState<Record<string, string>>(studentNotes);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(hasSubmitted);
  const [activeGlossary, setActiveGlossary] = useState<GlossaryItem | null>(null);
  const [saveStatus, setSaveStatus] = useState<string>('');

  const handleNoteChange = (id: string, text: string) => {
    const updated = { ...notes, [id]: text };
    setNotes(updated);
    onSaveExplain(updated, isSubmitted);
    setSaveStatus('Tersimpan di browser');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    onSaveExplain(notes, true);
  };

  return (
    <div className="max-w-[1050px] mx-auto px-4 py-8 flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">
            Fase 3: Explain
          </span>
          <span className="text-xs text-slate-400">·</span>
          <span className="text-xs text-slate-500">Ayo Menjelaskan</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Konseptualisasi & Penjelasan Ilmiah Replikasi Virus
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          Hubungkan hasil pengamatan laboratorium virtual Anda dengan konsep biologi molekuler. Pelajari matriks perbedaan siklus litik dan lisogenik, serta kuasai glosarium istilah kunci.
        </p>
      </div>

      {/* Epistemological Context Alert: Bacteriophage as Model Organism */}
      <div className="p-4 bg-amber-50/80 border border-amber-200/90 rounded-2xl flex items-start gap-3.5 text-xs text-amber-950">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="font-bold text-amber-900 block text-sm">
            Catatan Penting Epistemologi Biologi: Bakteriofag Sebagai Organisme Model
          </strong>
          <p className="leading-relaxed">
            Perhatikan bahwa mekanisme penyuntikan DNA oleh selubung ekor kontraktil adalah ciri spesifik kelompok bakteriofag (virus pemangsa bakteri). Tidak semua virus memiliki mekanisme penetrasi yang identik! Banyak virus hewan dan manusia (seperti influenza, HIV, atau koronavirus) memiliki amplop membran lipid dan masuk ke sel inang secara utuh melalui endositosis atau fusi membran langsung.
          </p>
        </div>
      </div>

      {/* 1. Matrix Comparison Table: Lytic vs Lysogenic */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            Matriks Perbandingan: Siklus Litik vs Siklus Lisogenik
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Tabel komparasi parameter biologis antara dua jalur replikasi utama bakteriofag.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Parameter Pembanding</th>
                <th className="py-3 px-4 font-bold text-red-700 uppercase tracking-wider bg-red-50/50">
                  Siklus Litik (Virulen)
                </th>
                <th className="py-3 px-4 font-bold text-purple-700 uppercase tracking-wider bg-purple-50/50">
                  Siklus Lisogenik (Temperate)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">1. Tahapan Replikasi</td>
                <td className="py-3 px-4">5 Tahap: Adsorpsi, Penetrasi, Sintesis, Perakitan, Lisis.</td>
                <td className="py-3 px-4">4 Tahap: Adsorpsi, Penetrasi, Penggabungan (Profag), Pembelahan Sel (+ Induksi).</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">2. Kondisi Sel Inang</td>
                <td className="py-3 px-4 text-red-600 font-semibold">
                  Mati dan pecah (lisis) pada akhir siklus.
                </td>
                <td className="py-3 px-4 text-emerald-700 font-semibold">
                  Tetap hidup dan membelah secara normal.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">3. Status DNA Inang (Bakteri)</td>
                <td className="py-3 px-4">Didegradasi/dihancurkan oleh enzim nuklease virus.</td>
                <td className="py-3 px-4">Tetap utuh; bersatu dengan DNA virus membentuk profag.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">4. Keberadaan Profag</td>
                <td className="py-3 px-4 font-mono">Tidak ada profag.</td>
                <td className="py-3 px-4 text-purple-700 font-bold font-mono">
                  Terbentuk profag (terintegrasi).
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">5. Hasil Akhir Partikel Virus</td>
                <td className="py-3 px-4">100–200 virion baru yang infeksius langsung dilepaskan.</td>
                <td className="py-3 px-4">Tidak menghasilkan virion baru selama masa dorman profag.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">6. Waktu yang Diperlukan</td>
                <td className="py-3 px-4 font-mono">Cepat (~20–40 menit).</td>
                <td className="py-3 px-4 font-mono">Lama (dapat berlangsung bertahun-tahun/generasi).</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">7. Kelanjutan Siklus</td>
                <td className="py-3 px-4">Virion baru menginfeksi bakteri lain di sekitarnya.</td>
                <td className="py-3 px-4">
                  Dapat beralih ke siklus litik jika terjadi induksi (faktor stres/UV).
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Interactive Glossary Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            Glosarium Ilmiah Interaktif
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Klik istilah untuk membuka definisi lengkap dan perannya dalam replikasi virus.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {GLOSSARY_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveGlossary(item)}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-indigo-50/60 hover:border-indigo-300 transition-all text-left group flex flex-col justify-between"
            >
              <div>
                <span className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors block">
                  {item.term}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {item.pronunciation}
                </span>
              </div>
              <span className="mt-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                {item.relatedCycle}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Glossary Modal Detail */}
      {activeGlossary && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in"
        >
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-xl relative flex flex-col gap-4">
            <button
              type="button"
              onClick={() => setActiveGlossary(null)}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Tutup Glosarium"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                Glosarium Biologi
              </span>
              <span className="text-xs font-mono text-slate-400">{activeGlossary.pronunciation}</span>
            </div>

            <h3 className="text-xl font-extrabold text-slate-900">{activeGlossary.term}</h3>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-800 block mb-1">Definisi Biologis:</span>
                <p className="leading-relaxed">{activeGlossary.definition}</p>
              </div>

              <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 text-indigo-950">
                <span className="font-bold text-indigo-900 block mb-1">Peran dalam Replikasi:</span>
                <p className="leading-relaxed">{activeGlossary.roleInReplication}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveGlossary(null)}
              className="mt-2 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
            >
              Tutup Penjelasan
            </button>
          </div>
        </div>
      )}

      {/* 3. Scientific Explanation Reasoning Questions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col gap-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-600" />
            Membangun Penjelasan Ilmiah (Scientific Argumentation)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Gunakan pengamatan simulasi untuk menjawab 3 pertanyaan penalaran berikut. Kirim jawaban untuk membandingkannya dengan penjelasan ilmiah para ahli.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {SCIENTIFIC_EXPLANATION_QUESTIONS.map((q) => {
            const val = notes[q.id] || '';
            return (
              <div
                key={q.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col gap-3"
              >
                <h3 className="font-bold text-sm text-slate-900">{q.title}</h3>
                <p className="text-xs text-slate-600">{q.prompt}</p>

                <textarea
                  value={val}
                  onChange={(e) => handleNoteChange(q.id, e.target.value)}
                  placeholder="Ketik argumen atau penjelasan ilmiah Anda di sini..."
                  rows={3}
                  className="w-full text-xs text-slate-800 p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white resize-y"
                />

                {/* Feedback Panel */}
                {isSubmitted && (
                  <div className="mt-2 p-3.5 bg-emerald-50/80 rounded-xl border border-emerald-200/80 text-xs flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Umpan Balik & Model Penjelasan Ilmiah:</span>
                    </div>
                    <p className="text-emerald-950 leading-relaxed font-normal">
                      {q.scientificFeedback}
                    </p>
                  </div>
                )}
              </div>
            );
          })}

          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100">
            {!isSubmitted ? (
              <button
                type="submit"
                className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Kirim & Periksa Penjelasan Ilmiah</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Penjelasan tersimpan! Bandingkan argumen Anda dengan model penjelasan di atas.</span>
              </div>
            )}

            <button
              type="button"
              onClick={onNavigateToElaborate}
              className="h-11 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-sm flex items-center gap-2 ml-auto cursor-pointer"
            >
              <span>Lanjut ke Fase Penerapan (Elaborate)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
