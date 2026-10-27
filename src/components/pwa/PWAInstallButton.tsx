import React, { useState } from 'react';
import { Download, X, Smartphone, CheckCircle, Share2, MoreVertical, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'compact' | 'full';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'compact',
}) => {
  const { isInstallable, isInstalled, isStandalone, isIOS, isAndroid, browserName, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // If already running as an installed PWA or TWA standalone, hide install promotion
  if (isInstalled || isStandalone) {
    if (variant === 'full') {
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#237A57]/10 text-[#237A57] text-xs font-bold border border-[#237A57]/30">
          <CheckCircle className="w-4 h-4 text-[#237A57]" />
          <span>Aplikasi Terpasang (Mode Standalone)</span>
        </div>
      );
    }
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      setIsInstalling(true);
      const accepted = await install();
      setIsInstalling(false);
      if (!accepted) {
        // If user dismissed the prompt or browser declined, give them helpful manual guide
        setShowGuideModal(true);
      }
    } else {
      setShowGuideModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={isInstalling}
        className={`inline-flex items-center justify-center gap-2 rounded-xl bg-[#003B2E] text-[#FFFEFA] font-bold text-xs shadow-xs hover:bg-[#002B21] transition active:scale-[0.98] disabled:opacity-50 ${
          variant === 'full' ? 'w-full py-3 px-4' : 'px-3.5 py-1.5'
        } ${className}`}
        aria-label="Pasang Aplikasi Naj Qur'an"
      >
        <Download className="w-3.5 h-3.5 text-[#E0B030] flex-shrink-0" />
        <span>{isInstalling ? 'Memasang...' : 'Pasang Aplikasi'}</span>
      </button>

      {/* Manual Installation Guide Modal for Android, iOS, and Desktop */}
      {showGuideModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn"
          onClick={() => setShowGuideModal(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-[#E5E9E4] space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E9E4]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#003B2E]/10 flex items-center justify-center text-[#003B2E]">
                  <Smartphone className="w-5 h-5 text-[#E0B030]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#003B2E]">
                    Pasang Naj Qur’an
                  </h3>
                  <p className="text-[11px] text-[#68766F]">
                    {isIOS
                      ? 'Panduan Layar Utama iPhone / iPad'
                      : isAndroid
                      ? 'Panduan Instalasi Android (WebAPK)'
                      : 'Panduan Instalasi Komputer / Desktop'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="p-1 rounded-lg text-[#68766F] hover:bg-[#F5F0D5]/50"
                aria-label="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Instruction Body */}
            {isIOS ? (
              // iOS Safari Guide
              <div className="space-y-3 text-xs text-[#202520]">
                <p className="text-[#68766F]">
                  Pada browser Safari di iPhone atau iPad, Anda dapat memasang Naj Qur’an langsung ke layar utama:
                </p>
                <div className="space-y-2.5 bg-[#FFFEFA] p-3.5 rounded-2xl border border-[#E5E9E4]">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#003B2E] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      1
                    </span>
                    <p>
                      Tekan tombol <strong className="text-[#003B2E]">Bagikan (Share <Share2 className="w-3 h-3 inline text-[#003B2E]" />)</strong> pada bilah bawah browser Safari.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#003B2E] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      2
                    </span>
                    <p>
                      Gulir ke bawah dan pilih menu <strong className="text-[#003B2E]">Tambahkan ke Layar Utama (Add to Home Screen <PlusSquare className="w-3 h-3 inline text-[#003B2E]" />)</strong>.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#003B2E] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      3
                    </span>
                    <p>
                      Tekan <strong className="text-[#003B2E]">Tambah (Add)</strong> di pojok kanan atas. Ikon Naj Qur’an akan langsung muncul di layar utama Anda tanpa browser address bar.
                    </p>
                  </div>
                </div>
              </div>
            ) : isAndroid ? (
              // Android Guide (Chrome / Samsung / Firefox)
              <div className="space-y-3 text-xs text-[#202520]">
                <p className="text-[#68766F]">
                  Pasang aplikasi Naj Qur’an di perangkat Android Anda untuk pengalaman layar penuh:
                </p>
                <div className="space-y-2.5 bg-[#FFFEFA] p-3.5 rounded-2xl border border-[#E5E9E4]">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#003B2E] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      1
                    </span>
                    <p>
                      Tekan tombol menu titik tiga (<strong className="text-[#003B2E]">⋮ <MoreVertical className="w-3 h-3 inline" /></strong>) di pojok kanan atas browser Chrome / Samsung Internet.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#003B2E] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      2
                    </span>
                    <p>
                      Pilih <strong className="text-[#003B2E]">Pasang Aplikasi (Install App)</strong> atau <strong className="text-[#003B2E]">Tambahkan ke Layar Utama</strong>.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#003B2E] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      3
                    </span>
                    <p>
                      Konfirmasi pemasangan. Aplikasi akan terpasang di daftar aplikasi Android Anda seperti aplikasi asli (native).
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              // Desktop Guide
              <div className="space-y-3 text-xs text-[#202520]">
                <p className="text-[#68766F]">
                  Pada browser Chrome atau Edge di komputer, tekan ikon <strong>Pasang (Install)</strong> di ujung kanan bilah alamat (address bar) untuk membuka aplikasi dalam jendela mandiri.
                </p>
              </div>
            )}

            {/* Modal Action Footer */}
            <div className="pt-2 flex items-center justify-end">
              <button
                onClick={() => setShowGuideModal(false)}
                className="w-full py-2.5 rounded-xl bg-[#003B2E] text-white text-xs font-bold hover:bg-[#002B21] transition text-center"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
