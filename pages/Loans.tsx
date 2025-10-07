import React from 'react';
import { LoanIcon, XIcon } from '../components/icons';
import { getBalance, subtractFromBalance, addTransaction } from '../services/transactionService';


interface ActiveLoanDetails {
    title: string;
    due: string;
    amount: number;
    paid: number;
}

const LoanApplicationForm: React.FC<{ onCancel: () => void; onSubmit: (details: any) => void; maxAmount: number }> = ({ onCancel, onSubmit, maxAmount }) => {
    const [amount, setAmount] = React.useState(5000);
    const [reason, setReason] = React.useState('');
    const [period, setPeriod] = React.useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!reason || !period) {
            alert("Please fill out all fields.");
            return;
        }
        onSubmit({ amount, reason, period });
    };

    return (
        <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-xl w-full">
            <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-lg font-bold text-text-light dark:text-text-dark">Loan Application</h2>
                <button onClick={onCancel} className="text-sm font-semibold text-primary hover:underline">
                    Cancel
                </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Loan Amount</label>
                    <div className="text-center text-2xl font-bold text-primary mb-2">₦{amount.toLocaleString()}</div>
                    <input
                        type="range"
                        id="amount"
                        min="1000"
                        max={maxAmount}
                        step="1000"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                </div>

                <div>
                    <label htmlFor="reason" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Reason for Loan</label>
                    <select
                        id="reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full h-12 px-3 bg-background-light dark:bg-background-dark border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                        required
                    >
                        <option value="" disabled>Select a reason</option>
                        <option value="business">Business</option>
                        <option value="personal">Personal Expenses</option>
                        <option value="education">Education</option>
                        <option value="medical">Medical Emergency</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                 <div>
                    <label htmlFor="period" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Repayment Period</label>
                    <select
                        id="period"
                         value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="w-full h-12 px-3 bg-background-light dark:bg-background-dark border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                        required
                    >
                        <option value="" disabled>Select a period</option>
                        <option value="30">30 Days</option>
                        <option value="60">60 Days</option>
                        <option value="90">90 Days</option>
                    </select>
                </div>

                <button type="submit" className="w-full h-12 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30">
                    Submit Application
                </button>
            </form>
        </div>
    );
};

const LoanRepaymentModal: React.FC<{
    loan: ActiveLoanDetails | null;
    onClose: () => void;
    onSubmit: (repaymentAmount: number) => void;
}> = ({ loan, onClose, onSubmit }) => {
    const outstandingAmount = loan ? loan.amount - loan.paid : 0;
    const [repaymentAmount, setRepaymentAmount] = React.useState(outstandingAmount);

    React.useEffect(() => {
        if (loan) {
            setRepaymentAmount(loan.amount - loan.paid);
        }
    }, [loan]);


    if (!loan) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (repaymentAmount <= 0 || repaymentAmount > outstandingAmount) {
            alert("Please enter a valid amount.");
            return;
        }
        onSubmit(repaymentAmount);
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-2xl w-full max-w-sm">
                <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg font-bold text-text-light dark:text-text-dark">Make a Repayment</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                        <XIcon />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <div className="text-center mb-4">
                            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Repaying for: <span className="font-bold text-text-light dark:text-text-dark">{loan.title}</span></p>
                             <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Outstanding Balance: <span className="font-bold text-text-light dark:text-text-dark">₦{(loan.amount - loan.paid).toLocaleString()}</span></p>
                        </div>
                        <label htmlFor="repaymentAmount" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Amount to Repay</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-text-light dark:text-text-dark">₦</span>
                            <input
                                type="number"
                                id="repaymentAmount"
                                value={repaymentAmount}
                                onChange={(e) => setRepaymentAmount(Number(e.target.value))}
                                className="w-full h-12 pl-8 pr-4 bg-background-light dark:bg-background-dark border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg text-sm">
                        <div className="flex justify-between">
                            <span className="text-text-muted-light dark:text-text-muted-dark">Transaction Fee</span>
                            <span className="font-semibold text-text-light dark:text-text-dark">₦0.00</span>
                        </div>
                        <div className="flex justify-between mt-2 font-bold">
                            <span className="text-text-light dark:text-text-dark">Total to Pay</span>
                            <span className="text-primary">₦{repaymentAmount > 0 ? repaymentAmount.toLocaleString() : 0}</span>
                        </div>
                    </div>

                    <button type="submit" className="w-full h-12 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30">
                        Confirm Payment
                    </button>
                </form>
            </div>
        </div>
    );
};


const LoanOffer: React.FC<{onApply: () => void}> = ({onApply}) => (
    <div className="opay-gradient p-5 rounded-xl text-white shadow-lg shadow-primary/30 text-center">
        <p className="text-sm opacity-90">You are eligible for a loan up to</p>
        <p className="text-4xl font-extrabold tracking-tight my-2">₦50,000</p>
        <p className="text-xs opacity-80">Repay in 30 days with low interest.</p>
        <button onClick={onApply} className="mt-4 w-full h-11 bg-white text-primary font-bold rounded-lg hover:bg-white/90 transition-colors">
            Apply Now
        </button>
    </div>
);

const ActiveLoan: React.FC<{ details: ActiveLoanDetails; onRepay: () => void; }> = ({ details, onRepay }) => {
    const { title, due, amount, paid } = details;
    const progress = (paid / amount) * 100;
    return (
        <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <p className="font-bold text-text-light dark:text-text-dark">{title}</p>
                    <p className="text-xs text-text-muted-light dark:text-text-muted-dark">Due: {due}</p>
                </div>
                <button onClick={onRepay} className="px-4 py-1.5 text-sm bg-primary text-white font-semibold rounded-full">Repay</button>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
             <p className="text-xs text-text-muted-light dark:text-text-muted-dark text-right mt-1">
                Paid ₦{paid.toLocaleString()} of ₦{amount.toLocaleString()}
            </p>
        </div>
    );
}

const Loans: React.FC = () => {
    const creditScore = 720; // Simulated AI credit score
    const [isApplying, setIsApplying] = React.useState(false);
    const [repaymentLoan, setRepaymentLoan] = React.useState<ActiveLoanDetails | null>(null);
    
    const activeLoansData: ActiveLoanDetails[] = [
        { title: "Personal Loan", due: "Aug 15, 2024", amount: 25000, paid: 10000 }
    ];

    const handleLoanSubmit = (details: any) => {
        console.log("Loan application submitted:", details);
        alert('Your loan application has been submitted successfully!');
        setIsApplying(false);
    };

    const handleRepaymentSubmit = (repaymentAmount: number) => {
        const currentBalance = getBalance();
        if (currentBalance < repaymentAmount) {
            alert("Insufficient wallet balance for this repayment.");
            return;
        }

        subtractFromBalance(repaymentAmount);
        addTransaction({
            type: 'debit',
            category: 'other',
            title: `Loan Repayment: ${repaymentLoan?.title}`,
            amount: repaymentAmount,
            status: 'Completed'
        });

        console.log(`Repaying ${repaymentAmount} for ${repaymentLoan?.title}`);
        alert('Your loan repayment was successful!');
        setRepaymentLoan(null);
    };

    return (
        <>
            <div className="p-4">
                <h1 className="text-3xl font-bold text-text-light dark:text-text-dark mb-6">Loans</h1>

                <div className="bg-card-light dark:bg-card-dark p-5 rounded-xl shadow-sm mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-sm font-semibold text-text-muted-light dark:text-text-muted-dark">Your Credit Score</h2>
                        <p className="text-3xl font-bold text-primary">{creditScore}</p>
                    </div>
                    <div className="w-16 h-16 rounded-full border-4 border-primary flex items-center justify-center font-bold text-primary text-lg">
                        Good
                    </div>
                </div>
                
                {isApplying ? (
                    <LoanApplicationForm 
                        onCancel={() => setIsApplying(false)}
                        onSubmit={handleLoanSubmit}
                        maxAmount={50000}
                    />
                ) : (
                    <LoanOffer onApply={() => setIsApplying(true)} />
                )}

                <div className="mt-8">
                    <h2 className="text-md font-bold text-text-light dark:text-text-dark mb-3">Active Loans</h2>
                    <div className="space-y-4">
                        {activeLoansData.map(loan => (
                            <ActiveLoan key={loan.title} details={loan} onRepay={() => setRepaymentLoan(loan)} />
                        ))}
                    </div>
                </div>
            </div>
             <LoanRepaymentModal 
                loan={repaymentLoan} 
                onClose={() => setRepaymentLoan(null)}
                onSubmit={handleRepaymentSubmit}
            />
        </>
    );
};

export default Loans;