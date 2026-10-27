import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  Smartphone,
  Share2,
  PlusSquare,
  MoreVertical,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { audioService } from '../../services/audioService';
import { APP_CONFIG } from '../../config/appConfig';

interface SmartInstallWidgetProps {
  currentView?: string;
}

export const SmartInstallWidget: React.FC<SmartInstallWidgetProps> = ({ currentView }) => {
  const {
    isInstallable,
    isInstalled,
    isStandalone,
    isIOS,
    isAndroid,
    browserName,
    isSnoozed,
    install,
    snooze,
  } = usePWAInstall();

  const [showGuideModal, setShowGuideModal] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);

  // Subscribe to audio player state to avoid UI collision
  useEffect(() => {
    const unsub = audioService.subscribe((state) => {
      setIsAudioActive(Boolean(state.audioUrl || state.isLoading));
    });
    return unsub;
  }, []);

  // Listen for Escape key to close modal or snooze widget
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showGuideModal) {
          setShowGuideModal(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showGuideModal]);

  // CRITICAL RULE 1: If already installed or standalone, do NOT display
  if (isInstalled || isStandalone) {
    return null;
  }

  // CRITICAL RULE 2: If user recently snoozed ("Nanti Saja" or close button within 24h), do NOT display
  if (isSnoozed) {
    return null;
  }

  // CRITICAL RULE 3: Do NOT disturb the user during focused activities (reading surah or searching)
  if (currentView === 'reader' || currentView === 'search') {
    return null;
  }

  // Handler for "Install Sekarang"
  const handleInstallClick = async () => {
    if (isInstallable) {
      setIsInstalling(true);
      const outcomeAccepted = await install();
      setIsInstalling(false);

      if (!outcomeAccepted) {
        // User dismissed native prompt or declined: show gentle guidance
        setShowGuideModal(true);
      }
    } else {
      // Browser doesn't support beforeinstallprompt (e.g. iOS Safari, Firefox, Desktop)
      setShowGuideModal(true);
    }
  };

  // Handler for "Nanti Saja" or close button (×)
  const handleDismiss = () => {
    snooze(24); // 24-hour snooze
  };

  return (
    <>
      {/* =========================================================================
          SMART INSTALL WIDGET CARD
          - Dynamic positioning:
            * On Mobile without Audio: floats above bottom nav (h-16) with safe-area spacing
            * On Mobile WITH Audio: floats safely above MiniPlayer without collision
            * On Desktop: docks cleanly in the bottom-right viewport corner
          - Fluid responsiveness: adapts cleanly on 320px screens without overflow
          ========================================================================= */}
      <aside
        role="region"
        aria-label="Ajakan Memasang Aplikasi Naj Qur'an"
        className={`fixed z-35 transition-all duration-300 ease-out left-3 right-3 sm:left-auto sm:right-6 sm:w-[410px] max-w-[calc(100vw-1.5rem)] ${
          isAudioActive
            ? 'bottom-[calc(5.75rem+env(safe-area-inset-bottom,0px))] md:bottom-28'
            : 'bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] md:bottom-6'
        }`}
      >
        <div className="bg-[#FFFEFA] border border-[#E5E9E4] rounded-2xl shadow-xl p-3.5 sm:p-4 text-[#202520] relative backdrop-blur-md">
          {/* Subtle gold accent top bar */}
          <div className="absolute top-0 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-[#E0B030]/60 to-transparent rounded-full" />

          {/* Close button (×) - Accessible & Easy to tap */}
          <button
            onClick={handleDismiss}
            aria-label="Tutup ajakan instalasi"
            className="absolute top-2.5 right-2.5 w-7 h-7 flex items-center justify-center rounded-lg text-[#68766F] hover:text-[#003B2E] hover:bg-[#003B2E]/5 transition active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Content Row */}
          <div className="flex items-start gap-3 pr-6">
            {/* App Icon */}
            <div className="relative flex-shrink-0">
              <img
                src={APP_CONFIG.logoUrl}
                alt={APP_CONFIG.appName}
                className="w-12 h-12 rounded-xl object-contain shadow-xs border border-[#E5E9E4] bg-white p-0.5"
                width={48}
                height={48}
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#003B2E] text-[#E0B030] flex items-center justify-center shadow-2xs">
                <Sparkles className="w-2.5 h-2.5" />
              </span>
            </div>

            {/* Title & Description */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h4 className="text-sm font-bold text-[#003B2E] leading-tight">
                  Pasang Naj Qur’an
                </h4>
                <span className="text-[10px] bg-[#E0B030]/15 text-[#8F6C00] font-semibold px-2 py-0.5 rounded-full">
                  Gratis & Cepat
                </span>
              </div>
              <p className="text-xs text-[#68766F] mt-1 leading-snug">
                Akses Al-Qur’an dan fitur ibadah favorit Anda langsung dari layar utama.
              </p>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="mt-3.5 pt-3 border-t border-[#E5E9E4]/80 flex items-center justify-end gap-2 flex-wrap sm:flex-nowrap">
            {/* Tombol Sekunder: "Nanti Saja" */}
            <button
              onClick={handleDismiss}
              className="flex-1 sm:flex-none text-center px-3 py-2 min-h-[40px] rounded-xl text-xs font-semibold text-[#68766F] hover:text-[#202520] hover:bg-[#F5F0D5]/50 transition active:scale-[0.98]"
            >
              Nanti Saja
            </button>

            {/* Tombol Utama: "Install Sekarang" */}
            <button
              onClick={handleInstallClick}
              disabled={isInstalling}
              className="flex-1 sm:flex-none text-center inline-flex items-center justify-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-xl bg-[#003B2E] text-[#FFFEFA] text-xs font-bold shadow-xs hover:bg-[#002B21] transition active:scale-[0.98] disabled:opacity-50 whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 text-[#E0B030] flex-shrink-0" />
              <span>{isInstalling ? 'Memasang...' : 'Install Sekarang'}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* =========================================================================
          INTERACTIVE INSTALLATION GUIDE MODAL
          Displayed when native prompt is unsupported (iOS Safari) or user needs
          clear browser-specific instructions.
          ========================================================================= */}
      {showGuideModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="pwa-guide-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn"
          onClick={() => setShowGuideModal(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white p-5 sm:p-6 shadow-2xl border border-[#E5E9E4] space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E9E4]">
              <div className="flex items-center gap-2.5">
                <img
                  src={APP_CONFIG.logoUrl}
                  alt={APP_CONFIG.appName}
                  className="w-10 h-10 rounded-xl object-contain border border-[#E5E9E4] p-0.5"
                />
                <div>
                  <h3 id="pwa-guide-modal-title" className="text-base font-bold text-[#003B2E]">
                    Pasang Naj Qur’an
                  </h3>
                  <p className="text-[11px] text-[#68766F]">
                    {isIOS
                      ? 'Panduan Layar Utama iPhone / iPad (Safari)'
                      : isAndroid
                      ? 'Panduan Layar Utama Android'
                      : 'Panduan Pasang di Komputer / Desktop'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="p-1.5 rounded-lg text-[#68766F] hover:bg-[#F5F0D5]/50 transition"
                aria-label="Tutup panduan"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Guide Instructions based on Platform */}
            {isIOS ? (
              // iOS Safari Instructions
              <div className="space-y-3 text-xs text-[#202520]">
                <p className="text-[#68766F] leading-relaxed">
                  Pada browser Safari di iPhone atau iPad, Anda dapat memasang Naj Qur’an langsung ke layar utama:
                </p>
                <div className="space-y-2.5 bg-[#FFFEFA] p-3.5 rounded-2xl border border-[#E5E9E4]">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#003B2E] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      1
                    </span>
                    <p className="leading-snug">
                      Tekan tombol <strong className="text-[#003B2E]">Bagikan (Share)</strong>{' '}
                      <Share2 className="w-3.5 h-3.5 inline text-[#003B2E] align-sub mx-0.5" /> di bilah navigasi Safari.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#003B2E] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      2
                    </span>
                    <p className="leading-snug">
                      Gulir ke bawah dan pilih opsi{' '}
                      <strong className="text-[#003B2E]">"Tambahkan ke Layar Utama" (Add to Home Screen)</strong>{' '}
                      <PlusSquare className="w-3.5 h-3.5 inline text-[#003B2E] align-sub mx-0.5" />.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#003B2E] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      3
                    </span>
                    <p className="leading-snug">
                      Tekan <strong className="text-[#003B2E]">"Tambah" (Add)</strong> di pojok kanan atas. Ikon aplikasi akan langsung muncul di beranda ponsel Anda.
                    </p>
                  </div>
                </div>
              </div>
            ) : isAndroid ? (
              // Android Chrome / Samsung Internet Instructions
              <div className="space-y-3 text-xs text-[#202520]">
                <p className="text-[#68766F] leading-relaxed">
                  Pasang aplikasi Naj Qur’an di perangkat Android Anda untuk pengalaman layar penuh bebas kuota:
                </p>
                <div className="space-y-2.5 bg-[#FFFEFA] p-3.5 rounded-2xl border border-[#E5E9E4]">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#003B2E] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      1
                    </span>
                    <p className="leading-snug">
                      Tekan tombol menu titik tiga (<strong className="text-[#003B2E]">⋮</strong>{' '}
                      <MoreVertical className="w-3 h-3 inline align-sub" />) di pojok kanan atas browser{' '}
                      {browserName === 'samsung' ? 'Samsung Internet' : 'Chrome'}.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#003B2E] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      2
                    </span>
                    <p className="leading-snug">
                      Pilih menu <strong className="text-[#003B2E]">"Pasang Aplikasi" (Install App)</strong> atau{' '}
                      <strong className="text-[#003B2E]">"Tambahkan ke Layar Utama"</strong>.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#003B2E] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      3
                    </span>
                    <p className="leading-snug">
                      Konfirmasi pemasangan. Naj Qur’an akan otomatis terinstal di drawer aplikasi Anda.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              // Desktop Instructions
              <div className="space-y-3 text-xs text-[#202520]">
                <p className="text-[#68766F] leading-relaxed">
                  Buka aplikasi Naj Qur’an dalam jendela tersendiri di komputer Anda:
                </p>
                <div className="space-y-2.5 bg-[#FFFEFA] p-3.5 rounded-2xl border border-[#E5E9E4]">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#003B2E] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      1
                    </span>
                    <p className="leading-snug">
                      Pada browser Chrome atau Edge, perhatikan ujung kanan bilah alamat (address bar).
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#003B2E] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      2
                    </span>
                    <p className="leading-snug">
                      Klik ikon <strong className="text-[#003B2E]">Pasang / Install</strong> (ikon komputer dengan panah ke bawah).
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#003B2E] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      3
                    </span>
                    <p className="leading-snug">
                      Klik <strong>Install</strong>. Aplikasi akan terbuka di jendela mandiri tanpa tab browser.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="pt-2 flex items-center justify-end">
              <button
                onClick={() => setShowGuideModal(false)}
                className="w-full py-2.5 rounded-xl bg-[#003B2E] text-white text-xs font-bold hover:bg-[#002B21] transition active:scale-[0.98] text-center"
              >
                Saya Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
