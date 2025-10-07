import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, SaveIcon, SupportIcon, ProfileIcon, VoiceIcon } from './icons';

interface NavItemProps {
    to: string;
    label: string;
    icon: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ to, label, icon }) => {
    const activeClass = 'text-primary';
    const inactiveClass = 'text-text-muted-light dark:text-text-muted-dark hover:text-primary transition-colors';

    return (
        <NavLink
            to={to}
            className={({ isActive }) => 
                `flex flex-col items-center justify-center w-full pt-2 pb-1 ${isActive ? activeClass : inactiveClass}`
            }
        >
            {icon}
            <span className="text-xs font-medium mt-1">{label}</span>
        </NavLink>
    );
};

const BottomNav: React.FC = () => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card-light dark:bg-card-dark shadow-[0_-2px_10px_rgba(0,0,0,0.05)] max-w-md mx-auto">
            <div className="flex justify-around items-center h-full">
                <NavItem to="/app/dashboard" label="Home" icon={<HomeIcon />} />
                <NavItem to="/app/finance" label="Finance" icon={<SaveIcon />} />
                <NavItem to="/app/voice-payment" label="Voice" icon={<VoiceIcon />} />
                <NavItem to="/app/support" label="Support" icon={<SupportIcon />} />
                <NavItem to="/app/profile" label="Me" icon={<ProfileIcon />} />
            </div>
        </nav>
    );
};

export default BottomNav;