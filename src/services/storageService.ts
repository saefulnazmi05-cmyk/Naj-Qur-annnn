import type {
  Bookmark,
  PersonalNote,
  LastReadPosition,
  ReadingHistoryItem,
  TilawahProgress,
  UserSettings,
} from '../types/quran';
import { APP_CONFIG } from '../config/appConfig';

const KEYS = {
  BOOKMARKS: 'naj_quran_bookmarks',
  NOTES: 'naj_quran_notes',
  LAST_READ: 'naj_quran_last_read',
  HISTORY: 'naj_quran_history',
  TILAWAH_PROGRESS: 'naj_quran_tilawah_progress',
  SETTINGS: 'naj_quran_settings',
  FAVORITE_DUAS: 'naj_quran_favorite_duas',
  BOOKMARKED_PRAYER_STEPS: 'naj_quran_prayer_steps',
  SELECTED_CITY_ID: 'naj_quran_selected_city_id',
};

const DEFAULT_SETTINGS: UserSettings = {
  arabicFontSize: APP_CONFIG.defaultArabicFontSize,
  showTranslation: true,
  showTransliteration: true,
  autoScrollSpeed: 1.0,
  reciterId: APP_CONFIG.defaultReciterId,
  dailyTargetAyat: 20,
  selectedCityId: 'jakarta',
  calculationMethod: 'kemenag',
};

function getTodayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const storageService = {
  // --- Bookmarks ---
  getBookmarks(): Bookmark[] {
    try {
      const data = localStorage.getItem(KEYS.BOOKMARKS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  isBookmarked(surahNomor: number, ayatNomor: number): boolean {
    const bookmarks = this.getBookmarks();
    return bookmarks.some(
      (b) => b.surahNomor === surahNomor && b.ayatNomor === ayatNomor
    );
  },

  toggleBookmark(bookmark: Omit<Bookmark, 'id' | 'createdAt'>): boolean {
    const bookmarks = this.getBookmarks();
    const id = `${bookmark.surahNomor}:${bookmark.ayatNomor}`;
    const index = bookmarks.findIndex((b) => b.id === id);

    let isAdded = false;
    if (index >= 0) {
      bookmarks.splice(index, 1);
      isAdded = false;
    } else {
      bookmarks.unshift({
        ...bookmark,
        id,
        createdAt: new Date().toISOString(),
      });
      isAdded = true;
    }

    try {
      localStorage.setItem(KEYS.BOOKMARKS, JSON.stringify(bookmarks));
    } catch (e) {
      console.error('Error saving bookmark:', e);
    }
    return isAdded;
  },

  removeBookmark(id: string): void {
    const bookmarks = this.getBookmarks().filter((b) => b.id !== id);
    localStorage.setItem(KEYS.BOOKMARKS, JSON.stringify(bookmarks));
  },

  // --- Personal Notes ---
  getNotes(): PersonalNote[] {
    try {
      const data = localStorage.getItem(KEYS.NOTES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  getNoteForAyat(surahNomor: number, ayatNomor: number): PersonalNote | null {
    const notes = this.getNotes();
    return notes.find((n) => n.surahNomor === surahNomor && n.ayatNomor === ayatNomor) || null;
  },

  saveNote(noteData: Omit<PersonalNote, 'id' | 'createdAt' | 'updatedAt'>): void {
    const notes = this.getNotes();
    const id = `${noteData.surahNomor}:${noteData.ayatNomor}`;
    const now = new Date().toISOString();
    const index = notes.findIndex((n) => n.id === id);

    if (index >= 0) {
      notes[index] = {
        ...notes[index],
        note: noteData.note,
        updatedAt: now,
      };
    } else {
      notes.unshift({
        ...noteData,
        id,
        createdAt: now,
        updatedAt: now,
      });
    }

    try {
      localStorage.setItem(KEYS.NOTES, JSON.stringify(notes));
    } catch (e) {
      console.error('Error saving note:', e);
    }
  },

  deleteNote(id: string): void {
    const notes = this.getNotes().filter((n) => n.id !== id);
    localStorage.setItem(KEYS.NOTES, JSON.stringify(notes));
  },

  // --- Last Read Position ---
  getLastRead(): LastReadPosition | null {
    try {
      const data = localStorage.getItem(KEYS.LAST_READ);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveLastRead(position: Omit<LastReadPosition, 'updatedAt'>): void {
    const data: LastReadPosition = {
      ...position,
      updatedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(KEYS.LAST_READ, JSON.stringify(data));
      this.addReadingHistory(position.surahNomor, position.surahNamaLatin, position.surahNamaArab, position.ayatNomor);
      this.recordAyatRead();
    } catch (e) {
      console.error('Error saving last read:', e);
    }
  },

  // --- Reading History ---
  getHistory(): ReadingHistoryItem[] {
    try {
      const data = localStorage.getItem(KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addReadingHistory(
    surahNomor: number,
    surahNamaLatin: string,
    surahNamaArab: string,
    ayatNomor: number
  ): void {
    let history = this.getHistory();
    // Remove if duplicate recent entry for same surah & ayat
    history = history.filter(
      (h) => !(h.surahNomor === surahNomor && h.ayatNomor === ayatNomor)
    );

    history.unshift({
      id: `${surahNomor}:${ayatNomor}:${Date.now()}`,
      surahNomor,
      surahNamaLatin,
      surahNamaArab,
      ayatNomor,
      timestamp: new Date().toISOString(),
    });

    // Keep up to 50 items
    if (history.length > 50) {
      history = history.slice(0, 50);
    }

    try {
      localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error('Error saving history:', e);
    }
  },

  clearHistory(): void {
    localStorage.removeItem(KEYS.HISTORY);
  },

  // --- Tilawah Progress & Daily Goals ---
  getTilawahProgress(): TilawahProgress {
    const today = getTodayString();
    const settings = this.getSettings();

    try {
      const raw = localStorage.getItem(KEYS.TILAWAH_PROGRESS);
      if (raw) {
        const parsed: TilawahProgress = JSON.parse(raw);
        // Check if date changed
        if (parsed.lastActiveDate !== today) {
          // Check streak continuity
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

          let newStreak = parsed.currentStreak || 0;
          if (parsed.lastActiveDate === yesterdayStr && (parsed.dailyHistory?.[yesterdayStr] || 0) >= parsed.dailyTargetAyat) {
            // Keep streak alive
          } else if (parsed.lastActiveDate !== yesterdayStr) {
            newStreak = 0;
          }

          const updated: TilawahProgress = {
            ...parsed,
            todayReadAyat: 0,
            dailyTargetAyat: settings.dailyTargetAyat || 20,
            currentStreak: newStreak,
            lastActiveDate: today,
            dailyHistory: parsed.dailyHistory || {},
          };
          localStorage.setItem(KEYS.TILAWAH_PROGRESS, JSON.stringify(updated));
          return updated;
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Error reading tilawah progress:', e);
    }

    const initial: TilawahProgress = {
      dailyTargetAyat: settings.dailyTargetAyat || 20,
      todayReadAyat: 0,
      currentStreak: 0,
      lastActiveDate: today,
      totalAyatRead: 0,
      dailyHistory: {},
    };
    try {
      localStorage.setItem(KEYS.TILAWAH_PROGRESS, JSON.stringify(initial));
    } catch {
      // ignore
    }
    return initial;
  },

  recordAyatRead(count = 1): void {
    const today = getTodayString();
    const progress = this.getTilawahProgress();

    const todayAyat = (progress.todayReadAyat || 0) + count;
    const totalAyat = (progress.totalAyatRead || 0) + count;
    const dailyHistory = { ...(progress.dailyHistory || {}) };
    dailyHistory[today] = (dailyHistory[today] || 0) + count;

    // Check if daily target just reached to increase streak
    let streak = progress.currentStreak || 0;
    const previouslyMet = (progress.todayReadAyat || 0) >= progress.dailyTargetAyat;
    const currentlyMet = todayAyat >= progress.dailyTargetAyat;

    if (!previouslyMet && currentlyMet) {
      streak += 1;
    }

    const updated: TilawahProgress = {
      ...progress,
      todayReadAyat: todayAyat,
      totalAyatRead: totalAyat,
      currentStreak: streak,
      lastActiveDate: today,
      dailyHistory,
    };

    try {
      localStorage.setItem(KEYS.TILAWAH_PROGRESS, JSON.stringify(updated));
    } catch (e) {
      console.error('Error recording ayat read:', e);
    }
  },

  updateDailyTarget(target: number): void {
    const progress = this.getTilawahProgress();
    progress.dailyTargetAyat = target;
    localStorage.setItem(KEYS.TILAWAH_PROGRESS, JSON.stringify(progress));

    const settings = this.getSettings();
    settings.dailyTargetAyat = target;
    this.saveSettings(settings);
  },

  // --- User Settings ---
  getSettings(): UserSettings {
    try {
      const data = localStorage.getItem(KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: Partial<UserSettings>): UserSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    try {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving settings:', e);
    }
    return updated;
  },

  // --- Favorite Duas ---
  getFavoriteDuas(): string[] {
    try {
      const data = localStorage.getItem(KEYS.FAVORITE_DUAS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  isDuaFavorite(id: string): boolean {
    const list = this.getFavoriteDuas();
    return list.includes(id);
  },

  toggleFavoriteDua(id: string): boolean {
    const list = this.getFavoriteDuas();
    const index = list.indexOf(id);
    let isAdded = false;
    if (index >= 0) {
      list.splice(index, 1);
      isAdded = false;
    } else {
      list.push(id);
      isAdded = true;
    }
    try {
      localStorage.setItem(KEYS.FAVORITE_DUAS, JSON.stringify(list));
    } catch (e) {
      console.error('Error saving favorite dua:', e);
    }
    return isAdded;
  },

  // --- Prayer Step Bookmarks ---
  getBookmarkedPrayerSteps(): string[] {
    try {
      const data = localStorage.getItem(KEYS.BOOKMARKED_PRAYER_STEPS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  isPrayerStepBookmarked(id: string): boolean {
    const list = this.getBookmarkedPrayerSteps();
    return list.includes(id);
  },

  togglePrayerStepBookmark(id: string): boolean {
    const list = this.getBookmarkedPrayerSteps();
    const index = list.indexOf(id);
    let isAdded = false;
    if (index >= 0) {
      list.splice(index, 1);
      isAdded = false;
    } else {
      list.push(id);
      isAdded = true;
    }
    try {
      localStorage.setItem(KEYS.BOOKMARKED_PRAYER_STEPS, JSON.stringify(list));
    } catch (e) {
      console.error('Error saving prayer step bookmark:', e);
    }
    return isAdded;
  },

  // --- Selected City Location ---
  getSelectedCityId(): string {
    return localStorage.getItem(KEYS.SELECTED_CITY_ID) || 'jakarta';
  },

  saveSelectedCityId(cityId: string): void {
    localStorage.setItem(KEYS.SELECTED_CITY_ID, cityId);
  },
};
