import React from 'react';
import { ShieldCheckIcon } from './icons';

export const tiers = [
    { 
        level: 1, 
        name: "Tier 1", 
        description: "Basic account with limited access.",
        dailyLimit: "₦50,000",
        maxBalance: "₦200,000",
        requirements: "Phone Number Verification",
    },
    { 
        level: 2, 
        name: "Tier 2", 
        description: "Increased limits for everyday transactions.",
        dailyLimit: "₦200,000",
        maxBalance: "₦500,000",
        requirements: "BVN & NIN Verification",
        upgradePath: "/kyc/bvn-nin",
    },
    { 
        level: 3, 
        name: "Tier 3", 
        description: "Full access with the highest limits.",
        dailyLimit: "₦5,000,000",
        maxBalance: "Unlimited",
        requirements: "Address Verification",
        upgradePath: "/kyc/address",
    }
];

export const KycTierCard: React.FC<{ tier: (typeof tiers)[0]; currentLevel: number; onUpgrade: () => void; }> = ({ tier, currentLevel, onUpgrade }) => {
    const isCurrent = tier.level === currentLevel;
    const isCompleted = tier.level < currentLevel;
    const canUpgrade = tier.level === currentLevel + 1;
    
    const cardClass = isCurrent 
        ? 'border-2 border-primary bg-primary/5 dark:bg-primary/10' 
        : isCompleted
        ? 'border border-slate-200 dark:border-slate-700 opacity-60'
        : 'border border-slate-200 dark:border-slate-700';

    return (
        <div className={`bg-card-light dark:bg-card-dark p-5 rounded-xl shadow-sm transition-all ${cardClass}`}>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg text-text-light dark:text-text-dark">{tier.name}</h3>
                    <p className="text-xs text-text-muted-light dark:text-text-muted-dark">{tier.description}</p>
                </div>
                {(isCurrent || isCompleted) && (
                    <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${isCurrent ? 'bg-primary/20 text-primary' : 'bg-slate-200 dark:bg-slate-600'}`}>
                        <ShieldCheckIcon />
                        <span>{isCurrent ? 'Current Tier' : 'Completed'}</span>
                    </div>
                )}
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                    <p className="text-text-muted-light dark:text-text-muted-dark">Daily Limit</p>
                    <p className="font-semibold text-text-light dark:text-text-dark">{tier.dailyLimit}</p>
                </div>
                <div>
                    <p className="text-text-muted-light dark:text-text-muted-dark">Max Balance</p>
                    <p className="font-semibold text-text-light dark:text-text-dark">{tier.maxBalance}</p>
                </div>
            </div>
             <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-3">Requires: {tier.requirements}</p>

            {canUpgrade && tier.upgradePath && (
                <button 
                    onClick={onUpgrade} 
                    className="w-full mt-4 h-10 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors"
                >
                    {`Upgrade to ${tier.name}`}
                </button>
            )}
        </div>
    );
};
