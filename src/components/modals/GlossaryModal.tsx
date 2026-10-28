import React, { useState } from 'react';
import { GLOSSARY_ITEMS } from '../../data/learningContent';
import { BookOpen, Search, X, Tag } from 'lucide-react';

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlossaryModal: React.FC<GlossaryModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'Semua' | 'Struktur' | 'Litik' | 'Lisogenik' | 'Keduanya'>('Semua');

  if (!isOpen) return null;

  const filteredItems = GLOSSARY_ITEMS.filter((item) => {
    const matchesSearch =
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.roleInReplication.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === 'Semua' ||
      item.relatedCycle === activeCategory ||
      (activeCategory === 'Litik' && item.relatedCycle === 'Keduanya') ||
      (activeCategory === 'Lisogenik' && item.relatedCycle === 'Keduanya');

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-burst">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-slate-900">
                Glosarium Istilah Biologi
              </h3>
              <p className="text-xs text-slate-500">
                Kamus istilah penting struktur dan replikasi bakteriofag
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            aria-label="Tutup Glosarium"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-slate-100 bg-white flex flex-col gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari istilah, definisi, atau peran..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Hapus
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold">
            {(['Semua', 'Struktur', 'Litik', 'Lisogenik', 'Keduanya'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Glossary Item List */}
        <div className="p-5 overflow-y-auto flex-1 divide-y divide-slate-100 space-y-4">
          {filteredItems.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              Tidak ada istilah yang cocok dengan pencarian "{searchQuery}".
            </div>
          ) : (
            filteredItems.map((item) => (
              <div key={item.id} className="pt-4 first:pt-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-baseline gap-2">
                    <h4 className="font-heading font-bold text-sm sm:text-base text-slate-900">
                      {item.term}
                    </h4>
                    {item.pronunciation && (
                      <span className="font-mono text-[11px] text-slate-400">
                        {item.pronunciation}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1 shrink-0">
                    <Tag className="w-3 h-3 text-slate-400" />
                    {item.relatedCycle}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-1.5">
                  {item.definition}
                </p>
                <div className="text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-slate-600">
                  <strong className="text-blue-900 block mb-0.5">Peran dalam Replikasi:</strong>
                  {item.roleInReplication}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Menampilkan {filteredItems.length} istilah</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
