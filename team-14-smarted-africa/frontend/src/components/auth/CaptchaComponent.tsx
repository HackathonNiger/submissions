import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';

interface CaptchaComponentProps {
  onSolve: (solved: boolean) => void;
  solved: boolean;
}

const CaptchaComponent: React.FC<CaptchaComponentProps> = ({ onSolve, solved }) => {
  const [isSolving, setIsSolving] = useState(false);
  
  const handleSolve = () => {
    setIsSolving(true);
    setTimeout(() => {
      onSolve(true);
      setIsSolving(false);
    }, 800);
  };

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-700">Security Check</span>
        {solved && <CheckCircle className="text-green-500 w-5 h-5" />}
      </div>
      <div className="h-16 bg-white border border-gray-300 rounded flex items-center justify-center mb-3">
        <span className="text-gray-500 text-sm">I'm not a robot</span>
      </div>
      <button
        type="button"
        onClick={handleSolve}
        disabled={solved || isSolving}
        className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${
          solved 
            ? 'bg-green-500 cursor-default' 
            : isSolving 
              ? 'bg-gray-400' 
              : 'bg-teal-600 hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2'
        }`}
        aria-label={solved ? "CAPTCHA solved" : "Complete CAPTCHA verification"}
      >
        {solved ? "Verified" : isSolving ? "Verifying..." : "Verify"}
      </button>
    </div>
  );
};

export default CaptchaComponent;