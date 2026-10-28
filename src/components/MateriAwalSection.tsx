import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Dna,
  ShieldAlert,
  ChevronRight,
  RotateCcw,
  Info,
} from 'lucide-react';

interface MateriAwalSectionProps {
  onBackToHome: () => void;
  onProceedToEngage: () => void;
}

export const MateriAwalSection: React.FC<MateriAwalSectionProps> = ({
  onBackToHome,
  onProceedToEngage,
}) => {
  const [activeTopicIndex, setActiveTopicIndex] = useState<number>(0);
  const [openedFactCards, setOpenedFactCards] = useState<Record<number, boolean>>({});
  const [selectedSubQuestion, setSelectedSubQuestion] = useState<Record<number, string>>({});

  const topics = [
    {
      id: 1,
      number: 1,
      title: 'Virus dalam kehidupan sehari-hari',
      subtitle: 'Saat pilek, mengapa antibiotik belum tentu membantu?',
      context: 'Amati kasus Rani saat mengalami pilek, lalu pilih pertanyaan yang ingin kamu telusuri.',
      illustrationLabel: 'Rani sedang pilek dan bertanya tentang antibiotik',
      questions: [
        {
          id: 'q1',
          text: 'Apa penyebab pilek biasa?',
          factTitle: 'Penyebab Pilek adalah Virus (Rhinovirus)',
          factContent:
            'Pilek (common cold) disebabkan oleh infeksi virus, paling sering adalah rhinovirus. Virus memiliki struktur aseluler yang tidak memiliki dinding sel peptidoglikan atau ribosom sendiri.',
        },
        {
          id: 'q2',
          text: 'Antibiotik bekerja pada apa?',
          factTitle: 'Antibiotik Menyerang Struktur Spesifik Bakteri',
          factContent:
            'Antibiotik dirancang secara kimia untuk merusak sintesis dinding sel atau ribosom bakteri. Karena virus tidak memiliki struktur tersebut, antibiotik sama sekali tidak efektif melawan infeksi virus.',
        },
      ],
      summary:
        'Virus dan bakteri adalah dua entitas yang sangat berbeda. Mengetahui target kerja obat mencegah penyalahgunaan antibiotik.',
    },
    {
      id: 2,
      number: 2,
      title: 'Apa itu virus?',
      subtitle: 'Partikel mikroskopis peralihan antara benda mati dan makhluk hidup',
      context: 'Pelajari ciri utama virus sebagai parasit intraseluler obligat.',
      illustrationLabel: 'Partikel virion di luar sel inang bersifat kristal/inaktif',
      questions: [
        {
          id: 'q1',
          text: 'Apakah virus termasuk sel?',
          factTitle: 'Virus adalah Entitas Aseluler (Bukan Sel)',
          factContent:
            'Virus tidak memiliki membran plasma mandiri, sitoplasma, sitosol, atau organel penghasil energi (mitokondria). Virus berukuran sangat renik (20–400 nm).',
        },
        {
          id: 'q2',
          text: 'Bagaimana virus berkembang biak?',
          factTitle: 'Replikasi Melalui Pembajakan Sel Inang',
          factContent:
            'Di luar sel inang, virus tidak dapat melakukan metabolisme sendiri. Begitu asam nukleatnya masuk ke sel hidup, virus memanfaatkan enzim dan ribosom inang untuk memperbanyak diri.',
        },
      ],
      summary:
        'Virus hanya dapat aktif bereplikasi di dalam sel inang hidup yang kompatibel.',
    },
    {
      id: 3,
      number: 3,
      title: 'Virus, bakteri, dan sel',
      subtitle: 'Perbandingan ukuran dan organisasi seluler',
      context: 'Bandingkan skala ukuran virus terhadap sel inang bakteri.',
      illustrationLabel: 'Bakteriofag berukuran ~100 nm menempel pada bakteri ~2.000 nm',
      questions: [
        {
          id: 'q1',
          text: 'Seberapa kecil ukuran bakteriofag?',
          factTitle: 'Skala Nanometer: 20 Kali Lebih Kecil dari Bakteri',
          factContent:
            'Bakteriofag berukuran sekitar 100 nm, sedangkan sel bakteri Escherichia coli berukuran sekitar 2.000 nm (2 mikrometer). Virus hanya dapat dilihat menggunakan mikroskop elektron.',
        },
        {
          id: 'q2',
          text: 'Mengapa virus sangat selektif memilih inang?',
          factTitle: 'Kesesuaian Reseptor Permukaan (Gembok dan Kunci)',
          factContent:
            'Protein serabut ekor virus harus cocok secara stereokimia dengan molekul reseptor (misalnya protein OmpC atau LPS) pada dinding sel bakteri.',
        },
      ],
      summary:
        'Perbedaan ukuran dan reseptor spesifik menentukan sel mana yang dapat diinfeksi oleh bakteriofag.',
    },
    {
      id: 4,
      number: 4,
      title: 'Struktur bakteriofag',
      subtitle: 'Mengenal anatomi morfologi bakteriofag T4',
      context: 'Pelajari enam bagian penting bakteriofag yang dirancang khusus untuk menyuntikkan genom.',
      illustrationLabel: 'Kepala ikosahedral, selubung ekor, dan serabut ekor',
      questions: [
        {
          id: 'q1',
          text: 'Apa fungsi kepala kapsid?',
          factTitle: 'Melindungi Materi Genetik (dsDNA)',
          factContent:
            'Kepala tersusun atas kapsomer protein berbentuk ikosahedron yang membungkus materi genetik DNA dengan tekanan osmotik internal tinggi.',
        },
        {
          id: 'q2',
          text: 'Bagaimana ekor memasukkan DNA?',
          factTitle: 'Kontraksi Seperti Jarum Suntik Mikro',
          factContent:
            'Lempeng dasar melubangi peptidoglikan dengan enzim lisozim, lalu selubung ekor berkontraksi memendek menyuntikkan DNA melewati membran plasma ke sitoplasma.',
        },
      ],
      summary:
        'Hanya DNA virus yang memasuki sitoplasma sel inang; cangkang kapsid protein tertinggal di luar.',
    },
    {
      id: 5,
      number: 5,
      title: 'Jalur litik dan lisogenik',
      subtitle: 'Gambaran umum dua strategi replikasi virus',
      context: 'Pahami perbedaan jalur virulen (mematikan) versus jalur temperate (dorman).',
      illustrationLabel: 'Jalur A Lisis versus Jalur B Pembentukan Profag',
      questions: [
        {
          id: 'q1',
          text: 'Apa ciri khas siklus litik?',
          factTitle: 'Replikasi Cepat dan Penghancuran Sel Inang',
          factContent:
            'DNA inang dihancurkan, komponen virus diproduksi secara masif, dan dinding sel dipecah (lisis) membebaskan ratusan virion baru dalam 20–30 menit.',
        },
        {
          id: 'q2',
          text: 'Apa ciri khas siklus lisogenik?',
          factTitle: 'Integrasi Damai Membentuk Profag',
          factContent:
            'DNA virus menyatu ke kromosom bakteri menjadi profag. Sel bakteri tetap hidup dan membelah normal, mewariskan profag ke setiap generasi sel anak.',
        },
      ],
      summary:
        'Siklus litik mematikan inang demi pelepasan virus cepat, sedangkan lisogenik menyalin genom virus secara damai bersama pembelahan sel inang.',
    },
  ];

  const currentTopic = topics[activeTopicIndex];
  const isFactOpen = Boolean(openedFactCards[activeTopicIndex]);
  const activeQuestionId =
    selectedSubQuestion[activeTopicIndex] || currentTopic.questions[0].id;
  const activeQuestion =
    currentTopic.questions.find((q) => q.id === activeQuestionId) ||
    currentTopic.questions[0];

  const handleSelectQuestion = (qId: string) => {
    setSelectedSubQuestion((prev) => ({ ...prev, [activeTopicIndex]: qId }));
    setOpenedFactCards((prev) => ({ ...prev, [activeTopicIndex]: true }));
  };

  const handleToggleFact = () => {
    setOpenedFactCards((prev) => ({
      ...prev,
      [activeTopicIndex]: !prev[activeTopicIndex],
    }));
  };

  return (
    <div className="max-w-[1180px] mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col gap-6">
      {/* Top Header & Breadcrumb */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <button
              type="button"
              onClick={onBackToHome}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Beranda</span>
            </button>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-semibold text-slate-500">Materi Awal</span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
              Topik {currentTopic.number} dari {topics.length}
            </span>
            <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-medium border border-emerald-200">
              Baca Mandiri · Tanpa Skor
            </span>
          </div>

          <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
            Kenali virus dulu, lalu coba sendiri.
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Pilih topik yang ingin kamu pahami. Kamu bebas membuka ulang kapan saja.
          </p>
        </div>

        <button
          type="button"
          onClick={onProceedToEngage}
          className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-heading font-bold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
        >
          <span>Langsung ke Let's Wonder</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Grid: Left Topic Navigation & Right Topic Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Topic Sidebar (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Daftar Topik Pengantar
            </span>
            <span className="text-xs font-mono font-bold text-slate-600">
              {activeTopicIndex + 1}/{topics.length}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {topics.map((t, idx) => {
              const isActive = idx === activeTopicIndex;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTopicIndex(idx)}
                  className={`text-left p-3 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs font-bold'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-white text-blue-600' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {t.number}
                    </span>
                    <span className="text-xs line-clamp-1 leading-snug">{t.title}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                </button>
              );
            })}
          </div>

          <div className="mt-2 p-3 bg-blue-50/70 border border-blue-100 rounded-2xl text-[11px] text-blue-800 leading-relaxed flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>
              Materi Awal bersifat pengenalan opsional dan bukan syarat untuk memulai fase pembelajaran.
            </span>
          </div>
        </div>

        {/* Right Active Topic Details (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col gap-5">
            {/* Topic Header Badge */}
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md">
                TOPIK {currentTopic.number}
              </span>
              <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 mt-2">
                {currentTopic.title}
              </h2>
              <p className="font-semibold text-sm text-blue-600 mt-1">
                {currentTopic.subtitle}
              </p>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                {currentTopic.context}
              </p>
            </div>

            {/* Interactive Question Selector Buttons */}
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-700">
                Apa yang ingin kamu cari tahu?
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentTopic.questions.map((q) => {
                  const isSelected = activeQuestionId === q.id;
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => handleSelectQuestion(q.id)}
                      className={`text-left p-3.5 rounded-2xl border text-xs font-semibold transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'bg-blue-50 text-blue-900 border-blue-400 shadow-2xs ring-1 ring-blue-300'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span className="line-clamp-2">{q.text}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-md shrink-0 font-bold ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {isSelected ? 'Dipilih' : 'Pilih'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fact Card (Buka Fakta) */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200/90 rounded-2xl p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-purple-600 text-white">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-sm text-purple-950">
                      Kartu Fakta Ilmiah
                    </h3>
                    <p className="text-[11px] text-purple-700">
                      Buka saat kamu siap membaca penjelasannya
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleToggleFact}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  {isFactOpen ? 'Tutup Fakta' : 'Buka Fakta →'}
                </button>
              </div>

              {isFactOpen ? (
                <div className="pt-3 border-t border-purple-200/80 animate-burst space-y-1.5">
                  <h4 className="font-bold text-xs sm:text-sm text-purple-950">
                    {activeQuestion.factTitle}
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {activeQuestion.factContent}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-purple-800 italic pt-1">
                  Penjelasan konseptual akan muncul setelah kartu fakta dibuka.
                </p>
              )}
            </div>

            {/* Summary Box */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 leading-relaxed">
              <strong className="text-slate-900 block mb-0.5">Ringkasan Inti:</strong>
              {currentTopic.summary}
            </div>

            {/* Bottom Stepper Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setActiveTopicIndex((prev) => Math.max(0, prev - 1))}
                disabled={activeTopicIndex === 0}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                ← Topik Sebelumnya
              </button>

              {activeTopicIndex < topics.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setActiveTopicIndex((prev) => prev + 1)}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Topik Berikutnya</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onProceedToEngage}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Mulai Let's Wonder</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
