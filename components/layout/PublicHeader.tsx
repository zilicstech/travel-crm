'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plane, Menu, X, ArrowRight } from 'lucide-react';

export default function PublicHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Features', href: '/#modules' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-xs">
            <Plane className="h-4.5 w-4.5 transform -rotate-12" />
          </div>
          <span className="text-lg font-black tracking-tight text-slate-900">
            Travel<span className="text-blue-600">OS</span>
          </span>
        </Link>

        {/* Clean Desktop Navigation (Text-only, no icons, spacious) */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-semibold transition-colors ${
                  isActive
                    ? 'text-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Text Sign In + Primary CTA */}
        <div className="hidden md:flex items-center gap-5">
          <Link href="/login" className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors">
            Sign In
          </Link>
          <Link href="/pricing">
            <button className="h-9 px-4 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-all flex items-center gap-1.5">
              Inquire Pricing
            </button>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="flex flex-col gap-1 pb-3 border-b border-slate-100">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-2 pt-1">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
              <button className="w-full h-10 text-xs font-bold bg-slate-100 text-slate-800 rounded-lg border border-slate-200">
                Sign In to Workspace (/login)
              </button>
            </Link>
            <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="w-full">
              <button className="w-full h-10 text-xs font-bold bg-blue-600 text-white rounded-lg flex items-center justify-center gap-1.5">
                Inquire Pricing & Demo <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
