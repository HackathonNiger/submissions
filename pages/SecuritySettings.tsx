
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, KeypadIcon, LockClosedIcon, BiometricIcon, TransactionsIcon } from '../components/icons';

const ToggleSwitch: React.FC = () => {
    const [isEnabled, setIsEnabled] = useState(true);
    return (
        <button
            onClick={() => setIsEnabled(!isEnabled)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${isEnabled ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
        >
            <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isEnabled ? 'translate-x-6' : 'translate-x-1'}`}
            />
        </button>
    );
};

const SecurityMenuItem: React.FC<{ icon: React.ReactNode; children: React.ReactNode; to?: string; hasToggle?: boolean }> = ({ icon, children, to, hasToggle }) => {
    const content = (
        <div className="w-full text-left flex items-center p-4 border-b border-slate-100 dark:border-slate-700/50 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div className="text-primary mr-4">{icon}</div>
            <span className="flex-1 font-semibold text-text-light dark:text-text-dark">{children}</span>
            {hasToggle ? <ToggleSwitch /> : <div className="text-text-muted-light dark:text-text-muted-dark"><ChevronRightIcon /></div>}
        </div>
    );
    return to ? <Link to={to}>{content}</Link> : <div className="cursor-pointer">{content}</div>;
};

const SecuritySettings: React.FC = () => {
    return (
        <div className="p-4">
            <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm">
                <SecurityMenuItem icon={<KeypadIcon />} to="/change-pin">Change Transaction PIN</SecurityMenuItem>
                <SecurityMenuItem icon={<LockClosedIcon />} to="/change-password">Change Password</SecurityMenuItem>
                <SecurityMenuItem icon={<BiometricIcon />} hasToggle>Biometric Login</SecurityMenuItem>
            </div>
            <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm mt-6">
                 <SecurityMenuItem icon={<TransactionsIcon />} to="/login-history">Login History</SecurityMenuItem>
            </div>
        </div>
    );
};

export default SecuritySettings;