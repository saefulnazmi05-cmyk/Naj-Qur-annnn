import { APP_CONFIG } from '../config/appConfig';

export interface AudioPlaybackState {
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  progressPercent: number;
  trackType: 'surah' | 'ayat' | null;
  surahNomor: number | null;
  surahNamaLatin: string;
  ayatNomor: number | null;
  reciterId: string;
  reciterName: string;
  audioUrl: string | null;
  error: string | null;
}

type AudioListener = (state: AudioPlaybackState) => void;

class AudioService {
  private audio: HTMLAudioElement | null = null;
  private state: AudioPlaybackState = {
    isPlaying: false,
    isLoading: false,
    currentTime: 0,
    duration: 0,
    progressPercent: 0,
    trackType: null,
    surahNomor: null,
    surahNamaLatin: '',
    ayatNomor: null,
    reciterId: APP_CONFIG.defaultReciterId,
    reciterName: APP_CONFIG.quranReciters[0].name,
    audioUrl: null,
    error: null,
  };
  private listeners: Set<AudioListener> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudio();
    }
  }

  private initAudio() {
    if (this.audio) return;
    this.audio = new Audio();

    this.audio.addEventListener('loadstart', () => {
      this.updateState({ isLoading: true, error: null });
    });

    this.audio.addEventListener('canplay', () => {
      this.updateState({ isLoading: false });
    });

    this.audio.addEventListener('play', () => {
      this.updateState({ isPlaying: true, isLoading: false, error: null });
    });

    this.audio.addEventListener('pause', () => {
      this.updateState({ isPlaying: false });
    });

    this.audio.addEventListener('ended', () => {
      this.updateState({
        isPlaying: false,
        currentTime: 0,
        progressPercent: 0,
      });
    });

    this.audio.addEventListener('timeupdate', () => {
      if (!this.audio) return;
      const currentTime = this.audio.currentTime || 0;
      const duration = this.audio.duration || 0;
      const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
      this.updateState({ currentTime, duration, progressPercent });
    });

    this.audio.addEventListener('error', (e) => {
      const errorMsg = this.audio?.error
        ? `Gagal memutar audio (Kode: ${this.audio.error.code}). Pastikan koneksi internet stabil.`
        : 'Terjadi kesalahan saat memuat berkas audio.';
      this.updateState({
        isPlaying: false,
        isLoading: false,
        error: errorMsg,
      });
      console.warn('Audio error event:', e);
    });
  }

  private updateState(partial: Partial<AudioPlaybackState>) {
    this.state = { ...this.state, ...partial };
    this.notify();
  }

  private notify() {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  public subscribe(listener: AudioListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getState(): AudioPlaybackState {
    return this.state;
  }

  public getReciterName(reciterId: string): string {
    const found = APP_CONFIG.quranReciters.find((r) => r.id === reciterId);
    return found ? found.name : 'Misyari Rasyid Al-Afasi';
  }

  /**
   * Putar audio surat penuh
   */
  public async playSurah(
    surahNomor: number,
    surahNamaLatin: string,
    audioFullMap: Record<string, string>,
    reciterId = this.state.reciterId
  ): Promise<void> {
    this.initAudio();
    if (!this.audio) return;

    // Resolve URL for this reciter
    const url = audioFullMap[reciterId] || audioFullMap['05'] || Object.values(audioFullMap)[0];
    if (!url) {
      this.updateState({
        error: 'URL audio surat tidak tersedia dari penyedia data.',
      });
      return;
    }

    const reciterName = this.getReciterName(reciterId);

    // If already playing this same track, toggle play/pause
    if (
      this.state.audioUrl === url &&
      this.state.trackType === 'surah' &&
      this.state.surahNomor === surahNomor
    ) {
      if (this.state.isPlaying) {
        this.audio.pause();
      } else {
        await this.audio.play().catch((err) => {
          this.updateState({ error: `Gagal memutar audio: ${err.message}` });
        });
      }
      return;
    }

    // Switch track
    this.audio.pause();
    this.audio.src = url;
    this.audio.load();

    this.updateState({
      trackType: 'surah',
      surahNomor,
      surahNamaLatin,
      ayatNomor: null,
      reciterId,
      reciterName,
      audioUrl: url,
      currentTime: 0,
      duration: 0,
      progressPercent: 0,
      isLoading: true,
      error: null,
    });

    try {
      await this.audio.play();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Pemutaran diblokir oleh browser';
      this.updateState({
        isPlaying: false,
        isLoading: false,
        error: `Gagal memutar: ${msg}`,
      });
    }
  }

  /**
   * Putar audio ayat tertentu
   */
  public async playAyat(
    surahNomor: number,
    surahNamaLatin: string,
    ayatNomor: number,
    audioAyatMap: Record<string, string>,
    reciterId = this.state.reciterId
  ): Promise<void> {
    this.initAudio();
    if (!this.audio) return;

    const url = audioAyatMap[reciterId] || audioAyatMap['05'] || Object.values(audioAyatMap)[0];
    if (!url) {
      this.updateState({
        error: `Audio ayat ${ayatNomor} tidak tersedia dari penyedia data.`,
      });
      return;
    }

    const reciterName = this.getReciterName(reciterId);

    if (
      this.state.audioUrl === url &&
      this.state.trackType === 'ayat' &&
      this.state.surahNomor === surahNomor &&
      this.state.ayatNomor === ayatNomor
    ) {
      if (this.state.isPlaying) {
        this.audio.pause();
      } else {
        await this.audio.play().catch((err) => {
          this.updateState({ error: `Gagal memutar audio: ${err.message}` });
        });
      }
      return;
    }

    this.audio.pause();
    this.audio.src = url;
    this.audio.load();

    this.updateState({
      trackType: 'ayat',
      surahNomor,
      surahNamaLatin,
      ayatNomor,
      reciterId,
      reciterName,
      audioUrl: url,
      currentTime: 0,
      duration: 0,
      progressPercent: 0,
      isLoading: true,
      error: null,
    });

    try {
      await this.audio.play();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Pemutaran dicegah browser';
      this.updateState({
        isPlaying: false,
        isLoading: false,
        error: `Gagal memutar ayat: ${msg}`,
      });
    }
  }

  public pause() {
    if (this.audio && this.state.isPlaying) {
      this.audio.pause();
    }
  }

  public async resume() {
    if (this.audio && !this.state.isPlaying && this.state.audioUrl) {
      try {
        await this.audio.play();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Kesalahan pemutaran';
        this.updateState({ error: msg });
      }
    }
  }

  public seek(percent: number) {
    if (this.audio && this.audio.duration) {
      const targetTime = (percent / 100) * this.audio.duration;
      this.audio.currentTime = targetTime;
    }
  }

  public stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio.src = '';
    }
    this.updateState({
      isPlaying: false,
      isLoading: false,
      currentTime: 0,
      duration: 0,
      progressPercent: 0,
      trackType: null,
      surahNomor: null,
      ayatNomor: null,
      audioUrl: null,
      error: null,
    });
  }
}

export const audioService = new AudioService();
