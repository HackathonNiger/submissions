import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TransactionConfirmationModal, AuthorizationModal } from '../../layouts/ServicePageLayout';
import { getBalance, subtractFromBalance, addTransaction } from '../../services/transactionService';

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

const dataPlans = [
    { plan: "1.5GB - 30 Days", price: 1000 },
    { plan: "2.0GB - 30 Days", price: 1200 },
    { plan: "4.5GB - 30 Days", price: 2000 },
    { plan: "10GB - 30 Days", price: 3500 },
    { plan: "40GB - 30 Days", price: 10000 },
    { plan: "75GB - 30 Days", price: 15000 },
];

const Data: React.FC = () => {
    const navigate = useNavigate();
    const [network, setNetwork] = useState('MTN');
    const [mobileNumber, setMobileNumber] = useState('');
    const [selectedPlan, setSelectedPlan] = useState<(typeof dataPlans)[0] | null>(null);

    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [transactionDetails, setTransactionDetails] = useState<Record<string, string | number>>({});

    const executePurchase = () => {
        setIsAuthModalOpen(false);
        if (!selectedPlan) return;

        const purchaseAmount = selectedPlan.price;
        const currentBalance = getBalance();

        if (currentBalance < purchaseAmount) {
            alert("Insufficient funds to complete this transaction.");
            return;
        }

        subtractFromBalance(purchaseAmount);
        addTransaction({
            type: 'debit',
            category: 'data',
            title: `${network} Data Purchase`,
            amount: purchaseAmount,
            status: 'Completed'
        });

        navigate('/success', {
            state: {
                title: 'Purchase Successful!',
                message: `Data purchase of ${selectedPlan.plan} for ${mobileNumber} was successful.`,
                primaryActionText: 'Done',
                primaryActionRoute: '/app/dashboard',
                secondaryActionText: 'Buy Again',
                secondaryActionRoute: '/data'
            },
            replace: true
        });
    };

    const handlePurchase = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPlan) {
            alert('Please select a data plan.');
            return;
        }
        setTransactionDetails({
            "Service": "Data Purchase",
            "Network": network,
            "Phone Number": mobileNumber,
            "Plan": selectedPlan.plan,
            "Amount": `₦${selectedPlan.price.toLocaleString()}`
        });
        setIsConfirmationModalOpen(true);
    };

    const handleConfirmAndProceed = () => {
        setIsConfirmationModalOpen(false);
        setIsAuthModalOpen(true);
    };
    
    const NetworkButton: React.FC<{ name: string }> = ({ name }) => (
         <button 
            type="button"
            onClick={() => setNetwork(name)}
            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${network === name ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-700'}`}
        >
            {name}
        </button>
    );

    const DataPlanButton: React.FC<{ planData: (typeof dataPlans)[0] }> = ({ planData }) => (
        <button
            type="button"
            onClick={() => setSelectedPlan(planData)}
            className={`p-3 text-left rounded-lg border-2 transition-all ${selectedPlan?.plan === planData.plan ? 'border-primary bg-green-50 dark:bg-green-900/20' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}
        >
            <p className="font-bold text-sm text-text-light dark:text-text-dark">{planData.plan}</p>
            <p className="font-semibold text-primary text-md">₦{planData.price.toLocaleString()}</p>
        </button>
    );

    return (
        <>
            <div className="p-6">
                <form onSubmit={handlePurchase} className="space-y-6">
                    <InputField 
                        id="mobileNumber" 
                        label="Mobile Number" 
                        type="tel" 
                        placeholder="Enter phone number" 
                        value={mobileNumber}
                        onChange={e => setMobileNumber(e.target.value)}
                    />
                    
                    <div>
                        <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-2">Select Network</label>
                        <div className="flex space-x-2">
                            <NetworkButton name="MTN" />
                            <NetworkButton name="Airtel" />
                            <NetworkButton name="Glo" />
                            <NetworkButton name="9mobile" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-2">Choose a Data Plan</label>
                        <div className="grid grid-cols-2 gap-3">
                           {dataPlans.map(plan => <DataPlanButton key={plan.plan} planData={plan} />)}
                        </div>
                    </div>

                    <button type="submit" className="w-full h-14 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30">
                        Purchase Data
                    </button>
                </form>
            </div>
            <TransactionConfirmationModal
                isOpen={isConfirmationModalOpen}
                onClose={() => setIsConfirmationModalOpen(false)}
                onConfirm={handleConfirmAndProceed}
                title="Confirm Data Purchase"
                details={transactionDetails}
            />
            <AuthorizationModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onConfirm={executePurchase}
                title="Authorize Purchase"
                details={transactionDetails}
            />
        </>
    );
};

export default Data;
