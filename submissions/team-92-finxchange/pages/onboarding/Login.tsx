import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftIcon } from '../../components/icons';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const title = location.state?.title || "Enter your phone number";


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const hasOnboarded = localStorage.getItem('hasOnboarded');

        if (hasOnboarded === 'true') {
            // User is returning, ask for PIN
            navigate('/pin-login');
        } else {
            // New user, go to OTP verification
            navigate('/otp');
        }
    };

    return (
        <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-background-light dark:bg-background-dark p-6">
            <header className="flex-shrink-0 h-16 flex items-center -ml-2">
                <button onClick={() => navigate(-1)} className="p-2">
                    <ArrowLeftIcon />
                </button>
            </header>
            <main className="flex-1 flex flex-col pt-8">
                <h1 className="text-3xl font-bold text-text-light dark:text-text-dark">{title}</h1>
                <p className="mt-2 text-text-muted-light dark:text-text-muted-dark mb-8">
                    We'll send a code to new users. Existing users will be asked for their PIN.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-text-light dark:text-text-dark">+234</span>
                        <input
                            type="tel"
                            placeholder="801 234 5678"
                            className="w-full h-14 pl-16 pr-4 bg-background-light dark:bg-background-dark border-2 border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none focus:border-primary text-lg font-semibold"
                            required
                        />
                    </div>
                    
                    <div className="flex-grow"></div>

                    <button type="submit" className="w-full h-14 bg-primary text-white text-lg font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30">
                        Continue
                    </button>
                </form>
            </main>
        </div>
    );
};

export default Login;