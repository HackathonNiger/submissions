import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['VerifyMeds1.png', 'vite.svg'],
      manifest: {
        name: 'VerifyMeds - Medical Verification Platform',
        short_name: 'VerifyMeds',
        description: 'Advanced medical verification platform for medication authenticity and real-time drug information',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        lang: 'en',
        categories: ['medical', 'productivity', 'utilities'],
        icons: [
          {
            src: '/VerifyMeds1.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/VerifyMeds1.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        screenshots: [
          {
            src: '/verifymedshomepage.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide',
            label: 'VerifyMeds Home Screen'
          }
        ],
        permissions: [
          'camera'
        ],
        shortcuts: [
          {
            name: 'Scan Medicine',
            short_name: 'Scan',
            description: 'Quick access to medicine scanning',
            url: '/?action=scan',
            icons: [
              {
                src: '/VerifyMeds1.png',
                sizes: '192x192'
              }
            ]
          },
          {
            name: 'Resources',
            short_name: 'Resources',
            description: 'Access medical resources and information',
            url: '/resources',
            icons: [
              {
                src: '/VerifyMeds1.png',
                sizes: '192x192'
              }
            ]
          }
        ],
        related_applications: [],
        prefer_related_applications: false
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      devOptions: {
        enabled: true
      }
    })
  ],
})
