import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '../../components/icons';

const OTP: React.FC = () => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);
        
        // Focus next input
        if (element.nextSibling && element.value) {
            (element.nextSibling as HTMLInputElement).focus();
        }

        // Auto-submit when all fields are filled
        if (newOtp.every(digit => digit !== "")) {
            handleSubmit();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !otp[index] && inputsRef.current[index - 1]) {
            inputsRef.current[index-1]?.focus();
        }
    };
    
    const handleSubmit = () => {
        // Simulate verification
        console.log("Verifying OTP:", otp.join(""));
        navigate('/pin-setup');
    };

    return (
        <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-background-light dark:bg-background-dark p-6">
            <header className="flex-shrink-0 h-16 flex items-center -ml-2">
                <button onClick={() => navigate(-1)} className="p-2">
                    <ArrowLeftIcon />
                </button>
            </header>
            <main className="flex-1 flex flex-col pt-8">
                <h1 className="text-3xl font-bold text-text-light dark:text-text-dark">Verify your account</h1>
                <p className="mt-2 text-text-muted-light dark:text-text-muted-dark mb-8">Enter the 6-digit code we sent to your phone.</p>

                <div className="flex justify-between space-x-2 mb-8">
                    {otp.map((data, index) => (
                        <input
                            key={index}
                            type="text"
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
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                        Didn't receive a code? <button className="font-bold text-primary">Resend</button>
                    </p>
                </div>
                
                <div className="flex-grow"></div>

                <button onClick={handleSubmit} className="w-full h-14 bg-primary text-white text-lg font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30">
                    Verify
                </button>
            </main>
        </div>
    );
};

export default OTP;