import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Info,
  Sparkles,
  Star,
  CheckCircle,
} from 'lucide-react';
import {
  hijriCalendarService,
  HIJRI_MONTHS,
} from '../services/hijriCalendarService';
import type { HijriDayDetail } from '../types/quran';

export const HijriCalendarView: React.FC = () => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-indexed
  const [selectedDay, setSelectedDay] = useState<HijriDayDetail | null>(null);

  // Month Calendar Grid
  const daysGrid = useMemo(() => {
    return hijriCalendarService.getMonthCalendarGrid(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  // Holidays in this month
  const holidaysInMonth = useMemo(() => {
    return hijriCalendarService.getHolidaysInMonth(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  // Navigation
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDay(null);
  };

  const handleResetToday = () => {
    const t = new Date();
    setCurrentYear(t.getFullYear());
    setCurrentMonth(t.getMonth());
    setSelectedDay(null);
  };

  const monthNameGregorian = new Date(currentYear, currentMonth, 1).toLocaleDateString(
    'id-ID',
    { month: 'long', year: 'numeric' }
  );

  // Approximate Hijri months spanned by this Gregorian month
  const midDate = new Date(currentYear, currentMonth, 15);
  const midHijri = hijriCalendarService.getHijriDetail(midDate);

  const dayHeaders = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  return (
    <div className="space-y-6 pb-24 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#003B2E]">
            Kalender Hijriah
          </h1>
          <p className="text-xs text-[#68766F] mt-1">
            Penanggalan kalender Islam berdampingan dengan Masehi dan daftar hari besar Islam.
          </p>
        </div>

        <button
          onClick={handleResetToday}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl border border-[#E5E9E4] bg-white text-xs font-semibold text-[#003B2E] hover:bg-[#F5F0D5]/50 transition shadow-2xs"
        >
          Kembali ke Hari Ini
        </button>
      </div>

      {/* Month Navigation Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#E5E9E4] shadow-xs space-y-4">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E9E4]">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-xl text-[#68766F] hover:bg-[#F5F0D5]/50 hover:text-[#003B2E] transition"
            aria-label="Bulan sebelumnya"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="text-center">
            <h2 className="text-base sm:text-lg font-bold text-[#003B2E]">
              {monthNameGregorian}
            </h2>
            <p className="text-xs text-[#68766F] flex items-center justify-center gap-1.5 mt-0.5">
              <span>{midHijri.monthName} {midHijri.year} H</span>
              <span className="font-quran text-sm text-[#E0B030]">({midHijri.monthNameAr})</span>
            </p>
          </div>

          <button
            onClick={handleNextMonth}
            className="p-2 rounded-xl text-[#68766F] hover:bg-[#F5F0D5]/50 hover:text-[#003B2E] transition"
            aria-label="Bulan berikutnya"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Day of Week Headers */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-[#68766F]">
          {dayHeaders.map((dh, idx) => (
            <div
              key={dh}
              className={`py-2 ${idx === 0 ? 'text-[#B42318]' : idx === 5 ? 'text-[#237A57]' : ''}`}
            >
              {dh}
            </div>
          ))}
        </div>

        {/* Calendar Days Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {daysGrid.map((item, idx) => {
            const isSelected = selectedDay?.gregorianDate === item.gregorianDate;

            return (
              <button
                key={`${item.gregorianDate}-${idx}`}
                onClick={() => setSelectedDay(item)}
                className={`p-1.5 sm:p-2.5 rounded-xl border text-left flex flex-col justify-between min-h-[64px] sm:min-h-[76px] transition-all relative ${
                  item.isToday
                    ? 'border-[#003B2E] bg-[#003B2E]/5 ring-2 ring-[#003B2E]/20'
                    : isSelected
                    ? 'border-[#E0B030] bg-[#F5F0D5]/40 shadow-xs'
                    : item.isCurrentMonth
                    ? 'border-[#E5E9E4] bg-white hover:border-[#003B2E]/40'
                    : 'border-[#E5E9E4]/40 bg-[#FFFEFA]/60 text-opacity-40'
                }`}
              >
                {/* Top: Gregorian Day */}
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-xs sm:text-sm font-bold ${
                      item.isToday
                        ? 'text-[#003B2E]'
                        : item.isCurrentMonth
                        ? 'text-[#202520]'
                        : 'text-[#68766F]/50'
                    }`}
                  >
                    {item.gregorianDay}
                  </span>

                  {item.holiday && (
                    <span
                      className="w-2 h-2 rounded-full bg-[#E0B030]"
                      title={item.holiday}
                    />
                  )}
                </div>

                {/* Bottom: Hijri Day Number */}
                <div className="text-right w-full">
                  <span
                    className={`text-[11px] font-semibold font-mono ${
                      item.holiday
                        ? 'text-[#E0B030] font-bold'
                        : item.isCurrentMonth
                        ? 'text-[#68766F]'
                        : 'text-[#68766F]/40'
                    }`}
                  >
                    {item.day} {item.monthName.substring(0, 3)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Details Card */}
      {selectedDay && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#003B2E] text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
          <div>
            <span className="text-[11px] text-[#E0B030] font-semibold uppercase tracking-wider block">
              Detail Tanggal Dipilih
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">
              {new Date(selectedDay.gregorianDate).toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </h3>
            <p className="text-sm text-[#F5F0D5] mt-0.5">
              Bertepatan dengan <strong>{selectedDay.day} {selectedDay.monthName} {selectedDay.year} H</strong>
            </p>
            {selectedDay.holiday && (
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E0B030] text-[#003B2E] text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{selectedDay.holiday}</span>
              </div>
            )}
          </div>

          <button
            onClick={() => setSelectedDay(null)}
            className="self-end sm:self-center px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition"
          >
            Tutup
          </button>
        </div>
      )}

      {/* List of Islamic Holidays in this Month */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold text-[#003B2E] uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#E0B030]" />
          Hari Besar Islam Bulan Ini ({holidaysInMonth.length})
        </h2>

        {holidaysInMonth.length === 0 ? (
          <div className="p-5 rounded-2xl bg-white border border-[#E5E9E4] text-center text-xs text-[#68766F]">
            Tidak ada hari besar keagamaan utama pada bulan Masehi ini.
          </div>
        ) : (
          <div className="space-y-2.5">
            {holidaysInMonth.map(({ date, holiday }, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white border border-[#E5E9E4] hover:border-[#003B2E]/30 transition flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#E0B030]" />
                    <h3 className="text-sm font-bold text-[#003B2E]">
                      {holiday.name}
                    </h3>
                  </div>
                  <p className="text-xs text-[#202520] pl-4">
                    {holiday.description}
                  </p>
                </div>

                <div className="text-right flex-shrink-0 text-xs">
                  <span className="font-bold text-[#202520] block">
                    {date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </span>
                  <span className="text-[11px] text-[#68766F]">
                    {holiday.hijriDay} {HIJRI_MONTHS[holiday.hijriMonth - 1]?.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Fiqh & Government Ruling Note */}
      <div className="p-4 rounded-2xl bg-[#FFFEFA] border border-[#E5E9E4] text-xs text-[#68766F] space-y-2">
        <div className="flex items-center gap-2 text-[#003B2E] font-semibold">
          <Info className="w-4 h-4 text-[#E0B030]" />
          <span>Metode Kalender & Penetapan Resmi</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          Kalender ini disusun berdasarkan hisab aritmatika astronomis Umm al-Qura.
          Untuk penetapan resmi 1 Ramadan, 1 Syawal (Idul Fitri), dan 10 Dzulhijjah (Idul Adha) di Indonesia,
          tetap mengacu pada hasil <strong>Sidang Isbat Kementerian Agama Republik Indonesia</strong> dengan metode <em>Rukyatul Hilal</em> (pengamatan hilal secara langsung).
        </p>
      </div>
    </div>
  );
};
