import React, { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { APP_CONFIG } from '../../config/appConfig';
import { PWAInstallButton } from '../pwa/PWAInstallButton';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenSearch,
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const mainNavItems = [
    { id: 'home', label: 'Beranda' },
    { id: 'surahs', label: 'Al-Qur’an' },
    { id: 'prayer-times', label: 'Jadwal Salat' },
    { id: 'qibla', label: 'Arah Kiblat' },
    { id: 'calendar', label: 'Kalender Hijriah' },
    { id: 'duas', label: 'Doa Harian' },
    { id: 'prayer-guide', label: 'Panduan Salat' },
  ];

  const secondaryNavItems = [
    { id: 'bookmarks', label: 'Bookmark & Catatan' },
    { id: 'settings', label: 'Pengaturan' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E5E9E4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 sm:gap-3 text-left focus-visible:ring-2 focus-visible:ring-[#E0B030] rounded-lg p-1 -ml-1 transition hover:opacity-95 flex-shrink-0"
          aria-label={`${APP_CONFIG.appName} Beranda`}
        >
          <img
            src={APP_CONFIG.logoUrl}
            alt={APP_CONFIG.appName}
            className="w-9 h-9 sm:w-10 sm:h-10 object-contain rounded-full shadow-xs"
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold tracking-tight text-[#003B2E] font-sans whitespace-nowrap">
              {APP_CONFIG.appName}
            </span>
            <span className="hidden xl:inline text-[11px] text-[#68766F] font-normal leading-none mt-0.5">
              {APP_CONFIG.tagline}
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden lg:flex items-center gap-4 xl:gap-5 text-xs font-semibold text-[#68766F]"
          aria-label="Navigasi Utama"
        >
          {mainNavItems.map((item) => {
            const isActive =
              currentView === item.id ||
              (item.id === 'surahs' && currentView === 'reader');

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`whitespace-nowrap transition-colors py-1 hover:text-[#003B2E] border-b-2 ${
                  isActive
                    ? 'border-[#003B2E] text-[#003B2E] font-bold'
                    : 'border-transparent'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          {/* More Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className={`flex items-center gap-1 py-1 hover:text-[#003B2E] border-b-2 transition ${
                currentView === 'bookmarks' || currentView === 'settings'
                  ? 'border-[#003B2E] text-[#003B2E] font-bold'
                  : 'border-transparent'
              }`}
            >
              <span>Lainnya</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showMoreMenu && (
              <div
                className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-[#E5E9E4] p-1.5 z-50 animate-fadeIn"
                onMouseLeave={() => setShowMoreMenu(false)}
              >
                {secondaryNavItems.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => {
                      onNavigate(sub.id);
                      setShowMoreMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition ${
                      currentView === sub.id
                        ? 'bg-[#003B2E] text-white'
                        : 'text-[#202520] hover:bg-[#F5F0D5]/50 hover:text-[#003B2E]'
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Actions Zone */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#E5E9E4] bg-[#FFFEFA] text-xs text-[#68766F] hover:text-[#003B2E] hover:border-[#003B2E]/30 transition min-h-[38px]"
            aria-label="Buka Pencarian"
          >
            <Search className="w-3.5 h-3.5 text-[#003B2E]" />
            <span className="hidden sm:inline">Cari...</span>
            <kbd className="hidden md:inline text-[10px] bg-[#E5E9E4]/60 px-1 py-0.5 rounded text-[#68766F]">
              /
            </kbd>
          </button>

          <PWAInstallButton />
        </div>
      </div>
    </header>
  );
};
