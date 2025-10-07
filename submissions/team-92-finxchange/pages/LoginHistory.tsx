
import React from 'react';
import { DevicePhoneMobileIcon, MapPinIcon } from '../components/icons';

const loginHistoryData = [
    { id: 1, device: 'iPhone 14 Pro', location: 'Lagos, NG', time: '2024-07-23 10:05 AM', isCurrent: true },
    { id: 2, device: 'Chrome on Windows', location: 'Abuja, NG', time: '2024-07-22 08:12 PM', isCurrent: false },
    { id: 3, device: 'Android (Samsung)', location: 'Lagos, NG', time: '2024-07-21 02:30 PM', isCurrent: false },
    { id: 4, device: 'iPhone 14 Pro', location: 'Ibadan, NG', time: '2024-07-20 09:00 AM', isCurrent: false },
];

const LoginHistoryItem: React.FC<typeof loginHistoryData[0]> = ({ device, location, time, isCurrent }) => (
    <div className="flex items-start space-x-4 p-4">
        <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center bg-slate-100 dark:bg-slate-700 text-primary">
            <DevicePhoneMobileIcon />
        </div>
        <div className="flex-1">
            <p className="font-bold text-sm text-text-light dark:text-text-dark">{device} {isCurrent && <span className="text-xs text-green-500 font-normal">(Current session)</span>}</p>
            <div className="flex items-center text-xs text-text-muted-light dark:text-text-muted-dark mt-1">
                <div className="w-4 h-4">
                   <MapPinIcon />
                </div>
                <span className="ml-1">{location}</span>
            </div>
        </div>
        <p className="text-xs text-text-muted-light dark:text-text-muted-dark flex-shrink-0">{time}</p>
    </div>
);


const LoginHistory: React.FC = () => {
    return (
        <div className="p-4">
            <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-700/50">
                {loginHistoryData.map(item => <LoginHistoryItem key={item.id} {...item} />)}
            </div>
             <div className="mt-6 text-center">
                <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                    If you see any suspicious activity, please change your password immediately and contact support.
                </p>
            </div>
        </div>
    );
};

export default LoginHistory;