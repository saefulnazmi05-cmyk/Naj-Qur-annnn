import type { HijriDayDetail } from '../types/quran';

export interface IslamicHoliday {
  hijriMonth: number; // 1-12
  hijriDay: number;
  name: string;
  description: string;
}

export const ISLAMIC_HOLIDAYS: IslamicHoliday[] = [
  { hijriMonth: 1, hijriDay: 1, name: 'Tahun Baru Islam (1 Muharram)', description: 'Awal pergantian tahun baru dalam kalender Hijriah.' },
  { hijriMonth: 1, hijriDay: 9, name: 'Puasa Tasu’a (9 Muharram)', description: 'Puasa sunnah menyertai puasa hari Asyura.' },
  { hijriMonth: 1, hijriDay: 10, name: 'Hari Asyura (10 Muharram)', description: 'Hari mulia dan sunnah berpuasa memperingati keselamatan Nabi Musa AS.' },
  { hijriMonth: 3, hijriDay: 12, name: 'Maulid Nabi Muhammad SAW (12 Rabi’ul Awwal)', description: 'Peringatan hari kelahiran junjungan kita Rasulullah SAW.' },
  { hijriMonth: 7, hijriDay: 27, name: 'Isra’ Mi’raj (27 Rajab)', description: 'Peringatan mukjizat perjalanan malam Rasulullah SAW dan perintah salat lima waktu.' },
  { hijriMonth: 8, hijriDay: 15, name: 'Malam Nisfu Sya’ban (15 Sya’ban)', description: 'Malam pertengahan bulan Sya’ban yang penuh berkah dan ampunan.' },
  { hijriMonth: 9, hijriDay: 1, name: 'Awal Puasa Ramadan (1 Ramadan)', description: 'Hari pertama ibadah puasa wajib bulan suci Ramadan.' },
  { hijriMonth: 9, hijriDay: 17, name: 'Nuzulul Qur’an (17 Ramadan)', description: 'Peringatan awal mula diturunkannya ayat suci Al-Qur’an kepada Nabi Muhammad SAW.' },
  { hijriMonth: 10, hijriDay: 1, name: 'Hari Raya Idul Fitri 1 Syawal', description: 'Hari raya kemenangan setelah menunaikan sebulan penuh ibadah puasa Ramadan.' },
  { hijriMonth: 10, hijriDay: 2, name: 'Hari Raya Idul Fitri (Hari ke-2)', description: 'Hari kedua Idul Fitri bersilaturahmi dan saling memaafkan.' },
  { hijriMonth: 12, hijriDay: 9, name: 'Puasa Hari Arafah (9 Dzulhijjah)', description: 'Hari wukuf jamaah haji di Padang Arafah; disunnahkan puasa pelebur dosa 2 tahun.' },
  { hijriMonth: 12, hijriDay: 10, name: 'Hari Raya Idul Adha (10 Dzulhijjah)', description: 'Hari raya kurban memperingati keteladanan Nabi Ibrahim AS dan Nabi Ismail AS.' },
  { hijriMonth: 12, hijriDay: 11, name: 'Hari Tasyrik ke-1 (11 Dzulhijjah)', description: 'Hari tasyrik penyembelihan hewan kurban dan berzikir; diharamkan berpuasa.' },
  { hijriMonth: 12, hijriDay: 12, name: 'Hari Tasyrik ke-2 (12 Dzulhijjah)', description: 'Hari kedua tasyrik di Mina.' },
  { hijriMonth: 12, hijriDay: 13, name: 'Hari Tasyrik ke-3 (13 Dzulhijjah)', description: 'Hari terakhir tasyrik penyembelihan kurban.' },
];

export const HIJRI_MONTHS = [
  { id: 1, name: 'Muharram', nameAr: 'مُحَرَّم' },
  { id: 2, name: 'Safar', nameAr: 'صَفَر' },
  { id: 3, name: 'Rabi’ul Awwal', nameAr: 'رَبِيْعُ الْأَوَّل' },
  { id: 4, name: 'Rabi’ul Akhir', nameAr: 'رَبِيْعُ الْآخِر' },
  { id: 5, name: 'Jumadil Ula', nameAr: 'جُمَادَى الْأُولَى' },
  { id: 6, name: 'Jumadil Akhir', nameAr: 'جُمَادَى الْآخِرَة' },
  { id: 7, name: 'Rajab', nameAr: 'رَجَب' },
  { id: 8, name: 'Sya’ban', nameAr: 'شَعْبَان' },
  { id: 9, name: 'Ramadan', nameAr: 'رَمَضَان' },
  { id: 10, name: 'Syawal', nameAr: 'شَوَّال' },
  { id: 11, name: 'Dzulqa’dah', nameAr: 'ذُو الْقَعْدَة' },
  { id: 12, name: 'Dzulhijjah', nameAr: 'ذُو الْحِجَّة' },
];

/**
 * Konversi tanggal Masehi ke Hijriah menggunakan algoritma aritmatika astronomis Umm al-Qura / Tabular
 */
export function gregorianToHijri(date: Date): { day: number; month: number; year: number } {
  const d = date.getDate();
  const m = date.getMonth(); // 0-indexed
  const y = date.getFullYear();

  let jd =
    Math.floor((1461 * (y + 4800 + Math.floor((m - 13) / 12))) / 4) +
    Math.floor((367 * (m - 1 - 12 * Math.floor((m - 13) / 12))) / 12) -
    Math.floor((3 * Math.floor((y + 4900 + Math.floor((m - 13) / 12)) / 100)) / 4) +
    d -
    32075;

  let l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  l = l - 10631 * n + 354;
  const j =
    Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719) +
    Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
  l =
    l -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;

  const month = Math.floor((24 * l) / 709);
  const day = l - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;

  return { day, month, year };
}

export const hijriCalendarService = {
  /**
   * Mengambil detail Hijriah lengkap dari objek Date
   */
  getHijriDetail(date: Date): {
    day: number;
    month: number;
    year: number;
    monthName: string;
    monthNameAr: string;
    displayString: string;
    holiday: IslamicHoliday | null;
  } {
    const { day, month, year } = gregorianToHijri(date);
    const mInfo = HIJRI_MONTHS[month - 1] || HIJRI_MONTHS[0];

    const holiday =
      ISLAMIC_HOLIDAYS.find((h) => h.hijriMonth === month && h.hijriDay === day) || null;

    return {
      day,
      month,
      year,
      monthName: mInfo.name,
      monthNameAr: mInfo.nameAr,
      displayString: `${day} ${mInfo.name} ${year} H`,
      holiday,
    };
  },

  /**
   * Menghasilkan grid kalender bulanan (Masehi yang memuat tanggal Hijriah di dalamnya)
   */
  getMonthCalendarGrid(year: number, month: number): HijriDayDetail[] {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const firstDayOfMonth = new Date(year, month, 1);
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Minggu (Ahad)
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

    const result: HijriDayDetail[] = [];

    // Previous month padding days
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDay = prevMonthDays - i;
      const d = new Date(year, month - 1, prevDay);
      const hijri = this.getHijriDetail(d);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(prevDay).padStart(2, '0')}`;

      result.push({
        day: hijri.day,
        month: hijri.month,
        year: hijri.year,
        monthName: hijri.monthName,
        monthNameAr: hijri.monthNameAr,
        dayName: d.toLocaleDateString('id-ID', { weekday: 'short' }),
        gregorianDate: dateStr,
        gregorianDay: prevDay,
        gregorianMonthName: d.toLocaleDateString('id-ID', { month: 'short' }),
        isToday: dateStr === todayStr,
        isCurrentMonth: false,
        holiday: hijri.holiday ? hijri.holiday.name : null,
      });
    }

    // Current month days
    for (let day = 1; day <= totalDaysInMonth; day++) {
      const d = new Date(year, month, day);
      const hijri = this.getHijriDetail(d);
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      result.push({
        day: hijri.day,
        month: hijri.month,
        year: hijri.year,
        monthName: hijri.monthName,
        monthNameAr: hijri.monthNameAr,
        dayName: d.toLocaleDateString('id-ID', { weekday: 'short' }),
        gregorianDate: dateStr,
        gregorianDay: day,
        gregorianMonthName: d.toLocaleDateString('id-ID', { month: 'short' }),
        isToday: dateStr === todayStr,
        isCurrentMonth: true,
        holiday: hijri.holiday ? hijri.holiday.name : null,
      });
    }

    // Next month padding days to complete 35 or 42 cells
    const remainingCells = (7 - (result.length % 7)) % 7;
    for (let day = 1; day <= remainingCells; day++) {
      const d = new Date(year, month + 1, day);
      const hijri = this.getHijriDetail(d);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      result.push({
        day: hijri.day,
        month: hijri.month,
        year: hijri.year,
        monthName: hijri.monthName,
        monthNameAr: hijri.monthNameAr,
        dayName: d.toLocaleDateString('id-ID', { weekday: 'short' }),
        gregorianDate: dateStr,
        gregorianDay: day,
        gregorianMonthName: d.toLocaleDateString('id-ID', { month: 'short' }),
        isToday: dateStr === todayStr,
        isCurrentMonth: false,
        holiday: hijri.holiday ? hijri.holiday.name : null,
      });
    }

    return result;
  },

  /**
   * Mengambil daftar hari besar Islam yang jatuh pada bulan tertentu
   */
  getHolidaysInMonth(year: number, month: number): { date: Date; holiday: IslamicHoliday }[] {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const list: { date: Date; holiday: IslamicHoliday }[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day);
      const { holiday } = this.getHijriDetail(d);
      if (holiday) {
        list.push({ date: d, holiday });
      }
    }

    return list;
  },
};
