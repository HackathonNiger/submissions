import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const ErrorAlert = ({ error, errors, onClose }) => {
  // Don't render if no error
  if (!error && (!errors || errors.length === 0)) {
    return null;
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className="w-5 h-5 text-red-600" />
        </div>
        
        <div className="ml-3 flex-1">
          {/* Main error message */}
          {error && (
            <h3 className="text-sm font-medium text-red-800 mb-1">
              {error}
            </h3>
          )}
          
          {/* Validation errors list */}
          {errors && errors.length > 0 && (
            <div className="mt-2">
              <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                {errors.map((err, index) => (
                  <li key={index}>
                    <span className="font-medium">{err.field}:</span> {err.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* Close button */}
        {onClose && (
          <div className="ml-auto pl-3">
            <button
              onClick={onClose}
              className="inline-flex text-red-400 hover:text-red-600 focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorAlert;