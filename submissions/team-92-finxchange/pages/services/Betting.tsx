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

const Betting: React.FC = () => {
    const navigate = useNavigate();
    const [biller, setBiller] = useState('Bet9ja');
    const [userId, setUserId] = useState('');
    const [amount, setAmount] = useState('');
    
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [transactionDetails, setTransactionDetails] = useState<Record<string, string | number>>({});

    const executePayment = () => {
        setIsAuthModalOpen(false);
        const paymentAmount = Number(amount);
        const currentBalance = getBalance();

        if (currentBalance < paymentAmount) {
            alert("Insufficient funds to complete this transaction.");
            return;
        }

        subtractFromBalance(paymentAmount);
        addTransaction({
            type: 'debit',
            category: 'betting',
            title: `Fund ${biller} Account`,
            amount: paymentAmount,
            status: 'Completed'
        });
        
        navigate('/success', {
            state: {
                title: 'Funding Successful!',
                message: `You have successfully funded your ${biller} account (ID: ${userId}) with ₦${amount}.`,
                primaryActionText: 'Done',
                primaryActionRoute: '/app/dashboard',
                secondaryActionText: 'Fund Again',
                secondaryActionRoute: '/betting'
            },
            replace: true
        });
    };

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        setTransactionDetails({
            "Service": "Betting Account Funding",
            "Biller": biller,
            "User ID": userId,
            "Amount": `₦${Number(amount).toLocaleString()}`
        });
        setIsConfirmationModalOpen(true);
    };

    const handleConfirmAndProceed = () => {
        setIsConfirmationModalOpen(false);
        setIsAuthModalOpen(true);
    };

    return (
        <>
            <div className="p-6">
                <form onSubmit={handlePayment} className="space-y-6">
                    <SelectField id="biller" label="Select Biller" value={biller} onChange={e => setBiller(e.target.value)}>
                        <option>Bet9ja</option>
                        <option>SportyBet</option>
                        <option>1xBet</option>
                        <option>BetKing</option>
                    </SelectField>

                    <InputField id="userId" label="User ID / Customer ID" type="text" placeholder="Enter your betting user ID" value={userId} onChange={e => setUserId(e.target.value)} />
                    <InputField id="amount" label="Amount" type="number" placeholder="Enter amount to fund" value={amount} onChange={e => setAmount(e.target.value)} />

                    <button type="submit" className="w-full h-14 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30">
                        Fund Account
                    </button>
                </form>
            </div>
            <TransactionConfirmationModal
                isOpen={isConfirmationModalOpen}
                onClose={() => setIsConfirmationModalOpen(false)}
                onConfirm={handleConfirmAndProceed}
                title="Confirm Betting Payment"
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

export default Betting;
