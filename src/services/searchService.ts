import { quranApi } from './quranApi';
import type { SurahSummary, SearchResultItem, SurahDetail } from '../types/quran';

export interface SearchCoverage {
  totalSurahsIndexed: number;
  totalAyatIndexed: number;
  isIndexing: boolean;
  progressPercent: number;
}

class SearchService {
  private ayatIndex: Map<string, { surahNomor: number; surahNamaLatin: string; ayatNomor: number; teksArab: string; teksIndonesia: string }> = new Map();
  private surahsCache: SurahSummary[] = [];
  private isIndexing = false;
  private indexedSurahSet = new Set<number>();
  private listeners: Set<(coverage: SearchCoverage) => void> = new Set();

  public subscribeCoverage(listener: (coverage: SearchCoverage) => void): () => void {
    this.listeners.add(listener);
    listener(this.getCoverage());
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getCoverage(): SearchCoverage {
    return {
      totalSurahsIndexed: this.surahsCache.length,
      totalAyatIndexed: this.ayatIndex.size,
      isIndexing: this.isIndexing,
      progressPercent: this.surahsCache.length > 0 ? Math.round((this.indexedSurahSet.size / 114) * 100) : 0,
    };
  }

  private notify() {
    const cov = this.getCoverage();
    for (const l of this.listeners) {
      l(cov);
    }
  }

  public setSurahs(surahs: SurahSummary[]) {
    this.surahsCache = surahs;
    this.notify();
  }

  public registerSurahDetail(surah: SurahDetail) {
    if (this.indexedSurahSet.has(surah.nomor)) return;

    for (const a of surah.ayat) {
      const key = `${surah.nomor}:${a.nomorAyat}`;
      this.ayatIndex.set(key, {
        surahNomor: surah.nomor,
        surahNamaLatin: surah.namaLatin,
        ayatNomor: a.nomorAyat,
        teksArab: a.teksArab,
        teksIndonesia: a.teksIndonesia,
      });
    }

    this.indexedSurahSet.add(surah.nomor);
    this.notify();
  }

  /**
   * Index popular / requested surahs into search memory in the background
   */
  public async indexCommonSurahs(surahNumbers: number[] = [1, 2, 3, 18, 36, 55, 56, 67, 78, 112, 113, 114]): Promise<void> {
    if (this.isIndexing) return;
    this.isIndexing = true;
    this.notify();

    try {
      for (const no of surahNumbers) {
        if (!this.indexedSurahSet.has(no)) {
          try {
            const detail = await quranApi.getSurahDetail(no);
            this.registerSurahDetail(detail);
          } catch {
            // ignore failure for individual surah
          }
        }
      }
    } finally {
      this.isIndexing = false;
      this.notify();
    }
  }

  /**
   * Melakukan pencarian teks:
   * - Nama surat (Latin atau Arab)
   * - Nomor surat
   * - Terjemahan ayat
   */
  public search(query: string, maxResults = 50): SearchResultItem[] {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const results: SearchResultItem[] = [];

    // Check if query is just a number (e.g. "36" or "114")
    const isNum = /^\d+$/.test(q);
    const targetNum = isNum ? parseInt(q, 10) : null;

    // 1. Search Surah names & numbers
    for (const s of this.surahsCache) {
      if (results.length >= maxResults) break;

      const matchesNomor = targetNum !== null && s.nomor === targetNum;
      const matchesLatin = s.namaLatin.toLowerCase().includes(q);
      const matchesArti = s.arti.toLowerCase().includes(q);

      if (matchesNomor || matchesLatin || matchesArti) {
        results.push({
          surahNomor: s.nomor,
          surahNamaLatin: s.namaLatin,
          ayatNomor: 1,
          teksArab: s.nama,
          teksIndonesia: `Surat ke-${s.nomor} · ${s.arti} · ${s.jumlahAyat} ayat (${s.tempatTurun})`,
          matchType: 'surah_name',
          matchedSnippet: s.arti,
        });
      }
    }

    // 2. Search Verses translation in index
    for (const item of this.ayatIndex.values()) {
      if (results.length >= maxResults) break;

      const indoLower = item.teksIndonesia.toLowerCase();
      const matchIndex = indoLower.indexOf(q);

      if (matchIndex >= 0) {
        // Build contextual snippet
        const start = Math.max(0, matchIndex - 30);
        const end = Math.min(item.teksIndonesia.length, matchIndex + q.length + 50);
        const snippet = (start > 0 ? '...' : '') +
          item.teksIndonesia.substring(start, end) +
          (end < item.teksIndonesia.length ? '...' : '');

        results.push({
          surahNomor: item.surahNomor,
          surahNamaLatin: item.surahNamaLatin,
          ayatNomor: item.ayatNomor,
          teksArab: item.teksArab,
          teksIndonesia: item.teksIndonesia,
          matchType: 'translation',
          matchedSnippet: snippet,
        });
      }
    }

    return results;
  }
}

export const searchService = new SearchService();
