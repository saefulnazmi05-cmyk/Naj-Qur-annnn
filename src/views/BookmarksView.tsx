import React, { useState, useEffect } from 'react';
import {
  Bookmark as BookmarkIcon,
  Edit3,
  Clock,
  Trash2,
  ArrowRight,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { storageService } from '../services/storageService';
import type { Bookmark, PersonalNote, ReadingHistoryItem } from '../types/quran';

interface BookmarksViewProps {
  onSelectAyat: (surahNomor: number, ayatNomor: number) => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({ onSelectAyat }) => {
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'notes' | 'history'>('bookmarks');
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [notes, setNotes] = useState<PersonalNote[]>([]);
  const [history, setHistory] = useState<ReadingHistoryItem[]>([]);

  const reloadData = () => {
    setBookmarks(storageService.getBookmarks());
    setNotes(storageService.getNotes());
    setHistory(storageService.getHistory());
  };

  useEffect(() => {
    reloadData();
  }, []);

  const handleRemoveBookmark = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Hapus ayat ini dari daftar bookmark?')) {
      storageService.removeBookmark(id);
      reloadData();
    }
  };

  const handleDeleteNote = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Hapus catatan pribadi ini?')) {
      storageService.deleteNote(id);
      reloadData();
    }
  };

  const handleClearHistory = () => {
    if (confirm('Bersihkan seluruh riwayat bacaan?')) {
      storageService.clearHistory();
      reloadData();
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-fadeIn max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#003B2E]">
          Koleksi Tersimpan
        </h1>
        <p className="text-xs text-[#68766F] mt-1">
          Akses bookmark ayat, catatan tadabbur pribadi, dan riwayat tilawah harian Anda.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E5E9E4] pb-px">
        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition ${
            activeTab === 'bookmarks'
              ? 'border-[#003B2E] text-[#003B2E]'
              : 'border-transparent text-[#68766F] hover:text-[#202520]'
          }`}
        >
          <BookmarkIcon className="w-4 h-4" />
          <span>Bookmark ({bookmarks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition ${
            activeTab === 'notes'
              ? 'border-[#003B2E] text-[#003B2E]'
              : 'border-transparent text-[#68766F] hover:text-[#202520]'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>Catatan ({notes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition ${
            activeTab === 'history'
              ? 'border-[#003B2E] text-[#003B2E]'
              : 'border-transparent text-[#68766F] hover:text-[#202520]'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Riwayat ({history.length})</span>
        </button>
      </div>

      {/* Tab: Bookmarks */}
      {activeTab === 'bookmarks' && (
        <div className="space-y-3">
          {bookmarks.length === 0 ? (
            <div className="py-16 text-center text-[#68766F] space-y-2 bg-white rounded-2xl border border-[#E5E9E4] p-6">
              <BookmarkIcon className="w-8 h-8 mx-auto text-[#68766F]/40" />
              <p className="text-sm font-semibold text-[#202520]">
                Belum ada ayat yang ditandai.
              </p>
              <p className="text-xs">
                Tekan tombol ikon bookmark pada pembaca ayat untuk menyimpannya di sini.
              </p>
            </div>
          ) : (
            bookmarks.map((b) => (
              <div
                key={b.id}
                onClick={() => onSelectAyat(b.surahNomor, b.ayatNomor)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onSelectAyat(b.surahNomor, b.ayatNomor);
                }}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5E9E4] hover:border-[#003B2E] hover:shadow-2xs transition cursor-pointer text-left group"
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#E5E9E4] mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-[#003B2E] text-white text-xs font-bold flex items-center justify-center">
                      {b.surahNomor}
                    </span>
                    <h3 className="text-sm font-bold text-[#202520] group-hover:text-[#003B2E]">
                      Surat {b.surahNamaLatin} : Ayat {b.ayatNomor}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#68766F]">
                      {formatDate(b.createdAt)}
                    </span>
                    <button
                      onClick={(e) => handleRemoveBookmark(e, b.id)}
                      className="p-1.5 rounded-lg text-[#68766F] hover:text-[#B42318] hover:bg-[#B42318]/10 transition"
                      title="Hapus bookmark"
                      aria-label="Hapus bookmark"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="font-quran text-right text-lg text-[#003B2E] leading-loose truncate">
                  {b.teksArab}
                </p>

                <p className="text-xs text-[#202520] mt-2 line-clamp-2 font-sans">
                  "{b.teksIndonesia}"
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Notes */}
      {activeTab === 'notes' && (
        <div className="space-y-3">
          {notes.length === 0 ? (
            <div className="py-16 text-center text-[#68766F] space-y-2 bg-white rounded-2xl border border-[#E5E9E4] p-6">
              <Edit3 className="w-8 h-8 mx-auto text-[#68766F]/40" />
              <p className="text-sm font-semibold text-[#202520]">
                Belum ada catatan pribadi.
              </p>
              <p className="text-xs">
                Tulis refleksi atau tadabbur ayat langsung dari pembaca Al-Qur’an.
              </p>
            </div>
          ) : (
            notes.map((n) => (
              <div
                key={n.id}
                onClick={() => onSelectAyat(n.surahNomor, n.ayatNomor)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onSelectAyat(n.surahNomor, n.ayatNomor);
                }}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5E9E4] hover:border-[#003B2E] hover:shadow-2xs transition cursor-pointer text-left group"
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#E5E9E4] mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-[#003B2E] text-white text-xs font-bold flex items-center justify-center">
                      {n.surahNomor}
                    </span>
                    <h3 className="text-sm font-bold text-[#202520] group-hover:text-[#003B2E]">
                      Surat {n.surahNamaLatin} : Ayat {n.ayatNomor}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#68766F]">
                      {formatDate(n.updatedAt)}
                    </span>
                    <button
                      onClick={(e) => handleDeleteNote(e, n.id)}
                      className="p-1.5 rounded-lg text-[#68766F] hover:text-[#B42318] hover:bg-[#B42318]/10 transition"
                      title="Hapus catatan"
                      aria-label="Hapus catatan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-[#FFFEFA] rounded-xl border border-[#E0B030]/30 text-xs text-[#202520] whitespace-pre-line leading-relaxed font-sans">
                  {n.note}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: History */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          <div className="flex justify-end">
            {history.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="text-xs text-[#B42318] hover:underline font-semibold"
              >
                Hapus Semua Riwayat
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="py-16 text-center text-[#68766F] space-y-2 bg-white rounded-2xl border border-[#E5E9E4] p-6">
              <Clock className="w-8 h-8 mx-auto text-[#68766F]/40" />
              <p className="text-sm font-semibold text-[#202520]">
                Belum ada riwayat tilawah.
              </p>
              <p className="text-xs">
                Aktivitas tilawah Anda akan tercatat secara otomatis saat Anda membaca surat.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#E5E9E4] bg-white rounded-2xl border border-[#E5E9E4] overflow-hidden">
              {history.map((h) => (
                <div
                  key={h.id}
                  onClick={() => onSelectAyat(h.surahNomor, h.ayatNomor)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onSelectAyat(h.surahNomor, h.ayatNomor);
                  }}
                  className="p-4 flex items-center justify-between hover:bg-[#F5F0D5]/30 cursor-pointer transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-[#003B2E]/10 text-[#003B2E] text-xs font-bold flex items-center justify-center">
                      {h.surahNomor}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-[#202520]">
                        Surat {h.surahNamaLatin}
                      </h4>
                      <p className="text-xs text-[#68766F]">Ayat ke-{h.ayatNomor}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#68766F]">
                      {formatDate(h.timestamp)}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#68766F]" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
