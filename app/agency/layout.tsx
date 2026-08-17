'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Plane, LogOut, LayoutDashboard, Users, UserPlus, Receipt,
  BarChart3, User, Briefcase, Shield, ChevronRight, Menu, X,
  Bell, Building2, Sliders
} from 'lucide-react';

export default function AgencyLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // ── Navigation ──────────────────────────────────────────────────────────
  const navItems = [
    { href: '/agency/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/agency/agents', label: 'Agents', icon: Users },
    { href: '/agency/leads', label: 'Leads', icon: UserPlus },
    { href: '/agency/clients', label: 'Clients', icon: Building2 },
    { href: '/agency/bookings', label: 'Bookings', icon: Briefcase },
    { href: '/agency/visa', label: 'Visa', icon: Shield },
    { href: '/agency/invoices', label: 'Invoices', icon: Receipt },
    { href: '/agency/reports', label: 'Reports', icon: BarChart3 },
    { href: '/agency/settings', label: 'Settings', icon: Sliders },
  ];

  const isActive = (item: typeof navItems[0]) =>
    pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/agency/dashboard');

  // Breadcrumbs
  const breadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length <= 1) return null;
    return (
      <nav className="flex items-center gap-1 text-sm">
        {segments.map((seg, i) => {
          const path = '/' + segments.slice(0, i + 1).join('/');
          const label = seg.charAt(0).toUpperCase() + seg.slice(1).replace(/[-_]/g, ' ');
          const isLast = i === segments.length - 1;
          return (
            <span key={path} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-300" />}
              {isLast ? (
                <span className="text-slate-900 font-medium text-sm">{label}</span>
              ) : (
                <Link href={path} className="text-slate-400 hover:text-slate-600 text-sm transition-colors">{label}</Link>
              )}
            </span>
          );
        })}
      </nav>
    );
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="h-14 flex items-center px-5 border-b border-slate-700/50 flex-shrink-0">
        <Plane className="h-5 w-5 text-blue-400 mr-2.5" />
        <span className="font-bold text-base text-white tracking-tight">TravelOS</span>
      </div>

      {/* Nav */}
      <div className="p-3 flex-1 overflow-y-auto">
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2 px-3">Main Menu</p>
        <div className="space-y-0.5">
          {navItems.map(item => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center w-full px-3 py-2 text-[13px] font-medium rounded-lg transition-all duration-150 ${
                  active
                    ? 'text-white bg-blue-600/90'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <item.icon className="h-4 w-4 mr-3 flex-shrink-0" /> {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* User card at bottom */}
      <div className="p-3 border-t border-slate-700/50 flex-shrink-0">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center text-blue-400 font-semibold text-xs flex-shrink-0">
            JD
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-200 truncate">John Davis</p>
            <p className="text-[11px] text-slate-500 truncate">Agency Owner</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[var(--surface-bg)] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-[260px] bg-slate-900 flex-col flex-shrink-0 fixed inset-y-0 left-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-[280px] bg-slate-900 flex flex-col z-50 shadow-2xl">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 flex flex-col md:ml-[260px] min-h-screen">
        {/* Top Bar */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center px-4 md:px-6 justify-between flex-shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            {breadcrumbs()}
          </div>

          <div className="flex items-center gap-2">
            {/* Notification */}
            <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors relative">
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* Profile */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2.5 hover:bg-slate-50 py-1.5 px-2 rounded-lg transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-[11px]">
                  JD
                </div>
                <div className="text-right hidden lg:block">
                  <p className="text-[13px] font-medium text-slate-900 leading-tight">John Davis</p>
                </div>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-medium text-slate-900">John Davis</p>
                    <p className="text-xs text-slate-500">Agency Owner</p>
                  </div>
                  <Link href="/agency/account" onClick={() => setIsDropdownOpen(false)} className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                    <User className="w-4 h-4 mr-2.5 text-slate-400" /> My Profile
                  </Link>
                  <Link href="/agency/settings" onClick={() => setIsDropdownOpen(false)} className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                    <Sliders className="w-4 h-4 mr-2.5 text-slate-400" /> Agency Settings
                  </Link>
                  <div className="border-t border-slate-100">
                    <button onClick={() => { setIsDropdownOpen(false); router.push('/login'); }} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center">
                      <LogOut className="w-4 h-4 mr-2.5" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-[1200px] mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
