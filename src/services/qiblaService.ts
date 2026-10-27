import { APP_CONFIG } from '../config/appConfig';
import type { CityLocation, QiblaData } from '../types/quran';

export const CITIES_LIST: CityLocation[] = [
  { id: 'jakarta', name: 'Jakarta', province: 'DKI Jakarta', country: 'Indonesia', latitude: -6.2088, longitude: 106.8456, timezoneOffset: 7 },
  { id: 'surabaya', name: 'Surabaya', province: 'Jawa Timur', country: 'Indonesia', latitude: -7.2575, longitude: 112.7521, timezoneOffset: 7 },
  { id: 'bandung', name: 'Bandung', province: 'Jawa Barat', country: 'Indonesia', latitude: -6.9175, longitude: 107.6191, timezoneOffset: 7 },
  { id: 'medan', name: 'Medan', province: 'Sumatera Utara', country: 'Indonesia', latitude: 3.5952, longitude: 98.6722, timezoneOffset: 7 },
  { id: 'semarang', name: 'Semarang', province: 'Jawa Tengah', country: 'Indonesia', latitude: -6.9667, longitude: 110.4167, timezoneOffset: 7 },
  { id: 'makassar', name: 'Makassar', province: 'Sulawesi Selatan', country: 'Indonesia', latitude: -5.1477, longitude: 119.4327, timezoneOffset: 8 },
  { id: 'palembang', name: 'Palembang', province: 'Sumatera Selatan', country: 'Indonesia', latitude: -2.9761, longitude: 104.7754, timezoneOffset: 7 },
  { id: 'yogyakarta', name: 'Yogyakarta', province: 'D.I. Yogyakarta', country: 'Indonesia', latitude: -7.7956, longitude: 110.3695, timezoneOffset: 7 },
  { id: 'denpasar', name: 'Denpasar', province: 'Bali', country: 'Indonesia', latitude: -8.6705, longitude: 115.2126, timezoneOffset: 8 },
  { id: 'padang', name: 'Padang', province: 'Sumatera Barat', country: 'Indonesia', latitude: -0.9471, longitude: 100.4172, timezoneOffset: 7 },
  { id: 'banda-aceh', name: 'Banda Aceh', province: 'Aceh', country: 'Indonesia', latitude: 5.5483, longitude: 95.3238, timezoneOffset: 7 },
  { id: 'banjarmasin', name: 'Banjarmasin', province: 'Kalimantan Selatan', country: 'Indonesia', latitude: -3.3194, longitude: 114.5908, timezoneOffset: 8 },
  { id: 'samarinda', name: 'Samarinda', province: 'Kalimantan Timur', country: 'Indonesia', latitude: -0.5022, longitude: 117.1536, timezoneOffset: 8 },
  { id: 'pontianak', name: 'Pontianak', province: 'Kalimantan Barat', country: 'Indonesia', latitude: -0.0263, longitude: 109.3425, timezoneOffset: 7 },
  { id: 'manado', name: 'Manado', province: 'Sulawesi Utara', country: 'Indonesia', latitude: 1.4748, longitude: 124.8428, timezoneOffset: 8 },
  { id: 'mataram', name: 'Mataram (Lombok)', province: 'Nusa Tenggara Barat', country: 'Indonesia', latitude: -8.5799, longitude: 116.1047, timezoneOffset: 8 },
  { id: 'kupang', name: 'Kupang', province: 'Nusa Tenggara Timur', country: 'Indonesia', latitude: -10.1772, longitude: 123.607, timezoneOffset: 8 },
  { id: 'ambon', name: 'Ambon', province: 'Maluku', country: 'Indonesia', latitude: -3.6547, longitude: 128.1906, timezoneOffset: 9 },
  { id: 'jayapura', name: 'Jayapura', province: 'Papua', country: 'Indonesia', latitude: -2.5489, longitude: 140.7181, timezoneOffset: 9 },
  { id: 'kuala-lumpur', name: 'Kuala Lumpur', province: 'Wilayah Persekutuan', country: 'Malaysia', latitude: 3.139, longitude: 101.6869, timezoneOffset: 8 },
  { id: 'singapore', name: 'Singapura', province: 'Singapore', country: 'Singapura', latitude: 1.3521, longitude: 103.8198, timezoneOffset: 8 },
];

export const DEFAULT_CITY = CITIES_LIST[0]; // Jakarta

/**
 * Menghitung sudut bearing kiblat menuju Ka'bah menggunakan rumus Great Circle (Lingkaran Besar)
 * phi1, lambda1 = lintang & bujur lokasi pengamat
 * phi2, lambda2 = lintang & bujur Ka'bah (21.422487° LU, 39.826206° BT)
 * Formula: atan2(sin(dL), cos(phi1)*tan(phi2) - sin(phi1)*cos(dL))
 */
export function calculateQiblaBearing(latitude: number, longitude: number): number {
  const phi1 = (latitude * Math.PI) / 180;
  const phi2 = (APP_CONFIG.kaaba.latitude * Math.PI) / 180;
  const deltaLambda = ((APP_CONFIG.kaaba.longitude - longitude) * Math.PI) / 180;

  const y = Math.sin(deltaLambda);
  const x = Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(deltaLambda);

  let bearing = (Math.atan2(y, x) * 180) / Math.PI;
  bearing = (bearing + 360) % 360;

  return Math.round(bearing * 10) / 10;
}

/**
 * Menghitung jarak lurus ke Ka'bah dalam kilometer menggunakan rumus Haversine
 */
export function calculateDistanceToKaaba(latitude: number, longitude: number): number {
  const R = 6371; // Radius bumi dalam km
  const dLat = ((APP_CONFIG.kaaba.latitude - latitude) * Math.PI) / 180;
  const dLon = ((APP_CONFIG.kaaba.longitude - longitude) * Math.PI) / 180;
  const lat1 = (latitude * Math.PI) / 180;
  const lat2 = (APP_CONFIG.kaaba.latitude * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Mengambil koordinat GPS terkini dari perangkat jika diizinkan
 */
export function getCurrentCoordinates(): Promise<{ latitude: number; longitude: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation tidak didukung oleh browser Anda.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      (err) => {
        let msg = 'Izin lokasi tidak diberikan atau GPS tidak aktif.';
        if (err.code === 1) msg = 'Izin akses lokasi ditolak.';
        else if (err.code === 2) msg = 'Posisi lokasi tidak tersedia.';
        else if (err.code === 3) msg = 'Permintaan lokasi melebihi batas waktu (timeout).';
        reject(new Error(msg));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  });
}

export const qiblaService = {
  calculateQibla(latitude: number, longitude: number, cityName = 'Lokasi Kustom'): QiblaData {
    const bearing = calculateQiblaBearing(latitude, longitude);
    const distanceKm = calculateDistanceToKaaba(latitude, longitude);

    return {
      latitude,
      longitude,
      cityName,
      bearing,
      distanceKm,
      deviceHeading: null,
      relativeAngle: null,
      isSensorSupported: typeof window !== 'undefined' && 'DeviceOrientationEvent' in window,
      sensorPermission: 'prompt',
    };
  },

  findClosestCity(lat: number, lon: number): CityLocation {
    let closest = CITIES_LIST[0];
    let minDistance = Infinity;

    for (const city of CITIES_LIST) {
      const d = Math.hypot(city.latitude - lat, city.longitude - lon);
      if (d < minDistance) {
        minDistance = d;
        closest = city;
      }
    }
    return closest;
  },
};
