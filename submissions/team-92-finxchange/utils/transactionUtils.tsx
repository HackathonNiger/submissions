import React from 'react';
import { 
    CreditIcon, SendIcon, AirtimeIcon, DataIcon, ElectricityIcon, TVIcon, 
    BettingIcon, ExamPinIcon, WithdrawIcon, BillsIcon, WaterIcon, SchoolIcon, DebitIcon 
} from '../components/icons';
import { TransactionCategory } from '../services/transactionService';

export const getTransactionIcon = (category: TransactionCategory): React.ReactNode => {
    switch (category) {
        case 'deposit':
            return <CreditIcon />;
        case 'transfer':
            return <SendIcon />;
        case 'airtime':
            return <AirtimeIcon />;
        case 'data':
            return <DataIcon />;
        case 'electricity':
            return <ElectricityIcon />;
        case 'tv':
            return <TVIcon />;
        case 'betting':
            return <BettingIcon />;
        case 'exam-pin':
            return <ExamPinIcon />;
        case 'withdrawal':
            return <WithdrawIcon />;
        case 'internet':
            return <BillsIcon />;
        case 'water':
            return <WaterIcon />;
        case 'school':
            return <SchoolIcon />;
        default:
            return <DebitIcon />;
    }
};
