'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '../../hooks/useAuth';
import { useWallet } from '../../hooks/useWallet';
import { formatCurrency } from '../../lib/utils/apiUtils';
import { 
  LayoutDashboard, CreditCard, Users, BarChart3, Settings, 
  Camera, Mic, MessageSquare, Building2, Headphones, LogOut, 
  Wallet, Shield, Globe, Banknote, X, ChevronDown, ChevronRight,
  User, Crown, Zap
} from 'lucide-react';

export default function Sidebar({ isMobileOpen, setIsMobileOpen }) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState(['biometric']);
  
  // API hooks
  const { user, logout } = useAuth();
  const { balance, currency, isBalanceLoading } = useWallet();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname, setIsMobileOpen]);
  
  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    {
      id: 'overview',
      title: 'Overview',
      icon: LayoutDashboard,
      href: '/a/dashboard',
      badge: null
    },
    {
      id: 'pay',
      title: 'Merchant Pay',
      icon: Banknote,
      href: '/a/pay',
      merchantOnly: true,
      badge: null
    },
    {
      id: 'wallet',
      title: 'Wallet',
      icon: Wallet,
      href: '/a/wallet',
      badge: null
    },
    {
      id: 'payments',
      title: 'Payments',
      icon: CreditCard,
      merchantOnly: true,
      href: '/a/payments',
      badge: null
    },
    {
      id: 'biometric',
      title: 'Biometric',
      icon: Camera,
      href: '/a/biometric',
      expandable: true,
      submenu: [
        { title: 'Face Recognition', icon: Camera, href: '/a/biometric/face' },
        { title: 'Voice Recognition', icon: Mic, href: '/a/biometric/voice' },
        { title: 'Social Pay', icon: MessageSquare, href: '/a/biometric/social' }
      ]
    },
    {
      id: 'analytics',
      title: 'Analytics',
      icon: BarChart3,
      href: '/a/analytics',
      merchantOnly: true
    },
    {
      id: 'customers',
      title: 'Customers',
      icon: Users,
      href: '/a/customers',
      merchantOnly: true
    },
    {
      id: 'business',
      title: 'Business',
      icon: Building2,
      href: '/a/business',
      merchantOnly: true
    },
    {
      id: 'integration',
      title: 'Integration',
      icon: Globe,
      href: '/a/integration',
      merchantOnly: true
    },
    {
      id: 'security',
      title: 'Security',
      icon: Shield,
      href: '/a/security'
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: Settings,
      href: '/a/settings'
    },
    {
      id: 'support',
      title: 'Support',
      icon: Headphones,
      href: '/a/support'
    }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    !item.merchantOnly || user?.role === 'merchant'
  );

  const toggleExpanded = (itemId) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isActive = (href) => {
    if (href === '/a/dashboard') return pathname === href;
    return pathname.startsWith(href);
  };

  const isSubmenuActive = (submenu) => {
    return submenu.some(item => pathname === item.href);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white/95 backdrop-blur-xl border-r border-gray-200/80 
        transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `} style={{ height: '100vh' }}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200/80">
            <Link href="/a/dashboard" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center  p-1">
                <Image 
                  src="/logo.png" 
                  alt="GestPay Logo" 
                  width={32} 
                  height={32}
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">GestPay</h1>
               
              </div>
            </Link>
            
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* User Profile */}
          <div className="p-6 border-b border-gray-200/80">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg">
                  <User className="w-6 h-6 text-white" />
                </div>
                {user?.plan === 'Pro' && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Crown className="w-3 h-3 text-yellow-800" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.role === 'merchant' ? 'Merchant Account' : 'Personal Account'}
                </p>
                <p className="text-xs font-medium text-primary truncate">
                  {isBalanceLoading ? 'Loading...' : formatCurrency(balance, currency)}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
            {filteredMenuItems.map((item) => (
              <div key={item.id}>
                {item.expandable ? (
                  <div>
                    <button
                      onClick={() => toggleExpanded(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                        isActive(item.href) || isSubmenuActive(item.submenu)
                          ? 'bg-primary/10 text-primary shadow-sm'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className={`w-5 h-5 ${
                          isActive(item.href) || isSubmenuActive(item.submenu)
                            ? 'text-primary'
                            : 'text-gray-500 group-hover:text-gray-700'
                        }`} />
                        <span className="font-medium">{item.title}</span>
                        {item.badge && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {expandedItems.includes(item.id) ? (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    
                    {expandedItems.includes(item.id) && (
                      <div className="mt-2 ml-4 space-y-1">
                        {item.submenu.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            href={subItem.href}
                            className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                              pathname === subItem.href
                                ? 'bg-primary/10 text-primary shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                          >
                            <subItem.icon className="w-4 h-4" />
                            <span className="text-sm font-medium">{subItem.title}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                      isActive(item.href)
                        ? 'bg-primary/10 text-primary shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${
                      isActive(item.href)
                        ? 'text-primary'
                        : 'text-gray-500 group-hover:text-gray-700'
                    }`} />
                    <span className="font-medium">{item.title}</span>
                    {item.badge && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t border-gray-200/80 space-y-3">
            {/* Upgrade Card */}
            {/* <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">Upgrade to Premium</span>
              </div>
              <p className="text-xs text-primary/80 mb-3">
                Unlock advanced features and higher transaction limits
              </p>
              <button className="w-full bg-primary text-white text-sm py-2 rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium shadow-sm">
                Upgrade Now
              </button>
            </div> */}
            
            {/* Sign Out */}
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group"
            >
              <LogOut className="w-5 h-5 text-gray-500 group-hover:text-red-600" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
