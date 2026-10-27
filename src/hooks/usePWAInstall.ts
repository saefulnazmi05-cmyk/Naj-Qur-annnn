import { useEffect, useState, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const STORAGE_KEY_SNOOZE = 'naj_quran_pwa_install_snoozed_until';
const DEFAULT_SNOOZE_HOURS = 24;

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [browserName, setBrowserName] = useState<'chrome' | 'safari' | 'samsung' | 'firefox' | 'edge' | 'other'>('other');
  const [isSnoozed, setIsSnoozed] = useState(false);

  // Check snooze status safely
  const checkSnoozed = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SNOOZE);
      if (!stored) return false;
      const until = parseInt(stored, 10);
      if (isNaN(until)) return false;
      return Date.now() < until;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    // 1. Detect standalone mode accurately
    const checkStandalone = () => {
      const standaloneMedia = window.matchMedia('(display-mode: standalone)').matches;
      const iosStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      const isTwa = document.referrer.includes('android-app://com.najquran.app');
      const installed = standaloneMedia || iosStandalone || isTwa;

      setIsStandalone(installed);
      setIsInstalled(installed);
    };

    checkStandalone();

    // Listen for display mode changes (e.g. user installs or launches)
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsStandalone(true);
        setIsInstalled(true);
      }
    };
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaChange);
    } else {
      mediaQuery.addListener(handleMediaChange);
    }

    // 2. Detect OS & Browser
    const ua = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(ua);
    const isAndroidDevice = /android/.test(ua);

    setIsIOS(isIOSDevice);
    setIsAndroid(isAndroidDevice);

    if (ua.includes('samsungbrowser')) {
      setBrowserName('samsung');
    } else if (ua.includes('edg')) {
      setBrowserName('edge');
    } else if (ua.includes('chrome') && !ua.includes('edg')) {
      setBrowserName('chrome');
    } else if (ua.includes('firefox')) {
      setBrowserName('firefox');
    } else if (ua.includes('safari') && !ua.includes('chrome')) {
      setBrowserName('safari');
    }

    // 3. Check snooze state
    setIsSnoozed(checkSnoozed());

    // 4. Capture beforeinstallprompt event (Chromium, Android Chrome/Edge/Samsung)
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent browser mini-infobar from automatically appearing
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // 5. Capture appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsStandalone(true);
      setDeferredPrompt(null);
      try {
        localStorage.removeItem(STORAGE_KEY_SNOOZE);
      } catch {
        // ignore
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMediaChange);
      } else {
        mediaQuery.removeListener(handleMediaChange);
      }
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [checkSnoozed]);

  // Trigger native install prompt
  const install = async (): Promise<boolean> => {
    if (!deferredPrompt) return false;
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setIsStandalone(true);
        setDeferredPrompt(null);
        try {
          localStorage.removeItem(STORAGE_KEY_SNOOZE);
        } catch {
          // ignore
        }
        return true;
      }
      return false;
    } catch (err) {
      console.warn('Install prompt error:', err);
      return false;
    }
  };

  // Dismiss / Snooze the installation widget
  const snooze = useCallback((hours = DEFAULT_SNOOZE_HOURS) => {
    setIsSnoozed(true);
    try {
      const until = Date.now() + hours * 60 * 60 * 1000;
      localStorage.setItem(STORAGE_KEY_SNOOZE, until.toString());
    } catch {
      // ignore restricted storage
    }
  }, []);

  // Clear snooze (e.g. from Settings or when user explicitly wants to see it)
  const clearSnooze = useCallback(() => {
    setIsSnoozed(false);
    try {
      localStorage.removeItem(STORAGE_KEY_SNOOZE);
    } catch {
      // ignore
    }
  }, []);

  return {
    isInstallable: !!deferredPrompt,
    isInstalled,
    isStandalone,
    isIOS,
    isAndroid,
    browserName,
    isSnoozed,
    install,
    snooze,
    clearSnooze,
  };
}
