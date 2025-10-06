import { useState } from 'react';
import HomePage from './components/HomePage';
import ResourcesPage from './components/ResourcesPage';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import useVerification from './hooks/useVerification';
import usePWAInstall from './hooks/usePWAInstall';
import useOfflineData from './hooks/useOfflineData';
import { Analytics } from "@vercel/analytics/react"

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [showInstallPrompt, setShowInstallPrompt] = useState(true);
  const verificationProps = useVerification();
  const { isInstallable, isInstalled, installApp } = usePWAInstall();
  const { isOnline, lastSync, syncInProgress } = useOfflineData();

  const handleInstallDismiss = () => {
    setShowInstallPrompt(false)
    localStorage.setItem('pwa-prompt-seen', 'true')
  }

  return (
    <ErrorBoundary>
      <div className="font-sans">
        {!isOnline && (
          <div className="bg-yellow-500 text-white text-center py-2 px-4">
            <div className="flex items-center justify-center space-x-2">
              <span>⚠️ You're offline. Some features may be limited.</span>
              {lastSync && (
                <span className="text-sm">
                  Last sync: {new Date(lastSync).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        )}
        {isOnline && lastSync && (
          <div className="bg-green-500 text-white text-center py-1 px-4 text-sm">
            <span>✅ Online - Data synced: {new Date(lastSync).toLocaleDateString()}</span>
            {syncInProgress && <span className="ml-2">Syncing...</span>}
          </div>
        )}
        <PWAInstallPrompt
          isInstallable={isInstallable && showInstallPrompt}
          isInstalled={isInstalled}
          onInstall={installApp}
          onDismiss={handleInstallDismiss}
        />
        {currentPage === 'home' ? (
          <HomePage
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            {...verificationProps}
          />
        ) : (
          <ResourcesPage
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            resetVerification={verificationProps.resetVerification}
          />
        )}
        <Footer />
        <Analytics/>
      </div>
    </ErrorBoundary>
  );
};

export default App