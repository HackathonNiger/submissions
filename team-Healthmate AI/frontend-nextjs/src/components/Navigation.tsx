'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Heart } from './icons';
import { cn } from '@/lib/utils';
import { NavItem } from '@/types';

const navItems: NavItem[] = [
  { href: '/', label: 'Home', icon: 'fas fa-home' },
  { href: '/symptoms', label: 'Symptoms', icon: 'fas fa-stethoscope' },
  { href: '/tips', label: 'Tips', icon: 'fas fa-lightbulb' },
  { href: '/awareness', label: 'Awareness', icon: 'fas fa-book-medical' },
  { href: '/first-aid', label: 'First Aid', icon: 'fas fa-first-aid' },
  { href: '/chat', label: 'Chat', icon: 'fas fa-comment-medical' },
  { href: '/history', label: 'History', icon: 'fas fa-history' },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Sidebar overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main navigation header */}
      <header className="main-nav bg-white shadow-custom sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Brand */}
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <Heart className="h-8 w-8 text-red-500" />
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-gray-900">HealthMate AI</span>
                  <span className="text-xs text-gray-500">Powered by AI, Not a Doctor</span>
                </div>
              </div>
            </div>

            {/* Desktop navigation */}
            <nav className="hidden lg:flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200',
                    pathname === item.href
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:text-primary hover:bg-gray-100'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100"
                aria-label="Toggle navigation menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-red-500" />
            <span className="text-lg font-bold text-gray-900">HealthMate AI</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar navigation */}
        <nav className="mt-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                'flex items-center px-4 py-3 text-base font-medium transition-colors duration-200',
                pathname === item.href
                  ? 'bg-primary text-white border-r-4 border-primary-dark'
                  : 'text-gray-700 hover:text-primary hover:bg-gray-100'
              )}
            >
              <i className={`${item.icon} w-6 mr-3`} />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
          <p className="text-xs text-gray-600 text-center">
            HealthMate AI v2.0<br />
            For educational purposes only
          </p>
        </div>
      </aside>
    </>
  );
}