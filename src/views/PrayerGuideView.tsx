import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Bookmark,
  CheckCircle,
  List,
  Sparkles,
  Info,
  Layers,
} from 'lucide-react';
import {
  prayerGuideService,
  PRAYER_STEPS_DATA,
  PRAYER_RAKAAT_LIST,
} from '../services/prayerGuideService';
import { storageService } from '../services/storageService';
import type { PrayerStep } from '../types/quran';

export const PrayerGuideView: React.FC = () => {
  const [viewMode, setViewMode] = useState<'step' | 'list' | 'rakaat'>('step');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [bookmarkedSteps, setBookmarkedSteps] = useState<string[]>([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  const steps = prayerGuideService.getAllSteps();
  const currentStep = steps[currentStepIndex];

  useEffect(() => {
    setBookmarkedSteps(storageService.getBookmarkedPrayerSteps());
  }, []);

  const handleToggleBookmark = (id: string) => {
    storageService.togglePrayerStepBookmark(id);
    setBookmarkedSteps(storageService.getBookmarkedPrayerSteps());
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleResetStep = () => {
    setCurrentStepIndex(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredList =
    selectedCategoryFilter === 'all'
      ? steps
      : steps.filter((s) => s.category === selectedCategoryFilter);

  return (
    <div className="space-y-6 pb-24 animate-fadeIn max-w-4xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#003B2E]">
            Panduan Tata Cara Salat
          </h1>
          <p className="text-xs text-[#68766F] mt-1">
            Panduan interaktif rukun, bacaan Arab berharakat, dan tata urutan salat fardhu.
          </p>
        </div>

        {/* View Mode Segmented Switch */}
        <div className="flex items-center gap-1 p-1 bg-white border border-[#E5E9E4] rounded-2xl shadow-2xs self-start sm:self-auto">
          <button
            onClick={() => setViewMode('step')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
              viewMode === 'step'
                ? 'bg-[#003B2E] text-white shadow-2xs'
                : 'text-[#68766F] hover:text-[#202520]'
            }`}
          >
            Langkah demi Langkah
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
              viewMode === 'list'
                ? 'bg-[#003B2E] text-white shadow-2xs'
                : 'text-[#68766F] hover:text-[#202520]'
            }`}
          >
            Daftar Lengkap
          </button>
          <button
            onClick={() => setViewMode('rakaat')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
              viewMode === 'rakaat'
                ? 'bg-[#003B2E] text-white shadow-2xs'
                : 'text-[#68766F] hover:text-[#202520]'
            }`}
          >
            Urutan Rakaat
          </button>
        </div>
      </div>

      {/* MODE 1: STEP-BY-STEP INTERACTIVE */}
      {viewMode === 'step' && currentStep && (
        <div className="space-y-4">
          {/* Progress Bar & Counter */}
          <div className="p-4 rounded-2xl bg-white border border-[#E5E9E4] shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#003B2E]">
              <span>Langkah {currentStepIndex + 1} dari {steps.length}</span>
              <span className="text-[#68766F] font-normal uppercase text-[10px] tracking-wider">
                Kategori: {currentStep.category}
              </span>
            </div>
            <div className="w-full h-2 bg-[#E5E9E4] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#003B2E] transition-all duration-300 rounded-full"
                style={{
                  width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Active Step Card */}
          <article className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E9E4] shadow-xs space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-[#E5E9E4] gap-3">
              <div>
                <span className="text-xs font-bold text-[#E0B030] bg-[#003B2E] px-2.5 py-1 rounded-lg">
                  Langkah #{currentStep.stepNumber}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#202520] mt-2">
                  {currentStep.title}
                </h2>
              </div>

              <button
                onClick={() => handleToggleBookmark(currentStep.id)}
                className={`p-2.5 rounded-xl transition ${
                  bookmarkedSteps.includes(currentStep.id)
                    ? 'text-[#E0B030] bg-[#003B2E]'
                    : 'text-[#68766F] hover:text-[#003B2E] hover:bg-[#F5F0D5]/50'
                }`}
                title="Tandai langkah ini"
                aria-label="Bookmark langkah ini"
              >
                <Bookmark
                  className={`w-4 h-4 ${
                    bookmarkedSteps.includes(currentStep.id) ? 'fill-current' : ''
                  }`}
                />
              </button>
            </div>

            {/* Arabic Reading */}
            {currentStep.arabic && (
              <div className="p-5 rounded-2xl bg-[#FFFEFA] border border-[#E5E9E4] space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#68766F] block">
                  Lafadz Bacaan:
                </span>
                <p className="font-quran text-right text-2xl sm:text-3xl text-[#003B2E] leading-loose">
                  {currentStep.arabic}
                </p>
                <p className="text-xs sm:text-sm text-[#68766F] italic pt-2 border-t border-[#E5E9E4]/60">
                  {currentStep.latin}
                </p>
                <p className="text-xs sm:text-sm text-[#202520] pt-1">
                  "{currentStep.translation}"
                </p>
              </div>
            )}

            {/* Motion & Explanation */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#003B2E]">
                Tata Cara & Penjelasan Gerakan:
              </h3>
              <p className="text-sm text-[#202520] leading-relaxed">
                {currentStep.explanation}
              </p>
            </div>

            {/* Fiqh Note if any */}
            {currentStep.fiqhNote && (
              <div className="p-3.5 rounded-2xl bg-[#F5F0D5]/50 border border-[#E0B030]/30 text-xs text-[#202520] flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#003B2E] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#003B2E] block">Catatan Fikih:</strong>
                  <span>{currentStep.fiqhNote}</span>
                </div>
              </div>
            )}

            {/* Controls Bar */}
            <div className="pt-6 border-t border-[#E5E9E4] flex items-center justify-between gap-3">
              <button
                onClick={handlePrevStep}
                disabled={currentStepIndex === 0}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#E5E9E4] text-xs font-bold text-[#003B2E] hover:bg-[#F5F0D5]/50 transition disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>

              <button
                onClick={handleResetStep}
                className="p-2.5 rounded-xl text-[#68766F] hover:bg-[#F5F0D5]/50 hover:text-[#003B2E] transition"
                title="Ulangi dari langkah pertama"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {currentStepIndex < steps.length - 1 ? (
                <button
                  onClick={handleNextStep}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#003B2E] text-white text-xs font-bold hover:bg-[#002B21] transition shadow-xs"
                >
                  <span>Selanjutnya</span>
                  <ChevronRight className="w-4 h-4 text-[#E0B030]" />
                </button>
              ) : (
                <button
                  onClick={handleResetStep}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#237A57] text-white text-xs font-bold hover:bg-[#1b6145] transition shadow-xs"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Selesai (Ulangi)</span>
                </button>
              )}
            </div>
          </article>
        </div>
      )}

      {/* MODE 2: FULL LIST VIEW */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {['all', 'persiapan', 'wudu', 'gerakan', 'zikir'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                  selectedCategoryFilter === cat
                    ? 'bg-[#003B2E] text-white border-[#003B2E]'
                    : 'bg-white text-[#68766F] border-[#E5E9E4] hover:text-[#202520]'
                }`}
              >
                {cat === 'all'
                  ? 'Semua Materi'
                  : cat === 'persiapan'
                  ? 'Syarat & Persiapan'
                  : cat === 'wudu'
                  ? 'Wudu'
                  : cat === 'gerakan'
                  ? 'Gerakan Salat'
                  : 'Zikir & Doa'}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredList.map((step) => (
              <article
                key={step.id}
                className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E5E9E4] shadow-xs space-y-3 hover:border-[#003B2E]/30 transition"
              >
                <div className="flex items-start justify-between pb-2 border-b border-[#E5E9E4] gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-[#003B2E] text-white text-xs font-bold flex items-center justify-center">
                      {step.stepNumber}
                    </span>
                    <h3 className="text-base font-bold text-[#202520]">
                      {step.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleToggleBookmark(step.id)}
                    className="p-1.5 text-[#68766F] hover:text-[#003B2E]"
                    aria-label="Bookmark"
                  >
                    <Bookmark
                      className={`w-4 h-4 ${
                        bookmarkedSteps.includes(step.id)
                          ? 'fill-current text-[#E0B030]'
                          : ''
                      }`}
                    />
                  </button>
                </div>

                {step.arabic && (
                  <div className="p-4 rounded-xl bg-[#FFFEFA] border border-[#E5E9E4]">
                    <p className="font-quran text-right text-xl text-[#003B2E] leading-loose">
                      {step.arabic}
                    </p>
                    <p className="text-xs text-[#68766F] italic mt-2">
                      {step.latin}
                    </p>
                    <p className="text-xs text-[#202520] mt-1 font-sans">
                      "{step.translation}"
                    </p>
                  </div>
                )}

                <p className="text-xs sm:text-sm text-[#202520] leading-relaxed">
                  {step.explanation}
                </p>

                {step.fiqhNote && (
                  <p className="text-[11px] text-[#68766F] bg-[#F5F0D5]/40 p-2.5 rounded-xl border border-[#E5E9E4]">
                    <strong>Catatan:</strong> {step.fiqhNote}
                  </p>
                )}
              </article>
            ))}
          </div>
        </div>
      )}

      {/* MODE 3: RAKAAT BREAKDOWN SUMMARY */}
      {viewMode === 'rakaat' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-[#E5E9E4] text-xs text-[#68766F]">
            Setiap salat fardhu memiliki ketentuan jumlah rakaat, bacaan pelan (sirr) atau keras (jahar), serta waktu penunaiannya masing-masing.
          </div>

          <div className="space-y-3">
            {PRAYER_RAKAAT_LIST.map((r) => (
              <div
                key={r.name}
                className="p-5 rounded-3xl bg-white border border-[#E5E9E4] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[#003B2E]">
                      {r.name}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#003B2E] text-white text-xs font-bold">
                      {r.rakaat} Rakaat
                    </span>
                  </div>
                  <p className="text-xs text-[#68766F] mt-1">
                    Waktu: {r.time}
                  </p>
                  <p className="text-xs text-[#202520] mt-1.5 bg-[#FFFEFA] p-2 rounded-xl border border-[#E5E9E4]">
                    {r.notes}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
