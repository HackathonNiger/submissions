
import React from 'react';

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="flex justify-between items-center py-4 border-b border-slate-100 dark:border-slate-700/50 last:border-b-0">
        <p className="text-sm text-text-muted-light dark:text-text-muted-dark">{label}</p>
        <p className="text-sm font-semibold text-text-light dark:text-text-dark text-right">{value}</p>
    </div>
);

const AccountInfo: React.FC = () => {
    return (
        <div className="p-6">
            <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-sm">
                <DetailRow label="Full Name" value="FinXchange User" />
                <DetailRow label="Phone Number" value="+234 801 234 5678" />
                <DetailRow label="Email Address" value="user@finxchange.com" />
                <DetailRow label="Residential Address" value="123, Financial Avenue, Lagos" />
                <DetailRow label="Account ID" value="8012345678" />
            </div>
            <div className="mt-6 text-center">
                <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                    To update your personal information, please contact support.
                </p>
            </div>
        </div>
    );
};

export default AccountInfo;
