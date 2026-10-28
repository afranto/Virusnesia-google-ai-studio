import React, { useState } from 'react';
import {
  Dna,
  Database,
  ExternalLink,
  Layers,
  Sparkles,
  Search,
  BookOpen,
  Scale,
  Microscope,
  Cpu,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const BioscienceHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'genomics' | 'capsid' | 'switch' | 'therapy' | 'scale'>('genomics');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-mono font-semibold uppercase tracking-wider mb-3">
              <Database className="w-3.5 h-3.5" /> PUSAT BIOSAINS & GENOMIKA VIRUS
            </div>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight mb-2">
              Basis Data Molekuler Bakteriofag T4 & Lambda
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Eksplorasi arsip data genomik terverifikasi dari NCBI RefSeq, struktur kristalografi protein RCSB PDB, serta mekanisme sakelar transkripsi molekuler siklus litik dan lisogenik.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
            <span className="text-[11px] font-mono px-3 py-1.5 rounded-lg bg-white/10 text-slate-200 border border-white/15">
              NCBI: <b>NC_000866.4</b>
            </span>
            <span className="text-[11px] font-mono px-3 py-1.5 rounded-lg bg-white/10 text-slate-200 border border-white/15">
              RCSB PDB: <b>1YUE / 5IV5</b>
            </span>
            <span className="text-[11px] font-mono px-3 py-1.5 rounded-lg bg-white/10 text-slate-200 border border-white/15">
              Simetri: <b>T=13 (laevo)</b>
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-6 pt-5 border-t border-slate-800 overflow-x-auto no-scrollbar">
          {[
            { id: 'genomics', label: 'Arsitektur Genom T4', icon: Dna },
            { id: 'capsid', label: 'Kisi Kristal Kapsid (gp23*)', icon: Layers },
            { id: 'switch', label: 'Sakelar Molekuler Cro / cI', icon: Zap },
            { id: 'therapy', label: 'Terapi Bakteriofag & AMR', icon: ShieldCheck },
            { id: 'scale', label: 'Komparasi Skala Nanometer', icon: Scale },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-400/40'
                    : 'bg-white/10 text-slate-300 hover:bg-white/15 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: GENOMICS */}
      {activeTab === 'genomics' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">
                  ORGANISME MODEL: ENTEROBACTERIA PHAGE T4
                </span>
                <h3 className="font-heading font-extrabold text-lg sm:text-xl text-slate-900 mt-1">
                  Peta Genom dsDNA & Redundansi Terminal
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                168.903 Pasang Basa
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Genom bakteriofag T4 terdiri dari molekul DNA untai ganda (dsDNA) linier sepanjang 168.903 bp yang mengkodekan 289 protein dan beberapa tRNA fungsional. Genom ini dikemas dalam kapsid dengan mekanisme perputaran melingkar (circular permutation) dan redundansi terminal (~3%), di mana setiap ujung molekul memiliki salinan gen identik.
            </p>

            {/* Visual Genome Map Representation */}
            <div className="bg-slate-900 rounded-xl p-5 text-white">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                <span className="font-mono">0 kbp (Immediate Early)</span>
                <span className="font-mono text-cyan-400">80 kbp (Delayed Early / DNA Repl)</span>
                <span className="font-mono text-amber-400">168.9 kbp (Late Structural)</span>
              </div>

              {/* Progress-style Genome Strip */}
              <div className="h-6 w-full rounded-lg bg-slate-800 overflow-hidden flex shadow-inner">
                <div
                  className="h-full bg-emerald-500 hover:opacity-90 transition-opacity flex items-center justify-center text-[10px] font-bold text-slate-950"
                  style={{ width: '22%' }}
                  title="Gen Awal: Mematikan transkripsi inang & nuklease"
                >
                  Gen Awal (22%)
                </div>
                <div
                  className="h-full bg-cyan-500 hover:opacity-90 transition-opacity flex items-center justify-center text-[10px] font-bold text-slate-950"
                  style={{ width: '38%' }}
                  title="Gen Tengah: DNA polimerase fag, ligase, sintesis dHMC"
                >
                  Replikasi DNA (38%)
                </div>
                <div
                  className="h-full bg-blue-500 hover:opacity-90 transition-opacity flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ width: '40%' }}
                  title="Gen Akhir: Kapsid (gp23), selubung ekor (gp18), lisozim (gp5)"
                >
                  Struktur & Lisis (40%)
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 text-[11px] text-slate-300">
                <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                  <span className="font-bold text-emerald-400 block mb-0.5">Fase Segera (0-5 menit)</span>
                  Mentranskripsikan faktor pemutus ekspresi gen inang E. coli.
                </div>
                <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                  <span className="font-bold text-cyan-400 block mb-0.5">Fase Tengah (5-15 menit)</span>
                  Menggandakan dsDNA dan membuat basa modifikasi 5-hmC.
                </div>
                <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                  <span className="font-bold text-blue-400 block mb-0.5">Fase Akhir (15-25 menit)</span>
                  Merakit 960 unit gp23* dan mensintesis enzim endolisin perusak dinding.
                </div>
              </div>
            </div>

            {/* Chemical Modification Insight */}
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/90 text-amber-950 text-xs sm:text-sm">
              <h4 className="font-heading font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" /> Modifikasi Basa Epigenetik Pelindung (5-hmC)
              </h4>
              <p className="leading-relaxed">
                Seluruh basa sitosin pada DNA bakteriofag T4 dimodifikasi menjadi <b>5-hidroksimetilsitosin (5-hmC)</b> dan diglikosilasi oleh enzim alfa/beta-glukosiltransferase virus. Modifikasi kimia ini membuat DNA bakteriofag kebal terhadap enzim restriksi endonuklease pemotong DNA milik bakteri inang.
              </p>
            </div>
          </div>

          {/* Right Reference Box */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4 flex flex-col justify-between">
            <div>
              <h4 className="font-heading font-extrabold text-base text-slate-900 mb-3 flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-600" /> Akses Basis Data Ilmiah
              </h4>
              <div className="space-y-2.5 text-xs">
                <a
                  href="https://www.ncbi.nlm.nih.gov/nuccore/NC_000866.4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition-colors group"
                >
                  <div>
                    <span className="font-bold text-slate-900 group-hover:text-blue-700 block">
                      NCBI Entrez Nucleotide
                    </span>
                    <span className="font-mono text-[11px] text-slate-500">RefSeq: NC_000866.4</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                </a>

                <a
                  href="https://www.uniprot.org/uniprotkb/P04526/entry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition-colors group"
                >
                  <div>
                    <span className="font-bold text-slate-900 group-hover:text-blue-700 block">
                      UniProtKB: gp23 (Major Capsid)
                    </span>
                    <span className="font-mono text-[11px] text-slate-500">Accession: P04526</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                </a>

                <a
                  href="https://www.rcsb.org/structure/1YUE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition-colors group"
                >
                  <div>
                    <span className="font-bold text-slate-900 group-hover:text-blue-700 block">
                      RCSB Protein Data Bank
                    </span>
                    <span className="font-mono text-[11px] text-slate-500">Cryo-EM: PDB 1YUE (Baseplate)</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                </a>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
              <span className="font-bold text-slate-800 block mb-1">Status Kurasi Biologis:</span>
              Data diverifikasi dari standar EMBL-EBI dan literatur virologi molekuler terkini.
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CAPSID STRUCTURE */}
      {activeTab === 'capsid' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
          <div className="max-w-3xl">
            <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-wider">
              BIOLOGI STRUKTURAL & CRYO-EM
            </span>
            <h3 className="font-heading font-extrabold text-xl text-slate-900 mt-1 mb-2">
              Arsitektur Kapsid Ikosahedral Prolate (T = 13 laevo)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Kepala bakteriofag T4 tidak berbentuk ikosahedron bola biasa, melainkan ikosahedron memanjang (prolate) dengan rasio aspek ~1,4. Geometri unik ini terbentuk dari kisi heksamer protein kapsid mayor <b>gp23*</b> yang dipotong secara proteolitik saat pematangan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-xl bg-blue-50/70 border border-blue-200/80">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm mb-3">
                960
              </div>
              <h4 className="font-heading font-bold text-sm text-blue-950 mb-1">Subunit gp23*</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tersusun menjadi 150 heksamer yang membentuk dinding silindris tengah dan ujung ikosahedral kepala fag.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-indigo-50/70 border border-indigo-200/80">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm mb-3">
                11
              </div>
              <h4 className="font-heading font-bold text-sm text-indigo-950 mb-1">Verteks Pentamer gp24*</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Menempati 11 dari 12 sudut apeks ikosahedral untuk memberikan kelengkungan sudut yang stabil.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm mb-3">
                gp20
              </div>
              <h4 className="font-heading font-bold text-sm text-emerald-950 mb-1">Cincin Portal Dodekamerik</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Apeks ke-12 digantikan oleh gerbang portal 12 subunit tempat motor ATPase memasukkan DNA bertekanan tinggi.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MOLECULAR SWITCH */}
      {activeTab === 'switch' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
          <div className="max-w-3xl">
            <span className="text-xs font-mono font-bold text-amber-600 uppercase tracking-wider">
              REGULASI GENETIK EPIGENETIK
            </span>
            <h3 className="font-heading font-extrabold text-xl text-slate-900 mt-1 mb-2">
              Sakelar Biner Litik vs Lisogenik (Kompetisi Represor cI vs Cro)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Pada bakteriofag temperat (seperti Phage Lambda), keputusan apakah virus memasuki siklus litik (menghancurkan inang) atau lisogenik (menjadi profag yang tenang) ditentukan oleh persaingan pengikatan protein regulator pada operator kanan (OR1, OR2, OR3).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-purple-50/70 border border-purple-200/90 space-y-3">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-200 text-purple-900">
                Kondisi Lisogenik (Fag Tenang)
              </span>
              <h4 className="font-heading font-bold text-base text-purple-950">
                Dominansi Protein Represor cI
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Dimer protein <b>cI</b> berikatan dengan afinitas tinggi pada situs OR1 dan OR2. Pengikatan ini memblokir promotor P_R (sehingga gen litik <i>cro</i> tidak diekspresikan) sekaligus mengaktifkan promotornya sendiri (P_RM) untuk terus mempertahankan sintesis cI. Genom virus terintegrasi aman di kromosom bakteri.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200/90 space-y-3">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-200 text-amber-900">
                Pemicu Induksi Litik (Stres Inang)
              </span>
              <h4 className="font-heading font-bold text-base text-amber-950">
                Pembelahan Autokatalitik oleh RecA
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Ketika bakteri inang terpapar radiasi sinar ultraviolet (UV) atau zat mutagenik, sistem perbaikan DNA darurat (respons SOS) mengaktifkan protease <b>RecA</b>. RecA memicu represor cI memotong dirinya sendiri. Tanpa cI, promotor P_R aktif, gen <i>Cro</i> disintesis, dan virus keluar dari kromosom untuk melisiskan sel inang.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PHAGE THERAPY */}
      {activeTab === 'therapy' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
          <div className="max-w-3xl">
            <span className="text-xs font-mono font-bold text-emerald-600 uppercase tracking-wider">
              APLIKASI MEDIS & BIOTEKNOLOGI MODERN
            </span>
            <h3 className="font-heading font-extrabold text-xl text-slate-900 mt-1 mb-2">
              Terapi Bakteriofag: Senjata Presisi Melawan Superbug Resisten Antibiotik
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Dengan meningkatnya resistensi antimikroba (AMR), bakteriofag litik kini dikembangkan sebagai terapi biologis penyelamat jiwa untuk infeksi bakteri multiresisten (*ESKAPE pathogens*).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <h4 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Keunggulan Dibanding Antibiotik
              </h4>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc ml-4">
                <li><b>Sangat Spesifik:</b> Hanya membunuh bakteri target patogen tanpa merusak mikrobioma usus baik tubuh.</li>
                <li><b>Dosis Mandiri (Auto-dosing):</b> Jumlah fag bertambah secara eksponensial di lokasi infeksi selama ada bakteri inang.</li>
                <li><b>Penembus Biofilm:</b> Enzim depolimerase ekor fag mampu melarutkan matriks lendir biofilm bakteri.</li>
              </ul>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <h4 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Microscope className="w-4 h-4 text-blue-600" /> Tantangan & Perkembangan Terkini
              </h4>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc ml-4">
                <li><b>Koktail Fag:</b> Penggunaan kombinasi 3-5 jenis bakteriofag berbeda untuk mencegah timbulnya mutasi resistensi reseptor.</li>
                <li><b>Rekayasa CRISPR-Cas:</b> Memodifikasi genom bakteriofag agar membawa sistem pemotong plasmid resistensi antibiotik.</li>
                <li><b>Regulasi Klinis:</b> Uji klinis di FDA dan EMA untuk infeksi paru-paru *Pseudomonas* pada pasien fibrosis kistik.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SCALE COMPARISON */}
      {activeTab === 'scale' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
          <div className="max-w-3xl">
            <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">
              PERSPEKTIF UKURAN RELATIF
            </span>
            <h3 className="font-heading font-extrabold text-xl text-slate-900 mt-1 mb-2">
              Seberapa Kecilkah Bakteriofag Dibandingkan Makhluk Hidup Lain?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Virus tidak dapat diamati menggunakan mikroskop cahaya biasa karena ukurannya berada di bawah batas resolusi difraksi cahaya tampak (~200 nm). Hanya mikroskop elektron (TEM / Cryo-EM) yang dapat memotretnya.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { name: 'Ketebalan Untai Ganda DNA (dsDNA)', size: '2 nm', widthPct: 3, color: 'bg-cyan-500' },
              { name: 'Virus Polio (Picornaviridae)', size: '30 nm', widthPct: 8, color: 'bg-emerald-500' },
              { name: 'Bakteriofag T4 (Tequatrovirus)', size: '90 × 120 nm', widthPct: 18, color: 'bg-blue-600' },
              { name: 'Virus SARS-CoV-2 (Coronavirus)', size: '120 nm', widthPct: 22, color: 'bg-indigo-500' },
              { name: 'Bakteri Escherichia coli (Inang Fag)', size: '1.000 × 2.000 nm (2 µm)', widthPct: 65, color: 'bg-amber-500' },
              { name: 'Sel Darah Merah Manusia (Eritrosit)', size: '7.500 nm (7,5 µm)', widthPct: 100, color: 'bg-red-500' },
            ].map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-700">
                  <span className="font-semibold">{item.name}</span>
                  <span className="font-mono font-bold text-slate-900">{item.size}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className={`${item.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${item.widthPct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
