import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TransactionConfirmationModal, AuthorizationModal } from '../../layouts/ServicePageLayout';
import { getBalance, subtractFromBalance, addTransaction } from '../../services/transactionService';

const plansByProvider = {
    "Smile Network": [
        { name: "SmileEssential - 25GB", price: 6000 },
        { name: "SmileValue - 40GB", price: 8000 },
        { name: "SmilePower - 60GB", price: 12000 },
    ],
    "Spectranet": [
        { name: "Spectra-MINI - 15GB", price: 5000 },
        { name: "Spectra-MAX - 50GB", price: 10000 },
    ],
    "ipNX": [
        { name: "ipNX Residential Basic", price: 12000 },
        { name: "ipNX Residential Premium", price: 20000 },
    ],
    "NTEL": [
        { name: "NTEL Smartphone L", price: 3000 },
        { name: "NTEL Router XL", price: 7500 },
    ]
};

type Provider = keyof typeof plansByProvider;

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

const Internet: React.FC = () => {
    const navigate = useNavigate();
    const [provider, setProvider] = useState<Provider>('Smile Network');
    const [accountId, setAccountId] = useState('');
    const [plan, setPlan] = useState(plansByProvider[provider][0]);

    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [transactionDetails, setTransactionDetails] = useState<Record<string, string | number>>({});

    const executePayment = () => {
        setIsAuthModalOpen(false);
        const paymentAmount = plan.price;
        const currentBalance = getBalance();

        if (currentBalance < paymentAmount) {
            alert("Insufficient funds to complete this transaction.");
            return;
        }

        subtractFromBalance(paymentAmount);
        addTransaction({
            type: 'debit',
            category: 'internet',
            title: `${provider} Subscription`,
            amount: paymentAmount,
            status: 'Completed'
        });
        
        navigate('/success', {
            state: {
                title: 'Payment Successful!',
                message: `Your payment for the ${plan.name} plan on ${provider} was successful.`,
                primaryActionText: 'Done',
                primaryActionRoute: '/app/dashboard',
                secondaryActionText: 'Pay Again',
                secondaryActionRoute: '/internet'
            },
            replace: true
        });
    };

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        setTransactionDetails({
            "Service": "Internet Subscription",
            "Provider": provider,
            "Account ID": accountId,
            "Plan": plan.name,
            "Amount": `₦${plan.price.toLocaleString()}`
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
        setPlan(plansByProvider[newProvider][0]);
    };

    const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedPlan = plansByProvider[provider].find(p => p.name === e.target.value);
        if (selectedPlan) {
            setPlan(selectedPlan);
        }
    };


    return (
        <>
            <div className="p-6">
                <form onSubmit={handlePayment} className="space-y-6">
                    <SelectField id="provider" label="Select Provider" value={provider} onChange={handleProviderChange}>
                        {Object.keys(plansByProvider).map(p => <option key={p}>{p}</option>)}
                    </SelectField>
                    
                    <InputField id="accountId" label="Account ID / Username" type="text" placeholder="Enter your account ID" value={accountId} onChange={e => setAccountId(e.target.value)} />

                    <SelectField id="plan" label="Select Plan" value={plan.name} onChange={handlePlanChange}>
                        {plansByProvider[provider].map(p => (
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
                title="Confirm Internet Payment"
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

export default Internet;
