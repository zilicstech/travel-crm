'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Plane, LayoutDashboard, Building2, LogOut, User } from 'lucide-react';

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: '/platform/dashboard', label: 'Platform Overview', icon: LayoutDashboard },
    { href: '/platform/agencies', label: 'Agency Management', icon: Building2 },
  ];

  const getPageTitle = () => {
    const match = navItems.find(item => pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/platform/dashboard'));
    return match ? match.label : 'Platform Overview';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-left">
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <Plane className="h-5 w-5 text-blue-600 mr-2" />
          <span className="font-bold text-lg text-slate-900 tracking-tight">TravelOS</span>
        </div>
        <div className="p-4 flex-1">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-3">Platform Admin</p>
          <div className="space-y-1">
            {navItems.map(item => {
              const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/platform/dashboard');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <item.icon className="h-4 w-4 mr-3" /> {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 justify-between">
          <h2 className="text-sm font-semibold text-slate-800">
            {getPageTitle()}
          </h2>
          <div className="flex gap-4 relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 hover:bg-slate-50 p-1.5 rounded-lg transition-colors"
            >
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-slate-900 leading-tight">Admin User</p>
                <p className="text-[11px] text-slate-500">Super Admin</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                AD
              </div>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50">
                <div className="px-4 py-2 border-b border-slate-100 md:hidden">
                  <p className="text-sm font-semibold text-slate-900">Admin User</p>
                  <p className="text-[11px] text-slate-500">Super Admin</p>
                </div>
                <button onClick={() => { setIsDropdownOpen(false); router.push('/login'); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center">
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
