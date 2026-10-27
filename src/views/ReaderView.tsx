import React, { useEffect, useState, useRef } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Bookmark as BookmarkIcon,
  BookOpen,
  Volume2,
  Copy,
  Share2,
  Edit3,
  Check,
  AlertCircle,
  RefreshCw,
  Sliders,
} from 'lucide-react';
import { quranApi } from '../services/quranApi';
import { storageService } from '../services/storageService';
import { audioService, AudioPlaybackState } from '../services/audioService';
import { searchService } from '../services/searchService';
import { AutoScrollControl } from '../components/reader/AutoScrollControl';
import { TafsirModal } from '../components/reader/TafsirModal';
import { NoteModal } from '../components/reader/NoteModal';
import type { SurahDetail, Ayat, UserSettings } from '../types/quran';

interface ReaderViewProps {
  surahNomor: number;
  initialAyat?: number;
  onBack: () => void;
  onNavigateSurah: (surahNomor: number, ayatNomor?: number) => void;
}

export const ReaderView: React.FC<ReaderViewProps> = ({
  surahNomor,
  initialAyat = 1,
  onBack,
  onNavigateSurah,
}) => {
  const [surah, setSurah] = useState<SurahDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Settings
  const [settings, setSettings] = useState<UserSettings>(storageService.getSettings());

  // Bookmarks & Notes state
  const [bookmarkedSet, setBookmarkedSet] = useState<Set<number>>(new Set());
  const [notesMap, setNotesMap] = useState<Map<number, string>>(new Map());

  // Toast / Copy notification
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Modals
  const [tafsirAyat, setTafsirAyat] = useState<number | null | 'modalOpen'>(null);
  const [activeNoteAyat, setActiveNoteAyat] = useState<Ayat | null>(null);

  // Audio state
  const [audioState, setAudioState] = useState<AudioPlaybackState>(audioService.getState());

  // Refs for scrolling to specific ayat
  const ayatRefs = useRef<Map<number, HTMLElement>>(new Map());

  // Subscribe to audio
  useEffect(() => {
    const unsub = audioService.subscribe((s) => setAudioState({ ...s }));
    return unsub;
  }, []);

  // Fetch Surah Details
  const fetchSurah = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await quranApi.getSurahDetail(surahNomor);
      setSurah(data);

      // Register with search service in background
      searchService.registerSurahDetail(data);

      // Load bookmarks & notes
      const bMarks = storageService.getBookmarks().filter((b) => b.surahNomor === surahNomor);
      setBookmarkedSet(new Set(bMarks.map((b) => b.ayatNomor)));

      const notes = storageService.getNotes().filter((n) => n.surahNomor === surahNomor);
      const nMap = new Map<number, string>();
      notes.forEach((n) => nMap.set(n.ayatNomor, n.note));
      setNotesMap(nMap);

      // Record last read position
      storageService.saveLastRead({
        surahNomor: data.nomor,
        surahNamaLatin: data.namaLatin,
        surahNamaArab: data.nama,
        ayatNomor: initialAyat || 1,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat surat';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSurah();
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [surahNomor]);

  // Scroll to initial ayat after loaded
  useEffect(() => {
    if (surah && initialAyat && initialAyat > 1) {
      setTimeout(() => {
        const el = ayatRefs.current.get(initialAyat);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }, [surah, initialAyat]);

  // Bookmark Toggle
  const handleToggleBookmark = (ayat: Ayat) => {
    if (!surah) return;
    const isAdded = storageService.toggleBookmark({
      surahNomor: surah.nomor,
      surahNamaLatin: surah.namaLatin,
      surahNamaArab: surah.nama,
      ayatNomor: ayat.nomorAyat,
      teksArab: ayat.teksArab,
      teksIndonesia: ayat.teksIndonesia,
    });

    const nextSet = new Set(bookmarkedSet);
    if (isAdded) {
      nextSet.add(ayat.nomorAyat);
      showToast(`Ayat ${ayat.nomorAyat} ditambahkan ke bookmark.`);
    } else {
      nextSet.delete(ayat.nomorAyat);
      showToast(`Ayat ${ayat.nomorAyat} dihapus dari bookmark.`);
    }
    setBookmarkedSet(nextSet);
  };

  // Copy Ayat
  const handleCopyAyat = async (ayat: Ayat) => {
    if (!surah) return;
    const textToCopy = `${ayat.teksArab}\n\n"${ayat.teksIndonesia}"\n(QS. ${surah.namaLatin} [${surah.nomor}]: ${ayat.nomorAyat})`;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
        showToast('Ayat berhasil disalin ke papan klip.');
      } else {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Ayat berhasil disalin ke papan klip.');
      }
    } catch {
      showToast('Gagal menyalin ayat.');
    }
  };

  // Share Ayat
  const handleShareAyat = async (ayat: Ayat) => {
    if (!surah) return;
    const shareData = {
      title: `QS. ${surah.namaLatin} Ayat ${ayat.nomorAyat}`,
      text: `${ayat.teksArab}\n\n"${ayat.teksIndonesia}"\n(QS. ${surah.namaLatin}: ${ayat.nomorAyat}) — Naj Qur’an`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err: unknown) {
        if ((err as Error).name !== 'AbortError') {
          handleCopyAyat(ayat);
        }
      }
    } else {
      handleCopyAyat(ayat);
    }
  };

  // Audio Play Ayat
  const handlePlayAyatAudio = (ayat: Ayat) => {
    if (!surah || !ayat.audio) return;
    audioService.playAyat(
      surah.nomor,
      surah.namaLatin,
      ayat.nomorAyat,
      ayat.audio,
      settings.reciterId
    );
  };

  const showToast = (msg: string) => {
    setCopyFeedback(msg);
    setTimeout(() => {
      setCopyFeedback(null);
    }, 2500);
  };

  const reloadNotes = () => {
    if (!surah) return;
    const notes = storageService.getNotes().filter((n) => n.surahNomor === surah.nomor);
    const nMap = new Map<number, string>();
    notes.forEach((n) => nMap.set(n.ayatNomor, n.note));
    setNotesMap(nMap);
  };

  return (
    <div className="space-y-6 pb-28 animate-fadeIn max-w-4xl mx-auto">
      {/* Toast Feedback */}
      {copyFeedback && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#003B2E] text-white text-xs px-4 py-2.5 rounded-full shadow-lg border border-[#E0B030]/40 flex items-center gap-2 animate-bounce">
          <Check className="w-3.5 h-3.5 text-[#E0B030]" />
          <span>{copyFeedback}</span>
        </div>
      )}

      {/* Top Header / Bar */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#E5E9E4]">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E5E9E4] bg-white text-xs font-semibold text-[#003B2E] hover:bg-[#F5F0D5]/50 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali</span>
        </button>

        {surah && (
          <div className="text-center">
            <h2 className="text-base sm:text-lg font-bold text-[#003B2E] truncate">
              {surah.namaLatin} ({surah.nama})
            </h2>
            <p className="text-[11px] text-[#68766F]">
              Surat ke-{surah.nomor} · {surah.arti} · {surah.jumlahAyat} ayat
            </p>
          </div>
        )}

        {/* Tafsir button */}
        <button
          onClick={() => setTafsirAyat('modalOpen')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#003B2E] text-white text-xs font-bold hover:bg-[#002B21] transition"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#E0B030]" />
          <span className="hidden sm:inline">Tafsir Kemenag</span>
          <span className="sm:hidden">Tafsir</span>
        </button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="py-24 flex flex-col items-center justify-center gap-3">
          <div className="w-9 h-9 border-3 border-[#003B2E] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#68766F]">Memuat ayat-ayat suci Al-Qur’an...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-8 rounded-2xl bg-white border border-[#B42318]/30 flex flex-col items-center justify-center text-center gap-3">
          <AlertCircle className="w-8 h-8 text-[#B42318]" />
          <p className="text-sm font-bold text-[#202520]">Gagal Membuka Surat</p>
          <p className="text-xs text-[#68766F] max-w-md">{error}</p>
          <button
            onClick={fetchSurah}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#003B2E] text-white text-xs font-bold hover:bg-[#002B21] transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Coba Lagi
          </button>
        </div>
      )}

      {/* Content */}
      {surah && !isLoading && !error && (
        <>
          {/* Surah Banner Card */}
          <div className="rounded-3xl bg-radial from-[#004D3C] to-[#003B2E] text-white p-6 sm:p-8 text-center space-y-4 shadow-sm border border-[#E0B030]/20">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F0D5] font-sans">
              Surat {surah.namaLatin}
            </h1>
            <p className="font-quran text-3xl sm:text-4xl text-[#E0B030] py-1">
              {surah.nama}
            </p>
            <div className="flex items-center justify-center gap-3 text-xs text-[#F5F0D5]/90">
              <span>{surah.arti}</span>
              <span>·</span>
              <span>{surah.tempatTurun}</span>
              <span>·</span>
              <span>{surah.jumlahAyat} Ayat</span>
            </div>

            {/* Bismillah Header (Except Surah 9 At-Taubah, and not needed for Al-Fatihah as verse 1 is Bismillah) */}
            {surah.nomor !== 9 && surah.nomor !== 1 && (
              <div className="pt-4 border-t border-white/10">
                <p className="font-quran text-2xl sm:text-3xl text-white tracking-wide">
                  بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
                </p>
                <p className="text-[11px] text-[#F5F0D5]/70 italic mt-1 font-sans">
                  Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang
                </p>
              </div>
            )}
          </div>

          {/* Quick Display Controls Bar */}
          <div className="p-3 bg-white rounded-2xl border border-[#E5E9E4] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4">
              <label className="inline-flex items-center gap-1.5 cursor-pointer text-[#202520]">
                <input
                  type="checkbox"
                  checked={settings.showTranslation}
                  onChange={(e) => {
                    const next = storageService.saveSettings({ showTranslation: e.target.checked });
                    setSettings(next);
                  }}
                  className="rounded text-[#003B2E] focus:ring-[#003B2E] accent-[#003B2E]"
                />
                <span>Terjemahan</span>
              </label>

              <label className="inline-flex items-center gap-1.5 cursor-pointer text-[#202520]">
                <input
                  type="checkbox"
                  checked={settings.showTransliteration}
                  onChange={(e) => {
                    const next = storageService.saveSettings({ showTransliteration: e.target.checked });
                    setSettings(next);
                  }}
                  className="rounded text-[#003B2E] focus:ring-[#003B2E] accent-[#003B2E]"
                />
                <span>Transliterasi</span>
              </label>
            </div>

            {/* Font size stepper */}
            <div className="flex items-center gap-2">
              <span className="text-[#68766F]">Ukuran Arab:</span>
              <button
                onClick={() => {
                  const newSize = Math.max(22, settings.arabicFontSize - 4);
                  const next = storageService.saveSettings({ arabicFontSize: newSize });
                  setSettings(next);
                }}
                className="w-7 h-7 rounded-lg border border-[#E5E9E4] hover:bg-[#F5F0D5]/50 flex items-center justify-center font-bold text-[#003B2E]"
                aria-label="Kecilkan font Arab"
              >
                A-
              </button>
              <span className="font-semibold text-[#003B2E] tabular-nums min-w-[28px] text-center">
                {settings.arabicFontSize}
              </span>
              <button
                onClick={() => {
                  const newSize = Math.min(48, settings.arabicFontSize + 4);
                  const next = storageService.saveSettings({ arabicFontSize: newSize });
                  setSettings(next);
                }}
                className="w-7 h-7 rounded-lg border border-[#E5E9E4] hover:bg-[#F5F0D5]/50 flex items-center justify-center font-bold text-[#003B2E]"
                aria-label="Besarkan font Arab"
              >
                A+
              </button>
            </div>
          </div>

          {/* Ayat List */}
          <div className="space-y-4">
            {surah.ayat.map((ayat) => {
              const isBookmarked = bookmarkedSet.has(ayat.nomorAyat);
              const noteText = notesMap.get(ayat.nomorAyat);
              const isCurrentlyPlayingThisAyat =
                audioState.isPlaying &&
                audioState.surahNomor === surah.nomor &&
                audioState.ayatNomor === ayat.nomorAyat;

              return (
                <article
                  key={ayat.nomorAyat}
                  id={`ayat-${ayat.nomorAyat}`}
                  ref={(el) => {
                    if (el) ayatRefs.current.set(ayat.nomorAyat, el);
                  }}
                  className={`p-5 sm:p-6 rounded-3xl bg-white border transition-all duration-200 ${
                    isCurrentlyPlayingThisAyat
                      ? 'border-[#E0B030] shadow-md ring-2 ring-[#E0B030]/20'
                      : 'border-[#E5E9E4] hover:border-[#003B2E]/25 shadow-2xs'
                  }`}
                >
                  {/* Top Bar for Verse */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#E5E9E4] mb-5 gap-2">
                    {/* Verse Number Badge */}
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-[#003B2E] text-[#FFFEFA] font-bold text-xs flex items-center justify-center shadow-xs">
                        {ayat.nomorAyat}
                      </span>
                      <span className="text-[11px] text-[#68766F] font-semibold">
                        QS. {surah.nomor}:{ayat.nomorAyat}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      {/* Audio Play button */}
                      {ayat.audio && (
                        <button
                          onClick={() => handlePlayAyatAudio(ayat)}
                          className={`p-2 rounded-xl transition ${
                            isCurrentlyPlayingThisAyat
                              ? 'bg-[#E0B030] text-[#003B2E]'
                              : 'text-[#68766F] hover:text-[#003B2E] hover:bg-[#F5F0D5]/50'
                          }`}
                          title="Putar audio ayat ini"
                          aria-label={`Putar audio ayat ${ayat.nomorAyat}`}
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      )}

                      {/* Tafsir button */}
                      <button
                        onClick={() => setTafsirAyat(ayat.nomorAyat)}
                        className="p-2 rounded-xl text-[#68766F] hover:text-[#003B2E] hover:bg-[#F5F0D5]/50 transition"
                        title="Buka tafsir Kemenag untuk ayat ini"
                        aria-label={`Buka tafsir ayat ${ayat.nomorAyat}`}
                      >
                        <BookOpen className="w-4 h-4" />
                      </button>

                      {/* Note button */}
                      <button
                        onClick={() => setActiveNoteAyat(ayat)}
                        className={`p-2 rounded-xl transition ${
                          noteText
                            ? 'text-[#003B2E] bg-[#F5F0D5]'
                            : 'text-[#68766F] hover:text-[#003B2E] hover:bg-[#F5F0D5]/50'
                        }`}
                        title={noteText ? 'Lihat/Edit Catatan Pribadi' : 'Tambah Catatan Pribadi'}
                        aria-label={`Catatan ayat ${ayat.nomorAyat}`}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* Bookmark button */}
                      <button
                        onClick={() => handleToggleBookmark(ayat)}
                        className={`p-2 rounded-xl transition ${
                          isBookmarked
                            ? 'text-[#E0B030] bg-[#003B2E]'
                            : 'text-[#68766F] hover:text-[#003B2E] hover:bg-[#F5F0D5]/50'
                        }`}
                        title={isBookmarked ? 'Hapus bookmark' : 'Tandai bookmark'}
                        aria-label={`Bookmark ayat ${ayat.nomorAyat}`}
                      >
                        <BookmarkIcon
                          className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`}
                        />
                      </button>

                      {/* Copy */}
                      <button
                        onClick={() => handleCopyAyat(ayat)}
                        className="p-2 rounded-xl text-[#68766F] hover:text-[#003B2E] hover:bg-[#F5F0D5]/50 transition"
                        title="Salin ayat & terjemahan"
                        aria-label={`Salin ayat ${ayat.nomorAyat}`}
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      {/* Share */}
                      <button
                        onClick={() => handleShareAyat(ayat)}
                        className="p-2 rounded-xl text-[#68766F] hover:text-[#003B2E] hover:bg-[#F5F0D5]/50 transition"
                        title="Bagikan ayat"
                        aria-label={`Bagikan ayat ${ayat.nomorAyat}`}
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Arabic Verse Text */}
                  <div className="py-2">
                    <p
                      className="font-quran text-right text-[#003B2E]"
                      style={{
                        fontSize: `${settings.arabicFontSize}px`,
                        lineHeight: 2.2,
                      }}
                    >
                      {ayat.teksArab}
                    </p>
                  </div>

                  {/* Transliteration */}
                  {settings.showTransliteration && ayat.teksLatin && (
                    <div className="mt-4 pt-3 border-t border-[#E5E9E4]/60">
                      <p className="text-xs sm:text-sm text-[#68766F] font-normal leading-relaxed italic">
                        {ayat.teksLatin}
                      </p>
                    </div>
                  )}

                  {/* Indonesian Translation */}
                  {settings.showTranslation && (
                    <div className="mt-3">
                      <p className="text-sm sm:text-base text-[#202520] leading-relaxed font-sans">
                        {ayat.teksIndonesia}
                      </p>
                    </div>
                  )}

                  {/* Existing Personal Note Box if any */}
                  {noteText && (
                    <div className="mt-4 p-3.5 rounded-2xl bg-[#FFFEFA] border border-[#E0B030]/40 text-xs">
                      <div className="flex items-center justify-between text-[#003B2E] font-bold mb-1">
                        <span className="flex items-center gap-1.5">
                          <Edit3 className="w-3.5 h-3.5 text-[#E0B030]" />
                          Catatan Anda:
                        </span>
                        <button
                          onClick={() => setActiveNoteAyat(ayat)}
                          className="text-[11px] underline text-[#68766F] hover:text-[#003B2E]"
                        >
                          Ubah
                        </button>
                      </div>
                      <p className="text-[#202520] whitespace-pre-line leading-relaxed">
                        {noteText}
                      </p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          {/* Bottom Surah Navigation */}
          <div className="pt-6 border-t border-[#E5E9E4] flex items-center justify-between gap-4">
            {surah.suratSebelumnya ? (
              <button
                onClick={() => onNavigateSurah(surah.suratSebelumnya ? surah.suratSebelumnya.nomor : 1)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-[#E5E9E4] bg-white hover:bg-[#F5F0D5]/40 text-xs font-bold text-[#003B2E] transition"
              >
                <ChevronLeft className="w-4 h-4" />
                <div className="text-left">
                  <span className="block text-[10px] text-[#68766F] font-normal">Surat Sebelumnya</span>
                  <span>{surah.suratSebelumnya.namaLatin}</span>
                </div>
              </button>
            ) : (
              <div />
            )}

            {surah.suratSelanjutnya ? (
              <button
                onClick={() => onNavigateSurah(surah.suratSelanjutnya ? surah.suratSelanjutnya.nomor : 1)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-[#E5E9E4] bg-white hover:bg-[#F5F0D5]/40 text-xs font-bold text-[#003B2E] transition"
              >
                <div className="text-right">
                  <span className="block text-[10px] text-[#68766F] font-normal">Surat Selanjutnya</span>
                  <span>{surah.suratSelanjutnya.namaLatin}</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <div />
            )}
          </div>
        </>
      )}

      {/* Auto-Scroll Floating Controls */}
      <AutoScrollControl
        initialSpeed={settings.autoScrollSpeed}
        onSpeedChange={(s) => {
          const next = storageService.saveSettings({ autoScrollSpeed: s });
          setSettings(next);
        }}
      />

      {/* Tafsir Modal */}
      {tafsirAyat !== null && surah && (
        <TafsirModal
          surahNomor={surah.nomor}
          surahNamaLatin={surah.namaLatin}
          initialAyat={typeof tafsirAyat === 'number' ? tafsirAyat : null}
          onClose={() => setTafsirAyat(null)}
        />
      )}

      {/* Note Modal */}
      {activeNoteAyat && surah && (
        <NoteModal
          surahNomor={surah.nomor}
          surahNamaLatin={surah.namaLatin}
          ayatNomor={activeNoteAyat.nomorAyat}
          teksArab={activeNoteAyat.teksArab}
          existingNote={notesMap.get(activeNoteAyat.nomorAyat) || ''}
          onClose={() => setActiveNoteAyat(null)}
          onSaved={reloadNotes}
        />
      )}
    </div>
  );
};
