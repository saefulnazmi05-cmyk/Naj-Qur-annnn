import React, { useEffect, useState } from 'react';
import { X, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';
import { quranApi } from '../../services/quranApi';
import type { SurahTafsir } from '../../types/quran';

interface TafsirModalProps {
  surahNomor: number;
  surahNamaLatin: string;
  initialAyat?: number | null;
  onClose: () => void;
}

export const TafsirModal: React.FC<TafsirModalProps> = ({
  surahNomor,
  surahNamaLatin,
  initialAyat = null,
  onClose,
}) => {
  const [data, setData] = useState<SurahTafsir | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAyatFilter, setSelectedAyatFilter] = useState<number | 'all'>(
    initialAyat || 'all'
  );

  const fetchTafsir = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await quranApi.getSurahTafsir(surahNomor);
      setData(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat tafsir.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTafsir();
  }, [surahNomor]);

  // Filtered tafsir items
  const filteredTafsir = data?.tafsir
    ? selectedAyatFilter === 'all'
      ? data.tafsir
      : data.tafsir.filter((t) => t.ayat === selectedAyatFilter)
    : [];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tafsir-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-6 animate-fadeIn"
    >
      <div className="w-full max-w-3xl max-h-[88vh] bg-[#FFFFFF] rounded-2xl shadow-2xl border border-[#E5E9E4] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#003B2E] text-white flex items-center justify-between border-b border-[#E0B030]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E0B030]/20 flex items-center justify-center text-[#E0B030]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 id="tafsir-title" className="text-base sm:text-lg font-bold">
                Tafsir Kemenag: Surat {surahNamaLatin}
              </h2>
              <p className="text-xs text-[#F5F0D5]/80">
                Kementerian Agama Republik Indonesia
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
            aria-label="Tutup jendela tafsir"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar by verse if available */}
        {data && data.tafsir && data.tafsir.length > 0 && (
          <div className="px-4 py-2.5 bg-[#FFFEFA] border-b border-[#E5E9E4] flex items-center justify-between gap-3 text-xs">
            <span className="text-[#68766F] font-medium">Pilih Ayat:</span>
            <div className="flex items-center gap-2">
              <select
                value={selectedAyatFilter}
                onChange={(e) =>
                  setSelectedAyatFilter(
                    e.target.value === 'all' ? 'all' : parseInt(e.target.value, 10)
                  )
                }
                className="rounded-lg border border-[#E5E9E4] bg-white px-3 py-1.5 text-xs text-[#003B2E] font-semibold focus:border-[#003B2E] outline-none"
              >
                <option value="all">Semua Ayat ({data.tafsir.length})</option>
                {data.tafsir.map((t) => (
                  <option key={t.ayat} value={t.ayat}>
                    Ayat {t.ayat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-8 h-8 border-3 border-[#003B2E] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-[#68766F]">Memuat naskah tafsir resmi Kemenag...</p>
            </div>
          ) : error ? (
            <div className="py-12 flex flex-col items-center justify-center text-center gap-3 p-4">
              <AlertCircle className="w-10 h-10 text-[#B42318]" />
              <p className="text-sm font-semibold text-[#202520]">Gagal Memuat Tafsir</p>
              <p className="text-xs text-[#68766F] max-w-sm">{error}</p>
              <button
                onClick={fetchTafsir}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#003B2E] text-white text-xs font-semibold hover:bg-[#002B21] transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Coba Lagi
              </button>
            </div>
          ) : filteredTafsir.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#68766F]">
              Tidak ada uraian tafsir yang ditemukan untuk ayat ini.
            </div>
          ) : (
            filteredTafsir.map((t) => (
              <article
                key={t.ayat}
                id={`tafsir-ayat-${t.ayat}`}
                className="border-b border-[#E5E9E4] pb-6 last:border-b-0"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-7 h-7 rounded-full bg-[#003B2E] text-white text-xs font-bold flex items-center justify-center">
                    {t.ayat}
                  </span>
                  <span className="text-xs font-semibold text-[#003B2E]">
                    Ayat ke-{t.ayat}
                  </span>
                </div>
                <div className="text-sm sm:text-base leading-relaxed text-[#202520] whitespace-pre-line space-y-3 font-sans">
                  {t.teks}
                </div>
              </article>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#FFFEFA] border-t border-[#E5E9E4] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#E5E9E4] text-[#202520] hover:bg-[#d8ded7] text-xs font-medium transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
