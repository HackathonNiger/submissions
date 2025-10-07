import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

const MainLayout: React.FC = () => {
    return (
        <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-background-light dark:bg-background-dark">
            <main className="flex-1 overflow-y-auto pb-20">
                <Outlet />
            </main>
            <BottomNav />
        </div>
    );
};

export default MainLayout;