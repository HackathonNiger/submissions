import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, BiometricIcon, SpinnerIcon } from '../../components/icons';

const PinLogin: React.FC = () => {
    const navigate = useNavigate();
    const [pin, setPin] = useState<string[]>(new Array(6).fill(""));
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
    const [biometricStatus, setBiometricStatus] = useState<'checking' | 'failed' | 'success'>('checking');

    const handleLoginSuccess = () => {
        setBiometricStatus('success');
        navigate('/app/dashboard', { replace: true });
    };

    // Simulate biometric check on component mount
    useEffect(() => {
        const tryBiometricAuth = () => {
            return new Promise<boolean>(resolve => {
                setTimeout(() => {
                    const success = Math.random() > 0.5; // 50% success for demo
                    resolve(success);
                }, 1500);
            });
        };

        const attemptBiometricLogin = async () => {
            const success = await tryBiometricAuth();
            if (success) {
                handleLoginSuccess();
            } else {
                setBiometricStatus('failed');
            }
        };

        attemptBiometricLogin();
    }, [navigate]);


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
            inputsRef.current[index-1]?.focus();
        }
    };
    
    // Auto-submit when all fields are filled
    useEffect(() => {
        if (pin.every(digit => digit !== "")) {
            const timer = setTimeout(() => {
                handleLoginSuccess();
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [pin]);

    const renderBiometricPrompt = () => (
        <div className="flex flex-col items-center justify-center flex-1 text-center">
            <BiometricIcon className="w-16 h-16 text-primary mb-4" />
            <h1 className="text-2xl font-bold text-text-light dark:text-text-dark">Signing in...</h1>
            <p className="mt-2 text-text-muted-light dark:text-text-muted-dark">Use Face ID / Touch ID</p>
            <SpinnerIcon className="w-8 h-8 text-primary mt-6" />
        </div>
    );
    
    const renderPinInput = () => (
        <>
            <h1 className="text-3xl font-bold text-text-light dark:text-text-dark">Enter your PIN</h1>
            <p className="mt-2 text-text-muted-light dark:text-text-muted-dark mb-8">
                Biometric failed. Please enter your PIN to continue.
            </p>

            <div className="flex justify-center space-x-2 mb-8">
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
                        className="w-12 h-14 text-center text-2xl font-bold bg-slate-100 dark:bg-slate-800 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-primary focus:outline-none focus:border-primary"
                    />
                ))}
            </div>
            
            <div className="text-center">
                <button className="text-sm font-bold text-primary">Forgot PIN?</button>
            </div>
        </>
    );

    return (
        <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-background-light dark:bg-background-dark p-6">
            <header className="flex-shrink-0 h-16 flex items-center -ml-2">
                <button onClick={() => navigate(-1)} className="p-2">
                    <ArrowLeftIcon />
                </button>
            </header>
            <main className="flex-1 flex flex-col pt-8">
                {biometricStatus === 'checking' ? renderBiometricPrompt() : renderPinInput()}
                
                <div className="flex-grow"></div>

                <p className="text-center text-sm text-text-muted-light dark:text-text-muted-dark">
                    Not you? <button onClick={() => navigate('/welcome', { replace: true })} className="font-bold text-primary">Switch Account</button>
                </p>
            </main>
        </div>
    );
};

export default PinLogin;