import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { KycTierCard, tiers } from '../components/KycTier';

const getKycLevel = () => {
    const level = localStorage.getItem('kycLevel');
    return level ? parseInt(level, 10) : 1;
};

const KYC: React.FC = () => {
    const navigate = useNavigate();
    const [currentLevel, setCurrentLevel] = useState(getKycLevel());
    
    // This effect can be used to refresh the component if the user navigates back
    useEffect(() => {
        const handleFocus = () => setCurrentLevel(getKycLevel());
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, []);

    const handleUpgrade = (path?: string) => {
        if (path) {
            navigate(path);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold text-text-light dark:text-text-dark mb-2">KYC & Limits</h1>
            <p className="text-text-muted-light dark:text-text-muted-dark mb-6">
                Upgrade your account tier to increase your transaction limits.
            </p>

            <div className="space-y-4">
                {tiers.map(tier => (
                    <KycTierCard 
                        key={tier.level}
                        tier={tier}
                        currentLevel={currentLevel}
                        onUpgrade={() => handleUpgrade(tier.upgradePath)}
                    />
                ))}
            </div>
        </div>
    );
};

export default KYC;