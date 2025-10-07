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

const Airtime: React.FC = () => {
    const navigate = useNavigate();
    const [network, setNetwork] = useState('MTN');
    const [mobileNumber, setMobileNumber] = useState('');
    const [amount, setAmount] = useState('');

    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [transactionDetails, setTransactionDetails] = useState<Record<string, string | number>>({});

    const executePurchase = () => {
        setIsAuthModalOpen(false);
        const purchaseAmount = Number(amount);
        const currentBalance = getBalance();

        if (currentBalance < purchaseAmount) {
            alert("Insufficient funds to complete this transaction.");
            return;
        }

        subtractFromBalance(purchaseAmount);
        addTransaction({
            type: 'debit',
            category: 'airtime',
            title: `${network} Airtime Purchase`,
            amount: purchaseAmount,
            status: 'Completed'
        });

        navigate('/success', {
            state: {
                title: 'Purchase Successful!',
                message: `You have successfully purchased ₦${amount} airtime for ${mobileNumber}.`,
                primaryActionText: 'Done',
                primaryActionRoute: '/app/dashboard',
                secondaryActionText: 'Buy Again',
                secondaryActionRoute: '/airtime'
            },
            replace: true
        });
    };

    const handlePurchase = (e: React.FormEvent) => {
        e.preventDefault();
        setTransactionDetails({
            "Service": "Airtime Purchase",
            "Network": network,
            "Phone Number": mobileNumber,
            "Amount": `₦${Number(amount).toLocaleString()}`,
            "Total to Pay": `₦${Number(amount).toLocaleString()}`
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
                        onChange={(e) => setMobileNumber(e.target.value)}
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

                    <InputField 
                        id="amount" 
                        label="Amount" 
                        type="number" 
                        placeholder="Enter amount (e.g., 500)"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    
                    <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg text-sm">
                        <div className="flex justify-between">
                            <span className="text-text-muted-light dark:text-text-muted-dark">Transaction Fee</span>
                            <span className="font-semibold text-text-light dark:text-text-dark">₦0.00</span>
                        </div>
                        <div className="flex justify-between mt-2 font-bold">
                            <span className="text-text-light dark:text-text-dark">Total to Pay</span>
                            <span className="text-primary">₦{Number(amount) > 0 ? Number(amount).toLocaleString() : '0.00'}</span>
                        </div>
                    </div>

                    <button type="submit" className="w-full h-14 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30">
                        Purchase
                    </button>
                </form>
            </div>
            <TransactionConfirmationModal
                isOpen={isConfirmationModalOpen}
                onClose={() => setIsConfirmationModalOpen(false)}
                onConfirm={handleConfirmAndProceed}
                title="Confirm Purchase"
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

export default Airtime;
