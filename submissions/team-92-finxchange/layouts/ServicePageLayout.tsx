import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, XIcon, BiometricIcon, SpinnerIcon, KeypadIcon } from '../components/icons';

// A simple utility to format the path into a readable title
const formatTitle = (pathname: string): string => {
    const parts = pathname.split('/').pop()?.split('-') ?? ['Service'];
    return parts.map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
};


// --- Reusable Transaction Confirmation Modal ---
interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    details: Record<string, string | number>;
}

export const TransactionConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, details }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-2xl w-full max-w-sm">
                <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg font-bold text-text-light dark:text-text-dark">{title}</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                        <XIcon />
                    </button>
                </div>
                <div className="p-6">
                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl space-y-2 text-left mb-6">
                        {Object.entries(details).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-baseline">
                                <span className="text-text-muted-light dark:text-text-muted-dark text-sm">{key}:</span>
                                <span className={`font-semibold text-text-light dark:text-text-dark text-right ${key.toLowerCase().includes('total') || key.toLowerCase().includes('amount') ? 'text-xl text-primary' : 'text-md'}`}>{value}</span>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={onClose} className="w-full h-12 bg-slate-200 dark:bg-slate-600 text-text-light dark:text-text-dark text-lg font-bold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">
                            Cancel
                        </button>
                        <button onClick={onConfirm} className="w-full h-12 bg-primary text-white text-lg font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30">
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
            <style>{`
                 @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
            `}</style>
        </div>
    );
};


// --- Reusable Authorization Modal (PIN / Biometrics) ---
interface AuthorizationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    details: Record<string, string | number>; // Kept for context if needed
}

export const AuthorizationModal: React.FC<AuthorizationModalProps> = ({ isOpen, onClose, onConfirm, title }) => {
    const [pin, setPin] = useState<string[]>(new Array(6).fill(""));
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
    const [authStep, setAuthStep] = useState<'choice' | 'biometric' | 'pin'>('choice');
    const [biometricStatus, setBiometricStatus] = useState<'idle' | 'checking' | 'failed'>('idle');

    // Simulated biometric check
    const tryBiometricAuth = (): Promise<boolean> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const success = Math.random() > 0.3; // 70% success chance for demo
                resolve(success);
            }, 1500);
        });
    };

    const handleBiometricAuth = async () => {
        setAuthStep('biometric');
        setBiometricStatus('checking');
        const success = await tryBiometricAuth();
        if (success) {
            onConfirm();
        } else {
            setBiometricStatus('failed');
            setTimeout(() => {
                setAuthStep('pin');
                setTimeout(() => inputsRef.current[0]?.focus(), 100);
            }, 1000); // Show failed message for 1s before switching to PIN
        }
    };
    
    useEffect(() => {
        if (isOpen) {
            setPin(new Array(6).fill(""));
            setAuthStep('choice');
            setBiometricStatus('idle');
        }
    }, [isOpen]);

    const handleChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return;
        const newPin = [...pin];
        newPin[index] = element.value;
        setPin(newPin);
        if (element.nextSibling && element.value) {
            (element.nextSibling as HTMLInputElement).focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !pin[index] && inputsRef.current[index - 1]) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    useEffect(() => {
        if (authStep === 'pin' && pin.every(digit => digit !== "")) {
            const timer = setTimeout(() => {
                onConfirm();
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [pin, onConfirm, authStep]);

    if (!isOpen) return null;

    const renderChoiceView = () => (
        <div className="p-6 text-center">
            <p className="font-bold text-lg text-text-light dark:text-text-dark mb-6">Choose Authorization Method</p>
            <div className="space-y-3">
                <button onClick={handleBiometricAuth} className="w-full h-14 flex items-center justify-center gap-3 bg-slate-100 dark:bg-slate-700 text-text-light dark:text-text-dark font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                    <BiometricIcon className="w-6 h-6 text-primary" />
                    Use Face ID / Biometrics
                </button>
                <button onClick={() => { setAuthStep('pin'); setTimeout(() => inputsRef.current[0]?.focus(), 100); }} className="w-full h-14 flex items-center justify-center gap-3 bg-slate-100 dark:bg-slate-700 text-text-light dark:text-text-dark font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                    <KeypadIcon className="w-6 h-6 text-primary" />
                    Enter PIN
                </button>
            </div>
        </div>
    );

    const renderBiometricView = () => (
        <div className="flex flex-col items-center justify-center p-6 text-center h-64">
             <BiometricIcon className={`w-16 h-16 mb-4 ${biometricStatus === 'failed' ? 'text-red-500' : 'text-primary'}`} />
             <p className="font-bold text-lg text-text-light dark:text-text-dark">
                {biometricStatus === 'checking' ? 'Confirm with Biometrics' : 'Biometric Failed'}
             </p>
             <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-1 mb-6">
                {biometricStatus === 'checking' ? 'Use Face ID or Touch ID to confirm.' : 'Switching to PIN entry...'}
             </p>
             {biometricStatus === 'checking' && <SpinnerIcon className="w-8 h-8 text-primary" />}
        </div>
    );
    
    const renderPinView = () => (
        <div className="p-6">
            <p className="text-center text-sm font-semibold text-text-muted-light dark:text-text-muted-dark mb-3">
                {biometricStatus === 'failed' ? 'Biometric failed. Please enter your PIN.' : 'Enter your 6-digit PIN to authorize.'}
            </p>
            <div className="flex justify-center space-x-2 mb-4">
                {pin.map((data, index) => (
                    <input
                        key={index}
                        type="password"
                        inputMode="numeric"
                        maxLength={1}
                        value={data}
                        ref={el => inputsRef.current[index] = el}
                        onChange={e => handleChange(e.target, index)}
                        onKeyDown={e => handleKeyDown(e, index)}
                        className="w-10 h-12 text-center text-xl font-bold bg-slate-100 dark:bg-slate-800 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-primary focus:outline-none focus:border-primary"
                    />
                ))}
            </div>
             <div className="text-center mt-4">
                <button className="text-sm font-bold text-primary">Forgot PIN?</button>
            </div>
        </div>
    );

    const renderContent = () => {
        switch(authStep) {
            case 'biometric': return renderBiometricView();
            case 'pin': return renderPinView();
            case 'choice':
            default: return renderChoiceView();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-2xl w-full max-w-sm">
                <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg font-bold text-text-light dark:text-text-dark">{title}</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                        <XIcon />
                    </button>
                </div>
                {renderContent()}
            </div>
        </div>
    );
};


const ServicePageLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const title = formatTitle(location.pathname);

    return (
        <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-background-light dark:bg-background-dark">
            <header className="flex-shrink-0 h-16 flex items-center px-4 bg-card-light dark:bg-card-dark shadow-sm">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 mr-2">
                    <ArrowLeftIcon />
                </button>
                <h1 className="text-lg font-bold text-text-light dark:text-text-dark">{title}</h1>
            </header>
            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default ServicePageLayout;
