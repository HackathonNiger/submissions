import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SuccessPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Default state from internal navigation (e.g., after a transfer)
    const {
        title: stateTitle = 'Success!',
        message: stateMessage = 'Your operation was completed successfully.',
        primaryActionText: statePrimaryActionText = 'Done',
        primaryActionRoute: statePrimaryActionRoute = '/app/dashboard',
        secondaryActionText: stateSecondaryActionText,
        secondaryActionRoute: stateSecondaryActionRoute,
    } = location.state || {};
    
    const [displayData, setDisplayData] = useState({
        title: stateTitle,
        message: stateMessage,
        primaryActionText: statePrimaryActionText,
        primaryActionRoute: statePrimaryActionRoute,
        secondaryActionText: stateSecondaryActionText,
        secondaryActionRoute: stateSecondaryActionRoute,
        isSuccess: true,
    });

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const status = params.get('status');
        const tx_ref = params.get('transaction_ref');

        // If URL params from a payment gateway redirect exist, they take precedence.
        if (status) {
            const success = status.toLowerCase() === 'success';
            setDisplayData({
                title: success ? 'Payment Successful!' : 'Payment Failed',
                message: tx_ref 
                    ? `Your transaction with reference ${tx_ref} was ${success ? 'successful' : 'not completed'}.`
                    : `Your transaction was ${success ? 'successful' : 'not completed'}.`,
                primaryActionText: 'Go to Dashboard',
                primaryActionRoute: '/app/dashboard',
                secondaryActionText: success ? undefined : 'Try Again',
                secondaryActionRoute: success ? undefined : '/add-money',
                isSuccess: success,
            });
        }
    }, [location]);

    const handlePrimaryAction = () => {
        navigate(displayData.primaryActionRoute, { replace: true });
    };

    const handleSecondaryAction = () => {
        if (displayData.secondaryActionRoute) {
            navigate(displayData.secondaryActionRoute, { replace: true });
        }
    };

    const SuccessIcon = () => (
        <svg className="w-full h-full text-primary" viewBox="0 0 52 52">
            <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" stroke="currentColor" strokeWidth="3" />
            <path className="checkmark__check" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" d="M14 27l5.917 4.917L38 18" />
        </svg>
    );

    const FailureIcon = () => (
        <svg className="w-full h-full text-red-500" viewBox="0 0 52 52">
            <circle className="failure__circle" cx="26" cy="26" r="25" fill="none" stroke="currentColor" strokeWidth="3" />
            <path className="failure__cross_1" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" d="M16 16 36 36" />
            <path className="failure__cross_2" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" d="M36 16 16 36" />
        </svg>
    );

    return (
        <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-background-light dark:bg-background-dark p-6 text-center justify-center">
            <div className="w-24 h-24 mx-auto mb-6">
                {displayData.isSuccess ? <SuccessIcon /> : <FailureIcon />}
            </div>
            
            <h1 className="text-3xl font-bold text-text-light dark:text-text-dark">{displayData.title}</h1>
            <p className="mt-2 text-text-muted-light dark:text-text-muted-dark mb-10">{displayData.message}</p>
            
            <div className="flex flex-col gap-4">
                 <button 
                    onClick={handlePrimaryAction}
                    className="w-full h-14 bg-primary text-white text-lg font-bold rounded-lg shadow-md hover:bg-primary/90 transition-transform transform hover:scale-105"
                >
                    {displayData.primaryActionText}
                </button>
                {displayData.secondaryActionText && displayData.secondaryActionRoute && (
                     <button 
                        onClick={handleSecondaryAction}
                        className="w-full h-14 bg-slate-200 dark:bg-slate-700 text-text-light dark:text-text-dark text-lg font-bold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                    >
                        {displayData.secondaryActionText}
                    </button>
                )}
            </div>
            <style>{`
                .checkmark__circle {
                    stroke-dasharray: 166;
                    stroke-dashoffset: 166;
                    animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
                }
                .checkmark__check {
                    transform-origin: 50% 50%;
                    stroke-dasharray: 48;
                    stroke-dashoffset: 48;
                    animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
                }
                @keyframes stroke {
                    100% {
                        stroke-dashoffset: 0;
                    }
                }
                .failure__circle {
                    stroke-dasharray: 166;
                    stroke-dashoffset: 166;
                    animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
                }
                .failure__cross_1 {
                    transform-origin: 50% 50%;
                    stroke-dasharray: 28.28;
                    stroke-dashoffset: 28.28;
                    animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
                }
                .failure__cross_2 {
                    transform-origin: 50% 50%;
                    stroke-dasharray: 28.28;
                    stroke-dashoffset: 28.28;
                    animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.9s forwards;
                }
            `}</style>
        </div>
    );
};

export default SuccessPage;