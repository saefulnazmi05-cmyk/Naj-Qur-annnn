import { APP_CONFIG } from '../config/appConfig';
import type { SurahSummary, SurahDetail, SurahTafsir } from '../types/quran';

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

const CACHE_PREFIX = 'naj_quran_cache_';
const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

// In-flight request deduplication map
const pendingRequests = new Map<string, Promise<unknown>>();

// In-memory cache for ultra-fast subsequent lookups
const memoryCache = new Map<string, { timestamp: number; data: unknown }>();

function getStorageCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.timestamp > CACHE_TTL_MS) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return parsed.data as T;
  } catch (e) {
    console.warn('Failed reading from local storage cache:', e);
    return null;
  }
}

function setStorageCache<T>(key: string, data: T): void {
  try {
    localStorage.setItem(
      CACHE_PREFIX + key,
      JSON.stringify({ timestamp: Date.now(), data })
    );
  } catch (e) {
    console.warn('Failed writing to local storage cache:', e);
  }
}

async function fetchWithTimeoutAndRetry<T>(
  url: string,
  timeoutMs = 10000,
  maxRetries = 2
): Promise<T> {
  let attempt = 0;

  while (attempt <= maxRetries) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
      }

      const json: ApiResponse<T> = await response.json();

      if (!json || json.code !== 200 || !json.data) {
        throw new Error(json?.message || 'Data API Al-Qur’an tidak valid atau kosong.');
      }

      return json.data;
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      attempt++;

      const isLastAttempt = attempt > maxRetries;
      const errorMsg = err instanceof Error ? err.message : 'Kesalahan jaringan';

      if (isLastAttempt) {
        throw new Error(`Gagal memuat data dari server: ${errorMsg}`);
      }

      // Exponential backoff delay
      await new Promise((resolve) => setTimeout(resolve, attempt * 500));
    }
  }

  throw new Error('Gagal menghubungi server setelah beberapa percobaan.');
}

export const quranApi = {
  /**
   * Mengambil daftar seluruh 114 surat dari API equran.id
   */
  async getAllSurahs(): Promise<SurahSummary[]> {
    const cacheKey = 'all_surahs';

    // 1. Check memory cache
    const mem = memoryCache.get(cacheKey);
    if (mem && Date.now() - mem.timestamp < CACHE_TTL_MS) {
      return mem.data as SurahSummary[];
    }

    // 2. Check local storage cache
    const cached = getStorageCache<SurahSummary[]>(cacheKey);
    if (cached && Array.isArray(cached) && cached.length === 114) {
      memoryCache.set(cacheKey, { timestamp: Date.now(), data: cached });
      return cached;
    }

    // 3. Check deduplication
    if (pendingRequests.has(cacheKey)) {
      return pendingRequests.get(cacheKey) as Promise<SurahSummary[]>;
    }

    const requestPromise = (async () => {
      try {
        const data = await fetchWithTimeoutAndRetry<SurahSummary[]>(
          `${APP_CONFIG.apiBaseUrl}/surat`
        );

        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('Daftar surat kosong dari API.');
        }

        memoryCache.set(cacheKey, { timestamp: Date.now(), data });
        setStorageCache(cacheKey, data);
        return data;
      } catch (err) {
        // Fallback to cache even if slightly stale if network fails
        if (cached && cached.length > 0) {
          console.warn('Network failed, falling back to cached surahs list.');
          return cached;
        }
        throw err;
      } finally {
        pendingRequests.delete(cacheKey);
      }
    })();

    pendingRequests.set(cacheKey, requestPromise);
    return requestPromise;
  },

  /**
   * Mengambil detail surat termasuk seluruh ayat, teks Arab, teks Latin, terjemahan, dan audio
   */
  async getSurahDetail(nomor: number): Promise<SurahDetail> {
    if (nomor < 1 || nomor > 114) {
      throw new Error(`Nomor surat tidak valid: ${nomor}. Harus berada di antara 1 dan 114.`);
    }

    const cacheKey = `surah_${nomor}`;

    // 1. Check memory cache
    const mem = memoryCache.get(cacheKey);
    if (mem) {
      return mem.data as SurahDetail;
    }

    // 2. Check local storage cache
    const cached = getStorageCache<SurahDetail>(cacheKey);
    if (cached && cached.ayat && cached.ayat.length > 0) {
      memoryCache.set(cacheKey, { timestamp: Date.now(), data: cached });
      return cached;
    }

    // 3. Deduplication
    if (pendingRequests.has(cacheKey)) {
      return pendingRequests.get(cacheKey) as Promise<SurahDetail>;
    }

    const requestPromise = (async () => {
      try {
        const data = await fetchWithTimeoutAndRetry<SurahDetail>(
          `${APP_CONFIG.apiBaseUrl}/surat/${nomor}`
        );

        if (!data || !Array.isArray(data.ayat) || data.ayat.length === 0) {
          throw new Error(`Data ayat surat nomor ${nomor} kosong atau tidak valid.`);
        }

        memoryCache.set(cacheKey, { timestamp: Date.now(), data });
        setStorageCache(cacheKey, data);
        return data;
      } catch (err) {
        if (cached) {
          console.warn(`Network failed, falling back to cached surah ${nomor}.`);
          return cached;
        }
        throw err;
      } finally {
        pendingRequests.delete(cacheKey);
      }
    })();

    pendingRequests.set(cacheKey, requestPromise);
    return requestPromise;
  },

  /**
   * Mengambil tafsir resmi Kemenag per surat
   */
  async getSurahTafsir(nomor: number): Promise<SurahTafsir> {
    if (nomor < 1 || nomor > 114) {
      throw new Error(`Nomor surat tidak valid: ${nomor}.`);
    }

    const cacheKey = `tafsir_${nomor}`;

    const mem = memoryCache.get(cacheKey);
    if (mem) {
      return mem.data as SurahTafsir;
    }

    const cached = getStorageCache<SurahTafsir>(cacheKey);
    if (cached && cached.tafsir && cached.tafsir.length > 0) {
      memoryCache.set(cacheKey, { timestamp: Date.now(), data: cached });
      return cached;
    }

    if (pendingRequests.has(cacheKey)) {
      return pendingRequests.get(cacheKey) as Promise<SurahTafsir>;
    }

    const requestPromise = (async () => {
      try {
        const data = await fetchWithTimeoutAndRetry<SurahTafsir>(
          `${APP_CONFIG.apiBaseUrl}/tafsir/${nomor}`
        );

        if (!data || !Array.isArray(data.tafsir)) {
          throw new Error(`Data tafsir surat ${nomor} tidak tersedia.`);
        }

        memoryCache.set(cacheKey, { timestamp: Date.now(), data });
        setStorageCache(cacheKey, data);
        return data;
      } catch (err) {
        if (cached) {
          console.warn(`Network failed, falling back to cached tafsir ${nomor}.`);
          return cached;
        }
        throw err;
      } finally {
        pendingRequests.delete(cacheKey);
      }
    })();

    pendingRequests.set(cacheKey, requestPromise);
    return requestPromise;
  },

  /**
   * Cek ketersediaan cache offline untuk surat tertentu
   */
  isSurahCached(nomor: number): boolean {
    return !!getStorageCache<SurahDetail>(`surah_${nomor}`);
  },

  /**
   * Hitung berapa surat yang tersimpan di cache lokal
   */
  getCachedSurahsCount(): number {
    let count = 0;
    for (let i = 1; i <= 114; i++) {
      if (localStorage.getItem(CACHE_PREFIX + `surah_${i}`)) {
        count++;
      }
    }
    return count;
  },

  /**
   * Bersihkan semua cache API
   */
  clearApiCache(): void {
    memoryCache.clear();
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  },
};
