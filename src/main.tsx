import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register service worker with auto-update
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('Naj Qur’an: Versi terbaru tersedia.');
  },
  onOfflineReady() {
    console.log('Naj Qur’an: Siap digunakan secara offline.');
  },
});

createRoot(document.getElementById('root')!).render(<App />);
