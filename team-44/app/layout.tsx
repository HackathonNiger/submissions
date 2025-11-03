import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from '../lib/language-context'
import { DyslexiaProvider } from '../lib/dyslexia-context'
import { AudioNavigationProvider } from '../lib/audio-navigation-context'
import { AudioNavigationNotification } from '../components/audio-navigation-notification'
import './globals.css'
import { VoskAudioNavigationProvider } from '@/lib/vosk-audio-navigation-context'

export const metadata: Metadata = {
  title: 'Learnbridge - Math in Your Language',
  description: 'Inclusive, voice-activated math learning app for children in Hausa, Kanuri, Arabic, and English',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <LanguageProvider>
          <DyslexiaProvider>
            <VoskAudioNavigationProvider>
              {children}
              <AudioNavigationNotification />
            </VoskAudioNavigationProvider>
          </DyslexiaProvider>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}