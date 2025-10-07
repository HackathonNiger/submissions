import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBankList, resolveAccountNumber, Bank } from '../../services/bankApi';
import { SpinnerIcon } from '../../components/icons';
import { TransactionConfirmationModal, AuthorizationModal } from '../../layouts/ServicePageLayout';
import { getBalance, subtractFromBalance, addTransaction } from '../../services/transactionService';

const Transfer: React.FC = () => {
    const navigate = useNavigate();
    const [banks, setBanks] = useState<Bank[]>([]);
    const [isFetchingBanks, setIsFetchingBanks] = useState(true);
    const [selectedBankCode, setSelectedBankCode] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [narration, setNarration] = useState('');

    const [isVerifying, setIsVerifying] = useState(false);
    const [isTransferring, setIsTransferring] = useState(false);
    const [verifiedName, setVerifiedName] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [transactionDetails, setTransactionDetails] = useState<Record<string, string | number>>({});
    
    useEffect(() => {
        const fetchBanks = async () => {
            try {
                const bankList = await getBankList();
                setBanks(bankList);
            } catch (err) {
                setError("Could not fetch bank list.");
            } finally {
                setIsFetchingBanks(false);
            }
        };
        fetchBanks();
    }, []);
    
    const handleVerify = useCallback(async () => {
        if (accountNumber.length !== 10 || !selectedBankCode) {
            return;
        }
        setIsVerifying(true);
        setError(null);
        setVerifiedName(null);
        try {
            const { accountName } = await resolveAccountNumber({ accountNumber, bankCode: selectedBankCode });
            setVerifiedName(accountName);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred.");
            }
        } finally {
            setIsVerifying(false);
        }
    }, [accountNumber, selectedBankCode]);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleVerify();
        }, 500); // Debounce verification
        return () => clearTimeout(timer);
    }, [accountNumber, selectedBankCode, handleVerify]);


    const executeTransfer = async () => {
        setIsAuthModalOpen(false);
        setIsTransferring(true);
        
        const transferAmount = parseFloat(amount);
        const currentBalance = getBalance();

        if (currentBalance < transferAmount) {
            alert("Insufficient funds to complete this transfer.");
            setIsTransferring(false);
            return;
        }

        try {
            // Simulate transfer
            await new Promise(resolve => setTimeout(resolve, 1500));

            subtractFromBalance(transferAmount);
            addTransaction({
                type: 'debit',
                category: 'transfer',
                title: `Transfer to ${verifiedName}`,
                amount: transferAmount,
                status: 'Completed'
            });
            
            const selectedBank = banks.find(b => b.code === selectedBankCode);
            navigate('/success', {
                state: {
                    title: 'Transfer Successful!',
                    message: `You have successfully sent ₦${transferAmount.toLocaleString()} to ${verifiedName} (${selectedBank?.name}).`,
                    primaryActionText: 'Done',
                    primaryActionRoute: '/app/dashboard',
                    secondaryActionText: 'Make Another Transfer',
                    secondaryActionRoute: '/transfer'
                },
                replace: true
            });

        } catch (err) {
            alert('Transfer failed. Please try again.');
        } finally {
            setIsTransferring(false);
        }
    };

    const handleTransfer = (e: React.FormEvent) => {
        e.preventDefault();
        if (!verifiedName || !amount) {
            alert('Please fill all required fields and verify account.');
            return;
        }
        const selectedBank = banks.find(b => b.code === selectedBankCode);
        setTransactionDetails({
            "Amount": `₦${parseFloat(amount).toLocaleString()}`,
            "To": verifiedName!,
            "Bank": selectedBank?.name || 'N/A',
            "Account": accountNumber,
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
                <form onSubmit={handleTransfer} className="space-y-6">
                    <div>
                        <label htmlFor="bank" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Recipient Bank</label>
                        <select 
                            id="bank"
                            value={selectedBankCode}
                            onChange={(e) => {
                                setSelectedBankCode(e.target.value);
                                setVerifiedName(null);
                                setError(null);
                            }}
                            className="w-full h-12 px-3 bg-background-light dark:bg-background-dark border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none appearance-none"
                            required
                        >
                            <option value="" disabled>{isFetchingBanks ? 'Loading banks...' : 'Select a bank'}</option>
                            {banks.map(bank => (
                                <option key={bank.code} value={bank.code}>{bank.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="accountNumber" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Account Number</label>
                        <div className="relative">
                            <input 
                                type="tel"
                                id="accountNumber"
                                placeholder="Enter 10-digit account number"
                                value={accountNumber}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, ''); // only digits
                                    if (value.length <= 10) {
                                        setAccountNumber(value);
                                        setVerifiedName(null);
                                        setError(null);
                                    }
                                }}
                                className="w-full h-12 px-4 bg-background-light dark:bg-background-dark border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" 
                                required
                            />
                            {isVerifying && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-primary"><SpinnerIcon /></div>}
                        </div>
                        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
                    </div>
                    
                    {verifiedName && (
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm font-semibold text-center">
                            {verifiedName}
                        </div>
                    )}

                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Amount</label>
                        <input 
                            type="number"
                            id="amount"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full h-12 px-4 bg-background-light dark:bg-background-dark border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" 
                            required
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="narration" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Narration (Optional)</label>
                        <input 
                            type="text"
                            id="narration"
                            placeholder="e.g., For groceries"
                            value={narration}
                            onChange={(e) => setNarration(e.target.value)}
                            className="w-full h-12 px-4 bg-background-light dark:bg-background-dark border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" 
                        />
                    </div>

                    <button type="submit" className="w-full h-14 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30 disabled:bg-slate-400 disabled:shadow-none flex items-center justify-center" disabled={!verifiedName || isTransferring}>
                        {isTransferring ? <SpinnerIcon className="w-6 h-6" /> : 'Send Money'}
                    </button>
                </form>
            </div>
            <TransactionConfirmationModal
                isOpen={isConfirmationModalOpen}
                onClose={() => setIsConfirmationModalOpen(false)}
                onConfirm={handleConfirmAndProceed}
                title="Confirm Transfer"
                details={transactionDetails}
            />
            <AuthorizationModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onConfirm={executeTransfer}
                title="Authorize Transfer"
                details={transactionDetails}
            />
        </>
    );
};

export default Transfer;
