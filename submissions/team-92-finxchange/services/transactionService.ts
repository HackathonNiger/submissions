// services/transactionService.ts

// Define the transaction structure
export type TransactionCategory = 'deposit' | 'transfer' | 'airtime' | 'data' | 'electricity' | 'tv' | 'betting' | 'exam-pin' | 'withdrawal' | 'internet' | 'water' | 'school' | 'other';

export interface Transaction {
    id: number;
    type: 'credit' | 'debit';
    category: TransactionCategory;
    title: string;
    date: string;
    amount: number;
    status: 'Completed' | 'Pending' | 'Failed';
}

const BALANCE_KEY = 'finxchange_balance';
const TRANSACTIONS_KEY = 'finxchange_transactions';

// --- Balance Functions ---
export const getBalance = (): number => {
    const balance = localStorage.getItem(BALANCE_KEY);
    return balance ? parseFloat(balance) : 0;
};

export const setBalance = (newBalance: number): void => {
    localStorage.setItem(BALANCE_KEY, newBalance.toString());
};

export const addToBalance = (amount: number): void => {
    const currentBalance = getBalance();
    setBalance(currentBalance + amount);
};

export const subtractFromBalance = (amount: number): void => {
    const currentBalance = getBalance();
    setBalance(currentBalance - amount);
};


// --- Transaction Functions ---
export const getTransactions = (): Transaction[] => {
    const transactions = localStorage.getItem(TRANSACTIONS_KEY);
    return transactions ? (JSON.parse(transactions) as Transaction[]) : [];
};

export const addTransaction = (transactionDetails: Omit<Transaction, 'id' | 'date'>): void => {
    const transactions = getTransactions();
    const newTransaction: Transaction = {
        ...transactionDetails,
        id: Date.now(),
        date: new Date().toLocaleString('en-US', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        }),
    };
    transactions.unshift(newTransaction); // Add to the beginning
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
};
