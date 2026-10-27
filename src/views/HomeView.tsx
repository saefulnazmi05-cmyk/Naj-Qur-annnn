import React, { useEffect, useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Bookmark,
  Calendar,
  Flame,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Wifi,
  WifiOff,
  Clock,
  Compass,
  Heart,
  HelpCircle,
  Navigation,
} from 'lucide-react';
import { APP_CONFIG } from '../config/appConfig';
import { storageService } from '../services/storageService';
import { quranApi } from '../services/quranApi';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { hijriCalendarService } from '../services/hijriCalendarService';
import { prayerTimesService } from '../services/prayerTimesService';
import { CITIES_LIST, DEFAULT_CITY, calculateQiblaBearing } from '../services/qiblaService';
import { duaService } from '../services/duaService';
import type { LastReadPosition, TilawahProgress, SurahSummary, CityLocation } from '../types/quran';

interface HomeViewProps {
  onNavigateToSurah: (surahNomor: number, targetAyat?: number) => void;
  onNavigate: (view: string) => void;
  surahs: SurahSummary[];
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigateToSurah,
  onNavigate,
  surahs,
}) => {
  const isOnline = useOnlineStatus();
  const [lastRead, setLastRead] = useState<LastReadPosition | null>(null);
  const [tilawahProgress, setTilawahProgress] = useState<TilawahProgress>(
    storageService.getTilawahProgress()
  );
  const [cachedSurahsCount, setCachedSurahsCount] = useState(0);

  // Active City for Home preview
  const [activeCity, setActiveCity] = useState<CityLocation>(() => {
    const savedId = storageService.getSelectedCityId();
    return CITIES_LIST.find((c) => c.id === savedId) || DEFAULT_CITY;
  });

  // Today Date & Live Timer for Prayer Countdown
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    setLastRead(storageService.getLastRead());
    setTilawahProgress(storageService.getTilawahProgress());
    setCachedSurahsCount(quranApi.getCachedSurahsCount());

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Today Hijri info
  const todayHijri = useMemo(() => {
    return hijriCalendarService.getHijriDetail(currentTime);
  }, [currentTime]);

  const todayGregorianStr = useMemo(() => {
    return currentTime.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }, [currentTime]);

  // Today Prayer Times & Next Prayer Countdown
  const nextPrayer = useMemo(() => {
    const pt = prayerTimesService.calculatePrayerTimes(currentTime, activeCity);
    return prayerTimesService.getNextPrayer(pt, currentTime);
  }, [currentTime, activeCity]);

  // Qibla Bearing preview from active city
  const qiblaBearing = useMemo(() => {
    return calculateQiblaBearing(activeCity.latitude, activeCity.longitude);
  }, [activeCity]);

  // Featured Dua of the Day
  const featuredDua = useMemo(() => {
    return duaService.getFeaturedDua();
  }, []);

  const progressPercent = Math.min(
    100,
    Math.round((tilawahProgress.todayReadAyat / tilawahProgress.dailyTargetAyat) * 100)
  );

  const featuredSurahs = [
    { nomor: 1, label: 'Al-Fatihah', tag: 'Pembukaan' },
    { nomor: 18, label: 'Al-Kahf', tag: 'Sunnah Jumat' },
    { nomor: 36, label: 'Yasin', tag: 'Jantung Al-Qur’an' },
    { nomor: 56, label: 'Al-Waqi’ah', tag: 'Hari Kiamat' },
    { nomor: 67, label: 'Al-Mulk', tag: 'Pelindung Siksa Kubur' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 animate-fadeIn">
      {/* 1. Hero Branding & Dual Date Section */}
      <section className="relative overflow-hidden rounded-3xl bg-radial from-[#004D3C] to-[#003B2E] text-white p-6 sm:p-8 md:p-10 shadow-lg border border-[#E0B030]/20">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#E0B030]/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs text-[#F5F0D5] font-medium backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#E0B030]" />
              <span>Assalamu’alaikum Warahmatullahi Wabarakatuh</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white font-sans">
              {APP_CONFIG.appName}
            </h1>

            <p className="text-sm sm:text-base text-[#F5F0D5] font-normal leading-relaxed">
              {APP_CONFIG.tagline}
            </p>

            {/* Today Gregorian & Hijri Date Ribbon */}
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3 text-xs text-[#F5F0D5]">
              <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl border border-white/10">
                <Calendar className="w-3.5 h-3.5 text-[#E0B030]" />
                <span>{todayGregorianStr}</span>
                <span className="text-[#E0B030] font-bold">·</span>
                <span className="font-semibold">{todayHijri.displayString}</span>
              </div>
            </div>

            {/* Offline cache status */}
            <div className="pt-1 flex items-center justify-center md:justify-start gap-3 text-[11px] text-[#F5F0D5]/80">
              <div className="flex items-center gap-1.5">
                {isOnline ? (
                  <Wifi className="w-3 h-3 text-[#E0B030]" />
                ) : (
                  <WifiOff className="w-3 h-3 text-[#B42318]" />
                )}
                <span>{isOnline ? 'Online' : 'Offline'}</span>
              </div>
              <span aria-hidden="true">·</span>
              <span>{cachedSurahsCount} dari 114 surat siap offline</span>
            </div>
          </div>

          {/* Brand Logo Emblem */}
          <div className="flex-shrink-0 flex flex-col items-center">
            <div className="relative p-2 rounded-full bg-[#002B21]/60 border-2 border-[#E0B030]/40 shadow-xl">
              <img
                src={APP_CONFIG.logoUrl}
                alt="Logo Naj Qur’an"
                className="w-24 h-24 sm:w-32 sm:h-32 object-contain rounded-full transform hover:rotate-2 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Grid: Next Prayer & Qibla Compass Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Jadwal Salat Berikutnya Card */}
        <div className="rounded-3xl bg-white p-5 sm:p-6 border border-[#E5E9E4] shadow-2xs flex flex-col justify-between hover:border-[#003B2E]/30 transition group">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E9E4]">
              <div className="flex items-center gap-2 text-xs font-bold text-[#003B2E]">
                <Clock className="w-4 h-4 text-[#E0B030]" />
                <span>Salat Berikutnya — {activeCity.name}</span>
              </div>
              <span className="text-[10px] bg-[#003B2E]/10 text-[#003B2E] font-bold px-2 py-0.5 rounded-full">
                Kemenag RI
              </span>
            </div>

            <div className="py-4 flex items-baseline justify-between">
              <div>
                <span className="text-xs uppercase text-[#68766F] font-semibold block">
                  Waktu Masuk
                </span>
                <h3 className="text-2xl font-extrabold text-[#202520]">
                  {nextPrayer.name}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold font-mono text-[#003B2E]">
                  {nextPrayer.time}
                </span>
                <span className="text-[11px] text-[#68766F] block mt-0.5">
                  Tersisa: <strong className="font-mono text-[#E0B030]">{nextPrayer.countdown}</strong>
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('prayer-times')}
            className="w-full mt-2 py-2.5 px-4 rounded-xl bg-[#003B2E] text-white text-xs font-bold hover:bg-[#002B21] transition flex items-center justify-center gap-2"
          >
            <span>Buka Jadwal Salat Lengkap</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#E0B030]" />
          </button>
        </div>

        {/* Arah Kiblat Card */}
        <div className="rounded-3xl bg-white p-5 sm:p-6 border border-[#E5E9E4] shadow-2xs flex flex-col justify-between hover:border-[#003B2E]/30 transition group">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E9E4]">
              <div className="flex items-center gap-2 text-xs font-bold text-[#003B2E]">
                <Compass className="w-4 h-4 text-[#E0B030]" />
                <span>Arah Kiblat Menuju Ka'bah</span>
              </div>
              <span className="text-[11px] text-[#68766F]">
                {activeCity.name}
              </span>
            </div>

            <div className="py-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-[#68766F] block">
                  Sudut Kompas dari Utara:
                </span>
                <h3 className="text-2xl font-extrabold text-[#003B2E] font-mono">
                  {qiblaBearing}°
                </h3>
                <p className="text-[11px] text-[#68766F] mt-0.5">
                  Arahkan sajadah Anda ke barat laut sesuai sudut derajat ini.
                </p>
              </div>

              <div className="w-12 h-12 rounded-full bg-[#003B2E] text-[#E0B030] flex items-center justify-center text-xl shadow-xs border-2 border-[#E0B030]">
                🕋
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('qibla')}
            className="w-full mt-2 py-2.5 px-4 rounded-xl border border-[#E5E9E4] text-[#003B2E] hover:bg-[#F5F0D5]/50 text-xs font-bold transition flex items-center justify-center gap-2"
          >
            <Compass className="w-3.5 h-3.5 text-[#E0B030]" />
            <span>Buka Kompas Kiblat Visual</span>
          </button>
        </div>
      </section>

      {/* 3. Grid: Lanjutkan Membaca Al-Qur'an & Progres Tilawah */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Lanjutkan Membaca Card */}
        <div className="rounded-3xl bg-white p-5 sm:p-6 border border-[#E5E9E4] shadow-2xs flex flex-col justify-between hover:border-[#003B2E]/30 transition">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E9E4]">
              <div className="flex items-center gap-2 text-xs font-bold text-[#003B2E]">
                <BookOpen className="w-4 h-4 text-[#E0B030]" />
                <span>Lanjutkan Membaca Al-Qur’an</span>
              </div>
              {lastRead && (
                <span className="text-[11px] text-[#68766F]">
                  Terakhir dibuka
                </span>
              )}
            </div>

            {lastRead ? (
              <div className="py-4">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-xl font-bold text-[#202520]">
                    Surat {lastRead.surahNamaLatin}
                  </h3>
                  <span className="font-quran text-2xl text-[#003B2E]">
                    {lastRead.surahNamaArab}
                  </span>
                </div>
                <p className="text-xs text-[#68766F] mt-1">
                  Surat ke-{lastRead.surahNomor} · Ayat ke-{lastRead.ayatNomor}
                </p>
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-[#68766F]">
                <p>Belum ada riwayat bacaan yang tersimpan.</p>
                <p className="text-[11px] text-[#68766F]/80 mt-1">
                  Mulai tilawah hari ini dari Surat Al-Fatihah.
                </p>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              if (lastRead) {
                onNavigateToSurah(lastRead.surahNomor, lastRead.ayatNomor);
              } else {
                onNavigateToSurah(1, 1);
              }
            }}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-[#003B2E] text-white text-xs font-bold hover:bg-[#002B21] transition flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <span>{lastRead ? 'Lanjutkan Ayat Terakhir' : 'Mulai Membaca'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#E0B030]" />
          </button>
        </div>

        {/* Target Tilawah Harian Card */}
        <div className="rounded-3xl bg-white p-5 sm:p-6 border border-[#E5E9E4] shadow-2xs flex flex-col justify-between hover:border-[#003B2E]/30 transition">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E9E4]">
              <div className="flex items-center gap-2 text-xs font-bold text-[#003B2E]">
                <Calendar className="w-4 h-4 text-[#E0B030]" />
                <span>Target & Progres Tilawah Harian</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-[#E0B030] bg-[#003B2E] px-2.5 py-0.5 rounded-full">
                <Flame className="w-3 h-3 fill-current" />
                <span>{tilawahProgress.currentStreak} Hari</span>
              </div>
            </div>

            <div className="py-4 space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-extrabold text-[#202520] tabular-nums">
                    {tilawahProgress.todayReadAyat}
                  </span>
                  <span className="text-sm font-medium text-[#68766F] ml-1.5">
                    / {tilawahProgress.dailyTargetAyat} ayat
                  </span>
                </div>
                <span className="text-xs font-bold text-[#003B2E] tabular-nums">
                  {progressPercent}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2.5 bg-[#E5E9E4] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#003B2E] transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#68766F] pt-1">
                <span>Total ayat: {tilawahProgress.totalAyatRead} ayat</span>
                {progressPercent >= 100 && (
                  <span className="text-[#237A57] font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Target tercapai!
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('settings')}
            className="w-full mt-2 py-2.5 px-4 rounded-xl border border-[#E5E9E4] text-[#202520] hover:bg-[#F5F0D5]/40 text-xs font-semibold transition text-center"
          >
            Sesuaikan Target Harian
          </button>
        </div>
      </section>

      {/* 4. Doa Harian Pilihan Card */}
      {featuredDua && (
        <section className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E5E9E4] shadow-2xs space-y-3 hover:border-[#003B2E]/30 transition">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5E9E4]">
            <span className="text-xs font-bold text-[#003B2E] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#E0B030]" />
              Doa Pilihan Hari Ini — {featuredDua.category}
            </span>
            <button
              onClick={() => onNavigate('duas')}
              className="text-xs text-[#003B2E] font-semibold hover:underline"
            >
              Lihat Semua Doa
            </button>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-[#202520]">
            {featuredDua.title}
          </h3>

          <p className="font-quran text-right text-xl text-[#003B2E] leading-loose">
            {featuredDua.arabic}
          </p>

          <p className="text-xs text-[#202520] font-sans italic">
            "{featuredDua.translation}"
          </p>

          <p className="text-[11px] text-[#68766F] pt-1 border-t border-[#E5E9E4]">
            Sumber: {featuredDua.source}
          </p>
        </section>
      )}

      {/* 5. Akses Cepat Navigasi Seluruh Fitur */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold text-[#003B2E] uppercase tracking-wider">
          Akses Fitur Ibadah
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <button
            onClick={() => onNavigate('surahs')}
            className="p-4 rounded-2xl bg-white border border-[#E5E9E4] hover:border-[#003B2E] hover:shadow-xs transition text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#003B2E]/10 text-[#003B2E] flex items-center justify-center group-hover:bg-[#003B2E] group-hover:text-white transition">
              <BookOpen className="w-5 h-5" />
            </div>
            <p className="font-bold text-sm text-[#202520] mt-3">Al-Qur’an</p>
            <p className="text-[11px] text-[#68766F] mt-0.5">114 Surat & Tafsir</p>
          </button>

          <button
            onClick={() => onNavigate('prayer-times')}
            className="p-4 rounded-2xl bg-white border border-[#E5E9E4] hover:border-[#003B2E] hover:shadow-xs transition text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#003B2E]/10 text-[#003B2E] flex items-center justify-center group-hover:bg-[#003B2E] group-hover:text-white transition">
              <Clock className="w-5 h-5" />
            </div>
            <p className="font-bold text-sm text-[#202520] mt-3">Jadwal Salat</p>
            <p className="text-[11px] text-[#68766F] mt-0.5">5 Waktu & Hitung Mundur</p>
          </button>

          <button
            onClick={() => onNavigate('qibla')}
            className="p-4 rounded-2xl bg-white border border-[#E5E9E4] hover:border-[#003B2E] hover:shadow-xs transition text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#003B2E]/10 text-[#003B2E] flex items-center justify-center group-hover:bg-[#003B2E] group-hover:text-white transition">
              <Compass className="w-5 h-5" />
            </div>
            <p className="font-bold text-sm text-[#202520] mt-3">Arah Kiblat</p>
            <p className="text-[11px] text-[#68766F] mt-0.5">Kompas Ka'bah</p>
          </button>

          <button
            onClick={() => onNavigate('calendar')}
            className="p-4 rounded-2xl bg-white border border-[#E5E9E4] hover:border-[#003B2E] hover:shadow-xs transition text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#003B2E]/10 text-[#003B2E] flex items-center justify-center group-hover:bg-[#003B2E] group-hover:text-white transition">
              <Calendar className="w-5 h-5" />
            </div>
            <p className="font-bold text-sm text-[#202520] mt-3">Kalender Hijriah</p>
            <p className="text-[11px] text-[#68766F] mt-0.5">Hari Besar Islam</p>
          </button>

          <button
            onClick={() => onNavigate('duas')}
            className="p-4 rounded-2xl bg-white border border-[#E5E9E4] hover:border-[#003B2E] hover:shadow-xs transition text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#003B2E]/10 text-[#003B2E] flex items-center justify-center group-hover:bg-[#003B2E] group-hover:text-white transition">
              <Heart className="w-5 h-5" />
            </div>
            <p className="font-bold text-sm text-[#202520] mt-3">Doa Harian</p>
            <p className="text-[11px] text-[#68766F] mt-0.5">Doa ma'tsur sahih</p>
          </button>

          <button
            onClick={() => onNavigate('prayer-guide')}
            className="p-4 rounded-2xl bg-white border border-[#E5E9E4] hover:border-[#003B2E] hover:shadow-xs transition text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#003B2E]/10 text-[#003B2E] flex items-center justify-center group-hover:bg-[#003B2E] group-hover:text-white transition">
              <HelpCircle className="w-5 h-5" />
            </div>
            <p className="font-bold text-sm text-[#202520] mt-3">Panduan Salat</p>
            <p className="text-[11px] text-[#68766F] mt-0.5">Rukun & Bacaan</p>
          </button>

          <button
            onClick={() => onNavigate('bookmarks')}
            className="p-4 rounded-2xl bg-white border border-[#E5E9E4] hover:border-[#003B2E] hover:shadow-xs transition text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#003B2E]/10 text-[#003B2E] flex items-center justify-center group-hover:bg-[#003B2E] group-hover:text-white transition">
              <Bookmark className="w-5 h-5" />
            </div>
            <p className="font-bold text-sm text-[#202520] mt-3">Bookmark</p>
            <p className="text-[11px] text-[#68766F] mt-0.5">Ayat & Catatan</p>
          </button>

          <button
            onClick={() => onNavigate('settings')}
            className="p-4 rounded-2xl bg-white border border-[#E5E9E4] hover:border-[#003B2E] hover:shadow-xs transition text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#003B2E]/10 text-[#003B2E] flex items-center justify-center group-hover:bg-[#003B2E] group-hover:text-white transition">
              <Sparkles className="w-5 h-5" />
            </div>
            <p className="font-bold text-sm text-[#202520] mt-3">Pengaturan</p>
            <p className="text-[11px] text-[#68766F] mt-0.5">Font & Qari</p>
          </button>
        </div>
      </section>

      {/* 6. Surat Pilihan & Sunnah */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#003B2E] uppercase tracking-wider">
            Surat Rutin & Pilihan
          </h2>
          <button
            onClick={() => onNavigate('surahs')}
            className="text-xs text-[#003B2E] font-semibold hover:underline"
          >
            Lihat Semua 114 Surat
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {featuredSurahs.map((f) => (
            <button
              key={f.nomor}
              onClick={() => onNavigateToSurah(f.nomor)}
              className="p-4 rounded-2xl bg-white border border-[#E5E9E4] hover:border-[#003B2E] transition flex items-center justify-between text-left group shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-[#FFFEFA] border border-[#E5E9E4] text-xs font-bold text-[#003B2E] flex items-center justify-center group-hover:bg-[#003B2E] group-hover:text-white transition">
                  {f.nomor}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-[#202520] group-hover:text-[#003B2E]">
                    {f.label}
                  </h4>
                  <span className="text-[11px] text-[#68766F]">
                    {f.tag}
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#68766F] group-hover:text-[#003B2E] group-hover:translate-x-0.5 transition" />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
