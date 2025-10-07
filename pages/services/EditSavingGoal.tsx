
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface SavingGoalData {
    id: number;
    title: string;
    target: number;
    current: number;
    targetDate: string;
    frequency: string;
    color: string;
}

const InputField: React.FC<{ label: string; id: string; type: string; placeholder: string; value: string | number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({ label, id, type, placeholder, value, onChange }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">{label}</label>
        <input
            type={type}
            id={id}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full h-12 px-4 bg-background-light dark:bg-background-dark border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            required
        />
    </div>
);

const FrequencyButton: React.FC<{ name: string; selected: boolean; onClick: (name: string) => void; }> = ({ name, selected, onClick }) => (
    <button
        type="button"
        onClick={() => onClick(name)}
        className={`flex-1 py-3 text-sm font-bold rounded-md transition-all ${selected ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-700'}`}
    >
        {name}
    </button>
);

const EditSavingGoal: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const goalId = Number(id);

    const [goalName, setGoalName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [targetDate, setTargetDate] = useState('');
    const [frequency, setFrequency] = useState('Weekly');
    const [currentAmount, setCurrentAmount] = useState(0);

    useEffect(() => {
        const savedGoalsJSON = localStorage.getItem('userSavingGoals');
        if (savedGoalsJSON) {
            const savedGoals: SavingGoalData[] = JSON.parse(savedGoalsJSON);
            const goalToEdit = savedGoals.find(g => g.id === goalId);
            if (goalToEdit) {
                setGoalName(goalToEdit.title);
                setTargetAmount(String(goalToEdit.target));
                setCurrentAmount(goalToEdit.current);
                setTargetDate(goalToEdit.targetDate);
                setFrequency(goalToEdit.frequency);
            } else {
                navigate('/app/save'); // Goal not found, redirect
            }
        }
    }, [goalId, navigate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const savedGoalsJSON = localStorage.getItem('userSavingGoals');
        const savedGoals: SavingGoalData[] = savedGoalsJSON ? JSON.parse(savedGoalsJSON) : [];

        const updatedGoals = savedGoals.map(goal => {
            if (goal.id === goalId) {
                return {
                    ...goal,
                    title: goalName,
                    target: Number(targetAmount),
                    targetDate,
                    frequency,
                };
            }
            return goal;
        });

        localStorage.setItem('userSavingGoals', JSON.stringify(updatedGoals));
        alert('Goal updated successfully!');
        navigate('/app/save');
    };

    return (
        <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                <InputField
                    label="Goal Name"
                    id="goalName"
                    type="text"
                    placeholder="e.g., New Laptop"
                    value={goalName}
                    onChange={(e) => setGoalName(e.target.value)}
                />

                <InputField
                    label="Target Amount (₦)"
                    id="targetAmount"
                    type="number"
                    placeholder="e.g., 450,000"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                />
                
                 <div>
                    <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Current Amount (₦)</label>
                     <input
                        type="number"
                        value={currentAmount}
                        disabled
                        className="w-full h-12 px-4 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none"
                    />
                </div>

                <InputField
                    label="Target Date"
                    id="targetDate"
                    type="date"
                    placeholder=""
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                />

                <div>
                    <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-2">Saving Frequency</label>
                    <div className="flex space-x-2">
                        <FrequencyButton name="Daily" selected={frequency === 'Daily'} onClick={setFrequency} />
                        <FrequencyButton name="Weekly" selected={frequency === 'Weekly'} onClick={setFrequency} />
                        <FrequencyButton name="Monthly" selected={frequency === 'Monthly'} onClick={setFrequency} />
                    </div>
                </div>

                <button type="submit" className="w-full h-14 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30">
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default EditSavingGoal;
