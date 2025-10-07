import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TransactionConfirmationModal, AuthorizationModal } from '../../layouts/ServicePageLayout';
import { getBalance, subtractFromBalance, addTransaction } from '../../services/transactionService';

const InputField: React.FC<{ label: string; type: string; placeholder: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({ label, type, placeholder, id, value, onChange }) => (
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

const SchoolFees: React.FC = () => {
    const navigate = useNavigate();
    const [school, setSchool] = useState('University of Lagos');
    const [studentId, setStudentId] = useState('');
    const [studentName, setStudentName] = useState('');
    const [amount, setAmount] = useState('');

    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [transactionDetails, setTransactionDetails] = useState<Record<string, string | number>>({});

    const executePayment = () => {
        setIsAuthModalOpen(false);
        const paymentAmount = Number(amount);
        const currentBalance = getBalance();

        if (currentBalance < paymentAmount) {
            alert("Insufficient funds to complete this transaction.");
            return;
        }

        subtractFromBalance(paymentAmount);
        addTransaction({
            type: 'debit',
            category: 'school',
            title: `School Fees for ${studentName}`,
            amount: paymentAmount,
            status: 'Completed'
        });

        navigate('/success', {
            state: {
                title: 'Payment Successful!',
                message: `Successfully paid ₦${amount} for ${studentName} (ID: ${studentId}) to ${school}.`,
                primaryActionText: 'Done',
                primaryActionRoute: '/app/dashboard',
                secondaryActionText: 'Make Another Payment',
                secondaryActionRoute: '/school-fees'
            },
            replace: true
        });
    };

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        setTransactionDetails({
            "Service": "School Fees",
            "School": school,
            "Student Name": studentName,
            "Student ID": studentId,
            "Amount": `₦${Number(amount).toLocaleString()}`
        });
        setIsConfirmationModalOpen(true);
    };
    
    const handleConfirmAndProceed = () => {
        setIsConfirmationModalOpen(false);
        setIsAuthModalOpen(true);
    };

    return (
        <>
            <div className="p-6">
                <form onSubmit={handlePayment} className="space-y-6">
                    <SelectField id="school" label="Select School/Institution" value={school} onChange={e => setSchool(e.target.value)}>
                        <option>University of Lagos</option>
                        <option>Covenant University</option>
                        <option>Lagos State University</option>
                        <option>Greensprings School</option>
                    </SelectField>
                    
                    <InputField id="studentId" label="Student ID / Matriculation Number" type="text" placeholder="Enter student ID" value={studentId} onChange={e => setStudentId(e.target.value)} />
                    <InputField id="studentName" label="Student Name" type="text" placeholder="Enter student's full name" value={studentName} onChange={e => setStudentName(e.target.value)} />
                    <InputField id="amount" label="Amount" type="number" placeholder="Enter amount to pay" value={amount} onChange={e => setAmount(e.target.value)} />

                    <button type="submit" className="w-full h-14 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30">
                        Pay Fees
                    </button>
                </form>
            </div>
            <TransactionConfirmationModal
                isOpen={isConfirmationModalOpen}
                onClose={() => setIsConfirmationModalOpen(false)}
                onConfirm={handleConfirmAndProceed}
                title="Confirm School Fees Payment"
                details={transactionDetails}
            />
            <AuthorizationModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onConfirm={executePayment}
                title="Authorize Payment"
                details={transactionDetails}
            />
        </>
    );
};

export default SchoolFees;
