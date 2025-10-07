import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashScreen: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            const hasOnboarded = localStorage.getItem('hasOnboarded');
            if (hasOnboarded === 'true') {
                navigate('/app/dashboard', { replace: true });
            } else {
                navigate('/welcome', { replace: true });
            }
        }, 2000); // 2-second splash screen

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="relative flex flex-col h-screen w-full bg-background-light dark:bg-background-dark items-center justify-center p-8 text-center">
            <div className="opay-gradient w-24 h-24 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-primary/30">
                <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 10v-1m-6.364-3.636L4.636 12m14.728 0l-1.002.001M17.657 6.343L16.657 7.343m-9.314 9.314l-1 1M12 21a9 9 0 110-18 9 9 0 010 18z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
            </div>
            <h1 className="text-4xl font-bold text-text-light dark:text-text-dark">FinXchange</h1>
            <p className="mt-2 text-lg text-text-muted-light dark:text-text-muted-dark">Welcome to your Digital Wallet</p>
        </div>
    );
};

export default SplashScreen;
