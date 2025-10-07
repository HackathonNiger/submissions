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

const Withdraw: React.FC = () => {
    const navigate = useNavigate();
    const [bankAccount, setBankAccount] = useState('GTBank - **** 2345');
    const [amount, setAmount] = useState('');

    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [transactionDetails, setTransactionDetails] = useState<Record<string, string | number>>({});

    const executeWithdraw = () => {
        setIsAuthModalOpen(false);
        const withdrawAmount = Number(amount);
        const currentBalance = getBalance();

        if (currentBalance < withdrawAmount) {
            alert("Insufficient funds to complete this transaction.");
            return;
        }

        subtractFromBalance(withdrawAmount);
        addTransaction({
            type: 'debit',
            category: 'withdrawal',
            title: `Withdrawal to ${bankAccount.split(' ')[0]}`,
            amount: withdrawAmount,
            status: 'Completed'
        });

        navigate('/success', {
            state: {
                title: 'Withdrawal Successful!',
                message: `You have successfully withdrawn ₦${amount} to your ${bankAccount} account.`,
                primaryActionText: 'Done',
                primaryActionRoute: '/app/dashboard',
                secondaryActionText: 'Withdraw Again',
                secondaryActionRoute: '/withdraw'
            },
            replace: true
        });
    };

    const handleWithdraw = (e: React.FormEvent) => {
        e.preventDefault();
        setTransactionDetails({
            "Action": "Withdraw Funds",
            "To Account": bankAccount,
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
                <form onSubmit={handleWithdraw} className="space-y-6">
                    <SelectField id="bankAccount" label="Withdraw to" value={bankAccount} onChange={e => setBankAccount(e.target.value)}>
                        <option>GTBank - **** 2345</option>
                        <option>Access Bank - **** 6789</option>
                    </SelectField>

                    <InputField id="amount" label="Amount" type="number" placeholder="Enter amount to withdraw" value={amount} onChange={e => setAmount(e.target.value)} />

                    <div className="text-center text-sm text-text-muted-light dark:text-text-muted-dark">
                        <p>A fee of ₦25 may apply.</p>
                    </div>

                    <button type="submit" className="w-full h-14 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30">
                        Withdraw Funds
                    </button>
                </form>
            </div>
            <TransactionConfirmationModal
                isOpen={isConfirmationModalOpen}
                onClose={() => setIsConfirmationModalOpen(false)}
                onConfirm={handleConfirmAndProceed}
                title="Confirm Withdrawal"
                details={transactionDetails}
            />
            <AuthorizationModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onConfirm={executeWithdraw}
                title="Authorize Withdrawal"
                details={transactionDetails}
            />
        </>
    );
};

export default Withdraw;
