import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  BookOpen,
  ArrowRight,
  Database,
  Download,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { searchService, SearchCoverage } from '../services/searchService';
import type { SearchResultItem } from '../types/quran';

interface SearchViewProps {
  onSelectResult: (surahNomor: number, ayatNomor: number) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({ onSelectResult }) => {
  const [query, setQuery] = useState('');
  const [coverage, setCoverage] = useState<SearchCoverage>(searchService.getCoverage());
  const [isExpandingIndex, setIsExpandingIndex] = useState(false);

  useEffect(() => {
    const unsub = searchService.subscribeCoverage((c) => setCoverage({ ...c }));
    return unsub;
  }, []);

  const results = useMemo(() => {
    return searchService.search(query);
  }, [query, coverage.totalAyatIndexed]);

  const handleIndexMore = async () => {
    setIsExpandingIndex(true);
    // Index core Quran chapters (e.g. Juz Amma, Yasin, Al-Kahf, Al-Baqarah, etc.)
    const surahsToIndex = [1, 2, 3, 4, 18, 36, 55, 56, 67, 78, 80, 87, 93, 94, 97, 108, 112, 113, 114];
    await searchService.indexCommonSurahs(surahsToIndex);
    setIsExpandingIndex(false);
  };

  const highlightSnippet = (snippet: string, keyword: string) => {
    if (!keyword.trim()) return snippet;
    const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = snippet.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="quran-highlight">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="space-y-6 pb-20 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#003B2E]">
          Pencarian Al-Qur’an
        </h1>
        <p className="text-xs text-[#68766F] mt-1">
          Cari nama surat, nomor surat, atau kata kunci dalam terjemahan bahasa Indonesia.
        </p>
      </div>

      {/* Coverage Status Banner */}
      <div className="p-3.5 rounded-2xl bg-white border border-[#E5E9E4] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Database className="w-4 h-4 text-[#003B2E]" />
          <div>
            <span className="font-semibold text-[#202520]">Cakupan Indeks:</span>{' '}
            <span className="text-[#68766F]">
              114 Surat (Nama & Arti) ·{' '}
              <strong className="text-[#003B2E]">{coverage.totalAyatIndexed}</strong> ayat terjemahan dimuat
            </span>
          </div>
        </div>

        {coverage.totalAyatIndexed < 200 && (
          <button
            onClick={handleIndexMore}
            disabled={isExpandingIndex || coverage.isIndexing}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#003B2E] text-white font-semibold hover:bg-[#002B21] transition active:scale-95 disabled:opacity-50"
          >
            {isExpandingIndex ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Memuat...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-[#E0B030]" />
                <span>Perluas Indeks Terjemahan</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Search Input Box */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-[#68766F]" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ketik nama surat, nomor (cth: 36), atau kata seperti 'sabar', 'rezeki', 'langit'..."
          className="w-full pl-12 pr-20 py-3.5 rounded-2xl border border-[#E5E9E4] bg-white text-sm text-[#202520] placeholder-[#68766F]/60 focus:border-[#003B2E] focus:ring-1 focus:ring-[#003B2E] outline-none shadow-2xs transition"
          autoFocus
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs text-[#68766F] hover:text-[#003B2E]"
          >
            Hapus
          </button>
        )}
      </div>

      {/* Example suggestions */}
      {!query && (
        <div className="p-4 rounded-2xl bg-[#FFFEFA] border border-[#E5E9E4] space-y-2">
          <p className="text-xs font-semibold text-[#003B2E] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#E0B030]" />
            Contoh Kata Kunci Populer:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {['Al-Fatihah', 'Yasin', 'sabar', 'shalat', 'cahaya', 'syukur', 'ampunan', '36', '114'].map((sample) => (
              <button
                key={sample}
                onClick={() => setQuery(sample)}
                className="px-3 py-1 rounded-full bg-white border border-[#E5E9E4] hover:border-[#003B2E] hover:text-[#003B2E] text-xs font-medium text-[#202520] transition"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results List */}
      {query.trim() && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-[#68766F]">
            <span>
              Ditemukan <strong className="text-[#003B2E]">{results.length}</strong> hasil
              pencarian untuk "{query}"
            </span>
          </div>

          {results.length === 0 ? (
            <div className="py-12 p-6 rounded-2xl bg-white border border-[#E5E9E4] text-center space-y-2">
              <p className="text-sm font-semibold text-[#202520]">
                Tidak ada hasil yang cocok dengan "{query}".
              </p>
              <p className="text-xs text-[#68766F]">
                Periksa ejaan Anda atau coba klik tombol "Perluas Indeks Terjemahan" di atas.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {results.map((r, i) => (
                <div
                  key={`${r.surahNomor}:${r.ayatNomor}:${i}`}
                  onClick={() => onSelectResult(r.surahNomor, r.ayatNomor)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onSelectResult(r.surahNomor, r.ayatNomor);
                  }}
                  className="p-4 rounded-2xl bg-white border border-[#E5E9E4] hover:border-[#003B2E] hover:shadow-2xs transition cursor-pointer text-left group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-[#003B2E] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {r.surahNomor}
                      </span>
                      <h3 className="text-sm font-bold text-[#202520] group-hover:text-[#003B2E]">
                        Surat {r.surahNamaLatin}{' '}
                        {r.matchType !== 'surah_name' && (
                          <span className="font-normal text-[#68766F]">
                            : Ayat {r.ayatNomor}
                          </span>
                        )}
                      </h3>
                      {r.matchType === 'surah_name' && (
                        <span className="text-[10px] bg-[#F5F0D5] text-[#003B2E] font-bold px-2 py-0.5 rounded-full">
                          Nama Surat
                        </span>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#68766F] group-hover:text-[#003B2E] group-hover:translate-x-0.5 transition flex-shrink-0" />
                  </div>

                  {/* Arabic preview */}
                  <p className="font-quran text-right text-base text-[#003B2E] mt-2 leading-relaxed">
                    {r.teksArab}
                  </p>

                  {/* Snippet / Translation */}
                  <p className="text-xs text-[#202520] mt-2 leading-relaxed font-sans">
                    {r.matchedSnippet
                      ? highlightSnippet(r.matchedSnippet, query)
                      : r.teksIndonesia}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
