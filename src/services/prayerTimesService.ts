import type { PrayerTimes, NextPrayerInfo, CityLocation } from '../types/quran';

// Trigonometric helpers in degrees
const dSin = (d: number) => Math.sin((d * Math.PI) / 180);
const dCos = (d: number) => Math.cos((d * Math.PI) / 180);
const dTan = (d: number) => Math.tan((d * Math.PI) / 180);
const dArcSin = (x: number) => (Math.asin(x) * 180) / Math.PI;
const dArcCos = (x: number) => (Math.acos(x) * 180) / Math.PI;
const dArcTan2 = (y: number, x: number) => (Math.atan2(y, x) * 180) / Math.PI;

const fixHour = (a: number) => {
  a = a - 24 * Math.floor(a / 24);
  return a < 0 ? a + 24 : a;
};

const fixAngle = (a: number) => {
  a = a - 360 * Math.floor(a / 360);
  return a < 0 ? a + 360 : a;
};

/**
 * Parameter hisab waktu salat
 * Kemenag RI: Subuh -20°, Isya -18°, Ihtiyat +2 menit, Imsak -10 menit sebelum Subuh
 */
export interface CalculationParams {
  fajrAngle: number; // Subuh (Kemenag: 20°)
  ishaAngle: number; // Isya (Kemenag: 18°)
  imsakMinutes: number; // Imsak (Kemenag: 10 menit sebelum Subuh)
  ihtiyatMinutes: number; // Waktu pengaman ihtiyat (+2 menit)
}

export const CALCULATION_METHODS: Record<string, { name: string; params: CalculationParams }> = {
  kemenag: {
    name: 'Kementerian Agama RI (Kemenag)',
    params: { fajrAngle: 20, ishaAngle: 18, imsakMinutes: 10, ihtiyatMinutes: 2 },
  },
  mwl: {
    name: 'Muslim World League (MWL)',
    params: { fajrAngle: 18, ishaAngle: 17, imsakMinutes: 10, ihtiyatMinutes: 2 },
  },
  egypt: {
    name: 'Egyptian General Authority of Survey',
    params: { fajrAngle: 19.5, ishaAngle: 17.5, imsakMinutes: 10, ihtiyatMinutes: 2 },
  },
};

/**
 * Algoritma hisab astronomis posisi matahari untuk waktu salat (Jean Meeus Astronomical Algorithms)
 */
function calculateSunPosition(jd: number) {
  const d = jd - 2451545.0;
  const g = fixAngle(357.529 + 0.98560028 * d);
  const q = fixAngle(280.459 + 0.98564736 * d);
  const l = fixAngle(q + 1.915 * dSin(g) + 0.02 * dSin(2 * g));

  const e = 23.439 - 0.00000036 * d;
  const dX = dCos(e) * dSin(l);
  const dY = dCos(l);
  let ra = dArcTan2(dX, dY) / 15;
  ra = fixHour(ra);

  const declination = dArcSin(dSin(e) * dSin(l));
  const eqt = q / 15 - ra;

  return { declination, eqt };
}

function getJulianDate(year: number, month: number, day: number): number {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const a = Math.floor(year / 100);
  const b = 2 - a + Math.floor(a / 4);
  return (
    Math.floor(365.25 * (year + 4716)) +
    Math.floor(30.6001 * (month + 1)) +
    day +
    b -
    1524.5
  );
}

function formatHoursToTimeString(decimalHours: number): string {
  if (isNaN(decimalHours)) return '--:--';
  decimalHours = fixHour(decimalHours + 0.5 / 60); // round to nearest minute
  const hours = Math.floor(decimalHours);
  const minutes = Math.floor((decimalHours - hours) * 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export const prayerTimesService = {
  /**
   * Menghitung jadwal salat untuk tanggal dan koordinat tertentu
   */
  calculatePrayerTimes(
    date: Date,
    location: CityLocation,
    methodKey: 'kemenag' | 'mwl' | 'egypt' = 'kemenag'
  ): PrayerTimes {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const jd = getJulianDate(year, month, day);
    const { declination, eqt } = calculateSunPosition(jd);

    const lat = location.latitude;
    const lng = location.longitude;
    const timezone = location.timezoneOffset;

    const method = CALCULATION_METHODS[methodKey] || CALCULATION_METHODS.kemenag;
    const { fajrAngle, ishaAngle, imsakMinutes, ihtiyatMinutes } = method.params;

    // Solar noon (Zuhur)
    const noon = fixHour(12 + timezone - lng / 15 - eqt);

    // Sunrise & Sunset (center of sun 0.833° below horizon)
    const angleSun = 0.833;
    const cosHA_sun =
      (-dSin(angleSun) - dSin(lat) * dSin(declination)) /
      (dCos(lat) * dCos(declination));

    let sunTransitHours = 0;
    if (cosHA_sun >= -1 && cosHA_sun <= 1) {
      sunTransitHours = dArcCos(cosHA_sun) / 15;
    }

    const sunrise = noon - sunTransitHours;
    const sunset = noon + sunTransitHours;

    // Asr (Shafi'i, Maliki, Hanbali standard: shadow = 1)
    const asrShadow = 1;
    const asrAngle = -dArcCot(asrShadow + dTan(Math.abs(lat - declination)));
    const cosHA_asr =
      (-dSin(asrAngle) - dSin(lat) * dSin(declination)) /
      (dCos(lat) * dCos(declination));
    const asrTransitHours = (cosHA_asr >= -1 && cosHA_asr <= 1 ? dArcCos(cosHA_asr) : 0) / 15;
    const asr = noon + asrTransitHours;

    // Fajr (Subuh)
    const cosHA_fajr =
      (-dSin(fajrAngle) - dSin(lat) * dSin(declination)) /
      (dCos(lat) * dCos(declination));
    const fajrTransitHours = (cosHA_fajr >= -1 && cosHA_fajr <= 1 ? dArcCos(cosHA_fajr) : 0) / 15;
    const fajr = noon - fajrTransitHours;

    // Isha (Isya)
    const cosHA_isha =
      (-dSin(ishaAngle) - dSin(lat) * dSin(declination)) /
      (dCos(lat) * dCos(declination));
    const ishaTransitHours = (cosHA_isha >= -1 && cosHA_isha <= 1 ? dArcCos(cosHA_isha) : 0) / 15;
    const isha = noon + ishaTransitHours;

    // Apply ihtiyat (+2 menit) and calculate imsak
    const ihtiyatDec = ihtiyatMinutes / 60;
    const imsakDec = imsakMinutes / 60;

    const subuhFinal = fajr + ihtiyatDec;
    const imsakFinal = subuhFinal - imsakDec;
    const terbitFinal = sunrise;
    const zuhurFinal = noon + ihtiyatDec;
    const asarFinal = asr + ihtiyatDec;
    const magribFinal = sunset + ihtiyatDec;
    const isyaFinal = isha + ihtiyatDec;

    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dateDisplay = date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    return {
      date: dateStr,
      dateDisplay,
      hijriDateDisplay: '', // will be populated via Hijri service
      cityName: location.name,
      imsak: formatHoursToTimeString(imsakFinal),
      subuh: formatHoursToTimeString(subuhFinal),
      terbit: formatHoursToTimeString(terbitFinal),
      zuhur: formatHoursToTimeString(zuhurFinal),
      asar: formatHoursToTimeString(asarFinal),
      magrib: formatHoursToTimeString(magribFinal),
      isya: formatHoursToTimeString(isyaFinal),
    };
  },

  /**
   * Menentukan waktu salat berikutnya beserta hitung mundur (countdown)
   */
  getNextPrayer(prayerTimes: PrayerTimes, currentTime = new Date()): NextPrayerInfo {
    const timeSlots = [
      { name: 'Subuh', time: prayerTimes.subuh },
      { name: 'Terbit', time: prayerTimes.terbit },
      { name: 'Zuhur', time: prayerTimes.zuhur },
      { name: 'Asar', time: prayerTimes.asar },
      { name: 'Magrib', time: prayerTimes.magrib },
      { name: 'Isya', time: prayerTimes.isya },
    ];

    const currentSeconds =
      currentTime.getHours() * 3600 +
      currentTime.getMinutes() * 60 +
      currentTime.getSeconds();

    for (const slot of timeSlots) {
      const [h, m] = slot.time.split(':').map(Number);
      const slotSeconds = h * 3600 + m * 60;

      if (slotSeconds > currentSeconds) {
        const diff = slotSeconds - currentSeconds;
        return {
          name: slot.name,
          time: slot.time,
          countdown: formatSecondsToCountdown(diff),
          remainingSeconds: diff,
          isPassed: false,
        };
      }
    }

    // If past Isha, next is tomorrow's Subuh
    const [subuhH, subuhM] = prayerTimes.subuh.split(':').map(Number);
    const tomorrowSubuhSeconds = 24 * 3600 + subuhH * 3600 + subuhM * 60;
    const diff = tomorrowSubuhSeconds - currentSeconds;

    return {
      name: 'Subuh (Besok)',
      time: prayerTimes.subuh,
      countdown: formatSecondsToCountdown(diff),
      remainingSeconds: diff,
      isPassed: false,
    };
  },

  /**
   * Menghasilkan jadwal bulanan untuk seluruh hari dalam bulan yang dipilih
   */
  getMonthlySchedule(
    year: number,
    month: number, // 0-indexed (0 = Jan, 11 = Dec)
    location: CityLocation,
    methodKey: 'kemenag' | 'mwl' | 'egypt' = 'kemenag'
  ): PrayerTimes[] {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const result: PrayerTimes[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day);
      result.push(this.calculatePrayerTimes(d, location, methodKey));
    }

    return result;
  },
};

function dArcCot(x: number): number {
  return (Math.atan(1 / x) * 180) / Math.PI;
}

function formatSecondsToCountdown(totalSec: number): string {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
