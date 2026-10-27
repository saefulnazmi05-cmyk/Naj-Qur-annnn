/**
 * Centralized App Configuration for Naj Qur'an
 * Edit bagian ini untuk mengganti identitas utama aplikasi.
 */
export const APP_CONFIG = {
  appName: "Naj Qur’an",
  shortName: "Naj Quran",
  primaryColor: "#003B2E",
  tagline: "Dekat dengan Al-Qur’an, Setiap Hari",
  subTagline: "Platform Al-Qur’an dan Ibadah digital yang akurat, nyaman, dan berorientasi pada ketenangan.",
  version: "1.1.0",
  logoUrl: "/logo.png",
  apiBaseUrl: "https://equran.id/api/v2",
  colors: {
    primary: "#003B2E",      // Emerald Green
    accent: "#E0B030",       // Royal Gold
    dark: "#000000",         // Black
    light: "#F5F0D5",        // Ivory
    background: "#FFFEFA",   // Warm White
    surface: "#FFFFFF",      // Pure White
    text: "#202520",         // Deep Charcoal
    muted: "#68766F",        // Muted Green Gray
    border: "#E5E9E4",       // Soft Neutral
    success: "#237A57",      // Accessible Green
    error: "#B42318",        // Accessible Red
  },
  kaaba: {
    latitude: 21.422487,
    longitude: 39.826206,
    name: "Ka'bah, Masjidil Haram, Makkah",
  },
  quranReciters: [
    { id: "05", name: "Misyari Rasyid Al-Afasi", country: "Kuwait" },
    { id: "01", name: "Abdullah Al-Juhany", country: "Arab Saudi" },
    { id: "02", name: "Abdul Muhsin Al-Qasim", country: "Arab Saudi" },
    { id: "03", name: "Abdurrahman as-Sudais", country: "Arab Saudi" },
    { id: "04", name: "Ibrahim Al-Dossari", country: "Arab Saudi" },
    { id: "06", name: "Yasser Al-Dosari", country: "Arab Saudi" },
  ],
  defaultReciterId: "05",
  defaultArabicFontSize: 30, // px
  fontSizes: [
    { label: "Kecil", value: 24 },
    { label: "Sedang", value: 30 },
    { label: "Besar", value: 36 },
    { label: "Ekstra Besar", value: 42 },
  ],
  scrollSpeeds: [
    { label: "0.5x", value: 0.5 },
    { label: "1x", value: 1.0 },
    { label: "1.5x", value: 1.5 },
    { label: "2x", value: 2.0 },
    { label: "3x", value: 3.0 },
  ],
};
