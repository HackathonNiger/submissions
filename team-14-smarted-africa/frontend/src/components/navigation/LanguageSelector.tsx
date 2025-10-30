import React, { useState } from 'react';
import { Languages } from 'lucide-react';
import { languages } from '../../utils/translations';

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  showAutoDetect: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ currentLanguage, onLanguageChange, showAutoDetect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-700 hover:text-green-600 font-medium"
      >
        <Languages className="w-5 h-5" />
        <span>{languages.find(l => l.code === currentLanguage)?.flag || '🇬🇧'} {languages.find(l => l.code === currentLanguage)?.name}</span>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {showAutoDetect && (
            <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
              Auto-detected
            </div>
          )}
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                onLanguageChange(lang.code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 ${
                currentLanguage === lang.code ? 'bg-green-50 text-green-700' : 'text-gray-700'
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;