import React from 'react';
import { HelpCircle, X, Sliders, Database, BookOpen, Layers, CheckCircle2 } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const faqs = [
    {
      q: 'Bagaimana cara memulai pembelajaran?',
      a: 'Isi nama lengkap dan kelas pada Beranda, lalu buka ketiga blok informasi (Tujuan Belajar, Prinsip Mindful Meaningful Joyful, dan Petunjuk Penggunaan). Tombol "Saya siap, mulai!" akan aktif setelah data lengkap dan ketiga blok telah dibuka.',
    },
    {
      q: 'Apakah progres dan jawaban saya tersimpan?',
      a: 'Ya, seluruh identitas, jawaban pertanyaan, catatan pengamatan simulasi, dan skor kuis tersimpan secara otomatis di memori lokal browser (localStorage). Anda tidak memerlukan akun atau login.',
    },
    {
      q: 'Bagaimana cara menggunakan simulasi laboratorium?',
      a: 'Gunakan tombol Putar, Jeda, Ulangi, Maju, dan Mundur. Anda juga dapat menggunakan tombol aksi interaktif (misal: "Kunci ke Reseptor", "Suntikkan dsDNA", "Lampu Radiasi UV") dan mengaktifkan Probe Sensor untuk memeriksa molekul.',
    },
    {
      q: 'Apakah ada batasan waktu atau peringkat nilai?',
      a: 'Tidak ada. Sesuai prinsip Mindful dan Joyful, Anda belajar dengan tenang tanpa penghitung waktu mundur dan tanpa papan peringkat.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-burst">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-slate-900">
                Pusat Bantuan & Panduan
              </h3>
              <p className="text-xs text-slate-500">
                Panduan praktis belajar mandiri di VIRUSNESIA
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            aria-label="Tutup Bantuan"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* Quick tips */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl flex items-start gap-2.5">
              <Sliders className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <div className="text-xs">
                <strong className="text-blue-950 block mb-0.5">Kontrol Manual</strong>
                <p className="text-blue-800 leading-relaxed">
                  Semua animasi dikendalikan secara manual, tidak otomatis berputar sendiri.
                </p>
              </div>
            </div>

            <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl flex items-start gap-2.5">
              <Database className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div className="text-xs">
                <strong className="text-emerald-950 block mb-0.5">Tersimpan Otomatis</strong>
                <p className="text-emerald-800 leading-relaxed">
                  Tutup atau muat ulang halaman kapan saja tanpa khawatir kehilangan jawaban.
                </p>
              </div>
            </div>
          </div>

          {/* FAQs */}
          <div className="space-y-3 pt-2">
            <h4 className="font-heading font-bold text-sm text-slate-900">
              Pertanyaan yang Sering Diajukan (FAQ)
            </h4>
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-1">
                <span className="font-bold text-xs sm:text-sm text-slate-900">
                  {faq.q}
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Mengerti, Tutup Bantuan
          </button>
        </div>
      </div>
    </div>
  );
};
