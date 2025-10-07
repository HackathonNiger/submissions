import React, { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { getTransactions } from '../services/transactionService';
import { 
    ImageIcon, DocumentIcon, SpinnerIcon, SupportIcon
} from '../components/icons';
import { getTransactionIcon } from '../utils/transactionUtils';

// --- Receipt Component (for capturing) ---
const TransactionReceipt = React.forwardRef<HTMLDivElement, { transaction: any }>(({ transaction }, ref) => {
    const isCredit = transaction.type === 'credit';
    
    return (
        <div ref={ref} className="bg-white p-6 w-[350px] font-display text-gray-800">
            <div className="text-center mb-4">
                <div className="opay-gradient w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2 shadow-lg shadow-primary/30">
                    <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 10v-1m-6.364-3.636L4.636 12m14.728 0l-1.002.001M17.657 6.343L16.657 7.343m-9.314 9.314l-1 1M12 21a9 9 0 110-18 9 9 0 010 18z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    </svg>
                </div>
                <h2 className="text-xl font-bold">FinXchange</h2>
                <p className="text-xs text-gray-500">Transaction Receipt</p>
            </div>
            
            <div className="text-center my-6">
                <p className={`text-3xl font-bold ${isCredit ? 'text-green-600' : 'text-gray-800'}`}>
                    {isCredit ? '+' : '-'}₦{transaction.amount.toLocaleString('en-US')}
                </p>
                <p className="text-sm text-gray-600 mt-1">{transaction.title}</p>
                 <span className={`mt-2 inline-block text-xs font-bold px-3 py-1 rounded-full ${transaction.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {transaction.status}
                </span>
            </div>

            <div className="border-t border-b border-gray-200 py-2 my-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Transaction ID:</span><span className="font-semibold text-right">{transaction.transactionId}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Date & Time:</span><span className="font-semibold text-right">{transaction.date}</span></div>
                {transaction.recipientName && <div className="flex justify-between"><span className="text-gray-500">Recipient:</span><span className="font-semibold text-right">{transaction.recipientName}</span></div>}
                <div className="flex justify-between"><span className="text-gray-500">Payment Method:</span><span className="font-semibold text-right">{transaction.paymentMethod}</span></div>
            </div>

            <p className="text-center text-xs text-gray-500 mt-4">Thank you for using FinXchange.</p>
        </div>
    );
});

// --- Share Menu Modal ---
const ShareMenuModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onShare: (format: 'png' | 'pdf') => void;
}> = ({ isOpen, onClose, onShare }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 flex items-end justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-2xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
                <div className="p-2 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="text-center font-bold text-text-light dark:text-text-dark">Share Receipt</h3>
                </div>
                <div className="p-4 space-y-3">
                    <button onClick={() => onShare('png')} className="w-full h-12 flex items-center justify-center gap-3 bg-slate-100 dark:bg-slate-700 text-text-light dark:text-text-dark font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                        <ImageIcon />
                        Download as Image (PNG)
                    </button>
                    <button onClick={() => onShare('pdf')} className="w-full h-12 flex items-center justify-center gap-3 bg-slate-100 dark:bg-slate-700 text-text-light dark:text-text-dark font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                        <DocumentIcon />
                        Download as PDF
                    </button>
                </div>
                 <div className="p-4">
                     <button onClick={onClose} className="w-full h-12 bg-slate-200 dark:bg-slate-600 text-text-light dark:text-text-dark font-bold rounded-lg">Cancel</button>
                </div>
            </div>
        </div>
    );
};

// --- Loading Overlay ---
const LoadingOverlay: React.FC = () => (
    <div className="fixed inset-0 bg-black/60 flex flex-col items-center justify-center z-50 p-4 text-white">
        <SpinnerIcon className="w-12 h-12" />
        <p className="mt-4 font-semibold">Generating receipt...</p>
    </div>
);

const DetailRow: React.FC<{ label: string; value: string | React.ReactNode; isCopiable?: boolean }> = ({ label, value, isCopiable }) => (
    <div className="flex justify-between items-center py-3">
        <p className="text-sm text-text-muted-light dark:text-text-muted-dark">{label}</p>
        <div className="flex items-center gap-2">
             <p className="text-sm font-semibold text-text-light dark:text-text-dark text-right">{value}</p>
             {isCopiable && (
                <button
                    onClick={() => {
                        if (typeof value === 'string') {
                            navigator.clipboard.writeText(value);
                            alert('Copied!');
                        }
                    }}
                    className="text-primary font-bold text-xs"
                >
                    Copy
                </button>
             )}
        </div>
    </div>
);

const TransactionDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const receiptRef = useRef<HTMLDivElement>(null);
    const [isSharing, setIsSharing] = useState(false);
    const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);

    const transactions = getTransactions();
    const transaction = transactions.find(tx => tx.id.toString() === id);

    const generateShareable = async (format: 'png' | 'pdf') => {
        if (!receiptRef.current) return;
        setIsShareMenuOpen(false);
        setIsSharing(true);

        try {
            const canvas = await html2canvas(receiptRef.current, {
                scale: 2,
                backgroundColor: '#ffffff', // Explicit background for canvas
                useCORS: true,
            });

            const fileName = `FinXchange-Receipt-${details.transactionId}`;

            if (format === 'png') {
                const image = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.href = image;
                link.download = `${fileName}.png`;
                link.click();
            } else { // pdf
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'px',
                    format: [canvas.width, canvas.height]
                });
                pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
                pdf.save(`${fileName}.pdf`);
            }
        } catch (error) {
            console.error('Error generating shareable:', error);
            alert('Could not generate receipt. Please try again.');
        } finally {
            setIsSharing(false);
        }
    };

    if (!transaction) {
        return (
            <div className="p-6 text-center">
                <p>Transaction not found.</p>
                <button onClick={() => navigate(-1)} className="mt-4 text-primary font-bold">Go Back</button>
            </div>
        );
    }

    const isCredit = transaction.type === 'credit';
    const statusColor = transaction.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700';

    const details = {
        ...transaction,
        transactionId: `TRX${transaction.id.toString().slice(-8)}`,
        paymentMethod: isCredit ? "Bank Transfer" : "Wallet Balance",
        recipientName: transaction.title.includes('Transfer to') ? transaction.title.replace('Transfer to ', '') : undefined,
        narration: transaction.title.includes('Transfer') ? "Monthly allowance" : "Bill payment"
    };

    return (
        <>
            {/* Hidden component for generating the receipt image/pdf */}
            <div className="fixed -left-[9999px] top-0" aria-hidden="true">
                <TransactionReceipt transaction={details} ref={receiptRef} />
            </div>

            {/* Visible UI for the user */}
            <div className="p-6">
                 <div className="text-center mb-6">
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${isCredit ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {React.cloneElement(getTransactionIcon(details.category), { className: "w-8 h-8" })}
                    </div>
                    <p className={`text-3xl font-bold ${isCredit ? 'text-green-600' : 'text-text-light dark:text-text-dark'}`}>
                        {isCredit ? '+' : '-'}₦{details.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-1">{details.title}</p>
                    <span className={`mt-2 inline-block text-xs font-bold px-3 py-1 rounded-full ${statusColor}`}>
                        {details.status}
                    </span>
                 </div>

                 <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-sm divide-y divide-slate-100 dark:divide-slate-700/50">
                    <DetailRow label="Transaction ID" value={details.transactionId} isCopiable />
                    <DetailRow label="Date & Time" value={details.date} />
                    <DetailRow label="Payment Method" value={details.paymentMethod} />
                    {details.recipientName && <DetailRow label="Recipient" value={details.recipientName} />}
                    <DetailRow label="Narration" value={details.narration} />
                 </div>

                 <div className="mt-8 space-y-3">
                     <button onClick={() => setIsShareMenuOpen(true)} className="w-full h-12 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors">
                        Share Receipt
                     </button>
                     <button onClick={() => navigate('/app/support')} className="w-full h-12 flex items-center justify-center gap-2 bg-red-100 text-red-600 font-bold rounded-lg hover:bg-red-200 transition-colors">
                        <SupportIcon />
                        Report an Issue
                    </button>
                 </div>
            </div>

            <ShareMenuModal isOpen={isShareMenuOpen} onClose={() => setIsShareMenuOpen(false)} onShare={generateShareable} />
            {isSharing && <LoadingOverlay />}
        </>
    );
};

export default TransactionDetail;
