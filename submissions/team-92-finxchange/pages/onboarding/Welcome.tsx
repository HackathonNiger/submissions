
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NigeriaFlagIcon, UKFlagIcon, LanguageIcon } from '../../components/icons';

const Welcome: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="relative flex flex-col h-screen w-full max-w-md mx-auto bg-background-light dark:bg-background-dark p-6">
            <div className="absolute top-6 right-6">
                <div className="relative">
                    <select className="pl-8 pr-4 py-2 text-sm font-semibold bg-slate-100 dark:bg-slate-800 rounded-full appearance-none focus:outline-none focus:ring-2 focus:ring-primary">
                        <option>English</option>
                        <option>Hausa</option>
                        <option>Yoruba</option>
                        <option>Igbo</option>
                        <option>Pidgin</option>
                    </select>
                    <UKFlagIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-4" />
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center">
                 <div className="opay-gradient w-24 h-24 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-primary/30">
                    <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 10v-1m-6.364-3.636L4.636 12m14.728 0l-1.002.001M17.657 6.343L16.657 7.343m-9.314 9.314l-1 1M12 21a9 9 0 110-18 9 9 0 010 18z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    </svg>
                </div>
                <h1 className="text-4xl font-bold text-text-light dark:text-text-dark">Welcome to FinXchange</h1>
                <p className="mt-2 text-lg text-text-muted-light dark:text-text-muted-dark">Your secure and seamless digital wallet.</p>
            </div>

            <div className="flex flex-col gap-4">
                <button 
                    onClick={() => navigate('/create-account')}
                    className="w-full h-14 bg-primary text-white text-lg font-bold rounded-lg shadow-md hover:bg-primary/90 transition-transform transform hover:scale-105"
                >
                    Create Account
                </button>
                <button 
                    onClick={() => navigate('/sign-in')}
                    className="w-full h-14 bg-slate-200 dark:bg-slate-700 text-text-light dark:text-text-dark text-lg font-bold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                    Sign In
                </button>
            </div>
        </div>
    );
};

export default Welcome;
