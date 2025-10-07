import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TransactionConfirmationModal, AuthorizationModal } from '../../layouts/ServicePageLayout';
import { getBalance, subtractFromBalance, addTransaction } from '../../services/transactionService';

const SelectField: React.FC<{ label: string; id: string; children: React.ReactNode; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; }> = ({ label, id, children, value, onChange }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">{label}</label>
        <select 
            id={id} 
            value={value}
            onChange={onChange}
            className="w-full h-12 px-3 bg-background-light dark:bg-background-dark border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none appearance-none"
        >
            {children}
        </select>
    </div>
);

const InputField: React.FC<{ label: string; type: string; placeholder: string; id: string; value: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({ label, type, placeholder, id, value, onChange }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">{label}</label>
        <input 
            type={type} 
            id={id} 
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full h-12 px-4 bg-background-light dark:bg-background-dark border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" 
        />
    </div>
);

const ExamPin: React.FC = () => {
    const navigate = useNavigate();
    const [examBody, setExamBody] = useState('WAEC Result Checker PIN');
    const [quantity, setQuantity] = useState(1);
    const pricePerPin = 3500;
    const total = quantity * pricePerPin;

    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [transactionDetails, setTransactionDetails] = useState<Record<string, string | number>>({});

    const executePurchase = () => {
        setIsAuthModalOpen(false);
        const purchaseAmount = total;
        const currentBalance = getBalance();

        if (currentBalance < purchaseAmount) {
            alert("Insufficient funds to complete this transaction.");
            return;
        }

        subtractFromBalance(purchaseAmount);
        addTransaction({
            type: 'debit',
            category: 'exam-pin',
            title: `Purchase ${examBody}`,
            amount: purchaseAmount,
            status: 'Completed'
        });

        navigate('/success', {
            state: {
                title: 'Purchase Successful!',
                message: `You have purchased ${quantity} ${examBody}(s) for a total of ₦${total.toLocaleString()}.`,
                primaryActionText: 'Done',
                primaryActionRoute: '/app/dashboard',
                secondaryActionText: 'Buy More PINs',
                secondaryActionRoute: '/exam-pin'
            },
            replace: true
        });
    };

    const handlePurchase = (e: React.FormEvent) => {
        e.preventDefault();
        setTransactionDetails({
            "Service": "Exam PIN Purchase",
            "Exam Body": examBody,
            "Quantity": quantity,
            "Total Cost": `₦${total.toLocaleString()}`
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
                <form onSubmit={handlePurchase} className="space-y-6">
                    <SelectField id="examBody" label="Select Exam Body" value={examBody} onChange={e => setExamBody(e.target.value)}>
                        <option>WAEC Result Checker PIN</option>
                        <option>NECO Result Checker PIN</option>
                        <option>JAMB e-PIN</option>
                    </SelectField>

                    <InputField 
                        id="quantity" 
                        label="Quantity" 
                        type="number" 
                        placeholder="Enter quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    />

                    <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg text-sm">
                        <div className="flex justify-between">
                            <span className="text-text-muted-light dark:text-text-muted-dark">Price per PIN</span>
                            <span className="font-semibold text-text-light dark:text-text-dark">₦{pricePerPin.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between mt-2 font-bold">
                            <span className="text-text-light dark:text-text-dark">Total to Pay</span>
                            <span className="text-primary">₦{total.toLocaleString()}</span>
                        </div>
                    </div>
                    
                    <button type="submit" className="w-full h-14 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30">
                        Purchase PIN
                    </button>
                </form>
            </div>
            <TransactionConfirmationModal
                isOpen={isConfirmationModalOpen}
                onClose={() => setIsConfirmationModalOpen(false)}
                onConfirm={handleConfirmAndProceed}
                title="Confirm Exam PIN Purchase"
                details={transactionDetails}
            />
            <AuthorizationModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onConfirm={executePurchase}
                title="Authorize Purchase"
                details={transactionDetails}
            />
        </>
    );
};

export default ExamPin;
