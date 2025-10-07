import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initiatePayment } from '../../services/squadApi';
import { SpinnerIcon } from '../../components/icons';
import { addToBalance, addTransaction } from '../../services/transactionService';

const FormField: React.FC<{ label: string; value: string; isCopiable?: boolean }> = ({ label, value, isCopiable }) => (
    <div>
        <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">{label}</label>
        <div className="flex items-center">
            <p className="text-md font-semibold text-text-light dark:text-text-dark flex-1">{value}</p>
            {isCopiable && (
                <button 
                    onClick={() => {
                        navigator.clipboard.writeText(value);
                        alert('Copied to clipboard!');
                    }}
                    className="text-primary font-bold text-sm"
                >
                    Copy
                </button>
            )}
        </div>
    </div>
);

const BankTransferTab: React.FC = () => (
    <div className="animate-fade-in">
        <div className="text-center mb-6">
            <h2 className="text-lg font-bold text-text-light dark:text-text-dark mb-2">Your Virtual Account</h2>
            <p className="text-text-muted-light dark:text-text-muted-dark">
                Fund your FinXchange wallet instantly by transferring money to your dedicated virtual account number below.
            </p>
        </div>
        
        <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-sm space-y-6">
            <FormField label="Bank Name" value="Wema Bank" />
            <hr className="border-slate-100 dark:border-slate-700/50" />
            <FormField label="Account Number" value="8012345678" isCopiable />
            <hr className="border-slate-100 dark:border-slate-700/50" />
            <FormField label="Account Name" value="FinXchange User" />
        </div>

        <div className="text-center text-xs text-text-muted-light dark:text-text-muted-dark px-4 mt-8">
            <p>This is a permanent account number reserved just for you. Transfers reflect in your wallet within minutes.</p>
        </div>
    </div>
);

const PaystackPaymentTab: React.FC = () => {
    const navigate = useNavigate();
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const numericAmount = Number(amount);
        if (!amount || numericAmount <= 0) {
            alert('Please enter a valid amount.');
            return;
        }

        setIsLoading(true);
        try {
            await initiatePayment({
                amount: numericAmount,
                email: 'user@finxchange.com' // Mock user email
            });

            // Update balance and create transaction
            addToBalance(numericAmount);
            addTransaction({
                type: 'credit',
                category: 'deposit',
                title: 'Card Deposit',
                amount: numericAmount,
                status: 'Completed'
            });

            navigate('/success', {
                state: {
                    title: 'Funding Successful!',
                    message: `You have successfully added ₦${numericAmount.toLocaleString()} to your wallet.`,
                    primaryActionText: 'Done',
                    primaryActionRoute: '/app/dashboard',
                },
                replace: true
            });

        } catch (err) {
            console.error('Payment failed or was cancelled:', err);
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            if (errorMessage !== 'Payment modal closed by user.') {
                alert(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="animate-fade-in">
            <p className="text-center text-text-muted-light dark:text-text-muted-dark mb-6">
                Enter the amount you want to add to your wallet. You will be securely redirected to complete the payment.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Amount</label>
                    <div className="relative">
                         <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-text-light dark:text-text-dark text-lg">₦</span>
                        <input
                            type="number"
                            id="amount"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full h-14 pl-10 pr-4 text-2xl font-bold bg-background-light dark:bg-background-dark border-2 border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-center"
                            required
                        />
                    </div>
                </div>
                 <button type="submit" className="w-full h-14 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30 disabled:bg-slate-400 flex items-center justify-center" disabled={isLoading}>
                    {isLoading ? <SpinnerIcon /> : 'Add Money Securely'}
                </button>
            </form>
             <div className="text-center text-xs text-text-muted-light dark:text-text-muted-dark px-4 mt-4">
                <p>Powered by Paystack</p>
            </div>
        </div>
    );
};


const AddMoney: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'transfer' | 'online'>('transfer');

    return (
        <div className="p-6">
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-full mb-6">
                <button
                    onClick={() => setActiveTab('transfer')}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-full transition-colors ${activeTab === 'transfer' ? 'bg-primary text-white' : 'text-text-muted-light dark:text-text-muted-dark'}`}
                >
                    Bank Transfer
                </button>
                <button
                    onClick={() => setActiveTab('online')}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-full transition-colors ${activeTab === 'online' ? 'bg-primary text-white' : 'text-text-muted-light dark:text-text-muted-dark'}`}
                >
                    Card / Bank / USSD
                </button>
            </div>
            
            {activeTab === 'transfer' ? <BankTransferTab /> : <PaystackPaymentTab />}

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default AddMoney;
