import React, { useState } from 'react';
import {
  Type,
  BookOpen,
  Volume2,
  Sliders,
  Calendar,
  Database,
  Trash2,
  Check,
  Sparkles,
  Info,
  MapPin,
  Smartphone,
  CheckCircle2,
  Download,
  ShieldCheck,
  Code2,
} from 'lucide-react';
import { APP_CONFIG } from '../config/appConfig';
import { storageService } from '../services/storageService';
import { quranApi } from '../services/quranApi';
import { CITIES_LIST } from '../services/qiblaService';
import { CALCULATION_METHODS } from '../services/prayerTimesService';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { PWAInstallButton } from '../components/pwa/PWAInstallButton';
import type { UserSettings } from '../types/quran';

export const SettingsView: React.FC = () => {
  const pwa = usePWAInstall();
  const [settings, setSettings] = useState<UserSettings>(storageService.getSettings());
  const [saveToast, setSaveToast] = useState(false);
  const [cachedSurahs, setCachedSurahs] = useState(quranApi.getCachedSurahsCount());

  const update = (partial: Partial<UserSettings>) => {
    const updated = storageService.saveSettings(partial);
    setSettings(updated);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleClearCache = () => {
    if (confirm('Hapus seluruh cache data Al-Qur’an di browser? (Data bookmark dan catatan tidak akan hilang)')) {
      quranApi.clearApiCache();
      setCachedSurahs(0);
      alert('Cache data Al-Qur’an berhasil dibersihkan.');
    }
  };

  return (
    <div className="space-y-6 pb-24 animate-fadeIn max-w-3xl mx-auto">
      {/* Toast */}
      {saveToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#003B2E] text-white text-xs px-4 py-2 rounded-full shadow-lg border border-[#E0B030]/40 flex items-center gap-1.5 animate-bounce">
          <Check className="w-3.5 h-3.5 text-[#E0B030]" />
          <span>Pengaturan berhasil disimpan.</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#003B2E]">
          Pengaturan
        </h1>
        <p className="text-xs text-[#68766F] mt-1">
          Sesuaikan pengalaman membaca dan audio Al-Qur’an sesuai kenyamanan Anda.
        </p>
      </div>

      {/* Section 1: Tipografi Arab */}
      <section className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5E9E4] shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#E5E9E4] text-[#003B2E] font-bold text-sm">
          <Type className="w-4 h-4 text-[#E0B030]" />
          <span>Ukuran Huruf Teks Arab</span>
        </div>

        {/* Live Preview Box */}
        <div className="p-4 rounded-xl bg-[#FFFEFA] border border-[#E5E9E4] text-right">
          <p
            className="font-quran text-[#003B2E] transition-all"
            style={{ fontSize: `${settings.arabicFontSize}px`, lineHeight: 2.2 }}
          >
            بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
          </p>
          <p className="text-[11px] text-[#68766F] text-left mt-2 italic font-sans">
            Pratinjau ukuran teks ayat Al-Qur’an
          </p>
        </div>

        {/* Stepper options */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
          {APP_CONFIG.fontSizes.map((f) => (
            <button
              key={f.value}
              onClick={() => update({ arabicFontSize: f.value })}
              className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                settings.arabicFontSize === f.value
                  ? 'bg-[#003B2E] text-white border-[#003B2E]'
                  : 'bg-white text-[#202520] border-[#E5E9E4] hover:bg-[#F5F0D5]/40'
              }`}
            >
              {f.label} ({f.value}px)
            </button>
          ))}
        </div>
      </section>

      {/* Section 2: Tampilan Terjemahan & Transliterasi */}
      <section className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5E9E4] shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#E5E9E4] text-[#003B2E] font-bold text-sm">
          <BookOpen className="w-4 h-4 text-[#E0B030]" />
          <span>Tampilan Naskah</span>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-xl border border-[#E5E9E4] hover:bg-[#FFFEFA] cursor-pointer">
            <div>
              <p className="text-xs font-bold text-[#202520]">
                Tampilkan Terjemahan Bahasa Indonesia
              </p>
              <p className="text-[11px] text-[#68766F]">
                Terjemahan resmi Kementerian Agama RI di bawah tiap ayat
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.showTranslation}
              onChange={(e) => update({ showTranslation: e.target.checked })}
              className="w-4 h-4 rounded text-[#003B2E] focus:ring-[#003B2E] accent-[#003B2E]"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl border border-[#E5E9E4] hover:bg-[#FFFEFA] cursor-pointer">
            <div>
              <p className="text-xs font-bold text-[#202520]">
                Tampilkan Transliterasi Latin
              </p>
              <p className="text-[11px] text-[#68766F]">
                Teks bacaan latin untuk membantu makhraj dan ejaan
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.showTransliteration}
              onChange={(e) => update({ showTransliteration: e.target.checked })}
              className="w-4 h-4 rounded text-[#003B2E] focus:ring-[#003B2E] accent-[#003B2E]"
            />
          </label>
        </div>
      </section>

      {/* Section 3: Audio Murottal & Qari */}
      <section className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5E9E4] shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#E5E9E4] text-[#003B2E] font-bold text-sm">
          <Volume2 className="w-4 h-4 text-[#E0B030]" />
          <span>Qari Murottal Default</span>
        </div>

        <div className="space-y-2">
          {APP_CONFIG.quranReciters.map((reciter) => {
            const isSelected = settings.reciterId === reciter.id;
            return (
              <button
                key={reciter.id}
                onClick={() => update({ reciterId: reciter.id })}
                className={`w-full p-3.5 rounded-xl border flex items-center justify-between text-left transition ${
                  isSelected
                    ? 'border-[#003B2E] bg-[#003B2E]/5 ring-1 ring-[#003B2E]'
                    : 'border-[#E5E9E4] hover:bg-[#FFFEFA]'
                }`}
              >
                <div>
                  <h4 className="text-xs font-bold text-[#202520]">
                    {reciter.name}
                  </h4>
                  <span className="text-[11px] text-[#68766F]">
                    {reciter.country}
                  </span>
                </div>
                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-[#003B2E] text-white flex items-center justify-center text-xs">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Section 4: Target Tilawah Harian */}
      <section className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5E9E4] shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#E5E9E4] text-[#003B2E] font-bold text-sm">
          <Calendar className="w-4 h-4 text-[#E0B030]" />
          <span>Target Tilawah Harian</span>
        </div>

        <p className="text-xs text-[#68766F]">
          Tentukan jumlah ayat yang ingin Anda baca setiap hari untuk membangun kebiasaan istiqomah.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[10, 20, 30, 50].map((target) => (
            <button
              key={target}
              onClick={() => {
                storageService.updateDailyTarget(target);
                update({ dailyTargetAyat: target });
              }}
              className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                settings.dailyTargetAyat === target
                  ? 'bg-[#003B2E] text-white border-[#003B2E]'
                  : 'bg-white text-[#202520] border-[#E5E9E4] hover:bg-[#F5F0D5]/40'
              }`}
            >
              {target} Ayat / Hari
            </button>
          ))}
        </div>
      </section>

      {/* Section 5: Lokasi Kota & Hisab Salat */}
      <section className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5E9E4] shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#E5E9E4] text-[#003B2E] font-bold text-sm">
          <MapPin className="w-4 h-4 text-[#E0B030]" />
          <span>Lokasi Kota & Hisab Salat</span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-[#202520] mb-1">
              Kota Default Jadwal Salat & Arah Kiblat:
            </label>
            <select
              value={settings.selectedCityId || 'jakarta'}
              onChange={(e) => {
                storageService.saveSelectedCityId(e.target.value);
                update({ selectedCityId: e.target.value });
              }}
              className="w-full p-2.5 rounded-xl border border-[#E5E9E4] bg-white text-xs font-semibold text-[#202520] focus:border-[#003B2E] outline-none"
            >
              {CITIES_LIST.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.province})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#202520] mb-1">
              Metode Perhitungan Hisab:
            </label>
            <select
              value={settings.calculationMethod || 'kemenag'}
              onChange={(e) => update({ calculationMethod: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-[#E5E9E4] bg-white text-xs font-semibold text-[#202520] focus:border-[#003B2E] outline-none"
            >
              {Object.entries(CALCULATION_METHODS).map(([key, item]) => (
                <option key={key} value={key}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Section 6: Penyimpanan & Cache Offline */}
      <section className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5E9E4] shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#E5E9E4] text-[#003B2E] font-bold text-sm">
          <Database className="w-4 h-4 text-[#E0B030]" />
          <span>Penyimpanan & Cache Offline</span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div>
            <p className="font-bold text-[#202520]">Surat Tersimpan Offline</p>
            <p className="text-[11px] text-[#68766F]">
              {cachedSurahs} dari 114 surat telah dicache di perangkat Anda
            </p>
          </div>
          <button
            onClick={handleClearCache}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#B42318]/30 text-[#B42318] hover:bg-[#B42318]/10 text-xs font-semibold transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Bersihkan Cache</span>
          </button>
        </div>
      </section>

      {/* Section 7: Status Instalasi PWA & Android Native */}
      <section className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5E9E4] shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#E5E9E4] text-[#003B2E] font-bold text-sm">
          <Smartphone className="w-4 h-4 text-[#E0B030]" />
          <span>Status Aplikasi & Instalasi Mobile</span>
        </div>

        {/* Installation Mode Badge */}
        <div className="p-4 rounded-xl bg-[#F5F0D5]/30 border border-[#E0B030]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-xl mt-0.5 ${pwa.isStandalone ? 'bg-[#003B2E] text-[#E0B030]' : 'bg-white text-[#68766F] border border-[#E5E9E4]'}`}>
              {pwa.isStandalone ? (
                <CheckCircle2 className="w-5 h-5 text-[#E0B030]" />
              ) : (
                <Smartphone className="w-5 h-5 text-[#003B2E]" />
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-[#003B2E] flex items-center gap-2">
                <span>Mode: {pwa.isStandalone ? 'Aplikasi Terpasang (Standalone / TWA)' : 'Browser Web'}</span>
                {pwa.isStandalone && (
                  <span className="text-[10px] bg-[#003B2E] text-white px-2 py-0.5 rounded-full font-medium">
                    Aktif
                  </span>
                )}
              </p>
              <p className="text-[11px] text-[#68766F] mt-0.5">
                {pwa.isStandalone
                  ? 'Aplikasi berjalan dalam mode mandiri layar penuh dengan akses offline cepat.'
                  : `Akses melalui ${pwa.browserName} di ${pwa.isAndroid ? 'Android' : pwa.isIOS ? 'iPhone / iOS' : 'Desktop'}.`}
              </p>
            </div>
          </div>

          {!pwa.isStandalone && (
            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
              {pwa.isSnoozed && (
                <button
                  onClick={() => pwa.clearSnooze()}
                  className="text-[11px] text-[#003B2E] underline hover:text-[#E0B030] transition font-medium"
                >
                  Tampilkan Widget
                </button>
              )}
              <PWAInstallButton />
            </div>
          )}
        </div>

        {/* Technical specs of native packaging */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3.5 rounded-xl border border-[#E5E9E4] bg-[#FFFEFA] space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-[#202520]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#003B2E]" />
              <span>Paket Android Native (TWA)</span>
            </div>
            <p className="text-[11px] text-[#68766F]">
              ID Paket: <code className="text-[#003B2E] font-mono font-semibold">com.najquran.app</code>
            </p>
            <p className="text-[11px] text-[#68766F]">
              Verifikasi: <code className="text-[#003B2E] font-mono">.well-known/assetlinks.json</code>
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-[#E5E9E4] bg-[#FFFEFA] space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-[#202520]">
              <Code2 className="w-3.5 h-3.5 text-[#E0B030]" />
              <span>Source Proyek Android</span>
            </div>
            <p className="text-[11px] text-[#68766F]">
              Folder: <code className="text-[#003B2E] font-mono font-semibold">/android</code>
            </p>
            <p className="text-[11px] text-[#68766F]">
              Siap di-build di Android Studio atau script <code className="text-[#003B2E] font-mono">./build-apk.sh</code>
            </p>
          </div>
        </div>

        {/* iOS Notice if on iPhone */}
        {pwa.isIOS && !pwa.isStandalone && (
          <div className="p-3.5 rounded-xl bg-[#F5F0D5]/40 border border-[#E0B030]/30 text-xs text-[#202520] space-y-1">
            <p className="font-bold text-[#003B2E]">Instalasi di iPhone / iPad (Safari):</p>
            <p className="text-[11px] text-[#68766F]">
              Tekan tombol <span className="font-semibold text-[#003B2E]">Bagikan (Share)</span> di Safari, lalu scroll dan pilih <span className="font-semibold text-[#003B2E]">"Tambahkan ke Layar Utama" (Add to Home Screen)</span>.
            </p>
          </div>
        )}
      </section>

      {/* Section 8: Informasi Aplikasi & Brand */}
      <section className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5E9E4] text-center space-y-2">
        <img
          src={APP_CONFIG.logoUrl}
          alt={APP_CONFIG.appName}
          className="w-16 h-16 mx-auto object-contain rounded-full shadow-xs"
        />
        <h3 className="text-base font-bold text-[#003B2E]">
          {APP_CONFIG.appName} v{APP_CONFIG.version}
        </h3>
        <p className="text-xs text-[#68766F] italic">
          "{APP_CONFIG.tagline}"
        </p>
        <p className="text-[11px] text-[#68766F] pt-2">
          Data teks ayat, terjemahan, dan tafsir bersumber dari Kementerian Agama RI melalui API equran.id v2.
        </p>
      </section>
    </div>
  );
};
