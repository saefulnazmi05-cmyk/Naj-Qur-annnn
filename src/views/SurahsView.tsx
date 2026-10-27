import React, { useState, useMemo } from 'react';
import {
  Search,
  Volume2,
  RefreshCw,
  AlertCircle,
  Check,
  MapPin,
  FileText,
} from 'lucide-react';
import type { SurahSummary } from '../types/quran';
import { audioService } from '../services/audioService';

interface SurahsViewProps {
  surahs: SurahSummary[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onSelectSurah: (surahNomor: number) => void;
}

export const SurahsView: React.FC<SurahsViewProps> = ({
  surahs,
  isLoading,
  error,
  onRetry,
  onSelectSurah,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlace, setFilterPlace] = useState<'all' | 'Mekah' | 'Madinah'>('all');

  // Filter surahs
  const filteredSurahs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return surahs.filter((s) => {
      const matchSearch =
        !q ||
        s.nomor.toString() === q ||
        s.namaLatin.toLowerCase().includes(q) ||
        s.arti.toLowerCase().includes(q) ||
        s.nama.includes(q);

      const matchPlace =
        filterPlace === 'all' ||
        s.tempatTurun.toLowerCase() === filterPlace.toLowerCase();

      return matchSearch && matchPlace;
    });
  }, [surahs, searchQuery, filterPlace]);

  const handlePlayFullAudio = (e: React.MouseEvent, s: SurahSummary) => {
    e.stopPropagation();
    if (s.audioFull) {
      audioService.playSurah(s.nomor, s.namaLatin, s.audioFull);
    }
  };

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* Title & Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#003B2E]">
            Daftar 114 Surat
          </h1>
          <p className="text-xs text-[#68766F] mt-1">
            {isLoading
              ? 'Sedang memuat naskah Al-Qur’an...'
              : `Menampilkan ${filteredSurahs.length} dari ${surahs.length} surat Al-Qur’an`}
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-[#FFFFFF] border border-[#E5E9E4] rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setFilterPlace('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              filterPlace === 'all'
                ? 'bg-[#003B2E] text-white shadow-2xs'
                : 'text-[#68766F] hover:text-[#202520]'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilterPlace('Mekah')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              filterPlace === 'Mekah'
                ? 'bg-[#003B2E] text-white shadow-2xs'
                : 'text-[#68766F] hover:text-[#202520]'
            }`}
          >
            Makkiyyah
          </button>
          <button
            onClick={() => setFilterPlace('Madinah')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              filterPlace === 'Madinah'
                ? 'bg-[#003B2E] text-white shadow-2xs'
                : 'text-[#68766F] hover:text-[#202520]'
            }`}
          >
            Madaniyyah
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search className="w-4 h-4 text-[#68766F]" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari surat berdasarkan nama latin, nomor (misal: 36), atau arti..."
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

      {/* Error State */}
      {error && (
        <div className="p-6 rounded-2xl bg-white border border-[#B42318]/30 flex flex-col items-center justify-center text-center gap-3">
          <AlertCircle className="w-8 h-8 text-[#B42318]" />
          <p className="text-sm font-bold text-[#202520]">Gagal Mengambil Data Surat</p>
          <p className="text-xs text-[#68766F] max-w-md">{error}</p>
          <button
            onClick={onRetry}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#003B2E] text-white text-xs font-bold hover:bg-[#002B21] transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Coba Ambil Ulang
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-white border border-[#E5E9E4] animate-pulse flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E5E9E4]" />
                <div className="space-y-2">
                  <div className="w-24 h-4 bg-[#E5E9E4] rounded" />
                  <div className="w-16 h-3 bg-[#E5E9E4] rounded" />
                </div>
              </div>
              <div className="w-16 h-6 bg-[#E5E9E4] rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Surahs Grid List */}
      {!isLoading && !error && (
        <>
          {filteredSurahs.length === 0 ? (
            <div className="py-16 text-center text-[#68766F] space-y-2">
              <p className="text-sm font-semibold">Tidak ditemukan surat yang cocok.</p>
              <p className="text-xs">Coba kata kunci pencarian yang lain.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filteredSurahs.map((surah) => (
                <div
                  key={surah.nomor}
                  onClick={() => onSelectSurah(surah.nomor)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      onSelectSurah(surah.nomor);
                    }
                  }}
                  className="p-4 rounded-2xl bg-white border border-[#E5E9E4] hover:border-[#003B2E] hover:shadow-xs transition flex items-center justify-between cursor-pointer group text-left"
                >
                  {/* Left: Number + Metadata */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#FFFEFA] border border-[#E5E9E4] text-[#003B2E] font-bold text-xs flex items-center justify-center flex-shrink-0 group-hover:bg-[#003B2E] group-hover:text-white transition">
                      {surah.nomor}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-[#202520] group-hover:text-[#003B2E] truncate">
                        {surah.namaLatin}
                      </h3>
                      <p className="text-[11px] text-[#68766F] truncate">
                        {surah.arti} · {surah.jumlahAyat} ayat
                      </p>
                    </div>
                  </div>

                  {/* Right: Arabic Name & Audio Button */}
                  <div className="flex items-center gap-2 flex-shrink-0 pl-2">
                    <span className="font-quran text-xl text-[#003B2E]">
                      {surah.nama}
                    </span>
                    {surah.audioFull && (
                      <button
                        onClick={(e) => handlePlayFullAudio(e, surah)}
                        className="p-2 rounded-xl text-[#68766F] hover:text-[#003B2E] hover:bg-[#F5F0D5]/50 transition"
                        title={`Putar audio murottal surat ${surah.namaLatin}`}
                        aria-label={`Putar audio surat ${surah.namaLatin}`}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
