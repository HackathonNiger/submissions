import React from 'react';
import { ReferralIcon, ProfileIcon } from '../components/icons';

const ReferredFriend: React.FC<{ name: string; status: 'Pending' | 'Completed' }> = ({ name, status }) => (
    <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                <ProfileIcon />
            </div>
            <p className="font-semibold text-sm text-text-light dark:text-text-dark">{name}</p>
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
            {status}
        </span>
    </div>
);

const Referrals: React.FC = () => {
    const referralCode = 'FINX-AB12CD';
    
    const handleCopy = () => {
        navigator.clipboard.writeText(referralCode);
        alert('Referral code copied!');
    };

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold text-text-light dark:text-text-dark mb-2">Refer & Earn</h1>
            <p className="text-text-muted-light dark:text-text-muted-dark mb-6">
                Invite friends to FinXchange and earn ₦500 for each successful referral!
            </p>

            <div className="bg-card-light dark:bg-card-dark p-5 rounded-xl shadow-sm mb-6 text-center">
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Your Referral Code</p>
                <p className="text-3xl font-bold text-primary tracking-widest my-2">{referralCode}</p>
                <button 
                    onClick={handleCopy}
                    className="w-full h-12 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors"
                >
                    Copy Code & Share
                </button>
            </div>
            
            <div>
                <h2 className="text-md font-bold text-text-light dark:text-text-dark mb-3">Your Referrals</h2>
                <div className="space-y-2">
                    <ReferredFriend name="John Doe" status="Completed" />
                    <ReferredFriend name="Jane Smith" status="Pending" />
                </div>
            </div>
        </div>
    );
};

export default Referrals;