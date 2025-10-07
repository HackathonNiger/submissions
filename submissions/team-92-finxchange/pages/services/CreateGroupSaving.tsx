
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

const SelectField: React.FC<{ label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; children: React.ReactNode; }> = ({ label, id, value, onChange, children }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">{label}</label>
        <select
            id={id}
            value={value}
            onChange={onChange}
            className="w-full h-12 px-3 bg-background-light dark:bg-background-dark border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none appearance-none"
            required
        >
            {children}
        </select>
    </div>
);


const CreateGroupSaving: React.FC = () => {
    const navigate = useNavigate();
    const [groupName, setGroupName] = useState('');
    const [contributionAmount, setContributionAmount] = useState('');
    const [frequency, setFrequency] = useState('Monthly');
    const [membersCount, setMembersCount] = useState(2);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Group saving plan "${groupName}" created successfully!`);
        navigate('/app/group-savings');
    };

    return (
        <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                <InputField
                    label="Group Name"
                    id="groupName"
                    type="text"
                    placeholder="e.g., Office Ajo"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                />

                <InputField
                    label="Contribution Amount (per member)"
                    id="contributionAmount"
                    type="number"
                    placeholder="e.g., 10,000"
                    value={contributionAmount}
                    onChange={(e) => setContributionAmount(e.target.value)}
                />

                <SelectField label="Contribution Frequency" id="frequency" value={frequency} onChange={(e) => setFrequency(e.target.value)}>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                </SelectField>

                 <InputField
                    label="Number of Members"
                    id="membersCount"
                    type="number"
                    placeholder="e.g., 12"
                    value={membersCount}
                    onChange={(e) => setMembersCount(Math.max(2, parseInt(e.target.value) || 2))}
                />

                <div>
                    <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Invite Members</label>
                    <textarea 
                        placeholder="Enter phone numbers, separated by commas"
                        rows={3}
                        className="w-full p-3 bg-background-light dark:bg-background-dark border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                </div>

                <button type="submit" className="w-full h-14 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30">
                    Create Group
                </button>
            </form>
        </div>
    );
};

export default CreateGroupSaving;
