import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '../../components/icons';

const PinInput: React.FC<{ length: number }> = ({ length }) => (
    <div className="flex justify-center space-x-3">
        {Array(length).fill(0).map((_, index) => (
             <input
                key={index}
                type="password"
                maxLength={1}
                className="w-12 h-14 text-center text-2xl font-bold bg-slate-100 dark:bg-slate-800 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-primary focus:outline-none focus:border-primary"
            />
        ))}
    </div>
);


const PinSetup: React.FC = () => {
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would add logic to check if pins match
        alert("PIN created successfully!");
        navigate('/kyc-onboarding', { replace: true });
    };

    return (
        <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-background-light dark:bg-background-dark p-6">
            <header className="flex-shrink-0 h-16 flex items-center -ml-2">
                <button onClick={() => navigate(-1)} className="p-2">
                    <ArrowLeftIcon />
                </button>
            </header>
            <main className="flex-1 flex flex-col pt-8">
                <h1 className="text-3xl font-bold text-text-light dark:text-text-dark">Create your PIN</h1>
                <p className="mt-2 text-text-muted-light dark:text-text-muted-dark mb-8">This PIN will be used for all your transactions.</p>

                <form onSubmit={handleSubmit} className="flex flex-col flex-grow space-y-8">
                    <div>
                        <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-2 text-center">Enter 6-digit PIN</label>
                        <PinInput length={6} />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-2 text-center">Confirm PIN</label>
                        <PinInput length={6} />
                    </div>

                    <div className="flex-grow"></div>

                    <button type="submit" className="w-full h-14 bg-primary text-white text-lg font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30">
                        Save PIN
                    </button>
                </form>
            </main>
        </div>
    );
};

export default PinSetup;