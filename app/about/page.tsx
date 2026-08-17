'use client';

import React from 'react';
import Link from 'next/link';
import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { ShieldCheck, Globe, Users, Building2, Lock, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export default function PublicAboutPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between">
      <PublicHeader />

      <main className="flex-1 text-left">
        {/* Header Banner */}
        <div className="bg-slate-50 border-b border-slate-200 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
            <span className="px-3.5 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold inline-flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" /> About TravelOS Technologies
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Empowering Travel Agencies & Tour Operators Worldwide.
            </h1>
            <p className="text-base text-slate-600 max-w-3xl leading-relaxed">
              TravelOS is the specialized enterprise CRM engineered specifically for travel companies, tour operators, and destination management companies (DMCs).
            </p>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-lg grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-black text-blue-600">500+</p>
              <p className="text-xs text-slate-500 font-semibold mt-1">Active Agencies</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-emerald-600">₹50Cr+</p>
              <p className="text-xs text-slate-500 font-semibold mt-1">Bookings Managed</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-indigo-600">100k+</p>
              <p className="text-xs text-slate-500 font-semibold mt-1">Active Travellers</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-purple-600">99.99%</p>
              <p className="text-xs text-slate-500 font-semibold mt-1">SLA Uptime</p>
            </div>
          </div>
        </div>

        {/* Key Values */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Tailored B2B Travel Workflows</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Record family/group members within a single client, track 6-month passport expiry alerts, and handle visa checklists seamlessly.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Bank-Grade Compliance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Encrypted document vaults for passports and visa forms with ISO 27001 and SOC2 compliant data storage.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Role-Based Workspaces</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Agency Owners oversee profit margins at /agency, Travel Agents manage leads at /agents, and Admins control tenants at /platform.
              </p>
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-3xl p-10 text-center space-y-6 shadow-xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold">Transform your agency's operations today</h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
              Schedule a personalized demo or inquire about SaaS pricing tailored for your agency team.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/pricing">
                <button className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2">
                  Inquire CRM Pricing <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
