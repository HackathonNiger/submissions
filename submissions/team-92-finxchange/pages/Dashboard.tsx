import React from 'react';
import { Link } from 'react-router-dom';
import { 
    AirtimeIcon, BillsIcon, CreditIcon, DebitIcon, DepositIcon, 
    ExamPinIcon, SendIcon, WithdrawIcon, ScanIcon, NotificationIcon, 
    DataIcon, BettingIcon, TVIcon, ElectricityIcon, MoreIcon, EyeIcon, EyeOffIcon
} from '../components/icons';
import { Transaction, getBalance, getTransactions } from '../services/transactionService';
import { getTransactionIcon } from '../utils/transactionUtils';

const ServiceButton = ({ icon, label, to }: { icon: React.ReactNode, label: string, to: string }) => (
    <Link to={to} className="flex flex-col items-center justify-start space-y-2 text-center">
        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-black dark:text-white shadow-sm">
            {icon}
        </div>
        <span className="text-xs font-medium text-text-light dark:text-text-dark leading-tight">{label}</span>
    </Link>
);

// FIX: Defined props with a dedicated interface for the TransactionItem component for better type safety and to fix a JSX typing error.
interface TransactionItemProps {
    icon: React.ReactNode;
    title: string;
    date: string;
    amount: number;
    isCredit: boolean;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ icon, title, date, amount, isCredit }) => (
    <div className="flex items-center space-x-4 py-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCredit ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            {icon}
        </div>
        <div className="flex-1">
            <p className="font-semibold text-sm text-text-light dark:text-text-dark">{title}</p>
            <p className="text-xs text-text-muted-light dark:text-text-muted-dark">{date}</p>
        </div>
        <p className={`font-bold text-sm ${isCredit ? 'text-green-600' : 'text-text-light dark:text-text-dark'}`}>{isCredit ? '+' : '-'}₦{amount.toLocaleString()}</p>
    </div>
);

const Dashboard: React.FC = () => {
    const [balanceVisible, setBalanceVisible] = React.useState(true);
    const [balance, setBalance] = React.useState(0);
    const [recentTransactions, setRecentTransactions] = React.useState<Transaction[]>([]);
    
    const loadData = () => {
        setBalance(getBalance());
        setRecentTransactions(getTransactions().slice(0, 3));
    };

    React.useEffect(() => {
        loadData();
        // Add event listener to refresh data when the user navigates back to the tab
        window.addEventListener('focus', loadData);
        return () => {
            window.removeEventListener('focus', loadData);
        };
    }, []);

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen">
            {/* Header */}
            <header className="p-4 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                    <div>
                        <p className="font-bold text-text-light dark:text-text-dark">Hi, FinXchange</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="text-text-light dark:text-text-dark"><ScanIcon /></button>
                    <button className="text-text-light dark:text-text-dark"><NotificationIcon /></button>
                </div>
            </header>

            <div className="p-4">
                {/* Balance Card */}
                <div className="opay-gradient p-5 rounded-xl text-white shadow-lg shadow-primary/30 mb-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm opacity-90">Total Balance</p>
                            <div className="flex items-center space-x-2 mt-1">
                                <p className="text-3xl font-extrabold tracking-tight">
                                    {balanceVisible ? `₦${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '∗∗∗∗∗∗∗∗'}
                                </p>
                                <button onClick={() => setBalanceVisible(!balanceVisible)}>
                                    {balanceVisible ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center mt-6">
                        <Link to="/add-money" className="flex flex-col items-center space-y-1 p-1 rounded-lg hover:bg-white/10">
                            <DepositIcon />
                            <span className="text-xs font-medium">Add Money</span>
                        </Link>
                         <Link to="/transfer" className="flex flex-col items-center space-y-1 p-1 rounded-lg hover:bg-white/10">
                            <SendIcon />
                            <span className="text-xs font-medium">Transfer</span>
                        </Link>
                         <Link to="/withdraw" className="flex flex-col items-center space-y-1 p-1 rounded-lg hover:bg-white/10">
                            <WithdrawIcon />
                            <span className="text-xs font-medium">Withdraw</span>
                        </Link>
                        <Link to="/airtime" className="flex flex-col items-center space-y-1 p-1 rounded-lg hover:bg-white/10">
                            <AirtimeIcon />
                            <span className="text-xs font-medium">Airtime</span>
                        </Link>
                    </div>
                </div>

                {/* Services Grid */}
                <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-sm mb-4">
                    <div className="grid grid-cols-4 gap-y-4 gap-x-2">
                        <ServiceButton icon={<DataIcon />} label="Data" to="/data" />
                        <ServiceButton icon={<BettingIcon />} label="Betting" to="/betting" />
                        <ServiceButton icon={<TVIcon />} label="TV" to="/tv" />
                        <ServiceButton icon={<ElectricityIcon />} label="Electricity" to="/electricity" />
                        <ServiceButton icon={<BillsIcon />} label="Internet" to="/internet" />
                        <ServiceButton icon={<ExamPinIcon />} label="Exam PINs" to="/exam-pin" />
                        <ServiceButton icon={<SendIcon />} label="Transfer" to="/transfer" />
                        <ServiceButton icon={<MoreIcon />} label="More" to="/app/services" />
                    </div>
                </div>

                {/* Promotional Banner */}
                <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded-xl mb-4 flex items-center justify-center">
                    <p className="text-text-muted-light dark:text-text-muted-dark">Promotional Content</p>
                </div>


                {/* Recent Transactions */}
                <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-md font-bold text-text-light dark:text-text-dark">Recent Transactions</h2>
                        <Link to="/app/transactions" className="text-sm font-semibold text-primary hover:underline">See all</Link>
                    </div>
                    <div>
                        {recentTransactions.length > 0 ? (
                            recentTransactions.map(tx => (
                                <TransactionItem 
                                    key={tx.id}
                                    icon={getTransactionIcon(tx.category)} 
                                    title={tx.title} 
                                    date={tx.date} 
                                    amount={tx.amount}
                                    isCredit={tx.type === 'credit'} 
                                />
                            ))
                        ) : (
                             <p className="text-center p-8 text-text-muted-light dark:text-text-muted-dark">No recent transactions.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;