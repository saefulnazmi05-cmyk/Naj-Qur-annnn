export interface SurahSummary {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audioFull: Record<string, string>;
}

export interface Ayat {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: Record<string, string>;
}

export interface SurahAdjacent {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
}

export interface SurahDetail extends SurahSummary {
  ayat: Ayat[];
  suratSebelumnya: SurahAdjacent | false;
  suratSelanjutnya: SurahAdjacent | false;
}

export interface TafsirAyat {
  ayat: number;
  teks: string;
}

export interface SurahTafsir {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  tafsir: TafsirAyat[];
  suratSebelumnya?: SurahAdjacent | false;
  suratSelanjutnya?: SurahAdjacent | false;
}

export interface Bookmark {
  id: string; // e.g. "1:1"
  surahNomor: number;
  surahNamaLatin: string;
  surahNamaArab: string;
  ayatNomor: number;
  teksArab: string;
  teksIndonesia: string;
  createdAt: string;
}

export interface PersonalNote {
  id: string; // e.g. "1:1"
  surahNomor: number;
  surahNamaLatin: string;
  ayatNomor: number;
  teksArab: string;
  note: string;
  createdAt: string;
  updatedAt: string;
}

export interface LastReadPosition {
  surahNomor: number;
  surahNamaLatin: string;
  surahNamaArab: string;
  ayatNomor: number;
  updatedAt: string;
}

export interface ReadingHistoryItem {
  id: string;
  surahNomor: number;
  surahNamaLatin: string;
  surahNamaArab: string;
  ayatNomor: number;
  timestamp: string;
}

export interface TilawahProgress {
  dailyTargetAyat: number;
  todayReadAyat: number;
  currentStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  totalAyatRead: number;
  dailyHistory: Record<string, number>; // "2026-10-26": 15
}

export interface UserSettings {
  arabicFontSize: number;
  showTranslation: boolean;
  showTransliteration: boolean;
  autoScrollSpeed: number;
  reciterId: string;
  dailyTargetAyat: number;
  selectedCityId?: string;
  calculationMethod?: string;
}

export interface SearchResultItem {
  surahNomor: number;
  surahNamaLatin: string;
  ayatNomor: number;
  teksArab: string;
  teksIndonesia: string;
  matchType: 'surah_name' | 'translation' | 'ayat_number';
  matchedSnippet?: string;
}

// --- Islamic Features Types ---

export interface CityLocation {
  id: string;
  name: string;
  province: string;
  country: string;
  latitude: number;
  longitude: number;
  timezoneOffset: number; // UTC offset in hours e.g. 7 for WIB, 8 for WITA, 9 for WIT
}

export interface QiblaData {
  latitude: number;
  longitude: number;
  cityName: string;
  bearing: number; // 0-360 degrees clockwise from North
  distanceKm: number;
  deviceHeading: number | null;
  relativeAngle: number | null; // bearing - deviceHeading
  isSensorSupported: boolean;
  sensorPermission: 'prompt' | 'granted' | 'denied' | 'unavailable';
}

export interface PrayerTimes {
  date: string; // YYYY-MM-DD
  dateDisplay: string; // e.g. "Senin, 27 Oktober 2026"
  hijriDateDisplay: string; // e.g. "16 Jumadil Ula 1448 H"
  cityName: string;
  imsak: string;
  subuh: string;
  terbit: string;
  zuhur: string;
  asar: string;
  magrib: string;
  isya: string;
}

export interface NextPrayerInfo {
  name: string;
  time: string;
  countdown: string; // HH:MM:SS
  remainingSeconds: number;
  isPassed: boolean;
}

export interface HijriDayDetail {
  day: number;
  month: number;
  year: number;
  monthName: string;
  monthNameAr: string;
  dayName: string;
  gregorianDate: string; // YYYY-MM-DD
  gregorianDay: number;
  gregorianMonthName: string;
  isToday: boolean;
  isCurrentMonth: boolean;
  holiday: string | null;
}

export interface DuaItem {
  id: string;
  title: string;
  category: string;
  arabic: string;
  latin: string;
  translation: string;
  source: string;
  notes: string;
  isFavorite?: boolean;
}

export interface PrayerStep {
  id: string;
  stepNumber: number;
  title: string;
  category: 'persiapan' | 'wudu' | 'gerakan' | 'zikir';
  arabic: string;
  latin: string;
  translation: string;
  explanation: string;
  fiqhNote?: string;
}
