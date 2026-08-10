'use client';

import React from 'react';
import Link from 'next/link';
import { Plane, ArrowRight, CheckCircle2, Globe2, Users, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function MarketingHomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      {/* Navigation */}
      <header className="border-b border-slate-100 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Plane className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">TravelOS</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="#features" className="hover:text-blue-600 transition-colors">Features</Link>
            <Link href="#solutions" className="hover:text-blue-600 transition-colors">Solutions</Link>
            <Link href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/agents">
              <Button variant="ghost" className="text-sm font-medium">Agent Login</Button>
            </Link>
            <Link href="/agency">
              <Button className="text-sm font-medium bg-slate-900 text-white hover:bg-slate-800">Agency Login</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-24 md:py-32 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Platform 2.0 Now Live
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 max-w-4xl leading-tight mb-8">
            The intelligent operating system for modern travel.
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mb-12 leading-relaxed">
            Streamline your agency operations, empower your agents, and deliver unforgettable experiences with our all-in-one SAAS CRM platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/agency">
              <Button size="lg" className="w-full sm:w-auto text-base font-semibold bg-blue-600 hover:bg-blue-700 h-14 px-8">
                Start Your Agency <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/platform">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base font-semibold h-14 px-8 border-slate-200">
                Platform Admin
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 bg-slate-50 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">Built for scale. Designed for humans.</h2>
              <p className="text-slate-500">Everything you need to run a world-class travel business.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                  <Globe2 className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Global Inventory</h3>
                <p className="text-slate-500 leading-relaxed">Access worldwide flights, hotels, and experiences with real-time availability and competitive pricing.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-6">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Agent Management</h3>
                <p className="text-slate-500 leading-relaxed">Track performance, manage commissions, and empower your team with intelligent booking tools.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-6">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Real-time Analytics</h3>
                <p className="text-slate-500 leading-relaxed">Make data-driven decisions with comprehensive reports on revenue, leads, and booking trends.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Plane className="h-5 w-5 text-slate-500" />
            <span className="text-lg font-bold text-white tracking-tight">TravelOS</span>
          </div>
          <p className="text-sm">© 2026 TravelOS CRM. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
