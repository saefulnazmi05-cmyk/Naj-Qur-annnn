import React, { useState, useEffect, useMemo } from 'react';
import {
  Clock,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Navigation,
  Table,
  X,
  Info,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import {
  prayerTimesService,
  CALCULATION_METHODS,
} from '../services/prayerTimesService';
import {
  CITIES_LIST,
  DEFAULT_CITY,
  getCurrentCoordinates,
} from '../services/qiblaService';
import { hijriCalendarService } from '../services/hijriCalendarService';
import { storageService } from '../services/storageService';
import type { CityLocation, PrayerTimes, NextPrayerInfo } from '../types/quran';

export const PrayerTimesView: React.FC = () => {
  // Active Location
  const [selectedCity, setSelectedCity] = useState<CityLocation>(() => {
    const savedId = storageService.getSelectedCityId();
    return CITIES_LIST.find((c) => c.id === savedId) || DEFAULT_CITY;
  });
  const [isUsingGps, setIsUsingGps] = useState(false);
  const [isLoadingGps, setIsLoadingGps] = useState(false);

  // Active Date (defaults to today)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Calculation Method
  const [calculationMethod, setCalculationMethod] = useState<'kemenag' | 'mwl' | 'egypt'>('kemenag');

  // Monthly Table Modal State
  const [showMonthlyModal, setShowMonthlyModal] = useState(false);

  // Live Timer for Countdown
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Compute Prayer Times for Selected Date
  const prayerTimes: PrayerTimes = useMemo(() => {
    const pt = prayerTimesService.calculatePrayerTimes(
      selectedDate,
      selectedCity,
      calculationMethod
    );
    const hijri = hijriCalendarService.getHijriDetail(selectedDate);
    pt.hijriDateDisplay = hijri.displayString;
    return pt;
  }, [selectedDate, selectedCity, calculationMethod]);

  // Compute Next Prayer and Countdown using current time
  const nextPrayer: NextPrayerInfo = useMemo(() => {
    // Only calculate live next prayer countdown if selected date is today
    const today = new Date();
    const isToday =
      selectedDate.getFullYear() === today.getFullYear() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getDate() === today.getDate();

    if (isToday) {
      return prayerTimesService.getNextPrayer(prayerTimes, currentTime);
    } else {
      return {
        name: 'Jadwal Tanggal Ini',
        time: prayerTimes.subuh,
        countdown: '00:00:00',
        remainingSeconds: 0,
        isPassed: false,
      };
    }
  }, [prayerTimes, currentTime, selectedDate]);

  // Handle Date Navigation
  const handlePrevDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() - 1);
    setSelectedDate(next);
  };

  const handleNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    setSelectedDate(next);
  };

  const handleResetToday = () => {
    setSelectedDate(new Date());
  };

  // Handle GPS detection
  const handleDetectGps = async () => {
    setIsLoadingGps(true);
    try {
      const coords = await getCurrentCoordinates();
      setSelectedCity({
        id: 'gps-custom',
        name: 'Lokasi Anda (GPS)',
        province: 'Koordinat GPS',
        country: 'Indonesia',
        latitude: coords.latitude,
        longitude: coords.longitude,
        timezoneOffset: Math.round(-new Date().getTimezoneOffset() / 60),
      });
      setIsUsingGps(true);
    } catch {
      // Fallback
    } finally {
      setIsLoadingGps(false);
    }
  };

  const handleCityChange = (cityId: string) => {
    const city = CITIES_LIST.find((c) => c.id === cityId);
    if (city) {
      setSelectedCity(city);
      setIsUsingGps(false);
      storageService.saveSelectedCityId(city.id);
    }
  };

  // Check if a prayer slot has passed today
  const isTimePassed = (timeStr: string) => {
    const today = new Date();
    const isToday =
      selectedDate.getFullYear() === today.getFullYear() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getDate() === today.getDate();

    if (!isToday) {
      return selectedDate < today;
    }

    const [h, m] = timeStr.split(':').map(Number);
    const slotSec = h * 3600 + m * 60;
    const nowSec = currentTime.getHours() * 3600 + currentTime.getMinutes() * 60;
    return nowSec >= slotSec;
  };

  const prayerCards = [
    { id: 'imsak', name: 'Imsak', time: prayerTimes.imsak, note: 'Batas akhir sahur' },
    { id: 'subuh', name: 'Subuh', time: prayerTimes.subuh, note: 'Salat fardhu 2 rakaat' },
    { id: 'terbit', name: 'Terbit', time: prayerTimes.terbit, note: 'Matahari terbit (syuruq)' },
    { id: 'zuhur', name: 'Zuhur', time: prayerTimes.zuhur, note: 'Salat fardhu 4 rakaat' },
    { id: 'asar', name: 'Asar', time: prayerTimes.asar, note: 'Salat fardhu 4 rakaat' },
    { id: 'magrib', name: 'Magrib', time: prayerTimes.magrib, note: 'Salat fardhu 3 rakaat / berbuka' },
    { id: 'isya', name: 'Isya', time: prayerTimes.isya, note: 'Salat fardhu 4 rakaat' },
  ];

  // Monthly table schedule
  const monthlyList = useMemo(() => {
    if (!showMonthlyModal) return [];
    return prayerTimesService.getMonthlySchedule(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedCity,
      calculationMethod
    );
  }, [showMonthlyModal, selectedDate, selectedCity, calculationMethod]);

  const isSelectedDateToday =
    selectedDate.toDateString() === new Date().toDateString();

  return (
    <div className="space-y-6 pb-24 animate-fadeIn max-w-3xl mx-auto">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#003B2E]">
            Jadwal Salat Lima Waktu
          </h1>
          <p className="text-xs text-[#68766F] mt-1">
            Hisab waktu salat akurat berdasarkan standar resmi Kementerian Agama RI.
          </p>
        </div>

        <button
          onClick={() => setShowMonthlyModal(true)}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E5E9E4] hover:bg-[#F5F0D5]/50 text-xs font-semibold text-[#003B2E] transition shadow-2xs"
        >
          <Table className="w-3.5 h-3.5 text-[#E0B030]" />
          <span>Lihat Jadwal Bulanan</span>
        </button>
      </div>

      {/* City & Method Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#E5E9E4] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1">
          <MapPin className="w-4 h-4 text-[#E0B030] flex-shrink-0" />
          <div className="flex-1">
            <label htmlFor="prayer-city" className="sr-only">
              Pilih Kota
            </label>
            <select
              id="prayer-city"
              value={isUsingGps ? 'gps-custom' : selectedCity.id}
              onChange={(e) => handleCityChange(e.target.value)}
              className="w-full bg-transparent font-bold text-[#003B2E] outline-none cursor-pointer text-xs"
            >
              {isUsingGps && <option value="gps-custom">📍 Lokasi GPS Anda</option>}
              {CITIES_LIST.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.province})
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleDetectGps}
          disabled={isLoadingGps}
          className="inline-flex items-center gap-1.5 text-xs text-[#68766F] hover:text-[#003B2E] underline self-end sm:self-auto"
        >
          <Navigation className={`w-3.5 h-3.5 ${isLoadingGps ? 'animate-spin' : ''}`} />
          <span>{isLoadingGps ? 'Mendeteksi...' : 'Deteksi GPS'}</span>
        </button>
      </div>

      {/* Featured Next Prayer Banner Card (When Today) */}
      {isSelectedDateToday && (
        <section className="relative overflow-hidden rounded-3xl bg-radial from-[#004D3C] to-[#003B2E] text-white p-6 shadow-md border border-[#E0B030]/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-[#E0B030] font-semibold">
                Salat Berikutnya
              </span>
              <div className="flex items-baseline gap-3">
                <h2 className="text-3xl font-extrabold text-white">
                  {nextPrayer.name}
                </h2>
                <span className="text-2xl font-bold text-[#F5F0D5] tabular-nums">
                  {nextPrayer.time}
                </span>
              </div>
              <p className="text-xs text-[#F5F0D5]/80">
                {prayerTimes.cityName} · {prayerTimes.hijriDateDisplay}
              </p>
            </div>

            {/* Countdown Badge */}
            <div className="p-3.5 rounded-2xl bg-black/20 border border-white/10 backdrop-blur-xs flex items-center gap-3 self-start sm:self-auto">
              <Clock className="w-5 h-5 text-[#E0B030] animate-pulse" />
              <div>
                <span className="text-[10px] text-[#F5F0D5]/70 block uppercase">
                  Waktu Tersisa
                </span>
                <span className="text-xl font-extrabold text-[#F5F0D5] font-mono tabular-nums">
                  {nextPrayer.countdown}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Date Navigation Strip */}
      <div className="p-3 bg-white rounded-2xl border border-[#E5E9E4] flex items-center justify-between gap-2 shadow-2xs">
        <button
          onClick={handlePrevDay}
          className="p-2 rounded-xl text-[#68766F] hover:bg-[#F5F0D5]/50 hover:text-[#003B2E] transition"
          aria-label="Hari sebelumnya"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="text-center">
          <p className="text-xs font-bold text-[#003B2E]">
            {prayerTimes.dateDisplay}
          </p>
          <p className="text-[11px] text-[#68766F]">
            {prayerTimes.hijriDateDisplay}
          </p>
        </div>

        <div className="flex items-center gap-1">
          {!isSelectedDateToday && (
            <button
              onClick={handleResetToday}
              className="text-[11px] font-bold text-[#003B2E] bg-[#F5F0D5]/60 hover:bg-[#F5F0D5] px-2 py-1 rounded-lg transition"
            >
              Hari Ini
            </button>
          )}
          <button
            onClick={handleNextDay}
            className="p-2 rounded-xl text-[#68766F] hover:bg-[#F5F0D5]/50 hover:text-[#003B2E] transition"
            aria-label="Hari berikutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Prayer Schedule Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {prayerCards.map((card) => {
          const isPassed = isTimePassed(card.time);
          const isCurrentNext =
            isSelectedDateToday && nextPrayer.name.startsWith(card.name);

          return (
            <div
              key={card.id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                isCurrentNext
                  ? 'bg-[#003B2E]/5 border-[#E0B030] shadow-sm ring-1 ring-[#E0B030]'
                  : 'bg-white border-[#E5E9E4] hover:border-[#003B2E]/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                    isCurrentNext
                      ? 'bg-[#003B2E] text-white'
                      : isPassed
                      ? 'bg-[#E5E9E4]/60 text-[#68766F]'
                      : 'bg-[#FFFEFA] border border-[#E5E9E4] text-[#003B2E]'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#202520]">
                    {card.name}
                  </h3>
                  <span className="text-[11px] text-[#68766F]">
                    {card.note}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`text-xl font-bold font-mono tabular-nums ${
                    isCurrentNext
                      ? 'text-[#003B2E]'
                      : isPassed
                      ? 'text-[#68766F]'
                      : 'text-[#202520]'
                  }`}
                >
                  {card.time}
                </span>
                {isSelectedDateToday && (
                  <span className="block text-[10px] mt-0.5">
                    {isCurrentNext ? (
                      <span className="text-[#237A57] font-bold">Mendatang</span>
                    ) : isPassed ? (
                      <span className="text-[#68766F]">Telah lewat</span>
                    ) : (
                      <span className="text-[#68766F]">Akan datang</span>
                    )}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Calculation Method Footer Note */}
      <div className="p-4 rounded-2xl bg-[#FFFEFA] border border-[#E5E9E4] text-xs text-[#68766F] space-y-2">
        <div className="flex items-center gap-2 text-[#003B2E] font-semibold">
          <Info className="w-4 h-4 text-[#E0B030]" />
          <span>Metode Hisab: {CALCULATION_METHODS[calculationMethod].name}</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          Menggunakan hisab astronomis posisi matahari dengan sudut Subuh 20°, sudut Isya 18°,
          waktu ihtiyat (pengaman) 2 menit, dan Imsak 10 menit sebelum azan Subuh.
        </p>
      </div>

      {/* Monthly Prayer Table Modal */}
      {showMonthlyModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-6 animate-fadeIn"
        >
          <div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-[#E5E9E4] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-[#003B2E] text-white flex items-center justify-between border-b border-[#E0B030]/20">
              <div>
                <h2 className="text-base sm:text-lg font-bold">
                  Jadwal Salat Bulanan — {selectedCity.name}
                </h2>
                <p className="text-xs text-[#F5F0D5]/80">
                  {selectedDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                </p>
              </div>
              <button
                onClick={() => setShowMonthlyModal(false)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Table Body */}
            <div className="flex-1 overflow-auto p-4">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E9E4] text-[#68766F] font-semibold">
                    <th className="py-2.5 px-2">Tanggal</th>
                    <th className="py-2.5 px-2">Imsak</th>
                    <th className="py-2.5 px-2">Subuh</th>
                    <th className="py-2.5 px-2">Terbit</th>
                    <th className="py-2.5 px-2">Zuhur</th>
                    <th className="py-2.5 px-2">Asar</th>
                    <th className="py-2.5 px-2">Magrib</th>
                    <th className="py-2.5 px-2">Isya</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E9E4]">
                  {monthlyList.map((row) => {
                    const isTodayRow =
                      row.date === new Date().toISOString().split('T')[0];

                    return (
                      <tr
                        key={row.date}
                        className={`hover:bg-[#F5F0D5]/30 transition ${
                          isTodayRow ? 'bg-[#003B2E]/5 font-bold text-[#003B2E]' : 'text-[#202520]'
                        }`}
                      >
                        <td className="py-2 px-2 whitespace-nowrap font-medium">
                          {new Date(row.date).getDate()} {new Date(row.date).toLocaleDateString('id-ID', { month: 'short' })}
                        </td>
                        <td className="py-2 px-2 font-mono">{row.imsak}</td>
                        <td className="py-2 px-2 font-mono">{row.subuh}</td>
                        <td className="py-2 px-2 font-mono text-[#68766F]">{row.terbit}</td>
                        <td className="py-2 px-2 font-mono">{row.zuhur}</td>
                        <td className="py-2 px-2 font-mono">{row.asar}</td>
                        <td className="py-2 px-2 font-mono">{row.magrib}</td>
                        <td className="py-2 px-2 font-mono">{row.isya}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-[#FFFEFA] border-t border-[#E5E9E4] flex justify-end">
              <button
                onClick={() => setShowMonthlyModal(false)}
                className="px-4 py-2 rounded-xl bg-[#003B2E] text-white text-xs font-semibold hover:bg-[#002B21]"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
