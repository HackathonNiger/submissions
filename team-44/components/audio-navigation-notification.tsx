"use client"

import { useAudioNavigation } from '../lib/vosk-audio-navigation-context'

export function AudioNavigationNotification() {
  const { showDeactivationMessage } = useAudioNavigation()

  if (!showDeactivationMessage) return null

  return (
    <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-in slide-in-from-right-5 duration-300">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-white rounded-full"></div>
        <span className="font-medium">Audio Navigation Mode Deactivated</span>
      </div>
    </div>
  )
}
