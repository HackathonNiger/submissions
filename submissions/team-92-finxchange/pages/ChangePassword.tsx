
import React from 'react';
import { useNavigate } from 'react-router-dom';

const InputField: React.FC<{ label: string; id: string; }> = ({ label, id }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">{label}</label>
        <input 
            type="password" 
            id={id} 
            className="w-full h-12 px-4 bg-background-light dark:bg-background-dark border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" 
            required
        />
    </div>
);

const ChangePassword: React.FC = () => {
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Add password change logic here
        alert('Password changed successfully!');
        navigate(-1);
    };

    return (
        <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                <InputField id="currentPassword" label="Current Password" />
                <InputField id="newPassword" label="New Password" />
                <InputField id="confirmNewPassword" label="Confirm New Password" />
                
                <div className="pt-4">
                    <button type="submit" className="w-full h-14 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChangePassword;