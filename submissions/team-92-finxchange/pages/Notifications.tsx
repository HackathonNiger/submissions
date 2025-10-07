import React from 'react';
import { CreditIcon, DebitIcon, NotificationIcon } from '../components/icons';

const notificationsData = [
    { id: 1, icon: <CreditIcon />, title: 'Credit Alert', message: 'You have received ₦50,000 from Bank Deposit.', time: '10 mins ago', read: false },
    { id: 2, icon: <DebitIcon />, title: 'Debit Alert', message: 'Your purchase of ₦2,000 for MTN Airtime was successful.', time: '1 hour ago', read: false },
    { id: 3, icon: <NotificationIcon />, title: 'New Feature', message: 'You can now apply for micro-loans directly in the app!', time: 'Yesterday', read: true },
    { id: 4, icon: <DebitIcon />, title: 'Debit Alert', message: 'Your transfer of ₦15,000 to John Doe was successful.', time: '2 days ago', read: true },
];

const NotificationItem: React.FC<typeof notificationsData[0]> = ({ icon, title, message, time, read }) => (
    <div className={`flex items-start space-x-4 p-4 ${!read ? 'bg-primary/5 dark:bg-primary/10' : ''}`}>
        <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center bg-slate-100 dark:bg-slate-700 text-primary">
            {icon}
        </div>
        <div className="flex-1">
            <p className="font-bold text-sm text-text-light dark:text-text-dark">{title}</p>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">{message}</p>
        </div>
        <div className="text-right flex-shrink-0">
             <p className="text-xs text-text-muted-light dark:text-text-muted-dark">{time}</p>
             {!read && <div className="mt-1 w-2 h-2 bg-primary rounded-full ml-auto"></div>}
        </div>
    </div>
);

const Notifications: React.FC = () => {
    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold text-text-light dark:text-text-dark mb-4">Notifications</h1>

            <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-700/50">
                {notificationsData.map(item => <NotificationItem key={item.id} {...item} />)}
            </div>
        </div>
    );
};

export default Notifications;