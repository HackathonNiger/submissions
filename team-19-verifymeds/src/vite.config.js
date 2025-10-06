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
        icons: [
          {
            src: '/VerifyMeds1.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/VerifyMeds1.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
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
