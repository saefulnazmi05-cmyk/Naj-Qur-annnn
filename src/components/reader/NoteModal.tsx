import React, { useState } from 'react';
import { X, Edit3, Trash2, Check } from 'lucide-react';
import { storageService } from '../../services/storageService';

interface NoteModalProps {
  surahNomor: number;
  surahNamaLatin: string;
  ayatNomor: number;
  teksArab: string;
  existingNote?: string;
  onClose: () => void;
  onSaved: () => void;
}

export const NoteModal: React.FC<NoteModalProps> = ({
  surahNomor,
  surahNamaLatin,
  ayatNomor,
  teksArab,
  existingNote = '',
  onClose,
  onSaved,
}) => {
  const [note, setNote] = useState(existingNote);
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);

  const handleSave = () => {
    if (!note.trim()) {
      storageService.deleteNote(`${surahNomor}:${ayatNomor}`);
    } else {
      storageService.saveNote({
        surahNomor,
        surahNamaLatin,
        ayatNomor,
        teksArab,
        note: note.trim(),
      });
    }
    setIsSavedSuccess(true);
    setTimeout(() => {
      onSaved();
      onClose();
    }, 600);
  };

  const handleDelete = () => {
    if (confirm('Hapus catatan pribadi untuk ayat ini?')) {
      storageService.deleteNote(`${surahNomor}:${ayatNomor}`);
      onSaved();
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="note-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn"
    >
      <div className="w-full max-w-lg bg-[#FFFFFF] rounded-2xl shadow-2xl border border-[#E5E9E4] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#003B2E] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Edit3 className="w-4 h-4 text-[#E0B030]" />
            <h2 id="note-title" className="text-sm sm:text-base font-bold">
              Catatan Pribadi — Surat {surahNamaLatin} : {ayatNomor}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-white/80 hover:text-white hover:bg-white/10"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 space-y-4">
          <div className="p-3 rounded-xl bg-[#FFFEFA] border border-[#E5E9E4]">
            <p className="font-quran text-right text-lg text-[#003B2E] leading-loose truncate">
              {teksArab}
            </p>
          </div>

          <div>
            <label
              htmlFor="note-text"
              className="block text-xs font-semibold text-[#202520] mb-1.5"
            >
              Tulis tadabbur, refleksi, atau catatan hafalan:
            </label>
            <textarea
              id="note-text"
              rows={5}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Misal: Ayat ini mengingatkan tentang kesabaran dalam menghadapi cobaan hidup..."
              className="w-full p-3 text-sm rounded-xl border border-[#E5E9E4] bg-white focus:border-[#003B2E] focus:ring-1 focus:ring-[#003B2E] outline-none text-[#202520] placeholder-[#68766F]/60"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FFFEFA] border-t border-[#E5E9E4] flex items-center justify-between gap-3">
          <div>
            {existingNote && (
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-[#B42318] hover:bg-[#B42318]/10 transition font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Hapus
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#E5E9E4] text-xs font-medium text-[#68766F] hover:bg-[#F5F0D5]/50 transition"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#003B2E] text-xs font-bold text-white hover:bg-[#002B21] transition"
            >
              {isSavedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#E0B030]" />
                  Tersimpan!
                </>
              ) : (
                'Simpan Catatan'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
