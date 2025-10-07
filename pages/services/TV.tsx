import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TransactionConfirmationModal, AuthorizationModal } from '../../layouts/ServicePageLayout';
import { getBalance, subtractFromBalance, addTransaction } from '../../services/transactionService';

const tvPlans = {
    'DSTV': [
        { name: 'DSTV Compact', price: 9000 },
        { name: 'DSTV Premium', price: 21000 },
        { name: 'DSTV Yanga', price: 2950 }
    ],
    'GOTV': [
        { name: 'GOTV Max', price: 4150 },
        { name: 'GOTV Jolli', price: 2800 }
    ],
    'StarTimes': [
        { name: 'StarTimes Nova', price: 900 },
        { name: 'StarTimes Basic', price: 1700 }
    ]
};

const InputField: React.FC<{ label: string; type: string; placeholder: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({ label, type, placeholder, id, value, onChange }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">{label}</label>
        <input 
            type={type} 
            id={id} 
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full h-12 px-4 bg-background-light dark:bg-background-dark border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" 
            required
        />
    </div>
);

const SelectField: React.FC<{ label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; children: React.ReactNode; }> = ({ label, id, value, onChange, children }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">{label}</label>
        <select 
            id={id}
            value={value}
            onChange={onChange}
            className="w-full h-12 px-3 bg-background-light dark:bg-background-dark border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none appearance-none"
            required
        >
            {children}
        </select>
    </div>
);

type Provider = 'DSTV' | 'GOTV' | 'StarTimes';

const TV: React.FC = () => {
    const navigate = useNavigate();
    const [provider, setProvider] = useState<Provider>('DSTV');
    const [smartcard, setSmartcard] = useState('');
    const [plan, setPlan] = useState<{name: string; price: number}>(tvPlans.DSTV[0]);

    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [transactionDetails, setTransactionDetails] = useState<Record<string, string | number>>({});

    const executePayment = () => {
        setIsAuthModalOpen(false);
        const purchaseAmount = plan.price;
        const currentBalance = getBalance();

        if (currentBalance < purchaseAmount) {
            alert("Insufficient funds to complete this transaction.");
            return;
        }

        subtractFromBalance(purchaseAmount);
        addTransaction({
            type: 'debit',
            category: 'tv',
            title: `${provider} Subscription`,
            amount: purchaseAmount,
            status: 'Completed'
        });
        
        navigate('/success', {
            state: {
                title: 'Payment Successful!',
                message: `Your payment for the ${plan.name} plan on ${provider} (IUC: ${smartcard}) was successful.`,
                primaryActionText: 'Done',
                primaryActionRoute: '/app/dashboard',
                secondaryActionText: 'Pay Again',
                secondaryActionRoute: '/tv'
            },
            replace: true
        });
    };

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        setTransactionDetails({
            "Service": "TV Subscription",
            "Provider": provider,
            "Smartcard/IUC": smartcard,
            "Plan": plan.name,
            "Amount": `₦${plan.price.toLocaleString()}`,
        });
        setIsConfirmationModalOpen(true);
    };

    const handleConfirmAndProceed = () => {
        setIsConfirmationModalOpen(false);
        setIsAuthModalOpen(true);
    };

    const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newProvider = e.target.value as Provider;
        setProvider(newProvider);
        setPlan(tvPlans[newProvider][0]);
    };

    const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedPlan = tvPlans[provider].find(p => p.name === e.target.value);
        if (selectedPlan) {
            setPlan(selectedPlan);
        }
    };

    return (
        <>
            <div className="p-6">
                <form onSubmit={handlePayment} className="space-y-6">
                    <SelectField id="provider" label="Select Provider" value={provider} onChange={handleProviderChange}>
                        <option>DSTV</option>
                        <option>GOTV</option>
                        <option>StarTimes</option>
                    </SelectField>
                    
                    <InputField id="smartcard" label="Smartcard Number / IUC" type="text" placeholder="Enter your smartcard number" value={smartcard} onChange={e => setSmartcard(e.target.value)} />

                    <SelectField id="plan" label="Select Plan / Bouquet" value={plan.name} onChange={handlePlanChange}>
                       {tvPlans[provider].map(p => (
                            <option key={p.name} value={p.name}>{p.name} - ₦{p.price.toLocaleString()}</option>
                       ))}
                    </SelectField>

                    <button type="submit" className="w-full h-14 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30">
                        Pay Subscription
                    </button>
                </form>
            </div>
            <TransactionConfirmationModal
                isOpen={isConfirmationModalOpen}
                onClose={() => setIsConfirmationModalOpen(false)}
                onConfirm={handleConfirmAndProceed}
                title="Confirm TV Payment"
                details={transactionDetails}
            />
            <AuthorizationModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onConfirm={executePayment}
                title="Authorize Payment"
                details={transactionDetails}
            />
        </>
    );
};

export default TV;
