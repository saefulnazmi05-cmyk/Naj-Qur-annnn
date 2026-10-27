import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, Square, ChevronUp, ChevronDown, Sliders } from 'lucide-react';
import { APP_CONFIG } from '../../config/appConfig';

interface AutoScrollControlProps {
  initialSpeed?: number;
  onSpeedChange?: (speed: number) => void;
  containerRef?: React.RefObject<HTMLElement | null>;
}

export const AutoScrollControl: React.FC<AutoScrollControlProps> = ({
  initialSpeed = 1.0,
  onSpeedChange,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(initialSpeed);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  const animationFrameId = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const speedRef = useRef(speed);
  speedRef.current = speed;

  const stopScroll = useCallback(() => {
    if (animationFrameId.current !== null) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    lastTimeRef.current = null;
    setIsRunning(false);
  }, []);

  const step = useCallback((time: number) => {
    if (!lastTimeRef.current) {
      lastTimeRef.current = time;
    }
    const delta = (time - lastTimeRef.current) / 1000;
    lastTimeRef.current = time;

    // Check if user reached bottom of page
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

    if (scrollY >= maxScroll - 4) {
      stopScroll();
      return;
    }

    // Base speed: 45 pixels per second * speed multiplier
    const pixelsToScroll = 45 * speedRef.current * delta;
    window.scrollBy({ top: pixelsToScroll, behavior: 'auto' });

    animationFrameId.current = requestAnimationFrame(step);
  }, [stopScroll]);

  const startScroll = useCallback(() => {
    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      alert('Mode reduced motion terdeteksi aktif pada browser Anda.');
      return;
    }

    if (animationFrameId.current !== null) {
      cancelAnimationFrame(animationFrameId.current);
    }
    lastTimeRef.current = null;
    setIsRunning(true);
    animationFrameId.current = requestAnimationFrame(step);
  }, [step]);

  const toggleScroll = () => {
    if (isRunning) {
      stopScroll();
    } else {
      startScroll();
    }
  };

  const handleSpeedSelect = (newSpeed: number) => {
    setSpeed(newSpeed);
    speedRef.current = newSpeed;
    onSpeedChange?.(newSpeed);
    setShowSpeedMenu(false);
  };

  // Pause when tab becomes hidden (visibilitychange)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && isRunning) {
        stopScroll();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [isRunning, stopScroll]);

  // Clean up on unmount or page change
  useEffect(() => {
    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 bg-[#FFFFFF] border border-[#E5E9E4] px-3 py-2 rounded-full shadow-lg text-xs font-medium text-[#202520]">
      <span className="hidden sm:inline text-[11px] text-[#68766F] font-semibold pl-1 pr-1 border-r border-[#E5E9E4]">
        Auto-Scroll
      </span>

      {/* Start / Pause */}
      <button
        onClick={toggleScroll}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition ${
          isRunning
            ? 'bg-[#E0B030] text-[#003B2E] font-bold'
            : 'bg-[#003B2E] text-white hover:bg-[#002B21]'
        }`}
        aria-label={isRunning ? 'Jeda gulir otomatis' : 'Mulai gulir otomatis'}
      >
        {isRunning ? (
          <>
            <Pause className="w-3.5 h-3.5 fill-current" />
            <span>Jeda</span>
          </>
        ) : (
          <>
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Gulir</span>
          </>
        )}
      </button>

      {/* Stop */}
      {isRunning && (
        <button
          onClick={stopScroll}
          className="p-1.5 rounded-full text-[#68766F] hover:bg-[#F5F0D5]/50 hover:text-[#003B2E] transition"
          aria-label="Hentikan gulir otomatis"
        >
          <Square className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Speed selector toggle */}
      <div className="relative">
        <button
          onClick={() => setShowSpeedMenu(!showSpeedMenu)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#FFFEFA] border border-[#E5E9E4] hover:bg-[#F5F0D5]/40 text-[#003B2E] font-semibold text-[11px]"
          aria-label="Atur kecepatan gulir"
        >
          <span>{speed}x</span>
          {showSpeedMenu ? (
            <ChevronDown className="w-3 h-3" />
          ) : (
            <ChevronUp className="w-3 h-3" />
          )}
        </button>

        {showSpeedMenu && (
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white border border-[#E5E9E4] rounded-xl shadow-xl p-1 flex flex-col gap-0.5 min-w-[70px]">
            {APP_CONFIG.scrollSpeeds.map((s) => (
              <button
                key={s.value}
                onClick={() => handleSpeedSelect(s.value)}
                className={`px-2.5 py-1 text-center rounded-lg text-xs transition ${
                  speed === s.value
                    ? 'bg-[#003B2E] text-white font-bold'
                    : 'text-[#202520] hover:bg-[#F5F0D5]/60'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
