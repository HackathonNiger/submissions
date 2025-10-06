import { useState } from 'react';
import HomePage from './components/HomePage';
import ResourcesPage from './components/ResourcesPage';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import useVerification from './hooks/useVerification';
import usePWAInstall from './hooks/usePWAInstall';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [showInstallPrompt, setShowInstallPrompt] = useState(true);
  const verificationProps = useVerification();
  const { isInstallable, isInstalled, installApp } = usePWAInstall();

  const handleInstallDismiss = () => {
    setShowInstallPrompt(false)
    localStorage.setItem('pwa-prompt-seen', 'true')
  }

  return (
    <ErrorBoundary>
      <div className="font-sans">
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
      </div>
    </ErrorBoundary>
  );
};

export default App