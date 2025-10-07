
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRightIcon, SupportIcon, ProfileIcon, NotificationIcon, ReferralIcon, LanguageIcon, ChatIcon, LogoutIcon, ShieldCheckIcon, LockClosedIcon } from '../components/icons';

const ProfileMenuItem: React.FC<{ icon: React.ReactNode; children: React.ReactNode; to: string }> = ({ icon, children, to }) => (
    <Link to={to} className="w-full text-left flex items-center p-4 border-b border-slate-100 dark:border-slate-700/50 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
        <div className="text-primary mr-4">{icon}</div>
        <span className="flex-1 font-semibold text-text-light dark:text-text-dark">{children}</span>
        <div className="text-text-muted-light dark:text-text-muted-dark">
            <ChevronRightIcon />
        </div>
    </Link>
);


const Profile: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('hasOnboarded');
        // also clear kyc level
        localStorage.removeItem('kycLevel');
        navigate('/', { replace: true });
    };

    return (
        <div className="p-4 bg-background-light dark:bg-background-dark min-h-screen">
            <h1 className="text-3xl font-bold text-text-light dark:text-text-dark mb-6">Me</h1>

            {/* User Info */}
            <div className="flex items-center bg-card-light dark:bg-card-dark p-5 rounded-xl shadow-sm mb-8">
                <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 mr-4"></div>
                <div>
                    <h2 className="text-xl font-bold text-text-light dark:text-text-dark">FinXchange User</h2>
                    <p className="text-text-muted-light dark:text-text-muted-dark">ID: 8012345678</p>
                </div>
            </div>

            {/* Menu */}
            <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm mb-6">
                <ProfileMenuItem icon={<ProfileIcon />} to="/account-info">Account Information</ProfileMenuItem>
                <ProfileMenuItem icon={<ShieldCheckIcon />} to="/kyc">KYC & Limits</ProfileMenuItem>
                <ProfileMenuItem icon={<LockClosedIcon />} to="/security-settings">Security Settings</ProfileMenuItem>
                <ProfileMenuItem icon={<NotificationIcon />} to="/app/notifications">Notifications</ProfileMenuItem>
                <ProfileMenuItem icon={<ReferralIcon />} to="/app/referrals">Refer & Earn</ProfileMenuItem>
            </div>
            
            <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm">
                 <ProfileMenuItem icon={<LanguageIcon />} to="/language-settings">Language</ProfileMenuItem>
                 <ProfileMenuItem icon={<ChatIcon />} to="/app/chatbot">Chat with us</ProfileMenuItem>
                 <ProfileMenuItem icon={<SupportIcon />} to="/app/support">Help & Support</ProfileMenuItem>
            </div>

            <button
                onClick={handleLogout}
                className="mt-8 w-full h-12 flex items-center justify-center bg-red-100 text-red-600 font-bold rounded-lg hover:bg-red-200 transition-colors">
                <LogoutIcon />
                <span className="ml-2">Log Out</span>
            </button>
        </div>
    );
};

export default Profile;
