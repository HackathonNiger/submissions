import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TransactionConfirmationModal, AuthorizationModal } from '../../layouts/ServicePageLayout';
import { getBalance, subtractFromBalance, addTransaction } from '../../services/transactionService';

interface CardDetails {
    id: number;
    label: string;
    number: string;
    expiry: string;
    cvv: string;
    color: string;
    frozen: boolean;
}

const FundCard: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { card } = location.state as { card: CardDetails };

    const [amount, setAmount] = useState('');
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [transactionDetails, setTransactionDetails] = useState<Record<string, string | number>>({});

    const walletBalance = getBalance();
    // This is a mock balance for the card itself, not the main wallet
    const cardBalance = 5000; 

    if (!card) {
        return <div className="p-4">Card not found.</div>;
    }

    const executeFund = () => {
        setIsAuthModalOpen(false);
        const fundAmount = parseFloat(amount);

        subtractFromBalance(fundAmount);
        addTransaction({
            type: 'debit',
            category: 'withdrawal',
            title: `Fund Card: ${card.label}`,
            amount: fundAmount,
            status: 'Completed'
        });

        navigate('/success', {
            state: {
                title: 'Card Funded!',
                message: `Successfully funded ${card.label} with ₦${fundAmount.toLocaleString()}.`,
                primaryActionText: 'Go to Cards',
                primaryActionRoute: '/app/cards',
            },
            replace: true
        });
    };

    const handleFund = (e: React.FormEvent) => {
        e.preventDefault();
        const fundAmount = parseFloat(amount);
        if (isNaN(fundAmount) || fundAmount <= 0) {
            alert('Please enter a valid amount.');
            return;
        }
        if (fundAmount > walletBalance) {
            alert('Insufficient wallet balance.');
            return;
        }

        setTransactionDetails({
            "Action": "Fund Card",
            "To Card": `${card.label} (**** ${card.number.slice(-4)})`,
            "Amount": `₦${fundAmount.toLocaleString()}`
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
                <div className="text-center mb-6">
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Funding Card:</p>
                    <p className="font-bold text-lg text-text-light dark:text-text-dark">{card.label} ({`**** ${card.number.slice(-4)}`})</p>
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-2">
                        Card Balance: <span className="font-semibold text-text-light dark:text-text-dark">₦{cardBalance.toLocaleString()}</span>
                    </p>
                </div>
                
                <form onSubmit={handleFund} className="space-y-6">
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Amount to Fund</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-text-light dark:text-text-dark text-lg">₦</span>
                            <input
                                type="number"
                                id="amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full h-14 pl-10 pr-4 text-2xl font-bold bg-background-light dark:bg-background-dark border-2 border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-center"
                                required
                            />
                        </div>
                        <p className="text-xs text-text-muted-light dark:text-text-muted-dark text-center mt-2">
                            Available Wallet Balance: ₦{walletBalance.toLocaleString()}
                        </p>
                    </div>
                    
                    <button type="submit" className="w-full h-14 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30">
                        Fund Card
                    </button>
                </form>
            </div>
            <TransactionConfirmationModal
                isOpen={isConfirmationModalOpen}
                onClose={() => setIsConfirmationModalOpen(false)}
                onConfirm={handleConfirmAndProceed}
                title="Confirm Card Funding"
                details={transactionDetails}
            />
            <AuthorizationModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onConfirm={executeFund}
                title="Authorize Funding"
                details={transactionDetails}
            />
        </>
    );
};

export default FundCard;