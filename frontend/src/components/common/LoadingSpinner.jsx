import React from 'react';

const LoadingSpinner = ({ text = 'Loading...', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`animate-spin rounded-full border-b-2 border-deepBlue-600 ${sizeClasses[size]}`}></div>
      {text && (
        <p className="mt-2 text-sm text-deepBlue-600">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;