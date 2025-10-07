import React from 'react';
import { useNavigate } from 'react-router-dom';
import { KycTierCard, tiers } from '../../components/KycTier';

const KycOnboarding: React.FC = () => {
    const navigate = useNavigate();
    const currentLevel = 1; // Always tier 1 at this stage

    const handleSkip = () => {
        localStorage.setItem('hasOnboarded', 'true');
        navigate('/app/dashboard', { replace: true });
    };
    
    const handleUpgrade = (path?: string) => {
        if (path) {
            navigate(path, { state: { fromOnboarding: true } });
        }
    };

    return (
        <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-background-light dark:bg-background-dark p-6">
            <main className="flex-1 flex flex-col pt-8 overflow-y-auto">
                <h1 className="text-3xl font-bold text-text-light dark:text-text-dark">Verify Your Identity</h1>
                <p className="mt-2 text-text-muted-light dark:text-text-muted-dark mb-8">
                    Unlock higher transaction limits by completing your profile. You can also do this later from the "Me" page.
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
            </main>

            <footer className="pt-4 flex-shrink-0">
                <button 
                    onClick={handleSkip}
                    className="w-full h-14 bg-slate-200 dark:bg-slate-700 text-text-light dark:text-text-dark text-lg font-bold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                    Maybe Later
                </button>
            </footer>
        </div>
    );
};

export default KycOnboarding;
