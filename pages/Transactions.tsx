import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SearchIcon } from '../components/icons';
import { Transaction, getTransactions } from '../services/transactionService';
import { getTransactionIcon } from '../utils/transactionUtils';

const TransactionItem: React.FC<Transaction> = ({ id, category, title, date, amount, status, type }) => {
    const isCredit = type === 'credit';
    const statusColor = status === 'Completed' ? 'text-green-500' : 'text-yellow-500';
    
    return (
        <Link to={`/transaction/${id}`} className="block hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div className="flex items-center space-x-4 p-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCredit ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {getTransactionIcon(category)}
                </div>
                <div className="flex-1">
                    <p className="font-bold text-sm text-text-light dark:text-text-dark">{title}</p>
                    <p className="text-xs text-text-muted-light dark:text-text-muted-dark">{date}</p>
                </div>
                <div className="text-right">
                    <p className={`font-bold text-sm ${isCredit ? 'text-green-600' : 'text-text-light dark:text-text-dark'}`}>
                        {isCredit ? '+' : '-'}₦{amount.toLocaleString()}
                    </p>
                    <p className={`text-xs font-semibold ${statusColor}`}>{status}</p>
                </div>
            </div>
        </Link>
    );
};

const Transactions: React.FC = () => {
    const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
    const [filter, setFilter] = useState<'all' | 'inflow' | 'outflow'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        setAllTransactions(getTransactions());
    }, []);

    const filteredTransactions = allTransactions.filter(tx => {
        const matchesFilter = (filter === 'inflow') 
            ? tx.type === 'credit' 
            : (filter === 'outflow') 
            ? tx.type === 'debit' 
            : true;

        const matchesSearch = tx.title.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    const TabButton: React.FC<{ type: typeof filter, label: string }> = ({ type, label }) => (
        <button 
            onClick={() => setFilter(type)}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${filter === type ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-700 text-text-light dark:text-text-dark'}`}
        >
            {label}
        </button>
    );

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold text-text-light dark:text-text-dark mb-4">Transaction History</h1>

            <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon />
                </div>
                <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 pl-10 pr-4 bg-slate-100 dark:bg-slate-800 border-transparent rounded-full focus:ring-2 focus:ring-primary focus:outline-none"
                />
            </div>
            
            <div className="flex space-x-2 mb-4 p-1 bg-slate-100 dark:bg-slate-800 rounded-full">
                <TabButton type="all" label="All" />
                <TabButton type="inflow" label="Inflow" />
                <TabButton type="outflow" label="Outflow" />
            </div>

            <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm divide-y divide-slate-100 dark:divide-slate-700/50">
                {filteredTransactions.length > 0 ? (
                    filteredTransactions.map(tx => <TransactionItem key={tx.id} {...tx} />)
                ) : (
                    <p className="text-center p-8 text-text-muted-light dark:text-text-muted-dark">No transactions found.</p>
                )}
            </div>
        </div>
    );
};

export default Transactions;
