import React, { useState, useEffect, useMemo } from 'react';
import {
  Heart,
  Search,
  Copy,
  Share2,
  Check,
  BookOpen,
  Bookmark,
  Sparkles,
} from 'lucide-react';
import { duaService, DUA_CATEGORIES } from '../services/duaService';
import { storageService } from '../services/storageService';
import type { DuaItem } from '../types/quran';

export const DuasView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua Doa');
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  useEffect(() => {
    setFavorites(storageService.getFavoriteDuas());
  }, []);

  const handleToggleFavorite = (id: string) => {
    const isAdded = storageService.toggleFavoriteDua(id);
    setFavorites(storageService.getFavoriteDuas());
    showToast(isAdded ? 'Doa ditambahkan ke favorit' : 'Doa dihapus dari favorit');
  };

  const handleCopyDua = async (item: DuaItem) => {
    const textToCopy = `${item.title}\n\n${item.arabic}\n\n"${item.translation}"\n(Sumber: ${item.source}) — Naj Qur’an`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
        showToast('Doa berhasil disalin ke papan klip.');
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Doa berhasil disalin ke papan klip.');
      }
    } catch {
      showToast('Gagal menyalin doa.');
    }
  };

  const handleShareDua = async (item: DuaItem) => {
    const shareData = {
      title: item.title,
      text: `${item.title}\n\n${item.arabic}\n\n"${item.translation}"\n(Sumber: ${item.source}) — Naj Qur’an`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err: unknown) {
        if ((err as Error).name !== 'AbortError') {
          handleCopyDua(item);
        }
      }
    } else {
      handleCopyDua(item);
    }
  };

  const showToast = (msg: string) => {
    setCopyFeedback(msg);
    setTimeout(() => {
      setCopyFeedback(null);
    }, 2000);
  };

  // Filtered duas list
  const filteredList = useMemo(() => {
    let list = duaService.searchDuas(searchQuery, selectedCategory);
    if (activeTab === 'favorites') {
      list = list.filter((item) => favorites.includes(item.id));
    }
    return list;
  }, [searchQuery, selectedCategory, activeTab, favorites]);

  return (
    <div className="space-y-6 pb-24 animate-fadeIn max-w-4xl mx-auto">
      {/* Toast Feedback */}
      {copyFeedback && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#003B2E] text-white text-xs px-4 py-2 rounded-full shadow-lg border border-[#E0B030]/40 flex items-center gap-1.5 animate-bounce">
          <Check className="w-3.5 h-3.5 text-[#E0B030]" />
          <span>{copyFeedback}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#003B2E]">
          Kumpulan Doa Harian
        </h1>
        <p className="text-xs text-[#68766F] mt-1">
          Koleksi doa ma'tsur dari Al-Qur’an dan hadis-hadis sahih untuk setiap aktivitas harian.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search className="w-4 h-4 text-[#68766F]" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari doa berdasarkan judul, terjemahan, atau sumber..."
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#E5E9E4] bg-white text-sm text-[#202520] placeholder-[#68766F]/60 focus:border-[#003B2E] focus:ring-1 focus:ring-[#003B2E] outline-none shadow-2xs transition"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs text-[#68766F] hover:text-[#202520]"
          >
            Bersihkan
          </button>
        )}
      </div>

      {/* Tabs: Semua vs Favorit */}
      <div className="flex items-center gap-2 border-b border-[#E5E9E4] pb-px">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs font-bold border-b-2 transition ${
            activeTab === 'all'
              ? 'border-[#003B2E] text-[#003B2E]'
              : 'border-transparent text-[#68766F] hover:text-[#202520]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Semua Doa ({duaService.getAllDuas().length})</span>
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs font-bold border-b-2 transition ${
            activeTab === 'favorites'
              ? 'border-[#003B2E] text-[#003B2E]'
              : 'border-transparent text-[#68766F] hover:text-[#202520]'
          }`}
        >
          <Heart className="w-3.5 h-3.5 fill-current text-[#B42318]" />
          <span>Favorit Saya ({favorites.length})</span>
        </button>
      </div>

      {/* Category Pills Scroller */}
      {activeTab === 'all' && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {DUA_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                selectedCategory === cat
                  ? 'bg-[#003B2E] text-white border-[#003B2E] shadow-2xs'
                  : 'bg-white text-[#68766F] border-[#E5E9E4] hover:border-[#003B2E]/40 hover:text-[#202520]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Duas List */}
      <div className="space-y-4">
        {filteredList.length === 0 ? (
          <div className="py-16 text-center text-[#68766F] space-y-2 bg-white rounded-3xl border border-[#E5E9E4] p-6">
            <Sparkles className="w-8 h-8 mx-auto text-[#68766F]/40" />
            <p className="text-sm font-semibold text-[#202520]">
              Tidak ada doa yang ditemukan.
            </p>
            <p className="text-xs">
              {activeTab === 'favorites'
                ? 'Belum ada doa yang Anda tandai sebagai favorit. Klik ikon hati pada doa untuk menyimpannya.'
                : 'Coba gunakan kata kunci pencarian yang lain.'}
            </p>
          </div>
        ) : (
          filteredList.map((dua) => {
            const isFav = favorites.includes(dua.id);

            return (
              <article
                key={dua.id}
                className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E5E9E4] shadow-xs space-y-4 hover:border-[#003B2E]/30 transition"
              >
                {/* Header Card */}
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E9E4] gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#003B2E] bg-[#003B2E]/5 px-2 py-0.5 rounded-md">
                      {dua.category}
                    </span>
                    <h2 className="text-base font-bold text-[#202520] mt-1.5">
                      {dua.title}
                    </h2>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleFavorite(dua.id)}
                      className={`p-2 rounded-xl transition ${
                        isFav
                          ? 'text-[#B42318] bg-[#B42318]/10'
                          : 'text-[#68766F] hover:text-[#B42318] hover:bg-[#F5F0D5]/50'
                      }`}
                      title={isFav ? 'Hapus favorit' : 'Simpan favorit'}
                      aria-label="Tandai favorit"
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      onClick={() => handleCopyDua(dua)}
                      className="p-2 rounded-xl text-[#68766F] hover:text-[#003B2E] hover:bg-[#F5F0D5]/50 transition"
                      title="Salin doa"
                      aria-label="Salin doa"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleShareDua(dua)}
                      className="p-2 rounded-xl text-[#68766F] hover:text-[#003B2E] hover:bg-[#F5F0D5]/50 transition"
                      title="Bagikan doa"
                      aria-label="Bagikan doa"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Arabic Text */}
                <div className="py-2">
                  <p className="font-quran text-right text-xl sm:text-2xl text-[#003B2E] leading-loose">
                    {dua.arabic}
                  </p>
                </div>

                {/* Transliteration */}
                <div className="pt-2 border-t border-[#E5E9E4]/60">
                  <p className="text-xs sm:text-sm text-[#68766F] italic leading-relaxed">
                    {dua.latin}
                  </p>
                </div>

                {/* Translation */}
                <div>
                  <p className="text-sm text-[#202520] leading-relaxed font-sans">
                    "{dua.translation}"
                  </p>
                </div>

                {/* Source & Notes */}
                <div className="pt-3 border-t border-[#E5E9E4] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[#68766F]">
                  <span className="font-semibold text-[#003B2E]">
                    Sumber: {dua.source}
                  </span>
                  <span className="italic">{dua.notes}</span>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};
