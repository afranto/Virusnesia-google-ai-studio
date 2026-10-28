import React, { useState } from 'react';
import { UserProgress, StudentIdentity, OrientationBlocksOpened } from '../types';
import {
  isStudentIdentityValid,
  areAllOrientationBlocksOpened,
  canStartLearning,
  getStudentInitials,
} from '../utils/storage';
import {
  Brain,
  Cog,
  Lightbulb,
  BarChart3,
  Scale,
  PenTool,
  Smile,
  Link as LinkIcon,
  Star,
  Info,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Sparkles,
  User,
  GraduationCap,
  Box,
  Gamepad2,
  Bot,
  Database,
} from 'lucide-react';

interface HomeSectionProps {
  progress: UserProgress;
  onUpdateIdentity: (identity: StudentIdentity) => void;
  onOpenOrientationBlock: (blockKey: keyof OrientationBlocksOpened) => void;
  onStartLearning: () => void;
  onOpenMateriAwal: () => void;
  onOpenLab3D?: () => void;
  onOpenGame?: () => void;
  onOpenChatAI?: () => void;
  onOpenScienceHub?: () => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  progress,
  onUpdateIdentity,
  onOpenOrientationBlock,
  onStartLearning,
  onOpenMateriAwal,
  onOpenLab3D,
  onOpenGame,
  onOpenChatAI,
  onOpenScienceHub,
}) => {
  const { student, orientationBlocks } = progress;

  // Local state for interactive accordion open/close of blocks
  // Default opened state is initialized with persistent stored state
  const [openBlocks, setOpenBlocks] = useState({
    objectives: orientationBlocks.objectives || true, // default first one visible for immediate immersion
    principles: orientationBlocks.principles || false,
    guide: orientationBlocks.guide || false,
  });

  const isIdentityValid = isStudentIdentityValid(student);
  const allBlocksOpened = areAllOrientationBlocksOpened(orientationBlocks);
  const canStart = canStartLearning(student, orientationBlocks);

  const handleToggleBlock = (blockKey: keyof OrientationBlocksOpened) => {
    const nextState = !openBlocks[blockKey];
    setOpenBlocks((prev) => ({ ...prev, [blockKey]: nextState }));
    if (nextState) {
      onOpenOrientationBlock(blockKey);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    const initials = getStudentInitials(newName);
    onUpdateIdentity({
      ...student,
      namaLengkap: newName,
      avatarInitials: initials,
    });
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newClass = e.target.value;
    onUpdateIdentity({
      ...student,
      kelas: newClass,
    });
  };

  // Six Learning Objective cards matching C1-C6 from prompt and image
  const objectives = [
    {
      code: 'C1',
      badgeText: 'Mengingat',
      badgeColor: 'bg-red-500 text-white',
      cardBorder: 'border-red-200 hover:border-red-300',
      icon: Brain,
      iconColor: 'text-red-500',
      text: 'Kamu bisa menyebutkan bagian-bagian bakteriofag: kepala, materi genetik, ekor, dan serabut ekor.',
    },
    {
      code: 'C2',
      badgeText: 'Memahami',
      badgeColor: 'bg-orange-500 text-white',
      cardBorder: 'border-orange-200 hover:border-orange-300',
      icon: Cog,
      iconColor: 'text-orange-500',
      text: 'Kamu bisa menjelaskan tahap siklus litik dan siklus lisogenik.',
    },
    {
      code: 'C3',
      badgeText: 'Menerapkan',
      badgeColor: 'bg-amber-500 text-white',
      cardBorder: 'border-amber-200 hover:border-amber-300',
      icon: Lightbulb,
      iconColor: 'text-amber-500',
      text: 'Kamu bisa memprediksi apa yang terjadi jika satu tahap replikasi terhambat.',
    },
    {
      code: 'C4',
      badgeText: 'Menganalisis',
      badgeColor: 'bg-emerald-600 text-white',
      cardBorder: 'border-emerald-200 hover:border-emerald-300',
      icon: BarChart3,
      iconColor: 'text-emerald-600',
      text: 'Kamu bisa membandingkan jalur litik dan lisogenik serta membaca data populasi bakteri dan virus.',
    },
    {
      code: 'C5',
      badgeText: 'Mengevaluasi',
      badgeColor: 'bg-sky-600 text-white',
      cardBorder: 'border-sky-200 hover:border-sky-300',
      icon: Scale,
      iconColor: 'text-sky-600',
      text: 'Kamu bisa menilai sebuah klaim atau upaya pencegahan berdasarkan tahap yang dihambat.',
    },
    {
      code: 'C6',
      badgeText: 'Mencipta',
      badgeColor: 'bg-purple-600 text-white',
      cardBorder: 'border-purple-200 hover:border-purple-300',
      icon: PenTool,
      iconColor: 'text-purple-600',
      text: 'Kamu bisa merancang model, rencana penyelidikan, dan rekomendasi untuk satu kasus.',
    },
  ];

  // Mindful, Meaningful, Joyful cards
  const principles = [
    {
      title: 'Mindful',
      subtitle: 'Belajar dengan tenang dan penuh perhatian.',
      detail: 'Tidak ada peringkat dan tidak ada penghitung waktu.',
      icon: Smile,
      iconBg: 'bg-emerald-100 text-emerald-700',
      borderColor: 'border-emerald-200',
    },
    {
      title: 'Meaningful',
      subtitle: 'Hubungkan materi dengan pengalaman sehari-hari.',
      detail: 'Misalnya pilek dan antibiotik dalam kehidupan nyata.',
      icon: LinkIcon,
      iconBg: 'bg-teal-100 text-teal-700',
      borderColor: 'border-teal-200',
    },
    {
      title: 'Joyful',
      subtitle: 'Belajar dengan mencoba langsung.',
      detail: 'Bukan dengan berlomba, melainkan menjelajah secara aktif.',
      icon: Star,
      iconBg: 'bg-purple-100 text-purple-700',
      borderColor: 'border-purple-200',
    },
  ];

  // Seven usage instruction cards
  const instructions = [
    {
      number: 1,
      title: 'Ikuti fase dari atas ke bawah.',
      detail: 'Fase berikutnya terbuka setelah fase sekarang selesai.',
    },
    {
      number: 2,
      title: 'Selesai berarti kamu sudah menjawab dan mengirim.',
      detail: 'Jawaban tidak harus benar saat itu.',
    },
    {
      number: 3,
      title: 'Jika macet, klik ikon bantuan.',
      detail: 'Bantuan bertambah bertahap dan dapat dimatikan.',
    },
    {
      number: 4,
      title: 'Ikon buku di pojok membuka glosarium kapan saja.',
      detail: 'Gunakan untuk mencari istilah penting.',
    },
    {
      number: 5,
      title: 'Identitas digunakan kembali pada setiap aktivitas.',
      detail: 'Isi nama dan kelas satu kali.',
    },
    {
      number: 6,
      title: 'Gunakan tombol jeda dan ulang untuk animasi.',
      detail: 'Opsi gambar diam tersedia.',
    },
    {
      number: 7,
      title: 'Website tidak memakai suara.',
      detail: 'Teks dan gambar menjelaskan seluruh isi. Komputer disarankan tetapi ponsel tetap dapat digunakan.',
    },
  ];

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col gap-8">
      {/* ============================================================== */}
      {/* HERO SECTION: Title, Phage Diagram, & Identity Form */}
      {/* ============================================================== */}
      <div className="bg-gradient-to-br from-[#F0F6FF] via-white to-[#F0F4FF] rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#D0E2FF] shadow-sm relative overflow-hidden">
        {/* Soft background accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-purple-100/40 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
          {/* Left Column (7 cols): Heading & Anatomical Bacteriophage Illustration */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-[#0F2942]">
                  VIRUSNESIA
                </span>
              </div>
              <h1 className="font-heading font-bold text-xl sm:text-2xl text-[#1A73E8]">
                Yuk, kenali virus lebih dekat!
              </h1>
              <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-lg leading-relaxed">
                Belajar tentang bakteriofag dan cara virus berkembang biak.
              </p>
            </div>

            {/* Bacteriophage & Bacterial Cell Visual Diagram with Leader Lines */}
            <div className="w-full bg-white/90 backdrop-blur-xs rounded-2xl border border-blue-100 p-4 sm:p-5 shadow-inner relative flex items-center justify-center">
              <svg
                viewBox="0 0 540 320"
                className="w-full h-auto max-w-[480px]"
                aria-label="Diagram Bakteriofag menempel pada sel bakteri dengan label anatomi"
              >
                <defs>
                  {/* Gradients */}
                  <linearGradient id="phageHeadGradHero" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="50%" stopColor="#6D28D9" />
                    <stop offset="100%" stopColor="#4C1D95" />
                  </linearGradient>
                  <linearGradient id="bactSurfaceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#581C87" />
                    <stop offset="50%" stopColor="#3B0764" />
                    <stop offset="100%" stopColor="#1E1B4B" />
                  </linearGradient>
                  <filter id="heroGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Bacterial Cell Curved Surface at Bottom */}
                <path
                  d="M 20 280 Q 270 215 520 280 L 520 320 L 20 320 Z"
                  fill="url(#bactSurfaceGrad)"
                  stroke="#A855F7"
                  strokeWidth="3"
                />
                {/* Bacterial membrane texture dots/ribs */}
                <path
                  d="M 40 280 Q 270 225 500 280"
                  fill="none"
                  stroke="#C084FC"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  opacity="0.8"
                />

                {/* Bacteriophage Body */}
                <g transform="translate(270, 75)">
                  {/* Icosahedral Head */}
                  <polygon
                    points="0,-55 38,-30 38,10 0,35 -38,10 -38,-30"
                    fill="url(#phageHeadGradHero)"
                    stroke="#DDD6FE"
                    strokeWidth="2.5"
                    filter="url(#heroGlow)"
                  />
                  {/* Facet division lines */}
                  <line x1="0" y1="-55" x2="0" y2="35" stroke="#C4B5FD" strokeWidth="1.5" opacity="0.6" />
                  <line x1="-38" y1="-30" x2="38" y2="10" stroke="#C4B5FD" strokeWidth="1.2" opacity="0.5" />
                  <line x1="-38" y1="10" x2="38" y2="-30" stroke="#C4B5FD" strokeWidth="1.2" opacity="0.5" />

                  {/* Coiled Genetic Material (dsDNA) */}
                  <path
                    d="M -16,-18 Q 0,-30 16,-18 Q 0,0 -12,12 Q 10,18 0,22"
                    fill="none"
                    stroke="#38BDF8"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    filter="url(#heroGlow)"
                  />

                  {/* Collar */}
                  <rect x="-8" y="35" width="16" height="5" fill="#3B82F6" rx="2" />

                  {/* Sheath (Ekor) */}
                  <rect x="-6" y="40" width="12" height="42" fill="#2563EB" stroke="#93C5FD" strokeWidth="1.5" rx="2" />
                  {/* Sheath striations */}
                  {[0, 1, 2, 3, 4].map((i) => (
                    <line key={i} x1="-6" y1={46 + i * 7} x2="6" y2={46 + i * 7} stroke="#DBEAFE" strokeWidth="1.5" />
                  ))}

                  {/* Baseplate */}
                  <polygon points="-12,82 12,82 10,90 -10,90" fill="#1D4ED8" stroke="#60A5FA" strokeWidth="1" />

                  {/* Tail Fibers (Serabut ekor) landing on membrane */}
                  <path d="M -10,88 Q -30,110 -55,142" fill="none" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" />
                  <path d="M 10,88 Q 30,110 55,142" fill="none" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" />
                  <path d="M -8,88 Q -18,115 -30,146" fill="none" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 8,88 Q 18,115 30,146" fill="none" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" />
                </g>

                {/* ======================================================= */}
                {/* CALLOUT LABELS & LEADER LINES */}
                {/* ======================================================= */}

                {/* 1. Label: Kepala */}
                <g id="label-kepala">
                  <path d="M 330 35 L 375 35" stroke="#1E293B" strokeWidth="1.5" strokeDasharray="3 2" />
                  <circle cx="270" cy="40" r="3" fill="#6D28D9" />
                  <rect x="375" y="22" width="70" height="26" rx="6" fill="#0F172A" />
                  <text x="410" y="39" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">
                    Kepala
                  </text>
                </g>

                {/* 2. Label: Materi genetik */}
                <g id="label-materi-genetik">
                  <path d="M 270 70 L 390 70" stroke="#1E293B" strokeWidth="1.5" strokeDasharray="3 2" />
                  <circle cx="270" cy="70" r="3" fill="#0284C7" />
                  <rect x="390" y="57" width="105" height="26" rx="6" fill="#0F172A" />
                  <text x="442" y="74" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">
                    Materi genetik
                  </text>
                </g>

                {/* 3. Label: Ekor */}
                <g id="label-ekor">
                  <path d="M 276 135 L 375 135" stroke="#1E293B" strokeWidth="1.5" strokeDasharray="3 2" />
                  <circle cx="276" cy="135" r="3" fill="#2563EB" />
                  <rect x="375" y="122" width="60" height="26" rx="6" fill="#0F172A" />
                  <text x="405" y="139" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">
                    Ekor
                  </text>
                </g>

                {/* 4. Label: Serabut ekor */}
                <g id="label-serabut-ekor">
                  <path d="M 320 200 L 410 200" stroke="#1E293B" strokeWidth="1.5" strokeDasharray="3 2" />
                  <circle cx="315" cy="195" r="3" fill="#3B82F6" />
                  <rect x="410" y="187" width="95" height="26" rx="6" fill="#0F172A" />
                  <text x="457" y="204" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">
                    Serabut ekor
                  </text>
                </g>

                {/* 5. Label: Sel bakteri */}
                <g id="label-sel-bakteri">
                  <path d="M 120 260 L 180 260" stroke="#1E293B" strokeWidth="1.5" strokeDasharray="3 2" />
                  <circle cx="180" cy="260" r="3" fill="#A855F7" />
                  <rect x="40" y="247" width="85" height="26" rx="6" fill="#0F172A" />
                  <text x="82" y="264" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">
                    Sel bakteri
                  </text>
                </g>
              </svg>
            </div>
          </div>

          {/* Right Column (5 cols): Student Identity Form Card */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm flex flex-col gap-4">
              <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-base text-slate-900 leading-snug">
                    Identitas Peserta Didik
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Isi nama dan kelas kamu. Data ini akan digunakan untuk semua aktivitas dan hasil unduhan.
                  </p>
                </div>
              </div>

              {/* Nama Lengkap Input */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="nama-lengkap-input"
                  className="text-xs font-bold text-slate-700 flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Nama lengkap</span>
                </label>
                <input
                  id="nama-lengkap-input"
                  type="text"
                  value={student.namaLengkap}
                  onChange={handleNameChange}
                  placeholder="Contoh: Andi Pratama"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  aria-required="true"
                />
              </div>

              {/* Kelas Dropdown Select */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="kelas-select"
                  className="text-xs font-bold text-slate-700 flex items-center gap-1.5"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  <span>Kelas</span>
                </label>
                <div className="relative">
                  <select
                    id="kelas-select"
                    value={student.kelas}
                    onChange={handleClassChange}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer pr-10"
                    aria-required="true"
                  >
                    <option value="" disabled>
                      Pilih kelas
                    </option>
                    {[
                      'X-1',
                      'X-2',
                      'X-3',
                      'X-4',
                      'X-5',
                      'X-6',
                      'X-7',
                      'X-8',
                      'X-9',
                      'X-10',
                      'X-11',
                      'X-12',
                    ].map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Identity Status Pill */}
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 border transition-colors ${
                  isIdentityValid
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                {isIdentityValid ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Identitas valid: Siap digunakan untuk aktivitas belajar.</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Wajib melengkapi nama dan kelas sebelum memulai.</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* ORIENTATION BLOCK 1: Tujuan Belajar (C1 to C6 Cards) */}
      {/* ============================================================== */}
      <section
        className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden transition-all"
        aria-labelledby="tujuan-belajar-heading"
      >
        <button
          type="button"
          onClick={() => handleToggleBlock('objectives')}
          className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors cursor-pointer select-none"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="tujuan-belajar-heading"
                  className="font-heading font-bold text-base sm:text-lg text-slate-900"
                >
                  Tujuan Belajar
                </h2>
                {orientationBlocks.objectives && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Terbuka
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Setelah menyelesaikan seluruh aktivitas, kamu akan dapat:
              </p>
            </div>
          </div>
          <div className="p-2 rounded-xl text-slate-400 hover:text-slate-700">
            {openBlocks.objectives ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </button>

        {openBlocks.objectives && (
          <div className="px-5 pb-6 sm:px-6 pt-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3.5 border-t border-slate-100">
            {objectives.map((obj) => {
              const Icon = obj.icon;
              return (
                <div
                  key={obj.code}
                  className={`bg-slate-50/60 rounded-2xl p-4 border ${obj.cardBorder} flex flex-col justify-between gap-3 shadow-2xs hover:shadow-xs transition-shadow`}
                >
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md ${obj.badgeColor}`}>
                        {obj.code}
                      </span>
                      <Icon className={`w-4 h-4 ${obj.iconColor}`} />
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {obj.text}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-200/60">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500">
                      {obj.badgeText}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ============================================================== */}
      {/* ORIENTATION BLOCK 2: Prinsip Mindful, Meaningful, Joyful */}
      {/* ============================================================== */}
      <section
        className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden transition-all"
        aria-labelledby="prinsip-heading"
      >
        <button
          type="button"
          onClick={() => handleToggleBlock('principles')}
          className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors cursor-pointer select-none"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Smile className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="prinsip-heading"
                  className="font-heading font-bold text-base sm:text-lg text-slate-900"
                >
                  Prinsip Mindful, Meaningful, Joyful
                </h2>
                {orientationBlocks.principles && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Terbuka
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Tiga prinsip yang akan menemani kamu selama belajar di VIRUSNESIA.
              </p>
            </div>
          </div>
          <div className="p-2 rounded-xl text-slate-400 hover:text-slate-700">
            {openBlocks.principles ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </button>

        {openBlocks.principles && (
          <div className="px-5 pb-6 sm:px-6 pt-1 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100">
            {principles.map((pr) => {
              const Icon = pr.icon;
              return (
                <div
                  key={pr.title}
                  className={`bg-slate-50/60 rounded-2xl p-4 sm:p-5 border ${pr.borderColor} flex flex-col gap-3 shadow-2xs hover:shadow-xs transition-shadow`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-xl ${pr.iconBg} flex items-center justify-center shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-heading font-bold text-sm sm:text-base text-slate-900">
                      {pr.title}
                    </h3>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                      "{pr.subtitle}"
                    </p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {pr.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ============================================================== */}
      {/* ORIENTATION BLOCK 3: Petunjuk Penggunaan (7 Steps) */}
      {/* ============================================================== */}
      <section
        className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden transition-all"
        aria-labelledby="petunjuk-penggunaan-heading"
      >
        <button
          type="button"
          onClick={() => handleToggleBlock('guide')}
          className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors cursor-pointer select-none"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="petunjuk-penggunaan-heading"
                  className="font-heading font-bold text-base sm:text-lg text-slate-900"
                >
                  Petunjuk Penggunaan
                </h2>
                {orientationBlocks.guide && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Terbuka
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Ikuti tahap dari atas ke bawah. Gunakan jeda, ulang, dan bantuan bila perlu. Progresmu tersimpan.
              </p>
            </div>
          </div>
          <div className="p-2 rounded-xl text-slate-400 hover:text-slate-700">
            {openBlocks.guide ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </button>

        {openBlocks.guide && (
          <div className="px-5 pb-6 sm:px-6 pt-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3 border-t border-slate-100">
            {instructions.map((ins) => (
              <div
                key={ins.number}
                className="bg-slate-50/70 rounded-2xl p-3.5 border border-slate-200/80 flex flex-col gap-2"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                    {ins.number}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Langkah {ins.number}
                  </span>
                </div>
                <h4 className="font-heading font-bold text-xs text-slate-900 leading-snug">
                  {ins.title}
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {ins.detail}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ============================================================== */}
      {/* FITUR UNGGULAN: 3D LAB, GAME 3D, TANYA BIOAI, PUSAT SAINS */}
      {/* ============================================================== */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[11px] font-mono font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> FITUR MULTIMEDIA INTERAKTIF
            </div>
            <h3 className="font-heading font-extrabold text-lg sm:text-xl text-white tracking-tight">
              Eksplorasi Lanjutan: Laboratorium 3D, Game & Biosains
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Perdalam pemahaman konsep replikasi bakteriofag melalui visualisasi 3D WebGL, simulasi game interaktif, dan tutor pintar virologi.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Lab 3D */}
          <button
            type="button"
            onClick={onOpenLab3D}
            className="group p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-400/50 transition-all text-left flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/40 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Box className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-sm text-white group-hover:text-blue-300 transition-colors">
                Laboratorium 3D
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Inspeksi model 3D Three.js realistis, mode tembus pandang X-Ray genom, dan simulasi injeksi.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-blue-400 font-semibold">
              <span>Buka Lab 3D</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 2: Game 3D */}
          <button
            type="button"
            onClick={onOpenGame}
            className="group p-5 rounded-2xl bg-gradient-to-b from-amber-500/10 to-orange-500/5 hover:from-amber-500/20 hover:to-orange-500/10 border border-amber-500/30 hover:border-amber-400/60 transition-all text-left flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/30 border border-amber-500/40 text-amber-300 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-sm text-amber-200 group-hover:text-amber-100 transition-colors">
                Game 3D: Phage Attack
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Kendalikan bakteriofag, lakukan docking reseptor, suntikkan genom, dan capai ledakan lisis!
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-500/20 flex items-center justify-between text-xs text-amber-400 font-bold">
              <span>Mainkan Sekarang</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 3: Tanya BioAI */}
          <button
            type="button"
            onClick={onOpenChatAI}
            className="group p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-400/50 transition-all text-left flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Bot className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-sm text-white group-hover:text-indigo-300 transition-colors">
                Tanya Dr. Vira (BioAI)
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Tutor AI virologi multi-turn berbasis Gemini 3.8 Flash dengan pencarian fakta Google Search.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-indigo-400 font-semibold">
              <span>Mulai Diskusi</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 4: Pusat Sains */}
          <button
            type="button"
            onClick={onOpenScienceHub}
            className="group p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-400/50 transition-all text-left flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Database className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                Pusat Sains & Genomika
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Data resmi NCBI RefSeq, struktur kristal gp23*, sakelar molekuler Cro/cI, dan terapi fag.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-emerald-400 font-semibold">
              <span>Buka Basis Data</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </section>

      {/* ============================================================== */}
      {/* BOTTOM ACTION BAR: Note & Navigation Buttons */}
      {/* ============================================================== */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-5">
        {/* Note simulation data */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Info className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xs text-slate-600">
            <strong className="text-slate-800">Catatan:</strong> Semua data pada website adalah data simulasi untuk pembelajaran.
          </div>
        </div>

        {/* Buttons right: Secondary "Baca materi dulu" & Primary "Saya siap, mulai!" */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {/* Secondary Link: Baca materi dulu */}
          <button
            type="button"
            onClick={onOpenMateriAwal}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50/80 transition-colors cursor-pointer border border-transparent hover:border-blue-200"
          >
            Baca materi dulu
          </button>

          {/* Primary Button: Saya siap, mulai! */}
          <div className="relative group">
            <button
              type="button"
              onClick={onStartLearning}
              disabled={!canStart}
              className={`h-12 px-6 rounded-xl font-heading font-bold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 ${
                canStart
                  ? 'bg-[#1A73E8] hover:bg-[#1557b0] active:bg-[#0d47a1] text-white cursor-pointer hover:shadow-blue-500/25'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none border border-slate-300/60'
              }`}
              title={
                canStart
                  ? 'Mulai belajar fase Let’s Wonder'
                  : 'Lengkapi identitas dan buka 3 blok informasi terlebih dahulu'
              }
            >
              <span>Saya siap, mulai!</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Tooltip hint when disabled */}
            {!canStart && (
              <div className="absolute right-0 bottom-full mb-2 hidden group-hover:flex flex-col gap-1 w-64 p-3 bg-slate-900 text-white text-[11px] rounded-xl shadow-xl z-20 pointer-events-none">
                <span className="font-bold text-amber-300 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Syarat belum terpenuhi:
                </span>
                {!isIdentityValid && <span>• Lengkapi nama lengkap & kelas</span>}
                {!orientationBlocks.objectives && <span>• Buka blok "Tujuan Belajar"</span>}
                {!orientationBlocks.principles && <span>• Buka blok "Prinsip Mindful..."</span>}
                {!orientationBlocks.guide && <span>• Buka blok "Petunjuk Penggunaan"</span>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
