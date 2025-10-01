import { useState } from 'react';
import HomePage from './components/HomePage';
import ResourcesPage from './components/ResourcesPage';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import useVerification from './hooks/useVerification';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const verificationProps = useVerification();

  return (
    <ErrorBoundary>
      <div className="font-sans">
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