'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, CreditCard, Camera, BarChart3, 
  Settings, Wallet, Plus, Banknote
} from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();
  
  const navItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      href: '/a/dashboard',
      active: pathname === '/a/dashboard'
    },
    {
      title: 'Wallet',
      icon: Wallet,
      href: '/a/wallet',
      active: pathname === '/a/wallet'
    },
    {
      title: 'Pay',
      icon: Banknote,
      href: '/a/pay',
      active: pathname === '/a/pay',
      primary: true
    },
    {
      title: 'Biometric',
      icon: Camera,
      href: '/a/biometric',
      active: pathname.startsWith('/a/biometric')
    },
    {
      title: 'Settings',
      icon: Settings,
      href: '/a/settings',
      active: pathname === '/a/settings'
    }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
              item.primary
                ? 'bg-primary text-white'
                : item.active
                ? 'text-primary bg-blue-50'
                : 'text-gray-600 hover:text-primary hover:bg-gray-50'
            }`}
          >
            <item.icon className={`w-5 h-5 ${
              item.primary ? 'text-white' : item.active ? 'text-primary' : 'text-current'
            }`} />
            <span className={`text-xs font-medium ${
              item.primary ? 'text-white' : item.active ? 'text-primary' : 'text-current'
            }`}>
              {item.title}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
