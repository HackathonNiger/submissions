'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import BottomNav from './BottomNav';
import AuthGuard from '../auth/AuthGuard';

export default function DashboardLayout({ children, title, subtitle, actions }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 flex font-space">
        {/* Sidebar */}
        <Sidebar 
          isCollapsed={sidebarCollapsed} 
          setIsCollapsed={setSidebarCollapsed}
          isMobileOpen={mobileMenuOpen}
          setIsMobileOpen={setMobileMenuOpen}
        />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Header */}
          <DashboardHeader 
            title={title}
            subtitle={subtitle}
            actions={actions}
            onMobileMenuClick={() => setMobileMenuOpen(true)}
          />
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 pb-20 lg:pb-6">
            {children}
          </div>
        </main>
        </div>
        
        {/* Bottom Navigation - Mobile Only */}
        <BottomNav />
      </div>
    </AuthGuard>
  );
}
