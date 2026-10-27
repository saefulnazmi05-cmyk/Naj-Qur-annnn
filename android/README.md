# 📱 Naj Qur’an — Android Native TWA Application

Paket proyek Android native berbasis **Trusted Web Activity (TWA)** dan **AndroidX Browser Helper** untuk aplikasi **Naj Qur’an**.

## 📌 Identitas Proyek
- **Package ID:** `com.najquran.app`
- **Application Name:** Naj Qur’an
- **Short Name:** Naj Quran
- **Min SDK:** 21 (Android 5.0 Lollipop)
- **Target / Compile SDK:** 34 (Android 14)
- **Theme Color:** `#003B2E` (Emerald Green)
- **Accent Color:** `#E0B030` (Royal Gold)
- **TWA Host:** Host produksi web app Naj Qur’an

---

## 🚀 Opsi Pembangunan (Build Options)

### Opsi 1: Menggunakan Android Studio (Paling Direkomendasikan)
1. Buka **Android Studio**.
2. Pilih **File > Open**, lalu arahkan ke folder `/android` dari repositori ini.
3. Biarkan Android Studio melakukan Gradle Sync otomatis.
4. Hubungkan perangkat Android fisik via USB (dengan USB Debugging aktif) atau jalankan Android Emulator.
5. Klik tombol **Run 'app'** (tombol Play hijau) atau:
   - Pilih menu **Build > Build Bundle(s) / APK(s) > Build APK(s)** untuk membuat `app-debug.apk`.
   - Pilih menu **Build > Generate Signed Bundle / APK** untuk membuat `.aab` (Google Play Store) atau signed `.apk`.

---

### Opsi 2: Menggunakan Terminal / Gradle Command Line
Pastikan sistem Anda telah terpasang **Java (JDK 17+)** dan **Android SDK**:

```bash
cd android

# Berikan izin eksekusi pada script build
chmod +x build-apk.sh gradlew

# 1. Bangun Debug APK (untuk testing langsung di HP)
./build-apk.sh debug
# Output: app/build/outputs/apk/debug/app-debug.apk

# 2. Instal ke HP yang terhubung via USB
adb install app/build/outputs/apk/debug/app-debug.apk

# 3. Buat Keystore Produksi
./build-apk.sh keystore

# 4. Bangun Android App Bundle (.aab) untuk Play Store
./build-apk.sh bundle
# Output: app/build/outputs/bundle/release/app-release.aab
```

---

### Opsi 3: Menggunakan Bubblewrap CLI (Google Chrome Official Tool)
```bash
# Pasang Bubblewrap CLI secara global
npm install -g @bubblewrap/cli

# Masuk ke direktori android
cd android

# Validasi manifest dan konfigurasi TWA
bubblewrap validate

# Bangun APK dan AAB
bubblewrap build
```

---

## 🔐 Konfigurasi Keystore & Environment Variables
Untuk menjaga keamanan repository dan mematuhi best practice security, keystore tidak disimpan di repositori publik. Saat menjalankan build rilis di server CI/CD atau mesin lokal:

Atur environment variable:
```bash
export KEYSTORE_FILE="/path/to/najquran-release-key.jks"
export KEYSTORE_PASSWORD="password_keystore_anda"
export KEY_ALIAS="najquran"
export KEY_PASSWORD="password_key_anda"
```

Jika variabel ini diisi, `app/build.gradle` akan otomatis menandatangani APK/AAB rilis Anda. Jika tidak diisi, Gradle akan membangun unsigned release artifact.

---

## 🌐 Verifikasi Digital Asset Links (`assetlinks.json`)
Agar aplikasi TWA berjalan dalam mode **full-screen immersive tanpa URL bar browser** di Android:
1. Dapatkan SHA-256 fingerprint dari sertifikat rilis atau Google Play App Signing:
   ```bash
   keytool -list -v -keystore najquran-release-key.jks -alias najquran
   ```
2. Pastikan file `public/.well-known/assetlinks.json` di server web app Anda memuat sidik jari SHA-256 tersebut:
   ```json
   [
     {
       "relation": ["delegate_permission/common.handle_all_urls"],
       "target": {
         "namespace": "android_app",
         "package_name": "com.najquran.app",
         "sha256_cert_fingerprints": [
           "DA:39:A3:EE:5E:6B:4B:0D:32:55:BF:EF:95:60:18:90:AF:D8:07:09:A6:49:15:2B:A3:9B:F3:74:95:D1:59:71",
           "<SHA256_FINGERPRINT_ANDA>"
         ]
       }
     }
   ]
   ```
3. Uji verifikasi menggunakan Google Asset Links Tester:
   `https://digitalassetlinks.googleapis.com/v1/statements:check?source.web.site=https://<YOUR_DOMAIN>&relation=delegate_permission/common.handle_all_urls&target.android_app.package_name=com.najquran.app&target.android_app.certificate.sha256_fingerprint=<YOUR_FINGERPRINT>`

---

## 🎨 Asset Ikon & Resolusi
Asset ikon launcher telah disiapkan di folder `app/src/main/res/`:
- `mipmap-mdpi/`: 48×48 px
- `mipmap-hdpi/`: 72×72 px
- `mipmap-xhdpi/`: 96×96 px
- `mipmap-xxhdpi/`: 144×144 px
- `mipmap-xxxhdpi/`: 192×192 px
- Splash screen logo: `drawable/ic_splash_logo.png`
- Warna latar splash: `@color/colorPrimary` (`#003B2E`)

---

## 📋 Fitur Native yang Didukung
- **TWA Fullscreen Standalone:** Menampilkan aplikasi tanpa bilah URL browser saat `assetlinks.json` diverifikasi.
- **App Shortcuts (Launcher Quick Actions):**
  - Buka Al-Qur'an (`?view=surahs`)
  - Jadwal Salat (`?view=prayer-times`)
  - Arah Kiblat (`?view=qibla`)
  - Doa Harian (`?view=duas`)
- **Location Permission:** Mendukung GPS real-time untuk perhitungan arah kiblat dan jadwal salat otomatis.
- **Audio Wakelock & Media Session:** Pemutaran audio murottal 30 juz tetap berjalan di latar belakang (background audio playback).
- **Offline Support:** Seluruh surah, terjemahan, dan data doa yang telah dibuka otomatis tersimpan di cache lokal tanpa kuota internet.
