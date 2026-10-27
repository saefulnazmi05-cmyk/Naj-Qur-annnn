import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: [
          'favicon.png',
          'apple-touch-icon.png',
          'logo.png',
          '.well-known/assetlinks.json',
        ],
        manifest: {
          id: '/',
          name: 'Naj Qur’an',
          short_name: 'Naj Quran',
          description: 'Naj Qur’an — Platform Al-Qur’an dan Ibadah Digital yang akurat, nyaman, dan berorientasi pada ketenangan.',
          theme_color: '#003B2E',
          background_color: '#FFFEFA',
          display: 'standalone',
          display_override: ['window-controls-overlay', 'standalone', 'minimal-ui'],
          orientation: 'portrait-primary',
          start_url: '/',
          scope: '/',
          categories: ['books', 'lifestyle', 'education', 'utilities'],
          prefer_related_applications: false,
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
          shortcuts: [
            {
              name: 'Al-Qur’an 114 Surat',
              short_name: 'Al-Qur’an',
              description: 'Buka daftar 114 surat dan pembaca ayat suci Al-Qur’an',
              url: '/?view=surahs',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }],
            },
            {
              name: 'Jadwal Salat Lima Waktu',
              short_name: 'Jadwal Salat',
              description: 'Hisab waktu salat dan hitung mundur salat berikutnya',
              url: '/?view=prayer-times',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }],
            },
            {
              name: 'Kompas Arah Kiblat',
              short_name: 'Arah Kiblat',
              description: 'Penunjuk arah kiblat akurat menuju Ka’bah',
              url: '/?view=qibla',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }],
            },
            {
              name: 'Kumpulan Doa Harian',
              short_name: 'Doa Harian',
              description: 'Koleksi doa ma’tsur sahih dan doa pilihan Al-Qur’an',
              url: '/?view=duas',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }],
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,json}'],
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: true,
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 15,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/equran\.id\/api\/v2\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'equran-api-cache',
                networkTimeoutSeconds: 5,
                expiration: {
                  maxEntries: 250,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: true,
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve('.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
