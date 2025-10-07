import React from 'react';
import { Link } from 'react-router-dom';
import { SaveIcon, LoanIcon, CardIcon, GroupSavingsIcon, ChevronRightIcon } from '../components/icons';

const FinanceItem: React.FC<{ icon: React.ReactNode; title: string; subtitle: string; to: string; }> = ({ icon, title, subtitle, to }) => (
    <Link to={to} className="w-full flex items-center p-4 bg-card-light dark:bg-card-dark border-b border-slate-100 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors first:rounded-t-xl last:rounded-b-xl">
        <div className="w-10 h-10 flex items-center justify-center mr-4 text-primary">
            {icon}
        </div>
        <div className="flex-1 text-left">
            <p className="font-bold text-text-light dark:text-text-dark">{title}</p>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">{subtitle}</p>
        </div>
        <ChevronRightIcon />
    </Link>
);

const Finance: React.FC = () => {
    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold text-text-light dark:text-text-dark mb-6">Finance</h1>
            
            <div className="rounded-xl shadow-sm overflow-hidden">
                <FinanceItem icon={<CardIcon />} title="Cards" subtitle="Manage your virtual debit cards" to="/app/cards" />
                <FinanceItem icon={<SaveIcon />} title="Savings" subtitle="Reach your savings goals" to="/app/save" />
                <FinanceItem icon={<LoanIcon />} title="Loans" subtitle="Apply for quick and easy loans" to="/app/loans" />
                <FinanceItem icon={<GroupSavingsIcon />} title="Group Savings" subtitle="Save together with friends" to="/app/group-savings" />
            </div>
        </div>
    );
};

export default Finance;