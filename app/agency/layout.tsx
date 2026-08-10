'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plane, LogOut, LayoutDashboard, Users, UserPlus, Receipt, FileText, BarChart3, User, Search, Briefcase, Settings, Shield } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function AgencyLayout({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 text-center border-b border-slate-100">
            <div className="mx-auto w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
              <Plane className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 mb-1">Agency Owner Login</h1>
            <p className="text-sm text-slate-500">Log in to manage your travel agency</p>
          </div>
          <div className="p-8 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Email Address</label>
              <Input type="email" placeholder="owner@agency.com" defaultValue="owner@globalexplorer.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <Input type="password" placeholder="••••••••" defaultValue="password" />
            </div>
            <Button className="w-full h-11 text-base bg-slate-900 hover:bg-slate-800 text-white mt-2" onClick={() => setIsLoggedIn(true)}>
              Sign In
            </Button>
            <div className="pt-4 text-center">
              <Link href="/" className="text-sm text-blue-600 hover:underline">
                &larr; Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: '/agency', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/agency/agents', label: 'Agents', icon: Users },
    { href: '/agency/leads', label: 'Leads', icon: UserPlus },
    { href: '/agency/customers', label: 'Customers', icon: User },
    { href: '/agency/bookings', label: 'Bookings', icon: Briefcase },
    { href: '/agency/visa', label: 'Visa', icon: Shield },
    { href: '/agency/invoices', label: 'Invoices', icon: Receipt },
    { href: '/agency/reports', label: 'Reports', icon: BarChart3 },
  ];

  const getPageTitle = () => {
    const match = navItems.find(item => item.exact ? pathname === item.href : pathname.startsWith(item.href) && item.href !== '/agency');
    return match ? match.label : 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <Plane className="h-5 w-5 text-blue-600 mr-2" />
          <span className="font-bold text-lg text-slate-900 tracking-tight">TravelOS</span>
        </div>
        <div className="p-4 flex-1 overflow-y-auto">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-3">Agency Owner</p>
          <div className="space-y-1">
            {navItems.map(item => {
              const isActive = item.exact ? pathname === item.href : (pathname.startsWith(item.href) && item.href !== '/agency');
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
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-semibold text-slate-800">{getPageTitle()}</h2>
          </div>
          <div className="flex gap-4 relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 hover:bg-slate-50 p-1.5 rounded-lg transition-colors"
            >
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-slate-900 leading-tight">John Davis</p>
                <p className="text-[11px] text-slate-500">Agency Owner</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                JD
              </div>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50">
                <div className="px-4 py-2 border-b border-slate-100 md:hidden">
                  <p className="text-sm font-semibold text-slate-900">John Davis</p>
                  <p className="text-[11px] text-slate-500">Agency Owner</p>
                </div>
                <Link href="/agency/account" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center">
                  <User className="w-4 h-4 mr-2" /> My Profile
                </Link>
                <button onClick={() => { setIsLoggedIn(false); setIsDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center">
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
