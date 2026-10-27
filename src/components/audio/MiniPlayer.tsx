import React, { useEffect, useState } from 'react';
import { Play, Pause, Square, Volume2, AlertCircle } from 'lucide-react';
import { audioService, AudioPlaybackState } from '../../services/audioService';

export const MiniPlayer: React.FC = () => {
  const [state, setState] = useState<AudioPlaybackState>(audioService.getState());

  useEffect(() => {
    const unsubscribe = audioService.subscribe((newState) => {
      setState({ ...newState });
    });
    return unsubscribe;
  }, []);

  if (!state.audioUrl && !state.isLoading && !state.error) {
    return null;
  }

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    audioService.seek(val);
  };

  return (
    <aside
      aria-label="Pemutar Audio Al-Qur'an"
      className="fixed bottom-16 md:bottom-4 left-3 right-3 md:left-auto md:right-6 md:w-96 z-40 bg-[#003B2E] text-[#FFFEFA] rounded-2xl shadow-2xl border border-[#E0B030]/30 overflow-hidden backdrop-blur-md transition-all duration-200"
    >
      {/* Progress Bar Header */}
      <div className="relative w-full h-1 bg-black/40">
        <div
          className="absolute top-0 bottom-0 left-0 bg-[#E0B030] transition-all"
          style={{ width: `${state.progressPercent}%` }}
        />
      </div>

      <div className="p-3.5 flex items-center justify-between gap-3">
        {/* Info */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-9 h-9 rounded-xl bg-[#E0B030]/15 flex items-center justify-center flex-shrink-0 text-[#E0B030]">
            <Volume2 className="w-4 h-4 animate-pulse" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#FFFEFA] truncate">
                {state.trackType === 'surah'
                  ? `Surat ${state.surahNamaLatin}`
                  : `Surat ${state.surahNamaLatin} : ${state.ayatNomor}`}
              </span>
            </div>
            <p className="text-[11px] text-[#F5F0D5]/80 truncate">
              {state.reciterName}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => {
              if (state.isPlaying) {
                audioService.pause();
              } else {
                audioService.resume();
              }
            }}
            disabled={state.isLoading}
            className="w-9 h-9 rounded-full bg-[#E0B030] text-[#003B2E] flex items-center justify-center hover:bg-[#ebd265] transition active:scale-95 disabled:opacity-50"
            aria-label={state.isPlaying ? 'Jeda Audio' : 'Putar Audio'}
          >
            {state.isLoading ? (
              <div className="w-4 h-4 border-2 border-[#003B2E] border-t-transparent rounded-full animate-spin" />
            ) : state.isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current translate-x-0.5" />
            )}
          </button>

          <button
            onClick={() => audioService.stop()}
            className="w-8 h-8 rounded-full text-[#F5F0D5]/70 hover:text-white hover:bg-white/10 flex items-center justify-center transition"
            aria-label="Hentikan Audio"
          >
            <Square className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Scrub and Timestamp */}
      <div className="px-3.5 pb-2.5 pt-0 flex items-center justify-between text-[10px] text-[#F5F0D5]/70">
        <span>{formatTime(state.currentTime)}</span>
        <input
          type="range"
          min="0"
          max="100"
          value={isNaN(state.progressPercent) ? 0 : state.progressPercent}
          onChange={handleSeek}
          className="mx-2 flex-1 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#E0B030]"
          aria-label="Posisi pemutaran audio"
        />
        <span>{formatTime(state.duration)}</span>
      </div>

      {/* Error alert if any */}
      {state.error && (
        <div className="px-3.5 py-1.5 bg-[#B42318] text-white text-[11px] flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{state.error}</span>
        </div>
      )}
    </aside>
  );
};
