import React, { useState } from 'react';
import {
  Home,
  BookOpen,
  Clock,
  Compass,
  Grid,
  Calendar,
  Heart,
  HelpCircle,
  Bookmark,
  Settings,
  X,
} from 'lucide-react';

interface BottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate }) => {
  const [showMoreDrawer, setShowMoreDrawer] = useState(false);

  const primaryTabs = [
    { id: 'home', label: 'Beranda', icon: Home },
    { id: 'surahs', label: 'Al-Qur’an', icon: BookOpen },
    { id: 'prayer-times', label: 'Salat', icon: Clock },
    { id: 'qibla', label: 'Kiblat', icon: Compass },
  ];

  const moreFeatures = [
    { id: 'calendar', label: 'Kalender Hijriah', icon: Calendar, desc: 'Penanggalan & hari besar Islam' },
    { id: 'duas', label: 'Doa Harian', icon: Heart, desc: 'Kumpulan doa ma’tsur sahih' },
    { id: 'prayer-guide', label: 'Panduan Salat', icon: HelpCircle, desc: 'Rukun, bacaan & rakaat salat' },
    { id: 'bookmarks', label: 'Bookmark & Catatan', icon: Bookmark, desc: 'Ayat ditandai & tadabbur' },
    { id: 'settings', label: 'Pengaturan', icon: Settings, desc: 'Font Arab, qari audio & tema' },
  ];

  const isMoreActive = [
    'calendar',
    'duas',
    'prayer-guide',
    'bookmarks',
    'settings',
  ].includes(currentView);

  return (
    <>
      {/* Mobile Bottom Tab Bar */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-t border-[#E5E9E4] pb-safe"
        aria-label="Navigasi Bawah Mobile"
      >
        <div className="grid grid-cols-5 h-16 max-w-lg mx-auto items-center px-1">
          {primaryTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive =
              currentView === tab.id || (tab.id === 'surahs' && currentView === 'reader');

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setShowMoreDrawer(false);
                  onNavigate(tab.id);
                }}
                className={`flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] px-1 transition-colors relative ${
                  isActive ? 'text-[#003B2E]' : 'text-[#68766F] hover:text-[#202520]'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 text-[#003B2E] stroke-[2.2]' : 'stroke-[1.8]'
                  }`}
                />
                <span
                  className={`text-[10px] tracking-tight mt-1 truncate max-w-full ${
                    isActive ? 'font-bold text-[#003B2E]' : 'font-medium'
                  }`}
                >
                  {tab.label}
                </span>
                {isActive && (
                  <span
                    className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#E0B030]"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}

          {/* 5th Tab: Menu Lainnya */}
          <button
            onClick={() => setShowMoreDrawer(!showMoreDrawer)}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] px-1 transition-colors relative ${
              isMoreActive || showMoreDrawer
                ? 'text-[#003B2E]'
                : 'text-[#68766F] hover:text-[#202520]'
            }`}
            aria-label="Menu Fitur Ibadah Lainnya"
          >
            <Grid
              className={`w-5 h-5 transition-transform ${
                isMoreActive || showMoreDrawer
                  ? 'scale-110 text-[#003B2E] stroke-[2.2]'
                  : 'stroke-[1.8]'
              }`}
            />
            <span
              className={`text-[10px] tracking-tight mt-1 truncate max-w-full ${
                isMoreActive ? 'font-bold text-[#003B2E]' : 'font-medium'
              }`}
            >
              Lainnya
            </span>
            {isMoreActive && (
              <span
                className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#E0B030]"
                aria-hidden="true"
              />
            )}
          </button>
        </div>
      </nav>

      {/* "Lainnya" Drawer Modal for Mobile */}
      {showMoreDrawer && (
        <div
          role="dialog"
          aria-modal="true"
          className="lg:hidden fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs animate-fadeIn"
          onClick={() => setShowMoreDrawer(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-t-3xl p-5 border-t border-[#E5E9E4] shadow-2xl space-y-4 pb-safe animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E9E4]">
              <div className="flex items-center gap-2 text-sm font-bold text-[#003B2E]">
                <Grid className="w-4 h-4 text-[#E0B030]" />
                <span>Fitur Ibadah Lainnya</span>
              </div>
              <button
                onClick={() => setShowMoreDrawer(false)}
                className="p-1 rounded-lg text-[#68766F] hover:bg-[#F5F0D5]/50"
                aria-label="Tutup menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {moreFeatures.map((feat) => {
                const Icon = feat.icon;
                const isSelected = currentView === feat.id;

                return (
                  <button
                    key={feat.id}
                    onClick={() => {
                      onNavigate(feat.id);
                      setShowMoreDrawer(false);
                    }}
                    className={`p-3.5 rounded-2xl border text-left flex items-center gap-3.5 transition ${
                      isSelected
                        ? 'border-[#003B2E] bg-[#003B2E]/5 text-[#003B2E]'
                        : 'border-[#E5E9E4] hover:bg-[#FFFEFA]'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#003B2E]/10 text-[#003B2E] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#202520]">
                        {feat.label}
                      </h4>
                      <p className="text-[11px] text-[#68766F]">
                        {feat.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
