import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { MiniPlayer } from './components/audio/MiniPlayer';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';
import { SmartInstallWidget } from './components/pwa/SmartInstallWidget';
import { HomeView } from './views/HomeView';
import { SurahsView } from './views/SurahsView';
import { ReaderView } from './views/ReaderView';
import { SearchView } from './views/SearchView';
import { BookmarksView } from './views/BookmarksView';
import { SettingsView } from './views/SettingsView';
import { QiblaView } from './views/QiblaView';
import { PrayerTimesView } from './views/PrayerTimesView';
import { HijriCalendarView } from './views/HijriCalendarView';
import { DuasView } from './views/DuasView';
import { PrayerGuideView } from './views/PrayerGuideView';
import { quranApi } from './services/quranApi';
import { searchService } from './services/searchService';
import type { SurahSummary } from './types/quran';

export type AppView =
  | 'home'
  | 'surahs'
  | 'reader'
  | 'prayer-times'
  | 'qibla'
  | 'calendar'
  | 'duas'
  | 'prayer-guide'
  | 'search'
  | 'bookmarks'
  | 'settings';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedSurahNomor, setSelectedSurahNomor] = useState<number>(1);
  const [selectedAyatNomor, setSelectedAyatNomor] = useState<number>(1);

  const [surahs, setSurahs] = useState<SurahSummary[]>([]);
  const [isLoadingSurahs, setIsLoadingSurahs] = useState(true);
  const [surahsError, setSurahsError] = useState<string | null>(null);

  // Load all surahs on initial mount
  const loadSurahs = async () => {
    setIsLoadingSurahs(true);
    setSurahsError(null);
    try {
      const data = await quranApi.getAllSurahs();
      setSurahs(data);
      searchService.setSurahs(data);

      // Pre-index popular chapters for instant search
      setTimeout(() => {
        searchService.indexCommonSurahs([1, 18, 36, 67, 112, 113, 114]);
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat surat';
      setSurahsError(msg);
    } finally {
      setIsLoadingSurahs(false);
    }
  };

  useEffect(() => {
    loadSurahs();
  }, []);

  // Global keyboard shortcut '/' to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        setCurrentView('search');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initialize view from URL search params (supports PWA app shortcuts & deep linking)
  useEffect(() => {
    const parseUrlParams = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const viewParam = params.get('view') as AppView | null;
        const validViews: AppView[] = [
          'home',
          'surahs',
          'reader',
          'prayer-times',
          'qibla',
          'calendar',
          'duas',
          'prayer-guide',
          'search',
          'bookmarks',
          'settings',
        ];

        if (viewParam && validViews.includes(viewParam)) {
          setCurrentView(viewParam);
          if (viewParam === 'reader') {
            const surah = parseInt(params.get('surah') || '1', 10);
            const ayat = parseInt(params.get('ayat') || '1', 10);
            if (!isNaN(surah)) setSelectedSurahNomor(surah);
            if (!isNaN(ayat)) setSelectedAyatNomor(ayat);
          }
        }
      } catch {
        // Fallback gracefully to default state
      }
    };

    parseUrlParams();

    const handlePopState = () => {
      parseUrlParams();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Navigation handlers with URL history sync
  const updateUrl = (view: AppView, params?: { surah?: number; ayat?: number }) => {
    try {
      const url = new URL(window.location.href);
      if (view === 'home') {
        url.search = '';
      } else {
        url.searchParams.set('view', view);
        if (view === 'reader' && params?.surah) {
          url.searchParams.set('surah', params.surah.toString());
          if (params.ayat && params.ayat > 1) {
            url.searchParams.set('ayat', params.ayat.toString());
          } else {
            url.searchParams.delete('ayat');
          }
        } else {
          url.searchParams.delete('surah');
          url.searchParams.delete('ayat');
        }
      }
      window.history.pushState({ view, params }, '', url.toString());
    } catch {
      // In constrained iframe environments, ignore pushState errors
    }
  };

  const handleNavigateToSurah = (surahNomor: number, targetAyat = 1) => {
    setSelectedSurahNomor(surahNomor);
    setSelectedAyatNomor(targetAyat);
    setCurrentView('reader');
    updateUrl('reader', { surah: surahNomor, ayat: targetAyat });
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  const handleNavigate = (view: string) => {
    const target = view as AppView;
    setCurrentView(target);
    updateUrl(target);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  return (
    <div className="min-h-screen bg-[#FFFEFA] text-[#202520] flex flex-col selection:bg-[#E0B030]/20 selection:text-[#003B2E]">
      {/* Top Bar Header */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenSearch={() => handleNavigate('search')}
      />

      {/* Main Page Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-5 pb-20">
        {currentView === 'home' && (
          <HomeView
            surahs={surahs}
            onNavigateToSurah={handleNavigateToSurah}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'surahs' && (
          <SurahsView
            surahs={surahs}
            isLoading={isLoadingSurahs}
            error={surahsError}
            onRetry={loadSurahs}
            onSelectSurah={(nomor) => handleNavigateToSurah(nomor, 1)}
          />
        )}

        {currentView === 'reader' && (
          <ReaderView
            surahNomor={selectedSurahNomor}
            initialAyat={selectedAyatNomor}
            onBack={() => handleNavigate('surahs')}
            onNavigateSurah={(nomor, ayat = 1) => handleNavigateToSurah(nomor, ayat)}
          />
        )}

        {currentView === 'prayer-times' && <PrayerTimesView />}

        {currentView === 'qibla' && <QiblaView />}

        {currentView === 'calendar' && <HijriCalendarView />}

        {currentView === 'duas' && <DuasView />}

        {currentView === 'prayer-guide' && <PrayerGuideView />}

        {currentView === 'search' && (
          <SearchView
            onSelectResult={(surahNomor, ayatNomor) =>
              handleNavigateToSurah(surahNomor, ayatNomor)
            }
          />
        )}

        {currentView === 'bookmarks' && (
          <BookmarksView
            onSelectAyat={(surahNomor, ayatNomor) =>
              handleNavigateToSurah(surahNomor, ayatNomor)
            }
          />
        )}

        {currentView === 'settings' && <SettingsView />}
      </main>

      {/* Floating Audio Mini-Player */}
      <MiniPlayer />

      {/* Offline Connectivity Notification */}
      <OfflineIndicator />

      {/* Smart PWA Installation Widget */}
      <SmartInstallWidget currentView={currentView} />

      {/* Mobile Bottom Navigation */}
      <BottomNav currentView={currentView} onNavigate={handleNavigate} />
    </div>
  );
}
