import React, { useState, useEffect, useCallback } from 'react';
import {
  Compass,
  MapPin,
  Navigation,
  Info,
  RotateCcw,
  Check,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import {
  CITIES_LIST,
  DEFAULT_CITY,
  calculateQiblaBearing,
  calculateDistanceToKaaba,
  getCurrentCoordinates,
} from '../services/qiblaService';
import { storageService } from '../services/storageService';
import type { CityLocation } from '../types/quran';

export const QiblaView: React.FC = () => {
  // Selected City / GPS coordinates
  const [selectedCity, setSelectedCity] = useState<CityLocation>(() => {
    const savedId = storageService.getSelectedCityId();
    return CITIES_LIST.find((c) => c.id === savedId) || DEFAULT_CITY;
  });

  const [isUsingGps, setIsUsingGps] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [isLoadingGps, setIsLoadingGps] = useState(false);

  // Sensor Orientation
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [sensorStatus, setSensorStatus] = useState<
    'unsupported' | 'need-permission' | 'active' | 'denied' | 'idle'
  >('idle');
  const [showCalibrationHelp, setShowCalibrationHelp] = useState(false);

  // Bearing & Distance
  const bearing = calculateQiblaBearing(selectedCity.latitude, selectedCity.longitude);
  const distanceKm = calculateDistanceToKaaba(selectedCity.latitude, selectedCity.longitude);

  // Compute angle to rotate compass needle:
  // If sensor is active with device heading, relative angle = bearing - heading
  // If sensor is not active, needle points directly to bearing relative to North
  const compassRotation = deviceHeading !== null ? bearing - deviceHeading : bearing;
  const isAlignedWithQibla =
    deviceHeading !== null && Math.abs(((bearing - deviceHeading + 540) % 360) - 180) < 4;

  // Handle City Change
  const handleCityChange = (cityId: string) => {
    const city = CITIES_LIST.find((c) => c.id === cityId);
    if (city) {
      setSelectedCity(city);
      setIsUsingGps(false);
      setGpsError(null);
      storageService.saveSelectedCityId(city.id);
    }
  };

  // Handle GPS detection
  const handleDetectGps = async () => {
    setIsLoadingGps(true);
    setGpsError(null);
    try {
      const coords = await getCurrentCoordinates();
      setSelectedCity({
        id: 'gps-custom',
        name: 'Lokasi Anda (GPS)',
        province: 'Koordinat Perangkat',
        country: 'Indonesia',
        latitude: coords.latitude,
        longitude: coords.longitude,
        timezoneOffset: Math.round(-new Date().getTimezoneOffset() / 60),
      });
      setIsUsingGps(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal mendeteksi lokasi GPS.';
      setGpsError(msg);
    } finally {
      setIsLoadingGps(false);
    }
  };

  // Orientation listener
  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    let heading: number | null = null;

    // iOS Safari proprietary property
    if ('webkitCompassHeading' in event && typeof (event as any).webkitCompassHeading === 'number') {
      heading = (event as any).webkitCompassHeading;
    } else if (event.alpha !== null) {
      // Android / Standard W3C: alpha is angle from North (0 to 360)
      // On some Android browsers, compass heading is 360 - alpha
      heading = (360 - event.alpha) % 360;
    }

    if (heading !== null && !isNaN(heading)) {
      setDeviceHeading(Math.round(heading));
      setSensorStatus('active');
    }
  }, []);

  // Request device orientation permission (required for iOS 13+)
  const requestOrientationPermission = async () => {
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      try {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response === 'granted') {
          setSensorStatus('active');
          window.addEventListener('deviceorientation', handleOrientation, true);
        } else {
          setSensorStatus('denied');
        }
      } catch (e) {
        console.warn('Orientation permission error:', e);
        setSensorStatus('denied');
      }
    } else if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      // Non-iOS or older iOS: add listener directly
      window.addEventListener('deviceorientation', handleOrientation, true);
      setSensorStatus('active');
    } else {
      setSensorStatus('unsupported');
    }
  };

  useEffect(() => {
    // Check if DeviceOrientationEvent exists
    if (typeof window === 'undefined' || !('DeviceOrientationEvent' in window)) {
      setSensorStatus('unsupported');
      return;
    }

    // Check if iOS permission function exists
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      setSensorStatus('need-permission');
    } else {
      window.addEventListener('deviceorientation', handleOrientation, true);
      setSensorStatus('active');
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [handleOrientation]);

  return (
    <div className="space-y-6 pb-24 animate-fadeIn max-w-xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#003B2E]">
          Arah Kiblat
        </h1>
        <p className="text-xs text-[#68766F] mt-1">
          Penentu arah kiblat akurat menuju Ka'bah menggunakan perhitungan Lingkaran Besar (Great Circle).
        </p>
      </div>

      {/* Location Selector Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5E9E4] shadow-2xs space-y-3">
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#E5E9E4]">
          <span className="text-xs font-bold text-[#003B2E] flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#E0B030]" />
            Lokasi Pengukuran
          </span>
          <button
            onClick={handleDetectGps}
            disabled={isLoadingGps}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E5E9E4] bg-[#FFFEFA] hover:bg-[#F5F0D5]/50 text-xs font-medium text-[#003B2E] transition disabled:opacity-50"
          >
            <Navigation className={`w-3.5 h-3.5 ${isLoadingGps ? 'animate-spin' : ''}`} />
            <span>{isLoadingGps ? 'Mencari GPS...' : 'Gunakan GPS'}</span>
          </button>
        </div>

        {/* City picker dropdown */}
        <div>
          <label htmlFor="city-select" className="block text-[11px] text-[#68766F] mb-1">
            Pilih Kota di Indonesia:
          </label>
          <select
            id="city-select"
            value={isUsingGps ? 'gps-custom' : selectedCity.id}
            onChange={(e) => handleCityChange(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-[#E5E9E4] bg-white text-xs font-semibold text-[#202520] focus:border-[#003B2E] outline-none"
          >
            {isUsingGps && <option value="gps-custom">📍 Lokasi GPS Perangkat Anda</option>}
            {CITIES_LIST.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name} ({city.province})
              </option>
            ))}
          </select>
        </div>

        {gpsError && (
          <div className="p-2.5 rounded-xl bg-[#B42318]/10 text-[#B42318] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{gpsError} Menggunakan lokasi kota pilihan.</span>
          </div>
        )}
      </div>

      {/* Main Qibla Compass Card */}
      <div className="p-6 rounded-3xl bg-white border border-[#E5E9E4] shadow-xs text-center space-y-6">
        {/* Degrees and Distance Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#003B2E]/10 text-xs font-bold text-[#003B2E]">
            <Compass className="w-3.5 h-3.5 text-[#E0B030]" />
            <span>Sudut Kiblat: {bearing}° dari Utara</span>
          </div>
          <p className="text-xs text-[#68766F]">
            Jarak ke Ka'bah: <strong className="text-[#202520]">{distanceKm.toLocaleString('id-ID')} km</strong>
          </p>
        </div>

        {/* Visual Compass Ring */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto flex items-center justify-center">
          {/* Compass Outer Bezel */}
          <div
            className={`w-full h-full rounded-full border-4 transition-colors duration-300 flex items-center justify-center relative shadow-inner ${
              isAlignedWithQibla
                ? 'border-[#237A57] bg-[#237A57]/5'
                : 'border-[#E5E9E4] bg-[#FFFEFA]'
            }`}
          >
            {/* Cardinal Directions */}
            <span className="absolute top-2 font-bold text-xs text-[#B42318]">U</span>
            <span className="absolute right-3 font-semibold text-xs text-[#68766F]">T</span>
            <span className="absolute bottom-2 font-semibold text-xs text-[#68766F]">S</span>
            <span className="absolute left-3 font-semibold text-xs text-[#68766F]">B</span>

            {/* Degree Marks (Ticks) */}
            <div className="absolute inset-4 rounded-full border border-dashed border-[#E5E9E4]" />

            {/* Compass Needle Indicator */}
            <div
              className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-out"
              style={{
                transform: `rotate(${compassRotation}deg)`,
              }}
            >
              {/* Kaaba Direction Arrow */}
              <div className="w-full flex items-center justify-between px-3">
                {/* Tail */}
                <div className="w-6 h-1 bg-[#E5E9E4] rounded-full" />

                {/* Needle Head with Kaaba Symbol */}
                <div className="flex items-center -mr-1">
                  <div className="w-12 h-1 bg-[#E0B030] rounded-full" />
                  <div className="w-10 h-10 rounded-full bg-[#003B2E] text-white flex items-center justify-center shadow-md border-2 border-[#E0B030] transform rotate-90">
                    <span className="text-xs font-bold text-[#E0B030]">🕋</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Center Pivot Point */}
            <div className="w-5 h-5 rounded-full bg-[#003B2E] border-2 border-[#E0B030] z-10 shadow-xs" />
          </div>
        </div>

        {/* Sensor State & Feedback Message */}
        <div className="space-y-3">
          {isAlignedWithQibla ? (
            <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#237A57] text-white text-xs font-bold shadow-xs animate-pulse">
              <Check className="w-4 h-4 text-[#F5F0D5]" />
              <span>Ponsel Tepat Menghadap Kiblat!</span>
            </div>
          ) : deviceHeading !== null ? (
            <p className="text-xs text-[#68766F]">
              Arah ponsel saat ini: <strong className="text-[#003B2E]">{deviceHeading}°</strong>. Putar ponsel hingga jarum Ka'bah lurus ke atas.
            </p>
          ) : (
            <div className="p-3 rounded-xl bg-[#FFFEFA] border border-[#E5E9E4] text-xs text-[#68766F] space-y-1">
              <p className="font-semibold text-[#202520]">Mode Kompas Manual (Bearing Sudut)</p>
              <p className="text-[11px]">
                Arahkan kompas fisik atau bagian depan sajadah Anda ke sudut <strong>{bearing}°</strong> searah jarum jam dari arah Utara sejati.
              </p>
            </div>
          )}

          {/* iOS Safari Sensor Permission Request Button */}
          {sensorStatus === 'need-permission' && (
            <button
              onClick={requestOrientationPermission}
              className="w-full py-2.5 px-4 rounded-xl bg-[#003B2E] text-white text-xs font-bold hover:bg-[#002B21] transition flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 text-[#E0B030]" />
              <span>Izinkan Sensor Kompas (iOS Safari)</span>
            </button>
          )}

          {/* Sensor Info & Calibration Toggle */}
          <div className="flex items-center justify-center gap-4 pt-1 text-xs text-[#68766F]">
            <button
              onClick={() => setShowCalibrationHelp(!showCalibrationHelp)}
              className="hover:text-[#003B2E] underline flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#E0B030]" />
              <span>Petunjuk Kalibrasi</span>
            </button>
          </div>
        </div>
      </div>

      {/* Calibration Guide Drawer/Card */}
      {showCalibrationHelp && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFEFA] border border-[#E5E9E4] space-y-3 text-xs text-[#202520]">
          <div className="flex items-center gap-2 text-[#003B2E] font-bold">
            <Info className="w-4 h-4 text-[#E0B030]" />
            <h3>Tips Kalibrasi Kompas Digital</h3>
          </div>
          <ol className="list-decimal pl-5 space-y-1.5 text-[#68766F] leading-relaxed">
            <li>Pegang perangkat Anda secara mendatar sejajar dengan permukaan lantai.</li>
            <li>Gerakkan ponsel membentuk <strong>angka delapan (8)</strong> di udara beberapa kali untuk mengkalibrasi sensor magnetometer.</li>
            <li>Jauhkan perangkat dari benda logam, magnet penutup casing ponsel, atau speaker.</li>
            <li>Jika kompas tidak berputar otomatis, gunakan sudut derajat <strong>{bearing}°</strong> sebagai patokan arah kiblat dari arah utara.</li>
          </ol>
        </div>
      )}
    </div>
  );
};
