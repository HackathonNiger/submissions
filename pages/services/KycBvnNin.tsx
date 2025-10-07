import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const InputField: React.FC<{ label: string; type: string; placeholder: string; id: string; minLength?: number; maxLength?: number; }> = (props) => (
    <div>
        <label htmlFor={props.id} className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">{props.label}</label>
        <input 
            type={props.type} 
            id={props.id} 
            placeholder={props.placeholder}
            minLength={props.minLength}
            maxLength={props.maxLength}
            className="w-full h-12 px-4 bg-background-light dark:bg-background-dark border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" 
            required
        />
    </div>
);


const KycBvnNin: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { fromOnboarding } = (location.state as { fromOnboarding?: boolean }) || {};
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API call and verification
        localStorage.setItem('kycLevel', '2');
        
        if (fromOnboarding) {
            localStorage.setItem('hasOnboarded', 'true');
            alert('Verification successful! Welcome to FinXchange.');
            navigate('/app/dashboard', { replace: true });
        } else {
            alert('Verification successful! Your account has been upgraded to Tier 2.');
            navigate('/kyc');
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-text-light dark:text-text-dark">Upgrade to Tier 2</h2>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-1">Provide your BVN and NIN to increase your limits.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <InputField 
                    id="bvn" 
                    label="Bank Verification Number (BVN)" 
                    type="tel" 
                    placeholder="Enter your 11-digit BVN"
                    minLength={11}
                    maxLength={11}
                />
                <InputField 
                    id="nin" 
                    label="National Identification Number (NIN)" 
                    type="tel" 
                    placeholder="Enter your 11-digit NIN" 
                    minLength={11}
                    maxLength={11}
                />
                
                <p className="text-xs text-text-muted-light dark:text-text-muted-dark text-center">
                    By submitting, you agree to allow FinXchange to verify your identity.
                </p>

                <button type="submit" className="w-full h-14 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30">
                    Submit for Verification
                </button>
            </form>
        </div>
    );
};

export default KycBvnNin;