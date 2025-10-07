
import React from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, GroupSavingsIcon } from '../components/icons';

const SavingsGroupCard: React.FC<{ name: string; contribution: number; members: number; nextPayout: string; progress: number }> = 
({ name, contribution, members, nextPayout, progress }) => (
    <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-sm">
        <div className="flex justify-between items-start mb-3">
            <div>
                <p className="font-bold text-text-light dark:text-text-dark text-lg">{name}</p>
                <p className="text-sm font-semibold text-primary">₦{contribution.toLocaleString()} / month</p>
            </div>
            <div className="text-right">
                <p className="text-sm font-bold text-text-light dark:text-text-dark">{members} members</p>
                <p className="text-xs text-text-muted-light dark:text-text-muted-dark">Next payout: {nextPayout}</p>
            </div>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div className="bg-primary h-2 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
    </div>
);


const GroupSavings: React.FC = () => {
    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-text-light dark:text-text-dark">Group Savings</h1>
                <Link to="/create-group-saving" className="flex items-center justify-center w-10 h-10 bg-primary text-white rounded-full shadow-lg shadow-primary/30">
                   <PlusIcon />
                </Link>
            </div>

            <div className="space-y-4">
                <SavingsGroupCard 
                    name="Office Ajo"
                    contribution={10000}
                    members={12}
                    nextPayout="July 30"
                    progress={75}
                />
                <SavingsGroupCard 
                    name="Family Esusu"
                    contribution={25000}
                    members={5}
                    nextPayout="Aug 20"
                    progress={40}
                />
            </div>
            
             <div className="mt-8 p-5 bg-primary/10 dark:bg-primary/20 rounded-xl text-center">
                 <div className="flex justify-center text-primary dark:text-blue-300 mb-2">
                    <GroupSavingsIcon />
                 </div>
                 <h3 className="font-bold text-primary dark:text-blue-300">Save with friends</h3>
                 <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-1">
                    Create a new Ajo or Esusu group and achieve your goals together.
                 </p>
            </div>
        </div>
    );
};

export default GroupSavings;