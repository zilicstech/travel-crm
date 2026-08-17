'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plane, Building2, ShieldCheck, Lock, Send, CheckCircle2 } from 'lucide-react';

export default function PublicFooter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      {/* Sales Inquiry Strip */}
      <div className="border-b border-slate-800 bg-slate-950 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center lg:text-left">
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center justify-center lg:justify-start gap-2">
              <Building2 className="w-5 h-5 text-blue-400" /> Transform Your Travel Agency Operations
            </h3>
            <p className="text-xs text-slate-400">Get a personalized demo and custom CRM pricing quote for your team.</p>
          </div>
          {subscribed ? (
            <div className="bg-emerald-950 border border-emerald-500/30 text-emerald-400 px-6 py-3 rounded-xl flex items-center gap-2 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" /> Thank you! Our sales team will reach out shortly.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex items-center gap-2 w-full max-w-md">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter work email for pricing quote"
                required
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-md shadow-blue-600/30"
              >
                Inquire Pricing <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 text-left">
        {/* Brand Col */}
        <div className="col-span-2 space-y-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white">
              <Plane className="h-5 w-5 transform -rotate-12" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">
              Travel<span className="text-blue-500">OS</span>
            </span>
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            The leading enterprise SaaS CRM built specifically for travel agencies, tour operators, and destination management companies (DMCs).
          </p>
          <div className="flex items-center gap-3 pt-2 text-xs">
            <span className="flex items-center gap-1.5 text-slate-300 font-semibold bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> ISO 27001 Certified
            </span>
            <span className="flex items-center gap-1.5 text-slate-300 font-semibold bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg">
              <Lock className="w-4 h-4 text-blue-400" /> 256-Bit SSL Secured
            </span>
          </div>
        </div>

        {/* CRM Modules */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">CRM Modules</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/#modules" className="hover:text-blue-400 transition-colors">Client & Traveller Vault</Link></li>
            <li><Link href="/#modules" className="hover:text-blue-400 transition-colors">Proposal & Margin Engine</Link></li>
            <li><Link href="/#modules" className="hover:text-blue-400 transition-colors">Per-Traveller Visa Tracker</Link></li>
            <li><Link href="/#modules" className="hover:text-blue-400 transition-colors">Agency Revenue Analytics</Link></li>
            <li><Link href="/#modules" className="hover:text-blue-400 transition-colors">GST Invoicing & Billing</Link></li>
          </ul>
        </div>

        {/* Workspaces & Single Login */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Role Workspaces</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/login" className="text-blue-400 font-bold hover:underline">Single Login Portal (/login)</Link></li>
            <li><Link href="/agency/dashboard" className="hover:text-white transition-colors">Agency Owner Portal</Link></li>
            <li><Link href="/agents/dashboard" className="hover:text-white transition-colors">Travel Agent Workspace</Link></li>
            <li><Link href="/platform/dashboard" className="hover:text-white transition-colors">Platform Super Admin</Link></li>
          </ul>
        </div>

        {/* Enterprise Company */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Company</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing & Plans</Link></li>
            <li><Link href="/about" className="hover:text-white transition-colors">About TravelOS</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Sales</Link></li>
            <li><Link href="/pricing" className="hover:text-white transition-colors">Schedule Agency Demo</Link></li>
          </ul>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-slate-800 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <span>© 2026 TravelOS Technologies Inc. All rights reserved.</span>
            <span>•</span>
            <Link href="/about" className="hover:text-slate-400">Privacy Policy</Link>
            <span>•</span>
            <Link href="/about" className="hover:text-slate-400">Terms of Service</Link>
          </div>
          <span className="text-[11px]">Enterprise Travel Agency CRM Platform</span>
        </div>
      </div>
    </footer>
  );
}
