import { useState, useEffect } from 'react'
import { X, Download, Smartphone } from 'lucide-react'

const PWAInstallPrompt = ({ isInstallable, isInstalled, onInstall, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissing, setIsDismissing] = useState(false)

  useEffect(() => {
    // Check if user has already seen the prompt
    const hasSeenPrompt = localStorage.getItem('pwa-prompt-seen')
    const isFirstVisit = !hasSeenPrompt && !isInstalled
    
    if (isInstallable && isFirstVisit) {
      // Show prompt after a short delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isInstallable, isInstalled])

  const handleInstall = async () => {
    const success = await onInstall()
    if (success) {
      setIsVisible(false)
    }
  }

  const handleDismiss = () => {
    setIsDismissing(true)
    setTimeout(() => {
      setIsVisible(false)
      onDismiss()
    }, 300) // Match transition duration
  }

  if (!isVisible || isInstalled) {
    return null
  }

  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 transform ${
        isDismissing ? 'translate-y-[-100%]' : 'translate-y-0'
      }`}
    >
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-white">
                Install VerifyMeds App
              </h3>
              <p className="text-sm text-blue-100 mt-0.5">
                Get quick access to medicine verification right from your home screen
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleInstall}
              className="inline-flex items-center px-4 py-2 bg-white text-blue-600 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
            >
              <Download className="w-4 h-4 mr-2" />
              Install App
            </button>
            <button
              onClick={handleDismiss}
              className="p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
              aria-label="Dismiss installation prompt"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PWAInstallPrompt