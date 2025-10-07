
import React, { useState } from 'react';
import { UKFlagIcon, NigeriaFlagIcon, CheckIcon } from '../components/icons';

interface Language {
    name: string;
    code: string;
    icon: React.ReactNode;
}

const languages: Language[] = [
    { name: 'English', code: 'en', icon: <UKFlagIcon className="w-6 h-5 rounded-sm" /> },
    { name: 'Hausa', code: 'ha', icon: <NigeriaFlagIcon className="w-6 h-5 rounded-sm" /> },
    { name: 'Igbo', code: 'ig', icon: <NigeriaFlagIcon className="w-6 h-5 rounded-sm" /> },
    { name: 'Yoruba', code: 'yo', icon: <NigeriaFlagIcon className="w-6 h-5 rounded-sm" /> },
    { name: 'Pidgin', code: 'pcm', icon: <NigeriaFlagIcon className="w-6 h-5 rounded-sm" /> },
];

const LanguageSettings: React.FC = () => {
    const [selectedLanguage, setSelectedLanguage] = useState('en');

    return (
        <div className="p-4">
            <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm">
                {languages.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => setSelectedLanguage(lang.code)}
                        className="w-full text-left flex items-center p-4 border-b border-slate-100 dark:border-slate-700/50 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                        <div className="mr-4">{lang.icon}</div>
                        <span className="flex-1 font-semibold text-text-light dark:text-text-dark">{lang.name}</span>
                        {selectedLanguage === lang.code && (
                            <div className="text-primary">
                                <CheckIcon />
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default LanguageSettings;
