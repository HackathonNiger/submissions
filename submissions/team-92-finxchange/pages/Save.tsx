
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusIcon } from '../components/icons';

interface SavingGoalData {
    id: number;
    title: string;
    target: number;
    current: number;
    targetDate: string;
    frequency: string;
    color: string;
}

const SavingGoal: React.FC<{ goal: SavingGoalData; onEdit: () => void; onDelete: () => void; }> = ({ goal, onEdit, onDelete }) => {
    const { title, current, target, color } = goal;
    const progress = (current / target) * 100;

    return (
        <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-2">
                <p className="font-bold text-text-light dark:text-text-dark">{title}</p>
                <p className="text-sm font-semibold text-primary">₦{target.toLocaleString()}</p>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mb-2">
                <div className={`${color} h-2.5 rounded-full`} style={{ width: `${progress}%` }}></div>
            </div>
            <p className="text-xs text-text-muted-light dark:text-text-muted-dark text-right">
                Saved ₦{current.toLocaleString()} of ₦{target.toLocaleString()}
            </p>
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/50 flex justify-end items-center space-x-3">
                <button onClick={onEdit} className="text-sm font-semibold text-text-muted-light dark:text-text-muted-dark hover:text-primary">Edit</button>
                <button onClick={onDelete} className="text-sm font-semibold text-red-500 hover:text-red-700">Cancel</button>
            </div>
        </div>
    );
};

const Save: React.FC = () => {
    const navigate = useNavigate();
    const [savings, setSavings] = useState<SavingGoalData[]>([]);

    const loadSavings = () => {
        const savedGoalsJSON = localStorage.getItem('userSavingGoals');
        setSavings(savedGoalsJSON ? JSON.parse(savedGoalsJSON) : []);
    };

    useEffect(() => {
        loadSavings();
        // Add event listener to refresh data when the user navigates back to the tab
        window.addEventListener('focus', loadSavings);
        return () => {
            window.removeEventListener('focus', loadSavings);
        };
    }, []);

    const handleEdit = (id: number) => {
        navigate(`/edit-saving-goal/${id}`);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to cancel this saving goal? This action cannot be undone.')) {
            const updatedSavings = savings.filter(goal => goal.id !== id);
            setSavings(updatedSavings);
            localStorage.setItem('userSavingGoals', JSON.stringify(updatedSavings));
        }
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-text-light dark:text-text-dark">Savings</h1>
                <Link to="/create-saving-goal" className="flex items-center justify-center w-10 h-10 bg-primary text-white rounded-full shadow-lg shadow-primary/30">
                   <PlusIcon />
                </Link>
            </div>

            <div className="space-y-4">
                {savings.length > 0 ? (
                    savings.map(goal => (
                        <SavingGoal 
                            key={goal.id} 
                            goal={goal}
                            onEdit={() => handleEdit(goal.id)}
                            onDelete={() => handleDelete(goal.id)}
                        />
                    ))
                ) : (
                    <div className="text-center p-8 bg-card-light dark:bg-card-dark rounded-xl">
                        <p className="text-text-muted-light dark:text-text-muted-dark">You have no active saving goals.</p>
                        <Link to="/create-saving-goal" className="mt-4 font-bold text-primary inline-block">Start a new goal</Link>
                    </div>
                )}
            </div>

            <div className="mt-8 p-5 bg-primary/10 dark:bg-primary/20 rounded-xl text-center">
                 <h3 className="font-bold text-primary dark:text-blue-300">Start a new goal</h3>
                 <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-1">
                    Create a new savings plan and watch your money grow.
                 </p>
            </div>
        </div>
    );
};

export default Save;
