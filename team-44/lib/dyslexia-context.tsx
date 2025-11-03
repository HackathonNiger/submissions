"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { getUser, updateUser } from './auth'

interface DyslexiaContextType {
  isDyslexiaMode: boolean
  toggleDyslexiaMode: () => void
}

const DyslexiaContext = createContext<DyslexiaContextType | undefined>(undefined)

export function DyslexiaProvider({ children }: { children: React.ReactNode }) {
  const [isDyslexiaMode, setIsDyslexiaMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const user = getUser()
    if (user?.settings?.dyslexiaFont) {
      setIsDyslexiaMode(true)
      // Apply dyslexia mode to body
      document.body.classList.add('dyslexia-mode')
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      if (isDyslexiaMode) {
        document.body.classList.add('dyslexia-mode')
      } else {
        document.body.classList.remove('dyslexia-mode')
      }
    }
  }, [isDyslexiaMode, mounted])

  const toggleDyslexiaMode = () => {
    const newMode = !isDyslexiaMode
    setIsDyslexiaMode(newMode)
    
    // Update user settings
    const user = getUser()
    if (user) {
      updateUser({
        settings: {
          ...user.settings,
          dyslexiaFont: newMode,
        },
      })
    }
  }

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <DyslexiaContext.Provider value={{ isDyslexiaMode, toggleDyslexiaMode }}>
      {children}
    </DyslexiaContext.Provider>
  )
}

export function useDyslexia() {
  const context = useContext(DyslexiaContext)
  if (context === undefined) {
    throw new Error('useDyslexia must be used within a DyslexiaProvider')
  }
  return context
}
